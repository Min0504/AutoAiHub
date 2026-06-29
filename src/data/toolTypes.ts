export type ToolDifficulty = "쉬움" | "보통" | "어려움";

export type ToolPricingDetails = {
  readonly free: string;
  readonly starter: string;
  readonly pro: string;
  readonly pricingModel: string;
};

export type Tool = {
  readonly id: string;
  readonly slug: string;
  readonly name: string;
  readonly category: string;
  readonly slogan: string;
  readonly badge?: string;
  readonly difficulty: ToolDifficulty;
  readonly difficultyLevel: 1 | 2 | 3 | 4 | 5;
  readonly rating: number;
  readonly priceInfo: string;
  readonly pricingDetails: ToolPricingDetails;
  readonly features: readonly string[];
  readonly pros: readonly string[];
  readonly cons: readonly string[];
  readonly alternatives: readonly string[];
  readonly bestFor: string;
  readonly aiIntegration: string;
  readonly affiliateUrl: string;
  readonly logoColor: string;
  readonly logoTextColor: string;
};

export type ToolCategory = {
  readonly id: string;
  readonly name: string;
  readonly desc: string;
};
