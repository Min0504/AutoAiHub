import type { Express, Request, Response } from "express";
import { saveLead } from "./leadStore";
import { notifyNewLead } from "./notifySlack";
import {
  BadRequestError,
  readOptionalString,
  readRecord,
  readRequiredString,
} from "./requestParsing";

export function registerLeadRoutes(app: Express): void {
  app.post("/api/leads/roi-report", async (req: Request, res: Response) => {
    try {
      const body = readRecord(req.body);
      const email = readRequiredString(body, "email");
      const lead = await saveLead("roi_report", {
        email,
        inputs: body["inputs"] ?? {},
        results: body["results"] ?? {},
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
      const companyName = readRequiredString(body, "companyName");
      const email = readRequiredString(body, "email");
      const needs = readRequiredString(body, "needs");
      const phone = readOptionalString(body, "phone");
      const budget = readOptionalString(body, "budget");
      const lead = await saveLead("consulting_meeting", {
        companyName,
        email,
        phone,
        needs,
        budget,
        selectedTool: readOptionalString(body, "selectedTool"),
        businessType: readOptionalString(body, "businessType"),
        proposalLeadId: readOptionalString(body, "proposalLeadId"),
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

function handleLeadRouteError(error: unknown, res: Response): void {
  if (error instanceof BadRequestError) {
    res.status(400).json({ error: error.message, fieldName: error.fieldName });
    return;
  }

  console.error("Lead route error:", error);
  res.status(500).json({ error: "리드 저장 중 오류가 발생했습니다." });
}
