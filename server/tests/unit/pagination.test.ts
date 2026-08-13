import { describe, expect, it } from "vitest";
import {
  buildPageMeta,
  escapeLike,
  paginationQuerySchema,
  toPagination,
} from "../../src/lib/pagination.js";

describe("pagination", () => {
  it("기본값: page=1, limit=20", () => {
    const parsed = paginationQuerySchema.parse({});
    expect(parsed).toEqual({ page: 1, limit: 20 });
  });

  it("limit 상한(100)을 넘으면 검증 에러", () => {
    expect(() => paginationQuerySchema.parse({ limit: "101" })).toThrow();
  });

  it("query string 값(문자열)을 숫자로 강제 변환한다", () => {
    expect(paginationQuerySchema.parse({ page: "3", limit: "50" })).toEqual({ page: 3, limit: 50 });
  });

  it("offset 계산: (page-1) * limit", () => {
    expect(toPagination({ page: 3, limit: 10 }).offset).toBe(20);
  });

  it("totalPages는 올림, 최소 1", () => {
    expect(buildPageMeta(toPagination({ page: 1, limit: 10 }), 0).totalPages).toBe(1);
    expect(buildPageMeta(toPagination({ page: 1, limit: 10 }), 11).totalPages).toBe(2);
  });
});

describe("escapeLike", () => {
  it("LIKE 와일드카드 문자를 이스케이프한다", () => {
    expect(escapeLike("100%_done\\")).toBe("100\\%\\_done\\\\");
  });
});
