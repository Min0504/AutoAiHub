/**
 * Express Request 타입 확장 (declaration merging).
 * 미들웨어가 심어주는 값들을 타입 안전하게 쓰기 위한 선언.
 */
declare global {
  namespace Express {
    interface Request {
      /** request-id 미들웨어가 부여. 로그·에러 응답에 포함되어 요청 추적에 쓰인다. */
      requestId: string;
      /** 인증 미들웨어가 access token 검증 후 부여. */
      user?: { id: number; role: "user" | "admin" };
    }
  }
}

export {};
