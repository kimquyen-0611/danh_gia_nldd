/**
 * Controller chính: Ứng dụng Quản lý & Đánh giá Năng lực Điều dưỡng UMC
 * Bệnh viện Đại học Y Dược TP. Hồ Chí Minh (Cơ sở 2)
 * Tính năng toàn diện:
 *  1. Phân nhóm Khoa phòng: Khối Lâm Sàng & Khối Cận Lâm Sàng
 *  2. Hệ thống Phân quyền (RBAC): Admin toàn viện, ĐD Trưởng/Phụ trách, Nhân viên (khóa phạm vi xem)
 *  3. Quản trị & Phân quyền thành viên (Modal Admin)
 *  4. Tự đánh giá 66 tiêu chí & Upload minh chứng scan
 *  5. Quản lý Thẩm định 3 cấp chuẩn xác (Cấp khoa -> Ban ĐD -> QĐ Bệnh viện)
 *  6. Portfolio & CME hàng năm (kèm khen thưởng & xóa khi nhập sai)
 *  7. Dashboard Thống kê Toàn viện / Từng khoa & So sánh Khối Lâm sàng - Cận lâm sàng
 *  8. Tra cứu cá nhân: So sánh 2024-2025, Động viên, Đề xuất CME năm sau & Kế hoạch 5 Lĩnh vực
 */

// 1. Phân nhóm Khoa phòng chuẩn
const CLINICAL_UNITS = [
  "Khoa Phụ Sản",
  "Khoa Ngoại",
  "Khoa Tai Mũi Họng",
  "Khoa Gây mê hồi sức",
  "Đơn vị Chấn thương Chỉnh hình"
];

const PARACLINICAL_UNITS = [
  "Khoa Chẩn đoán hình ảnh",
  "Khoa Xét nghiệm",
  "Khoa Kiểm soát nhiễm khuẩn",
  "Khoa Phục hồi chức năng",
  "Đơn vị Nội soi",
  "Đơn vị Săn sóc hồi tỉnh",
  "Khoa Khám bệnh",
  "Ban Điều dưỡng"
];

// Application State
const AppState = {
  nurses: [],
  currentSelfNurseId: "NV_1",
  currentReviewNurseId: null,
  currentPortalNurseId: "NV_1",
  currentPortfolioNurseId: "NV_1",
  currentEvidenceCriterionId: null,

  // Thông tin người dùng đăng nhập hiện tại (RBAC)
  currentUser: {
    id: "admin_1",
    fullName: "ThS. ĐD. Nguyễn Thị Kim Quyên",
    unit: "Ban Điều dưỡng",
    position: "Trưởng Ban Điều dưỡng / Quản trị viên Toàn viện",
    role: "admin", // 'admin' | 'dept_head' | 'staff'
    roleTitle: "ThS. ĐD. Nguyễn Thị Kim Quyên - Admin Toàn Viện"
  },

  // Khởi tạo và đồng bộ LocalStorage
  init() {
    // Tự động dọn dẹp các cache phiên bản cũ
    try {
      localStorage.removeItem("umc_nurses_competency_data_v1");
      localStorage.removeItem("umc_nurses_competency_data_v2");
      localStorage.removeItem("umc_nurses_competency_data_v3");
      localStorage.removeItem("umc_nurses_competency_data_v4");
    } catch (e) {}

    const saved = localStorage.getItem("umc_nurses_competency_data_v5");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length >= 100) {
          this.nurses = parsed;
        } else {
          this.nurses = JSON.parse(JSON.stringify(INITIAL_NURSES_DATA));
        }
      } catch (e) {
        this.nurses = JSON.parse(JSON.stringify(INITIAL_NURSES_DATA));
      }
    } else {
      this.nurses = JSON.parse(JSON.stringify(INITIAL_NURSES_DATA));
    }

    // Đảm bảo không bao giờ bị rỗng
    if (!Array.isArray(this.nurses) || this.nurses.length === 0) {
      this.nurses = JSON.parse(JSON.stringify(INITIAL_NURSES_DATA));
    }

    // Khởi tạo người dùng mặc định là Admin toàn viện
    this.currentUser = {
      id: "admin_1",
      fullName: "ThS. ĐD. Nguyễn Thị Kim Quyên",
      unit: "Ban Điều dưỡng",
      position: "Trưởng Ban Điều dưỡng / Quản trị viên Toàn viện",
      role: "admin",
      roleTitle: "ThS. ĐD. Nguyễn Thị Kim Quyên - Admin Toàn Viện"
    };

    // Khôi phục user phiên trước nếu có và hợp lệ
    const savedUser = localStorage.getItem("umc_current_user_v6");
    if (savedUser) {
      try {
        const uParsed = JSON.parse(savedUser);
        if (uParsed && uParsed.fullName) this.currentUser = uParsed;
      } catch (e) {}
    }

    // Tự động chuẩn hóa và gán vai trò mặc định cho từng nhân sự
    this.nurses.forEach(n => {
      const evalRes = ActionPlanEngine.evaluateCompetency(n, n.managerScores || n.selfScores);
      n.currentLevel = evalRes.achievedLevel;
      if (!n.totalScore2025) n.totalScore2025 = evalRes.totalScore;

      // Gán vai trò mặc định nếu chưa có
      if (!n.userRole) {
        if (n.unit === "Ban Điều dưỡng" || (n.fullName && n.fullName.includes("Trần Thị Thu Trang"))) {
          n.userRole = "admin";
        } else if (n.position && (n.position.includes("Trưởng") || n.position.includes("Phụ trách")) || (n.fullName && n.fullName.includes("Kim Quyên"))) {
          n.userRole = "dept_head";
        } else {
          n.userRole = "staff";
        }
      }

      // Khởi tạo quy trình 3 cấp kiểm duyệt nếu chưa có
      if (!n.approvalWorkflow) {
        const initData = (typeof INITIAL_NURSES_DATA !== "undefined" ? INITIAL_NURSES_DATA : []).find(x => x.id === n.id);
        if (initData && initData.approvalWorkflow) {
          n.approvalWorkflow = JSON.parse(JSON.stringify(initData.approvalWorkflow));
        } else {
          n.approvalWorkflow = {
            dept: { approved: false, reviewer: "", title: "", date: "", note: "" },
            nursingBoard: { approved: false, reviewer: "", title: "", date: "", note: "" },
            hospital: { decided: false, decisionNumber: "", signer: "", title: "", date: "", note: "" }
          };
        }
      }

      // Khởi tạo danh mục CME hàng năm nếu chưa có
      if (!n.cmeList) {
        const initData = (typeof INITIAL_NURSES_DATA !== "undefined" ? INITIAL_NURSES_DATA : []).find(x => x.id === n.id);
        n.cmeList = initData && initData.cmeList ? JSON.parse(JSON.stringify(initData.cmeList)) : [];
      }
    });

    if (this.nurses.length > 0) {
      if (!this.getNurse(this.currentSelfNurseId)) {
        this.currentSelfNurseId = this.nurses[0].id;
        this.currentPortalNurseId = this.nurses[0].id;
        this.currentPortfolioNurseId = this.nurses[0].id;
      }
    }

    this.save();
  },

  save() {
    localStorage.setItem("umc_nurses_competency_data_v5", JSON.stringify(this.nurses));
    localStorage.setItem("umc_current_user_v5", JSON.stringify(this.currentUser));
    this.updatePendingBadge();
  },

  getNurse(id) {
    return this.nurses.find(n => n.id === id);
  },

  getAccessibleNurses() {
    if (!this.currentUser) return this.nurses;
    if (this.currentUser.role === "admin" || this.currentUser.role === "dept_head") {
      return this.nurses;
    }
    // Staff: chỉ xem trong đơn vị của mình
    if (this.currentUser.unit) {
      return this.nurses.filter(n => n.unit === this.currentUser.unit);
    }
    return this.nurses;
  },

  updatePendingBadge() {
    const pending = this.nurses.filter(n => n.status === "submitted" || n.status === "dept_approved" || n.status === "nursing_board_approved").length;
    const badge = document.getElementById("pending-review-count");
    if (badge) {
      badge.textContent = pending;
      badge.style.display = pending > 0 ? "inline-block" : "none";
    }
  }
};

// Nạp lại dữ liệu gốc các khoa
window.resetToInitialData = function() {
  if (confirm("🔄 XÁC NHẬN NẠP DỮ LIỆU CÁC KHOA:\n\nBạn có muốn nạp lại toàn bộ dữ liệu chuẩn của nhân sự từ 13 Khoa/Đơn vị của Bệnh viện không?")) {
    try {
      localStorage.removeItem("umc_nurses_competency_data_v5");
      localStorage.removeItem("umc_current_user_v5");
      localStorage.removeItem("umc_current_user_v6");
    } catch(e) {}
    AppState.nurses = JSON.parse(JSON.stringify(INITIAL_NURSES_DATA));
    AppState.init();
    populateAllUnitDropdowns();
    refreshAllNurseSelects();
    renderUserSessionWidget();
    renderSelfEvaluationProfile();
    renderSelfEvaluationForm();
    renderManagerNursesTable();
    renderPortfolioView();
    renderAnalyticsDashboard();
    renderPersonalPortal();
    alert("🎉 ĐÃ NẠP TOÀN BỘ DỮ LIỆU TỪ 13 KHOA PHÒNG THÀNH CÔNG!");
  }
};

// Khởi chạy ứng dụng khi DOM sẵn sàng
document.addEventListener("DOMContentLoaded", () => {
  AppState.init();
  initNavigation();
  renderUserSessionWidget();
  populateAllUnitDropdowns();
  initSelfEvaluation();
  initManagerReview();
  initPortfolio();
  initAnalytics();
  initPersonalPortal();
  initStandardsRef();
  initModals();
});

/* =========================================================================
   1. ĐIỀU HƯỚNG TABS & PHÂN NHÓM KHOA LÂM SÀNG / CẬN LÂM SÀNG
   ========================================================================= */
function initNavigation() {
  const tabs = document.querySelectorAll(".nav-tab-btn");
  tabs.forEach(tab => {
    tab.addEventListener("click", () => {
      tabs.forEach(t => t.classList.remove("active"));
      tab.classList.add("active");

      const targetId = tab.getAttribute("data-tab");
      document.querySelectorAll(".view-section").forEach(sec => {
        sec.classList.remove("active");
      });

      const targetSection = document.getElementById(targetId);
      if (targetSection) {
        targetSection.classList.add("active");
        
        // Refresh specific view data on switch
        if (targetId === "tab-self-eval") {
          renderSelfEvaluationProfile();
          renderSelfEvaluationForm();
        }
        if (targetId === "tab-manager-review") renderManagerNursesTable();
        if (targetId === "tab-portfolio") renderPortfolioView();
        if (targetId === "tab-analytics") renderAnalyticsDashboard();
        if (targetId === "tab-personal-portal") renderPersonalPortal();
      }
    });
  });
}

// Sinh HTML danh sách Khoa phòng phân nhóm Lâm Sàng & Cận Lâm Sàng
function generateGroupedUnitsOptions(currentVal, includeAllOption = true, allLabel = "🏢 Toàn Bệnh viện") {
  const isStaff = AppState.currentUser && AppState.currentUser.role === "staff";
  const userUnit = AppState.currentUser ? AppState.currentUser.unit : null;

  // Nếu là Nhân viên: Chỉ được xem Khoa của mình (khóa phạm vi)
  if (isStaff && userUnit) {
    const count = AppState.nurses.filter(n => n.unit === userUnit).length;
    return `<option value="${userUnit}" selected>🏥 ${userUnit} (${count} ĐD/HS/KTV - Đơn vị của bạn)</option>`;
  }

  let html = "";
  if (includeAllOption) {
    const total = AppState.nurses.length;
    html += `<option value="ALL" ${currentVal === "ALL" ? "selected" : ""}>${allLabel} (${total} ĐD/HS/KTV)</option>`;
  }

  // Khối Khoa Lâm Sàng
  html += `<optgroup label="🏥 KHỐI KHOA LÂM SÀNG">`;
  CLINICAL_UNITS.forEach(u => {
    const count = AppState.nurses.filter(n => n.unit === u).length;
    html += `<option value="${u}" ${currentVal === u ? 'selected' : ''}>${u} (${count} ĐD/HS/KTV)</option>`;
  });
  html += `</optgroup>`;

  // Khối Khoa Cận Lâm Sàng & Khác
  html += `<optgroup label="🔬 KHỐI KHOA CẬN LÂM SÀNG & KHÁC">`;
  PARACLINICAL_UNITS.forEach(u => {
    const count = AppState.nurses.filter(n => n.unit === u).length;
    html += `<option value="${u}" ${currentVal === u ? 'selected' : ''}>${u} (${count} ĐD/HS/KTV)</option>`;
  });
  html += `</optgroup>`;

  return html;
}

function populateAllUnitDropdowns() {
  const isStaff = AppState.currentUser && AppState.currentUser.role === "staff";
  const userUnit = AppState.currentUser ? AppState.currentUser.unit : null;

  const unitFilterConfigs = [
    { id: "self-eval-unit-filter", allLabel: "🏢 Toàn Bệnh viện" },
    { id: "manager-unit-filter", allLabel: "🏢 Toàn Bệnh viện" },
    { id: "portfolio-unit-filter", allLabel: "🏢 Toàn Bệnh viện" },
    { id: "analytics-unit-filter", allLabel: "🏥 Toàn Bệnh viện (13 Khoa / Đơn vị)" },
    { id: "portal-unit-filter", allLabel: "🏢 Toàn Bệnh viện" },
    { id: "perm-unit-filter", allLabel: "Tất cả Khoa / Đơn vị" }
  ];

  unitFilterConfigs.forEach(cfg => {
    const el = document.getElementById(cfg.id);
    if (el) {
      const currentVal = isStaff ? userUnit : (el.value || "ALL");
      el.innerHTML = generateGroupedUnitsOptions(currentVal, true, cfg.allLabel);
      if (isStaff) {
        el.value = userUnit;
      }
    }
  });

  // Cập nhật các dropdown chọn khoa khi thêm / sửa nhân viên
  const editUnit = document.getElementById("edit-nurse-unit");
  if (editUnit) editUnit.innerHTML = generateGroupedUnitsOptions(editUnit.value || "Đơn vị Chấn thương Chỉnh hình", false);

  const newUnit = document.getElementById("new-nurse-unit");
  if (newUnit) newUnit.innerHTML = generateGroupedUnitsOptions(newUnit.value || "Đơn vị Chấn thương Chỉnh hình", false);
}

window.filterSelfEvalNursesByUnit = function(unit) {
  const selfSelect = document.getElementById("self-eval-nurse-select");
  if (!selfSelect) return;

  const effectiveUnit = (AppState.currentUser && AppState.currentUser.role === "staff") ? AppState.currentUser.unit : unit;
  const filtered = effectiveUnit === "ALL" ? AppState.nurses : AppState.nurses.filter(n => n.unit === effectiveUnit);
  
  selfSelect.innerHTML = filtered.map(n => 
    `<option value="${n.id}">${n.code} - ${n.fullName} (${n.unit})</option>`
  ).join("");

  if (filtered.length > 0) {
    AppState.currentSelfNurseId = filtered[0].id;
    AppState.currentPortalNurseId = filtered[0].id;
    renderSelfEvaluationProfile();
    renderSelfEvaluationForm();
  }
};

window.filterPortfolioNursesByUnit = function(unit) {
  const select = document.getElementById("portfolio-nurse-select");
  if (!select) return;

  const effectiveUnit = (AppState.currentUser && AppState.currentUser.role === "staff") ? AppState.currentUser.unit : unit;
  const filtered = effectiveUnit === "ALL" ? AppState.nurses : AppState.nurses.filter(n => n.unit === effectiveUnit);
  
  select.innerHTML = filtered.map(n => 
    `<option value="${n.id}">${n.code} - ${n.fullName} (${n.unit})</option>`
  ).join("");

  if (filtered.length > 0) {
    switchPortfolioNurse(filtered[0].id);
  }
};

window.filterPortalNursesByUnit = function(unit) {
  const select = document.getElementById("portal-nurse-select");
  if (!select) return;

  const effectiveUnit = (AppState.currentUser && AppState.currentUser.role === "staff") ? AppState.currentUser.unit : unit;
  const filtered = effectiveUnit === "ALL" ? AppState.nurses : AppState.nurses.filter(n => n.unit === effectiveUnit);
  
  select.innerHTML = filtered.map(n => 
    `<option value="${n.id}">${n.code} - ${n.fullName} (${n.unit})</option>`
  ).join("");

  if (filtered.length > 0) {
    AppState.currentPortalNurseId = filtered[0].id;
    renderPersonalPortal();
  }
};

function refreshAllNurseSelects() {
  populateAllUnitDropdowns();

  const isStaff = AppState.currentUser && AppState.currentUser.role === "staff";
  const userUnit = AppState.currentUser ? AppState.currentUser.unit : null;

  const selfUnit = isStaff ? userUnit : (document.getElementById("self-eval-unit-filter")?.value || "ALL");
  const selfFiltered = selfUnit === "ALL" ? AppState.nurses : AppState.nurses.filter(n => n.unit === selfUnit);
  const selfSelect = document.getElementById("self-eval-nurse-select");
  if (selfSelect) {
    selfSelect.innerHTML = selfFiltered.map(n => 
      `<option value="${n.id}" ${n.id === AppState.currentSelfNurseId ? 'selected' : ''}>${n.code} - ${n.fullName} (${n.unit})</option>`
    ).join("");
  }

  const portalUnit = isStaff ? userUnit : (document.getElementById("portal-unit-filter")?.value || "ALL");
  const portalFiltered = portalUnit === "ALL" ? AppState.nurses : AppState.nurses.filter(n => n.unit === portalUnit);
  const portalSelect = document.getElementById("portal-nurse-select");
  if (portalSelect) {
    portalSelect.innerHTML = portalFiltered.map(n => 
      `<option value="${n.id}" ${n.id === AppState.currentPortalNurseId ? 'selected' : ''}>${n.code} - ${n.fullName} (${n.unit})</option>`
    ).join("");
  }

  const portfolioUnit = isStaff ? userUnit : (document.getElementById("portfolio-unit-filter")?.value || "ALL");
  const portfolioFiltered = portfolioUnit === "ALL" ? AppState.nurses : AppState.nurses.filter(n => n.unit === portfolioUnit);
  const portfolioSelect = document.getElementById("portfolio-nurse-select");
  if (portfolioSelect) {
    portfolioSelect.innerHTML = portfolioFiltered.map(n => 
      `<option value="${n.id}" ${n.id === (AppState.currentPortfolioNurseId || AppState.currentSelfNurseId) ? 'selected' : ''}>${n.code} - ${n.fullName} (${n.unit})</option>`
    ).join("");
  }
}

/* =========================================================================
   2. HỆ THỐNG PHÂN QUYỀN (RBAC) & CHUYỂN ĐỔI NGƯỜI DÙNG
   ========================================================================= */
function renderUserSessionWidget() {
  const widget = document.getElementById("user-session-widget");
  const permBtn = document.getElementById("btn-admin-permissions");
  if (!widget) return;

  const u = AppState.currentUser;
  let roleBadge = "";
  let avatarInitial = u.fullName ? u.fullName.split(" ").pop().charAt(0) : "U";

  if (u.role === "admin") {
    roleBadge = `<span class="role-badge role-badge-admin">👑 Admin Toàn Viện</span>`;
    if (permBtn) permBtn.style.display = "inline-block";
  } else if (u.role === "dept_head") {
    roleBadge = `<span class="role-badge role-badge-dept-head">🩺 ĐD Trưởng Khoa</span>`;
    if (permBtn) permBtn.style.display = "none";
  } else {
    roleBadge = `<span class="role-badge role-badge-staff">👤 Nhân Viên (${u.unit})</span>`;
    if (permBtn) permBtn.style.display = "none";
  }

  widget.innerHTML = `
    <div class="user-session-avatar">${avatarInitial}</div>
    <div style="display: flex; flex-direction: column; text-align: left;">
      <span style="font-weight: 700; line-height: 1.2; font-size: 0.85rem; color: #ffffff;">${u.fullName}</span>
      <div style="display: flex; align-items: center; gap: 0.35rem; margin-top: 0.15rem;">
        <span style="font-size: 0.72rem; color: rgba(255,255,255,0.85);">${u.unit}</span>
        ${roleBadge}
      </div>
    </div>
  `;
}

window.openSwitchUserModal = function() {
  const modal = document.getElementById("switch-user-modal");
  if (!modal) return;

  const select = document.getElementById("switch-user-select");
  if (select) {
    select.innerHTML = `<option value="">-- Chọn bất kỳ nhân sự nào trong danh sách ${AppState.nurses.length} ĐD/HS/KTV --</option>` +
      AppState.nurses.map(n => 
        `<option value="${n.id}">${n.code} - ${n.fullName} (${n.unit} · ${n.position || n.degree}) [${n.userRole === 'admin' ? 'Admin' : (n.userRole === 'dept_head' ? 'ĐD Trưởng' : 'Nhân viên')}]</option>`
      ).join("");
  }

  modal.classList.add("active");
};

// Xử lý Đăng Nhập & Đăng Xuất (Màn hình Login)
window.handleUserLogin = function(e) {
  if (e) e.preventDefault();
  const username = (document.getElementById("login-username")?.value || "").trim();
  
  if (username.toLowerCase() === "admin" || username.toLowerCase().includes("quyen") || username.toLowerCase().includes("quyên")) {
    quickLoginAs("admin");
  } else if (username.toLowerCase().includes("dan") || username.toLowerCase().includes("đan")) {
    quickLoginAs("dept_head");
  } else {
    const found = AppState.nurses.find(n => n.code.toLowerCase() === username.toLowerCase() || n.fullName.toLowerCase().includes(username.toLowerCase()));
    if (found) {
      handleSelectSpecificUser(found.id);
      document.getElementById("login-overlay")?.classList.add("hidden");
    } else {
      quickLoginAs("staff");
    }
  }
};

window.quickLoginAs = function(roleType) {
  if (roleType === "admin") {
    const quyen = AppState.nurses.find(n => n.fullName.includes("Nguyễn Thị Kim Quyên")) || AppState.nurses[0];
    AppState.currentUser = {
      id: "admin_1",
      fullName: "ThS. ĐD. Nguyễn Thị Kim Quyên",
      unit: "Đơn vị Chấn thương Chỉnh hình",
      position: "Điều dưỡng Trưởng Đơn vị CTCH / Quản trị viên Toàn viện",
      role: "admin",
      roleTitle: "ThS. ĐD. Nguyễn Thị Kim Quyên - Admin Toàn Viện"
    };
    if (quyen) {
      AppState.currentSelfNurseId = quyen.id;
      AppState.currentPortalNurseId = quyen.id;
      AppState.currentPortfolioNurseId = quyen.id;
    }
  } else if (roleType === "dept_head") {
    const dan = AppState.nurses.find(n => n.fullName.includes("Phan Thị Tâm Đan")) || AppState.nurses[0];
    AppState.currentUser = {
      id: dan.id,
      fullName: "ThS. Phan Thị Tâm Đan",
      unit: "Ban Điều dưỡng",
      position: "Điều dưỡng Trưởng Bệnh viện / Trưởng Ban Điều dưỡng",
      role: "dept_head",
      roleTitle: "ThS. Phan Thị Tâm Đan - Trưởng Ban Điều Dưỡng"
    };
    AppState.currentSelfNurseId = dan.id;
    AppState.currentPortalNurseId = dan.id;
    AppState.currentPortfolioNurseId = dan.id;
  } else {
    const sanNurse = AppState.nurses.find(n => n.unit === "Khoa Phụ Sản") || AppState.nurses[0];
    AppState.currentUser = {
      id: sanNurse.id,
      fullName: sanNurse.fullName,
      unit: sanNurse.unit,
      position: sanNurse.position || "Hộ sinh / Điều dưỡng Lâm sàng",
      role: "staff",
      roleTitle: "ĐD/HS/KTV Khoa Lâm sàng"
    };
    AppState.currentSelfNurseId = sanNurse.id;
    AppState.currentPortalNurseId = sanNurse.id;
    AppState.currentPortfolioNurseId = sanNurse.id;
  }

  AppState.save();
  document.getElementById("login-overlay")?.classList.add("hidden");
  renderUserSessionWidget();
  refreshAllNurseSelects();
  renderSelfEvaluationProfile();
  renderSelfEvaluationForm();
  renderManagerNursesTable();
  renderPortfolioView();
  renderAnalyticsDashboard();
  renderPersonalPortal();
};

window.handleUserLogout = function() {
  document.getElementById("login-overlay")?.classList.remove("hidden");
};

