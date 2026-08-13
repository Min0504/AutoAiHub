import { z } from "zod";

export const createReviewSchema = z.object({
  rating: z.number().int().min(1, "평점은 1~5점입니다.").max(5, "평점은 1~5점입니다."),
  content: z.string().trim().min(10, "리뷰는 10자 이상 작성해 주세요.").max(2000),
});
export type CreateReviewInput = z.infer<typeof createReviewSchema>;

export const updateReviewSchema = createReviewSchema.partial().refine(
  (value) => Object.keys(value).length > 0,
  { message: "수정할 필드가 최소 1개 필요합니다." },
);
export type UpdateReviewInput = z.infer<typeof updateReviewSchema>;

export const reviewIdParamSchema = z.object({
  id: z.coerce.number().int().positive(),
});
