# Architecture — static affiliate redesign

마지막 정리: 2026-08-09

## Goal

유지보수·서버·DB·AI 부담을 없애고 **툴 비교 + 제휴 수익**만 남긴다.  
상담·리드는 제외. 수입원은 제휴 링크(Make, Dify).

## Approach

Vite SPA + Vercel CDN. Express / Groq / Supabase 없음.

## Keep

| Feature | Why |
|---------|-----|
| 툴 디렉토리 + 상세 모달 | 비교 핵심 |
| 1:1 비교 | 선택 가이드 |
| 제휴 링크·배너 | 수익 |
| FAQ / blog HTML | SEO |
| sitemap / robots / OG / GA4 | SEO·측정 |
| 개인정보 처리방침 | 최소 고지 |

## Dropped (do not bring back)

- AI 채팅·시나리오·B2B 견적
- 리드 API·Slack
- 계산기
- Express / Groq / Supabase 클라이언트

## IA

1. Directory (default) — search, filter, cards, affiliate CTA, FAQ  
2. Compare — `/?tab=compare`

## Success criteria

- 서버/DB/AI 키 없이 동작
- 제휴 클릭 경로 유지
- `npm run lint` / `test` / `build` 통과
