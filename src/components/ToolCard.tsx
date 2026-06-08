import { Tool } from "../data/tools";
import { Star, BadgeCheck } from "lucide-react";
import { trackCompareAdd, trackToolDetailView } from "../lib/analytics";

interface ToolCardProps {
  key?: string;
  tool: Tool;
  onOpenDetails: (tool: Tool) => void;
  onAddToCompare: (tool: Tool) => void;
  isAddedToCompare: boolean;
}

export default function ToolCard({
  tool,
  onOpenDetails,
  onAddToCompare,
  isAddedToCompare,
}: ToolCardProps) {
  const difficultyColors = {
    쉬움: "bg-emerald-50 text-emerald-700 border-emerald-100",
    보통: "bg-amber-50 text-amber-700 border-amber-100",
    어려움: "bg-rose-50 text-rose-700 border-rose-100",
  };

  return (
    <div
      id={`tool-card-${tool.id}`}
      className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 transition-all duration-300 hover:border-indigo-400 hover:shadow-xl hover:shadow-indigo-50/40"
    >
      <div className="absolute top-0 right-0 h-16 w-16 bg-gradient-to-bl from-indigo-50/30 to-transparent rounded-tr-2xl group-hover:from-indigo-100/50" />

      <div>
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div
              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${tool.logoColor} font-black text-lg tracking-tight shadow-md ${tool.logoTextColor} select-none`}
              aria-hidden="true"
            >
              {tool.name.slice(0, 2)}
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors leading-snug">
                {tool.name}
              </h3>
              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">{tool.category}</p>
            </div>
          </div>
          {tool.badge && (
            <span className="inline-flex items-center rounded-full bg-indigo-50 px-2 py-0.5 text-[10px] font-bold text-indigo-700 border border-indigo-100 shrink-0 leading-tight text-center max-w-[90px]">
              {tool.badge}
            </span>
          )}
        </div>

        {/* Slogan */}
        <p className="mt-3 text-xs font-medium text-slate-600 leading-relaxed min-h-[36px] line-clamp-2">
          {tool.slogan}
        </p>

        {/* Rating and Difficulty */}
        <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
          <div className="flex items-center gap-1 font-bold text-slate-800">
            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
            <span>{tool.rating.toFixed(1)}</span>
          </div>
          <span className="text-slate-300">·</span>
          <span className={`rounded-md border px-1.5 py-0.5 font-bold text-[10px] ${difficultyColors[tool.difficulty]}`}>
            {tool.difficulty}
          </span>
          <span className="text-slate-300">·</span>
          <span className="font-semibold text-slate-500 text-[10px]">{tool.priceInfo}</span>
        </div>

        {/* Key Features */}
        <div className="mt-4 space-y-1.5">
          <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">주요 강점</h4>
          <ul className="space-y-1">
            {tool.features.slice(0, 3).map((feat, idx) => (
              <li key={idx} className="flex items-start gap-1.5 text-[11px] text-slate-600 font-medium leading-tight">
                <BadgeCheck className="h-3.5 w-3.5 text-emerald-500 shrink-0 mt-0.5" />
                <span>{feat}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-5 pt-4 border-t border-slate-100 flex items-center gap-2">
        <button
          id={`btn-details-${tool.id}`}
          onClick={() => {
            trackToolDetailView(tool.id, tool.name);
            onOpenDetails(tool);
          }}
          className="flex-1 rounded-xl bg-slate-50 border border-slate-200/80 px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100/90 hover:text-slate-900 transition-all cursor-pointer text-center"
          aria-label={`${tool.name} 상세 가이드 보기`}
        >
          상세 보기
        </button>

        <button
          id={`btn-compare-toggle-${tool.id}`}
          onClick={() => {
            trackCompareAdd(tool.id, tool.name);
            onAddToCompare(tool);
          }}
          className={`px-3 py-2 rounded-xl border text-xs font-bold transition-all cursor-pointer shrink-0 ${
            isAddedToCompare
              ? "bg-indigo-600 border-indigo-600 text-white"
              : "bg-white border-slate-200 text-slate-500 hover:border-indigo-300 hover:text-indigo-600"
          }`}
          title={isAddedToCompare ? "비교 목록에서 제외" : "비교 대상 추가"}
          aria-pressed={isAddedToCompare}
        >
          {isAddedToCompare ? "✓ 비교 중" : "비교 +"}
        </button>
      </div>
    </div>
  );
}
