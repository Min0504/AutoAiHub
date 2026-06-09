# AutoHub AI — 개발 이어받기 노트

> 마지막 업데이트: 2026-06-09

---

## 1. 현재 프로젝트 상태 요약

| 항목 | 상태 |
|------|------|
| **프로덕션 URL** | https://autohub-ai.vercel.app |
| **Vercel 프로젝트 ID** | `prj_xk7fGar74djGr8OdP7estccZ60yC` |
| **AI 엔진** | Groq LPU (`llama-3.3-70b-versatile`) |
| **전체 배포 상태** | ✅ 프로덕션 배포 완료 (2026-06-09) |
| **AI 채팅 (`/api/chat`)** | ✅ Groq 프로덕션 작동 확인 |
| **사이트맵 (`/sitemap.xml`)** | ✅ 정적 파일 CDN 서빙 |
| **리드 저장 (`/api/leads/*`)** | ✅ Supabase 연동 완료 |
| **Google Search Console** | ✅ 등록 완료 / 색인 요청 제출됨 |
| **GA4 애널리틱스** | ✅ `G-W5Q885CWSM` 연결됨 |

### 현재 단계
SEO 기반 작업 완료. 구글 색인 생성 대기 중.
**다음 단계: SEO 콘텐츠 강화 (FAQ 섹션) → OG 이미지 → 제휴사 확장**

---

## 2. 완료한 작업 전체 이력

### ✅ 인프라 & 기능
- React 19 + TypeScript + Vite SPA 프론트엔드
- Express.js 백엔드 (Vercel Serverless Function)
- **Groq API 연동** (llama-3.3-70b-versatile): AI 채팅, 워크플로우 시나리오, B2B 견적
- 16종 자동화 툴 디렉토리 + 1:1 비교 기능
- ROI 계산기, Zapier 대체 비용 계산기, AI 토큰 비용 계산기
- **Supabase 리드 저장** 연동 완료 (leads 테이블, RLS, 환경변수)
- 로컬 개발 환경 (Vite 프록시 + Express 동시 실행)

### ✅ 수익화
- **Make 제휴 코드** `autohubai` 적용 완료 (`make.com/?pc=autohubai`)
- **n8n 제휴** ❌ 거절됨 (2026-06-09) — 배너에서 제거
- **사이드바 제휴 배너** (Make 카드 + 광고 슬롯)
- PartnerProgramsPanel 내부 전략 패널 UI에서 제거

### ✅ SEO (2026-06-09 완료)
- `public/robots.txt` — `autohub.ai` → `autohub-ai.vercel.app` 수정
- `index.html` — 전체 도메인 플레이스홀더 교체, Gemini 언급 제거
- `public/sitemap.xml` — 정적 파일로 전환 (17개 URL, HTTPS)
- `build.sh` — Express 사이트맵 라우팅 제거 (CDN 직접 서빙)
- `src/hooks/useSeoMeta.ts` — 툴/탭별 동적 title·description·canonical 훅
- `src/App.tsx` — `?tool=slug` URL 파라미터 읽기 + 모달 자동 오픈
- Google Search Console 사이트맵 제출 완료
- 주요 URL 3개 색인 생성 요청 완료

### ✅ 해결한 주요 이슈
- Vercel Build Output API v3로 람다 배포 문제 해결 (`build.sh`)
- Serverless `/tmp` 폴백으로 리드 저장 문제 해결
- Gemini API 할당량 0 문제 → Groq으로 완전 전환
- 사이트맵 HTTP URL → HTTPS 강제 고정
- 사이트맵 서버리스 콜드스타트 이슈 → 정적 파일 전환으로 해결

---

## 3. 핵심 파일 목록

