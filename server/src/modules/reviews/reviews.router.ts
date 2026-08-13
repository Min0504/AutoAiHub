import { Router } from "express";
import type { AuthMiddleware } from "../../middleware/auth.js";
import { reviewIdParamSchema, updateReviewSchema } from "./reviews.schemas.js";
import type { ReviewsService } from "./reviews.service.js";

/** 리뷰 생성/목록은 /tools/:slug/reviews (tools.router), 수정/삭제는 /reviews/:id (여기). */
export function createReviewsRouter(service: ReviewsService, auth: AuthMiddleware): Router {
  const router = Router();

  router.patch("/:id", auth.requireAuth, (req, res) => {
    const { id } = reviewIdParamSchema.parse(req.params);
    const input = updateReviewSchema.parse(req.body);
    res.json({ data: service.update(id, req.user!, input) });
  });

  router.delete("/:id", auth.requireAuth, (req, res) => {
    const { id } = reviewIdParamSchema.parse(req.params);
    service.delete(id, req.user!);
    res.status(204).end();
  });

  return router;
}
