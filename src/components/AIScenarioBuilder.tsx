import { useState } from "react";
import { Sparkles, ArrowRight, Zap, Play, ShieldEllipsis, AlertCircle, Cpu } from "lucide-react";
import { TOOLS } from "../data/tools";
import { trackAffiliateClick, trackScenarioGenerate } from "../lib/analytics";

interface Step {
  stepNumber: number;
  app: string;
  action: string;
  description: string;
}

interface RecommendedScenario {
  scenarioName: string;
  recommendedToolId: string;
  whyThisTool: string;
  difficulty: string;
  estimatedTime: string;
  steps: Step[];
  aiNodeInvolved: boolean;
  aiImplementationTip: string;
  costEstimation: string;
}

export default function AIScenarioBuilder() {
  const [prompt, setPrompt] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [scenario, setScenario] = useState<RecommendedScenario | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Quick prompt presets to help users test immediately
  const presets = [
    "Gmail로 구글 첨부파일 메일이 오면 자동으로 PDF를 요약해서 슬랙 뉴스룸 채널에 브리핑해주고 보고서로 저장해줘.",
    "네이버 쇼핑몰 특정 키워드 신규 화장품을 매일 1회 크롤링해서 GPT로 경쟁 강도를 요약분석한 뒤 노션 데이터베이스 인덱스로 자동 추가해줘.",
    "회사 SNS 댓글과 인스타그램 DM 멘션을 실시간 수거해서 긍부정을 평가하고, 불만 섞인 불만 글이 있다면 긴급 AI 초안 메일을 써서 담당자 모바일에 푸시 알림해줘."
  ];

  const handleApplyPreset = (text: string) => {
    setPrompt(text);
  };

  const handleBuild = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setError(null);
    setScenario(null);
    trackScenarioGenerate();

    try {
      const response = await fetch("/api/recommend", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userPrompt: prompt }),
      });

      if (!response.ok) {
        throw new Error("서버 응답 오류가 발생했습니다. 잠시 후 재시도해 주세요.");
      }

      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }

      setScenario(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "추천 분석 중 예상치 못한 문제가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  // Find tool object details based on ID
  const matchedToolObj = scenario ? TOOLS.find(t => t.id === scenario.recommendedToolId || t.slug === scenario.recommendedToolId) : null;

  return (
    <section id="ai-scenario-builder" className="space-y-8">
      
      {/* Intro Banner */}
      <div className="rounded-3xl border border-indigo-150 bg-gradient-to-tr from-slate-900 via-slate-850 to-slate-950 p-8 text-white relative overflow-hidden shadow-lg">
        <div className="absolute top-0 right-0 h-40 w-40 rounded-full bg-indigo-500/10 blur-3xl" />
        <div className="relative z-10 max-w-3xl">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-500/20 px-3 py-1 text-xs font-black text-indigo-300 border border-indigo-500/30">
            <Sparkles className="w-3.5 h-3.5 animate-pulse text-indigo-300" /> GEMINI AUTOMATION CO-PILOT
          </span>
          <h2 className="text-2xl font-black mt-4 tracking-tight sm:text-3xl">
            💡 AI 업무 자동화 맞춤 시나리오 설계사
          </h2>
          <p className="mt-2 text-sm text-slate-300 font-medium leading-relaxed">
            구현하려는 아이디어, 연동할 채널, 수치 등 당신의 업무 시나리오 고민을 평이한 자연어로 적어보세요. 인공지능이 최적의 툴 선정과 3~6단계 비주얼 다이어그램 흐름도를 실시간 기획안으로 설계합니다.
          </p>
        </div>
      </div>

      {/* Center Prompt Input Card */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
        <div className="space-y-1.5">
          <label htmlFor="input-ai-prompt" className="text-xs font-black text-slate-400 uppercase tracking-widest">어떤 자동화 시스템을 구상하고 계시나요?</label>
          <textarea
            id="input-ai-prompt"
            rows={3}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="예시) 매일 주식 뉴스를 수집해 워드마크 파일로 요약 후 드롭박스 폴더에 넣고, 중요 수치가 감지되면 라인 알림메세지 발송"
            className="w-full rounded-2xl border border-slate-250 bg-white p-4 text-sm font-semibold text-slate-800 placeholder-slate-400 focus:border-indigo-500 focus:outline-none"
          />
        </div>

        {/* Preset selections */}
        <div className="space-y-2">
          <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider block">⚡ 빠른 추천 템플릿 테스트 예시:</span>
          <div className="flex flex-col gap-2">
            {presets.map((preset, i) => (
              <button
                key={i}
                onClick={() => handleApplyPreset(preset)}
                className="text-left text-xs font-semibold text-indigo-650 hover:text-indigo-800 hover:bg-indigo-50/50 p-2.5 rounded-xl border border-indigo-100/40 bg-indigo-50/20 transition-all cursor-pointer truncate"
              >
                &ldquo;{preset}&rdquo;
              </button>
            ))}
          </div>
        </div>

        {/* Submit Build */}
        <div className="pt-4 border-t border-slate-100 flex justify-end">
          <button
            id="btn-build-scenario"
            disabled={loading || !prompt.trim()}
            onClick={handleBuild}
            className="flex items-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 disabled:cursor-not-allowed transition-all py-3.5 px-6 font-bold text-sm text-white cursor-pointer shadow-sm shadow-indigo-150"
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                인공지능이 업무 분석 및 맞춤 설계 중...
              </>
            ) : (
              <>
                <Zap className="w-4 h-4 fill-white" />
                업무 자동화 워크플로우 즉각 생성
              </>
            )}
          </button>
        </div>
      </div>

      {/* Error state */}
      {error && (
        <div className="bg-rose-50 text-rose-800 p-4 rounded-2xl border border-rose-100/50 flex items-start gap-2 max-w-2xl mx-auto text-xs font-semibold">
          <AlertCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p>설계 생성 실패:</p>
            <p className="text-slate-600">{error}</p>
          </div>
        </div>
      )}

      {/* RESULT SCENARIO BOARD */}
      {scenario && (
        <div id="ai-scenario-result" className="bg-slate-50 border border-slate-200 rounded-3xl p-6 md:p-8 space-y-8 shadow-sm">
          
          {/* Banner Details */}
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center border-b border-slate-200 pb-5">
            <div>
              <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest block">GENERATE ACTIVE WORKFLOW PLATFORM</span>
              <h3 className="text-2xl font-black text-slate-850">{scenario.scenarioName}</h3>
            </div>

            {/* Quick Metrics */}
            <div className="flex flex-wrap gap-2 text-xs">
              <span className="bg-white border border-slate-200 text-slate-700 px-3 py-1.5 rounded-xl font-bold">
                난이도: <span className="text-indigo-600">{scenario.difficulty}</span>
              </span>
              <span className="bg-white border border-slate-200 text-slate-700 px-3 py-1.5 rounded-xl font-bold">
                제작 시간: <span className="text-indigo-600">{scenario.estimatedTime}</span>
              </span>
              {scenario.aiNodeInvolved && (
                <span className="bg-indigo-50 border border-indigo-200 text-indigo-600 px-3 py-1.5 rounded-xl font-extrabold flex items-center gap-1.5">
                  <Play className="w-3.5 h-3.5 fill-indigo-500 text-indigo-500 shrink-0" /> AI 스마트 노드 주입됨
                </span>
              )}
            </div>
          </div>

          {/* Core Recommendation Callout */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            <div className="md:col-span-4 bg-white border border-slate-200 rounded-2xl p-5 shadow-sm text-center">
              <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider block">최적 추천 도구 솔루션</span>
              <div className="mt-3 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-slate-900 to-indigo-950 font-black text-2xl tracking-tight text-white mb-2">
                {matchedToolObj ? matchedToolObj.name.slice(0,2) : "AT"}
              </div>
              <h4 className="text-lg font-black text-slate-800">{matchedToolObj ? matchedToolObj.name : scenario.recommendedToolId}</h4>
              <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mt-0.5">{matchedToolObj?.category}</p>

              {matchedToolObj && (
                <a
                  href={matchedToolObj.affiliateUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackAffiliateClick(matchedToolObj.id, matchedToolObj.name)}
                  className="mt-4 block w-full rounded-xl bg-slate-900 hover:bg-slate-800 text-white py-2 text-xs font-bold transition-all cursor-pointer"
                >
                  공식 사이트에서 요금 확인
                </a>
              )}
            </div>

            <div className="md:col-span-8 bg-indigo-50/50 border border-indigo-100 rounded-2xl p-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 h-20 w-20 rounded-full bg-indigo-500/5 blur-2xl" />
              <h4 className="text-sm font-black text-indigo-950 uppercase tracking-wide">💡 왜 이 특정 도구를 선택해야 하나요?</h4>
              <p className="mt-2 text-sm leading-relaxed text-slate-600 font-medium">
                {scenario.whyThisTool}
              </p>
            </div>
          </div>

          {/* VISUAL WORKFLOW DIAGRAM SCHEMATIC */}
          <div className="space-y-4">
            <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest text-center">
              📊 오토메이션 파이프라인 모형 다이어그램 (Workflow Schema)
            </h4>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 lg:grid-cols-4 items-stretch relative">
              {scenario.steps.map((step, idx) => {
                const isLast = idx === scenario.steps.length - 1;
                return (
                  <div key={idx} className="flex flex-col justify-between bg-white border border-slate-200 rounded-2xl p-5 shadow-sm transition-all duration-300 hover:border-indigo-300 relative group">
                    <div>
                      <div className="flex justify-between items-center mb-3">
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-900 text-[10px] font-black text-white">
                          {step.stepNumber}
                        </span>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider bg-slate-100 px-2 py-0.5 rounded-md">
                          {step.app}
                        </span>
                      </div>
                      <h5 className="text-sm font-extrabold text-slate-900 leading-snug">{step.action}</h5>
                      <p className="text-xs text-slate-500 font-semibold font-medium leading-relaxed mt-2">
                        {step.description}
                      </p>
                    </div>

                    {!isLast && (
                      <div className="hidden sm:flex absolute top-1/2 -right-4 transform -translate-y-1/2 z-10 h-8 w-8 items-center justify-center rounded-full bg-indigo-50 border border-indigo-200 text-indigo-600 opacity-60 group-hover:opacity-100 transition-opacity">
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Technical Tips & Cost Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-200">
            {/* Implementation Tip */}
            <div className="space-y-1.5 text-xs font-medium text-slate-600">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">⚠️ 구현 시 발생하기 자주 발생하는 고난도 오류 안전 가이드</span>
              <p className="bg-white border border-slate-200 p-4 rounded-xl leading-relaxed">
                {scenario.aiImplementationTip}
              </p>
            </div>

            {/* Cost Optimization */}
            <div className="space-y-1.5 text-xs font-medium text-slate-600">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">💰 월정 예산 지출 및 추가 오퍼레이션 과금 가이드</span>
              <p className="bg-white border border-slate-200 p-4 rounded-xl leading-relaxed">
                {scenario.costEstimation}
              </p>
            </div>
          </div>

        </div>
      )}

    </section>
  );
}
