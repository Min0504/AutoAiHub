# 인수인계

다음 작업자가 바로 할 일. 상세는 [../DEV_NOTES.md](../DEV_NOTES.md) §5 참고.

## 🔥 가장 먼저 (SEO 콘텐츠)

1. **문서 정합성 유지** — FAQ 섹션, OG 이미지, Dify 제휴 링크는 이미 반영됨. 새 작업 전 실제 코드 상태와 문서가 어긋나지 않는지 먼저 확인.
2. **추가 성능 점검** — 메인 탭 외 화면은 지연 로딩으로 분리됨. 필요하면 추가적인 lazy 범위나 탭 전환 체감 성능을 점검.

## 📋 그다음 (수익화)

1. **제휴사 신청** — Activepieces(30% 반복) 추가 신청 검토. Dify는 이미 제휴 링크가 반영되어 있음.
2. **제휴 코드 수령 후 FE 반영** — 새 코드 받으면 `src/config/affiliateLinks.ts`와 `src/components/AffiliateBanner.tsx`를 함께 업데이트.
3. **외부 링크 확보** — 커뮤니티(Okky/클리앙) 소개글, 브런치/티스토리 비교 글.

## 💡 나중에

- 커스텀 도메인 연결(확정 후 도메인 플레이스홀더 일괄 교체)
- Slack 알림 활성화(`SLACK_WEBHOOK_URL`)
- Zapier 제휴 신청(월 1,000명 이상 확보 후)

## 주의

- 도메인 변경 시 `index.html`, `public/sitemap.xml`, `public/robots.txt`, `useSeoMeta.ts` 일괄 수정.
- 새 툴 추가 시 `public/sitemap.xml` 수동 업데이트 필요.

---

## 역할별 다음 과제

- frontend: `src/data/tools` 복구와 탭 단위 코드 스플릿은 완료됨. 다음은 문서 정합성 유지, 새 제휴 코드 수령 시 `src/config/affiliateLinks.ts` + `src/components/AffiliateBanner.tsx` 동시 반영
- backend: Activepieces(30% 반복) 제휴 신청 준비; 추가 코드 수령 시 FE와 연결 지점 확인
- security: Groq API 키 클라이언트 노출 여부 확인; Supabase service role key 서버 전용 유지 확인; 빌드 최종 확인
