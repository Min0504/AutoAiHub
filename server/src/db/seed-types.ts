import type { PricingDetails, ToolCategory, ToolDifficulty } from "../modules/tools/tools.types.js";

export interface ToolSeed {
  slug: string;
  name: string;
  category: ToolCategory;
  badge: string | null;
  slogan: string;
  priceInfo: string;
  pricingDetails: PricingDetails;
  difficulty: ToolDifficulty;
  difficultyLevel: number;
  editorialRating: number;
  features: string[];
  pros: string[];
  cons: string[];
  bestFor: string;
  aiIntegration: string;
  affiliateUrl: string;
  alternatives: string[];
  logoColor: string | null;
  logoTextColor: string | null;
}
