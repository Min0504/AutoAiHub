import { randomUUID } from "node:crypto";
import type { RequestHandler } from "express";

/**
 * 모든 요청에 고유 ID를 부여한다.
 *
 * - 게이트웨이/프록시가 넘겨준 X-Request-Id가 있으면 재사용 → 서비스 간 추적(correlation) 가능.
 * - 응답 헤더로 돌려주므로 사용자 문의 시 "요청 ID 알려주세요"로 로그를 바로 찾을 수 있다.
 */
const SAFE_ID_PATTERN = /^[A-Za-z0-9._-]{1,128}$/;

export function requestId(): RequestHandler {
  return (req, res, next) => {
    const incoming = req.header("x-request-id");
    const id = incoming && SAFE_ID_PATTERN.test(incoming) ? incoming : randomUUID();
    req.requestId = id;
    res.setHeader("X-Request-Id", id);
    next();
  };
}
