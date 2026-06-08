import type { Express } from "express";

const TOOL_SLUGS = [
  "n8n", "make", "zapier", "lindy", "relay", "gumloop",
  "activepieces", "pipedream", "crewai", "autogen", "dify",
  "coze", "relevance-ai", "retool-workflows", "kestra", "power-automate",
];

function buildSitemap(siteUrl: string): string {
  const today = new Date().toISOString().split("T")[0];

  const urls = [
    { loc: `${siteUrl}/`, priority: "1.0", changefreq: "daily" },
    ...TOOL_SLUGS.map((slug) => ({
      loc: `${siteUrl}/?tool=${slug}`,
      priority: "0.8",
      changefreq: "weekly",
    })),
  ];

  const urlTags = urls
    .map(
      ({ loc, priority, changefreq }) =>
        `  <url>\n    <loc>${loc}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>${changefreq}</changefreq>\n    <priority>${priority}</priority>\n  </url>`,
    )
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urlTags}\n</urlset>`;
}

export function registerSitemapRoute(app: Express): void {
  app.get("/sitemap.xml", (req, res) => {
    const siteUrl =
      process.env.APP_URL ||
      `${req.protocol}://${req.get("host")}`;

    res.setHeader("Content-Type", "application/xml; charset=utf-8");
    res.setHeader("Cache-Control", "public, max-age=86400");
    res.send(buildSitemap(siteUrl));
  });
}
