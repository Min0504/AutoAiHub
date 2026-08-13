import { Router } from "express";
import type { AuthMiddleware } from "../../middleware/auth.js";
import { toolSlugParamSchema } from "../tools/tools.schemas.js";
import type { BookmarksService } from "./bookmarks.service.js";

/**
 * /api/v1/me/bookmarks — "내" 리소스 컬렉션.
 * PUT/DELETE가 멱등이도록 설계했다: 같은 요청을 여러 번 보내도 결과가 같다.
 * (네트워크 재시도에 안전한 API의 기본기)
 */
export function createBookmarksRouter(service: BookmarksService, auth: AuthMiddleware): Router {
  const router = Router();

  router.use(auth.requireAuth);

  router.get("/bookmarks", (req, res) => {
    res.json({ data: service.list(req.user!.id) });
  });

  router.put("/bookmarks/:slug", (req, res) => {
    const { slug } = toolSlugParamSchema.parse(req.params);
    service.add(req.user!.id, slug);
    res.status(204).end();
  });

  router.delete("/bookmarks/:slug", (req, res) => {
    const { slug } = toolSlugParamSchema.parse(req.params);
    service.remove(req.user!.id, slug);
    res.status(204).end();
  });

  return router;
}
