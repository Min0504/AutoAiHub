# 이슈

## 백엔드 (2026-08-13)

- 백엔드 실배포 미정 — Docker/compose는 준비됨. 호스팅(Fly.io/Railway 등)과 비용은 PM 결정
- 레이트 리밋이 인메모리 — 다중 인스턴스로 확장 시 Redis 전환 필요 (learning-roadmap 과제)
- refresh token을 응답 body로 전달 — HttpOnly 쿠키 + CSRF 방어 전환은 연습과제로 남김

## 운영

- 쿠키 동의 후 GA4만 로드되는지 프로덕션에서 주기 확인
- `npm audit` 프론트 개발 의존성 경고는 빌드 산출물에 영향 없는 수준인지 확인 후 정리

## 수익화

- Zapier·Activepieces 제휴 코드 확보 시 `src/config/affiliateLinks.ts` + 배너만 수정
- 백엔드 배포 후에는 자체 클릭 통계(`GET /api/v1/stats/clicks`)로 제휴 성과 측정 가능

## SEO

- Search Console 색인·외부 백링크는 콘텐츠/홍보 작업
