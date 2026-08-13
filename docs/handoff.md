# 인수인계

## 제품

정적 **비교 + 제휴** 프론트(SPA) + **학습용 백엔드 API**(`server/`). 프로덕션 프론트는 API 없이 동작한다.

## 상태 (2026-08-13)

- 백엔드 전면 구축 완료 (인증/툴/리뷰/북마크/클릭 통계) — 로컬·CI 검증 통과
- 프론트 TS strict 활성화, 선택적 API 연동(클릭 트래킹) 추가 — 프로덕션 영향 없음
- 백엔드는 **아직 실배포 안 됨** (Docker/compose 준비 완료, 호스팅 선택은 PM 결정)

## 자주 쓰는 명령

```bash
npm run verify       # 전체 검증 (커밋 전 필수)
npm run dev          # 프론트 :5173
npm run dev:api      # 백엔드 :4000 (Swagger /api/docs)
docker compose up --build api   # 컨테이너 실행 (.env에 JWT_SECRET 필요)
```

## 코드 수정 포인트

- 제휴: `src/config/affiliateLinks.ts`, `AffiliateBanner.tsx`
- 툴 데이터: `src/data/tools.ts` → **수정 후 `cd server && npm run sync:tools`** (+ sitemap 수동 반영)
- API 추가/변경: `server/src/modules/*` + `server/src/openapi/openapi.ts` + `server/tests/*` 세트로
- DB 스키마: `server/src/db/migrations.ts`에 **새 마이그레이션 추가** (기존 것 수정 금지)
- 도메인 변경: `index.html`, `public/sitemap.xml`, `public/robots.txt`, `useSeoMeta.ts`

## 백엔드 배포 시 체크리스트 (PM)

1. `JWT_SECRET` 강한 값으로 설정 (`openssl rand -base64 48`)
2. `CORS_ORIGINS=https://autohub-ai.vercel.app` 설정
3. `ADMIN_EMAIL`/`ADMIN_PASSWORD`로 관리자 생성 후 환경변수에서 비밀번호 제거 권장
4. SQLite volume 백업 정책 결정
5. 프론트 Vercel 환경변수에 `VITE_API_URL` 추가 → 재배포