| 파일 경로 | 역할 | 최근 변경 내용 | 다음에 확인할 점 |
|-----------|------|----------------|-----------------|
| `server.ts` | Express 앱 엔트리 + Groq 클라이언트 초기화 | Gemini → Groq 전환 | 변경 불필요 |
| `src/server/aiRoutes.ts` | Groq 기반 AI 라우트 | `/api/chat`, `/api/recommend`, `/api/proposal` | `geminiRoutes.ts` 빈 stub 삭제 가능 |
| `src/server/leadStore.ts` | 리드 저장 로직 | Supabase 우선, `/tmp` 폴백 | 변경 불필요 |
| `src/hooks/useSeoMeta.ts` | 동적 SEO 메타태그 훅 | 신규 생성 | 도메인 변경 시 BASE_URL 수정 |
| `src/App.tsx` | 앱 루트 + URL 파라미터 처리 | useSeoMeta 연결, URL 딥링크 추가 | 변경 불필요 |
| `src/components/AffiliateBanner.tsx` | 사이드바 제휴 배너 | Make + 광고 슬롯 (n8n 제거됨) | 새 제휴사 승인 시 카드 추가 |
| `src/config/affiliateLinks.ts` | 제휴 링크 관리 | Make: `?pc=autohubai` 적용 | 새 제휴 코드 받으면 추가 |
| `public/sitemap.xml` | 정적 사이트맵 | 신규 생성 (17개 URL) | 툴 추가 시 수동 업데이트 필요 |
| `public/robots.txt` | 크롤러 설정 | 도메인 수정 완료 | 변경 불필요 |
| `index.html` | SEO 메타태그 + GA4 | 도메인 전체 교체 완료 | 도메인 확정 시 재교체 |
| `build.sh` | Vercel 빌드 스크립트 | 사이트맵 라우팅 제거 | 변경 불필요 |

---

## 4. 현재 남은 문제

### 🟡 SEO 관련
- **Google 색인 대기 중**: 요청 제출 완료, 수 시간~수일 내 색인 생성 예상
- **Sitemaps "가져올 수 없음"**: 신규 사이트 특성상 처리 지연 — 수일 내 자동 해결 예상
- **OG 이미지 없음**: `/public/og-image.png` 필요 (1200×630px)

### 🟡 수익화 관련
- **제휴사 부족**: Make 1개뿐 — Activepieces, Dify 등 추가 신청 필요
- **트래픽 0**: 콘텐츠 없으면 제휴 수익도 없음 — FAQ/가이드 콘텐츠 추가 필요

### 🟢 낮은 우선순위
- `src/server/geminiRoutes.ts` 빈 stub 파일 삭제 가능
- Slack 리드 알림 미활성 (`SLACK_WEBHOOK_URL` 미설정)
- 개인정보처리방침 DPO 이메일 플레이스홀더 (`PrivacyPolicyModal.tsx`)
- 커스텀 도메인 미연결 (`autohub.ai`)

---

## 5. 다음에 바로 할 일

### 🔥 가장 먼저 할 일 (SEO 콘텐츠)

1. **FAQ 섹션 추가** — 메인 페이지 하단에 자주 묻는 질문 추가
   - "n8n vs Make 어떤 걸 써야 할까?"
   - "Zapier 무료 대안은?"
   - "업무 자동화 처음 시작하는 법"
   - → 이 키워드들이 HTML 텍스트로 존재해야 구글 검색 유입 가능

2. **OG 이미지 제작** — 1200×630px PNG, `/public/og-image.png`
   - SNS 공유 시 빈 카드 → 이미지 있는 카드로 개선
   - Figma 또는 Canva로 직접 제작 가능

### 📋 그다음 할 일 (수익화)

1. **제휴사 신청** — Activepieces, Dify (트래픽 조건 없음, 즉시 신청 가능)
   - Activepieces: activepieces.com/partners (30% 반복 커미션)
   - Dify: dify.ai/affiliate (20% 반복 커미션)
   - 코드 받으면 `src/config/affiliateLinks.ts` + `AffiliateBanner.tsx` 업데이트

2. **외부 링크 확보** — 커뮤니티 소개글 작성
   - 관련 커뮤니티: Okky, 클리앙, 네이버 카페 (자동화/IT)
   - 브런치/티스토리 "자동화 툴 비교" 글 + 링크

### 💡 나중에 개선할 일

1. **커스텀 도메인 연결** — 도메인 확정 후 `index.html`, `sitemap.xml`, `robots.txt` 일괄 수정
2. **Slack 알림 활성화** — `SLACK_WEBHOOK_URL` Vercel에 추가
3. **Zapier 제휴 신청** — 트래픽 월 1,000명 이상 확보 후

