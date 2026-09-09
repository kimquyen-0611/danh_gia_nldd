/**
 * Dữ liệu 5 Lĩnh vực, 25 Tiêu chuẩn, 66 Tiêu chí đánh giá Năng lực Điều dưỡng UMC
 * Bệnh viện Đại học Y Dược TP. Hồ Chí Minh
 */

const DOMAINS_DATA = [
  {
    id: "domain_1",
    code: "I",
    name: "Tiêu chuẩn Bằng cấp & Trải nghiệm nghề nghiệp",
    maxScore: 180,
    minScores: { 1: 80, 2: 90, 3: 100, 4: 120, 5: 140, 6: 150, 7: 180 },
    standards: [
      {
        id: "std_1",
        code: "TC 1",
        name: "Bằng cấp chuyên môn",
        criteria: [
          {
            id: 1,
            name: "Bằng tốt nghiệp Cao đẳng / Đại học",
            type: "single_choice",
            maxScore: 90,
            options: [
              { label: "Cao đẳng / Trung học ĐD từ trường khác", score: 15 },
              { label: "Cao đẳng / Trung học ĐD từ ĐH Quốc tế Hồng Bàng", score: 20 },
              { label: "Cao đẳng / Trung học ĐD từ ĐH Y khoa Phạm Ngọc Thạch", score: 25 },
              { label: "Cao đẳng / Trung học ĐD từ ĐHYD TP.HCM", score: 30 },
              { label: "ĐH Y Dược Huế, ĐHYD Cần Thơ, ĐH ĐD Nam Định, ĐH Nguyễn Tất Thành, ĐH khác", score: 50 },
              { label: "ĐH Quốc tế Hồng Bàng", score: 60 },
              { label: "ĐH Y Hà Nội, ĐH Y khoa Phạm Ngọc Thạch, ĐH Yersin", score: 70 },
              { label: "ĐH Quốc tế Miền Đông", score: 80 },
              { label: "Đại học Y Dược TP.HCM", score: 90 },
              { label: "ĐH Điều dưỡng từ Châu Âu (trừ Đông Âu), Mỹ, Canada, Úc, Nhật Bản, Hàn Quốc, Singapore...", score: 100 }
            ]
          },
          {
            id: 2,
            name: "Bằng sau đại học (Chuyên khoa 1 / Thạc sĩ / Tiến sĩ)",
            type: "single_choice",
            maxScore: 40,
            options: [
              { label: "Chưa có bằng sau đại học", score: 0 },
              { label: "Chuyên khoa 1 / Thạc sĩ Điều dưỡng", score: 25 },
              { label: "Tiến sĩ Điều dưỡng / Chuyên ngành liên quan", score: 40 }
            ]
          }
        ]
      },
      {
        id: "std_2",
        code: "TC 2",
        name: "Chứng nhận - Chứng chỉ chuyên môn",
        criteria: [
          {
            id: 3,
            name: "Chứng chỉ / Chứng nhận đào tạo trong nước ≥ 1 năm",
            type: "single_choice",
            maxScore: 5,
            options: [
              { label: "Chưa có", score: 0 },
              { label: "Có chứng nhận / chứng chỉ đào tạo trong nước ≥ 1 năm", score: 5 }
            ]
          },
          {
            id: 4,
            name: "Chứng chỉ / Chứng nhận đào tạo nước ngoài ≥ 6 tháng",
            type: "single_choice",
            maxScore: 10,
            options: [
              { label: "Chưa có", score: 0 },
              { label: "Có chứng nhận / chứng chỉ đào tạo nước ngoài ≥ 6 tháng", score: 10 }
            ]
          }
        ]
      },
      {
        id: "std_3",
        code: "TC 3",
        name: "Trình độ Ngoại ngữ",
        criteria: [
          {
            id: 5,
            name: "Chứng chỉ tiếng Anh (TOEIC, IELTS, TOEFL iBT hoặc tương đương)",
            type: "single_choice",
            maxScore: 15,
            options: [
              { label: "Chưa có chứng chỉ chuẩn hóa", score: 0 },
              { label: "Mức B1 (TOEIC 450; IELTS 4.5; TOEFL iBT 53)", score: 5 },
              { label: "Mức B2 (TOEIC 600; IELTS 5.5; TOEFL iBT 65)", score: 10 },
              { label: "Mức C1 (TOEIC 800; IELTS 6.5; TOEFL iBT 79 trở lên)", score: 15 }
            ]
          }
        ]
      },
      {
        id: "std_4",
        code: "TC 4",
        name: "Trình độ Tin học",
        criteria: [
          {
            id: 6,
            name: "Kỹ năng tin học văn phòng & phần mềm",
            type: "single_choice",
            maxScore: 10,
            options: [
              { label: "Chưa đạt chuẩn", score: 0 },
              { label: "Xử lý văn bản, bảng tính cơ bản (Chứng chỉ Tin học cơ bản)", score: 5 },
              { label: "Xử lý văn bản, bảng tính nâng cao; sử dụng thành thạo phần mềm trình chiếu", score: 10 }
            ]
          }
        ]
      },
      {
        id: "std_25",
        code: "TC 25",
        name: "Sự trải nghiệm nghề nghiệp (theo thâm niên và hạng bệnh viện)",
        criteria: [
          {
            id: 66,
            name: "Thời gian công tác lâm sàng tích lũy theo hạng bệnh viện",
            type: "single_choice",
            maxScore: 50,
            options: [
              { label: "Dưới 1 năm hoặc chưa đạt", score: 0 },
              { label: "≤ 5 năm tại BV hạng 2, 3", score: 10 },
              { label: "≤ 5 năm tại BV hạng đặc biệt, hạng 1", score: 25 },
              { label: "6 - 9 năm tại BV hạng 2", score: 15 },
              { label: "6 - 9 năm tại BV hạng đặc biệt, hạng 1", score: 35 },
              { label: "10 - 15 năm tại BV hạng 2", score: 20 },
              { label: "10 - 15 năm tại BV hạng đặc biệt, hạng 1", score: 45 },
              { label: "> 15 năm tại BV hạng 2", score: 25 },
              { label: "> 15 năm tại BV hạng đặc biệt, hạng 1 (như BV ĐHYD TP.HCM)", score: 50 }
            ]
          }
        ]
      }
    ]
  },
  {
    id: "domain_2",
    code: "II",
    name: "Năng lực Thực hành Chăm sóc Người bệnh",
    maxScore: 450,
    minScores: { 1: 100, 2: 180, 3: 240, 4: 340, 5: 400, 6: 420, 7: 450 },
    standards: [
      {
        id: "std_5",
        code: "TC 5",
        name: "Hành nghề theo pháp luật",
        criteria: [
          {
            id: 7,
            name: "Tuân thủ các quy định tại cơ sở làm việc (Có mặt đúng giờ, đồng phục, bảng tên, bảo vệ tài sản)",
            type: "level_5",
            maxScore: 5,
            levels: [
              { level: 1, score: 1, text: "4 lần vi phạm trong kỳ đánh giá" },
              { level: 2, score: 2, text: "3 lần vi phạm" },
              { level: 3, score: 3, text: "2 lần vi phạm" },
              { level: 4, score: 4, text: "1 lần vi phạm" },
              { level: 5, score: 5, text: "0 lần vi phạm (Tuân thủ nghiêm túc 100%)" }
            ]
          },
          {
            id: 8,
            name: "Tuân thủ các quy định hành nghề theo luật định liên quan y tế (Luật KCB, TT 31, TT 23, TT 51...)",
            type: "level_5",
            maxScore: 5,
            levels: [
              { level: 1, score: 1, text: "4 lần vi phạm" },
              { level: 2, score: 2, text: "3 lần vi phạm" },
              { level: 3, score: 3, text: "2 lần vi phạm" },
              { level: 4, score: 4, text: "1 lần vi phạm" },
              { level: 5, score: 5, text: "0 lần vi phạm (Thực hiện đúng luật 100%)" }
            ]
          },
          {
            id: 9,
            name: "Thực hiện tốt quy tắc ứng xử của tổ chức và luật định với đồng nghiệp và người bệnh",
            type: "level_5",
            maxScore: 5,
            levels: [
              { level: 1, score: 1, text: "Còn thụ động, có phản ánh nhỏ từ khách hàng/đồng nghiệp" },
              { level: 2, score: 2, text: "Chấp hành cơ bản nhưng cần nhắc nhở" },
              { level: 3, score: 3, text: "Phối hợp nhưng chưa chủ động; quan hệ tốt với đồng nghiệp, NB (3đ)" },
              { level: 4, score: 4, text: "Chủ động phối hợp, hòa nhã, vui vẻ, sẵn sàng hỗ trợ đồng nghiệp (4đ)" },
              { level: 5, score: 5, text: "Phối hợp nhanh nhẹn, ứng xử mẫu mực, chăm sóc được người bệnh khó tính (5đ)" }
            ]
          }
        ]
      },
      {
        id: "std_6",
        code: "TC 6",
        name: "Hành nghề theo tiêu chuẩn đạo đức nghề nghiệp",
        criteria: [
          {
            id: 10,
            name: "Chịu trách nhiệm cá nhân khi đưa ra các quyết định chăm sóc và can thiệp điều dưỡng",
            type: "level_5",
            maxScore: 5,
            levels: [
              { level: 1, score: 1, text: "Thực hiện theo chỉ đạo, chưa tự chịu trách nhiệm" },
              { level: 2, score: 2, text: "Bắt đầu tự giác chịu trách nhiệm" },
              { level: 3, score: 3, text: "Chịu trách nhiệm về các chăm sóc cơ bản" },
              { level: 4, score: 4, text: "Tự ra quyết định kế hoạch chăm sóc và can thiệp cho NB (4đ)" },
              { level: 5, score: 5, text: "Trách nhiệm cao, tự giác nhận lỗi & khắc phục kịp thời (5đ)" }
            ]
          },
          {
            id: 11,
            name: "Tuân thủ tiêu chuẩn đạo đức, bảo vệ hình ảnh đồng nghiệp (Không nhận tiền/quà trái quy định, giúp đỡ đồng nghiệp)",
            type: "level_5",
            maxScore: 5,
            levels: [
              { level: 1, score: 1, text: "4 lần vi phạm quy tắc đạo đức" },
              { level: 2, score: 2, text: "3 lần vi phạm" },
              { level: 3, score: 3, text: "2 lần vi phạm" },
              { level: 4, score: 4, text: "1 lần vi phạm" },
              { level: 5, score: 5, text: "0 lần vi phạm, gương mẫu bảo vệ uy tín ngành (5đ)" }
            ]
          },
          {
            id: 12,
            name: "Quảng bá hình ảnh người điều dưỡng, tác phong chuẩn mực, giao tiếp thuyết phục",
            type: "level_5",
            maxScore: 5,
            levels: [
              { level: 1, score: 1, text: "4 lần vi phạm về tác phong/trang phục" },
              { level: 2, score: 2, text: "3 lần vi phạm" },
              { level: 3, score: 3, text: "2 lần vi phạm" },
              { level: 4, score: 4, text: "1 lần vi phạm" },
              { level: 5, score: 5, text: "0 lần vi phạm, tác phong chuyên nghiệp, chuẩn mực (5đ)" }
            ]
          }
        ]
      },
      {
        id: "std_7",
        code: "TC 7",
        name: "Hiểu biết về tình trạng sức khỏe và về người bệnh",
        criteria: [
          {
            id: 13,
            name: "Hiểu về tình trạng sức khỏe của NB, kết quả cận lâm sàng liên quan trong thực hành",
            type: "level_5",
            maxScore: 10,
            levels: [
              { level: 1, score: 2, text: "Trình bày được tình trạng bệnh và các cận lâm sàng liên quan (2đ)" },
              { level: 2, score: 4, text: "Hiểu được ý nghĩa các cận lâm sàng liên quan (4đ)" },
              { level: 3, score: 6, text: "Đánh giá mức độ ưu tiên thực hiện và bàn giao CLS (6đ)" },
              { level: 4, score: 8, text: "Đọc và phân tích được các kết quả CLS (8đ)" },
              { level: 5, score: 10, text: "Nhận biết kết quả CLS bất thường và có can thiệp/báo BS kịp thời (10đ)" }
            ]
          },
          {
            id: 14,
            name: "Phân tích nhu cầu cần chăm sóc của NB, xác nhận can thiệp theo kế hoạch và thứ tự ưu tiên",
            type: "level_5",
            maxScore: 10,
            levels: [
              { level: 1, score: 2, text: "Phân tích nhu cầu NB nhưng chưa đầy đủ (2đ)" },
              { level: 2, score: 4, text: "Lập KHCS phù hợp và xác định các vấn đề ưu tiên (4đ)" },
              { level: 3, score: 6, text: "Thực hiện được 60% kế hoạch chăm sóc đã lập (6đ)" },
              { level: 4, score: 8, text: "Thực hiện được 80% kế hoạch chăm sóc đã lập (8đ)" },
              { level: 5, score: 10, text: "Thực hiện được 100% kế hoạch chăm sóc đã lập (10đ)" }
            ]
          },
          {
            id: 15,
            name: "Ra quyết định phân cấp chăm sóc người bệnh hợp lý, tiên lượng tiến triển can thiệp",
            type: "level_5",
            maxScore: 10,
            levels: [
              { level: 1, score: 2, text: "Biết các cấp độ phân cấp chăm sóc cơ bản (2đ)" },
              { level: 2, score: 4, text: "Thực hiện chăm sóc theo phân cấp có sẵn (4đ)" },
              { level: 3, score: 6, text: "Đánh giá và đề xuất phân cấp chăm sóc chính xác (6đ)" },
              { level: 4, score: 8, text: "Tự ra quyết định phân cấp chăm sóc và tiên lượng tốt (8đ)" },
              { level: 5, score: 10, text: "Phân cấp tối ưu, an toàn, tiên lượng chính xác diễn biến phức tạp (10đ)" }
            ]
          },
          {
            id: 16,
            name: "Tạo môi trường thoải mái, bảo đảm sự kín đáo riêng tư khi thực hiện kỹ thuật/thủ thuật",
            type: "level_5",
            maxScore: 10,
            levels: [
              { level: 1, score: 2, text: "Đôi khi quên che chắn khi làm thủ thuật (2đ)" },
              { level: 2, score: 4, text: "Thực hiện che chắn khi có người nhắc nhở (4đ)" },
              { level: 3, score: 6, text: "Chủ động che chắn, tạo môi trường thoải mái cho người bệnh (6đ)" },
              { level: 4, score: 8, text: "Luôn đảm bảo sự riêng tư kín đáo và động viên tâm lý NB (8đ)" },
              { level: 5, score: 10, text: "Thực hiện xuất sắc, bảo vệ nhân phẩm và tạo sự tin tưởng tuyệt đối (10đ)" }
            ]
          },
          {
            id: 17,
            name: "Áp dụng bằng chứng vào chăm sóc để tăng cường an toàn, chất lượng, tiết kiệm chi phí",
            type: "level_5",
            maxScore: 20,
            levels: [
              { level: 1, score: 4, text: "Chăm sóc theo thói quen kinh nghiệm (4đ)" },
              { level: 2, score: 8, text: "Tìm hiểu các khuyến cáo thực hành mới (8đ)" },
              { level: 3, score: 12, text: "Áp dụng các hướng dẫn dựa vào chứng cứ trong quy trình chăm sóc (12đ)" },
              { level: 4, score: 16, text: "Cải tiến quy trình chăm sóc dựa trên chứng cứ khoa học (16đ)" },
              { level: 5, score: 20, text: "Chủ trì áp dụng EBP mang lại hiệu quả rõ rệt về an toàn & chi phí (20đ)" }
            ]
          }
        ]
      },
      {
        id: "std_8",
        code: "TC 8",
        name: "Năng lực thực hành kỹ thuật chăm sóc lâm sàng",
        criteria: [
          {
            id: 18,
            name: "Mức độ thuần thục kỹ thuật điều dưỡng (Competent - Mentor - Expert)",
            type: "single_choice",
            maxScore: 80,
            options: [
              { label: "Chưa thuần thục các kỹ thuật cơ bản", score: 10 },
              { label: "Tuân thủ quy trình kỹ thuật trong phạm vi chuyên môn hành nghề (Competent)", score: 40 },
              { label: "Thực hiện thành thạo hầu hết kỹ thuật, có khả năng hướng dẫn người khác (Mentor)", score: 60 },
              { label: "Hiểu biết sâu, thực hiện kỹ thuật khó, phát triển chứng cứ và cải tiến quy trình (Expert)", score: 80 }
            ]
          }
        ]
      },
      {
        id: "std_9",
        code: "TC 9",
        name: "Năng lực dùng thuốc an toàn, hiệu quả",
        criteria: [
          {
            id: 19,
            name: "Tuân thủ 5 đúng, nhận biết tương tác thuốc và xử lý phản ứng có hại (ADR)",
            type: "single_choice",
            maxScore: 30,
            options: [
              { label: "Chưa độc lập thực hiện dùng thuốc", score: 0 },
              { label: "Tuân thủ quy định dùng thuốc; hướng dẫn dùng thuốc đúng, an toàn (10đ)", score: 10 },
              { label: "Hiểu biết & nhận biết được sự tương tác giữa thuốc - thuốc, thuốc - thức ăn (20đ)", score: 20 },
              { label: "Phát hiện, xử trí ban đầu dấu hiệu có hại của thuốc (ADR), thông tin kịp thời đến BS (30đ)", score: 30 }
            ]
          }
        ]
      },
      {
        id: "std_10",
        code: "TC 10",
        name: "Năng lực chăm sóc liên tục & bàn giao người bệnh",
        criteria: [
          {
            id: 20,
            name: "Chăm sóc liên tục, bàn giao ca chuẩn xác và phối hợp đa chuyên khoa",
            type: "single_choice",
            maxScore: 30,
            options: [
              { label: "Bàn giao còn thiếu sót", score: 0 },
              { label: "Kế hoạch chăm sóc được triển khai và người bệnh được theo dõi liên tục (10đ)", score: 10 },
              { label: "Bàn giao tình trạng người bệnh với nhóm chăm sóc kế tiếp đầy đủ, chính xác (20đ)", score: 20 },
              { label: "Phối hợp hiệu quả với NB, thân nhân và liên chuyên khoa đảm bảo chăm sóc toàn diện (30đ)", score: 30 }
            ]
          }
        ]
      },
      {
        id: "std_11",
        code: "TC 11",
        name: "Năng lực cấp cứu hồi sinh tim phổi (CPR)",
        criteria: [
          {
            id: 21,
            name: "Phát hiện sớm dấu hiệu nguy kịch, xử trí CPR kịp thời và phối hợp nhóm cấp cứu",
            type: "single_choice",
            maxScore: 30,
            options: [
              { label: "Chưa thuần thục CPR", score: 0 },
              { label: "Phát hiện sớm những thay đổi đột ngột về tình trạng sức khỏe của NB (10đ)", score: 10 },
              { label: "Biết cách xử trí phù hợp, thông báo khẩn cấp và kích hoạt báo động hỗ trợ (20đ)", score: 20 },
              { label: "Thực hiện cấp cứu CPR đạt hiệu quả cao, phối hợp nhịp nhàng trong nhóm cấp cứu (30đ)", score: 30 }
            ]
          }
        ]
      },
      {
        id: "std_12",
        code: "TC 12",
        name: "Năng lực lập kế hoạch chăm sóc và can thiệp điều dưỡng",
        criteria: [
          {
            id: 22,
            name: "Lập kế hoạch chăm sóc bệnh lý từ đơn giản đến phức tạp và cải tiến quy trình",
            type: "single_choice",
            maxScore: 50,
            options: [
              { label: "Chưa tự lập được kế hoạch chăm sóc", score: 0 },
              { label: "Lập KHCS cho NB bệnh lý đơn giản hoặc phân cấp 2, 3 an toàn, hiệu quả (10đ)", score: 10 },
              { label: "Lập KHCS cho NB bệnh phức tạp (nhiều bệnh kèm, cấp 1, bệnh nặng) (20đ)", score: 20 },
              { label: "Lập KHCS tổng thể ca nặng đa bệnh lý, theo dõi đánh giá và điều chỉnh kịp thời (30đ)", score: 30 },
              { label: "Cải tiến biểu mẫu ghi chép/quy trình KHCS đem lại hiệu quả cao, nhân rộng toàn viện (50đ)", score: 50 }
            ]
          }
        ]
      },
      {
        id: "std_13",
        code: "TC 13",
        name: "Thiết lập mối quan hệ & Giáo dục sức khỏe (GDSK)",
        criteria: [
          {
            id: 23,
            name: "Giao tiếp tạo niềm tin, tư vấn GDSK cá thể hóa và biên soạn tài liệu GDSK",
            type: "single_choice",
            maxScore: 50,
            options: [
              { label: "Chưa thực hiện tư vấn GDSK độc lập", score: 0 },
              { label: "Tạo niềm tin, dành thời gian giao tiếp với NB và thân nhân (10đ)", score: 10 },
              { label: "Lắng nghe và giải tỏa các lo lắng, băn khoăn của người bệnh, người nhà (20đ)", score: 20 },
              { label: "Xây dựng kế hoạch GDSK phù hợp văn hóa, tín ngưỡng và trình độ NB (30đ)", score: 30 },
              { label: "Truyền thông tương tác xuất sắc, sử dụng thành thạo các phương tiện truyền thông (40đ)", score: 40 },
              { label: "Biên soạn bài GDSK áp dụng toàn bệnh viện / thực hiện truyền thông cấp bệnh viện (50đ)", score: 50 }
            ]
          }
        ]
      },
      {
        id: "std_14",
        code: "TC 14",
        name: "Quản lý ghi chép và sử dụng hồ sơ bệnh án hiệu quả",
        criteria: [
          {
            id: 24,
            name: "Ghi chép hồ sơ điều dưỡng chính xác, ứng dụng CNTT và cải tiến biểu mẫu",
            type: "single_choice",
            maxScore: 50,
            options: [
              { label: "Ghi chép còn sai sót hoặc trễ giờ", score: 0 },
              { label: "Ghi chép hồ sơ điều dưỡng khách quan, chính xác, đầy đủ và kịp thời (10đ)", score: 10 },
              { label: "Sử dụng dữ liệu thu thập được để tối ưu hóa kế hoạch chăm sóc (20đ)", score: 20 },
              { label: "Sử dụng CNTT hiệu quả trong tích hợp và cải tiến biểu mẫu ghi chép (30đ)", score: 30 },
              { label: "Ứng dụng kết quả ghi chép phân tích, nghiên cứu cải tiến áp dụng thành công nhiều khoa (50đ)", score: 50 }
            ]
          }
        ]
      },
      {
        id: "std_15",
        code: "TC 15",
        name: "Giao tiếp hiệu quả theo chuẩn AIDET và SBAR",
        criteria: [
          {
            id: 25,
            name: "Ứng dụng chuẩn giao tiếp AIDET với người bệnh và gia đình",
            type: "level_5",
            maxScore: 10,
            levels: [
              { level: 1, score: 2, text: "Chưa áp dụng AIDET thường xuyên (2đ)" },
              { level: 2, score: 4, text: "Áp dụng được một số bước trong AIDET (4đ)" },
              { level: 3, score: 6, text: "Thực hiện tương đối đầy đủ các bước AIDET (6đ)" },
              { level: 4, score: 8, text: "Thực hiện thành thạo và tự nhiên mô hình AIDET (8đ)" },
              { level: 5, score: 10, text: "Ứng dụng xuất sắc AIDET, làm mẫu và lan tỏa cho đồng nghiệp (10đ)" }
            ]
          },
          {
            id: 26,
            name: "Ứng dụng chuẩn bàn giao SBAR trong trao đổi thông tin y khoa giữa đồng nghiệp",
            type: "level_5",
            maxScore: 10,
            levels: [
              { level: 1, score: 2, text: "Chưa áp dụng cấu trúc SBAR (2đ)" },
              { level: 2, score: 4, text: "Áp dụng SBAR nhưng còn lúng túng (4đ)" },
              { level: 3, score: 6, text: "Bàn giao cơ bản theo 4 bước SBAR (6đ)" },
              { level: 4, score: 8, text: "Thường xuyên bàn giao rõ ràng, súc tích theo SBAR (8đ)" },
              { level: 5, score: 10, text: "Bàn giao chuyên nghiệp, phát hiện ngay nguy cơ từ thông tin SBAR (10đ)" }
            ]
          },
          {
            id: 27,
            name: "Thể hiện lời nói, cử chỉ động viên, khuyến khích NB an tâm điều trị",
            type: "level_5",
            maxScore: 10,
            levels: [
              { level: 1, score: 2, text: "Ít tương tác động viên NB (2đ)" },
              { level: 2, score: 4, text: "Có thái độ hòa nhã khi tiếp xúc (4đ)" },
              { level: 3, score: 6, text: "Chủ động động viên người bệnh an tâm (6đ)" },
              { level: 4, score: 8, text: "Tạo cảm giác an toàn và tin cậy cao cho NB (8đ)" },
              { level: 5, score: 10, text: "Được NB và gia đình khen ngợi về thái độ tận tâm, đồng cảm (10đ)" }
            ]
          },
          {
            id: 28,
            name: "Làm việc nhóm hiệu quả, chia sẻ thông tin và thực hiện vai trò biện hộ cho người bệnh",
            type: "level_5",
            maxScore: 10,
            levels: [
              { level: 1, score: 2, text: "Kỹ năng làm việc nhóm còn hạn chế (2đ)" },
              { level: 2, score: 4, text: "Hợp tác cơ bản trong ca trực (4đ)" },
              { level: 3, score: 6, text: "Làm việc độc lập và nhóm hiệu quả (6đ)" },
              { level: 4, score: 8, text: "Chủ động hỗ trợ nhóm và bảo vệ quyền lợi người bệnh (8đ)" },
              { level: 5, score: 10, text: "Hạt nhân gắn kết nhóm, biện hộ xuất sắc vì sự an toàn của NB (10đ)" }
            ]
          }
        ]
      }
    ]
  },
  {
    id: "domain_3",
    code: "III",
    name: "Năng lực Đào tạo, NCKH & Thực hành Dựa trên Bằng chứng (EBP)",
    maxScore: 145,
    minScores: { 1: 5, 2: 5, 3: 10, 4: 40, 5: 90, 6: 110, 7: 120 },
    standards: [
      {
        id: "std_16",
        code: "TC 16",
        name: "Hoạt động Đào tạo & Giảng dạy",
        criteria: [
          {
            id: 29,
            name: "Xác định nhu cầu và xây dựng kế hoạch đào tạo điều dưỡng tại đơn vị",
            type: "level_5",
            maxScore: 10,
            levels: [
              { level: 1, score: 0, text: "Chưa tham gia (0đ)" },
              { level: 2, score: 3, text: "Góp ý nhu cầu đào tạo của bản thân (3đ)" },
              { level: 3, score: 5, text: "Khảo sát được nhu cầu đào tạo của nhóm (5đ)" },
              { level: 4, score: 7, text: "Phân tích mối quan hệ giữa nhu cầu và vị trí việc làm (7đ)" },
              { level: 5, score: 10, text: "Xây dựng hoàn chỉnh kế hoạch đào tạo khoa/đơn vị (10đ)" }
            ]
          },
          {
            id: 30,
            name: "Đề xuất và phát triển phương pháp đào tạo lâm sàng linh hoạt, hiệu quả",
            type: "level_5",
            maxScore: 10,
            levels: [
              { level: 1, score: 0, text: "Chưa tham gia (0đ)" },
              { level: 2, score: 3, text: "Áp dụng phương pháp đào tạo có sẵn (3đ)" },
              { level: 3, score: 5, text: "Đề xuất cải tiến tài liệu học tập (5đ)" },
              { level: 4, score: 8, text: "Đề xuất phương pháp đào tạo lâm sàng tương tác (8đ)" },
              { level: 5, score: 10, text: "Xây dựng phương pháp đào tạo đổi mới nâng cao chất lượng (10đ)" }
            ]
          },
          {
            id: 31,
            name: "Tổ chức thực hiện và trực tiếp tham gia giảng dạy đào tạo theo tiến độ",
            type: "level_5",
            maxScore: 10,
            levels: [
              { level: 1, score: 0, text: "Chưa tham gia (0đ)" },
              { level: 2, score: 3, text: "Hỗ trợ chuẩn bị hậu cần đào tạo (3đ)" },
              { level: 3, score: 5, text: "Tham gia trợ giảng đào tạo thực hành (5đ)" },
              { level: 4, score: 8, text: "Giảng dạy đạt chất lượng và đúng tiến độ (8đ)" },
              { level: 5, score: 10, text: "Chủ trì tổ chức khóa đào tạo chuyên khoa đạt đánh giá xuất sắc (10đ)" }
            ]
          },
          {
            id: 32,
            name: "Đánh giá hiệu quả sau đào tạo, báo cáo và đề xuất cải tiến",
            type: "level_5",
            maxScore: 10,
            levels: [
              { level: 1, score: 0, text: "Chưa tham gia (0đ)" },
              { level: 2, score: 2, text: "Thu thập phiếu khảo sát phản hồi (2đ)" },
              { level: 3, score: 5, text: "Tổng hợp kết quả kiểm tra người học (5đ)" },
              { level: 4, score: 8, text: "Thống kê, phân tích và báo cáo hiệu quả đào tạo (8đ)" },
              { level: 5, score: 10, text: "Chỉ ra nhược điểm và đề xuất giải pháp cải tiến toàn diện (10đ)" }
            ]
          },
          {
            id: 33,
            name: "Xây dựng công cụ (pre-test, post-test, bảng kiểm) đánh giá kiến thức kỹ năng",
            type: "single_choice",
            maxScore: 5,
            options: [
              { label: "Chưa thực hiện", score: 0 },
              { label: "Có đóng góp câu hỏi kiểm tra", score: 2 },
              { label: "Xây dựng được bộ công cụ đánh giá trước và sau đào tạo", score: 5 }
            ]
          },
          {
            id: 34,
            name: "Tham gia giảng dạy ít nhất 2 bài/năm/khoa hoặc 1 bài toàn bệnh viện (Tiêu chuẩn bắt buộc Cấp 4+)",
            type: "single_choice",
            maxScore: 5,
            options: [
              { label: "Chưa tham gia giảng dạy", score: 0 },
              { label: "Giảng dạy 1 bài/năm tại khoa", score: 2 },
              { label: "Giảng dạy ≥ 2 bài/năm tại khoa HOẶC ≥ 1 bài cấp toàn Bệnh viện", score: 5 }
            ]
          }
        ]
      },
      {
        id: "std_17",
        code: "TC 17",
        name: "Nghiên cứu khoa học (NCKH)",
        criteria: [
          {
            id: 35,
            name: "Hiểu biết về kỹ thuật nghiên cứu, khảo sát, đánh giá số liệu chăm sóc",
            type: "level_5",
            maxScore: 10,
            levels: [
              { level: 1, score: 0, text: "Chưa nắm vững phương pháp NCKH (0đ)" },
              { level: 2, score: 3, text: "Hiểu các khái niệm nghiên cứu cơ bản (3đ)" },
              { level: 3, score: 5, text: "Biết cách thu thập số liệu nghiên cứu chính xác (5đ)" },
              { level: 4, score: 8, text: "Hiểu sâu kỹ thuật khảo sát, chọn mẫu và phân tích (8đ)" },
              { level: 5, score: 10, text: "Thiết kế được đề cương nghiên cứu lâm sàng hoàn chỉnh (10đ)" }
            ]
          },
          {
            id: 36,
            name: "Sử dụng thành thạo phần mềm tin học trong phân tích số liệu (SPSS, STATA, R, Excel)",
            type: "level_5",
            maxScore: 10,
            levels: [
              { level: 1, score: 0, text: "Chưa sử dụng phần mềm thống kê (0đ)" },
              { level: 2, score: 2, text: "Nhập liệu trên Excel / Google Forms (2đ)" },
              { level: 3, score: 5, text: "Phân tích thống kê mô tả cơ bản trên Excel/SPSS (5đ)" },
              { level: 4, score: 8, text: "Phân tích kiểm định thống kê trên SPSS / STATA (8đ)" },
              { level: 5, score: 10, text: "Sử dụng thành thạo và diễn giải kết quả chuyên sâu (SPSS/STATA/R) (10đ)" }
            ]
          },
          {
            id: 37,
            name: "Chủ nhiệm đề tài cấp cơ sở có công bố trên tạp chí trong nước (1 bài/năm)",
            type: "single_choice",
            maxScore: 10,
            options: [
              { label: "Chưa có đề tài", score: 0 },
              { label: "Thành viên tham gia đề tài cấp cơ sở", score: 4 },
              { label: "Chủ nhiệm đề tài cấp cơ sở, có đăng tạp chí trong nước", score: 10 }
            ]
          },
          {
            id: 38,
            name: "Chủ nhiệm đề tài cấp cơ sở (≥ 2 bài/năm) HOẶC Chủ nhiệm đề tài cấp Thành phố",
            type: "single_choice",
            maxScore: 15,
            options: [
              { label: "Chưa đạt", score: 0 },
              { label: "Chủ nhiệm ≥ 2 bài báo trong nước/năm HOẶC Chủ nhiệm đề tài cấp TP", score: 15 }
            ]
          },
          {
            id: 39,
            name: "Đăng bài báo khoa học quốc tế (ISI/Scopus) HOẶC Chủ nhiệm đề tài cấp Nhà nước",
            type: "single_choice",
            maxScore: 20,
            options: [
              { label: "Chưa có", score: 0 },
              { label: "Tác giả bài báo quốc tế HOẶC Chủ nhiệm đề tài cấp Nhà nước", score: 20 }
            ]
          }
        ]
      },
      {
        id: "std_18",
        code: "TC 18",
        name: "Thực hành dựa trên bằng chứng (EBP)",
        criteria: [
          {
            id: 40,
            name: "Thực hiện nghiên cứu và đề xuất giải pháp dựa trên kết quả nghiên cứu",
            type: "level_5",
            maxScore: 10,
            levels: [
              { level: 1, score: 0, text: "Chưa tham gia (0đ)" },
              { level: 2, score: 2, text: "Đọc và nắm bắt kết quả nghiên cứu (2đ)" },
              { level: 3, score: 5, text: "Đề xuất giải pháp tại khoa dựa trên nghiên cứu (5đ)" },
              { level: 4, score: 8, text: "Chủ động thử nghiệm giải pháp mới dựa trên chứng cứ (8đ)" },
              { level: 5, score: 10, text: "Chủ trì giải pháp cải tiến chất lượng chăm sóc thành công (10đ)" }
            ]
          },
          {
            id: 41,
            name: "Ứng dụng kết quả NCKH vào thực hành chăm sóc và quản lý công việc",
            type: "level_5",
            maxScore: 10,
            levels: [
              { level: 1, score: 0, text: "Chưa ứng dụng (0đ)" },
              { level: 2, score: 2, text: "Tham gia áp dụng quy trình mới do khoa triển khai (2đ)" },
              { level: 3, score: 4, text: "Ứng dụng định kỳ vào việc chăm sóc hàng ngày (4đ)" },
              { level: 4, score: 8, text: "Đánh giá hiệu quả ứng dụng kết quả NCKH tại khoa (8đ)" },
              { level: 5, score: 10, text: "Nhân rộng mô hình ứng dụng chứng cứ cho các khoa khác (10đ)" }
            ]
          },
          {
            id: 42,
            name: "Sử dụng các bằng chứng y khoa cập nhật để nâng cao chất lượng thực hành chăm sóc",
            type: "level_5",
            maxScore: 10,
            levels: [
              { level: 1, score: 0, text: "Chưa tìm kiếm chứng cứ (0đ)" },
              { level: 2, score: 2, text: "Tìm kiếm tài liệu y khoa từ nguồn tin cậy (2đ)" },
              { level: 3, score: 4, text: "Phân tích và chia sẻ chứng cứ với đồng nghiệp (4đ)" },
              { level: 4, score: 8, text: "Áp dụng chứng cứ cập nhật vào giải quyết ca bệnh khó (8đ)" },
              { level: 5, score: 10, text: "Xây dựng phác đồ chăm sóc chuẩn dựa trên bằng chứng (10đ)" }
            ]
          }
        ]
      }
    ]
  },
  {
    id: "domain_4",
    code: "IV",
    name: "Năng lực Lãnh đạo & Quản lý",
    maxScore: 100,
    minScores: { 1: 5, 2: 5, 3: 10, 4: 40, 5: 70, 6: 80, 7: 100 },
    standards: [
      {
        id: "std_19",
        code: "TC 19",
        name: "Quản lý và sử dụng trang thiết bị y tế",
        criteria: [
          {
            id: 43,
            name: "Hiểu biết quy trình quản lý, sử dụng TTB, dụng cụ y tế và vật tư tiêu hao",
            type: "level_5",
            maxScore: 5,
            levels: [
              { level: 1, score: 1, text: "Chưa nắm vững quy trình quản lý TTB" },
              { level: 2, score: 2, text: "Nắm được vị trí và cách sử dụng cơ bản" },
              { level: 3, score: 3, text: "Hiểu đúng quy trình quản lý và vận hành an toàn (3đ)" },
              { level: 4, score: 4, text: "Nắm vững quy trình kiểm kê, bảo dưỡng định kỳ (4đ)" },
              { level: 5, score: 5, text: "Quản lý TTB chuẩn xác, hướng dẫn cho nhân viên mới (5đ)" }
            ]
          },
          {
            id: 44,
            name: "Đề xuất mua sắm trang thiết bị, vật tư phù hợp với nhu cầu điều trị",
            type: "level_5",
            maxScore: 5,
            levels: [
              { level: 1, score: 0, text: "Chưa tham gia đề xuất (0đ)" },
              { level: 2, score: 2, text: "Phản ánh kịp thời khi thiếu vật tư (2đ)" },
              { level: 3, score: 3, text: "Đề xuất danh mục vật tư cần thiết (3đ)" },
              { level: 4, score: 4, text: "Lập bảng dự trù vật tư khoa học (4đ)" },
              { level: 5, score: 5, text: "Đánh giá tính năng và đề xuất thiết bị mới tối ưu chi phí (5đ)" }
            ]
          },
          {
            id: 45,
            name: "Lập kế hoạch bảo quản, hiệu chuẩn TTB và vật tư y tế hiệu quả",
            type: "level_5",
            maxScore: 10,
            levels: [
              { level: 1, score: 0, text: "Chưa tham gia (0đ)" },
              { level: 2, score: 3, text: "Vệ sinh bảo quản máy móc sau ca trực (3đ)" },
              { level: 3, score: 6, text: "Thực hiện đúng lịch bảo dưỡng định kỳ (6đ)" },
              { level: 4, score: 8, text: "Xây dựng kế hoạch bảo quản máy móc của đơn vị (8đ)" },
              { level: 5, score: 10, text: "Quản lý hệ thống bảo trì không để xảy ra sự cố gián đoạn (10đ)" }
            ]
          },
          {
            id: 46,
            name: "Sử dụng thành thạo các trang thiết bị y tế chuyên sâu tại khoa phòng",
            type: "level_5",
            maxScore: 10,
            levels: [
              { level: 1, score: 2, text: "Sử dụng thiết bị cơ bản (monitor, bơm tiêm điện)" },
              { level: 2, score: 4, text: "Sử dụng máy sốc tim, máy hút, máy đo ECG (4đ)" },
              { level: 3, score: 6, text: "Thao tác thành thạo mọi thiết bị thường quy tại khoa (6đ)" },
              { level: 4, score: 8, text: "Vận hành thiết bị chuyên sâu và xử lý sự cố kỹ thuật nhỏ (8đ)" },
              { level: 5, score: 10, text: "Chuyên gia vận hành, đào tạo chuyển giao công nghệ thiết bị (10đ)" }
            ]
          }
        ]
      },
      {
        id: "std_20",
        code: "TC 20",
        name: "Sử dụng nguồn tài chính & Quản trị nguồn lực hiệu quả",
        criteria: [
          {
            id: 47,
            name: "Đánh giá hiệu quả kinh tế của các biện pháp chăm sóc tại bệnh viện",
            type: "level_5",
            maxScore: 10,
            levels: [
              { level: 1, score: 0, text: "Chưa tham gia đánh giá chi phí (0đ)" },
              { level: 2, score: 2, text: "Ý thức tiết kiệm điện, nước, vật tư (2đ)" },
              { level: 3, score: 5, text: "Hạn chế thất thoát, lãng phí thuốc và vật tư (5đ)" },
              { level: 4, score: 8, text: "Phân tích chi phí chăm sóc cho từng nhóm bệnh (8đ)" },
              { level: 5, score: 10, text: "Đánh giá chi phí - hiệu quả các gói can thiệp điều dưỡng (10đ)" }
            ]
          },
          {
            id: 48,
            name: "Xây dựng kế hoạch sử dụng nguồn lực trong phạm vi phân công hiệu quả",
            type: "level_5",
            maxScore: 10,
            levels: [
              { level: 1, score: 0, text: "Chưa lập kế hoạch (0đ)" },
              { level: 2, score: 2, text: "Sắp xếp công việc cá nhân hợp lý (2đ)" },
              { level: 3, score: 5, text: "Phối hợp sử dụng nguồn lực trong ca trực hiệu quả (5đ)" },
              { level: 4, score: 8, text: "Lập kế hoạch phân bổ nhân lực và vật tư theo ca (8đ)" },
              { level: 5, score: 10, text: "Tối ưu hóa nguồn lực toàn đơn vị, nâng cao năng suất (10đ)" }
            ]
          },
          {
            id: 49,
            name: "Tổ chức và triển khai thực hiện kế hoạch quản lý nguồn lực",
            type: "level_5",
            maxScore: 10,
            levels: [
              { level: 1, score: 0, text: "Chưa phụ trách (0đ)" },
              { level: 2, score: 2, text: "Thực hiện theo phân công (2đ)" },
              { level: 3, score: 5, text: "Giám sát định kỳ sử dụng vật tư của nhóm (5đ)" },
              { level: 4, score: 8, text: "Điều phối nguồn lực trơn tru không để thiếu hụt (8đ)" },
              { level: 5, score: 10, text: "Tổ chức xuất sắc, mô hình quản trị mẫu mực (10đ)" }
            ]
          },
          {
            id: 50,
            name: "Có đề án cải tiến quản lý giúp bệnh viện tiết kiệm và ứng dụng hiệu quả",
            type: "single_choice",
            maxScore: 10,
            options: [
              { label: "Chưa có đề án cải tiến", score: 0 },
              { label: "Đóng góp ý tưởng cải tiến quy trình", score: 3 },
              { label: "Có đề án cải tiến quản lý/tiết kiệm nguồn lực được nghiệm thu áp dụng", score: 10 }
            ]
          }
        ]
      },
      {
        id: "std_21",
        code: "TC 21",
        name: "Thiết lập môi trường an toàn lao động & Kiểm soát nhiễm khuẩn",
        criteria: [
          {
            id: 51,
            name: "Hiểu biết nội dung liên quan sức khỏe nghề nghiệp và an toàn lao động",
            type: "single_choice",
            maxScore: 5,
            options: [
              { label: "Chưa nắm rõ", score: 0 },
              { label: "Nắm vững quy định về sức khỏe nghề nghiệp và an toàn lao động", score: 5 }
            ]
          },
          {
            id: 52,
            name: "Tuân thủ các tiêu chuẩn và quy tắc về an toàn vệ sinh lao động",
            type: "level_5",
            maxScore: 5,
            levels: [
              { level: 1, score: 1, text: "Còn vi phạm quy tắc an toàn" },
              { level: 2, score: 2, text: "Tuân thủ khi được nhắc nhở" },
              { level: 3, score: 3, text: "Tự giác chấp hành quy tắc an toàn (3đ)" },
              { level: 4, score: 4, text: "Tuân thủ tốt, nhắc nhở đồng nghiệp cùng thực hiện (4đ)" },
              { level: 5, score: 5, text: "Gương mẫu 100%, tích cực xây dựng môi trường an toàn (5đ)" }
            ]
          },
          {
            id: 53,
            name: "Tuân thủ chính sách, quy trình phòng ngừa cách ly và kiểm soát nhiễm khuẩn (KSNK)",
            type: "level_5",
            maxScore: 10,
            levels: [
              { level: 1, score: 2, text: "Tuân thủ chưa triệt để 5 thời điểm rửa tay" },
              { level: 2, score: 4, text: "Tuân thủ vệ sinh tay và mang PPE cơ bản" },
              { level: 3, score: 6, text: "Thực hiện đúng 100% quy trình KSNK và phân loại rác (6đ)" },
              { level: 4, score: 8, text: "Tuân thủ nghiêm ngặt kỹ thuật vô khuẩn và cách ly (8đ)" },
              { level: 5, score: 10, text: "Giám sát viên KSNK xuất sắc, tỷ lệ nhiễm khuẩn tại khoa 0% (10đ)" }
            ]
          },
          {
            id: 54,
            name: "Dự phòng phơi nhiễm với các tác nhân gây bệnh và xử trí đúng phác đồ khi phơi nhiễm",
            type: "single_choice",
            maxScore: 5,
            options: [
              { label: "Chưa nắm rõ quy trình xử trí phơi nhiễm", score: 0 },
              { label: "Thực hiện đúng dự phòng và biết cách sơ cứu/báo cáo khi phơi nhiễm", score: 5 }
            ]
          },
          {
            id: 55,
            name: "Tuân thủ quy trình an toàn phòng cháy chữa cháy (PCCC) và ứng phó khẩn cấp",
            type: "single_choice",
            maxScore: 5,
            options: [
              { label: "Chưa tham gia tập huấn PCCC", score: 0 },
              { label: "Biết sử dụng bình chữa cháy và tuân thủ lối thoát hiểm khẩn cấp", score: 5 }
            ]
          }
        ]
      }
    ]
  },
  {
    id: "domain_5",
    code: "V",
    name: "Phát triển Chuyên môn Cá nhân & Quản lý Chất lượng",
    maxScore: 150,
    minScores: { 1: 10, 2: 20, 3: 40, 4: 60, 5: 100, 6: 140, 7: 150 },
    standards: [
      {
        id: "std_22",
        code: "TC 22",
        name: "Duy trì và phát triển năng lực cá nhân và đồng nghiệp",
        criteria: [
          {
            id: 56,
            name: "Xác định rõ mục tiêu phát triển nghề nghiệp, điểm mạnh và điểm yếu bản thân",
            type: "level_5",
            maxScore: 10,
            levels: [
              { level: 1, score: 2, text: "Chưa có định hướng nghề nghiệp rõ ràng (2đ)" },
              { level: 2, score: 4, text: "Nhận biết được điểm mạnh và điểm cần cải thiện (4đ)" },
              { level: 3, score: 6, text: "Có kế hoạch học tập cá nhân hàng năm (6đ)" },
              { level: 4, score: 8, text: "Chủ động bồi dưỡng chuyên sâu theo lộ trình (8đ)" },
              { level: 5, score: 10, text: "Kế hoạch phát triển xuất sắc, đạt các cột mốc nghề nghiệp trước hạn (10đ)" }
            ]
          },
          {
            id: 57,
            name: "Chủ động tham gia tích cực hoạt động đào tạo liên tục (CME) cấp khoa và bệnh viện",
            type: "level_5",
            maxScore: 10,
            levels: [
              { level: 1, score: 2, text: "Tham gia CME chưa đủ số tiết quy định (2đ)" },
              { level: 2, score: 4, text: "Đạt đủ số giờ CME tối thiểu theo quy định (4đ)" },
              { level: 3, score: 6, text: "Tham gia tích cực các buổi sinh hoạt khoa học cấp khoa (6đ)" },
              { level: 4, score: 8, text: "Tham gia trên 150% số giờ CME và các hội thảo chuyên đề (8đ)" },
              { level: 5, score: 10, text: "Tham gia xuất sắc các hội nghị khoa học trong & ngoài nước (10đ)" }
            ]
          },
          {
            id: 58,
            name: "Thái độ tích cực với đổi mới, lắng nghe ý kiến phản hồi và thử nghiệm phương pháp mới",
            type: "level_5",
            maxScore: 10,
            levels: [
              { level: 1, score: 2, text: "Còn ngại thay đổi phương pháp làm việc cũ (2đ)" },
              { level: 2, score: 4, text: "Chấp nhận thay đổi khi có chỉ đạo (4đ)" },
              { level: 3, score: 6, text: "Cầu thị, lắng nghe góp ý từ đồng nghiệp và cấp trên (6đ)" },
              { level: 4, score: 8, text: "Tích cực đề xuất và hưởng ứng các sáng kiến mới (8đ)" },
              { level: 5, score: 10, text: "Tiên phong thử nghiệm và truyền cảm hứng đổi mới trong khoa (10đ)" }
            ]
          },
          {
            id: 59,
            name: "Hỗ trợ tích cực, đóng góp vào việc đào tạo và kèm cặp phát triển cho đồng nghiệp",
            type: "level_5",
            maxScore: 10,
            levels: [
              { level: 1, score: 0, text: "Chưa tham gia kèm cặp (0đ)" },
              { level: 2, score: 3, text: "Hỗ trợ giải đáp khi đồng nghiệp hỏi (3đ)" },
              { level: 3, score: 6, text: "Hướng dẫn thực hành cho sinh viên thực tập (6đ)" },
              { level: 4, score: 8, text: "Kèm cặp (mentor) hiệu quả cho nhân viên mới (8đ)" },
              { level: 5, score: 10, text: "Người dẫn dắt (Leader Mentor) xuất sắc của khoa (10đ)" }
            ]
          }
        ]
      },
      {
        id: "std_23",
        code: "TC 23",
        name: "Cải tiến chất lượng chăm sóc & Báo cáo sự cố y khoa",
        criteria: [
          {
            id: 60,
            name: "Hiểu được sự cần thiết của hoạt động quản lý chất lượng và đánh giá thực hành",
            type: "level_5",
            maxScore: 10,
            levels: [
              { level: 1, score: 2, text: "Chưa nắm rõ các chỉ số chất lượng điều dưỡng (2đ)" },
              { level: 2, score: 4, text: "Tham gia thu thập số liệu chất lượng (4đ)" },
              { level: 3, score: 6, text: "Hiểu và thực hiện đúng các tiêu chuẩn chất lượng (6đ)" },
              { level: 4, score: 8, text: "Phân tích được nguyên nhân sai sót trong chăm sóc (8đ)" },
              { level: 5, score: 10, text: "Đóng vai trò nòng cốt trong ban mạng lưới chất lượng (10đ)" }
            ]
          },
          {
            id: 61,
            name: "Tiếp nhận, báo cáo sự cố y khoa tự nguyện và đưa ra biện pháp khắc phục",
            type: "level_5",
            maxScore: 10,
            levels: [
              { level: 1, score: 2, text: "Chưa chủ động báo cáo sự cố suýt xảy ra (near-miss) (2đ)" },
              { level: 2, score: 4, text: "Báo cáo sự cố đúng quy trình khi xảy ra (4đ)" },
              { level: 3, score: 6, text: "Chủ động báo cáo sự cố và tham gia phân tích RCA (6đ)" },
              { level: 4, score: 8, text: "Đề xuất giải pháp ngăn ngừa sự cố tái diễn hiệu quả (8đ)" },
              { level: 5, score: 10, text: "Văn hóa an toàn người bệnh mẫu mực, không đổ lỗi (10đ)" }
            ]
          },
          {
            id: 62,
            name: "Tìm kiếm vấn đề tồn tại chuyên môn/hành chính, đưa ra giải pháp cải tiến hiệu quả",
            type: "level_5",
            maxScore: 10,
            levels: [
              { level: 1, score: 0, text: "Chưa có đề xuất cải tiến (0đ)" },
              { level: 2, score: 3, text: "Chỉ ra được điểm nghẽn trong công việc (3đ)" },
              { level: 3, score: 6, text: "Đề xuất giải pháp cải tiến quy trình chăm sóc tại khoa (6đ)" },
              { level: 4, score: 8, text: "Chủ trì đề án 5S / Cải tiến chất lượng cấp khoa (8đ)" },
              { level: 5, score: 10, text: "Sáng kiến cải tiến được trao giải cấp Bệnh viện (10đ)" }
            ]
          }
        ]
      },
      {
        id: "std_24",
        code: "TC 24",
        name: "Quản lý chăm sóc & Tổ chức công việc điều dưỡng",
        criteria: [
          {
            id: 63,
            name: "Xây dựng kế hoạch làm việc cá nhân hiệu quả, khoa học và đúng giờ",
            type: "level_5",
            maxScore: 10,
            levels: [
              { level: 1, score: 2, text: "Thường xuyên trễ giờ hoặc dồn việc cuối ca (2đ)" },
              { level: 2, score: 4, text: "Hoàn thành công việc nhưng chưa tối ưu thời gian (4đ)" },
              { level: 3, score: 6, text: "Kế hoạch làm việc khoa học, đúng tiến độ (6đ)" },
              { level: 4, score: 8, text: "Chủ động sắp xếp công việc linh hoạt khi có ca cấp cứu (8đ)" },
              { level: 5, score: 10, text: "Quản trị thời gian mẫu mực, năng suất vượt trội (10đ)" }
            ]
          },
          {
            id: 64,
            name: "Xác định khối lượng công việc và sắp xếp thứ tự ưu tiên hợp lý",
            type: "level_5",
            maxScore: 10,
            levels: [
              { level: 1, score: 2, text: "Lúng túng khi có nhiều bệnh nhân nặng cùng lúc (2đ)" },
              { level: 2, score: 4, text: "Ưu tiên theo hướng dẫn của người trực chính (4đ)" },
              { level: 3, score: 6, text: "Tự phân loại và ưu tiên chăm sóc đúng (6đ)" },
              { level: 4, score: 8, text: "Xử lý trơn tru tình huống quá tải công việc (8đ)" },
              { level: 5, score: 10, text: "Kỹ năng điều phối ưu tiên bậc thầy, đảm bảo an toàn tuyệt đối (10đ)" }
            ]
          },
          {
            id: 65,
            name: "Tổ chức, điều phối, phân công và ủy quyền nhiệm vụ trong nhóm chăm sóc",
            type: "level_5",
            maxScore: 10,
            levels: [
              { level: 1, score: 0, text: "Chưa phụ trách điều phối nhóm (0đ)" },
              { level: 2, score: 3, text: "Phối hợp làm việc theo phân công (3đ)" },
              { level: 3, score: 6, text: "Hỗ trợ phân công công việc trong ca trực (6đ)" },
              { level: 4, score: 8, text: "Trưởng ca trực điều hành nhịp nhàng các thành viên (8đ)" },
              { level: 5, score: 10, text: "Kỹ năng lãnh đạo nhóm xuất sắc, tối ưu hóa năng lực từng thành viên (10đ)" }
            ]
          }
        ]
      }
    ]
  }
];

