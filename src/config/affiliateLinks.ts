/**
 * 제휴 링크 중앙 관리 파일
 *
 * 실제 제휴 코드 발급 후 아래 TODO 주석을 실제 링크로 교체하세요.
 *
 * Make 제휴 신청: https://www.make.com/en/affiliate-program  (커미션 35%, 12개월)
 * n8n 제휴 신청:  https://n8n.io/affiliates/                  (커미션 30%, 12개월)
 * Zapier 파트너:  https://zapier.com/l/partners/
 */

const UTM = "utm_source=autohub&utm_medium=referral&utm_campaign=tool_directory";

function utm(base: string): string {
  const sep = base.includes("?") ? "&" : "?";
  return `${base}${sep}${UTM}`;
}

export const AFFILIATE_LINKS: Record<string, string> = {
  // ✅ UTM 추적 활성 — 제휴 코드 발급 후 URL을 아래 TODO로 교체
  n8n: utm("https://n8n.io/"),
  // TODO n8n: utm("https://n8n.partnerlinks.io/YOUR_CODE"),

  make: utm("https://www.make.com/"),
  // TODO make: utm("https://www.make.com/en/register?pc=YOUR_CODE"),

  zapier: utm("https://zapier.com/"),
  // TODO zapier: utm("https://zapier.com/?referral=YOUR_CODE"),

  lindy: utm("https://lindy.ai/"),
  "relay-app": utm("https://relay.app/"),
  gumloop: utm("https://gumloop.com/"),
  activepieces: utm("https://www.activepieces.com/"),
  pipedream: utm("https://pipedream.com/"),
  crewai: utm("https://crewai.com/"),
  autogen: utm("https://microsoft.github.io/autogen/"),
  dify: utm("https://dify.ai/"),
  coze: utm("https://www.coze.com/"),
  "relevance-ai": utm("https://relevanceai.com/"),
  "retool-workflows": utm("https://retool.com/products/workflows"),
  kestra: utm("https://kestra.io/"),
  "power-automate": utm("https://powerautomate.microsoft.com/"),
};
