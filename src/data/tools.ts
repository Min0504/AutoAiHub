import { AFFILIATE_LINKS } from "../config/affiliateLinks";

export interface Tool {
  id: string;
  name: string;
  slug: string;
  category: "Workflow Automation" | "No-Code Automation" | "AI Agents" | "Developer Automation";
  badge?: string;
  slogan: string;
  logoColor: string; // Tailwind bg color class
  logoTextColor: string; // Tailwind text color class
  priceInfo: string;
  pricingDetails: {
    free: string;
    starter: string;
    pro: string;
    pricingModel: string;
    taskCostFactor: number; // For cost calculator
  };
  difficulty: "쉬움" | "보통" | "어려움";
  difficultyLevel: number; // 1 to 5
  rating: number;
  features: string[];
  pros: string[];
  cons: string[];
  bestFor: string;
  aiIntegration: string;
  affiliateUrl: string;
  alternatives: string[];
}

export const CATEGORIES = [
  { id: "all", name: "전체보기", desc: "모든 자동화 및 AI 에이전트 도구 목록" },
  { id: "Workflow Automation", name: "워크플로우 자동화", desc: "이벤트 기반으로 타사 앱 간 데이터를 연동하는 고급 툴" },
  { id: "No-Code Automation", name: "노코드 자동화", desc: "프로그래밍 지식 없이 마우스 우클릭과 텍스트로 쉬운 비즈니스 자동화" },
  { id: "AI Agents", name: "AI 에이전트 빌더", desc: "스마트 에이전트, RAG, 멀티에이전트를 가동하는 자율 비서" },
  { id: "Developer Automation", name: "개발자 자동화", desc: "코드 제어력이 강하고 API 지향적인 엔지니어 전용 최적 플랫폼" },
];

