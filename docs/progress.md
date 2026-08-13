# 진행상황

마지막 갱신: 2026-08-13

## 한 줄 요약

**백엔드 전환 완료** — `server/`에 Express 5 + TS strict + SQLite REST API 구축 (인증·툴·리뷰·북마크·클릭 통계). 프론트는 정적 유지 + 선택적 API 연동.

## 완료 (2026-08-13)

- `server/` 백엔드 신설: 계층형 구조(router→service→repository), 마이그레이션 러너, 시드 파이프라인
- 인증: scrypt + JWT access(15분) + refresh 회전·재사용 탐지
- 도메인 API: 툴 CRUD(관리자), 리뷰(1인 1리뷰·소유권), 북마크(멱등), 클릭 이벤트·통계(관리자)
- 운영: pino 로깅+요청 ID, 레이트 리밋, helmet/CORS, 중앙 에러 핸들러, graceful shutdown, 헬스체크
- OpenAPI 3.1 + Swagger UI (`/api/docs`)
- 테스트: vitest+supertest 통합 75건 (in-memory SQLite)
- Docker(멀티 스테이지·non-root) + compose + GitHub Actions CI
- 프론트: TS strict 활성화, 선택적 API 클라이언트(클릭 트래킹), 스모크 테스트 갱신
- 문서: README·architecture.md·learning-roadmap.md·규칙 문서 전면 개편

## 이전 이력

- 2026-07-17: 정적 재설계 머지(PR #4), Vercel 프로덕션 재배포 이슈는 해결됨(현 프로덕션 = 정적 사이트)

## 다음 후보

- [docs/backend/learning-roadmap.md](backend/learning-roadmap.md)의 연습과제 (커서 페이지네이션, 쿠키 인증, Postgres 전환, 배포)
- 백엔드 실배포(Fly.io/Railway) 후 프로덕션 프론트에 `VITE_API_URL` 연결 여부는 PM 결정
