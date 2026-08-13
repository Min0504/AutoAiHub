import type { DatabaseSync } from "node:sqlite";
import type { Pagination } from "../../lib/pagination.js";

export interface ReviewRow {
  id: number;
  tool_id: number;
  user_id: number;
  rating: number;
  content: string;
  created_at: string;
  updated_at: string;
  /** JOIN users */
  author_nickname: string;
  /** JOIN tools */
  tool_slug: string;
}

const BASE_SELECT = `
  SELECT r.*, u.nickname AS author_nickname, t.slug AS tool_slug
  FROM reviews r
  JOIN users u ON u.id = r.user_id
  JOIN tools t ON t.id = r.tool_id
`;

export class ReviewsRepository {
  constructor(private readonly db: DatabaseSync) {}

  listByToolId(toolId: number, pagination: Pagination): ReviewRow[] {
    return this.db
      .prepare(`${BASE_SELECT} WHERE r.tool_id = ? ORDER BY r.created_at DESC, r.id DESC LIMIT ? OFFSET ?`)
      .all(toolId, pagination.limit, pagination.offset) as unknown as ReviewRow[];
  }

  countByToolId(toolId: number): number {
    const row = this.db
      .prepare("SELECT COUNT(*) AS total FROM reviews WHERE tool_id = ?")
      .get(toolId) as { total: number };
    return row.total;
  }

  findById(id: number): ReviewRow | undefined {
    return this.db.prepare(`${BASE_SELECT} WHERE r.id = ?`).get(id) as ReviewRow | undefined;
  }

  existsByToolAndUser(toolId: number, userId: number): boolean {
    const row = this.db
      .prepare("SELECT 1 AS found FROM reviews WHERE tool_id = ? AND user_id = ?")
      .get(toolId, userId);
    return row !== undefined;
  }

  create(input: { toolId: number; userId: number; rating: number; content: string }): ReviewRow {
    const result = this.db
      .prepare("INSERT INTO reviews (tool_id, user_id, rating, content) VALUES (?, ?, ?, ?)")
      .run(input.toolId, input.userId, input.rating, input.content);
    const created = this.findById(Number(result.lastInsertRowid));
    if (!created) throw new Error("failed to load created review");
    return created;
  }

  update(id: number, input: { rating?: number; content?: string }): ReviewRow | undefined {
    const assignments: string[] = [];
    const params: Array<string | number> = [];
    if (input.rating !== undefined) {
      assignments.push("rating = ?");
      params.push(input.rating);
    }
    if (input.content !== undefined) {
      assignments.push("content = ?");
      params.push(input.content);
    }
    if (assignments.length === 0) return this.findById(id);

    assignments.push("updated_at = strftime('%Y-%m-%dT%H:%M:%fZ', 'now')");
    this.db.prepare(`UPDATE reviews SET ${assignments.join(", ")} WHERE id = ?`).run(...params, id);
    return this.findById(id);
  }

  delete(id: number): boolean {
    const result = this.db.prepare("DELETE FROM reviews WHERE id = ?").run(id);
    return Number(result.changes) > 0;
  }
}
