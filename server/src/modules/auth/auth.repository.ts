import type { DatabaseSync } from "node:sqlite";

/**
 * Repository 계층: SQL과 도메인 사이의 유일한 접점.
 * - 모든 값은 파라미터 바인딩(?)으로 전달한다 — 문자열 조립 금지 (SQL Injection 방어의 기본).
 * - 이 계층 밖에서는 SQL이 보이지 않아야 한다. 나중에 PostgreSQL로 갈아탈 때 여기만 바꾼다.
 */
export interface UserRow {
  id: number;
  email: string;
  password_hash: string;
  nickname: string;
  role: "user" | "admin";
  created_at: string;
  updated_at: string;
}

export interface RefreshTokenRow {
  id: number;
  user_id: number;
  token_hash: string;
  expires_at: string;
  revoked_at: string | null;
  created_at: string;
}

export class AuthRepository {
  constructor(private readonly db: DatabaseSync) {}

  findUserByEmail(email: string): UserRow | undefined {
    return this.db.prepare("SELECT * FROM users WHERE email = ?").get(email) as
      | UserRow
      | undefined;
  }

  findUserById(id: number): UserRow | undefined {
    return this.db.prepare("SELECT * FROM users WHERE id = ?").get(id) as UserRow | undefined;
  }

  createUser(input: {
    email: string;
    passwordHash: string;
    nickname: string;
    role: "user" | "admin";
  }): UserRow {
    const result = this.db
      .prepare("INSERT INTO users (email, password_hash, nickname, role) VALUES (?, ?, ?, ?)")
      .run(input.email, input.passwordHash, input.nickname, input.role);
    const user = this.findUserById(Number(result.lastInsertRowid));
    if (!user) throw new Error("failed to load created user");
    return user;
  }

  insertRefreshToken(input: { userId: number; tokenHash: string; expiresAt: string }): void {
    this.db
      .prepare("INSERT INTO refresh_tokens (user_id, token_hash, expires_at) VALUES (?, ?, ?)")
      .run(input.userId, input.tokenHash, input.expiresAt);
  }

  findRefreshTokenByHash(tokenHash: string): RefreshTokenRow | undefined {
    return this.db.prepare("SELECT * FROM refresh_tokens WHERE token_hash = ?").get(tokenHash) as
      | RefreshTokenRow
      | undefined;
  }

  revokeRefreshToken(id: number): void {
    this.db
      .prepare(
        "UPDATE refresh_tokens SET revoked_at = strftime('%Y-%m-%dT%H:%M:%fZ', 'now') WHERE id = ? AND revoked_at IS NULL",
      )
      .run(id);
  }

  /** 토큰 재사용 공격이 감지되면 해당 사용자의 모든 세션을 강제 종료한다. */
  revokeAllUserTokens(userId: number): void {
    this.db
      .prepare(
        "UPDATE refresh_tokens SET revoked_at = strftime('%Y-%m-%dT%H:%M:%fZ', 'now') WHERE user_id = ? AND revoked_at IS NULL",
      )
      .run(userId);
  }
}
