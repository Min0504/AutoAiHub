# CLAUDE.md

AutoHub AI 코드베이스 작업 규칙. 제품 개요는 [README.md](README.md), 백엔드 설계는 [docs/backend/architecture.md](docs/backend/architecture.md) 참고.

## 제품 요약

한국어 업무 자동화 도구 **비교 + 제휴** 사이트이자 **백엔드 학습 프로젝트**.

- `src/` — React 19 + Vite SPA (정적 배포: https://autohub-ai.vercel.app)
- `server/` — Express 5 + TS strict + SQLite REST API (인증/리뷰/북마크/클릭 통계)

2026-08 방향 전환: 순수 정적 사이트 → 백엔드 역량 학습을 위한 풀스택 구조. (구 규칙 "서버 재도입 금지"는 폐기됨)

## 절대 규칙

- **프론트 번들에 시크릿 금지.** 클라이언트 환경변수는 `VITE_API_URL`뿐이며 비밀값이 아니다.
- **정적 프론트는 API 없이도 완전 동작해야 한다.** `VITE_API_URL` 미설정 = 순수 정적 (프로덕션 기본). API 연동 코드는 반드시 no-op 폴백을 가진다.
- **유료 외부 API/SaaS SDK(Groq, Supabase 등) 재도입 금지** — PM 승인 필요.
- 서버 코드는 `server/`에만. 루트 package.json에 서버 의존성을 넣지 않는다 (스모크 테스트가 강제).
- 적용된 DB 마이그레이션은 수정 금지 — 새 마이그레이션 추가로만 스키마 변경.
- 인증 보안 로직(refresh 회전·재사용 탐지, scrypt, 레이트 리밋)을 임의로 완화하지 않는다.
- 도메인 변경 시 `index.html`, `public/sitemap.xml`, `public/robots.txt`, `src/hooks/useSeoMeta.ts`의 BASE_URL 일괄 수정.

## 작업 흐름

```bash
# 프론트
npm run dev            # Vite :5173
# 백엔드
npm run dev:api        # Express :4000 (Swagger: /api/docs)

# 검증 (커밋 전 필수)
npm run verify         # 프론트+백엔드 lint/test/build 전체
```

- 툴 데이터 수정: `src/data/tools.ts` 변경 → `cd server && npm run sync:tools`로 시드 재생성 → 둘 다 커밋.
- API 엔드포인트 추가/변경 시 `server/src/openapi/openapi.ts`와 테스트를 함께 갱신.

## 문서

- 백엔드 설계: [docs/backend/architecture.md](docs/backend/architecture.md)
- 학습 로드맵: [docs/backend/learning-roadmap.md](docs/backend/learning-roadmap.md)
- 진행: [docs/progress.md](docs/progress.md) · 이슈: [docs/issues.md](docs/issues.md) · 인수인계: [docs/handoff.md](docs/handoff.md)
