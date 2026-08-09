import { lazy, Suspense, useState, useEffect } from "react";
import { TOOLS, CATEGORIES } from "./data/tools";
import type { Tool } from "./data/tools";
import Header from "./components/Header";
import ToolCard from "./components/ToolCard";
import {
  Search,
  SlidersHorizontal,
  Trash2,
  ArrowRight,
  Stars,
  Globe,
  Award,
  ShieldCheck,
  Cpu,
} from "lucide-react";
import AffiliateBanner from "./components/AffiliateBanner";
import CookieConsent from "./components/CookieConsent";
import FaqSection from "./components/FaqSection";
import { ToastProvider, useToast } from "./components/Toast";
import { useSeoMeta } from "./hooks/useSeoMeta";

const CompareSection = lazy(() => import("./components/CompareSection"));
const ToolDetailModal = lazy(() => import("./components/ToolDetailModal"));
const PrivacyPolicyModal = lazy(() => import("./components/PrivacyPolicyModal"));

function SectionLoadingFallback() {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center text-sm font-bold text-slate-500">
      화면을 불러오는 중입니다.
    </div>
  );
}

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

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const slugFromUrl = params.get("tool");
    if (slugFromUrl) {
      const found = TOOLS.find((t) => t.slug === slugFromUrl);
      if (found) setActiveModalTool(found);
    }
    const tabFromUrl = params.get("tab");
    if (tabFromUrl === "compare") {
      setActiveTab("compare");
    }
  }, []);

  useSeoMeta({
    toolSlug: activeModalTool?.slug ?? null,
    toolName: activeModalTool?.name ?? null,
    toolSlogan: activeModalTool?.slogan ?? null,
    toolBestFor: activeModalTool?.bestFor ?? null,
    activeTab,
  });

  const handleToggleCompareShelf = (tool: Tool) => {
    const isAlreadyIn = compareShelf.some((t) => t.id === tool.id);
    if (isAlreadyIn) {
      setCompareShelf((prev) => prev.filter((t) => t.id !== tool.id));
      showToast(`${tool.name} 비교 목록에서 제외됐습니다.`, "info");
    } else if (compareShelf.length >= 2) {
      setCompareShelf((prev) => [prev[1], tool]);
      showToast(`${tool.name}이(가) 비교 목록에 추가됐습니다.`, "success");
    } else {
      setCompareShelf((prev) => [...prev, tool]);
      showToast(`${tool.name}이(가) 비교 목록에 추가됐습니다.`, "success");
    }
  };

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
    return 0;
  });

  return (
    <div
      id="main-application-container"
      className="min-h-screen bg-slate-50/50 text-slate-800 font-sans selection:bg-indigo-100 flex flex-col justify-between"
    >
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="flex-1 mx-auto max-w-7xl w-full px-4 py-8 sm:px-6 lg:px-8">
        {activeTab === "directory" && (
          <div id="tab-directory-view" className="space-y-8">
            <div className="text-center py-6 max-w-3xl mx-auto space-y-4">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-700 border border-emerald-100 uppercase tracking-widest">
                <Globe className="w-3.5 h-3.5" /> Automation Directory
              </span>
              <h2 className="text-3xl font-extrabold text-slate-900 sm:text-4xl tracking-tight leading-tight">
                AI 업무 자동화 도구,
                <br />
                <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  한곳에서 비교하고 바로 시작하세요
                </span>
              </h2>
              <p className="text-sm font-semibold text-slate-500 leading-relaxed max-w-2xl mx-auto">
                n8n·Make·Zapier 등 16종을 기능·가격·난이도로 비교하고, 제휴 링크로 공식 사이트에서 바로 시작할 수 있습니다.
              </p>
            </div>

            {compareShelf.length > 0 && (
              <div
                id="compare-shelf"
                className="bg-white border-2 border-indigo-500 rounded-2xl p-4 shadow-xl flex flex-col justify-between items-center gap-4 sm:flex-row max-w-3xl mx-auto"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 font-black">
                    {compareShelf.length}
                  </div>
                  <div className="text-xs">
                    <p className="font-extrabold text-slate-900">비교 대기함</p>
                    <p className="text-slate-400 font-medium">
                      {compareShelf.map((t) => t.name).join(" vs ")}{" "}
                      {compareShelf.length === 1 ? "(1개 더 추가)" : "(비교 가능)"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    id="btn-shelf-clear"
                    onClick={() => setCompareShelf([])}
                    className="flex items-center justify-center gap-1 rounded-xl bg-slate-50 border border-slate-200 py-1.5 px-3 text-xs font-bold text-slate-600 hover:bg-slate-100 transition-all cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> 비우기
                  </button>
                  {compareShelf.length === 2 && (
                    <button
                      type="button"
                      id="btn-shelf-compare"
                      onClick={() => setActiveTab("compare")}
                      className="flex items-center justify-center gap-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 py-2 px-4 text-xs font-black text-white cursor-pointer shadow-md shadow-indigo-100"
                    >
                      1:1 비교로 이동 <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <aside className="lg:col-span-3 bg-white border border-slate-200 rounded-3xl p-6 flex flex-col gap-8 shadow-sm">
                <div>
                  <h3 className="text-xs uppercase tracking-wider text-slate-400 font-black mb-4">
                    Categories
                  </h3>
                  <ul className="space-y-3.5">
                    {CATEGORIES.map((cat) => {
                      const isSelected = selectedCategory === cat.id;
                      return (
                        <li key={cat.id}>
                          <button
                            type="button"
                            id={`sidebar-cat-${cat.id}`}
                            onClick={() => setSelectedCategory(cat.id)}
                            className={`w-full flex items-center gap-2.5 text-xs sm:text-sm text-left transition-all cursor-pointer py-1 ${
                              isSelected
                                ? "text-indigo-600 font-extrabold"
                                : "text-slate-600 hover:text-slate-900 font-medium"
                            }`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full shrink-0 transition-all ${
                                isSelected ? "bg-indigo-600 scale-125 shadow-sm" : "bg-slate-300"
                              }`}
                            />
                            {cat.name}
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </div>

                <AffiliateBanner />

                <div className="border-t border-slate-200 pt-5">
                  <div className="p-4 bg-indigo-50/70 border border-indigo-100 rounded-2xl space-y-1.5">
                    <p className="text-xs text-indigo-900 font-black tracking-wide uppercase">
                      가이드 픽
                    </p>
                    <p className="text-[11.5px] text-indigo-700 leading-relaxed font-bold">
                      CrewAI vs AutoGen: 멀티에이전트 프레임워크 비교
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        const crewai = TOOLS.find((t) => t.id === "crewai");
                        const autogen = TOOLS.find((t) => t.id === "autogen");
                        if (crewai && autogen) {
                          setCompareShelf([crewai, autogen]);
                          setActiveTab("compare");
                        }
                      }}
                      className="text-[11px] font-black text-indigo-600 hover:text-indigo-800 uppercase tracking-tight block text-left cursor-pointer"
                    >
                      1:1 비교 열기 →
                    </button>
                  </div>
                </div>

                <div className="border-t border-slate-200 pt-5">
                  <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                    <span className="text-[10px] text-indigo-600 font-black uppercase tracking-wider block">
                      이용 팁
                    </span>
                    <p className="text-xs font-extrabold text-slate-800 leading-snug">
                      도구 2개를 담아 1:1 비교를 시작하세요.
                    </p>
                    <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
                      카드의 &lsquo;비교 +&rsquo;로 대기함에 넣고, 공식 사이트 링크로 바로 시작할 수 있습니다.
                    </p>
                  </div>
                </div>

                <div className="border-t border-slate-200 pt-5">
                  <p className="text-[10px] text-slate-400 font-black uppercase tracking-wider mb-3">
                    자동화 가이드
                  </p>
                  <div className="space-y-2">
                    {[
                      { href: "/blog/make-tutorial-beginners.html", label: "Make 사용법 완전 가이드" },
                      { href: "/blog/ai-agent-tools-2026.html", label: "AI 에이전트 툴 TOP 5" },
                      { href: "/blog/no-code-automation-tools-2026.html", label: "노코드 자동화 툴 TOP 7" },
                      { href: "/blog/make-vs-n8n.html", label: "Make vs n8n 선택 가이드" },
                      { href: "/blog/n8n-free-self-hosting-guide.html", label: "n8n 무료 셀프호스팅" },
                      { href: "/blog/how-to-start-automation.html", label: "자동화 처음 시작하는 법" },
                    ].map((item) => (
                      <a
                        key={item.href}
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-[11.5px] font-semibold text-slate-600 hover:text-indigo-600 transition-colors group"
                      >
                        <span className="w-1 h-1 rounded-full bg-slate-300 group-hover:bg-indigo-400 shrink-0 transition-colors" />
                        {item.label}
                      </a>
                    ))}
                    <a
                      href="/blog/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] font-black text-indigo-500 hover:text-indigo-700 transition-colors block mt-1"
                    >
                      전체 글 보기 →
                    </a>
                  </div>
                </div>
              </aside>

              <div className="lg:col-span-9 space-y-6">
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
                      placeholder="예) n8n, 크롤링, 무료..."
                      className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm font-semibold text-slate-800 placeholder-slate-400 focus:border-indigo-500 focus:outline-none"
                    />
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400 shrink-0" />
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

                <div className="bg-white border border-slate-200 rounded-2xl px-5 py-4 text-xs sm:text-sm font-semibold text-slate-500 shadow-sm flex items-center justify-between">
                  <div className="max-w-[70%]">
                    <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest block mb-0.5">
                      Current selection
                    </span>
                    <p className="text-slate-800 font-extrabold text-sm">
                      {CATEGORIES.find((c) => c.id === selectedCategory)?.name}
                    </p>
                    <p className="text-xs text-slate-400 font-medium mt-1">
                      {CATEGORIES.find((c) => c.id === selectedCategory)?.desc}
                    </p>
                  </div>
                  <span className="bg-slate-50 border border-slate-200 text-slate-600 px-2.5 py-1 rounded-lg text-xs font-black shrink-0">
                    {filteredTools.length}개
                  </span>
                </div>

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
                    <p className="text-sm font-bold text-slate-400">일치하는 도구가 없습니다.</p>
                    <p className="text-xs text-slate-500">검색어나 필터를 바꿔 보세요.</p>
                  </div>
                )}
              </div>
            </div>

            <FaqSection />

            <div className="bg-white rounded-3xl border border-slate-200 p-8 space-y-6">
              <h3 className="text-lg font-black text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
                <Award className="w-5 h-5 text-indigo-500" /> 자동화 툴 고르는 기준
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs sm:text-sm leading-relaxed">
                <div>
                  <h4 className="font-extrabold text-slate-800 flex items-center gap-1">
                    <Stars className="w-4 h-4 text-amber-500" /> 과금 방식
                  </h4>
                  <p className="text-slate-500 font-medium mt-1.5">
                    Zapier는 태스크 단위, Make는 오퍼레이션, n8n 셀프호스트는 실행 수에 덜 민감합니다.
                    반복·루프가 많다면 과금 모델을 먼저 비교하세요.
                  </p>
                </div>
                <div>
                  <h4 className="font-extrabold text-slate-800 flex items-center gap-1">
                    <Cpu className="w-4 h-4 text-indigo-500" /> AI 연동
                  </h4>
                  <p className="text-slate-500 font-medium mt-1.5">
                    단순 연동은 Make·Zapier, 노드 단위 AI는 n8n·Gumloop, 에이전트형은 CrewAI·Dify를
                    살펴보세요.
                  </p>
                </div>
                <div>
                  <h4 className="font-extrabold text-slate-800 flex items-center gap-1">
                    <ShieldCheck className="w-4 h-4 text-emerald-500" /> 보안·온프레미스
                  </h4>
                  <p className="text-slate-500 font-medium mt-1.5">
                    민감 데이터라면 n8n self-host, Activepieces 등 자체 설치 옵션을 우선 검토하세요.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        <Suspense fallback={<SectionLoadingFallback />}>
          {activeTab === "compare" && (
            <CompareSection
              selectedTools={compareShelf}
              onRemoveFromCompare={handleToggleCompareShelf}
            />
          )}
        </Suspense>
      </main>

      <Suspense fallback={null}>
        {activeModalTool && (
          <ToolDetailModal
            tool={activeModalTool}
            onClose={() => setActiveModalTool(null)}
            onAddToCompare={handleToggleCompareShelf}
            isAddedToCompare={compareShelf.some((ts) => ts.id === activeModalTool.id)}
          />
        )}
      </Suspense>

      <Suspense fallback={null}>
        {showPrivacyPolicy && (
          <PrivacyPolicyModal onClose={() => setShowPrivacyPolicy(false)} />
        )}
      </Suspense>

      <CookieConsent />

      <footer className="bg-slate-900 text-slate-400 text-xs sm:text-sm py-8 mt-12 border-t border-slate-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="text-center sm:text-left space-y-1">
            <p className="font-extrabold text-white">
              AutoHub<span className="text-indigo-400">AI</span>
            </p>
            <p className="text-[11px] text-slate-500 font-medium">
              © 2026 AutoHub AI. All Rights Reserved.
            </p>
            <button
              type="button"
              onClick={() => setShowPrivacyPolicy(true)}
              className="text-[11px] text-slate-500 hover:text-slate-300 font-semibold underline underline-offset-2 cursor-pointer transition-colors"
            >
              개인정보 처리방침
            </button>
          </div>
          <div className="text-[10px] text-slate-500 font-medium leading-relaxed max-w-md text-center sm:text-right space-y-1">
            <p>
              <strong className="text-slate-400">제휴 고지:</strong> 일부 링크는 제휴(어필리에이트)
              링크입니다. 가입·결제 시 운영자에게 수수료가 발생할 수 있으며 이용자 추가 비용은 없습니다.
            </p>
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
