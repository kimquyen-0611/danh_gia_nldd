const fs = require('fs');
const XLSX = require('xlsx');

// 1. DATA CHO SHEET 1: TỔNG HỢP 5 CA ĐÁNH GIÁ NLDD
const summaryData = [
  {
    'STT': 1,
    'Mã Hồ Sơ': 'HS-2026-001',
    'Họ và Tên': 'Vũ Thị Thu Ngân',
    'MSNV': 'D18-012-2',
    'Số CCHN': '002145/HCM-CCHN',
    'Khoa / Phòng': 'Khoa Hồi Sức Tích Cực (ICU)',
    'Khối Chuyên Môn': 'Điều Dưỡng Lâm Sàng',
    'Trình Độ': 'Cử nhân Điều dưỡng',
    'Thâm Niên (Năm)': 4,
    'Điểm LV1 (Chăm sóc)': 270,
    'Điểm LV2 (An toàn)': 185,
    'Điểm LV3 (NCKH & ĐT)': 140,
    'Điểm LV4 (Giao tiếp)': 145,
    'Điểm LV5 (Đạo đức)': 150,
    'Tổng Điểm Tự Chấm': 890,
    'Điểm Duyệt C1 (Trưởng Khoa)': 885,
    'Điểm Duyệt C2 (Phòng ĐD)': 885,
    'Điểm Duyệt C3 (HĐ Giám Đốc)': 885,
    'Xếp Bậc NLDD': 'Bậc 2 (Thành thạo)',
    'Mục Tiêu IDP 2027': 'Nâng Bậc 3 - ĐD Chuyên sâu ICU',
    'Giờ CME Tích Lũy': 48,
    'Trạng Thái Hồ Sơ': 'Đã Phê Chuẩn Cấp 3 (Hoàn tất)',
    'Người Phê Duyệt Cuối': 'PGS.TS.BS Hà Mạnh Tuấn (Giám Đốc)',
    'Ngày Hoàn Tất': '15/10/2026'
  },
  {
    'STT': 2,
    'Mã Hồ Sơ': 'HS-2026-002',
    'Họ và Tên': 'Trần Thị Mỹ Ngân',
    'MSNV': 'D08-005-2',
    'Số CCHN': '001988/HCM-CCHN',
    'Khoa / Phòng': 'Khoa Phẫu Thuật - Gây Mê Hồi Sức',
    'Khối Chuyên Môn': 'KTV Gây Mê Hồi Sức',
    'Trình Độ': 'Thạc sĩ Điều dưỡng',
    'Thâm Niên (Năm)': 10,
    'Điểm LV1 (Chăm sóc)': 295,
    'Điểm LV2 (An toàn)': 195,
    'Điểm LV3 (NCKH & ĐT)': 180,
    'Điểm LV4 (Giao tiếp)': 150,
    'Điểm LV5 (Đạo đức)': 150,
    'Tổng Điểm Tự Chấm': 970,
    'Điểm Duyệt C1 (Trưởng Khoa)': 970,
    'Điểm Duyệt C2 (Phòng ĐD)': 965,
    'Điểm Duyệt C3 (HĐ Giám Đốc)': 965,
    'Xếp Bậc NLDD': 'Bậc 4 (Chuyên gia / Cố vấn)',
    'Mục Tiêu IDP 2027': 'Giảng viên lâm sàng & Trưởng nhóm NCKH',
    'Giờ CME Tích Lũy': 72,
    'Trạng Thái Hồ Sơ': 'Đã Phê Chuẩn Cấp 3 (Vinh danh)',
    'Người Phê Duyệt Cuối': 'PGS.TS.BS Hà Mạnh Tuấn (Giám Đốc)',
    'Ngày Hoàn Tất': '16/10/2026'
  },
  {
    'STT': 3,
    'Mã Hồ Sơ': 'HS-2026-003',
    'Họ và Tên': 'Hồ Thị Trâm Anh',
    'MSNV': 'D14-022-2',
    'Số CCHN': '003412/HCM-CCHN',
    'Khoa / Phòng': 'Khoa Nội Soi & Thăm Dò Chức Năng',
    'Khối Chuyên Môn': 'Điều Dưỡng Nội Soi',
    'Trình Độ': 'Cử nhân Điều dưỡng',
    'Thâm Niên (Năm)': 6,
    'Điểm LV1 (Chăm sóc)': 280,
    'Điểm LV2 (An toàn)': 190,
    'Điểm LV3 (NCKH & ĐT)': 150,
    'Điểm LV4 (Giao tiếp)': 145,
    'Điểm LV5 (Đạo đức)': 150,
    'Tổng Điểm Tự Chấm': 915,
    'Điểm Duyệt C1 (Trưởng Khoa)': 910,
    'Điểm Duyệt C2 (Phòng ĐD)': 910,
    'Điểm Duyệt C3 (HĐ Giám Đốc)': '',
    'Xếp Bậc NLDD': 'Bậc 3 (Nâng cao)',
    'Mục Tiêu IDP 2027': 'Nâng Bậc 4 - Kỹ thuật Can thiệp ERCP',
    'Giờ CME Tích Lũy': 56,
    'Trạng Thái Hồ Sơ': 'Chờ Hội Đồng Giám Đốc Phê Chuẩn (C3)',
    'Người Phê Duyệt Cuối': 'ThS. Phan Thị Tâm Đan (Trưởng Phòng ĐD)',
    'Ngày Hoàn Tất': 'Đang xử lý'
  },
  {
    'STT': 4,
    'Mã Hồ Sơ': 'HS-2026-004',
    'Họ và Tên': 'Lê Hoàng Khang',
    'MSNV': 'D20-008-2',
    'Số CCHN': '004590/HCM-CCHN',
    'Khoa / Phòng': 'Khoa Khám Bệnh',
    'Khối Chuyên Môn': 'Điều Dưỡng Khoa Khám Bệnh',
    'Trình Độ': 'Cử nhân Điều dưỡng',
    'Thâm Niên (Năm)': 2,
    'Điểm LV1 (Chăm sóc)': 240,
    'Điểm LV2 (An toàn)': 170,
    'Điểm LV3 (NCKH & ĐT)': 110,
    'Điểm LV4 (Giao tiếp)': 140,
    'Điểm LV5 (Đạo đức)': 150,
    'Tổng Điểm Tự Chấm': 810,
    'Điểm Duyệt C1 (Trưởng Khoa)': 805,
    'Điểm Duyệt C2 (Phòng ĐD)': '',
    'Điểm Duyệt C3 (HĐ Giám Đốc)': '',
    'Xếp Bậc NLDD': 'Bậc 1 (Khởi đầu / Cơ bản)',
    'Mục Tiêu IDP 2027': 'Nâng Bậc 2 - Giao tiếp & Xử lý tình huống',
    'Giờ CME Tích Lũy': 32,
    'Trạng Thái Hồ Sơ': 'Chờ Phòng Điều Dưỡng Thẩm Định (C2)',
    'Người Phê Duyệt Cuối': 'Nguyễn Thị Kim Quyên (ĐD Trưởng Khoa)',
    'Ngày Hoàn Tất': 'Đang xử lý'
  },
  {
    'STT': 5,
    'Mã Hồ Sơ': 'HS-2026-005',
    'Họ và Tên': 'Đặng Minh Châu',
    'MSNV': 'D22-015-2',
    'Số CCHN': '005118/HCM-CCHN',
    'Khoa / Phòng': 'Khoa Nhi & Hồi Sức Sơ Sinh',
    'Khối Chuyên Môn': 'Điều Dưỡng Nhi & Sơ Sinh',
    'Trình Độ': 'Cao đẳng Điều dưỡng',
    'Thâm Niên (Năm)': 1,
    'Điểm LV1 (Chăm sóc)': 230,
    'Điểm LV2 (An toàn)': 165,
    'Điểm LV3 (NCKH & ĐT)': 95,
    'Điểm LV4 (Giao tiếp)': 135,
    'Điểm LV5 (Đạo đức)': 150,
    'Tổng Điểm Tự Chấm': 775,
    'Điểm Duyệt C1 (Trưởng Khoa)': '',
    'Điểm Duyệt C2 (Phòng ĐD)': '',
    'Điểm Duyệt C3 (HĐ Giám Đốc)': '',
    'Xếp Bậc NLDD': 'Bậc 1 (Tập sự / Mới vào viện)',
    'Mục Tiêu IDP 2027': 'Hoàn thành khóa Hồi sức cấp cứu Nhi & Đạt B2',
    'Giờ CME Tích Lũy': 24,
    'Trạng Thái Hồ Sơ': 'Mới nộp - Chờ ĐD Trưởng Khoa Duyệt (C1)',
    'Người Phê Duyệt Cuối': 'Chưa duyệt',
    'Ngày Hoàn Tất': 'Đang xử lý'
  }
];

