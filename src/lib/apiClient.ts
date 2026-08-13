/**
 * 백엔드 API 클라이언트 (선택적).
 *
 * VITE_API_URL이 설정된 경우에만 활성화된다.
 * 설정이 없으면 모든 함수는 no-op — 사이트는 기존처럼 100% 정적으로 동작한다.
 * (12-factor: 설정은 코드가 아니라 환경에 둔다)
 */
const API_URL: string | undefined = import.meta.env.VITE_API_URL;

export const isApiEnabled: boolean = typeof API_URL === "string" && API_URL.length > 0;

function apiUrl(path: string): string {
  return `${(API_URL as string).replace(/\/+$/, "")}${path}`;
}

/**
 * 제휴 링크 클릭 이벤트를 백엔드에 기록한다 (fire-and-forget).
 *
 * - sendBeacon: 페이지 이탈(새 탭으로 이동) 중에도 전송이 보장되는 브라우저 API.
 * - 실패해도 무시한다 — 분석 이벤트가 사용자 경험을 막으면 안 된다.
 */
export function recordToolClick(toolSlug: string): void {
  if (!isApiEnabled) return;
  const url = apiUrl(`/api/v1/tools/${encodeURIComponent(toolSlug)}/clicks`);

  try {
    if (typeof navigator.sendBeacon === "function" && navigator.sendBeacon(url)) {
      return;
    }
  } catch {
    // sendBeacon 미지원/실패 시 fetch로 폴백
  }

  void fetch(url, { method: "POST", keepalive: true }).catch(() => {
    // 분석 이벤트 유실은 치명적이지 않으므로 조용히 무시
  });
}
