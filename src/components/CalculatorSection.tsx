import { useState, useMemo } from "react";
import { TOOLS } from "../data/tools";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, AreaChart, Area } from "recharts";
import { Calculator, DollarSign, Clock, Zap } from "lucide-react";
import { RoiLeadCapture } from "./calculator/RoiLeadCapture";

export default function CalculatorSection() {
  const [activeCalc, setActiveCalc] = useState<"savings" | "roi" | "ai">("savings");

  // State 1: Savings/Alternatives Calculator
  const [executions, setExecutions] = useState<number>(10000); // Monthly tasks/ops

  // State 2: ROI Calculator
  const [manualHours, setManualHours] = useState<number>(3); // daily hours done manually
  const [laborCost, setLaborCost] = useState<number>(25000); // hourly rate in KRW
  const [workingDays, setWorkingDays] = useState<number>(20); // monthly working days
  const [toolSubscription, setToolSubscription] = useState<number>(40000); // monthly tool fee

  // State 3: AI Agent Cost Calculator
  const [dailyCalls, setDailyCalls] = useState<number>(1000); // calls per day
  const [promptTokens, setPromptTokens] = useState<number>(1500); // input tokens
  const [completionTokens, setCompletionTokens] = useState<number>(500); // output tokens
  const [llmTier, setLlmTier] = useState<"flash" | "pro">("flash"); // AI model tier (Flash: incredibly cheap, Pro: standard reasoning)

  // 1. Calculations: Alternatives Savings
  const savingsData = useMemo(() => {
    // Estimations based on state
    // We compute cost for: Zapier, Make, n8n (Cloud), Activepieces
    const getZapierCost = (ex: number) => {
      if (ex <= 100) return 0;
      if (ex <= 750) return 20; // Starter
      if (ex <= 2000) return 49; // Pro
      if (ex <= 10000) return 149;
      if (ex <= 50000) return 399;
      return 399 + (ex - 50000) * 0.006;
    };

    const getMakeCost = (ex: number) => {
      if (ex <= 1000) return 0;
      if (ex <= 10000) return 9;
      if (ex <= 40000) return 29;
      if (ex <= 100000) return 59;
      return 59 + (ex - 100000) * 0.0005;
    };

    const getN8nCloudCost = (ex: number) => {
      const execs = Math.max(100, ex / 5);
      if (execs <= 2500) return 20;
      if (execs <= 10000) return 50;
      if (execs <= 40000) return 667;
      return 667 + (execs - 40000) * 0.01;
    };

    const zapier = Math.round(getZapierCost(executions));
    const make = Math.round(getMakeCost(executions));
    const n8nCloud = Math.round(getN8nCloudCost(executions));
    const selfHost = 5; // Self-host n8n is practically $5/mo for VPS

    return [
      { name: "Zapier", "월 비용 ($)": zapier, amt: zapier, color: "#f97316" },
      { name: "Make", "월 비용 ($)": make, amt: make, color: "#a855f7" },
      { name: "n8n (Cloud)", "월 비용 ($)": n8nCloud, amt: n8nCloud, color: "#ef4444" },
      { name: "Self-Host (n8n/오픈소스)", "월 비용 ($)": selfHost, amt: selfHost, color: "#10b981" },
    ];
  }, [executions]);

  // 2. Calculations: ROI Calculator
  const roiResults = useMemo(() => {
    const monthlyManualCost = manualHours * laborCost * workingDays;
    const monthlyAutomatedCost = toolSubscription;
    const monthlySavings = monthlyManualCost - monthlyAutomatedCost;
    const annualSavings = monthlySavings * 12;
    const annualHoursSaved = manualHours * workingDays * 12;
    const roiPercentage = monthlyManualCost > 0
      ? Math.round((monthlySavings / monthlyManualCost) * 100)
      : 0;

    // Cumulative savings chart data for 12 months
    const chartData = Array.from({ length: 12 }, (_, i) => {
      const month = i + 1;
      return {
        name: `${month}월`,
        "누적 절감액 (원)": Math.max(0, monthlySavings * month),
      };
    });

    return {
      monthlyManualCost,
      monthlySavings,
      annualSavings,
      annualHoursSaved,
      roiPercentage,
      chartData,
    };
  }, [manualHours, laborCost, workingDays, toolSubscription]);

  // 3. Calculations: AI Agent Cost Calculator
  const aiResults = useMemo(() => {
    // Current typical token pricing in USD per 1M tokens (Approximate average)
    // Flash rate (Gemini 1.5/3.5 Flash approx): input $0.075 / 1M, output $0.30 / 1M
    // Pro rate (Gemini/GPT Pro approx): input $2.50 / 1M, output $10.00 / 1M
    const promptCostPerMil = llmTier === "flash" ? 0.075 : 2.50;
    const completionCostPerMil = llmTier === "flash" ? 0.30 : 10.00;

    const dailyPromptCost = (dailyCalls * promptTokens * promptCostPerMil) / 1000000;
    const dailyCompletionCost = (dailyCalls * completionTokens * completionCostPerMil) / 1000000;
    const dailyLlmCostUsd = dailyPromptCost + dailyCompletionCost;
    const monthlyLlmCostUsd = dailyLlmCostUsd * 30;
    const monthlyLlmCostKrw = monthlyLlmCostUsd * 1380; // Exchange rate USD/KRW approx

    return {
      dailyPromptCost,
      dailyCompletionCost,
      dailyLlmCostUsd,
      monthlyLlmCostUsd,
      monthlyLlmCostKrw,
    };
  }, [dailyCalls, promptTokens, completionTokens, llmTier]);

  return (
    <section id="calculator-section" className="space-y-8">
      
      {/* Sub tabs selector */}
      <div className="flex flex-wrap items-center justify-center gap-2 max-w-lg mx-auto p-1 bg-slate-100 border border-slate-200/60 rounded-2xl">
        <button
          id="btn-calc-savings"
          onClick={() => setActiveCalc("savings")}
          className={`flex items-center gap-1.5 px-4 py-2 text-xs font-black rounded-xl transition-all cursor-pointer ${
            activeCalc === "savings"
              ? "bg-white text-indigo-600 shadow-sm"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <DollarSign className="w-4 h-4" />
          플랫폼 요금 비교기
        </button>
        <button
          id="btn-calc-roi"
          onClick={() => setActiveCalc("roi")}
          className={`flex items-center gap-1.5 px-4 py-2 text-xs font-black rounded-xl transition-all cursor-pointer ${
            activeCalc === "roi"
              ? "bg-white text-indigo-600 shadow-sm"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <Clock className="w-4 h-4" />
          비즈니스 ROI 분석기
        </button>
        <button
          id="btn-calc-ai"
          onClick={() => setActiveCalc("ai")}
          className={`flex items-center gap-1.5 px-4 py-2 text-xs font-black rounded-xl transition-all cursor-pointer ${
            activeCalc === "ai"
              ? "bg-white text-indigo-600 shadow-sm"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <Zap className="w-4 h-4" />
          AI 토큰 요금 분석기
        </button>
      </div>

      {/* Calculator Body Panels */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 md:p-8 shadow-sm">
        
        {/* TAB 1: SAVINGS CALCULATOR */}
        {activeCalc === "savings" && (
          <div id="panel-savings-calculator" className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Input Controls */}
            <div className="lg:col-span-4 space-y-6">
              <div>
                <h3 className="text-xl font-extrabold text-slate-900">💡 Zapier 대체 절감 계산기</h3>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mt-1">SaaS 요금 합리화 도구</p>
                <p className="mt-3 text-xs leading-relaxed font-medium text-slate-500">
                  매달 가동 중 혹은 향후 설계 예정인 자동화 전체 <strong>스텝 이동 누적 합계(태스크/오퍼레이션)</strong>를 조절해보세요. 경쟁 툴들의 비용 편차가 여과 없이 드러납니다.
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label htmlFor="input-executions" className="text-xs font-extrabold text-slate-700">월간 총 자동화 태스크 (스텝 수)</label>
                  <span className="text-sm font-black text-indigo-600 text-right bg-indigo-50 px-2 py-0.5 rounded-md">
                    {executions.toLocaleString()} 회
                  </span>
                </div>
                <input
                  id="input-executions"
                  type="range"
                  min="500"
                  max="100000"
                  step="500"
                  value={executions}
                  onChange={(e) => setExecutions(Number(e.target.value))}
                  className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
                <div className="flex justify-between text-[10px] font-bold text-slate-400">
                  <span>500회 (소규모)</span>
                  <span>100,000회 (대용량)</span>
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-xs text-slate-500 space-y-2 font-medium">
                <p className="text-slate-800 font-bold flex items-center gap-1">📌 요약 통찰:</p>
                <p>
                  Zapier는 뛰어난 사용성을 갖추었지만, 대량의 트래픽 처리 환경에서는 <strong>비용 상승 속도가 가혹할 정도로 빠릅니다.</strong>
                </p>
                <p>
                  루프 처리나 데이터 배치 수량이 많은 시나리오라면 무료 온프레미스 자립형 <strong>Self-Host n8n</strong>이나 스마트 결제 정책의 <strong>Make</strong>를 도입하면 <strong>매년 최소 100만 원 이상의 구독비가 자동 절감</strong>됩니다.
                </p>
              </div>
            </div>

            {/* Visual Chart Panel */}
            <div className="lg:col-span-8 flex flex-col justify-center">
              <div className="h-[280px] w-full text-xs">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={savingsData} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} fontWeight={600} />
                    <YAxis stroke="#94a3b8" fontSize={11} fontWeight={600} unit="$" />
                    <Tooltip cursor={{ fill: '#f8fafc' }} formatter={(v) => [`$${v} (≈ ${(Number(v) * 1380).toLocaleString()}원)`, "예상 월 비용"]} />
                    <Bar dataKey="월 비용 ($)" fill="#6366f1" radius={[10, 10, 0, 0]} maxBarSize={55} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Grid cards for insights */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                {savingsData.map((data, idx) => (
                  <div key={idx} className="bg-slate-50 p-3 rounded-xl border border-slate-100/80 text-center">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{data.name}</span>
                    <p className="mt-1 text-base font-extrabold text-slate-850">${data["월 비용 ($)"]}</p>
                    <p className="text-[9px] font-medium text-slate-400 mt-1">
                      ≈ {(data["월 비용 ($)"] * 1380).toLocaleString()}원/월
                    </p>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* TAB 2: ROI ESTIMATOR */}
        {activeCalc === "roi" && (
          <div id="panel-roi-estimator" className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Input Controls */}
            <div className="lg:col-span-5 space-y-5">
              <div>
                <h3 className="text-xl font-extrabold text-slate-900">⏱️ 자동화 도입 비즈니스 ROI 분석기</h3>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mt-1">업무 효율성 & 손익분기점 테스트</p>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="space-y-1.5">
                  <label className="font-extrabold text-slate-700">일일 수동 작업 (시간)</label>
                  <input
                    type="number"
                    value={manualHours}
                    onChange={(e) => setManualHours(Math.max(1, Number(e.target.value)))}
                    className="w-full rounded-xl border border-slate-250 bg-white px-3 py-2 text-sm font-bold text-slate-800"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="font-extrabold text-slate-700">시간당 임금 (원)</label>
                  <input
                    type="number"
                    value={laborCost}
                    onChange={(e) => setLaborCost(Math.max(1000, Number(e.target.value)))}
                    className="w-full rounded-xl border border-slate-250 bg-white px-3 py-2 text-sm font-bold text-slate-800"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="font-extrabold text-slate-700">월 근무 일수 (일)</label>
                  <input
                    type="number"
                    value={workingDays}
                    onChange={(e) => setWorkingDays(Math.max(1, Number(e.target.value)))}
                    className="w-full rounded-xl border border-slate-250 bg-white px-3 py-2 text-sm font-bold text-slate-800"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="font-extrabold text-slate-700">툴 월 요금제 비용 (원)</label>
                  <input
                    type="number"
                    value={toolSubscription}
                    onChange={(e) => setToolSubscription(Math.max(0, Number(e.target.value)))}
                    className="w-full rounded-xl border border-slate-250 bg-white px-3 py-2 text-sm font-bold text-slate-800"
                  />
                </div>
              </div>

              {/* Main Numbers Output */}
              <div className="bg-indigo-50/60 p-5 rounded-2xl border border-indigo-100 flex items-start gap-3">
                <Calculator className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" />
                <div className="text-xs">
                  <p className="font-extrabold text-indigo-950">투자 대비 수익률 요약</p>
                  <p className="mt-1 leading-relaxed font-semibold text-indigo-800">
                    연간 누적 절약 금액: <span className="text-sm font-black text-indigo-950">{roiResults.annualSavings.toLocaleString()}원</span>
                  </p>
                  <p className="leading-relaxed font-semibold text-indigo-700 mt-1">
                    연간 업무 절약 시간: <span className="font-bold text-indigo-950">{roiResults.annualHoursSaved}시간</span>
                  </p>
                  <p className="leading-relaxed font-semibold text-indigo-600 mt-1">
                    ROI 효율 대비성: <span className="text-sm font-black text-emerald-600">{roiResults.roiPercentage.toLocaleString()}%</span>
                  </p>
                </div>
              </div>

              <RoiLeadCapture
                inputs={{
                  manualHours,
                  laborCost,
                  workingDays,
                  toolSubscription,
                }}
                results={{
                  monthlySavings: roiResults.monthlySavings,
                  annualSavings: roiResults.annualSavings,
                  annualHoursSaved: roiResults.annualHoursSaved,
                  roiPercentage: roiResults.roiPercentage,
                }}
              />
            </div>

            {/* Graphic Curve Chart */}
            <div className="lg:col-span-7 flex flex-col justify-center">
              <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest text-center mb-4">
                📈 1년간의 자동화 도입 누적 절약 누적 그래프
              </h4>
              <div className="h-[250px] w-full text-xs">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={roiResults.chartData} margin={{ top: 10, right: 10, left: -10, bottom: 5 }}>
                    <defs>
                      <linearGradient id="colorSavings" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} fontWeight={600} />
                    <YAxis stroke="#94a3b8" fontSize={11} fontWeight={600} />
                    <Tooltip formatter={(v) => [`${Number(v).toLocaleString()}원`, "누적 누린 혜택"]} />
                    <Area type="monotone" dataKey="누적 절감액 (원)" stroke="#4f46e5" fillOpacity={1} fill="url(#colorSavings)" strokeWidth={2.5} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

          </div>
        )}

        {/* TAB 3: AI TOKEN ESTIMATOR */}
        {activeCalc === "ai" && (
          <div id="panel-ai-tokens" className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Inputs Panel */}
            <div className="lg:col-span-5 space-y-5">
              <div>
                <h3 className="text-xl font-extrabold text-slate-900">🤖 AI 에이전트 월간 토큰 요율 시뮬레이터</h3>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mt-1">LLM 추론 비용 선제적 통제 시트</p>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="space-y-1.5 col-span-2">
                  <label className="font-extrabold text-slate-700">사용할 인공지능 엔트리 등급</label>
                  <div className="grid grid-cols-2 gap-2 mt-1">
                    <button
                      onClick={() => setLlmTier("flash")}
                      className={`px-3 py-2 rounded-xl text-xs font-black border cursor-pointer ${
                        llmTier === "flash"
                          ? "bg-indigo-50 border-indigo-400 text-indigo-700"
                          : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      초절감 Flash 모델 (Gemini 2.0 Flash)
                    </button>
                    <button
                      onClick={() => setLlmTier("pro")}
                      className={`px-3 py-2 rounded-xl text-xs font-black border cursor-pointer ${
                        llmTier === "pro"
                          ? "bg-indigo-50 border-indigo-400 text-indigo-700"
                          : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      고성능 Pro Reasoning (GPT-4o / Gemini Pro)
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="font-extrabold text-slate-700 font-mono">일일 AI 에이전트 호출수 (단위)</label>
                  <input
                    type="number"
                    value={dailyCalls}
                    onChange={(e) => setDailyCalls(Math.max(1, Number(e.target.value)))}
                    className="w-full rounded-xl border border-slate-250 bg-white px-3 py-2 text-sm font-bold text-slate-800"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="font-extrabold text-slate-700">평균 Prompt 입력 토큰수</label>
                  <input
                    type="number"
                    value={promptTokens}
                    onChange={(e) => setPromptTokens(Math.max(10, Number(e.target.value)))}
                    className="w-full rounded-xl border border-slate-250 bg-white px-3 py-2 text-sm font-bold text-slate-800"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="font-extrabold text-slate-700">평균 Completion 출력 토큰수</label>
                  <input
                    type="number"
                    value={completionTokens}
                    onChange={(e) => setCompletionTokens(Math.max(10, Number(e.target.value)))}
                    className="w-full rounded-xl border border-slate-250 bg-white px-3 py-2 text-sm font-bold text-slate-800"
                  />
                </div>
              </div>
            </div>

            {/* Cost Analytical Breakdown Output */}
            <div className="lg:col-span-7 space-y-6">
              <div className="bg-slate-900 text-slate-100 rounded-3xl p-6 border border-slate-800 space-y-4 shadow-md">
                <h4 className="text-xs font-black text-indigo-400 uppercase tracking-widest flex items-center gap-1.5">
                  📊 실시간 LLM 추론 요금 결산 대시보드
                </h4>

                <div className="grid grid-cols-2 gap-4 divide-x divide-slate-800">
                  <div className="pl-3 py-1 text-xs">
                    <span className="text-slate-400 font-medium tracking-wide">하루 추정 AI 지출</span>
                    <p className="mt-1.5 text-2xl font-black text-indigo-200">${aiResults.dailyLlmCostUsd.toFixed(3)}</p>
                    <p className="text-[10px] text-slate-500 font-medium">약 {(aiResults.dailyLlmCostUsd * 1380).toFixed(0)} 원</p>
                  </div>
                  <div className="pl-6 py-1 text-xs">
                    <span className="text-indigo-400 font-extrabold tracking-wide">월간 추정 AI 지출</span>
                    <p className="mt-1.5 text-2xl font-black text-emerald-450">${aiResults.monthlyLlmCostUsd.toFixed(2)}</p>
                    <p className="text-[10px] text-slate-500 font-medium">약 {Math.round(aiResults.monthlyLlmCostKrw).toLocaleString()} 원</p>
                  </div>
                </div>

                <div className="border-t border-slate-800/80 pt-4 text-[11px] font-medium text-slate-400 leading-relaxed space-y-1">
                  <p className="text-indigo-300 font-bold">💡 지출 절감 가이드팁:</p>
                  <p>
                    비즈니스 분류나 이메일 수신감지, 텍스트 기초적 파싱과 필터링 전치 과정에는 <strong>스마트 초저가형 Flash 모델군 (Gemini 3.5 Flash 등)</strong>을 전담 배치하세요.
                  </p>
                  <p>
                    어려운 의사 결합이나 데이터 기획, 복잡한 Python 자율 코딩 가동 시에만 간헐적으로 Pro/Reasoning 모델을 사용하면 <strong>AI 비용을 최대 90% 이상 절감</strong>할 수 있습니다.
                  </p>
                </div>
              </div>
            </div>

          </div>
        )}

      </div>

    </section>
  );
}
