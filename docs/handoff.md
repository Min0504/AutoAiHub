# 인수인계

다음 작업자가 바로 할 일. 상세는 [../DEV_NOTES.md](../DEV_NOTES.md) §5 참고.

## 🔥 가장 먼저 (conductor 결정 사항)

1. **Dify 커미션 수치 확정** — 문서·프론트 문구에 반영할 수치 결정.
2. **Activepieces 제휴 신청 링크 확인** — 최신 신청 URL 확인 후 신청.
3. **배포** — PM만 실행. Vercel에 `SUPABASE_URL`/`SUPABASE_SERVICE_KEY`/`GROQ_API_KEY` 확인.

## 📋 그다음

1. **외부 링크 확보** — Okky/클리앙 소개글, 브런치/티스토리 비교 글.
2. **Zapier 제휴 코드** 수령 후 `affiliateLinks.ts` 반영.

## 💡 나중에

- 커스텀 도메인 연결(확정 후 `index.html`·`sitemap.xml`·`robots.txt`·`useSeoMeta.ts` BASE_URL 일괄 교체)
- Slack 알림 활성화(`SLACK_WEBHOOK_URL`)
- 공유 rate-limit 스토어(Upstash 등) 검토

## 주의

- 도메인 변경 시 `index.html`, `public/sitemap.xml`, `public/robots.txt`, `useSeoMeta.ts` 일괄 수정.
- 새 툴 추가 시 `public/sitemap.xml`·`index.html` ItemList 수동 업데이트.
- 실제 배포 실행은 conductor/PM만.
