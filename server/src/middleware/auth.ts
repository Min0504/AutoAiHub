import type { RequestHandler } from "express";
import type { Env } from "../config/env.js";
import { AppError } from "../lib/errors.js";
import { verifyAccessToken } from "../lib/jwt.js";

/**
 * 인증(Authentication) vs 인가(Authorization)
 * - requireAuth  : "누구인지" 확인 — Bearer access token 검증 (401)
 * - requireAdmin : "권한이 있는지" 확인 — 역할(role) 검사 (403)
 * - optionalAuth : 로그인 여부에 따라 응답이 달라지는 공개 엔드포인트용
 */
export interface AuthMiddleware {
  requireAuth: RequestHandler;
  optionalAuth: RequestHandler;
  requireAdmin: RequestHandler;
}

function extractBearerToken(header: string | undefined): string | null {
  if (!header?.startsWith("Bearer ")) return null;
  const token = header.slice("Bearer ".length).trim();
  return token.length > 0 ? token : null;
}

export function createAuthMiddleware(env: Env): AuthMiddleware {
  const requireAuth: RequestHandler = (req, _res, next) => {
    const token = extractBearerToken(req.header("authorization"));
    if (!token) {
      next(AppError.unauthorized());
      return;
    }
    // verifyAccessToken은 실패 시 AppError(401)를 throw → 중앙 에러 핸들러가 처리
    const claims = verifyAccessToken(token, env.jwtSecret);
    req.user = { id: claims.userId, role: claims.role };
    next();
  };

  const optionalAuth: RequestHandler = (req, _res, next) => {
    const token = extractBearerToken(req.header("authorization"));
    if (token) {
      try {
        const claims = verifyAccessToken(token, env.jwtSecret);
        req.user = { id: claims.userId, role: claims.role };
      } catch {
        // 익명 사용자로 계속 진행 — 토큰이 잘못됐다고 공개 API를 막지 않는다.
      }
    }
    next();
  };

  const requireAdmin: RequestHandler = (req, _res, next) => {
    if (!req.user) {
      next(AppError.unauthorized());
      return;
    }
    if (req.user.role !== "admin") {
      next(AppError.forbidden("관리자 권한이 필요합니다."));
      return;
    }
    next();
  };

  return { requireAuth, optionalAuth, requireAdmin };
}
