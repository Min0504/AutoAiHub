import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { test } from "node:test";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = (rel) => readFileSync(path.join(root, rel), "utf8");

test("static core files exist", () => {
  for (const rel of [
    "public/sitemap.xml",
    "public/og-image.png",
    "public/robots.txt",
    "src/App.tsx",
    "src/config/affiliateLinks.ts",
    "src/components/CookieConsent.tsx",
  ]) {
    assert.equal(existsSync(path.join(root, rel)), true, `missing ${rel}`);
  }
});

test("backend/AI stack removed", () => {
  assert.equal(existsSync(path.join(root, "server.ts")), false);
  assert.equal(existsSync(path.join(root, "src/server")), false);
  const pkg = read("package.json");
  assert.doesNotMatch(pkg, /groq-sdk|express|@supabase\/supabase-js/);
});

test("nav only has directory + compare", () => {
  const header = read("src/components/Header.tsx");
  assert.match(header, /directory/);
  assert.match(header, /compare/);
  assert.doesNotMatch(header, /ai-builder|ai-chat|calculators|consulting/);
});

test("no ROI calculator claims in marketing surfaces", () => {
  assert.doesNotMatch(read("index.html"), /ROI계산기|SearchAction/);
  assert.doesNotMatch(read("public/blog/index.html"), /ROI 계산기/);
  const blogNav = read("public/blog/make-vs-n8n.html");
  assert.match(blogNav, /툴 비교하기/);
  assert.match(blogNav, /제휴 고지/);
});

test("FAQ JSON-LD has 7 questions and ItemList has 16 tools", () => {
  const html = read("index.html");
  assert.equal((html.match(/"@type":\s*"Question"/g) || []).length, 7);
  assert.equal((html.match(/"@type":\s*"ListItem"/g) || []).length, 16);
});

test("compare has affiliate CTAs", () => {
  const compare = read("src/components/CompareSection.tsx");
  assert.match(compare, /sponsored/);
  assert.match(compare, /trackAffiliateClick/);
  assert.match(compare, /제휴 링크/);
});

test("sitemap tool slugs match tools.ts", () => {
  const toolsSrc = read("src/data/tools.ts");
  const sitemap = read("public/sitemap.xml");
  const slugs = [...toolsSrc.matchAll(/slug:\s*"([^"]+)"/g)].map((m) => m[1]);
  assert.equal(slugs.length, 16, `expected 16 tool slugs, got ${slugs.length}`);
  for (const slug of slugs) {
    assert.match(
      sitemap,
      new RegExp(`\\?tool=${slug.replace(/[.*+?^${}()|[\\]\\\\]/g, "\\$&")}<`),
      `sitemap missing ?tool=${slug}`,
    );
  }
  assert.doesNotMatch(sitemap, /\?tool=relay</);
  assert.match(sitemap, /\?tab=compare</);
});

test("every tool id has AFFILIATE_LINKS entry", () => {
  const toolsSrc = read("src/data/tools.ts");
  const linksSrc = read("src/config/affiliateLinks.ts");
  const ids = [...toolsSrc.matchAll(/^\s+id:\s*"([^"]+)"/gm)]
    .map((m) => m[1])
    .filter((id) => !["all", "Workflow Automation", "No-Code Automation", "AI Agents", "Developer Automation"].includes(id));
  assert.equal(ids.length, 16);
  for (const id of ids) {
    assert.match(
      linksSrc,
      new RegExp(`(?:^|\\n)\\s*"?${id.replace(/-/g, "\\-")}"?\\s*:`),
      `AFFILIATE_LINKS missing ${id}`,
    );
  }
});

test("compare tab URL wiring exists", () => {
  assert.match(read("src/App.tsx"), /tabFromUrl === "compare"/);
  assert.match(read("src/hooks/useSeoMeta.ts"), /tab=compare/);
});
