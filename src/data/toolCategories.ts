import type { ToolCategory } from "./toolTypes";

export const CATEGORIES = [
  {
    id: "all",
    name: "전체 도구",
    desc: "노코드 자동화, AI 에이전트, 엔터프라이즈 내부 도구를 한 번에 비교합니다.",
  },
  {
    id: "Workflow Automation",
    name: "Workflow Automation",
    desc: "반복 업무를 시각적 워크플로우나 트리거 기반으로 자동화하는 플랫폼입니다.",
  },
  {
    id: "AI Agents",
    name: "AI Agents",
    desc: "LLM 중심 에이전트, 자율 실행, 멀티스텝 추론에 강한 도구 모음입니다.",
  },
  {
    id: "Developer Automation",
    name: "Developer Automation",
    desc: "코드 친화적 자동화와 이벤트 기반 파이프라인 설계에 적합한 도구입니다.",
  },
  {
    id: "Enterprise Automation",
    name: "Enterprise Automation",
    desc: "사내 시스템, 권한 체계, 운영 거버넌스를 중시하는 팀을 위한 선택지입니다.",
  },
] satisfies readonly ToolCategory[];
