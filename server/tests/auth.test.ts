import request from "supertest";
import { beforeEach, describe, expect, it } from "vitest";
import { createTestApp, registerUser, type TestContext } from "./helpers/test-app.js";

describe("auth API", () => {
  let ctx: TestContext;

  beforeEach(() => {
    ctx = createTestApp();
  });

  describe("POST /api/v1/auth/register", () => {
    it("가입 성공 시 201 + 사용자 정보 + 토큰 쌍을 반환한다", async () => {
      const res = await request(ctx.app)
        .post("/api/v1/auth/register")
        .send({ email: "new@test.dev", password: "passw0rd123", nickname: "새유저" })
        .expect(201);

      expect(res.body.user).toMatchObject({ email: "new@test.dev", nickname: "새유저", role: "user" });
      expect(res.body.user.passwordHash).toBeUndefined();
      expect(res.body.user.password_hash).toBeUndefined();
      expect(res.body.tokens.accessToken).toBeTypeOf("string");
      expect(res.body.tokens.refreshToken).toBeTypeOf("string");
    });

    it("이메일 중복이면 409 CONFLICT", async () => {
      const body = { email: "dup@test.dev", password: "passw0rd123", nickname: "중복" };
      await request(ctx.app).post("/api/v1/auth/register").send(body).expect(201);
      const res = await request(ctx.app).post("/api/v1/auth/register").send(body).expect(409);
      expect(res.body.error.code).toBe("CONFLICT");
    });

    it("대소문자만 다른 이메일도 중복으로 처리한다", async () => {
      await request(ctx.app)
        .post("/api/v1/auth/register")
        .send({ email: "case@test.dev", password: "passw0rd123", nickname: "소문자" })
        .expect(201);
      await request(ctx.app)
        .post("/api/v1/auth/register")
        .send({ email: "CASE@TEST.DEV", password: "passw0rd123", nickname: "대문자" })
        .expect(409);
    });

    it("약한 비밀번호(숫자 없음)는 400 + 필드별 상세", async () => {
      const res = await request(ctx.app)
        .post("/api/v1/auth/register")
        .send({ email: "weak@test.dev", password: "onlyletters", nickname: "약한비번" })
        .expect(400);
      expect(res.body.error.code).toBe("VALIDATION_ERROR");
      expect(res.body.error.details.some((d: { path: string }) => d.path === "password")).toBe(true);
    });
  });

  describe("POST /api/v1/auth/login", () => {
    it("올바른 자격 증명으로 로그인한다", async () => {
      const user = await registerUser(ctx.app);
      const res = await request(ctx.app)
        .post("/api/v1/auth/login")
        .send({ email: user.email, password: "passw0rd123" })
        .expect(200);
      expect(res.body.tokens.accessToken).toBeTypeOf("string");
    });

    it("틀린 비밀번호: 401 INVALID_CREDENTIALS (계정 존재 여부 미노출)", async () => {
      const user = await registerUser(ctx.app);
      const res = await request(ctx.app)
        .post("/api/v1/auth/login")
        .send({ email: user.email, password: "wrongpass1" })
        .expect(401);
      expect(res.body.error.code).toBe("INVALID_CREDENTIALS");
    });

    it("없는 계정도 동일한 401 INVALID_CREDENTIALS", async () => {
      const res = await request(ctx.app)
        .post("/api/v1/auth/login")
        .send({ email: "ghost@test.dev", password: "whatever1" })
        .expect(401);
      expect(res.body.error.code).toBe("INVALID_CREDENTIALS");
    });
  });

  describe("POST /api/v1/auth/refresh — 회전(rotation)", () => {
    it("refresh 성공 시 새 토큰 쌍을 발급하고 기존 토큰은 폐기한다", async () => {
      const user = await registerUser(ctx.app);

      const first = await request(ctx.app)
        .post("/api/v1/auth/refresh")
        .send({ refreshToken: user.refreshToken })
        .expect(200);
      expect(first.body.tokens.refreshToken).not.toBe(user.refreshToken);

      // 회전된 새 토큰은 정상 동작
      await request(ctx.app)
        .post("/api/v1/auth/refresh")
        .send({ refreshToken: first.body.tokens.refreshToken })
        .expect(200);
    });

    it("폐기된 토큰 재사용 → REFRESH_REUSE_DETECTED + 모든 세션 종료", async () => {
      const user = await registerUser(ctx.app);

      const rotated = await request(ctx.app)
        .post("/api/v1/auth/refresh")
        .send({ refreshToken: user.refreshToken })
        .expect(200);

      // 이미 사용한(폐기된) 원래 토큰을 다시 사용 → 탈취 정황
      const reuse = await request(ctx.app)
        .post("/api/v1/auth/refresh")
        .send({ refreshToken: user.refreshToken })
        .expect(401);
      expect(reuse.body.error.code).toBe("REFRESH_REUSE_DETECTED");

      // 방금 발급된 새 토큰까지 전부 무효화됐는지 확인
      await request(ctx.app)
        .post("/api/v1/auth/refresh")
        .send({ refreshToken: rotated.body.tokens.refreshToken })
        .expect(401);
    });

    it("존재하지 않는 토큰은 401 INVALID_TOKEN", async () => {
      const res = await request(ctx.app)
        .post("/api/v1/auth/refresh")
        .send({ refreshToken: "definitely-not-a-token" })
        .expect(401);
      expect(res.body.error.code).toBe("INVALID_TOKEN");
    });
  });

  describe("POST /api/v1/auth/logout", () => {
    it("로그아웃 후 해당 refresh token은 사용할 수 없다", async () => {
      const user = await registerUser(ctx.app);
      await request(ctx.app)
        .post("/api/v1/auth/logout")
        .send({ refreshToken: user.refreshToken })
        .expect(204);
      await request(ctx.app)
        .post("/api/v1/auth/refresh")
        .send({ refreshToken: user.refreshToken })
        .expect(401);
    });

    it("멱등: 같은 토큰으로 두 번 로그아웃해도 204", async () => {
      const user = await registerUser(ctx.app);
      await request(ctx.app).post("/api/v1/auth/logout").send({ refreshToken: user.refreshToken }).expect(204);
      await request(ctx.app).post("/api/v1/auth/logout").send({ refreshToken: user.refreshToken }).expect(204);
    });
  });

  describe("GET /api/v1/auth/me", () => {
    it("Bearer 토큰으로 내 정보를 조회한다", async () => {
      const user = await registerUser(ctx.app);
      const res = await request(ctx.app)
        .get("/api/v1/auth/me")
        .set("Authorization", `Bearer ${user.accessToken}`)
        .expect(200);
      expect(res.body.user.id).toBe(user.userId);
    });

    it("토큰 없으면 401", async () => {
      const res = await request(ctx.app).get("/api/v1/auth/me").expect(401);
      expect(res.body.error.code).toBe("UNAUTHORIZED");
    });

    it("서명이 조작된 토큰은 401 INVALID_TOKEN", async () => {
      const user = await registerUser(ctx.app);
      const tampered = `${user.accessToken.slice(0, -4)}AAAA`;
      const res = await request(ctx.app)
        .get("/api/v1/auth/me")
        .set("Authorization", `Bearer ${tampered}`)
        .expect(401);
      expect(res.body.error.code).toBe("INVALID_TOKEN");
    });
  });
});
