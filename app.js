/**
 * 부산광역시 ✕ 부산상공회의소 기업정책협력관 업무 트래커 & 비전 포털
 * Client Logic & State Management (Vanilla JS ES6)
 */

// Initial Seed Data ( 기업정책협력관의 4대 주요 역할 관련 실제 과제 )
const INITIAL_TASKS = [
  {
    id: "task-1788153242316",
    title: "부산독립운동기념관 내 기업가존(zone) 설치",
    role: "COOPERATION",
    status: "IN_PROGRESS",
    dept: "부산시 총무과 & 부산상공회의소",
    target: "지역 기업 및 시민",
    summary: "수난사와 무장투쟁 위주의 전시를 넘어, 민족 자본형성과 기업가정신을 독립운동의 일부로 재조명",
    detail: "부산시민공원 내 부산독립운동기념관('27.7.개관) 내 일제강점기 부산을 기반으로 민족자본을 지켜낸 기업가들의 사료, 유품 전시 및 상공인 헌정의 벽 등 조성",
    effect: "지역기업의 역사적 뿌리 재확인, 애국심과 도전적 기업가정신 전달 등",
    date: "2026-08-31",
    tags: ["부산독립운동기념관", "기업가ZONE", "상공인헌정", "민관협력"]
  },
  {
    id: "task-1787638571857",
    title: "공유수면 점사용료 부과징수권 제도 개선",
    role: "REFORM",
    status: "IN_PROGRESS",
    dept: "부산시 해운항만과, 기획담당관",
    target: "지역 조선 및 수리조선 기업",
    summary: "공유수면 의존도가 높은 점사용료가 인접 육상 토지가격과 연동 부과, 지역별 불평등한 구조적 한계",
    detail: "해양수산부에서 관리하는 공유수면 점사용료 부과 및 징수권한을 지방사무로 이양하기 위해 부울경 등 공동대응",
    effect: "조선, 수리조선 업계 경쟁력 강화",
    date: "2026-08-21",
    tags: ["제도개선", "공유수면", "점사용료", "조선업"]
  },
  {
    id: "task-1787638201745",
    title: "부산독립운동기념관 내 기업가ZONE 신설",
    role: "COOPERATION",
    status: "IN_PROGRESS",
    dept: "부산시 총무과 & 부산상공회의소",
    target: "지역 기업 및 시민",
    summary: "수난사와 무장투쟁 위주의 전시를 넘어, 민족 자본형성과 기업가정신을 독립운동의 일부로 재조명",
    detail: "부산시민공원 내 부산독립운동기념관('27.7.개관) 내 일제강점기 부산을 기반으로 민족자본을 지켜낸 기업가들의 사료, 유품 전시 및 상공인 헌정의 벽 등 조성",
    effect: "지역기업의 역사적 뿌리 재확인, 애국심과 도전적 기업가정신 전달 등",
    date: "2026-08-07",
    tags: ["부산독립운동기념관", "기업가ZONE", "상공인헌정", "민관협력"]
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
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
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
        const cloudTasks = data.tasks || [];
        const cloudSuggestions = data.suggestions || [];

        if (Array.isArray(cloudTasks) && cloudTasks.length > 0) {
          const hasChanged = JSON.stringify(this.tasks) !== JSON.stringify(cloudTasks);
          if (hasChanged || data.sha !== this.currentSha || this.tasks.length === 0) {
            this.currentSha = data.sha;
            this.tasks = cloudTasks;
            localStorage.setItem("busan_officer_tasks", JSON.stringify(cloudTasks));
            this.render();
          }
        }
        this.suggestions = cloudSuggestions;
        this.updateCloudStatusBadge(true);
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
      this.showToast("새로운 업무 과제가 성공적으로 등록되었습니다.");
    }

    // Auto-reset filters so newly added/edited task is guaranteed to be visible at the top!
    this.currentStatusFilter = "ALL";
    this.currentRoleFilter = "ALL";
    this.searchKeyword = "";
    if (this.searchInput) this.searchInput.value = "";
    if (this.roleSelect) this.roleSelect.value = "ALL";
    if (this.clearSearchBtn) this.clearSearchBtn.style.display = "none";
    if (this.statusTabGroup) {
      this.statusTabGroup.querySelectorAll(".tab-btn").forEach(b => {
        b.classList.toggle("active", b.dataset.status === "ALL");
      });
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
        ${task.detail ? `<div class="task-detail-box"><i class="fa-solid fa-file-text"></i> <strong>추진 상세내용:</strong><br>${task.detail.replace(/\n/g, '<br>')}</div>` : ''}
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
          ${task.effect ? `
          <div class="task-meta-item task-effect-item">
            <i class="fa-solid fa-chart-line"></i>
            <span><strong>기대효과:</strong> ${task.effect}</span>
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
