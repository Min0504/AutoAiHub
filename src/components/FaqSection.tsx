import { useState } from "react";
import { ChevronDown } from "lucide-react";

const FAQS = [
  {
    q: "n8n vs Make, 어떤 자동화 툴을 선택해야 할까요?",
    a: "워크플로우 복잡도와 기술 수준에 따라 다릅니다. n8n은 개발자 친화적이고 자체 서버에 무료로 설치해 무제한으로 사용할 수 있어 대량 자동화에 압도적인 가성비를 자랑합니다. Make(구 Integromat)는 버블 형태의 직관적인 UI로 비개발자도 쉽게 사용할 수 있고, Zapier 대비 5~10배 저렴합니다. 코딩 경험이 있고 비용을 아끼고 싶다면 n8n, 팀 전체가 쉽게 쓰고 싶다면 Make를 추천합니다.",
  },
  {
    q: "Zapier 무료 대안에는 어떤 것들이 있나요?",
    a: "Zapier는 강력하지만 가격이 비싸 대안을 찾는 분들이 많습니다. 대표적인 무료·저가 대안으로는 ① Make (월 1,000 오퍼레이션 무료, 유료도 Zapier 대비 5~10배 저렴), ② n8n (오픈소스, 자체 서버 설치 시 완전 무료), ③ Activepieces (오픈소스, Zapier와 유사한 UI, 온프레미스 가능) 가 있습니다. 연동 앱 수는 Zapier가 7,000개로 최다이지만, 일반적인 업무 자동화라면 Make나 n8n으로 충분히 대체 가능합니다.",
  },
  {
    q: "업무 자동화 시작법: 처음 시작할 때 어떤 툴이 좋을까요?",
    a: "코딩 경험이 없는 초보자라면 Make 또는 Zapier로 시작하는 것을 권장합니다. 두 툴 모두 무료 플랜이 있고, 드래그 앤 드롭으로 자동화를 구성할 수 있습니다. 첫 자동화로는 '구글 폼 제출 → 슬랙 알림', '이메일 첨부파일 → 구글 드라이브 저장' 같은 2단계 자동화부터 시작하면 좋습니다. 개발 경험이 있다면 n8n이 장기적으로 가장 강력한 선택입니다.",
  },
  {
    q: "업무 자동화 도입 시 ROI(투자 대비 수익)는 어떻게 계산하나요?",
    a: "ROI 계산의 핵심은 '절감되는 시간 × 시간당 인건비'입니다. 예를 들어 하루 2시간씩 반복 업무를 처리하는 직원의 시급이 20,000원이라면 월 88만원의 인건비가 낭비됩니다. n8n이나 Make를 도입해 이 업무를 자동화하면 월 툴 비용 2~3만원으로 월 88만원을 절감할 수 있어 ROI가 수천 %에 달합니다. 위의 ROI 계산기 탭에서 정확한 수치를 무료로 계산해볼 수 있습니다.",
  },
  {
    q: "AI 에이전트와 일반 워크플로우 자동화의 차이점은 무엇인가요?",
    a: "워크플로우 자동화(n8n, Make, Zapier)는 '조건 A이면 동작 B를 실행'하는 규칙 기반 자동화입니다. 정해진 흐름대로 정확하게 실행되며 예측 가능합니다. AI 에이전트(CrewAI, Lindy, Dify)는 LLM이 상황을 판단해 스스로 도구를 선택하고 실행하는 자율형 자동화입니다. 예를 들어 '이 이메일을 읽고 중요한 내용을 요약해 슬랙에 보내'처럼 맥락 이해가 필요한 작업에 적합합니다. 대부분의 실무에서는 두 방식을 결합해 사용하는 것이 효과적입니다.",
  },
  {
    q: "사내 데이터 보안이 중요할 때 어떤 자동화 툴을 써야 하나요?",
    a: "고객 개인정보, 금융 데이터, 의료 정보 등 민감한 데이터를 다룬다면 외부 클라우드 SaaS를 통과하지 않는 온프레미스(On-Premise) 설치를 권장합니다. n8n(Self-Hosted), Activepieces(오픈소스), Kestra는 자사 서버나 도커 컨테이너에 직접 설치해 데이터가 외부로 나가지 않게 운영할 수 있습니다. GDPR, 개인정보보호법 준수가 필요한 기업에 특히 적합한 선택입니다.",
  },
  {
    q: "자동화 구축 비용은 얼마나 드나요?",
    a: "툴 구독 비용은 월 0원(무료·오픈소스)부터 수십만 원까지 다양합니다. 간단한 자동화는 Make 무료 플랜($0)이나 n8n 셀프 호스팅(서버 비용 월 5~10달러)으로 시작할 수 있습니다. 복잡한 기업용 자동화 구축을 외주 의뢰할 경우 건당 50~500만원 수준이며, 내부 팀이 직접 구축한다면 툴 사용법 학습 시간(보통 1~2주)이 주된 비용입니다. 장기적으로는 인건비 절감 효과가 초기 구축 비용을 훨씬 상회하는 경우가 대부분입니다.",
  },
];

export default function FaqSection() {
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  return (
    <section className="bg-white rounded-3xl border border-slate-200 p-8 space-y-4">
      <h2 className="text-lg font-black text-slate-900 border-b border-slate-100 pb-3">
        자주 묻는 질문 (FAQ)
      </h2>
      <p className="text-sm font-medium text-slate-500 leading-relaxed">
        AutoHub AI는 메인 페이지 하단에서 <strong>n8n vs Make</strong>, <strong>Zapier 무료 대안</strong>, <strong>업무 자동화 시작법</strong> 같은 핵심 질문을 바로 확인할 수 있도록 정리합니다.
      </p>
      <dl className="space-y-2">
        {FAQS.map((faq, idx) => (
          <div key={idx} className="border border-slate-100 rounded-2xl overflow-hidden">
            <dt>
              <button
                onClick={() => setOpenIdx(openIdx === idx ? null : idx)}
                className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left hover:bg-slate-50 transition-colors"
                aria-expanded={openIdx === idx}
              >
                <span className="text-sm font-bold text-slate-800">{faq.q}</span>
                <ChevronDown
                  className={`w-4 h-4 text-slate-400 flex-shrink-0 transition-transform duration-200 ${openIdx === idx ? "rotate-180" : ""}`}
                />
              </button>
            </dt>
            {openIdx === idx && (
              <dd className="px-5 pb-5 text-sm text-slate-600 font-medium leading-relaxed border-t border-slate-100 pt-4">
                {faq.a}
              </dd>
            )}
          </div>
        ))}
      </dl>
    </section>
  );
}
