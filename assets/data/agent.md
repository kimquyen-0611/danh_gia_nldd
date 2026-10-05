# AGENT.MD - TỔNG HỢP TOÀN BỘ CHỨC NĂNG HỆ THỐNG ĐÁNH GIÁ & PHÁT TRIỂN NĂNG LỰC ĐIỀU DƯỠNG UMC
**Bệnh Viện Đại Học Y Dược TP. Hồ Chí Minh - Ban Điều Dưỡng**  
*Phiên bản: 3.2 Production (Vercel Serverless + Supabase Cloud PostgreSQL Engine)*

---

## I. TỔNG QUAN KIẾN TRÚC HỆ THỐNG
Hệ thống được thiết kế theo mô hình **Monorepo Serverless** hiện đại, kết hợp lưu trữ đám mây hai chiều bảo mật cao:
1. **Front-end Layer**: HTML5, Tailwind CSS, Be Vietnam Pro font, Chart.js, Canvas Confetti.
2. **Backend Serverless API (`/api/*`)**: Node.js, Express, PBKDF2 Password Hashing, JWT HMAC-SHA256 Token Auth, SMTP Mail Dispatcher.
3. **Database Cloud Layer**: Supabase PostgreSQL Cloud (`ogqblclswauwvqnifbtw.supabase.co`) với các bảng: `umc_users`, `umc_submissions`, `yeu_cau`.
4. **Hybrid Offline/Online Sync Engine**: Tự động fallback sang `localStorage` khi mất mạng và tự động đồng bộ lên Supabase khi online.

```
+-----------------------------------------------------------------------------------+
|                        FRONTEND CLIENT (Edge CDN - Vercel)                        |
|   index.html | js/app.js | js/api_client.js | supabase_client.js | css/styles.css |
+----------------------------------------+------------------------------------------+
                                         |
                       +-----------------+-----------------+
                       | (Online Hybrid)                   | (Offline Fallback)
                       v                                   v
+----------------------------------------+  +---------------------------------------+
|    BACKEND SERVERLESS (Express API)    |  |     TRÌNH DUYỆT (localStorage)        |
|  api/index.js -> assets/backend/server |  |  umc_users | umc_submissions | idp    |
+-------------------+--------------------+  +---------------------------------------+
                    |
                    v
+-----------------------------------------------------------------------------------+
|                    SUPABASE CLOUD DATABASE (PostgreSQL Engine)                     |
|           umc_users (Nhân sự) | umc_submissions (Hồ sơ) | yeu_cau                 |
+-----------------------------------------------------------------------------------+
```

---

## II. DANH SÁCH 9 PHÂN HỆ CHỨC NĂNG CHÍNH

### 1. Phân Hệ Xác Thực & Phân Quyền Đa Cấp (Authentication & RBAC)
* **Đăng nhập an toàn**: Hỗ trợ đăng nhập linh hoạt bằng Tên đăng nhập, MSNV hoặc Email công vụ UMC (`@umc.edu.vn`).
* **Bảo mật mật khẩu**: Mã hóa mật khẩu một chiều **PBKDF2 với Salt ngẫu nhiên 64-byte (sha512)**.
* **Cấp Token phiên làm việc**: Token chuẩn HMAC-SHA256 (hạn dùng 8 tiếng) bảo vệ các yêu cầu API.
* **Quên mật khẩu & Cấp mã OTP**: Hệ thống sinh mã OTP 6 chữ số ngẫu nhiên có hiệu lực 15 phút, gửi bí mật về hộp thư email UMC.
* **Ma trận phân quyền 4 Cấp (RBAC)**:
  * `nurse`: Điều dưỡng/KTV nhân viên (Tự chấm điểm, nộp hồ sơ, quản lý Portfolio cá nhân).
  * `head_nurse` / `deputy_head_nurse`: Điều dưỡng Trưởng khoa (Thẩm định & phê duyệt Cấp 1 hồ sơ trong khoa).
  * `nurse_board` / `chief_nurse`: Ban Điều Dưỡng / Trưởng Ban (Thẩm định & phê duyệt Cấp 2 toàn bệnh viện).
  * `director`: Ban Lãnh Đạo / Ban Giám Đốc (Phê duyệt chính thức Cấp 3 và ký cấp Chứng Nhận Năng Lực).
  * `admin`: Quản trị viên hệ thống (Toàn quyền quản lý nhân sự, đồng bộ dữ liệu và cấu hình).