---

## 6. 다음 개발 시작 방법

```bash
# 1. 기존 프로세스 종료 후 서버 실행
lsof -ti :3001 | xargs kill -9 2>/dev/null
lsof -ti :5173 | xargs kill -9 2>/dev/null
npm run dev
# → http://localhost:5173

# 2. AI 채팅 로컬 테스트
curl -s -X POST http://localhost:3001/api/chat \
  -H "Content-Type: application/json" \
  -d '{"messages":[{"role":"user","text":"안녕"}]}'

# 3. 사이트맵 확인
curl -s http://localhost:5173/sitemap.xml | head -5
```

---

## 7. 실행 / 테스트 / 빌드 명령어

| 목적 | 명령어 |
|------|--------|
| **로컬 개발 서버** | `npm run dev` (Vite :5173 + Express :3001 동시 실행) |
| **API만 실행** | `npm run dev:api` |
| **프론트만 실행** | `npm run dev:ui` |
| **타입 체크** | `npm run lint` |
| **환경변수 확인** | `vercel env ls` |
| **Vercel 배포 로그** | `vercel logs https://autohub-ai.vercel.app` |

---

## 8. 환경변수 현황

| 변수 | 로컬 (`.env.local`) | Vercel Production |
|------|---------------------|-------------------|
| `GROQ_API_KEY` | ✅ | ✅ |
| `GROQ_MODEL` | ✅ `llama-3.3-70b-versatile` | ✅ |
| `SUPABASE_URL` | ✅ | ✅ |
| `SUPABASE_SERVICE_KEY` | ✅ | ✅ |
| `SLACK_WEBHOOK_URL` | ❌ 미설정 | ❌ 미설정 |

---

## 9. 제휴 현황

| 플랫폼 | 상태 | 코드 | 커미션 | 비고 |
|--------|------|------|--------|------|
| Make | ✅ 활성 | `autohubai` | 35%, 12개월 | `make.com/?pc=autohubai` |
| n8n | ❌ 거절됨 | — | — | 2026-06-09 거절 |
| Zapier | ⏳ 보류 | — | 25% | 트래픽 확보 후 신청 |
| Activepieces | 🔲 미신청 | — | 30% 반복 | 즉시 신청 가능 |
| Dify | 🔲 미신청 | — | 20% 반복 | 즉시 신청 가능 |

---

## 10. SEO 현황 (2026-06-09 기준)

| 항목 | 상태 |
|------|------|
| Google Search Console 등록 | ✅ `https://autohub-ai.vercel.app` |
| GA4 연결 | ✅ `G-W5Q885CWSM` |
| 사이트맵 제출 | ✅ 제출 완료 (처리 대기) |
| 색인 생성 요청 | ✅ `/`, `/?tool=make`, `/?tool=n8n` 요청 완료 |
| 동적 메타태그 | ✅ 툴/탭별 title·description 자동 변경 |
| URL 딥링크 | ✅ `?tool=slug` 접속 시 모달 자동 오픈 |
| OG 이미지 | ❌ 미제작 |
| 외부 링크 | ❌ 0개 |
| FAQ 콘텐츠 | ❌ 미작성 |

---

## 11. 아키텍처 메모

```
[사용자 브라우저]
    │
    ▼
[Vercel CDN]
    │
    ├── /api/*   → [Serverless Function] server.ts (Express)
    │                    ├── Groq API  (AI 응답)
    │                    └── Supabase  (리드 저장)
    │
    ├── /sitemap.xml → 정적 파일 직접 서빙 (CDN)
    ├── /robots.txt  → 정적 파일 직접 서빙 (CDN)
    │
    └── 그 외 → index.html → React SPA
```

**Vercel 배포 구조 (`build.sh` 생성)**
```
.vercel/output/
├── config.json                          # 라우팅: /api/* → 함수, 나머지 → 정적
├── static/                              # Vite 빌드 + public/ 파일 (CDN)
│   ├── sitemap.xml                      # 정적 사이트맵
│   ├── robots.txt
│   └── assets/
└── functions/api/index.func/
    ├── index.js                         # esbuild 번들 (Express)
    └── .vc-config.json                  # nodejs20.x, maxDuration: 30s
```
