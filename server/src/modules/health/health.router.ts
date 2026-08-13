import type { DatabaseSync } from "node:sqlite";
import { Router } from "express";

/**
 * - GET /health       (liveness)  : 프로세스가 살아있는가 — 로드밸런서/오케스트레이터용
 * - GET /health/ready (readiness) : 트래픽을 받을 준비가 됐는가 — DB 접근까지 확인
 * 이 둘을 구분해야 "프로세스는 살아있는데 DB가 죽은" 상태를 감지할 수 있다.
 */
export function createHealthRouter(db: DatabaseSync, version: string): Router {
  const router = Router();
  const startedAt = Date.now();

  router.get("/", (_req, res) => {
    res.json({
      status: "ok",
      version,
      uptimeSec: Math.floor((Date.now() - startedAt) / 1000),
    });
  });

  router.get("/ready", (_req, res) => {
    try {
      db.prepare("SELECT 1 AS ok").get();
      res.json({ status: "ready" });
    } catch {
      res.status(503).json({ status: "unavailable" });
    }
  });

  return router;
}
