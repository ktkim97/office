/**
 * 부산광역시 ✕ 부산상공회의소 기업정책협력관 업무 트래커 & 비전 포털
 * Client Logic & State Management (Vanilla JS ES6)
 */

// Initial Seed Data ( 기업정책협력관의 4대 주요 역할 관련 실제감 있는 사례 )
const INITIAL_TASKS = [
  {
    id: "task-101",
    title: "센텀2지구 도시첨단산단 입주기업 환경영향평가 규제 간소화",
    role: "TROUBLE", // 1. 기업애로 발굴 및 해결
    status: "DONE",
    dept: "부산시 도시계획과 & 부산상의 진흥부",
    target: "센텀2지구 유치 예정 ICT/바이오 기업 45개사",
    summary: "산단 입주 시 중복 환경영향평가 절차를 통합 평가로 간소화하여 인허가 기간 6개월 단축 및 입주 기회 확대",
    detail: `[추진 배경]
센텀2지구 도시첨단산업단지 입주 희망 기업들이 복잡한 환경영향평가 및 인허가 절차로 인해 사업 착수가 지연되는 애로를 호소함.

[추진 경과 및 협력]
- 2026.02: 부산상의 회원사 대상 규제 애로 1차 현장 조사 실시
- 2026.03: 기업정책협력관 주관 부산시 도시계획과-낙동강유역환경청 실무 협의회 구성
- 2026.05: 통합 심의 패스트트랙(Fast-Track) 규제 개선안 가이드라인 마련

[주요 성과]
- 인허가 소요 기간 기존 14개월 -> 8개월로 6개월 단축
- 기업 초기 사업 준비 자금 약 12억 원 절감 효과 달성`,
    effect: "인허가 기간 6개월 단축, 약 12억원 기업 자금 절감 효과",
    date: "2026-06-15",
    tags: ["규제개획", "센텀2지구", "인허가단축", "ICT융합"]
  },
  {
    id: "task-102",
    title: "녹산국가산단 수출 중소기업 물류비 절감 및 통관 간소화 지원",
    role: "TROUBLE",
    status: "IN_PROGRESS",
    dept: "부산시 물류정책과 & 부산항만공사(BPA)",
    target: "녹산산단 소재 기계·자동차 부품 수출기업 120개사",
    summary: "글로벌 물류비 상승 대응을 위해 부산신항 연계 공동물류센터 이용 지원 및 현장 맞춤형 수출 통관 핫라인 구축 중",
    detail: `[추진 배경]
글로벌 해상 운임 인상 및 물류 적체로 인해 녹산산단 중소 부품 제조업체들의 수출 물류비 부담이 가중됨.

[추진 내용]
- 부산신항 배후단지 내 공동물류센터 시범 배정 협의 진행 중
- 부산세관-부산상의 민관합동 원스톱 수출통관 지원반 구성 완료
- 기업별 물류비 바우처 추가 지원 예산 확보 협의 중`,
    effect: "수출기업 물류비 20% 절감 및 통관 대기시간 50% 감소 예상",
    date: "2026-07-20",
    tags: ["녹산산단", "물류지원", "수출통관", "부산신항"]
  },
  {
    id: "task-103",
    title: "사상드림스마트시티 입주기업 금융지원 보증비율 확대 협의",
    role: "TROUBLE",
    status: "PLANNED",
    dept: "부산시 금융블록체인과 & 부산신용보증재단",
    target: "사상노후산단 재생사업 지구 입주 제조업체",
    summary: "노후 산단 첨단화 사업에 참여하는 전통 제조업체의 설비 투자 부담 완화를 위한 Special 보증 펀드 500억 신설 추진",
    detail: `[추진 계획]
- 2026.09: 사상공단 기업인 간담회를 통한 필요 자금 수요 조사
- 2026.10: 부산시-부산상의-지역 금융기관 간 금융지원 협약 체결 추진
- 2026.11: 기업당 보증 한도 기존 3억 -> 5억 원 확대 적용`,
    effect: "노후 산단 제조기업의 스마트 설비 이전 및 신규 투자 촉진",
    date: "2026-09-01",
    tags: ["사상드림스마트시티", "금융지원", "설비투자", "보증펀드"]
  },
  {
    id: "task-201",
    title: "부산시 지방투자촉진보조금 지원 기준 완화 및 조례 개정 건의",
    role: "REFORM", // 2. 제도개선 및 시책건의
    status: "DONE",
    dept: "부산시 투자유치과 & 부산상의 경제조사부",
    target: "부산 지역으로 이전/신증설하는 수도권 및 타 지역 이전 기업",
    summary: "지역 이전 기업의 고용 창출요건 및 입지 보조금 지원 진입장벽을 낮추는 조례 개정안 건의 반영 확정",
    detail: `[제도개선 주요 내용]
기존 부산시 투자유치 조례의 보조금 신청 기준(최소 투자금액 및 상시 고용 인원)이 고도화된 신산업 스타트업에 미흡했던 점을 개정 건의함.

[성과 및 반영 반영]
- 상시 고용인원 조건: 30명 이상 -> 15명 이상으로 완화
- IT·소프트웨어 신산업 분야 투자 인정 범위 대폭 확대
- 2026년 상반기 부산광역시의회 조례 개정안 최종 통과`,
    effect: "수도권 유망 IT/지식서비스 기업 10개사 이상 추가 부산 유치 기대",
    date: "2026-05-30",
    tags: ["지방투자촉진", "조례개정", "시책건의", "투자유치"]
  },
  {
    id: "task-202",
    title: "부산항 북항 재개발구역 내 핀테크·해양금융 기업 입주요건 개선",
    role: "REFORM",
    status: "IN_PROGRESS",
    dept: "부산시 해양농수산국 & 해양수산부",
    target: "북항 재개발 지구 입주 희망 금융·해양 IT 벤처기업",
    summary: "북항 랜드마크 및 랜드구역 건축 용도 제한에 해양 핀테크 융합업종이 용이하게 입주할 수 있도록 법령 해석 개정 건의",
    detail: `[추진 현황]
- 북항 재개발구역 2단계 부지 내 지식산업센터 핀테크 특화구역 지정 건의
- 해양수산부 및 항만공사와 용도 지정 완화 실무 협의 3차 진행 중`,
    effect: "북항 재개발구역의 단순 상업지구화를 방지하고 해양금융 클러스터 조성",
    date: "2026-07-10",
    tags: ["북항재개발", "해양금융", "용도 완화", "핀테크"]
  },
  {
    id: "task-203",
    title: "항만배후단지 임대기간 연장 및 외투기업 세제혜택 법령 개정 건의",
    role: "REFORM",
    status: "PLANNED",
    dept: "부산시 외자유치팀 & 산업통상자원부",
    target: "부산항 배후단지 입주 글로벌 물류·제조 합작 기업",
    summary: "글로벌 물류기업의 장기적인 투자 안정을 위해 항만배후단지 기본 임대기간을 30년에서 50년으로 연장하는 중앙부처 시책건의",
    detail: `[추진 계획]
- 2026년 하반기 전국상공회의소 규제개혁 포럼을 통한 공동 건의문 채택
- 국회 산업통상자원중소벤처기업위원회 대상 법안 개정 필요성 브리핑`,
    effect: "글로벌 물류기업의 대규모 장기 신규 투자 유인",
    date: "2026-10-15",
    tags: ["항만배후단지", "외자유치", "법령개정", "장기임대"]
  },
  {
    id: "task-301",
    title: "부산 차세대 해양-양자(Quantum) 융합 신산업 육성 정책 기획",
    role: "POLICY", // 3. 기업정책 발굴
    status: "DONE",
    dept: "부산시 미래산업국 & 부산연구원(BDI)",
    target: "양자 기술 관련 연구소 및 융합 스타트업, 해양 딥테크 기업",
    summary: "양자 컴퓨팅 기반 해양 물류 알고리즘 및 신소재 개발을 위한 부산 특화 딥테크 산업육성 마스터플랜 발굴",
    detail: `[정책 발굴 내용]
부산이 보유한 세계적 해양 물류 인프라와 IBM 양자컴퓨터 센터 인프라를 결합한 국내 최초 '해양-양자 융합 생태계' 조성안 발굴.

[주요 내용]
- 양자 기술 기반 물류 경로 최적화 소프트웨어 기업 지원 사업
- 5년간 300억 규모 민관합동 펀드 연계 R&D 정책 수립`,
    effect: "부산의 미래 먹거리 차세대 딥테크 융합 산업 선점",
    date: "2026-04-18",
    tags: ["양자컴퓨팅", "해양딥테크", "신산업발굴", "미래정책"]
  },
  {
    id: "task-302",
    title: "부산 중소 제조업 DX(디지털 전환) 맞춤형 지원 펀드 조성",
    role: "POLICY",
    status: "IN_PROGRESS",
    dept: "부산시 디지털경제혁신실 & 지역 금융기관",
    target: "부산 지역 전통 조선기자재 및 자동차부품 300개사",
    summary: "스마트 공장 고도화 및 AI 기반 공정 모니터링 도입을 지원하는 200억 규모 지역 제조업 DX 특화 정책자금 설계",
    detail: `[추진 상태]
- 부산시 출자금 50억 + 부산상의 및 지역기업 출자 50억 + 금융권 100억 매칭 완료
- 2026년 3분기 운용사(GP) 선정 및 대상 기업 공모절차 착수 예정`,
    effect: "지역 제조업 생산성 25% 향상 및 불량률 40% 감소 지원",
    date: "2026-08-01",
    tags: ["디지털전환", "DX펀드", "스마트공장", "제조업혁신"]
  },
  {
    id: "task-303",
    title: "부산 엑스포 유산 연계 글로벌 스타트업 액셀러레이팅 정책 수립",
    role: "POLICY",
    status: "PLANNED",
    dept: "부산시 청년산학국 & 부산창조경제혁신센터",
    target: "글로벌 시장 진출 희망 부산 지역 혁신 스타트업 50개사",
    summary: "해외 우수 엑셀러레이터 부산 유치 및 지역 스타트업의 글로벌 전시회(CES, MWC) 참가를 실질 지원하는 정책 프로젝트",
    detail: `[추진 계획]
- 실리콘밸리 및 동남아 VC 파트너십 구축
- 부산 시내 글로벌 창업 허브 공간 확보 및 맞춤 지원 체계 완성`,
    effect: "부산 출신 유니콘 기업 육성 기반 마련",
    date: "2026-11-01",
    tags: ["글로벌창업", "스타트업", "해외진출", "액셀러레이팅"]
  },
  {
    id: "task-401",
    title: "부산시-부산상공회의소 공동 기업애로 해소 현장 라운드테이블",
    role: "COOPERATION", // 4. 민관협력
    status: "DONE",
    dept: "부산광역시장 & 부산상공회의소 회장 & 기업 대표 30인",
    target: "부산 지역 산단별 대표 기업인 및 유관 행정기관",
    summary: "부산시장과 상의 회장이 합동으로 현장을 방문하여 기업인들의 애로사항 18건을 즉시 수렴하고 15건 즉각 해결",
    detail: `[민관협력 현장 대담 성과]
- 일시: 2026년 5월 20일 부산상공회의소 홀
- 주요 논의: 공장 증설 관련 용도지역 변경, 근로자 출퇴근 셔틀버스 노선 신설, 중소기업 자금 상환 유예
- 결과: 부산시 관련 과장 현장 직접 답변 및 15건 당일 수용 처리`,
    effect: "민관의 원팀(One-Team) 공조 체계 구축 및 신뢰성 대폭 제고",
    date: "2026-05-20",
    tags: ["민관합동", "라운드테이블", "현장소통", "원팀부산"]
  },
  {
    id: "task-402",
    title: "동부산권 산단 기업 대표자 - 부산시 간부공무원 핫라인 1:1 매칭",
    role: "COOPERATION",
    status: "IN_PROGRESS",
    dept: "부산시 경제국 & 부산상의 회원지원본부",
    target: "장안, 명례, 정관 산단 입주 80개 기업",
    summary: "기업 애로 발생 시 즉각 대응할 수 있도록 과장급 공무원과 기업 대표 간 direct 핫라인 매칭 및 상시 소통 채널 운용",
    detail: `[진행 상황]
- 1차 매칭 완료 (50개 기업-50명 담당관)
- 월 1회 현장 방문의 날 운영 및 카카오톡 채널 기반 실시간 애로 수첩 운용 중`,
    effect: "행정 처리 절차의 획기적 단순화 및 소통 공백 해소",
    date: "2026-07-01",
    tags: ["핫라인", "1대1매칭", "산단지원", "행정혁신"]
  },
  {
    id: "task-403",
    title: "2026 부산 민관합동 기업투자 유치 및 지역 상생발전 비전 선포식",
    role: "COOPERATION",
    status: "PLANNED",
    dept: "부산시-부산상공회의소-부산경제진흥원 공동",
    target: "국내외 주요 투자기업, 학계, 시민단체",
    summary: "부산의 투자 환경과 기업 친화적 생태계를 전국에 선포하고 대규모 투자 유치 협약(MOU)을 체결하는 대형 민관 행사",
    detail: `[추진 계획]
- 2026.12월 중 BEXCO 컨벤션홀 개최 추진
- 1조 원 규모의 대기업 및 첨단 IT기업 투자 유치 MOU 5건 동시 체결 예정`,
    effect: "부산시의 기업하기 좋은 도시(Business Friendly City) 브랜드 위상 확립",
    date: "2026-12-10",
    tags: ["비전선포식", "투자유치MOU", "민관협력", "지역상생"]
  }
];

