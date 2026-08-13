import type { RequestHandler } from "express";
import { AppError } from "../lib/errors.js";

export interface RateLimitOptions {
  /** 윈도우 길이 (ms) */
  windowMs: number;
  /** 윈도우당 허용 요청 수 */
  max: number;
  /** 버킷 키 접두어 — 라우트 그룹별로 독립된 한도를 갖게 한다. */
  keyPrefix: string;
}

interface Bucket {
  count: number;
  resetAt: number;
}

/**
 * 고정 윈도우(fixed-window) 레이트 리미터 — 직접 구현.
 *
 * 알고리즘: IP별로 "윈도우 시작 후 요청 수"를 세고, 윈도우가 지나면 리셋.
 * 장점: 구현이 단순하고 메모리 예측 가능. 단점: 윈도우 경계에서 순간 2배 허용(burst).
 *
 * 한계(면접 단골 주제):
 * - 프로세스 메모리에 저장하므로 서버를 여러 대로 늘리면 한도가 대수만큼 늘어난다.
 *   → 수평 확장 시 Redis 같은 공유 저장소 기반으로 옮겨야 한다.
 * - 더 부드러운 제어가 필요하면 sliding window / token bucket 알고리즘을 검토.
 */
export function createRateLimiter(options: RateLimitOptions): RequestHandler {
  const buckets = new Map<string, Bucket>();

  // 만료된 버킷을 주기적으로 청소해 메모리 누수를 막는다.
  const sweeper = setInterval(() => {
    const now = Date.now();
    for (const [key, bucket] of buckets) {
      if (bucket.resetAt <= now) buckets.delete(key);
    }
  }, options.windowMs);
  sweeper.unref(); // 이 타이머 때문에 프로세스 종료가 막히지 않도록

  return (req, res, next) => {
    const key = `${options.keyPrefix}:${req.ip ?? "unknown"}`;
    const now = Date.now();

    let bucket = buckets.get(key);
    if (!bucket || bucket.resetAt <= now) {
      bucket = { count: 0, resetAt: now + options.windowMs };
      buckets.set(key, bucket);
    }
    bucket.count += 1;

    const remaining = Math.max(0, options.max - bucket.count);
    const resetSec = Math.max(1, Math.ceil((bucket.resetAt - now) / 1000));

    // IETF draft 표준 헤더 — 클라이언트가 남은 한도를 보고 스스로 조절할 수 있게 한다.
    res.setHeader("RateLimit-Limit", String(options.max));
    res.setHeader("RateLimit-Remaining", String(remaining));
    res.setHeader("RateLimit-Reset", String(resetSec));

    if (bucket.count > options.max) {
      res.setHeader("Retry-After", String(resetSec));
      next(AppError.rateLimited(resetSec));
      return;
    }
    next();
  };
}
