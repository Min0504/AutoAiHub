import { Download, Mail } from "lucide-react";
import { useState } from "react";
import { submitConsultingMeetingLead } from "../../lib/leadsApi";
import type { ConsultingLeadContext } from "./types";

type ProposalActionsProps = {
  readonly leadContext: ConsultingLeadContext;
};

export function ProposalActions({ leadContext }: ProposalActionsProps) {
  const [status, setStatus] = useState<"idle" | "submitting" | "submitted">("idle");
  const [message, setMessage] = useState<string>("");

  const handleMeetingRequest = async () => {
    setStatus("submitting");
    setMessage("");

    try {
      const response = await submitConsultingMeetingLead(leadContext);
      setStatus("submitted");
      setMessage(`상담 신청이 저장되었습니다. 접수번호: ${response.leadId}`);
    } catch (error: unknown) {
      setStatus("idle");
      if (error instanceof Error) {
        setMessage(error.message);
        return;
      }

      setMessage("상담 신청 저장 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="space-y-2 pt-2 border-t border-slate-100 no-print">
      <div className="flex flex-col sm:flex-row items-center gap-2">
        <button
          onClick={handleMeetingRequest}
          disabled={status === "submitting" || status === "submitted"}
          className={`w-full flex items-center justify-center gap-1.5 rounded-xl py-2.5 text-xs font-black transition-all cursor-pointer ${
            status === "submitted"
              ? "bg-slate-100 border border-slate-200 text-slate-400 cursor-not-allowed"
              : "bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm"
          }`}
        >
          <Mail className="w-4 h-4" />
          {status === "submitted" ? "상담 신청 저장 완료" : "상담 신청 리드 저장"}
        </button>
        <button
          onClick={() => window.print()}
          className="w-full flex items-center justify-center gap-1.5 rounded-xl bg-slate-50 border border-slate-200 hover:bg-slate-100 text-slate-700 py-2.5 text-xs font-bold transition-colors cursor-pointer"
        >
          <Download className="w-4 h-4 text-slate-500" />
          PDF 견적기획안 인쇄/출력
        </button>
      </div>
      {message && (
        <p className={`text-[11px] font-bold ${status === "submitted" ? "text-emerald-600" : "text-rose-600"}`}>
          {message}
        </p>
      )}
    </div>
  );
}
