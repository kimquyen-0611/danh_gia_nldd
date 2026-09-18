const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const db = require('./db');

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



const app = express();
const PORT = process.env.PORT || 5000;

// Cấu hình Middleware với kiểm soát CORS an toàn cho cả Vercel và Localhost
const configuredOrigin = process.env.ALLOWED_ORIGIN || '*';
app.use(cors({
  origin: function (origin, callback) {
    if (
      !origin ||
      configuredOrigin === '*' ||
      origin.includes('localhost') ||
      origin.includes('127.0.0.1') ||
      origin.includes('umc.edu.vn') ||
      origin.includes('vercel.app') ||
      (configuredOrigin !== '*' && origin === configuredOrigin)
    ) {
      callback(null, true);
    } else {
      callback(null, false);
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'X-Requested-With', 'apikey', 'Prefer']
}));

// ========================================================
// SECURITY HEADERS MIDDLEWARE (BỘ 5 CHÍNH SÁCH BẢO MẬT CHUẨN)
// ========================================================
app.use((req, res, next) => {
  // 1. Content-Security-Policy (Chính sách bảo mật nội dung)
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.tailwindcss.com https://cdn.jsdelivr.net; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com data:; img-src 'self' data: blob: https://images.unsplash.com https://*.supabase.co https://*.supabase.in; connect-src 'self' https://*.supabase.co https://*.supabase.in https://danh-gia-nldd-umc.vercel.app http://localhost:* http://127.0.0.1:*; frame-ancestors 'none'; object-src 'none'; base-uri 'self';"
  );
  // 2. Tùy chọn khung (X-Frame-Options: Chống Clickjacking)
  res.setHeader('X-Frame-Options', 'DENY');
  // 3. Tùy chọn loại nội dung (X-Content-Type-Options: Chống MIME Sniffing)
  res.setHeader('X-Content-Type-Options', 'nosniff');
  // 4. Chính sách giới thiệu (Referrer-Policy: Bảo vệ URL và tham số nhạy cảm)
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  // 5. Chính sách quyền hạn (Permissions-Policy: Vô hiệu hóa quyền truy cập phần cứng nhạy cảm)
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), payment=(), usb=(), screen-wake-lock=(), interest-cohort=()');
  // 6. Bổ sung: HSTS & XSS Protection
  res.setHeader('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  next();
});

app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));

// ========================================================
// EMAIL DISPATCHER MODULE (GỬI EMAIL XÁC THỰC OTP QUA SMTP)
// ========================================================
let nodemailer = null;
try {
  nodemailer = require('nodemailer');
} catch (e) {
  console.warn('Gói nodemailer chưa sẵn sàng:', e.message);
}

function createMailTransporter() {
  if (nodemailer && process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });
  }
  return null;
}

