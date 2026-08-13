import jwt from "jsonwebtoken";
import { z } from "zod";
import { AppError } from "./errors.js";

/**
 * Access token: 상태 없는(stateless) JWT.
 * 서버가 세션을 저장하지 않으므로 수평 확장이 쉽지만, 발급 후 강제 만료가 어렵다.
 * → 그래서 수명을 짧게 두고(기본 15분), 갱신은 DB에 저장된 refresh token으로만 한다.
 */
const ISSUER = "autohub-api";

const accessPayloadSchema = z.object({
  sub: z.string(),
  role: z.enum(["user", "admin"]),
  type: z.literal("access"),
});

export interface AccessTokenClaims {
  userId: number;
  role: "user" | "admin";
}

export function signAccessToken(
  claims: AccessTokenClaims,
  secret: string,
  ttlSec: number,
): string {
  return jwt.sign({ sub: String(claims.userId), role: claims.role, type: "access" }, secret, {
    algorithm: "HS256",
    expiresIn: ttlSec,
    issuer: ISSUER,
  });
}

export function verifyAccessToken(token: string, secret: string): AccessTokenClaims {
  let decoded: unknown;
  try {
    // algorithms 화이트리스트: "alg: none" 류 다운그레이드 공격 방지.
    decoded = jwt.verify(token, secret, { algorithms: ["HS256"], issuer: ISSUER });
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      throw AppError.unauthorized("토큰이 만료되었습니다.", "TOKEN_EXPIRED");
    }
    throw AppError.unauthorized("유효하지 않은 토큰입니다.", "INVALID_TOKEN");
  }

  const payload = accessPayloadSchema.safeParse(decoded);
  if (!payload.success) {
    throw AppError.unauthorized("유효하지 않은 토큰입니다.", "INVALID_TOKEN");
  }
  const userId = Number(payload.data.sub);
  if (!Number.isInteger(userId)) {
    throw AppError.unauthorized("유효하지 않은 토큰입니다.", "INVALID_TOKEN");
  }
  return { userId, role: payload.data.role };
}
