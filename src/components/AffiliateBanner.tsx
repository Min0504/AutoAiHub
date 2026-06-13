import { ExternalLink, Zap, Mail } from "lucide-react";
import { AFFILIATE_LINKS } from "../config/affiliateLinks";

const BANNERS = [
  {
    key: "make",
    name: "Make",
    tagline: "드래그 앤 드롭으로 업무 자동화",
    highlight: "무료로 시작",
    colorFrom: "from-violet-50",
    colorTo: "to-purple-50",
    textColor: "text-violet-700",
    badgeColor: "bg-violet-100 text-violet-700",
  },
  {
    key: "dify",
    name: "Dify",
    tagline: "AI 에이전트 & LLM 앱 빌더",
    highlight: "무료 플랜",
    colorFrom: "from-blue-50",
    colorTo: "to-indigo-50",
    textColor: "text-blue-700",
    badgeColor: "bg-blue-100 text-blue-700",
  },
];

const AD_CONTACT_EMAIL = "chaeminseok00@gmail.com";

export default function AffiliateBanner() {
  return (
    <div className="space-y-3">
      {/* 제휴 배너 카드 */}
      {BANNERS.map((banner) => {
        const href = AFFILIATE_LINKS[banner.key];
        if (!href) return null;
        return (
          <a
            key={banner.key}
            href={href}
            target="_blank"
            rel="noopener noreferrer sponsored"
            className={`block bg-gradient-to-br ${banner.colorFrom} ${banner.colorTo} border border-slate-200 rounded-2xl p-4 space-y-2 hover:shadow-md transition-all group`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Zap className={`w-3.5 h-3.5 ${banner.textColor}`} />
                <span className={`text-xs font-black ${banner.textColor}`}>
                  {banner.name}
                </span>
              </div>
              <span className={`text-[10px] font-black px-1.5 py-0.5 rounded-md ${banner.badgeColor}`}>
                {banner.highlight}
              </span>
            </div>
            <p className="text-[11px] text-slate-600 font-semibold leading-snug">
              {banner.tagline}
            </p>
            <div className={`flex items-center gap-1 text-[11px] font-black ${banner.textColor} group-hover:gap-2 transition-all`}>
              지금 시작하기
              <ExternalLink className="w-3 h-3" />
            </div>
          </a>
        );
      })}

      {/* 광고 슬롯 배너 */}
      <a
        href={`mailto:${AD_CONTACT_EMAIL}?subject=AutoHub AI 배너 광고 문의`}
        className="block bg-white border-2 border-dashed border-slate-200 rounded-2xl p-4 space-y-2 hover:border-indigo-300 hover:bg-indigo-50/30 transition-all group"
      >
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-black text-slate-300 uppercase tracking-wider">
            AD SLOT
          </span>
          <span className="text-[10px] font-bold text-slate-300 bg-slate-100 px-1.5 py-0.5 rounded-md">
            광고 문의
          </span>
        </div>
        <p className="text-[11px] text-slate-300 font-semibold leading-snug group-hover:text-indigo-400 transition-colors">
          이 자리에 귀사의 자동화 솔루션을 노출하세요
        </p>
        <div className="flex items-center gap-1 text-[11px] font-black text-slate-300 group-hover:text-indigo-500 group-hover:gap-2 transition-all">
          <Mail className="w-3 h-3" />
          {AD_CONTACT_EMAIL}
        </div>
      </a>

      <p className="text-[9px] text-slate-300 font-medium text-center">
        제휴 링크 포함 · 추가 비용 없음
      </p>
    </div>
  );
}
