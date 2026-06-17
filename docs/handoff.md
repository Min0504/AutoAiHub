# 인수인계

다음 작업자가 바로 할 일. 상세는 [../DEV_NOTES.md](../DEV_NOTES.md) §5 참고.

## 🔥 가장 먼저 (SEO 콘텐츠)

1. **FAQ 섹션 추가** — 메인 페이지 하단. "n8n vs Make", "Zapier 무료 대안", "업무 자동화 시작법" 키워드가 HTML 텍스트로 존재해야 검색 유입 가능.
2. **OG 이미지 제작** — 1200×630px PNG, `public/og-image.png`.

## 📋 그다음 (수익화)

1. **제휴사 신청** — Activepieces(30% 반복), Dify(20% 반복). 코드 받으면 `src/config/affiliateLinks.ts` + `AffiliateBanner.tsx` 업데이트.
2. **외부 링크 확보** — 커뮤니티(Okky/클리앙) 소개글, 브런치/티스토리 비교 글.

## 💡 나중에

- 커스텀 도메인 연결(확정 후 도메인 플레이스홀더 일괄 교체)
- Slack 알림 활성화(`SLACK_WEBHOOK_URL`)
- Zapier 제휴 신청(월 1,000명 이상 확보 후)

## 주의

- 도메인 변경 시 `index.html`, `public/sitemap.xml`, `public/robots.txt`, `useSeoMeta.ts` 일괄 수정.
- 새 툴 추가 시 `public/sitemap.xml` 수동 업데이트 필요.

---

## 역할별 다음 과제

- frontend: FAQ 섹션 추가 (메인 페이지 하단 — "n8n vs Make", "Zapier 무료 대안", "업무 자동화 시작법" 키워드 HTML 텍스트); OG 이미지 `public/og-image.png` 1200×630 제작
- backend: Activepieces(30% 반복)·Dify(20% 반복) 제휴 신청 준비; 코드 받으면 `src/config/affiliateLinks.ts` + `AffiliateBanner.tsx` 업데이트
- security: Groq API 키 클라이언트 노출 여부 확인; Supabase service role key 서버 전용 유지 확인; 빌드 최종 확인
