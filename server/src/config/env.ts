import { z } from "zod";

/**
 * 환경변수는 "시스템 경계"이므로 부팅 시점에 zod로 전부 검증한다.
 * 잘못된 설정으로 조용히 기동하는 것보다 즉시 크래시하는 편이 안전하다 (fail-fast).
 */
const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().int().min(0).max(65535).default(4000),

  /** SQLite 파일 경로. 테스트에서는 ":memory:"를 사용한다. */
  DATABASE_PATH: z.string().min(1).default("./data/autohub.db"),

  JWT_SECRET: z.string().min(16).default("dev-only-secret-change-me-32chars"),
  /** access token 수명(초). 짧게 유지하고 refresh로 연장하는 전략. */
  JWT_ACCESS_TTL_SEC: z.coerce.number().int().min(60).default(60 * 15),
  /** refresh token 수명(일). DB에 해시로 저장되며 회전(rotation)된다. */
  REFRESH_TTL_DAYS: z.coerce.number().int().min(1).default(14),

  /** 쉼표로 구분된 허용 Origin 목록. "*"는 개발 편의용. */
  CORS_ORIGINS: z.string().default("http://localhost:5173"),

  RATE_LIMIT_WINDOW_MS: z.coerce.number().int().min(1000).default(60_000),
  RATE_LIMIT_MAX: z.coerce.number().int().min(1).default(120),
  /** 인증 엔드포인트(brute-force 표적)에는 더 엄격한 한도를 적용한다. */
  RATE_LIMIT_AUTH_MAX: z.coerce.number().int().min(1).default(10),
  RATE_LIMIT_DISABLED: z
    .string()
    .default("false")
    .transform((v) => v === "true"),

  LOG_LEVEL: z.enum(["fatal", "error", "warn", "info", "debug", "trace", "silent"]).default("info"),

  /** 설정 시 부팅 시드 단계에서 관리자 계정을 보장한다(업서트). */
  ADMIN_EMAIL: z.email().optional(),
  ADMIN_PASSWORD: z.string().min(8).optional(),
});

export interface Env {
  nodeEnv: "development" | "test" | "production";
  isProduction: boolean;
  port: number;
  databasePath: string;
  jwtSecret: string;
  jwtAccessTtlSec: number;
  refreshTtlDays: number;
  corsOrigins: string[] | "*";
  rateLimit: {
    windowMs: number;
    max: number;
    authMax: number;
    disabled: boolean;
  };
  logLevel: "fatal" | "error" | "warn" | "info" | "debug" | "trace" | "silent";
  adminEmail?: string;
  adminPassword?: string;
}

export function loadEnv(source: Record<string, string | undefined> = process.env): Env {
  const parsed = envSchema.safeParse(source);
  if (!parsed.success) {
    const issues = parsed.error.issues
      .map((i) => `  - ${i.path.join(".")}: ${i.message}`)
      .join("\n");
    throw new Error(`Invalid environment variables:\n${issues}`);
  }
  const raw = parsed.data;

  if (raw.NODE_ENV === "production" && raw.JWT_SECRET === envSchema.shape.JWT_SECRET.parse(undefined)) {
    throw new Error("JWT_SECRET must be explicitly set in production");
  }

  const origins = raw.CORS_ORIGINS.split(",")
    .map((o) => o.trim())
    .filter(Boolean);

  return {
    nodeEnv: raw.NODE_ENV,
    isProduction: raw.NODE_ENV === "production",
    port: raw.PORT,
    databasePath: raw.DATABASE_PATH,
    jwtSecret: raw.JWT_SECRET,
    jwtAccessTtlSec: raw.JWT_ACCESS_TTL_SEC,
    refreshTtlDays: raw.REFRESH_TTL_DAYS,
    corsOrigins: origins.includes("*") ? "*" : origins,
    rateLimit: {
      windowMs: raw.RATE_LIMIT_WINDOW_MS,
      max: raw.RATE_LIMIT_MAX,
      authMax: raw.RATE_LIMIT_AUTH_MAX,
      disabled: raw.RATE_LIMIT_DISABLED,
    },
    logLevel: raw.LOG_LEVEL,
    ...(raw.ADMIN_EMAIL ? { adminEmail: raw.ADMIN_EMAIL } : {}),
    ...(raw.ADMIN_PASSWORD ? { adminPassword: raw.ADMIN_PASSWORD } : {}),
  };
}
