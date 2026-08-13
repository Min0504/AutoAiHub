import type { DatabaseSync } from "node:sqlite";

export interface ClickStatsByToolRow {
  slug: string;
  name: string;
  count: number;
}

export interface ClickStatsByDayRow {
  day: string;
  count: number;
}

export class ClicksRepository {
  constructor(private readonly db: DatabaseSync) {}

  record(input: {
    toolId: number;
    userId: number | null;
    referrer: string | null;
    userAgent: string | null;
  }): void {
    this.db
      .prepare(
        "INSERT INTO click_events (tool_id, user_id, referrer, user_agent) VALUES (?, ?, ?, ?)",
      )
      .run(input.toolId, input.userId, input.referrer, input.userAgent);
  }

  /** created_at은 ISO-8601 TEXT이므로 문자열 범위 비교가 시간 순 비교와 일치한다. */
  statsByTool(fromIso: string, toExclusiveIso: string): ClickStatsByToolRow[] {
    return this.db
      .prepare(
        `SELECT t.slug AS slug, t.name AS name, COUNT(e.id) AS count
         FROM click_events e
         JOIN tools t ON t.id = e.tool_id
         WHERE e.created_at >= ? AND e.created_at < ?
         GROUP BY e.tool_id
         ORDER BY count DESC, t.slug ASC`,
      )
      .all(fromIso, toExclusiveIso) as unknown as ClickStatsByToolRow[];
  }

  statsByDay(fromIso: string, toExclusiveIso: string): ClickStatsByDayRow[] {
    return this.db
      .prepare(
        `SELECT substr(created_at, 1, 10) AS day, COUNT(*) AS count
         FROM click_events
         WHERE created_at >= ? AND created_at < ?
         GROUP BY day
         ORDER BY day ASC`,
      )
      .all(fromIso, toExclusiveIso) as unknown as ClickStatsByDayRow[];
  }

  totalInRange(fromIso: string, toExclusiveIso: string): number {
    const row = this.db
      .prepare("SELECT COUNT(*) AS total FROM click_events WHERE created_at >= ? AND created_at < ?")
      .get(fromIso, toExclusiveIso) as { total: number };
    return row.total;
  }
}
