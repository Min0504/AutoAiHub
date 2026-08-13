import { randomBytes, scrypt as scryptCallback, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";

const scrypt = promisify(scryptCallback) as (
  password: string,
  salt: Buffer,
  keylen: number,
  options: { N: number; r: number; p: number },
) => Promise<Buffer>;

/**
 * 비밀번호 해싱: Node 내장 scrypt (메모리-하드 KDF).
 *
 * - 평문/단순 해시(sha256) 저장은 금물. KDF(scrypt/bcrypt/argon2)를 쓴다.
 * - salt는 사용자마다 무작위 생성 → 동일 비밀번호라도 해시가 달라 rainbow table 무력화.
 * - 파라미터(N,r,p)를 해시 문자열에 함께 저장해 향후 강도 상향(마이그레이션)이 가능하다.
 * - 동기 API(scryptSync) 대신 비동기를 사용해 이벤트 루프 블로킹을 피한다.
 */
const SCRYPT_PARAMS = { N: 16384, r: 8, p: 1 } as const;
const KEY_LENGTH = 64;
const SALT_LENGTH = 16;

export async function hashPassword(plain: string): Promise<string> {
  const salt = randomBytes(SALT_LENGTH);
  const derived = await scrypt(plain, salt, KEY_LENGTH, SCRYPT_PARAMS);
  const { N, r, p } = SCRYPT_PARAMS;
  return `scrypt:${N}:${r}:${p}:${salt.toString("hex")}:${derived.toString("hex")}`;
}

export async function verifyPassword(plain: string, stored: string): Promise<boolean> {
  const parts = stored.split(":");
  if (parts.length !== 6 || parts[0] !== "scrypt") return false;

  const [, nStr, rStr, pStr, saltHex, hashHex] = parts;
  const N = Number(nStr);
  const r = Number(rStr);
  const p = Number(pStr);
  if (!Number.isInteger(N) || !Number.isInteger(r) || !Number.isInteger(p)) return false;

  const salt = Buffer.from(saltHex ?? "", "hex");
  const expected = Buffer.from(hashHex ?? "", "hex");
  if (salt.length === 0 || expected.length === 0) return false;

  const derived = await scrypt(plain, salt, expected.length, { N, r, p });
  // 단순 === 비교는 일치 위치에 따라 시간이 달라져 타이밍 공격에 노출된다.
  return timingSafeEqual(derived, expected);
}
