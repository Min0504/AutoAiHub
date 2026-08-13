import { pino } from "pino";
import { buildApp } from "./app.js";
import { loadEnv } from "./config/env.js";
import { openDatabase } from "./db/client.js";
import { runMigrations } from "./db/migrate.js";
import { seedDatabase } from "./db/seed.js";

/**
 * 부트스트랩 순서: env 검증 → DB 열기 → 마이그레이션 → 시드 → HTTP 리슨.
 * 어느 단계든 실패하면 기동을 중단한다 (fail-fast).
 */
async function main(): Promise<void> {
  const env = loadEnv();

  const logger = pino({
    level: env.logLevel,
    // 개발에서는 사람이 읽기 좋은 pretty 출력, 운영에서는 수집기용 JSON 그대로.
    ...(env.nodeEnv === "development"
      ? { transport: { target: "pino-pretty", options: { translateTime: "SYS:HH:MM:ss" } } }
      : {}),
  });

  const db = openDatabase(env.databasePath);
  const applied = runMigrations(db, logger);
  logger.info({ applied, databasePath: env.databasePath }, "database ready");

  await seedDatabase(db, env, logger);

  const app = buildApp({ env, db, logger });
  const server = app.listen(env.port, () => {
    logger.info({ port: env.port, docs: `http://localhost:${env.port}/api/docs` }, "autohub-api listening");
  });

  /**
   * Graceful shutdown:
   * 새 연결은 거부하고, 처리 중인 요청은 끝까지 응답한 뒤 DB를 닫고 종료한다.
   * 배포/재시작 시 사용자 요청이 도중에 끊기지 않게 하는 운영 기본기.
   */
  let shuttingDown = false;
  const shutdown = (signal: string): void => {
    if (shuttingDown) return;
    shuttingDown = true;
    logger.info({ signal }, "shutting down");

    server.close((err) => {
      try {
        db.close();
      } catch {
        // 이미 닫혔으면 무시
      }
      process.exit(err ? 1 : 0);
    });

    // 10초 내에 안 끝나면 강제 종료 (좀비 프로세스 방지)
    setTimeout(() => {
      logger.error("forced shutdown after timeout");
      process.exit(1);
    }, 10_000).unref();
  };

  process.on("SIGINT", () => shutdown("SIGINT"));
  process.on("SIGTERM", () => shutdown("SIGTERM"));
}

main().catch((err: unknown) => {
  console.error("fatal: failed to start server\n", err);
  process.exit(1);
});
