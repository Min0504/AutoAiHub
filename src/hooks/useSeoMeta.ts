import { useEffect } from "react";

const BASE_URL = "https://autohub-ai.vercel.app";

const DEFAULT_TITLE =
  "AutoHub AI — n8n·Make·Zapier 등 AI 업무 자동화 도구 비교 & ROI 계산기";
const DEFAULT_DESC =
  "n8n, Make, Zapier, CrewAI 등 16종 AI 업무 자동화 툴을 한국어로 비교하세요. 플랫폼 비용 절감 계산, 비즈니스 ROI 분석, 맞춤 워크플로우 설계 및 B2B 구축 견적까지 한 번에 제공합니다.";

const TAB_META: Record<string, { title: string; description: string }> = {
  compare: {
    title: "AI 자동화 툴 1:1 실시간 비교 — AutoHub AI",
    description:
      "n8n vs Make, Zapier vs n8n 등 AI 자동화 툴을 기능·가격·난이도로 1:1 직접 비교하세요.",
  },
  calculator: {
    title: "업무 자동화 ROI 계산기 — 비용 절감 분석 | AutoHub AI",
    description:
      "자동화 도입 시 월 인건비 절감액, ROI, 손익분기점을 무료로 계산하세요. Make·n8n·Zapier 비용 비교 포함.",
  },
  "ai-scenario": {
    title: "AI 워크플로우 자동화 시나리오 설계 — AutoHub AI",
    description:
      "업무를 설명하면 AI가 n8n·Make·Zapier 중 최적 툴과 워크플로우 시나리오를 설계해드립니다.",
  },
  consulting: {
    title: "자동화 도입 견적 & B2B 컨설팅 — AutoHub AI",
    description:
      "업종·예산에 맞는 AI 자동화 툴 추천과 도입 견적을 무료로 받아보세요.",
  },
  chat: {
    title: "AI 자동화 전문 상담사 — AutoHub AI",
    description:
      "n8n, Make, Zapier 등 자동화 툴 선택부터 구축 방법까지 AI 전문 상담사에게 무료로 물어보세요.",
  },
};

function setMeta(selector: string, attr: string, value: string) {
  const el = document.querySelector(selector);
  if (el) el.setAttribute(attr, value);
}

interface SeoOptions {
  toolSlug?: string | null;
  toolName?: string | null;
  toolSlogan?: string | null;
  toolBestFor?: string | null;
  activeTab?: string;
}

export function useSeoMeta({
  toolSlug,
  toolName,
  toolSlogan,
  toolBestFor,
  activeTab = "directory",
}: SeoOptions) {
  useEffect(() => {
    let title = DEFAULT_TITLE;
    let description = DEFAULT_DESC;
    let canonical = BASE_URL;
    let newUrl = "/";

    if (toolSlug && toolName) {
      // 툴 상세 페이지
      title = `${toolName} 사용법·가격·리뷰 — AutoHub AI`;
      description = toolBestFor
        ? `${toolName} ${toolSlogan ?? ""}. ${toolBestFor} | 가격, 기능, 장단점을 한국어로 비교하세요.`
        : `${toolName}: ${toolSlogan ?? ""}. 가격·기능·장단점을 한국어로 확인하고 ROI를 계산하세요.`;
      canonical = `${BASE_URL}/?tool=${toolSlug}`;
      newUrl = `/?tool=${toolSlug}`;
    } else if (activeTab !== "directory" && TAB_META[activeTab]) {
      title = TAB_META[activeTab].title;
      description = TAB_META[activeTab].description;
    }

    // document.title
    document.title = title;

    // <meta name="description">
    setMeta('meta[name="description"]', "content", description);

    // OG tags
    setMeta('meta[property="og:title"]', "content", title);
    setMeta('meta[property="og:description"]', "content", description);
    setMeta('meta[property="og:url"]', "content", canonical);

    // Twitter tags
    setMeta('meta[name="twitter:title"]', "content", title);
    setMeta('meta[name="twitter:description"]', "content", description);

    // canonical link
    setMeta('link[rel="canonical"]', "href", canonical);

    // URL bar (히스토리 스택 오염 없이 교체)
    if (window.location.pathname + window.location.search !== newUrl) {
      window.history.replaceState(null, "", newUrl);
    }
  }, [toolSlug, toolName, toolSlogan, toolBestFor, activeTab]);
}
