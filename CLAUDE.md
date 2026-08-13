# CLAUDE.md

AutoHub AI 작업 규칙. 제품·구조는 [README.md](README.md), 프론트 설계는 [docs/architecture.md](docs/architecture.md), 백엔드 설계는 [docs/backend/architecture.md](docs/backend/architecture.md).

## Rules

- 프론트는 **정적 우선**: `VITE_API_URL` 미설정 시 서버 없이 100% 동작해야 한다 (프로덕션 상태)
- 클라이언트 번들에 시크릿·API 키 금지
- 유료 외부 API·SaaS SDK(Groq·Supabase 등) 재도입 금지
- DB 스키마 변경은 `server/src/db/migrations.ts`에 **새 마이그레이션 추가**로만 — 적용된 마이그레이션 수정 금지
- API 변경은 router + service + repository + tests + `openapi.ts` 세트로
- `src/data/tools.ts` 수정 시 `cd server && npm run sync:tools`로 시드 동기화
- 도메인 변경 시 `index.html`, `public/sitemap.xml`, `public/robots.txt`, `useSeoMeta.ts` 일괄 수정

## Commands

```bash
npm run dev / lint / test / build           # 프론트
npm run dev:api / lint:api / test:api / build:api   # 백엔드 (server/)
npm run verify                              # 전체 검증
```
