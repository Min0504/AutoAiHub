import type { ErrorRequestHandler, RequestHandler } from "express";
import type { Logger } from "pino";
import { ZodError } from "zod";
import { AppError } from "../lib/errors.js";

/**
 * 매칭되는 라우트가 없을 때. 라우터 등록 "맨 마지막"에 mount 해야 한다.
 */
export function notFoundHandler(): RequestHandler {
  return (req, _res, next) => {
    next(AppError.notFound(`경로를 찾을 수 없습니다: ${req.method} ${req.path}`));
  };
}

interface HttpErrorLike {
  status?: number;
  statusCode?: number;
  expose?: boolean;
  type?: string;
}

/**
 * 중앙 에러 핸들러 — 모든 에러가 마지막에 도달하는 곳.
 *
 * 설계 원칙:
 * - 응답 포맷을 한 곳에서 통일한다: { error: { code, message, details?, requestId } }
 * - 예상된 에러(AppError, zod, body-parser)는 4xx로 변환하고 조용히 처리
 * - 예상 못한 에러는 500 + 로그. 내부 메시지/스택은 절대 클라이언트에 노출하지 않는다.
 *
 * Express 5는 async 핸들러가 reject한 Promise를 자동으로 next(err)로 넘겨주므로
 * try/catch 래퍼 없이도 모든 비동기 에러가 여기로 모인다.
 */
export function errorHandler(logger: Logger): ErrorRequestHandler {
  return (err: unknown, req, res, next) => {
    if (res.headersSent) {
      next(err);
      return;
    }

    let appError: AppError;

    if (err instanceof AppError) {
      appError = err;
    } else if (err instanceof ZodError) {
      appError = AppError.badRequest(
        "요청 값이 올바르지 않습니다.",
        err.issues.map((issue) => ({
          path: issue.path.join("."),
          message: issue.message,
        })),
      );
    } else if (isClientHttpError(err)) {
      // express.json() 등이 던지는 파싱/페이로드 에러 (SyntaxError + status 400, 413 ...)
      const status = getStatus(err);
      appError = new AppError(
        status,
        "VALIDATION_ERROR",
        status === 413 ? "요청 본문이 너무 큽니다." : "요청 본문을 해석할 수 없습니다.",
      );
    } else {
      logger.error({ err, requestId: req.requestId }, "unhandled error");
      appError = new AppError(500, "INTERNAL", "서버 내부 오류가 발생했습니다.");
    }

    res.status(appError.status).json({
      error: {
        code: appError.code,
        message: appError.message,
        ...(appError.details !== undefined ? { details: appError.details } : {}),
        requestId: req.requestId,
      },
    });
  };
}

function getStatus(err: unknown): number {
  const e = err as HttpErrorLike;
  return e.status ?? e.statusCode ?? 500;
}

function isClientHttpError(err: unknown): boolean {
  if (typeof err !== "object" || err === null) return false;
  const status = getStatus(err);
  return status >= 400 && status < 500;
}
