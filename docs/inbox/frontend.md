# frontend inbox — AutoAiHub

> 이 파일은 AutoAiHub-frontend 세션만 쓴다. conductor가 읽어 docs/progress·issues·handoff로 종합한다.
> 다른 세션·다른 프로젝트는 이 파일을 건드리지 않는다.

상태: 🔄 작업중   <!-- ⏸ 대기 | 🔄 작업중 | ✅ 완료(YYYY-MM-DD HH:MM) | ⚠️ 블록 -->

## 한 일 / 진행
- `src/data/tools` 누락 문제 복구: `src/data/toolTypes.ts`, `src/data/toolCategories.ts`, `src/data/workflowTools.ts`, `src/data/agentTools.ts`, `src/data/tools.ts` 추가로 프론트 카탈로그 복원
- `src/App.tsx`에 탭/모달 단위 `React.lazy` + `Suspense` 적용으로 무거운 화면(`CompareSection`, `CalculatorSection`, `AIChatBot`, `ConsultingSection`) 지연 로딩 처리
- 메인 FAQ 섹션에 검색 키워드 `n8n vs Make`, `Zapier 무료 대안`, `업무 자동화 시작법` 노출되도록 `src/components/FaqSection.tsx`와 `index.html` FAQ JSON-LD 동기화
- `public/og-image.png` 상태 확인 완료: 1200x630 PNG 파일 이미 존재
- `docs/handoff.md`, `docs/progress.md`, `docs/issues.md`를 실제 FE 상태에 맞게 갱신

## 발견한 문제 / 위험
- 초기 번들 경고는 코드 스플릿으로 해소됨. 다만 필요 시 탭 전환 체감 성능과 추가 lazy 범위는 더 다듬을 수 있음.
- 새 제휴 코드 수령 시 `src/config/affiliateLinks.ts`와 `src/components/AffiliateBanner.tsx`를 함께 수정해야 함.

## conductor에게 넘길 것 (다음작업 · 주의점 · 연결이슈)
- 현재 FE 기준 핵심 미해결 이슈는 없음
- 다음 우선순위는 문서 정합성 유지, 제휴 코드 수령 시 배너/링크 반영, 필요 시 추가 성능 미세조정
- 최근 검증: `npm run lint` 통과, `npm run build` 통과
