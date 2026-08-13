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

test("frontend stays static: no server SDKs or secrets in client bundle", () => {
  // 서버 코드는 server/ 워크스페이스에만 존재한다. 프론트 번들은 정적 유지.
  assert.equal(existsSync(path.join(root, "server.ts")), false);
  assert.equal(existsSync(path.join(root, "src/server")), false);
  const pkg = read("package.json");
  assert.doesNotMatch(pkg, /groq-sdk|express|@supabase\/supabase-js|jsonwebtoken/);
  // API 키/시크릿이 클라이언트 코드에 하드코딩되면 안 된다
  const apiClient = read("src/lib/apiClient.ts");
  assert.doesNotMatch(apiClient, /JWT_SECRET|api[_-]?key/i);
  assert.match(apiClient, /VITE_API_URL/);
});

test("backend workspace exists with its own dependency boundary", () => {
  for (const rel of [
    "server/package.json",
    "server/tsconfig.json",
    "server/src/index.ts",
    "server/src/app.ts",
    "server/src/db/migrations.ts",
    "server/src/openapi/openapi.ts",
    "server/Dockerfile",
    ".github/workflows/ci.yml",
  ]) {
    assert.equal(existsSync(path.join(root, rel)), true, `missing ${rel}`);
  }
  const serverPkg = read("server/package.json");
  assert.match(serverPkg, /"express"/);
  assert.match(serverPkg, /"zod"/);
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
