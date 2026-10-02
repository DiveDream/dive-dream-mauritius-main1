import fs from 'node:fs/promises';
import { existsSync } from 'node:fs';
import http from 'node:http';
import type { AddressInfo } from 'node:net';
import os from 'node:os';
import path from 'node:path';
import type { Plugin } from 'vite';
import {
  DEFAULT_OG_IMAGE,
  NOT_FOUND_SEO,
  ROUTE_SEO,
  SITE_NAME,
  SITE_URL,
  canonicalUrl,
  localBusinessJsonLd,
  SERVICE_PAGE_OVERRIDES,
  serviceDetailSeo,
  socialImage,
  type RouteSeo,
} from './shared/seo';

// The site is a client-rendered SPA, so without this every URL served the
// same index.html: one <title>, no description, no canonical, and crawlers
// that don't run JS (social previews, Bing, etc.) saw identical pages.
//
// At build time this writes a copy of index.html per route (e.g.
// dist/public/courses/open-water.html) with that route's <head> tags baked
// in, plus 404.html, sitemap.xml and robots.txt. It then prerenders each
// route in headless Chromium and bakes the rendered #root markup (H1, body
// text, nav/footer anchors, Strapi content) into the same file, so the first
// HTML response has real content. The React app replaces it on load.
// RouteSeo.tsx keeps the head tags in sync on client-side navigation.

const START = '<!-- seo:start -->';
const END = '<!-- seo:end -->';

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function headTags(route: RouteSeo, options: { canonical: boolean; jsonLd?: Record<string, unknown> }): string {
  const url = canonicalUrl(route.path);
  const image = route.image ?? DEFAULT_OG_IMAGE;
  const tags = [
    `<title>${escapeHtml(route.title)}</title>`,
    `<meta name="description" content="${escapeHtml(route.description)}" />`,
    route.noindex ? '<meta name="robots" content="noindex, follow" />' : '',
    options.canonical ? `<link rel="canonical" href="${url}" />` : '',
    '<meta property="og:type" content="website" />',
    `<meta property="og:site_name" content="${SITE_NAME}" />`,
    `<meta property="og:title" content="${escapeHtml(route.title)}" />`,
    `<meta property="og:description" content="${escapeHtml(route.description)}" />`,
    options.canonical ? `<meta property="og:url" content="${url}" />` : '',
    `<meta property="og:image" content="${image}" />`,
    '<meta name="twitter:card" content="summary_large_image" />',
    `<meta name="twitter:title" content="${escapeHtml(route.title)}" />`,
    `<meta name="twitter:description" content="${escapeHtml(route.description)}" />`,
    `<meta name="twitter:image" content="${image}" />`,
    options.jsonLd
      ? `<script type="application/ld+json">${JSON.stringify(options.jsonLd).replace(/</g, '\\u003c')}</script>`
      : '',
  ];
  return [START, ...tags.filter(Boolean), END].join('\n    ');
}

function withHead(html: string, tags: string): string {
  const start = html.indexOf(START);
  const end = html.indexOf(END);
  if (start === -1 || end === -1) {
    throw new Error(`[seo] index.html is missing the ${START} / ${END} markers`);
  }
  return html.slice(0, start) + tags + html.slice(end + END.length);
}

interface StrapiService {
  slug?: string | null;
  title?: string | null;
  description?: unknown;
  image?: { url?: string | null } | null;
}

function plainText(value: unknown): string {
  if (typeof value === 'string') return value;
  if (Array.isArray(value)) return value.map(plainText).join(' ');
  if (value && typeof value === 'object') {
    const node = value as { text?: unknown; children?: unknown };
    if (typeof node.text === 'string') return node.text;
    return plainText(node.children);
  }
  return '';
}

