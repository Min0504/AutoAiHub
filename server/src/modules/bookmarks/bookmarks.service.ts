import { AppError } from "../../lib/errors.js";
import { toToolListItem } from "../tools/tools.mappers.js";
import type { ToolsRepository } from "../tools/tools.repository.js";
import type { ToolListItem } from "../tools/tools.types.js";
import type { BookmarksRepository } from "./bookmarks.repository.js";

export interface BookmarkDto {
  tool: ToolListItem;
  bookmarkedAt: string;
}

export class BookmarksService {
  constructor(
    private readonly repo: BookmarksRepository,
    private readonly toolsRepo: ToolsRepository,
  ) {}

  list(userId: number): BookmarkDto[] {
    return this.repo.listByUser(userId).map((row) => ({
      tool: toToolListItem(row),
      bookmarkedAt: row.bookmarked_at,
    }));
  }

  add(userId: number, toolSlug: string): void {
    this.repo.add(userId, this.requireToolId(toolSlug));
  }

  remove(userId: number, toolSlug: string): void {
    this.repo.remove(userId, this.requireToolId(toolSlug));
  }

  private requireToolId(slug: string): number {
    const toolId = this.toolsRepo.findIdBySlug(slug);
    if (toolId === undefined) throw AppError.notFound(`'${slug}' 툴을 찾을 수 없습니다.`);
    return toolId;
  }
}
