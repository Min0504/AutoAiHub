# AGENTS.md — AutoHub AI

## Product

- Static compare + affiliate site (Vite SPA)
- Live: https://autohub-ai.vercel.app
- **No** Express / Groq / Supabase / lead APIs — do not reintroduce

## Scope

Do: UI, tool data, affiliate links, SEO static files, docs  
Don't: server/AI/DB SDKs without PM approval

## Verify

```bash
npm run lint && npm run test && npm run build
```

## Touch points

- Affiliate: `src/config/affiliateLinks.ts`, `AffiliateBanner.tsx`
- Tools: `src/data/tools.ts` + `public/sitemap.xml`
- Domain: `index.html`, `public/sitemap.xml`, `public/robots.txt`, `useSeoMeta.ts`

## Report

```text
한것: …
검증: lint ✅ test ✅ build ✅
남은것: …
```