async function sendOtpEmail({ email, fullName, otp }) {
  const transporter = createMailTransporter();
  const mailSubject = `[UMC-NLDD] Mã xác thực OTP khôi phục mật khẩu tài khoản`;
  const mailHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden;">
      <div style="background: linear-gradient(135deg, #004b87, #002d5a); color: #ffffff; padding: 24px; text-align: center;">
        <h2 style="margin: 0; font-size: 20px;">BỆNH VIỆN ĐẠI HỌC Y DƯỢC TP. HỒ CHÍ MINH</h2>
        <p style="margin: 4px 0 0; font-size: 13px; color: #93c5fd;">HỆ THỐNG ĐÁNH GIÁ NĂNG LỰC ĐIỀU DƯỠNG & KỸ THUẬT VIÊN</p>
      </div>
      <div style="padding: 24px; color: #1e293b; line-height: 1.6;">
        <p>Kính gửi Đồng nghiệp <strong>${fullName}</strong>,</p>
        <p>Bạn vừa yêu cầu khôi phục mật khẩu đăng nhập trên Hệ thống Đánh Giá Năng Lực Điều Dưỡng UMC. Dưới đây là mã xác thực <strong>OTP</strong> bảo mật của bạn:</p>
        <div style="text-align: center; margin: 24px 0;">
          <div style="display: inline-block; background-color: #f0fdf4; border: 2px dashed #16a34a; border-radius: 12px; padding: 16px 32px;">
            <span style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #15803d; font-family: monospace;">${otp}</span>
          </div>
          <p style="margin: 8px 0 0; font-size: 12px; color: #64748b;">(Mã xác thực có hiệu lực trong vòng <strong>15 phút</strong>)</p>
        </div>
        <div style="background-color: #fffbeb; border-left: 4px solid #f59e0b; padding: 12px 16px; border-radius: 4px; font-size: 12px; color: #92400e;">
          ⚠️ <strong>Lưu ý bảo mật:</strong> Tuyệt đối không chia sẻ mã này cho bất kỳ ai khác, kể cả nhân viên kỹ thuật. Nếu bạn không thực hiện yêu cầu này, vui lòng bỏ qua email hoặc liên hệ ngay Ban Điều Dưỡng UMC.
        </div>
        <p style="margin-top: 24px; font-size: 12px; color: #64748b;">Trân trọng,<br><strong>Ban Điều Dưỡng - Bệnh Viện Đại Học Y Dược TP.HCM</strong></p>
      </div>
    </div>
  `;

  if (transporter) {
    try {
      await transporter.sendMail({
        from: process.env.SMTP_FROM || `"Ban Điều Dưỡng UMC" <${process.env.SMTP_USER}>`,
        to: email,
        subject: mailSubject,
        html: mailHtml
      });
      console.log(`[EMAIL-SENDER] ✅ Đã gửi email chứa OTP thành công tới hộp thư: ${email}`);
      return { sent: true };
    } catch (e) {
      console.error(`[EMAIL-SENDER] ❌ Lỗi gửi email qua SMTP tới ${email}:`, e.message);
      return { sent: false, error: e.message };
    }
  } else {
    console.log(`[EMAIL-SENDER] ℹ️ Đã phát hành mã OTP [${otp}] gửi tới email UMC: ${fullName} <${email}>`);
    return { sent: false, simulated: true };
  }
}

// ========================================================
// SECURITY & AUTHENTICATION MODULE (BẢO MẬT & XÁC THỰC)
// ========================================================
const crypto = require('crypto');
const JWT_SECRET = process.env.JWT_SECRET || process.env.SUPABASE_SECRET_KEY || 'umc-nursing-competency-auth-secret-key-2026';

// Băm mật khẩu bằng PBKDF2 với muối ngẫu nhiên (Salt)
function hashPassword(password, salt = null) {
  if (!salt) {
    salt = crypto.randomBytes(16).toString('hex');
  }
  const hash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
  return `${salt}:${hash}`;
}

// So khớp mật khẩu: hỗ trợ cả hash ($salt:hash) và plain-text (cho tài khoản mẫu chuyển giao)
function verifyPassword(inputPassword, storedPassword) {
  if (!storedPassword || !inputPassword) return false;
  if (storedPassword.includes(':')) {
    const [salt, originalHash] = storedPassword.split(':');
    const inputHash = crypto.pbkdf2Sync(inputPassword, salt, 10000, 64, 'sha512').toString('hex');
    try {
      return crypto.timingSafeEqual(Buffer.from(inputHash, 'hex'), Buffer.from(originalHash, 'hex'));
    } catch {
      return false;
    }
  }
  // So khớp văn bản nếu chưa được băm (legacy fallback)
  return inputPassword === storedPassword;
}

// Sinh mã Token HMAC-SHA256 chuẩn (hạn dùng 8 tiếng)
function generateToken(payload, expiresInHours = 8) {
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
  const exp = Math.floor(Date.now() / 1000) + (expiresInHours * 3600);
  const body = Buffer.from(JSON.stringify({ ...payload, exp })).toString('base64url');
  const signature = crypto.createHmac('sha256', JWT_SECRET).update(`${header}.${body}`).digest('base64url');
  return `${header}.${body}.${signature}`;
}

// Kiểm tra tính hợp lệ của Token
function verifyToken(token) {
  if (!token || typeof token !== 'string') return null;
  const parts = token.split('.');
  if (parts.length !== 3) return null;
  const [header, body, signature] = parts;
  const expectedSig = crypto.createHmac('sha256', JWT_SECRET).update(`${header}.${body}`).digest('base64url');
  if (signature !== expectedSig) return null;
  try {
    const payload = JSON.parse(Buffer.from(body, 'base64url').toString('utf8'));
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
      return null; // Token hết hạn
    }
    return payload;
  } catch {
    return null;
  }
}

// Middleware xác thực Token cho các API được bảo vệ
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.substring(7) : null;
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Yêu cầu xác thực: Vui lòng đăng nhập để thực hiện thao tác này!'
    });
  }
  const decoded = verifyToken(token);
  if (!decoded) {
    return res.status(403).json({
      success: false,
      message: 'Phiên đăng nhập đã hết hạn hoặc không hợp lệ. Vui lòng đăng nhập lại!'
    });
  }
  req.user = decoded;
  next();
}

// Hàm loại bỏ trường nhạy cảm (password) và chuẩn hóa đầy đủ trường thông tin (hỗ trợ cả camelCase và snake_case)
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

// ========================================================
// 0. POST /api/auth/login: Đăng nhập an toàn & cấp Token
// ========================================================
app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || typeof username !== 'string' || !password || typeof password !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng cung cấp đầy đủ tên đăng nhập và mật khẩu!'
      });
    }

    const uClean = username.toLowerCase().trim();
    let records = [];
    try {
      records = await db.supabaseApi.select('umc_users', { limit: 500 });
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
      return res.status(401).json({
        success: false,
        errorField: 'username',
        message: `Sai tên đăng nhập: Tên đăng nhập hoặc MSNV "${username}" không tồn tại trong hệ thống UMC!`
      });
    }

    // So khớp mật khẩu bắt buộc
    const storedPwd = user.password || '123';
    const isMatch = verifyPassword(password, storedPwd);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        errorField: 'password',
        message: 'Sai mật khẩu: Mật khẩu bạn nhập không chính xác. Vui lòng kiểm tra lại!'
      });
    }

    // Tự động nâng cấp mật khẩu sang dạng mã hóa PBKDF2 nếu đang ở dạng thô
    if (!storedPwd.includes(':')) {
      try {
        const hashed = hashPassword(password);
        await db.supabaseApi.upsert('umc_users', [{ ...user, password: hashed }], 'id');
      } catch (err) {
        console.warn('Không thể tự động băm mật khẩu cho user:', err.message);
      }
    }

    const safeUser = sanitizeUser(user);
    const token = generateToken({
      id: user.id,
      userName: user.user_name || user.id,
      role: user.role,
      roleName: user.role_name,
      department: user.department,
      fullName: user.full_name,
      approvalLevel: user.approval_level || 0
    }, 8);

    return res.json({
      success: true,
      message: `Đăng nhập thành công! Xin chào ${user.full_name} (${user.role_name || user.role})`,
      token,
      user: safeUser
    });
  } catch (error) {
    console.error('Lỗi API /api/auth/login:', error);
    return res.status(500).json({
      success: false,
      message: 'Lỗi máy chủ khi đăng nhập: ' + error.message
    });
  }
});

// Cache tạm thời lưu mã OTP khôi phục mật khẩu (15 phút)
const resetOtpCache = new Map();

// ========================================================
// 0b. POST /api/auth/forgot-password: Quên mật khẩu & gửi mã về email UMC
// ========================================================
app.post('/api/auth/forgot-password', async (req, res) => {
  try {
    const { identifier } = req.body;
    if (!identifier || typeof identifier !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng cung cấp Tên đăng nhập, MSNV hoặc Email UMC!'
      });
    }

    const uClean = identifier.toLowerCase().trim();
    let records = [];
    try {
      records = await db.supabaseApi.select('umc_users', { limit: 500 });
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
      return res.status(404).json({
        success: false,
        message: `Không tìm thấy tài khoản cán bộ nhân viên nào khớp với "${identifier}" trong cơ sở dữ liệu UMC!`
      });
    }

    const email = user.email || `${user.user_name || user.msnv || 'user'}@umc.edu.vn`;
    
    // Tạo mã OTP 6 chữ số ngẫu nhiên
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 15 * 60 * 1000; // 15 phút
    
    const sessionData = { otp, expiresAt, userId: user.id, email, fullName: user.full_name, msnv: user.msnv };
    resetOtpCache.set(uClean, sessionData);
    if (user.id) resetOtpCache.set(user.id.toLowerCase(), sessionData);
    if (user.user_name) resetOtpCache.set(user.user_name.toLowerCase(), sessionData);
    if (user.msnv) resetOtpCache.set(user.msnv.toLowerCase(), sessionData);
    if (email) resetOtpCache.set(email.toLowerCase(), sessionData);

    // Che bớt ký tự email để hiển thị an toàn
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

    // Gửi email thật qua SMTP hoặc ghi log máy chủ an toàn (OTP tuyệt đối không gửi về client)
    await sendOtpEmail({ email, fullName: user.full_name, otp });

    return res.json({
      success: true,
      message: `Hệ thống đã gửi mã xác thực khôi phục mật khẩu đến email UMC của bạn: ${maskedEmail}. Vui lòng kiểm tra hộp thư!`,
      maskedEmail,
      fullName: user.full_name,
      msnv: user.msnv,
      userName: user.user_name || user.id,
      expiresInMinutes: 15
    });
  } catch (error) {
    console.error('Lỗi API /api/auth/forgot-password:', error);
    return res.status(500).json({
      success: false,
      message: 'Lỗi máy chủ khi xử lý yêu cầu quên mật khẩu: ' + error.message
    });
  }
});

// ========================================================
// 0c. POST /api/auth/reset-password: Xác nhận OTP & Đổi mật khẩu mới
// ========================================================
app.post('/api/auth/reset-password', async (req, res) => {
  try {
    const { identifier, otp, newPassword } = req.body;
    if (!identifier || !otp || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng cung cấp đầy đủ thông tin: định danh tài khoản, mã OTP và mật khẩu mới!'
      });
    }

    if (newPassword.length < 3) {
      return res.status(400).json({
        success: false,
        message: 'Mật khẩu mới phải có tối thiểu 3 ký tự!'
      });
    }

    const uClean = identifier.toLowerCase().trim();
    const cached = resetOtpCache.get(uClean);

    if (!cached) {
      return res.status(400).json({
        success: false,
        message: 'Mã xác thực không tồn tại hoặc phiên đã hết hạn. Vui lòng yêu cầu gửi lại mã!'
      });
    }

    if (Date.now() > cached.expiresAt) {
      resetOtpCache.delete(uClean);
      return res.status(400).json({
        success: false,
        message: 'Mã xác thực OTP đã hết hạn (chỉ có hiệu lực trong 15 phút). Vui lòng gửi lại yêu cầu!'
      });
    }

    if (String(cached.otp).trim() !== String(otp).trim()) {
      return res.status(400).json({
        success: false,
        message: 'Mã xác thực OTP không chính xác. Vui lòng kiểm tra lại email UMC!'
      });
    }

    // Cập nhật mật khẩu mới (mã hóa an toàn) vào Supabase
    try {
      const hashed = hashPassword(newPassword);
      await db.supabaseApi.upsert('umc_users', [{ id: cached.userId, password: hashed }], 'id');
      console.log(`[AUTH-RESET] Đã cập nhật mật khẩu mới thành công cho user: ${cached.userId}`);
    } catch (e) {
      console.warn('Lỗi cập nhật mật khẩu mới lên Supabase:', e.message);
    }

    // Xóa cache OTP sau khi đã sử dụng
    resetOtpCache.delete(uClean);
    if (cached.userId) resetOtpCache.delete(cached.userId.toLowerCase());
    if (cached.email) resetOtpCache.delete(cached.email.toLowerCase());

    return res.json({
      success: true,
      message: 'Đặt lại mật khẩu thành công! Bạn có thể đăng nhập ngay với mật khẩu mới.'
    });
  } catch (error) {
    console.error('Lỗi API /api/auth/reset-password:', error);
    return res.status(500).json({
      success: false,
      message: 'Lỗi máy chủ khi đặt lại mật khẩu: ' + error.message
    });
  }
});

// Endpoint kiểm tra phiên hiện tại: GET /api/auth/me
app.get('/api/auth/me', authenticateToken, async (req, res) => {
  res.json({
    success: true,
    user: req.user
  });
});

// Endpoint kiểm tra trạng thái máy chủ
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'Backend API UMC - Supabase Bridge (Secured)',
    time: new Date().toISOString()
  });
});

// ========================================================
// 1. POST /api/yeu-cau: Nhận JSON, validate và lưu vào DB
// ========================================================
app.post('/api/yeu-cau', async (req, res) => {
  try {
    const { ho_ten, email, so_dien_thoai, noi_dung } = req.body;

    // Validate dữ liệu
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
      return res.status(400).json({
        success: false,
        message: 'Dữ liệu không hợp lệ',
        errors
      });
    }

    const payload = {
      ho_ten: ho_ten.trim(),
      email: email ? email.trim() : null,
      so_dien_thoai: so_dien_thoai ? so_dien_thoai.trim() : null,
      noi_dung: noi_dung.trim()
    };

    let savedRecord = null;

    // Thử lưu qua PostgreSQL Pool nếu sẵn sàng
    try {
      const sql = `
        INSERT INTO yeu_cau (ho_ten, email, so_dien_thoai, noi_dung)
        VALUES ($1, $2, $3, $4)
        RETURNING id, ho_ten, email, so_dien_thoai, noi_dung, trang_thai, created_at;
      `;
      const result = await db.query(sql, [payload.ho_ten, payload.email, payload.so_dien_thoai, payload.noi_dung]);
      savedRecord = result.rows[0];
    } catch {
      // Tự động dùng Supabase HTTPS Engine
      const inserted = await db.supabaseApi.insert('yeu_cau', payload);
      savedRecord = Array.isArray(inserted) ? inserted[0] : inserted;
    }

    return res.status(201).json({
      success: true,
      message: 'Lưu yêu cầu thành công!',
      data: savedRecord
    });
  } catch (error) {
    console.error('Lỗi khi thực hiện POST /api/yeu-cau:', error);
    return res.status(500).json({
      success: false,
      message: 'Lỗi máy chủ khi lưu dữ liệu. ' + error.message
    });
  }
});

// ========================================================
// 2. GET /api/yeu-cau: Lấy danh sách bản ghi mới nhất
// ========================================================
app.get('/api/yeu-cau', async (req, res) => {
  try {
    const limit = Math.min(parseInt(req.query.limit) || 20, 100);
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const offset = (page - 1) * limit;

    let records = [];

    try {
      const sql = `
        SELECT id, ho_ten, email, so_dien_thoai, noi_dung, trang_thai, created_at
        FROM yeu_cau
        ORDER BY created_at DESC
        LIMIT $1 OFFSET $2;
      `;
      const result = await db.query(sql, [limit, offset]);
      records = result.rows;
    } catch {
      // Tự động dùng Supabase HTTPS Engine
      records = await db.supabaseApi.select('yeu_cau', { limit, page });
    }

    return res.status(200).json({
      success: true,
      count: records.length,
      page,
      limit,
      data: records
    });
  } catch (error) {
    console.error('Lỗi khi thực hiện GET /api/yeu-cau:', error);
    return res.status(500).json({
      success: false,
      message: 'Lỗi máy chủ khi truy vấn dữ liệu. ' + error.message
    });
  }
});

// ========================================================
// 3. GET /api/status: Kiểm tra kết nối Supabase Cloud & DB
// ========================================================
app.get('/api/status', async (req, res) => {
  try {
    let supabaseConnected = false;
    let availableTables = [];
    try {
      const ping = await fetch(`${process.env.SUPABASE_URL}/rest/v1/`, {
        headers: {
          apikey: process.env.SUPABASE_SECRET_KEY,
          Authorization: `Bearer ${process.env.SUPABASE_SECRET_KEY}`
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

    res.json({
      success: true,
      status: 'online',
      service: 'Backend API UMC - Supabase Cloud Bridge',
      supabaseConnected,
      supabaseUrl: process.env.SUPABASE_URL,
      tables: availableTables,
      time: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ========================================================
// 4. GET & POST /api/users: Quản lý danh sách nhân sự UMC
// ========================================================
app.get('/api/users', async (req, res) => {
  try {
    const records = await db.supabaseApi.select('umc_users', { limit: 500, order: 'msnv.asc' });
    // BẢO MẬT: Xóa bỏ hoàn toàn trường password trước khi trả về client
    const safeRecords = (records || []).map(sanitizeUser);
    res.json({ success: true, count: safeRecords.length, data: safeRecords });
  } catch (error) {
    console.warn('Lỗi đọc bảng umc_users trên Supabase:', error.message);
    res.status(500).json({
      success: false,
      message: 'Không thể truy vấn bảng umc_users (có thể bảng chưa được tạo trên Supabase). ' + error.message,
      data: []
    });
  }
});

app.post('/api/users/sync', authenticateToken, async (req, res) => {
  try {
    // Kiểm soát phân quyền: Chỉ Quản trị viên (admin) hoặc Ban Giám Đốc (director) mới có quyền đồng bộ nhân sự
    if (req.user && !['admin', 'director'].includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Từ chối quyền truy cập: Bạn không có quyền quản trị để đồng bộ nhân sự!'
      });
    }

    const userOrUsers = req.body;
    if (!userOrUsers) {
      return res.status(400).json({ success: false, message: 'Dữ liệu nhân sự không hợp lệ' });
    }

    const records = Array.isArray(userOrUsers) ? userOrUsers : [userOrUsers];
    const cleanRecords = records.map(u => {
      // Bảo mật mật khẩu: Nếu là chuỗi mới chưa hash, tiến hành băm PBKDF2
      let userPwd = u.password || '123';
      if (!userPwd.includes(':')) {
        userPwd = hashPassword(userPwd);
      }
      return {
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
      };
    });

    const result = await db.supabaseApi.upsert('umc_users', cleanRecords, 'id');
    // Trả về dữ liệu an toàn đã lọc bỏ password
    const safeResult = Array.isArray(result) ? result.map(sanitizeUser) : result;
    res.json({ success: true, message: `Đã đồng bộ an toàn ${cleanRecords.length} nhân sự lên Supabase Cloud!`, data: safeResult });
  } catch (error) {
    console.error('Lỗi đồng bộ umc_users:', error);
    res.status(500).json({ success: false, message: 'Lỗi lưu nhân sự lên Supabase: ' + error.message });
  }
});

// ========================================================
// 5. GET & POST /api/submissions: Quản lý hồ sơ đánh giá & phê duyệt
// ========================================================
app.get('/api/submissions', async (req, res) => {
  try {
    const { userId, department, status, year } = req.query;
    let queryParams = [];
    if (userId) queryParams.push(`user_id=eq.${encodeURIComponent(userId)}`);
    if (department) queryParams.push(`department=eq.${encodeURIComponent(department)}`);
    if (status) queryParams.push(`status=eq.${encodeURIComponent(status)}`);
    if (year) queryParams.push(`year=eq.${encodeURIComponent(year)}`);

    const records = await db.supabaseApi.select('umc_submissions', {
      limit: 500,
      order: 'updated_at.desc',
      queryParams: queryParams.join('&')
    });

    res.json({ success: true, count: records.length, data: records });
  } catch (error) {
    console.warn('Lỗi đọc bảng umc_submissions trên Supabase:', error.message);
    res.status(500).json({
      success: false,
      message: 'Không thể truy vấn bảng umc_submissions (có thể bảng chưa được tạo trên Supabase). ' + error.message,
      data: []
    });
  }
});

// Lấy danh sách các năm đánh giá
app.get('/api/submissions/years', async (req, res) => {
  try {
    const records = await db.supabaseApi.select('umc_submissions', { limit: 500 });
    const yearsSet = new Set([2024, 2025, 2026, 2027]);
    (records || []).forEach(r => {
      if (r.year) yearsSet.add(parseInt(r.year));
    });
    const sortedYears = Array.from(yearsSet).sort((a, b) => b - a);
    res.json({ success: true, years: sortedYears });
  } catch (error) {
    res.json({ success: true, years: [2027, 2026, 2025, 2024] });
  }
});

// Lấy chi tiết một hồ sơ đánh giá
app.get('/api/submissions/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const records = await db.supabaseApi.select('umc_submissions', {
      limit: 1,
      queryParams: `id=eq.${encodeURIComponent(id)}`
    });
    if (records && records.length > 0) {
      res.json({ success: true, data: records[0] });
    } else {
      res.status(404).json({ success: false, message: 'Không tìm thấy hồ sơ ' + id });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Lưu / Cập nhật hồ sơ đánh giá (Được bảo vệ bởi JWT Token)
app.post('/api/submissions', authenticateToken, async (req, res) => {
  try {
    const sub = req.body;
    const subUserId = sub ? (sub.userId || sub.user_id) : null;
    if (!sub || !sub.id || !subUserId) {
      return res.status(400).json({ success: false, message: 'Dữ liệu hồ sơ đánh giá không hợp lệ (thiếu id hoặc userId)' });
    }

    // Kiểm tra quyền: Người dùng chỉ được sửa hồ sơ của mình, trừ khi là Quản lý hoặc Ban Lãnh Đạo
    const canEdit = (req.user.id === subUserId) || ['head_nurse', 'deputy_head_nurse', 'nurse_board', 'chief_nurse', 'director', 'admin'].includes(req.user.role);
    if (!canEdit) {
      return res.status(403).json({ success: false, message: 'Bạn không có quyền chỉnh sửa hồ sơ đánh giá của người khác!' });
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

    const result = await db.supabaseApi.upsert('umc_submissions', payload, 'id');
    res.json({
      success: true,
      message: `Đã lưu hồ sơ đánh giá "${payload.id}" (Năm ${payload.year}) lên hệ thống thành công!`,
      data: result
    });
  } catch (error) {
    console.error('Lỗi lưu umc_submissions:', error);
    res.status(500).json({ success: false, message: 'Lỗi lưu hồ sơ lên hệ thống: ' + error.message });
  }
});

// Cập nhật hồ sơ đánh giá theo ID (PUT /api/submissions/:id)
app.put('/api/submissions/:id', authenticateToken, async (req, res) => {
  try {
    const sub = req.body;
    const subUserId = sub ? (sub.userId || sub.user_id) : null;
    const subId = req.params.id || (sub ? sub.id : null);
    if (!sub || !subId) {
      return res.status(400).json({ success: false, message: 'Dữ liệu hồ sơ đánh giá không hợp lệ' });
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

    const result = await db.supabaseApi.upsert('umc_submissions', payload, 'id');
    res.json({
      success: true,
      message: `Đã cập nhật hồ sơ đánh giá "${payload.id}" lên hệ thống thành công!`,
      data: result
    });
  } catch (error) {
    console.error('Lỗi cập nhật umc_submissions:', error);
    res.status(500).json({ success: false, message: 'Lỗi cập nhật hồ sơ: ' + error.message });
  }
});

// Endpoint chuyên biệt: Nộp hồ sơ đánh giá (Submit dossier - Bảo vệ bằng Token)
app.post('/api/submissions/:id/submit', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { comment, targetStatus } = req.body || {};

    const records = await db.supabaseApi.select('umc_submissions', {
      limit: 1,
      queryParams: `id=eq.${encodeURIComponent(id)}`
    });

    if (!records || records.length === 0) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy hồ sơ để nộp' });
    }

    const currentSub = records[0];
    // Xác minh danh tính: Người nộp phải là chính chủ của hồ sơ hoặc Quản trị viên
    const isOwnerOrAdmin = (req.user.id === currentSub.user_id) || ['admin', 'director'].includes(req.user.role);
    if (!isOwnerOrAdmin) {
      return res.status(403).json({ success: false, message: 'Bạn không có quyền nộp hồ sơ đánh giá của nhân viên khác!' });
    }

    const newStatus = targetStatus || 'submitted_l1';
    const now = new Date();
    const timeline = Array.isArray(currentSub.timeline) ? currentSub.timeline : [];
    const safeActor = req.user.fullName || req.user.userName || currentSub.full_name || 'Điều dưỡng viên';

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

    const result = await db.supabaseApi.upsert('umc_submissions', updatePayload, 'id');
    res.json({
      success: true,
      message: `Đã nộp thành công hồ sơ ${id} (Trạng thái mới: ${newStatus})`,
      data: result
    });
  } catch (error) {
    console.error('Lỗi submit hồ sơ:', error);
    res.status(500).json({ success: false, message: 'Lỗi nộp hồ sơ: ' + error.message });
  }
});

// Endpoint chuyên biệt: Phê duyệt hồ sơ theo cấp (Approve dossier - Bảo vệ bằng Token & RBAC)
app.post('/api/submissions/:id/approve', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { level = 1, comment } = req.body || {};
    const user = req.user;
    const numLevel = parseInt(level);

    // Kiểm soát quyền phê duyệt theo vai trò chặt chẽ (RBAC)
    if (numLevel === 1) {
      if (!['head_nurse', 'deputy_head_nurse', 'admin', 'director'].includes(user.role)) {
        return res.status(403).json({
          success: false,
          message: 'Từ chối quyền truy cập: Chỉ Điều Dưỡng Trưởng hoặc Ban Lãnh Đạo mới có quyền phê duyệt Cấp 1!'
        });
      }
    } else if (numLevel === 2) {
      if (!['nurse_board', 'chief_nurse', 'admin', 'director'].includes(user.role)) {
        return res.status(403).json({
          success: false,
          message: 'Từ chối quyền truy cập: Chỉ Trưởng Ban Điều Dưỡng hoặc Ban Lãnh Đạo mới có quyền phê duyệt Cấp 2!'
        });
      }
    } else if (numLevel === 3) {
      if (!['director', 'admin'].includes(user.role)) {
        return res.status(403).json({
          success: false,
          message: 'Từ chối quyền truy cập: Chỉ Ban Giám Đốc mới có quyền phê duyệt Cấp 3!'
        });
      }
    } else {
      return res.status(400).json({ success: false, message: 'Cấp phê duyệt không hợp lệ (phải từ 1 đến 3)!' });
    }

    const records = await db.supabaseApi.select('umc_submissions', {
      limit: 1,
      queryParams: `id=eq.${encodeURIComponent(id)}`
    });

    if (!records || records.length === 0) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy hồ sơ để duyệt' });
    }

    const currentSub = records[0];
    const now = new Date();
    const timeline = Array.isArray(currentSub.timeline) ? currentSub.timeline : [];

    // Tên người duyệt được chứng thực từ Token hợp lệ
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

    const result = await db.supabaseApi.upsert('umc_submissions', updatePayload, 'id');
    res.json({
      success: true,
      message: `Đã phê duyệt Cấp ${numLevel} thành công cho hồ sơ ${id}!`,
      data: result
    });
  } catch (error) {
    console.error('Lỗi duyệt hồ sơ:', error);
    res.status(500).json({ success: false, message: 'Lỗi duyệt hồ sơ: ' + error.message });
  }
});

// Endpoint chuyên biệt: Trả hồ sơ yêu cầu bổ sung (Return dossier - Bảo vệ bằng Token & Quyền quản lý)
app.post('/api/submissions/:id/return', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { comment } = req.body || {};
    const user = req.user;

    // Kiểm tra quyền hạn: Chỉ các chức danh quản lý mới có quyền trả hồ sơ
    if (!['head_nurse', 'deputy_head_nurse', 'nurse_board', 'chief_nurse', 'director', 'admin'].includes(user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Từ chối quyền truy cập: Bạn không có thẩm quyền trả hồ sơ yêu cầu bổ sung!'
      });
    }

    const records = await db.supabaseApi.select('umc_submissions', {
      limit: 1,
      queryParams: `id=eq.${encodeURIComponent(id)}`
    });

    if (!records || records.length === 0) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy hồ sơ để trả về' });
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

    const result = await db.supabaseApi.upsert('umc_submissions', updatePayload, 'id');
    res.json({
      success: true,
      message: `Đã trả về hồ sơ ${id} kèm lý do bổ sung thành công!`,
      data: result
    });
  } catch (error) {
    console.error('Lỗi trả về hồ sơ:', error);
    res.status(500).json({ success: false, message: 'Lỗi trả về hồ sơ: ' + error.message });
  }
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`====================================================`);
    console.log(`🚀 Backend Server đang chạy tại: http://localhost:${PORT}`);
    console.log(`📡 API Status:      http://localhost:${PORT}/api/status`);
    console.log(`📡 API Users:       http://localhost:${PORT}/api/users`);
    console.log(`📡 API Submissions: http://localhost:${PORT}/api/submissions`);
    console.log(`📡 API Yêu Cầu:     http://localhost:${PORT}/api/yeu-cau`);
    console.log(`====================================================`);
  });
}

module.exports = app;
