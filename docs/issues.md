# 이슈

상세 맥락은 [../DEV_NOTES.md](../DEV_NOTES.md) §4 참고.

## 🟡 SEO

- Google 색인 대기 중 (요청 제출 완료, 수일 내 생성 예상)
- Sitemaps "가져올 수 없음" — 신규 사이트 처리 지연, 수일 내 자동 해결 예상

## 🟡 수익화 / 제휴

- Dify 커미션 수치 불일치: handoff에 20% 기재, 공식 페이지는 30-50% → conductor 결정 필요
- Activepieces 공식 제휴 신청 URL 불명확 → 수동 확인 후 신청
- 제휴 코드 미발급 상태 — 코드 받으면 frontend가 `src/config/affiliateLinks.ts`·`AffiliateBanner.tsx` 반영

## 🟡 문서

- `.env.example`에 Gemini 잔재 남음 → Groq 기준으로 갱신 필요
- `npm run test` 스크립트 없음 (package.json에 미정의)

## 🟢 낮은 우선순위

- 번들 크기 경고: `dist/assets/index-*.js` 500kB 초과 → route/component 코드 스플리팅 검토
- `src/server/geminiRoutes.ts` 빈 stub 삭제 가능
- Slack 리드 알림 미활성 (`SLACK_WEBHOOK_URL` 미설정)
- 개인정보처리방침 DPO 이메일 플레이스홀더 (`PrivacyPolicyModal.tsx`)
- 커스텀 도메인 미연결 (`autohub.ai`)