// 2. DATA CHO SHEET 2: CHI TIẾT TIÊU CHÍ VÀ MINH CHỨNG NỔI BẬT
const criteriaDetailData = [
  {
    'Mã HS': 'HS-2026-001',
    'Họ Tên': 'Vũ Thị Thu Ngân',
    'Khoa Phòng': 'Khoa Hồi Sức Tích Cực (ICU)',
    'Tiêu Chí Nổi Bật': 'Hồi sức hô hấp máy thở nâng cao (ICU-C08)',
    'Mức Điểm Đạt': 'Mức 4 (40đ - Thực hiện thành thạo)',
    'Minh Chứng Đính Kèm': 'Báo cáo ca lâm sàng cai máy thở thành công, chứng chỉ CME 24h',
    'Nhận Xét Của Cấp Duyệt': 'Kỹ năng vững vàng, xử lý báo động máy thở rất nhạy bén.'
  },
  {
    'Mã HS': 'HS-2026-002',
    'Họ Tên': 'Trần Thị Mỹ Ngân',
    'Khoa Phòng': 'Khoa GMHS',
    'Tiêu Chí Nổi Bật': 'Kiểm soát đường thở khó & Gây mê nội khí quản (GM-C12)',
    'Mức Điểm Đạt': 'Mức 5 (50đ - Cố vấn chuyên môn)',
    'Minh Chứng Đính Kèm': 'Đề tài NCKH cấp cơ sở 2025, Giấy khen Giám đốc BV UMC',
    'Nhận Xét Của Cấp Duyệt': 'Nhân lực đầu ngành gây mê, thường xuyên đào tạo kèm cặp ĐD trẻ.'
  },
  {
    'Mã HS': 'HS-2026-003',
    'Họ Tên': 'Hồ Thị Trâm Anh',
    'Khoa Phòng': 'Khoa Nội Soi',
    'Tiêu Chí Nổi Bật': 'Phụ thủ thuật can thiệp cầm máu tiêu hóa qua nội soi (NS-C05)',
    'Mức Điểm Đạt': 'Mức 4 (40đ - Thực hiện độc lập)',
    'Minh Chứng Đính Kèm': 'Nhật ký 120 ca nội soi can thiệp, chứng nhận an toàn bức xạ',
    'Nhận Xét Của Cấp Duyệt': 'Thao tác dụng cụ nội soi vô khuẩn và phối hợp bác sĩ xuất sắc.'
  },
  {
    'Mã HS': 'HS-2026-004',
    'Họ Tên': 'Lê Hoàng Khang',
    'Khoa Phòng': 'Khoa Khám Bệnh',
    'Tiêu Chí Nổi Bật': 'Phân loại bệnh nhân cấp cứu tại phòng khám (KB-C03)',
    'Mức Điểm Đạt': 'Mức 3 (30đ - Thực hiện đúng quy trình)',
    'Minh Chứng Đính Kèm': 'Bảng tự chấm và xác nhận của ca trưởng',
    'Nhận Xét Của Cấp Duyệt': 'Nhiệt tình, thái độ phục vụ người bệnh hòa nhã, cần trau dồi NCKH.'
  },
  {
    'Mã HS': 'HS-2026-005',
    'Họ Tên': 'Đặng Minh Châu',
    'Khoa Phòng': 'Khoa Nhi & Sơ Sinh',
    'Tiêu Chí Nổi Bật': 'Chăm sóc trẻ sinh non và nuôi dưỡng qua sonde dạ dày (NHI-C04)',
    'Mức Điểm Đạt': 'Mức 3 (30đ - Đạt chuẩn cơ bản)',
    'Minh Chứng Đính Kèm': 'Chứng chỉ định hướng chuyên khoa Nhi',
    'Nhận Xét Của Cấp Duyệt': 'Hồ sơ mới gửi, đang xếp lịch quan sát thực hành trực tiếp.'
  }
];

