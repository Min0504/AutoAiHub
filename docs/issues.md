# 이슈

상세 맥락은 [../DEV_NOTES.md](../DEV_NOTES.md) §4 참고.

## 🟡 SEO

- Google 색인 대기 중 (요청 제출 완료, 수일 내 생성 예상)
- Sitemaps "가져올 수 없음" — 신규 사이트 처리 지연, 수일 내 자동 해결 예상

## 🟡 수익화

- 제휴사 확장 여지: Make, Dify 반영됨. Activepieces 등 추가 제휴 확보 필요
- 트래픽 확대 과제: FAQ와 가이드는 반영됐지만 외부 유입과 링크 확보는 여전히 부족

## 🟢 낮은 우선순위

- 추가 성능 최적화 여지 — 현재 build 경고는 해소됐고, 필요 시 탭 전환 체감 속도나 추가 분할 범위를 더 다듬을 수 있음
- `src/server/geminiRoutes.ts` 빈 stub 삭제 가능
- Slack 리드 알림 미활성 (`SLACK_WEBHOOK_URL` 미설정)
- 개인정보처리방침 DPO 이메일 플레이스홀더 (`PrivacyPolicyModal.tsx`)
- 커스텀 도메인 미연결 (`autohub.ai`)
