import { Router } from "express";
import type { AuthMiddleware } from "../../middleware/auth.js";
import { paginationQuerySchema } from "../../lib/pagination.js";
import { createReviewSchema } from "../reviews/reviews.schemas.js";
import type { ReviewsService } from "../reviews/reviews.service.js";
import type { ClicksService } from "../clicks/clicks.service.js";
import {
  createToolSchema,
  listToolsQuerySchema,
  toolSlugParamSchema,
  updateToolSchema,
} from "./tools.schemas.js";
import type { ToolsService } from "./tools.service.js";

export interface ToolsRouterDeps {
  tools: ToolsService;
  reviews: ReviewsService;
  clicks: ClicksService;
  auth: AuthMiddleware;
}

export function createToolsRouter(deps: ToolsRouterDeps): Router {
  const { tools, reviews, clicks, auth } = deps;
  const router = Router();

  // ── 툴 카탈로그 (읽기: 공개 / 쓰기: 관리자) ─────────────────────────────
  router.get("/", (req, res) => {
    const query = listToolsQuerySchema.parse(req.query);
    res.json(tools.list(query));
  });

  router.post("/", auth.requireAuth, auth.requireAdmin, (req, res) => {
    const input = createToolSchema.parse(req.body);
    res.status(201).json({ data: tools.create(input) });
  });

  router.get("/:slug", (req, res) => {
    const { slug } = toolSlugParamSchema.parse(req.params);
    res.json({ data: tools.getBySlug(slug) });
  });

  router.patch("/:slug", auth.requireAuth, auth.requireAdmin, (req, res) => {
    const { slug } = toolSlugParamSchema.parse(req.params);
    const input = updateToolSchema.parse(req.body);
    res.json({ data: tools.update(slug, input) });
  });

  router.delete("/:slug", auth.requireAuth, auth.requireAdmin, (req, res) => {
    const { slug } = toolSlugParamSchema.parse(req.params);
    tools.delete(slug);
    res.status(204).end();
  });

  // ── 툴 하위 리소스: 리뷰 ────────────────────────────────────────────────
  router.get("/:slug/reviews", (req, res) => {
    const { slug } = toolSlugParamSchema.parse(req.params);
    const query = paginationQuerySchema.parse(req.query);
    res.json(reviews.listForTool(slug, query));
  });

  router.post("/:slug/reviews", auth.requireAuth, (req, res) => {
    const { slug } = toolSlugParamSchema.parse(req.params);
    const input = createReviewSchema.parse(req.body);
    res.status(201).json({ data: reviews.createForTool(slug, req.user!, input) });
  });

  // ── 툴 하위 리소스: 제휴 클릭 이벤트 ────────────────────────────────────
  // sendBeacon(빈 본문 POST)도 받도록 body 없이 헤더에서만 컨텍스트를 수집한다.
  // 202 Accepted: "접수됨" — 분석용 이벤트라 즉시 처리 결과를 보장할 필요가 없다.
  router.post("/:slug/clicks", auth.optionalAuth, (req, res) => {
    const { slug } = toolSlugParamSchema.parse(req.params);
    clicks.record(slug, {
      userId: req.user?.id ?? null,
      referrer: req.header("referer")?.slice(0, 500) ?? null,
      userAgent: req.header("user-agent")?.slice(0, 300) ?? null,
    });
    res.status(202).json({ accepted: true });
  });

  return router;
}
