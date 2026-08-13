import type { DatabaseSync } from "node:sqlite";
import { escapeLike, type Pagination } from "../../lib/pagination.js";
import type { CreateToolInput, ListToolsQuery, UpdateToolInput } from "./tools.schemas.js";

export interface ToolRow {
  id: number;
  slug: string;
  name: string;
  category: string;
  badge: string | null;
  slogan: string;
  price_info: string;
  pricing_details: string;
  difficulty: string;
  difficulty_level: number;
  editorial_rating: number;
  features: string;
  pros: string;
  cons: string;
  best_for: string;
  ai_integration: string;
  affiliate_url: string;
  alternatives: string;
  logo_color: string | null;
  logo_text_color: string | null;
  created_at: string;
  updated_at: string;
  review_count: number;
  review_avg: number | null;
}

/**
 * ORDER BY는 파라미터 바인딩이 불가능하므로 반드시 화이트리스트 매핑을 거친다.
 * (사용자 입력을 그대로 ORDER BY에 넣으면 SQL Injection)
 */
const SORT_COLUMNS: Record<ListToolsQuery["sort"], string> = {
  rating: "t.editorial_rating",
  difficulty: "t.difficulty_level",
  name: "t.name",
  createdAt: "t.created_at",
  reviews: "review_count",
};

const BASE_SELECT = `
  SELECT
    t.*,
    COALESCE(r.review_count, 0) AS review_count,
    r.review_avg AS review_avg
  FROM tools t
  LEFT JOIN (
    SELECT tool_id, COUNT(*) AS review_count, AVG(rating) AS review_avg
    FROM reviews
    GROUP BY tool_id
  ) r ON r.tool_id = t.id
`;

export class ToolsRepository {
  constructor(private readonly db: DatabaseSync) {}

  list(query: ListToolsQuery, pagination: Pagination): { rows: ToolRow[]; total: number } {
    const where: string[] = [];
    const params: Array<string | number> = [];

    if (query.category) {
      where.push("t.category = ?");
      params.push(query.category);
    }
    if (query.difficulty) {
      where.push("t.difficulty = ?");
      params.push(query.difficulty);
    }
    if (query.q) {
      where.push("(t.name LIKE ? ESCAPE '\\' OR t.slogan LIKE ? ESCAPE '\\' OR t.best_for LIKE ? ESCAPE '\\')");
      const term = `%${escapeLike(query.q)}%`;
      params.push(term, term, term);
    }

    const whereSql = where.length > 0 ? `WHERE ${where.join(" AND ")}` : "";
    const direction = query.order === "asc" ? "ASC" : "DESC";
    // 정렬 키가 같은 행의 순서가 요청마다 흔들리지 않도록 id로 2차 정렬(tie-breaker)한다.
    const orderSql = `ORDER BY ${SORT_COLUMNS[query.sort]} ${direction}, t.id ASC`;

    const rows = this.db
      .prepare(`${BASE_SELECT} ${whereSql} ${orderSql} LIMIT ? OFFSET ?`)
      .all(...params, pagination.limit, pagination.offset) as unknown as ToolRow[];

    const totalRow = this.db
      .prepare(`SELECT COUNT(*) AS total FROM tools t ${whereSql}`)
      .get(...params) as { total: number };

    return { rows, total: totalRow.total };
  }

  findBySlug(slug: string): ToolRow | undefined {
    return this.db.prepare(`${BASE_SELECT} WHERE t.slug = ?`).get(slug) as ToolRow | undefined;
  }

  findIdBySlug(slug: string): number | undefined {
    const row = this.db.prepare("SELECT id FROM tools WHERE slug = ?").get(slug) as
      | { id: number }
      | undefined;
    return row?.id;
  }

  create(input: CreateToolInput): ToolRow {
    this.db
      .prepare(
        `INSERT INTO tools (
          slug, name, category, badge, slogan, price_info, pricing_details,
          difficulty, difficulty_level, editorial_rating,
          features, pros, cons, best_for, ai_integration, affiliate_url,
          alternatives, logo_color, logo_text_color
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      )
      .run(
        input.slug,
        input.name,
        input.category,
        input.badge,
        input.slogan,
        input.priceInfo,
        JSON.stringify(input.pricingDetails),
        input.difficulty,
        input.difficultyLevel,
        input.editorialRating,
        JSON.stringify(input.features),
        JSON.stringify(input.pros),
        JSON.stringify(input.cons),
        input.bestFor,
        input.aiIntegration,
        input.affiliateUrl,
        JSON.stringify(input.alternatives),
        input.logoColor,
        input.logoTextColor,
      );
    const created = this.findBySlug(input.slug);
    if (!created) throw new Error("failed to load created tool");
    return created;
  }

  update(slug: string, input: UpdateToolInput): ToolRow | undefined {
    // 동적 SET 절 — 컬럼명은 이 매핑 테이블에서만 나오므로 안전하다.
    const assignments: string[] = [];
    const params: Array<string | number | null> = [];

    const fieldMap: Array<[keyof UpdateToolInput, string, (v: unknown) => string | number | null]> = [
      ["name", "name", asIs],
      ["category", "category", asIs],
      ["badge", "badge", asIs],
      ["slogan", "slogan", asIs],
      ["priceInfo", "price_info", asIs],
      ["pricingDetails", "pricing_details", asJson],
      ["difficulty", "difficulty", asIs],
      ["difficultyLevel", "difficulty_level", asIs],
      ["editorialRating", "editorial_rating", asIs],
      ["features", "features", asJson],
      ["pros", "pros", asJson],
      ["cons", "cons", asJson],
      ["bestFor", "best_for", asIs],
      ["aiIntegration", "ai_integration", asIs],
      ["affiliateUrl", "affiliate_url", asIs],
      ["alternatives", "alternatives", asJson],
      ["logoColor", "logo_color", asIs],
      ["logoTextColor", "logo_text_color", asIs],
    ];

    for (const [key, column, serialize] of fieldMap) {
      if (key in input && input[key] !== undefined) {
        assignments.push(`${column} = ?`);
        params.push(serialize(input[key]));
      }
    }
    if (assignments.length === 0) return this.findBySlug(slug);

    assignments.push("updated_at = strftime('%Y-%m-%dT%H:%M:%fZ', 'now')");
    const result = this.db
      .prepare(`UPDATE tools SET ${assignments.join(", ")} WHERE slug = ?`)
      .run(...params, slug);

    if (Number(result.changes) === 0) return undefined;
    return this.findBySlug(slug);
  }

  delete(slug: string): boolean {
    const result = this.db.prepare("DELETE FROM tools WHERE slug = ?").run(slug);
    return Number(result.changes) > 0;
  }
}

function asIs(v: unknown): string | number | null {
  return v as string | number | null;
}

function asJson(v: unknown): string {
  return JSON.stringify(v);
}
