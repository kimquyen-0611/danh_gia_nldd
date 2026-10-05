# HƯỚNG DẪN TRIỂN KHAI HỆ THỐNG ĐÁNH GIÁ NLDD UMC LÊN VERCEL

Tài liệu hướng dẫn triển khai ứng dụng lên nền tảng **Vercel** theo chuẩn kiến trúc **Monorepo Serverless** (Front-end Edge CDN + Backend Express Serverless Functions).

---

## 1. CÁC TỆP CẤU HÌNH ĐÃ ĐƯỢC CHUẨN HÓA SẴN SÀNG

1. **`vercel.json`**: Định tuyến toàn bộ yêu cầu `/api/*` về Serverless Function `api/index.js`.
2. **`api/index.js`**: Serverless Function Entrypoint bọc Express app, tương thích 100% môi trường AWS Lambda / Vercel Functions.
3. **`package.json`**: Quản lý đầy đủ các gói phụ thuộc Backend (`express`, `cors`, `dotenv`, `pg`, `nodemailer`, `docx`, `xlsx`).
4. **`api_client.js` & `supabase_client.js`**: Tự động nhận diện tên miền (`${window.location.origin}/api` khi chạy trên Vercel, fallback `http://localhost:5000/api` khi mở offline).
5. **`.gitignore` & `.env.example`**: Bảo vệ tệp bí mật, sẵn sàng mẫu cấu hình cho Vercel Dashboard.

---

## 2. CÁCH 1: TRIỂN KHAI QUA GITHUB & VERCEL DASHBOARD (KHUYÊN DÙNG)

Đây là phương thức tiêu chuẩn, tự động cập nhật (CI/CD) mỗi khi bạn đẩy code mới lên GitHub:

### Bước 1: Đẩy mã nguồn lên GitHub
1. Mở PowerShell hoặc Git Bash tại thư mục dự án:
   ```bash
   git init
   git add .
   git commit -m "Chuan hoa ma nguon san sang trien khai Vercel"
   ```
2. Tạo một Repository mới trên [GitHub.com](https://github.com) (chọn chế độ **Private** để bảo mật thông tin nội bộ).
3. Liên kết và đẩy code lên:
   ```bash
   git remote add origin https://github.com/<tai-khoan-cua-ban>/danh-gia-nldd-umc.git
   git branch -M main
   git push -u origin main
   ```

### Bước 2: Import dự án vào Vercel
1. Truy cập [vercel.com](https://vercel.com) và đăng nhập bằng tài khoản GitHub.
2. Bấm nút **"Add New..."** -> chọn **"Project"**.
3. Tìm repository `danh-gia-nldd-umc` và bấm **"Import"**.
4. Tại mục **Configure Project**:
   - **Framework Preset**: Chọn `Other` (hoặc để mặc định).
   - **Root Directory**: Để trống `./`.
5. Mở mục **Environment Variables** và thêm các biến quan trọng từ `.env.example`:
   - `SUPABASE_URL`: `https://ogqblclswauwvqnifbtw.supabase.co`
   - `SUPABASE_SECRET_KEY`: `YOUR_SUPABASE_SECRET_KEY_HERE`
   - `SUPABASE_PUBLISHABLE_KEY`: `YOUR_SUPABASE_PUBLISHABLE_KEY_HERE`
   - `JWT_SECRET`: `umc-nursing-competency-auth-secret-key-2026-production`
   - `ALLOWED_ORIGIN`: `*`
6. Bấm nút **"Deploy"**! Vercel sẽ tự động build và cấp phát tên miền miễn phí (ví dụ: `https://danh-gia-nldd-umc.vercel.app`).

---

## 3. CÁCH 2: TRIỂN KHAI TRỰC TIẾP BẰNG VERCEL CLI

Nếu bạn không muốn qua GitHub mà muốn đẩy trực tiếp từ máy tính lên Vercel:

1. Cài đặt Vercel CLI (nếu chưa có):
   ```powershell
   npm install -g vercel
   ```
2. Mở PowerShell tại thư mục dự án và chạy lệnh:
   ```powershell
   vercel
   ```
3. Đăng nhập Vercel qua trình duyệt khi được nhắc.
4. Trả lời các câu hỏi thiết lập:
   - *Set up and deploy?* -> Nhấn `y` (Yes).
   - *Which scope?* -> Chọn tài khoản cá nhân của bạn.
   - *Link to existing project?* -> Nhấn `n` (No).
   - *What's your project's name?* -> Nhập `danh-gia-nldd-umc` (hoặc tên tùy thích).
   - *In which directory is your code located?* -> Nhấn `Enter` (mặc định `./`).
   - *Want to modify settings?* -> Nhấn `n` (No).
5. Khi hoàn tất, chạy lệnh để triển khai phiên bản chính thức (Production):
   ```powershell
   vercel --prod
   ```
6. Vào trang quản lý Vercel Project Settings để thêm các biến môi trường như hướng dẫn ở Cách 1.

---

## 4. KIỂM TRA SAU KHI TRIỂN KHAI (VERIFICATION)

Sau khi deploy thành công, hãy kiểm tra:
1. **Trang chủ**: Mở `https://<ten-du-an>.vercel.app`, trang đăng nhập hiển thị đầy đủ giao diện UMC.
2. **Kiểm tra API Serverless**:
   - Truy cập `https://<ten-du-an>.vercel.app/api/health` -> Nhận JSON `{"status":"ok",...}`.
   - Truy cập `https://<ten-du-an>.vercel.app/api/status` -> Nhận trạng thái kết nối Supabase Cloud.
3. **Thử nghiệm Đăng nhập**: Đăng nhập thử với tài khoản mẫu (ví dụ: `quyen.ntk` / `123`).
