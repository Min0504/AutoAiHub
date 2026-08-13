import type { ToolRow } from "./tools.repository.js";
import type {
  PricingDetails,
  ToolCategory,
  ToolDetail,
  ToolDifficulty,
  ToolListItem,
} from "./tools.types.js";

/**
 * DB row(snake_case, JSON 문자열) → API DTO(camelCase, 구조화된 객체) 매핑.
 * 내부 저장 형태와 외부 응답 계약(contract)을 분리하는 지점.
 * 컬럼을 명시적으로 골라 담으므로 새 내부 컬럼이 실수로 노출되지 않는다.
 */
export function toToolListItem(row: ToolRow): ToolListItem {
  return {
    slug: row.slug,
    name: row.name,
    category: row.category as ToolCategory,
    badge: row.badge,
    slogan: row.slogan,
    priceInfo: row.price_info,
    difficulty: row.difficulty as ToolDifficulty,
    difficultyLevel: row.difficulty_level,
    editorialRating: row.editorial_rating,
    bestFor: row.best_for,
    affiliateUrl: row.affiliate_url,
    logoColor: row.logo_color,
    logoTextColor: row.logo_text_color,
    reviewStats: {
      count: row.review_count,
      averageRating: row.review_avg === null ? null : Math.round(row.review_avg * 10) / 10,
    },
  };
}

export function toToolDetail(row: ToolRow): ToolDetail {
  return {
    ...toToolListItem(row),
    pricingDetails: JSON.parse(row.pricing_details) as PricingDetails,
    features: JSON.parse(row.features) as string[],
    pros: JSON.parse(row.pros) as string[],
    cons: JSON.parse(row.cons) as string[],
    aiIntegration: row.ai_integration,
    alternatives: JSON.parse(row.alternatives) as string[],
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}
