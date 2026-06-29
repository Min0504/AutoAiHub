# AutoAiHub

> 한국어 업무 자동화 도구 비교·상담 플랫폼. n8n, Make, Zapier 등 자동화 SaaS를 비교하고, AI가 맞춤 워크플로우 시나리오와 B2B 구축 견적을 생성합니다.

**프로덕션:** https://autohub-ai.vercel.app · **상태:** 배포 완료, SEO 콘텐츠 강화 진행 중

---

## 주요 기능

| 기능 | 설명 |
|------|------|
| **툴 디렉토리** | 16종 자동화 플랫폼 데이터베이스 + 1:1 비교 |
| **비용 계산기** | Zapier 대체 비용 · 자동화 ROI · AI 토큰 비용 |
| **AI 워크플로우** | Groq LPU 기반 맞춤 워크플로우 시나리오 생성 |
| **B2B 견적 초안** | 업종·규모·요구사항 기반 구축 견적 자동 생성 |
| **리드 저장** | 상담 리드를 Supabase에 저장 (RLS 적용) |
| **SEO** | 툴별 동적 메타태그, 정적 사이트맵, Search Console 등록 |
| **제휴 링크** | Make 파트너 코드(`autohubai`) 연동 |

## 기술 스택

| 레이어 | 기술 | 선택 이유 |
|--------|------|-----------|
| Framework | React 19 + TypeScript + Vite | SPA, 빠른 빌드 |
| 백엔드 | Express.js (Vercel Serverless) | 서버리스 무료 티어 |
| 호스팅 | Vercel (Hobby) | 무료 배포, CDN |
| AI | Groq (`llama-3.3-70b-versatile`) | 무료 6,000 TPM, 빠른 응답 |
| DB | Supabase (PostgreSQL, RLS) | 리드 저장 (마이그레이션 검토 중) |
| 분석 | Google Analytics 4 | 무료 |

> **비용 원칙:** 최저비용 최대수익. 현재 Supabase는 리드 저장에만 사용 중이며, Firebase Firestore 무료 티어로 교체를 검토 중 (Supabase는 Axis 프로젝트 전용).

---

## 시작하기

```bash
# 1. 의존성 설치
npm install

# 2. 환경변수 설정
cp .env.example .env.local   # 아래 표 참고해 값 채우기

# 3. 개발 서버 (Vite :5173 + Express :3001 동시 실행)
npm run dev

# 4. 빌드
npm run build
```

### 환경변수

| 변수 | 용도 |
|------|------|
| `GROQ_API_KEY` | AI 엔진 (필수) |
| `GROQ_MODEL` | AI 모델명 (기본값: `llama-3.3-70b-versatile`) |
| `SUPABASE_URL` | Supabase 프로젝트 URL |
| `SUPABASE_SERVICE_KEY` | 서버 측 리드 저장 service role key |
| `SLACK_WEBHOOK_URL` | 새 리드 Slack 알림 (선택) |

---

## 프로젝트 구조

```
src/
├── components/          UI 컴포넌트 (툴 카드, 비교 뷰, 계산기)
├── hooks/
│   └── useSeoMeta.ts    툴별 동적 SEO 메타태그
├── config/
│   └── affiliateLinks.ts 제휴 링크 관리
├── server/
│   ├── aiRoutes.ts      Groq 기반 AI 라우트 (/api/chat, /api/recommend, /api/proposal)
│   └── leadStore.ts     리드 저장 (Supabase 우선, /tmp 폴백)
server.ts                Express 앱 엔트리
public/
├── sitemap.xml          정적 사이트맵 (17개 URL)
└── robots.txt           크롤러 설정
```

---

## 현재 상태 (2026-06-17)

| 항목 | 상태 |
|------|------|
| 프로덕션 배포 | ✅ 완료 |
| AI 채팅 (`/api/chat`) | ✅ Groq 작동 확인 |
| 리드 저장 (`/api/leads`) | ✅ Supabase 연동 완료 |
| Google Search Console | ✅ 등록 + 색인 요청 |
| GA4 연결 | ✅ `G-W5Q885CWSM` |
| Make 제휴 코드 | ✅ `autohubai` 적용 |
| SEO 콘텐츠 (FAQ) | 🔄 진행 중 |
| OG 이미지 | ⏳ 예정 |
| 추가 제휴사 확장 | ⏳ 예정 |

---

상세 개발 이력 및 아키텍처는 [DEV_NOTES.md](DEV_NOTES.md), 작업 규칙은 [CLAUDE.md](CLAUDE.md) 참고.