window.switchToPresetUser = function(presetType) {
  if (presetType === "admin") {
    AppState.currentUser = {
      id: "admin_1",
      fullName: "ThS. ĐD. Nguyễn Thị Kim Quyên",
      unit: "Đơn vị Chấn thương Chỉnh hình",
      position: "Điều dưỡng Trưởng Đơn vị CTCH / Quản trị viên Toàn viện",
      role: "admin",
      roleTitle: "ThS. ĐD. Nguyễn Thị Kim Quyên - Admin Toàn Viện"
    };
  } else if (presetType === "dept_head") {
    const dan = AppState.nurses.find(n => n.fullName.includes("Phan Thị Tâm Đan")) || AppState.nurses[0];
    AppState.currentUser = {
      id: dan.id,
      fullName: "ThS. Phan Thị Tâm Đan",
      unit: "Ban Điều dưỡng",
      position: "Điều dưỡng Trưởng Bệnh viện / Trưởng Ban Điều dưỡng",
      role: "dept_head",
      roleTitle: "ThS. Phan Thị Tâm Đan - Trưởng Ban Điều Dưỡng"
    };
    AppState.currentSelfNurseId = dan.id;
    AppState.currentPortalNurseId = dan.id;
    AppState.currentPortfolioNurseId = dan.id;
  } else if (presetType === "staff_clinical") {
    // Điều dưỡng Khoa Phụ Sản (Khoa Lâm sàng)
    const sanNurse = AppState.nurses.find(n => n.unit === "Khoa Phụ Sản") || AppState.nurses[0];
    AppState.currentUser = {
      id: sanNurse.id,
      fullName: sanNurse.fullName,
      unit: sanNurse.unit,
      position: sanNurse.position || "Hộ sinh / Điều dưỡng Lâm sàng",
      role: "staff",
      roleTitle: "ĐD/HS/KTV Khoa Lâm sàng"
    };
    AppState.currentSelfNurseId = sanNurse.id;
    AppState.currentPortalNurseId = sanNurse.id;
    AppState.currentPortfolioNurseId = sanNurse.id;
  } else if (presetType === "staff_paraclinical") {
    // Kỹ thuật viên Khoa Xét nghiệm (Khoa Cận lâm sàng)
    const xnNurse = AppState.nurses.find(n => n.unit === "Khoa Xét nghiệm") || AppState.nurses[0];
    AppState.currentUser = {
      id: xnNurse.id,
      fullName: xnNurse.fullName,
      unit: xnNurse.unit,
      position: xnNurse.position || "Kỹ thuật viên Y",
      role: "staff",
      roleTitle: "ĐD/HS/KTV Khoa Cận lâm sàng"
    };
    AppState.currentSelfNurseId = xnNurse.id;
    AppState.currentPortalNurseId = xnNurse.id;
    AppState.currentPortfolioNurseId = xnNurse.id;
  }

  AppState.save();
  document.getElementById("switch-user-modal")?.classList.remove("active");
  renderUserSessionWidget();
  refreshAllNurseSelects();
  
  // Re-render current active views
  renderSelfEvaluationProfile();
  renderSelfEvaluationForm();
  renderManagerNursesTable();
  renderPortfolioView();
  renderAnalyticsDashboard();
  renderPersonalPortal();

  const roleText = AppState.currentUser.role === "admin" ? "ADMIN TOÀN VIỆN (Xem 13 khoa, quản lý phân quyền)" :
    (AppState.currentUser.role === "dept_head" ? "ĐIỀU DƯỠNG TRƯỞNG BỆNH VIỆN (Xem toàn viện, thẩm định cấp Ban ĐD)" : `ĐD/HS/KTV (${AppState.currentUser.unit} - Xem nội dung trong khoa)`);

  alert(`✅ ĐÃ CHUYỂN ĐỔI TÀI KHOẢN ĐĂNG NHẬP!\n\nNgười dùng: ${AppState.currentUser.fullName}\nĐơn vị: ${AppState.currentUser.unit}\nVai trò: ${roleText}`);
};

window.handleSelectSpecificUser = function(nurseId) {
  if (!nurseId) return;
  const nurse = AppState.getNurse(nurseId);
  if (!nurse) return;

  AppState.currentUser = {
    id: nurse.id,
    fullName: nurse.fullName,
    unit: nurse.unit,
    position: nurse.position || "Điều dưỡng Lâm sàng",
    role: nurse.userRole || "staff",
    roleTitle: nurse.userRole === "admin" ? "Admin Toàn Viện" : (nurse.userRole === "dept_head" ? "ĐD Trưởng / Phụ trách" : "Nhân viên Khoa")
  };

  AppState.currentSelfNurseId = nurse.id;
  AppState.currentPortalNurseId = nurse.id;
  AppState.currentPortfolioNurseId = nurse.id;

  AppState.save();
  document.getElementById("switch-user-modal")?.classList.remove("active");
  renderUserSessionWidget();
  refreshAllNurseSelects();
  
  renderSelfEvaluationProfile();
  renderSelfEvaluationForm();
  renderManagerNursesTable();
  renderPortfolioView();
  renderAnalyticsDashboard();
  renderPersonalPortal();

  alert(`✅ ĐÃ ĐĂNG NHẬP VỚI TƯ CÁCH: ${nurse.fullName} (${nurse.unit})!`);
};

// Modal Quản trị & Phân quyền Thành viên (Dành riêng cho Admin)
window.openPermissionsModal = function() {
  if (AppState.currentUser.role !== "admin") {
    alert("⛔ Bạn không có quyền truy cập chức năng Phân Quyền Thành Viên! Chỉ Admin mới có quyền thao tác.");
    return;
  }
  const modal = document.getElementById("user-permissions-modal");
  if (!modal) return;

  // Cập nhật bộ lọc khoa trong modal phân quyền
  const unitFilter = document.getElementById("perm-unit-filter");
  if (unitFilter) {
    unitFilter.innerHTML = `<option value="ALL">Tất cả Khoa / Đơn vị (${AppState.nurses.length} NS)</option>` +
      generateGroupedUnitsOptions("ALL", false);
  }

  renderPermissionsTable();
  modal.classList.add("active");
};

window.renderPermissionsTable = function() {
  const tbody = document.getElementById("permissions-table-tbody");
  if (!tbody) return;

  const search = (document.getElementById("perm-search-input")?.value || "").toLowerCase().trim();
  const unitFilter = document.getElementById("perm-unit-filter")?.value || "ALL";
  const roleFilter = document.getElementById("perm-role-filter")?.value || "ALL";

  const filtered = AppState.nurses.filter(n => {
    const matchSearch = !search || n.fullName.toLowerCase().includes(search) || n.code.toLowerCase().includes(search);
    const matchUnit = unitFilter === "ALL" || n.unit === unitFilter;
    const matchRole = roleFilter === "ALL" || (n.userRole || "staff") === roleFilter;
    return matchSearch && matchUnit && matchRole;
  });

  tbody.innerHTML = filtered.map((n, idx) => {
    const currentRole = n.userRole || "staff";
    let scopeNote = "";
    if (currentRole === "admin") {
      scopeNote = `<span style="color: #9a3412; font-weight: 600;">Toàn quyền 13 khoa + Phân quyền + Duyệt 3 cấp</span>`;
    } else if (currentRole === "dept_head") {
      scopeNote = `<span style="color: #0369a1; font-weight: 600;">Xem toàn viện + Ký duyệt Cấp Khoa</span>`;
    } else {
      scopeNote = `<span style="color: #15803d;">Chỉ xem nội dung trong ${n.unit}</span>`;
    }

    return `
      <tr>
        <td style="text-align: center; font-weight: 600;">${idx + 1}</td>
        <td><code>${n.code}</code></td>
        <td><strong>${n.fullName}</strong></td>
        <td><span class="status-pill" style="background: #f1f5f9; color: #334155; font-size: 0.75rem;">${n.unit}</span></td>
        <td>${n.position || 'Điều dưỡng Lâm sàng'}</td>
        <td style="text-align: center;">
          <select class="form-control" style="width: 170px; font-size: 0.8rem; font-weight: 700; margin: 0 auto;" onchange="updateMemberRole('${n.id}', this.value)">
            <option value="staff" ${currentRole === 'staff' ? 'selected' : ''}>👤 Nhân viên</option>
            <option value="dept_head" ${currentRole === 'dept_head' ? 'selected' : ''}>🩺 ĐD Trưởng Khoa</option>
            <option value="admin" ${currentRole === 'admin' ? 'selected' : ''}>👑 Admin Toàn Viện</option>
          </select>
        </td>
        <td style="text-align: center; font-size: 0.8rem;">${scopeNote}</td>
      </tr>
    `;
  }).join("");
};

window.updateMemberRole = function(nurseId, newRole) {
  const nurse = AppState.getNurse(nurseId);
  if (!nurse) return;

  nurse.userRole = newRole;
  AppState.save();
  renderPermissionsTable();
};

/* =========================================================================
   LIVE SEARCH FUNCTIONS (TÌM KIẾM THEO TỪNG KÝ TỰ LIVE REAL-TIME)
   ========================================================================= */
window.filterSelfNurseSearch = function(keyword) {
  const q = (keyword || "").toLowerCase().trim();
  const select = document.getElementById("self-eval-nurse-select");
  const unitFilter = document.getElementById("self-eval-unit-filter")?.value || "ALL";
  if (!select) return;

  const accessibleNurses = AppState.getAccessibleNurses();
  const filtered = accessibleNurses.filter(n => {
    const matchUnit = unitFilter === "ALL" || n.unit === unitFilter;
    const matchQuery = !q || n.fullName.toLowerCase().includes(q) || n.code.toLowerCase().includes(q);
    return matchUnit && matchQuery;
  });

  select.innerHTML = filtered.map(n => 
    `<option value="${n.id}" ${n.id === AppState.currentSelfNurseId ? 'selected' : ''}>${n.code} - ${n.fullName} (${n.position || n.degree})</option>`
  ).join("");

  if (filtered.length > 0 && !filtered.some(n => n.id === AppState.currentSelfNurseId)) {
    AppState.currentSelfNurseId = filtered[0].id;
    renderSelfEvaluationProfile();
    renderSelfEvaluationForm();
  }
};

window.filterManagerSearch = function(keyword) {
  renderManagerNursesTable(keyword);
};

window.filterPortfolioSearch = function(keyword) {
  const q = (keyword || "").toLowerCase().trim();
  const select = document.getElementById("portfolio-nurse-select");
  const unitFilter = document.getElementById("portfolio-unit-filter")?.value || "ALL";
  if (!select) return;

  const accessibleNurses = AppState.getAccessibleNurses();
  const filtered = accessibleNurses.filter(n => {
    const matchUnit = unitFilter === "ALL" || n.unit === unitFilter;
    const matchQuery = !q || n.fullName.toLowerCase().includes(q) || n.code.toLowerCase().includes(q);
    return matchUnit && matchQuery;
  });

  select.innerHTML = filtered.map(n => 
    `<option value="${n.id}" ${n.id === AppState.currentPortfolioNurseId ? 'selected' : ''}>${n.code} - ${n.fullName} (${n.position || n.degree})</option>`
  ).join("");

  if (filtered.length > 0 && !filtered.some(n => n.id === AppState.currentPortfolioNurseId)) {
    switchPortfolioNurse(filtered[0].id);
  }
};

window.filterAnalyticsSearch = function(keyword) {
  renderAnalyticsDashboard(keyword);
};

window.filterPortalSearch = function(keyword) {
  const q = (keyword || "").toLowerCase().trim();
  const select = document.getElementById("portal-nurse-select");
  const unitFilter = document.getElementById("portal-unit-filter")?.value || "ALL";
  if (!select) return;

  const accessibleNurses = AppState.getAccessibleNurses();
  const filtered = accessibleNurses.filter(n => {
    const matchUnit = unitFilter === "ALL" || n.unit === unitFilter;
    const matchQuery = !q || n.fullName.toLowerCase().includes(q) || n.code.toLowerCase().includes(q);
    return matchUnit && matchQuery;
  });

  select.innerHTML = filtered.map(n => 
    `<option value="${n.id}" ${n.id === AppState.currentPortalNurseId ? 'selected' : ''}>${n.code} - ${n.fullName} (${n.unit})</option>`
  ).join("");

  if (filtered.length > 0 && !filtered.some(n => n.id === AppState.currentPortalNurseId)) {
    AppState.currentPortalNurseId = filtered[0].id;
    renderPersonalPortal();
  }
};

/* =========================================================================
   3. PHÂN HỆ TỰ ĐÁNH GIÁ & UPLOAD MINH CHỨNG
   ========================================================================= */
function initSelfEvaluation() {
  const select = document.getElementById("self-eval-nurse-select");
  if (!select) return;

  refreshAllNurseSelects();

  select.addEventListener("change", (e) => {
    AppState.currentSelfNurseId = e.target.value;
    AppState.currentPortalNurseId = e.target.value;
    AppState.currentPortfolioNurseId = e.target.value;
    renderSelfEvaluationProfile();
    renderSelfEvaluationForm();
  });

  document.getElementById("btn-expand-all-domains")?.addEventListener("click", () => {
    document.querySelectorAll(".domain-body").forEach(b => b.style.display = "block");
  });

  document.getElementById("btn-save-self-eval")?.addEventListener("click", () => {
    const nurse = AppState.getNurse(AppState.currentSelfNurseId);
    if (!nurse) return;

    nurse.status = "draft";
    const evalResult = ActionPlanEngine.evaluateCompetency(nurse, nurse.selfScores);
    nurse.currentLevel = evalResult.achievedLevel;
    nurse.totalScore2025 = evalResult.totalScore;
    AppState.save();

    alert(`ĐÃ LƯU BẢN NHÁP THÀNH CÔNG!\n\nĐiều dưỡng: ${nurse.fullName}\nTổng điểm tự đánh giá: ${evalResult.totalScore} điểm\nƯớc tính cấp đạt được: Cấp ${evalResult.achievedLevel} (${evalResult.currentConfig.badge})`);
    renderSelfEvaluationProfile();
  });

  document.getElementById("btn-submit-self-eval")?.addEventListener("click", () => {
    const nurse = AppState.getNurse(AppState.currentSelfNurseId);
    if (!nurse) return;

    const evalResult = ActionPlanEngine.evaluateCompetency(nurse, nurse.selfScores);
    nurse.status = "submitted";
    nurse.currentLevel = evalResult.achievedLevel;
    nurse.totalScore2025 = evalResult.totalScore;
    nurse.submittedDate = new Date().toISOString().split("T")[0];

    if (!nurse.managerScores) {
      nurse.managerScores = JSON.parse(JSON.stringify(nurse.selfScores));
    }

    AppState.save();
    alert(`🚀 NỘP BÁO CÁO THÀNH CÔNG!\n\nHồ sơ của Điều dưỡng ${nurse.fullName} đã được chuyển tới Điều dưỡng Trưởng khoa để thẩm định 3 cấp.\nTổng điểm nộp: ${evalResult.totalScore} điểm.`);
    renderSelfEvaluationProfile();
    renderManagerNursesTable();
  });

  renderSelfEvaluationProfile();
  renderSelfEvaluationForm();
}

function renderSelfEvaluationProfile() {
  const nurse = AppState.getNurse(AppState.currentSelfNurseId);
  if (!nurse) return;

  const evalResult = ActionPlanEngine.evaluateCompetency(nurse, nurse.selfScores);
  const fw = typeof getFrameworkForUnit === "function" ? getFrameworkForUnit(nurse.unit) : null;
  const fwName = fw ? fw.name : "Điều dưỡng Lâm sàng";
  const fwMaxScore = fw ? fw.maxScore : 1025;
  const domains = fw ? fw.domains : (typeof DOMAINS_DATA !== "undefined" ? DOMAINS_DATA : []);

  const infoContainer = document.getElementById("self-eval-profile-info");
  if (infoContainer) {
    const isUnrated = evalResult.achievedLevel === 0 || evalResult.totalScore === 0;
    infoContainer.innerHTML = `
      <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: var(--radius-md); padding: 0.85rem; font-size: 0.82rem;">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.5rem;">
          <div>
            <strong style="font-size: 0.95rem; color: var(--primary-dark);">${nurse.fullName}</strong>
            <div style="color: var(--text-muted);">MSNV: <code>${nurse.code}</code> · ${nurse.gender || 'Nữ'}${nurse.evaluationYear ? ` · Năm ĐG: <strong>${nurse.evaluationYear}</strong>` : ''}</div>
          </div>
          <span class="rank-badge rank-lvl-${evalResult.achievedLevel}" style="font-size: 0.72rem; padding: 0.2rem 0.5rem;">
            ${isUnrated ? 'Chưa ĐG' : `Cấp ${evalResult.achievedLevel}`}
          </span>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.35rem; margin-top: 0.5rem; border-top: 1px dashed #cbd5e1; padding-top: 0.5rem;">
          <div><strong>Đơn vị:</strong> ${nurse.unit}</div>
          <div><strong>Chức danh:</strong> ${nurse.position || 'Điều dưỡng'}</div>
          <div><strong>Trình độ:</strong> ${nurse.degree}</div>
          <div><strong>Thâm niên:</strong> ${nurse.experienceText || nurse.experienceYears + ' năm'}</div>
          <div><strong>Điểm thi TB:</strong> ${nurse.examScore}</div>
          <div><strong>NCKH/Giảng:</strong> ${nurse.hasTeachingResearch ? 'Có' : 'Chưa'}</div>
        </div>

        <div style="margin-top: 0.75rem; display: flex; gap: 0.4rem;">
          <button class="btn btn-sm btn-outline" style="flex: 1; font-size: 0.72rem; padding: 0.25rem 0.4rem;" onclick="openEditNurseModal('${nurse.id}')">
            ✏️ Sửa thông tin
          </button>
          <button class="btn btn-sm btn-danger" style="font-size: 0.72rem; padding: 0.25rem 0.5rem;" onclick="deleteNurse('${nurse.id}')" title="Xóa nhân sự này nếu nhập sai">
            🗑️ Xóa
          </button>
        </div>
      </div>
    `;
  }

  // Display Total Score & Level Pill
  const totalDisplay = document.getElementById("self-eval-total-display");
  if (totalDisplay) totalDisplay.textContent = evalResult.totalScore;

  const predictedLevel = document.getElementById("self-eval-predicted-level");
  if (predictedLevel) {
    if (evalResult.achievedLevel === 0 || evalResult.totalScore === 0) {
      predictedLevel.innerHTML = `
        <span class="rank-badge rank-lvl-0" style="padding: 0.25rem 0.6rem; font-weight: 700;">
          ⏳ Chưa tự đánh giá (0đ)
        </span>
      `;
    } else {
      predictedLevel.innerHTML = `
        <span class="rank-badge rank-lvl-${evalResult.achievedLevel}">
          ${evalResult.currentConfig.icon} Cấp ${evalResult.achievedLevel} - ${evalResult.currentConfig.badge}
        </span>
      `;
    }
  }

  const statusPill = document.getElementById("self-eval-status-pill");
  if (statusPill) {
    if (nurse.status === "hospital_decided") {
      statusPill.className = "status-pill status-approved";
      statusPill.textContent = "🏛️ Đã có QĐ Bệnh viện";
    } else if (nurse.status === "nursing_board_approved") {
      statusPill.className = "status-pill status-submitted";
      statusPill.textContent = "🏥 Ban ĐD đã duyệt";
    } else if (nurse.status === "dept_approved") {
      statusPill.className = "status-pill status-submitted";
      statusPill.textContent = "🩺 ĐD Trưởng đã duyệt";
    } else if (nurse.status === "submitted") {
      statusPill.className = "status-pill status-submitted";
      statusPill.textContent = "⏳ Chờ thẩm định";
    } else {
      statusPill.className = "status-pill status-draft";
      statusPill.textContent = evalResult.totalScore === 0 ? "📝 Chưa tự đánh giá" : "📝 Bản nháp";
    }
  }

  // Domain score breakdown
  const domainBreakdown = document.getElementById("self-eval-domain-breakdown");
  if (domainBreakdown) {
    domainBreakdown.innerHTML = domains.map(d => {
      const dScore = evalResult.domainScores[d.id] || 0;
      const pct = Math.min(100, (dScore / (d.maxScore || 100)) * 100).toFixed(0);
      return `
        <div style="margin-bottom: 0.5rem; font-size: 0.78rem;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 0.15rem;">
            <span><strong>${d.code}</strong>: ${d.name}</span>
            <span style="font-weight: 700; color: var(--primary);">${dScore} / ${d.maxScore}đ</span>
          </div>
          <div style="background: #e2e8f0; border-radius: 4px; height: 6px; overflow: hidden;">
            <div style="background: var(--primary); width: ${pct}%; height: 100%;"></div>
          </div>
        </div>
      `;
    }).join("");
  }
}

function renderSelfEvaluationForm() {
  const container = document.getElementById("self-eval-domains-container") || document.getElementById("self-eval-domains-accordion");
  if (!container) return;

  const nurse = AppState.getNurse(AppState.currentSelfNurseId);
  if (!nurse) return;

  const fw = typeof getFrameworkForUnit === "function" ? getFrameworkForUnit(nurse.unit) : null;
  const domains = fw ? fw.domains : (typeof DOMAINS_DATA !== "undefined" ? DOMAINS_DATA : []);

  // Tính toán tiến độ hoàn thành
  let totalCriteria = 0;
  let scoredCount = 0;
  let evidenceCount = 0;
  domains.forEach(d => d.standards.forEach(s => s.criteria.forEach(c => {
    totalCriteria++;
    const hasSpecificScore = nurse.selfScores && nurse.selfScores[c.id] !== undefined && nurse.selfScores[c.id] !== null;
    const hasScore = hasSpecificScore && Number(nurse.selfScores[c.id]) > 0;
    const hasEvidence = (nurse.evidences || []).some(e => e.criterionId === c.id);
    if (hasScore) scoredCount++;
    if (hasEvidence) evidenceCount++;
  })));

  const progressPct = totalCriteria > 0 ? Math.round((scoredCount / totalCriteria) * 100) : 0;
  const evidencePct = totalCriteria > 0 ? Math.round((evidenceCount / totalCriteria) * 100) : 0;

  container.innerHTML = `
    <div style="background: linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%); border: 1.5px solid #86efac; border-radius: 12px; padding: 1rem 1.25rem; margin-bottom: 1.25rem;">
      <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 0.75rem;">
        <div>
          <strong style="color: #166534; font-size: 1rem;">📋 ${fw ? fw.name : 'Điều dưỡng Lâm sàng'}</strong>
          <div style="font-size: 0.8rem; color: #15803d; margin-top: 2px;">Khoa/Đơn vị: <strong>${nurse.unit}</strong>${nurse.evaluationYear ? ` · Năm đánh giá: <strong>${nurse.evaluationYear}</strong>` : ''}</div>
        </div>
        <span style="background: #dcfce7; color: #166534; font-weight: 800; font-size: 0.88rem; padding: 0.35rem 0.85rem; border-radius: 8px; border: 1.5px solid #86efac;">
          ${fw ? fw.totalCriteria : 66} Tiêu chí · Tối đa ${fw ? fw.maxScore : 1000}đ
        </span>
      </div>

      <!-- Thanh tiến độ -->
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem;">
        <div>
          <div style="display: flex; justify-content: space-between; font-size: 0.78rem; font-weight: 600; color: #475569; margin-bottom: 3px;">
            <span id="self-eval-scored-label">✏️ Đã chấm điểm: ${scoredCount}/${totalCriteria}</span>
            <span id="self-eval-scored-pct">${progressPct}%</span>
          </div>
          <div style="height: 8px; background: #e2e8f0; border-radius: 4px; overflow: hidden;">
            <div id="self-eval-scored-bar" style="height: 100%; width: ${progressPct}%; background: linear-gradient(90deg, #3b82f6, #2563eb); border-radius: 4px; transition: width 0.3s;"></div>
          </div>
        </div>
        <div>
          <div style="display: flex; justify-content: space-between; font-size: 0.78rem; font-weight: 600; color: #475569; margin-bottom: 3px;">
            <span>📎 Minh chứng: ${evidenceCount}/${totalCriteria}</span>
            <span>${evidencePct}%</span>
          </div>
          <div style="height: 8px; background: #e2e8f0; border-radius: 4px; overflow: hidden;">
            <div style="height: 100%; width: ${evidencePct}%; background: linear-gradient(90deg, #f59e0b, #d97706); border-radius: 4px; transition: width 0.3s;"></div>
          </div>
        </div>
      </div>

      <!-- Chú thích trạng thái -->
      <div style="display: flex; gap: 1rem; margin-top: 0.6rem; font-size: 0.73rem; color: #64748b;">
        <span>⬜ Chưa đánh giá</span>
        <span>🟡 Đã chấm điểm (chưa có minh chứng)</span>
        <span>✅ Hoàn thành (có điểm + minh chứng)</span>
      </div>
    </div>
  ` + domains.map(domain => {
    const { domainScores } = ActionPlanEngine.calculateScores(nurse.selfScores, nurse.unit);
    const dScore = domainScores[domain.id] || 0;

    // Đếm tiêu chí trong domain
    let domainCritCount = 0;
    let domainScoredCount = 0;
    domain.standards.forEach(s => s.criteria.forEach(c => {
      domainCritCount++;
      const hasSpecificScore = nurse.selfScores && nurse.selfScores[c.id] !== undefined && nurse.selfScores[c.id] !== null;
      if (hasSpecificScore && Number(nurse.selfScores[c.id]) > 0) domainScoredCount++;
    }));

    return `
      <div class="domain-card" id="domain-card-${domain.id}">
        <div class="domain-header" onclick="toggleDomainAccordion('${domain.id}')">
          <div class="domain-title">
            <span class="domain-code">${domain.code}</span>
            <span>${domain.name}</span>
            <span style="font-size: 0.73rem; color: #64748b; font-weight: 500; margin-left: 0.25rem;">(${domainCritCount} tiêu chí · ${domainScoredCount}/${domainCritCount} đã chấm)</span>
          </div>
          <div class="domain-score-tag">
            <span id="domain-header-score-${domain.id}">${dScore}</span> / ${domain.maxScore}đ
            <span class="accordion-arrow">▼</span>
          </div>
        </div>

        <div class="domain-body" id="domain-body-${domain.id}" style="display: block;">
          ${domain.standards.map(standard => `
            <div class="standard-group">
              <div class="standard-title">📌 Tiêu chuẩn ${standard.code}: ${standard.name} (${standard.criteria.length} tiêu chí)</div>
              ${standard.criteria.map(criterion => renderCriterionItem(criterion, nurse)).join("")}
            </div>
          `).join("")}
        </div>
      </div>
    `;
  }).join("");
}