// Khung điều kiện chuẩn 7 Cấp độ Năng lực Điều dưỡng UMC
const COMPETENCY_LEVELS = [
  {
    level: 1,
    title: "Cấp 1 - Tập sự (Novice)",
    badge: "Tập sự",
    minTotalScore: 200,
    minDomainScores: { domain_1: 80, domain_2: 100, domain_3: 5, domain_4: 5, domain_5: 10 },
    degreeReq: "Trung học trở lên (Đại học từ 2025)",
    experienceReqMonths: 0,
    experienceDesc: "≤ 18 tháng",
    teachingResearchReq: "Không bắt buộc",
    hasTeachingResearch: false,
    minExamScore: 0,
    color: "#64748b",
    icon: "🌱"
  },
  {
    level: 2,
    title: "Cấp 2 - Có khả năng thực hành (Advanced Beginner)",
    badge: "Có khả năng thực hành",
    minTotalScore: 300,
    minDomainScores: { domain_1: 90, domain_2: 180, domain_3: 5, domain_4: 5, domain_5: 20 },
    degreeReq: "Trung học trở lên (Đại học từ 2025)",
    experienceReqMonths: 18,
    experienceDesc: "> 18 tháng - 5 năm",
    teachingResearchReq: "Không bắt buộc",
    hasTeachingResearch: false,
    minExamScore: 0,
    color: "#0284c7",
    icon: "🌿"
  },
  {
    level: 3,
    title: "Cấp 3 - Đủ năng lực (Competent)",
    badge: "Đủ năng lực",
    minTotalScore: 400,
    minDomainScores: { domain_1: 100, domain_2: 240, domain_3: 10, domain_4: 10, domain_5: 40 },
    degreeReq: "Trung học trở lên (Đại học từ 2025)",
    experienceReqMonths: 60,
    experienceDesc: "5 - 10 năm",
    teachingResearchReq: "Không bắt buộc",
    hasTeachingResearch: false,
    minExamScore: 7.0,
    color: "#10b981",
    icon: "⭐"
  },
  {
    level: 4,
    title: "Cấp 4 - Thành thạo (Proficient)",
    badge: "Thành thạo",
    minTotalScore: 600,
    minDomainScores: { domain_1: 120, domain_2: 340, domain_3: 40, domain_4: 40, domain_5: 60 },
    degreeReq: "Cử nhân trở lên",
    experienceReqMonths: 120,
    experienceDesc: "≥ 10 năm",
    teachingResearchReq: "Giảng dạy ≥ 2 bài/năm + Chủ nhiệm đề tài cơ sở có bài báo",
    hasTeachingResearch: true,
    minExamScore: 7.0,
    color: "#8b5cf6",
    icon: "🏆"
  },
  {
    level: 5,
    title: "Cấp 5 - Chuyên gia lâm sàng (Clinical Expert)",
    badge: "Chuyên gia lâm sàng",
    minTotalScore: 800,
    minDomainScores: { domain_1: 140, domain_2: 400, domain_3: 90, domain_4: 70, domain_5: 100 },
    degreeReq: "Thạc sĩ / CKI trở lên",
    experienceReqMonths: 120,
    experienceDesc: "≥ 10 năm",
    teachingResearchReq: "Giảng dạy + Chủ nhiệm 2 đề tài cơ sở hoặc 1 đề tài cấp TP",
    hasTeachingResearch: true,
    minExamScore: 7.0,
    color: "#ec4899",
    icon: "👑"
  },
  {
    level: 6,
    title: "Cấp 6 - Chuyên gia quản lý (Management Expert)",
    badge: "Chuyên gia quản lý",
    minTotalScore: 900,
    minDomainScores: { domain_1: 150, domain_2: 420, domain_3: 110, domain_4: 80, domain_5: 140 },
    degreeReq: "Thạc sĩ / CKI trở lên",
    experienceReqMonths: 60,
    experienceDesc: "≥ 5 năm quản lý/giảng dạy",
    teachingResearchReq: "Giảng dạy + Chủ nhiệm đề tài cấp Nhà nước / Bài báo quốc tế",
    hasTeachingResearch: true,
    minExamScore: 7.0,
    color: "#f59e0b",
    icon: "🎖️"
  },
  {
    level: 7,
    title: "Cấp 7 - Chuyên gia cao cấp (Senior Master)",
    badge: "Chuyên gia cao cấp",
    minTotalScore: 1000,
    minDomainScores: { domain_1: 180, domain_2: 450, domain_3: 120, domain_4: 100, domain_5: 150 },
    degreeReq: "Thạc sĩ / CKII / Tiến sĩ",
    experienceReqMonths: 60,
    experienceDesc: "≥ 5 năm quản lý/giảng dạy",
    teachingResearchReq: "Đóng góp lớn ngành ĐDVN + Bài báo quốc tế",
    hasTeachingResearch: true,
    minExamScore: 7.0,
    color: "#ef4444",
    icon: "💎"
  }
];

