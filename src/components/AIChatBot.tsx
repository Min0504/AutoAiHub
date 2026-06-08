import React, { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { MessageSquare, Send, Sparkles, User, Trash2 } from "lucide-react";

interface ChatMessage {
  id: string;
  role: "user" | "model";
  text: string;
}

const STORAGE_KEY = "autohub_chat_history";

const SUGGESTED_QUESTIONS = [
  "n8n vs Make 중 어느 것이 한국 중소기업에 더 적합한가요?",
  "Zapier 무료 플랜 한도와 유료 전환 기준을 알려주세요",
  "AI 에이전트를 노코드로 만들 수 있는 가장 쉬운 도구는?",
  "n8n 셀프호스팅 최소 서버 사양과 Docker 설치 방법",
  "Make vs n8n 월 1만 태스크 기준 비용 비교",
];

export default function AIChatBot() {
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved) as ChatMessage[];
    } catch {}
    return [
      {
        id: "welcome",
        role: "model",
        text: "안녕하세요! 오토가이드 AI 전담 고문입니다.\n\nn8n, Make, Zapier, Lindy, Relay 등 다양한 자동화 플랫폼의 가격 차이, 코딩 난이도, 연동 방식 등 무엇이든 편하게 여쭤보세요. 아래 추천 질문을 클릭하거나 직접 입력해 주세요 😊",
      },
    ];
  });
  const [input, setInput] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // Persist chat history
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    } catch {}
  }, [messages]);

  const handleSend = async (overrideText?: string) => {
    const text = overrideText ?? input;
    if (!text.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      text,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const chatContext = messages
        .concat(userMsg)
        .map((m) => ({ role: m.role, text: m.text }));

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: chatContext }),
      });

      if (!res.ok) throw new Error("서버 에이전트 통신에 문제가 발생했습니다.");

      const data = await res.json();
      if (data.error) throw new Error(data.error);

      const modelMsg: ChatMessage = {
        id: `model-${Date.now()}`,
        role: "model",
        text: data.text || "죄송합니다, 응답을 생성하지 못했습니다.",
      };
      setMessages((prev) => [...prev, modelMsg]);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "서버 타임아웃이 발생했습니다.";
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          role: "model",
          text: `죄송합니다. 오류가 발생했습니다: ${msg}\n\n잠시 후 다시 질문해 주세요.`,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void handleSend();
    }
  };

  const handleClearHistory = () => {
    const initial: ChatMessage[] = [
      {
        id: "welcome-new",
        role: "model",
        text: "대화 기록이 초기화됐습니다. 새로운 질문을 입력해 주세요 😊",
      },
    ];
    setMessages(initial);
    localStorage.removeItem(STORAGE_KEY);
  };

  const showSuggestions = messages.length <= 1;

  return (
    <section id="ai-chat-section" className="space-y-6 max-w-4xl mx-auto">
      <div className="text-center space-y-1.5">
        <h2 className="text-2xl font-extrabold tracking-tight text-slate-900">
          💬 AI 자동화 플랫폼 전문 상담사
        </h2>
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
          Gemini 기반 · 실시간 플랫폼 선택 전문 가이드
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-md flex flex-col" style={{ height: "calc(100vh - 280px)", minHeight: "480px", maxHeight: "680px" }}>
        {/* Terminal Header */}
        <div className="bg-slate-900 text-white px-5 py-3.5 flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 bg-emerald-500 rounded-full animate-ping shrink-0" />
            <span className="font-extrabold text-xs tracking-wider text-slate-100 uppercase">
              AI 아키텍트 상담사 상주 중
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-black tracking-wide text-indigo-400">GEMINI POWERED</span>
            <button
              onClick={handleClearHistory}
              title="대화 초기화"
              className="text-slate-500 hover:text-rose-400 transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Message Area */}
        <div className="flex-1 overflow-y-auto px-5 py-5 space-y-4 bg-slate-50/75">

          {/* Suggested Questions (shown only at start) */}
          {showSuggestions && (
            <div className="space-y-2">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">
                ⚡ 자주 묻는 질문 — 클릭하면 바로 전송됩니다
              </p>
              <div className="flex flex-col gap-1.5">
                {SUGGESTED_QUESTIONS.map((q, i) => (
                  <button
                    key={i}
                    onClick={() => void handleSend(q)}
                    disabled={loading}
                    className="text-left text-xs font-semibold text-indigo-700 bg-indigo-50/70 hover:bg-indigo-100/80 border border-indigo-100 rounded-xl px-4 py-2.5 transition-all cursor-pointer disabled:opacity-50"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((msg) => {
            const isUser = msg.role === "user";
            return (
              <div
                key={msg.id}
                className={`flex gap-3 ${isUser ? "ml-auto flex-row-reverse max-w-[85%]" : "mr-auto max-w-[90%]"}`}
              >
                <div
                  className={`h-8 w-8 rounded-xl shrink-0 flex items-center justify-center ${
                    isUser
                      ? "bg-indigo-600 text-white"
                      : "bg-slate-900 text-indigo-400 border border-slate-800"
                  }`}
                >
                  {isUser ? <User className="w-4 h-4" /> : <Sparkles className="w-4 h-4 fill-indigo-400/20" />}
                </div>

                <div
                  className={`p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed border ${
                    isUser
                      ? "bg-indigo-600 border-indigo-700 text-white rounded-tr-none font-medium"
                      : "bg-white border-slate-150 text-slate-800 rounded-tl-none font-medium shadow-sm"
                  }`}
                >
                  {isUser ? (
                    msg.text
                  ) : (
                    <div className="prose prose-sm max-w-none prose-headings:text-slate-800 prose-headings:font-extrabold prose-strong:text-slate-800 prose-code:bg-slate-100 prose-code:text-indigo-700 prose-code:rounded prose-code:px-1 prose-code:text-xs prose-ul:pl-4 prose-li:marker:text-indigo-500">
                      <ReactMarkdown>{msg.text}</ReactMarkdown>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {loading && (
            <div className="flex gap-3 max-w-[80%] mr-auto">
              <div className="h-8 w-8 rounded-xl bg-slate-900 text-indigo-400 border border-slate-800 shrink-0 flex items-center justify-center">
                <Sparkles className="w-4 h-4 animate-spin" />
              </div>
              <div className="p-3.5 rounded-2xl text-xs bg-white border border-slate-150 text-slate-400 font-bold tracking-wider rounded-tl-none animate-pulse">
                분석 중...
              </div>
            </div>
          )}
          <div ref={scrollRef} />
        </div>

        {/* Input Row */}
        <div className="border-t border-slate-100 p-4 bg-white flex items-center gap-2 shrink-0">
          <input
            id="input-chat-query"
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="예) n8n 자가호스팅 Docker 설치 방법, Make 이터레이터 설명..."
            className="flex-1 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs sm:text-sm font-semibold text-slate-800 focus:border-indigo-500 focus:bg-white focus:outline-none transition-colors"
            disabled={loading}
          />
          <button
            id="btn-chat-send"
            onClick={() => void handleSend()}
            disabled={loading || !input.trim()}
            className="rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 disabled:cursor-not-allowed transition-all h-10 w-10 flex items-center justify-center text-white cursor-pointer shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
}
