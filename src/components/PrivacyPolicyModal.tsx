import { X } from "lucide-react";

type Props = {
  onClose: () => void;
};

export default function PrivacyPolicyModal({ onClose }: Props) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div>
            <h2 className="text-base font-black text-slate-900">개인정보 처리방침</h2>
            <p className="text-[10px] text-slate-400 font-medium mt-0.5">시행일: 2026년 6월 8일</p>
          </div>
          <button
            onClick={onClose}
            className="h-8 w-8 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto px-6 py-5 space-y-5 text-xs text-slate-600 font-medium leading-relaxed">

          <section className="space-y-1.5">
            <h3 className="text-sm font-black text-slate-800">제1조 (목적)</h3>
            <p>
              AutoHub AI(이하 "서비스")는 B2B 업무 자동화 도구 비교·상담 서비스를 제공합니다.
              본 방침은 「개인정보 보호법」 및 관련 법령에 따라 이용자의 개인정보를 보호하고,
              그 처리에 관한 사항을 안내하기 위해 작성되었습니다.
            </p>
          </section>

          <section className="space-y-1.5">
            <h3 className="text-sm font-black text-slate-800">제2조 (수집하는 개인정보 항목)</h3>
            <div className="bg-slate-50 rounded-xl p-4 space-y-2">
              <div>
                <p className="font-extrabold text-slate-700">B2B 견적 기획서 요청 시</p>
                <p>필수: 회사명, 담당자 이메일 주소</p>
                <p>선택: 담당자 연락처(전화번호)</p>
              </div>
              <div>
                <p className="font-extrabold text-slate-700">ROI 리포트 신청 시</p>
                <p>필수: 이메일 주소</p>
              </div>
              <div>
                <p className="font-extrabold text-slate-700">자동 수집 정보</p>
                <p>서비스 이용 기록, 접속 로그 (서버 로그 수준, 개인 식별 불가)</p>
              </div>
            </div>
          </section>

          <section className="space-y-1.5">
            <h3 className="text-sm font-black text-slate-800">제3조 (개인정보의 수집·이용 목적)</h3>
            <ul className="list-disc list-inside space-y-1 pl-1">
              <li>AI 기반 맞춤 견적 기획서(RFP) 생성 및 제공</li>
              <li>B2B 자동화 구축 상담 요청 접수 및 처리</li>
              <li>ROI 시뮬레이션 결과 보관 및 추후 연락</li>
              <li>서비스 운영·개선을 위한 통계 분석 (개인 식별 불가 형태)</li>
            </ul>
          </section>

          <section className="space-y-1.5">
            <h3 className="text-sm font-black text-slate-800">제4조 (보유·이용 기간)</h3>
            <p>
              수집일로부터 <strong>3년</strong>, 또는 이용자가 삭제 요청을 할 때까지 보유합니다.
              관련 법령(전자상거래 소비자보호법 등)에 따라 별도 보존이 필요한 경우 해당 기간 동안 분리 보관합니다.
            </p>
          </section>

          <section className="space-y-1.5">
            <h3 className="text-sm font-black text-slate-800">제5조 (제3자 제공)</h3>
            <p>
              수집된 개인정보는 원칙적으로 제3자에게 제공하지 않습니다.
              단, 법령에 의하거나 수사기관의 요청이 있는 경우 예외로 합니다.
            </p>
          </section>

          <section className="space-y-1.5">
            <h3 className="text-sm font-black text-slate-800">제6조 (처리 위탁)</h3>
            <div className="bg-slate-50 rounded-xl p-4 space-y-1">
              <p><strong>Supabase Inc.</strong> — 리드 데이터 저장·관리 (미국 소재, Standard Contractual Clauses 적용)</p>
              <p><strong>Google LLC (Gemini API)</strong> — AI 기획서 생성 처리 (입력 데이터는 처리 후 저장되지 않음)</p>
            </div>
          </section>

          <section className="space-y-1.5">
            <h3 className="text-sm font-black text-slate-800">제7조 (정보주체의 권리)</h3>
            <p>
              이용자는 언제든지 아래 권리를 행사할 수 있습니다.
              요청은 하단 개인정보 보호책임자 이메일로 연락 주시면 <strong>지체 없이 (최대 10 영업일 이내)</strong> 처리합니다.
            </p>
            <ul className="list-disc list-inside space-y-1 pl-1">
              <li>개인정보 열람 요구</li>
              <li>오류 정정 요구</li>
              <li>삭제 요구 (수집 철회)</li>
              <li>처리 정지 요구</li>
            </ul>
          </section>

          <section className="space-y-1.5">
            <h3 className="text-sm font-black text-slate-800">제8조 (개인정보 파기)</h3>
            <p>
              보유 기간이 경과하거나 목적이 달성된 경우 지체 없이 파기합니다.
              전자적 파일 형태는 복구 불가능한 방법으로 영구 삭제하며,
              출력물은 분쇄 또는 소각합니다.
            </p>
          </section>

          <section className="space-y-1.5">
            <h3 className="text-sm font-black text-slate-800">제9조 (개인정보 보호책임자)</h3>
            <div className="bg-indigo-50 rounded-xl p-4 text-xs font-semibold">
              <p className="font-extrabold text-indigo-900 mb-1">개인정보 보호책임자</p>
              <p>소속: AutoHub AI 운영팀</p>
              <p>이메일: <span className="text-indigo-700">privacy@autohub.ai (예시 — 실제 이메일로 교체 필요)</span></p>
              <p className="mt-2 text-slate-500 text-[11px]">
                개인정보 침해 관련 신고·상담은 개인정보보호위원회 (privacy.go.kr / 국번없이 182),
                한국인터넷진흥원 (118)에 문의하실 수 있습니다.
              </p>
            </div>
          </section>

          <section className="space-y-1.5">
            <h3 className="text-sm font-black text-slate-800">제10조 (방침 변경)</h3>
            <p>
              본 개인정보 처리방침이 변경되는 경우 서비스 내 공지사항을 통해 사전 고지합니다.
              변경 시행일 이후 서비스를 계속 이용하면 변경된 방침에 동의한 것으로 간주합니다.
            </p>
          </section>

        </div>

        <div className="px-6 py-4 border-t border-slate-100 flex justify-end">
          <button
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
