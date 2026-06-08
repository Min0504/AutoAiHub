export type LeadAccepted = {
  readonly ok: true;
  readonly leadId: string;
};

export type RoiReportLeadPayload = {
  readonly email: string;
  readonly inputs: Readonly<Record<string, number | string>>;
  readonly results: Readonly<Record<string, number | string>>;
};

export type ConsultingMeetingLeadPayload = {
  readonly companyName: string;
  readonly email: string;
  readonly phone: string;
  readonly needs: string;
  readonly budget: string;
  readonly selectedTool: string;
  readonly businessType: string;
  readonly proposalLeadId: string;
};

export class ApiRequestError extends Error {
  public constructor(message: string) {
    super(message);
    this.name = "ApiRequestError";
  }
}

export async function submitRoiReportLead(payload: RoiReportLeadPayload): Promise<LeadAccepted> {
  return postLead("/api/leads/roi-report", payload);
}

export async function submitConsultingMeetingLead(
  payload: ConsultingMeetingLeadPayload,
): Promise<LeadAccepted> {
  return postLead("/api/leads/consulting-meeting", payload);
}

async function postLead(url: string, payload: Readonly<Record<string, unknown>>): Promise<LeadAccepted> {
  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), 10_000);

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    const responseBody: unknown = await response.json();
    if (!response.ok) {
      throw new ApiRequestError(readErrorMessage(responseBody) ?? "리드 저장 요청이 실패했습니다.");
    }

    if (!isLeadAccepted(responseBody)) {
      throw new ApiRequestError("서버 응답 형식이 올바르지 않습니다.");
    }

    return responseBody;
  } catch (error: unknown) {
    if (error instanceof ApiRequestError) {
      throw error;
    }

    if (error instanceof DOMException && error.name === "AbortError") {
      throw new ApiRequestError("요청 시간이 초과되었습니다. 네트워크 상태를 확인해주세요.");
    }

    throw new ApiRequestError("서버와 통신하지 못했습니다. 잠시 후 다시 시도해주세요.");
  } finally {
    window.clearTimeout(timeoutId);
  }
}

function isLeadAccepted(value: unknown): value is LeadAccepted {
  if (!isRecord(value)) {
    return false;
  }

  return value["ok"] === true && typeof value["leadId"] === "string";
}

function readErrorMessage(value: unknown): string | null {
  if (!isRecord(value)) {
    return null;
  }

  const error = value["error"];
  return typeof error === "string" ? error : null;
}

function isRecord(value: unknown): value is Readonly<Record<string, unknown>> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