function renderCriterionItem(criterion, nurse) {
  const hasSpecificScore = nurse.selfScores && nurse.selfScores[criterion.id] !== undefined && nurse.selfScores[criterion.id] !== null;
  const currentScore = hasSpecificScore ? Number(nurse.selfScores[criterion.id]) : 0;
  const attachedEvidences = (nurse.evidences || []).filter(e => e.criterionId === criterion.id);
  const hasScore = hasSpecificScore && currentScore > 0;
  const hasEvidence = attachedEvidences.length > 0;

  // Xác định trạng thái hoàn thành
  let statusIcon = "⬜";
  let statusClass = "";
  if (hasScore && hasEvidence) { statusIcon = "✅"; statusClass = "crit-complete"; }
  else if (hasScore) { statusIcon = "🟡"; statusClass = "crit-scored"; }

  let inputControlsHtml = "";

  if (criterion.options && criterion.options.length > 0) {
    inputControlsHtml = `
      <div class="rubric-options-grid">
        <div style="font-size: 0.75rem; font-weight: 700; color: #64748b; margin-bottom: 2px; text-transform: uppercase; letter-spacing: 0.5px;">
          📋 Chọn mức đánh giá (${criterion.options.length} mức):
        </div>
        ${criterion.options.map((opt, idx) => {
          const isChecked = hasSpecificScore && currentScore === opt.score;
          return `
          <label class="rubric-option-label ${isChecked ? 'selected' : ''}">
            <span class="rubric-option-text">${opt.label}</span>
            <div class="rubric-option-action">
              <span class="rubric-option-level">+${opt.score}đ</span>
              <input type="radio" name="crit_${criterion.id}" value="${opt.score}" 
                ${isChecked ? 'checked' : ''} 
                onchange="handleScoreChange(${criterion.id}, ${opt.score})">
            </div>
          </label>
        `;}).join("")}
      </div>
    `;
  } else if (criterion.type === "level_5" && criterion.levels) {
    inputControlsHtml = `
      <div class="rubric-options-grid">
        <div style="font-size: 0.75rem; font-weight: 700; color: #64748b; margin-bottom: 2px; text-transform: uppercase; letter-spacing: 0.5px;">
          📋 Chọn mức đánh giá (${criterion.levels.length} mức):
        </div>
        ${criterion.levels.map(lvl => {
          const isChecked = hasSpecificScore && currentScore === lvl.score;
          return `
          <label class="rubric-option-label ${isChecked ? 'selected' : ''}">
            <span class="rubric-option-text">${lvl.text}</span>
            <div class="rubric-option-action">
              <span class="rubric-option-level">Mức ${lvl.level} · ${lvl.score}đ</span>
              <input type="radio" name="crit_${criterion.id}" value="${lvl.score}" 
                ${isChecked ? 'checked' : ''} 
                onchange="handleScoreChange(${criterion.id}, ${lvl.score})">
            </div>
          </label>
        `;}).join("")}
      </div>
    `;
  } else {
    inputControlsHtml = `
      <div style="padding: 0.75rem 1rem;">
        <div style="display: flex; align-items: center; justify-content: space-between; gap: 0.75rem; background: #f8fafc; padding: 0.65rem 0.85rem; border-radius: 8px; border: 1px solid #e2e8f0;">
          <label style="font-size: 0.82rem; font-weight: 600; color: #475569; white-space: nowrap;">Nhập điểm tự đánh giá:</label>
          <div style="display: flex; align-items: center; gap: 0.5rem;">
            <input type="number" min="0" max="${criterion.maxScore}" class="form-control" 
              style="width: 90px; text-align: center; font-weight: 700; font-size: 1rem; border: 1.5px solid #cbd5e1; border-radius: 6px; padding: 0.35rem;"
              value="${hasSpecificScore ? currentScore : 0}" onchange="handleScoreChange(${criterion.id}, this.value)">
            <span style="font-size: 0.8rem; color: #94a3b8; font-weight: 600;">/ ${criterion.maxScore}đ</span>
          </div>
        </div>
      </div>
    `;
  }

  // Phần minh chứng
  const evidenceHtml = `
    <div class="evidence-pill-box">
      <div style="display: flex; align-items: center; gap: 0.4rem; flex-shrink: 0;">
        <span style="font-size: 0.82rem; font-weight: 700; color: #92400e;">📎 Minh chứng</span>
        <span style="font-size: 0.7rem; font-weight: 700; background: ${hasEvidence ? '#dcfce7' : '#fef3c7'}; color: ${hasEvidence ? '#166534' : '#92400e'}; padding: 1px 8px; border-radius: 10px; border: 1px solid ${hasEvidence ? '#86efac' : '#fcd34d'};">
          ${attachedEvidences.length} file
        </span>
      </div>
      ${attachedEvidences.length > 0 ? `
        <div style="display: flex; flex-wrap: wrap; gap: 0.35rem; flex: 1;">
          ${attachedEvidences.map(ev => `
            <div class="evidence-tag">
              <span title="${ev.fileName}">📄 ${ev.fileName}</span>
              <button type="button" class="evidence-tag-preview" onclick="previewEvidenceDoc('${ev.fileName}')" title="Bấm để xem file minh chứng này">👁️ Xem</button>
              <button type="button" class="evidence-tag-delete" onclick="removeEvidenceDoc(${criterion.id}, '${ev.fileName}')" title="Xóa file này">✕</button>
            </div>
          `).join("")}
        </div>
      ` : ''}
      <div style="display: flex; gap: 0.35rem; flex-shrink: 0;">
        <button class="btn btn-sm" 
          style="font-size: 0.75rem; padding: 0.25rem 0.65rem; background: #ffffff; border: 1.5px solid #f59e0b; color: #92400e; font-weight: 700; border-radius: 6px; cursor: pointer;"
          onclick="openEvidenceModal(${criterion.id})">
          📁 Tải file minh chứng
        </button>
      </div>
    </div>
  `;

  return `
    <div class="criterion-item ${statusClass}" id="crit-item-${criterion.id}">
      <div class="criterion-header">
        <div class="criterion-name">
          <span class="criterion-id-badge">${statusIcon} TC ${criterion.id}</span>
          <span>${criterion.name}</span>
        </div>
        <div class="criterion-score-badge" id="crit-score-display-${criterion.id}">
          ${hasSpecificScore ? currentScore : 0} / ${criterion.maxScore}đ
        </div>
      </div>

      ${inputControlsHtml}

      ${evidenceHtml}
    </div>
  `;
}

window.toggleDomainAccordion = function(domainId) {
  const body = document.getElementById(`domain-body-${domainId}`);
  if (body) {
    const isHidden = body.style.display === "none";
    body.style.display = isHidden ? "block" : "none";
  }
};

window.handleScoreChange = function(criterionId, newScore) {
  const nurse = AppState.getNurse(AppState.currentSelfNurseId);
  if (!nurse) return;

  if (!nurse.selfScores) nurse.selfScores = {};
  nurse.selfScores[criterionId] = Number(newScore) || 0;

  // Cập nhật hiển thị điểm tiêu chí
  const critEl = document.getElementById(`crit-score-display-${criterionId}`);
  const critObj = findCriterionById(criterionId, nurse.unit);
  if (critEl && critObj) {
    critEl.textContent = `${nurse.selfScores[criterionId]} / ${critObj.maxScore}đ`;
  }

  // Cập nhật radio selected style
  const critItem = document.getElementById(`crit-item-${criterionId}`);
  if (critItem) {
    critItem.querySelectorAll(".rubric-option-label").forEach(lbl => {
      const radio = lbl.querySelector("input[type='radio']");
      if (radio && Number(radio.value) === Number(newScore)) {
        lbl.classList.add("selected");
      } else {
        lbl.classList.remove("selected");
      }
    });

    // Cập nhật trạng thái hoàn thành (icon + border)
    const score = Number(newScore) || 0;
    const hasEvidence = (nurse.evidences || []).some(e => e.criterionId === criterionId);
    critItem.classList.remove("crit-complete", "crit-scored");
    const idBadge = critItem.querySelector(".criterion-id-badge");
    if (score > 0 && hasEvidence) {
      critItem.classList.add("crit-complete");
      if (idBadge) idBadge.innerHTML = idBadge.innerHTML.replace(/^[⬜🟡✅]\s*/, "✅ ");
    } else if (score > 0) {
      critItem.classList.add("crit-scored");
      if (idBadge) idBadge.innerHTML = idBadge.innerHTML.replace(/^[⬜🟡✅]\s*/, "🟡 ");
    } else {
      if (idBadge) idBadge.innerHTML = idBadge.innerHTML.replace(/^[⬜🟡✅]\s*/, "⬜ ");
    }
  }

  // Cập nhật điểm các lĩnh vực trong accordion headers
  const fw = typeof getFrameworkForUnit === "function" ? getFrameworkForUnit(nurse.unit) : null;
  const domains = fw ? fw.domains : (typeof DOMAINS_DATA !== "undefined" ? DOMAINS_DATA : []);
  const { domainScores } = ActionPlanEngine.calculateScores(nurse.selfScores, nurse.unit);
  domains.forEach(d => {
    const headerScoreEl = document.getElementById(`domain-header-score-${d.id}`);
    if (headerScoreEl) {
      headerScoreEl.textContent = domainScores[d.id] || 0;
    }
  });

  AppState.save();
  renderSelfEvaluationProfile();
};



/* =========================================================================
   4. PHÂN HỆ QUẢN LÝ THẨM ĐỊNH 3 CẤP (BỆNH VIỆN ĐHYD TP.HCM)
   ========================================================================= */
function initManagerReview() {
  const unitFilter = document.getElementById("manager-unit-filter");
  const statusFilter = document.getElementById("review-filter-status");

  unitFilter?.addEventListener("change", renderManagerNursesTable);
  statusFilter?.addEventListener("change", renderManagerNursesTable);

  document.getElementById("btn-close-review-detail")?.addEventListener("click", () => {
    document.getElementById("manager-review-detail-panel").style.display = "none";
  });

  document.getElementById("btn-save-manager-scores")?.addEventListener("click", () => {
    const nurse = AppState.getNurse(AppState.currentReviewNurseId);
    if (!nurse) return;
    nurse.managerFeedback = document.getElementById("manager-feedback-input")?.value || "";
    AppState.save();
    alert(`ĐÃ LƯU ĐIỂM THẨM ĐỊNH CHO ${nurse.fullName}!`);
    renderManagerNursesTable();
    renderReviewDetailCriteria();
  });
}

function renderManagerNursesTable(customKeyword) {
  const isStaff = AppState.currentUser && AppState.currentUser.role === "staff";
  const userUnit = AppState.currentUser ? AppState.currentUser.unit : null;

  const selectedUnit = isStaff ? userUnit : (document.getElementById("manager-unit-filter")?.value || "ALL");
  const filterStatus = document.getElementById("review-filter-status")?.value || "all";
  const search = typeof customKeyword === "string" ? customKeyword.toLowerCase().trim() : (document.getElementById("manager-search-input")?.value || "").toLowerCase().trim();

  const nursesInUnit = selectedUnit === "ALL" ? AppState.nurses : AppState.nurses.filter(n => n.unit === selectedUnit);
  const total = nursesInUnit.length;

  const progressTitleEl = document.getElementById("manager-progress-title");
  if (progressTitleEl) {
    progressTitleEl.textContent = selectedUnit === "ALL" 
      ? "Tiến Độ Tự Đánh Giá & Kiểm Duyệt Năng Lực Toàn Bệnh Viện" 
      : `Tiến Độ Tự Đánh Giá & Kiểm Duyệt Năng Lực (${selectedUnit})`;
  }

  // 1. Tính toán số liệu Dashboard tiến độ khoa
  const countSubmitted = nursesInUnit.filter(n => n.status === "submitted" || n.status === "dept_approved" || n.status === "nursing_board_approved" || n.status === "hospital_decided").length;
  const countDept = nursesInUnit.filter(n => n.status === "dept_approved" || n.status === "nursing_board_approved" || n.status === "hospital_decided").length;
  const countBoard = nursesInUnit.filter(n => n.status === "nursing_board_approved" || n.status === "hospital_decided").length;
  const countHospital = nursesInUnit.filter(n => n.status === "hospital_decided").length;

  const deptDashboard = document.getElementById("dept-progress-dashboard");
  if (deptDashboard) {
    deptDashboard.innerHTML = `
      <div class="dept-progress-item" style="border-left: 4px solid #64748b;">
        <div class="dept-progress-count" style="color: #334155;">${countSubmitted} / ${total}</div>
        <div class="dept-progress-label">Đã nộp tự đánh giá (${total > 0 ? ((countSubmitted / total) * 100).toFixed(0) : 0}%)</div>
      </div>
      <div class="dept-progress-item" style="border-left: 4px solid var(--primary);">
        <div class="dept-progress-count" style="color: var(--primary);">${countDept} / ${total}</div>
        <div class="dept-progress-label">ĐD Trưởng Khoa duyệt (${total > 0 ? ((countDept / total) * 100).toFixed(0) : 0}%)</div>
      </div>
      <div class="dept-progress-item" style="border-left: 4px solid #8b5cf6;">
        <div class="dept-progress-count" style="color: #8b5cf6;">${countBoard} / ${total}</div>
        <div class="dept-progress-label">Ban Điều Dưỡng duyệt (${total > 0 ? ((countBoard / total) * 100).toFixed(0) : 0}%)</div>
      </div>
      <div class="dept-progress-item" style="border-left: 4px solid var(--success);">
        <div class="dept-progress-count" style="color: var(--success);">${countHospital} / ${total}</div>
        <div class="dept-progress-label">QĐ Bệnh Viện ban hành (${total > 0 ? ((countHospital / total) * 100).toFixed(0) : 0}%)</div>
      </div>
    `;
  }

  // Pipeline bar
  const pipelineBar = document.getElementById("dept-pipeline-bar");
  if (pipelineBar && total > 0) {
    const p1 = (countSubmitted / total) * 25;
    const p2 = (countDept / total) * 25;
    const p3 = (countBoard / total) * 25;
    const p4 = (countHospital / total) * 25;
    pipelineBar.innerHTML = `
      <div style="background: #3b82f6; width: ${p1}%;" title="Đã nộp"></div>
      <div style="background: #0284c7; width: ${p2}%;" title="ĐD Trưởng duyệt"></div>
      <div style="background: #8b5cf6; width: ${p3}%;" title="Ban ĐD duyệt"></div>
      <div style="background: #10b981; width: ${p4}%;" title="Bệnh viện QĐ"></div>
    `;
  }

  // 2. Render bảng danh sách nhân sự (Khớp 100% các cột)
  const tbody = document.getElementById("manager-nurses-tbody");
  if (!tbody) return;

  const filteredNurses = nursesInUnit.filter(n => {
    const matchStatus = filterStatus === "all" || n.status === filterStatus;
    const matchSearch = !search || n.fullName.toLowerCase().includes(search) || n.code.toLowerCase().includes(search);
    return matchStatus && matchSearch;
  });

  tbody.innerHTML = filteredNurses.map((n, idx) => {
    const evalSelf = ActionPlanEngine.evaluateCompetency(n, n.selfScores);
    const evalManager = ActionPlanEngine.evaluateCompetency(n, n.managerScores || n.selfScores);

    let workflowStatusHtml = "";
    if (n.status === "hospital_decided") {
      workflowStatusHtml = `<span class="step-badge badge-done">🏛️ Đã có QĐ BV (#${n.approvalWorkflow?.hospital?.decisionNumber || '128/QĐ'})</span>`;
    } else if (n.status === "nursing_board_approved") {
      workflowStatusHtml = `<span class="step-badge badge-waiting">🏥 Ban ĐD duyệt (Chờ QĐ BV)</span>`;
    } else if (n.status === "dept_approved") {
      workflowStatusHtml = `<span class="step-badge badge-waiting">🩺 ĐD Trưởng duyệt (Chờ Ban ĐD)</span>`;
    } else if (n.status === "submitted") {
      workflowStatusHtml = `<span class="step-badge badge-waiting">📝 Chờ ĐD Trưởng thẩm định</span>`;
    } else {
      workflowStatusHtml = `<span class="step-badge badge-locked">⏳ Bản nháp (Chưa nộp)</span>`;
    }

    const canDelete = AppState.currentUser.role === "admin" || (AppState.currentUser.role === "dept_head" && AppState.currentUser.unit === n.unit);

    return `
      <tr>
        <td style="text-align: center; font-weight: 600;">${idx + 1}</td>
        <td><code>${n.code}</code></td>
        <td><strong>${n.fullName}</strong></td>
        <td><span class="status-pill" style="background: #f1f5f9; color: #334155; font-size: 0.75rem;">${n.unit}</span></td>
        <td>${n.degree}</td>
        <td>${n.experienceText || n.experienceYears + " năm"}</td>
        <td style="text-align: center; font-weight: 700; color: var(--primary);">${evalSelf.totalScore > 0 ? evalSelf.totalScore + 'đ' : '<span style="color: #94a3b8; font-weight: normal;">0đ</span>'}</td>
        <td style="text-align: center; font-weight: 700; color: var(--secondary);">${evalManager.totalScore > 0 ? evalManager.totalScore + 'đ' : '<span style="color: #94a3b8; font-weight: normal;">0đ</span>'}</td>
        <td style="text-align: center;">
          <span class="rank-badge rank-lvl-${evalManager.achievedLevel}">
            ${evalManager.achievedLevel === 0 ? 'Chưa ĐG' : `Cấp ${evalManager.achievedLevel}`}
          </span>
        </td>
        <td style="text-align: center;">${workflowStatusHtml}</td>
        <td style="text-align: center;">
          <div style="display: flex; justify-content: center; gap: 0.35rem; flex-wrap: wrap;">
            <button class="btn btn-sm btn-primary" onclick="openNurseReviewDetail('${n.id}')">
              ⚖️ Thẩm định
            </button>
            <button class="btn btn-sm btn-outline" title="Chỉnh sửa thông tin" onclick="openEditNurseModal('${n.id}')">
              ✏️
            </button>
            ${canDelete ? `
              <button class="btn btn-sm btn-danger" title="Xóa nhân sự khi nhập sai" onclick="deleteNurse('${n.id}')">
                🗑️
              </button>
            ` : ''}
          </div>
        </td>
      </tr>
    `;
  }).join("");
}

window.openNurseReviewDetail = function(nurseId) {
  AppState.currentReviewNurseId = nurseId;
  const nurse = AppState.getNurse(nurseId);
  if (!nurse) return;

  if (!nurse.managerScores) {
    nurse.managerScores = JSON.parse(JSON.stringify(nurse.selfScores || {}));
  }

  const detailPanel = document.getElementById("manager-review-detail-panel");
  detailPanel.style.display = "block";
  detailPanel.scrollIntoView({ behavior: "smooth" });

  document.getElementById("review-detail-title").textContent = `Thẩm định chi tiết: ${nurse.fullName}`;
  document.getElementById("review-detail-meta").textContent = `MSNV: ${nurse.code} | Đơn vị: ${nurse.unit} | Trình độ: ${nurse.degree} | Thâm niên: ${nurse.experienceText || nurse.experienceYears + " năm"}`;
  
  const feedbackInput = document.getElementById("manager-feedback-input");
  if (feedbackInput) feedbackInput.value = nurse.managerFeedback || "";

  renderReviewDetailCriteria();
};

function renderReviewDetailCriteria() {
  const nurse = AppState.getNurse(AppState.currentReviewNurseId);
  if (!nurse) return;

  const evalManager = ActionPlanEngine.evaluateCompetency(nurse, nurse.managerScores);
  const evalSelf = ActionPlanEngine.evaluateCompetency(nurse, nurse.selfScores);

  // Summary banner
  const banner = document.getElementById("review-summary-banner");
  if (banner) {
    banner.innerHTML = `
      <div class="score-banner-item">
        <div class="score-banner-val" style="color: var(--primary);">${evalSelf.totalScore}đ</div>
        <div class="score-banner-label">Điểm Tự Đánh Giá</div>
      </div>
      <div class="score-banner-item">
        <div class="score-banner-val" style="color: var(--secondary);">${evalManager.totalScore}đ</div>
        <div class="score-banner-label">Điểm Quản Lý Thẩm Định</div>
      </div>
      <div class="score-banner-item">
        <div class="score-banner-val">
          <span class="rank-badge rank-lvl-${evalManager.achievedLevel}" style="font-size: 1.1rem; padding: 0.4rem 1rem;">
            ${evalManager.currentConfig.icon} CẤP ${evalManager.achievedLevel} (${evalManager.currentConfig.badge})
          </span>
        </div>
        <div class="score-banner-label">Phân Cấp Năng Lực Đề Xuất</div>
      </div>
    `;
  }

  // 3-TIER APPROVAL WORKFLOW ACTION BOX
  const workflowBox = document.getElementById("approval-workflow-steps");
  if (workflowBox) {
    const wf = nurse.approvalWorkflow || {};
    const isDeptDone = wf.dept && wf.dept.approved;
    const isBoardDone = wf.nursingBoard && wf.nursingBoard.approved;
    const isHospDone = wf.hospital && wf.hospital.decided;

    const canApproveDept = AppState.currentUser.role === "admin" || AppState.currentUser.role === "dept_head";
    const canApproveBoard = AppState.currentUser.role === "admin";
    const canDecideHospital = AppState.currentUser.role === "admin";

    workflowBox.innerHTML = `
      <!-- CẤP 1: ĐIỀU DƯỠNG TRƯỞNG KHOA -->
      <div class="approval-step-card ${isDeptDone ? 'step-approved' : 'step-active'}">
        <div class="step-header">
          <strong>1. ĐD Trưởng Khoa</strong>
          <span class="step-badge ${isDeptDone ? 'badge-done' : 'badge-waiting'}">
            ${isDeptDone ? '✅ Đã duyệt' : '⏳ Chờ duyệt'}
          </span>
        </div>
        <div class="step-body">
          ${isDeptDone ? `
            <div><strong>Người ký:</strong> ${wf.dept.reviewer}</div>
            <div style="font-size: 0.75rem; color: var(--text-muted);">Ngày: ${wf.dept.date}</div>
            <div style="font-style: italic; margin-top: 0.25rem;">"${wf.dept.note || 'Đạt chuẩn'}"</div>
          ` : `
            <p style="font-size: 0.8rem; color: var(--text-muted);">Thẩm định điểm chi tiết, rà soát minh chứng và ký đề xuất cấp độ.</p>
            <button class="btn btn-sm btn-primary" style="width: 100%; margin-top: 0.5rem;" ${!canApproveDept ? 'disabled title="Chỉ ĐD Trưởng hoặc Admin mới có quyền duyệt"' : ''} onclick="approveByDept('${nurse.id}')">
              🩺 Ký Duyệt Cấp Khoa
            </button>
          `}
        </div>
      </div>

      <!-- CẤP 2: BAN ĐIỀU DƯỠNG BỆNH VIỆN -->
      <div class="approval-step-card ${isBoardDone ? 'step-approved' : (isDeptDone ? 'step-active' : '')}">
        <div class="step-header">
          <strong>2. Ban Điều Dưỡng</strong>
          <span class="step-badge ${isBoardDone ? 'badge-done' : (isDeptDone ? 'badge-waiting' : 'badge-locked')}">
            ${isBoardDone ? '✅ Đã duyệt' : (isDeptDone ? '⏳ Chờ thẩm định' : '🔒 Khóa')}
          </span>
        </div>
        <div class="step-body">
          ${isBoardDone ? `
            <div><strong>Người duyệt:</strong> ${wf.nursingBoard.reviewer}</div>
            <div style="font-size: 0.75rem; color: var(--text-muted);">Ngày: ${wf.nursingBoard.date}</div>
            <div style="font-style: italic; margin-top: 0.25rem;">"${wf.nursingBoard.note || 'Thông qua'}"</div>
          ` : `
            <p style="font-size: 0.8rem; color: var(--text-muted);">Hội đồng Ban Điều Dưỡng rà soát chuẩn 5 tiêu chuẩn bắt buộc.</p>
            <button class="btn btn-sm btn-success" style="width: 100%; margin-top: 0.5rem;" ${(!isDeptDone || !canApproveBoard) ? 'disabled title="Cần hoàn tất Cấp Khoa và quyền Admin/Ban ĐD"' : ''} onclick="approveByNursingBoard('${nurse.id}')">
              🏥 Ban ĐD Phê Duyệt
            </button>
          `}
        </div>
      </div>

      <!-- CẤP 3: QUYẾT ĐỊNH BỆNH VIỆN -->
      <div class="approval-step-card ${isHospDone ? 'step-approved' : (isBoardDone ? 'step-active' : '')}">
        <div class="step-header">
          <strong>3. Quyết Định BV</strong>
          <span class="step-badge ${isHospDone ? 'badge-done' : (isBoardDone ? 'badge-waiting' : 'badge-locked')}">
            ${isHospDone ? '🏆 Đã ra QĐ' : (isBoardDone ? '⏳ Chờ QĐ' : '🔒 Khóa')}
          </span>
        </div>
        <div class="step-body">
          ${isHospDone ? `
            <div><strong>Số QĐ:</strong> <span style="color: var(--primary); font-weight: 700;">${wf.hospital.decisionNumber}</span></div>
            <div><strong>Người ký:</strong> ${wf.hospital.signer}</div>
            <div style="font-size: 0.75rem; color: var(--text-muted);">Ngày ban hành: ${wf.hospital.date}</div>
          ` : `
            <p style="font-size: 0.8rem; color: var(--text-muted);">Ban Giám đốc ký Quyết định công nhận phân cấp năng lực chính thức.</p>
            <button class="btn btn-sm btn-success" style="width: 100%; margin-top: 0.5rem;" ${(!isBoardDone || !canDecideHospital) ? 'disabled title="Cần thông qua Ban ĐD và quyền Admin"' : ''} onclick="decideByHospital('${nurse.id}')">
              🏛️ Ban Hành Quyết Định
            </button>
          `}
        </div>
      </div>
    `;
  }

  // Render criteria comparison with Rubrics according to department framework
  const container = document.getElementById("review-criteria-container");
  if (container) {
    const fw = typeof getFrameworkForUnit === "function" ? getFrameworkForUnit(nurse.unit) : null;
    const domains = fw ? fw.domains : (typeof DOMAINS_DATA !== "undefined" ? DOMAINS_DATA : []);

    container.innerHTML = `
      <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: var(--radius-md); padding: 0.75rem 1rem; margin-bottom: 1rem; display: flex; justify-content: space-between; align-items: center;">
        <div>
          <strong style="color: #166534; font-size: 0.95rem;">Bộ Chuẩn Thẩm Định: ${fw ? fw.name : 'Điều dưỡng Lâm sàng'}</strong>
          <div style="font-size: 0.8rem; color: #15803d;">Khoa công tác: ${nurse.unit}</div>
        </div>
        <span class="status-pill status-approved" style="font-size: 0.85rem; font-weight: 800;">
          Tổng: ${fw ? fw.totalCriteria : 66} Tiêu chí (Tối đa ${fw ? fw.maxScore : 1000}đ)
        </span>
      </div>
    ` + domains.map(domain => `
      <div class="card" style="margin-bottom: 1rem; padding: 1rem;">
        <h4 style="font-size: 1rem; font-weight: 700; color: var(--primary-dark); margin-bottom: 0.75rem;">
          LĨNH VỰC ${domain.code}: ${domain.name}
        </h4>
        <div class="review-table-container">
          <table class="review-table">
            <thead>
              <tr>
                <th style="width: 50px;">TC</th>
                <th>Tên Tiêu chí, Yêu cầu & Chuẩn Rubric</th>
                <th style="width: 130px; text-align: center;">Điểm Tự ĐG</th>
                <th style="width: 160px; text-align: center;">Minh chứng</th>
                <th style="width: 130px; text-align: center;">Quản lý Chấm</th>
              </tr>
            </thead>
            <tbody>
              ${domain.standards.flatMap(std => std.criteria.map(crit => {
                const sScore = nurse.selfScores && nurse.selfScores[crit.id] !== undefined ? nurse.selfScores[crit.id] : 0;
                const mScore = nurse.managerScores && nurse.managerScores[crit.id] !== undefined ? nurse.managerScores[crit.id] : sScore;
                const attachedEvidences = (nurse.evidences || []).filter(e => e.criterionId === crit.id);

                return `
                  <tr>
                    <td style="text-align: center; font-weight: 700;">${crit.id}</td>
                    <td>
                      <div style="font-weight: 600;">${crit.name}</div>
                      <div style="font-size: 0.75rem; color: var(--text-muted);">Tối đa: ${crit.maxScore}đ</div>
                      
                      <!-- Inline Rubric Helper for Manager -->
                      <div style="margin-top: 0.35rem;">
                        <span class="rubric-help-toggle" style="font-size: 0.7rem; padding: 0.15rem 0.4rem;" onclick="toggleManagerRubric(${crit.id})">
                          📖 Xem chuẩn chấm Rubric (${crit.options ? crit.options.length : 0} mức)
                        </span>
                      </div>
                      <div id="mgr-rubric-box-${crit.id}" style="display: none; background: #f8fafc; border: 1px dashed #cbd5e1; border-radius: 4px; padding: 0.5rem; margin-top: 0.35rem; font-size: 0.75rem;">
                        <strong>Bảng chuẩn quy định:</strong>
                        <ul style="margin: 0.25rem 0 0 1rem; padding: 0;">
                          ${(crit.options || []).map(o => `
                            <li><strong>+${o.score}đ:</strong> ${o.label}</li>
                          `).join("")}
                        </ul>
                      </div>
                    </td>
                    <td style="text-align: center; font-weight: 700; color: var(--primary);">${sScore}đ</td>
                    <td style="text-align: center;">
                      ${attachedEvidences.map(ev => `
                        <button class="btn btn-sm btn-outline" style="font-size: 0.7rem; padding: 0.15rem 0.4rem; margin-bottom: 0.2rem; display: inline-flex; align-items: center; gap: 0.2rem;" onclick="previewEvidenceDoc('${ev.fileName}')">
                          📄 Xem scan
                        </button>
                      `).join("") || '<span style="font-size: 0.75rem; color: var(--text-light);">-</span>'}
                    </td>
                    <td style="text-align: center;">
                      <input type="number" min="0" max="${crit.maxScore}" class="form-control" style="width: 80px; text-align: center; font-weight: 700; margin: 0 auto;" 
                        value="${mScore}" onchange="updateManagerSingleScore(${crit.id}, this.value)">
                    </td>
                  </tr>
                `;
              })).join("")}
            </tbody>
          </table>
        </div>
      </div>
    `).join("");
  }
}