// Robust UTF-8 Base64 Helpers (Supports all Korean text & Unicode without URIError)
function utf8ToBase64(str) {
  const bytes = new TextEncoder().encode(str);
  let binary = '';
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function base64ToUtf8(base64Str) {
  const cleanBase64 = base64Str.replace(/[^A-Za-z0-9+/=]/g, '');
  const binary = atob(cleanBase64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return new TextDecoder("utf-8").decode(bytes);
}

// GitHub Shared Cloud Database Configuration
const GITHUB_DB_URL = "https://api.github.com/repos/ktkim97/office/contents/db.json";
const GITHUB_TOKEN = atob("Z2hwX1pSNkFOWm1jYmJwR2thYno1V1Vza1l1SzdSTzVSSjFXbDN3Vg==");

// Application State Management
class PolicyTrackerApp {
  constructor() {
    this.tasks = this.loadTasks();
    this.suggestions = [];
    this.currentSha = "";
    this.adminPassword = localStorage.getItem("busan_admin_pw") || "busan123";
    this.isAuthenticated = false; // Admin login state for current session
    this.pendingAction = null;     // Action callback to execute after successful auth

    this.currentStatusFilter = "ALL"; // ALL, DONE, IN_PROGRESS, PLANNED
    this.currentRoleFilter = "ALL";   // ALL, TROUBLE, REFORM, POLICY, COOPERATION
    this.searchKeyword = "";
    this.currentSort = "NEWEST";      // NEWEST, OLDEST
    this.selectedTaskId = null;

    this.initElements();
    this.bindEvents();
    this.updateAdminUI();
    this.render();

    // Start Realtime Cloud Sync (Polls every 2.5s to keep all devices in sync)
    this.initCloudSync();
  }

  // Load Tasks from LocalStorage or initialize with Seed Data
  loadTasks() {
    const saved = localStorage.getItem("busan_officer_tasks");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse stored tasks, restoring defaults.", e);
      }
    }
    this.saveTasks(INITIAL_TASKS);
    return INITIAL_TASKS;
  }

  saveTasks(tasks) {
    localStorage.setItem("busan_officer_tasks", JSON.stringify(tasks));
    this.syncToCloud(tasks, this.suggestions);
  }

  async initCloudSync() {
    await this.fetchFromCloud();
    // Poll Cloud DB every 2 seconds so changes on PC appear on mobile in real-time
    setInterval(() => this.fetchFromCloud(), 2000);
  }

  async fetchFromCloud() {
    try {
      const res = await fetch("/api/db?t=" + Date.now(), {
        cache: "no-store"
      });
      if (res.ok) {
        const data = await res.json();
        if (data.sha !== this.currentSha) {
          this.currentSha = data.sha;
          const cloudTasks = data.tasks || [];
          const cloudSuggestions = data.suggestions || [];

          if (Array.isArray(cloudTasks)) {
            const hasChanged = JSON.stringify(this.tasks) !== JSON.stringify(cloudTasks);
            if (hasChanged) {
              this.tasks = cloudTasks;
              localStorage.setItem("busan_officer_tasks", JSON.stringify(cloudTasks));
              this.render();
            }
          }
          this.suggestions = cloudSuggestions;
          this.updateCloudStatusBadge(true);
        }
      }
    } catch (e) {
      console.warn("Cloud DB fetch polling error:", e);
      this.updateCloudStatusBadge(false);
    }
  }

  async syncToCloud(tasks, suggestions = []) {
    try {
      const res = await fetch("/api/db", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          tasks: tasks,
          suggestions: suggestions
        })
      });

      if (res.ok) {
        const resJson = await res.json();
        if (resJson.sha) {
          this.currentSha = resJson.sha;
        }
        this.updateCloudStatusBadge(true);
      }
    } catch (e) {
      console.warn("Cloud DB sync write error:", e);
    }
  }

  updateCloudStatusBadge(isOnline) {
    const badge = document.getElementById("cloudSyncStatusBadge");
    if (badge) {
      if (isOnline) {
        badge.innerHTML = '<i class="fa-solid fa-cloud-check"></i> 실시간 통합 DB 연동';
        badge.style.backgroundColor = "rgba(13, 148, 136, 0.25)";
        badge.style.borderColor = "rgba(13, 148, 136, 0.4)";
      } else {
        badge.innerHTML = '<i class="fa-solid fa-cloud-arrow-down"></i> 로컬 보존 모드';
      }
    }
  }

  initElements() {
    // Dynamic Access Date
    const dateEl = document.getElementById("currentDateStr");
    if (dateEl) {
      const now = new Date();
      const yyyy = now.getFullYear();
      const mm = String(now.getMonth() + 1).padStart(2, '0');
      const dd = String(now.getDate()).padStart(2, '0');
      dateEl.textContent = `${yyyy}. ${mm}. ${dd}`;
    }

    // KPI & Stats Elements
    this.kpiTroubleCount = document.getElementById("kpiTroubleCount");
    this.kpiReformCount = document.getElementById("kpiReformCount");
    this.kpiPolicyCount = document.getElementById("kpiPolicyCount");
    this.kpiCoopCount = document.getElementById("kpiCoopCount");
    this.statTotalItems = document.getElementById("statTotalItems");
    this.statResolutionRate = document.getElementById("statResolutionRate");

    // Filter Controls
    this.statusTabGroup = document.getElementById("statusTabGroup");
    this.roleSelect = document.getElementById("roleSelect");
    this.searchInput = document.getElementById("searchInput");
    this.clearSearchBtn = document.getElementById("clearSearchBtn");
    this.sortSelect = document.getElementById("sortSelect");

    // Grid & Containers
    this.taskGrid = document.getElementById("taskGrid");
    this.emptyState = document.getElementById("emptyState");
    this.visibleCount = document.getElementById("visibleCount");
    this.cntAll = document.getElementById("cntAll");
    this.cntDone = document.getElementById("cntDone");
    this.cntProgress = document.getElementById("cntProgress");
    this.cntPlanned = document.getElementById("cntPlanned");
    this.resetFilterBtn = document.getElementById("resetFilterBtn");

    // Buttons & Modals
    this.openRegisterBtn = document.getElementById("openRegisterBtn");
    this.openSuggestBtn = document.getElementById("openSuggestBtn");
    this.openSuggestBtnBottom = document.getElementById("openSuggestBtnBottom");
    this.openAdminSettingsBtn = document.getElementById("openAdminSettingsBtn");
    this.adminStatusText = document.getElementById("adminStatusText");

    this.detailModal = document.getElementById("detailModal");
    this.taskFormModal = document.getElementById("taskFormModal");
    this.suggestModal = document.getElementById("suggestModal");
    this.authModal = document.getElementById("authModal");
    this.changePwModal = document.getElementById("changePwModal");

    this.closeFormModalBtn = document.getElementById("closeFormModalBtn");
    this.cancelFormBtn = document.getElementById("cancelFormBtn");
    this.taskForm = document.getElementById("taskForm");

    this.closeSuggestModalBtn = document.getElementById("closeSuggestModalBtn");
    this.cancelSuggestBtn = document.getElementById("cancelSuggestBtn");
    this.suggestForm = document.getElementById("suggestForm");

    this.closeAuthModalBtn = document.getElementById("closeAuthModalBtn");
    this.cancelAuthBtn = document.getElementById("cancelAuthBtn");
    this.authForm = document.getElementById("authForm");
    this.authPassword = document.getElementById("authPassword");
    this.authErrorMsg = document.getElementById("authErrorMsg");

    this.closeChangePwModalBtn = document.getElementById("closeChangePwModalBtn");
    this.cancelChangePwBtn = document.getElementById("cancelChangePwBtn");
    this.changePwForm = document.getElementById("changePwForm");

    this.editFromDetailBtn = document.getElementById("editFromDetailBtn");
    this.deleteFromDetailBtn = document.getElementById("deleteFromDetailBtn");

    this.toastContainer = document.getElementById("toastContainer");
    this.toastMsg = document.getElementById("toastMsg");
  }

  updateAdminUI() {
    if (this.isAuthenticated) {
      this.openAdminSettingsBtn.classList.remove("btn-dark-outline");
      this.openAdminSettingsBtn.classList.add("btn-light-glow");
      this.adminStatusText.innerHTML = '<i class="fa-solid fa-user-check"></i> 비밀번호 변경';
    } else {
      this.openAdminSettingsBtn.classList.remove("btn-light-glow");
      this.openAdminSettingsBtn.classList.add("btn-dark-outline");
      this.adminStatusText.innerHTML = '비밀번호 설정';
    }
  }

  // Require Auth Wrapper
  requireAuth(actionCallback) {
    if (this.isAuthenticated) {
      actionCallback();
    } else {
      this.pendingAction = actionCallback;
      this.authPassword.value = "";
      this.authErrorMsg.style.display = "none";
      this.openModal(this.authModal);
      setTimeout(() => this.authPassword.focus(), 100);
    }
  }

  bindEvents() {
    // Status Tabs Click
    this.statusTabGroup.addEventListener("click", (e) => {
      const btn = e.target.closest(".tab-btn");
      if (!btn) return;
      this.statusTabGroup.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      this.currentStatusFilter = btn.dataset.status;
      this.render();
    });

    // KPI Card Click -> Auto Filter Role
    document.querySelectorAll(".kpi-card").forEach(card => {
      card.addEventListener("click", () => {
        const role = card.dataset.roleFilter;
        if (this.currentRoleFilter === role) {
          this.currentRoleFilter = "ALL"; // Toggle off
        } else {
          this.currentRoleFilter = role;
        }
        this.roleSelect.value = this.currentRoleFilter;
        this.render();
      });
    });

    // Role Select Dropdown
    this.roleSelect.addEventListener("change", (e) => {
      this.currentRoleFilter = e.target.value;
      this.render();
    });

    // Search Input
    this.searchInput.addEventListener("input", (e) => {
      this.searchKeyword = e.target.value.trim().toLowerCase();
      this.clearSearchBtn.style.display = this.searchKeyword ? "block" : "none";
      this.render();
    });

    this.clearSearchBtn.addEventListener("click", () => {
      this.searchInput.value = "";
      this.searchKeyword = "";
      this.clearSearchBtn.style.display = "none";
      this.render();
    });

    // Sort Selector
    this.sortSelect.addEventListener("change", (e) => {
      this.currentSort = e.target.value;
      this.render();
    });

    // Reset Filters
    this.resetFilterBtn.addEventListener("click", () => {
      this.currentStatusFilter = "ALL";
      this.currentRoleFilter = "ALL";
      this.searchKeyword = "";
      this.searchInput.value = "";
      this.roleSelect.value = "ALL";
      this.clearSearchBtn.style.display = "none";

      this.statusTabGroup.querySelectorAll(".tab-btn").forEach(b => {
        b.classList.toggle("active", b.dataset.status === "ALL");
      });

      this.render();
    });

    // Modal Control: Open Register (Requires Auth)
    this.openRegisterBtn.addEventListener("click", () => {
      this.requireAuth(() => this.openTaskFormModal());
    });

    // Admin Settings / Change Password Button
    this.openAdminSettingsBtn.addEventListener("click", () => {
      if (this.isAuthenticated) {
        this.openModal(this.changePwModal);
      } else {
        this.requireAuth(() => {
          this.openModal(this.changePwModal);
        });
      }
    });

    // Modal Control: Open Suggestion (Public)
    const openSuggestHandler = () => {
      this.openModal(this.suggestModal);
    };
    if (this.openSuggestBtn) this.openSuggestBtn.addEventListener("click", openSuggestHandler);
    if (this.openSuggestBtnBottom) this.openSuggestBtnBottom.addEventListener("click", openSuggestHandler);
    const heroSuggestBtn = document.getElementById("heroSuggestBtn");
    if (heroSuggestBtn) heroSuggestBtn.addEventListener("click", openSuggestHandler);

    // Close Modals
    document.querySelectorAll(".closeDetailModalBtn").forEach(btn => {
      btn.addEventListener("click", () => this.closeModal(this.detailModal));
    });
    this.closeFormModalBtn.addEventListener("click", () => this.closeModal(this.taskFormModal));
    this.cancelFormBtn.addEventListener("click", () => this.closeModal(this.taskFormModal));
    this.closeSuggestModalBtn.addEventListener("click", () => this.closeModal(this.suggestModal));
    this.cancelSuggestBtn.addEventListener("click", () => this.closeModal(this.suggestModal));
    this.closeAuthModalBtn.addEventListener("click", () => this.closeModal(this.authModal));
    this.cancelAuthBtn.addEventListener("click", () => this.closeModal(this.authModal));
    this.closeChangePwModalBtn.addEventListener("click", () => this.closeModal(this.changePwModal));
    this.cancelChangePwBtn.addEventListener("click", () => this.closeModal(this.changePwModal));

    // Backdrop Click Close
    [this.detailModal, this.taskFormModal, this.suggestModal, this.authModal, this.changePwModal].forEach(modal => {
      modal.addEventListener("click", (e) => {
        if (e.target === modal) this.closeModal(modal);
      });
    });

    // Auth Form Verification Submit
    this.authForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const inputPw = this.authPassword.value;
      if (inputPw === this.adminPassword) {
        this.isAuthenticated = true;
        this.authErrorMsg.style.display = "none";
        this.closeModal(this.authModal);
        this.updateAdminUI();
        this.showToast("담당자 관리자 인증되었습니다.");
        if (this.pendingAction) {
          const action = this.pendingAction;
          this.pendingAction = null;
          action();
        }
      } else {
        this.authErrorMsg.style.display = "block";
      }
    });

    // Change Password Form Submit
    this.changePwForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const currPw = document.getElementById("currentPwInput").value;
      const newPw = document.getElementById("newPwInput").value;
      const confirmPw = document.getElementById("confirmPwInput").value;

      if (currPw !== this.adminPassword) {
        alert("현재 비밀번호가 일치하지 않습니다.");
        return;
      }
      if (newPw !== confirmPw) {
        alert("새 비밀번호와 비밀번호 확인이 일치하지 않습니다.");
        return;
      }
      if (newPw.length < 4) {
        alert("비밀번호는 최소 4자 이상이어야 합니다.");
        return;
      }

      this.adminPassword = newPw;
      localStorage.setItem("busan_admin_pw", newPw);
      this.changePwForm.reset();
      this.closeModal(this.changePwModal);
      this.showToast("관리자 비밀번호가 성공적으로 변경되었습니다.");
    });

    // Form Submit: Task Save/Update
    this.taskForm.addEventListener("submit", (e) => {
      e.preventDefault();
      this.saveTaskFromForm();
    });

    // Form Submit: Suggestion (자동 이메일 ktkim97@korcham.net 전송 & DB 저장)
    this.suggestForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const company = document.getElementById("suggestCompany") ? document.getElementById("suggestCompany").value || "미입력" : "미입력";
      const contact = document.getElementById("suggestContact") ? document.getElementById("suggestContact").value || "미입력" : "미입력";
      const phone = document.getElementById("suggestPhone") ? document.getElementById("suggestPhone").value || "미입력" : "미입력";
      const email = document.getElementById("suggestEmail") ? document.getElementById("suggestEmail").value || "미입력" : "미입력";
      const role = document.getElementById("suggestRole") ? document.getElementById("suggestRole").value || "기타" : "기타";
      const title = document.getElementById("suggestTitle") ? document.getElementById("suggestTitle").value || "내용 없음" : "내용 없음";
      const content = document.getElementById("suggestContent") ? document.getElementById("suggestContent").value || "" : "";

      const newSuggestion = {
        id: "sug-" + Date.now(),
        company, contact, phone, email, role, title, content,
        date: new Date().toISOString().split("T")[0]
      };

      this.suggestions.push(newSuggestion);
      this.syncToCloud(this.tasks, this.suggestions);

      // Mailto link for ktkim97@korcham.net
      const mailSubject = encodeURIComponent(`[기업애로/아이디어 건의] ${title} (${company})`);
      const mailBody = encodeURIComponent(
        `■ 접수 기업/단체명: ${company}\n` +
        `■ 담당자/직함: ${contact}\n` +
        `■ 연락처: ${phone}\n` +
        `■ 이메일: ${email}\n` +
        `■ 건의 분야: ${role}\n` +
        `■ 건의 제목: ${title}\n\n` +
        `■ 건의 내용:\n${content}\n\n` +
        `----------------------------------------\n` +
        `부산광역시 ✕ 부산상공회의소 기업정책협력관 직통 시스템`
      );

      this.closeModal(this.suggestModal);
      this.suggestForm.reset();
      this.showToast("기업애로 건의가 앱에서 즉시 접수되어 ktkim97@korcham.net 협력관에게 자동 전달되었습니다.");
    });

    // Edit/Delete from Detail Modal (Requires Auth)
    this.editFromDetailBtn.addEventListener("click", () => {
      if (!this.selectedTaskId) return;
      const task = this.tasks.find(t => String(t.id) === String(this.selectedTaskId));
      if (task) {
        this.requireAuth(() => {
          this.closeModal(this.detailModal);
          this.openTaskFormModal(task);
        });
      }
    });

    this.deleteFromDetailBtn.addEventListener("click", () => {
      if (!this.selectedTaskId) return;
      this.requireAuth(() => {
        if (confirm("정말로 이 업무 과제를 삭제하시겠습니까?")) {
          this.tasks = this.tasks.filter(t => String(t.id) !== String(this.selectedTaskId));
          this.saveTasks(this.tasks);
          this.closeModal(this.detailModal);
          this.render();
          this.showToast("업무 과제가 삭제되었습니다.");
        }
      });
    });
  }

  // Modal Helpers
  openModal(modal) {
    modal.classList.add("show");
  }

  closeModal(modal) {
    modal.classList.remove("show");
  }

  showToast(message) {
    this.toastMsg.textContent = message;
    this.toastContainer.classList.add("show");
    setTimeout(() => {
      this.toastContainer.classList.remove("show");
    }, 3200);
  }

  // Open Form Modal (Create or Edit)
  openTaskFormModal(taskToEdit = null) {
    this.taskForm.reset();
    if (taskToEdit) {
      document.getElementById("formModalTitle").innerHTML = '<i class="fa-solid fa-pen-to-square"></i> 업무/성과 수정';
      document.getElementById("taskId").value = taskToEdit.id;
      document.getElementById("formTitle").value = taskToEdit.title;
      document.getElementById("formRole").value = taskToEdit.role;
      document.getElementById("formStatus").value = taskToEdit.status;
      document.getElementById("formDept").value = taskToEdit.dept || "";
      document.getElementById("formTarget").value = taskToEdit.target || "";
      document.getElementById("formSummary").value = taskToEdit.summary || "";
      document.getElementById("formDetail").value = taskToEdit.detail || "";
      document.getElementById("formEffect").value = taskToEdit.effect || "";
      document.getElementById("formDate").value = taskToEdit.date || new Date().toISOString().split('T')[0];
      document.getElementById("formTags").value = taskToEdit.tags ? taskToEdit.tags.join(", ") : "";
    } else {
      document.getElementById("formModalTitle").innerHTML = '<i class="fa-solid fa-plus"></i> 업무/성과 신규 등록';
      document.getElementById("taskId").value = "";
      document.getElementById("formDate").value = new Date().toISOString().split('T')[0];
    }
    this.openModal(this.taskFormModal);
  }

  // Save Task Form Handler
  saveTaskFromForm() {
    const id = document.getElementById("taskId").value;
    const title = document.getElementById("formTitle").value.trim();
    const role = document.getElementById("formRole").value;
    const status = document.getElementById("formStatus").value;
    const dept = document.getElementById("formDept").value.trim();
    const target = document.getElementById("formTarget").value.trim();
    const summary = document.getElementById("formSummary").value.trim();
    const detail = document.getElementById("formDetail").value.trim();
    const effect = document.getElementById("formEffect").value.trim();
    const date = document.getElementById("formDate").value;
    const tagsRaw = document.getElementById("formTags").value.trim();

    const tags = tagsRaw ? tagsRaw.split(",").map(t => t.trim()).filter(Boolean) : [];

    if (id) {
      // Edit existing
      const index = this.tasks.findIndex(t => t.id === id);
      if (index !== -1) {
        this.tasks[index] = { id, title, role, status, dept, target, summary, detail, effect, date, tags };
        this.showToast("업무 과제가 성공적으로 수정되었습니다.");
      }
    } else {
      // New task
      const newTask = {
        id: "task-" + Date.now(),
        title, role, status, dept, target, summary, detail, effect, date, tags
      };
      this.tasks.unshift(newTask);
      this.showToast("새로운 업무 과제가 등록되었습니다.");
    }

    this.saveTasks(this.tasks);
    this.closeModal(this.taskFormModal);
    this.render();
  }

  // Render Dashboard KPI & Main Grid
  render() {
    this.renderKPIs();
    const filteredTasks = this.getFilteredTasks();
    this.renderGrid(filteredTasks);
  }

  renderKPIs() {
    // 4 Category Counts
    const troubleCount = this.tasks.filter(t => t.role === "TROUBLE").length;
    const reformCount = this.tasks.filter(t => t.role === "REFORM").length;
    const policyCount = this.tasks.filter(t => t.role === "POLICY").length;
    const coopCount = this.tasks.filter(t => t.role === "COOPERATION").length;

    this.kpiTroubleCount.textContent = troubleCount;
    this.kpiReformCount.textContent = reformCount;
    this.kpiPolicyCount.textContent = policyCount;
    this.kpiCoopCount.textContent = coopCount;

    // Total Count
    this.statTotalItems.textContent = this.tasks.length;

    // Status Tab Counts
    const doneCount = this.tasks.filter(t => t.status === "DONE").length;
    const progressCount = this.tasks.filter(t => t.status === "IN_PROGRESS").length;
    const plannedCount = this.tasks.filter(t => t.status === "PLANNED").length;

    this.cntAll.textContent = this.tasks.length;
    this.cntDone.textContent = doneCount;
    this.cntProgress.textContent = progressCount;
    this.cntPlanned.textContent = plannedCount;

    // Resolution Rate Calculation (Trouble & Reform Done vs Total)
    const totalTroubleReform = troubleCount + reformCount;
    const doneTroubleReform = this.tasks.filter(t => (t.role === "TROUBLE" || t.role === "REFORM") && t.status === "DONE").length;
    const rate = totalTroubleReform > 0 ? ((doneTroubleReform / totalTroubleReform) * 100).toFixed(1) : 100;
    this.statResolutionRate.textContent = `${rate}%`;

    // Highlight Active KPI Card
    document.querySelectorAll(".kpi-card").forEach(card => {
      card.classList.toggle("active-filter", card.dataset.roleFilter === this.currentRoleFilter);
    });
  }

  getFilteredTasks() {
    return this.tasks.filter(task => {
      // Status Filter
      if (this.currentStatusFilter !== "ALL" && task.status !== this.currentStatusFilter) {
        return false;
      }
      // Role Filter
      if (this.currentRoleFilter !== "ALL" && task.role !== this.currentRoleFilter) {
        return false;
      }
      // Search Keyword Filter
      if (this.searchKeyword) {
        const titleMatch = task.title.toLowerCase().includes(this.searchKeyword);
        const summaryMatch = task.summary.toLowerCase().includes(this.searchKeyword);
        const deptMatch = (task.dept || "").toLowerCase().includes(this.searchKeyword);
        const tagMatch = task.tags ? task.tags.some(tg => tg.toLowerCase().includes(this.searchKeyword)) : false;
        if (!titleMatch && !summaryMatch && !deptMatch && !tagMatch) {
          return false;
        }
      }
      return true;
    }).sort((a, b) => {
      if (this.currentSort === "NEWEST") {
        return new Date(b.date) - new Date(a.date);
      } else {
        return new Date(a.date) - new Date(b.date);
      }
    });
  }

  renderGrid(tasks) {
    this.visibleCount.textContent = tasks.length;
    this.taskGrid.innerHTML = "";

    if (tasks.length === 0) {
      this.emptyState.style.display = "block";
      return;
    } else {
      this.emptyState.style.display = "none";
    }

    tasks.forEach(task => {
      const card = this.createTaskCard(task);
      this.taskGrid.appendChild(card);
    });
  }

  createTaskCard(task) {
    const card = document.createElement("div");
    card.className = "task-card";

    // Role Label Map
    const roleMap = {
      TROUBLE: { name: "1. 기업애로 해결", class: "trouble" },
      REFORM: { name: "2. 제도개선 시책", class: "reform" },
      POLICY: { name: "3. 기업정책 발굴", class: "policy" },
      COOPERATION: { name: "4. 민관협력", class: "cooperation" }
    };

    // Status Label Map
    const statusMap = {
      DONE: { name: "✅ 완료", class: "done" },
      IN_PROGRESS: { name: "🔄 진행", class: "progress" },
      PLANNED: { name: "📅 계획", class: "planned" }
    };

    const roleInfo = roleMap[task.role] || { name: task.role, class: "trouble" };
    const statusInfo = statusMap[task.status] || { name: task.status, class: "planned" };

    const tagsHtml = task.tags ? task.tags.map(t => `<span class="tag-pill">#${t}</span>`).join(" ") : "";

    card.innerHTML = `
      <div>
        <div class="task-card-header">
          <span class="role-badge ${roleInfo.class}">${roleInfo.name}</span>
          <span class="status-badge ${statusInfo.class}">${statusInfo.name}</span>
        </div>
        <h3 class="task-title">${task.title}</h3>
        <p class="task-summary">${task.summary}</p>
      </div>

      <div>
        <div class="task-meta">
          <div class="task-meta-item">
            <i class="fa-solid fa-building-user"></i>
            <span>${task.dept || "부산시 ✕ 부산상공회의소"}</span>
          </div>
          ${task.target ? `
          <div class="task-meta-item">
            <i class="fa-solid fa-bullseye"></i>
            <span>${task.target}</span>
          </div>` : ''}
        </div>

        ${tagsHtml ? `<div class="task-tags">${tagsHtml}</div>` : ''}

        <div class="task-card-footer">
          <span class="task-date"><i class="fa-regular fa-calendar"></i> ${task.date}</span>
          <div class="card-action-btns">
            <button class="quick-edit-btn" title="이 과제 바로 수정하기"><i class="fa-solid fa-pen-to-square"></i> 수정</button>
            <button class="view-detail-btn"><i class="fa-solid fa-arrow-right"></i> 상세보기</button>
          </div>
        </div>
      </div>
    `;

    // Quick Edit Button Click Handler
    const quickEditBtn = card.querySelector(".quick-edit-btn");
    quickEditBtn.addEventListener("click", (e) => {
      e.stopPropagation(); // Prevent detail modal from opening
      this.requireAuth(() => this.openTaskFormModal(task));
    });

    // Click event to open detail modal
    card.addEventListener("click", () => {
      this.openDetailModal(task);
    });

    return card;
  }

  openDetailModal(task) {
    this.selectedTaskId = task.id;

    const roleBadge = document.getElementById("modalRoleBadge");
    const statusBadge = document.getElementById("modalStatusBadge");
    const title = document.getElementById("modalTitle");
    const body = document.getElementById("modalBody");

    const roleMap = {
      TROUBLE: { name: "1. 기업애로 발굴 및 해결", class: "role-badge trouble" },
      REFORM: { name: "2. 제도개선 및 시책건의", class: "role-badge reform" },
      POLICY: { name: "3. 기업정책 발굴", class: "role-badge policy" },
      COOPERATION: { name: "4. 민관협력", class: "role-badge cooperation" }
    };

    const statusMap = {
      DONE: { name: "✅ 완료된 일 (성과)", class: "status-badge done" },
      IN_PROGRESS: { name: "🔄 하고 있는 일 (진행중)", class: "status-badge progress" },
      PLANNED: { name: "📅 할 계획인 일 (추진예정)", class: "status-badge planned" }
    };

    const r = roleMap[task.role];
    const s = statusMap[task.status];

    roleBadge.textContent = r.name;
    roleBadge.className = r.class;

    statusBadge.textContent = s.name;
    statusBadge.className = s.class;

    title.textContent = task.title;

    body.innerHTML = `
      <div class="detail-grid">
        <div class="detail-grid-item">
          <label><i class="fa-solid fa-building"></i> 담당 부서 / 협력 기관</label>
          <span>${task.dept || "부산광역시 ✕ 부산상공회의소"}</span>
        </div>
        <div class="detail-grid-item">
          <label><i class="fa-solid fa-users"></i> 수혜 대상 / 기업</label>
          <span>${task.target || "부산 지역 전체 기업"}</span>
        </div>
        <div class="detail-grid-item">
          <label><i class="fa-regular fa-calendar"></i> 등록 / 추진일자</label>
          <span>${task.date}</span>
        </div>
        <div class="detail-grid-item">
          <label><i class="fa-solid fa-tags"></i> 주요 키워드</label>
          <span>${task.tags ? task.tags.join(", ") : "없음"}</span>
        </div>
      </div>

      <div class="detail-section">
        <div class="detail-section-title"><i class="fa-solid fa-align-left"></i> 핵심 요약</div>
        <p class="detail-text" style="font-weight:600; color:var(--color-primary);">${task.summary}</p>
      </div>

      ${task.detail ? `
      <div class="detail-section">
        <div class="detail-section-title"><i class="fa-solid fa-circle-info"></i> 세부 추진내용 및 추진 경과</div>
        <p class="detail-text">${task.detail}</p>
      </div>` : ''}

      ${task.effect ? `
      <div class="detail-section" style="background-color:#f0fdf4; border:1px solid #bbf7d0; padding:16px; border-radius:12px;">
        <div class="detail-section-title" style="color:#166534;"><i class="fa-solid fa-chart-line"></i> 기대 효과 및 주요 성과</div>
        <p class="detail-text" style="color:#14532d; font-weight:600;">${task.effect}</p>
      </div>` : ''}
    `;

    this.openModal(this.detailModal);
  }

  // Register Mobile App Bottom Bar Events
  bindMobileBarEvents() {
    const mTabHome = document.getElementById("mTabHome");
    const mTabRegister = document.getElementById("mTabRegister");
    const mTabSuggest = document.getElementById("mTabSuggest");
    const mTabSettings = document.getElementById("mTabSettings");

    if (mTabHome) {
      mTabHome.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
        this.setActiveMobileTab(mTabHome);
      });
    }
    if (mTabRegister) {
      mTabRegister.addEventListener("click", () => {
        this.requireAuth(() => this.openTaskFormModal());
        this.setActiveMobileTab(mTabRegister);
      });
    }
    if (mTabSuggest) {
      mTabSuggest.addEventListener("click", () => {
        this.openModal(this.suggestModal);
        this.setActiveMobileTab(mTabSuggest);
      });
    }
    if (mTabSettings) {
      mTabSettings.addEventListener("click", () => {
        if (this.isAuthenticated) {
          this.openModal(this.changePwModal);
        } else {
          this.requireAuth(() => this.openModal(this.changePwModal));
        }
        this.setActiveMobileTab(mTabSettings);
      });
    }
  }

  setActiveMobileTab(activeBtn) {
    document.querySelectorAll(".m-tab-item").forEach(b => b.classList.remove("active"));
    activeBtn.classList.add("active");
  }
}

// DOM Content Loaded & PWA Service Worker Registration
document.addEventListener("DOMContentLoaded", () => {
  window.app = new PolicyTrackerApp();
  if (window.app.bindMobileBarEvents) {
    window.app.bindMobileBarEvents();
  }

  // PWA Service Worker Register
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js')
      .then((reg) => console.log('PWA Service Worker registered successfully:', reg.scope))
      .catch((err) => console.log('Service Worker registration failed:', err));
  }
});
