# CLAUDE.md

AutoHub AI 작업 규칙. 제품·구조는 [README.md](README.md), 설계는 [docs/architecture.md](docs/architecture.md).

## Rules

- 서버리스 API·Groq·Supabase·리드 수집 되살리지 않음
- 클라이언트에 API 키 넣지 않음
- 도메인 변경 시 `index.html`, `public/sitemap.xml`, `public/robots.txt`, `useSeoMeta.ts` 일괄 수정

## Commands

```bash
npm run dev
npm run lint
npm run test
npm run build
```
