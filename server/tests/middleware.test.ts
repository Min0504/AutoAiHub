import request from "supertest";
import { describe, expect, it } from "vitest";
import { createTestApp } from "./helpers/test-app.js";

describe("HTTP 파이프라인 (미들웨어)", () => {
  it("모르는 경로: 404 + 표준 에러 포맷", async () => {
    const { app } = createTestApp();
    const res = await request(app).get("/api/v1/unknown").expect(404);
    expect(res.body.error).toMatchObject({ code: "NOT_FOUND" });
    expect(res.body.error.requestId).toBeTypeOf("string");
  });

  it("X-Request-Id: 클라이언트가 보낸 안전한 ID를 그대로 돌려준다", async () => {
    const { app } = createTestApp();
    const res = await request(app).get("/health").set("X-Request-Id", "trace-abc-123").expect(200);
    expect(res.headers["x-request-id"]).toBe("trace-abc-123");
  });

  it("X-Request-Id: 허용 패턴 밖의 값(공백 포함)은 새 UUID로 대체한다", async () => {
    const { app } = createTestApp();
    const res = await request(app)
      .get("/health")
      .set("X-Request-Id", "bad id with spaces")
      .expect(200);
    expect(res.headers["x-request-id"]).toMatch(/^[0-9a-f-]{36}$/);
  });

  it("깨진 JSON 본문: 400 VALIDATION_ERROR (500 아님)", async () => {
    const { app } = createTestApp();
    const res = await request(app)
      .post("/api/v1/auth/login")
      .set("Content-Type", "application/json")
      .send('{"email": broken')
      .expect(400);
    expect(res.body.error.code).toBe("VALIDATION_ERROR");
  });

  it("보안 헤더(helmet)와 x-powered-by 제거를 확인한다", async () => {
    const { app } = createTestApp();
    const res = await request(app).get("/health").expect(200);
    expect(res.headers["x-content-type-options"]).toBe("nosniff");
    expect(res.headers["x-powered-by"]).toBeUndefined();
  });

  it("readiness: DB가 닫히면 503을 반환한다", async () => {
    const { app, db } = createTestApp();
    await request(app).get("/health/ready").expect(200);
    db.close();
    await request(app).get("/health/ready").expect(503);
  });

  describe("레이트 리밋", () => {
    it("한도 초과 시 429 + Retry-After + 표준 헤더", async () => {
      const { app } = createTestApp({
        RATE_LIMIT_DISABLED: "false",
        RATE_LIMIT_MAX: "3",
        RATE_LIMIT_WINDOW_MS: "60000",
      });

      for (let i = 0; i < 3; i += 1) {
        const ok = await request(app).get("/health").expect(200);
        expect(ok.headers["ratelimit-remaining"]).toBe(String(3 - i - 1));
      }

      const blocked = await request(app).get("/health").expect(429);
      expect(blocked.body.error.code).toBe("RATE_LIMITED");
      expect(Number(blocked.headers["retry-after"])).toBeGreaterThan(0);
    });

    it("인증 라우트는 더 엄격한 별도 한도를 갖는다", async () => {
      const { app } = createTestApp({
        RATE_LIMIT_DISABLED: "false",
        RATE_LIMIT_MAX: "100",
        RATE_LIMIT_AUTH_MAX: "2",
      });

      const body = { email: "rl@test.dev", password: "wrongpass1" };
      await request(app).post("/api/v1/auth/login").send(body).expect(401);
      await request(app).post("/api/v1/auth/login").send(body).expect(401);
      const blocked = await request(app).post("/api/v1/auth/login").send(body).expect(429);
      expect(blocked.body.error.code).toBe("RATE_LIMITED");
    });
  });

  it("OpenAPI 문서와 Swagger UI가 서빙된다", async () => {
    const { app } = createTestApp();
    const spec = await request(app).get("/api/docs/openapi.json").expect(200);
    expect(spec.body.openapi).toBe("3.1.0");
    expect(Object.keys(spec.body.paths).length).toBeGreaterThan(10);

    const ui = await request(app).get("/api/docs/").expect(200);
    expect(ui.text).toContain("swagger-ui");
  });
});
