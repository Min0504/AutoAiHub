import { recordToolClick } from "./apiClient";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

function track(eventName: string, params?: Record<string, unknown>): void {
  if (typeof window !== "undefined" && typeof window.gtag === "function") {
    window.gtag("event", eventName, params);
  }
}

export function trackAffiliateClick(toolId: string, toolName: string): void {
  track("affiliate_click", { tool_id: toolId, tool_name: toolName });
  // 백엔드 API가 설정된 경우 자체 클릭 통계에도 기록 (미설정 시 no-op)
  recordToolClick(toolId);
}

export function trackToolDetailView(toolId: string, toolName: string): void {
  track("tool_detail_view", { tool_id: toolId, tool_name: toolName });
}

export function trackCompareAdd(toolId: string, toolName: string): void {
  track("compare_add", { tool_id: toolId, tool_name: toolName });
}
