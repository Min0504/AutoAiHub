import type { DatabaseSync } from "node:sqlite";
import cors from "cors";
import express, { Router, type Express } from "express";
import helmet from "helmet";
import type { Logger } from "pino";
import type { Env } from "./config/env.js";
import { createAuthMiddleware } from "./middleware/auth.js";
import { errorHandler, notFoundHandler } from "./middleware/error-handler.js";
import { createRateLimiter } from "./middleware/rate-limit.js";
import { requestId } from "./middleware/request-id.js";
import { requestLogger } from "./middleware/request-logger.js";
import { AuthRepository } from "./modules/auth/auth.repository.js";
import { createAuthRouter } from "./modules/auth/auth.router.js";
import { AuthService } from "./modules/auth/auth.service.js";
import { BookmarksRepository } from "./modules/bookmarks/bookmarks.repository.js";
import { createBookmarksRouter } from "./modules/bookmarks/bookmarks.router.js";
import { BookmarksService } from "./modules/bookmarks/bookmarks.service.js";
import { ClicksRepository } from "./modules/clicks/clicks.repository.js";
import { createStatsRouter } from "./modules/clicks/clicks.router.js";
import { ClicksService } from "./modules/clicks/clicks.service.js";
import { createHealthRouter } from "./modules/health/health.router.js";
import { ReviewsRepository } from "./modules/reviews/reviews.repository.js";
import { createReviewsRouter } from "./modules/reviews/reviews.router.js";
import { ReviewsService } from "./modules/reviews/reviews.service.js";
import { ToolsRepository } from "./modules/tools/tools.repository.js";
import { createToolsRouter } from "./modules/tools/tools.router.js";
import { ToolsService } from "./modules/tools/tools.service.js";
import { createDocsRouter } from "./openapi/docs.router.js";

const API_VERSION = "1.0.0";

export interface AppDeps {
  env: Env;
  db: DatabaseSync;
  logger: Logger;
}

/**
 * Composition Root — 의존성을 조립하는 유일한 장소.
 *
 * repository(SQL) → service(비즈니스 규칙) → router(HTTP)를 생성자 주입으로 연결한다.
 * DI 프레임워크 없이도 이 구조면 테스트에서 in-memory DB를 꽂아 전체 앱을 띄울 수 있다.
 * (tests/helpers/test-app.ts 참고)
 */
export function buildApp(deps: AppDeps): Express {
  const { env, db, logger } = deps;

  // 1) Repositories (데이터 접근)
  const authRepo = new AuthRepository(db);
  const toolsRepo = new ToolsRepository(db);
  const reviewsRepo = new ReviewsRepository(db);
  const bookmarksRepo = new BookmarksRepository(db);
  const clicksRepo = new ClicksRepository(db);

  // 2) Services (비즈니스 로직)
  const authService = new AuthService(authRepo, db, env);
  const toolsService = new ToolsService(toolsRepo);
  const reviewsService = new ReviewsService(reviewsRepo, toolsRepo);
  const bookmarksService = new BookmarksService(bookmarksRepo, toolsRepo);
  const clicksService = new ClicksService(clicksRepo, toolsRepo);

  const auth = createAuthMiddleware(env);

  // 3) HTTP 파이프라인
  const app = express();
  app.disable("x-powered-by"); // 프레임워크 버전 노출 최소화
  app.set("trust proxy", 1); // 리버스 프록시 뒤에서 req.ip가 실제 클라이언트 IP가 되도록

  app.use(helmet()); // 보안 헤더 일괄 적용 (CSP, HSTS, nosniff 등)
  app.use(
    cors({
      origin: env.corsOrigins === "*" ? true : env.corsOrigins,
      maxAge: 600,
    }),
  );
  app.use(express.json({ limit: "100kb" })); // 본문 크기 제한 — 대용량 페이로드 DoS 방지
  app.use(requestId());
  app.use(requestLogger(logger));

  if (!env.rateLimit.disabled) {
    app.use(
      createRateLimiter({
        windowMs: env.rateLimit.windowMs,
        max: env.rateLimit.max,
        keyPrefix: "global",
      }),
    );
  }

  app.use("/health", createHealthRouter(db, API_VERSION));
  app.use("/api/docs", createDocsRouter());

  const api = Router();
  if (!env.rateLimit.disabled) {
    // 로그인/가입은 brute-force 표적이므로 훨씬 엄격한 한도를 별도로 건다.
    api.use(
      "/auth",
      createRateLimiter({
        windowMs: env.rateLimit.windowMs,
        max: env.rateLimit.authMax,
        keyPrefix: "auth",
      }),
    );
  }
  api.use("/auth", createAuthRouter(authService, auth));
  api.use(
    "/tools",
    createToolsRouter({ tools: toolsService, reviews: reviewsService, clicks: clicksService, auth }),
  );
  api.use("/reviews", createReviewsRouter(reviewsService, auth));
  api.use("/me", createBookmarksRouter(bookmarksService, auth));
  api.use("/stats", createStatsRouter(clicksService, auth));
  app.use("/api/v1", api);

  // 순서 중요: 라우트 전부 등록 후 404 → 마지막에 중앙 에러 핸들러
  app.use(notFoundHandler());
  app.use(errorHandler(logger));

  return app;
}
