import { useEffect } from "react";

const BASE_URL = "https://autohub-ai.vercel.app";

const DEFAULT_TITLE =
  "AutoHub AI — n8n·Make·Zapier 등 AI 업무 자동화 도구 비교";
const DEFAULT_DESC =
  "n8n, Make, Zapier, CrewAI 등 16종 AI 업무 자동화 툴을 한국어로 비교하세요. 기능·가격·난이도 기준으로 골라 제휴 링크로 바로 시작할 수 있습니다.";

const TAB_META: Record<string, { title: string; description: string }> = {
  compare: {
    title: "AI 자동화 툴 1:1 실시간 비교 — AutoHub AI",
    description:
      "n8n vs Make, Zapier vs n8n 등 AI 자동화 툴을 기능·가격·난이도로 1:1 직접 비교하세요.",
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

    if (toolSlug && toolName) {
      title = `${toolName} 리뷰·가격·대안 비교 — AutoHub AI`;
      description = [
        toolSlogan,
        toolBestFor ? `추천 대상: ${toolBestFor}` : null,
        `${toolName}의 기능·가격·난이도를 확인하고 비슷한 자동화 툴과 비교하세요.`,
      ]
        .filter(Boolean)
        .join(" ");
      canonical = `${BASE_URL}/?tool=${toolSlug}`;
    } else if (activeTab !== "directory" && TAB_META[activeTab]) {
      title = TAB_META[activeTab].title;
      description = TAB_META[activeTab].description;
    }

    document.title = title;
    setMeta('meta[name="description"]', "content", description);
    setMeta('link[rel="canonical"]', "href", canonical);
    setMeta('meta[property="og:title"]', "content", title);
    setMeta('meta[property="og:description"]', "content", description);
    setMeta('meta[property="og:url"]', "content", canonical);
    setMeta('meta[name="twitter:title"]', "content", title);
    setMeta('meta[name="twitter:description"]', "content", description);

    if (toolSlug) {
      const url = new URL(window.location.href);
      url.searchParams.set("tool", toolSlug);
      window.history.replaceState({}, "", `${url.pathname}${url.search}`);
    } else if (new URLSearchParams(window.location.search).has("tool")) {
      window.history.replaceState({}, "", "/");
    }
  }, [toolSlug, toolName, toolSlogan, toolBestFor, activeTab]);
}