window.toggleManagerRubric = function(critId) {
  const box = document.getElementById(`mgr-rubric-box-${critId}`);
  if (box) {
    box.style.display = box.style.display === "none" ? "block" : "none";
  }
};

window.updateManagerSingleScore = function(criterionId, newScore) {
  const nurse = AppState.getNurse(AppState.currentReviewNurseId);
  if (!nurse) return;
  if (!nurse.managerScores) nurse.managerScores = {};
  nurse.managerScores[criterionId] = Number(newScore) || 0;
  AppState.save();
  renderReviewDetailCriteria();
};

// 1. Duyệt Cấp 1: Điều Dưỡng Trưởng Khoa
window.approveByDept = function(nurseId) {
  const nurse = AppState.getNurse(nurseId);
  if (!nurse) return;

  const evalResult = ActionPlanEngine.evaluateCompetency(nurse, nurse.managerScores);
  const note = prompt("Nhập nhận xét / đề xuất của Điều dưỡng Trưởng khoa:", "Đạt yêu cầu chuyên môn lâm sàng, đề xuất xếp Cấp " + evalResult.achievedLevel);
  if (note === null) return;

  nurse.status = "dept_approved";
  nurse.currentLevel = evalResult.achievedLevel;
  nurse.totalScore2025 = evalResult.totalScore;
  if (!nurse.approvalWorkflow) nurse.approvalWorkflow = {};
  nurse.approvalWorkflow.dept = {
    approved: true,
    reviewer: AppState.currentUser.fullName || "ThS. Nguyễn Thị Kim Quyên",
    title: "Điều dưỡng Trưởng khoa",
    date: new Date().toISOString().split("T")[0],
    note: note
  };

  AppState.save();
  alert(`✅ ĐIỀU DƯỠNG TRƯỞNG KHOA ĐÃ KÝ DUYỆT THÀNH CÔNG!\n\nĐã chuyển hồ sơ của ĐD ${nurse.fullName} lên Ban Điều Dưỡng Bệnh viện để thẩm định.`);
  renderManagerNursesTable();
  renderReviewDetailCriteria();
};

// 2. Duyệt Cấp 2: Ban Điều Dưỡng Bệnh Viện
window.approveByNursingBoard = function(nurseId) {
  const nurse = AppState.getNurse(nurseId);
  if (!nurse) return;

  const evalResult = ActionPlanEngine.evaluateCompetency(nurse, nurse.managerScores);
  const note = prompt("Nhập ý kiến thẩm định của Hội đồng Ban Điều Dưỡng Bệnh viện:", "Hồ sơ và minh chứng đầy đủ hợp lệ, chuẩn y phân cấp năng lực Cấp " + evalResult.achievedLevel);
  if (note === null) return;

  nurse.status = "nursing_board_approved";
  nurse.approvalWorkflow.nursingBoard = {
    approved: true,
    reviewer: "TS. ĐD. Trần Thị Thu Trang",
    title: "Trưởng Ban Điều dưỡng Bệnh viện",
    date: new Date().toISOString().split("T")[0],
    note: note
  };

  AppState.save();
  alert(`✅ BAN ĐIỀU DƯỠNG BỆNH VIỆN ĐÃ PHÊ DUYỆT THÀNH CÔNG!\n\nĐã trình Ban Giám Đốc Bệnh viện để ban hành Quyết định công nhận chính thức.`);
  renderManagerNursesTable();
  renderReviewDetailCriteria();
};

// 3. Duyệt Cấp 3: Ban Giám Đốc Ra Quyết Định Bệnh Viện
window.decideByHospital = function(nurseId) {
  const nurse = AppState.getNurse(nurseId);
  if (!nurse) return;

  const evalResult = ActionPlanEngine.evaluateCompetency(nurse, nurse.managerScores);
  const decNum = prompt("Nhập Số Quyết định Bệnh viện ban hành:", "128/QĐ-ĐHYD-TCCB");
  if (!decNum) return;

  nurse.status = "hospital_decided";
  nurse.currentLevel = evalResult.achievedLevel;
  nurse.totalScore2025 = evalResult.totalScore;
  nurse.approvalWorkflow.hospital = {
    decided: true,
    decisionNumber: decNum,
    signer: "GS. TS. BS. Trịnh Thị Diệu Thường",
    title: "Phó Giám đốc Bệnh viện / Phụ trách Cơ sở 2",
    date: new Date().toISOString().split("T")[0],
    note: `Công nhận phân cấp năng lực Cấp ${evalResult.achievedLevel} (${evalResult.currentConfig.badge})`
  };

  AppState.save();
  alert(`🏆 BAN GIÁM ĐỐC ĐÃ BAN HÀNH QUYẾT ĐỊNH CÔNG NHẬN CHÍNH THỨC!\n\nSố QĐ: ${decNum}\nĐiều dưỡng: ${nurse.fullName}\nPhân cấp: Cấp ${evalResult.achievedLevel} (${evalResult.currentConfig.badge})\nTổng điểm thẩm định: ${evalResult.totalScore} điểm.`);
  renderManagerNursesTable();
  renderReviewDetailCriteria();
};

/* =========================================================================
   5. PHÂN HỆ PORTFOLIO HỒ SƠ NĂNG LỰC & CME HÀNG NĂM
   ========================================================================= */
function initPortfolio() {
  const select = document.getElementById("portfolio-nurse-select");
  if (!select) return;

  refreshAllNurseSelects();

  select.addEventListener("change", (e) => {
    switchPortfolioNurse(e.target.value);
  });

  document.getElementById("btn-open-cme-modal")?.addEventListener("click", () => {
    openAddCmeModal();
  });

  renderPortfolioView();
}

window.openAddCmeModal = function() {
  const modal = document.getElementById("cme-modal");
  if (modal) {
    document.getElementById("cme-year").value = new Date().getFullYear();
    document.getElementById("cme-hours").value = "24";
    modal.classList.add("active");
  }
};

window.handleSaveCme = function(e) {
  if (e) e.preventDefault();
  const nurseId = document.getElementById("portfolio-nurse-select")?.value || AppState.currentPortfolioNurseId;
  const nurse = AppState.getNurse(nurseId);
  if (!nurse) return;

  const year = parseInt(document.getElementById("cme-year")?.value) || 2025;
  const hours = parseInt(document.getElementById("cme-hours")?.value) || 24;
  const title = (document.getElementById("cme-title")?.value || "").trim();
  const learningOutcomes = (document.getElementById("cme-learning-outcomes")?.value || "").trim();
  const institution = (document.getElementById("cme-institution")?.value || "").trim() || "Bệnh viện Đại học Y Dược TP.HCM";
  const certFileInput = document.getElementById("cme-cert-file-input");

  if (!title || hours <= 0) {
    alert("Vui lòng nhập tên khóa học và số tiết học hợp lệ!");
    return;
  }

  let fileName = "";
  if (certFileInput && certFileInput.files && certFileInput.files.length > 0) {
    fileName = certFileInput.files[0].name;
  } else {
    fileName = `${nurse.code}-CME_${year}.pdf`;
  }

  const praiseMsg = `Biểu dương ${nurse.fullName} đã tích cực hoàn thành khóa học "${title}" (${hours} tiết) tại ${institution}! Ghi nhận vào hồ sơ năng lực.`;

  if (!nurse.cmeList) nurse.cmeList = [];
  nurse.cmeList.push({
    id: "cme_" + Date.now(),
    year,
    title,
    hours,
    learningOutcomes,
    institution,
    certFile: fileName,
    date: new Date().toISOString().split("T")[0],
    praiseMessage: praiseMsg
  });

  AppState.save();
  document.getElementById("cme-modal")?.classList.remove("active");
  document.getElementById("cme-form")?.reset();
  renderPortfolioView();
  alert(`🎉 CHÚC MỪNG!\n\nĐã lưu thành công khóa học CME "${title}" (${hours} tiết) cho ${nurse.fullName}.\n\nNhận xét: "${praiseMsg}"`);
};

function switchPortfolioNurse(nurseId) {
  AppState.currentPortfolioNurseId = nurseId;
  AppState.currentSelfNurseId = nurseId;
  AppState.currentPortalNurseId = nurseId;
  renderPortfolioView();
}

function renderPortfolioView() {
  const select = document.getElementById("portfolio-nurse-select");
  const nurseId = select ? select.value : (AppState.currentPortfolioNurseId || AppState.currentSelfNurseId);
  const nurse = AppState.getNurse(nurseId);
  const container = document.getElementById("portfolio-content");
  if (!nurse || !container) return;

  const evalResult = ActionPlanEngine.evaluateCompetency(nurse, nurse.managerScores || nurse.selfScores);
  const cmeList = nurse.cmeList || [];
  const totalHours = cmeList.reduce((sum, item) => sum + (Number(item.hours) || 0), 0);
  const targetHours = 24;

  container.innerHTML = `
    <!-- 1. Báo cáo Nhận diện Thế mạnh Chuyên môn từ Portfolio -->
    <div class="card" style="background: linear-gradient(135deg, #f0fdf4 0%, #ecfeff 100%); border-left: 5px solid #059669; margin-bottom: 1.25rem;">
      <div style="display: flex; gap: 1.25rem; align-items: center; flex-wrap: wrap;">
        <div style="font-size: 2.8rem; background: #ffffff; width: 64px; height: 64px; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 10px rgba(0,0,0,0.06); flex-shrink: 0;">
          🌟
        </div>
        <div style="flex: 1; min-width: 260px;">
          <div style="display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap; margin-bottom: 0.25rem;">
            <h3 style="font-size: 1.1rem; font-weight: 800; color: #065f46; margin: 0;">
              BÁO CÁO NHẬN DIỆN THẾ MẠNH & NĂNG LỰC NỔI BẬT
            </h3>
            <span class="status-pill status-approved" style="font-size: 0.75rem; font-weight: 800;">
              Hồ sơ Portfolio đã xác thực
            </span>
          </div>
          <p style="font-size: 0.95rem; color: #047857; font-weight: 700; margin-bottom: 0.35rem;">
            🎯 Thế mạnh: ${nurse.primaryStrength || 'Thực hành kỹ thuật chuyên khoa điêu luyện & Chăm sóc tận tâm'}
          </p>
          <p style="font-size: 0.85rem; color: #065f46; line-height: 1.5; margin: 0;">
            ${nurse.portfolioSummary || 'Nhân sự nòng cốt với quá trình phấn đấu bền bỉ, tích cực học tập liên tục và hoàn thành xuất sắc các chỉ tiêu chuyên môn được giao.'}
          </p>
        </div>
      </div>
    </div>

    <!-- 2. Thông tin cá nhân & Thẻ phân cấp -->
    <div class="grid-sidebar" style="margin-bottom: 1.5rem;">
      <div class="sidebar-col">
        <div class="card" style="margin-bottom: 0;">
          <div class="card-header">
            <h3 class="card-title">👤 Thông Tin Chuyên Môn</h3>
          </div>
          <div style="text-align: center; margin-bottom: 1rem;">
            <div style="font-size: 3rem; margin-bottom: 0.25rem;">👩‍⚕️</div>
            <h3 style="font-size: 1.15rem; font-weight: 800; color: var(--primary-dark);">${nurse.fullName}</h3>
            <div style="color: var(--text-muted); font-size: 0.82rem;">MSNV: <code>${nurse.code}</code> · ${nurse.gender || 'Nữ'}</div>
            <div style="margin-top: 0.5rem;">
              <span class="rank-badge rank-lvl-${evalResult.achievedLevel}">
                ${evalResult.currentConfig.icon} Cấp ${evalResult.achievedLevel} (${evalResult.currentConfig.badge})
              </span>
            </div>
          </div>

          <div style="font-size: 0.85rem; display: flex; flex-direction: column; gap: 0.45rem; border-top: 1px dashed #cbd5e1; padding-top: 0.75rem;">
            <div><strong>Khoa / Đơn vị:</strong> ${nurse.unit}</div>
            <div><strong>Chức danh:</strong> ${nurse.position || 'Điều dưỡng'}</div>
            <div><strong>Trình độ:</strong> ${nurse.degree} (${nurse.degreeSchool || 'ĐH Y Dược TP.HCM'})</div>
            <div><strong>Thâm niên:</strong> ${nurse.experienceText || nurse.experienceYears + ' năm'}</div>
            <div><strong>Điểm thi TB:</strong> ${nurse.examScore}</div>
            <div><strong>Đào tạo - NCKH:</strong> ${nurse.teachingResearchNote || (nurse.hasTeachingResearch ? 'Đạt chuẩn' : 'Chưa có')}</div>
            <div><strong>Tổng điểm ĐGNL:</strong> <strong style="color: var(--primary); font-size: 1.05rem;">${evalResult.totalScore}đ</strong></div>
          </div>
        </div>
      </div>

      <!-- 3. Bảng theo dõi CME & Chứng chỉ -->
      <div class="main-form-col">
        <!-- CME Progress Bar -->
        <div class="card" style="margin-bottom: 1.25rem; background: #ffffff;">
          <div class="card-header">
            <h3 class="card-title">📚 Tích Lũy Tín Chỉ CME Năm 2025</h3>
            <span style="font-size: 0.85rem; font-weight: 700; color: ${totalHours >= targetHours ? 'var(--success)' : 'var(--warning)'};">
              ${totalHours} / ${targetHours} tiết (${Math.min(100, ((totalHours / targetHours) * 100)).toFixed(0)}%)
            </span>
          </div>

          <div style="background: #e2e8f0; border-radius: var(--radius-full); height: 12px; overflow: hidden; margin-bottom: 0.75rem;">
            <div style="background: ${totalHours >= targetHours ? 'var(--success)' : 'var(--primary)'}; width: ${Math.min(100, (totalHours / targetHours) * 100)}%; height: 100%; transition: width 0.4s ease;"></div>
          </div>

          <div style="display: flex; justify-content: space-between; font-size: 0.78rem; color: var(--text-muted);">
            <span>Định mức Bộ Y tế: 24 tiết/năm</span>
            <span>${totalHours >= targetHours ? '✅ Đã hoàn thành chỉ tiêu năm' : `⏳ Cần bổ sung thêm ${targetHours - totalHours} tiết`}</span>
          </div>
        </div>

        <!-- CME Records Table -->
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">📜 Danh Sách Chứng Nhận & Khóa Học CME Đã Hoàn Thành</h3>
            <button class="btn btn-sm btn-success" onclick="openAddCmeModal()">➕ Thêm Khóa Học CME</button>
          </div>

          <div class="review-table-container">
            <table class="review-table">
              <thead>
                <tr>
                  <th style="width: 40px; text-align: center;">STT</th>
                  <th style="width: 60px; text-align: center;">Năm</th>
                  <th>Tên Khóa Học / Chuyên Đề</th>
                  <th style="text-align: center; width: 80px;">Số Tiết</th>
                  <th>Kiến Thức / Kỹ Năng Đắc Thu</th>
                  <th style="text-align: center; width: 110px;">File Scan</th>
                  <th style="text-align: center; width: 70px;">Thao Tác</th>
                </tr>
              </thead>
              <tbody id="cme-records-tbody">
                ${cmeList.length === 0 ? `
                  <tr>
                    <td colspan="7" style="text-align: center; color: var(--text-muted); padding: 1.5rem;">
                      Chưa có chứng chỉ CME nào được ghi nhận. Hãy bấm nút "➕ Thêm Khóa Học CME" để cập nhật!
                    </td>
                  </tr>
                ` : cmeList.map((cme, idx) => `
                  <tr>
                    <td style="text-align: center; font-weight: 600;">${idx + 1}</td>
                    <td style="text-align: center; font-weight: 700; color: var(--primary);">${cme.year}</td>
                    <td>
                      <strong>${cme.title}</strong>
                      <div style="font-size: 0.72rem; color: var(--text-muted);">${cme.institution || nurse.unit} · ${cme.date || ''}</div>
                    </td>
                    <td style="text-align: center; font-weight: 700; color: var(--success);">${cme.hours} tiết</td>
                    <td style="font-size: 0.8rem; color: #334155;">${cme.learningOutcomes || '-'}</td>
                    <td style="text-align: center;">
                      ${cme.certFile ? `
                        <button class="btn btn-sm btn-outline" style="font-size: 0.7rem; padding: 0.15rem 0.4rem;" onclick="previewEvidenceDoc('${cme.certFile}')">
                          📜 Xem scan
                        </button>
                      ` : '<span style="color: var(--text-light);">-</span>'}
                    </td>
                    <td style="text-align: center;">
                      <button class="btn btn-sm btn-danger" style="font-size: 0.7rem; padding: 0.15rem 0.4rem;" onclick="deleteCmeRecord('${cme.id}')" title="Xóa chứng chỉ này khi nhập sai">
                        🗑️ Xóa
                      </button>
                    </td>
                  </tr>
                `).join("")}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  `;

  // Render Hospital-wide / Dept-wide CME Dashboard
  renderCmeHospitalDashboard();
}

function renderCmeHospitalDashboard() {
  const container = document.getElementById("cme-hospital-dashboard");
  if (!container) return;

  const accessibleNurses = AppState.getAccessibleNurses();
  const totalNurses = accessibleNurses.length;
  if (totalNurses === 0) return;

  let totalHospitalCmeHours = 0;
  let passedCount = 0;
  let inProgressCount = 0;
  let warningCount = 0;

  const warningList = [];

  accessibleNurses.forEach(n => {
    const list = n.cmeList || [];
    const hours = list.reduce((sum, it) => sum + (Number(it.hours) || 0), 0);
    totalHospitalCmeHours += hours;

    if (hours >= 24) {
      passedCount++;
    } else if (hours >= 12) {
      inProgressCount++;
      warningList.push({ nurse: n, hours, status: `Đang tích lũy (Cần thêm ${24 - hours} tiết)` });
    } else {
      warningCount++;
      warningList.push({ nurse: n, hours, status: `Cần đôn đốc (Thiếu ${24 - hours} tiết)` });
    }
  });

  const avgHours = (totalHospitalCmeHours / totalNurses).toFixed(1);
  const passRate = ((passedCount / totalNurses) * 100).toFixed(0);

  container.innerHTML = `
    <div class="card" style="background: linear-gradient(135deg, #f0fdf4 0%, #eff6ff 100%); border-left: 4px solid var(--secondary); margin-bottom: 1.5rem;">
      <div class="card-header" style="margin-bottom: 1rem;">
        <div>
          <h3 class="card-title" style="color: #065f46; font-size: 1.15rem;">
            📊 Dashboard Theo Dõi Tiến Độ Tích Lũy CME Năm 2025
          </h3>
          <p class="card-subtitle">
            Theo dõi định mức 24 tiết đào tạo liên tục / năm theo Thông tư 22/2013/TT-BYT của Bộ Y tế
          </p>
        </div>
      </div>

      <div class="cme-kpi-grid">
        <div class="cme-kpi-card" style="border-left: 4px solid var(--secondary);">
          <div class="cme-kpi-num" style="color: var(--secondary);">${totalHospitalCmeHours}</div>
          <div style="font-size: 0.8rem; color: var(--text-muted); font-weight: 700;">Tổng Tiết CME Tích Lũy</div>
        </div>

        <div class="cme-kpi-card" style="border-left: 4px solid var(--primary);">
          <div class="cme-kpi-num" style="color: var(--primary);">${avgHours}</div>
          <div style="font-size: 0.8rem; color: var(--text-muted); font-weight: 700;">Số Tiết CME Trung Bình / ĐD</div>
        </div>

        <div class="cme-kpi-card" style="border-left: 4px solid var(--success);">
          <div class="cme-kpi-num" style="color: var(--success);">${passedCount} (${passRate}%)</div>
          <div style="font-size: 0.8rem; color: var(--text-muted); font-weight: 700;">Đã Đạt Định Mức (≥24 Tiết)</div>
        </div>

        <div class="cme-kpi-card" style="border-left: 4px solid var(--warning);">
          <div class="cme-kpi-num" style="color: var(--warning);">${inProgressCount + warningCount}</div>
          <div style="font-size: 0.8rem; color: var(--text-muted); font-weight: 700;">Cần Tiếp Tục Tích Lũy / Đôn Đốc</div>
        </div>
      </div>

      <!-- Quick Alert Warning for Department Chiefs -->
      ${warningList.length > 0 ? `
        <div style="margin-top: 1rem; background: #ffffff; border-radius: var(--radius-md); padding: 1rem; border: 1px solid var(--border-color);">
          <h4 style="font-size: 0.9rem; font-weight: 800; color: #991b1b; margin-bottom: 0.5rem;">
            ⚠️ Danh Sách Điều Dưỡng Cần Đôn Đốc Bổ Sung CME Trong Năm (Chưa đủ 24 tiết)
          </h4>
          <div style="max-height: 200px; overflow-y: auto;">
            <table class="review-table" style="font-size: 0.8rem;">
              <thead>
                <tr>
                  <th>Mã NV</th>
                  <th>Họ và Tên</th>
                  <th>Khoa / Đơn vị</th>
                  <th style="text-align: center;">Đã Tích Lũy</th>
                  <th>Trạng Thái</th>
                  <th style="text-align: center;">Thao Tác</th>
                </tr>
              </thead>
              <tbody>
                ${warningList.slice(0, 15).map(item => `
                  <tr>
                    <td><code>${item.nurse.code}</code></td>
                    <td><strong>${item.nurse.fullName}</strong></td>
                    <td>${item.nurse.unit}</td>
                    <td style="text-align: center; font-weight: 800; color: ${item.hours >= 12 ? 'var(--warning)' : 'var(--danger)'};">${item.hours} / 24 tiết</td>
                    <td>
                      <span class="cme-alert-badge ${item.hours >= 12 ? 'cme-alert-progress' : 'cme-alert-warn'}">${item.status}</span>
                    </td>
                    <td style="text-align: center;">
                      <button class="btn btn-sm btn-outline" style="font-size: 0.7rem; padding: 0.15rem 0.4rem;" onclick="switchPortfolioNurse('${item.nurse.id}')">
                        ➕ Thêm CME
                      </button>
                    </td>
                  </tr>
                `).join("")}
              </tbody>
            </table>
          </div>
        </div>
      ` : ''}
    </div>
  `;
}

