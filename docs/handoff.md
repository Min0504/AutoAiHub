# 인수인계

## 제품

정적 **비교 + 제휴** 사이트. 상담·AI·DB 없음.

## 상태 (2026-07-17)

- PR #4 머지 완료 (`e5b8a98`)
- master 재배포 트리거 푸시 (`eddc4c5`)
- 로컬 검증: lint/test/build 통과
- 프로덕션 https://autohub-ai.vercel.app — Vercel Git 연동 배포 확인 필요 (CLI 토큰 없음)

## 배포 후 (PM)

1. 라이브 타이틀에 "ROI 계산기"가 없는지 확인
2. Vercel 환경변수에서 Groq/Supabase/Slack 정리(선택)
3. Supabase AutoHub 프로젝트 삭제 여부 결정 → 슬롯 확보

## 코드 수정 포인트

- 제휴: `src/config/affiliateLinks.ts`, `AffiliateBanner.tsx`
- 툴 데이터: `src/data/tools.ts` (+ sitemap 수동 반영)
- 도메인 변경: `index.html`, `public/sitemap.xml`, `public/robots.txt`, `useSeoMeta.ts`
