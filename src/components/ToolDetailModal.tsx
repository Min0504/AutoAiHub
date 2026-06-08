import { Tool } from "../data/tools";
import { X, CheckCircle2, AlertCircle, Sparkles, HandMetal, Heart, ArrowUpRight, ShieldEllipsis } from "lucide-react";
import { trackAffiliateClick } from "../lib/analytics";

interface ToolDetailModalProps {
  tool: Tool | null;
  onClose: () => void;
  onAddToCompare: (tool: Tool) => void;
  isAddedToCompare: boolean;
}

export default function ToolDetailModal({
  tool,
  onClose,
  onAddToCompare,
  isAddedToCompare,
}: ToolDetailModalProps) {
  if (!tool) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      {/* Background Overlay */}
      <div className="flex min-h-screen items-center justify-center p-4 text-center sm:p-0">
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" onClick={onClose} />

        {/* Modal Window */}
        <div className="relative transform overflow-hidden rounded-3xl bg-white text-left shadow-2xl transition-all sm:my-8 sm:w-full sm:max-w-3xl border border-slate-100 flex flex-col max-h-[90vh]">
          
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
            <div className="flex items-center gap-3">
              <div className={`flex h-11 w-11 items-center justify-center rounded-xl font-bold text-lg ${tool.logoColor} ${tool.logoTextColor} shadow-sm`}>
                {tool.name.slice(0, 2)}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-extrabold text-slate-900" id="modal-title">{tool.name} 상세 정보</h3>
                  {tool.badge && (
                    <span className="inline-flex items-center rounded-full bg-indigo-50 px-2 py-0.5 text-[10px] font-extrabold text-indigo-700 border border-indigo-100 uppercase tracking-wider">
                      {tool.badge}
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mt-0.5">{tool.category}</p>
              </div>
            </div>
            <button
              id="btn-close-modal"
              type="button"
              className="rounded-full p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors cursor-pointer"
              onClick={onClose}
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Body Content */}
          <div className="overflow-y-auto px-6 py-6 space-y-6 flex-1 bg-slate-50/50">
            
            {/* Slogan banner */}
            <div className="bg-gradient-to-r from-indigo-50/50 via-slate-50 to-indigo-50/10 p-5 rounded-2xl border border-slate-150 relative overflow-hidden">
              <p className="text-base font-bold text-slate-800 leading-relaxed text-indigo-950 relative z-10">
                &ldquo;{tool.slogan}&rdquo;
              </p>
              <div className="absolute -bottom-8 -right-8 h-24 w-24 rounded-full bg-indigo-50/30 blur-2xl" />
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="bg-white p-4 rounded-xl border border-slate-200/70 shadow-sm flex flex-col justify-center">
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">사용 난이도</span>
                <span className="mt-1.5 text-lg font-bold text-indigo-600">{tool.difficulty}</span>
                <div className="mt-2 flex gap-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <span
                      key={s}
                      className={`h-1.5 flex-1 rounded-full ${
                        s <= tool.difficultyLevel
                          ? "bg-indigo-500"
                          : "bg-slate-100"
                      }`}
                    />
                  ))}
                </div>
              </div>
              <div className="bg-white p-4 rounded-xl border border-slate-200/70 shadow-sm flex flex-col justify-center">
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">평가 만족도</span>
                <span className="mt-1.5 text-lg font-bold text-amber-500 flex items-center gap-1">
                  ★ {tool.rating.toFixed(1)} <span className="text-xs font-semibold text-slate-400">/ 5.0</span>
                </span>
                <p className="text-[10px] font-medium text-slate-400 mt-2">사용자 피드백 종합 평점</p>
              </div>
              <div className="bg-white p-4 rounded-xl border border-slate-200/70 shadow-sm flex flex-col justify-center">
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">서드파티 대체 서비스</span>
                <span className="mt-1.5 text-xs font-bold text-slate-600 flex flex-wrap gap-1">
                  {tool.alternatives.map((alt) => (
                    <span key={alt} className="px-2 py-0.5 rounded-md bg-slate-100 uppercase tracking-normal border border-slate-200/30">
                      {alt}
                    </span>
                  ))}
                </span>
                <p className="text-[10px] font-medium text-slate-400 mt-2">유망 대체 대안</p>
              </div>
            </div>

            {/* Detailed Pricing Structure */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-3">
              <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                💳 요금제 세부 분석 (Pricing Model)
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="space-y-2">
                  <div className="flex justify-between p-2 rounded-lg bg-emerald-50/50 border border-emerald-100/30">
                    <span className="font-bold text-emerald-800">무료 라이선스</span>
                    <span className="text-slate-600 leading-snug text-right max-w-[150px] font-medium">{tool.pricingDetails.free}</span>
                  </div>
                  <div className="flex justify-between p-2 rounded-lg bg-indigo-50/50 border border-indigo-150">
                    <span className="font-bold text-indigo-800">스타터 Plan</span>
                    <span className="text-slate-600 leading-snug text-right max-w-[150px] font-medium">{tool.pricingDetails.starter}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between p-2 rounded-lg bg-orange-50/30 border border-orange-100/30">
                    <span className="font-bold text-orange-850">비즈니스 Pro</span>
                    <span className="text-slate-600 leading-snug text-right max-w-[150px] font-medium">{tool.pricingDetails.pro}</span>
                  </div>
                  <div className="flex flex-col p-2 rounded-lg bg-slate-50 border border-slate-250">
                    <span className="font-extrabold text-slate-700">과금 메커니즘 기준</span>
                    <span className="text-slate-500 font-medium mt-1 leading-tight">{tool.pricingDetails.pricingModel}</span>
                  </div>
                </div>
              </div>
              <p className="text-[10px] font-semibold text-slate-400 leading-relaxed">
                요금제와 한도는 수시로 바뀔 수 있으므로 실제 결제 전 공식 사이트의 최신 가격표를 반드시 확인하세요.
              </p>
            </div>

            {/* Recommended Target Audience */}
            <div className="bg-indigo-600 text-white p-5 rounded-2xl border border-indigo-700 shadow-sm flex items-start gap-3">
              <div className="p-2 rounded-xl bg-white/10 shrink-0">
                <Heart className="h-5 w-5 text-indigo-100 fill-indigo-100/20" />
              </div>
              <div>
                <h4 className="text-xs font-extrabold text-indigo-200 uppercase tracking-widest">강력 추천 대상 (Best For)</h4>
                <p className="mt-1 text-sm font-semibold leading-relaxed text-indigo-50">
                  {tool.bestFor}
                </p>
              </div>
            </div>

            {/* Advanced AI Capabilities */}
            <div className="bg-slate-900 text-slate-100 p-5 rounded-2xl shadow-md border border-slate-800 space-y-2">
              <h4 className="text-xs font-extrabold text-indigo-400 tracking-wider flex items-center gap-1.5">
                <Sparkles className="h-4 w-4 text-indigo-400 animate-spin" /> AI 연동 방식 & 최적화 기술
              </h4>
              <p className="text-xs font-medium text-slate-300 leading-relaxed">
                {tool.aiIntegration}
              </p>
            </div>

            {/* Pros vs Cons Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Pros */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
                <h4 className="text-xs font-extrabold text-emerald-600 uppercase tracking-widest flex items-center gap-1.5 border-b border-slate-100 pb-2">
                  <CheckCircle2 className="h-4.5 w-4.5 text-emerald-500 shrink-0" /> 핵심 장점 (PROS)
                </h4>
                <ul className="space-y-2">
                  {tool.pros.map((p, i) => (
                    <li key={i} className="text-xs font-medium text-slate-600 leading-normal flex items-start gap-1.5">
                      <span className="h-1.5 w-1.5 bg-emerald-500 rounded-full shrink-0 mt-1.5" />
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Cons */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
                <h4 className="text-xs font-extrabold text-rose-650 uppercase tracking-widest flex items-center gap-1.5 border-b border-slate-100 pb-2">
                  <AlertCircle className="h-4.5 w-4.5 text-rose-500 shrink-0" /> 운영 시 한계/단점 (CONS)
                </h4>
                <ul className="space-y-2">
                  {tool.cons.map((c, i) => (
                    <li key={i} className="text-xs font-medium text-slate-600 leading-normal flex items-start gap-1.5">
                      <span className="h-1.5 w-1.5 bg-rose-500 rounded-full shrink-0 mt-1.5" />
                      <span>{c}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

          </div>

          {/* Footer - Action Drawer */}
          <div className="border-t border-slate-100 px-6 py-4 bg-slate-50 flex items-center justify-between gap-4">
            <button
              id={`detail-modal-compare-${tool.id}`}
              onClick={() => onAddToCompare(tool)}
              className={`rounded-xl px-4 py-2.5 text-xs font-black cursor-pointer shadow-sm transition-all ${
                isAddedToCompare
                  ? "bg-indigo-50 border border-indigo-200 text-indigo-700"
                  : "bg-white border border-slate-200 text-slate-700 hover:border-slate-300"
              }`}
            >
              {isAddedToCompare ? "비교 목록 포함됨 ✓" : "비교 대상 추가 +"}
            </button>

            <a
              href={tool.affiliateUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackAffiliateClick(tool.id, tool.name)}
              className="flex items-center gap-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 transition-colors px-6 py-2.5 text-xs font-extrabold text-white cursor-pointer shadow-sm shadow-indigo-100"
            >
              공식 사이트 방문 <ArrowUpRight className="h-3.5 w-3.5" />
            </a>
          </div>

        </div>
      </div>
    </div>
  );
}
