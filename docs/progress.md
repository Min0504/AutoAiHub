# 진행상황

마지막 갱신: 2026-06-25 · 상세 이력은 [../DEV_NOTES.md](../DEV_NOTES.md) 단일 참조점.

## 한 줄 요약

프로덕션 배포 완료(https://autohub-ai.vercel.app). FAQ 섹션, OG 이미지, Dify 제휴 반영까지 완료됐고, `src/data/tools` 복구와 탭 단위 코드 스플릿까지 끝났다. 현재 FE 기준 남은 우선순위는 문서 정합성과 추가 제휴 반영 준비다.

## 현재 구현 상태

- React 19 + TypeScript + Vite SPA + Express(Vercel Serverless)
- Groq(`llama-3.3-70b-versatile`): AI 채팅, 워크플로우 시나리오, B2B 견적
- 16종 자동화 툴 디렉토리 + 1:1 비교, ROI/Zapier 대체 비용/AI 토큰 비용 계산기
- 메인 페이지 FAQ 섹션 반영 + `index.html` FAQ JSON-LD 포함
- `public/og-image.png` 반영 및 블로그/메인 OG 이미지 연결 완료
- Dify 제휴 링크 및 `AffiliateBanner.tsx` 배너 반영 완료
- `src/data/tools` 누락 복구 완료, 프론트 카탈로그 빌드 가능 상태 회복
- 비교/계산기/AI 상담사/B2B 견적/모달을 지연 로딩으로 분리해 번들 경고 해소
- Supabase 리드 저장 연동 완료(leads 테이블, RLS)
- 동적 SEO 메타태그(`useSeoMeta`), `?tool=slug` 딥링크, 정적 sitemap/robots CDN 서빙
- Google Search Console 등록·색인 요청 완료, GA4(`G-W5Q885CWSM`) 연결

## 검증

```bash
npm run dev    # Vite :5173 + Express :3001
npm run lint   # 타입 체크
npm run build  # 프로덕션 빌드
```
