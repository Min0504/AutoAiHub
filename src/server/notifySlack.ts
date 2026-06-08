export type SlackLeadKind = "consulting_proposal" | "consulting_meeting" | "roi_report";

const KIND_LABEL: Record<SlackLeadKind, string> = {
  consulting_proposal: "📋 B2B 견적 기획서",
  consulting_meeting: "🤝 상담 미팅 요청",
  roi_report: "📊 ROI 리포트 신청",
};

export async function notifyNewLead(params: {
  kind: SlackLeadKind;
  leadId: string;
  email: string;
  companyName?: string | null;
  phone?: string | null;
  budget?: string | null;
  needs?: string | null;
}): Promise<void> {
  const webhookUrl = process.env.SLACK_WEBHOOK_URL;
  if (!webhookUrl) return;

  const lines: string[] = [
    `🔔 *새 리드 발생!* — AutoHub AI`,
    `*종류:* ${KIND_LABEL[params.kind]}`,
  ];

  if (params.companyName) lines.push(`*회사명:* ${params.companyName}`);
  lines.push(`*이메일:* ${params.email}`);
  if (params.phone) lines.push(`*연락처:* ${params.phone}`);
  if (params.budget) lines.push(`*예산:* ${params.budget}`);
  if (params.needs) {
    const preview = params.needs.length > 200
      ? `${params.needs.slice(0, 200)}...`
      : params.needs;
    lines.push(`*니즈:* ${preview}`);
  }
  lines.push(`*리드 ID:* \`${params.leadId}\``);
  lines.push(`*시각:* ${new Date().toLocaleString("ko-KR", { timeZone: "Asia/Seoul" })}`);

  try {
    await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: lines.join("\n") }),
    });
  } catch (err) {
    console.error("[Slack] 알림 전송 실패:", err);
  }
}
