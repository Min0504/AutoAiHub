# CLAUDE.md

AutoHub AI 코드베이스 작업 규칙. 제품 개요는 [README.md](README.md), 상세 개발 노트는 [DEV_NOTES.md](DEV_NOTES.md), 진행/이슈/인수인계는 [docs/](docs/) 참고.

## 제품 요약

한국어 업무 자동화 도구 비교/상담 MVP. React 19 + Vite SPA 프론트엔드, Express(Vercel Serverless) 백엔드, Groq(`llama-3.3-70b-versatile`) AI 엔진, Supabase 리드 저장. 프로덕션 배포 완료 (https://autohub-ai.vercel.app).

## 절대 규칙

- AI 엔진은 Groq을 사용한다. Gemini는 할당량 문제로 제거됨 — 되살리지 않는다.
- API 키·시크릿은 클라이언트에 넣지 않는다. Vercel/`.env.local` 환경변수에서만 사용한다.
- 사이트맵(`public/sitemap.xml`)·`robots.txt`는 정적 파일 CDN 서빙이다. Express 라우팅으로 되돌리지 않는다.
- 도메인 변경 시 `index.html`, `public/sitemap.xml`, `public/robots.txt`, `src/hooks/useSeoMeta.ts`의 BASE_URL을 일괄 수정한다.

## 작업 흐름

```bash
npm run dev        # Vite :5173 + Express :3001 동시 실행
npm run lint       # 타입 체크
vercel env ls      # 환경변수 확인
```

배포 구조·환경변수·제휴 현황 등 상세는 [DEV_NOTES.md](DEV_NOTES.md)가 단일 참조점이다.

## 비용 원칙

**모토: 최저비용 최대수익.**

- 현재 리드 저장에 Supabase를 사용 중이나, 워크스페이스 비용 철학(`/AGENTS.md §13`)에 따라 Firebase Firestore 무료 티어로 교체를 검토한다. Supabase는 Axis 전용.
- 신규 유료 서비스 도입 전 conductor 승인 필수.
- 외부 유료 API(Groq 등)는 사용량 제한 + 캐싱 우선 적용.

## 문서 규칙

- 진행 상황은 [docs/progress.md](docs/progress.md), 문제는 [docs/issues.md](docs/issues.md), 인수인계는 [docs/handoff.md](docs/handoff.md)에 짧게 기록한다.
- 긴 서술형 이력·아키텍처는 `DEV_NOTES.md`에 둔다.
