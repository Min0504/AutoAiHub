export class BadRequestError extends Error {
  public constructor(public readonly fieldName: string, message: string) {
    super(message);
    this.name = "BadRequestError";
  }
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_SHORT = 200;
const MAX_MEDIUM = 2000;
const MAX_LONG = 8000;
const MAX_CHAT_MESSAGES = 20;
const MAX_CHAT_TEXT = 4000;

export function readRecord(value: unknown): Readonly<Record<string, unknown>> {
  if (!isRecord(value)) {
    throw new BadRequestError("body", "요청 본문 형식이 올바르지 않습니다.");
  }

  return value;
}

export function readRequiredString(
  record: Readonly<Record<string, unknown>>,
  fieldName: string,
  maxLength: number = MAX_MEDIUM,
): string {
  const value = record[fieldName];
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new BadRequestError(fieldName, `${fieldName} 값을 입력해주세요.`);
  }

  const trimmed = value.trim();
  if (trimmed.length > maxLength) {
    throw new BadRequestError(fieldName, `${fieldName}은(는) ${maxLength}자 이하여야 합니다.`);
  }

  return trimmed;
}

export function readOptionalString(
  record: Readonly<Record<string, unknown>>,
  fieldName: string,
  maxLength: number = MAX_MEDIUM,
): string {
  const value = record[fieldName];
  if (typeof value !== "string") {
    return "";
  }

  const trimmed = value.trim();
  if (trimmed.length > maxLength) {
    throw new BadRequestError(fieldName, `${fieldName}은(는) ${maxLength}자 이하여야 합니다.`);
  }

  return trimmed;
}

export function readRequiredEmail(
  record: Readonly<Record<string, unknown>>,
  fieldName: string = "email",
): string {
  const email = readRequiredString(record, fieldName, MAX_SHORT);
  if (!EMAIL_RE.test(email)) {
    throw new BadRequestError(fieldName, "올바른 이메일 주소를 입력해주세요.");
  }
  return email.toLowerCase();
}

export function readPrivacyAccepted(
  record: Readonly<Record<string, unknown>>,
): boolean {
  const value = record["privacyAccepted"];
  if (value === true || value === "true" || value === 1 || value === "1") {
    return true;
  }
  throw new BadRequestError(
    "privacyAccepted",
    "개인정보 수집·이용 동의가 필요합니다.",
  );
}

export function readStringArrayMessages(value: unknown): readonly ChatInputMessage[] {
  if (!Array.isArray(value)) {
    throw new BadRequestError("messages", "대화 메세지 배열이 올바르지 않습니다.");
  }

  if (value.length === 0) {
    throw new BadRequestError("messages", "대화 메세지가 비어 있습니다.");
  }

  // Cap history to control cost/latency
  const sliced = value.length > MAX_CHAT_MESSAGES
    ? value.slice(value.length - MAX_CHAT_MESSAGES)
    : value;

  return sliced.map((item, index) => {
    const record = readRecord(item);
    const role = readRequiredString(record, "role", 32);
    if (role !== "user" && role !== "model" && role !== "assistant") {
      throw new BadRequestError(
        `messages[${index}].role`,
        "role 값은 user, model 또는 assistant여야 합니다.",
      );
    }

    const text = readRequiredString(record, "text", MAX_CHAT_TEXT);
    return {
      role: role === "user" ? "user" : role === "assistant" ? "assistant" : "model",
      text,
    };
  });
}

export function parseJsonObject(text: string): Readonly<Record<string, unknown>> {
  const parsed: unknown = JSON.parse(text);
  return readRecord(parsed);
}

export type ChatInputMessage = {
  readonly role: "user" | "model" | "assistant";
  readonly text: string;
};

export const FIELD_LIMITS = {
  short: MAX_SHORT,
  medium: MAX_MEDIUM,
  long: MAX_LONG,
} as const;

function isRecord(value: unknown): value is Readonly<Record<string, unknown>> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
