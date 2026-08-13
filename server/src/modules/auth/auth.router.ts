import { Router } from "express";
import type { AuthMiddleware } from "../../middleware/auth.js";
import { loginSchema, refreshSchema, registerSchema } from "./auth.schemas.js";
import type { AuthService } from "./auth.service.js";

/**
 * Router 계층: HTTP만 담당한다.
 * (요청 파싱/검증 → 서비스 호출 → 상태코드/응답 직렬화. 비즈니스 로직 금지)
 */
export function createAuthRouter(service: AuthService, auth: AuthMiddleware): Router {
  const router = Router();

  router.post("/register", async (req, res) => {
    const input = registerSchema.parse(req.body);
    const result = await service.register(input);
    res.status(201).json(result);
  });

  router.post("/login", async (req, res) => {
    const input = loginSchema.parse(req.body);
    const result = await service.login(input);
    res.json(result);
  });

  router.post("/refresh", (req, res) => {
    const input = refreshSchema.parse(req.body);
    const tokens = service.refresh(input.refreshToken);
    res.json({ tokens });
  });

  router.post("/logout", (req, res) => {
    const input = refreshSchema.parse(req.body);
    service.logout(input.refreshToken);
    res.status(204).end();
  });

  router.get("/me", auth.requireAuth, (req, res) => {
    // requireAuth를 통과했으므로 req.user는 반드시 존재한다.
    const user = service.me(req.user!.id);
    res.json({ user });
  });

  return router;
}
