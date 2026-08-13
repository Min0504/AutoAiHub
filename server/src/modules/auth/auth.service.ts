import { createHash, randomBytes } from "node:crypto";
import type { DatabaseSync } from "node:sqlite";
import type { Env } from "../../config/env.js";
import { withTransaction } from "../../db/client.js";
import { AppError } from "../../lib/errors.js";
import { signAccessToken } from "../../lib/jwt.js";
import { hashPassword, verifyPassword } from "../../lib/password.js";
import type { AuthRepository, UserRow } from "./auth.repository.js";
import type { LoginInput, RegisterInput } from "./auth.schemas.js";

export interface UserDto {
  id: number;
  email: string;
  nickname: string;
  role: "user" | "admin";
  createdAt: string;
}

export interface TokenPair {
  accessToken: string;
  /** access token 수명(초) — 클라이언트가 만료 전 선제 갱신할 수 있게 알려준다. */
  accessTokenExpiresInSec: number;
  refreshToken: string;
  refreshTokenExpiresAt: string;
}

/** 존재하지 않는 계정 로그인 시에도 해시 검증 시간을 소모시켜 계정 존재 여부 유추(타이밍 공격)를 어렵게 한다. */
const DUMMY_HASH =
  "scrypt:16384:8:1:00000000000000000000000000000000:0000000000000000000000000000000000000000000000000000000000000000";

export class AuthService {
  constructor(
    private readonly repo: AuthRepository,
    private readonly db: DatabaseSync,
    private readonly env: Env,
  ) {}

  async register(input: RegisterInput): Promise<{ user: UserDto; tokens: TokenPair }> {
    const existing = this.repo.findUserByEmail(input.email);
    if (existing) {
      throw AppError.conflict("이미 가입된 이메일입니다.");
    }
    const passwordHash = await hashPassword(input.password);
    const user = this.repo.createUser({
      email: input.email.toLowerCase(),
      passwordHash,
      nickname: input.nickname,
      role: "user",
    });
    return { user: toUserDto(user), tokens: this.issueTokens(user) };
  }

  async login(input: LoginInput): Promise<{ user: UserDto; tokens: TokenPair }> {
    const user = this.repo.findUserByEmail(input.email);
    const ok = await verifyPassword(input.password, user?.password_hash ?? DUMMY_HASH);
    if (!user || !ok) {
      // "이메일 없음"과 "비밀번호 틀림"을 구분해서 알려주면 계정 존재 여부가 노출된다.
      throw AppError.unauthorized("이메일 또는 비밀번호가 올바르지 않습니다.", "INVALID_CREDENTIALS");
    }
    return { user: toUserDto(user), tokens: this.issueTokens(user) };
  }

  /**
   * Refresh token 회전(rotation):
   * 사용된 refresh token은 즉시 폐기하고 새 토큰을 발급한다.
   * 이미 폐기된 토큰이 다시 오면 = 탈취 정황 → 그 사용자의 모든 세션을 종료한다.
   */
  refresh(refreshToken: string): TokenPair {
    const tokenHash = sha256(refreshToken);
    const row = this.repo.findRefreshTokenByHash(tokenHash);

    if (!row) {
      throw AppError.unauthorized("유효하지 않은 refresh token입니다.", "INVALID_TOKEN");
    }
    if (row.revoked_at !== null) {
      this.repo.revokeAllUserTokens(row.user_id);
      throw AppError.unauthorized(
        "이미 사용된 refresh token입니다. 보안을 위해 모든 세션이 종료되었습니다.",
        "REFRESH_REUSE_DETECTED",
      );
    }
    if (Date.parse(row.expires_at) <= Date.now()) {
      throw AppError.unauthorized("refresh token이 만료되었습니다.", "TOKEN_EXPIRED");
    }

    const user = this.repo.findUserById(row.user_id);
    if (!user) {
      throw AppError.unauthorized("사용자를 찾을 수 없습니다.", "INVALID_TOKEN");
    }

    // 폐기 + 신규 발급은 원자적으로 — 중간에 실패하면 둘 다 없던 일이 된다.
    return withTransaction(this.db, () => {
      this.repo.revokeRefreshToken(row.id);
      return this.issueTokens(user);
    });
  }

  /** 멱등(idempotent): 이미 폐기됐거나 없는 토큰이어도 조용히 성공 처리한다. */
  logout(refreshToken: string): void {
    const row = this.repo.findRefreshTokenByHash(sha256(refreshToken));
    if (row && row.revoked_at === null) {
      this.repo.revokeRefreshToken(row.id);
    }
  }

  me(userId: number): UserDto {
    const user = this.repo.findUserById(userId);
    if (!user) throw AppError.notFound("사용자를 찾을 수 없습니다.");
    return toUserDto(user);
  }

  private issueTokens(user: UserRow): TokenPair {
    const accessToken = signAccessToken(
      { userId: user.id, role: user.role },
      this.env.jwtSecret,
      this.env.jwtAccessTtlSec,
    );

    // refresh token은 JWT가 아닌 불투명(opaque) 랜덤 문자열 — 서버 DB가 유일한 진실이 된다.
    const refreshToken = randomBytes(48).toString("base64url");
    const expiresAt = new Date(
      Date.now() + this.env.refreshTtlDays * 24 * 60 * 60 * 1000,
    ).toISOString();

    this.repo.insertRefreshToken({
      userId: user.id,
      tokenHash: sha256(refreshToken),
      expiresAt,
    });

    return {
      accessToken,
      accessTokenExpiresInSec: this.env.jwtAccessTtlSec,
      refreshToken,
      refreshTokenExpiresAt: expiresAt,
    };
  }
}

function sha256(value: string): string {
  return createHash("sha256").update(value).digest("hex");
}

function toUserDto(row: UserRow): UserDto {
  // password_hash 같은 내부 컬럼이 응답에 새어나가지 않도록 명시적으로 매핑한다.
  return {
    id: row.id,
    email: row.email,
    nickname: row.nickname,
    role: row.role,
    createdAt: row.created_at,
  };
}
