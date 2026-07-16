import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { test } from "node:test";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function read(rel) {
  return readFileSync(path.join(root, rel), "utf8");
}

test("critical files exist", () => {
  for (const rel of [
    "public/sitemap.xml",
    "public/og-image.png",
    "public/robots.txt",
    ".env.example",
    "src/server/aiRoutes.ts",
    "src/server/leadStore.ts",
    "src/server/rateLimit.ts",
  ]) {
    assert.equal(existsSync(path.join(root, rel)), true, `missing ${rel}`);
  }
});

test("env example uses Groq (not Gemini)", () => {
  const env = read(".env.example");
  assert.match(env, /GROQ_API_KEY/);
  assert.doesNotMatch(env, /GEMINI_API_KEY/);
});

test("TAB_META keys align with Header tab ids", () => {
  const seo = read("src/hooks/useSeoMeta.ts");
  const header = read("src/components/Header.tsx");
  for (const id of ["calculators", "ai-builder", "ai-chat", "compare", "consulting"]) {
    assert.match(seo, new RegExp(`["']?${id}["']?\\s*:`), `TAB_META missing ${id}`);
    assert.match(header, new RegExp(`id:\\s*["']${id}["']`), `Header missing ${id}`);
  }
  assert.doesNotMatch(seo, /calculator\s*:/);
  assert.doesNotMatch(seo, /ai-scenario\s*:/);
  assert.doesNotMatch(seo, /\bchat\s*:/);
});

test("UI engine branding uses Groq", () => {
  for (const rel of [
    "src/components/AIChatBot.tsx",
    "src/components/AIScenarioBuilder.tsx",
    "src/components/ConsultingSection.tsx",
  ]) {
    const src = read(rel);
    assert.doesNotMatch(src, /GEMINI POWERED|GEMINI AUTOMATION|Gemini 인지|Gemini AI가|Gemini 브레인/);
    assert.match(src, /Groq|GROQ/);
  }
});

test("sitemap is static with blog URLs", () => {
  const sitemap = read("public/sitemap.xml");
  const locs = sitemap.match(/<loc>/g) ?? [];
  assert.ok(locs.length >= 20, `expected >=20 locs, got ${locs.length}`);
  assert.match(sitemap, /\/blog\//);
});

test("dead Gemini stub and Express sitemap route are removed", () => {
  assert.equal(existsSync(path.join(root, "src/server/geminiRoutes.ts")), false);
  assert.equal(existsSync(path.join(root, "src/server/sitemapRoute.ts")), false);
  const server = read("server.ts");
  assert.doesNotMatch(server, /registerSitemapRoute|geminiRoutes/);
  assert.match(server, /createRateLimiter/);
});

test("FAQ JSON-LD includes 7 questions", () => {
  const html = read("index.html");
  assert.doesNotMatch(html, /SearchAction/);
  const questions = html.match(/"@type":\s*"Question"/g) ?? [];
  assert.equal(questions.length, 7);
});
