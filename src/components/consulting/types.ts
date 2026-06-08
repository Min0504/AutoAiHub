export type ProposalPhaseStep = {
  readonly phaseName: string;
  readonly duration: string;
  readonly deliverables: string;
};

export type Proposal = {
  readonly proposalTitle: string;
  readonly executiveSummary: string;
  readonly recommendedStack: string;
  readonly architectureFlow: string;
  readonly phaseSteps: readonly ProposalPhaseStep[];
  readonly estimatedDevelopmentCost: string;
  readonly annualROIExpected: string;
  readonly expertMatchingInfo: string;
  readonly leadId?: string;
};

export type ConsultingLeadContext = {
  readonly companyName: string;
  readonly email: string;
  readonly phone: string;
  readonly needs: string;
  readonly budget: string;
  readonly selectedTool: string;
  readonly businessType: string;
  readonly proposalLeadId: string;
};

export function isProposal(value: unknown): value is Proposal {
  if (!isRecord(value)) {
    return false;
  }

  return (
    typeof value["proposalTitle"] === "string" &&
    typeof value["executiveSummary"] === "string" &&
    typeof value["recommendedStack"] === "string" &&
    typeof value["architectureFlow"] === "string" &&
    Array.isArray(value["phaseSteps"]) &&
    value["phaseSteps"].every(isProposalPhaseStep) &&
    typeof value["estimatedDevelopmentCost"] === "string" &&
    typeof value["annualROIExpected"] === "string" &&
    typeof value["expertMatchingInfo"] === "string" &&
    (typeof value["leadId"] === "string" || value["leadId"] === undefined)
  );
}

function isProposalPhaseStep(value: unknown): value is ProposalPhaseStep {
  if (!isRecord(value)) {
    return false;
  }

  return (
    typeof value["phaseName"] === "string" &&
    typeof value["duration"] === "string" &&
    typeof value["deliverables"] === "string"
  );
}

function isRecord(value: unknown): value is Readonly<Record<string, unknown>> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
