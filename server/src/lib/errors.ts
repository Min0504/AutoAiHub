/**
 * API 전역에서 사용하는 에러 체계.
 *
 * - 서비스/라우터는 상황에 맞는 AppError를 throw 한다.
 * - 중앙 에러 핸들러(middleware/error-handler.ts)가 HTTP 응답으로 변환한다.
 * - 클라이언트는 HTTP status + 기계가 읽을 수 있는 `code`로 분기한다.
 */
export type ErrorCode =
  | "VALIDATION_ERROR"
  | "UNAUTHORIZED"
  | "INVALID_CREDENTIALS"
  | "INVALID_TOKEN"
  | "TOKEN_EXPIRED"
  | "REFRESH_REUSE_DETECTED"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "CONFLICT"
  | "RATE_LIMITED"
  | "INTERNAL";

export class AppError extends Error {
  readonly status: number;
  readonly code: ErrorCode;
  readonly details: unknown;

  constructor(status: number, code: ErrorCode, message: string, details?: unknown) {
    super(message);
    this.name = "AppError";
    this.status = status;
    this.code = code;
    this.details = details;
  }

  static badRequest(message: string, details?: unknown): AppError {
    return new AppError(400, "VALIDATION_ERROR", message, details);
  }

  static unauthorized(message = "인증이 필요합니다.", code: ErrorCode = "UNAUTHORIZED"): AppError {
    return new AppError(401, code, message);
  }

  static forbidden(message = "권한이 없습니다."): AppError {
    return new AppError(403, "FORBIDDEN", message);
  }

  static notFound(message = "리소스를 찾을 수 없습니다."): AppError {
    return new AppError(404, "NOT_FOUND", message);
  }

  static conflict(message: string): AppError {
    return new AppError(409, "CONFLICT", message);
  }

  static rateLimited(retryAfterSec: number): AppError {
    return new AppError(429, "RATE_LIMITED", "요청이 너무 많습니다. 잠시 후 다시 시도하세요.", {
      retryAfterSec,
    });
  }
}
