# 이슈

상세 맥락은 [../DEV_NOTES.md](../DEV_NOTES.md) §4 참고.

## 🟡 SEO

- Google 색인 대기 중 (요청 제출 완료, 수일 내 생성 예상)
- Sitemaps "가져올 수 없음" — 신규 사이트 처리 지연, 수일 내 자동 해결 예상
- OG 이미지 없음 — `public/og-image.png` (1200×630px) 필요

## 🟡 수익화

- 제휴사 부족: Make 1개뿐 — Activepieces, Dify 추가 신청 필요
- 트래픽 0: 콘텐츠(FAQ/가이드) 없으면 제휴 수익도 없음

## 🟢 낮은 우선순위

- `src/server/geminiRoutes.ts` 빈 stub 삭제 가능
- Slack 리드 알림 미활성 (`SLACK_WEBHOOK_URL` 미설정)
- 개인정보처리방침 DPO 이메일 플레이스홀더 (`PrivacyPolicyModal.tsx`)
- 커스텀 도메인 미연결 (`autohub.ai`)