// Helper lấy tiêu chí theo ID
function getCriterionById(criterionId, unitName) {
  let domains = typeof DOMAINS_DATA !== "undefined" ? DOMAINS_DATA : [];
  if (typeof getFrameworkForUnit === "function" && unitName) {
    const fw = getFrameworkForUnit(unitName);
    if (fw && fw.domains) domains = fw.domains;
  }

  for (const domain of domains) {
    for (const std of domain.standards) {
      for (const crit of std.criteria) {
        if (crit.id === criterionId) {
          return {
            ...crit,
            standardCode: std.code,
            standardName: std.name,
            domainId: domain.id,
            domainCode: domain.code,
            domainName: domain.name
          };
        }
      }
    }
  }

  // If not found, try all frameworks
  if (typeof DEPARTMENT_FRAMEWORKS !== "undefined") {
    for (const k in DEPARTMENT_FRAMEWORKS) {
      const fw = DEPARTMENT_FRAMEWORKS[k];
      for (const domain of fw.domains) {
        for (const std of domain.standards) {
          for (const crit of std.criteria) {
            if (crit.id === criterionId) {
              return {
                ...crit,
                standardCode: std.code,
                standardName: std.name,
                domainId: domain.id,
                domainCode: domain.code,
                domainName: domain.name
              };
            }
          }
        }
      }
    }
  }
  return null;
}

window.getCriterionById = getCriterionById;
window.findCriterionById = getCriterionById;
