# 백엔드 학습 로드맵 — 역량 ↔ 코드 매핑

백엔드 개발자 채용에서 검증하는 역량을 이 저장소의 실제 코드와 연결한 지도.
"어디서 뭘 배울 수 있는지" → "다음에 뭘 연습해야 하는지" 순서로 읽는다.

## 1. 이 저장소에 구현된 역량

| # | 역량 | 코드 위치 | 면접에서 나오는 질문 |
|---|------|-----------|---------------------|
| 1 | REST API 설계 (리소스 모델링, 상태코드, 멱등성) | `server/src/modules/*/​*.router.ts` | PUT vs POST vs PATCH? 202는 언제? 왜 북마크는 PUT인가? |
| 2 | 계층형 아키텍처 & DI | `server/src/app.ts` (composition root) | 컨트롤러에 비즈니스 로직을 두면 안 되는 이유? DI가 테스트에 주는 이점? |
| 3 | RDB 스키마 설계 (FK, CHECK, UNIQUE, 인덱스) | `server/src/db/migrations.ts` | 정규화 vs JSON 컬럼 기준? 인덱스는 어디에 왜? |
| 4 | 마이그레이션 관리 | `server/src/db/migrate.ts` | 적용된 마이그레이션을 수정하면 안 되는 이유? 롤백 전략? |
| 5 | SQL 인젝션 방어 | `tools.repository.ts` (바인딩, ORDER BY 화이트리스트, LIKE 이스케이프) | 파라미터 바인딩으로 못 막는 인젝션 지점은? (ORDER BY, 테이블명) |
| 6 | 비밀번호 저장 | `server/src/lib/password.ts` | 왜 sha256이 아니라 scrypt/bcrypt? salt의 역할? 타이밍 공격? |
| 7 | JWT 인증 + refresh 회전 | `lib/jwt.ts`, `modules/auth/auth.service.ts` | JWT를 즉시 무효화 못 하는 문제의 해법? 재사용 탐지는 왜? |
| 8 | 인가 (RBAC + 소유권) | `middleware/auth.ts`, `reviews.service.ts` | 401 vs 403? 소유권 검사는 어느 계층에서? |
| 9 | 입력 검증 (시스템 경계) | `config/env.ts`, `modules/*/*.schemas.ts` | 왜 부팅 시 env를 검증? 검증은 어디서 한 번만? |
| 10 | 트랜잭션 | `db/client.ts` `withTransaction`, `auth.service.ts` refresh | 토큰 회전이 왜 원자적이어야 하나? |
| 11 | 중앙 에러 처리 & 에러 계약 | `middleware/error-handler.ts`, `lib/errors.ts` | 스택트레이스를 클라이언트에 주면 안 되는 이유? 에러 코드 설계? |
| 12 | 레이트 리밋 | `middleware/rate-limit.ts` | fixed window vs sliding window vs token bucket? 분산 환경에서는? |
| 13 | 관측성 (구조화 로그, 요청 ID) | `middleware/request-id.ts`, `request-logger.ts` | 장애 시 특정 요청을 어떻게 추적? console.log의 문제? |
| 14 | 통합 테스트 전략 | `server/tests/` (supertest + in-memory DB) | 모킹 최소화의 장단점? 테스트 격리는 어떻게? |
| 15 | API 문서화 (OpenAPI) | `server/src/openapi/openapi.ts` | 스펙 우선 vs 코드 우선? |
| 16 | 컨테이너화 | `server/Dockerfile` (멀티 스테이지, non-root, HEALTHCHECK) | 멀티 스테이지의 이점? 왜 non-root? |
| 17 | CI 파이프라인 | `.github/workflows/ci.yml` | CI에서 무엇을 언제 검증? |
| 18 | 무중단 운영 기본기 | `index.ts` (graceful shutdown), `health.router.ts` | liveness vs readiness? SIGTERM 처리 안 하면? |
| 19 | 12-factor 설정 | `config/env.ts`, `src/lib/apiClient.ts` (프론트) | 설정을 코드에 넣으면 안 되는 이유? |
| 20 | 이벤트 수집·집계 | `modules/clicks/` (append-only + GROUP BY) | 이벤트 테이블을 UPDATE하지 않는 이유? |

## 2. 코드 읽는 순서 (추천)

1. `server/src/index.ts` — 부팅 순서 (env → DB → migrate → seed → listen → shutdown)
2. `server/src/app.ts` — 미들웨어 파이프라인과 의존성 조립
3. `server/src/modules/tools/` — 라우터→서비스→리포지토리 계층을 한 모듈로
4. `server/src/modules/auth/auth.service.ts` — 인증 핵심 로직 (해싱, 회전, 재사용 탐지)
5. `server/tests/auth.test.ts` — 테스트가 곧 명세라는 것을 확인
6. [architecture.md](architecture.md) — 위 코드의 "왜"

## 3. 직접 해보기 (난이도순 연습과제)

각 과제는 이 코드베이스 위에서 바로 시작할 수 있다.

### 입문
- [ ] 새 마이그레이션 추가: `users`에 `bio` 컬럼 → `PATCH /auth/me`로 수정 가능하게 (마이그레이션 불변 규칙 체득)
- [ ] `GET /api/v1/tools`에 `minRating` 쿼리 필터 추가 + 테스트 (스키마→리포지토리→테스트 흐름)
- [ ] 리뷰 목록 정렬 옵션(`sort=rating`) 추가

### 중급
- [ ] 커서 기반 페이지네이션으로 리뷰 목록 전환 (`?after=<id>`) — offset의 한계 체감
- [ ] refresh token을 HttpOnly + Secure + SameSite 쿠키로 전달하고 CSRF 방어(더블 서브밋) 추가
- [ ] 클릭 통계에 인메모리 캐시(TTL 60초) 적용 → 캐시 무효화 전략 고민
- [ ] `express-rate-limit` + Redis로 레이트 리밋 교체 (다중 인스턴스 대응)
- [ ] vitest 커버리지 리포트를 CI에 추가하고 80% 게이트 설정

### 고급
- [ ] **PostgreSQL 전환**: Repository 계층만 교체 (Testcontainers로 테스트) — 계층 분리의 가치를 실증
- [ ] 이메일 인증 플로우: 토큰 발급 → 만료 → 재발송 (외부 SMTP는 로컬 mailpit)
- [ ] OpenTelemetry 트레이싱 추가 → 요청 ID와 span 연결
- [ ] k6로 부하 테스트: 레이트 리밋/커넥션 한계 측정 → 병목 리포트 작성
- [ ] Fly.io/Railway에 Docker 배포 + Vercel 프론트에 `VITE_API_URL` 연결 → 실서비스 연동
- [ ] 클릭 이벤트를 큐(BullMQ)로 비동기 처리 — at-least-once와 멱등 소비자 설계

## 4. 이력서/포트폴리오에 쓸 때

수치와 "왜"를 함께 쓴다:

- "JWT access(15분) + refresh 회전·재사용 탐지를 구현해 토큰 탈취 시 피해 범위를 세션 단위로 제한"
- "요청 ID 기반 구조화 로깅으로 특정 요청의 전체 처리 경로 추적 가능"
- "in-memory SQLite로 미들웨어~SQL 전 구간을 커버하는 통합 테스트 75건, CI에서 매 PR 검증"
- "빈 PATCH가 기본값을 주입해 데이터를 덮어쓰는 버그를 테스트로 발견·수정" ← 실제로 이 저장소에서 있었던 일 (`tools.schemas.ts`의 주석 참고)
