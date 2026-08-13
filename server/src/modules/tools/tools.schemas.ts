import { z } from "zod";
import { paginationQuerySchema } from "../../lib/pagination.js";
import { TOOL_CATEGORIES, TOOL_DIFFICULTIES } from "./tools.types.js";

export const toolSortKeys = ["rating", "difficulty", "name", "createdAt", "reviews"] as const;

export const listToolsQuerySchema = paginationQuerySchema.extend({
  category: z.enum(TOOL_CATEGORIES).optional(),
  difficulty: z.enum(TOOL_DIFFICULTIES).optional(),
  /** 이름/슬로건/추천대상 부분 일치 검색 */
  q: z.string().trim().min(1).max(100).optional(),
  sort: z.enum(toolSortKeys).default("rating"),
  order: z.enum(["asc", "desc"]).default("desc"),
});
export type ListToolsQuery = z.infer<typeof listToolsQuerySchema>;

export const toolSlugParamSchema = z.object({
  slug: z
    .string()
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "slug는 소문자·숫자·하이픈만 허용됩니다.")
    .max(64),
});

const pricingDetailsSchema = z.object({
  free: z.string().min(1).max(500),
  starter: z.string().min(1).max(500),
  pro: z.string().min(1).max(500),
  pricingModel: z.string().min(1).max(500),
});

/**
 * 기본값(default) 없는 순수 필드 스키마.
 * PATCH용 partial()에 default가 섞이면 "빈 body인데 기본값이 주입되어
 * 기존 데이터를 덮어쓰는" 버그가 생기므로, default는 create 쪽에서만 붙인다.
 */
const toolFieldsSchema = z.object({
  name: z.string().trim().min(1).max(100),
  category: z.enum(TOOL_CATEGORIES),
  badge: z.string().trim().min(1).max(60).nullable(),
  slogan: z.string().trim().min(1).max(300),
  priceInfo: z.string().trim().min(1).max(200),
  pricingDetails: pricingDetailsSchema,
  difficulty: z.enum(TOOL_DIFFICULTIES),
  difficultyLevel: z.number().int().min(1).max(5),
  editorialRating: z.number().min(0).max(5),
  features: z.array(z.string().min(1).max(300)).min(1).max(20),
  pros: z.array(z.string().min(1).max(500)).min(1).max(20),
  cons: z.array(z.string().min(1).max(500)).min(1).max(20),
  bestFor: z.string().trim().min(1).max(1000),
  aiIntegration: z.string().trim().min(1).max(2000),
  affiliateUrl: z.url("올바른 URL이 아닙니다.").max(500),
  alternatives: z.array(toolSlugParamSchema.shape.slug).max(10),
  logoColor: z.string().max(60).nullable(),
  logoTextColor: z.string().max(60).nullable(),
});

export const createToolSchema = toolFieldsSchema.extend({
  slug: toolSlugParamSchema.shape.slug,
  badge: toolFieldsSchema.shape.badge.default(null),
  alternatives: toolFieldsSchema.shape.alternatives.default([]),
  logoColor: toolFieldsSchema.shape.logoColor.default(null),
  logoTextColor: toolFieldsSchema.shape.logoTextColor.default(null),
});
export type CreateToolInput = z.infer<typeof createToolSchema>;

/** PATCH: slug를 제외한 모든 필드를 부분 수정할 수 있다. */
export const updateToolSchema = toolFieldsSchema.partial().refine(
  (value) => Object.keys(value).length > 0,
  { message: "수정할 필드가 최소 1개 필요합니다." },
);
export type UpdateToolInput = z.infer<typeof updateToolSchema>;
