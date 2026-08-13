# AGENTS.md — AutoHub AI

## Product

- Static compare + affiliate frontend (Vite SPA) — https://autohub-ai.vercel.app
- Learning backend API in `server/` — Express 5 + TypeScript strict + SQLite (auth, tools CRUD, reviews, bookmarks, click stats)
- Frontend must keep working with **no** API: `VITE_API_URL` unset = production state

## Scope

Do: UI, tool data, affiliate links, SEO static files, backend API (`server/`), docs  
Don't: paid external APIs / SaaS SDKs (Groq, Supabase, …), secrets in client bundle, editing already-applied migrations

## Verify

```bash
npm run verify   # frontend + backend lint/test/build
```

## Touch points

- Affiliate: `src/config/affiliateLinks.ts`, `AffiliateBanner.tsx`
- Tools: `src/data/tools.ts` + `public/sitemap.xml` + `cd server && npm run sync:tools`
- API: `server/src/modules/*` + `server/tests/*` + `server/src/openapi/openapi.ts` — change as a set
- Domain: `index.html`, `public/sitemap.xml`, `public/robots.txt`, `useSeoMeta.ts`

## Report

```text
한것: file1, file2
검증: lint ✅ test ✅ build ✅
남은것: 없음
```

## PM approval required

- Deploys, paid service reintroduction, mass deletions, changes outside the repo
