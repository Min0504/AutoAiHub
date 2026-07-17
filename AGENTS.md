# AGENTS.md — AutoAiHub

## 프로젝트

- 이름: AutoAiHub
- **정적** 비교 + 제휴 사이트 (Vite SPA)
- **서버/AI/Supabase/리드 없음** — 되살리지 않음
- PM만 최종 승인과 배포

## 작업 범위

담당:
- UI, 툴 데이터, 제휴 링크, SEO 정적 파일, 문서

금지(의도적으로 제외된 영역):
- Express / `src/server` / Groq / Supabase / 리드 API 재도입
- package.json에 AI·DB SDK 재추가 (PM 승인 없이)

## 검증

```bash
npm run lint
npm run test
npm run build
```

## 보고 형식

```text
한것: file1, file2
검증: lint ✅ test ✅ build ✅
남은것: 없음
```

## PM 승인 필요

- 배포 실행
- git push/merge (클라우드 에이전트 지시가 있으면 예외)
- 유료 서비스/API 재도입
- 대량 삭제·프로젝트 밖 수정