export const TOOLS: Tool[] = [
  {
    id: "n8n",
    name: "n8n",
    slug: "n8n",
    category: "Workflow Automation",
    badge: "가성비 & AI 최고존엄",
    slogan: "노코드와 코드의 완벽한 조화, 개발자를 위한 페어 플레이 자동화",
    logoColor: "bg-red-500",
    logoTextColor: "text-white",
    priceInfo: "Community self-host 무료 / Cloud Starter €20/월부터",
    pricingDetails: {
      free: "Community Edition self-host로 구동 시 무료. 서버·보안·백업 운영 역량은 필요",
      starter: "Cloud Starter: €20/월, 연간 결제 기준 2,500 workflow executions/월, 단계 무제한",
      pro: "Cloud Pro: €50/월, 연간 결제 기준 10,000 workflow executions/월, 단계 무제한",
      pricingModel: "실행 횟수(Execution) 단위 과금 (워크플로우가 끝까지 실행되는 1회가 비용 1 단위)",
      taskCostFactor: 0.008
    },
    difficulty: "보통",
    difficultyLevel: 3,
    rating: 4.9,
    features: [
      "직접 호스팅 시 무제한 실행이 완전 무료",
      "고성능 LangChain 기반 AI 에이전트 전용 노드 내장",
      "JavaScript, Python 코드 작성 가능",
      "로컬 백업 지원 및 Git 원격 분기 관리 연동",
      "커뮤니티 플러그인 생태계와 400개 이상의 내장 통합형 연결고리"
    ],
    pros: [
      "스텝 수 단위가 아닌 '전체 실행 단위' 청구로 대규모 자동화에 극강의 비용 절감 가능",
      "로컬 Docker 등에 설치하면 인프라 한계까지 무료 무제한 워크플로우 운영 가능",
      "완벽한 개발자 콘트라스트: 시각적 GUI와 인라인 코드 작성 기능의 환상적인 융합",
      "Advanced AI 노드를 탑재해 프롬프트, 메모리, 벡터 DB를 끌어다 놓기만 해도 AI 에이전트 구축 완료"
    ],
    cons: [
      "초기 클라우드가 아닌 직접 호스팅(VPS, AWS, Docker) 적용 단계 시 기본적인 백엔드 지식이 필수",
      "클라우드 에디션은 무료 체험 기간 이후 기본 유료 요금제만 존재",
      "연동된 서드파티 앱 개수가 Zapier에 비해서는 다소 적을 수 있음"
    ],
    bestFor: "비용 부담 없이 대량의 복잡한 비즈니스 자동화를 장기적으로 운영하고 싶은 개발자, 기술 스타트업, AI 엔지니어",
    aiIntegration: "LangChain 생태계를 고스란히 드래그 앤 드롭으로 이식했습니다. OpenAI, Anthropic, Gemini 연결 후 메모리 노드지정, Vector DB(Pinecone 등) 연결을 코딩 한 줄 없이 완벽하게 커스텀 구성 할 수 있어 워크플로우 기반 AI 혁신에 극강의 퍼포먼스를 보입니다.",
    affiliateUrl: "https://n8n.io/",
    alternatives: ["make", "zapier", "activepieces"]
  },
  {
    id: "make",
    name: "Make",
    slug: "make",
    category: "No-Code Automation",
    badge: "가장 아름답고 강력한 뷰어",
    slogan: "동그란 버블을 연결하듯, 세상에서 가장 직관적인 대시보드 오토메이션",
    logoColor: "bg-purple-600",
    logoTextColor: "text-white",
    priceInfo: "기본 무료 / Core $9/월 (10,000 ops)부터",
    pricingDetails: {
      free: "Free Plan: $0 (월 1,000 오퍼레이션 제공, 동시 활성 시나리오 2개)",
      starter: "Core Plan: $9/월 (월 10,000 오퍼레이션 제공, 시나리오 무제한)",
      pro: "Pro Plan: $16/월 (월 10,000 오퍼레이션 + 고급 분석 및 에러 복구 기능)",
      pricingModel: "단계 실행(Operation, Ops) 단위 과금 (노드를 하나 통과할 때마다 1 Ops 차감)",
      taskCostFactor: 0.0009 // $9에 10000 ops = ops당 $0.0009
    },
    difficulty: "보통",
    difficultyLevel: 2,
    rating: 4.8,
    features: [
      "환상적이고 우아한 버블 형태의 무제한 분기 시나리오 빌더",
      "이전 스텝의 실행 이력을 100% 시각적으로 추적하는 실시간 디버거",
      "강력한 데이터 필터링, 정규식 교정 및 배열 구조 처리(Iterator/Aggregator) 도구",
      "안정적이고 빠른 대용량 데이터 전송 인프라",
      "전 세계 거의 모든 필수 비즈니스 소프트웨어 연동 모듈"
    ],
    pros: [
      "엄청나게 수려한 마우스 드래그 기반 UI로 얽히고설킨 멀티 스텝을 예술적으로 묘사",
      "Zapier 대비 약 5~10배 저렴한 압도적 가성비의 요금 테이블",
      "과거 어느 부분에서 에러가 발생했는지 로그와 데이터를 한눈에 대조해 디버깅하는 능력이 1위"
    ],
    cons: [
      "루프를 많이 도는 긴 워크플로우의 경우 Operation(Ops) 소비 가속화로 급격한 추가 청구가 생길 위험",
      "Array/Collection 등 개발적 요소에 해당되는 개념(Iterator, Aggregator)을 능숙하게 다루려면 약간의 공부 필요"
    ],
    bestFor: "비즈니스 기획자, 마케터, 개인 사업자 중 Zapier가 지나치게 비싸 가성비 대체재를 찾으면서 정교함을 놓치고 싶지 않은 분",
    aiIntegration: "OpenAI, Anthropic 등 주요 AI 노드를 완벽히 커버합니다. PDF Parsing, AI 이미지 프로세싱, 텍스트 요약을 손쉽게 다단계 흐름에 주입할 수 있으며 가동 피드백이 시각적으로 명확해 AI API 결과값을 정밀 조율하기 편합니다.",
    affiliateUrl: "https://www.make.com/",
    alternatives: ["n8n", "zapier", "relay"]
  },
  {
    id: "zapier",
    name: "Zapier",
    slug: "zapier",
    category: "No-Code Automation",
    badge: "원조 1위 / 막강한 앱 연동수",
    slogan: "쉽고 간결하게 모든 것을 자동화, No-Code 오토메이션의 글로벌 표준",
    logoColor: "bg-orange-500",
    logoTextColor: "text-white",
    priceInfo: "기본 무료 / Starter $19.99/월 (750 tasks)부터",
    pricingDetails: {
      free: "Free Plan: $0 (월 100 태스크, 기본 2단계 워크플로우 한정)",
      starter: "Starter Plan: $19.99/월 (월 750 태스크, 프리미엄 앱 사용 제한)",
      pro: "Professional: $49/월 (월 2,000 태스크, 무제한 조건부 분기 logic, 자동 실패 복구)",
      pricingModel: "태스크 완료(Task) 단위 과금 (트리거를 만족한 후 실제 후속 작동 완료 수 기준)",
      taskCostFactor: 0.024 // $49에 2000 tasks = task당 $0.0245 (매우 비쌈)
    },
    difficulty: "쉬움",
    difficultyLevel: 1,
    rating: 4.7,
    features: [
      "7,000개 이상의 압도적인 글로벌 서드파티 앱 공식 지원 리스트",
      "자연어 질문으로 Zap(자동화)을 설계하는 최신 AI Copilot 탑재",
      "자체적인 간이 데이터베이스 기능인 'Zapier Tables' 제공",
      "웹폼 생성 도구인 'Zapier Interfaces' 통합 서비스",
      "완전 가이드형 웹 기반 사용자 흐름"
    ],
    pros: [
      "노드가 단순하고 논리가 매우 평이해서 중학생도 15분 만에 워크플로우를 생성할 가능성",
      "현존 플랫폼 중 연동 앱 수 1위. 마이너한 소규모 SaaS나 스타트업 전용 사설 API 모듈도 Zapier에는 기본 배치되어 있음",
      "안전성과 기업 보안 신뢰도가 세계에서 가장 검증됨"
    ],
    cons: [
      "감히 맞서기 힘든 무시무시하게 비싼 단가. 트래픽이나 복잡한 동적 액션이 조금만 늘어나도 매월 수백 달러 폭탄 가능성",
      "경쟁사 대비 정밀하고 유연한 코딩적 배열 가공(Data parsing) 분기가 제약적임"
    ],
    bestFor: "코딩이나 복잡한 툴 공부 시간이 बिल्कुल(전혀) 없으며, 오직 1등 검증된 인프라에서 수천 권의 리스트를 편하게 이어 붙이고 싶은 대기업 및 HR 부서, 1인 창업가",
    aiIntegration: "AI 기틀이 잘 마련되어 있습니다. 'AI Copilot'이 워크플로우를 한 문장의 요청만으로 뚝딱 구성해주고, GPT-4o를 이용한 챗봇 임베드 및 사내 데이터 요약 도구를 클릭 세 번으로 탑재하는 특혜를 지녔습니다.",
    affiliateUrl: "https://zapier.com/",
    alternatives: ["make", "n8n", "relay"]
  },
  {
    id: "lindy",
    name: "Lindy",
    slug: "lindy",
    category: "AI Agents",
    badge: "핫이슈 / 자율형 AI 직원",
    slogan: "텍스트 입력만으로 이메일을 보내고 회의를 예약하며, 업무를 수행하는 AI 동료생성",
    logoColor: "bg-teal-700",
    logoTextColor: "text-white",
    priceInfo: "기본 크레딧 무료 체험 / 월 $29부터 (크레딧 충전형)",
    pricingDetails: {
      free: "가입 시 기본 무료 토큰 크레딧 한시적 제공",
      starter: "Starter: $29/월 (기본 AI 에이전트 액티브 가동 및 충분한 크레딧)",
      pro: "Pro Plan: $99/월 (팀 도메인 연동 및 고속 무제한 태스크 수행)",
      pricingModel: "에이전트 수 및 백엔드 LLM 추론 토큰(Credit) 소모량 형태 과금",
      taskCostFactor: 0.01 // 추론 당 대략 $0.01
    },
    difficulty: "쉬움",
    difficultyLevel: 1,
    rating: 4.6,
    features: [
      "자연어 명령(영문/국문)에 기초한 자율 소통 기반 에이전트 생성",
      "이용자 메일박스, 전산 Calendar, G-Suite, Slack 완전 귀속",
      "정해진 시간이 오거나 특정 트리거 감지 시 자율 조건 판단 후 회신 발송",
      "커스텀 지식 DB 업로드로 똑똑한 의사 정렬",
      "심플한 모니터링 모드"
    ],
    pros: [
      "전통적 블록 다이어그램 순서도가 불필요함. '내 마케팅 비서가 되어 매일 아침 구글 시트에서 최신 기사를 찾아서...' 라고 편지 쓰듯 설명하면 업무 즉시 조달",
      "복잡한 서드파티 API Webhook 구문을 내부 AI가 알아서 매개 변수 변환해 수행함",
      "화면 레이아웃이 깔끔한 직원 명부 관리처럼 생겨서 친근함"
    ],
    cons: [
      "AI 자율 추론에 의지하므로 정형화된 루틴 자동화 시 100% 정교한 예외 처리가 가끔 빗나갈 염려(Hallucination 리스크)",
      "영어 언어 분석에서 가장 완벽하게 활동하며, 복잡한 한국 비즈니스 뉘앙스 매칭 시 데이터 정밀 검수 필요"
    ],
    bestFor: "전형적인 매뉴얼 노코드 블록 연결조차 머리가 아픈 비디자이너, AI가 똑똑하게 이메일 고객 응대나 시장 정보 브리핑을 알아서 큐레이션 하길 바라는 1인 기업",
    aiIntegration: "태생이 'LLM 자율 주행' 에이전트입니다. 정해진 단계대로 물 흐르듯 가기보단 '상황에 따라 다른 API를 호출하고 임의로 메일을 써서 수신자에게 보내는' 상위 자율지능을 결합했습니다.",
    affiliateUrl: "https://lindy.ai/",
    alternatives: ["crewai", "gumloop", "relay"]
  },
  {
    id: "relay-app",
    name: "Relay.app",
    slug: "relay",
    category: "No-Code Automation",
    badge: "인간 개입(Human-In-The-Loop)",
    slogan: "가장 협업다운 자동화, 인간의 승인 절차를 자연스럽게 담은 워크플로우",
    logoColor: "bg-slate-900",
    logoTextColor: "text-white",
    priceInfo: "기본 무료 / Starter $9/월 (1,000 runs)부터",
    pricingDetails: {
      free: "Free: $0 (월 100 runs 무료 탑재, 무제한 원클립 멤버 공동 협업)",
      starter: "Starter: $9/월 (월 1,000 runs 제공, 프리미엄 노드 전원 개방)",
      pro: "Team: $29/월 (월 3,000 runs 제공, 다자 승인 워크플로우 기능 추가)",
      pricingModel: "성공적으로 완수된 워크플로우 통과 호출(Run) 단위 과금 (매우 가성비 높음)",
      taskCostFactor: 0.009 // $9에 1000 Runs = run당 $0.009
    },
    difficulty: "쉬움",
    difficultyLevel: 1,
    rating: 4.8,
    features: [
      "중간에 승인권자 버튼 클릭을 기다리는 'Human-in-the-Loop' 전용 슬롯 기능",
      "여러 계정 연동을 한 번에 통합해서 굴리는 멀티 테넌트 메일 가속",
      "심플하고 정갈한 원컬러 미니멀리스트 노코드 웹 디자인",
      "노코드 초짜 마케터를 위해 에러를 자동 포착해 임시 멈추는 세이프가드",
      "최상의 노션 및 구글 워크스페이스 동반 호환성"
    ],
    pros: [
      "자동화 가동 중 '중요 결제 요청서는 대표의 확인 버튼 클릭을 대기한 뒤 Slack 발송' 하는 하이브리드 자동화의 절대 지배자",
      "수천 번의 세부 블록을 거쳐도 단 1번의 런(Run)으로 합산되어 빌링 관리 부담이 엄청나게 소박함",
      "인터페이스 디자인이 최근 트렌드에 맞는 감도 높은 현대식 컴포넌트라 시야가 무척 편안함"
    ],
    cons: [
      "SaaS 연결 풀이 대장급 3사(Zapier, Make, n8n)만큼 널리 퍼지지는 않아 비주류 외부 국산 패키지 수동 API 연동이 피곤함",
      "오랫동안 고도화된 정밀 루프(Iterator loop) 및 DB 핸들링을 아주 넓게 굴리긴 단순함"
    ],
    bestFor: "자동화의 급격한 오류 폭주를 막기 위해 사람이 '최종 결제 승인' 및 '메일 내용 검수'한 후 다음 자동화를 재개하는 다단계 사무 프로세스를 지향하는 팀",
    aiIntegration: "AI Copilot 메커니즘을 내장해 드래그 앤 드롭 단계 사이에 'AI 요약문 검수' 마커를 얹고, 승인 요원이 검토한 다음 API로 이어서 올리는 흐름을 무척 정갈하게 해결합니다.",
    affiliateUrl: "https://relay.app/",
    alternatives: ["make", "zapier", "lindy"]
  },
  {
    id: "gumloop",
    name: "Gumloop",
    slug: "gumloop",
    category: "AI Agents",
    badge: "웹 크롤링 & AI 혁신",
    slogan: "웹 크롤링과 데이터 파이프라인의 종결자, 강력한 AI 엔지니어링의 노코드 이식",
    logoColor: "bg-blue-600",
    logoTextColor: "text-white",
    priceInfo: "기본 무제한 무료 가입 / $25/월부터 (크레딧 패키지)",
    pricingDetails: {
      free: "Free Plan: 기본 무료 크레딧 제공, 브라우저 상의 직접 간이 파싱 테스트 가능",
      starter: "Starter: $25/월 (자체 클라우드 크롤링 백엔드 배용 크레딧 두둑히 공급)",
      pro: "Growth: $150/월 (API 전용 앤드포인트 배포 및 동시 웹 스크래핑 대량 실행 가속)",
      pricingModel: "크랩/LLM 추론 복잡도 대비 수치로 산출되는 Credit 차감 과금",
      taskCostFactor: 0.015 // 전처리 루틴당 약 $0.015
    },
    difficulty: "보통",
    difficultyLevel: 3,
    rating: 4.9,
    features: [
      "구글 검색 결과 통째 긁어 가공하기 전용 고성능 Scraper 노드",
      "LLM에 수천 페이지 문서를 넘겨 필요 데이터만 JSON 표로 뽑는 특화 추출 엔진",
      "크롬 확장프로그램과의 긴밀한 데스크톱 행위 제어 동조",
      "동시 다중 처리(Parallel Execution)를 매핑하는 파인 튜닝 맵 노드",
      "에이전트가 수행한 인터넷 웹 서치 스텝 로그 추적기"
    ],
    pros: [
      "인터넷의 일반 뉴스를 긁어 요약본을 뽑거나 특정 사이트 쇼핑몰 신제품을 실시간 표로 추리는데 현존 가장 탁월하고 빠름",
      "노코드인데도 '데이터 크롤러 + OpenAI 파싱' 구조를 단 2개의 블록으로 완성시켜 노가다 공수 99% 삭감 가능",
      "유료 프록시나 캡차(Captcha) 우회 같은 기법들이 브라우저 노드에 내재되어 있어 크롤링 차단 대응 우수"
    ],
    cons: [
      "단순 사무용 사내 이메일 연결 같은 전형적인 ERP 연동에는 Zapier보다 세팅 직관성이 살짝 투박함",
      "크레딧 정밀 소모 계산을 브라우징 횟수 및 텍스트 글자 크기로 대입해야 해서 직관적인 요금 예측이 초반엔 모호함"
    ],
    bestFor: "경쟁사 트렌드 감시, 일일 주식 보고서 크롤링 요약, 콜드 메일 발송용 잠재고객 DB 수집 등 '웹 정보 긁기 + AI 가공' 결합을 다루는 마케터 및 성장 데이터 전문가",
    aiIntegration: "AI 스크래핑에 집중화되어 있습니다. 크롤링한 웹문서가 수천 자에 달해도 GPT-4, Gemini Pro 등을 매끄럽게 교차 호출해 원스톱으로 원하는 JSON Schema 규격서 포맷으로 오목조목 정렬해 뱉어내는데 독성적인 우위를 점합니다.",
    affiliateUrl: "https://gumloop.com/",
    alternatives: ["lindy", "n8n", "pipedream"]
  },
  {
    id: "activepieces",
    name: "Activepieces",
    slug: "activepieces",
    category: "Workflow Automation",
    badge: "오픈소스 Zapier 최강자",
    slogan: "비공개 보안 및 온프레미스를 위한 깔끔한 오픈소스 워크플로우 플랫폼",
    logoColor: "bg-emerald-600",
    logoTextColor: "text-white",
    priceInfo: "GitHub 완전 무료 / Cloud $15/월부터",
    pricingDetails: {
      free: "Self-Host Open-Source: GitHub를 통해 다운로드 및 전원 로컬 구동 시 완벽 무료",
      starter: "Cloud Starter: $15/월 (월 1,000 tasks 제공 및 글로벌 프리미엄 라이선스 오픈)",
      pro: "Cloud Pro: $49/월 (월 5,000 tasks 및 협업 Workspace 권한 공유)",
      pricingModel: "단계 통과 횟수(Task) 단위 과금 (Self-Host는 제한 없음)",
      taskCostFactor: 0.015 // task당 약 $0.015
    },
    difficulty: "쉬움",
    difficultyLevel: 2,
    rating: 4.6,
    features: [
      "GitHub 10k+ 스타를 달성한 깔끔하고 진보된 디자인 코드베이스",
      "TypeScript 코드로 손쉽게 커스텀 컴포넌트를 확장 작성하는 SDK 도구",
      "유럽 GDPR 및 강력한 사내 데이터 보안 규정 대응 (On-Premise 인프라)",
      "초고속 초경량 배포용 Node.js 엔진 탑재",
      "매달 활발하게 풀링되는 전 세계 오픈 커뮤니티"
    ],
    pros: [
      "Zapier와 정말 똑같이 생겼는데 소스코드가 오픈되어 자유롭게 회사 네트워크에 빌드 가능",
      "대시보드가 극단적으로 깔끔해서 노코드 입문자가 적응하는 시간 단 5분",
      "타 플랫폼 대비 컨테이너가 무척 가벼워 VPS $5짜리 엔트리 서버에서도 가뜬히 가동 가능"
    ],
    cons: [
      "오픈소스 빌드이다 보니, 오랜 연사의 경쟁작(Make, n8n)에 비해 외부 플러그인 모듈 수량의 밀도가 다소 얇음",
      "클라우드 웹 전용 티어가 제공하는 요율 및 성능 한계가 대용량 데이터 매퍼 단계에서 아직 조금 단순함"
    ],
    bestFor: "고객 개인정보나 금융 거래 이력이 절대 외부 해외 클라우드 SaaS 서버로 빠져나가면 안 되어 사내 온프레미스 서버에 자동화 시스템을 폐쇄망으로 가두고 싶은 보안 기업 및 IT 연구원",
    aiIntegration: "깔끔하고 세련된 OpenAI 및 Anthropic 기본 컴포넌트들을 빌려와 텍스트 유효성 판별이나 비정형 데이터 추출을 자사 전용 AI 보안 모델과 믹싱해 독립 운영하는 구성에 최고로 일조합니다.",
    affiliateUrl: "https://www.activepieces.com/",
    alternatives: ["n8n", "make", "zapier"]
  },
  {
    id: "pipedream",
    name: "Pipedream",
    slug: "pipedream",
    category: "Developer Automation",
    badge: "개발자용 API 통합 허브",
    slogan: "서버리스 코드 기반의 API 통합, 코드 친화적인 초고속 서버리스 레고 워크스페이스",
    logoColor: "bg-green-700",
    logoTextColor: "text-white",
    priceInfo: "기본 무료 / Starter $19/월 (5,000 credits)부터",
    pricingDetails: {
      free: "Free Plan: 1일 333 크레딧 할당 무료 제공 (동시에 여러 워크플로우 활성 가능)",
      starter: "Starter: $19/월 (월 5,000 Credits, 30초 런타임 제한으로 강화)",
      pro: "Advanced: $49/월 (월 20,000 Credits, 최대 120초 런타임 및 무제한 메모리 확장)",
      pricingModel: "크레딧(Credit) 시스템으로 동작 (워크플로우 1회 완수 및 Node/Python 코드 분기에 따라 청구)",
      taskCostFactor: 0.0038 // $19 / 5000 = $0.0038 per credit
    },
    difficulty: "어려움",
    difficultyLevel: 4,
    rating: 4.8,
    features: [
      "Node.js, Python, Golang, Bash 코딩 자체를 내부에 직접 삽입하고 인라인 패키지 자동 설치",
      "다중 API 연동용 OAuth 2.0 사용자 토큰 관리 복잡성 100% 원클릭 간편 대행",
      "초고성능 Webhook 데이터 실시간 인제스트 & 모니터링 수거",
      "대용량 수신 이벤트 큐 에이징 및 조절(Rate limit, Throttle) 제어 장치",
      "서버리스 함수(Serverless Functions) 인프라리스 배포"
    ],
    pros: [
      "코딩 능력을 갖춘 엔지니어라면, 복잡한 공식 SDK 설치 없이 'npm install 이나 import'를 코드 몇 줄 쓰면 Pipedream이 알아서 0.5초 만에 실행 환경을 할당함",
      "OAuth 연동 대행 덕에 타사 수십 개 API 계정의 권한 갱신 신경을 아예 안 써도 무한 갱신",
      "클라우드 전용 API 빌더 생태계 중 단위 속도와 데이터 트랜잭션 오버헤드가 극히 얇아 쾌적함"
    ],
    cons: [
      "코드가 최소 한 줄이라도 들어가야 진가를 발휘하므로, 완전 No-Code를 지향하는 마케터나 비개발자 기획자들에게는 검은색 코드 에디터 화면에 압박이 큼",
      "복잡한 트리 구조 데이터를 GUI 화살표 드래그로만 매칭하긴 약간 타이핑 친화적인 편"
    ],
    bestFor: "일단 코딩을 할 수 있으나 인프라 관리나 OAuth 연합, 실시간 Webhook 서버 파이프라인 개발이 매번 귀찮아서 '스마트 캐시 레이어'처럼 고속 연동하고 싶은 백엔드 & 풀스택 웹 개발자",
    aiIntegration: "코드 기반 AI 활용에 최고입니다. 자체 Node.js 블록에 OpenAI, Gemini SDK 패키지를 직관적으로 올려 복잡한 정규식, Dynamic JSON Generation 스키마에 즉석 주입하고 후속 DB 액션을 순식간에 커스텀 코드로 엮어 가동합니다.",
    affiliateUrl: "https://pipedream.com/",
    alternatives: ["n8n", "gumloop", "crewai"]
  },
  {
    id: "crewai",
    name: "CrewAI",
    slug: "crewai",
    category: "AI Agents",
    badge: "멀티 에이전트 표준 프레임워크",
    slogan: "역할 분담형 멀티 AI 에이전트의 오케스트레이션, 사내 가상 AI 팀을 구현하는 기술 혁신",
    logoColor: "bg-red-950",
    logoTextColor: "text-white",
    priceInfo: "오픈소스 완전 무료 / CrewAI Enterprise 별도 문의",
    pricingDetails: {
      free: "Open-Source Python Framework: 완전 무료 제공 (로컬 LLM 혹은 자사 API Key 소모)",
      starter: "CrewAI Enterprise / Cloud Host: 정식 출시 예정 및 API 호출에 맞춘 크레딧 스레스홀드",
      pro: "대기업 특화 사설 격리 클라우드 협상형 커스텀 빌링 시스템",
      pricingModel: "로컬에서 실행은 100% 무료. LLM 서비스 호출 시 OpenAI/Anthropic/Gemini에 지불하는 API 토큰 요금이 주과금",
      taskCostFactor: 0.02 // 에이전트 추론 당 평균 소모비 대략 산출
    },
    difficulty: "어려움",
    difficultyLevel: 5,
    rating: 4.8,
    features: [
      "기획자(Planner), 작가(Writer), 검수자(Critique) 등 인공지능에 '역할(Role)'을 명확히 정의하는 롤 베이스 아키텍처",
      "에이전트끼리 서로 작업물을 공유하고 중간 피드백을 주고받는 '순차/동적 합의 알고리즘'",
      "문서 검색, 웹 브라우징, 데이터 분석 코드 실행 등 에이전트가 쓰는 다양한 '도구(Tools/Tooling)' 매칭 가이드",
      "Python 프레임워크 기반의 완벽한 코드 정의 방식",
      "CrewAI Crew, Task, Agent 모듈 기반의 정밀 클래스 제공"
    ],
    pros: [
      "동작이 매우 유기적이어서 사람이 직접 개입을 반복 안 해도 '리서처가 트렌드 조사 후 결과를 넘겨서 카피라이터가 블로그 글을 가안 작성한 뒤, 에디터가 윤문해 승인'하는 AI 에이전트 상호작용 체인이 100% 자동 운전됨",
      "오픈소스 라이브러리라 파이썬만 다룰 줄 안다면 비용 제한과 사설 구조 제약을 아예 탈피함",
      "최근 실리콘밸리에서 AI 에이전트 상용 프로젝트 구현 시 가장 검증받는 메이저 라이브러리"
    ],
    cons: [
      "시각적 노코드 워크플로우 대시보드가 공식 제공되지 않아 파이썬 터미널 로그를 노려보며 코딩 및 상태 디버깅을 실행해야 함",
      "LLM 통신을 연속해서 다발적으로 주고 받기 때문에, 잘못 가동할 경우 순식간에 API 백엔드 요금 폭탄이 터질 우려가 다분함(Infinite loops 리스크)"
    ],
    bestFor: "AI 에이전트 간의 정형화된 시퀀셜 협업 구조를 직접 Python 소스코드로 정밀 제어하면서 고차원 RAG 비즈니스 인텔리전스를 빌드하려는 소프트웨어 엔지니어 및 AI 테크 스타트업",
    aiIntegration: "그 자체가 완벽한 'AI 에이전트 협업 생태계'입니다. 모델별 파라미터 튜닝은 물론, 개별 역할부여(Persona)와 메모리 관리 기법들을 복합 설계하여 업무 완성도를 일반 챗봇 대비 5배 이상 높은 지점으로 끌어올립니다.",
    affiliateUrl: "https://crewai.com/",
    alternatives: ["autogen", "lindy", "gumloop"]
  },
  {
    id: "autogen",
    name: "AutoGen",
    slug: "autogen",
    category: "Developer Automation",
    badge: "Microsoft AI 프로젝트",
    slogan: "자율적으로 대화하는 커스텀 에이전트들의 향연, 무한 확장 가능한 차세대 멀티에이전트",
    logoColor: "bg-sky-700",
    logoTextColor: "text-white",
    priceInfo: "GitHub 완전 무료 오픈소스",
    pricingDetails: {
      free: "MIT 라이선스 기반의 완전 무료 오픈소스 프로젝트",
      starter: "별도 요금제 없음, 기업 자체 호스팅(Azure, AWS, 온프레미스 Docker) 구동",
      pro: "대기업 전용 Azure AI 인프라 연계 통합 빌링 구성",
      pricingModel: "소프트웨어 사용 비용 무료, LLM API 호출 토큰 및 인프라 서버 비용만 별도 발생",
      taskCostFactor: 0.025 // LLM 복합 연동 시 대략 계산
    },
    difficulty: "어려움",
    difficultyLevel: 5,
    rating: 4.7,
    features: [
      "에이전트들이 서로 대화를 주고 받으면서 주체적으로 오류를 수정하고 소스 코드를 생성/실행하는 대화형 에이전트 패턴",
      "사용자가 대화 도중에 즉석 개입하거나 에이전트의 결정에 간섭할 수 있는 높은 인간 상호성",
      "에이전트가 생성한 파이썬 코드를 샌드박스(Docker 등) 속에서 실시간 통제하며 원클릭 자율 실행하는 코드 인터프리터 탑재",
      "멀티 모델 하이브리드 지원 (GPT, Gemini, Anthropic 뿐 아니라 로컬 LLM 복합 탑재 가능)",
      "Microsoft의 묵직한 오리지널 클라우드 연구 기반 신뢰도"
    ],
    pros: [
      "코딩 문제를 마주했을 때 AI 개발자 에이전트와 AI QA 테스터 에이전트가 단말기 터미널에서 버그가 사라질 때까지 수차례 서로 소스코드를 고치고 돌려보는 자율 버그 디버깅 시스템 구축 시 압도적 1위",
      "매우 고난도이며 구조가 동적이어서, 어떤 경로를 밟을지 미리 그릴 수 없지만 최종 목적지를 알려주면 찾아가게 만드는데 유용",
      "온프레미스 격리 실행이 완벽 보장되는 샌드박스 코딩 런타임 제어권 확보"
    ],
    cons: [
      "파이썬 기초 레벨이 아니라 정형 멀티-스레딩, 비동기 네트워킹 등의 개발자적 배경이 탄탄해야 아키텍처 디자인이 수월할 만큼 진입 계단이 몹시 가파르고 높음",
      "상용 백엔드 운영을 위해 자체 도커 시스템 연계 등의 시스템 유지 보수 인프라 작업 지분이 큼"
    ],
    bestFor: "인공지능의 자율 코드 생성 및 실행 샌드박스 기능이 절대적으로 담겨야 하며, 복잡하고 유동적인 AI 기반 지능형 연구 플랫폼 및 다이나믹 대화형 시뮬레이터를 개발하려 하는 전문 수석 엔지니어",
    aiIntegration: "AI 연동성의 극한점입니다. GPT, Gemini 등 상용 고지능 하이브리드 세팅 과 로컬 오프라인 사내 거대 멀티 모델(Llama 등)을 한 팀으로 결성시켜 로직 조율과 에이전트 대화 오케스트라를 정수 수준으로 펼쳐냅니다.",
    affiliateUrl: "https://microsoft.github.io/autogen/",
    alternatives: ["crewai", "pipedream", "lindy"]
  },
  {
    id: "dify",
    name: "Dify",
    slug: "dify",
    category: "AI Agents",
    badge: "최고의 오픈소스 LLM 플랫폼",
    slogan: "RAG, 프롬프트 엔지니어링, 에이전트 워크플로우를 아우르는 오픈소스 LLM 빌더의 표준",
    logoColor: "bg-blue-500",
    logoTextColor: "text-white",
    priceInfo: "Self-Host 무료 / Cloud Sandbox 기본 무료",
    pricingDetails: {
      free: "Self-Hosted로 설치 시 완전 무료, Cloud Sandbox: 월 200회 호출 무료",
      starter: "Cloud Basic: $59.99/월 (연동 메시지 및 고성능 인덱싱 추가 제공)",
      pro: "Cloud Professional: $179.99/월 (강력한 전용 벡터 DB 및 RAG 데이터 보존)",
      pricingModel: "Cloud 모델은 활성 에이전트 수 및 백엔드 지식 스토리지 크기 기준 과금 (로컬 시 인프라 비용만 발생)",
      taskCostFactor: 0.005
    },
    difficulty: "보통",
    difficultyLevel: 3,
    rating: 4.9,
    features: [
      "시각적이고 직관적인 LLM 워크플로우 캔버스",
      "웹사이트, PDF 파일, 데이터베이스 연동 RAG(검색 증강 생성) 원클릭 셋업",
      "OpenAI, Anthropic, Gemini, 로컬 LLM 등 40종 이상의 모델 커넥터 기본 지원",
      "에이전트가 호출할 외부 API와 플러그인을 깔끔하게 관리하는 툴허브",
      "완성된 챗봇을 웹사이트에 바로 삽입 가능한 Widget 임베드 및 API endpoint 제공"
    ],
    pros: [
      "RAG 빌드 시 텍스트 파싱, 청킹(Chunking), 임베딩, 검색(Retrieval) 과정이 완전 자동화로 설계 편의 도발",
      "코딩과 노코드 양쪽 요구를 완벽 수렴하여 복잡한 LangChain 파이썬 코딩을 극도로 아름다운 드래그 흐름으로 표현",
      "사설 서버 구축인 로컬 호스팅이 지원되므로 기술 유출 걱정 없이 안전한 사내 비서망 구상 실현"
    ],
    cons: [
      "순수한 일반 웹 스크래핑이나 ERP 연동보다는 거대 언어 모델(LLM)을 활용한 RAG 및 인지 에이전트 편향적 설계",
      "클라우드 요금제가 비교적 가격대가 높아 스타트업에서 수동 백엔드 구축 없이 쓰기엔 초기 지출 필요"
    ],
    bestFor: "사내 데이터(노션, PDF, 위키)가 많아 임직원용 커스텀 RAG 챗봇 및 업무 도우미 에이전트를 저렴하고 세력 있게 빌드해 사내 웹사이트에 즉시 이식하고 싶은 테크 기반 중소/중견기업",
    aiIntegration: "Dify는 AI 그 자체에 초점을 맞추고 탄생했습니다. 프롬프트 에디터, 시스템 지시사항 조절, 멀티 라운드 히스토리 및 RAG 하이브리드 검색 설정을 클릭 몇 번으로 완수하여 고도화된 AI 맞춤 에이전트를 직관적으로 배포할 수 있습니다.",
    affiliateUrl: "https://dify.ai/",
    alternatives: ["coze", "crewai", "lindy"]
  },
  {
    id: "coze",
    name: "Coze",
    slug: "coze",
    category: "AI Agents",
    badge: "글로벌 엔터프라이즈 LLM 빌더",
    slogan: "아이디어부터 상용 서비스 배포까지, 단 5분 만에 구축하는 엔터프라이즈급 AI 비서 배포 플랫폼",
    logoColor: "bg-indigo-900",
    logoTextColor: "text-indigo-100",
    priceInfo: "기본 기능 무료 체험 / 프리미엄 모델 크레딧 소모형",
    pricingDetails: {
      free: "Coze Free: 월 한정 런타임 크레딧 무료 분배, Discord/Telegram 등 무제한 무료 연동",
      starter: "Premium Plan: $19/월 (최신 상용 모델 우선 추론 크레딧 및 커스텀 도메인 매핑)",
      pro: "Enterprise: 별도 문의 (SLA 보장, 백엔드 프라이빗 클라우드 구축, 대량 세그먼트 전산망)",
      pricingModel: "기본 배포 채널 자체는 무료이나 프리미엄 LLM 추론 시 크레딧(Credit/Token) 가감제 차등 적용",
      taskCostFactor: 0.008
    },
    difficulty: "쉬움",
    difficultyLevel: 2,
    rating: 4.8,
    features: [
      "마우스 클릭만으로 Discord, Telegram, Whatsapp, Slack 연동 채널 원클릭 퍼블리시",
      "수천 개의 타사 플러그인(Google Search, CapCut 등 크리에이티브 포함) API 원클릭 조합",
      "에이전트에게 전용 장기 기억(Memory Bank) 및 커스텀 테이블 구조 DB 제공",
      "정해진 시간이 되면 알아서 작동하여 결과를 요약 보고하는 오토-트리거 스케줄러",
      "다자 에이전트(Multi-agent)간에 턴(Turn)을 분리 수당하는 고급 연출"
    ],
    pros: [
      "인터페이스 구성이 기획자 친화적이라 왼쪽엔 페르소나 설정, 중앙엔 데이터베이스 링크, 오른쪽엔 실시간 플레이그라운드가 한눈에 잡힘",
      "인터넷 서칭과 비정형 PDF 요약 같은 필수 태스크를 기본 내장 플러그인으로 한 줄 코딩 없이 정갈히 완수",
      "매우 강력하고 독보적인 멀티에이전트 모듈 탑재로 여러 AI의 자율 대화 체인 생산이 최고수준"
    ],
    cons: [
      "사내 온프레미스(On-premise) 설치가 불가능해 외부에 보안 데이터를 노출하지 못하는 금융/대기업에서는 제약적",
      "ByteDance 클라우드 환경에 의존적이므로 국내 로컬 기업의 ERP 전산 연동 시 네트워크 연동 게이트웨이 추가 설정 필요"
    ],
    bestFor: "자체 비즈니스 앱이나 소셜 미디어(디스코드, 슬랙, 카카오톡 대체) 메신저 환경에 1등급 지능을 가진 AI 챗봇 비서를 가장 짧은 시간에 멋지게 심어 마케팅/CS를 자동화하려는 기획팀 및 마케터",
    aiIntegration: "최신 플러그인 연계 능력이 세계 1위 수준입니다. 플러그인 허브에서 'Google Search', 'DALL-E 3', 'Translation' 등을 장바구니 담듯 더한 후 에이전트에게 지정하면 사내 지식 DB와 인터넷 검색 결과를 자동으로 비교 추론하여 풍부한 답안을 산출합니다.",
    affiliateUrl: "https://www.coze.com/",
    alternatives: ["dify", "lindy", "crewai"]
  },
  {
    id: "relevance-ai",
    name: "Relevance AI",
    slug: "relevance-ai",
    category: "AI Agents",
    badge: "디지털 AI 임직원 아웃소싱",
    slogan: "가상 AI 임직원을 정교하게 설계하고 가동하는 노코드 기업용 에이전트 인프라",
    logoColor: "bg-amber-600",
    logoTextColor: "text-white",
    priceInfo: "Free 체험판 / Starter $19/월부터",
    pricingDetails: {
      free: "Free trial: 월 100 런(Runs) 무료 테스트, 에이전트 3인까지 생성 가능",
      starter: "Starter: $19/월 (월 2,000 runs, 동시 다중 태스크 처리, 무제한 스토리지)",
      pro: "Business: $199/월 (AI 사원 무제한 고용, 고성능 RAG 병렬 백엔드)",
      pricingModel: "고용한 'AI 직원(Agent)' 수 및 이메일 수신, 크롤링 등의 백그라운드 태스크 완수 횟수 비례 과금",
      taskCostFactor: 0.01
    },
    difficulty: "보통",
    difficultyLevel: 3,
    rating: 4.7,
    features: [
      "기획, 영업, 리서치 전용 맞춤 페르소나 및 기능 탑재 가상 직원 상시 가동",
      "이메일 첨부파일 분석, PDF 데이터 표 추출, 잠재고객 콜드 메일 개인화 원스톱 대행",
      "HubSpot, Salesforce, Notion 등 글로벌 CRM 생태계와 긴밀한 다이렉트 바인딩",
      "B2B 잠재고객 자동 발굴 및 자동 링크드인 메시징 자동화 모듈",
      "실행 도중 예외가 발생할 경우 사정에 맞춰 사람 직원에게 검수받는 승인 시스템"
    ],
    pros: [
      "구성이 '사무 자동화'와 'B2B 마케팅/영업'에 전면 최적화되어 기업의 생산성을 정량적인 성과로 연결하기 쉬움",
      "RAG 파일 임베딩 속도가 어마어마하게 빠르며 고질적인 오류 상황을 처리하는 복구 속도가 빼어남",
      "각 시각화 단계마다 어떤 에이전트가 무슨 행동(Tool use)을 했는지 친절하게 대시보드로 보고서화 추진"
    ],
    cons: [
      "모든 빌링과 세팅 인터페이스가 완벽한 영문 기반이어서 노코드 입문 단계 한국 유저들에게는 약어 파악 요구",
      "특화된 B2B 가치가 높은 만큼 요금제 문턱이 가벼운 개인 블로그 오토메이션에 비해 묵직한 편"
    ],
    bestFor: "영업 이메일 작성, 경쟁사 모니터링, 고객 CRM 관리를 자동으로 수행하는 '24시간 무기한 상주 AI 마케터 / 영업 사원'을 두고 싶은 글로벌 B2B 서비스 및 이커머스 기업 대표님",
    aiIntegration: "단독 지시를 완수하는 비서(Assistant)의 단계를 넘어섭니다. 스스로 이메일을 열고, 새로운 바이어를 찾아내고, 제안서를 작성한 다음, 메일을 보내는 전 과정을 AI가 하나의 거대한 백그라운드 태스크로 연쇄 수행하여 완벽한 에이전트다운 업무 수행 능력을 뽐냅니다.",
    affiliateUrl: "https://relevanceai.com/",
    alternatives: ["lindy", "crewai", "coze"]
  },
  {
    id: "retool-workflows",
    name: "Retool Workflows",
    slug: "retool-workflows",
    category: "Developer Automation",
    badge: "앱 UI & 자동화의 일심동체",
    slogan: "사내 인프라/DB와 API를 연결하여 비주얼 UI와 업무 자동화를 동시 빌드하는 로코드 백엔드 솔루션",
    logoColor: "bg-slate-800",
    logoTextColor: "text-emerald-400",
    priceInfo: "기본 무료 / Team $10/유저/월부터",
    pricingDetails: {
      free: "Free Plan: 5인 이하 팀 영구 무료, 월 1GB의 DB 호스팅 제공, 기본 빌러 작동 지원",
      starter: "Team Plan: $10/유저/월 (워크플로우 월 1,000회 실행 기본 탑재, 이력 보존 30일)",
      pro: "Business: $50/유저/월 (에러 트랙킹 툴 연동, 화이트라벨링 브랜딩, 스테이징 디버거 분리)",
      pricingModel: "워크플로우가 실제로 가동된 초(Duration) 및 연동 DB 트래픽 소모량을 바탕으로 하는 합산식",
      taskCostFactor: 0.005
    },
    difficulty: "어려움",
    difficultyLevel: 4,
    rating: 4.8,
    features: [
      "PostgreSQL, MySQL, Google Sheets, Salesforce 등을 UI 컴포넌트에 원클릭 연결",
      "서버 내부에서 실행되는 Javascript/SQL 코드 단계를 포함하는 고급 비주얼 워크플로우 캔버스",
      "업무 자동화를 시작하기 위한 Webhook 트리거 및 Cron 스케줄러 내장",
      "자동화 이력을 실시간 그래프로 모니터링하고 로그 검증을 원스톱 진행하는 엔지니어 대시보드",
      "GitHub 형상관리 연동 및 CI/CD 배포 파이프라인 매칭 지원"
    ],
    pros: [
      "자동화 처리 결과물이나 사내 DB 데이터를 '어드민 페이지(Admin UI)'로 즉석 구현하는 영역에서 현존 1위",
      "단조로운 API 중계뿐 아니라 직접 SQL 쿼리를 실행해 사내 데이터베이스 무결성을 점검하고 갱신하는 안정성이 단단함",
      "강력한 권한 시스템과 SSO 로그인을 지원하여 사내 규제 및 컴플라이언스 준수에 독자적인 이점 보유"
    ],
    cons: [
      "단순 드래그 노코드 마케팅 툴이 아닌 개발자를 겨냥한 'Low-Code' 플랫폼이므로 데이터베이스 지식과 SQL 실력이 필수",
      "사용자 관리 위주 라이선스라 수백 명의 사원이 들어와 쓸 경우 유저당 라이선스 청구비가 단시간에 증대"
    ],
    bestFor: "회사의 기존 핵심 DB(PostgreSQL 등)에 직접 접근하여 매일 아침 통계 배치 작업을 가동하고, 이 통계치를 세련된 사내 직원용 대시보드 UI에 시각화해 띄우고 싶은 IT/스타트업 CTO 및 전산 유지 보수팀",
    aiIntegration: "자체 LLM 지원 및 Retool AI 모듈을 제공합니다. 데이터베이스의 지저분한 유입 레코드를 AI 벡터 임베딩 처리하고, 사내 Q&A를 정교하게 해결하려는 RAG 엔진을 자사 UI 캔버스에 직접 얹어 신속한 AI 어드민 툴을 창조할 수 있습니다.",
    affiliateUrl: "https://retool.com/products/workflows",
    alternatives: ["pipedream", "n8n", "zapier"]
  },
  {
    id: "kestra",
    name: "Kestra",
    slug: "kestra",
    category: "Developer Automation",
    badge: "현대적 선언형 YAML 오케스트레이터",
    slogan: "선언적 YAML 형식을 빌려 대규모 데이터 처리와 서버리스 파이프라인을 예술적으로 지휘하는 개발자 플랫폼",
    logoColor: "bg-slate-900",
    logoTextColor: "text-sky-300",
    priceInfo: "오픈소스 완전 무료 / Enterprise 협의",
    pricingDetails: {
      free: "Kestra OSS: 완전 무료 배포 가능 (로컬 혹은 사내 가상머신 Docker 구축 제한 없음)",
      starter: "Kestra Cloud: 대규모 팀 프로젝트, IAM 클라우드 권한 제어, 24/7 SLA 모범 지원 별도 견적",
      pro: "엔터프라이즈 사설 테넌드 맞춤형 빌링",
      pricingModel: "오픈소스 가동 무료. 엔터프라이즈는 처리하는 파이프라인 스텝 수 또는 연동 서버 크기에 따라 과금",
      taskCostFactor: 0.002
    },
    difficulty: "어려움",
    difficultyLevel: 4,
    rating: 4.9,
    features: [
      "코딩 한 줄 없이 YAML 구성 파일 수정만으로 대형 에이전트 파이프라인 선언",
      "Python, R, Node.js, Shell, Docker Container 등 다양한 로컬 스크립트 실행 통합",
      "수천 개의 빅데이터 처리(BigQuery, Snowflake, AWS S3) 공식 패키지 다이렉트 이식",
      "모든 자동화 플로우의 처리 속도, 간섭 에러, 재시도 프로세스를 지도로 구현한 초고속 웹 콘솔 UI",
      "분산 아키텍처(Kafka, ElasticSearch 연계) 설계로 일일 수억 건의 데이터 소화 가능"
    ],
    pros: [
      "구형 데이터 오케스트레이터(Apache Airflow)에 비해 훨씬 트렌디하고 세련됨. 배포와 관리가 단일 컨테이너로 끝나 인프라 리소스 극대화",
      "GUI 상의 플로우 지도와 코드 에디팅이 좌우 분할 화면으로 리얼타임 연계되어 싱크율 우수",
      "자동 실패 재시도(Retry with Backoff), 지연 대기 후 진행 등 엔지니어링 안정 메커니즘을 YAML 선언 몇 줄로 조율"
    ],
    cons: [
      "코드와 YAML 스펙 문서를 어느 정도 정주행해야 워크플로우 작성이 가능해 순수한 그래픽 중심의 노코드 뷰를 기대하고 접근하면 적응이 더딤",
      "일반 간이 카카오톡 전송이나 드라이브 연동 같은 일차원 업무보다는 하부 단 인프라, 빅데이터 가우징, 클라우드 워크로드 지휘에 치중"
    ],
    bestFor: "데이터 사이언티스트, 대형 백엔드 아키텍처 엔지니어링 사우, 서버리스 AI 파이프라인의 엄청난 트래픽과 신뢰성을 비용 허비 없이 무제한으로 관리하고 싶은 인프라 매니저",
    aiIntegration: "빅데이터 및 AI 에이전트 인프라스트럭처 제어 특화. 대량 수집한 사용자 후기 뭉치를 OpenAI Embedding 노드로 끌어올려 데이터베이스에 배치하고, 벡터 연산을 가쳐 맞춤 보고서 작성 시퀀스를 완벽한 하이레벨 YAML 명령어로 가공해줍니다.",
    affiliateUrl: "https://kestra.io/",
    alternatives: ["pipedream", "autogen", "crewai"]
  },
  {
    id: "power-automate",
    name: "Power Automate",
    slug: "power-automate",
    category: "No-Code Automation",
    badge: "Microsoft 윈도우 & RPA 종결자",
    slogan: "레거시 윈도우 환경부터 Office 365 클라우드까지 논스톱 관통하는 마이크로소프트 공식 엔터프라이즈 RPA",
    logoColor: "bg-blue-800",
    logoTextColor: "text-white",
    priceInfo: "Windows 11 사용자 무료(데스크톱 한정) / 프리미엄 사용자당 $15/월부터",
    pricingDetails: {
      free: "Power Automate Desktop: Windows 11 기본 무료, 개인용 PC 마우스/키보드 노코드 매크로 전원 무료",
      starter: "Premium User: $15/사용자/월 (클라우드 클립 연동, 자사 흐름 자동 공유 및 실시간 가상 봇 백그라운드 운용)",
      pro: "Process Plan: $150/봇/월 (무감독 자동화, 프론트 없이 온전히 가상 컨테이너에서 24시간 작동)",
      pricingModel: "사용자당 라이선스 청구 및 무감독으로 돌릴 가상 런타임 봇 개수 세분화 과금",
      taskCostFactor: 0.015
    },
    difficulty: "보통",
    difficultyLevel: 2,
    rating: 4.6,
    features: [
      "Windows 마우스 클릭, 키보드 입력, 화면 스크린 OCR 판독을 무제한 지원하는 강력한 RPA 엔진",
      "엑셀, 아웃룩, 원드라이브, 이메일, 팀즈 등 MS 계정 및 Office 365 에코시스템 원버튼 싱크",
      "청구서 이미지 사진을 올리면 알아서 텍스트 세부 내역을 파싱해 보관해 주는 머신러닝 AI 인공 보조 빌더",
      "복잡한 코딩이 들어가지 않고 대화형 창으로 완성해 나가는 쉬운 단계 흐름 구성",
      "회사 전산망 보안 인증을 그대로 계승해 사용하는 안전한 거버넌스"
    ],
    pros: [
      "국내 사내 전용 노후 공공 사이트나 액티브X가 남아있는 레거시 웹 시스템 같이 타사 SaaS 연동 API가 절망적인 사이트도 데스크톱 마우스 매크로(RPA) 방식을 빌려 자동화 수행 가능",
      "인터넷 없이 PC가 켜져 있는 것만으로 돌 수 있어 비용 우회 및 내부 자산 론칭이 쉬움",
      "마이크로소프트의 공식 한글 설명서와 뛰어난 한글 검색 생태계, 그리고 우수한 기술 가이드 포럼 지원"
    ],
    cons: [
      "클라우드에서 24시간 가벼운 웹훅 응답 처리를 하기 위해 가상 봇을 빌릴 시 경쟁사에 비해 세팅 비용이나 조건이 거대기업 중심적이라 비쌈",
      "맥북(macOS)이나 구글 워크스페이스 중심의 힙한 최신 업무 라이프스타일 스타트업들에는 MS 윈도우 한계 가득함"
    ],
    bestFor: "대형 은행, 지자체 공무 단위, 정밀 제조업 등 사내 사설 인메모리 포털이나 옛날 윈도우 전용 ERP, 대용량 한글 엑셀 파일을 매일 아침 열고 클릭을 반복해야 하는 전통 대기업 사무 요원 및 CFO 재무 관리부",
    aiIntegration: "Copilot Studio 연계 및 AI OCR 학습(Document Processing) 기능에 특화되었습니다. 영수증 원본 이미지 파일을 AI 모델이 자동 파싱하여 MS Dataverse 데이터베이스로 밀어 넣거나 메일 회신 초안을 아웃룩 아키텍처 상에 자동으로 임베딩 해줍니다.",
    affiliateUrl: "https://powerautomate.microsoft.com/",
    alternatives: ["zapier", "make", "relay-app"]
  }
].map((tool) => ({
  ...tool,
  affiliateUrl: AFFILIATE_LINKS[tool.id] ?? tool.affiliateUrl,
} as Tool));
