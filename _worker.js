/**
 * =======================================================================
 * BENH VIEN DAI HOC Y DUOC TP. HO CHI MINH - BAN DIEU DUONG
 * HE THONG DANH GIA NANG LUC DIEU DUONG & KY THUAT VIEN (UMC-NLDD)
 * CLOUDFLARE WORKER / PAGES FULL-STACK BACKEND API ENTRYPOINT
 * =======================================================================
 */

// 1. Danh sach tai khoan mau UMC (Fallback & Demo danh cho khoi tao)
const INITIAL_USERS = [
  {
    "id": "usr_tuan_hm",
    "userName": "tuan.hm",
    "msnv": "A001-00-2",
    "password": "123",
    "fullName": "PGS.TS.BS Hà Mạnh Tuấn",
    "email": "tuan.hm@umc.edu.vn",
    "phone": "0901 000 002",
    "role": "director",
    "roleName": "Ban Lãnh Đạo / BGĐ (Phê Duyệt Cấp 4 & Quyết Định)",
    "department": "Ban lãnh đạo",
    "specialty": "all",
    "level": 7,
    "levelName": "Ban Lãnh Đạo Bệnh Viện",
    "degree": "Phó Giáo sư - Tiến sĩ Y khoa",
    "academicTitle": "PGS.TS.BS",
    "graduationYear": 1996,
    "experienceYears": 28,
    "gender": "Nam",
    "dob": "12/07/1972",
    "lastSkillExamScore": 100,
    "nckh": "Chủ nhiệm và tham gia đề tài NCKH cấp Nhà nước và Quốc tế",
    "managerName": "Ban Giám Đốc BV ĐHYD TP.HCM",
    "managerId": null,
    "approvalLevel": 4,
    "avatar": "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150"
  },
  {
    "id": "usr_admin",
    "userName": "admin",
    "msnv": "ADMIN-01",
    "password": "123",
    "fullName": "Quản Trị Hệ Thống (IT Admin)",
    "email": "admin@umc.edu.vn",
    "phone": "0909 000 999",
    "role": "admin",
    "roleName": "Quản trị viên IT (Toàn quyền)",
    "department": "Trung tâm CNTT UMC",
    "specialty": "all",
    "level": 5,
    "levelName": "Quản Trị Kỹ Thuật Hệ Thống",
    "degree": "Kỹ sư CNTT & An ninh mạng",
    "academicTitle": "Kỹ sư",
    "graduationYear": 2014,
    "experienceYears": 10,
    "gender": "Nam",
    "dob": "01/01/1990",
    "lastSkillExamScore": 100,
    "nckh": "Chuyển đổi số và bảo mật dữ liệu y tế",
    "managerName": null,
    "managerId": null,
    "approvalLevel": 99,
    "avatar": "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150"
  },
  {
    "id": "usr_dan_ptt",
    "userName": "dan.ptt",
    "msnv": "D06-001-2",
    "password": "123",
    "fullName": "ThS. Phan Thị Tâm Đan",
    "email": "dan.ptt@umc.edu.vn",
    "phone": "0908 999 000",
    "role": "nurse_board",
    "roleName": "Trưởng Ban Điều Dưỡng (Thẩm Định Cấp 3)",
    "department": "Ban điều dưỡng",
    "specialty": "all",
    "level": 6,
    "levelName": "Bậc 6 - Chuyên Gia Quản Lý Toàn Viện",
    "degree": "Thạc sĩ Quản lý Bệnh viện & Điều dưỡng",
    "academicTitle": "Thạc sĩ",
    "graduationYear": 2006,
    "experienceYears": 20,
    "gender": "Nữ",
    "dob": "18/02/1982",
    "lastSkillExamScore": 98,
    "nckh": "Chủ nhiệm đề tài nghiên cứu chuẩn hóa năng lực điều dưỡng UMC",
    "managerName": "PGS.TS.BS Hà Mạnh Tuấn",
    "managerId": "usr_tuan_hm",
    "approvalLevel": 3,
    "avatar": "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=150"
  },
  {
    "id": "usr_bandd_nv01",
    "userName": "tuyet.vta",
    "msnv": "D15-008-2",
    "password": "123",
    "fullName": "Võ Thị Ánh Tuyết",
    "email": "tuyet.vta@umc.edu.vn",
    "phone": "0938 555 777",
    "role": "nurse",
    "roleName": "Nhân viên Ban Điều Dưỡng",
    "department": "Ban điều dưỡng",
    "specialty": "all",
    "level": 3,
    "levelName": "Bậc 3 - Đủ Năng Lực Thực Hành",
    "degree": "Cử nhân Điều dưỡng (ĐH Y Dược TP.HCM)",
    "academicTitle": "Cử nhân",
    "graduationYear": 2015,
    "experienceYears": 9,
    "gender": "Nữ",
    "dob": "22/07/1991",
    "lastSkillExamScore": 92,
    "nckh": "Tham gia xây dựng quy trình giám sát điều dưỡng toàn viện",
    "managerName": "ThS. Phan Thị Tâm Đan",
    "managerId": "usr_dan_ptt",
    "approvalLevel": 0,
    "avatar": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150"
  },
  {
    "id": "usr_vinh_pq",
    "userName": "vinh.pq",
    "msnv": "A00-63-2",
    "password": "123",
    "fullName": "BS.CKII Phạm Quang Vinh",
    "email": "vinh.pq@umc.edu.vn",
    "phone": "0903 777 888",
    "role": "dept_head",
    "roleName": "Trưởng Đơn Vị (Duyệt Cấp 2)",
    "department": "Chấn thương chỉnh hình",
    "specialty": "all",
    "level": 6,
    "levelName": "Bậc 6 - Chuyên Gia Quản Lý & Phẫu Thuật",
    "degree": "Bác sĩ Chuyên khoa 2",
    "academicTitle": "BS.CKII",
    "graduationYear": 2000,
    "experienceYears": 24,
    "gender": "Nam",
    "dob": "05/10/1976",
    "lastSkillExamScore": 100,
    "nckh": "Chủ nhiệm nhiều đề tài NCKH cấp cơ sở & cấp Bộ",
    "managerName": "ThS. Phan Thị Tâm Đan",
    "managerId": "usr_dan_ptt",
    "approvalLevel": 2,
    "avatar": "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=150"
  },
  {
    "id": "usr_quyen_ntk",
    "userName": "quyen.ntk",
    "msnv": "D06-009-2",
    "password": "123",
    "fullName": "Nguyễn Thị Kim Quyên",
    "email": "quyen.ntk@umc.edu.vn",
    "phone": "0903 112 233",
    "role": "head_nurse",
    "roleName": "Điều dưỡng trưởng (Duyệt Cấp 1)",
    "department": "Chấn thương chỉnh hình",
    "specialty": "all",
    "level": 5,
    "levelName": "Bậc 5 - Chuyên Gia Lâm Sàng & Quản Lý",
    "degree": "Cử nhân Điều dưỡng (ĐH Y Dược TP.HCM)",
    "academicTitle": "Cử nhân",
    "graduationYear": 2006,
    "experienceYears": 18,
    "gender": "Nữ",
    "dob": "15/08/1984",
    "lastSkillExamScore": 95,
    "nckh": "Chủ nhiệm 1 SKCT cải tiến chăm sóc bệnh nhân gãy xương",
    "managerName": "BS.CKII Phạm Quang Vinh",
    "managerId": "usr_vinh_pq",
    "approvalLevel": 1,
    "avatar": "https://images.unsplash.com/photo-1594824813627-2c13702a4bf7?w=150"
  },
  {
    "id": "usr_ngan_ttm",
    "userName": "ngan.ttm",
    "msnv": "D07-006-2",
    "password": "123",
    "fullName": "Trần Thị Mỹ Ngân",
    "email": "ngan.ttm@umc.edu.vn",
    "phone": "0908 123 456",
    "role": "nurse",
    "roleName": "Điều dưỡng (Nhân viên)",
    "department": "Chấn thương chỉnh hình",
    "specialty": "all",
    "level": 3,
    "levelName": "Bậc 3 - Đủ Năng Lực Thực Hành",
    "degree": "Cử nhân Điều dưỡng (ĐH Y Dược TP.HCM)",
    "academicTitle": "Cử nhân",
    "graduationYear": 2007,
    "experienceYears": 17,
    "gender": "Nữ",
    "dob": "20/11/1985",
    "lastSkillExamScore": 90,
    "nckh": "Tham gia đề tài NCKH chăm sóc người bệnh sau phẫu thuật kết hợp xương",
    "managerName": "Nguyễn Thị Kim Quyên",
    "managerId": "usr_quyen_ntk",
    "approvalLevel": 0,
    "avatar": "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150"
  },
  {
    "id": "usr_ngan_vtt",
    "userName": "ngan.vtt",
    "msnv": "D09-0016-2",
    "altMsnv": ["D18-012-2"],
    "password": "123",
    "fullName": "Vũ Thị Thu Ngân",
    "email": "ngan.vtt@umc.edu.vn",
    "phone": "0912 888 777",
    "role": "nurse",
    "roleName": "Điều dưỡng (Nhân viên)",
    "department": "Chấn thương chỉnh hình",
    "specialty": "all",
    "level": 3,
    "levelName": "Bậc 3 - Đủ Năng Lực Thực Hành",
    "degree": "Cử nhân Điều dưỡng",
    "academicTitle": "Cử nhân",
    "graduationYear": 2009,
    "experienceYears": 15,
    "gender": "Nữ",
    "dob": "10/05/1987",
    "lastSkillExamScore": 92,
    "nckh": "Báo cáo ca lâm sàng tại hội nghị Khoa Ngoại",
    "managerName": "Nguyễn Thị Kim Quyên",
    "managerId": "usr_quyen_ntk",
    "approvalLevel": 0,
    "avatar": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150"
  },
  {
    "id": "usr_anh_htt",
    "userName": "anh.htt",
    "msnv": "D22-012-2",
    "password": "123",
    "fullName": "Hồ Thị Trâm Anh",
    "email": "anh.htt@umc.edu.vn",
    "phone": "0933 111 222",
    "role": "nurse",
    "roleName": "Điều dưỡng (Nhân viên)",
    "department": "Chấn thương chỉnh hình",
    "specialty": "all",
    "level": 2,
    "levelName": "Bậc 2 - Có Khả Năng Thực Hành",
    "degree": "Cử nhân Điều dưỡng",
    "academicTitle": "Cử nhân",
    "graduationYear": 2022,
    "experienceYears": 4,
    "gender": "Nữ",
    "dob": "12/03/1999",
    "lastSkillExamScore": 88,
    "nckh": "Tham gia dự án 5S khoa Chấn thương Chỉnh hình",
    "managerName": "Nguyễn Thị Kim Quyên",
    "managerId": "usr_quyen_ntk",
    "approvalLevel": 0,
    "avatar": "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=150"
  },
  {
    "id": "usr_han_nn",
    "userName": "han.nn",
    "msnv": "D22-011-2",
    "password": "123",
    "fullName": "Nguyễn Ngọc Hân",
    "email": "han.nn@umc.edu.vn",
    "phone": "0944 222 333",
    "role": "nurse",
    "roleName": "Điều dưỡng (Nhân viên)",
    "department": "Chấn thương chỉnh hình",
    "specialty": "all",
    "level": 2,
    "levelName": "Bậc 2 - Có Khả Năng Thực Hành",
    "degree": "Cử nhân Điều dưỡng",
    "academicTitle": "Cử nhân",
    "graduationYear": 2022,
    "experienceYears": 4,
    "gender": "Nữ",
    "dob": "08/09/2000",
    "lastSkillExamScore": 87,
    "nckh": "Tham gia câu lạc bộ Điều dưỡng trẻ UMC",
    "managerName": "Nguyễn Thị Kim Quyên",
    "managerId": "usr_quyen_ntk",
    "approvalLevel": 0,
    "avatar": "https://images.unsplash.com/photo-1594824813627-2c13702a4bf7?w=150"
  },
  {
    "id": "usr_trang_nht",
    "userName": "trang.nht",
    "msnv": "D22-016-2",
    "password": "123",
    "fullName": "Nguyễn Hồ Thùy Trang",
    "email": "trang.nht@umc.edu.vn",
    "phone": "0955 333 444",
    "role": "nurse",
    "roleName": "Điều dưỡng (Nhân viên)",
    "department": "Chấn thương chỉnh hình",
    "specialty": "all",
    "level": 2,
    "levelName": "Bậc 2 - Có Khả Năng Thực Hành",
    "degree": "Cử nhân Điều dưỡng",
    "academicTitle": "Cử nhân",
    "graduationYear": 2022,
    "experienceYears": 4,
    "gender": "Nữ",
    "dob": "25/12/1999",
    "lastSkillExamScore": 89,
    "nckh": "Đang xây dựng đề cương NCKH 2026",
    "managerName": "Nguyễn Thị Kim Quyên",
    "managerId": "usr_quyen_ntk",
    "approvalLevel": 0,
    "avatar": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150"
  },
  {
    "id": "usr_anh_nn",
    "userName": "anh.nn",
    "msnv": "D24-009-2",
    "password": "123",
    "fullName": "Nguyễn Ngọc Ánh",
    "email": "anh.nn@umc.edu.vn",
    "phone": "0966 444 555",
    "role": "nurse",
    "roleName": "Điều dưỡng (Nhân viên)",
    "department": "Chấn thương chỉnh hình",
    "specialty": "all",
    "level": 1,
    "levelName": "Bậc 1 - Tập Sự",
    "degree": "Cử nhân Điều dưỡng",
    "academicTitle": "Cử nhân",
    "graduationYear": 2024,
    "experienceYears": 2,
    "gender": "Nữ",
    "dob": "14/06/2002",
    "lastSkillExamScore": 85,
    "nckh": "Chưa tham gia",
    "managerName": "Nguyễn Thị Kim Quyên",
    "managerId": "usr_quyen_ntk",
    "approvalLevel": 0,
    "avatar": "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=150"
  },
  {
    "id": "usr_danh_tc",
    "userName": "danh.tc",
    "msnv": "D24-010-2",
    "password": "123",
    "fullName": "Trần Công Danh",
    "email": "danh.tc@umc.edu.vn",
    "phone": "0977 555 666",
    "role": "nurse",
    "roleName": "Điều dưỡng (Nhân viên)",
    "department": "Chấn thương chỉnh hình",
    "specialty": "all",
    "level": 1,
    "levelName": "Bậc 1 - Tập Sự",
    "degree": "Cử nhân Điều dưỡng",
    "academicTitle": "Cử nhân",
    "graduationYear": 2024,
    "experienceYears": 2,
    "gender": "Nam",
    "dob": "02/04/2001",
    "lastSkillExamScore": 86,
    "nckh": "Chưa tham gia",
    "managerName": "Nguyễn Thị Kim Quyên",
    "managerId": "usr_quyen_ntk",
    "approvalLevel": 0,
    "avatar": "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150"
  },
  {
    "id": "usr_bao_pq",
    "userName": "bao.pq",
    "msnv": "KB-003-2",
    "password": "123",
    "fullName": "BS Phan Quốc Bảo",
    "email": "bao.pq@umc.edu.vn",
    "phone": "0918 111 222",
    "role": "dept_head",
    "roleName": "Trưởng Khoa Khám Bệnh (Duyệt Cấp 2)",
    "department": "Khoa Khám bệnh",
    "specialty": "khambenh",
    "level": 6,
    "levelName": "Bậc 6 - Chuyên Gia Quản Lý",
    "degree": "Bác sĩ Chuyên khoa",
    "academicTitle": "BS",
    "graduationYear": 2005,
    "experienceYears": 19,
    "gender": "Nam",
    "dob": "15/09/1980",
    "lastSkillExamScore": 98,
    "nckh": "Chủ nhiệm đề tài nâng cao chất lượng khám bệnh ngoại trú",
    "managerName": "ThS. Phan Thị Tâm Đan",
    "managerId": "usr_dan_ptt",
    "approvalLevel": 2,
    "avatar": "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=150"
  },
  {
    "id": "usr_nga_ntt",
    "userName": "nga.ntt",
    "msnv": "KB-001-2",
    "password": "123",
    "fullName": "Nguyễn Thị Tuyết Nga",
    "email": "nga.ntt@umc.edu.vn",
    "phone": "0918 333 444",
    "role": "head_nurse",
    "roleName": "Điều dưỡng trưởng (Duyệt Cấp 1)",
    "department": "Khoa Khám bệnh",
    "specialty": "khambenh",
    "level": 5,
    "levelName": "Bậc 5 - Chuyên Gia Lâm Sàng & Quản Lý",
    "degree": "Cử nhân Điều dưỡng",
    "academicTitle": "Cử nhân",
    "graduationYear": 2008,
    "experienceYears": 16,
    "gender": "Nữ",
    "dob": "20/03/1986",
    "lastSkillExamScore": 95,
    "nckh": "Cải tiến thời gian chờ tại phòng khám chuyên khoa",
    "managerName": "BS Phan Quốc Bảo",
    "managerId": "usr_bao_pq",
    "approvalLevel": 1,
    "avatar": "https://images.unsplash.com/photo-1594824813627-2c13702a4bf7?w=150"
  },
  {
    "id": "usr_khambenh_01",
    "userName": "khambenh",
    "msnv": "D19-012-2",
    "password": "123",
    "fullName": "Lê Thị Thu Thảo",
    "email": "thao.ltt@umc.edu.vn",
    "phone": "0918 223 344",
    "role": "nurse",
    "roleName": "Điều dưỡng viên Khoa Khám bệnh",
    "department": "Khoa Khám bệnh",
    "specialty": "khambenh",
    "level": 3,
    "levelName": "Bậc 3 - Độc Lập Chăm Sóc Ngoại Trú",
    "degree": "Cử nhân Điều dưỡng (ĐH Y Dược TP.HCM)",
    "academicTitle": "Cử nhân",
    "graduationYear": 2018,
    "experienceYears": 8,
    "gender": "Nữ",
    "dob": "12/04/1996",
    "lastSkillExamScore": 92,
    "nckh": "Tham gia 1 đề tài cải tiến quy trình tiếp đón và phân luồng người bệnh",
    "managerName": "Nguyễn Thị Tuyết Nga",
    "managerId": "usr_nga_ntt",
    "approvalLevel": 0,
    "avatar": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150"
  },
  {
    "id": "usr_phuong_tm",
    "userName": "phuong.tm",
    "msnv": "KB-002-2",
    "password": "123",
    "fullName": "Trịnh Mai Phương",
    "email": "phuong.tm@umc.edu.vn",
    "phone": "0918 555 666",
    "role": "nurse",
    "roleName": "Điều dưỡng viên Khoa Khám bệnh",
    "department": "Khoa Khám bệnh",
    "specialty": "khambenh",
    "level": 2,
    "levelName": "Bậc 2 - Có Khả Năng Thực Hành",
    "degree": "Cử nhân Điều dưỡng",
    "academicTitle": "Cử nhân",
    "graduationYear": 2021,
    "experienceYears": 5,
    "gender": "Nữ",
    "dob": "18/11/1998",
    "lastSkillExamScore": 89,
    "nckh": "Tham gia khảo sát sự hài lòng của người bệnh ngoại trú",
    "managerName": "Nguyễn Thị Tuyết Nga",
    "managerId": "usr_nga_ntt",
    "approvalLevel": 0,
    "avatar": "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=150"
  },
  {
    "id": "usr_thu_nt",
    "userName": "thu.nt",
    "msnv": "GM-003-2",
    "password": "123",
    "fullName": "BS Nguyễn Thị Thư",
    "email": "thu.nt@umc.edu.vn",
    "phone": "0909 111 333",
    "role": "dept_head",
    "roleName": "Trưởng Khoa GMHS (Duyệt Cấp 2)",
    "department": "Khoa Gây mê hồi sức",
    "specialty": "gayme",
    "level": 6,
    "levelName": "Bậc 6 - Chuyên Gia Quản Lý & GMHS",
    "degree": "Bác sĩ Chuyên khoa GMHS",
    "academicTitle": "BS",
    "graduationYear": 2003,
    "experienceYears": 21,
    "gender": "Nữ",
    "dob": "24/06/1979",
    "lastSkillExamScore": 99,
    "nckh": "Nghiên cứu ứng dụng gây mê kiểm soát nồng độ đích",
    "managerName": "ThS. Phan Thị Tâm Đan",
    "managerId": "usr_dan_ptt",
    "approvalLevel": 2,
    "avatar": "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150"
  },
  {
    "id": "usr_xuan_ntt",
    "userName": "xuan.ntt",
    "msnv": "GM-001-2",
    "password": "123",
    "fullName": "Nguyễn Thị Thanh Xuân",
    "email": "xuan.ntt@umc.edu.vn",
    "phone": "0909 222 444",
    "role": "head_nurse",
    "roleName": "Điều dưỡng trưởng (Duyệt Cấp 1)",
    "department": "Khoa Gây mê hồi sức",
    "specialty": "gayme",
    "level": 5,
    "levelName": "Bậc 5 - Chuyên Gia Lâm Sàng GMHS",
    "degree": "Cử nhân Gây mê hồi sức",
    "academicTitle": "Cử nhân",
    "graduationYear": 2007,
    "experienceYears": 17,
    "gender": "Nữ",
    "dob": "14/02/1985",
    "lastSkillExamScore": 96,
    "nckh": "Quy trình chuẩn bị dụng cụ gây mê trong phẫu thuật nội soi",
    "managerName": "BS Nguyễn Thị Thư",
    "managerId": "usr_thu_nt",
    "approvalLevel": 1,
    "avatar": "https://images.unsplash.com/photo-1594824813627-2c13702a4bf7?w=150"
  },
  {
    "id": "usr_gayme_01",
    "userName": "gayme",
    "msnv": "K15-008-1",
    "password": "123",
    "fullName": "Trần Hoàng Nam",
    "email": "nam.th@umc.edu.vn",
    "phone": "0909 334 455",
    "role": "nurse",
    "roleName": "KTV Gây mê hồi sức (Phòng mổ)",
    "department": "Khoa Gây mê hồi sức",
    "specialty": "gayme",
    "level": 4,
    "levelName": "Bậc 4 - KTV Gây Mê Thành Thạo",
    "degree": "Cử nhân Gây mê hồi sức (ĐH Y Hà Nội)",
    "academicTitle": "Cử nhân",
    "graduationYear": 2015,
    "experienceYears": 11,
    "gender": "Nam",
    "dob": "28/09/1992",
    "lastSkillExamScore": 96,
    "nckh": "Sáng kiến cải tiến bảng kiểm an toàn phẫu thuật WHO tại phòng mổ",
    "managerName": "Nguyễn Thị Thanh Xuân",
    "managerId": "usr_xuan_ntt",
    "approvalLevel": 0,
    "avatar": "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150"
  },
  {
    "id": "usr_tuyet_nta",
    "userName": "tuyet.nta",
    "msnv": "XN-003-2",
    "password": "123",
    "fullName": "BS.CKII Nguyễn Thị Ánh Tuyết",
    "email": "tuyet.nta@umc.edu.vn",
    "phone": "0912 111 333",
    "role": "dept_head",
    "roleName": "Trưởng Khoa Xét Nghiệm (Duyệt Cấp 2)",
    "department": "Khoa Xét nghiệm",
    "specialty": "xetnghiem",
    "level": 6,
    "levelName": "Bậc 6 - Chuyên Gia Quản Lý & Xét Nghiệm",
    "degree": "Bác sĩ CKII Huyết học - Truyền máu",
    "academicTitle": "BS.CKII",
    "graduationYear": 2002,
    "experienceYears": 22,
    "gender": "Nữ",
    "dob": "09/05/1978",
    "lastSkillExamScore": 99,
    "nckh": "Quản lý chất lượng xét nghiệm theo tiêu chuẩn ISO 15189",
    "managerName": "ThS. Phan Thị Tâm Đan",
    "managerId": "usr_dan_ptt",
    "approvalLevel": 2,
    "avatar": "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150"
  },
  {
    "id": "usr_nga_ntb",
    "userName": "nga.ntb",
    "msnv": "XN-001-2",
    "password": "123",
    "fullName": "Nguyễn Thị Bích Nga",
    "email": "nga.ntb@umc.edu.vn",
    "phone": "0912 333 555",
    "role": "head_nurse",
    "roleName": "KTV Trưởng (Duyệt Cấp 1)",
    "department": "Khoa Xét nghiệm",
    "specialty": "xetnghiem",
    "level": 5,
    "levelName": "Bậc 5 - Chuyên Gia Kỹ Thuật Xét Nghiệm",
    "degree": "Cử nhân Kỹ thuật Xét nghiệm Y học",
    "academicTitle": "Cử nhân",
    "graduationYear": 2008,
    "experienceYears": 16,
    "gender": "Nữ",
    "dob": "12/10/1986",
    "lastSkillExamScore": 96,
    "nckh": "Tối ưu hóa thời gian trả kết quả xét nghiệm cấp cứu",
    "managerName": "BS.CKII Nguyễn Thị Ánh Tuyết",
    "managerId": "usr_tuyet_nta",
    "approvalLevel": 1,
    "avatar": "https://images.unsplash.com/photo-1594824813627-2c13702a4bf7?w=150"
  },
  {
    "id": "usr_xetnghiem_01",
    "userName": "xetnghiem",
    "msnv": "X17-024-1",
    "password": "123",
    "fullName": "Phạm Minh Trí",
    "email": "tri.pm@umc.edu.vn",
    "phone": "0912 556 677",
    "role": "nurse",
    "roleName": "Kỹ thuật y Xét nghiệm",
    "department": "Khoa Xét nghiệm",
    "specialty": "xetnghiem",
    "level": 3,
    "levelName": "Bậc 3 - KTV Xét Nghiệm Độc Lập",
    "degree": "Cử nhân Kỹ thuật Xét nghiệm Y học (ĐH Y Dược TP.HCM)",
    "academicTitle": "Cử nhân",
    "graduationYear": 2017,
    "experienceYears": 9,
    "gender": "Nam",
    "dob": "05/11/1994",
    "lastSkillExamScore": 94,
    "nckh": "Đề tài đánh giá quy trình kiểm chuẩn chất lượng nội bộ máy sinh hóa tự động",
    "managerName": "Nguyễn Thị Bích Nga",
    "managerId": "usr_nga_ntb",
    "approvalLevel": 0,
    "avatar": "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=150"
  },
  {
    "id": "usr_khiem_tt",
    "userName": "khiem.tt",
    "msnv": "NS-003-2",
    "password": "123",
    "fullName": "BS Trần Thiện Khiêm",
    "email": "khiem.tt@umc.edu.vn",
    "phone": "0903 444 666",
    "role": "dept_head",
    "roleName": "Trưởng Khoa Nội Soi (Duyệt Cấp 2)",
    "department": "Khoa Nội soi",
    "specialty": "noisoi",
    "level": 6,
    "levelName": "Bậc 6 - Chuyên Gia Quản Lý & Nội Soi",
    "degree": "Bác sĩ Chuyên khoa Tiêu hóa - Nội soi",
    "academicTitle": "BS",
    "graduationYear": 2004,
    "experienceYears": 20,
    "gender": "Nam",
    "dob": "03/08/1980",
    "lastSkillExamScore": 99,
    "nckh": "Nghiên cứu can thiệp nội soi điều trị polyp đại tràng",
    "managerName": "ThS. Phan Thị Tâm Đan",
    "managerId": "usr_dan_ptt",
    "approvalLevel": 2,
    "avatar": "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=150"
  },
  {
    "id": "usr_cong_th",
    "userName": "cong.th",
    "msnv": "NS-001-2",
    "password": "123",
    "fullName": "Trần Hoàng Công",
    "email": "cong.th@umc.edu.vn",
    "phone": "0903 777 999",
    "role": "head_nurse",
    "roleName": "Điều dưỡng trưởng (Duyệt Cấp 1)",
    "department": "Khoa Nội soi",
    "specialty": "noisoi",
    "level": 5,
    "levelName": "Bậc 5 - Chuyên Gia Lâm Sàng Nội Soi",
    "degree": "Cử nhân Điều dưỡng",
    "academicTitle": "Cử nhân",
    "graduationYear": 2009,
    "experienceYears": 15,
    "gender": "Nam",
    "dob": "19/12/1985",
    "lastSkillExamScore": 95,
    "nckh": "Cải tiến quy trình kiểm soát nhiễm khuẩn dây soi mềm",
    "managerName": "BS Trần Thiện Khiêm",
    "managerId": "usr_khiem_tt",
    "approvalLevel": 1,
    "avatar": "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150"
  },
  {
    "id": "usr_noisoi_01",
    "userName": "noisoi",
    "msnv": "NS-015-1",
    "password": "123",
    "fullName": "Hoàng Thị Mai Phương",
    "email": "phuong.htm@umc.edu.vn",
    "phone": "0909 334 455",
    "role": "nurse",
    "roleName": "Điều dưỡng Nội soi",
    "department": "Khoa Nội soi",
    "specialty": "noisoi",
    "level": 3,
    "levelName": "Bậc 3 - ĐD Nội Soi Thành Thạo",
    "degree": "Cử nhân Điều dưỡng",
    "academicTitle": "Cử nhân",
    "graduationYear": 2018,
    "experienceYears": 8,
    "gender": "Nữ",
    "dob": "12/04/1995",
    "lastSkillExamScore": 92,
    "nckh": "Tham gia chuẩn hóa quy trình tiệt khuẩn nội soi mềm",
    "managerName": "Trần Hoàng Công",
    "managerId": "usr_cong_th",
    "approvalLevel": 0,
    "avatar": "https://images.unsplash.com/photo-1594824813627-2c13702a4bf7?w=150"
  },
  {
    "id": "usr_thanh_lv",
    "userName": "thanh.lv",
    "msnv": "HA-003-2",
    "password": "123",
    "fullName": "BS.CKII Lê Văn Thành",
    "email": "thanh.lv@umc.edu.vn",
    "phone": "0918 888 111",
    "role": "dept_head",
    "roleName": "Trưởng Khoa CĐHA (Duyệt Cấp 2)",
    "department": "Khoa Chẩn đoán hình ảnh",
    "specialty": "cdha",
    "level": 6,
    "levelName": "Bậc 6 - Chuyên Gia Quản Lý & CĐHA",
    "degree": "Bác sĩ CKII Chẩn đoán hình ảnh",
    "academicTitle": "BS.CKII",
    "graduationYear": 2001,
    "experienceYears": 23,
    "gender": "Nam",
    "dob": "07/04/1977",
    "lastSkillExamScore": 100,
    "nckh": "Ứng dụng MRI 3.0 Tesla trong chẩn đoán sớm bệnh lý thần kinh",
    "managerName": "ThS. Phan Thị Tâm Đan",
    "managerId": "usr_dan_ptt",
    "approvalLevel": 2,
    "avatar": "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=150"
  },
  {
    "id": "usr_viet_th",
    "userName": "viet.th",
    "msnv": "HA-001-2",
    "password": "123",
    "fullName": "Trần Hồng Việt",
    "email": "viet.th@umc.edu.vn",
    "phone": "0918 999 222",
    "role": "head_nurse",
    "roleName": "KTV Trưởng (Duyệt Cấp 1)",
    "department": "Khoa Chẩn đoán hình ảnh",
    "specialty": "cdha",
    "level": 5,
    "levelName": "Bậc 5 - Chuyên Gia Kỹ Thuật CĐHA",
    "degree": "Cử nhân Kỹ thuật Hình ảnh Y học",
    "academicTitle": "Cử nhân",
    "graduationYear": 2010,
    "experienceYears": 14,
    "gender": "Nam",
    "dob": "28/01/1986",
    "lastSkillExamScore": 96,
    "nckh": "Quy trình an toàn bức xạ và giảm liều tia cho bệnh nhi",
    "managerName": "BS.CKII Lê Văn Thành",
    "managerId": "usr_thanh_lv",
    "approvalLevel": 1,
    "avatar": "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150"
  },
  {
    "id": "usr_cdha_01",
    "userName": "cdha",
    "msnv": "HA-028-1",
    "password": "123",
    "fullName": "Ngô Văn Hùng",
    "email": "hung.nv@umc.edu.vn",
    "phone": "0918 776 655",
    "role": "nurse",
    "roleName": "Kỹ thuật y CĐHA",
    "department": "Khoa Chẩn đoán hình ảnh",
    "specialty": "cdha",
    "level": 3,
    "levelName": "Bậc 3 - KTV CĐHA Độc Lập",
    "degree": "Cử nhân Kỹ thuật Hình ảnh Y học",
    "academicTitle": "Cử nhân",
    "graduationYear": 2017,
    "experienceYears": 9,
    "gender": "Nam",
    "dob": "22/09/1993",
    "lastSkillExamScore": 95,
    "nckh": "Tối ưu hóa liều xạ trong chụp CT Scanner can thiệp",
    "managerName": "Trần Hồng Việt",
    "managerId": "usr_viet_th",
    "approvalLevel": 0,
    "avatar": "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150"
  },
  {
    "id": "usr_phuc_hv",
    "userName": "phuc.hv",
    "msnv": "VL-003-2",
    "password": "123",
    "fullName": "BS.CKI Hoàng Văn Phúc",
    "email": "phuc.hv@umc.edu.vn",
    "phone": "0938 111 444",
    "role": "dept_head",
    "roleName": "Trưởng Khoa PHCN-VLTL (Duyệt Cấp 2)",
    "department": "Khoa PHCN - VLTL",
    "specialty": "vltl_phcn",
    "level": 6,
    "levelName": "Bậc 6 - Chuyên Gia Quản Lý & PHCN",
    "degree": "Bác sĩ CKI Phục hồi chức năng",
    "academicTitle": "BS.CKI",
    "graduationYear": 2005,
    "experienceYears": 19,
    "gender": "Nam",
    "dob": "16/10/1981",
    "lastSkillExamScore": 98,
    "nckh": "Phục hồi chức năng sớm sau phẫu thuật thay khớp háng",
    "managerName": "ThS. Phan Thị Tâm Đan",
    "managerId": "usr_dan_ptt",
    "approvalLevel": 2,
    "avatar": "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=150"
  },
  {
    "id": "usr_luan_nt",
    "userName": "luan.nt",
    "msnv": "VL-001-2",
    "password": "123",
    "fullName": "Nguyễn Thành Luân",
    "email": "luan.nt@umc.edu.vn",
    "phone": "0938 333 666",
    "role": "head_nurse",
    "roleName": "KTV Trưởng (Duyệt Cấp 1)",
    "department": "Khoa PHCN - VLTL",
    "specialty": "vltl_phcn",
    "level": 5,
    "levelName": "Bậc 5 - Chuyên Gia Kỹ Thuật PHCN-VLTL",
    "degree": "Cử nhân Vật lý trị liệu - Phục hồi chức năng",
    "academicTitle": "Cử nhân",
    "graduationYear": 2011,
    "experienceYears": 13,
    "gender": "Nam",
    "dob": "05/03/1987",
    "lastSkillExamScore": 95,
    "nckh": "Phác đồ tập vận động trị liệu cho bệnh nhân sau đột quỵ não",
    "managerName": "BS.CKI Hoàng Văn Phúc",
    "managerId": "usr_phuc_hv",
    "approvalLevel": 1,
    "avatar": "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150"
  },
  {
    "id": "usr_vltl_01",
    "userName": "vltl",
    "msnv": "PH-019-1",
    "password": "123",
    "fullName": "Đặng Thanh Thảo",
    "email": "thao.dt@umc.edu.vn",
    "phone": "0938 221 133",
    "role": "nurse",
    "roleName": "Kỹ thuật y Phục hồi chức năng",
    "department": "Khoa PHCN - VLTL",
    "specialty": "vltl_phcn",
    "level": 3,
    "levelName": "Bậc 3 - KTV PHCN Thành Thạo",
    "degree": "Cử nhân Phục hồi chức năng",
    "academicTitle": "Cử nhân",
    "graduationYear": 2019,
    "experienceYears": 7,
    "gender": "Nữ",
    "dob": "18/06/1996",
    "lastSkillExamScore": 91,
    "nckh": "Đánh giá hiệu quả phục hồi chức năng sớm sau phẫu thuật dây chằng",
    "managerName": "Nguyễn Thành Luân",
    "managerId": "usr_luan_nt",
    "approvalLevel": 0,
    "avatar": "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150"
  },
  {
    "id": "usr_khoa_dm",
    "userName": "khoa.dm",
    "msnv": "NK-003-2",
    "password": "123",
    "fullName": "BS.CKII Đỗ Minh Khoa",
    "email": "khoa.dm@umc.edu.vn",
    "phone": "0903 111 555",
    "role": "dept_head",
    "roleName": "Trưởng Khoa KSNK (Duyệt Cấp 2)",
    "department": "Khoa Kiểm soát nhiễm khuẩn",
    "specialty": "all",
    "level": 6,
    "levelName": "Bậc 6 - Chuyên Gia Quản Lý & KSNK",
    "degree": "Bác sĩ CKII Kiểm soát nhiễm khuẩn",
    "academicTitle": "BS.CKII",
    "graduationYear": 2001,
    "experienceYears": 23,
    "gender": "Nam",
    "dob": "11/01/1977",
    "lastSkillExamScore": 99,
    "nckh": "Chiến lược phòng ngừa nhiễm khuẩn bệnh viện toàn diện",
    "managerName": "ThS. Phan Thị Tâm Đan",
    "managerId": "usr_dan_ptt",
    "approvalLevel": 2,
    "avatar": "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=150"
  },
  {
    "id": "usr_phuong_nt",
    "userName": "phuong.nt",
    "msnv": "NK-001-2",
    "password": "123",
    "fullName": "Nguyễn Trần Phương",
    "email": "phuong.nt@umc.edu.vn",
    "phone": "0903 333 777",
    "role": "head_nurse",
    "roleName": "Điều dưỡng trưởng (Duyệt Cấp 1)",
    "department": "Khoa Kiểm soát nhiễm khuẩn",
    "specialty": "all",
    "level": 5,
    "levelName": "Bậc 5 - Chuyên Gia Lâm Sàng KSNK",
    "degree": "Cử nhân Điều dưỡng",
    "academicTitle": "Cử nhân",
    "graduationYear": 2008,
    "experienceYears": 16,
    "gender": "Nữ",
    "dob": "17/07/1986",
    "lastSkillExamScore": 96,
    "nckh": "Giám sát tuân thủ vệ sinh tay và cách ly người bệnh",
    "managerName": "BS.CKII Đỗ Minh Khoa",
    "managerId": "usr_khoa_dm",
    "approvalLevel": 1,
    "avatar": "https://images.unsplash.com/photo-1594824813627-2c13702a4bf7?w=150"
  },
  {
    "id": "usr_ksnk_01",
    "userName": "ksnk",
    "msnv": "KS-011-1",
    "password": "123",
    "fullName": "ThS. Lê Minh Tuấn",
    "email": "tuan.lm@umc.edu.vn",
    "phone": "0903 889 900",
    "role": "nurse",
    "roleName": "Điều dưỡng KSNK",
    "department": "Khoa Kiểm soát nhiễm khuẩn",
    "specialty": "all",
    "level": 4,
    "levelName": "Bậc 4 - ĐD Chuyên Khoa KSNK",
    "degree": "Thạc sĩ Điều dưỡng",
    "academicTitle": "Thạc sĩ",
    "graduationYear": 2014,
    "experienceYears": 12,
    "gender": "Nam",
    "dob": "08/02/1990",
    "lastSkillExamScore": 96,
    "nckh": "Giám sát nhiễm khuẩn vết mổ và vi khuẩn kháng kháng sinh",
    "managerName": "Nguyễn Trần Phương",
    "managerId": "usr_phuong_nt",
    "approvalLevel": 0,
    "avatar": "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=150"
  },
  {
    "id": "usr_trung_lq",
    "userName": "trung.lq",
    "msnv": "SH-003-2",
    "password": "123",
    "fullName": "TS.BS Lê Quốc Trung",
    "email": "trung.lq@umc.edu.vn",
    "phone": "0919 111 666",
    "role": "dept_head",
    "roleName": "Giám Đốc TT SHPT (Duyệt Cấp 2)",
    "department": "Trung tâm SHPT",
    "specialty": "xetnghiem",
    "level": 6,
    "levelName": "Bậc 6 - Chuyên Gia Quản Lý & SHPT",
    "degree": "Tiến sĩ Y sinh học phân tử",
    "academicTitle": "TS.BS",
    "graduationYear": 2002,
    "experienceYears": 22,
    "gender": "Nam",
    "dob": "21/05/1978",
    "lastSkillExamScore": 100,
    "nckh": "Nghiên cứu giải trình tự gen thế hệ mới (NGS) trong chẩn đoán ung thư",
    "managerName": "ThS. Phan Thị Tâm Đan",
    "managerId": "usr_dan_ptt",
    "approvalLevel": 2,
    "avatar": "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=150"
  },
  {
    "id": "usr_anh_nt",
    "userName": "anh.nt",
    "msnv": "SH-001-2",
    "password": "123",
    "fullName": "Nguyễn Tấn Anh",
    "email": "anh.nt@umc.edu.vn",
    "phone": "0919 222 777",
    "role": "head_nurse",
    "roleName": "KTV Trưởng (Duyệt Cấp 1)",
    "department": "Trung tâm SHPT",
    "specialty": "xetnghiem",
    "level": 5,
    "levelName": "Bậc 5 - Chuyên Gia Kỹ Thuật SHPT",
    "degree": "Cử nhân Sinh học phân tử - Xét nghiệm",
    "academicTitle": "Cử nhân",
    "graduationYear": 2011,
    "experienceYears": 13,
    "gender": "Nam",
    "dob": "10/09/1987",
    "lastSkillExamScore": 96,
    "nckh": "Thiết lập quy trình định lượng tải lượng virus HBV, HCV và HIV tự động",
    "managerName": "TS.BS Lê Quốc Trung",
    "managerId": "usr_trung_lq",
    "approvalLevel": 1,
    "avatar": "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150"
  },
  {
    "id": "usr_shpt_01",
    "userName": "shpt",
    "msnv": "SH-008-1",
    "password": "123",
    "fullName": "Trần Thị Thu Hà",
    "email": "ha.ttt@umc.edu.vn",
    "phone": "0919 443 322",
    "role": "nurse",
    "roleName": "Kỹ thuật y Sinh học phân tử",
    "department": "Trung tâm SHPT",
    "specialty": "xetnghiem",
    "level": 3,
    "levelName": "Bậc 3 - KTV Sinh Học Phân Tử",
    "degree": "Cử nhân Xét nghiệm Y học",
    "academicTitle": "Cử nhân",
    "graduationYear": 2018,
    "experienceYears": 8,
    "gender": "Nữ",
    "dob": "14/10/1995",
    "lastSkillExamScore": 94,
    "nckh": "Ứng dụng kỹ thuật Real-time PCR trong chẩn đoán gen kháng thuốc",
    "managerName": "Nguyễn Tấn Anh",
    "managerId": "usr_anh_nt",
    "approvalLevel": 0,
    "avatar": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150"
  }
];

