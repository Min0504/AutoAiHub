import type { DatabaseSync } from "node:sqlite";
import type { ToolRow } from "../tools/tools.repository.js";

export type BookmarkedToolRow = ToolRow & { bookmarked_at: string };

export class BookmarksRepository {
  constructor(private readonly db: DatabaseSync) {}

  /** INSERT OR IGNORE: 이미 북마크돼 있어도 에러 없이 통과 → PUT 멱등성 보장 */
  add(userId: number, toolId: number): void {
    this.db
      .prepare("INSERT OR IGNORE INTO bookmarks (user_id, tool_id) VALUES (?, ?)")
      .run(userId, toolId);
  }

  remove(userId: number, toolId: number): void {
    this.db.prepare("DELETE FROM bookmarks WHERE user_id = ? AND tool_id = ?").run(userId, toolId);
  }

  listByUser(userId: number): BookmarkedToolRow[] {
    return this.db
      .prepare(
        `SELECT
           t.*,
           COALESCE(r.review_count, 0) AS review_count,
           r.review_avg AS review_avg,
           b.created_at AS bookmarked_at
         FROM bookmarks b
         JOIN tools t ON t.id = b.tool_id
         LEFT JOIN (
           SELECT tool_id, COUNT(*) AS review_count, AVG(rating) AS review_avg
           FROM reviews
           GROUP BY tool_id
         ) r ON r.tool_id = t.id
         WHERE b.user_id = ?
         ORDER BY b.created_at DESC`,
      )
      .all(userId) as unknown as BookmarkedToolRow[];
  }
}
