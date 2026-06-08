# AutoHub AI

한국어 업무 자동화 도구 비교/상담 MVP입니다. n8n, Make, Zapier 등 자동화 플랫폼을 비교하고, ROI 계산과 Gemini 기반 워크플로우/견적 초안을 통해 B2B 상담 리드를 저장합니다.

## 주요 기능

- 자동화 툴 디렉토리와 1:1 비교
- Zapier 대체 비용, 자동화 ROI, AI 토큰 비용 계산
- Gemini 기반 맞춤 워크플로우 시나리오 생성
- B2B 구축 견적 초안 생성과 리드 JSONL 저장

## 로컬 실행

1. 의존성 설치: `npm install`
2. 환경변수 준비: `.env.example`을 참고해 `.env.local` 생성
3. 개발 서버 실행: `npm run dev`

리드는 기본적으로 `./data/leads.jsonl`에 저장됩니다. 프로덕션에서는 영구 볼륨, Supabase, Airtable, HubSpot, Google Sheets 등으로 교체하는 것을 권장합니다.
