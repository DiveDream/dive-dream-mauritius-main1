import { useEffect } from 'react';
import { useLocation } from 'wouter';
import { DEFAULT_OG_IMAGE, NOT_FOUND_SEO, canonicalUrl, findRouteSeo, type RouteSeo as RouteSeoData } from '@shared/seo';

// Find-or-create a <head> element so tags baked in by the build
// (vite-plugin-seo.ts) are updated in place rather than duplicated.
function upsert<T extends HTMLElement>(selector: string, create: () => T): T {
  const existing = document.head.querySelector<T>(selector);
  if (existing) return existing;
  const el = create();
  document.head.appendChild(el);
  return el;
}

function setMeta(attr: 'name' | 'property', key: string, content: string | null) {
  const selector = `meta[${attr}="${key}"]`;
  if (content === null) {
    document.head.querySelector(selector)?.remove();
    return;
  }
  upsert(selector, () => {
    const el = document.createElement('meta');
    el.setAttribute(attr, key);
    return el;
  }).setAttribute('content', content);
}

export function applySeo(route: RouteSeoData) {
  const url = route.noindex ? null : canonicalUrl(route.path);

  document.title = route.title;
  setMeta('name', 'description', route.description);
  setMeta('name', 'robots', route.noindex ? 'noindex, follow' : null);
  setMeta('property', 'og:title', route.title);
  setMeta('property', 'og:description', route.description);
  setMeta('property', 'og:url', url);
  const image = route.image ?? DEFAULT_OG_IMAGE;
  setMeta('property', 'og:image', image);
  setMeta('name', 'twitter:card', 'summary_large_image');
  setMeta('name', 'twitter:title', route.title);
  setMeta('name', 'twitter:description', route.description);
  setMeta('name', 'twitter:image', image);

  if (url) {
    upsert('link[rel="canonical"]', () => {
      const el = document.createElement('link');
      el.rel = 'canonical';
      return el;
    }).href = url;
  } else {
    document.head.querySelector('link[rel="canonical"]')?.remove();
  }
}

/** For pages whose tags depend on loaded data (e.g. /services/:id). */
export function usePageSeo(route: RouteSeoData | undefined) {
  useEffect(() => {
    if (route) applySeo(route);
  }, [route?.path, route?.title, route?.description, route?.noindex, route?.image]);
}

// Keeps <head> in sync with the current route on client-side navigation.
// /services/:id is skipped here because ServiceDetail.tsx sets its tags
// once the service has loaded.
export default function RouteSeo() {
  const [location] = useLocation();

  useEffect(() => {
    if (/^\/services\/[^/]+$/.test(location)) return;
    applySeo(findRouteSeo(location) ?? { ...NOT_FOUND_SEO, path: location });
  }, [location]);

  return null;
}
