import { Type, type GoogleGenAI } from "@google/genai";
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

export function registerGeminiRoutes(
  app: Express,
  ai: GoogleGenAI | null,
  modelName: string,
): void {
  app.post("/api/recommend", async (req: Request, res: Response) => {
    try {
      const body = readRecord(req.body);
      const userPrompt = readRequiredString(body, "userPrompt");
      const client = requireAiClient(ai);

      const modelResponse = await client.models.generateContent({
        model: modelName,
        contents: `사용자 요구사항: "${userPrompt}"`,
        config: {
          systemInstruction: recommendationSystemPrompt,
          responseMimeType: "application/json",
          responseSchema: recommendationSchema,
        },
      });

      const parsedData = parseJsonObject(modelResponse.text?.trim() || "{}");
      res.json(parsedData);
    } catch (error: unknown) {
      handleGeminiRouteError(error, res, "AI 추천 분석 중 오류가 발생했습니다.");
    }
  });

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
      const client = requireAiClient(ai);

      const modelResponse = await client.models.generateContent({
        model: modelName,
        contents: `회사명: "${companyName}", 이메일: "${email}", 연락처: "${phone || "미기입"}", 업종/목적: "${businessType || "미기입"}", 요구사항(니즈): "${needs}", 예산조건: "${budget}", 관심 도구: "${selectedTool || "선택없음"}"`,
        config: {
          systemInstruction: proposalSystemPrompt,
          responseMimeType: "application/json",
          responseSchema: proposalSchema,
        },
      });

      const parsedData = parseJsonObject(modelResponse.text?.trim() || "{}");
      const lead = await saveLead("consulting_proposal", {
        companyName,
        email,
        phone,
        needs,
        budget,
        selectedTool,
        businessType,
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
      handleGeminiRouteError(error, res, "AI 프리미엄 제안서 생성 중 오류가 발생했습니다.");
    }
  });

  app.post("/api/chat", async (req: Request, res: Response) => {
    try {
      const body = readRecord(req.body);
      const messages = readStringArrayMessages(body["messages"]);
      const client = requireAiClient(ai);
      const contents = messages.map((message) => ({
        role: message.role === "user" ? "user" : "model",
        parts: [{ text: message.text }],
      }));

      const chatResponse = await client.models.generateContent({
        model: modelName,
        contents,
        config: {
          systemInstruction: chatSystemPrompt,
          temperature: 0.7,
        },
      });

      res.json({ text: chatResponse.text });
    } catch (error: unknown) {
      handleGeminiRouteError(error, res, "AI 에이전트 대답 구상 중 문제가 생겼습니다.");
    }
  });
}

class MissingAiClientError extends Error {
  public constructor() {
    super("GEMINI_API_KEY가 설정되지 않아 AI 기능을 일시적으로 사용할 수 없습니다.");
    this.name = "MissingAiClientError";
  }
}

function requireAiClient(ai: GoogleGenAI | null): GoogleGenAI {
  if (ai === null) {
    throw new MissingAiClientError();
  }

  return ai;
}

function handleGeminiRouteError(error: unknown, res: Response, fallbackMessage: string): void {
  if (error instanceof BadRequestError) {
    res.status(400).json({ error: error.message, fieldName: error.fieldName });
    return;
  }

  if (error instanceof MissingAiClientError) {
    res.status(503).json({ error: error.message });
    return;
  }

  console.error("Gemini route error:", error);
  res.status(500).json({ error: fallbackMessage });
}

const recommendationSystemPrompt = `
당신은 세계 최고의 비즈니스 업무 자동화 아키텍트(Automation Architect)입니다.
사용자의 자동화 고민이나 워크플로우 기획을 듣고, n8n, make, zapier, lindy, relay, gumloop, activepieces, pipedream, crewai, autogen 중에서
가장 적합한 1가지를 추천하여 구체적인 워크플로우 다이어그램 모델과 비용 절감 조언을 제공해야 합니다.
반드시 다음 도구 목록 중 하나를 recommendedToolId 값으로 지정해야 합니다:
['n8n', 'make', 'zapier', 'lindy', 'relay-app', 'gumloop', 'activepieces', 'pipedream', 'crewai', 'autogen']
`;

const proposalSystemPrompt = `
당신은 국내 B2B 업무 자동화 구축 에이전시의 수석 자동화 아키텍트입니다.
사용자의 회사 정보, 자동화 니즈, 예산을 기반으로 현실적인 '업무 자동화 커스텀 기획 제안서 및 구축 견적 소견서'를 작성하십시오.
과장된 보장 표현을 피하고, 예상 비용과 ROI는 가정 기반 추정치임을 암시하는 신중한 B2B 톤으로 답하십시오.
반드시 JSON 규격 스키마를 준수하여 응답해야 합니다.
`;

const chatSystemPrompt = `
당신은 업무 자동화 전문 에이전트 '오토가이드 AI(AutoGuide AI)'입니다.
사용자가 n8n, Make, Zapier, Lindy, Relay.app, Gumloop, Activepieces, Pipedream, CrewAI, AutoGen 등 자동화 툴들에 대해 질문하면 답변해주세요.
답변 원칙:
1. 한국어로 전문적이면서도 비개발자도 이해할 수 있도록 답변하십시오.
2. 가격 팩트, 난이도 비교, 실제 시나리오 매칭 등 근거를 들어 설명하십시오.
3. 확실하지 않은 가격·제휴·정책은 최신 공식 페이지 확인이 필요하다고 명시하십시오.
4. 가능한 한 간결하고 가독성 높은 마크다운 형식으로 정리하십시오.
`;

const recommendationSchema = {
  type: Type.OBJECT,
  required: [
    "scenarioName",
    "recommendedToolId",
    "whyThisTool",
    "difficulty",
    "estimatedTime",
    "steps",
    "aiNodeInvolved",
    "aiImplementationTip",
    "costEstimation",
  ],
  properties: {
    scenarioName: { type: Type.STRING },
    recommendedToolId: { type: Type.STRING },
    whyThisTool: { type: Type.STRING },
    difficulty: { type: Type.STRING },
    estimatedTime: { type: Type.STRING },
    steps: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        required: ["stepNumber", "app", "action", "description"],
        properties: {
          stepNumber: { type: Type.INTEGER },
          app: { type: Type.STRING },
          action: { type: Type.STRING },
          description: { type: Type.STRING },
        },
      },
    },
    aiNodeInvolved: { type: Type.BOOLEAN },
    aiImplementationTip: { type: Type.STRING },
    costEstimation: { type: Type.STRING },
  },
} as const;

const proposalSchema = {
  type: Type.OBJECT,
  required: [
    "proposalTitle",
    "executiveSummary",
    "recommendedStack",
    "architectureFlow",
    "phaseSteps",
    "estimatedDevelopmentCost",
    "annualROIExpected",
    "expertMatchingInfo",
  ],
  properties: {
    proposalTitle: { type: Type.STRING },
    executiveSummary: { type: Type.STRING },
    recommendedStack: { type: Type.STRING },
    architectureFlow: { type: Type.STRING },
    phaseSteps: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        required: ["phaseName", "duration", "deliverables"],
        properties: {
          phaseName: { type: Type.STRING },
          duration: { type: Type.STRING },
          deliverables: { type: Type.STRING },
        },
      },
    },
    estimatedDevelopmentCost: { type: Type.STRING },
    annualROIExpected: { type: Type.STRING },
    expertMatchingInfo: { type: Type.STRING },
  },
} as const;