---

### 2. Phân Hệ Phiếu Tự Đánh Giá Năng Lực (Assessment Engine)
* **Tự động nhận diện 7 Bộ Tiêu Chuẩn theo Khoa**:
  1. **Điều Dưỡng Lâm Sàng**: 5 lĩnh vực, 66 tiêu chí chuẩn.
  2. **KTV Gây Mê Hồi Sức**: 5 lĩnh vực, 66 tiêu chí chuẩn.
  3. **Điều Dưỡng Nội Soi**: 5 lĩnh vực, 66 tiêu chí chuẩn.
  4. **Điều Dưỡng Khoa Khám Bệnh**: 5 lĩnh vực, 71 tiêu chí chuẩn.
  5. **Kỹ Thuật Y Chẩn Đoán Hình Ảnh**: 5 lĩnh vực, 73 tiêu chí chuẩn.
  6. **Kỹ Thuật Y Phục Hồi Chức Năng - VLTL**: 5 lĩnh vực, 65 tiêu chí chuẩn.
  7. **Kỹ Thuật Y Xét Nghiệm & Sinh Học Phân Tử**: 5 lĩnh vực, 63 tiêu chí chuẩn.
* **Chấm điểm trực quan 2 chế độ**:
  * Chế độ **Bảng Lâm Sàng UMC** (`clinical-table`): Hiển thị đầy đủ các mức độ theo hàng ngang chuẩn văn bản bệnh viện.
  * Chế độ **Thẻ Từng Tiêu Chí** (`cards/compact`): Lọc theo từng Lĩnh Vực (Domain 1 $\rightarrow$ Domain 5), tìm kiếm nhanh theo từ khóa kỹ thuật (CPR, 5 đúng, ISBAR...).
* **Đính kèm minh chứng cho từng tiêu chí**: Tải lên tệp tài liệu, hình ảnh chứng chỉ, quy trình để minh chứng điểm chấm.
* **Thanh tổng kết điểm trực tiếp (Sticky Summary Bar)**: Tự động tính tổng điểm / 1.000đ, xác định Bậc năng lực đạt được và so sánh với điểm sàn từng lĩnh vực.

---

### 3. Phân Hệ Hồ Sơ Năng Lực Cá Nhân (Portfolio & IDP)
* **Khung thông tin hồ sơ nhân sự**: Hiển thị Avatar, MSNV, Chứng chỉ hành nghề (CCHN), Thâm niên, Khoa công tác, Trình độ, Chức danh, Người phụ trách phê duyệt Cấp 1.
* **Tự nhận thức năng lực**: Đánh giá **Điểm mạnh nổi bật (Strengths)** và **Điểm cần cải thiện (Weaknesses)** (Tiêu chí 56).
* **Kế hoạch phát triển cá nhân (IDP)**: Thiết lập **Mục tiêu ngắn hạn (1 năm)** và **Mục tiêu dài hạn (3-5 năm)**.
* **Quản lý quá trình học tập & phát triển**:
  * Nhật ký tham gia **Hội nghị / Hội thảo khoa học** theo từng năm.
  * Nhật ký hoạt động **Cộng đồng, Xã hội, Thiện nguyện & Hiến máu**.
  * Kho lưu trữ tài liệu minh chứng, văn bằng chính quy, chứng chỉ CME.

---

### 4. Phân Hệ Thẩm Định & Phê Duyệt Hồ Sơ 3 Cấp (Workflow & Approvals)
Vận hành theo quy trình thẩm định 6 trạng thái (`WORKFLOW_STAGES`):
1. `draft`: Bản nháp nhân viên đang chấm.
2. `submitted_l1`: Đã nộp $\rightarrow$ Chờ ĐD Trưởng khoa duyệt (Cấp 1).
3. `submitted_l2`: Đã qua Cấp 1 $\rightarrow$ Chờ Trưởng Ban Điều Dưỡng duyệt (Cấp 2).
4. `submitted_l3`: Đã qua Cấp 2 $\rightarrow$ Chờ Ban Lãnh Đạo / Ban Giám Đốc duyệt (Cấp 3).
5. `approved`: Đã phê duyệt chính thức $\rightarrow$ Cấp Chứng Nhận Năng Lực.
6. `returned`: Yêu cầu bổ sung / Trả về (kèm nhận xét, lý do chi tiết từ người duyệt).

