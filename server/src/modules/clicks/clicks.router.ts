import { Router } from "express";
import type { AuthMiddleware } from "../../middleware/auth.js";
import { clickStatsQuerySchema } from "./clicks.schemas.js";
import type { ClicksService } from "./clicks.service.js";

/** /api/v1/stats — 운영 지표. 수익 데이터이므로 관리자 전용. */
export function createStatsRouter(service: ClicksService, auth: AuthMiddleware): Router {
  const router = Router();

  router.get("/clicks", auth.requireAuth, auth.requireAdmin, (req, res) => {
    const query = clickStatsQuerySchema.parse(req.query);
    res.json(service.stats(query));
  });

  return router;
}