// 2. Doc cau hinh tu Cloudflare Environment (env)
function getEnvConfig(env) {
  return {
    SUPABASE_URL: (env && env.SUPABASE_URL) || 'https://bmnbwofludntkmjeskqj.supabase.co',
    SUPABASE_SECRET_KEY: (env && env.SUPABASE_SECRET_KEY) || (typeof process !== 'undefined' && process.env && process.env.SUPABASE_SECRET_KEY) || '',
    SUPABASE_PUBLISHABLE_KEY: (env && env.SUPABASE_PUBLISHABLE_KEY) || 'sb_publishable_QdZyIMIhGJmnuG_UG0NL3g_FIjgyYis',
    JWT_SECRET: (env && env.JWT_SECRET) || 'umc-nursing-competency-auth-secret-key-2026',
    ALLOWED_ORIGIN: (env && env.ALLOWED_ORIGIN) || '*',
    RESEND_API_KEY: (env && env.RESEND_API_KEY) || ''
  };
}

// 3. Security Headers & CORS Controller
function getCorsHeaders(request, envConfig) {
  const origin = request.headers.get('Origin') || '*';
  const allowedOrigin = envConfig.ALLOWED_ORIGIN;
  let allowHeader = allowedOrigin;
  if (allowedOrigin === '*' || !origin) {
    allowHeader = '*';
  } else if (
    origin.includes('localhost') ||
    origin.includes('127.0.0.1') ||
    origin.includes('umc.edu.vn') ||
    origin.includes('vercel.app') ||
    origin.includes('pages.dev') ||
    origin.includes('workers.dev') ||
    origin === allowedOrigin
  ) {
    allowHeader = origin;
  }

  return {
    'Access-Control-Allow-Origin': allowHeader,
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS, PATCH',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, Accept, X-Requested-With, apikey, Prefer',
    'Access-Control-Max-Age': '86400',
    'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.tailwindcss.com https://cdn.jsdelivr.net; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com data:; img-src 'self' data: blob: https://images.unsplash.com https://*.supabase.co https://*.supabase.in; connect-src 'self' https://*.supabase.co https://*.supabase.in https://danh-gia-nldd-umc.vercel.app https://*.pages.dev https://*.workers.dev http://localhost:* http://127.0.0.1:*; frame-ancestors 'none'; object-src 'none'; base-uri 'self';",
    'X-Frame-Options': 'DENY',
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), payment=(), usb=(), screen-wake-lock=(), interest-cohort=()',
    'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload',
    'X-XSS-Protection': '1; mode=block'
  };
}