* **Tính năng phê duyệt**:
  * Xem xét chi tiết từng câu chấm, minh chứng đính kèm.
  * Ghi chú nhận xét phản hồi (Feedback comment).
  * Điều chỉnh điểm số thẩm định nếu cần.
  * Phê duyệt hàng loạt (Batch approval) dành cho Ban Lãnh Đạo.

---

### 5. Phân Hệ Báo Cáo, Thống Kê & Bảng Vinh Danh (Reports & Analytics)
* **Biểu đồ Radar Năng lực 5 Lĩnh vực**: Trực quan hóa độ bao phủ năng lực cá nhân so với chuẩn bệnh viện.
* **Biểu đồ Phân bổ Cấp bậc Năng lực**: Thống kê tỷ lệ nhân viên theo 7 bậc năng lực toàn viện/theo khoa.
* **Bảng xếp hạng năng lực (Ranking Leaderboard)**: Vinh danh Top nhân sự xuất sắc với huy hiệu Vàng, Bạc, Đồng.
* **Bộ lọc báo cáo đa chiều**: Lọc theo Năm đánh giá (2024 $\rightarrow$ 2027), Khoa phòng, Khối chuyên môn, Bậc năng lực, Trạng thái phê duyệt.

---

### 6. Phân Hệ Tra Cứu Chuẩn 7 Bậc Năng Lực & 7 Khối Chuyên Khoa
* **Khung ma trận 7 Bậc Năng Lực (`COMPETENCY_TIERS_MATRIX`)**:
  * **Bậc 1 - Tập sự (Novice)**: $\ge 200$đ.
  * **Bậc 2 - Có khả năng thực hành (Advanced Beginner)**: $\ge 300$đ.
  * **Bậc 3 - Đủ năng lực (Competent)**: $\ge 400$đ.
  * **Bậc 4 - Thành thạo (Proficient)**: $\ge 600$đ.
  * **Bậc 5 - Chuyên gia lâm sàng (Expert - Clinical)**: $\ge 800$đ.
  * **Bậc 6 - Chuyên gia quản lý (Expert - Leadership)**: $\ge 900$đ.
  * **Bậc 7 - Chuyên gia cao cấp (Master Expert)**: $\ge 950$đ.
* Xem chi tiết yêu cầu Bằng cấp, Thâm niên, CME, NCKH, Điểm thi tay nghề và Điểm sàn từng lĩnh vực ($d_1 \rightarrow d_5$).

---

### 7. Phân Hệ Quản Trị Nhân Sự & Cấu Hình Phân Quyền (Admin)
* **Danh bạ nhân viên bệnh viện**: Tìm kiếm, lọc theo khoa, vai trò, trạng thái làm việc.
* **Modal quản lý 14 trường thông tin nhân sự** chuẩn file Excel bệnh viện.
* **Cấu hình phân quyền & người duyệt Cấp 1**: Gán người quản lý trực tiếp và cấp bậc phê duyệt cho từng nhân viên.
* **Đồng bộ nhân sự trực tiếp với Supabase Cloud**: Cập nhật tức thời thông tin lên bảng `umc_users`.

---

### 8. Phân Hệ Đồng Bộ Đám Mây Kép (Hybrid Cloud Sync Engine)
* **Hỗ trợ chế độ kết nối đa luồng**:
  1. Kết nối qua Backend Express API (`/api/submissions`, `/api/users/sync`).
  2. Kết nối trực tiếp Supabase HTTPS REST API (`/rest/v1/umc_submissions`, `/rest/v1/umc_users`).
  3. Chế độ dự phòng Offline: Lưu trữ `localStorage` và tự động đẩy lên Cloud khi online.
* **Huy hiệu trạng thái Cloud**: Hiển thị trạng thái kết nối trực tiếp trên thanh công cụ (Xanh: Supabase/Backend Online, Vàng: Offline).

---

### 9. Phân Hệ Xuất Bản & In Ấn (Export & Printing Engine)
* **In Phiếu Đánh Giá Chuẩn A4**: Định dạng in ấn sạch đẹp, ẩn thanh công cụ điều hướng.
* **In & Cấp Chứng Nhận Năng Lực UMC**: Khung chứng nhận trang trọng với hoa văn, dấu đỏ mộc tròn UMC, chữ ký số và QR tra cứu.
* **Xuất Báo Cáo Năng Lực**: Hỗ trợ xuất báo cáo HTML tương thích 100% mở và chỉnh sửa trong Microsoft Word.

---

