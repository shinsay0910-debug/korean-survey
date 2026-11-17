/*
 * 설문 문항 정의 파일
 * - 문항을 추가/수정/삭제하려면 이 파일만 편집하면 됩니다.
 * - type: "text"(단답) | "paragraph"(장문) | "radio"(단일선택) | "grid"(척도 표)
 * - allowOther: true 이면 "기타" 선택지 + 직접입력 칸이 붙습니다.
 */
window.SURVEY_CONFIG = {
  // ▼ Google Apps Script 웹앱 배포 URL을 붙여넣으세요 (README 2단계 참고)
  //   비워두면 제출 시 응답이 파일(JSON)로 다운로드됩니다.
  endpoint: "https://script.google.com/macros/s/AKfycbwNeB8p450JMjUZtIaHjV_rXi08NG8RIy6aY7GwM2exvyOpCNFmVnChgrweN3tY-FzCYw/exec",

  title: "학습자 및 전문가 대상 인력 수요 조사 설문지",
  description:
    "반랑대학교(Van Lang University) 한국어문화학부는 한국학 석사과정 개설을 준비하고 있습니다. " +
    "본 설문은 교육과정 설계에 반영하기 위해 학습자와 전문가 여러분의 의견을 듣고자 마련되었습니다.\n" +
    "응답에는 약 5~10분이 소요됩니다.",
  closing: "바쁘신 가운데 설문에 응해 주셔서 진심으로 감사드립니다.",

  sections: [
    {
      id: "s1",
      title: "Ⅰ. 일반 정보",
      questions: [
        { id: "q1_1", no: "1.1", type: "text", required: true, label: "성명" },
        {
          id: "q1_2", no: "1.2", type: "radio", required: false, allowOther: true,
          label: "소속 기관의 분야 (재학생은 응답하지 않으셔도 됩니다)",
          options: ["교육기관", "국영기업", "언론·미디어 기업", "외국계 기업", "민간기업", "정부기관"]
        },
        { id: "q1_3", no: "1.3", type: "text", required: false, label: "직위 (해당 시)" },
        {
          id: "q1_4", no: "1.4", type: "radio", required: true, allowOther: true,
          label: "최종 학력",
          options: ["학부 재학 중", "학사 졸업", "석사 졸업", "박사 졸업"]
        },
        {
          id: "q1_5", no: "1.5", type: "radio", required: true, allowOther: true,
          label: "학부 전공",
          options: ["한국어", "한국학"]
        }
      ]
    },
    {
      id: "s2",
      title: "Ⅱ. 한국학 석사과정 진학에 대한 의견",
      questions: [
        {
          id: "q2_1", no: "2.1", type: "radio", required: true,
          label: "한국학 석사과정 진학에 대한 관심 정도",
          options: [
            "관심 없음",
            "반드시 진학할 계획임",
            "향후 5년 이내 진학할 계획임",
            "여건이 맞으면 진학할 의향이 있음"
          ]
        },
        {
          id: "q2_2", no: "2.2", type: "grid", required: true,
          label: "다음 요인이 석사과정 진학 결정에 미치는 영향 정도",
          columns: ["영향 없음", "약간 영향", "보통", "영향 큼", "매우 큼"],
          rows: [
            "입학 외국어 요건",
            "교육과정의 난이도",
            "학위논문 주제",
            "학업에 필요한 시간",
            "재정 여건",
            "가족",
            "교육기관의 명성",
            "교수진 및 전문가 구성"
          ]
        },
        {
          id: "q2_3", no: "2.3", type: "radio", required: true, allowOther: true,
          label: "적합한 수업 시간대",
          options: ["평일 주간", "평일 야간", "토·일요일만"]
        },
        {
          id: "q2_4", no: "2.4", type: "radio", required: true, allowOther: true,
          label: "적합한 과정 기간",
          options: ["12개월", "18개월", "24개월"]
        },
        {
          id: "q2_5", no: "2.5", type: "radio", required: true, allowOther: true,
          label: "과정 전체 등록금으로 적정한 수준",
          options: [
            "8,000만 동 이상 ~ 1억 2,000만 동 미만",
            "1억 2,000만 동 이상 ~ 1억 5,000만 동 미만",
            "1억 5,000만 동 ~ 2억 동"
          ]
        }
      ]
    },
    {
      id: "s3",
      title: "Ⅲ. 교육과정에 요구되는 역량",
      note: "각 항목의 필요 정도를 선택해 주십시오. (필요 없음 → 매우 필요)",
      questions: [
        {
          id: "q3_1", no: "3.1", type: "grid", required: true,
          label: "【지식】 다음 지식 영역의 필요 정도",
          columns: ["필요 없음", "아직 필요 없음", "약간 필요", "필요", "매우 필요"],
          rows: [
            "연구·학술 소통·전문 업무에 활용할 수 있는 심화 한국어 지식",
            "한국의 문화·역사·정치·경제·외교·문학 등에 관한 심층 지식",
            "한국 관련 이슈 및 한·베 협력, 지역 협력을 분석하는 학제적 사고",
            "한국학, 한·베 비교연구, 지역학의 이론과 연구방법론",
            "과학기술·AI가 한국 관련 연구와 실무에 미치는 영향에 대한 이해",
            "한국 관련 연구 또는 실무를 위해 지식을 발전·통합하는 능력"
          ]
        },
        { id: "q3_1_1", no: "3.1.1", type: "paragraph", required: false, label: "필요한 지식에 대한 기타 의견" },
        {
          id: "q3_2", no: "3.2", type: "grid", required: true,
          label: "【기술】 다음 기술의 필요 정도",
          columns: ["필요 없음", "아직 필요 없음", "약간 필요", "필요", "매우 필요"],
          rows: [
            "한국 중심 또는 비교 연구 프로젝트를 설계·수행하기 위한 분석·종합·평가 및 비판적 사고",
            "교육·문화·사회·경영·미디어·비즈니스·한·베 협력 등 실무 문제에 한국학 지식을 적용하는 능력",
            "한국 및 지역과 관련된 새로운 지식 창출과 창의적 응용 능력",
            "전문 업무와 연구에 필요한 능숙한 한국어 의사소통 및 제2외국어로서의 영어 활용 능력",
            "상호문화 의사소통 및 다문화 환경에서의 효과적인 업무 수행 능력",
            "AI를 포함한 한국학 연구방법 및 데이터 도구의 능숙한 활용 능력"
          ]
        },
        { id: "q3_2_1", no: "3.2.1", type: "paragraph", required: false, label: "필요한 기술에 대한 기타 의견" },
        {
          id: "q3_3", no: "3.3", type: "grid", required: true,
          label: "【자율성과 책임】 다음 역량의 필요 정도",
          columns: ["필요 없음", "아직 필요 없음", "약간 필요", "필요", "매우 필요"],
          rows: [
            "독립적인 연구 사고와 전문적 자율성",
            "연구 및 전문 활동을 이끌고 조정·조직하는 능력",
            "학술적 진실성과 업무 품질에 대한 책임",
            "사회적 책임과 직업윤리",
            "문화적 차이를 존중하며 다문화 환경에서 적응·창의·협업하는 능력"
          ]
        },
        { id: "q3_3_1", no: "3.3.1", type: "paragraph", required: false, label: "자율성과 책임 역량에 대한 기타 의견" }
      ]
    }
  ]
};
