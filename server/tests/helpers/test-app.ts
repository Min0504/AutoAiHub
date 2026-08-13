import { DatabaseSync } from "node:sqlite";
import type { Express } from "express";
import { pino } from "pino";
import request from "supertest";
import { buildApp } from "../../src/app.js";
import { loadEnv, type Env } from "../../src/config/env.js";
import { runMigrations } from "../../src/db/migrate.js";
import type { CreateToolInput } from "../../src/modules/tools/tools.schemas.js";

/**
 * 테스트 원칙: 실제 HTTP 스택 전체(supertest) + 진짜 SQLite(in-memory)를 사용한다.
 * 모킹을 최소화하면 "미들웨어 순서, 직렬화, SQL"까지 통째로 검증된다.
 */
export interface TestContext {
  app: Express;
  db: DatabaseSync;
  env: Env;
}

export function createTestApp(overrides: Record<string, string> = {}): TestContext {
  const env = loadEnv({
    NODE_ENV: "test",
    DATABASE_PATH: ":memory:",
    JWT_SECRET: "test-secret-at-least-16-chars",
    RATE_LIMIT_DISABLED: "true", // 레이트 리밋 자체 테스트에서만 명시적으로 켠다
    LOG_LEVEL: "silent",
    ...overrides,
  });

  const db = new DatabaseSync(":memory:");
  db.exec("PRAGMA foreign_keys = ON;");
  runMigrations(db);

  const app = buildApp({ env, db, logger: pino({ level: "silent" }) });
  return { app, db, env };
}

export const TEST_TOOL: CreateToolInput = {
  slug: "test-tool",
  name: "Test Tool",
  category: "Workflow Automation",
  badge: null,
  slogan: "테스트용 자동화 도구",
  priceInfo: "무료",
  pricingDetails: { free: "무료 플랜", starter: "$10/월", pro: "$30/월", pricingModel: "실행 단위" },
  difficulty: "보통",
  difficultyLevel: 3,
  editorialRating: 4.5,
  features: ["기능 1"],
  pros: ["장점 1"],
  cons: ["단점 1"],
  bestFor: "테스트 작성자",
  aiIntegration: "AI 연동 설명",
  affiliateUrl: "https://example.com/tool",
  alternatives: [],
  logoColor: null,
  logoTextColor: null,
};

/** users 테이블에 직접 관리자 역할을 부여한다 (테스트 픽스처 지름길). */
export function promoteToAdmin(db: DatabaseSync, email: string): void {
  db.prepare("UPDATE users SET role = 'admin' WHERE email = ?").run(email);
}

export interface TestUser {
  accessToken: string;
  refreshToken: string;
  userId: number;
  email: string;
}

let userSeq = 0;

export async function registerUser(
  app: Express,
  options: { admin?: boolean; db?: DatabaseSync } = {},
): Promise<TestUser> {
  userSeq += 1;
  const email = `user${userSeq}-${Date.now()}@test.dev`;

  const res = await request(app)
    .post("/api/v1/auth/register")
    .send({ email, password: "passw0rd123", nickname: `유저${userSeq}` })
    .expect(201);

  if (options.admin) {
    if (!options.db) throw new Error("admin promotion requires db");
    promoteToAdmin(options.db, email);
    // role은 access token에 들어있으므로 재로그인으로 새 토큰을 받는다.
    const login = await request(app)
      .post("/api/v1/auth/login")
      .send({ email, password: "passw0rd123" })
      .expect(200);
    return {
      accessToken: login.body.tokens.accessToken,
      refreshToken: login.body.tokens.refreshToken,
      userId: login.body.user.id,
      email,
    };
  }

  return {
    accessToken: res.body.tokens.accessToken,
    refreshToken: res.body.tokens.refreshToken,
    userId: res.body.user.id,
    email,
  };
}

export async function createTool(
  app: Express,
  adminToken: string,
  overrides: Partial<CreateToolInput> = {},
): Promise<string> {
  const body = { ...TEST_TOOL, slug: overrides.slug ?? `tool-${++userSeq}`, ...overrides };
  await request(app)
    .post("/api/v1/tools")
    .set("Authorization", `Bearer ${adminToken}`)
    .send(body)
    .expect(201);
  return body.slug;
}
