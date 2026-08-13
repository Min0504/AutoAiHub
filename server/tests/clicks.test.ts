import request from "supertest";
import { beforeEach, describe, expect, it } from "vitest";
import {
  createTestApp,
  createTool,
  registerUser,
  type TestContext,
  type TestUser,
} from "./helpers/test-app.js";

describe("clicks & stats API", () => {
  let ctx: TestContext;
  let admin: TestUser;
  let slug: string;

  beforeEach(async () => {
    ctx = createTestApp();
    admin = await registerUser(ctx.app, { admin: true, db: ctx.db });
    slug = await createTool(ctx.app, admin.accessToken);
  });

  it("클릭 기록: 본문 없는 POST(sendBeacon 호환)에 202를 반환한다", async () => {
    const res = await request(ctx.app)
      .post(`/api/v1/tools/${slug}/clicks`)
      .set("User-Agent", "test-agent")
      .set("Referer", "https://autohub-ai.vercel.app/")
      .expect(202);
    expect(res.body).toEqual({ accepted: true });
  });

  it("없는 툴 클릭: 404", async () => {
    await request(ctx.app).post("/api/v1/tools/ghost/clicks").expect(404);
  });

  it("groupBy=tool 집계가 클릭 수 내림차순으로 반환된다", async () => {
    const other = await createTool(ctx.app, admin.accessToken);
    await request(ctx.app).post(`/api/v1/tools/${slug}/clicks`).expect(202);
    await request(ctx.app).post(`/api/v1/tools/${slug}/clicks`).expect(202);
    await request(ctx.app).post(`/api/v1/tools/${other}/clicks`).expect(202);

    const res = await request(ctx.app)
      .get("/api/v1/stats/clicks?groupBy=tool")
      .set("Authorization", `Bearer ${admin.accessToken}`)
      .expect(200);

    expect(res.body.data[0]).toMatchObject({ slug, count: 2 });
    expect(res.body.data[1]).toMatchObject({ slug: other, count: 1 });
    expect(res.body.meta.totalClicks).toBe(3);
  });

  it("groupBy=day 집계가 날짜별로 반환된다", async () => {
    await request(ctx.app).post(`/api/v1/tools/${slug}/clicks`).expect(202);
    const res = await request(ctx.app)
      .get("/api/v1/stats/clicks?groupBy=day")
      .set("Authorization", `Bearer ${admin.accessToken}`)
      .expect(200);
    expect(res.body.data).toHaveLength(1);
    expect(res.body.data[0].day).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(res.body.data[0].count).toBe(1);
  });

  it("통계는 관리자 전용 (user: 403, 익명: 401)", async () => {
    const user = await registerUser(ctx.app);
    await request(ctx.app)
      .get("/api/v1/stats/clicks")
      .set("Authorization", `Bearer ${user.accessToken}`)
      .expect(403);
    await request(ctx.app).get("/api/v1/stats/clicks").expect(401);
  });

  it("from > to 범위: 400", async () => {
    await request(ctx.app)
      .get("/api/v1/stats/clicks?from=2026-02-01&to=2026-01-01")
      .set("Authorization", `Bearer ${admin.accessToken}`)
      .expect(400);
  });
});
