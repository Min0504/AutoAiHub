# AutoAiHub

> 한국어 업무 자동화 도구 비교·제휴 포털 — n8n, Make, Zapier 등을 비교하고 제휴 링크로 바로 시작한다.

![Deploy](https://img.shields.io/badge/deploy-Vercel-black) ![Stack](https://img.shields.io/badge/React%2019-Vite-blue) ![Type](https://img.shields.io/badge/type-Static%20SPA-purple)

**프로덕션:** https://autohub-ai.vercel.app

정적 Vite SPA — 서버·DB·AI 없이 운영되는 제휴 기반 포털이다.

---

## 주요 기능

| 기능 | 설명 |
|------|------|
| **툴 디렉토리** | 16종 자동화 플랫폼 + 상세 모달 |
| **1:1 비교** | 기능·가격·난이도 비교 |
| **제휴 링크** | Make(`autohubai`), Dify 등 — 주 수입원 |
| **FAQ·블로그** | SEO용 정적 콘텐츠 |
| **SEO** | sitemap, robots, OG, 툴별 메타 |

## 기술 스택

| 레이어 | 기술 |
|--------|------|
| Framework | React 19 + TypeScript + Vite |
| 호스팅 | Vercel (정적) |
| 분석 | Google Analytics 4 |

> 의도적으로 Express / Groq / Supabase / 리드 수집을 사용하지 않는다.

---

## 시작하기

```bash
npm install
npm run dev      # http://localhost:5173
npm run lint
npm run test
npm run build
```

환경변수(API 키)는 필요하지 않다.

## 프로젝트 구조

```
src/
├── components/     디렉토리·비교·제휴·FAQ UI
├── config/         affiliateLinks.ts
├── data/tools.ts   툴 데이터
└── hooks/          useSeoMeta.ts
public/
├── blog/           정적 가이드 글
├── sitemap.xml
├── robots.txt
└── og-image.png
```

설계 문서는 [docs/](docs/) 참고.
