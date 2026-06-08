export class BadRequestError extends Error {
  public constructor(public readonly fieldName: string, message: string) {
    super(message);
    this.name = "BadRequestError";
  }
}

export function readRecord(value: unknown): Readonly<Record<string, unknown>> {
  if (!isRecord(value)) {
    throw new BadRequestError("body", "요청 본문 형식이 올바르지 않습니다.");
  }

  return value;
}

export function readRequiredString(
  record: Readonly<Record<string, unknown>>,
  fieldName: string,
): string {
  const value = record[fieldName];
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new BadRequestError(fieldName, `${fieldName} 값을 입력해주세요.`);
  }

  return value.trim();
}

export function readOptionalString(
  record: Readonly<Record<string, unknown>>,
  fieldName: string,
): string {
  const value = record[fieldName];
  if (typeof value !== "string") {
    return "";
  }

  return value.trim();
}

export function readStringArrayMessages(value: unknown): readonly ChatInputMessage[] {
  if (!Array.isArray(value)) {
    throw new BadRequestError("messages", "대화 메세지 배열이 올바르지 않습니다.");
  }

  return value.map((item, index) => {
    const record = readRecord(item);
    const role = readRequiredString(record, "role");
    if (role !== "user" && role !== "model") {
      throw new BadRequestError(`messages[${index}].role`, "role 값은 user 또는 model이어야 합니다.");
    }

    return {
      role,
      text: readRequiredString(record, "text"),
    };
  });
}

export function parseJsonObject(text: string): Readonly<Record<string, unknown>> {
  const parsed: unknown = JSON.parse(text);
  return readRecord(parsed);
}

export type ChatInputMessage = {
  readonly role: "user" | "model";
  readonly text: string;
};

function isRecord(value: unknown): value is Readonly<Record<string, unknown>> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
