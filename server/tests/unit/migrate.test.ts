import { DatabaseSync } from "node:sqlite";
import { describe, expect, it } from "vitest";
import { runMigrations } from "../../src/db/migrate.js";
import { MIGRATIONS } from "../../src/db/migrations.js";

describe("migration runner", () => {
  it("빈 DB에 전체 마이그레이션을 적용한다", () => {
    const db = new DatabaseSync(":memory:");
    const applied = runMigrations(db);
    expect(applied).toBe(MIGRATIONS.length);

    const tables = db
      .prepare("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name")
      .all() as Array<{ name: string }>;
    const names = tables.map((t) => t.name);
    for (const expected of ["users", "refresh_tokens", "tools", "reviews", "bookmarks", "click_events"]) {
      expect(names).toContain(expected);
    }
  });

  it("멱등성: 두 번째 실행에서는 아무것도 적용하지 않는다", () => {
    const db = new DatabaseSync(":memory:");
    runMigrations(db);
    expect(runMigrations(db)).toBe(0);
  });

  it("적용 이력이 schema_migrations에 기록된다", () => {
    const db = new DatabaseSync(":memory:");
    runMigrations(db);
    const rows = db.prepare("SELECT id, name FROM schema_migrations ORDER BY id").all() as Array<{
      id: number;
      name: string;
    }>;
    expect(rows).toHaveLength(MIGRATIONS.length);
    expect(rows[0]).toMatchObject({ id: 1, name: "create-users-and-refresh-tokens" });
  });
});
