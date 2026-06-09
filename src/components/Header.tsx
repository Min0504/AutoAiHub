import { useState } from "react";
import { Sparkles, Menu, X } from "lucide-react";

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const tabs = [
  { id: "directory", label: "🛠️ 자동화 디렉토리" },
  { id: "compare", label: "🔄 1:1 비교 분석기" },
  { id: "ai-builder", label: "💡 AI 맞춤 시나리오" },
  { id: "calculators", label: "🧮 통합 계산기" },
  { id: "ai-chat", label: "🤖 AI 상담사" },
  { id: "consulting", label: "💰 Premium 견적" },
];

export default function Header({ activeTab, setActiveTab }: HeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleTabClick = (id: string) => {
    setActiveTab(id);
    setMobileOpen(false);
  };

  return (
    <>
      <header id="app-header" className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/95 backdrop-blur-sm shadow-sm">
        <div className="mx-auto flex max-w-7xl h-16 items-center justify-between px-4 sm:px-6 lg:px-8">

          {/* Logo */}
          <div
            id="brand-logo"
            className="flex items-center gap-2 cursor-pointer shrink-0"
            onClick={() => handleTabClick("directory")}
          >
            <div className="w-7 h-7 bg-indigo-600 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="text-lg font-bold tracking-tight text-slate-900">
              AutoHub<span className="text-indigo-600">AI</span>
            </span>
          </div>

          {/* Desktop Tabs */}
          <nav id="nav-tabs" className="hidden lg:flex items-center gap-1 h-full font-medium text-slate-500 overflow-x-auto">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  id={`tab-button-${tab.id}`}
                  onClick={() => handleTabClick(tab.id)}
                  className={`h-full border-b-2 py-4 px-4 font-semibold transition-all duration-200 cursor-pointer whitespace-nowrap text-sm ${
                    isActive
                      ? "border-indigo-600 text-indigo-600 font-bold"
                      : "border-transparent hover:text-slate-900 hover:border-slate-200"
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              id="btn-nav-ai-builder"
              onClick={() => handleTabClick("ai-builder")}
              className="hidden sm:flex bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded-lg text-xs font-semibold transition-all shadow-sm items-center gap-1.5 cursor-pointer"
            >
              <Sparkles className="w-3 h-3 fill-white/20 animate-pulse" />
              AI 설계사
            </button>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden flex items-center justify-center w-9 h-9 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
              aria-label="메뉴 열기"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          {/* Drawer Panel */}
          <div className="relative ml-auto w-72 bg-white h-full shadow-2xl flex flex-col">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
              <span className="font-extrabold text-slate-900 text-sm">
                AutoHub<span className="text-indigo-600">AI</span> 메뉴
              </span>
              <button
                onClick={() => setMobileOpen(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <nav className="flex-1 overflow-y-auto py-3 px-3">
              {tabs.map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => handleTabClick(tab.id)}
                    className={`w-full text-left px-4 py-3 rounded-xl text-sm font-semibold mb-1 transition-all cursor-pointer ${
                      isActive
                        ? "bg-indigo-600 text-white font-bold"
                        : "text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </nav>
            <div className="px-4 py-4 border-t border-slate-100">
              <button
                onClick={() => handleTabClick("ai-builder")}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-4 h-4" /> AI 워크플로우 설계사
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