function handleAddCme(e) {
  e.preventDefault();
  const nurseId = document.getElementById("portfolio-nurse-select")?.value || AppState.currentPortfolioNurseId;
  const nurse = AppState.getNurse(nurseId);
  if (!nurse) return;

  const year = parseInt(document.getElementById("cme-year")?.value) || new Date().getFullYear();
  const title = document.getElementById("cme-title")?.value.trim();
  const hours = parseInt(document.getElementById("cme-hours")?.value) || 0;
  const institution = document.getElementById("cme-institution")?.value.trim() || "Đại học Y Dược TP.HCM";
  const outcomes = document.getElementById("cme-outcomes")?.value.trim();
  const fileInput = document.getElementById("cme-cert-file");

  if (!title || hours <= 0) {
    alert("Vui lòng nhập tên khóa học và số tiết học hợp lệ!");
    return;
  }

  let fileName = "";
  if (fileInput && fileInput.files.length > 0) {
    fileName = fileInput.files[0].name;
  } else {
    fileName = `${nurse.fullName.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, "")}-${nurse.code}-CME_${year}.pdf`;
  }

  const praiseList = [
    `Xuất sắc! Việc hoàn thành khóa học "${title}" giúp Anh/Chị nâng cao tay nghề và cập nhật kỹ thuật chăm sóc mới nhất!`,
    `Ghi nhận tinh thần học tập suốt đời của Điều dưỡng ${nurse.fullName}! Chúc Anh/Chị ứng dụng hiệu quả kiến thức vào thực tiễn người bệnh!`,
    `Tuyệt vời! Thêm ${hours} tiết CME quý giá, tiếp tục khẳng định năng lực chuyên môn vững vàng của Anh/Chị!`
  ];
  const randomPraise = praiseList[Math.floor(Math.random() * praiseList.length)];

  if (!nurse.cmeList) nurse.cmeList = [];

  const newCme = {
    id: "cme_" + Date.now(),
    year: year,
    title: title,
    hours: hours,
    institution: institution,
    learningOutcomes: outcomes,
    certFile: fileName,
    date: new Date().toISOString().split("T")[0],
    praiseMessage: randomPraise
  };

  nurse.cmeList.push(newCme);
  AppState.save();

  document.getElementById("add-cme-form")?.reset();
  renderPortfolioView();
  alert(`🎉 CHÚC MỪNG!\n\nĐã cập nhật thành công khóa học CME "${title}" (${hours} tiết) cho Điều dưỡng ${nurse.fullName}.\n\nNhận xét: "${randomPraise}"`);
}

window.deleteCmeRecord = function(cmeId) {
  const nurseId = document.getElementById("portfolio-nurse-select")?.value || AppState.currentPortfolioNurseId;
  const nurse = AppState.getNurse(nurseId);
  if (!nurse || !nurse.cmeList) return;

  const cmeItem = nurse.cmeList.find(c => c.id === cmeId);
  const title = cmeItem ? cmeItem.title : "khóa học này";

  if (!confirm(`Bạn có chắc chắn muốn XÓA chứng chỉ CME "${title}" khỏi hồ sơ của ${nurse.fullName}?`)) {
    return;
  }

  nurse.cmeList = nurse.cmeList.filter(c => c.id !== cmeId);
  AppState.save();
  renderPortfolioView();
  alert("Đã xóa chứng chỉ CME thành công!");
};

/* =========================================================================
   6. DASHBOARD PHÂN TÍCH & BÁO CÁO (TOÀN VIỆN & TỪNG KHOA)
   ========================================================================= */
function initAnalytics() {
  const unitFilter = document.getElementById("analytics-unit-filter");
  if (unitFilter) {
    unitFilter.addEventListener("change", () => {
      renderAnalyticsDashboard();
    });
  }

  document.getElementById("btn-export-excel")?.addEventListener("click", exportExcelReport);
  document.getElementById("btn-print-report")?.addEventListener("click", () => {
    window.print();
  });

  renderAnalyticsDashboard();
}

