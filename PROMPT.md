# AutoAiHub — 작업 프롬프트

> 형태: **비교 + 제휴** 정적 프론트(Vite SPA) + **학습용 백엔드 API**(`server/`).

## 제품

- 프론트 URL: https://autohub-ai.vercel.app — `VITE_API_URL` 없이 100% 정적 동작 (유지할 것)
- 백엔드: Express 5 + TS strict + SQLite — 인증(JWT+refresh 회전), 툴 CRUD, 리뷰, 북마크, 클릭 통계
- 금지: 유료 외부 API/SaaS SDK(Groq·Supabase 등) 재도입, 프론트 번들에 시크릿 포함

## 기술

- 프론트: React 19 + TypeScript(strict) + Vite, Vercel 정적 호스팅, GA4는 쿠키 동의 후 로드
- 백엔드: `server/` 독립 패키지. router→service→repository 계층, zod 검증, pino 로깅
- DB: `node:sqlite` — 스키마 변경은 `server/src/db/migrations.ts`에 **새 마이그레이션 추가**로만

## 자주 고치는 파일

- 제휴: `src/config/affiliateLinks.ts`, `AffiliateBanner.tsx`
- 툴 데이터: `src/data/tools.ts` (+ `public/sitemap.xml`, `cd server && npm run sync:tools`)
- API: `server/src/modules/*` + `server/src/openapi/openapi.ts` + `server/tests/*` 세트로 수정
- 도메인: `index.html`, `public/sitemap.xml`, `public/robots.txt`, `useSeoMeta.ts`

## 검증

```bash
npm run verify   # 프론트+백엔드 lint/test/build 전체
```

설계: `docs/backend/architecture.md` · 학습: `docs/backend/learning-roadmap.md`
