# 이슈

상세 맥락은 [../DEV_NOTES.md](../DEV_NOTES.md) §4 참고.

## 🟡 SEO

- Google 색인 대기 중 (요청 제출 완료, 수일 내 생성 예상)
- Sitemaps "가져올 수 없음" — 신규 사이트 처리 지연, 수일 내 자동 해결 예상

## 🟡 수익화 / 제휴

- Dify 커미션 수치 불일치: handoff에 20% 기재, 공식 페이지는 30-50% → conductor 결정 필요
- Activepieces 공식 제휴 신청 URL 불명확 → 수동 확인 후 신청
- Zapier 제휴 코드 미발급 — 코드 받으면 `src/config/affiliateLinks.ts` 반영

## 🟢 낮은 우선순위

- Slack 리드 알림 미활성 (`SLACK_WEBHOOK_URL` 미설정)
- 커스텀 도메인 미연결 (`autohub.ai`)
- Vercel 인메모리 rate limit은 인스턴스 단위 — 필요 시 Upstash 등 공유 스토어 검토
