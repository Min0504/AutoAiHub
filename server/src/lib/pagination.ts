import { z } from "zod";

/**
 * offset 기반 페이지네이션.
 * limit 상한을 강제하지 않으면 `?limit=1000000` 한 방에 서버가 죽을 수 있다.
 * (대규모 데이터라면 cursor 기반으로 전환 — docs/backend/learning-roadmap.md 참고)
 */
export const paginationQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

export interface Pagination {
  page: number;
  limit: number;
  offset: number;
}

export interface PageMeta {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
}

export function toPagination(input: { page: number; limit: number }): Pagination {
  return { page: input.page, limit: input.limit, offset: (input.page - 1) * input.limit };
}

export function buildPageMeta(pagination: Pagination, totalItems: number): PageMeta {
  return {
    page: pagination.page,
    limit: pagination.limit,
    totalItems,
    totalPages: Math.max(1, Math.ceil(totalItems / pagination.limit)),
  };
}

/** SQL LIKE 패턴 문자를 이스케이프한다. 쿼리에서 `ESCAPE '\'`와 함께 사용. */
export function escapeLike(term: string): string {
  return term.replace(/[\\%_]/g, (ch) => `\\${ch}`);
}
