import request from "supertest";
import { beforeEach, describe, expect, it } from "vitest";
import {
  createTestApp,
  createTool,
  registerUser,
  type TestContext,
  type TestUser,
} from "./helpers/test-app.js";

describe("bookmarks API", () => {
  let ctx: TestContext;
  let admin: TestUser;
  let user: TestUser;
  let slug: string;

  beforeEach(async () => {
    ctx = createTestApp();
    admin = await registerUser(ctx.app, { admin: true, db: ctx.db });
    user = await registerUser(ctx.app);
    slug = await createTool(ctx.app, admin.accessToken);
  });

  it("전체 엔드포인트가 인증을 요구한다", async () => {
    await request(ctx.app).get("/api/v1/me/bookmarks").expect(401);
    await request(ctx.app).put(`/api/v1/me/bookmarks/${slug}`).expect(401);
    await request(ctx.app).delete(`/api/v1/me/bookmarks/${slug}`).expect(401);
  });

  it("추가 → 목록 조회 → 제거 사이클", async () => {
    await request(ctx.app)
      .put(`/api/v1/me/bookmarks/${slug}`)
      .set("Authorization", `Bearer ${user.accessToken}`)
      .expect(204);

    const list = await request(ctx.app)
      .get("/api/v1/me/bookmarks")
      .set("Authorization", `Bearer ${user.accessToken}`)
      .expect(200);
    expect(list.body.data).toHaveLength(1);
    expect(list.body.data[0].tool.slug).toBe(slug);
    expect(list.body.data[0].bookmarkedAt).toBeTypeOf("string");

    await request(ctx.app)
      .delete(`/api/v1/me/bookmarks/${slug}`)
      .set("Authorization", `Bearer ${user.accessToken}`)
      .expect(204);

    const empty = await request(ctx.app)
      .get("/api/v1/me/bookmarks")
      .set("Authorization", `Bearer ${user.accessToken}`)
      .expect(200);
    expect(empty.body.data).toHaveLength(0);
  });

  it("PUT은 멱등: 같은 툴을 두 번 추가해도 1개만 존재", async () => {
    await request(ctx.app)
      .put(`/api/v1/me/bookmarks/${slug}`)
      .set("Authorization", `Bearer ${user.accessToken}`)
      .expect(204);
    await request(ctx.app)
      .put(`/api/v1/me/bookmarks/${slug}`)
      .set("Authorization", `Bearer ${user.accessToken}`)
      .expect(204);

    const list = await request(ctx.app)
      .get("/api/v1/me/bookmarks")
      .set("Authorization", `Bearer ${user.accessToken}`)
      .expect(200);
    expect(list.body.data).toHaveLength(1);
  });

  it("없는 툴 북마크: 404", async () => {
    await request(ctx.app)
      .put("/api/v1/me/bookmarks/ghost-tool")
      .set("Authorization", `Bearer ${user.accessToken}`)
      .expect(404);
  });

  it("사용자 간 북마크는 격리된다", async () => {
    await request(ctx.app)
      .put(`/api/v1/me/bookmarks/${slug}`)
      .set("Authorization", `Bearer ${user.accessToken}`)
      .expect(204);

    const other = await registerUser(ctx.app);
    const list = await request(ctx.app)
      .get("/api/v1/me/bookmarks")
      .set("Authorization", `Bearer ${other.accessToken}`)
      .expect(200);
    expect(list.body.data).toHaveLength(0);
  });
});
