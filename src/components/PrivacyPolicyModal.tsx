import { X } from "lucide-react";

type Props = {
  onClose: () => void;
};

export default function PrivacyPolicyModal({ onClose }: Props) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="privacy-policy-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div>
            <h2 id="privacy-policy-title" className="text-base font-black text-slate-900">
              개인정보 처리방침
            </h2>
            <p className="text-[10px] text-slate-400 font-medium mt-0.5">시행일: 2026년 7월 17일</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="개인정보 처리방침 닫기"
            className="h-8 w-8 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="overflow-y-auto px-6 py-5 space-y-5 text-xs text-slate-600 font-medium leading-relaxed">
          <section className="space-y-1.5">
            <h3 className="text-sm font-black text-slate-800">제1조 (목적)</h3>
            <p>
              AutoHub AI(이하 &ldquo;서비스&rdquo;)는 업무 자동화 도구 비교·안내 포털입니다.
              본 방침은 「개인정보 보호법」에 따라 이용자 정보 처리 방식을 안내합니다.
            </p>
          </section>

          <section className="space-y-1.5">
            <h3 className="text-sm font-black text-slate-800">제2조 (수집하는 정보)</h3>
            <p>
              서비스는 <strong>회원가입·상담 폼·이메일 수집을 하지 않습니다.</strong>
              접속 통계를 위해 Google Analytics 4가 쿠키·기기 식별자 수준의 비식별 이용 기록을 수집할 수 있습니다.
            </p>
          </section>

          <section className="space-y-1.5">
            <h3 className="text-sm font-black text-slate-800">제3조 (제휴 링크)</h3>
            <p>
              일부 외부 링크는 제휴(어필리에이트) 링크입니다. 해당 사이트에서 가입·결제 시
              운영자에게 수수료가 발생할 수 있으며, 이용자 추가 비용은 없습니다.
              제휴사 사이트에서의 개인정보 처리는 각 제휴사 방침을 따릅니다.
            </p>
          </section>

          <section className="space-y-1.5">
            <h3 className="text-sm font-black text-slate-800">제4조 (처리 위탁)</h3>
            <div className="bg-slate-50 rounded-xl p-4 space-y-1">
              <p><strong>Vercel, Inc.</strong> — 웹 호스팅</p>
              <p><strong>Google LLC</strong> — GA4 이용 통계</p>
            </div>
          </section>

          <section className="space-y-1.5">
            <h3 className="text-sm font-black text-slate-800">제5조 (문의)</h3>
            <p>
              개인정보 관련 문의:{" "}
              <span className="text-indigo-700 font-semibold">mins.agents@gmail.com</span>
            </p>
          </section>
        </div>

        <div className="px-6 py-4 border-t border-slate-100 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 bg-slate-900 hover:bg-slate-700 text-white text-xs font-extrabold rounded-xl transition-all cursor-pointer"
          >
            확인
          </button>
        </div>
      </div>
    </div>
  );
}
