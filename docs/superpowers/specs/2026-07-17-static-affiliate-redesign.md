# AutoAiHub 정적 재설계 (2026-07-17)

## 목표

유지보수·서버·DB·AI 부담을 없애고, **툴 비교(A) + 제휴 수익(B)** 만 남긴다.  
상담·리드(C)는 역량상 제외. 수입원은 제휴 링크.

## 선택한 접근

**완전 정적 사이트 (Approach A)**  
Vite SPA + Vercel CDN만 사용. Express / Groq / Supabase 제거 → Supabase 프로젝트 슬롯 확보 가능.

## 남기는 것

| 기능 | 이유 |
|------|------|
| 툴 디렉토리 + 상세 모달 | 비교의 핵심 |
| 1:1 비교 | 선택 가이드 |
| 제휴 링크·배너 (Make, Dify 등) | 주 수입원 |
| FAQ (정적) | SEO |
| 블로그 HTML (`public/blog`) | 이미 정적, SEO |
| sitemap / robots / OG / GA4 | SEO·측정 |
| 개인정보 처리방침 (간소화) | 법적 최소 고지 |

## 제거하는 것

- AI 채팅, AI 시나리오, B2B 견적
- 모든 리드 API·ROI 리드 캡처·Slack 알림
- 계산기 3종 (가격 유지보수 부담)
- Express (`server.ts`, `src/server/*`), Groq, Supabase 클라이언트
- PartnerPrograms 내부 패널, consulting UI
- `react-markdown`, `groq-sdk`, `express`, `@supabase/supabase-js` 등 불필요 의존성

## 정보 구조 (탭)

1. **디렉토리** (기본) — 검색·필터·카드·제휴 CTA·FAQ  
2. **1:1 비교** — 비교함에서 진입

상담/AI/계산기 탭 없음.

## 기술

- `npm run dev` → Vite만  
- `npm run build` → `vite build`만  
- `vercel.json` → 기본 Vite 정적 배포 (커스텀 `build.sh` Express 번들 제거)
- 환경변수: 런타임 키 불필요 (GA4는 공개 ID만 `index.html`)

## 성공 기준

- 서버/DB/AI 키 없이 사이트 동작
- 제휴 클릭 경로(카드·배너·모달) 유지
- lint/build 통과
