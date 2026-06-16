# AutoAiHub — AI 작업 프롬프트

> 배포 목표: 2026-07-25 (기능 완성 + SEO 최적화) | 현재: 프로덕션 배포 완료

---

## 프로젝트 컨텍스트

너는 **AutoAiHub** (한국어 업무 자동화 도구 비교/상담 서비스)를 완성 상태로 끌어올리는 시니어 엔지니어다.

**프로젝트 위치:** `/Users/minseokchae/Documents/Personal_Project/AutoAiHub/`

**프로덕션 URL:** https://autohub-ai.vercel.app
**Vercel 프로젝트 ID:** `prj_xk7fGar74djGr8OdP7estccZ60yC`

**제품 설명:**
n8n, Make, Zapier 등 자동화 플랫폼을 비교하고, ROI 계산과 AI 기반 워크플로우/견적 초안으로 B2B 상담 리드를 저장하는 서비스. 한국어 타겟.

**기술 스택:**
- React 19 + TypeScript + Vite (SPA 프론트엔드)
- Express.js (Vercel Serverless Functions)
- Groq API (`llama-3.3-70b-versatile`) — AI 채팅, 워크플로우 시나리오, B2B 견적
- Supabase (leads 테이블)
- GA4 (`G-W5Q885CWSM`), Google Search Console

---

## 현재 완료 상태 (2026-06-09 기준)

### 인프라 & 기능 (완료)
- 16종 자동화 툴 디렉토리 + 1:1 비교
- ROI 계산기, Zapier 대체 비용 계산기, AI 토큰 비용 계산기
- Groq AI 채팅, 워크플로우 시나리오 생성, B2B 견적 초안
- Supabase 리드 저장 (RLS, 환경변수)
- Make 제휴 코드 `autohubai` 적용 (`make.com/?pc=autohubai`)
- 사이드바 제휴 배너
- GA4 연결, Google Search Console 등록 + 색인 요청 완료
- sitemap.xml 정적 파일 (17개 URL, HTTPS)
- 동적 SEO (탭/툴별 `title`, `description`, `canonical`)
- `?tool=slug` URL 파라미터로 모달 자동 오픈

### 남은 SEO 상태
- 구글 색인 생성 대기 중
- FAQ 섹션 미작성
- OG 이미지 미생성

---

## 남은 작업 (이 세션에서 완료할 것)

### Phase 1: SEO 콘텐츠 강화 (7/5-7/10)

**1-1. FAQ 섹션 추가**

`src/components/FAQSection.tsx` 생성:
```typescript
const faqs = [
  {
    q: "n8n과 Make 중 어떤 걸 선택해야 하나요?",
    a: "직접 서버를 운영할 수 있고 자유도가 중요하다면 n8n, 빠른 시작과 클라우드 관리가 필요하면 Make를 추천합니다."
  },
  {
    q: "Zapier를 사용 중인데 비용이 너무 높습니다. 대안은?",
    a: "Make(구 Integromat)이 유사 기능을 20-70% 저렴하게 제공합니다. ROI 계산기로 전환 비용을 미리 계산해보세요."
  },
  // 최소 10개 이상의 실용적인 Q&A
];
```

FAQ에 구조화 데이터(JSON-LD) 추가:
```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [...]
}
</script>
```

**1-2. OG 이미지 생성**
- 크기: 1200x630px
- 내용: "업무 자동화 툴 비교 | AutoAiHub" + 주요 툴 로고
- `public/og-image.png`로 저장
- `index.html` + `useSeoMeta.ts`에서 참조

**1-3. 구조화 데이터 추가 (툴 비교 페이지)**
```json
{
  "@type": "WebApplication",
  "name": "AutoAiHub",
  "description": "업무 자동화 툴 비교 및 ROI 계산",
  "applicationCategory": "BusinessApplication"
}
```

### Phase 2: 제휴사 확장 (7/10-7/15)

**현재 제휴:**
- Make: `make.com/?pc=autohubai` ✅
- n8n: 거절됨 ❌