function jsonResponse(data, status = 200, request, envConfig) {
  const headers = {
    ...getCorsHeaders(request, envConfig),
    'Content-Type': 'application/json; charset=utf-8'
  };
  return new Response(JSON.stringify(data), { status, headers });
}

function handleOptions(request, envConfig) {
  return new Response(null, {
    status: 204,
    headers: getCorsHeaders(request, envConfig)
  });
}

// 4. Web Crypto Security (PBKDF2 Password Hashing & HMAC-SHA256 JWT)
async function hashPassword(password, saltHex = null) {
  if (!saltHex) {
    const rawSalt = crypto.getRandomValues(new Uint8Array(16));
    saltHex = Array.from(rawSalt).map(b => b.toString(16).padStart(2, '0')).join('');
  }
  const enc = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    enc.encode(password),
    { name: 'PBKDF2' },
    false,
    ['deriveBits']
  );
  const derivedBits = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt: enc.encode(saltHex),
      iterations: 10000,
      hash: 'SHA-512'
    },
    keyMaterial,
    512
  );
  const hashHex = Array.from(new Uint8Array(derivedBits)).map(b => b.toString(16).padStart(2, '0')).join('');
  return `${saltHex}:${hashHex}`;
}

async function verifyPassword(inputPassword, storedPassword) {
  if (!storedPassword || !inputPassword) return false;
  if (storedPassword.includes(':')) {
    const [saltHex, originalHash] = storedPassword.split(':');
    const computed = await hashPassword(inputPassword, saltHex);
    const [, computedHash] = computed.split(':');
    return computedHash === originalHash;
  }
  return inputPassword === storedPassword;
}

