import request from "supertest";
import { beforeEach, describe, expect, it } from "vitest";
import {
  TEST_TOOL,
  createTestApp,
  createTool,
  registerUser,
  type TestContext,
  type TestUser,
} from "./helpers/test-app.js";

describe("tools API", () => {
  let ctx: TestContext;
  let admin: TestUser;

  beforeEach(async () => {
    ctx = createTestApp();
    admin = await registerUser(ctx.app, { admin: true, db: ctx.db });
  });

  describe("GET /api/v1/tools — 목록", () => {
    it("페이지네이션 meta와 함께 목록을 반환한다", async () => {
      await createTool(ctx.app, admin.accessToken, { slug: "alpha", name: "Alpha" });
      await createTool(ctx.app, admin.accessToken, { slug: "beta", name: "Beta" });
      await createTool(ctx.app, admin.accessToken, { slug: "gamma", name: "Gamma" });

      const res = await request(ctx.app).get("/api/v1/tools?page=1&limit=2").expect(200);
      expect(res.body.data).toHaveLength(2);
      expect(res.body.meta).toEqual({ page: 1, limit: 2, totalItems: 3, totalPages: 2 });
    });

    it("category 필터가 동작한다", async () => {
      await createTool(ctx.app, admin.accessToken, { slug: "wf", category: "Workflow Automation" });
      await createTool(ctx.app, admin.accessToken, { slug: "ai", category: "AI Agents" });

      const res = await request(ctx.app)
        .get("/api/v1/tools")
        .query({ category: "AI Agents" })
        .expect(200);
      expect(res.body.data).toHaveLength(1);
      expect(res.body.data[0].slug).toBe("ai");
    });

    it("q 검색: 이름 부분 일치 (LIKE 특수문자 안전)", async () => {
      await createTool(ctx.app, admin.accessToken, { slug: "searchme", name: "SuperSearcher" });
      await createTool(ctx.app, admin.accessToken, { slug: "other", name: "Other" });

      const found = await request(ctx.app).get("/api/v1/tools").query({ q: "persearch" }).expect(200);
      expect(found.body.data.map((t: { slug: string }) => t.slug)).toEqual(["searchme"]);

      // %는 와일드카드가 아닌 리터럴로 취급되어야 한다
      const wildcard = await request(ctx.app).get("/api/v1/tools").query({ q: "%" }).expect(200);
      expect(wildcard.body.data).toHaveLength(0);
    });

    it("sort=name&order=asc 정렬이 동작한다", async () => {
      await createTool(ctx.app, admin.accessToken, { slug: "bbb", name: "BBB" });
      await createTool(ctx.app, admin.accessToken, { slug: "aaa", name: "AAA" });

      const res = await request(ctx.app).get("/api/v1/tools?sort=name&order=asc").expect(200);
      expect(res.body.data.map((t: { name: string }) => t.name)).toEqual(["AAA", "BBB"]);
    });

    it("허용되지 않은 sort 키는 400 (ORDER BY 인젝션 방어)", async () => {
      await request(ctx.app).get("/api/v1/tools?sort=;DROP TABLE tools").expect(400);
    });
  });

  describe("GET /api/v1/tools/:slug — 상세", () => {
    it("JSON 컬럼이 구조화된 객체로 풀려서 반환된다", async () => {
      await createTool(ctx.app, admin.accessToken, { slug: "detail-tool" });
      const res = await request(ctx.app).get("/api/v1/tools/detail-tool").expect(200);
      expect(res.body.data.pricingDetails).toEqual(TEST_TOOL.pricingDetails);
      expect(res.body.data.features).toEqual(TEST_TOOL.features);
    });

    it("없는 slug는 404", async () => {
      const res = await request(ctx.app).get("/api/v1/tools/nope").expect(404);
      expect(res.body.error.code).toBe("NOT_FOUND");
    });
  });

  describe("쓰기 — 인가(RBAC)", () => {
    it("비로그인 생성 시도: 401", async () => {
      await request(ctx.app).post("/api/v1/tools").send(TEST_TOOL).expect(401);
    });

    it("일반 사용자 생성 시도: 403", async () => {
      const user = await registerUser(ctx.app);
      const res = await request(ctx.app)
        .post("/api/v1/tools")
        .set("Authorization", `Bearer ${user.accessToken}`)
        .send(TEST_TOOL)
        .expect(403);
      expect(res.body.error.code).toBe("FORBIDDEN");
    });

    it("관리자: 생성 → 수정 → 삭제 전체 사이클", async () => {
      await createTool(ctx.app, admin.accessToken, { slug: "lifecycle" });

      const patched = await request(ctx.app)
        .patch("/api/v1/tools/lifecycle")
        .set("Authorization", `Bearer ${admin.accessToken}`)
        .send({ name: "Renamed", editorialRating: 3.2 })
        .expect(200);
      expect(patched.body.data.name).toBe("Renamed");
      expect(patched.body.data.editorialRating).toBe(3.2);

      await request(ctx.app)
        .delete("/api/v1/tools/lifecycle")
        .set("Authorization", `Bearer ${admin.accessToken}`)
        .expect(204);

      await request(ctx.app).get("/api/v1/tools/lifecycle").expect(404);
    });

    it("slug 중복 생성: 409", async () => {
      await createTool(ctx.app, admin.accessToken, { slug: "unique-slug" });
      const res = await request(ctx.app)
        .post("/api/v1/tools")
        .set("Authorization", `Bearer ${admin.accessToken}`)
        .send({ ...TEST_TOOL, slug: "unique-slug" })
        .expect(409);
      expect(res.body.error.code).toBe("CONFLICT");
    });

    it("빈 PATCH body: 400", async () => {
      await createTool(ctx.app, admin.accessToken, { slug: "patch-me" });
      await request(ctx.app)
        .patch("/api/v1/tools/patch-me")
        .set("Authorization", `Bearer ${admin.accessToken}`)
        .send({})
        .expect(400);
    });

    it("부분 PATCH가 보내지 않은 필드(badge 등)를 초기화하지 않는다 (회귀 방지)", async () => {
      await createTool(ctx.app, admin.accessToken, { slug: "keep-badge", badge: "인기 배지" });
      const res = await request(ctx.app)
        .patch("/api/v1/tools/keep-badge")
        .set("Authorization", `Bearer ${admin.accessToken}`)
        .send({ name: "이름만 변경" })
        .expect(200);
      expect(res.body.data.badge).toBe("인기 배지");
      expect(res.body.data.name).toBe("이름만 변경");
    });
  });

  it("리뷰 작성 시 목록의 reviewStats에 집계가 반영된다", async () => {
    await createTool(ctx.app, admin.accessToken, { slug: "rated" });
    const user = await registerUser(ctx.app);
    await request(ctx.app)
      .post("/api/v1/tools/rated/reviews")
      .set("Authorization", `Bearer ${user.accessToken}`)
      .send({ rating: 4, content: "리뷰 통계 확인용 리뷰입니다" })
      .expect(201);

    const res = await request(ctx.app).get("/api/v1/tools/rated").expect(200);
    expect(res.body.data.reviewStats).toEqual({ count: 1, averageRating: 4 });
  });
});