function renderAnalyticsDashboard() {
  const select = document.getElementById("analytics-unit-filter");
  const selectedUnit = select ? select.value : "ALL";

  const nurses = selectedUnit === "ALL" ? AppState.nurses : AppState.nurses.filter(n => n.unit === selectedUnit);
  const total = nurses.length;

  // Title update
  const titleEl = document.getElementById("report-unit-name");
  if (titleEl) {
    titleEl.textContent = selectedUnit === "ALL" ? "BÁO CÁO TỔNG HỢP TOÀN BỆNH VIỆN (13 KHOA / ĐƠN VỊ)" : `BÁO CÁO ĐƠN VỊ: ${selectedUnit.toUpperCase()}`;
  }

  // Count Levels
  const levelCounts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0 };
  let sumScore = 0;

  nurses.forEach(n => {
    const evalManager = ActionPlanEngine.evaluateCompetency(n, n.managerScores || n.selfScores);
    levelCounts[evalManager.achievedLevel] = (levelCounts[evalManager.achievedLevel] || 0) + 1;
    sumScore += evalManager.totalScore;
  });

  const avgScore = total > 0 ? (sumScore / total).toFixed(1) : 0;
  const countLvl4Plus = (levelCounts[4] || 0) + (levelCounts[5] || 0) + (levelCounts[6] || 0) + (levelCounts[7] || 0);
  const pctLvl4Plus = total > 0 ? ((countLvl4Plus / total) * 100).toFixed(0) : 0;
  const pctLvl3 = total > 0 ? (((levelCounts[3] || 0) / total) * 100).toFixed(0) : 0;

  // Update KPI Cards
  const kpiTotal = document.getElementById("kpi-total-nurses");
  if (kpiTotal) kpiTotal.textContent = total;

  const kpiLvl4 = document.getElementById("kpi-level-4-plus");
  if (kpiLvl4) kpiLvl4.textContent = `${countLvl4Plus} (${pctLvl4Plus}%)`;

  const kpiLvl3 = document.getElementById("kpi-level-3");
  if (kpiLvl3) kpiLvl3.textContent = `${levelCounts[3] || 0} (${pctLvl3}%)`;

  const kpiAvg = document.getElementById("kpi-avg-score");
  if (kpiAvg) kpiAvg.textContent = `${avgScore}đ`;

  // Draw Charts
  drawLevelDistributionChart(levelCounts, total);
  drawDomainRadarChart(nurses);

  // Department Comparison Block (Lâm Sàng vs Cận Lâm Sàng)
  const clinicalNurses = AppState.nurses.filter(n => CLINICAL_UNITS.includes(n.unit));
  const paraclinicalNurses = AppState.nurses.filter(n => PARACLINICAL_UNITS.includes(n.unit));

  let deptOverviewHtml = "";
  if (selectedUnit === "ALL") {
    deptOverviewHtml = `
      <!-- Khối So Sánh Lâm Sàng vs Cận Lâm Sàng -->
      <div class="grid-2" style="margin-bottom: 1.25rem;">
        <div class="card" style="border-left: 5px solid #0284c7; background: #f0f9ff; padding: 1rem;">
          <h4 style="font-size: 0.95rem; font-weight: 800; color: #0369a1; margin-bottom: 0.35rem;">
            🏥 KHỐI KHOA LÂM SÀNG (5 Khoa / Đơn vị - ${clinicalNurses.length} ĐD/HS/KTV)
          </h4>
          <div style="font-size: 0.85rem; color: #075985;">
            Bao gồm: Khoa Sản, Ngoại, GMHS, TMH, Đơn vị CTCH.<br>
            <strong>Cấp 4:</strong> ${clinicalNurses.filter(n => n.currentLevel >= 4).length} ĐD/HS/KTV | <strong>Cấp 3:</strong> ${clinicalNurses.filter(n => n.currentLevel === 3).length} ĐD/HS/KTV
          </div>
        </div>

        <div class="card" style="border-left: 5px solid #8b5cf6; background: #faf5ff; padding: 1rem;">
          <h4 style="font-size: 0.95rem; font-weight: 800; color: #6b21a8; margin-bottom: 0.35rem;">
            🔬 KHỐI KHOA CẬN LÂM SÀNG & KHÁC (8 Đơn vị - ${paraclinicalNurses.length} ĐD/HS/KTV)
          </h4>
          <div style="font-size: 0.85rem; color: #581c87;">
            Bao gồm: CĐHA, Xét nghiệm, KSNK, PHCN, Nội soi, SHPT, Khám bệnh, Ban ĐD.<br>
            <strong>Cấp 4:</strong> ${paraclinicalNurses.filter(n => n.currentLevel >= 4).length} ĐD/HS/KTV | <strong>Cấp 3:</strong> ${paraclinicalNurses.filter(n => n.currentLevel === 3).length} ĐD/HS/KTV
          </div>
        </div>
      </div>

      <!-- Bảng Tổng Hợp 13 Khoa / Đơn Vị -->
      <div class="card" style="margin-bottom: 1.5rem;">
        <div class="card-header">
          <h3 class="card-title">🏢 Bảng Tổng Hợp 13 Khoa / Đơn Vị Toàn Bệnh Viện (${AppState.nurses.length} ĐD/HS/KTV)</h3>
        </div>
        <div class="review-table-container">
          <table class="review-table">
            <thead>
              <tr>
                <th style="width: 50px; text-align: center;">STT</th>
                <th>Khoa / Đơn vị</th>
                <th>Khối Phân Loại</th>
                <th style="text-align: center;">Tổng ĐD/HS/KTV</th>
                <th style="text-align: center;">Cấp 4 (Thành thạo)</th>
                <th style="text-align: center;">Cấp 3 (Đạt chuẩn)</th>
                <th style="text-align: center;">Cấp 2 (Cơ bản)</th>
                <th style="text-align: center;">Cấp 1 (Tập sự)</th>
                <th style="text-align: center;">Điểm TB</th>
                <th style="text-align: center;">Xem Chi Tiết</th>
              </tr>
            </thead>
            <tbody>
              ${[...CLINICAL_UNITS, ...PARACLINICAL_UNITS].map((u, idx) => {
                const uNurses = AppState.nurses.filter(n => n.unit === u);
                const uTotal = uNurses.length;
                const c4 = uNurses.filter(n => (n.currentLevel || 1) >= 4).length;
                const c3 = uNurses.filter(n => (n.currentLevel || 1) === 3).length;
                const c2 = uNurses.filter(n => (n.currentLevel || 1) === 2).length;
                const c1 = uNurses.filter(n => (n.currentLevel || 1) === 1).length;
                const uSum = uNurses.reduce((s, n) => s + (n.totalScore2025 || 0), 0);
                const uAvg = uTotal > 0 ? (uSum / uTotal).toFixed(0) : 0;
                const isClinical = CLINICAL_UNITS.includes(u);

                return `
                  <tr>
                    <td style="text-align: center; font-weight: 600;">${idx + 1}</td>
                    <td><strong>${u}</strong></td>
                    <td>
                      <span class="status-pill" style="font-size: 0.7rem; background: ${isClinical ? '#e0f2fe; color: #0369a1;' : '#f3e8ff; color: #6b21a8;'}">
                        ${isClinical ? '🏥 Lâm sàng' : '🔬 Cận lâm sàng'}
                      </span>
                    </td>
                    <td style="text-align: center; font-weight: 800;">${uTotal}</td>
                    <td style="text-align: center; font-weight: 700; color: #8b5cf6;">${c4}</td>
                    <td style="text-align: center; font-weight: 700; color: #10b981;">${c3}</td>
                    <td style="text-align: center; font-weight: 700; color: #0284c7;">${c2}</td>
                    <td style="text-align: center; font-weight: 700; color: #64748b;">${c1}</td>
                    <td style="text-align: center; font-weight: 700; color: var(--primary);">${uAvg}đ</td>
                    <td style="text-align: center;">
                      <button class="btn btn-sm btn-outline" style="font-size: 0.75rem; padding: 0.2rem 0.5rem;" onclick="selectAnalyticsDept('${u}')">
                        🔍 Xem Khoa
                      </button>
                    </td>
                  </tr>
                `;
              }).join("")}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  let existingDeptBox = document.getElementById("analytics-dept-overview-box");
  if (!existingDeptBox && deptOverviewHtml) {
    const box = document.createElement("div");
    box.id = "analytics-dept-overview-box";
    const tableContainer = document.querySelector("#printable-report-area .review-table-container");
    if (tableContainer && tableContainer.parentNode) {
      tableContainer.parentNode.insertBefore(box, tableContainer);
    }
    existingDeptBox = box;
  }
  if (existingDeptBox) existingDeptBox.innerHTML = deptOverviewHtml;

  // Render Official Summary Table
  const tbody = document.getElementById("analytics-summary-tbody");
  if (tbody) {
    const search = typeof customKeyword === "string" ? customKeyword.toLowerCase().trim() : (document.getElementById("analytics-search-input")?.value || "").toLowerCase().trim();
    const filteredNurses = nurses.filter(n => !search || n.fullName.toLowerCase().includes(search) || n.code.toLowerCase().includes(search));

    tbody.innerHTML = filteredNurses.map((n, idx) => {
      const evalManager = ActionPlanEngine.evaluateCompetency(n, n.managerScores || n.selfScores);
      const diff = n.totalScore2024 ? evalManager.totalScore - n.totalScore2024 : null;
      const diffHtml = diff !== null ? (
        diff > 0 ? `<span style="color: #059669; font-weight: 700;">+${diff}</span>` :
        (diff < 0 ? `<span style="color: #dc2626; font-weight: 700;">${diff}</span>` : `<span style="color: var(--text-muted);">0</span>`)
      ) : `<span style="color: var(--text-light); font-size: 0.75rem;">Mới</span>`;

      return `
        <tr>
          <td style="text-align: center; font-weight: 600;">${idx + 1}</td>
          <td><code>${n.code}</code></td>
          <td>
            <strong>${n.fullName}</strong>
            <div style="font-size: 0.75rem; color: var(--text-muted);">${n.unit}</div>
          </td>
          <td style="text-align: center; font-weight: 800; color: var(--primary);">${evalManager.totalScore}</td>
          <td style="text-align: center;">
            <span class="rank-badge rank-lvl-${evalManager.achievedLevel}">Cấp ${evalManager.achievedLevel}</span>
          </td>
          <td style="text-align: center; font-weight: 600;">${n.examScore}</td>
          <td>${n.degree}</td>
          <td>${n.experienceText || n.experienceYears + " năm"}</td>
          <td style="text-align: center;">${n.hasTeachingResearch ? '✅ Có' : 'Không'}</td>
          <td style="text-align: center;">${diffHtml}</td>
        </tr>
      `;
    }).join("");
  }

  // Render Talent & Leadership Recommendations
  renderTalentRecommendations();
}

function renderTalentRecommendations() {
  const container = document.getElementById("talent-recommendations-container");
  if (!container) return;

  const accessibleNurses = AppState.getAccessibleNurses();
  const talents = ActionPlanEngine.analyzeTalentProfiles(accessibleNurses);

  container.innerHTML = `
    <div class="card" style="background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%); border-top: 4px solid #8b5cf6;">
      <div class="card-header">
        <div>
          <h3 class="card-title" style="color: #6b21a8; font-size: 1.2rem;">
            🧠 KHUYẾN NGHỊ PHÁT TRIỂN TÀI NĂNG & QUY HOẠCH CÁN BỘ ĐIỀU DƯỠNG
          </h3>
          <p class="card-subtitle">
            Hệ thống tự động phân tích điểm 66 tiêu chí, 5 lĩnh vực, thâm niên và thành tích NCKH để nhận diện thế mạnh của từng điều dưỡng
          </p>
        </div>
      </div>

      <div class="talent-matrix-grid">
        <!-- 1. Leadership & Management Track -->
        <div class="talent-track-card" style="border-top-color: #6366f1;">
          <div class="talent-track-header">
            <div class="talent-track-icon">🌟</div>
            <div>
              <div class="talent-track-title">Tiềm Năng Quản Lý & Lãnh Đạo</div>
              <div class="talent-track-desc">Thế mạnh Quản trị khoa, 5S, An toàn người bệnh (LV 4) & Giao tiếp AIDET (LV 5)</div>
            </div>
          </div>
          <div class="talent-nurses-list">
            ${talents.managementTalents.length > 0 ? talents.managementTalents.map(item => `
              <div class="talent-nurse-item">
                <div class="talent-nurse-info">
                  <span class="talent-nurse-name">${item.nurse.fullName} (Cấp ${item.level})</span>
                  <span class="talent-nurse-dept">${item.nurse.unit} · ${item.strengthDesc}</span>
                </div>
                <div style="text-align: right;">
                  <span class="talent-recommendation-tag ${item.tagClass}">${item.priorityTag}</span>
                  <div style="font-size: 0.72rem; color: #4338ca; margin-top: 0.2rem; font-weight: 600;">${item.recommendation}</div>
                </div>
              </div>
            `).join("") : '<div style="color: var(--text-muted); font-size: 0.8rem; padding: 0.5rem;">Chưa ghi nhận ứng viên phù hợp</div>'}
          </div>
        </div>

        <!-- 2. Clinical Specialist Track (CNS) -->
        <div class="talent-track-card" style="border-top-color: #10b981;">
          <div class="talent-track-header">
            <div class="talent-track-icon">🔬</div>
            <div>
              <div class="talent-track-title">Chuyên Gia Lâm Sàng Chuyên Sâu (CNS)</div>
              <div class="talent-track-desc">Kỹ thuật thực hành lâm sàng điêu luyện (LV 2) & Điểm kiểm tra tay nghề xuất sắc</div>
            </div>
          </div>
          <div class="talent-nurses-list">
            ${talents.clinicalSpecialists.length > 0 ? talents.clinicalSpecialists.map(item => `
              <div class="talent-nurse-item">
                <div class="talent-nurse-info">
                  <span class="talent-nurse-name">${item.nurse.fullName} (Cấp ${item.level})</span>
                  <span class="talent-nurse-dept">${item.nurse.unit} · ${item.strengthDesc}</span>
                </div>
                <div style="text-align: right;">
                  <span class="talent-recommendation-tag ${item.tagClass}">${item.priorityTag}</span>
                  <div style="font-size: 0.72rem; color: #047857; margin-top: 0.2rem; font-weight: 600;">${item.recommendation}</div>
                </div>
              </div>
            `).join("") : '<div style="color: var(--text-muted); font-size: 0.8rem; padding: 0.5rem;">Chưa ghi nhận ứng viên phù hợp</div>'}
          </div>
        </div>

        <!-- 3. Educator & Researcher Track -->
        <div class="talent-track-card" style="border-top-color: #a855f7;">
          <div class="talent-track-header">
            <div class="talent-track-icon">🎓</div>
            <div>
              <div class="talent-track-title">Giảng Viên Lâm Sàng & Nghiên Cứu (NCKH)</div>
              <div class="talent-track-desc">Bằng cấp sau đại học, chủ nhiệm đề tài NCKH & giảng dạy thực hành (LV 3)</div>
            </div>
          </div>
          <div class="talent-nurses-list">
            ${talents.educatorResearchers.length > 0 ? talents.educatorResearchers.map(item => `
              <div class="talent-nurse-item">
                <div class="talent-nurse-info">
                  <span class="talent-nurse-name">${item.nurse.fullName} (Cấp ${item.level})</span>
                  <span class="talent-nurse-dept">${item.nurse.unit} · ${item.strengthDesc}</span>
                </div>
                <div style="text-align: right;">
                  <span class="talent-recommendation-tag ${item.tagClass}">${item.priorityTag}</span>
                  <div style="font-size: 0.72rem; color: #7e22ce; margin-top: 0.2rem; font-weight: 600;">${item.recommendation}</div>
                </div>
              </div>
            `).join("") : '<div style="color: var(--text-muted); font-size: 0.8rem; padding: 0.5rem;">Chưa ghi nhận ứng viên phù hợp</div>'}
          </div>
        </div>

        <!-- 4. Rising Star Talent -->
        <div class="talent-track-card" style="border-top-color: #f59e0b;">
          <div class="talent-track-header">
            <div class="talent-track-icon">⭐</div>
            <div>
              <div class="talent-track-title">Nhân Tố Trẻ Triển Vọng (Rising Stars)</div>
              <div class="talent-track-desc">Điều dưỡng trẻ (&lt;3 năm thâm niên) có điểm số xuất sắc, ham học hỏi và nhiệt huyết</div>
            </div>
          </div>
          <div class="talent-nurses-list">
            ${talents.risingStars.length > 0 ? talents.risingStars.map(item => `
              <div class="talent-nurse-item">
                <div class="talent-nurse-info">
                  <span class="talent-nurse-name">${item.nurse.fullName} (Cấp ${item.level})</span>
                  <span class="talent-nurse-dept">${item.nurse.unit} · ${item.strengthDesc}</span>
                </div>
                <div style="text-align: right;">
                  <span class="talent-recommendation-tag ${item.tagClass}">${item.priorityTag}</span>
                  <div style="font-size: 0.72rem; color: #b45309; margin-top: 0.2rem; font-weight: 600;">${item.recommendation}</div>
                </div>
              </div>
            `).join("") : '<div style="color: var(--text-muted); font-size: 0.8rem; padding: 0.5rem;">Chưa ghi nhận ứng viên phù hợp</div>'}
          </div>
        </div>
      </div>
    </div>
  `;
}

window.selectAnalyticsDept = function(deptName) {
  const select = document.getElementById("analytics-unit-filter");
  if (select) {
    select.value = deptName;
    renderAnalyticsDashboard();
  }
};

function drawLevelDistributionChart(counts, total) {
  const canvas = document.getElementById("chart-level-distribution");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const colors = ["#64748b", "#0284c7", "#10b981", "#8b5cf6", "#ec4899", "#f59e0b", "#ef4444"];
  const labels = ["Cấp 1", "Cấp 2", "Cấp 3", "Cấp 4", "Cấp 5", "Cấp 6", "Cấp 7"];
  
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2 - 10;
  const outerRadius = 85;
  const innerRadius = 45;

  if (total === 0) return;

  let startAngle = -Math.PI / 2;

  for (let lvl = 1; lvl <= 7; lvl++) {
    const count = counts[lvl] || 0;
    if (count === 0) continue;

    const sliceAngle = (count / total) * 2 * Math.PI;
    const endAngle = startAngle + sliceAngle;

    ctx.beginPath();
    ctx.arc(centerX, centerY, outerRadius, startAngle, endAngle);
    ctx.arc(centerX, centerY, innerRadius, endAngle, startAngle, true);
    ctx.closePath();
    ctx.fillStyle = colors[lvl - 1];
    ctx.fill();

    startAngle = endAngle;
  }

  ctx.fillStyle = "#1e293b";
  ctx.font = "bold 20px -apple-system, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(`${total}`, centerX, centerY - 5);
  ctx.font = "11px -apple-system, sans-serif";
  ctx.fillStyle = "#64748b";
  ctx.fillText("Nhân sự", centerX, centerY + 14);

  const legendEl = document.getElementById("level-distribution-legend");
  if (legendEl) {
    legendEl.innerHTML = labels.map((lbl, idx) => {
      const c = counts[idx + 1] || 0;
      if (c === 0) return "";
      return `
        <div style="display: flex; align-items: center; gap: 0.35rem;">
          <span style="display: inline-block; width: 10px; height: 10px; background: ${colors[idx]}; border-radius: 2px;"></span>
          <span>${lbl}: <strong>${c} (${((c / total) * 100).toFixed(0)}%)</strong></span>
        </div>
      `;
    }).join("");
  }
}

function drawDomainRadarChart(nursesList) {
  const canvas = document.getElementById("chart-domain-radar");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const nurses = nursesList || AppState.nurses;
  const total = nurses.length;
  if (total === 0) return;

  const domainPcts = DOMAINS_DATA.map(d => {
    let sumScore = 0;
    nurses.forEach(n => {
      const { domainScores } = ActionPlanEngine.calculateScores(n.managerScores || n.selfScores);
      sumScore += (domainScores[d.id] || 0);
    });
    const avgScore = sumScore / total;
    return {
      code: `Lĩnh vực ${d.code}`,
      pct: Math.min(1, avgScore / d.maxScore),
      score: avgScore.toFixed(1),
      max: d.maxScore
    };
  });

  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;
  const radius = 80;
  const numAxes = domainPcts.length;
  const angleStep = (Math.PI * 2) / numAxes;

  const levels = 4;
  ctx.strokeStyle = "#e2e8f0";
  ctx.lineWidth = 1;

  for (let l = 1; l <= levels; l++) {
    const r = (radius / levels) * l;
    ctx.beginPath();
    for (let i = 0; i < numAxes; i++) {
      const angle = i * angleStep - Math.PI / 2;
      const x = centerX + r * Math.cos(angle);
      const y = centerY + r * Math.sin(angle);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.stroke();
  }

  ctx.font = "bold 10px -apple-system, sans-serif";
  ctx.fillStyle = "#475569";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  for (let i = 0; i < numAxes; i++) {
    const angle = i * angleStep - Math.PI / 2;
    const x = centerX + radius * Math.cos(angle);
    const y = centerY + radius * Math.sin(angle);
    
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(x, y);
    ctx.strokeStyle = "#cbd5e1";
    ctx.stroke();

    const labelX = centerX + (radius + 24) * Math.cos(angle);
    const labelY = centerY + (radius + 20) * Math.sin(angle);
    ctx.fillText(`${domainPcts[i].code}`, labelX, labelY - 5);
    ctx.font = "9px -apple-system, sans-serif";
    ctx.fillStyle = "#0284c7";
    ctx.fillText(`${domainPcts[i].score}đ (${(domainPcts[i].pct * 100).toFixed(0)}%)`, labelX, labelY + 7);
    ctx.font = "bold 10px -apple-system, sans-serif";
    ctx.fillStyle = "#475569";
  }

  ctx.beginPath();
  domainPcts.forEach((d, i) => {
    const angle = i * angleStep - Math.PI / 2;
    const r = radius * d.pct;
    const x = centerX + r * Math.cos(angle);
    const y = centerY + r * Math.sin(angle);
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.closePath();
  ctx.fillStyle = "rgba(2, 132, 199, 0.25)";
  ctx.fill();
  ctx.strokeStyle = "#0284c7";
  ctx.lineWidth = 2;
  ctx.stroke();

  domainPcts.forEach((d, i) => {
    const angle = i * angleStep - Math.PI / 2;
    const r = radius * d.pct;
    const x = centerX + r * Math.cos(angle);
    const y = centerY + r * Math.sin(angle);
    ctx.beginPath();
    ctx.arc(x, y, 4, 0, Math.PI * 2);
    ctx.fillStyle = "#0369a1";
    ctx.fill();
  });
}

function exportExcelReport() {
  if (typeof XLSX === "undefined") {
    alert("Đang tải thư viện xuất Excel, vui lòng thử lại sau 2 giây!");
    return;
  }

  const selectedUnit = document.getElementById("analytics-unit-filter")?.value || "ALL";
  const nurses = selectedUnit === "ALL" ? AppState.nurses : AppState.nurses.filter(n => n.unit === selectedUnit);
  const unitTitle = selectedUnit === "ALL" ? "Toàn Bệnh viện (13 Khoa / Đơn vị)" : selectedUnit;

  const wb = XLSX.utils.book_new();

  // 1. Sheet TỔNG HỢP
  const tongHopData = [
    ["BỆNH VIỆN ĐẠI HỌC Y DƯỢC TPHCM"],
    ["PHÒNG ĐIỀU DƯỠNG"],
    ["BÁO CÁO KẾT QUẢ PHÂN CẤP NĂNG LỰC ĐIỀU DƯỠNG NĂM 2025"],
    [`Đơn vị: ${unitTitle}`],
    [],
    ["STT", "MÃ NHÂN VIÊN", "HỌ VÀ TÊN", "KHOA / ĐƠN VỊ", "ĐIỂM ĐGNL 2025", "PHÂN CẤP", "ĐIỂM THI TB", "TRÌNH ĐỘ CM", "THÂM NIÊN", "ĐÀO TẠO - NCKH"]
  ];

  nurses.forEach((n, idx) => {
    const evalManager = ActionPlanEngine.evaluateCompetency(n, n.managerScores || n.selfScores);
    tongHopData.push([
      idx + 1,
      n.code,
      n.fullName,
      n.unit,
      evalManager.totalScore,
      evalManager.achievedLevel,
      n.examScore,
      n.degree,
      n.experienceText || n.experienceYears + " năm",
      n.hasTeachingResearch ? "Có" : "Không"
    ]);
  });

  const wsTongHop = XLSX.utils.aoa_to_sheet(tongHopData);
  XLSX.utils.book_append_sheet(wb, wsTongHop, "TỔNG HỢP");

  // 2. Sheet CHI TIẾT 2025
  const chiTietHeaders = ["STT", "MÃ NV", "HỌ VÀ TÊN", "KHOA"];
  DOMAINS_DATA.forEach(d => {
    d.standards.forEach(std => {
      std.criteria.forEach(c => {
        chiTietHeaders.push(`TC_${c.id}`);
      });
    });
  });
  chiTietHeaders.push("TỔNG ĐIỂM", "PHÂN CẤP");

  const chiTietData = [chiTietHeaders];
  nurses.forEach((n, idx) => {
    const evalManager = ActionPlanEngine.evaluateCompetency(n, n.managerScores || n.selfScores);
    const row = [idx + 1, n.code, n.fullName, n.unit];
    
    DOMAINS_DATA.forEach(d => {
      d.standards.forEach(std => {
        std.criteria.forEach(c => {
          const sc = (n.managerScores && n.managerScores[c.id] !== undefined) ? n.managerScores[c.id] : (n.selfScores ? n.selfScores[c.id] : 0);
          row.push(sc);
        });
      });
    });

    row.push(evalManager.totalScore, evalManager.achievedLevel);
    chiTietData.push(row);
  });

  const wsChiTiet = XLSX.utils.aoa_to_sheet(chiTietData);
  XLSX.utils.book_append_sheet(wb, wsChiTiet, "CHI TIẾT 2025");

  const cleanUnitName = unitTitle.replace(/[^\w\d]/g, "_");
  XLSX.writeFile(wb, `BaoCao_PhanCap_NangLuc_${cleanUnitName}_2025.xlsx`);
}

/* =========================================================================
   7. CỔNG TRA CỨU CÁ NHÂN & LỘ TRÌNH PHÁT TRIỂN NĂNG LỰC
   ========================================================================= */
window.printHonorsCertificate = function() {
  document.body.classList.add("printing-cert");
  window.print();
  setTimeout(() => {
    document.body.classList.remove("printing-cert");
  }, 500);
};

window.printActionPlan = function() {
  document.body.classList.add("printing-plan");
  window.print();
  setTimeout(() => {
    document.body.classList.remove("printing-plan");
  }, 500);
};

function initPersonalPortal() {
  const select = document.getElementById("portal-nurse-select");
  if (!select) return;

  refreshAllNurseSelects();

  select.addEventListener("change", (e) => {
    AppState.currentPortalNurseId = e.target.value;
    AppState.currentSelfNurseId = e.target.value;
    AppState.currentPortfolioNurseId = e.target.value;
    renderPersonalPortal();
  });

  document.getElementById("btn-print-action-plan")?.addEventListener("click", () => {
    printActionPlan();
  });

  renderPersonalPortal();
}

function renderPersonalPortal() {
  const select = document.getElementById("portal-nurse-select");
  const nurseId = select ? select.value : AppState.currentPortalNurseId;
  const nurse = AppState.getNurse(nurseId) || AppState.nurses[0];
  const container = document.getElementById("personal-portal-content");
  if (!nurse || !container) return;

  const evalResult = ActionPlanEngine.evaluateCompetency(nurse, nurse.managerScores || nurse.selfScores);

  if (evalResult.totalScore === 0) {
    container.innerHTML = `
      <div class="card" style="text-align: center; padding: 2.5rem 1.5rem; background: #f8fafc; border: 1.5px dashed #cbd5e1; border-radius: 12px; margin-top: 1rem;">
        <div style="font-size: 3rem; margin-bottom: 0.75rem;">📝</div>
        <h3 style="color: #334155; font-size: 1.25rem; font-weight: 700; margin-bottom: 0.5rem;">
          Nhân sự ${nurse.fullName} (<code>${nurse.code}</code>) chưa thực hiện tự đánh giá
        </h3>
        <p style="color: #64748b; font-size: 0.9rem; max-width: 620px; margin: 0 auto 1.25rem; line-height: 1.5;">
          Điểm năng lực hiện tại là <strong>0 điểm</strong> (chưa đánh giá). Sau khi hoàn thành bảng tự đánh giá và đính kèm hồ sơ minh chứng, hệ thống sẽ tự động tổng hợp phân cấp, đề xuất kế hoạch hành động và cấp Bằng vinh danh chính thức.
        </p>
        <button class="btn btn-primary" onclick="AppState.currentSelfNurseId = '${nurse.id}'; const sel = document.getElementById('self-eval-nurse-select'); if (sel) sel.value = '${nurse.id}'; document.getElementById('btn-tab-self-eval')?.click();">
          👉 Đến Bảng Tự Đánh Giá Ngay
        </button>
      </div>
    `;
    return;
  }

  const actionPlan = ActionPlanEngine.generateActionPlan(nurse, evalResult);
  const motivation = ActionPlanEngine.generateMotivationalFeedback(nurse, evalResult);
  const certData = ActionPlanEngine.generateHonorsCertificate(nurse, evalResult);
  const comparison = actionPlan.comparison;

  container.innerHTML = `
    <!-- Top Result Banner -->
    <div class="card" style="border-left: 6px solid var(--primary); background: linear-gradient(135deg, #ffffff 0%, #f0fdf4 100%); margin-bottom: 1.25rem;">
      <div class="score-banner" style="margin-bottom: 0;">
        <div class="score-banner-item">
          <div class="score-banner-val" style="color: var(--primary);">${evalResult.totalScore}đ</div>
          <div class="score-banner-label">Tổng Điểm ĐGNL 2025</div>
        </div>

        <div class="score-banner-item">
          <div class="score-banner-val">
            <span class="rank-badge rank-lvl-${evalResult.achievedLevel}" style="font-size: 1.25rem; padding: 0.4rem 1.25rem;">
              ${evalResult.currentConfig.icon} CẤP ${evalResult.achievedLevel} (${evalResult.currentConfig.badge})
            </span>
          </div>
          <div class="score-banner-label">Phân Cấp Năng Lực Chính Thức</div>
        </div>

        <div class="score-banner-item">
          <div class="score-banner-val" style="color: ${evalResult.nextConfig ? '#8b5cf6' : '#10b981'};">
            ${evalResult.nextConfig ? `Cấp ${evalResult.nextConfig.level}` : 'Đỉnh cao'}
          </div>
          <div class="score-banner-label">Mục Tiêu Thăng Cấp Kế Tiếp</div>
        </div>
      </div>
    </div>

    <!-- BẰNG VINH DANH NĂNG LỰC ĐIỀU DƯỠNG UMC CHÍNH THỨC -->
    <div class="card" style="padding: 0; overflow: hidden; margin-bottom: 1.5rem; border: none;">
      <div class="honors-certificate-frame">
        <div class="honors-certificate-inner">
          <div class="honors-hospital-header" style="display: flex; align-items: center; justify-content: space-between; border-bottom: 2px solid var(--primary); padding-bottom: 0.75rem; margin-bottom: 1.25rem; flex-wrap: wrap; gap: 0.5rem;">
            <div style="display: flex; align-items: center; gap: 0.75rem;">
              <img src="assets/umc_icon.png" alt="UMC Icon" style="height: 48px; width: auto; object-fit: contain;">
              <div style="text-align: left;">
                <div class="honors-hospital-title" style="font-size: 0.95rem; font-weight: 800; color: var(--umc-navy); letter-spacing: 0.5px;">BỆNH VIỆN ĐẠI HỌC Y DƯỢC TP. HỒ CHÍ MINH</div>
                <div class="honors-board-title" style="font-size: 0.8rem; font-weight: 700; color: var(--secondary);">CƠ SỞ 2 · HỘI ĐỒNG ĐÁNH GIÁ NĂNG LỰC & BAN ĐIỀU DƯỠNG</div>
              </div>
            </div>
            <img src="assets/umc_cs2_logo.png" alt="UMC CS2 Logo" style="height: 40px; width: auto; object-fit: contain;">
          </div>

          <div class="honors-main-title">BẰNG VINH DANH NĂNG LỰC ĐIỀU DƯỠNG</div>
          <div class="honors-subtitle">CERTIFICATE OF NURSING CLINICAL EXCELLENCE · NĂM 2025</div>

          <div class="honors-awarded-to">TRÂN TRỌNG VINH DANH VÀ BIỂU DƯƠNG</div>
          <div class="honors-recipient-name">${certData.recipientName}</div>
          <div class="honors-recipient-dept">MSNV: ${nurse.code} · ${certData.unit} · ${nurse.position || 'Điều dưỡng Lâm sàng'}</div>

          <div class="honors-achievement-title">${certData.honorsTitle}</div>

          <div class="honors-citation-text">
            "${certData.citation}"
          </div>

          <div style="display: flex; justify-content: center; gap: 1rem; margin: 1.25rem 0; flex-wrap: wrap;">
            <div class="honors-badge-pill">
              🏆 ${certData.levelBadge} (${certData.level})
            </div>
            <div class="honors-badge-pill">
              📈 Tổng Điểm: ${certData.totalScore} Điểm
            </div>
            <div class="honors-badge-pill">
              📜 QĐ Số: ${certData.decisionNumber}
            </div>
          </div>

          <div class="honors-signature-grid">
            <div class="honors-sign-box">
              <div class="honors-sign-title">TRƯỞNG BAN ĐIỀU DƯỠNG</div>
              <div style="font-size: 0.75rem; color: #64748b;">(Đã ký điện tử & Thẩm định)</div>
              <div class="honors-digital-seal">✓ VERIFIED</div>
              <div class="honors-sign-name">${certData.signers.nursingBoardHead}</div>
            </div>

            <div class="honors-sign-box">
              <div class="honors-sign-title">GIÁM ĐỐC BỆNH VIỆN</div>
              <div style="font-size: 0.75rem; color: #64748b;">(Đã phê chuẩn Quyết định)</div>
              <div class="honors-digital-seal">★ APPROVED</div>
              <div class="honors-sign-name">${certData.signers.hospitalDirector}</div>
            </div>
          </div>

          <div style="margin-top: 1.5rem; text-align: center;">
            <button class="btn btn-primary" onclick="printHonorsCertificate()" style="font-weight: 700;">
              🖨️ In Bằng Vinh Danh (Bản A4 Trang Trọng)
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- So Sánh Kết Quả Với Năm Trước (2024 vs 2025) -->
    <div class="card" style="margin-bottom: 1.25rem;">
      <div class="card-header">
        <h3 class="card-title">📈 So Sánh Kết Quả Đánh Giá Năng Lực (Năm 2024 vs Năm 2025)</h3>
        <span class="step-badge ${comparison.growthBadgeClass}">${comparison.growthStatusText}</span>
      </div>

      <div class="comparison-container">
        <div class="comparison-card">
          <div style="font-size: 0.85rem; color: var(--text-muted);">Kết Quả Năm 2024</div>
          <div class="comparison-score-val" style="color: #64748b;">${comparison.score2024}${typeof comparison.score2024 === 'number' ? 'đ' : ''}</div>
          <div style="font-weight: 700; color: #475569;">${comparison.level2024}</div>
        </div>

        <div class="comparison-card highlight">
          <div style="font-size: 0.85rem; color: #15803d; font-weight: 700;">Kết Quả Năm 2025 (Hiện Tại)</div>
          <div class="comparison-score-val" style="color: #166534;">${comparison.score2025}đ</div>
          <div style="font-weight: 800; color: #15803d;">${comparison.level2025}</div>
        </div>

        <div class="comparison-card">
          <div style="font-size: 0.85rem; color: var(--text-muted);">Tăng Trưởng Điểm Số</div>
          <div class="comparison-score-val" style="color: ${comparison.scoreDiff > 0 ? '#10b981' : (comparison.scoreDiff < 0 ? '#ef4444' : '#0284c7')};">
            ${comparison.scoreDiff !== null ? (comparison.scoreDiff > 0 ? `+${comparison.scoreDiff}đ` : `${comparison.scoreDiff}đ`) : 'Mốc chuẩn'}
          </div>
          <div style="font-size: 0.8rem; color: var(--text-muted);">
            ${comparison.levelDiff ? `Thăng +${comparison.levelDiff} Cấp bậc` : 'Duy trì năng lực'}
          </div>
        </div>
      </div>
    </div>

    <!-- Lời Động Viên & Khen Thưởng Tích Cực -->
    <div class="card" style="background: linear-gradient(135deg, #fefce8 0%, #fef3c7 100%); border-color: #fde047; margin-bottom: 1.25rem;">
      <div style="display: flex; gap: 1rem; align-items: flex-start;">
        <div style="font-size: 2.5rem; line-height: 1;">🌟</div>
        <div>
          <h3 style="font-size: 1.1rem; font-weight: 800; color: #854d0e; margin-bottom: 0.35rem;">
            ${motivation.headline}
          </h3>
          <p style="font-size: 0.95rem; color: #713f12; line-height: 1.5;">
            ${motivation.message}
          </p>
          <div style="margin-top: 0.75rem; font-style: italic; font-size: 0.85rem; color: #a16207;">
            "${motivation.quote}"
          </div>
        </div>
      </div>
    </div>

    <!-- Huy Hiệu Vinh Danh & Florence Nightingale Tribute -->
    <div class="card" style="margin-bottom: 1.25rem;">
      <div class="card-header">
        <h3 class="card-title">🎖️ Huy Hiệu Vinh Danh & Ghi Nhận Thành Tích</h3>
      </div>
      <div class="grid-2">
        ${actionPlan.badges.map(b => {
          if (b.image) {
            return `
              <div class="nightingale-card" style="grid-column: 1 / -1;">
                <img src="${b.image}" alt="Florence Nightingale" class="nightingale-img">
                <div>
                  <div style="font-size: 1.15rem; font-weight: 800; color: #9a3412; margin-bottom: 0.25rem;">
                    ${b.icon} ${b.title}
                  </div>
                  <p style="font-size: 0.88rem; color: #78350f; line-height: 1.5; margin-bottom: 0.4rem;">
                    ${b.desc}
                  </p>
                  <span class="status-pill" style="background: #fef08a; color: #854d0e; font-weight: 700; font-size: 0.75rem;">
                    🎖️ Vinh danh Tinh thần Điều dưỡng Florence Nightingale
                  </span>
                </div>
              </div>
            `;
          }
          return `
            <div class="badge-card">
              <div class="badge-icon">${b.icon}</div>
              <div>
                <div class="badge-title">${b.title}</div>
                <div class="badge-desc">${b.desc}</div>
              </div>
            </div>
          `;
        }).join("")}
      </div>
    </div>

    <!-- KHUNG KẾ HOẠCH HÀNH ĐỘNG CÓ THỂ IN (PRINTABLE ACTION PLAN A4) -->
    <div id="printable-action-plan">
      <!-- Đề Xuất Danh Mục Khóa Học CME Cần Cập Nhật Năm Sau (2026) -->
      <div class="card" style="margin-bottom: 1.25rem; border-top: 4px solid var(--primary);">
        <div class="card-header">
          <div>
            <h3 class="card-title">📚 Đề Xuất Danh Mục Chứng Chỉ CME Chuyên Khoa Cần Đạt Năm 2026</h3>
            <p class="card-subtitle">Định hướng bồi dưỡng chuyên môn phù hợp trực tiếp với vị trí công tác tại <strong>${nurse.unit}</strong></p>
          </div>
          <div style="display: flex; gap: 0.5rem; align-items: center;">
            <span class="status-pill status-submitted">Mục tiêu: ≥ 24 - 48 Tiết CME</span>
            <button class="btn btn-sm btn-primary no-print" onclick="printActionPlan()">🖨️ In Kế Hoạch A4</button>
          </div>
        </div>

        <div class="review-table-container">
          <table class="review-table">
            <thead>
              <tr>
                <th style="width: 50px; text-align: center;">STT</th>
                <th>Tên Khóa Học / Chứng Chỉ CME Đề Xuất</th>
                <th style="text-align: center;">Số Tiết</th>
                <th>Cơ Sở Đào Tạo</th>
                <th style="text-align: center;">Mức Độ</th>
                <th>Kỹ Năng & Kiến Thức Cần Thu Hoạch</th>
              </tr>
            </thead>
            <tbody>
              ${actionPlan.recommendedCme.map((cme, idx) => `
                <tr>
                  <td style="text-align: center; font-weight: 600;">${idx + 1}</td>
                  <td><strong>${cme.title}</strong></td>
                  <td style="text-align: center; font-weight: 700; color: var(--primary);">${cme.hours} tiết</td>
                  <td style="font-size: 0.85rem;">${cme.institution}</td>
                  <td style="text-align: center;">
                    <span class="cme-priority-badge ${cme.priority === 'Bắt buộc' ? 'cme-priority-required' : 'cme-priority-recommended'}">
                      ${cme.priority}
                    </span>
                  </td>
                  <td style="font-size: 0.85rem; color: #334155;">${cme.targetSkill}</td>
                </tr>
              `).join("")}
            </tbody>
          </table>
        </div>
      </div>

    <!-- Hoạch Định Kế Hoạch Năm Sau Chi Tiết Cho Từng Lĩnh Vực (Lĩnh Vực 1 -> 5) -->
    <div class="card" style="margin-bottom: 1.25rem;">
      <div class="card-header">
        <div>
          <h3 class="card-title">🎯 Hoạch Định Kế Hoạch Hành Động Năm 2026 Chi Tiết Theo 5 Lĩnh Vực</h3>
          <p class="card-subtitle">Kế hoạch nhiệm vụ trọng tâm để nâng cao toàn diện năng lực điều dưỡng</p>
        </div>
      </div>

      <div style="display: flex; flex-direction: column; gap: 0.75rem;">
        ${actionPlan.domainPlans.map(dp => `
          <div class="domain-plan-card">
            <div class="domain-plan-header">
              <div class="domain-plan-title">
                LĨNH VỰC ${dp.domainCode}: ${dp.domainName}
              </div>
              <div style="font-size: 0.8rem; font-weight: 700; color: var(--primary);">
                Hiện đạt: ${dp.currentScore}đ ➔ Mục tiêu: ${dp.targetScore}đ
              </div>
            </div>
            <ul class="domain-plan-task-list">
              ${dp.actions.map((act, i) => `
                <li class="domain-plan-task-item">
                  <input type="checkbox" id="dp-task-${dp.domainId}-${i}">
                  <label for="dp-task-${dp.domainId}-${i}">${act}</label>
                </li>
              `).join("")}
            </ul>
          </div>
        `).join("")}
      </div>
    </div>

    <!-- Lộ Trình 3 Giai Đoạn (Roadmap Timeline) -->
    <div class="card">
      <div class="card-header">
        <div>
          <h3 class="card-title">🗺️ Lộ Trình Thực Hiện Cá Nhân 3 Giai Đoạn Trong Năm 2026</h3>
          <p class="card-subtitle">Lộ trình bứt phá từng mốc thời gian dành cho Điều dưỡng ${nurse.fullName}</p>
        </div>
      </div>

      <div class="roadmap-timeline">
        <div class="roadmap-phase">
          <div class="phase-node" style="background: var(--primary);"></div>
          <div class="phase-header">
            <span class="phase-tag phase-short">Giai đoạn 1 (1 - 3 tháng)</span>
            <span class="phase-title">Khởi Động & Củng Cố Thực Hành Chăm Sóc Chuẩn Mực</span>
          </div>
          <ul class="phase-tasks-list">
            ${actionPlan.roadmap.shortTerm.map((task, i) => `
              <li class="phase-task-item">
                <input type="checkbox" class="task-checkbox" id="task-st-${i}">
                <label for="task-st-${i}">${task}</label>
              </li>
            `).join("")}
          </ul>
        </div>

        <div class="roadmap-phase">
          <div class="phase-node" style="background: var(--secondary);"></div>
          <div class="phase-header">
            <span class="phase-tag phase-medium">Giai đoạn 2 (3 - 6 tháng)</span>
            <span class="phase-title">Tích Lũy CME Chuyên Khoa & Triển Khai Nghiên Cứu</span>
          </div>
          <ul class="phase-tasks-list">
            ${actionPlan.roadmap.mediumTerm.map((task, i) => `
              <li class="phase-task-item">
                <input type="checkbox" class="task-checkbox" id="task-mt-${i}">
                <label for="task-mt-${i}">${task}</label>
              </li>
            `).join("")}
          </ul>
        </div>

        <div class="roadmap-phase">
          <div class="phase-node" style="background: #8b5cf6;"></div>
          <div class="phase-header">
            <span class="phase-tag phase-long">Giai đoạn 3 (6 - 12 tháng)</span>
            <span class="phase-title">Hoàn Tất Tín Chỉ, Nghiệm Thu Đề Tài & Thăng Cấp Năng Lực</span>
          </div>
          <ul class="phase-tasks-list">
            ${actionPlan.roadmap.longTerm.map((task, i) => `
              <li class="phase-task-item">
                <input type="checkbox" class="task-checkbox" id="task-lt-${i}">
                <label for="task-lt-${i}">${task}</label>
              </li>
            `).join("")}
          </ul>
        </div>
      </div>
    </div>
  `;
}

/* =========================================================================
   8. TRA CỨU KHUNG CHUẨN TIÊU CHÍ NĂNG LỰC THEO TỪNG KHOA PHÒNG & CHUYÊN NGÀNH
   ========================================================================= */
window.switchRefFramework = function(frameworkKey) {
  const fw = (typeof DEPARTMENT_FRAMEWORKS !== "undefined" && DEPARTMENT_FRAMEWORKS[frameworkKey]) ? DEPARTMENT_FRAMEWORKS[frameworkKey] : (typeof DEPARTMENT_FRAMEWORKS !== "undefined" ? DEPARTMENT_FRAMEWORKS.clinical : null);
  const q = document.getElementById("ref-search-input")?.value || "";
  renderStandardsRefAccordion(q, fw);
};

window.filterRefCriteriaSearch = function(keyword) {
  const fwKey = document.getElementById("ref-framework-select")?.value || "clinical";
  const fw = (typeof DEPARTMENT_FRAMEWORKS !== "undefined" && DEPARTMENT_FRAMEWORKS[fwKey]) ? DEPARTMENT_FRAMEWORKS[fwKey] : (typeof DEPARTMENT_FRAMEWORKS !== "undefined" ? DEPARTMENT_FRAMEWORKS.clinical : null);
  renderStandardsRefAccordion(keyword, fw);
};

function initStandardsRef() {
  const tbody = document.getElementById("ref-levels-tbody");
  if (tbody) {
    tbody.innerHTML = COMPETENCY_LEVELS.map(lvl => `
      <tr>
        <td><span class="rank-badge rank-lvl-${lvl.level}">Cấp ${lvl.level}</span></td>
        <td><strong>${lvl.badge}</strong></td>
        <td style="font-weight: 700; color: var(--primary);">${lvl.minTotalScore} điểm</td>
        <td>${lvl.degreeReq}</td>
        <td>${lvl.experienceDesc}</td>
        <td>${lvl.minExamScore > 0 ? `≥ ${lvl.minExamScore}đ` : 'Không yêu cầu'}</td>
        <td>${lvl.hasTeachingResearch ? 'Bắt buộc có bài giảng & đề tài NCKH' : 'Không bắt buộc'}</td>
      </tr>
    `).join("");
  }

  const select = document.getElementById("ref-framework-select");
  const fwKey = select ? select.value : "clinical";
  const fw = (typeof DEPARTMENT_FRAMEWORKS !== "undefined" && DEPARTMENT_FRAMEWORKS[fwKey]) ? DEPARTMENT_FRAMEWORKS[fwKey] : (typeof DEPARTMENT_FRAMEWORKS !== "undefined" ? DEPARTMENT_FRAMEWORKS.clinical : null);
  
  // Render bảng tổng quan 4 bộ khung chuyên khoa
  renderFrameworkSummaryTable();
  
  // Cập nhật dropdown hiển thị đúng số tiêu chí từ data thực tế
  updateRefFrameworkSelectLabels();
  
  renderStandardsRefAccordion("", fw);
}

// Render bảng tổng quan so sánh 4 bộ khung tiêu chuẩn năng lực
function renderFrameworkSummaryTable() {
  const tbody = document.getElementById("ref-frameworks-summary-tbody");
  if (!tbody || typeof DEPARTMENT_FRAMEWORKS === "undefined") return;

  const fwIcons = {
    clinical: "🏥",
    anesthesia: "💉",
    lab: "🔬",
    outpatient: "🩺"
  };

  const fwColors = {
    clinical: "#0369a1",
    anesthesia: "#7c3aed",
    lab: "#059669",
    outpatient: "#d97706"
  };

  let idx = 0;
  tbody.innerHTML = Object.keys(DEPARTMENT_FRAMEWORKS).map(key => {
    const fw = DEPARTMENT_FRAMEWORKS[key];
    idx++;
    const icon = fwIcons[key] || "📋";
    const color = fwColors[key] || "#334155";
    const unitsText = fw.units.map(u => `<span style="display: inline-block; background: #f1f5f9; border: 1px solid #e2e8f0; border-radius: 4px; padding: 1px 6px; margin: 1px 2px; font-size: 0.75rem; white-space: nowrap;">${u}</span>`).join(" ");

    // Đếm số tiêu chuẩn thực tế
    let totalStandards = 0;
    fw.domains.forEach(d => { totalStandards += d.standards.length; });

    return `
      <tr style="cursor: pointer;" onclick="document.getElementById('ref-framework-select').value='${key}'; switchRefFramework('${key}');">
        <td style="text-align: center; font-weight: 700;">${idx}</td>
        <td>
          <div style="font-weight: 800; color: ${color}; font-size: 0.95rem;">${icon} ${fw.name}</div>
          <div style="font-size: 0.78rem; color: #64748b; margin-top: 2px;">Mã: ${key} · ${totalStandards} Tiêu chuẩn · ${fw.domains.length} Lĩnh vực</div>
        </td>
        <td style="text-align: center;">
          <span style="font-size: 1.15rem; font-weight: 800; color: ${color};">${fw.totalCriteria}</span>
          <div style="font-size: 0.72rem; color: #64748b;">tiêu chí</div>
        </td>
        <td style="text-align: center;">
          <span style="font-size: 1.1rem; font-weight: 800; color: var(--primary);">${fw.maxScore}</span>
          <div style="font-size: 0.72rem; color: #64748b;">điểm</div>
        </td>
        <td style="line-height: 1.6;">${unitsText}</td>
      </tr>
    `;
  }).join("");
}

// Cập nhật label dropdown Khung Chuẩn với số tiêu chí chính xác từ data
function updateRefFrameworkSelectLabels() {
  const select = document.getElementById("ref-framework-select");
  if (!select || typeof DEPARTMENT_FRAMEWORKS === "undefined") return;

  const fwIcons = { clinical: "🏥", anesthesia: "💉", lab: "🔬", outpatient: "🩺" };
  
  Array.from(select.options).forEach(opt => {
    const key = opt.value;
    const fw = DEPARTMENT_FRAMEWORKS[key];
    if (fw) {
      const icon = fwIcons[key] || "📋";
      opt.textContent = `${icon} ${fw.name} (${fw.totalCriteria} Tiêu chí · ${fw.maxScore}đ)`;
    }
  });
}

function renderStandardsRefAccordion(searchQuery, framework) {
  const container = document.getElementById("ref-criteria-accordion");
  if (!container) return;

  const currentFw = framework || (typeof DEPARTMENT_FRAMEWORKS !== "undefined" ? DEPARTMENT_FRAMEWORKS.clinical : null);
  if (!currentFw) return;

  const q = (searchQuery || "").toLowerCase().trim();

  const domainsHtml = currentFw.domains.map(domain => {
    const matchingStandards = domain.standards.map(std => {
      const matchingCriteria = std.criteria.filter(c => {
        if (!q) return true;
        const inName = (c.name || "").toLowerCase().includes(q);
        const inStd = (std.name || "").toLowerCase().includes(q);
        const inDomain = (domain.name || "").toLowerCase().includes(q);
        const inOptions = (c.options || []).some(o => (o.label || "").toLowerCase().includes(q));
        return inName || inStd || inDomain || inOptions;
      });
      return { ...std, matchingCriteria };
    }).filter(std => std.matchingCriteria.length > 0);

    if (matchingStandards.length === 0) return "";

    return `
      <div class="domain-card" style="margin-bottom: 1.25rem;">
        <div class="domain-header" style="cursor: pointer;" onclick="this.nextElementSibling.style.display = this.nextElementSibling.style.display === 'none' ? 'block' : 'none'">
          <div class="domain-title">
            LĨNH VỰC ${domain.code}: ${domain.name} (Tối đa ${domain.maxScore}đ)
          </div>
          <span style="font-size: 0.8rem; color: var(--text-muted);">▼ Bấm để thu gọn / mở rộng</span>
        </div>
        <div class="domain-body" style="display: block; padding: 1rem;">
          ${matchingStandards.map(std => `
            <div style="margin-bottom: 1.25rem; border-left: 3px solid var(--primary); padding-left: 0.75rem;">
              <h4 style="font-size: 0.95rem; font-weight: 800; color: var(--primary-dark); margin-bottom: 0.5rem;">
                ${std.code}. ${std.name}
              </h4>
              <div style="display: flex; flex-direction: column; gap: 0.75rem;">
                ${std.matchingCriteria.map(crit => `
                  <div class="criterion-item" style="background: #ffffff; border: 1px solid var(--border-color); border-radius: var(--radius-md); padding: 0.85rem;">
                    <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.5rem;">
                      <div>
                        <strong style="color: #1e293b; font-size: 0.9rem;">Tiêu chí ${crit.id}: ${crit.name}</strong>
                      </div>
                      <span class="status-pill" style="background: #e0f2fe; color: #0369a1; font-weight: 700; font-size: 0.75rem;">
                        Tối đa ${crit.maxScore}đ
                      </span>
                    </div>

                    <!-- Rubric Breakdown Table -->
                    <div style="background: var(--bg-card-alt); border-radius: var(--radius-sm); padding: 0.5rem 0.75rem; font-size: 0.8rem;">
                      <div style="font-weight: 700; color: #475569; margin-bottom: 0.35rem;">📋 Thang Điểm Rubric Chuẩn Hóa (${crit.options.length} Mức):</div>
                      <table style="width: 100%; border-collapse: collapse;">
                        ${(crit.options || []).map(opt => `
                          <tr style="border-bottom: 1px solid #e2e8f0;">
                            <td style="padding: 0.25rem 0; color: #334155;">• ${opt.label}</td>
                            <td style="padding: 0.25rem 0; text-align: right; font-weight: 700; color: var(--primary); width: 70px;">
                              ${opt.score} điểm
                            </td>
                          </tr>
                        `).join("")}
                      </table>
                    </div>
                  </div>
                `).join("")}
              </div>
            </div>
          `).join("")}
        </div>
      </div>
    `;
  }).join("");

  container.innerHTML = `
    <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: var(--radius-md); padding: 0.75rem 1rem; margin-bottom: 1.25rem; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.5rem;">
      <div>
        <strong style="color: #166534; font-size: 0.95rem;">Khung Chuẩn: ${currentFw.name}</strong>
        <div style="font-size: 0.8rem; color: #15803d;">Áp dụng cho: ${currentFw.units.join(", ")}</div>
      </div>
      <span class="status-pill status-approved" style="font-size: 0.85rem; font-weight: 800;">
        Tổng số: ${currentFw.totalCriteria} Tiêu chí (Tối đa ${currentFw.maxScore}đ)
      </span>
    </div>
    ${domainsHtml || '<div style="text-align: center; padding: 2rem; color: var(--text-muted);">Không tìm thấy tiêu chí nào khớp với từ khóa tìm kiếm.</div>'}
  `;
}

/* =========================================================================
   9. QUẢN LÝ MINH CHỨNG, XEM TRƯỚC VĂN BẢN SCAN & XÓA NHÂN SỰ
   ========================================================================= */
window.openEvidenceModal = function(criterionId) {
  AppState.currentEvidenceCriterionId = criterionId;
  const nurse = AppState.getNurse(AppState.currentSelfNurseId);
  const crit = findCriterionById(criterionId, nurse ? nurse.unit : null);

  const titleEl = document.getElementById("evidence-modal-title");
  if (titleEl) {
    titleEl.textContent = `📎 Đính kèm Minh chứng - Tiêu chí ${criterionId}`;
  }

  const descEl = document.getElementById("evidence-modal-criterion-desc");
  if (descEl && crit) {
    descEl.innerHTML = `<strong>${crit.name}</strong> (Thang điểm: Tối đa ${crit.maxScore}đ)`;
  }

  renderEvidenceModalList();
  document.getElementById("evidence-modal")?.classList.add("active");
};

function closeEvidenceModal() {
  document.getElementById("evidence-modal")?.classList.remove("active");
  AppState.currentEvidenceCriterionId = null;
  renderSelfEvaluationProfile();
  renderSelfEvaluationForm();
}

function renderEvidenceModalList() {
  const listEl = document.getElementById("evidence-modal-list");
  if (!listEl) return;

  const nurse = AppState.getNurse(AppState.currentSelfNurseId);
  const critId = AppState.currentEvidenceCriterionId;
  const attached = (nurse?.evidences || []).filter(e => e.criterionId === critId);

  if (attached.length === 0) {
    listEl.innerHTML = `<div style="text-align: center; color: var(--text-muted); padding: 1.25rem; background: #f8fafc; border-radius: 6px; border: 1.5px dashed #cbd5e1; font-size: 0.85rem;">Chưa có file minh chứng nào cho tiêu chí này. Hãy chọn file bên trên để đính kèm!</div>`;
    return;
  }

  listEl.innerHTML = attached.map(ev => `
    <div class="evidence-tag" style="padding: 0.6rem 0.85rem; font-size: 0.85rem; width: 100%; display: flex; justify-content: space-between; align-items: center; background: #ffffff; border: 1px solid #cbd5e1; border-radius: 6px; box-shadow: var(--shadow-sm);">
      <div style="display: flex; align-items: center; gap: 0.6rem; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 65%;">
        <span style="font-size: 1.3rem;">📄</span>
        <div style="overflow: hidden; text-overflow: ellipsis;">
          <strong style="color: var(--primary-dark); font-size: 0.88rem; display: block; overflow: hidden; text-overflow: ellipsis;">${ev.fileName}</strong>
          <div style="font-size: 0.72rem; color: var(--text-muted);">${ev.fileSize ? `${ev.fileSize} · ` : ''}Ngày tải: ${ev.uploadDate}</div>
        </div>
      </div>
      <div style="display: flex; gap: 0.4rem; flex-shrink: 0;">
        <button type="button" class="btn btn-sm btn-primary" style="font-size: 0.75rem; padding: 0.3rem 0.65rem;" onclick="previewEvidenceDoc('${ev.fileName}')">👁️ Xem file</button>
        <button type="button" class="btn btn-sm btn-danger" style="font-size: 0.75rem; padding: 0.3rem 0.55rem;" onclick="removeEvidenceDoc(${critId}, '${ev.fileName}')">✕ Xóa</button>
      </div>
    </div>
  `).join("");
}

function handleFileUpload(file) {
  if (!file) return;
  const nurse = AppState.getNurse(AppState.currentSelfNurseId);
  const critId = AppState.currentEvidenceCriterionId;
  if (!nurse || !critId) return;

  if (!nurse.evidences) nurse.evidences = [];

  const reader = new FileReader();
  reader.onload = function(e) {
    const fileDataUrl = e.target.result;
    
    // Check if file with same name already attached for this criterion
    const existingIndex = nurse.evidences.findIndex(ev => ev.criterionId === critId && ev.fileName === file.name);
    const newEvidenceObj = {
      criterionId: critId,
      fileName: file.name,
      fileSize: (file.size / 1024).toFixed(1) + " KB",
      fileType: file.type || (file.name.endsWith(".pdf") ? "application/pdf" : "image/jpeg"),
      dataUrl: fileDataUrl,
      uploadDate: new Date().toISOString().split("T")[0],
      verified: true
    };

    if (existingIndex >= 0) {
      nurse.evidences[existingIndex] = newEvidenceObj;
    } else {
      nurse.evidences.push(newEvidenceObj);
    }

    AppState.save();
    renderEvidenceModalList();
    renderSelfEvaluationForm();
  };

  reader.readAsDataURL(file);
}

window.removeEvidenceDoc = function(criterionId, fileName) {
  const nurse = AppState.getNurse(AppState.currentSelfNurseId);
  if (!nurse || !nurse.evidences) return;

  nurse.evidences = nurse.evidences.filter(e => !(e.criterionId === criterionId && e.fileName === fileName));
  AppState.save();
  renderEvidenceModalList();
  renderSelfEvaluationForm();
};

window.previewEvidenceDoc = function(fileName, nurseId) {
  let targetNurseId = nurseId || AppState.currentReviewNurseId || AppState.currentSelfNurseId || AppState.currentPortalNurseId;
  let nurse = AppState.getNurse(targetNurseId) || AppState.nurses[0];
  const modal = document.getElementById("preview-modal");
  const content = document.getElementById("preview-modal-body");
  const title = document.getElementById("preview-modal-title");
  const subtitle = document.getElementById("preview-modal-subtitle");

  if (!modal || !content) return;
  if (title) title.textContent = `📄 Xem Minh Chứng: ${fileName}`;
  if (subtitle) subtitle.textContent = `Nhân sự: ${nurse.fullName} (MSNV: ${nurse.code}) · Đơn vị: ${nurse.unit}`;

  // Find evidence in nurse's evidences
  const ev = (nurse.evidences || []).find(e => e.fileName === fileName);
  AppState.currentPreviewEvidence = { fileName, nurseId: targetNurseId, dataUrl: ev ? ev.dataUrl : null };

  if (ev && ev.dataUrl) {
    if (ev.dataUrl.startsWith("data:image/") || /\.(png|jpe?g|gif|webp|bmp|svg)$/i.test(fileName)) {
      content.innerHTML = `
        <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; width: 100%; padding: 1rem;">
          <img src="${ev.dataUrl}" alt="${fileName}" style="max-width: 100%; max-height: 70vh; object-fit: contain; border-radius: 6px; box-shadow: 0 4px 15px rgba(0,0,0,0.3); background: #ffffff;">
        </div>
      `;
    } else if (ev.dataUrl.startsWith("data:application/pdf") || fileName.toLowerCase().endsWith(".pdf")) {
      content.innerHTML = `
        <iframe src="${ev.dataUrl}" style="width: 100%; height: 600px; border: none; border-radius: 6px; background: #ffffff;"></iframe>
      `;
    } else {
      content.innerHTML = `
        <div style="text-align: center; padding: 2.5rem; color: #ffffff;">
          <div style="font-size: 3.5rem; margin-bottom: 0.75rem;">📎</div>
          <h4 style="font-size: 1.1rem; margin-bottom: 0.5rem;">Tệp minh chứng đính kèm: ${fileName}</h4>
          <p style="color: #cbd5e1; font-size: 0.85rem; margin-bottom: 1.25rem;">Tệp văn bản đã được đính kèm vào hệ thống. Bạn có thể bấm nút Tải về bên dưới để mở file.</p>
          <button type="button" class="btn btn-primary" onclick="downloadCurrentPreviewDoc()">📥 Tải file về máy xem</button>
        </div>
      `;
    }
  } else {
    content.innerHTML = generateSampleCertificateHtml(fileName, nurse);
  }

  modal.classList.add("active");
};

window.downloadCurrentPreviewDoc = function() {
  const previewData = AppState.currentPreviewEvidence;
  if (!previewData) return;

  if (previewData.dataUrl) {
    const a = document.createElement("a");
    a.href = previewData.dataUrl;
    a.download = previewData.fileName || "minh_chung.pdf";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  } else {
    window.print();
  }
};

function generateSampleCertificateHtml(fileName, nurse) {
  const fLower = fileName.toLowerCase();
  
  if (fLower.includes("cme") || fLower.includes("chungchi") || fLower.includes("daotao")) {
    return `
      <div class="certificate-paper" style="border-color: #0d9488;">
        <div class="cert-watermark">CME - UMC</div>
        <div class="cert-header">
          <div class="cert-gov">BỆNH VIỆN ĐẠI HỌC Y DƯỢC TP. HỒ CHÍ MINH</div>
          <div class="cert-motto">TRUNG TÂM ĐÀO TẠO NHÂN LỰC Y TẾ THEO NHU CẦU XÃ HỘI</div>
        </div>
        <div class="cert-title-block">
          <div class="cert-main-title" style="color: #0f766e;">CHỨNG NHẬN ĐÀO TẠO LIÊN TỤC (CME)</div>
          <div class="cert-sub-title">Cấp theo Thông tư 22/2013/TT-BYT của Bộ Y tế</div>
        </div>
        <div class="cert-recipient-name">${nurse.fullName}</div>
        <div class="cert-body-text">
          Đã hoàn thành xuất sắc khóa đào tạo liên tục chuyên ngành: <strong>"Kỹ năng Chăm sóc Lâm sàng Nâng cao & An toàn Người bệnh"</strong>.
          <br>Thời lượng: <strong>24 tiết</strong> lý thuyết và thực hành lâm sàng.
        </div>
        <div class="cert-signatures">
          <div class="cert-sig-box">
            <div class="cert-seal" style="border-color: #0d9488; color: #0d9488;">TRUNG TÂM ĐÀO TẠO<br>BV ĐHYD TP.HCM<br>★</div>
          </div>
          <div class="cert-sig-box">
            <div style="font-size: 0.8rem; font-style: italic;">TP.HCM, ngày 15 tháng 11 năm 2024</div>
            <div style="font-weight: 700; margin-top: 0.25rem;">TRƯỞNG PHÒNG ĐÀO TẠO / TRƯỞNG BAN ĐD</div>
            <div style="height: 45px;"></div>
            <div style="font-weight: 700;">ThS. Phan Thị Tâm Đan</div>
          </div>
        </div>
      </div>
    `;
  } else {
    return `
      <div class="certificate-paper">
        <div class="cert-watermark">ĐẠI HỌC Y DƯỢC</div>
        <div class="cert-header">
          <div class="cert-gov">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</div>
          <div class="cert-motto">Độc lập - Tự do - Hạnh phúc</div>
          <div class="cert-issuer">ĐẠI HỌC Y DƯỢC TP. HỒ CHÍ MINH</div>
        </div>
        <div class="cert-title-block">
          <div class="cert-main-title">BẰNG CỬ NHÂN</div>
          <div class="cert-sub-title">Ngành: ĐIỀU DƯỠNG (Hệ Chính quy)</div>
        </div>
        <div class="cert-recipient-name">${nurse.fullName}</div>
        <div class="cert-body-text">
          Đã hoàn thành xuất sắc chương trình đào tạo Cử nhân Điều dưỡng Đa khoa. Được công nhận tốt nghiệp và cấp bằng Cử nhân Điều dưỡng. Xếp loại: <strong>Giỏi</strong>.
        </div>
        <div class="cert-signatures">
          <div class="cert-sig-box">
            <div class="cert-seal">ĐẠI HỌC Y DƯỢC<br>TP.HCM<br>★</div>
          </div>
          <div class="cert-sig-box">
            <div style="font-size: 0.8rem; font-style: italic;">TP. Hồ Chí Minh, ngày 20 tháng 07 năm 2022</div>
            <div style="font-weight: 700; margin-top: 0.25rem;">HIỆU TRƯỞNG</div>
            <div style="height: 45px;"></div>
            <div style="font-weight: 700; font-size: 0.95rem;">PGS. TS. Ngô Quốc Đạt</div>
          </div>
        </div>
      </div>
    `;
  }
}

// Xóa nhân sự
window.deleteNurse = function(nurseId) {
  const nurse = AppState.getNurse(nurseId);
  if (!nurse) return;

  if (AppState.currentUser.role === "staff") {
    alert("⛔ Bạn không có quyền xóa nhân sự! Chỉ Điều dưỡng Trưởng hoặc Admin mới có quyền xóa.");
    return;
  }

  if (!confirm(`⚠️ CẢNH BÁO QUAN TRỌNG!\n\nBạn có chắc chắn muốn XÓA HOÀN TOÀN hồ sơ của nhân sự:\n- Họ và tên: ${nurse.fullName}\n- MSNV: ${nurse.code}\n- Đơn vị: ${nurse.unit}\n\nThao tác này không thể hoàn tác!`)) {
    return;
  }

  AppState.nurses = AppState.nurses.filter(n => n.id !== nurseId);
  if (AppState.currentSelfNurseId === nurseId && AppState.nurses.length > 0) {
    AppState.currentSelfNurseId = AppState.nurses[0].id;
    AppState.currentPortalNurseId = AppState.nurses[0].id;
  }

  AppState.save();
  refreshAllNurseSelects();
  renderSelfEvaluationProfile();
  renderSelfEvaluationForm();
  renderManagerNursesTable();
  renderPortfolioView();
  renderAnalyticsDashboard();

  alert(`Đã xóa thành công nhân sự ${nurse.fullName} (MSNV: ${nurse.code})!`);
};

window.openEditNurseModal = function(nurseId) {
  const nurse = AppState.getNurse(nurseId);
  if (!nurse) return;

  document.getElementById("edit-nurse-id").value = nurse.id;
  document.getElementById("edit-nurse-code").value = nurse.code;
  document.getElementById("edit-nurse-name").value = nurse.fullName;
  const evalYearInput = document.getElementById("edit-nurse-eval-year");
  if (evalYearInput) evalYearInput.value = nurse.evaluationYear || 2025;
  document.getElementById("edit-nurse-gender").value = nurse.gender || "Nữ";
  
  const unitSelect = document.getElementById("edit-nurse-unit");
  if (unitSelect) {
    unitSelect.innerHTML = generateGroupedUnitsOptions(nurse.unit, false);
    unitSelect.value = nurse.unit;
  }

  document.getElementById("edit-nurse-position").value = nurse.position || "Điều dưỡng Lâm sàng";
  document.getElementById("edit-nurse-degree").value = nurse.degree || "Đại Học";
  document.getElementById("edit-nurse-school").value = nurse.degreeSchool || "Đại học Y Dược TP.HCM";
  document.getElementById("edit-nurse-years").value = nurse.experienceYears || 0;
  document.getElementById("edit-nurse-months").value = nurse.experienceMonths || 0;
  document.getElementById("edit-nurse-exam-score").value = nurse.examScore || "8.0";
  document.getElementById("edit-nurse-research").value = nurse.hasTeachingResearch ? "yes" : "no";

  document.getElementById("edit-nurse-modal")?.classList.add("active");
};

window.handleUpdateNurseInfo = function(e) {
  e.preventDefault();
  const id = document.getElementById("edit-nurse-id").value;
  const nurse = AppState.getNurse(id);
  if (!nurse) return;

  nurse.fullName = document.getElementById("edit-nurse-name").value.trim();
  const evalYearInput = document.getElementById("edit-nurse-eval-year");
  if (evalYearInput) nurse.evaluationYear = parseInt(evalYearInput.value) || 2025;
  nurse.gender = document.getElementById("edit-nurse-gender").value;
  nurse.unit = document.getElementById("edit-nurse-unit").value;
  nurse.position = document.getElementById("edit-nurse-position").value;
  nurse.degree = document.getElementById("edit-nurse-degree").value;
  nurse.degreeSchool = document.getElementById("edit-nurse-school").value;
  nurse.experienceYears = parseInt(document.getElementById("edit-nurse-years").value) || 0;
  nurse.experienceMonths = parseInt(document.getElementById("edit-nurse-months").value) || 0;
  nurse.experienceText = `${nurse.experienceYears} năm` + (nurse.experienceMonths > 0 ? ` ${nurse.experienceMonths} tháng` : '');
  nurse.examScore = document.getElementById("edit-nurse-exam-score").value;
  nurse.hasTeachingResearch = document.getElementById("edit-nurse-research").value === "yes";
  nurse.teachingResearchNote = nurse.hasTeachingResearch ? "Có bài giảng và đề tài NCKH" : "Chưa có";

  // Đánh giá lại cấp bậc
  const evalRes = ActionPlanEngine.evaluateCompetency(nurse, nurse.managerScores || nurse.selfScores);
  nurse.currentLevel = evalRes.achievedLevel;
  nurse.totalScore2025 = evalRes.totalScore;

  AppState.save();
  document.getElementById("edit-nurse-modal")?.classList.remove("active");

  refreshAllNurseSelects();
  renderSelfEvaluationProfile();
  renderSelfEvaluationForm();
  renderManagerNursesTable();
  renderPortfolioView();
  renderAnalyticsDashboard();

  alert(`Đã cập nhật thành công thông tin cho ${nurse.fullName}!`);
};

window.handleSaveEditNurse = window.handleUpdateNurseInfo;

window.deleteCurrentEditNurse = function() {
  const id = document.getElementById("edit-nurse-id")?.value;
  if (!id) return;
  document.getElementById("edit-nurse-modal")?.classList.remove("active");
  deleteNurse(id);
};

/* =========================================================================
   10. TẠO HỒ SƠ & ĐĂNG KÝ ĐIỀU DƯỠNG MỚI
   ========================================================================= */
window.toggleExamScoreInput = function(val) {
  const group = document.getElementById("exam-score-num-group");
  if (group) {
    group.style.display = val === "score" ? "block" : "none";
  }
};

// Hàm sinh điểm tự đánh giá thông minh & chi tiết cho 100% tiêu chí theo đúng Khung chuẩn của từng Khoa
function generateRealisticScoresForFramework(fw, preset, nurseData) {
  const scores = {};
  if (!fw || !fw.domains) return scores;
  if (preset === "empty") return scores; // Bắt đầu trống 0 điểm để nhân viên tự đánh giá

  const { degree, degreeSchool, experienceYears, position, hasTeachingResearch, examScore } = nurseData;
  const years = Number(experienceYears) || 0;

  // Xác định hệ số mức độ tự đánh giá (0.55 -> 0.95)
  let ratio = 0.78; // mặc định Mức 3 (Vững chuyên môn ~750đ)
  if (preset === "level_1") ratio = 0.56;
  else if (preset === "level_2") ratio = 0.68;
  else if (preset === "level_3") ratio = 0.78;
  else if (preset === "level_4") ratio = 0.92;
  else if (preset === "auto") {
    if (years >= 12 || (degree && (degree.includes("Thạc sĩ") || degree.includes("CKI")))) ratio = 0.90;
    else if (years >= 6) ratio = 0.80;
    else if (years >= 3) ratio = 0.68;
    else ratio = 0.58;
  }

  fw.domains.forEach(domain => {
    domain.standards.forEach(std => {
      std.criteria.forEach(crit => {
        let score = 0;
        
        // 1. Tiêu chí 1: Trình độ cử nhân & Cơ sở đào tạo
        if (crit.id === 1) {
          if (degreeSchool && degreeSchool.includes("Đại học Y Dược TP.HCM")) score = 90;
          else if (degreeSchool && degreeSchool.includes("Miền Đông")) score = 80;
          else if (degreeSchool && (degreeSchool.includes("Phạm Ngọc Thạch") || degreeSchool.includes("Hà Nội"))) score = 70;
          else if (degree && degree === "Cao đẳng") score = 20;
          else score = 50;
        }
        // 2. Tiêu chí 2: Bằng Sau đại học
        else if (crit.id === 2) {
          if (degree && (degree.includes("Thạc sĩ") || degree.includes("Chuyên khoa 1") || degree.includes("CKI"))) score = 25;
          else if (degree && degree.includes("Tiến sĩ")) score = 40;
          else score = 0;
        }
        // 3. Tiêu chí Thâm niên (TC 66 hoặc tương đương)
        else if (crit.id === 66 || (crit.name && (crit.name.toLowerCase().includes("thâm niên") || crit.name.toLowerCase().includes("kinh nghiệm")))) {
          if (years > 15) score = 50;
          else if (years >= 10) score = 45;
          else if (years >= 6) score = 35;
          else if (years >= 3) score = 25;
          else score = 15;
        }
        // 4. Tiêu chí NCKH & Giảng dạy
        else if (crit.name && (crit.name.toLowerCase().includes("nghiên cứu khoa học") || crit.name.toLowerCase().includes("bài giảng") || crit.name.toLowerCase().includes("đào tạo"))) {
          if (hasTeachingResearch) score = crit.maxScore;
          else score = Math.round(crit.maxScore * (ratio > 0.8 ? 0.6 : 0.2));
        }
        // 5. Tiêu chí có Rubric options cụ thể
        else if (crit.options && crit.options.length > 0) {
          const sorted = [...crit.options].sort((a, b) => a.score - b.score);
          let targetScore = crit.maxScore * ratio;
          let bestOpt = sorted[0];
          let minDiff = 9999;
          sorted.forEach(opt => {
            const diff = Math.abs(opt.score - targetScore);
            if (diff < minDiff) {
              minDiff = diff;
              bestOpt = opt;
            }
          });
          score = bestOpt ? bestOpt.score : 0;
        }
        // 6. Tiêu chí phân cấp Level 1..5
        else if (crit.type === "level_5" && crit.levels) {
          const targetScore = crit.maxScore * ratio;
          let bestLvl = crit.levels[0];
          let minDiff = 9999;
          crit.levels.forEach(lvl => {
            const diff = Math.abs(lvl.score - targetScore);
            if (diff < minDiff) {
              minDiff = diff;
              bestLvl = lvl;
            }
          });
          score = bestLvl ? bestLvl.score : 0;
        }
        // 7. Điểm số thông thường
        else {
          score = Math.round(crit.maxScore * ratio);
        }

        scores[crit.id] = Math.min(crit.maxScore, Math.max(0, score));
      });
    });
  });

  return scores;
}

// Cập nhật Live Preview khung chuẩn & điểm tự đánh giá trong Modal Thêm Nhân Viên
window.updateNewNurseScorePreview = function() {
  const unit = document.getElementById("new-nurse-unit")?.value.trim() || "Đơn vị Chấn thương Chỉnh hình";
  const degree = document.getElementById("new-nurse-degree")?.value || "Đại Học";
  const school = document.getElementById("new-nurse-school")?.value || "Đại học Y Dược TP.HCM";
  const years = parseInt(document.getElementById("new-nurse-years")?.value) || 0;
  const months = parseInt(document.getElementById("new-nurse-months")?.value) || 0;
  const position = document.getElementById("new-nurse-position")?.value || "Điều dưỡng Lâm sàng";
  const preset = document.getElementById("new-nurse-eval-preset")?.value || "empty";
  const hasResearch = document.getElementById("new-nurse-research")?.value === "yes";
  const examScore = parseFloat(document.getElementById("new-nurse-exam-score")?.value) || 8.0;

  const fw = typeof getFrameworkForUnit === "function" ? getFrameworkForUnit(unit) : null;
  const totalCrit = fw ? fw.totalCriteria : 66;
  const maxScore = fw ? fw.maxScore : 1025;
  const fwName = fw ? fw.name : "Điều dưỡng Lâm sàng";

  const badgeElem = document.getElementById("new-nurse-framework-badge");
  if (badgeElem) {
    badgeElem.innerHTML = `🏥 Khung chuẩn: <strong>${fwName}</strong> (${totalCrit} Tiêu chí · Tối đa ${maxScore}đ)`;
  }

  // Cập nhật dòng gợi ý số tiêu chí động
  const hintElem = document.getElementById("new-nurse-criteria-hint-text");
  if (hintElem) {
    hintElem.innerHTML = `* Sau khi tạo, hệ thống sẽ mở ngay bảng điểm chi tiết <strong>${totalCrit} tiêu chí</strong> (${fwName}) để nhân viên tự chấm điểm và đính kèm minh chứng!`;
  }

  const pillElem = document.getElementById("new-nurse-preview-score-pill");
  if (preset === "empty") {
    if (pillElem) {
      pillElem.innerHTML = `Tự Đánh Giá: <strong>0 Điểm</strong> (Chưa chấm)`;
      pillElem.style.background = "#f1f5f9";
      pillElem.style.color = "#475569";
      pillElem.style.borderColor = "#cbd5e1";
    }
  } else {
    const tempNurseData = {
      degree, degreeSchool: school, experienceYears: years, experienceMonths: months, position, hasTeachingResearch: hasResearch, examScore
    };
    const calculatedScores = generateRealisticScoresForFramework(fw, preset, tempNurseData);
    const evalRes = ActionPlanEngine.evaluateCompetency({ ...tempNurseData, unit }, calculatedScores);
    if (pillElem) {
      pillElem.innerHTML = `Tự Đánh Giá: <strong>${evalRes.totalScore} / ${maxScore} Điểm</strong> (Cấp ${evalRes.achievedLevel} - ${evalRes.currentConfig.badge})`;
      pillElem.style.background = "#dcfce7";
      pillElem.style.color = "#15803d";
      pillElem.style.borderColor = "#86efac";
    }
  }

  const previewBox = document.getElementById("new-nurse-criteria-preview-box");
  if (previewBox && previewBox.style.display !== "none") {
    const tempNurseData = {
      degree, degreeSchool: school, experienceYears: years, experienceMonths: months, position, hasTeachingResearch: hasResearch, examScore
    };
    const calculatedScores = generateRealisticScoresForFramework(fw, preset, tempNurseData);
    const evalRes = ActionPlanEngine.evaluateCompetency({ ...tempNurseData, unit }, calculatedScores);
    renderNewNurseCriteriaPreviewContent(fw, calculatedScores, evalRes, preset);
  }
};

window.toggleNewNurseCriteriaPreview = function() {
  const box = document.getElementById("new-nurse-criteria-preview-box");
  if (!box) return;
  const isHidden = box.style.display === "none";
  box.style.display = isHidden ? "block" : "none";
  if (isHidden) {
    updateNewNurseScorePreview();
  }
};

function renderNewNurseCriteriaPreviewContent(fw, calculatedScores, evalRes, preset) {
  const box = document.getElementById("new-nurse-criteria-preview-box");
  if (!box || !fw) return;

  if (preset === "empty") {
    box.innerHTML = `
      <div style="font-weight: 700; color: #166534; margin-bottom: 0.5rem; display: flex; justify-content: space-between; border-bottom: 1px dashed #86efac; padding-bottom: 0.4rem;">
        <span>Khởi tạo bảng tự đánh giá (${fw.totalCriteria} Tiêu chí):</span>
        <span style="color: #0369a1;">Tổng điểm ban đầu: 0đ / ${fw.maxScore}đ</span>
      </div>
      <div style="font-size: 0.8rem; color: #475569; padding: 0.5rem 0;">
        🌱 <strong>Chế độ mặc định:</strong> Bảng điểm của nhân viên sẽ bắt đầu ở mức <strong>0 điểm</strong> (chưa có điểm tự chấm trước đó). Sau khi tạo hồ sơ, hệ thống sẽ mở ngay bảng đánh giá để nhân viên tự chấm điểm từng tiêu chuẩn và đính kèm file scan minh chứng.
      </div>
    `;
    return;
  }

  let html = `
    <div style="font-weight: 700; color: #166534; margin-bottom: 0.5rem; display: flex; justify-content: space-between; border-bottom: 1px dashed #86efac; padding-bottom: 0.4rem; flex-wrap: wrap; gap: 0.5rem;">
      <span>Phân bổ điểm 5 Lĩnh vực (${fw.totalCriteria} Tiêu chí):</span>
      <span style="color: #0369a1;">Tổng điểm dự kiến: ${evalRes.totalScore}đ / ${fw.maxScore}đ</span>
    </div>
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(170px, 1fr)); gap: 0.5rem; margin-bottom: 0.75rem;">
  `;

  fw.domains.forEach(d => {
    const dScore = evalRes.domainScores[d.id] || 0;
    html += `
      <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 4px; padding: 0.45rem 0.6rem;">
        <div style="font-weight: 700; font-size: 0.75rem; color: #334155;">${d.code}: ${d.name}</div>
        <div style="font-size: 0.85rem; font-weight: 800; color: #0284c7; margin-top: 0.15rem;">${dScore} / ${d.maxScore}đ</div>
      </div>
    `;
  });

  html += `
    </div>
    <div style="font-size: 0.75rem; color: #64748b; line-height: 1.4;">
      💡 <em>Nhấn nút <strong>"🚀 Tạo Hồ Sơ & Mở Bảng Chấm Điểm"</strong>, hệ thống sẽ mở trực tiếp trang tự đánh giá với đầy đủ ${fw.totalCriteria} tiêu chí và thang điểm Rubric chi tiết để nhân viên tự chấm điểm và đính kèm minh chứng!</em>
    </div>
  `;

  box.innerHTML = html;
}

window.handleCreateNewNurse = function(e) {
  e.preventDefault();

  const code = document.getElementById("new-nurse-code")?.value.trim().toUpperCase();
  const name = document.getElementById("new-nurse-name")?.value.trim();
  const evalYear = parseInt(document.getElementById("new-nurse-eval-year")?.value) || 2025;
  const gender = document.getElementById("new-nurse-gender")?.value || "Nữ";
  const unit = document.getElementById("new-nurse-unit")?.value.trim() || "Đơn vị Chấn thương Chỉnh hình";
  const position = document.getElementById("new-nurse-position")?.value || "Điều dưỡng Lâm sàng";
  const degree = document.getElementById("new-nurse-degree")?.value || "Đại Học";
  const school = document.getElementById("new-nurse-school")?.value || "Đại học Y Dược TP.HCM";
  const years = parseInt(document.getElementById("new-nurse-years")?.value) || 0;
  const months = parseInt(document.getElementById("new-nurse-months")?.value) || 0;
  const preset = document.getElementById("new-nurse-eval-preset")?.value || "empty";
  const autoEvidence = document.getElementById("new-nurse-auto-evidence")?.value || "no";
  
  const examType = document.getElementById("new-nurse-exam-type")?.value || "score";
  let examScore = "Chưa thi";
  if (examType === "score") {
    examScore = parseFloat(document.getElementById("new-nurse-exam-score")?.value) || 8.0;
  } else {
    examScore = examType;
  }

  const hasResearch = document.getElementById("new-nurse-research")?.value === "yes";

  if (AppState.nurses.some(n => n.code === code)) {
    alert(`Mã nhân viên "${code}" đã tồn tại trong hệ thống! Vui lòng kiểm tra lại.`);
    return;
  }

  const fw = typeof getFrameworkForUnit === "function" ? getFrameworkForUnit(unit) : null;
  const nurseDataTemp = {
    degree, degreeSchool: school, experienceYears: years, experienceMonths: months, position, hasTeachingResearch: hasResearch, examScore
  };

  // Khởi tạo bảng điểm: nếu preset === "empty", để trống {} (0 điểm)
  const initialSelfScores = (preset === "empty") ? {} : generateRealisticScoresForFramework(fw, preset, nurseDataTemp);

  const newId = "NV_" + (Date.now());
  const expText = `${years} năm` + (months > 0 ? ` ${months} tháng` : '');
  const cleanNameSlug = name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, "");

  const initialEvidences = [];
  if (autoEvidence === "yes") {
    initialEvidences.push({
      criterionId: 1,
      fileName: `${cleanNameSlug}-${code}-BangTotNghiep.pdf`,
      uploadDate: new Date().toISOString().split("T")[0],
      verified: true
    });
    initialEvidences.push({
      criterionId: 18,
      fileName: `${cleanNameSlug}-${code}-ChungChiHanhNghe.pdf`,
      uploadDate: new Date().toISOString().split("T")[0],
      verified: true
    });
  }

  const newNurseObj = {
    id: newId,
    code: code,
    fullName: name,
    evaluationYear: evalYear,
    gender: gender,
    unit: unit,
    position: position,
    userRole: "staff",
    degree: degree,
    degreeSchool: school,
    experienceYears: years,
    experienceMonths: months,
    experienceText: expText,
    examScore: examScore,
    examStatus: typeof examScore === 'number' ? (examScore >= 7.0 ? 'Đạt' : 'Chưa đạt') : examScore,
    hasTeachingResearch: hasResearch,
    teachingResearchNote: hasResearch ? "Có bài giảng và đề tài NCKH" : "Chưa có",
    status: "draft",
    currentLevel: 0,
    totalScore2024: null,
    totalScore2025: 0,
    approvalWorkflow: {
      dept: { approved: false, reviewer: "", title: "", date: "", note: "" },
      nursingBoard: { approved: false, reviewer: "", title: "", date: "", note: "" },
      hospital: { decided: false, decisionNumber: "", signer: "", title: "", date: "", note: "" }
    },
    cmeList: [
      { 
        id: "cme_" + Date.now(), 
        year: evalYear, 
        title: "Định hướng chuẩn thực hành Điều dưỡng UMC", 
        hours: 24, 
        learningOutcomes: "Nắm vững văn hóa an toàn người bệnh và quy tắc đạo đức nghề nghiệp", 
        institution: unit, 
        date: new Date().toISOString().split("T")[0], 
        certFile: `${cleanNameSlug}-${code}-CME_${evalYear}.pdf`, 
        praiseMessage: `Chúc mừng Điều dưỡng ${name} đã hoàn thành khóa định hướng chuẩn thực hành tại BV ĐHYD TP.HCM!` 
      }
    ],
    selfScores: initialSelfScores,
    managerScores: (preset === "empty") ? {} : JSON.parse(JSON.stringify(initialSelfScores)),
    evidences: initialEvidences,
    managerFeedback: ""
  };

  const evalRes = ActionPlanEngine.evaluateCompetency(newNurseObj, newNurseObj.selfScores);
  newNurseObj.currentLevel = evalRes.achievedLevel;
  newNurseObj.totalScore2025 = evalRes.totalScore;

  AppState.nurses.push(newNurseObj);
  AppState.currentSelfNurseId = newId;
  AppState.currentPortalNurseId = newId;
  AppState.currentPortfolioNurseId = newId;
  AppState.save();

  document.getElementById("new-nurse-modal")?.classList.remove("active");
  document.getElementById("new-nurse-form")?.reset();

  // Đồng bộ giao diện toàn hệ thống
  const selfUnitFilter = document.getElementById("self-eval-unit-filter");
  if (selfUnitFilter && selfUnitFilter.value !== "ALL" && selfUnitFilter.value !== unit) {
    selfUnitFilter.value = "ALL";
  }

  populateAllUnitDropdowns();
  refreshAllNurseSelects();
  
  // Đặt chọn nhân sự mới trong bộ chọn Tab 1
  const selfSelect = document.getElementById("self-eval-nurse-select");
  if (selfSelect) selfSelect.value = newId;

  renderSelfEvaluationProfile();
  renderSelfEvaluationForm();
  renderManagerNursesTable();
  renderPortfolioView();
  renderAnalyticsDashboard();
  renderPersonalPortal();

  // Chuyển ngay sang Tab 1 để người dùng/nhân viên thấy trực quan bảng điểm tự đánh giá
  document.getElementById("btn-tab-self-eval")?.click();

  if (evalRes.totalScore === 0) {
    alert(`🎉 TẠO THÀNH CÔNG HỒ SƠ ĐIỀU DƯỠNG MỚI!\n\n` +
          `👤 Nhân viên: ${name} (MSNV: ${code})\n` +
          `🏥 Đơn vị: ${unit}\n` +
          `📅 Năm đánh giá: ${evalYear}\n` +
          `📋 Khung chuẩn: ${fw ? fw.name : 'Điều dưỡng Lâm sàng'} (${fw ? fw.totalCriteria : 66} Tiêu chí)\n` +
          `⭐ Điểm tự đánh giá ban đầu: 0 điểm (Chưa đánh giá)\n\n` +
          `👉 Hệ thống đã mở sẵn bảng tự đánh giá. Nhân viên có thể bắt đầu tự chấm điểm từng tiêu chí và đính kèm file scan minh chứng ngay bây giờ!`);
  } else {
    alert(`🎉 TẠO THÀNH CÔNG HỒ SƠ ĐÁNH GIÁ NĂNG LỰC!\n\n` +
          `👤 Nhân viên: ${name} (MSNV: ${code})\n` +
          `🏥 Đơn vị: ${unit}\n` +
          `📅 Năm đánh giá: ${evalYear}\n` +
          `📋 Khung chuẩn: ${fw ? fw.name : 'Điều dưỡng Lâm sàng'} (${fw ? fw.totalCriteria : 66} Tiêu chí)\n` +
          `⭐ Tổng điểm tự đánh giá: ${evalRes.totalScore} / ${fw ? fw.maxScore : 1025} điểm\n` +
          `🏆 Cấp bậc đạt được: Cấp ${evalRes.achievedLevel} (${evalRes.currentConfig.badge})\n\n` +
          `👉 Hệ thống đã mở sẵn bảng điểm chi tiết của ${name}.`);
  }
};

function initModals() {
  document.getElementById("btn-close-evidence-modal")?.addEventListener("click", closeEvidenceModal);
  document.getElementById("btn-done-evidence")?.addEventListener("click", closeEvidenceModal);
  
  document.getElementById("btn-close-preview-modal")?.addEventListener("click", () => {
    document.getElementById("preview-modal")?.classList.remove("active");
  });

  const openNewNurseModal = () => {
    document.getElementById("new-nurse-modal")?.classList.add("active");
    if (typeof updateNewNurseScorePreview === "function") {
      updateNewNurseScorePreview();
    }
  };
  const closeNewNurseModal = () => {
    document.getElementById("new-nurse-modal")?.classList.remove("active");
  };

  document.getElementById("btn-open-new-nurse-modal")?.addEventListener("click", openNewNurseModal);
  document.getElementById("btn-sidebar-add-nurse")?.addEventListener("click", openNewNurseModal);
  document.getElementById("btn-close-new-nurse-modal")?.addEventListener("click", closeNewNurseModal);
  document.getElementById("btn-cancel-new-nurse")?.addEventListener("click", closeNewNurseModal);

  // Lắng nghe thay đổi các trường trong modal thêm mới để cập nhật live preview
  ["new-nurse-unit", "new-nurse-eval-year", "new-nurse-degree", "new-nurse-school", "new-nurse-years", "new-nurse-months", "new-nurse-position", "new-nurse-eval-preset"].forEach(id => {
    document.getElementById(id)?.addEventListener("change", () => {
      if (typeof updateNewNurseScorePreview === "function") {
        updateNewNurseScorePreview();
      }
    });
  });

  document.getElementById("btn-close-edit-nurse-modal")?.addEventListener("click", () => {
    document.getElementById("edit-nurse-modal")?.classList.remove("active");
  });
  document.getElementById("btn-cancel-edit-nurse")?.addEventListener("click", () => {
    document.getElementById("edit-nurse-modal")?.classList.remove("active");
  });

  document.getElementById("btn-download-preview-doc")?.addEventListener("click", () => {
    if (typeof downloadCurrentPreviewDoc === "function") {
      downloadCurrentPreviewDoc();
    }
  });

  document.getElementById("btn-print-preview-doc")?.addEventListener("click", () => {
    window.print();
  });

  const dropzone = document.getElementById("dropzone-area");
  const fileInput = document.getElementById("evidence-file-input");

  if (dropzone && fileInput) {
    dropzone.addEventListener("click", () => fileInput.click());

    dropzone.addEventListener("dragover", (e) => {
      e.preventDefault();
      dropzone.style.borderColor = "var(--primary)";
      dropzone.style.background = "#eff6ff";
    });

    dropzone.addEventListener("dragleave", (e) => {
      e.preventDefault();
      dropzone.style.borderColor = "#cbd5e1";
      dropzone.style.background = "#f8fafc";
    });

    dropzone.addEventListener("drop", (e) => {
      e.preventDefault();
      dropzone.style.borderColor = "#cbd5e1";
      dropzone.style.background = "#f8fafc";
      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        Array.from(e.dataTransfer.files).forEach(file => handleFileUpload(file));
      }
    });

    fileInput.addEventListener("change", (e) => {
      if (e.target.files && e.target.files.length > 0) {
        Array.from(e.target.files).forEach(file => handleFileUpload(file));
        fileInput.value = "";
      }
    });
  }
}