**신규 제휴 시도:**
1. **Zapier**: zapier.com 파트너 프로그램 신청
2. **Pabbly Connect**: 저렴한 Zapier 대안, 제휴 프로그램 활성
3. **ActiveCampaign**: 자동화 + CRM, B2B 타겟에 적합
4. **Airtable**: 데이터 관리 + 자동화 조합

제휴 배너 추가 시 `src/components/AffiliatePanel.tsx`에 추가.

### Phase 3: 기능 강화 (7/15-7/20)

**3-1. 툴 비교 데이터 확장**
현재 16종 → 20종으로 확장. 추가할 툴:
- Pabbly Connect (Make 대안, 저렴)
- Activepieces (오픈소스 n8n 대안)
- Workato (엔터프라이즈)
- Tray.io (엔터프라이즈)

각 툴에 한국어 상세 설명 + 실제 사용 사례 추가.

**3-2. 리드 저장 강화**
현재 `leads` 테이블 필드 확인 후:
- 유입 경로 (`utm_source`, `utm_medium`) 저장 추가
- 관심 툴 정보 저장
- 리드 품질 점수 (대화 길이, 계산기 사용 여부)

**3-3. 이메일 뉴스레터 opt-in** (선택적)
- 리드 저장 시 뉴스레터 동의 체크박스 추가
- Supabase `leads` 테이블에 `newsletter_opt_in boolean` 컬럼 추가

### Phase 4: 성능 최적화 (7/20-7/22)

```bash
# Lighthouse 점수 목표: 90+
npx lighthouse https://autohub-ai.vercel.app --view
```

최적화 포인트:
- 이미지 lazy loading
- 툴 데이터를 동적 import로 코드 분할 (현재 번들 크기 확인)
- Vercel Edge Config 또는 캐시 헤더 최적화

### Phase 5: 최종 점검 + 완성 선언 (7/22-7/25)

**체크리스트:**
- [ ] FAQ 섹션 + JSON-LD 구조화 데이터
- [ ] OG 이미지 (1200x630)
- [ ] 신규 제휴 배너 (최소 1개 추가)
- [ ] 툴 디렉토리 20종 이상
- [ ] Lighthouse 성능 90+
- [ ] Google Search Console 새 URL 색인 요청
- [ ] GA4 이벤트: FAQ 클릭, 계산기 사용, 제휴 링크 클릭 트래킹
- [ ] 모바일 반응형 확인 (375px, 768px, 1280px)

```bash
npm run build
# 빌드 성공 + 번들 크기 경고 없음 확인
vercel --prod
```

---

## 코딩 원칙

- Groq API 키는 서버(Vercel Functions)에만, 절대 클라이언트 노출 금지
- 제휴 링크는 숨기지 않음 (광고 표시 의무 준수)
- 리드 데이터는 Supabase에만 저장, 외부 전송 금지
- AI 생성 견적은 "참고용" 면책 문구 유지
- 변경 후 `npm run build` + Vercel 프리뷰 배포로 검증

---

## 주요 파일 구조

```
src/
  App.tsx                 # 라우팅, ?tool= 파라미터 처리
  hooks/
    useSeoMeta.ts         # 탭/툴별 동적 SEO
  components/
    FAQSection.tsx        # (신규 생성)
    AffiliatePanel.tsx    # 제휴 배너
    ToolDirectory.tsx     # 16종 → 20종 확장
    Calculators.tsx       # ROI, Zapier 대체, AI 토큰
  api/
    chat.ts               # Groq AI 채팅
    leads/                # 리드 저장 (Supabase)
public/
  sitemap.xml
  robots.txt
  og-image.png            # (신규 생성)
```

---

## 수익화 현황

| 채널 | 상태 |
|-----|-----|
| Make 제휴 (`autohubai`) | ✅ 활성 |
| n8n 제휴 | ❌ 거절 |
| Zapier 제휴 | 🔄 신청 예정 |
| 광고 슬롯 (사이드바) | ✅ 준비됨 |
| B2B 상담 리드 | ✅ Supabase 저장 |
