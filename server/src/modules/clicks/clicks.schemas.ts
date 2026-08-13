import { z } from "zod";

const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "YYYY-MM-DD 형식이어야 합니다.");

export const clickStatsQuerySchema = z
  .object({
    groupBy: z.enum(["tool", "day"]).default("tool"),
    /** 기본값: 최근 30일 */
    from: isoDate.optional(),
    to: isoDate.optional(),
  })
  .refine((v) => !v.from || !v.to || v.from <= v.to, {
    message: "from은 to보다 이후일 수 없습니다.",
  });

export type ClickStatsQuery = z.infer<typeof clickStatsQuerySchema>;
