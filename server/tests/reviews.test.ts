import request from "supertest";
import { beforeEach, describe, expect, it } from "vitest";
import {
  createTestApp,
  createTool,
  registerUser,
  type TestContext,
  type TestUser,
} from "./helpers/test-app.js";

describe("reviews API", () => {
  let ctx: TestContext;
  let admin: TestUser;
  let author: TestUser;
  let slug: string;

  beforeEach(async () => {
    ctx = createTestApp();
    admin = await registerUser(ctx.app, { admin: true, db: ctx.db });
    author = await registerUser(ctx.app);
    slug = await createTool(ctx.app, admin.accessToken);
  });

  async function createReview(token: string): Promise<number> {
    const res = await request(ctx.app)
      .post(`/api/v1/tools/${slug}/reviews`)
      .set("Authorization", `Bearer ${token}`)
      .send({ rating: 5, content: "정말 유용한 자동화 도구입니다" })
      .expect(201);
    return res.body.data.id;
  }

  it("리뷰 작성 → 목록에서 작성자 닉네임과 함께 조회된다", async () => {
    await createReview(author.accessToken);
    const res = await request(ctx.app).get(`/api/v1/tools/${slug}/reviews`).expect(200);
    expect(res.body.data).toHaveLength(1);
    expect(res.body.data[0]).toMatchObject({
      rating: 5,
      toolSlug: slug,
      author: { id: author.userId },
    });
    expect(res.body.data[0].author.nickname).toBeTypeOf("string");
    expect(res.body.meta.totalItems).toBe(1);
  });

  it("같은 툴에 두 번째 리뷰: 409", async () => {
    await createReview(author.accessToken);
    await request(ctx.app)
      .post(`/api/v1/tools/${slug}/reviews`)
      .set("Authorization", `Bearer ${author.accessToken}`)
      .send({ rating: 1, content: "두 번째 리뷰는 안 됩니다" })
      .expect(409);
  });

  it("없는 툴에 리뷰 작성: 404", async () => {
    await request(ctx.app)
      .post("/api/v1/tools/ghost-tool/reviews")
      .set("Authorization", `Bearer ${author.accessToken}`)
      .send({ rating: 3, content: "존재하지 않는 툴 리뷰" })
      .expect(404);
  });

  it("비로그인 리뷰 작성: 401", async () => {
    await request(ctx.app)
      .post(`/api/v1/tools/${slug}/reviews`)
      .send({ rating: 3, content: "인증 없는 리뷰 시도입니다" })
      .expect(401);
  });

  it("범위 밖 rating(6): 400", async () => {
    await request(ctx.app)
      .post(`/api/v1/tools/${slug}/reviews`)
      .set("Authorization", `Bearer ${author.accessToken}`)
      .send({ rating: 6, content: "평점 범위를 벗어난 리뷰" })
      .expect(400);
  });

  describe("소유권(ownership) 검사", () => {
    it("작성자 본인은 수정할 수 있다", async () => {
      const id = await createReview(author.accessToken);
      const res = await request(ctx.app)
        .patch(`/api/v1/reviews/${id}`)
        .set("Authorization", `Bearer ${author.accessToken}`)
        .send({ rating: 2 })
        .expect(200);
      expect(res.body.data.rating).toBe(2);
    });

    it("다른 사용자는 수정할 수 없다 (403)", async () => {
      const id = await createReview(author.accessToken);
      const stranger = await registerUser(ctx.app);
      await request(ctx.app)
        .patch(`/api/v1/reviews/${id}`)
        .set("Authorization", `Bearer ${stranger.accessToken}`)
        .send({ rating: 1 })
        .expect(403);
    });

    it("관리자도 남의 리뷰 '내용'은 수정할 수 없다 (403)", async () => {
      const id = await createReview(author.accessToken);
      await request(ctx.app)
        .patch(`/api/v1/reviews/${id}`)
        .set("Authorization", `Bearer ${admin.accessToken}`)
        .send({ rating: 1 })
        .expect(403);
    });

    it("삭제: 작성자 본인 가능", async () => {
      const id = await createReview(author.accessToken);
      await request(ctx.app)
        .delete(`/api/v1/reviews/${id}`)
        .set("Authorization", `Bearer ${author.accessToken}`)
        .expect(204);
    });

    it("삭제: 관리자도 가능 (운영 모더레이션)", async () => {
      const id = await createReview(author.accessToken);
      await request(ctx.app)
        .delete(`/api/v1/reviews/${id}`)
        .set("Authorization", `Bearer ${admin.accessToken}`)
        .expect(204);
    });

    it("삭제: 제3자는 403", async () => {
      const id = await createReview(author.accessToken);
      const stranger = await registerUser(ctx.app);
      await request(ctx.app)
        .delete(`/api/v1/reviews/${id}`)
        .set("Authorization", `Bearer ${stranger.accessToken}`)
        .expect(403);
    });
  });

  it("툴 삭제 시 리뷰도 함께 삭제된다 (FK CASCADE)", async () => {
    const id = await createReview(author.accessToken);
    await request(ctx.app)
      .delete(`/api/v1/tools/${slug}`)
      .set("Authorization", `Bearer ${admin.accessToken}`)
      .expect(204);

    await request(ctx.app)
      .patch(`/api/v1/reviews/${id}`)
      .set("Authorization", `Bearer ${author.accessToken}`)
      .send({ rating: 1 })
      .expect(404);
  });
});
