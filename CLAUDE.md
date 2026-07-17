# CLAUDE.md

AutoHub AI 코드베이스 작업 규칙. 제품 개요는 [README.md](README.md), 설계는 [docs/superpowers/specs/2026-07-17-static-affiliate-redesign.md](docs/superpowers/specs/2026-07-17-static-affiliate-redesign.md) 참고.

## 제품 요약

한국어 업무 자동화 도구 **비교 + 제휴** 정적 사이트.  
React 19 + Vite SPA. 서버/AI/DB 없음. 프로덕션: https://autohub-ai.vercel.app

## 절대 규칙

- **서버리스 API·Groq·Supabase·리드 수집을 되살리지 않는다.** (정적 유지)
- API 키를 클라이언트에 넣지 않는다. (현재 런타임 키 불필요)
- 사이트맵(`public/sitemap.xml`)·`robots.txt`는 정적 CDN 서빙.
- 도메인 변경 시 `index.html`, `public/sitemap.xml`, `public/robots.txt`, `src/hooks/useSeoMeta.ts`의 BASE_URL을 일괄 수정한다.

## 작업 흐름

```bash
npm run dev   # Vite :5173
npm run lint
npm run test
npm run build
```

## 문서

- 진행: [docs/progress.md](docs/progress.md)
- 이슈: [docs/issues.md](docs/issues.md)
- 인수인계: [docs/handoff.md](docs/handoff.md)
