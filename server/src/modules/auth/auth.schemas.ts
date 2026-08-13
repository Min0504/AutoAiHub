import { z } from "zod";

/**
 * 요청 본문 검증 스키마 (시스템 경계 검증).
 * 라우터가 handler 첫 줄에서 `schema.parse(req.body)`로 사용하고,
 * 실패 시 ZodError → 중앙 에러 핸들러가 400 VALIDATION_ERROR로 변환한다.
 */
export const registerSchema = z.object({
  email: z.email("올바른 이메일 형식이 아닙니다.").max(254),
  password: z
    .string()
    .min(8, "비밀번호는 8자 이상이어야 합니다.")
    .max(128)
    .regex(/[A-Za-z]/, "비밀번호에 영문자가 포함되어야 합니다.")
    .regex(/\d/, "비밀번호에 숫자가 포함되어야 합니다."),
  nickname: z.string().trim().min(2, "닉네임은 2자 이상이어야 합니다.").max(30),
});

export const loginSchema = z.object({
  email: z.email().max(254),
  password: z.string().min(1).max(128),
});

export const refreshSchema = z.object({
  refreshToken: z.string().min(1).max(512),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
