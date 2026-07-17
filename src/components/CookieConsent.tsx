import { useEffect, useState } from "react";

const STORAGE_KEY = "autohub_cookie_consent";
const GA_ID = "G-W5Q885CWSM";

type Consent = "accepted" | "declined";

function readConsent(): Consent | null {
  try {
    const value = localStorage.getItem(STORAGE_KEY);
    if (value === "accepted" || value === "declined") return value;
  } catch {
    /* ignore */
  }
  return null;
}

function loadGoogleAnalytics(): void {
  if (document.getElementById("ga4-script")) return;

  const script = document.createElement("script");
  script.id = "ga4-script";
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag(...args: unknown[]) {
    window.dataLayer!.push(args);
  };
  window.gtag("js", new Date());
  window.gtag("config", GA_ID, { anonymize_ip: true });
}

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const existing = readConsent();
    if (existing === "accepted") {
      loadGoogleAnalytics();
      return;
    }
    if (existing === null) {
      setVisible(true);
    }
  }, []);

  const save = (value: Consent) => {
    try {
      localStorage.setItem(STORAGE_KEY, value);
    } catch {
      /* ignore */
    }
    if (value === "accepted") {
      loadGoogleAnalytics();
    }
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-[60] p-4 sm:p-5"
      role="dialog"
      aria-live="polite"
      aria-label="쿠키 및 분석 동의"
    >
      <div className="mx-auto max-w-3xl rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 shadow-lg flex flex-col sm:flex-row gap-4 sm:items-center">
        <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed flex-1">
          방문 통계를 위해 Google Analytics를 사용할 수 있습니다. 동의 시에만 측정 쿠키가
          활성화됩니다. 거부해도 사이트 이용에는 영향이 없습니다.
        </p>
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => save("declined")}
            className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50 cursor-pointer"
          >
            거부
          </button>
          <button
            type="button"
            onClick={() => save("accepted")}
            className="rounded-xl bg-indigo-600 hover:bg-indigo-700 px-3 py-2 text-xs font-bold text-white cursor-pointer"
          >
            동의
          </button>
        </div>
      </div>
    </div>
  );
}
