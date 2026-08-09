/**
 * 제휴 링크 중앙 관리 — 툴 CTA·배너가 모두 이 파일만 본다.
 *
 * Make 제휴 신청: https://www.make.com/en/affiliate  (커미션 35%, 12개월)
 * n8n 제휴:      ❌ 거절됨 (2026-06-09) — 재신청 또는 다른 제휴사 검토
 * Zapier 파트너:  https://zapier.com/l/partners/
 * Activepieces:   파트너 코드 확보 후 아래 주석 해제
 */

const UTM = "utm_source=autohub&utm_medium=referral&utm_campaign=tool_directory";

function utm(base: string): string {
  const sep = base.includes("?") ? "&" : "?";
  return `${base}${sep}${UTM}`;
}

/** 실제 수익이 나는 제휴 키 — AffiliateBanner에 노출 */
export const MONETIZED_AFFILIATE_KEYS = ["make", "dify"] as const;

export const AFFILIATE_LINKS: Record<string, string> = {
  // ❌ n8n 제휴 거절됨 — 일반 UTM 링크만 유지
  n8n: utm("https://n8n.io/"),

  make: utm("https://www.make.com/?pc=autohubai"),

  // 파트너 코드 확보 후 referral 파라미터로 교체
  zapier: utm("https://zapier.com/"),
  // zapier: utm("https://zapier.com/?referral=YOUR_CODE"),

  lindy: utm("https://lindy.ai/"),
  "relay-app": utm("https://relay.app/"),
  gumloop: utm("https://gumloop.com/"),

  // 파트너 코드 확보 후 제휴 URL로 교체 + MONETIZED_AFFILIATE_KEYS / AffiliateBanner에 추가
  activepieces: utm("https://www.activepieces.com/"),

  pipedream: utm("https://pipedream.com/"),
  crewai: utm("https://crewai.com/"),
  autogen: utm("https://microsoft.github.io/autogen/"),
  dify: "https://affiliate.dify.ai/29tpk4sr31xj",
  coze: utm("https://www.coze.com/"),
  "relevance-ai": utm("https://relevanceai.com/"),
  "retool-workflows": utm("https://retool.com/products/workflows"),
  kestra: utm("https://kestra.io/"),
  "power-automate": utm("https://powerautomate.microsoft.com/"),
};
