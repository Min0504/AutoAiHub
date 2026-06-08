import type { FormEvent } from "react";
import { useState } from "react";
import { DollarSign, FileText, Sparkles, Building2, User2, MessageSquare } from "lucide-react";
import { trackProposalSubmit } from "../lib/analytics";
import { TOOLS } from "../data/tools";
import { PartnerProgramsPanel } from "./consulting/PartnerProgramsPanel";
import { ProposalActions } from "./consulting/ProposalActions";
import { isProposal, type Proposal } from "./consulting/types";

export default function ConsultingSection() {
  // Input states
  const [companyName, setCompanyName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [needs, setNeeds] = useState<string>("");
  const [budget, setBudget] = useState<string>("100만원 ~ 500만원");
  const [selectedTool, setSelectedTool] = useState<string>("n8n");
  const [businessType, setBusinessType] = useState<string>("B2B 영업/마케팅");
  const [privacyAccepted, setPrivacyAccepted] = useState<boolean>(false);

  // Flow states
  const [loading, setLoading] = useState<boolean>(false);
  const [proposal, setProposal] = useState<Proposal | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateProposal = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!companyName.trim() || !email.trim() || !needs.trim()) {
      setError("회사명, 이메일, 그리고 구현하고 싶은 니즈를 작성해 주세요.");
      return;
    }

    if (!privacyAccepted) {
      setError("견적 생성과 상담 리드 저장을 위해 개인정보 수집·이용 동의가 필요합니다.");
      return;
    }

    setLoading(true);
    setError(null);
    setProposal(null);
    trackProposalSubmit(budget, businessType);

    try {
      const response = await fetch("/api/proposal", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          companyName,
          email,
          phone,
          needs,
          budget,
          selectedTool,
          businessType
        }),
      });

      if (!response.ok) {
        const responseBody: unknown = await response.json();
        throw new Error(readErrorMessage(responseBody) ?? "서버 연동 중 견적 계산 파이프라인 호출 실패가 발생했습니다. 재요청해 보세요.");
      }

      const data: unknown = await response.json();
      if (!isProposal(data)) {
        throw new Error(readErrorMessage(data) ?? "견적 응답 형식이 올바르지 않습니다.");
      }

      setProposal(data);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("맞춤 견적 기획서를 생성하지 못했습니다.");
      }
    } finally {
      setLoading(false);
    }
  };

  const presets = [
    { type: "쇼핑몰/물류", label: "네이버 스마트스토어 신규 수주 자동 엑셀 추가 및 일일 배송 송장 알림톡 일괄 대행 시스템" },
    { type: "영업/CRM", label: "홈페이지 구글 폼 접수 시 HubSpot CRM 고객 카드 자동 이식 및 담당 파트너 실시간 슬랙 알림" },
    { type: "AI 가상CS", label: "사내 노션/PDF 지식 위키 RAG 데이터와 카카오 채널 API를 다이렉트로 가두어 작동하는 챗봇 상담 비서" }
  ];

  return (
    <div id="consulting-section-root" className="space-y-8 max-w-7xl mx-auto">
      
      {/* Upper Marketing Zone */}
      <div className="text-center py-6 max-w-3xl mx-auto space-y-4">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-3 py-1 text-xs font-black text-indigo-700 border border-indigo-100 uppercase tracking-widest">
          <DollarSign className="w-3.5 h-3.5" /> B2B LEAD GENERATION & AFFILIATION
        </span>
        <h2 className="text-3xl font-extrabold text-slate-900 sm:text-4xl tracking-tight leading-tight">
          자사 맞춤형 AI 업무 자동화 설계<br />
          <span className="bg-gradient-to-r from-emerald-600 to-indigo-600 bg-clip-text text-transparent">B2B 정밀 기획서와 견적을 즉시 발급받으세요</span>
        </h2>
        <p className="text-sm font-semibold text-slate-500 leading-relaxed max-w-2xl mx-auto">
          복잡한 외주 기획 단계를 완전 노코드로 단축하세요. 구상하는 시스템 요구 조건과 사내 리소스를 지정하면, <strong>Gemini 인지 두뇌</strong>가 공식 기획 견적서(RFP)를 즉각 편찬합니다.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Side: Proposal Lead Request Form */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
              📝 B2B 오토메이션 구축 의뢰 및 견적 제안서
            </h3>
            <p className="text-xs font-medium text-slate-400 mt-0.5">상담 데이터를 가두고, AI 제휴 에이전시 매칭을 즉각 배포합니다.</p>
          </div>

          <form onSubmit={handleGenerateProposal} className="space-y-4 text-xs font-bold text-slate-700">
            {/* Business type selector */}
            <div className="space-y-1.5">
              <label>대분류 자동화 목적군</label>
              <div className="grid grid-cols-3 gap-1.5">
                {["B2B 영업/마케팅", "CS 고객상담/CRM", "데이터 크롤링/보고서"].map((bType) => (
                  <button
                    key={bType}
                    type="button"
                    onClick={() => setBusinessType(bType)}
                    className={`py-2 px-1 text-[10px] font-extrabold rounded-lg border text-center transition-all cursor-pointer ${
                      businessType === bType
                        ? "bg-indigo-600 border-indigo-600 text-white"
                        : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    {bType}
                  </button>
                ))}
              </div>
            </div>

            {/* Profile inputs */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="flex items-center gap-1.5"><Building2 className="w-3.5 h-3.5 text-slate-400" />회사명 (필수)</label>
                <input
                  type="text"
                  required
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="예: 주식회사 에이아이텍"
                  className="w-full rounded-xl border border-slate-250 bg-white px-3 py-2 text-xs font-semibold text-slate-800 placeholder-slate-400 focus:border-indigo-500 focus:outline-none"
                />
              </div>
              <div className="space-y-1.5">
                <label className="flex items-center gap-1.5"><User2 className="w-3.5 h-3.5 text-slate-400" />담당자 이메일 (필수)</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="예: manager@aitech.com"
                  className="w-full rounded-xl border border-slate-250 bg-white px-3 py-2 text-xs font-semibold text-slate-800 placeholder-slate-400 focus:border-indigo-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label>연락처 (선택)</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="예: 010-1234-5678"
                  className="w-full rounded-xl border border-slate-250 bg-white px-3 py-2 text-xs font-semibold text-slate-800 placeholder-slate-400 focus:border-indigo-500 focus:outline-none"
                />
              </div>
              <div className="space-y-1.5">
                <label>우선 선호 도구 플랫폼</label>
                <select
                  value={selectedTool}
                  onChange={(e) => setSelectedTool(e.target.value)}
                  className="w-full rounded-xl border border-slate-250 bg-white px-3 py-2 text-xs font-bold text-slate-800 cursor-pointer focus:border-indigo-500 focus:outline-none"
                >
                  {TOOLS.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name} (선호)
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Budget options */}
            <div className="space-y-1.5">
              <label>사내 가용 예상 예산</label>
              <select
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                className="w-full rounded-xl border border-slate-250 bg-white px-3 py-2.5 text-xs font-bold text-slate-800 cursor-pointer focus:border-indigo-500 focus:outline-none animate-pulse-subtle"
              >
                <option value="100만원 이하 (초경량 테스트)">100만원 이하 (초경량 테스트 구축)</option>
                <option value="100만원 ~ 500만원 (알뜰형 메인 자동화)">100만원 ~ 500만원 (알뜰 실용 핵심 자동화)</option>
                <option value="500만원 ~ 2000만원 (미들급 다중 파이프라인)">500만원 ~ 2000만원 (미들급 엔터 사내 파이프라인)</option>
                <option value="2000만원 이상 (엔터프라이즈 온프레미스 RAG)">2000만원 이상 (대기업 고정밀 인메머리 보안 RAG)</option>
              </select>
            </div>

            {/* Textarea details */}
            <div className="space-y-1.5">
              <label className="flex items-center gap-1.5"><MessageSquare className="w-3.5 h-3.5 text-slate-400" />상세 의뢰 내용 및 필요 연동 서비스 목록</label>
              <textarea
                rows={4}
                required
                value={needs}
                onChange={(e) => setNeeds(e.target.value)}
                placeholder="어느 부서의 어떤 연동이 막히는지, 수작업을 어떻게 대체하고 싶은지 한국어로 구체적일수록 고인지적 견적 기획서가 산출됩니다."
                className="w-full rounded-2xl border border-slate-250 bg-white p-3.5 text-xs font-semibold text-slate-850 placeholder-slate-400 focus:border-indigo-500 focus:outline-none"
              />
            </div>

            {/* Preset quick buttons */}
            <div className="space-y-1.5 pt-1">
              <span className="text-[10px] text-slate-400 tracking-wider">⚡ 빠른 예시 본 뜨기:</span>
              <div className="flex flex-col gap-1.5">
                {presets.map((p, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setNeeds(p.label);
                      setBusinessType(p.type === "쇼핑몰/물류" ? "데이터 크롤링/보고서" : p.type === "영업/CRM" ? "B2B 영업/마케팅" : "CS 고객상담/CRM");
                    }}
                    className="text-left text-[11px] p-2 bg-slate-50 hover:bg-indigo-50 border border-slate-200 rounded-lg text-slate-600 hover:text-indigo-850 font-semibold cursor-pointer truncate"
                  >
                    [{p.type}] {p.label}
                  </button>
                ))}
              </div>
            </div>

            <label className="flex items-start gap-2 rounded-xl bg-slate-50 border border-slate-200 p-3 text-[11px] leading-relaxed text-slate-500">
              <input
                type="checkbox"
                checked={privacyAccepted}
                onChange={(event) => setPrivacyAccepted(event.target.checked)}
                className="mt-0.5 accent-indigo-600"
              />
              <span>
                견적 초안 생성과 상담 접수를 위해 회사명, 이메일, 선택 입력한 연락처, 의뢰 내용을 리드 원장에 저장하는 것에 동의합니다.
              </span>
            </label>

            {/* Actions for generation */}
            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-350 disabled:cursor-not-allowed text-white py-3 font-extrabold text-sm shadow-md transition-all cursor-pointer"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span>Gemini AI가 B2B 견적 초안 생성 중...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-emerald-100 animate-pulse fill-emerald-100/10" />
                    <span>💰 B2B 맞춤 기획서 초안 생성 & 리드 저장</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {error && (
            <div className="bg-rose-50 text-rose-800 p-3.5 rounded-xl border border-rose-100 font-medium text-[11px] text-center">
              {error}
            </div>
          )}
        </div>

        {/* Right Side: Generated Proposal PDF View OR Affiliate Hub if empty */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* 1. PROPOSAL ACTIVE BOARD (Displays generated content from server API) */}
          {proposal ? (
            <div id="proposal-rendering-card" className="bg-white border-2 border-indigo-500 rounded-3xl p-6 md:p-8 shadow-xl space-y-6 relative overflow-hidden animate-fade-in print:border-0 print:shadow-none">
              
              {/* Draft watermark label */}
              <div className="absolute top-4 right-4 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full px-3 py-1 font-black text-[10px] uppercase tracking-widest animate-pulse">
                OFFICIAL B2B RFP OUTLINE
              </div>

              {/* Title Section */}
              <div className="border-b-2 border-slate-100 pb-5">
                <span className="text-[9px] font-black text-indigo-600 tracking-widest uppercase block">AutoHub AI B2B Integration Service</span>
                <h4 className="text-xl font-black text-slate-900 mt-1 leading-snug">{proposal.proposalTitle}</h4>
                <div className="flex flex-wrap items-center gap-2.5 mt-3 text-[11px] text-slate-500 font-medium">
                  <span className="bg-slate-100 px-2 py-1 rounded-md">수신: <strong>{companyName} 귀하</strong></span>
                  <span className="bg-slate-100 px-2 py-1 rounded-md">예산: <strong>{budget}</strong></span>
                  <span className="bg-slate-100 px-2 py-1 rounded-md">설계일시: <strong>{new Date().toLocaleDateString("ko-KR")} PRO</strong></span>
                </div>
              </div>

              {/* Executive Summary */}
              <div className="space-y-1.5 text-xs">
                <span className="text-[10px] font-black text-slate-400 tracking-wider block">01. 추진 도면 및 혁신 기대 효과 (EXECUTIVE SUMMARY)</span>
                <p className="bg-slate-50 border border-slate-150 p-4 rounded-xl leading-relaxed font-semibold text-slate-650">
                  {proposal.executiveSummary}
                </p>
              </div>

              {/* Tech Stack & Cognitive flow */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-50 border border-slate-150 p-4 rounded-2xl space-y-2 text-xs font-semibold">
                  <span className="text-[10px] font-black text-indigo-600 block uppercase tracking-wide">02. 권장 기술 스튜던트 (TECH STACK)</span>
                  <p className="font-extrabold text-slate-800 text-sm">{proposal.recommendedStack}</p>
                  <p className="text-[11px] font-medium text-slate-500 leading-relaxed">자사에서 산출한 가격 편차 대비 최상의 ROI를 실적하는 통합 시스템 결성 스택 추천입니다.</p>
                </div>
                <div className="bg-slate-50 border border-slate-150 p-4 rounded-2xl space-y-2 text-xs font-semibold">
                  <span className="text-[10px] font-black text-indigo-600 block uppercase tracking-wide">03. 아키텍처 인지 흐름 (COGNITIVE FLOW)</span>
                  <p className="font-medium text-slate-650 leading-relaxed">{proposal.architectureFlow}</p>
                </div>
              </div>

              {/* Delivery Steps Roadmap */}
              <div className="space-y-2 text-xs font-semibold">
                <span className="text-[10px] font-black text-slate-400 tracking-wider block">04. 구축 시퀀스 로드맵 (IMPLEMENTATION ROADMAP)</span>
                <div className="grid grid-cols-1 gap-2.5">
                  {proposal.phaseSteps.map((step, sIdx) => (
                    <div key={sIdx} className="bg-white border border-slate-200 rounded-xl p-3 flex items-start justify-between gap-3 shadow-xs">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-900 text-[10px] font-extrabold text-white">{sIdx + 1}</span>
                          <span className="font-extrabold text-slate-850 text-xs">{step.phaseName}</span>
                        </div>
                        <p className="text-[11px] font-medium text-slate-500 leading-normal mt-1.5 pl-6">산출물: {step.deliverables}</p>
                      </div>
                      <span className="bg-indigo-50 border border-indigo-150 text-indigo-600 text-[10px] px-2 py-1 rounded-md shrink-0 font-extrabold">{step.duration}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Costing and ROI Forecast */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-slate-150">
                <div className="space-y-1.5 text-xs font-semibold">
                  <span className="text-[10px] font-black text-slate-400 block uppercase tracking-wide">05. 예상 인건 외주 견적 비용 (COSTING)</span>
                  <p className="bg-slate-50 border border-slate-150 p-3.5 rounded-xl font-extrabold text-indigo-950 leading-relaxed whitespace-pre-line">
                    {proposal.estimatedDevelopmentCost}
                  </p>
                </div>
                <div className="space-y-1.5 text-xs font-semibold">
                  <span className="text-[10px] font-black text-slate-400 block uppercase tracking-wide">06. 공약 절약 ROI 미래상 (ROI FORECAST)</span>
                  <p className="bg-slate-50 border border-slate-150 p-3.5 rounded-xl font-medium text-slate-650 leading-relaxed">
                    {proposal.annualROIExpected}
                  </p>
                </div>
              </div>

              {/* Specialist comment & action bar */}
              <div className="p-4 bg-indigo-50/70 border border-indigo-150 rounded-2xl text-xs font-semibold space-y-1">
                <span className="text-[9px] font-black text-indigo-600 uppercase tracking-widest block">Senior Architect Special Review</span>
                <p className="text-slate-700 leading-relaxed">{proposal.expertMatchingInfo}</p>
              </div>

              <ProposalActions
                leadContext={{
                  companyName,
                  email,
                  phone,
                  needs,
                  budget,
                  selectedTool,
                  businessType,
                  proposalLeadId: proposal.leadId ?? "",
                }}
              />

            </div>
          ) : (
            /* Blank state: Instruct users and display real affiliate bonus codes */
            <div className="border border-slate-200 bg-white rounded-3xl p-6 md:p-8 shadow-sm space-y-8">
              
              <div className="text-center py-10 space-y-2">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
                  <FileText className="w-6 h-6 animate-pulse" />
                </div>
                <h4 className="text-lg font-black text-slate-850">실시간 AI 견적 산출 대기 중</h4>
                <p className="text-xs text-slate-400 font-medium leading-relaxed max-w-sm mx-auto">
                  왼쪽 양식에 회사명과 무엇을 자동화하고 싶은지 상세히 적어주세요.<br />
                  Gemini 브레인이 구축 난이도, 일정, 설계 단계, 개발 인건비 견적을 시뮬레이션합니다.
                </p>
              </div>

              <PartnerProgramsPanel />

            </div>
          )}

        </div>

      </div>

    </div>
  );
}

function readErrorMessage(value: unknown): string | null {
  if (!isRecord(value)) {
    return null;
  }

  const error = value["error"];
  return typeof error === "string" ? error : null;
}

function isRecord(value: unknown): value is Readonly<Record<string, unknown>> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
