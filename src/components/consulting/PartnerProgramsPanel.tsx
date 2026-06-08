import { ExternalLink } from "lucide-react";

const partnerPrograms = [
  {
    name: "Make Affiliate",
    summary: "공식 문서 기준 유료 구독 추천 매출에 대해 12개월 35% 커미션 구조를 제공합니다.",
    url: "https://help.make.com/affiliate-program",
    cta: "Make 제휴 조건 보기",
  },
  {
    name: "n8n Affiliate",
    summary: "n8n Cloud 추천에 대해 첫 12개월 30% 커미션을 안내합니다. 유료 광고 집행은 제한됩니다.",
    url: "https://n8n.io/affiliates/",
    cta: "n8n 제휴 조건 보기",
  },
  {
    name: "Zapier Partner",
    summary: "Zapier는 일반 쿠폰보다 파트너/솔루션 생태계 중심 접근이 현실적입니다.",
    url: "https://zapier.com/l/partners/",
    cta: "Zapier 파트너 보기",
  },
  {
    name: "컨설팅 리드",
    summary: "툴 가입 수수료보다 구축 상담·템플릿·운영 대행 매출이 초기 수익성이 높습니다.",
    url: "https://n8n.io/workflows/",
    cta: "템플릿 사례 보기",
  },
] as const;

export function PartnerProgramsPanel() {
  return (
    <div className="border-t border-slate-150 pt-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-sm font-black text-slate-900 flex items-center gap-1.5">
            🎁 검증 가능한 제휴·수익화 루트
          </h4>
          <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mt-0.5">
            VERIFIED AFFILIATE & LEAD SYSTEM
          </p>
        </div>
        <span className="bg-emerald-50 text-emerald-700 font-black text-[10px] px-2.5 py-1 rounded-md border border-emerald-100 uppercase tracking-widest shrink-0">
          출처 확인형
        </span>
      </div>

      <p className="text-xs text-slate-500 leading-relaxed font-semibold">
        아래 항목은 임의 쿠폰이 아니라 공식 제휴 페이지 또는 실제 수익화 루트입니다. 제휴 코드는 승인 후 발급받은 실제 링크로 교체해야 합니다.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {partnerPrograms.map((program) => (
          <div key={program.name} className="bg-slate-50 border border-slate-150 rounded-2xl p-4 space-y-3 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-black text-indigo-700">{program.name}</span>
                <span className="bg-white border border-slate-200 text-slate-500 text-[9px] px-1.5 py-0.5 rounded font-black uppercase">
                  VERIFIED
                </span>
              </div>
              <p className="text-xs font-bold text-slate-700 leading-snug mt-1.5">{program.summary}</p>
            </div>

            <a
              href={program.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-1.5 bg-indigo-650 hover:bg-slate-900 text-white text-[10px] font-extrabold px-2.5 py-2 rounded-lg transition-all"
            >
              {program.cta} <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        ))}
      </div>

      <div className="bg-indigo-50/55 p-4 rounded-xl border border-indigo-100/50 text-xs text-slate-550 leading-relaxed font-semibold">
        <p className="text-slate-800 font-black mb-1">💡 수익 구조 판단</p>
        초기에는 광고보다 상담 리드 1건의 기대값이 큽니다. 검증된 제휴 링크는 보조 수익으로 두고, 견적·구축·유지보수 매출을 1순위로 잡는 편이 비용 대비 수익이 높습니다.
      </div>
    </div>
  );
}
