# 진행상황

마지막 갱신: 2026-08-09

## 한 줄 요약

정적 재설계 라이브 반영 완료. 감사 후속(sitemap slug·compare URL·가격·문서) 패치 적용.

## 완료

- PR #4 → `master` 머지 (`e5b8a98`)
- 프로덕션 https://autohub-ai.vercel.app — 정적 비교·제휴 타이틀 확인됨
- sitemap `relay` → `relay-app` 수정, `?tab=compare` 추가
- Make/Zapier 가격 문구 갱신, 제휴 링크 단일 소스화
- smoke: slug↔sitemap·affiliate·compare URL 검증 추가

## 남은 것 (코드 밖 / PM)

- Zapier·Activepieces 제휴 코드 확보 시 `affiliateLinks.ts`의 `MONETIZED_AFFILIATE_KEYS` + 링크만 교체
- Vercel 옛 env(`GROQ_*`/`SUPABASE_*`/`SLACK_*`) 정리(선택)
- AutoHub용 Supabase 프로젝트 삭제 여부
- Search Console 색인·백링크, 쿠키 동의 후 GA4 로드 프로덕션 확인
