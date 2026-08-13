# AutoHub AI — 개발 노트

> 마지막 업데이트: 2026-08-13 · 백엔드 전환

## 현재 상태

| 항목 | 상태 |
|------|------|
| 형태 | 정적 Vite SPA + **학습용 백엔드 API** (`server/`) |
| 프론트 프로덕션 | https://autohub-ai.vercel.app (API 없이 동작) |
| 백엔드 | Express 5 + TS strict + SQLite — 로컬/Docker (실배포 미정) |
| 핵심 | 툴 디렉토리 + 1:1 비교 + 제휴 링크 + REST API(인증/리뷰/북마크/클릭 통계) |

설계: [docs/backend/architecture.md](docs/backend/architecture.md)

## 로컬

```bash
npm install && npm run dev          # 프론트 :5173
cd server && npm install && npm run dev   # 백엔드 :4000 (/api/docs)
npm run verify                      # 전체 검증
```

## 배포

- 프론트: Vercel이 `vite build` 정적 산출물 배포. 서버리스 함수 없음.
- 백엔드: `docker compose up --build api` (JWT_SECRET 필요). 호스팅은 PM 결정.

## 제휴

- Make: `?pc=autohubai` (`src/config/affiliateLinks.ts`)
- Dify: 배너·링크 연동
- 코드 추가 시 `affiliateLinks.ts` + `AffiliateBanner.tsx`만 수정
- 툴 데이터 수정 시 `cd server && npm run sync:tools`로 시드 동기화

## SEO

- `public/sitemap.xml`, `robots.txt`, `og-image.png`
- `useSeoMeta` — 툴/`compare` 탭 메타
- 블로그: `public/blog/*`
