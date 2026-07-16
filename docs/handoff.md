# 인수인계

다음 작업자가 바로 할 일. 상세는 [../DEV_NOTES.md](../DEV_NOTES.md) §5 참고.

## 🔥 가장 먼저 (conductor 결정 사항)

1. **Dify 커미션 수치 확정** — 기존 handoff는 20%, 공식 페이지 30-50%. 문서·프론트 문구에 반영할 수치 결정.
2. **Activepieces 제휴 신청 링크 확인** — 공식 파트너 담당자 또는 최신 신청 URL 직접 확인 후 신청.
3. **`.env.example` Groq 기준 갱신** — Gemini 잔재 제거, `GROQ_API_KEY` 예시 추가.

## 📋 그다음 (콘텐츠 + 외부 링크)

1. **외부 링크 확보** — Okky/클리앙 소개글, 브런치/티스토리 비교 글.
2. **제휴 코드 발급 후** — frontend가 `src/config/affiliateLinks.ts`·`AffiliateBanner.tsx` 업데이트.

## 💡 나중에

- 커스텀 도메인 연결(확정 후 `index.html`·`sitemap.xml`·`robots.txt`·`useSeoMeta.ts` BASE_URL 일괄 교체)
- Slack 알림 활성화(`SLACK_WEBHOOK_URL`)
- 번들 코드 스플리팅 (500kB 초과 경고 해소)
- Zapier 제휴 신청(월 1,000명 이상 확보 후)

## 주의

- 도메인 변경 시 `index.html`, `public/sitemap.xml`, `public/robots.txt`, `useSeoMeta.ts` 일괄 수정.
- 새 툴 추가 시 `public/sitemap.xml` 수동 업데이트 필요.
- 실제 배포 실행은 conductor만.

---

## 역할별 다음 과제

- frontend: 제휴 코드 수령 후 `affiliateLinks.ts`·`AffiliateBanner.tsx` 반영; 번들 코드 스플리팅 검토
- backend: Dify/Activepieces 실제 제휴 신청(conductor 결정 후); `.env.example` Groq 갱신
- security: 다음 배포 전 재검수 (현재 판정: 배포 가능)
