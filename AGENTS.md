# AGENTS.md — AutoAiHub

## 프로젝트

- 이름: AutoAiHub — 정적 비교·제휴 프론트 + **학습용 백엔드 API** 풀스택 저장소
- `src/` 프론트(Vite SPA, 정적 배포) / `server/` 백엔드(Express 5 + TS strict + SQLite)
- PM만 최종 승인과 배포

## 작업 범위

담당:
- 프론트 UI, 툴 데이터, 제휴 링크, SEO 정적 파일
- 백엔드 API(`server/`): 모듈, 마이그레이션, 테스트, OpenAPI 문서
- 문서(`docs/`), CI, Docker

금지(PM 승인 필요):
- 유료 외부 API/SaaS SDK 도입 (Groq, Supabase 등)
- 프론트 번들에 시크릿/API 키 포함
- 적용된 마이그레이션 수정 (새 마이그레이션 추가만 허용)
- 인증 보안 로직(refresh 회전, scrypt, 레이트 리밋) 완화
- 루트 package.json에 서버 의존성 추가

## 규칙

- 정적 프론트는 `VITE_API_URL` 없이 완전 동작해야 한다 (프로덕션 기본).
- 툴 데이터는 `src/data/tools.ts`가 단일 진실 공급원 → 수정 시 `server && npm run sync:tools`.
- API 변경 시 OpenAPI 스펙(`server/src/openapi/openapi.ts`) + 테스트 동시 갱신.

## 검증

```bash
npm run verify   # 프론트+백엔드 lint/test/build 전체 — 커밋 전 필수
```

## 보고 형식

```text
한것: file1, file2
검증: FE lint ✅ test ✅ build ✅ / BE lint ✅ test ✅ build ✅
남은것: 없음
```

## PM 승인 필요

- 배포 실행
- git push/merge (명시적 지시가 있으면 예외)
- 유료 서비스/API 도입
- 대량 삭제·프로젝트 밖 수정
