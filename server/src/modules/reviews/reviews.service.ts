import { AppError } from "../../lib/errors.js";
import { buildPageMeta, toPagination, type PageMeta } from "../../lib/pagination.js";
import type { ToolsRepository } from "../tools/tools.repository.js";
import type { CreateReviewInput, UpdateReviewInput } from "./reviews.schemas.js";
import type { ReviewsRepository, ReviewRow } from "./reviews.repository.js";

export interface ReviewDto {
  id: number;
  toolSlug: string;
  rating: number;
  content: string;
  author: { id: number; nickname: string };
  createdAt: string;
  updatedAt: string;
}

interface Actor {
  id: number;
  role: "user" | "admin";
}

export class ReviewsService {
  constructor(
    private readonly repo: ReviewsRepository,
    private readonly toolsRepo: ToolsRepository,
  ) {}

  listForTool(
    slug: string,
    query: { page: number; limit: number },
  ): { data: ReviewDto[]; meta: PageMeta } {
    const toolId = this.requireToolId(slug);
    const pagination = toPagination(query);
    const rows = this.repo.listByToolId(toolId, pagination);
    const total = this.repo.countByToolId(toolId);
    return { data: rows.map(toReviewDto), meta: buildPageMeta(pagination, total) };
  }

  createForTool(slug: string, actor: Actor, input: CreateReviewInput): ReviewDto {
    const toolId = this.requireToolId(slug);
    if (this.repo.existsByToolAndUser(toolId, actor.id)) {
      throw AppError.conflict("이미 이 툴에 리뷰를 작성했습니다. 기존 리뷰를 수정해 주세요.");
    }
    return toReviewDto(
      this.repo.create({ toolId, userId: actor.id, rating: input.rating, content: input.content }),
    );
  }

  /** 소유권 검사: 리뷰 내용 수정은 작성자 본인만 가능하다. */
  update(reviewId: number, actor: Actor, input: UpdateReviewInput): ReviewDto {
    const review = this.requireReview(reviewId);
    if (review.user_id !== actor.id) {
      throw AppError.forbidden("본인이 작성한 리뷰만 수정할 수 있습니다.");
    }
    const updated = this.repo.update(reviewId, input);
    if (!updated) throw AppError.notFound("리뷰를 찾을 수 없습니다.");
    return toReviewDto(updated);
  }

  /** 삭제는 작성자 본인 또는 관리자(운영 목적)가 가능하다. */
  delete(reviewId: number, actor: Actor): void {
    const review = this.requireReview(reviewId);
    if (review.user_id !== actor.id && actor.role !== "admin") {
      throw AppError.forbidden("본인이 작성한 리뷰만 삭제할 수 있습니다.");
    }
    this.repo.delete(reviewId);
  }

  private requireToolId(slug: string): number {
    const toolId = this.toolsRepo.findIdBySlug(slug);
    if (toolId === undefined) throw AppError.notFound(`'${slug}' 툴을 찾을 수 없습니다.`);
    return toolId;
  }

  private requireReview(reviewId: number): ReviewRow {
    const review = this.repo.findById(reviewId);
    if (!review) throw AppError.notFound("리뷰를 찾을 수 없습니다.");
    return review;
  }
}

function toReviewDto(row: ReviewRow): ReviewDto {
  return {
    id: row.id,
    toolSlug: row.tool_slug,
    rating: row.rating,
    content: row.content,
    author: { id: row.user_id, nickname: row.author_nickname },
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}
