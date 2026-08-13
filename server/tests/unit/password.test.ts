import { describe, expect, it } from "vitest";
import { hashPassword, verifyPassword } from "../../src/lib/password.js";

describe("password hashing (scrypt)", () => {
  it("해시 후 원래 비밀번호로 검증에 성공한다", async () => {
    const hash = await hashPassword("correct-horse-1");
    expect(await verifyPassword("correct-horse-1", hash)).toBe(true);
  });

  it("틀린 비밀번호는 검증에 실패한다", async () => {
    const hash = await hashPassword("correct-horse-1");
    expect(await verifyPassword("wrong-password-1", hash)).toBe(false);
  });

  it("같은 비밀번호라도 salt 때문에 매번 다른 해시가 나온다", async () => {
    const a = await hashPassword("same-password-1");
    const b = await hashPassword("same-password-1");
    expect(a).not.toBe(b);
  });

  it("해시 문자열에 KDF 파라미터가 포함된다 (향후 강도 상향 대비)", async () => {
    const hash = await hashPassword("some-password-1");
    expect(hash).toMatch(/^scrypt:16384:8:1:[0-9a-f]{32}:[0-9a-f]{128}$/);
  });

  it("손상된 해시 문자열은 조용히 false를 반환한다", async () => {
    expect(await verifyPassword("x", "not-a-valid-hash")).toBe(false);
    expect(await verifyPassword("x", "scrypt:bad:8:1:zz:zz")).toBe(false);
  });
});