// Service detail pages come from Strapi. If the CMS is unreachable at build
// time those pages are still served (via the /services/:slug rewrite in
// vercel.json) and get their tags at runtime; they just aren't prerendered
// or listed in the sitemap for that build.
async function fetchServiceRoutes(strapiUrl: string | undefined): Promise<RouteSeo[]> {
  if (!strapiUrl) {
    console.warn('[seo] VITE_STRAPI_URL not set, skipping service detail pages');
    return [];
  }
  try {
    const res = await fetch(`${strapiUrl}/api/services?pagination%5BpageSize%5D=100&populate=image`, {
      signal: AbortSignal.timeout(10_000),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = (await res.json()) as { data?: StrapiService[] };
    return (json.data ?? [])
      .filter((s): s is StrapiService & { slug: string; title: string } => Boolean(s.slug && s.title))
      .filter((s) => !(s.slug in SERVICE_PAGE_OVERRIDES))
      .map((s) => serviceDetailSeo(s.slug, s.title, plainText(s.description), s.image?.url ? socialImage(s.image.url) : undefined));
  } catch (err) {
    console.warn('[seo] could not fetch services from Strapi, skipping service detail pages', err);
    return [];
  }
}


const CONTENT_TYPES: Record<string, string> = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.webmanifest': 'application/manifest+json',
};

// Serves the built assets and the untouched app shell for every navigation,
// so the browser boots the real client app for any route.
function startStaticServer(outDir: string, shell: string): Promise<http.Server> {
  const server = http.createServer(async (req, res) => {
    const pathname = decodeURIComponent((req.url ?? '/').split('?')[0]);
    const file = path.join(outDir, pathname);
    try {
      if (pathname !== '/' && file.startsWith(outDir) && (await fs.stat(file)).isFile() && !pathname.endsWith('.html')) {
        res.writeHead(200, { 'Content-Type': CONTENT_TYPES[path.extname(file)] ?? 'application/octet-stream' });
        res.end(await fs.readFile(file));
        return;
      }
    } catch {
      // fall through to the app shell
    }
    res.writeHead(200, { 'Content-Type': CONTENT_TYPES['.html'] });
    res.end(shell);
  });
  return new Promise((resolve) => server.listen(0, '127.0.0.1', () => resolve(server)));
}

async function findChromium(): Promise<{ executablePath: string; args: string[]; headless: boolean | 'shell' }> {
  if (process.env.CHROME_PATH) return { executablePath: process.env.CHROME_PATH, args: [], headless: true };
  if (!process.env.VERCEL) {
    const cache = path.join(os.homedir(), '.cache', 'ms-playwright');
    const entries = existsSync(cache) ? await fs.readdir(cache) : [];
    for (const dir of entries.filter((d) => d.startsWith('chromium_headless_shell'))) {
      const exe = path.join(cache, dir, 'chrome-linux', 'headless_shell');
      if (existsSync(exe)) return { executablePath: exe, args: ['--no-sandbox'], headless: 'shell' };
    }
  }
  const { default: chromium } = await import('@sparticuz/chromium');
  return { executablePath: await chromium.executablePath(), args: chromium.args, headless: 'shell' };
}

// Renders each route in headless Chromium and returns its #root markup.
// Routes that fail (CMS down, timeout) are skipped and keep the head-only
// shell, so a flaky CMS can never fail the deploy.
async function renderRoutes(outDir: string, shell: string, routes: RouteSeo[]): Promise<Map<string, string>> {
  const rendered = new Map<string, string>();
  const server = await startStaticServer(outDir, shell);
  const origin = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
  let browser: import('puppeteer-core').Browser | undefined;
  try {
    const { default: puppeteer } = await import('puppeteer-core');
    const chrome = await findChromium();
    browser = await puppeteer.launch({
      executablePath: chrome.executablePath,
      headless: chrome.headless,
      // Strapi only allows the production origin; the prerender runs on localhost.
      args: [...chrome.args, '--disable-web-security'],
    });
    const queue = [...routes];
    const worker = async () => {
      const page = await browser!.newPage();
      await page.setViewport({ width: 1440, height: 900 });
      for (let route = queue.shift(); route; route = queue.shift()) {
        try {
          await page.goto(`${origin}${route.path}`, { waitUntil: 'networkidle2', timeout: 45_000 });
          await page.waitForSelector('#root h1', { timeout: 20_000 });
          // Nav and footer links come from Strapi website-settings and can
          // arrive after the page's own content; a snapshot without them
          // would have no internal links.
          await page.waitForFunction(() => document.querySelectorAll('#root nav a[href^="/"]').length >= 3, { timeout: 20_000 });
          const html = await page.$eval('#root', (el) => el.innerHTML);
          rendered.set(route.path, html);
        } catch (err) {
          console.warn(`[seo] prerender failed for ${route.path}, keeping empty shell:`, (err as Error).message);
        }
      }
      await page.close();
    };
    await Promise.all(Array.from({ length: 3 }, worker));
  } catch (err) {
    console.warn('[seo] prerender unavailable, shipping head-only pages:', (err as Error).message);
  } finally {
    await browser?.close();
    server.close();
  }
  return rendered;
}

function withBody(html: string, body: string | undefined): string {
  return body ? html.replace('<div id="root"></div>', () => `<div id="root">${body}</div>`) : html;
}

function sitemapXml(routes: RouteSeo[], lastmod: string): string {
  const urls = routes
    .filter((route) => !route.noindex)
    .map(
      (route) =>
        `  <url>\n    <loc>${canonicalUrl(route.path)}</loc>\n    <lastmod>${lastmod}</lastmod>\n` +
        (route.priority !== undefined ? `    <priority>${route.priority.toFixed(1)}</priority>\n` : '') +
        '  </url>',
    )
    .join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
}

const ROBOTS_TXT = `User-agent: *
Allow: /
Disallow: /__manus__/

Sitemap: ${SITE_URL}/sitemap.xml
`;

export function seoPlugin(options: { strapiUrl?: string }): Plugin {
  let outDir = '';
  const home = ROUTE_SEO.find((route) => route.path === '/');
  if (!home) throw new Error('[seo] ROUTE_SEO has no "/" entry');

  return {
    name: 'dive-dream-seo',
    configResolved(config) {
      outDir = config.build.outDir;
    },
    // Dev and build: the root index.html gets the homepage tags.
    transformIndexHtml(html) {
      return withHead(html, headTags(home, { canonical: true, jsonLd: localBusinessJsonLd() }));
    },
    async closeBundle() {
      // closeBundle also fires for dev-server shutdown in some setups; only
      // act when a build actually produced index.html.
      const indexPath = path.join(outDir, 'index.html');
      let template: string;
      try {
        template = await fs.readFile(indexPath, 'utf8');
      } catch {
        return;
      }

      const serviceRoutes = await fetchServiceRoutes(options.strapiUrl);
      const pages = [...ROUTE_SEO.filter((route) => route.path !== '/'), ...serviceRoutes];

      const indexable = [home, ...pages].filter((route) => !route.noindex);
      const bodies = process.env.SEO_SKIP_PRERENDER ? new Map<string, string>() : await renderRoutes(outDir, template, indexable);

      for (const route of pages) {
        const file = path.join(outDir, `${route.path.slice(1)}.html`);
        await fs.mkdir(path.dirname(file), { recursive: true });
        await fs.writeFile(file, withBody(withHead(template, headTags(route, { canonical: !route.noindex })), bodies.get(route.path)));
      }
      await fs.writeFile(
        indexPath,
        withBody(withHead(template, headTags(home, { canonical: true, jsonLd: localBusinessJsonLd() })), bodies.get('/')),
      );

      // Served by the host for unknown URLs (with a real 404 status) and
      // used as the SPA shell for /services/:slug pages created in Strapi
      // after the last build. No canonical: RouteSeo.tsx sets it at runtime.
      await fs.writeFile(path.join(outDir, '404.html'), withHead(template, headTags(NOT_FOUND_SEO, { canonical: false })));
      await fs.writeFile(
        path.join(outDir, 'spa-fallback.html'),
        withHead(template, headTags({ ...home, title: SITE_NAME, noindex: false }, { canonical: false })),
      );

      const lastmod = new Date().toISOString().slice(0, 10);
      await fs.writeFile(path.join(outDir, 'sitemap.xml'), sitemapXml([home, ...pages], lastmod));
      await fs.writeFile(path.join(outDir, 'robots.txt'), ROBOTS_TXT);

      console.log(`[seo] prerendered ${bodies.size}/${indexable.length} routes, wrote ${pages.length} route pages, 404.html, sitemap.xml, robots.txt`);
    },
  };
}
