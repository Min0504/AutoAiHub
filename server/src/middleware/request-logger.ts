import type { IncomingMessage, ServerResponse } from "node:http";
import type { RequestHandler } from "express";
import type { Logger } from "pino";
import { pinoHttp } from "pino-http";

/**
 * 구조화(JSON) 요청 로깅.
 * console.log 대신 pino를 쓰는 이유: 로그 수집기(Datadog, Loki 등)가 파싱할 수 있는
 * 일관된 JSON 포맷 + 요청 ID 연동 + 레벨 제어가 되기 때문.
 */
export function requestLogger(logger: Logger): RequestHandler {
  return pinoHttp({
    logger,
    genReqId: (req: IncomingMessage) =>
      (req as IncomingMessage & { requestId?: string }).requestId ?? "unknown",
    customLogLevel: (_req: IncomingMessage, res: ServerResponse, err?: Error) => {
      if (err || res.statusCode >= 500) return "error";
      if (res.statusCode >= 400) return "warn";
      return "info";
    },
    // 헬스체크는 주기적으로 호출되므로 로그 노이즈에서 제외한다.
    autoLogging: {
      ignore: (req: IncomingMessage) => req.url === "/health" || req.url === "/health/ready",
    },
  }) as unknown as RequestHandler;
}
