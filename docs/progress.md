# 진행상황

마지막 갱신: 2026-06-18 · 상세 이력은 [../DEV_NOTES.md](../DEV_NOTES.md) 단일 참조점.

## 한 줄 요약

FAQ SEO 보강·OG 이미지 확인·제휴 API 준비 완료. 보안 검수 통과. 배포 가능 판정.

## 현재 구현 상태

- React 19 + TypeScript + Vite SPA + Express(Vercel Serverless)
- Groq(`llama-3.3-70b-versatile`): AI 채팅, 워크플로우 시나리오, B2B 견적
- 16종 자동화 툴 디렉토리 + 1:1 비교, ROI/Zapier 대체 비용/AI 토큰 비용 계산기
- Supabase 리드 저장 연동 완료(leads 테이블, RLS)
- 동적 SEO 메타태그(`useSeoMeta`), `?tool=slug` 딥링크, 정적 sitemap/robots CDN 서빙
- Google Search Console 등록·색인 요청 완료, GA4(`G-W5Q885CWSM`) 연결
- **[신규] 메인 하단 FAQ 섹션 SEO 보강**: `n8n vs Make`, `Zapier 무료 대안`, `업무 자동화 시작법` 키워드 HTML 텍스트로 노출, DOM 상시 유지, 모바일 패딩 보강
- **[신규] OG 이미지** `public/og-image.png` 1200×630 존재 확인, `index.html`·블로그 OG 메타 참조 완료
- **[신규] 제휴 API**: `src/config/partnerPrograms.ts`, `GET /api/partner-programs`, `GET /api/partner-programs/:id/application-draft` 추가 (Activepieces·Dify 준비)

## 검증 (2026-06-18)

```bash
npm run lint   # ✅ 성공
npm run build  # ✅ 성공 (chunk size 경고 있음, 배포 차단 아님)
bash build.sh  # ✅ 성공
```

- 브라우저 QA: 375/768/1280px ✅
- Groq API 키 클라이언트 노출 없음 ✅
- Supabase service role key 서버 전용 확인 ✅
- 보안 판정: 배포 가능
