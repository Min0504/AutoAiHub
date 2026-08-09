# 인수인계

## 제품

정적 **비교 + 제휴** 사이트. 상담·AI·DB 없음.  
브랜드명: **AutoHub AI** (코드·문서 통일)

## 상태 (2026-08-09)

- 프로덕션 https://autohub-ai.vercel.app — 정적 재설계 반영됨
- 로컬 검증: `npm run lint` / `test` / `build`
- 최근 패치: sitemap slug(`relay-app`), compare `?tab=compare`, 제휴 단일 소스, 가격 갱신

## 배포 후 (PM)

1. 라이브에서 `/?tool=relay-app`, `/?tab=compare` 동작 확인
2. Vercel 환경변수에서 Groq/Supabase/Slack 정리(선택)
3. Supabase AutoHub 프로젝트 삭제 여부 결정
4. 쿠키 동의 → GA4 로드 확인

## 코드 수정 포인트

- 제휴: `src/config/affiliateLinks.ts` (`MONETIZED_AFFILIATE_KEYS` + 링크), `AffiliateBanner.tsx` 카피
- 툴 데이터: `src/data/tools.ts` (+ sitemap 수동 반영 — smoke가 slug 일치 검사)
- 도메인 변경: `index.html`, `public/sitemap.xml`, `public/robots.txt`, `useSeoMeta.ts`
