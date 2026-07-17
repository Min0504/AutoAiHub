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
  ]) {
    assert.equal(existsSync(path.join(root, rel)), true, `missing ${rel}`);
  }
});

test("backend/AI stack removed", () => {
  assert.equal(existsSync(path.join(root, "server.ts")), false);
  assert.equal(existsSync(path.join(root, "src/server")), false);
  assert.equal(existsSync(path.join(root, "src/components/AIChatBot.tsx")), false);
  assert.equal(existsSync(path.join(root, "src/components/ConsultingSection.tsx")), false);
  assert.equal(existsSync(path.join(root, "src/components/CalculatorSection.tsx")), false);
  assert.equal(existsSync(path.join(root, "supabase")), false);

  const pkg = read("package.json");
  assert.doesNotMatch(pkg, /groq-sdk|express|@supabase\/supabase-js/);
  assert.match(pkg, /"dev": "vite"/);
});

test("nav only has directory + compare", () => {
  const header = read("src/components/Header.tsx");
  assert.match(header, /directory/);
  assert.match(header, /compare/);
  assert.doesNotMatch(header, /ai-builder|ai-chat|calculators|consulting/);
});

test("affiliate links present", () => {
  const links = read("src/config/affiliateLinks.ts");
  assert.match(links, /make\.com/);
  const banner = read("src/components/AffiliateBanner.tsx");
  assert.match(banner, /sponsored/);
});
