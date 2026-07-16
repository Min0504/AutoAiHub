export type PartnerProgramStatus =
  | "active"
  | "ready_to_apply"
  | "needs_manual_confirmation"
  | "deferred";

export type PartnerApplicationDraft = {
  readonly audience: string;
  readonly positioning: string;
  readonly primaryChannels: readonly string[];
  readonly pitch: string;
};

export type PartnerProgram = {
  readonly id: string;
  readonly name: string;
  readonly status: PartnerProgramStatus;
  readonly applyUrl: string;
  readonly publicUrl: string;
  readonly commissionSummary: string;
  readonly priority: number;
  readonly nextAction: string;
  readonly applicationDraft: PartnerApplicationDraft;
  readonly notes: readonly string[];
};

export const PARTNER_PROGRAMS: readonly PartnerProgram[] = [
  {
    id: "dify",
    name: "Dify Affiliate",
    status: "active",
    applyUrl: "https://dify.ai/affiliate-program",
    publicUrl: "https://dify.ai/",
    commissionSummary: "공식 프로그램 기준 30-50% 커미션, 첫 12개월 반복 수익",
    priority: 1,
    nextAction: "기존 발급 링크 성과 추적용 UTM/전환 지표를 확정한다.",
    applicationDraft: {
      audience: "한국어 SMB, 1인 사업자, 사내 자동화 담당자",
      positioning: "AI 앱·RAG·챗봇 구축을 검토하는 사용자를 Dify로 연결하는 한국어 비교 허브",
      primaryChannels: ["AutoHub AI 툴 디렉토리", "SEO 블로그", "AI 상담/견적 플로우"],
      pitch:
        "AutoHub AI는 한국어 업무 자동화 툴 비교와 ROI 계산을 제공하며, Dify가 적합한 AI 앱·문서 Q&A·RAG 도입 수요를 교육형 콘텐츠와 상담 플로우에서 연결합니다.",
    },
    notes: [
      "기존 코드에 Dify 제휴 링크가 존재한다.",
      "handoff의 20% 수치와 현재 공식 페이지의 30-50% 수치가 달라 conductor 확인이 필요하다.",
    ],
  },
  {
    id: "activepieces",
    name: "Activepieces Partner",
    status: "needs_manual_confirmation",
    applyUrl: "https://www.activepieces.com/",
    publicUrl: "https://www.activepieces.com/",
    commissionSummary: "현금 제휴 조건 공식 확인 필요",
    priority: 2,
    nextAction: "공식 파트너/어필리에이트 신청 경로와 현금 커미션 조건을 먼저 확인한다.",
    applicationDraft: {
      audience: "Make 대안과 오픈소스 자동화를 찾는 한국어 사용자",
      positioning: "Activepieces를 Make 대비 오픈소스·자가호스팅 대안으로 소개하는 비교/상담 채널",
      primaryChannels: ["Zapier 대안 콘텐츠", "노코드 자동화 툴 비교", "B2B 컨설팅 리드"],
      pitch:
        "AutoHub AI는 Zapier·Make 대체재를 찾는 한국어 사용자를 대상으로 Activepieces의 오픈소스 자동화 장점을 설명하고, 실제 자동화 구축 상담으로 전환되는 수요를 보유하고 있습니다.",
    },
    notes: [
      "커뮤니티에는 리워드/제휴 논의가 있으나 공식 현금 커미션 페이지 확인이 필요하다.",
      "제휴 코드 발급 전에는 일반 링크만 유지한다.",
    ],
  },
] as const;

export function getPartnerProgram(id: string): PartnerProgram | undefined {
  return PARTNER_PROGRAMS.find((program) => program.id === id);
}
