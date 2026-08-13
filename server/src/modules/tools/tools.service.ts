import { AppError } from "../../lib/errors.js";
import { buildPageMeta, toPagination, type PageMeta } from "../../lib/pagination.js";
import { toToolDetail, toToolListItem } from "./tools.mappers.js";
import type { CreateToolInput, ListToolsQuery, UpdateToolInput } from "./tools.schemas.js";
import type { ToolsRepository } from "./tools.repository.js";
import type { ToolDetail, ToolListItem } from "./tools.types.js";

/**
 * Service 계층: 비즈니스 규칙 담당.
 * HTTP(요청/응답)도, SQL도 모른다 → 단위 테스트가 쉽고 재사용 가능하다.
 */
export class ToolsService {
  constructor(private readonly repo: ToolsRepository) {}

  list(query: ListToolsQuery): { data: ToolListItem[]; meta: PageMeta } {
    const pagination = toPagination(query);
    const { rows, total } = this.repo.list(query, pagination);
    return {
      data: rows.map(toToolListItem),
      meta: buildPageMeta(pagination, total),
    };
  }

  getBySlug(slug: string): ToolDetail {
    const row = this.repo.findBySlug(slug);
    if (!row) throw AppError.notFound(`'${slug}' 툴을 찾을 수 없습니다.`);
    return toToolDetail(row);
  }

  create(input: CreateToolInput): ToolDetail {
    if (this.repo.findIdBySlug(input.slug) !== undefined) {
      throw AppError.conflict(`'${input.slug}' slug가 이미 존재합니다.`);
    }
    return toToolDetail(this.repo.create(input));
  }

  update(slug: string, input: UpdateToolInput): ToolDetail {
    const updated = this.repo.update(slug, input);
    if (!updated) throw AppError.notFound(`'${slug}' 툴을 찾을 수 없습니다.`);
    return toToolDetail(updated);
  }

  delete(slug: string): void {
    const deleted = this.repo.delete(slug);
    if (!deleted) throw AppError.notFound(`'${slug}' 툴을 찾을 수 없습니다.`);
  }
}
