import { AppError } from "../../lib/errors.js";
import type { ToolsRepository } from "../tools/tools.repository.js";
import type { ClickStatsQuery } from "./clicks.schemas.js";
import type {
  ClicksRepository,
  ClickStatsByDayRow,
  ClickStatsByToolRow,
} from "./clicks.repository.js";

export interface ClickStatsResult {
  data: ClickStatsByToolRow[] | ClickStatsByDayRow[];
  meta: { groupBy: "tool" | "day"; from: string; to: string; totalClicks: number };
}

const DAY_MS = 24 * 60 * 60 * 1000;
const DEFAULT_RANGE_DAYS = 30;

export class ClicksService {
  constructor(
    private readonly repo: ClicksRepository,
    private readonly toolsRepo: ToolsRepository,
  ) {}

  record(
    toolSlug: string,
    context: { userId: number | null; referrer: string | null; userAgent: string | null },
  ): void {
    const toolId = this.toolsRepo.findIdBySlug(toolSlug);
    if (toolId === undefined) throw AppError.notFound(`'${toolSlug}' 툴을 찾을 수 없습니다.`);
    this.repo.record({ toolId, ...context });
  }

  stats(query: ClickStatsQuery): ClickStatsResult {
    const to = query.to ?? isoDay(new Date());
    const from = query.from ?? isoDay(new Date(Date.now() - DEFAULT_RANGE_DAYS * DAY_MS));

    // to는 포함(inclusive) 날짜이므로 상한은 "to + 1일 00:00" (exclusive)로 계산한다.
    const fromIso = `${from}T00:00:00.000Z`;
    const toExclusiveIso = `${isoDay(new Date(Date.parse(`${to}T00:00:00.000Z`) + DAY_MS))}T00:00:00.000Z`;

    const data =
      query.groupBy === "day"
        ? this.repo.statsByDay(fromIso, toExclusiveIso)
        : this.repo.statsByTool(fromIso, toExclusiveIso);

    return {
      data,
      meta: {
        groupBy: query.groupBy,
        from,
        to,
        totalClicks: this.repo.totalInRange(fromIso, toExclusiveIso),
      },
    };
  }
}

function isoDay(date: Date): string {
  return date.toISOString().slice(0, 10);
}
