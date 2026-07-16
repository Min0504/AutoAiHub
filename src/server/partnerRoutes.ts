import type { Express, Request, Response } from "express";
import { getPartnerProgram, PARTNER_PROGRAMS } from "../config/partnerPrograms";

export function registerPartnerRoutes(app: Express): void {
  app.get("/api/partner-programs", (_req: Request, res: Response) => {
    res.json({
      programs: PARTNER_PROGRAMS.map(({ applicationDraft, ...program }) => program),
    });
  });

  app.get("/api/partner-programs/:id/application-draft", (req: Request, res: Response) => {
    const program = getPartnerProgram(req.params.id);

    if (program === undefined) {
      res.status(404).json({ error: "지원하지 않는 제휴 프로그램입니다." });
      return;
    }

    res.json({
      id: program.id,
      name: program.name,
      status: program.status,
      applyUrl: program.applyUrl,
      applicationDraft: program.applicationDraft,
      notes: program.notes,
    });
  });
}
