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
}

export function trackToolDetailView(toolId: string, toolName: string): void {
  track("tool_detail_view", { tool_id: toolId, tool_name: toolName });
}

export function trackCompareAdd(toolId: string, toolName: string): void {
  track("compare_add", { tool_id: toolId, tool_name: toolName });
}

export function trackScenarioGenerate(): void {
  track("scenario_generate");
}

export function trackProposalSubmit(budget: string, businessType: string): void {
  track("proposal_submit", { budget, business_type: businessType });
}

export function trackLeadSubmit(leadType: string): void {
  track("lead_submit", { lead_type: leadType });
}