## III. MA TRẬN 14 TRƯỜNG THÔNG TIN NHÂN SỰ CHUẨN FILE EXCEL UMC

| STT | Tên Trường Thông Tin | Trường DB (snake_case) | Trường JS (camelCase) | Kiểu Dữ Liệu | Ví Dụ Dữ Liệu |
|:---:|:---|:---|:---|:---|:---|
| 1 | Khoa công tác | `department` | `department` | VARCHAR | Chấn thương chỉnh hình |
| 2 | Họ và tên | `full_name` | `fullName` | VARCHAR | Nguyễn Thị Kim Quyên |
| 3 | Giới tính | `gender` | `gender` | VARCHAR | Nữ |
| 4 | Ngày tháng năm sinh | `dob` | `dob` | VARCHAR | 15/08/1984 |
| 5 | Mã nhân viên (MSNV) | `msnv` | `msnv` | VARCHAR | D06-009-2 |
| 6 | Email công vụ UMC | `email` | `email` | VARCHAR | quyen.ntk@umc.edu.vn |
| 7 | Chức danh nghề nghiệp | `job_title` / `role_name` | `jobTitle` / `roleName` | VARCHAR | Điều dưỡng trưởng |
| 8 | Trình độ chuyên môn | `degree` | `degree` | VARCHAR | Cử nhân Điều dưỡng (ĐHYD) |
| 9 | Học hàm, học vị | `academic_title` | `academicTitle` | VARCHAR | Cử nhân |
| 10 | Tốt nghiệp năm | `graduation_year` | `graduationYear` | INT | 2006 |
| 11 | Thâm niên công tác | `experience_years` | `experienceYears` | INT | 18 (năm) |
| 12 | Điểm thi tay nghề | `last_skill_exam_score`| `lastSkillExamScore` | INT | 95 (điểm) |
| 13 | Nghiên cứu khoa học | `nckh` | `nckh` | TEXT | Chủ nhiệm 1 SKCT cải tiến... |
| 14 | Năm đánh giá | `evaluation_year` / `year` | `evaluationYear` / `year`| INT | 2026 |

---

## IV. BẢNG TỔNG HỢP TIÊU CHÍ 7 KHỐI CHUYÊN KHOA

| Khối Chuyên Môn | Mã Key | Lĩnh Vực I (Bằng Cấp) | Lĩnh Vực II (Chuyên Môn) | Lĩnh Vực III (NCKH/CME) | Lĩnh Vực IV (Quản Lý) | Lĩnh Vực V (Phát Triển) | Tổng Tiêu Chí |
|:---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| **Điều Dưỡng Lâm Sàng** | `lamsang` | 6 TC | 22 TC | 14 TC | 13 TC | 11 TC | **66 Tiêu chí** |
| **KTV Gây Mê Hồi Sức** | `gayme` | 6 TC | 22 TC | 14 TC | 13 TC | 11 TC | **66 Tiêu chí** |
| **Điều Dưỡng Nội Soi** | `noisoi` | 6 TC | 22 TC | 14 TC | 13 TC | 11 TC | **66 Tiêu chí** |
| **Điều Dưỡng Khám Bệnh** | `khambenh` | 6 TC | 27 TC | 14 TC | 13 TC | 11 TC | **71 Tiêu chí** |
| **Kỹ Thuật Y CĐHA** | `cdha` | 6 TC | 29 TC | 14 TC | 13 TC | 11 TC | **73 Tiêu chí** |
| **Kỹ Thuật Y PHCN - VLTL**| `vltl_phcn`| 6 TC | 25 TC | 10 TC | 13 TC | 11 TC | **65 Tiêu chí** |
| **Kỹ Thuật Y Xét Nghiệm** | `xetnghiem`| 6 TC | 19 TC | 14 TC | 13 TC | 11 TC | **63 Tiêu chí** |

---

## V. HƯỚNG DẪN TRIỂN KHAI & KIỂM THỬ
1. **Triển khai nhanh 1-Click lên Vercel**: Nhấp đúp tệp `Deploy_Nhanh_Vercel.bat` hoặc chạy `npm run deploy`.
2. **Kiểm tra trạng thái Supabase Cloud**: Chạy `node assets/backend/test_supabase_cloud_crud.js`.
3. **Kiểm tra trạng thái Production Vercel**: Chạy `node assets/backend/test_live_vercel.js`.
4. **Kiểm tra toàn diện hệ thống**: Chạy `node assets/backend/run_full_system_test.js`.
