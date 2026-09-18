const fs = require('fs');
const path = require('path');

const indexPath = path.join(__dirname, '..', 'index.html');
let html = fs.readFileSync(indexPath, 'utf8');

// 1. Update quick login buttons
const oldQuickLoginRegex = /<div class="grid grid-cols-2 gap-2 text-xs">[\s\S]*?<\/div>\s*<\/div>\s*<\/form>/;

const newQuickLogin = `<div class="grid grid-cols-2 gap-2 text-xs">
              <button onclick="quickLoginAs('usr_khambenh_01')" class="p-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-950 rounded-xl border border-emerald-200 text-left font-semibold transition-all flex items-center gap-2">
                <span class="text-base">📋</span>
                <div>
                  <div class="font-bold text-[11px]">ĐD Lê Thị Thu Thảo</div>
                  <div class="text-[10px] text-emerald-700">Khoa Khám Bệnh (71 TC)</div>
                </div>
              </button>

              <button onclick="quickLoginAs('usr_gayme_01')" class="p-2 bg-purple-50 hover:bg-purple-100 text-purple-950 rounded-xl border border-purple-200 text-left font-semibold transition-all flex items-center gap-2">
                <span class="text-base">💉</span>
                <div>
                  <div class="font-bold text-[11px]">KTV Trần Hoàng Nam</div>
                  <div class="text-[10px] text-purple-700">Gây Mê Hồi Sức (66 TC)</div>
                </div>
              </button>

              <button onclick="quickLoginAs('usr_noisoi_01')" class="p-2 bg-teal-50 hover:bg-teal-100 text-teal-950 rounded-xl border border-teal-200 text-left font-semibold transition-all flex items-center gap-2">
                <span class="text-base">🩺</span>
                <div>
                  <div class="font-bold text-[11px]">ĐD Hoàng Mai Phương</div>
                  <div class="text-[10px] text-teal-700">Khoa Nội Soi (66 TC)</div>
                </div>
              </button>

              <button onclick="quickLoginAs('usr_cdha_01')" class="p-2 bg-cyan-50 hover:bg-cyan-100 text-cyan-950 rounded-xl border border-cyan-200 text-left font-semibold transition-all flex items-center gap-2">
                <span class="text-base">🩻</span>
                <div>
                  <div class="font-bold text-[11px]">KTV Ngô Văn Hùng</div>
                  <div class="text-[10px] text-cyan-700">Chẩn Đoán Hình Ảnh (73 TC)</div>
                </div>
              </button>

              <button onclick="quickLoginAs('usr_vltl_01')" class="p-2 bg-orange-50 hover:bg-orange-100 text-orange-950 rounded-xl border border-orange-200 text-left font-semibold transition-all flex items-center gap-2">
                <span class="text-base">🏃</span>
                <div>
                  <div class="font-bold text-[11px]">KTV Đặng Thanh Thảo</div>
                  <div class="text-[10px] text-orange-700">PHCN - VLTL (65 TC)</div>
                </div>
              </button>

              <button onclick="quickLoginAs('usr_xetnghiem_01')" class="p-2 bg-amber-50 hover:bg-amber-100 text-amber-950 rounded-xl border border-amber-200 text-left font-semibold transition-all flex items-center gap-2">
                <span class="text-base">🔬</span>
                <div>
                  <div class="font-bold text-[11px]">KTV Phạm Minh Trí</div>
                  <div class="text-[10px] text-amber-800">Khoa Xét Nghiệm (63 TC)</div>
                </div>
              </button>

              <button onclick="quickLoginAs('usr_ksnk_01')" class="p-2 bg-slate-50 hover:bg-slate-100 text-slate-900 rounded-xl border border-slate-200 text-left font-semibold transition-all flex items-center gap-2">
                <span class="text-base">🛡️</span>
                <div>
                  <div class="font-bold text-[11px]">ĐD Lê Minh Tuấn</div>
                  <div class="text-[10px] text-slate-600">Kiểm Soát NK (66 TC)</div>
                </div>
              </button>

              <button onclick="quickLoginAs('usr_ngan_ttm')" class="p-2 bg-blue-50 hover:bg-blue-100 text-blue-900 rounded-xl border border-blue-200 text-left font-semibold transition-all flex items-center gap-2">
                <span class="text-base">🏥</span>
                <div>
                  <div class="font-bold text-[11px]">ĐD Trần Thị Mỹ Ngân</div>
                  <div class="text-[10px] text-blue-600">Khoa Lâm Sàng / CTCH (66 TC)</div>
                </div>
              </button>

              <button onclick="quickLoginAs('usr_quyen_ntk')" class="p-2.5 bg-amber-50 hover:bg-amber-100 text-amber-900 rounded-xl border border-amber-200 text-left font-semibold transition-all flex items-center gap-2">
                <span class="text-base">🩺</span>
                <div>
                  <div class="font-bold text-[11px]">ĐDT Nguyễn Thị Kim Quyên</div>
                  <div class="text-[10px] text-amber-700">Duyệt Cấp 1 (ĐD Trưởng Khoa)</div>
                </div>
              </button>

              <button onclick="quickLoginAs('usr_dan_ptt')" class="p-2.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-900 rounded-xl border border-indigo-200 text-left font-semibold transition-all flex items-center gap-2">
                <span class="text-base">📋</span>
                <div>
                  <div class="font-bold text-[11px]">ThS. Phan Thị Tâm Đan</div>
                  <div class="text-[10px] text-indigo-700">Duyệt Cấp 2 (Trưởng Ban ĐD)</div>
                </div>
              </button>
            </div>
          </div>
        </form>`;