// 3. TẠO WORKBOOK VÀ THÊM CÁC SHEET
const wb = XLSX.utils.book_new();

const wsSummary = XLSX.utils.json_to_sheet(summaryData);
const wsDetail = XLSX.utils.json_to_sheet(criteriaDetailData);

function setColWidths(ws, data) {
  if (!data || data.length === 0) return;
  const colWidths = Object.keys(data[0]).map(key => {
    const maxLen = Math.max(
      key.length,
      ...data.map(row => (row[key] ? String(row[key]).length : 0))
    );
    return { wch: Math.min(Math.max(maxLen + 4, 12), 45) };
  });
  ws['!cols'] = colWidths;
}

setColWidths(wsSummary, summaryData);
setColWidths(wsDetail, criteriaDetailData);

XLSX.utils.book_append_sheet(wb, wsSummary, 'Tong_Hop_5_Ca_Danh_Gia');
XLSX.utils.book_append_sheet(wb, wsDetail, 'Chi_Tiet_Tieu_Chi');

// Xuất file XLSX
const xlsxPath = 'DU_LIEU_GIA_LAP_DEMO_5_CA_UMC.xlsx';
XLSX.writeFile(wb, xlsxPath);
console.log('✅ Đã tạo file Excel thành công:', xlsxPath);

// Xuất file CSV có BOM UTF-8
const csvContent = '\uFEFF' + XLSX.utils.sheet_to_csv(wsSummary);
const csvPath = 'DU_LIEU_GIA_LAP_DEMO_5_CA_UMC.csv';
fs.writeFileSync(csvPath, csvContent, 'utf8');
console.log('✅ Đã tạo file CSV UTF-8 thành công:', csvPath);
