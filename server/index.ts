import express from "express";
import fs from "fs";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";
import { SERVICE_PAGE_OVERRIDES } from "../shared/seo";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CANONICAL_HOST = "divedreammauritius.com";

async function startServer() {
  const app = express();
  const server = createServer(app);

  // Serve static files from dist/public in production
  const staticPath =
    process.env.NODE_ENV === "production"
      ? path.resolve(__dirname, "public")
      : path.resolve(__dirname, "..", "dist", "public");

  // Mirrors vercel.json so self-hosting behaves the same as production.
  app.use((req, res, next) => {
    if (req.hostname === `www.${CANONICAL_HOST}`) {
      return res.redirect(301, `https://${CANONICAL_HOST}${req.originalUrl}`);
    }
    if (req.path === "/dive-sites") return res.redirect(301, "/dive-safaris");
    const locale = req.path.match(/^\/(en|fr)(\/.*)?$/);
    if (locale) return res.redirect(301, locale[2] || "/");
    const service = req.path.match(/^\/services\/([^/]+)$/);
    if (service && SERVICE_PAGE_OVERRIDES[service[1]]) {
      return res.redirect(301, SERVICE_PAGE_OVERRIDES[service[1]]);
    }
    next();
  });

  // `redirect: false` stops /courses being redirected to /courses/ just
  // because a courses/ directory (holding the per-course pages) exists.
  app.use(express.static(staticPath, { redirect: false }));

  // The SEO build step writes one prerendered HTML file per route
  // (e.g. /courses/open-water -> courses/open-water.html).
  app.get("*", (req, res) => {
    const routeFile = path.join(staticPath, `${req.path.replace(/\/+$/, "")}.html`);
    if (routeFile.startsWith(staticPath) && fs.existsSync(routeFile)) {
      return res.sendFile(routeFile);
    }
    // Services created in Strapi after the last build.
    if (/^\/services\/[^/]+$/.test(req.path)) {
      return res.sendFile(path.join(staticPath, "spa-fallback.html"));
    }
    res.status(404).sendFile(path.join(staticPath, "404.html"));
  });

  const port = process.env.PORT || 3000;

  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}

startServer().catch(console.error);