function base64UrlEncode(str) {
  const bytes = new TextEncoder().encode(str);
  let bin = '';
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function base64UrlDecode(str) {
  let b64 = str.replace(/-/g, '+').replace(/_/g, '/');
  while (b64.length % 4) b64 += '=';
  const bin = atob(b64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return new TextDecoder().decode(bytes);
}

async function generateToken(payload, secret, expiresInHours = 8) {
  const header = base64UrlEncode(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const exp = Math.floor(Date.now() / 1000) + (expiresInHours * 3600);
  const body = base64UrlEncode(JSON.stringify({ ...payload, exp }));
  const data = `${header}.${body}`;
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    enc.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const sigBuffer = await crypto.subtle.sign('HMAC', key, enc.encode(data));
  const sigBytes = new Uint8Array(sigBuffer);
  let sigBin = '';
  for (let i = 0; i < sigBytes.length; i++) sigBin += String.fromCharCode(sigBytes[i]);
  const sigB64 = btoa(sigBin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  return `${data}.${sigB64}`;
}

async function verifyToken(token, secret) {
  if (!token || typeof token !== 'string') return null;
  const parts = token.split('.');
  if (parts.length !== 3) return null;
  const [header, body, signature] = parts;
  const data = `${header}.${body}`;
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    enc.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['verify']
  );
  let sigB64 = signature.replace(/-/g, '+').replace(/_/g, '/');
  while (sigB64.length % 4) sigB64 += '=';
  const sigBin = atob(sigB64);
  const sigBytes = new Uint8Array(sigBin.length);
  for (let i = 0; i < sigBin.length; i++) sigBytes[i] = sigBin.charCodeAt(i);
  const isValid = await crypto.subtle.verify('HMAC', key, sigBytes, enc.encode(data));
  if (!isValid) return null;
  try {
    const payload = JSON.parse(base64UrlDecode(body));
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) return null;
    return payload;
  } catch {
    return null;
  }
}

async function authenticateToken(request, envConfig) {
  const authHeader = request.headers.get('Authorization') || request.headers.get('authorization');
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.substring(7) : null;
  if (!token) {
    return {
      error: jsonResponse({
        success: false,
        message: 'Yêu cầu xác thực: Vui lòng đăng nhập để thực hiện thao tác này!'
      }, 401, request, envConfig)
    };
  }
  const decoded = await verifyToken(token, envConfig.JWT_SECRET);
  if (!decoded) {
    return {
      error: jsonResponse({
        success: false,
        message: 'Phiên đăng nhập đã hết hạn hoặc không hợp lệ. Vui lòng đăng nhập lại!'
      }, 403, request, envConfig)
    };
  }
  return { user: decoded };
}

// 5. Chuan hoa du lieu nhan su (Loai bo mat khau)
function sanitizeUser(u) {
  if (!u) return null;
  const { password, ...raw } = u;
  return {
    ...raw,
    id: raw.id,
    user_name: raw.user_name || raw.userName || raw.id,
    userName: raw.user_name || raw.userName || raw.id,
    msnv: raw.msnv,
    full_name: raw.full_name || raw.fullName || 'Nhân sự UMC',
    fullName: raw.full_name || raw.fullName || 'Nhân sự UMC',
    email: raw.email || '',
    phone: raw.phone || '',
    role: raw.role || 'nurse',
    role_name: raw.role_name || raw.roleName || raw.role || 'Điều dưỡng',
    roleName: raw.role_name || raw.roleName || raw.role || 'Điều dưỡng',
    department: raw.department || 'Chấn thương chỉnh hình',
    specialty: raw.specialty || 'lamsang',
    level: parseInt(raw.level) || 1,
    level_name: raw.level_name || raw.levelName || `Bậc ${raw.level || 1}`,
    levelName: raw.level_name || raw.levelName || `Bậc ${raw.level || 1}`,
    degree: raw.degree || 'Cử nhân',
    academic_title: raw.academic_title || raw.academicTitle || raw.degree || 'Cử nhân',
    academicTitle: raw.academic_title || raw.academicTitle || raw.degree || 'Cử nhân',
    graduation_year: parseInt(raw.graduation_year || raw.graduationYear) || 2018,
    graduationYear: parseInt(raw.graduation_year || raw.graduationYear) || 2018,
    experience_years: parseInt(raw.experience_years || raw.experienceYears) || 5,
    experienceYears: parseInt(raw.experience_years || raw.experienceYears) || 5,
    gender: raw.gender || 'Nữ',
    dob: raw.dob || '15/08/1990',
    last_skill_exam_score: parseInt(raw.last_skill_exam_score || raw.lastSkillExamScore) || 90,
    lastSkillExamScore: parseInt(raw.last_skill_exam_score || raw.lastSkillExamScore) || 90,
    nckh: raw.nckh || '',
    manager_name: raw.manager_name || raw.managerName || 'Ban Điều Dưỡng',
    managerName: raw.manager_name || raw.managerName || 'Ban Điều Dưỡng',
    manager_id: raw.manager_id || raw.managerId || null,
    managerId: raw.manager_id || raw.managerId || null,
    approval_level: parseInt(raw.approval_level || raw.approvalLevel) || 0,
    approvalLevel: parseInt(raw.approval_level || raw.approvalLevel) || 0,
    avatar: raw.avatar || 'https://images.unsplash.com/photo-1594824813627-2c13702a4bf7?w=150',
    job_title: raw.job_title || raw.jobTitle || raw.role_name || raw.roleName || 'Điều dưỡng viên',
    jobTitle: raw.job_title || raw.jobTitle || raw.role_name || raw.roleName || 'Điều dưỡng viên',
    evaluation_year: parseInt(raw.evaluation_year || raw.evaluationYear) || 2026,
    evaluationYear: parseInt(raw.evaluation_year || raw.evaluationYear) || 2026
  };
}

// 6. Supabase REST API Client (Hoat dong truc tiep tren Edge Worker)
const supabaseApi = {
  async insert(table, data, envConfig) {
    const url = `${envConfig.SUPABASE_URL}/rest/v1/${table}`;
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'apikey': envConfig.SUPABASE_SECRET_KEY,
        'Authorization': `Bearer ${envConfig.SUPABASE_SECRET_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      },
      body: JSON.stringify(data)
    });
    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Supabase API lỗi (${res.status}): ${errorText}`);
    }
    return res.json();
  },

  async upsert(table, data, onConflict = 'id', envConfig) {
    const url = `${envConfig.SUPABASE_URL}/rest/v1/${table}?on_conflict=${onConflict}`;
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'apikey': envConfig.SUPABASE_SECRET_KEY,
        'Authorization': `Bearer ${envConfig.SUPABASE_SECRET_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'resolution=merge-duplicates,return=representation'
      },
      body: JSON.stringify(data)
    });
    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Supabase API lỗi (${res.status}): ${errorText}`);
    }
    return res.json();
  },

  async select(table, { limit = 100, page = 1, order = null, queryParams = '' } = {}, envConfig) {
    const offset = (page - 1) * limit;
    let url = `${envConfig.SUPABASE_URL}/rest/v1/${table}?select=*&limit=${limit}&offset=${offset}`;
    if (order) url += `&order=${order}`;
    if (queryParams) url += `&${queryParams}`;

    const res = await fetch(url, {
      headers: {
        'apikey': envConfig.SUPABASE_SECRET_KEY,
        'Authorization': `Bearer ${envConfig.SUPABASE_SECRET_KEY}`,
        'Accept': 'application/json'
      }
    });
    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Supabase API lỗi (${res.status}): ${errorText}`);
    }
    return res.json();
  }
};

// 7. Cache OTP Reset Password
const resetOtpCache = new Map();

async function sendOtpEmail({ email, fullName, otp }, envConfig) {
  if (envConfig.RESEND_API_KEY) {
    try {
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${envConfig.RESEND_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from: 'Ban Điều Dưỡng UMC <onboarding@resend.dev>',
          to: email,
          subject: '[UMC-NLDD] Mã xác thực OTP khôi phục mật khẩu tài khoản',
          html: `<p>Kính gửi ${fullName},</p><p>Mã OTP của bạn là: <strong>${otp}</strong> (hiệu lực 15 phút).</p>`
        })
      });
      return { sent: true };
    } catch (e) {
      console.warn('Lỗi gửi email qua Resend:', e);
    }
  }
  console.log(`[EMAIL-SENDER] ℹ️ Đã phát hành mã OTP [${otp}] cho: ${fullName} <${email}>`);
  return { sent: false, simulated: true };
}

// 8. Router xu ly tat ca API Endpoints
async function handleApiRequest(request, envConfig) {
  const url = new URL(request.url);
  const pathname = url.pathname;
  const method = request.method.toUpperCase();

  try {
    // ----------------------------------------------------
    // POST /api/auth/login
    // ----------------------------------------------------
    if (method === 'POST' && pathname === '/api/auth/login') {
      let body;
      try { body = await request.json(); } catch { body = {}; }
      const { username, password } = body;
      if (!username || typeof username !== 'string' || !password || typeof password !== 'string') {
        return jsonResponse({
          success: false,
          message: 'Vui lòng cung cấp đầy đủ tên đăng nhập và mật khẩu!'
        }, 400, request, envConfig);
      }

      const uClean = username.toLowerCase().trim();
      let records = [];
      try {
        records = await supabaseApi.select('umc_users', { limit: 500 }, envConfig);
      } catch (e) {
        console.warn('Lỗi đọc bảng umc_users trên Supabase:', e.message);
      }

      const allUsersList = [...(records || []), ...(typeof INITIAL_USERS !== 'undefined' ? INITIAL_USERS.map(u => ({
        ...u,
        user_name: u.userName || u.user_name || u.id,
        full_name: u.fullName || u.full_name,
        role_name: u.roleName || u.role_name
      })) : [])];

      const user = allUsersList.find(u =>
        (u.id && u.id.toLowerCase() === uClean) ||
        (u.user_name && u.user_name.toLowerCase() === uClean) ||
        (u.userName && u.userName.toLowerCase() === uClean) ||
        (u.msnv && u.msnv.toLowerCase() === uClean) ||
        (u.altMsnv && Array.isArray(u.altMsnv) && u.altMsnv.some(a => a.toLowerCase() === uClean)) ||
        (u.alt_msnv && Array.isArray(u.alt_msnv) && u.alt_msnv.some(a => a.toLowerCase() === uClean)) ||
        (u.email && u.email.toLowerCase() === uClean) ||
        (u.full_name && u.full_name.toLowerCase() === uClean) ||
        (u.fullName && u.fullName.toLowerCase() === uClean)
      );

      if (!user) {
        return jsonResponse({
          success: false,
          errorField: 'username',
          message: `Sai tên đăng nhập: Tên đăng nhập hoặc MSNV "${username}" không tồn tại trong hệ thống UMC!`
        }, 401, request, envConfig);
      }

      const storedPwd = user.password || '123';
      const isMatch = await verifyPassword(password, storedPwd);
      if (!isMatch) {
        return jsonResponse({
          success: false,
          errorField: 'password',
          message: 'Sai mật khẩu: Mật khẩu bạn nhập không chính xác. Vui lòng kiểm tra lại!'
        }, 401, request, envConfig);
      }

      if (!storedPwd.includes(':')) {
        try {
          const hashed = await hashPassword(password);
          await supabaseApi.upsert('umc_users', [{ id: user.id, password: hashed }], 'id', envConfig);
        } catch (err) {
          console.warn('Không thể tự động băm mật khẩu cho user:', err.message);
        }
      }

      const safeUser = sanitizeUser(user);
      const token = await generateToken({
        id: user.id,
        userName: user.user_name || user.id,
        role: user.role,
        roleName: user.role_name,
        department: user.department,
        fullName: user.full_name,
        approvalLevel: user.approval_level || 0
      }, envConfig.JWT_SECRET, 8);

      return jsonResponse({
        success: true,
        message: `Đăng nhập thành công! Xin chào ${user.full_name} (${user.role_name || user.role})`,
        token,
        user: safeUser
      }, 200, request, envConfig);
    }

    // ----------------------------------------------------
    // POST /api/auth/forgot-password
    // ----------------------------------------------------
    if (method === 'POST' && pathname === '/api/auth/forgot-password') {
      let body;
      try { body = await request.json(); } catch { body = {}; }
      const { identifier } = body;
      if (!identifier || typeof identifier !== 'string') {
        return jsonResponse({
          success: false,
          message: 'Vui lòng cung cấp Tên đăng nhập, MSNV hoặc Email UMC!'
        }, 400, request, envConfig);
      }

      const uClean = identifier.toLowerCase().trim();
      let records = [];
      try {
        records = await supabaseApi.select('umc_users', { limit: 500 }, envConfig);
      } catch (e) {
        console.warn('Lỗi đọc bảng umc_users trên Supabase:', e.message);
      }

      const allUsersList = [...(records || []), ...(typeof INITIAL_USERS !== 'undefined' ? INITIAL_USERS.map(u => ({
        ...u,
        user_name: u.userName || u.user_name || u.id,
        full_name: u.fullName || u.full_name,
        role_name: u.roleName || u.role_name
      })) : [])];

      const user = allUsersList.find(u =>
        (u.id && u.id.toLowerCase() === uClean) ||
        (u.user_name && u.user_name.toLowerCase() === uClean) ||
        (u.userName && u.userName.toLowerCase() === uClean) ||
        (u.msnv && u.msnv.toLowerCase() === uClean) ||
        (u.email && u.email.toLowerCase() === uClean) ||
        (u.full_name && u.full_name.toLowerCase() === uClean) ||
        (u.fullName && u.fullName.toLowerCase() === uClean)
      );

      if (!user) {
        return jsonResponse({
          success: false,
          message: `Không tìm thấy tài khoản cán bộ nhân viên nào khớp với "${identifier}" trong cơ sở dữ liệu UMC!`
        }, 404, request, envConfig);
      }

      const email = user.email || `${user.user_name || user.msnv || 'user'}@umc.edu.vn`;
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      const expiresAt = Date.now() + 15 * 60 * 1000;

      const sessionData = { otp, expiresAt, userId: user.id, email, fullName: user.full_name, msnv: user.msnv };
      resetOtpCache.set(uClean, sessionData);
      if (user.id) resetOtpCache.set(user.id.toLowerCase(), sessionData);
      if (user.user_name) resetOtpCache.set(user.user_name.toLowerCase(), sessionData);
      if (user.msnv) resetOtpCache.set(user.msnv.toLowerCase(), sessionData);
      if (email) resetOtpCache.set(email.toLowerCase(), sessionData);

      const parts = email.split('@');
      let maskedEmail = email;
      if (parts.length === 2) {
        const name = parts[0];
        if (name.length > 2) {
          maskedEmail = name[0] + '*'.repeat(name.length - 2) + name[name.length - 1] + '@' + parts[1];
        } else {
          maskedEmail = name[0] + '*@' + parts[1];
        }
      }

      await sendOtpEmail({ email, fullName: user.full_name, otp }, envConfig);

      return jsonResponse({
        success: true,
        message: `Hệ thống đã gửi mã xác thực khôi phục mật khẩu đến email UMC của bạn: ${maskedEmail}. Vui lòng kiểm tra hộp thư!`,
        maskedEmail,
        fullName: user.full_name,
        msnv: user.msnv,
        userName: user.user_name || user.id,
        expiresInMinutes: 15
      }, 200, request, envConfig);
    }

    // ----------------------------------------------------
    // POST /api/auth/reset-password
    // ----------------------------------------------------
    if (method === 'POST' && pathname === '/api/auth/reset-password') {
      let body;
      try { body = await request.json(); } catch { body = {}; }
      const { identifier, otp, newPassword } = body;
      if (!identifier || !otp || !newPassword) {
        return jsonResponse({
          success: false,
          message: 'Vui lòng cung cấp đầy đủ thông tin: định danh tài khoản, mã OTP và mật khẩu mới!'
        }, 400, request, envConfig);
      }

      if (newPassword.length < 3) {
        return jsonResponse({
          success: false,
          message: 'Mật khẩu mới phải có tối thiểu 3 ký tự!'
        }, 400, request, envConfig);
      }

      const uClean = identifier.toLowerCase().trim();
      const cached = resetOtpCache.get(uClean);

      if (!cached) {
        return jsonResponse({
          success: false,
          message: 'Mã xác thực không tồn tại hoặc phiên đã hết hạn. Vui lòng yêu cầu gửi lại mã!'
        }, 400, request, envConfig);
      }

      if (Date.now() > cached.expiresAt) {
        resetOtpCache.delete(uClean);
        return jsonResponse({
          success: false,
          message: 'Mã xác thực OTP đã hết hạn (chỉ có hiệu lực trong 15 phút). Vui lòng gửi lại yêu cầu!'
        }, 400, request, envConfig);
      }

      if (String(cached.otp).trim() !== String(otp).trim()) {
        return jsonResponse({
          success: false,
          message: 'Mã xác thực OTP không chính xác. Vui lòng kiểm tra lại email UMC!'
        }, 400, request, envConfig);
      }

      try {
        const hashed = await hashPassword(newPassword);
        await supabaseApi.upsert('umc_users', [{ id: cached.userId, password: hashed }], 'id', envConfig);
      } catch (e) {
        console.warn('Lỗi cập nhật mật khẩu mới lên Supabase:', e.message);
      }

      resetOtpCache.delete(uClean);
      if (cached.userId) resetOtpCache.delete(cached.userId.toLowerCase());
      if (cached.email) resetOtpCache.delete(cached.email.toLowerCase());

      return jsonResponse({
        success: true,
        message: 'Đặt lại mật khẩu thành công! Bạn có thể đăng nhập ngay với mật khẩu mới.'
      }, 200, request, envConfig);
    }

    // ----------------------------------------------------
    // GET /api/auth/me
    // ----------------------------------------------------
    if (method === 'GET' && pathname === '/api/auth/me') {
      const auth = await authenticateToken(request, envConfig);
      if (auth.error) return auth.error;
      return jsonResponse({ success: true, user: auth.user }, 200, request, envConfig);
    }

    // ----------------------------------------------------
    // GET /api/health
    // ----------------------------------------------------
    if (method === 'GET' && pathname === '/api/health') {
      return jsonResponse({
        status: 'ok',
        service: 'Backend API UMC - Cloudflare Worker Edge (Secured)',
        time: new Date().toISOString()
      }, 200, request, envConfig);
    }

    // ----------------------------------------------------
    // GET /api/status
    // ----------------------------------------------------
    if (method === 'GET' && pathname === '/api/status') {
      let supabaseConnected = false;
      let availableTables = [];
      try {
        const ping = await fetch(`${envConfig.SUPABASE_URL}/rest/v1/`, {
          headers: {
            apikey: envConfig.SUPABASE_SECRET_KEY,
            Authorization: `Bearer ${envConfig.SUPABASE_SECRET_KEY}`
          }
        });
        if (ping.ok) {
          supabaseConnected = true;
          const spec = await ping.json();
          availableTables = Object.keys(spec.definitions || {});
        }
      } catch (e) {
        console.warn('Ping Supabase thất bại:', e.message);
      }

      return jsonResponse({
        success: true,
        status: 'online',
        service: 'Backend API UMC - Cloudflare Worker Edge Bridge',
        supabaseConnected,
        supabaseUrl: envConfig.SUPABASE_URL,
        tables: availableTables,
        time: new Date().toISOString()
      }, 200, request, envConfig);
    }

    // ----------------------------------------------------
    // POST /api/yeu-cau
    // ----------------------------------------------------
    if (method === 'POST' && pathname === '/api/yeu-cau') {
      let body;
      try { body = await request.json(); } catch { body = {}; }
      const { ho_ten, email, so_dien_thoai, noi_dung } = body;

      const errors = [];
      if (!ho_ten || typeof ho_ten !== 'string' || ho_ten.trim() === '') {
        errors.push('Họ và tên là bắt buộc.');
      }
      if (!noi_dung || typeof noi_dung !== 'string' || noi_dung.trim() === '') {
        errors.push('Nội dung yêu cầu không được để trống.');
      }
      if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        errors.push('Email không đúng định dạng hợp lệ.');
      }

      if (errors.length > 0) {
        return jsonResponse({
          success: false,
          message: 'Dữ liệu không hợp lệ',
          errors
        }, 400, request, envConfig);
      }

      const payload = {
        ho_ten: ho_ten.trim(),
        email: email ? email.trim() : null,
        so_dien_thoai: so_dien_thoai ? so_dien_thoai.trim() : null,
        noi_dung: noi_dung.trim()
      };

      const inserted = await supabaseApi.insert('yeu_cau', payload, envConfig);
      const savedRecord = Array.isArray(inserted) ? inserted[0] : inserted;

      return jsonResponse({
        success: true,
        message: 'Lưu yêu cầu thành công!',
        data: savedRecord
      }, 201, request, envConfig);
    }

    // ----------------------------------------------------
    // GET /api/yeu-cau
    // ----------------------------------------------------
    if (method === 'GET' && pathname === '/api/yeu-cau') {
      const limit = Math.min(parseInt(url.searchParams.get('limit')) || 20, 100);
      const page = Math.max(parseInt(url.searchParams.get('page')) || 1, 1);
      const records = await supabaseApi.select('yeu_cau', { limit, page }, envConfig);

      return jsonResponse({
        success: true,
        count: records.length,
        page,
        limit,
        data: records
      }, 200, request, envConfig);
    }

    // ----------------------------------------------------
    // GET /api/users
    // ----------------------------------------------------
    if (method === 'GET' && pathname === '/api/users') {
      try {
        const records = await supabaseApi.select('umc_users', { limit: 500, order: 'msnv.asc' }, envConfig);
        const safeRecords = (records || []).map(sanitizeUser);
        return jsonResponse({ success: true, count: safeRecords.length, data: safeRecords }, 200, request, envConfig);
      } catch (error) {
        return jsonResponse({
          success: false,
          message: 'Không thể truy vấn bảng umc_users: ' + error.message,
          data: []
        }, 500, request, envConfig);
      }
    }

    // ----------------------------------------------------
    // POST /api/users/sync
    // ----------------------------------------------------
    if (method === 'POST' && pathname === '/api/users/sync') {
      const auth = await authenticateToken(request, envConfig);
      if (auth.error) return auth.error;

      if (!['admin', 'director'].includes(auth.user.role)) {
        return jsonResponse({
          success: false,
          message: 'Từ chối quyền truy cập: Bạn không có quyền quản trị để đồng bộ nhân sự!'
        }, 403, request, envConfig);
      }

      let userOrUsers;
      try { userOrUsers = await request.json(); } catch { userOrUsers = null; }
      if (!userOrUsers) {
        return jsonResponse({ success: false, message: 'Dữ liệu nhân sự không hợp lệ' }, 400, request, envConfig);
      }

      const records = Array.isArray(userOrUsers) ? userOrUsers : [userOrUsers];
      const cleanRecords = [];
      for (const u of records) {
        let userPwd = u.password || '123';
        if (!userPwd.includes(':')) {
          userPwd = await hashPassword(userPwd);
        }
        cleanRecords.push({
          id: u.id,
          user_name: u.userName || u.user_name || u.id,
          msnv: u.msnv || 'NV-' + Date.now().toString().slice(-4),
          password: userPwd,
          full_name: u.fullName || u.full_name || 'Nhân sự UMC',
          email: u.email || null,
          phone: u.phone || null,
          role: u.role || 'nurse',
          role_name: u.roleName || u.role_name || 'Điều dưỡng',
          department: u.department || 'Chấn thương chỉnh hình',
          specialty: u.specialty || 'lamsang',
          level: parseInt(u.level) || 1,
          level_name: u.levelName || u.level_name || 'Bậc 1',
          degree: u.degree || null,
          academic_title: u.academicTitle || u.academic_title || null,
          graduation_year: parseInt(u.graduationYear || u.graduation_year) || 2018,
          experience_years: parseInt(u.experienceYears || u.experience_years) || 5,
          gender: u.gender || 'Nữ',
          dob: u.dob || null,
          last_skill_exam_score: parseInt(u.lastSkillExamScore || u.last_skill_exam_score) || 90,
          nckh: u.nckh || null,
          manager_name: u.managerName || u.manager_name || null,
          manager_id: u.managerId || u.manager_id || null,
          approval_level: parseInt(u.approvalLevel || u.approval_level) || 0,
          avatar: u.avatar || null,
          updated_at: new Date().toISOString()
        });
      }

      const result = await supabaseApi.upsert('umc_users', cleanRecords, 'id', envConfig);
      const safeResult = Array.isArray(result) ? result.map(sanitizeUser) : result;
      return jsonResponse({
        success: true,
        message: `Đã đồng bộ an toàn ${cleanRecords.length} nhân sự lên Supabase Cloud!`,
        data: safeResult
      }, 200, request, envConfig);
    }

    // ----------------------------------------------------
    // GET /api/submissions
    // ----------------------------------------------------
    if (method === 'GET' && pathname === '/api/submissions') {
      const userId = url.searchParams.get('userId');
      const department = url.searchParams.get('department');
      const status = url.searchParams.get('status');
      const year = url.searchParams.get('year');

      let queryParams = [];
      if (userId) queryParams.push(`user_id=eq.${encodeURIComponent(userId)}`);
      if (department) queryParams.push(`department=eq.${encodeURIComponent(department)}`);
      if (status) queryParams.push(`status=eq.${encodeURIComponent(status)}`);
      if (year) queryParams.push(`year=eq.${encodeURIComponent(year)}`);

      const records = await supabaseApi.select('umc_submissions', {
        limit: 500,
        order: 'updated_at.desc',
        queryParams: queryParams.join('&')
      }, envConfig);

      return jsonResponse({ success: true, count: records.length, data: records }, 200, request, envConfig);
    }

    // ----------------------------------------------------
    // GET /api/submissions/years
    // ----------------------------------------------------
    if (method === 'GET' && pathname === '/api/submissions/years') {
      try {
        const records = await supabaseApi.select('umc_submissions', { limit: 500 }, envConfig);
        const yearsSet = new Set([2024, 2025, 2026, 2027]);
        (records || []).forEach(r => {
          if (r.year) yearsSet.add(parseInt(r.year));
        });
        const sortedYears = Array.from(yearsSet).sort((a, b) => b - a);
        return jsonResponse({ success: true, years: sortedYears }, 200, request, envConfig);
      } catch {
        return jsonResponse({ success: true, years: [2027, 2026, 2025, 2024] }, 200, request, envConfig);
      }
    }

    // ----------------------------------------------------
    // POST /api/submissions/:id/submit
    // ----------------------------------------------------
    if (method === 'POST' && pathname.startsWith('/api/submissions/') && pathname.endsWith('/submit')) {
      const auth = await authenticateToken(request, envConfig);
      if (auth.error) return auth.error;

      const subId = decodeURIComponent(pathname.replace('/api/submissions/', '').replace('/submit', ''));
      let body;
      try { body = await request.json(); } catch { body = {}; }
      const { comment, targetStatus } = body;

      const records = await supabaseApi.select('umc_submissions', {
        limit: 1,
        queryParams: `id=eq.${encodeURIComponent(subId)}`
      }, envConfig);

      if (!records || records.length === 0) {
        return jsonResponse({ success: false, message: 'Không tìm thấy hồ sơ để nộp' }, 404, request, envConfig);
      }

      const currentSub = records[0];
      const isOwnerOrAdmin = (auth.user.id === currentSub.user_id) || ['admin', 'director'].includes(auth.user.role);
      if (!isOwnerOrAdmin) {
        return jsonResponse({ success: false, message: 'Bạn không có quyền nộp hồ sơ đánh giá của nhân viên khác!' }, 403, request, envConfig);
      }

      const newStatus = targetStatus || 'submitted_l1';
      const now = new Date();
      const timeline = Array.isArray(currentSub.timeline) ? currentSub.timeline : [];
      const safeActor = auth.user.fullName || auth.user.userName || currentSub.full_name || 'Điều dưỡng viên';

      timeline.push({
        step: 'Nộp Hồ Sơ Đánh Giá',
        actor: safeActor,
        date: now.toLocaleString('vi-VN'),
        timestamp: now.toISOString(),
        comment: comment || `Hoàn tất tự đánh giá năm ${currentSub.year || 2026} và nộp hồ sơ lên cấp trên`,
        action: 'submit'
      });

      const updatePayload = {
        ...currentSub,
        status: newStatus,
        timeline,
        updated_at: now.toISOString()
      };

      const result = await supabaseApi.upsert('umc_submissions', updatePayload, 'id', envConfig);
      return jsonResponse({
        success: true,
        message: `Đã nộp thành công hồ sơ ${subId} (Trạng thái mới: ${newStatus})`,
        data: result
      }, 200, request, envConfig);
    }

    // ----------------------------------------------------
    // POST /api/submissions/:id/approve
    // ----------------------------------------------------
    if (method === 'POST' && pathname.startsWith('/api/submissions/') && pathname.endsWith('/approve')) {
      const auth = await authenticateToken(request, envConfig);
      if (auth.error) return auth.error;

      const subId = decodeURIComponent(pathname.replace('/api/submissions/', '').replace('/approve', ''));
      let body;
      try { body = await request.json(); } catch { body = {}; }
      const { level = 1, comment } = body;
      const user = auth.user;
      const numLevel = parseInt(level);

      if (numLevel === 1) {
        if (!['head_nurse', 'deputy_head_nurse', 'admin', 'director'].includes(user.role)) {
          return jsonResponse({
            success: false,
            message: 'Từ chối quyền truy cập: Chỉ Điều Dưỡng Trưởng hoặc Ban Lãnh Đạo mới có quyền phê duyệt Cấp 1!'
          }, 403, request, envConfig);
        }
      } else if (numLevel === 2) {
        if (!['nurse_board', 'chief_nurse', 'admin', 'director'].includes(user.role)) {
          return jsonResponse({
            success: false,
            message: 'Từ chối quyền truy cập: Chỉ Trưởng Ban Điều Dưỡng hoặc Ban Lãnh Đạo mới có quyền phê duyệt Cấp 2!'
          }, 403, request, envConfig);
        }
      } else if (numLevel === 3) {
        if (!['director', 'admin'].includes(user.role)) {
          return jsonResponse({
            success: false,
            message: 'Từ chối quyền truy cập: Chỉ Ban Giám Đốc mới có quyền phê duyệt Cấp 3!'
          }, 403, request, envConfig);
        }
      } else {
        return jsonResponse({ success: false, message: 'Cấp phê duyệt không hợp lệ (phải từ 1 đến 3)!' }, 400, request, envConfig);
      }

      const records = await supabaseApi.select('umc_submissions', {
        limit: 1,
        queryParams: `id=eq.${encodeURIComponent(subId)}`
      }, envConfig);

      if (!records || records.length === 0) {
        return jsonResponse({ success: false, message: 'Không tìm thấy hồ sơ để duyệt' }, 404, request, envConfig);
      }

      const currentSub = records[0];
      const now = new Date();
      const timeline = Array.isArray(currentSub.timeline) ? currentSub.timeline : [];
      const safeApproverName = user.fullName || user.userName || `Cán bộ thẩm định Cấp ${numLevel}`;
      let nextStatus = 'approved';

      if (numLevel === 1) {
        nextStatus = currentSub.department === 'Ban điều dưỡng' ? 'submitted_l3' : 'submitted_l2';
        currentSub.l1_approved_by = safeApproverName;
        currentSub.l1_approved_at = now.toISOString();
      } else if (numLevel === 2) {
        nextStatus = 'submitted_l3';
        currentSub.l2_approved_by = safeApproverName;
        currentSub.l2_approved_at = now.toISOString();
      } else if (numLevel === 3) {
        nextStatus = 'approved';
        currentSub.l3_approved_by = safeApproverName;
        currentSub.l3_approved_at = now.toISOString();
      }

      timeline.push({
        step: `Phê Duyệt Cấp ${numLevel}`,
        actor: safeApproverName,
        date: now.toLocaleString('vi-VN'),
        timestamp: now.toISOString(),
        comment: comment || `Phê duyệt đạt yêu cầu Cấp ${numLevel}`,
        action: 'approve'
      });

      const updatePayload = {
        ...currentSub,
        status: nextStatus,
        timeline,
        updated_at: now.toISOString()
      };

      const result = await supabaseApi.upsert('umc_submissions', updatePayload, 'id', envConfig);
      return jsonResponse({
        success: true,
        message: `Đã phê duyệt Cấp ${numLevel} thành công cho hồ sơ ${subId}!`,
        data: result
      }, 200, request, envConfig);
    }

    // ----------------------------------------------------
    // POST /api/submissions/:id/return
    // ----------------------------------------------------
    if (method === 'POST' && pathname.startsWith('/api/submissions/') && pathname.endsWith('/return')) {
      const auth = await authenticateToken(request, envConfig);
      if (auth.error) return auth.error;

      const subId = decodeURIComponent(pathname.replace('/api/submissions/', '').replace('/return', ''));
      let body;
      try { body = await request.json(); } catch { body = {}; }
      const { comment } = body;
      const user = auth.user;

      if (!['head_nurse', 'deputy_head_nurse', 'nurse_board', 'chief_nurse', 'director', 'admin'].includes(user.role)) {
        return jsonResponse({
          success: false,
          message: 'Từ chối quyền truy cập: Bạn không có thẩm quyền trả hồ sơ yêu cầu bổ sung!'
        }, 403, request, envConfig);
      }

      const records = await supabaseApi.select('umc_submissions', {
        limit: 1,
        queryParams: `id=eq.${encodeURIComponent(subId)}`
      }, envConfig);

      if (!records || records.length === 0) {
        return jsonResponse({ success: false, message: 'Không tìm thấy hồ sơ để trả về' }, 404, request, envConfig);
      }

      const currentSub = records[0];
      const now = new Date();
      const timeline = Array.isArray(currentSub.timeline) ? currentSub.timeline : [];
      const safeActor = `${user.fullName || user.userName} (${user.roleName || user.role})`;

      timeline.push({
        step: 'Trả Về Yêu Cầu Bổ Sung',
        actor: safeActor,
        date: now.toLocaleString('vi-VN'),
        timestamp: now.toISOString(),
        comment: comment || 'Hồ sơ chưa đạt, yêu cầu rà soát và bổ sung minh chứng',
        action: 'return'
      });

      const updatePayload = {
        ...currentSub,
        status: 'returned',
        timeline,
        updated_at: now.toISOString()
      };

      const result = await supabaseApi.upsert('umc_submissions', updatePayload, 'id', envConfig);
      return jsonResponse({
        success: true,
        message: `Đã trả về hồ sơ ${subId} kèm lý do bổ sung thành công!`,
        data: result
      }, 200, request, envConfig);
    }

    // ----------------------------------------------------
    // GET /api/submissions/:id
    // ----------------------------------------------------
    if (method === 'GET' && pathname.startsWith('/api/submissions/')) {
      const subId = decodeURIComponent(pathname.replace('/api/submissions/', ''));
      const records = await supabaseApi.select('umc_submissions', {
        limit: 1,
        queryParams: `id=eq.${encodeURIComponent(subId)}`
      }, envConfig);

      if (records && records.length > 0) {
        return jsonResponse({ success: true, data: records[0] }, 200, request, envConfig);
      } else {
        return jsonResponse({ success: false, message: 'Không tìm thấy hồ sơ ' + subId }, 404, request, envConfig);
      }
    }

    // ----------------------------------------------------
    // PUT /api/submissions/:id
    // ----------------------------------------------------
    if (method === 'PUT' && pathname.startsWith('/api/submissions/')) {
      const auth = await authenticateToken(request, envConfig);
      if (auth.error) return auth.error;

      const subId = decodeURIComponent(pathname.replace('/api/submissions/', ''));
      let sub;
      try { sub = await request.json(); } catch { sub = {}; }
      const subUserId = sub ? (sub.userId || sub.user_id) : null;

      if (!sub || !subId) {
        return jsonResponse({ success: false, message: 'Dữ liệu hồ sơ đánh giá không hợp lệ' }, 400, request, envConfig);
      }

      const timelineData = Array.isArray(sub.timeline) ? sub.timeline : (Array.isArray(sub.history) ? sub.history : []);
      const critEvs = (sub.criterionEvidences && typeof sub.criterionEvidences === 'object' && Object.keys(sub.criterionEvidences).length > 0) ? sub.criterionEvidences : null;
      const legEvs = (sub.evidences && typeof sub.evidences === 'object' && Object.keys(sub.evidences).length > 0) ? sub.evidences : null;
      const evidencesData = critEvs || legEvs || sub.criterionEvidences || sub.evidences || {};

      const payload = {
        id: subId,
        user_id: subUserId,
        full_name: sub.fullName || sub.full_name || 'Nhân sự UMC',
        msnv: sub.msnv || 'NV-000',
        department: sub.department || 'Chấn thương chỉnh hình',
        specialty: sub.specialty || 'lamsang',
        year: parseInt(sub.year) || 2026,
        status: sub.status || 'draft',
        total_score: parseInt(sub.totalScore || sub.total_score) || 0,
        evaluated_tier: parseInt(sub.evaluatedTier || sub.evaluated_tier) || 1,
        target_tier: parseInt(sub.targetTier || sub.target_tier) || 2,
        scores: sub.scores || {},
        domain_scores: sub.domainScores || sub.domain_scores || {},
        evidences: evidencesData,
        timeline: timelineData,
        l1_approved_by: sub.l1ApprovedBy || sub.l1_approved_by || null,
        l1_approved_at: sub.l1ApprovedAt || sub.l1_approved_at || null,
        l2_approved_by: sub.l2ApprovedBy || sub.l2_approved_by || null,
        l2_approved_at: sub.l2ApprovedAt || sub.l2_approved_at || null,
        l3_approved_by: sub.l3ApprovedBy || sub.l3_approved_by || null,
        l3_approved_at: sub.l3ApprovedAt || sub.l3_approved_at || null,
        l4_approved_by: sub.l4ApprovedBy || sub.l4_approved_by || null,
        l4_approved_at: sub.l4ApprovedAt || sub.l4_approved_at || null,
        updated_at: new Date().toISOString()
      };

      const result = await supabaseApi.upsert('umc_submissions', payload, 'id', envConfig);
      return jsonResponse({
        success: true,
        message: `Đã cập nhật hồ sơ đánh giá "${payload.id}" lên hệ thống thành công!`,
        data: result
      }, 200, request, envConfig);
    }

    // ----------------------------------------------------
    // POST /api/submissions
    // ----------------------------------------------------
    if (method === 'POST' && pathname === '/api/submissions') {
      const auth = await authenticateToken(request, envConfig);
      if (auth.error) return auth.error;

      let sub;
      try { sub = await request.json(); } catch { sub = {}; }
      const subUserId = sub ? (sub.userId || sub.user_id) : null;
      if (!sub || !sub.id || !subUserId) {
        return jsonResponse({ success: false, message: 'Dữ liệu hồ sơ đánh giá không hợp lệ (thiếu id hoặc userId)' }, 400, request, envConfig);
      }

      const canEdit = (auth.user.id === subUserId) || ['head_nurse', 'deputy_head_nurse', 'nurse_board', 'chief_nurse', 'director', 'admin'].includes(auth.user.role);
      if (!canEdit) {
        return jsonResponse({ success: false, message: 'Bạn không có quyền chỉnh sửa hồ sơ đánh giá của người khác!' }, 403, request, envConfig);
      }

      const timelineData = Array.isArray(sub.timeline) ? sub.timeline : (Array.isArray(sub.history) ? sub.history : []);
      const critEvs = (sub.criterionEvidences && typeof sub.criterionEvidences === 'object' && Object.keys(sub.criterionEvidences).length > 0) ? sub.criterionEvidences : null;
      const legEvs = (sub.evidences && typeof sub.evidences === 'object' && Object.keys(sub.evidences).length > 0) ? sub.evidences : null;
      const evidencesData = critEvs || legEvs || sub.criterionEvidences || sub.evidences || {};

      const payload = {
        id: sub.id,
        user_id: subUserId,
        full_name: sub.fullName || sub.full_name || 'Nhân sự UMC',
        msnv: sub.msnv || 'NV-000',
        department: sub.department || 'Chấn thương chỉnh hình',
        specialty: sub.specialty || 'lamsang',
        year: parseInt(sub.year) || 2026,
        status: sub.status || 'draft',
        total_score: parseInt(sub.totalScore || sub.total_score) || 0,
        evaluated_tier: parseInt(sub.evaluatedTier || sub.evaluated_tier) || 1,
        target_tier: parseInt(sub.targetTier || sub.target_tier) || 2,
        scores: sub.scores || {},
        domain_scores: sub.domainScores || sub.domain_scores || {},
        evidences: evidencesData,
        timeline: timelineData,
        l1_approved_by: sub.l1ApprovedBy || sub.l1_approved_by || null,
        l1_approved_at: sub.l1ApprovedAt || sub.l1_approved_at || null,
        l2_approved_by: sub.l2ApprovedBy || sub.l2_approved_by || null,
        l2_approved_at: sub.l2ApprovedAt || sub.l2_approved_at || null,
        l3_approved_by: sub.l3ApprovedBy || sub.l3_approved_by || null,
        l3_approved_at: sub.l3ApprovedAt || sub.l3_approved_at || null,
        updated_at: new Date().toISOString()
      };

      const result = await supabaseApi.upsert('umc_submissions', payload, 'id', envConfig);
      return jsonResponse({
        success: true,
        message: `Đã lưu hồ sơ đánh giá "${payload.id}" (Năm ${payload.year}) lên hệ thống thành công!`,
        data: result
      }, 200, request, envConfig);
    }

    // ----------------------------------------------------
    // Fallback 404 cho moi endpoint /api khong ton tai
    // ----------------------------------------------------
    return jsonResponse({
      success: false,
      message: 'Không tìm thấy API endpoint: ' + method + ' ' + pathname
    }, 404, request, envConfig);

  } catch (error) {
    console.error('Lỗi xử lý API Cloudflare Worker:', error);
    return jsonResponse({
      success: false,
      message: 'Lỗi máy chủ Cloudflare Worker: ' + error.message
    }, 500, request, envConfig);
  }
}

// 9. Standard Cloudflare Worker ES Module Export
export default {
  async fetch(request, env, ctx) {
    const envConfig = getEnvConfig(env);
    const url = new URL(request.url);
    const pathname = url.pathname;
    const method = request.method.toUpperCase();

    // 1. CORS Preflight
    if (method === 'OPTIONS') {
      return handleOptions(request, envConfig);
    }

    // 2. Chuyen tiep yeu cau /api/*
    if (pathname.startsWith('/api/')) {
      return handleApiRequest(request, envConfig);
    }

    // 3. Fallback cho Cloudflare Pages (Static Assets: HTML, JS, CSS, Images, Docs)
    if (env && env.ASSETS && typeof env.ASSETS.fetch === 'function') {
      return env.ASSETS.fetch(request);
    }

    // 4. Standalone Worker Welcome
    return jsonResponse({
      hospital: 'BỆNH VIỆN ĐẠI HỌC Y DƯỢC TP. HỒ CHÍ MINH',
      system: 'HỆ THỐNG ĐÁNH GIÁ NĂNG LỰC ĐIỀU DƯỠNG & KỸ THUẬT VIÊN (UMC-NLDD)',
      platform: 'Cloudflare Worker Edge Runtime',
      status: 'online',
      time: new Date().toISOString(),
      endpoints: [
        'POST /api/auth/login',
        'POST /api/auth/forgot-password',
        'POST /api/auth/reset-password',
        'GET /api/auth/me',
        'GET /api/health',
        'GET /api/status',
        'GET /api/users',
        'POST /api/users/sync',
        'GET /api/submissions',
        'GET /api/submissions/years',
        'GET /api/submissions/:id',
        'POST /api/submissions',
        'PUT /api/submissions/:id',
        'POST /api/submissions/:id/submit',
        'POST /api/submissions/:id/approve',
        'POST /api/submissions/:id/return',
        'GET /api/yeu-cau',
        'POST /api/yeu-cau'
      ]
    }, 200, request, envConfig);
  }
};
