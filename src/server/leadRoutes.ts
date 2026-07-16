import type { Express, Request, Response } from "express";
import { saveLead } from "./leadStore";
import { notifyNewLead } from "./notifySlack";
import {
  BadRequestError,
  FIELD_LIMITS,
  readOptionalString,
  readPrivacyAccepted,
  readRecord,
  readRequiredEmail,
  readRequiredString,
} from "./requestParsing";

export function registerLeadRoutes(app: Express): void {
  app.post("/api/leads/roi-report", async (req: Request, res: Response) => {
    try {
      const body = readRecord(req.body);
      const email = readRequiredEmail(body, "email");
      const lead = await saveLead("roi_report", {
        email,
        inputs: isPlainObject(body["inputs"]) ? body["inputs"] : {},
        results: isPlainObject(body["results"]) ? body["results"] : {},
      });

      void notifyNewLead({ kind: "roi_report", leadId: lead.id, email });

      res.json({ ok: true, leadId: lead.id });
    } catch (error: unknown) {
      handleLeadRouteError(error, res);
    }
  });

  app.post("/api/leads/consulting-meeting", async (req: Request, res: Response) => {
    try {
      const body = readRecord(req.body);
      const companyName = readRequiredString(body, "companyName", FIELD_LIMITS.short);
      const email = readRequiredEmail(body, "email");
      const needs = readRequiredString(body, "needs", FIELD_LIMITS.long);
      const phone = readOptionalString(body, "phone", FIELD_LIMITS.short);
      const budget = readOptionalString(body, "budget", FIELD_LIMITS.short);
      readPrivacyAccepted(body);

      const lead = await saveLead("consulting_meeting", {
        companyName,
        email,
        phone,
        needs,
        budget,
        selectedTool: readOptionalString(body, "selectedTool", FIELD_LIMITS.short),
        businessType: readOptionalString(body, "businessType", FIELD_LIMITS.short),
        proposalLeadId: readOptionalString(body, "proposalLeadId", FIELD_LIMITS.short),
        privacyAccepted: true,
        privacyAcceptedAt: new Date().toISOString(),
      });

      void notifyNewLead({
        kind: "consulting_meeting",
        leadId: lead.id,
        email,
        companyName,
        phone,
        budget,
        needs,
      });

      res.json({ ok: true, leadId: lead.id });
    } catch (error: unknown) {
      handleLeadRouteError(error, res);
    }
  });
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function handleLeadRouteError(error: unknown, res: Response): void {
  if (error instanceof BadRequestError) {
    res.status(400).json({ error: error.message, fieldName: error.fieldName });
    return;
  }

  console.error("Lead route error:", error);
  res.status(500).json({ error: "리드 저장 중 오류가 발생했습니다." });
}
