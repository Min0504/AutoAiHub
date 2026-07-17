# AutoHub AI — 개발 노트

> 마지막 업데이트: 2026-07-17 · 정적 재설계

## 현재 상태

| 항목 | 상태 |
|------|------|
| 형태 | 정적 Vite SPA (서버/AI/DB 없음) |
| 프로덕션 | https://autohub-ai.vercel.app |
| 핵심 | 툴 디렉토리 + 1:1 비교 + 제휴 링크 |
| 제거됨 | Groq, Express, Supabase 리드, AI 채팅/시나리오/견적, 계산기 |

설계: [docs/superpowers/specs/2026-07-17-static-affiliate-redesign.md](docs/superpowers/specs/2026-07-17-static-affiliate-redesign.md)

## 로컬

```bash
npm install
npm run dev
```

## 배포

Vercel이 `vite build`로 정적 산출물을 배포. 커스텀 `build.sh`/서버리스 함수 없음.

## 제휴

- Make: `?pc=autohubai` (`src/config/affiliateLinks.ts`)
- Dify: 배너·링크 연동
- 코드 추가 시 `affiliateLinks.ts` + `AffiliateBanner.tsx`만 수정

## SEO

- `public/sitemap.xml`, `robots.txt`, `og-image.png`
- `useSeoMeta` — 툴/`compare` 탭 메타
- 블로그: `public/blog/*`