html = html.replace(oldQuickLoginRegex, newQuickLogin);

// 2. Update quick-role-select
const oldRoleSelectRegex = /<select id="quick-role-select"[\s\S]*?<\/select>/;

const newRoleSelect = `<select id="quick-role-select" onchange="switchUserRole(this.value)" class="bg-blue-900/90 text-white text-xs font-semibold rounded-lg px-2 py-1 border border-blue-500/50 focus:outline-none cursor-pointer max-w-[280px]">
                <option value="usr_quyen_ntk">Nguyễn Thị Kim Quyên (ĐDT - Lâm Sàng 66 TC)</option>
                <option value="usr_ngan_ttm">Trần Thị Mỹ Ngân (ĐD Lâm Sàng - 66 TC)</option>
                <option value="usr_gayme_01">Trần Hoàng Nam (KTV Gây Mê Hồi Sức - 66 TC)</option>
                <option value="usr_noisoi_01">Hoàng Thị Mai Phương (ĐD Nội Soi - 66 TC)</option>
                <option value="usr_khambenh_01">Lê Thị Thu Thảo (ĐD Khoa Khám Bệnh - 71 TC)</option>
                <option value="usr_cdha_01">Ngô Văn Hùng (KTV Chẩn Đoán Hình Ảnh - 73 TC)</option>
                <option value="usr_vltl_01">Đặng Thanh Thảo (KTV PHCN - VLTL - 65 TC)</option>
                <option value="usr_xetnghiem_01">Phạm Minh Trí (KTV Xét Nghiệm - 63 TC)</option>
                <option value="usr_shpt_01">Trần Thị Thu Hà (KTV Sinh Học Phân Tử - 63 TC)</option>
                <option value="usr_ksnk_01">Lê Minh Tuấn (ĐD Kiểm Soát Nhiễm Khuẩn - 66 TC)</option>
                <option value="usr_vinh_pq">BS.CKII Phạm Quang Vinh (Trưởng ĐV CTCH)</option>
                <option value="usr_dan_ptt">ThS. Phan Thị Tâm Đan (Ban ĐD - Duyệt Cấp 2)</option>
                <option value="usr_tuan_hm">PGS.TS.BS Hà Mạnh Tuấn (Trưởng CS2 - Cấp 3)</option>
                <option value="usr_admin">Quản Trị Hệ Thống (IT Admin Toàn Quyền)</option>
              </select>`;

html = html.replace(oldRoleSelectRegex, newRoleSelect);

// 3. Update dash-filter-specialty
const oldFilterRegex = /<select id="dash-filter-specialty"[\s\S]*?<\/select>/;

const newFilterSelect = `<select id="dash-filter-specialty" onchange="onDashboardFilterChanged()" class="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-blue-500 focus:outline-none cursor-pointer">
                <option value="all">Tất Cả Khối Chuyên Môn</option>
                <option value="lamsang" selected>Điều Dưỡng Lâm Sàng (66 TC)</option>
                <option value="gayme">KTV Gây Mê Hồi Sức (66 TC)</option>
                <option value="noisoi">Điều Dưỡng Nội Soi (66 TC)</option>
                <option value="khambenh">Điều Dưỡng Khám Bệnh (71 TC)</option>
                <option value="cdha">Kỹ Thuật Y CĐHA (73 TC)</option>
                <option value="vltl_phcn">Kỹ Thuật Y PHCN - VLTL (65 TC)</option>
                <option value="xetnghiem">Kỹ Thuật Y Xét Nghiệm & SHPT (63 TC)</option>
              </select>`;

html = html.replace(oldFilterRegex, newFilterSelect);

// 4. Update prof-input-specialty
const oldProfSpecRegex = /<select id="prof-input-specialty"[\s\S]*?<\/select>/;

const newProfSpecSelect = `<select id="prof-input-specialty" class="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-semibold text-blue-900 focus:ring-2 focus:ring-blue-500 focus:outline-none">
              <option value="lamsang">🏥 Khối Điều Dưỡng Lâm Sàng (66 TC)</option>
              <option value="gayme">💉 Khối KTV Gây Mê Hồi Sức (66 TC)</option>
              <option value="noisoi">🩺 Khối Điều Dưỡng Nội Soi (66 TC)</option>
              <option value="khambenh">📋 Khối Điều Dưỡng Khám Bệnh (71 TC)</option>
              <option value="cdha">🩻 Khối Kỹ Thuật Y CĐHA (73 TC)</option>
              <option value="vltl_phcn">🏃 Khối Kỹ Thuật Y PHCN - VLTL (65 TC)</option>
              <option value="xetnghiem">🔬 Khối Kỹ Thuật Y Xét Nghiệm & SHPT (63 TC)</option>
            </select>`;

html = html.replace(oldProfSpecRegex, newProfSpecSelect);

fs.writeFileSync(indexPath, html, 'utf8');
console.log('🎉 Successfully updated index.html with all 7 specialties!');
