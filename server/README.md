# autohub-api

AutoHub AI의 백엔드 REST API. Express 5 + TypeScript(strict) + SQLite(`node:sqlite`, Node 26 내장).

설계 문서: [../docs/backend/architecture.md](../docs/backend/architecture.md)
학습 가이드: [../docs/backend/learning-roadmap.md](../docs/backend/learning-roadmap.md)

## 실행

```bash
npm install
cp .env.example .env
npm run dev        # tsx watch, http://localhost:4000
```

- Swagger UI: http://localhost:4000/api/docs
- 헬스체크: `GET /health`, `GET /health/ready`
- 관리자 계정: `.env`에 `ADMIN_EMAIL`/`ADMIN_PASSWORD` 설정 후 부팅하면 자동 생성

## 스크립트

| 명령 | 설명 |
|------|------|
| `npm run dev` | 개발 서버 (파일 변경 시 재시작) |
| `npm run lint` | 타입체크 (`tsc --noEmit`) |
| `npm test` | vitest + supertest (in-memory DB, 75 tests) |
| `npm run build` / `npm start` | 프로덕션 빌드 / 실행 |
| `npm run sync:tools` | 프론트 `src/data/tools.ts` → `src/db/tools.seed.ts` 재생성 |

## 빠른 사용 예 (curl)

```bash
BASE=http://localhost:4000/api/v1

# 회원가입 → 토큰 획득
curl -s -X POST $BASE/auth/register -H 'Content-Type: application/json' \
  -d '{"email":"me@example.com","password":"passw0rd1","nickname":"민석"}'

# 툴 목록 (검색 + 정렬)
curl -s "$BASE/tools?q=n8n&sort=rating&order=desc&limit=5"

# 리뷰 작성 (Bearer 토큰 필요)
curl -s -X POST $BASE/tools/n8n/reviews \
  -H "Authorization: Bearer $ACCESS_TOKEN" -H 'Content-Type: application/json' \
  -d '{"rating":5,"content":"셀프호스팅 가성비가 최고입니다"}'

# 토큰 갱신 (refresh 회전 — 이전 refresh token은 폐기됨)
curl -s -X POST $BASE/auth/refresh -H 'Content-Type: application/json' \
  -d "{\"refreshToken\":\"$REFRESH_TOKEN\"}"

# 관리자: 클릭 통계
curl -s "$BASE/stats/clicks?groupBy=day&from=2026-08-01" \
  -H "Authorization: Bearer $ADMIN_TOKEN"
```

## Docker

```bash
# 루트에서
echo "JWT_SECRET=$(openssl rand -base64 48)" > ../.env
docker compose up --build api
```

## 디렉토리

```text
src/
├── index.ts          # 부팅: env → DB → migrate → seed → listen → graceful shutdown
├── app.ts            # composition root: 미들웨어 + 모듈 조립
├── config/env.ts     # zod 환경변수 검증 (fail-fast)
├── db/               # client(WAL/FK) · migrate(러너) · migrations · seed
├── lib/              # errors · password(scrypt) · jwt · pagination
├── middleware/       # request-id · logger · rate-limit · auth · error-handler
├── modules/          # auth · tools · reviews · bookmarks · clicks · health
│   └── <name>/       #   router(HTTP) → service(규칙) → repository(SQL)
└── openapi/          # OpenAPI 3.1 스펙 + Swagger UI 라우터
tests/                # 통합(supertest) + 단위 테스트
```
