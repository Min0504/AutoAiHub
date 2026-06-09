import type Groq from "groq-sdk";
import type { Express, Request, Response } from "express";
import { saveLead } from "./leadStore";
import { notifyNewLead } from "./notifySlack";
import {
  BadRequestError,
  parseJsonObject,
  readOptionalString,
  readRecord,
  readRequiredString,
  readStringArrayMessages,
} from "./requestParsing";

export function registerAiRoutes(
  app: Express,
  groq: Groq | null,
  modelName: string,
): void {

  // ── /api/recommend ──────────────────────────────────────────────────────
  app.post("/api/recommend", async (req: Request, res: Response) => {
    try {
      const body = readRecord(req.body);
      const userPrompt = readRequiredString(body, "userPrompt");
      const client = requireGroqClient(groq);

      const completion = await client.chat.completions.create({
        model: modelName,
        messages: [
          { role: "system", content: recommendationSystemPrompt },
          { role: "user", content: `사용자 요구사항: "${userPrompt}"` },
        ],
        response_format: { type: "json_object" },
        temperature: 0.3,
        max_tokens: 2048,
      });

      const text = completion.choices[0]?.message?.content ?? "{}";
      res.json(parseJsonObject(text));
    } catch (error: unknown) {
      handleRouteError(error, res, "AI 추천 분석 중 오류가 발생했습니다.");
    }
  });

  // ── /api/proposal ────────────────────────────────────────────────────────
  app.post("/api/proposal", async (req: Request, res: Response) => {
    try {
      const body = readRecord(req.body);
      const companyName = readRequiredString(body, "companyName");
      const email = readRequiredString(body, "email");
      const needs = readRequiredString(body, "needs");
      const budget = readRequiredString(body, "budget");
      const phone = readOptionalString(body, "phone");
      const selectedTool = readOptionalString(body, "selectedTool");
      const businessType = readOptionalString(body, "businessType");
      const client = requireGroqClient(groq);

      const completion = await client.chat.completions.create({
        model: modelName,
        messages: [
          { role: "system", content: proposalSystemPrompt },
          {
            role: "user",
            content: `회사명: "${companyName}", 이메일: "${email}", 연락처: "${phone ?? "미기입"}", 업종/목적: "${businessType ?? "미기입"}", 요구사항: "${needs}", 예산: "${budget}", 관심 도구: "${selectedTool ?? "선택없음"}"`,
          },
        ],
        response_format: { type: "json_object" },
        temperature: 0.3,
        max_tokens: 3000,
      });

      const text = completion.choices[0]?.message?.content ?? "{}";
      const parsedData = parseJsonObject(text);

      const lead = await saveLead("consulting_proposal", {
        companyName, email, phone, needs, budget, selectedTool, businessType,
        proposal: parsedData,
      });

      void notifyNewLead({
        kind: "consulting_proposal",
        leadId: lead.id,
        email,
        companyName,
        phone,
        budget,
        needs,
      });

      res.json({ ...parsedData, leadId: lead.id });
    } catch (error: unknown) {
      handleRouteError(error, res, "AI 프리미엄 제안서 생성 중 오류가 발생했습니다.");
    }
  });

  // ── /api/chat ────────────────────────────────────────────────────────────
  app.post("/api/chat", async (req: Request, res: Response) => {
    try {
      const body = readRecord(req.body);
      const messages = readStringArrayMessages(body["messages"]);
      const client = requireGroqClient(groq);

      const groqMessages: Groq.Chat.ChatCompletionMessageParam[] = [
        { role: "system", content: chatSystemPrompt },
        ...messages.map((m) => ({
          role: (m.role === "user" ? "user" : "assistant") as "user" | "assistant",
          content: m.text,
        })),
      ];

      const completion = await client.chat.completions.create({
        model: modelName,
        messages: groqMessages,
        temperature: 0.7,
        max_tokens: 2048,
      });

      const text = completion.choices[0]?.message?.content ?? "";
      res.json({ text });
    } catch (error: unknown) {
      handleRouteError(error, res, "AI 에이전트 응답 생성 중 문제가 발생했습니다.");
    }
  });
}

// ── 에러 헬퍼 ────────────────────────────────────────────────────────────────

class MissingApiKeyError extends Error {
  public constructor() {
    super("GROQ_API_KEY가 설정되지 않아 AI 기능을 일시적으로 사용할 수 없습니다.");
    this.name = "MissingApiKeyError";
  }
}

function requireGroqClient(groq: Groq | null): Groq {
  if (groq === null) throw new MissingApiKeyError();
  return groq;
}

function handleRouteError(error: unknown, res: Response, fallbackMessage: string): void {
  if (error instanceof BadRequestError) {
    res.status(400).json({ error: error.message, fieldName: error.fieldName });
    return;
  }
  if (error instanceof MissingApiKeyError) {
    res.status(503).json({ error: error.message });
    return;
  }
  console.error("AI route error:", error);
  res.status(500).json({ error: fallbackMessage });
}

// ── 시스템 프롬프트 ──────────────────────────────────────────────────────────

const recommendationSystemPrompt = `
당신은 세계 최고의 비즈니스 업무 자동화 아키텍트입니다.
사용자의 자동화 니즈를 듣고 n8n, make, zapier, lindy, relay-app, gumloop, activepieces, pipedream, crewai, autogen 중 최적의 1개를 추천하세요.

반드시 다음 JSON 형식으로만 응답하세요:
{
  "scenarioName": "시나리오 이름",
  "recommendedToolId": "n8n 등 위 목록 중 하나",
  "whyThisTool": "추천 이유 (2~3문장)",
  "difficulty": "쉬움|보통|어려움",
  "estimatedTime": "구축 예상 시간",
  "steps": [{"stepNumber": 1, "app": "앱명", "action": "액션명", "description": "설명"}],
  "aiNodeInvolved": true,
  "aiImplementationTip": "AI 활용 팁",
  "costEstimation": "예상 비용"
}
`.trim();

const proposalSystemPrompt = `
당신은 국내 B2B 업무 자동화 구축 에이전시의 수석 아키텍트입니다.
사용자의 회사 정보와 자동화 니즈를 바탕으로 현실적인 기획 제안서를 작성하세요.
과장된 보장 표현을 피하고 신중한 B2B 톤을 유지하세요.

반드시 다음 JSON 형식으로만 응답하세요:
{
  "proposalTitle": "제안서 제목",
  "executiveSummary": "요약 (3~5문장)",
  "recommendedStack": "권장 기술 스택",
  "architectureFlow": "아키텍처 흐름 설명",
  "phaseSteps": [{"phaseName": "단계명", "duration": "기간", "deliverables": "산출물"}],
  "estimatedDevelopmentCost": "예상 개발 비용",
  "annualROIExpected": "연간 ROI 예상",
  "expertMatchingInfo": "전문가 매칭 코멘트"
}
`.trim();

const chatSystemPrompt = `
당신은 업무 자동화 전문 AI 상담사 '오토가이드(AutoGuide)'입니다.
n8n, Make, Zapier, Lindy, Relay.app, Gumloop, Activepieces, Pipedream, CrewAI, AutoGen 등 자동화 툴에 대한 질문에 답변합니다.

답변 원칙:
1. 한국어로, 비개발자도 이해할 수 있게 설명하세요.
2. 가격·난이도·실제 사용 시나리오를 근거로 설명하세요.
3. 확실하지 않은 가격·정책은 "공식 페이지 확인 필요"라고 명시하세요.
4. 마크다운 형식으로 가독성 높게 정리하세요.
5. 답변은 간결하게, 핵심만 전달하세요.
`.trim();
