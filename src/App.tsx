import { useState, useEffect } from "react";
import { TOOLS, CATEGORIES, Tool } from "./data/tools";
import Header from "./components/Header";
import ToolCard from "./components/ToolCard";
import ToolDetailModal from "./components/ToolDetailModal";
import CompareSection from "./components/CompareSection";
import CalculatorSection from "./components/CalculatorSection";
import AIScenarioBuilder from "./components/AIScenarioBuilder";
import ConsultingSection from "./components/ConsultingSection";
import AIChatBot from "./components/AIChatBot";
import { Search, SlidersHorizontal, Check, Trash2, ArrowRight, Stars, Globe, Award, ShieldCheck, Cpu, ArrowUpDown } from "lucide-react";
import PrivacyPolicyModal from "./components/PrivacyPolicyModal";
import AffiliateBanner from "./components/AffiliateBanner";
import FaqSection from "./components/FaqSection";
import { ToastProvider, useToast } from "./components/Toast";
import { useSeoMeta } from "./hooks/useSeoMeta";

function AppInner() {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<string>("directory");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [difficultyFilter, setDifficultyFilter] = useState<string>("all");
  const [priceFilter, setPriceFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("default");

  const [activeModalTool, setActiveModalTool] = useState<Tool | null>(null);
  const [compareShelf, setCompareShelf] = useState<Tool[]>([]);
  const [showPrivacyPolicy, setShowPrivacyPolicy] = useState<boolean>(false);

  // URL 파라미터로 접속 시 해당 툴 자동 오픈 (?tool=n8n 등)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const slugFromUrl = params.get("tool");
    if (slugFromUrl) {
      const found = TOOLS.find((t) => t.slug === slugFromUrl);
      if (found) setActiveModalTool(found);
    }
  }, []);

  // SEO 메타 자동 업데이트
  useSeoMeta({
    toolSlug: activeModalTool?.slug ?? null,
    toolName: activeModalTool?.name ?? null,
    toolSlogan: activeModalTool?.slogan ?? null,
    toolBestFor: activeModalTool?.bestFor ?? null,
    activeTab,
  });

  // Category change wrapper
  const handleCategoryChange = (catId: string) => {
    setSelectedCategory(catId);
  };

  // Toggle compare shelf bindings
  const handleToggleCompareShelf = (tool: Tool) => {
    const isAlreadyIn = compareShelf.some((t) => t.id === tool.id);
    if (isAlreadyIn) {
      setCompareShelf((prev) => prev.filter((t) => t.id !== tool.id));
      showToast(`${tool.name} 비교 목록에서 제외됐습니다.`, "info");
    } else {
      if (compareShelf.length >= 2) {
        setCompareShelf((prev) => [prev[1], tool]);
        showToast(`${tool.name}이(가) 비교 목록에 추가됐습니다.`, "success");
      } else {
        setCompareShelf((prev) => [...prev, tool]);
        showToast(`${tool.name}이(가) 비교 목록에 추가됐습니다.`, "success");
      }
    }
  };

  // Clear compare shelf
  const handleClearCompareShelf = () => {
    setCompareShelf([]);
  };

  // Switch to comparative analysis tab instantly
  const handleGoCompareTab = () => {
    setActiveTab("compare");
  };

  // Filter + sort tools
  const filteredTools = TOOLS.filter((tool) => {
    const matchCategory =
      selectedCategory === "all" || tool.category === selectedCategory;

    const matchSearch =
      tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.slogan.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.features.some((f) => f.toLowerCase().includes(searchQuery.toLowerCase())) ||
      tool.pros.some((p) => p.toLowerCase().includes(searchQuery.toLowerCase())) ||
      tool.cons.some((c) => c.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchDifficulty =
      difficultyFilter === "all" || tool.difficulty === difficultyFilter;

    const matchPrice =
      priceFilter === "all" ||
      (priceFilter === "free" && tool.pricingDetails.free !== "없음" && tool.pricingDetails.free !== "-") ||
      (priceFilter === "paid" && (tool.pricingDetails.free === "없음" || tool.pricingDetails.free === "-"));

    return matchCategory && matchSearch && matchDifficulty && matchPrice;
  }).sort((a, b) => {
    if (sortBy === "rating") return b.rating - a.rating;
    if (sortBy === "difficulty-asc") return a.difficultyLevel - b.difficultyLevel;
    if (sortBy === "difficulty-desc") return b.difficultyLevel - a.difficultyLevel;
    return 0; // default: original order
  });

  return (
    <div id="main-application-container" className="min-h-screen bg-slate-50/50 text-slate-800 font-sans selection:bg-indigo-100 flex flex-col justify-between">
      
      {/* 1. Header Section */}
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* 2. Main Content Body Area */}
      <main className="flex-1 mx-auto max-w-7xl w-full px-4 py-8 sm:px-6 lg:px-8">
        
        {/* TAB 1: DIRECTORY TAB */}
        {activeTab === "directory" && (
          <div id="tab-directory-view" className="space-y-8 animate-fade-in">
            
            {/* Catchy Hero Zone */}
            <div className="text-center py-6 max-w-3xl mx-auto space-y-4">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-700 border border-emerald-100 uppercase tracking-widest">
                <Globe className="w-3.5 h-3.5" /> 2026 TOP AUTOMATION DIRECTORY
              </span>
              <h2 className="text-3xl font-extrabold text-slate-900 sm:text-4xl tracking-tight leading-tight">
                급성장하는 AI 업무 자동화 도구,<br />
                <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">이제 한곳에서 꼼꼼히 비교하세요</span>
              </h2>
              <p className="text-sm font-semibold text-slate-500 leading-relaxed max-w-2xl mx-auto">
                No-Code에서 Python 프레임워크 에이전트까지, 사내 인프라와 예산에 100% 최적화된 궁극의 오토메이션 매니저 생태계를 직관적으로 비교하고 수익을 확장하세요.
              </p>
            </div>

            {/* Float Compare Checker (Shelf notification bar) */}
            {compareShelf.length > 0 && (
              <div id="compare-shelf" className="bg-white border-2 border-indigo-500 rounded-2xl p-4 shadow-xl flex flex-col justify-between items-center gap-4 sm:flex-row max-w-3xl mx-auto animate-bounce-subtle">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 font-black">
                    {compareShelf.length}
                  </div>
                  <div className="text-xs">
                    <p className="font-extrabold text-slate-900">비교 대기 상태 보관함</p>
                    <p className="text-slate-400 font-medium">
                      {compareShelf.map((t) => t.name).join(" vs ")} {compareShelf.length === 1 ? "(1개 더 추가하세요)" : "(비교 시작이 가능합니다)"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    id="btn-shelf-clear"
                    onClick={handleClearCompareShelf}
                    className="flex items-center justify-center gap-1 rounded-xl bg-slate-50 border border-slate-200 py-1.5 px-3 text-xs font-bold text-slate-600 hover:bg-slate-100 transition-all cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> 비우기
                  </button>
                  {compareShelf.length === 2 && (
                    <button
                      id="btn-shelf-compare"
                      onClick={handleGoCompareTab}
                      className="flex items-center justify-center gap-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 py-2 px-4 text-xs font-black text-white cursor-pointer shadow-md shadow-indigo-100"
                    >
                      실시간 비교 분석기로 이동 <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Split layout: Sidebar left + Directory content right */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Left Sidebar Categories (from Sleek Interface Theme) */}
              <aside className="lg:col-span-3 bg-white border border-slate-200 rounded-3xl p-6 flex flex-col gap-8 shadow-sm">
                <div>
                  <h3 className="text-xs uppercase tracking-wider text-slate-400 font-black mb-4">Categories</h3>
                  <ul className="space-y-3.5">
                    {CATEGORIES.map((cat) => {
                      const isSelected = selectedCategory === cat.id;
                      return (
                        <li key={cat.id}>
                          <button
                            id={`sidebar-cat-${cat.id}`}
                            onClick={() => setSelectedCategory(cat.id)}
                            className={`w-full flex items-center gap-2.5 text-xs sm:text-sm text-left transition-all cursor-pointer py-1 ${
                              isSelected
                                ? "text-indigo-600 font-extrabold"
                                : "text-slate-600 hover:text-slate-900 font-medium"
                            }`}
                          >
                            <span className={`w-1.5 h-1.5 rounded-full shrink-0 transition-all ${
                              isSelected ? "bg-indigo-600 scale-125 shadow-sm" : "bg-slate-300"
                            }`} />
                            {cat.name}
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </div>

                {/* 제휴 배너 */}
                <AffiliateBanner />

                {/* Nice launch recommendation box */}
                <div className="border-t border-slate-150 pt-5">
                  <div className="p-4 bg-indigo-50/70 border border-indigo-100 rounded-2xl space-y-1.5">
                    <p className="text-xs text-indigo-900 font-black tracking-wide uppercase">⚡ 가이드 픽</p>
                    <p className="text-[11.5px] text-indigo-700 leading-relaxed font-bold">
                      CrewAI vs AutoGen: 어떤 멀티에이전트 프레임워크가 승리할까요?
                    </p>
                    <button
                      onClick={() => {
                        setSearchQuery("crewai");
                        setSelectedCategory("AI Agents");
                      }}
                      className="text-[11px] font-black text-indigo-600 hover:text-indigo-850 uppercase tracking-tight block text-left cursor-pointer"
                    >
                      상세 심층 분석 보기 →
                    </button>
                  </div>
                </div>

                {/* 플랫폼 활용 가이드 카드 */}
                <div className="border-t border-slate-150 pt-5">
                  <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                    <span className="text-[10px] text-indigo-600 font-black uppercase tracking-wider block">💡 플랫폼 활용 팁</span>
                    <p className="text-xs font-extrabold text-slate-800 leading-snug">
                      원하는 도구 2개를 담아 1:1 라이벌 비교를 시작해 보세요!
                    </p>
                    <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
                      각 AI 툴 카드 우측 상단의 <strong>’비교 추가’</strong> 버튼을 선택하면 대기 분석함에 자동 저장되며, 언제든지 정밀 비교 및 ROI 분석 혜택을 체감하실 수 있습니다.
                    </p>
                  </div>
                </div>

              </aside>

              {/* Right Content Area containing Search, active description and tool cards */}
              <div className="lg:col-span-9 space-y-6">
                
                {/* Search & filters row */}
                <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="relative flex-1 max-w-md">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <Search className="h-4 w-4 text-slate-400" />
                    </div>
                    <input
                      id="search-tools-input"
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="예) n8n, 크롤링, 파이썬, 무료, 장점 등..."
                      className="w-full rounded-xl border border-slate-250 bg-white py-2.5 pl-10 pr-4 text-sm font-semibold text-slate-800 placeholder-slate-400 focus:border-indigo-500 focus:outline-none"
                    />
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <div className="flex items-center gap-1 text-xs">
                      <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    </div>
                    <select
                      id="filter-difficulty"
                      value={difficultyFilter}
                      onChange={(e) => setDifficultyFilter(e.target.value)}
                      className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 shadow-sm cursor-pointer"
                    >
                      <option value="all">전체 난이도</option>
                      <option value="쉬움">쉬움</option>
                      <option value="보통">보통</option>
                      <option value="어려움">어려움</option>
                    </select>
                    <select
                      id="filter-price"
                      value={priceFilter}
                      onChange={(e) => setPriceFilter(e.target.value)}
                      className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 shadow-sm cursor-pointer"
                    >
                      <option value="all">전체 가격</option>
                      <option value="free">무료 플랜 있음</option>
                      <option value="paid">유료 전용</option>
                    </select>
                    <select
                      id="sort-tools"
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 shadow-sm cursor-pointer"
                    >
                      <option value="default">기본 순서</option>
                      <option value="rating">평점 높은 순</option>
                      <option value="difficulty-asc">쉬운 것 먼저</option>
                      <option value="difficulty-desc">어려운 것 먼저</option>
                    </select>
                  </div>
                </div>

                {/* Category Description Panel */}
                <div className="bg-white border border-slate-200 rounded-2xl px-5 py-4 text-xs sm:text-sm font-semibold text-slate-500 shadow-sm flex items-center justify-between">
                  <div className="max-w-[70%]">
                    <span className="text-[10px] font-black text-indigo-650 uppercase tracking-widest block mb-0.5">CURRENT SELECTION</span>
                    <p className="text-slate-800 font-extrabold text-sm">{CATEGORIES.find((c) => c.id === selectedCategory)?.name}</p>
                    <p className="text-xs text-slate-400 font-medium mt-1">{CATEGORIES.find((c) => c.id === selectedCategory)?.desc}</p>
                  </div>
                  <span className="bg-slate-105/50 border border-slate-200/40 text-slate-600 px-2.5 py-1 rounded-lg text-xs font-black shrink-0">
                    SaaS {filteredTools.length}개 발견됨
                  </span>
                </div>

                {/* Grid Lists of Tool Cards */}
                {filteredTools.length > 0 ? (
                  <div id="grid-list-tools" className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {filteredTools.map((tool) => (
                      <ToolCard
                        key={tool.id}
                        tool={tool}
                        onOpenDetails={(t) => setActiveModalTool(t)}
                        onAddToCompare={handleToggleCompareShelf}
                        isAddedToCompare={compareShelf.some((ts) => ts.id === tool.id)}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-20 bg-white border border-slate-200 rounded-3xl mx-auto space-y-1.5 p-6">
                    <p className="text-sm font-bold text-slate-400">일치하는 자동화 솔루션이 없습니다.</p>
                    <p className="text-xs text-slate-500">검색어나 필터를 재정렬하여 복원해 보세요.</p>
                  </div>
                )}

              </div>
            </div>

            {/* FAQ 섹션 */}
            <FaqSection />

            {/* Catchy Editorial Blog post-like Hub info block (SEO-friendly traffic capture) */}
            <div className="bg-white rounded-3xl border border-slate-200 p-8 space-y-6">
              <h3 className="text-lg font-black text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
                <Award className="w-5 h-5 text-indigo-500" /> 차세대 오토메이션 검색 허브 플랫폼 선정 가이드라인
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs sm:text-sm leading-relaxed">
                <div>
                  <h4 className="font-extrabold text-slate-800 flex items-center gap-1">
                    <Stars className="w-4 h-4 text-amber-500" /> 핵심은 과금 설계 방식
                  </h4>
                  <p className="text-slate-500 font-medium mt-1.5">
                    노코드 자동화 도입 시 많은 이들이 '연동의 단순함'에 열중하지만 진정한 팩트는 단위 스커지 <strong>'과금 누수'</strong>입니다. Zapier는 완수 태스크당 비용이지만 n8n은 스텝 상관없이 1번의 워크플로우 통과가 통 빌링됩니다. 대형 루프 처리나 조건 반향이 많을수록 n8n의 가성비가 10배 이상 올라갑니다.
                  </p>
                </div>
                <div>
                  <h4 className="font-extrabold text-slate-800 flex items-center gap-1">
                    <Cpu className="w-4 h-4 text-indigo-500" /> AI 에이전트 자율성과 정밀 제보의 조화
                  </h4>
                  <p className="text-slate-500 font-medium mt-1.5">
                    Lindy 같은 툴은 챗을 입력하는 것만으로 자율 직원을 만듭니다. 반면 n8n, Gumloop은 AI 모델 블록과 DB 스키마 인스턴트들을 직접 노드로 이어붙여 정지 조건 오류를 0%에 수렴하게 제합합니다. 목적지까지 정교한 정규 규칙 정렬이 중요하다면 노드 기반 AI 설계가 무조건 안전합니다.
                  </p>
                </div>
                <div>
                  <h4 className="font-extrabold text-slate-800 flex items-center gap-1">
                    <ShieldCheck className="w-4 h-4 text-emerald-500" /> 데이터 보안 및 On-Premise
                  </h4>
                  <p className="text-slate-500 font-medium mt-1.5">
                    회사 주요 기밀, 직원 세무 원장 데이터 혹은 고객 금융 데이터가 퍼블릭 클라우드에 연합 이식되는 것에 부담을 가진다면, 오픈소스인 <strong>Activepieces</strong>나 self-hosted <strong>n8n</strong>을 사내 독립 도커망(Docker Container)에 격리 배포하여 장 가동하십시오.
                  </p>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* TAB 2: COMPARE TAB */}
        {activeTab === "compare" && (
          <CompareSection
            selectedTools={compareShelf}
            onRemoveFromCompare={handleToggleCompareShelf}
          />
        )}

        {/* TAB 3: AI SCENARIO GENERATOR TAB */}
        {activeTab === "ai-builder" && <AIScenarioBuilder />}

        {/* TAB 4: CALCULATORS TAB */}
        {activeTab === "calculators" && <CalculatorSection />}

        {/* TAB 5: AI CHAT AGENT */}
        {activeTab === "ai-chat" && <AIChatBot />}

        {/* TAB 6: PREMIUM CONSULTING & LEAD FUNNEL */}
        {activeTab === "consulting" && <ConsultingSection />}

      </main>

      {/* 3. Global Details Modal Overlay */}
      <ToolDetailModal
        tool={activeModalTool}
        onClose={() => setActiveModalTool(null)}
        onAddToCompare={handleToggleCompareShelf}
        isAddedToCompare={compareShelf.some((ts) => ts.id === (activeModalTool ? activeModalTool.id : ""))}
      />

      {/* 4. Privacy Policy Modal */}
      {showPrivacyPolicy && (
        <PrivacyPolicyModal onClose={() => setShowPrivacyPolicy(false)} />
      )}

      {/* 5. Footer */}
      <footer className="bg-slate-900 text-slate-400 text-xs sm:text-sm py-8 mt-12 border-t border-slate-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="text-center sm:text-left space-y-1">
            <p className="font-extrabold text-white flex items-center gap-1.5 justify-center sm:justify-start">
               AutoHub<span className="text-indigo-400">AI</span> <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded-md font-medium text-slate-400">SEO HUB</span>
            </p>
            <p className="text-[11px] text-slate-500 font-medium">© 2026 AutoHub AI. All Rights Reserved.</p>
            <button
              onClick={() => setShowPrivacyPolicy(true)}
              className="text-[11px] text-slate-500 hover:text-slate-300 font-semibold underline underline-offset-2 cursor-pointer transition-colors"
            >
              개인정보 처리방침
            </button>
          </div>
          <div className="text-[10px] text-slate-500 font-medium leading-relaxed max-w-md text-center sm:text-right">
            본 서비스는 자동화 플랫폼 정보를 비교하는 검색형 포털입니다. 제휴 링크와 광고는 각 프로그램 승인 및 고지 기준을 충족한 뒤 적용됩니다.
          </div>
        </div>
      </footer>

    </div>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <AppInner />
    </ToastProvider>
  );
}
