import { useState } from "react";
import { submitRoiReportLead, type RoiReportLeadPayload } from "../../lib/leadsApi";
import { trackLeadSubmit } from "../../lib/analytics";

type RoiLeadCaptureProps = {
  readonly inputs: RoiReportLeadPayload["inputs"];
  readonly results: RoiReportLeadPayload["results"];
};

export function RoiLeadCapture({ inputs, results }: RoiLeadCaptureProps) {
  const [email, setEmail] = useState<string>("");
  const [status, setStatus] = useState<"idle" | "submitting" | "submitted">("idle");
  const [message, setMessage] = useState<string>("");

  const handleSubmit = async () => {
    if (!email.includes("@")) {
      setMessage("사용 가능한 이메일 주소를 형식에 맞게 적어주세요.");
      return;
    }

    setStatus("submitting");
    setMessage("");

    try {
      const response = await submitRoiReportLead({
        email,
        inputs,
        results,
      });
      setStatus("submitted");
      trackLeadSubmit("roi_report");
      setMessage(`ROI 리포트 리드가 저장되었습니다. 접수번호: ${response.leadId}`);
    } catch (error: unknown) {
      setStatus("idle");
      if (error instanceof Error) {
        setMessage(error.message);
        return;
      }

      setMessage("리포트 신청 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="bg-gradient-to-br from-indigo-950 to-slate-900 p-5 rounded-2xl text-white space-y-3 shadow-md border border-slate-800">
      <div className="flex items-center justify-between">
        <span className="bg-indigo-500/30 text-indigo-300 font-extrabold text-[9px] px-2 py-0.5 rounded border border-indigo-500/40 uppercase tracking-widest">
          PRO REPORT LEAD
        </span>
        <p className="text-[10px] text-amber-300 font-bold">★ 사내 결재 검토용 요약</p>
      </div>
      <h4 className="text-xs font-black text-white">ROI 시뮬레이션 리드 저장</h4>
      <p className="text-[10.5px] text-slate-300 leading-relaxed font-medium">
        입력값과 계산 결과를 상담 리드로 저장합니다. PDF 자동 발송은 아직 제공되지 않습니다.
      </p>
      <div className="flex items-center gap-1.5 pt-1">
        <input
          type="email"
          placeholder="담당자 이메일 주소"
          className="bg-white/10 text-xs text-white border border-white/20 rounded-xl px-3 py-2.5 flex-1 placeholder-slate-400 focus:outline-none focus:border-indigo-400 font-semibold"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          disabled={status === "submitting" || status === "submitted"}
        />
        <button
          onClick={handleSubmit}
          disabled={status === "submitting" || status === "submitted"}
          className="bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-500 disabled:cursor-not-allowed text-white font-extrabold text-xs px-3 py-2.5 rounded-xl transition-all cursor-pointer shrink-0"
        >
          {status === "submitted" ? "저장 완료" : "리드 저장"}
        </button>
      </div>
      {message && (
        <p className={`text-[10.5px] font-bold ${status === "submitted" ? "text-emerald-300" : "text-rose-300"}`}>
          {message}
        </p>
      )}
    </div>
  );
}
