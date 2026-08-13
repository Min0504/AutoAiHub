export const TOOL_CATEGORIES = [
  "Workflow Automation",
  "No-Code Automation",
  "AI Agents",
  "Developer Automation",
] as const;
export type ToolCategory = (typeof TOOL_CATEGORIES)[number];

export const TOOL_DIFFICULTIES = ["쉬움", "보통", "어려움"] as const;
export type ToolDifficulty = (typeof TOOL_DIFFICULTIES)[number];

export interface PricingDetails {
  free: string;
  starter: string;
  pro: string;
  pricingModel: string;
}

/** 사용자 리뷰 집계 — 에디터 평점(editorialRating)과 별개다. */
export interface ReviewStats {
  count: number;
  averageRating: number | null;
}

export interface ToolListItem {
  slug: string;
  name: string;
  category: ToolCategory;
  badge: string | null;
  slogan: string;
  priceInfo: string;
  difficulty: ToolDifficulty;
  difficultyLevel: number;
  editorialRating: number;
  bestFor: string;
  affiliateUrl: string;
  logoColor: string | null;
  logoTextColor: string | null;
  reviewStats: ReviewStats;
}

export interface ToolDetail extends ToolListItem {
  pricingDetails: PricingDetails;
  features: string[];
  pros: string[];
  cons: string[];
  aiIntegration: string;
  alternatives: string[];
  createdAt: string;
  updatedAt: string;
}
