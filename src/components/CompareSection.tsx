import { useState, type ChangeEvent } from "react";
import type { Tool } from "../data/tools";
import { TOOLS } from "../data/tools";
import { ShieldAlert, Check, Trophy } from "lucide-react";
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, Legend } from "recharts";

interface CompareSectionProps {
  selectedTools: Tool[];
  onRemoveFromCompare: (tool: Tool) => void;
}

export default function CompareSection({ selectedTools }: CompareSectionProps) {
  // Let the user select 2 tools from the dropdowns if there are not enough pre-selected ones
  const initialToolIds = getInitialToolIds(selectedTools);
  const [toolId1, setToolId1] = useState<string>(initialToolIds.first);
  const [toolId2, setToolId2] = useState<string>(initialToolIds.second);

  // Sync state if coming from external selections
  const finalTool1 = TOOLS.find(t => t.id === toolId1) || TOOLS[0];
  const finalTool2 = TOOLS.find(t => t.id === toolId2) || TOOLS[1];

  const handleTool1Change = (e: ChangeEvent<HTMLSelectElement>) => {
    setToolId1(e.target.value);
  };

  const handleTool2Change = (e: ChangeEvent<HTMLSelectElement>) => {
    setToolId2(e.target.value);
  };

  // Switch selection helper
  const handleSwap = () => {
    const temp = toolId1;
    setToolId1(toolId2);
    setToolId2(temp);
  };

  // Build radar chart data
  const radarData = [
    { subject: "평점", A: finalTool1.rating * 20, B: finalTool2.rating * 20, fullMark: 100 },
    { subject: "사용 편의성", A: (6 - finalTool1.difficultyLevel) * 20, B: (6 - finalTool2.difficultyLevel) * 20, fullMark: 100 },
    { subject: "AI 연동", A: finalTool1.aiIntegration.length > 100 ? 90 : 65, B: finalTool2.aiIntegration.length > 100 ? 90 : 65, fullMark: 100 },
    { subject: "무료 플랜", A: finalTool1.pricingDetails.free !== "없음" ? 80 : 30, B: finalTool2.pricingDetails.free !== "없음" ? 80 : 30, fullMark: 100 },
    { subject: "기능 수", A: Math.min(100, finalTool1.features.length * 14), B: Math.min(100, finalTool2.features.length * 14), fullMark: 100 },
    { subject: "장점 수", A: Math.min(100, finalTool1.pros.length * 16), B: Math.min(100, finalTool2.pros.length * 16), fullMark: 100 },
  ];

  // Determine winner
  const tool1Score = radarData.reduce((s, d) => s + d.A, 0);
  const tool2Score = radarData.reduce((s, d) => s + d.B, 0);
  const winner = tool1Score > tool2Score ? finalTool1 : tool2Score > tool1Score ? finalTool2 : null;

  return (
    <section id="compare-section" className="space-y-8">
      
      {/* Intro banner */}
      <div className="rounded-3xl border border-indigo-100 bg-gradient-to-br from-indigo-50/50 via-white to-blue-50/30 p-8 text-center max-w-4xl mx-auto">
        <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
          🔄 프리미엄 1:1 라이벌 비교 분석기
        </h2>
        <p className="mx-auto mt-2 max-w-xl text-sm font-medium text-slate-500 leading-relaxed">
          두 도구를 테이블과 점수로 실시간 대조하여, 비용 분석 / 학습 난이도 및 비즈니스 적합도를 시각적으로 간결하게 분별하세요.
        </p>

        {/* Dropdowns to select tools */}
        <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
          
          <div className="flex flex-col gap-1 w-full max-w-[220px]">
            <label className="text-[10px] font-bold text-slate-400 uppercase text-left tracking-wider">비교 도구 A</label>
            <select
              id="select-tool-1"
              value={toolId1}
              onChange={handleTool1Change}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-bold text-slate-800 shadow-sm focus:border-indigo-500 cursor-pointer"
            >
              {TOOLS.map((t) => (
                <option key={t.id} value={t.id} disabled={t.id === toolId2}>
                  {t.name} ({t.category.split(" ")[0]})
                </option>
              ))}
            </select>
          </div>

          <button
            id="btn-swap-tools"
            onClick={handleSwap}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 border border-slate-200 hover:bg-slate-200 cursor-pointer transition-colors mt-4 sm:mt-5"
            title="포지션 맞바꾸기"
          >
            ⇔
          </button>

          <div className="flex flex-col gap-1 w-full max-w-[220px]">
            <label className="text-[10px] font-bold text-slate-400 uppercase text-left tracking-wider">비교 도구 B</label>
            <select
              id="select-tool-2"
              value={toolId2}
              onChange={handleTool2Change}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-bold text-slate-800 shadow-sm focus:border-indigo-500 cursor-pointer"
            >
              {TOOLS.map((t) => (
                <option key={t.id} value={t.id} disabled={t.id === toolId1}>
                  {t.name} ({t.category.split(" ")[0]})
                </option>
              ))}
            </select>
          </div>

        </div>
      </div>

      {/* Radar Chart + Winner */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
        <h3 className="text-sm font-black text-slate-500 uppercase tracking-widest text-center mb-1">
          📊 종합 역량 레이더 비교
        </h3>

        {winner && (
          <div className="flex items-center justify-center gap-2 mb-4">
            <Trophy className="w-4 h-4 text-amber-500" />
            <span className="text-sm font-black text-slate-800">
              <span className="text-indigo-600">{winner.name}</span>이(가) 종합 점수에서 우세합니다
            </span>
          </div>
        )}
        {!winner && (
          <p className="text-xs text-slate-500 font-semibold text-center mb-4">두 도구가 비슷한 종합 점수를 보입니다</p>
        )}

        <div className="h-[260px]">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={radarData}>
              <PolarGrid stroke="#e2e8f0" />
              <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11, fontWeight: 700, fill: "#64748b" }} />
              <Radar name={finalTool1.name} dataKey="A" stroke="#6366f1" fill="#6366f1" fillOpacity={0.15} strokeWidth={2} />
              <Radar name={finalTool2.name} dataKey="B" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.15} strokeWidth={2} />
              <Legend wrapperStyle={{ fontSize: "12px", fontWeight: 700 }} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Main Dual Grid View */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Tool Cards Column A */}
        <div id="compare-column-a" className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-3 h-full bg-indigo-500" />
          <div className="flex items-center gap-3 pl-2">
            <div className={`h-11 w-11 flex items-center justify-center rounded-xl font-bold ${finalTool1.logoColor} ${finalTool1.logoTextColor}`}>
              {finalTool1.name.slice(0, 2)}
            </div>
            <div>
              <span className="text-xs font-bold text-indigo-600 block">TOOL A REFERENCE</span>
              <h3 className="text-xl font-black text-slate-900">{finalTool1.name}</h3>
            </div>
          </div>
          <p className="text-sm font-semibold text-slate-600 italic bg-slate-50 p-4 rounded-xl border border-slate-100">
            &ldquo;{finalTool1.slogan}&rdquo;
          </p>

          <div className="space-y-4 pt-2">
            <div className="flex justify-between items-center text-sm border-b border-slate-100 pb-2">
              <span className="font-bold text-slate-400">카테고리</span>
              <span className="font-bold text-slate-800">{finalTool1.category}</span>
            </div>
            <div className="flex justify-between items-center text-sm border-b border-slate-100 pb-2">
              <span className="font-bold text-slate-400">학습 난이도</span>
              <span className="font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md text-xs">{finalTool1.difficulty}</span>
            </div>
            <div className="flex justify-between items-center text-sm border-b border-slate-100 pb-2">
              <span className="font-bold text-slate-400">종합 만족도 평점</span>
              <span className="font-bold text-amber-500 flex items-center gap-1">★ {finalTool1.rating.toFixed(1)}</span>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">👍 핵심 장점</h4>
            <div className="space-y-1.5">
              {finalTool1.pros.map((p, i) => (
                <div key={i} className="flex items-start gap-1.5 text-xs text-slate-600 leading-normal">
                  <Check className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>{p}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">⚠️ 주의 단점</h4>
            <div className="space-y-1.5">
              {finalTool1.cons.map((c, i) => (
                <div key={i} className="flex items-start gap-1.5 text-xs text-slate-600 leading-normal">
                  <ShieldAlert className="h-4 w-4 text-rose-500 shrink-0 mt-0.5" />
                  <span>{c}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tool Cards Column B */}
        <div id="compare-column-b" className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-3 h-full bg-blue-500" />
          <div className="flex items-center gap-3 pl-2">
            <div className={`h-11 w-11 flex items-center justify-center rounded-xl font-bold ${finalTool2.logoColor} ${finalTool2.logoTextColor}`}>
              {finalTool2.name.slice(0, 2)}
            </div>
            <div>
              <span className="text-xs font-bold text-blue-600 block">TOOL B REFERENCE</span>
              <h3 className="text-xl font-black text-slate-900">{finalTool2.name}</h3>
            </div>
          </div>
          <p className="text-sm font-semibold text-slate-600 italic bg-slate-50 p-4 rounded-xl border border-slate-100">
            &ldquo;{finalTool2.slogan}&rdquo;
          </p>

          <div className="space-y-4 pt-2">
            <div className="flex justify-between items-center text-sm border-b border-slate-100 pb-2">
              <span className="font-bold text-slate-400">카테고리</span>
              <span className="font-bold text-slate-800">{finalTool2.category}</span>
            </div>
            <div className="flex justify-between items-center text-sm border-b border-slate-100 pb-2">
              <span className="font-bold text-slate-400">학습 난이도</span>
              <span className="font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md text-xs">{finalTool2.difficulty}</span>
            </div>
            <div className="flex justify-between items-center text-sm border-b border-slate-100 pb-2">
              <span className="font-bold text-slate-400">종합 만족도 평점</span>
              <span className="font-bold text-amber-500 flex items-center gap-1">★ {finalTool2.rating.toFixed(1)}</span>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">👍 핵심 장점</h4>
            <div className="space-y-1.5">
              {finalTool2.pros.map((p, i) => (
                <div key={i} className="flex items-start gap-1.5 text-xs text-slate-600 leading-normal">
                  <Check className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>{p}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">⚠️ 주의 단점</h4>
            <div className="space-y-1.5">
              {finalTool2.cons.map((c, i) => (
                <div key={i} className="flex items-start gap-1.5 text-xs text-slate-600 leading-normal">
                  <ShieldAlert className="h-4 w-4 text-rose-500 shrink-0 mt-0.5" />
                  <span>{c}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* Comparison Specifications Matrix Sheet */}
      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/70">
          <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
            📋 1:1 워크플로우 명세표 대조 (Spec Matrix)
          </h3>
          <p className="text-xs font-medium text-slate-500 mt-0.5">요금 및 작동 모델의 실세 데이터를 한자리에서 비교합니다.</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-100/50">
                <th className="px-6 py-3.5 font-bold text-slate-600 text-xs uppercase">비교 속성 항목</th>
                <th className="px-6 py-3.5 font-bold text-indigo-750 text-xs">{finalTool1.name}</th>
                <th className="px-6 py-3.5 font-bold text-blue-750 text-xs">{finalTool2.name}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              
              <tr>
                <td className="px-6 py-4 font-bold text-slate-700 bg-slate-50/40">기본 요금 라벨</td>
                <td className="px-6 py-4 font-semibold text-slate-600">{finalTool1.priceInfo}</td>
                <td className="px-6 py-4 font-semibold text-slate-600">{finalTool2.priceInfo}</td>
              </tr>

              <tr>
                <td className="px-6 py-4 font-bold text-slate-700 bg-slate-50/40">무료 플랜 혜택</td>
                <td className="px-6 py-4 font-medium text-slate-550 leading-relaxed text-xs">{finalTool1.pricingDetails.free}</td>
                <td className="px-6 py-4 font-medium text-slate-550 leading-relaxed text-xs">{finalTool2.pricingDetails.free}</td>
              </tr>

              <tr>
                <td className="px-6 py-4 font-bold text-slate-700 bg-slate-50/40">스타터 플랜 구성</td>
                <td className="px-6 py-4 font-medium text-slate-550 leading-relaxed text-xs">{finalTool1.pricingDetails.starter}</td>
                <td className="px-6 py-4 font-medium text-slate-550 leading-relaxed text-xs">{finalTool2.pricingDetails.starter}</td>
              </tr>

              <tr>
                <td className="px-6 py-4 font-bold text-slate-700 bg-slate-50/40">과금 메커니즘 모델</td>
                <td className="px-6 py-4 font-medium text-slate-550 leading-relaxed text-xs">{finalTool1.pricingDetails.pricingModel}</td>
                <td className="px-6 py-4 font-medium text-slate-550 leading-relaxed text-xs">{finalTool2.pricingDetails.pricingModel}</td>
              </tr>

              <tr>
                <td className="px-6 py-4 font-bold text-slate-700 bg-slate-50/40">인공지능(AI) 구현 전술</td>
                <td className="px-6 py-4 font-medium text-slate-550 leading-relaxed text-xs">{finalTool1.aiIntegration}</td>
                <td className="px-6 py-4 font-medium text-slate-550 leading-relaxed text-xs">{finalTool2.aiIntegration}</td>
              </tr>

              <tr>
                <td className="px-6 py-4 font-bold text-slate-700 bg-slate-50/40">대상 추천 수혜자</td>
                <td className="px-6 py-4 font-medium text-slate-550 leading-relaxed text-xs">{finalTool1.bestFor}</td>
                <td className="px-6 py-4 font-medium text-slate-550 leading-relaxed text-xs">{finalTool2.bestFor}</td>
              </tr>

            </tbody>
          </table>
        </div>
      </div>

    </section>
  );
}

function getInitialToolIds(selectedTools: readonly Tool[]): { readonly first: string; readonly second: string } {
  const first = selectedTools[0]?.id ?? "n8n";
  const secondFromSelection = selectedTools.find((tool) => tool.id !== first)?.id;
  const second = secondFromSelection ?? (first === "make" ? "n8n" : "make");

  return { first, second };
}
