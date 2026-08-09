# AutoHub AI — 작업 프롬프트 (정적 사이트)

> 형태: **비교 + 제휴** 정적 Vite SPA. 서버/AI/DB/리드 **금지**.

## 제품

- URL: https://autohub-ai.vercel.app
- 브랜드: AutoHub AI
- 남김: 툴 디렉토리, 1:1 비교, 제휴 링크(Make·Dify 등), FAQ, 블로그, SEO
- 제거됨(되살리지 말 것): Groq, Express, Supabase, AI 채팅/시나리오/견적, 계산기, 리드 폼

## 기술

- React 19 + TypeScript + Vite
- Vercel 정적 호스팅 (`vite build`)
- GA4는 쿠키 동의 후에만 로드

## 자주 고치는 파일

- 제휴: `src/config/affiliateLinks.ts`, `AffiliateBanner.tsx`
- 툴 데이터: `src/data/tools.ts` (+ `public/sitemap.xml`)
- 도메인: `index.html`, `public/sitemap.xml`, `public/robots.txt`, `useSeoMeta.ts`

## 검증

```bash
npm run lint && npm run test && npm run build
```

설계: `docs/superpowers/specs/2026-07-17-static-affiliate-redesign.md`
