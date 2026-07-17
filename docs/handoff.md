# 인수인계

## 제품

정적 **비교 + 제휴** 사이트. 상담·AI·DB 없음.

## 배포 전 (PM)

1. 이 브랜치 머지 후 Vercel 재배포 (빌드: `vite build`)
2. Vercel 환경변수에서 Groq/Supabase/Slack 정리(선택)
3. Supabase AutoHub 프로젝트 삭제 여부 결정 → 슬롯 확보

## 코드 수정 포인트

- 제휴: `src/config/affiliateLinks.ts`, `AffiliateBanner.tsx`
- 툴 데이터: `src/data/tools.ts` (+ sitemap 수동 반영)
- 도메인 변경: `index.html`, `public/sitemap.xml`, `public/robots.txt`, `useSeoMeta.ts`
