# 진행상황

마지막 갱신: 2026-06-09 · 상세 이력은 [../DEV_NOTES.md](../DEV_NOTES.md) 단일 참조점.

## 한 줄 요약

프로덕션 배포 완료(https://autohub-ai.vercel.app). SEO 기반 작업 끝, 구글 색인 생성 대기 중. 다음은 SEO 콘텐츠(FAQ) → OG 이미지 → 제휴사 확장.

## 현재 구현 상태

- React 19 + TypeScript + Vite SPA + Express(Vercel Serverless)
- Groq(`llama-3.3-70b-versatile`): AI 채팅, 워크플로우 시나리오, B2B 견적
- 16종 자동화 툴 디렉토리 + 1:1 비교, ROI/Zapier 대체 비용/AI 토큰 비용 계산기
- Supabase 리드 저장 연동 완료(leads 테이블, RLS)
- 동적 SEO 메타태그(`useSeoMeta`), `?tool=slug` 딥링크, 정적 sitemap/robots CDN 서빙
- Google Search Console 등록·색인 요청 완료, GA4(`G-W5Q885CWSM`) 연결

## 검증

```bash
npm run dev    # Vite :5173 + Express :3001
npm run lint   # 타입 체크
```
