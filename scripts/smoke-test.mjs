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
