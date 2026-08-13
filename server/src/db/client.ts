import { mkdirSync } from "node:fs";
import { dirname } from "node:path";
import { DatabaseSync } from "node:sqlite";

/**
 * SQLite 커넥션 (Node 26 내장 node:sqlite — 외부 의존성 0).
 *
 * PRAGMA 설명:
 * - journal_mode=WAL : 읽기/쓰기 동시성 향상. 운영 SQLite의 사실상 표준.
 * - foreign_keys=ON  : SQLite는 기본값이 OFF라서 켜지 않으면 FK 제약이 무시된다!
 * - busy_timeout     : 잠금 경합 시 즉시 실패하지 않고 대기.
 */
export function openDatabase(path: string): DatabaseSync {
  if (path !== ":memory:") {
    mkdirSync(dirname(path), { recursive: true });
  }
  const db = new DatabaseSync(path);
  db.exec("PRAGMA journal_mode = WAL;");
  db.exec("PRAGMA foreign_keys = ON;");
  db.exec("PRAGMA busy_timeout = 5000;");
  return db;
}

/**
 * 수동 트랜잭션 헬퍼.
 * 여러 쓰기가 "전부 성공 or 전부 롤백"이어야 할 때 사용한다 (원자성).
 * 예: refresh token 회전 = 기존 토큰 폐기 + 새 토큰 저장이 한 단위.
 */
export function withTransaction<T>(db: DatabaseSync, fn: () => T): T {
  db.exec("BEGIN");
  try {
    const result = fn();
    db.exec("COMMIT");
    return result;
  } catch (err) {
    db.exec("ROLLBACK");
    throw err;
  }
}
