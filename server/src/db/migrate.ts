import type { DatabaseSync } from "node:sqlite";
import type { Logger } from "pino";
import { withTransaction } from "./client.js";
import { MIGRATIONS } from "./migrations.js";

/**
 * 미니멀 마이그레이션 러너.
 *
 * 동작:
 * 1. schema_migrations 테이블이 없으면 생성
 * 2. 아직 적용되지 않은 마이그레이션을 id 순서대로, 각각 트랜잭션 안에서 실행
 * 3. 실행 성공 시 이력 기록 — 실패하면 해당 마이그레이션 전체가 롤백된다
 *
 * Prisma/Drizzle 같은 도구가 해주는 일의 최소 골격을 직접 구현한 것.
 */
export function runMigrations(db: DatabaseSync, logger?: Logger): number {
  db.exec(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      id         INTEGER PRIMARY KEY,
      name       TEXT NOT NULL,
      applied_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
    );
  `);

  const appliedRows = db.prepare("SELECT id FROM schema_migrations ORDER BY id").all() as Array<{
    id: number;
  }>;
  const appliedIds = new Set(appliedRows.map((r) => r.id));

  const sorted = [...MIGRATIONS].sort((a, b) => a.id - b.id);
  sorted.forEach((migration, index) => {
    if (migration.id !== index + 1) {
      throw new Error(`Migration ids must be contiguous starting at 1 (found ${migration.id} at position ${index})`);
    }
  });

  let appliedCount = 0;
  for (const migration of sorted) {
    if (appliedIds.has(migration.id)) continue;

    withTransaction(db, () => {
      db.exec(migration.up);
      db.prepare("INSERT INTO schema_migrations (id, name) VALUES (?, ?)").run(
        migration.id,
        migration.name,
      );
    });
    appliedCount += 1;
    logger?.info({ id: migration.id, name: migration.name }, "migration applied");
  }

  return appliedCount;
}
