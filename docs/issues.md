# 이슈

## 운영 (PM)

- AutoHub용 Supabase 프로젝트가 남아 있다면 **삭제/비활성화**해 슬롯 확보
- Vercel에서 `GROQ_*` / `SUPABASE_*` / `SLACK_*` 환경변수 정리
- 쿠키 동의 후 GA4만 로드되는지 프로덕션에서 확인
- Search Console 색인·외부 백링크는 콘텐츠/홍보 작업

## 수익화

- Zapier·Activepieces 제휴 코드 확보 시:
  1. `src/config/affiliateLinks.ts` 링크 교체
  2. `MONETIZED_AFFILIATE_KEYS`에 키 추가 (배너 자동 노출)
- n8n 제휴 재신청 여부 검토

## 데이터 유지보수

- 주요 툴 가격은 2026-08-09 기준 점검(n8n·Make·Zapier). 나머지 툴은 주기적 재확인 필요
- 툴 추가/slug 변경 시 `src/data/tools.ts` + `public/sitemap.xml` 동시 수정 (smoke가 검증)
