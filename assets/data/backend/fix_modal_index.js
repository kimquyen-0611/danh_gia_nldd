const fs = require('fs');
const path = require('path');

const indexPath = path.join(__dirname, '..', 'index.html');
let html = fs.readFileSync(indexPath, 'utf8');

const regex = /<div id="modal-create-assessment"[\s\S]*?<!-- Step 3: Thông tin cá nhân & Ảnh chân dung -->/;

const replacement = `<div id="modal-create-assessment" class="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 hidden">
    <div class="bg-white rounded-3xl shadow-2xl max-w-xl w-full p-6 border border-slate-200 animate-fade-in max-h-[90vh] flex flex-col">
      <div class="flex items-center justify-between pb-3 border-b border-slate-100">
        <div>
          <h3 class="font-black text-slate-900 text-base flex items-center gap-2">
            <span>✨ KHỞI TẠO ĐỢT ĐÁNH GIÁ NĂNG LỰC MỚI</span>
          </h3>
          <p class="text-xs text-slate-500">Chọn khoa phòng, cập nhật thông tin và bắt đầu tự chấm điểm</p>
        </div>
        <button onclick="closeCreateAssessmentModal()" class="text-slate-400 hover:text-slate-600 text-xl font-bold">&times;</button>
      </div>

      <form id="form-create-assessment" onsubmit="handleCreateNewAssessment(event)" class="overflow-y-auto flex-1 my-4 space-y-4 pr-1">
        
        <!-- Step 1: Chọn Khối chuyên môn -->
        <div>
          <label class="block text-xs font-black text-slate-800 uppercase tracking-wider mb-1.5">
            1. Chọn Khối Chuyên Môn Đánh Giá *
          </label>
          <div class="grid grid-cols-2 sm:grid-cols-3 gap-2">
            <label class="p-2.5 rounded-xl border border-blue-300 bg-blue-50/50 hover:bg-blue-100/50 cursor-pointer transition-all flex items-start gap-2">
              <input type="radio" name="create_specialty" value="lamsang" checked onchange="onCreationSpecialtyChanged('lamsang')" class="mt-0.5 text-blue-600">
              <div>
                <div class="font-bold text-xs text-blue-950">🏥 Lâm Sàng (66 TC)</div>
                <div class="text-[10px] text-slate-500">Ngoại, Sản, TMH, CTCH, KSNK...</div>
              </div>
            </label>

            <label class="p-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 cursor-pointer transition-all flex items-start gap-2">
              <input type="radio" name="create_specialty" value="gayme" onchange="onCreationSpecialtyChanged('gayme')" class="mt-0.5 text-blue-600">
              <div>
                <div class="font-bold text-xs text-purple-950">💉 Gây Mê (66 TC)</div>
                <div class="text-[10px] text-slate-500">Phẫu thuật GMHS, phòng mổ...</div>
              </div>
            </label>

            <label class="p-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 cursor-pointer transition-all flex items-start gap-2">
              <input type="radio" name="create_specialty" value="noisoi" onchange="onCreationSpecialtyChanged('noisoi')" class="mt-0.5 text-blue-600">
              <div>
                <div class="font-bold text-xs text-teal-950">🩺 Nội Soi (66 TC)</div>
                <div class="text-[10px] text-slate-500">Nội soi tiêu hóa, hô hấp...</div>
              </div>
            </label>

            <label class="p-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 cursor-pointer transition-all flex items-start gap-2">
              <input type="radio" name="create_specialty" value="khambenh" onchange="onCreationSpecialtyChanged('khambenh')" class="mt-0.5 text-blue-600">
              <div>
                <div class="font-bold text-xs text-emerald-950">📋 Khám Bệnh (71 TC)</div>
                <div class="text-[10px] text-slate-500">Khám bệnh, PK chuyên khoa...</div>
              </div>
            </label>

            <label class="p-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 cursor-pointer transition-all flex items-start gap-2">
              <input type="radio" name="create_specialty" value="cdha" onchange="onCreationSpecialtyChanged('cdha')" class="mt-0.5 text-blue-600">
              <div>
                <div class="font-bold text-xs text-cyan-950">🩻 CĐHA (73 TC)</div>
                <div class="text-[10px] text-slate-500">X-quang, CT Scanner, MRI...</div>
              </div>
            </label>

            <label class="p-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 cursor-pointer transition-all flex items-start gap-2">
              <input type="radio" name="create_specialty" value="vltl_phcn" onchange="onCreationSpecialtyChanged('vltl_phcn')" class="mt-0.5 text-blue-600">
              <div>
                <div class="font-bold text-xs text-orange-950">🏃 PHCN - VLTL (65 TC)</div>
                <div class="text-[10px] text-slate-500">Vật lý trị liệu, phục hồi CN...</div>
              </div>
            </label>

            <label class="p-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 cursor-pointer transition-all flex items-start gap-2 sm:col-span-3">
              <input type="radio" name="create_specialty" value="xetnghiem" onchange="onCreationSpecialtyChanged('xetnghiem')" class="mt-0.5 text-blue-600">
              <div>
                <div class="font-bold text-xs text-amber-950">🔬 Xét Nghiệm & SHPT (63 TC)</div>
                <div class="text-[10px] text-slate-500">Sinh hóa, Huyết học, Vi sinh, Trung tâm Sinh học Phân tử...</div>
              </div>
            </label>
          </div>
        </div>

        <!-- Step 2: Chọn Khoa / Đơn vị công tác -->
        <div>
          <label class="block text-xs font-black text-slate-800 uppercase tracking-wider mb-1.5">
            2. Chọn Khoa / Phòng / Đơn Vị Công Tác *
          </label>
          <select id="create-input-dept" required onchange="onCreationDeptSelectChanged(this.value)" class="w-full px-3 py-2.5 bg-blue-50/50 border border-blue-300 rounded-xl text-xs font-bold text-blue-950 focus:ring-2 focus:ring-blue-500 focus:bg-white focus:outline-none"></select>
          <input type="text" id="create-input-dept-custom" placeholder="Nhập tên khoa/phòng khác..." class="w-full mt-2 px-3 py-2 border border-slate-300 rounded-lg text-xs hidden focus:ring-2 focus:ring-blue-500 focus:outline-none">
        </div>

        <!-- Step 3: Thông tin cá nhân & Ảnh chân dung -->`;

if (!regex.test(html)) {
  console.error('Regex did not match');
} else {
  html = html.replace(regex, replacement);
  fs.writeFileSync(indexPath, html, 'utf8');
  console.log('✅ Successfully matched and updated modal in index.html!');
}
