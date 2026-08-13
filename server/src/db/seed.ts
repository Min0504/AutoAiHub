import type { DatabaseSync } from "node:sqlite";
import type { Logger } from "pino";
import type { Env } from "../config/env.js";
import { hashPassword } from "../lib/password.js";
import { withTransaction } from "./client.js";
import { TOOL_SEED } from "./tools.seed.js";

/**
 * 시드는 "초기 데이터 주입"이다.
 * INSERT OR IGNORE를 쓰므로 이미 존재하는 툴은 건드리지 않는다
 * → 관리자가 API로 수정한 내용이 재부팅 시 시드 값으로 되돌아가지 않는다.
 */
export async function seedDatabase(db: DatabaseSync, env: Env, logger?: Logger): Promise<void> {
  const inserted = seedTools(db);
  if (inserted > 0) logger?.info({ inserted }, "tool seed applied");

  if (env.adminEmail && env.adminPassword) {
    const created = await ensureAdminUser(db, env.adminEmail, env.adminPassword);
    if (created) logger?.info({ email: env.adminEmail }, "admin user created");
  }
}

function seedTools(db: DatabaseSync): number {
  return withTransaction(db, () => {
    const stmt = db.prepare(
      `INSERT OR IGNORE INTO tools (
        slug, name, category, badge, slogan, price_info, pricing_details,
        difficulty, difficulty_level, editorial_rating,
        features, pros, cons, best_for, ai_integration, affiliate_url,
        alternatives, logo_color, logo_text_color
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    );

    let inserted = 0;
    for (const tool of TOOL_SEED) {
      const result = stmt.run(
        tool.slug,
        tool.name,
        tool.category,
        tool.badge,
        tool.slogan,
        tool.priceInfo,
        JSON.stringify(tool.pricingDetails),
        tool.difficulty,
        tool.difficultyLevel,
        tool.editorialRating,
        JSON.stringify(tool.features),
        JSON.stringify(tool.pros),
        JSON.stringify(tool.cons),
        tool.bestFor,
        tool.aiIntegration,
        tool.affiliateUrl,
        JSON.stringify(tool.alternatives),
        tool.logoColor,
        tool.logoTextColor,
      );
      inserted += Number(result.changes);
    }
    return inserted;
  });
}

/** 반환값: 새로 생성했으면 true. 이미 있으면 아무것도 하지 않는다. */
async function ensureAdminUser(db: DatabaseSync, email: string, password: string): Promise<boolean> {
  const existing = db.prepare("SELECT id FROM users WHERE email = ?").get(email);
  if (existing) return false;

  const passwordHash = await hashPassword(password);
  db.prepare("INSERT INTO users (email, password_hash, nickname, role) VALUES (?, ?, ?, 'admin')").run(
    email.toLowerCase(),
    passwordHash,
    "관리자",
  );
  return true;
}
