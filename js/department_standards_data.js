/**
 * HỆ THỐNG KHUNG TIÊU CHUẨN NĂNG LỰC ĐIỀU DƯỠNG UMC THEO TỪNG KHOA / CHUYÊN NGÀNH
 * Trích xuất từ 4 bộ chuẩn chính thức của Bệnh viện Đại học Y Dược TPHCM:
 *  1. Lâm sàng (66 Tiêu chí) - Áp dụng Khối Lâm sàng & các khoa chuyên môn
 *  2. Gây mê hồi sức (67 Tiêu chí) - Áp dụng Khoa Gây mê hồi sức
 *  3. Xét nghiệm (63 Tiêu chí) - Áp dụng Khoa Xét nghiệm & SHPT
 *  4. Khoa Khám bệnh (71 Tiêu chí) - Áp dụng Khoa Khám bệnh Ngoại trú
 */

const DEPARTMENT_FRAMEWORKS = {
  "clinical": {
    id: "clinical",
    name: "Điều dưỡng Lâm sàng",
    shortName: "Lâm sàng",
    totalCriteria: 66,
    maxScore: 1025,
    units: ["Khoa Phụ Sản", "Khoa Ngoại", "Khoa Tai Mũi Họng", "Đơn vị Chấn thương Chỉnh hình", "Khoa Phục hồi chức năng", "Đơn vị Nội soi", "Đơn vị Săn sóc hồi tỉnh", "Khoa Kiểm soát nhiễm khuẩn", "Khoa Chẩn đoán hình ảnh", "Ban Điều dưỡng"],
    domains: [
      {
        id: "domain_1",
        code: "I",
        name: "TIÊU CHUẨN BẰNG CẤP & TRÌNH ĐỘ CHUYÊN MÔN",
        maxScore: 180,
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
                  { label: "ĐH Điều dưỡng từ Châu Âu (trừ Đông Âu), Mỹ, Canada, New Zealand, Úc, Nhật Bản, Hàn Quốc, Singapore, Đài Loan, Malaysia", score: 100 }
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
          }
        ]
      },
      {
        id: "domain_2",
        code: "I",
        name: "NĂNG LỰC THỰC HÀNH CHĂM SÓC NGƯỜI BỆNH",
        maxScore: 510,
        standards: [
          {
            id: "std_2",
            code: "TC 5",
            name: "Hành nghề theo pháp luật",
            criteria: [
              {
                id: 7,
                name: "Tuân thủ các quy định tại cơ sở làm việc - Có mặt tại nơi làm việc - Tuân thủ thời gian làm việc - Tuân thủ quy định đồng phục, bảng tên - Tham gia hội họp, sinh hoạt tập thể  - Ý thức bảo vệ tài sản tại đơn vị/BV",
                type: "single_choice",
                maxScore: 5,
                options: [
                  { score: 1, label: "Mức 1: 4 lần vi phạm (1 điểm)" },
                  { score: 2, label: "Mức 2: 3 lần vi phạm (2 điểm)" },
                  { score: 3, label: "Mức 3: 2 lần vi phạm (3 điểm)" },
                  { score: 4, label: "Mức 4: 1 lần vi phạm (4 điểm)" },
                  { score: 5, label: "Mức 5: 0 lần vi phạm (5 điểm)" },
                ]
              },
              {
                id: 8,
                name: "Tuân thủ các quy định hành nghề theo luật định liên quan đến y tế, thực hành điều dưỡng, BYT  (Luật khám chữa bệnh, thông tư 31, thông tư 23/2011, thông tư 51/2017, …)",
                type: "single_choice",
                maxScore: 5,
                options: [
                  { score: 1, label: "Mức 1: 4 lần vi phạm (1 điểm)" },
                  { score: 2, label: "Mức 2: 3 lần vi phạm (2 điểm)" },
                  { score: 3, label: "Mức 3: 2 lần vi phạm (3 điểm)" },
                  { score: 4, label: "Mức 4: 1 lần vi phạm (4 điểm)" },
                  { score: 5, label: "Mức 5: 0 lần vi phạm (5 điểm)" },
                ]
              },
              {
                id: 9,
                name: "Thực hiện tốt quy tắc ứng xử của tổ chức và luật định  - Sự phối hợp, hợp tác với đồng nghiệp - Ứng xử với đồng nghiệp - Giao tiếp với khách hàng/NB",
                type: "single_choice",
                maxScore: 5,
                options: [
                  { score: 3, label: "Mức 3: Phối hợp với đồng nghiệp nhưng chưa chủ động hoặc do được yêu cầu Quan hệ, giao tiếp tốt với đồng nghiệp, NB (3 điểm)" },
                  { score: 4, label: "Mức 4: Chủ động phối hợp với đồng nghiệp để giải quyết công việc Hòa nhã, vui vẻ, sẵn sàng hỗ trợ với đồng nghiệp, khách hàng/NB (4 điểm)" },
                  { score: 5, label: "Mức 5: Phối hợp công việc 1 cách nhanh nhẹn, hiệu quả Ứng xử nhanh nhẹn, giải quyết mọi vấn đề, quan hệ tốt với đồng nghiệp trong và ngoài đơn vị Giao tiếp tốt với NB, chăm sóc được NB khó tính (5 điểm)" },
                ]
              },
            ]
          },
          {
            id: "std_3",
            code: "TC 6",
            name: "Hành nghề theo tiêu chuẩn đạo đức nghề nghiệp",
            criteria: [
              {
                id: 10,
                name: "Chịu trách nhiệm cá nhân khi đưa ra các quyết định chăm sóc và can thiệp chăm sóc",
                type: "single_choice",
                maxScore: 5,
                options: [
                  { score: 4, label: "Mức 4: Tự ra quyết định kế hoạch chăm sóc và can thiệp cho NB (4 điểm)" },
                  { score: 5, label: "Mức 5: Có trách nhiệm trong công tác Tự giác nhận trách nhiệm khi có những sai sót (5 điểm)" },
                ]
              },
              {
                id: 11,
                name: "Tuân thủ tiêu chuẩn đạo đức, không đỗ lỗi cho đồng nghiệp, người bệnh đối với các sai sót của cá nhân. Bảo vệ hình ảnh đồng nghiệp trước người bệnh/người nhà và xã hội. - Không nhận tiền và lợi ích từ NB - Tôn trọng và tự nguyện tham gia các hoạt động của Hội ĐD - Tôn trọng và bảo vệ danh dự, uy tính của đồng nghiệp - Hợp tác, giúp đỡ và truyền thụ kinh nghiệm cho đồng nghiệp",
                type: "single_choice",
                maxScore: 5,
                options: [
                  { score: 1, label: "Mức 1: 4 lần vi phạm (1 điểm)" },
                  { score: 2, label: "Mức 2: 3 lần vi phạm (2 điểm)" },
                  { score: 3, label: "Mức 3: 2 lần vi phạm (3 điểm)" },
                  { score: 4, label: "Mức 4: 1 lần vi phạm (4 điểm)" },
                  { score: 5, label: "Mức 5: 0 lần vi phạm (5 điểm)" },
                ]
              },
              {
                id: 12,
                name: "Quảng bá hình ảnh người điều dưỡng, thể hiện tác phong và tư cách tốt, trang phục phù hợp, lời nói thuyết phục và cách cư xử đúng mực. - Tác phong và chuẩn mực (sạch sẽ, gọn gàng, tươm tất) - Tư cách và lời nói (nhanh nhẹn, vui vẻ, than thiện, hòa đồng) - Không ngừng nâng cao năng lực hành nghề - Tự tôn nghề nghiệp - Cam kết với cộng đồng và xã hội",
                type: "single_choice",
                maxScore: 5,
                options: [
                  { score: 1, label: "Mức 1: 4 lần vi phạm (1 điểm)" },
                  { score: 2, label: "Mức 2: 3 lần vi phạm (2 điểm)" },
                  { score: 3, label: "Mức 3: 2 lần vi phạm (3 điểm)" },
                  { score: 4, label: "Mức 4: 1 lần vi phạm (4 điểm)" },
                  { score: 5, label: "Mức 5: 0 lần vi phạm (5 điểm)" },
                ]
              },
            ]
          },
          {
            id: "std_4",
            code: "TC 7",
            name: "Hiểu biết về tình trang sức khỏe và về người bệnh",
            criteria: [
              {
                id: 13,
                name: "Hiểu về tình trạng sức khỏe của người bệnh, các kết quả cận lâm sàng liên quan để tham khảo trong thực hành chăm sóc",
                type: "single_choice",
                maxScore: 10,
                options: [
                  { score: 2, label: "Mức 1: Trình bày được tình trạng bệnh và các cận lâm sàng liên quan (2 điểm)" },
                  { score: 4, label: "Mức 2: Hiểu được ý nghĩa các cận lâm sàng liên quan (4 điểm)" },
                  { score: 6, label: "Mức 3: Đánh giá được mức độ ưu tiên thực hiện cận lâm sàng:  -Thực hiện CLS -Bàn giao thông tin (6 điểm)" },
                  { score: 8, label: "Mức 4: Đọc được các kết quả cận lâm sàng (8 điểm)" },
                  { score: 10, label: "Mức 5: Nhận biết được kết quả cận lâm sàng bất thường và có can thiệp kịp thời (10 điểm)" },
                ]
              },
              {
                id: 14,
                name: "Phân tích các nhu cầu cần chăm sóc của người bệnh, xác nhận các can thiệp theo kế hoạch và thứ tự ưu tiên",
                type: "single_choice",
                maxScore: 10,
                options: [
                  { score: 2, label: "Mức 1: Có phân tích các nhu cầu cần chăm sóc của người bệnh và lập KHCS nhưng chư đầy đủ. (2 điểm)" },
                  { score: 4, label: "Mức 2: Lập KHCS phù hợp với các vấn đề Người bệnh và xác định các vấn đề ưu tiên của kế hoạch chăm sóc. (4 điểm)" },
                  { score: 6, label: "Mức 3: Thực hiện được 60% kế hoạch chăm sóc đã lập ra. (6 điểm)" },
                  { score: 8, label: "Mức 4: Thực hiện được 80% kế hoạch chăm sóc đã lập ra. (8 điểm)" },
                  { score: 10, label: "Mức 5: Thực hiện được 100% kế hoạch chăm sóc đã lập ra. (10 điểm)" },
                ]
              },
              {
                id: 15,
                name: "Ra quyết định phân cấp chăm sóc cho người bệnh hợp lý, an toàn, hiệu quả; Tiên lượng được sự tiến triển của các can thiệp điều dưỡng sẽ thực hiện",
                type: "single_choice",
                maxScore: 10,
                options: [
                  { score: 6, label: "Mức 3: Thực hiện chăm sóc Người bệnh theo phân cấp chăm sóc có sẵn  (6 điểm)." },
                  { score: 8, label: "Mức 4: Phân tích tình trạng Người bệnh và phối hợp cùng bác sĩ đưa ra phân cấp chăm sóc phù hợp. (8 điểm)" },
                  { score: 10, label: "Mức 5: Tiên lượng được sự tiến triển của tình trạng Người bệnh để đưa ra những can thiệp chăm sóc phù hợp. (8 điểm)" },
                ]
              },
              {
                id: 16,
                name: "Tạo môi trường thoải mái cho NB và khi chăm sóc Bảo đảm sự kín đáo, riêng tư khi thực hiện kỹ thuật/thủ thuật",
                type: "single_choice",
                maxScore: 10,
                options: [
                  { score: 2, label: "Mức 1: Có thực hiện (10 điểm)" },
                ]
              },
              {
                id: 17,
                name: "Áp dụng bằng chứng vào thực hành chăm sóc để tăng cường sự an toàn, chất lượng trong chăm sóc, tiết kiệm được chi phí nằm viện cho người bệnh",
                type: "single_choice",
                maxScore: 20,
                options: [
                  { score: 16, label: "Mức 4: Khi tìm được các bằng chứng phù hợp và ứng dụng vào trong thực hành lâm sàng tại Khoa, đơn vị (15điểm)" },
                  { score: 20, label: "Mức 5: Khi tìm được các bằng chứng phù hợp và ứng dụng vào trong thực hành lâm sàng ở qui mô toàn Bệnh viện (20  đểm)" },
                ]
              },
            ]
          },
          {
            id: "std_5",
            code: "TC 8",
            name: "Năng lực thực hành kỹ thuật chăm sóc",
            criteria: [
              {
                id: 18,
                name: "Tuân thủ quy trình kỹ thuật trong phạm vi chuyên môn hành nghề (Competent)",
                type: "single_choice",
                maxScore: 80,
                options: [
                  { score: 16, label: "Mức 2: Thực hiện QTKTĐD dưới sự hỗ trợ, hướng dẫn thường xuyên (10 điểm)" },
                  { score: 24, label: "Mức 3: Thực hiện đầy đủ các bước QTKTĐD nhưng thỉnh thoảng còn cần sự hỗ trợ, hướng dẫn  (20 điểm)" },
                  { score: 32, label: "Mức 4: Thực hiện QTKTĐD đầy đủ các bước, độc lập, thao tác đúng;          Đảm bảo an toàn người bệnh. Thỉnh thoảng còn cần sự giám sát (30 điểm)" },
                  { score: 40, label: "Mức 5: Thực hiện độc lập,hoàn chỉnh QTKTĐD; Đảm bảo an toàn Người bệnh;                                           Xử lý được các tình huống đặc biệt;           Có thể lý giải được các nguyên nhân và giải pháp trong QTKT khó (40 điểm)" },
                  { score: 60, label: "Thực hiện thành thạo hầu hết tất cả các kỹ thuật điều dưỡng đảm bảo an toàn, chất lượng Có khả năng hướng dẫn người khác (sinh viên, học viên, nhân viên mới) (Mentor)" },
                  { score: 80, label: "Hiểu biết sâu về chuyên môn, thực hiện được các kỹ thuật khó, có khả năng phát triển thành chứng cứ trong thực hành hoặc vận dụng những chứng cứ mới vào chăm sóc (Expert)" },
                ]
              },
            ]
          },
          {
            id: "std_6",
            code: "TC 9",
            name: "Năng lực dùng thuốc an toàn, hiệu quả",
            criteria: [
              {
                id: 19,
                name: "Tuân thủ quy định khi dùng thuốc; hướng dẫn dùng thuốc đúng, an toàn",
                type: "single_choice",
                maxScore: 30,
                options: [
                  { score: 2, label: "Mức 1: Thực hiện 5/10 nội dung (Thực hiện 5 đúng tại 2 thời điểm bắt buộc thực hiện) (2 điểm)" },
                  { score: 4, label: "Mức 2: Thực hiện 4/10 nội dung (Thực hiện 5 đúng tại 2 thời điểm bắt buộc thực hiện) (4 điểm)" },
                  { score: 6, label: "Mức 3: Thực hiện 3/10 nội dung (Thực hiện 5 đúng tại 2 thời điểm bắt buộc thực hiện) (6 điểm)" },
                  { score: 8, label: "Mức 4: Thực hiện 2/10 nội dung (Thực hiện 5 đúng tại 2 thời điểm bắt buộc thực hiện) (8 điểm)" },
                  { score: 10, label: "Mức 5: Thực hiện 1/10 nội dung  (Thực hiện 5 đúng tại 2 thời điểm bắt buộc thực hiện) (10 điểm)" },
                  { score: 20, label: "Hiểu biết và nhận biết được sự tương tác giữa thuốc và thuốc, thuốc và thức ăn" },
                  { score: 30, label: "Phát hiện và biết cách xử lý ban đầu các dấu hiệu có hại của thuốc và thông tin kịp thời đến BS, điều dưỡng phụ trách thuốc, ĐDTK" },
                ]
              },
            ]
          },
          {
            id: "std_7",
            code: "TC 10",
            name: "Năng lực chăm sóc liên tục",
            criteria: [
              {
                id: 20,
                name: "Kế hoạch chăm sóc được triển khai và người bệnh được theo dõi liên tục Hình thức đánh giá: Ktra KHCS trong HSBA +  Đánh giá thực hiện KHCS trên NB Tần suất đánh giá: Tối thiểu 2HS/tháng",
                type: "single_choice",
                maxScore: 10,
                options: [
                  { score: 2, label: "Mức 1: Có kế hoạch chăm sóc +Thực hiện  < 30% kế hoạch trên NB (2 điểm)" },
                  { score: 4, label: "Mức 2: Thực hiện 30 - 50% kế hoạch trên NB (4 điểm)" },
                  { score: 6, label: "Mức 3: Thực hiện 60 - 70% kế hoạch trên NB (6 điểm)" },
                  { score: 8, label: "Mức 4: Thực hiện 80% kế hoạch (8 điểm)" },
                  { score: 10, label: "Mức 5: Thực hiện 100% kế hoạch (10 điểm)" },
                ]
              },
              {
                id: 32,
                name: "Bàn giao tình trạng người bệnh với nhóm chăm sóc kế tiếp đầy đủ, chính xác Yêu cầu: Vấn đề bàn giao phải cụ thể, rõ ràng, không ghi chung chung Hình thức đánh giá: Ktra HSBA + tình trạng thực tế của NB Tần suất đánh giá: Tối thiểu 2HS/tháng",
                type: "single_choice",
                maxScore: 20,
                options: [
                  { score: 8, label: "Mức 2: Bàn giao ≤ 50% vấn đề cần theo dõi và chăm sóc của NB (14 điểm)" },
                  { score: 12, label: "Mức 3: Bàn giao 60 - 70% (16 điểm)" },
                  { score: 16, label: "Mức 4: Bàn giao 80 - 90% (18 điểm)" },
                  { score: 20, label: "Mức 5: Bàn giao 100% (20 điểm)" },
                ]
              },
              {
                id: 33,
                name: "Phối hợp hiệu quả với người bệnh, người nhà, và đồng nghiệp để đảm bảo người bệnh được theo dõi và chăm sóc liên tục Hình thức đánh giá: Ktra HSBA + tình trạng thực tế của NB Tần suất đánh giá: Tối thiểu 2HS/tháng",
                type: "single_choice",
                maxScore: 30,
                options: [
                  { score: 12, label: "Mức 2: NV nhận bàn giao nắm rõ được ≤ 50% vấn đề cần theo dõi và chăm sóc của NB  (24 điểm)" },
                  { score: 18, label: "Mức 3: NV nhận bàn giao nắm rõ được 60-80% vấn đề cần theo dõi và chăm sóc của NB  (26 điểm)" },
                  { score: 24, label: "Mức 4: NV nhận bàn giao nắm rõ được 100% vấn đề cần theo dõi và chăm sóc của NB  (28 điểm)" },
                  { score: 30, label: "Mức 5: NB hiểu rõ và phối hợp cùng ĐD theo dõi và chăm sóc cho NB (Đạt trên 60% nội dung hướng dẫn) (30 điểm)" },
                ]
              },
            ]
          },
          {
            id: "std_8",
            code: "TC 11",
            name: "Năng lực thực hiện CPR",
            criteria: [
              {
                id: 21,
                name: "Phát hiện sớm những thay đổi đột ngột về tình trạng sức khỏe của người bệnh",
                type: "single_choice",
                maxScore: 10,
                options: [
                  { score: 2, label: "Mức 1: Nhận biết được các dấu hiệu sau:  Sự thay đổi dấu hiệu sinh tồn (1 điểm);  Tri giác và nhận thức của người bệnh về không gian, thời gian và con người (1 điểm)" },
                  { score: 4, label: "Mức 2: Biết cách nhận biết và ghi nhận sự thay đổi của tri giác, dấu hiệu sinh tồn và các dấu hiệu đe dọa tính mạng của NB   (4 điểm)" },
                  { score: 6, label: "Mức 3: Biết cách nhận biết và ghi nhận sự thay đổi của tri giác, dấu hiệu sinh tồn và các dấu hiệu đe dọa tính mạng của NB  Kết quả đánh giá tình trạng NB đạt trên 80% mục tiêu mong muốn, nhưng chưa chuẩn xác.   (6 điểm)" },
                  { score: 8, label: "Mức 4: Thực hiện đầy đủ và độc lập trong đánh giá các dấu hiệu cảnh báo sớm. Kết quả đánh giá tình trạng NB đạt đủ các mục tiêu mong muốn và chuẩn xác. Tiên lượng được các thay đổi tình trạng người bệnh phù hợp với tình huống lâm sàng. (8 điểm)" },
                  { score: 10, label: "Mức 5: Thực hiện đầy đủ và độc lập trong đánh giá các dấu hiệu cảnh báo sớm. Kết quả đánh giá tình trạng NB đạt đủ các mục tiêu mong muốn và chuẩn xác. Tiên lượng được các thay đổi tình trạng người bệnh phù hợp với tình huống lâm sàng. Biết cách giải thích các thay đổi bất thường dựa trên các đánh giá tình trạng lâm sàng người bệnh. (10 điểm)" },
                ]
              },
              {
                id: 35,
                name: "Biết cách xử trí phù hợp và thông báo kịp thời đến người có trách nhiệm, yêu cầu hỗ trợ kịp thời",
                type: "single_choice",
                maxScore: 20,
                options: [
                  { score: 4, label: "Mức 1: Quan sát, đánh giá hoàn cảnh và đảm bảo an toàn trong tình huống cấp cứu NB; (2 điểm)" },
                  { score: 8, label: "Mức 2: Quan sát, đánh giá hoàn cảnh và đảm bảo an toàn trong tình huống cấp cứu NB  Chuyển NB đến khu vực an toàn hoặc đảm bào khu vực an toàn cho NB & NVYT. (4 điểm)" },
                  { score: 12, label: "Mức 3: Quan sát, đánh giá hoàn cảnh và đảm bảo an toàn trong tình huống cấp cứu NB  Chuyển NB đến khu vực an toàn hoặc đảm bào khu vực an toàn cho NB & NVYT. Có gọi hỗ trợ hoặc kích họạt hệ thống hỗ trợ cấp cứu  (6 điểm)" },
                  { score: 16, label: "Mức 4: Quan sát, đánh giá hoàn cảnh và đảm bảo an toàn trong tình huống cấp cứu NB  Chuyển NB đến khu vực an toàn hoặc đảm bào khu vực an toàn cho NB & NVYT. Có gọi hỗ trợ hoặc kích họạt hệ thống hỗ trợ cấp cứu Thực hiện được các nguyên tắc đảm bảo an toàn cho NB & NVYT.   (8 điểm)" },
                  { score: 20, label: "Mức 5: Quan sát, đánh giá hoàn cảnh và đảm bảo an toàn trong tình huống cấp cứu NB  Chuyển NB đến khu vực an toàn hoặc đảm bào khu vực an toàn cho NB & NVYT. Có gọi hỗ trợ hoặc kích họạt hệ thống hỗ trợ cấp cứu Thực hiện được các nguyên tắc đảm bảo an toàn cho NB & NVYT.  Đề xuất hay thực hiện các hành động phù hợp liên quan tình huống.. (10 điểm)" },
                ]
              },
              {
                id: 36,
                name: "Thực hiện cấp cứu đạt hiệu quả, phối hợp tốt với các thành viên trong nhóm cấp cứu",
                type: "single_choice",
                maxScore: 30,
                options: [
                  { score: 12, label: "Mức 2: Đánh giá được tình trạng ngưng hô hấp tuần hoàn ở người bệnh;  Cần sự hướng dẫn liên tục khi: - xác định được vị trí ấn tim và thể hiện kỹ thuật hỗ trợ thông khí cho NB; - Thực hiện được ấn tim: thông khí cho NB, nhưng kỹ thuật chưa chuẩn xác. (14 điểm)" },
                  { score: 18, label: "Mức 3: Đánh giá được tình trạng ngưng hô hấp tuần hoàn ở người bệnh;  Thỉnh thoảng cần sự hỗ trợ / nhắc nhở khi : - xác định được vị trí ấn tim và thể hiện kỹ thuật hỗ trợ thông khí cho NB; - Thực hiện được ấn tim : thông khí cho NB đảm bảo kỹ thuật chuẩn xác. (16 điểm)" },
                  { score: 24, label: "Mức 4: Đánh giá được tình trạng ngưng hô hấp tuần hoàn ở người bệnh;  Thực hiện độc lập và đầy đủ: - xác định được vị trí ấn tim; - thể hiện kỹ thuật hỗ trợ thông khí cho NB; - Thực hiện được ấn tim : thông khí cho NB đảm bảo đúng tỉ lệ, tần số thực hiện - Đảm bảo kỹ thuật chuẩn xác. Chuẩn bị được các dụng cụ hỗ trợ đường thở nâng cao, máy sốc điện. (18 điểm)" },
                  { score: 30, label: "Mức 5: Đánh giá được tình trạng ngưng hô hấp tuần hoàn ở người bệnh;  Thực hiện chuẩn xác  và đầy đủ: - xác định được vị trí ấn tim; - thể hiện kỹ thuật hỗ trợ thông khí cho NB; - Thực hiện được ấn tim : thông khí cho NB đảm bảo đúng tỉ lệ, tần số thực hiện Chuẩn bị được các dụng cụ hỗ trợ đường thở nâng cao; Biết được các quy tắc an toàn khi sử dụng máy sốc điện; Biết xác định các nguồn lực cần thiết chuẩn bị sẵn sàng cho tình huống cấp cứu (20 điểm)" },
                ]
              },
            ]
          },
          {
            id: "std_9",
            code: "TC 12",
            name: "Năng lực lập kế hoạch chăm sóc và can thiệp điều dưỡng",
            criteria: [
              {
                id: 22,
                name: "Lập được kế hoạch chăm sóc cho người bệnh có bệnh lý đơn giản, hoặc bệnh phân cấp 2,3;  Thực hiện các chăm sóc phù hợp, an toàn, hiệu quả",
                type: "single_choice",
                maxScore: 50,
                options: [
                  { score: 2, label: "Mức 1: Lập được kế hoạch chăm sóc cho NB cấp 2,3 và can thiệp  dưới 50% vấn đề trên NB (2 điểm)" },
                  { score: 4, label: "Mức 2: Lập được kế hoạch chăm sóc cho NB cấp 2,3 và can thiệp từ 50%- 70%  các vấn đề trên NB.   (4 điểm)" },
                  { score: 6, label: "Mức 3: Lập được kế hoạch chăm sóc cho NB cấp 2,3 và can thiệp từ 70% - 80%  các vấn đề trên NB.   (6 điểm)" },
                  { score: 8, label: "Mức 4: Lập được kế hoạch chăm sóc cho NB cấp 2,3 và can thiệp can thiệp từ 90% các vấn đề trên NB; các can thiệp có thể lượng giá mỗi ngày  (8 điểm)" },
                  { score: 10, label: "Mức 5: Lập được kế hoạch chăm sóc cho NB cấp 2,3 và can thiệp đầy đủ các vấn đề trên NB  100%; các can thiệp có thể lượng giá mỗi ngày; lập kế hoạch giáo dục sức khỏe khi NB ra viện  (10 điểm)" },
                  { score: 20, label: "Lập được kế hoạch chăm sóc cho người bệnh có bệnh lý phức tạp (nhiều bệnh đi kèm), hoặc bệnh phân cấp 1, bệnh nặng;  Tổ chức thực hiện các chăm sóc phù hợp, an toàn, hiệu quả" },
                  { score: 30, label: "Lập kế hoạch người bệnh có nhiều bệnh lý kết hợp và theo dõi việc thực hiện, đánh giá kết quả của quá trình chăm sóc và điều chỉnh kế hoạch chăm sóc phù hợp" },
                  { score: 50, label: "Cải tiến biểu mẫu ghi chép, đem lại hiệu quả cao, tiết kiệm được thời gian và nhân rộng mô hình cho nhiều khoa áp dụng" },
                ]
              },
            ]
          },
          {
            id: "std_10",
            code: "TC 13",
            name: "Thiết lập mối quan hệ với người bệnh, GDSK hiệu quả",
            criteria: [
              {
                id: 23,
                name: "Tạo dựng niềm tin với người bệnh, người nhà và đồng nghiệp; Dành thời gian cần thiết để giao tiếp với người bệnh, người nhà và thành viên trong nhóm chăm sóc",
                type: "single_choice",
                maxScore: 50,
                options: [
                  { score: 2, label: "Mức 1: Đồng phục: đầy đủ, nguyên vẹn, sạch, thẳng.                         Thái độ: Hòa nhã, nhiệt tình.                            Sử dụng kính ngữ: xưng hô phù hợp.                Chủ động cung cấp thông tin cần thiết, phù hợp cho NB/NN            Tỉ lệ thực hiện đạt <50% (2 điểm)" },
                  { score: 4, label: "Mức 2: Đồng phục: đầy đủ, nguyên vẹn, sạch, thẳng.                          Thái độ: Hòa nhã, nhiệt tình.                               Sử dụng kính ngữ: xưng hô phù hợp.               Chủ động cung cấp thông tin cần thiết, phù hợp cho NB/NN            Tỉ lệ thực hiện đạt 50- 59%  (4 điểm)" },
                  { score: 6, label: "Mức 3: Đồng phục: đầy đủ, nguyên vẹn, sạch, thẳng.                          Thái độ: Hòa nhã, nhiệt tình.                            Sử dụng kính ngữ: xưng hô phù hợp.               Chủ động cung cấp thông tin cần thiết, phù hợp cho NB/NN           Tỉ lệ thực hiện đạt 60- 74% (6 điểm)" },
                  { score: 8, label: "Mức 4: Đồng phục: đầy đủ, nguyên vẹn, sạch, thẳng.                          Thái độ: Hòa nhã, nhiệt tình.                             Sử dụng kính ngữ: xưng hô phù hợp.               Chủ động cung cấp thông tin cần thiết, phù hợp cho NB/NN           Tỉ lệ thực hiện đạt 75 - 89% (8 điểm)" },
                  { score: 10, label: "Mức 5: Đồng phục: đầy đủ, nguyên vẹn, sạch, thẳng.                          Thái độ: Hòa nhã, nhiệt tình.                            Sử dụng kính ngữ: xưng hô phù hợp.               Chủ động cung cấp thông tin cần thiết, phù hợp cho NB/NN            Tỉ lệ thực hiện đạt ≥ 90% (10 điểm)" },
                  { score: 20, label: "Lắng nghe và giúp người bệnh giải quyết được các lo lắng, băn khoan của người bệnh, người nhà" },
                  { score: 30, label: "Xây dựng kế hoạch GDSK phù hợp với bệnh tật và văn hóa, tín ngưỡng của cá nhân, gia đình và xã hội; Tài liệu GDSK phù hợp với trình độ của đối tượng" },
                  { score: 40, label: "Truyền thông tương tác với người bệnh; sử dụng thành thạo các phương tiện sẵn có của bệnh viện; đảm bảo chất lượng truyền thông: chính xác, ngắn gọn, rõ ràng, dễ hiểu, không vi phạm phạm trù văn hóa, tín ngưỡng" },
                  { score: 50, label: "Biên soạn bài giáo dục sức khỏe cho người bệnh, áp dụng trên quy mô toàn bệnh viện (xác nhận của P.ĐD); Thực hiện giáo dục sức khỏe cho người bệnh cấp bệnh viện, đem lại hiệu quả tốt" },
                ]
              },
            ]
          },
          {
            id: "std_11",
            code: "TC 14",
            name: "Quản lý ghi chép và sử dụng hồ sơ bệnh án hiệu quả",
            criteria: [
              {
                id: 24,
                name: "Ghi chép hồ sơ điều dưỡng bảo đảm tính khách quan, chính xác, đầy đủ và kịp thời",
                type: "single_choice",
                maxScore: 50,
                options: [
                  { score: 2, label: "Mức 1: >20% (2 điểm)" },
                  { score: 4, label: "Mức 2: 16- 20% (4 điểm)" },
                  { score: 6, label: "Mức 3: 11 - 15% (6 điểm)" },
                  { score: 8, label: "Mức 4: 6 - 10% (8 điểm)" },
                  { score: 10, label: "Mức 5: ≤ 5% (10 điểm)" },
                  { score: 20, label: "Sử dụng hiệu quả các dữ liệu thu thập được về tình trạng sức khỏe người bệnh trong việc xây dựng kế hoạch chăm sóc" },
                  { score: 30, label: "Sử dụng công nghệ thông tin 1 cách hiệu quả trong việc tích hợp và cải tiến các biểu mẫu ghi chép" },
                  { score: 50, label: "Ứng dụng kết quả ghi chép, phân tích, diễn giải, và thực hiện nghiên cứu cải tiến, áp dụng thành công trên nhiều khoa" },
                ]
              },
            ]
          },
          {
            id: "std_12",
            code: "TC 15",
            name: "Giao tiếp hiệu quả với người bệnh, người nhà, đồng nghiệp và cấp trên",
            criteria: [
              {
                id: 25,
                name: "Nhận thức được sự quan trọng trong việc giao tiếp với người bệnh, người nhà và nhân viên; Thường xuyên sử dụng AIDET trong giao tiếp",
                type: "single_choice",
                maxScore: 10,
                options: [
                  { score: 2, label: "Mức 1: Trình bày được 5 yếu tố trong mô hình AIDET (2 điểm)" },
                  { score: 4, label: "Mức 2: Ứng dụng được ≤  3/5 yếu tố AIET trong giao tiếp với NB (4 điểm)" },
                  { score: 6, label: "Mức 3: Ứng dụng được ≤  4/5 yếu tố AIET trong giao tiếp với NB (6 điểm)" },
                  { score: 8, label: "Mức 4: Ứng dụng được 5 yếu tố AIET trong giao tiếp với NB NB biết được những thông tin được cung cấp (I,D,E) (8 điểm)" },
                  { score: 10, label: "Mức 5: Ứng dụng được 5 yếu tố AIET trong giao tiếp với NB NB hiểu rõ được những thông tin được cung cấp  (10 điểm)" },
                ]
              },
              {
                id: 26,
                name: "Chủ động chia sẻ thông tin về quá trình chăm sóc người bệnh với đồng nghiệp; Thường xuyên ứng dụng hiệu quả SBAR trong bàn giao bệnh, trao đổi thông tin giữa đồng nghiệp",
                type: "single_choice",
                maxScore: 10,
                options: [
                  { score: 2, label: "Mức 1: Trình bày được định nghĩa SBAR Chưa ứng dụng SBAR trong bàn giao NB và trao đổi thông tin với đồng nghiệp (2 điểm)" },
                  { score: 4, label: "Mức 2: Ứng dụng SBAR trong báo cáo bệnh với Bác sĩ hoặc trong bàn giao phiên trực, chuyển khoa  (4 điểm)" },
                  { score: 6, label: "Mức 3: Ứng dụng SBAR trong báo cáo bệnh với BS và trong bàn giao phiên trực, chuyển khoa, nhưng chưa đầy đủ S, B, A, R (6 điểm)" },
                  { score: 8, label: "Mức 4: Ứng dụng SBAR trong báo cáo bệnh với BS và trong bàn giao phiên trực, chuyển khoa, và đầy đủ S, B, A, R, nhưng chưa đủ các thông tin của NB (8 điểm)" },
                  { score: 10, label: "Mức 5: Ứng dụng SBAR trong báo cáo bệnh với BS và trong bàn giao phiên trực, chuyển khoa, và đầy đủ S, B, A, R, và đầy đủ các thông tin của NB (10 điểm)" },
                ]
              },
              {
                id: 27,
                name: "Thể hiện lời nói, cử chỉ động viên, khuyến khích người bệnh an tâm điều trị",
                type: "single_choice",
                maxScore: 10,
                options: [
                  { score: 2, label: "Mức 1: Thái độ giao tiếp kém, có NB phàn nàn (2 điểm)" },
                  { score: 4, label: "Mức 2: Sử dụng từ ngữ chưa rõ ràng, dễ gây hiểu lầm (4 điểm)" },
                  { score: 6, label: "Mức 3: Sử dụng từ ngữ rõ ràng, dễ hiểu, nhưng chưa tích cực lắng nghe phản hồi của NB (6 điểm)" },
                  { score: 8, label: "Mức 4: Sử dụng từ ngữ rõ ràng, phù hợp với tình huống, lắng nghe NB, thái độ vui vẻ, ân cần, lịch sự (8 điểm)" },
                  { score: 10, label: "Mức 5: Luôn chia sẽ, động viên NB, thuyết phục được những NB khó tính hợp tác điều trị và chăm sóc  (10 điểm)" },
                ]
              },
              {
                id: 28,
                name: "Hợp tác làm việc nhóm và làm việc độc lập hiệu quả; Chia sẻ thông tin 1 cách hiệu quả; Thực hiện vai trò đại diện hoặc biện hộ cho người bệnh để đảm bảo các quyền, lợi ích và vì sự an toàn người bệnh.",
                type: "single_choice",
                maxScore: 10,
                options: [
                  { score: 2, label: "Mức 1: Hoàn thành công việc được phân công trong nhóm, thụ động, không có ý kiến đóng góp, không hỗ trợ các thành viên trong nhóm  (2 điểm)" },
                  { score: 4, label: "Mức 2: Hoàn thành công việc được phân công  và hỗ trợ các thành viên trong nhóm, chưa có ý kiến tích cực trong phát triển nhóm (4 điểm)" },
                  { score: 6, label: "Mức 3: Hoàn thành công việc được phân công và hỗ trợ nhóm, có ý kiến đóng góp tích cực (6 điểm)" },
                  { score: 8, label: "Mức 4: Nhiều ý kiến đóng góp tích cực, chia sẽ thông tin hiệu quả, thống nhất được ý kiến tập thể (8 điểm)" },
                  { score: 10, label: "Mức 5: Thực hiện vai trò đại diện hoặc biện hộ cho người bệnh để đảm bảo các quyền, lợi ích và vì sự an toàn người bệnh. (10 điểm)" },
                ]
              },
            ]
          },
        ]
      },
      {
        id: "domain_3",
        code: "I",
        name: "NĂNG LỰC ĐÀO TẠO  NGHIÊN CỨU KHOA HỌC THỰC HÀNH DỰA TRÊN CHỨNG CỨ (EBP)",
        maxScore: 125,
        standards: [
          {
            id: "std_13",
            code: "TC 16",
            name: "Đào tạo",
            criteria: [
              {
                id: 29,
                name: "- Phân tích được mối quan hệ giữa nhu cầu đào tạo với trình độ, vị trí việc làm của đối tượng thuộc phạm vi phụ trách (5 điểm)",
                type: "single_choice",
                maxScore: 5,
                options: [
                  { score: 3, label: "Mức 3: Cần sự hướng dẫn trong tìm hiểu, phân tích mối tương quan giữa nhu cầu đào tạo với trình độ, vị trí làm việc; (3 điểm)" },
                  { score: 4, label: "Mức 4: Thực hiện và báo cáo kết quả khảo sát, nghiên cứu mối quan hệ giữa nhu cầu đào tạo với trình độ, vị trí làm việc (4 điểm)" },
                  { score: 5, label: "Mức 5: Thực hiện và báo cáo kết quả khảo sát, nghiên cứu mối quan hệ giữa nhu cầu đào tạo với trình độ, vị trí làm việc; Đề xuất được các giải pháp dựa trên kết quả báo cáo. (5 điểm)" },
                  { score: 5, label: "- Xây dựng được kế hoạch đào tạo (5 điểm)" },
                ]
              },
              {
                id: 30,
                name: "Đề xuất, xây dựng các phương pháp đào tạo linh động, phù hợp với hoàn cảnh đảm bảo nâng cao chất lượng đào tạo",
                type: "single_choice",
                maxScore: 10,
                options: [
                  { score: 6, label: "Mức 3: Cần sự hỗ trợ trong xây dựng phương pháp đào tạo phù hợp với yêu cầu của nội dung đào tạo.  (6 điểm)" },
                  { score: 8, label: "Mức 4: Có phương pháp đào tạo phù hợp với nội dung, yêu cầu của nội dung đào tạo.  Vận dụng được phương pháp đào tạo phù hợp với hoàn cảnh đào tạo. (8 điểm)" },
                  { score: 10, label: "Mức 5: Có sự thay đổi thường xuyên các chương trình, nội dung đào tạo hàng năm  Vận dụng đa dạng trên ba phương pháp đào tạo phù hợp với yêu cầu của nội dung đào tạo  (10 điểm)" },
                ]
              },
              {
                id: 31,
                name: "Tổ chức thực hiện được kế hoạch đào tạo và tham gia đào tạo theo đúng tiến độ và đạt chất lượng: -Kế hoạch đào tạo, tham gia đào tạo theo đúng tiến độ (5đ) -Kế hoạch đào tạo đạt chất lượng (5đ)",
                type: "single_choice",
                maxScore: 5,
                options: [
                  { score: 3, label: "Mức 3: Cần sự hỗ trợ, hoặc giám sát tiến độ thực hiện kế hoạch đào tạo;  Có  dưới 2 chương trình  đào tạo trễ hạn dưới 1 tháng so với kế hoạch năm (3 điểm)" },
                  { score: 4, label: "Mức 4: Độc lập theo dõi kế hoạch đào tạo, tổ chức đào tạo đúng tiến độ;  Không có chương trình trễ hạn. (4 điểm)" },
                  { score: 5, label: "Mức 5: Biết phối hợp nhiều phương pháp, kỹ năng theo dõi kế hoạch đào tạo, tổ chức đào tạo đúng tiến độ;  Hoàn thành các nội dung, chương trình đào tạo sớm hơn tiến độ trong kế hoạch đề ra (5 điểm)" },
                ]
              },
              {
                id: 32,
                name: "Đánh giá được hiệu quả đào tạo: thống kê, phân tích, diễn giải và báo cáo theo kế hoạch; Có chỉ ra những nhược điểm khắc cần khắc phục và đề xuất giải pháp cải tiến chất lượng (-Thống kê, phân tích, diễn giải và báo cáo theo kế hoạch (5đ) -Cải tiến chất lượng đào tạo (5đ))",
                type: "single_choice",
                maxScore: 0,
                options: [
                  { score: 3, label: "Mức 3: Cần hướng dẫn trong đánh giá, đo lường hiệu quả trước & sau đào tạo; (3 điểm)" },
                  { score: 4, label: "Mức 4: Độc lập đánh giá, đo lường và báo cáo hiệu quả trước & sau đào tạo;  Cần sự hướng dẫn trong phân tích, diễn giải kết quả đo lường. (4 điểm)" },
                  { score: 5, label: "Mức 5: Biết cách vận dụng nhiều kỹ năng đánh giá, đo lường và báo cáo hiệu quả trước & sau đào tạo;  Đưa ra được phân tích, diễn giải kết quả đo lường, thống kê (5 điểm)" },
                ]
              },
              {
                id: 33,
                name: "Xây dựng được công cụ, phương pháp đánh giá thay đổi kiến thức của người được đào tạo và sau khi đào tạo",
                type: "single_choice",
                maxScore: 5,
                options: [
                  { score: 3, label: "Mức 3: Cần sự hướng dẫn liên tục, thường xuyên trong việc tìm, xây dựng công cụ, phương pháp đánh giá kiến thức của học viên. (3 điểm)" },
                  { score: 4, label: "Mức 4: Độc lập đưa ra được công cụ, phương pháp trong đánh giá kiến thức của học viên, viên chức trước & sau đào tạo.  Ứng dụng một phương pháp, công cụ đánh giá kiến thức học viên. (4 điểm)" },
                  { score: 5, label: "Mức 5: Tự tin, thành thạo trong  áp dụng công cụ, phương pháp đánh giá kiến thức của học viên, viên chức trước & sau đào tạo. Vận dụng trên hai công cụ đánh giá, đo lường kiến thức học viên. Giải thích được cơ sở khoa học cho phương pháp đánh giá. (5 điểm)" },
                ]
              },
              {
                id: 34,
                name: "Tham gia giảng dạy ít nhất 2 bài/năm/khoa hoặc 1 bài toàn bệnh viện",
                type: "single_choice",
                maxScore: 5,
                options: [
                  { score: 1, label: "Mức 1: có tham gia  \" đạt 5 điểm" },
                ]
              },
            ]
          },
          {
            id: "std_14",
            code: "TC 17",
            name: "Nghiên cứu khoa học",
            criteria: [
              {
                id: 35,
                name: "Hiểu biết về các kỹ thuật nghiên cứu, khảo sát, đánh giá, áp dụng phù hợp trong chăm sóc người bệnh",
                type: "single_choice",
                maxScore: 10,
                options: [
                  { score: 2, label: "Mức 1: Có tham gia NCKH với vai trò đối tượng lấy mẫu (2 điểm)" },
                  { score: 6, label: "Mức 3: Có được đào tạo cơ bản về NCKH và tham gia NCKH với vai trò người đi lấy mẫu (6 điểm)" },
                  { score: 8, label: "Mức 4: Có chứng chỉ/ chứng nhận đào tạo chuyên về NCKH và là thành viên của nhóm thực hiện đề tài NCKH  (8 điểm)" },
                  { score: 10, label: "Mức 5: Tham gia viết đề cương nghiên cứu khoa học (10 điểm)" },
                ]
              },
              {
                id: 36,
                name: "Sử dụng thành thạo công nghệ thông tin trong thu thập, phân tích số liệu (SPSS, STATA, R)",
                type: "single_choice",
                maxScore: 10,
                options: [
                  { score: 4, label: "Mức 2: Biết cách tìm và trích dẫn tài liệu liên quan đến nghiên cứu có giá trị (4 điểm)" },
                  { score: 6, label: "Mức 3: Biết cách tìm và trích dẫn tài liệu liên quan đến nghiên cứu có giá trị  Biết sử dụng phần mềm nhập liệu và phân tích số liệu (SPSS, STATA, R, …)  nhưng cần sử hỗ trợ  (6 điểm)" },
                  { score: 8, label: "Mức 4: Biết sử dụng thành thạo phần mềm nhập liệu và phân tích số liệu (SPSS, STATA, R, …)  (8 điểm)" },
                  { score: 10, label: "Mức 5: Có khả năng hướng dẫn các phần mềm nhập liệu và phân tích số liệu trong  NCKH (10 điểm)" },
                ]
              },
              {
                id: 37,
                name: "Chủ nhiệm đề tài cấp cơ sở, có công bố trên tạp chí trong nước",
                type: "single_choice",
                maxScore: 10,
                options: [
                  { score: 2, label: "Mức 1: Có tham gia NCKH với vai trò là người hỗ trợ chính/ Thư ký đề tài đã được phê duyệt đề cương và đang thực hiện (2 điểm)" },
                  { score: 4, label: "Mức 2: Là chủ nhiệm đề tài NCKH đã được phê duyệt đề cương và đang thực hiện. (4 điểm)" },
                  { score: 6, label: "Mức 3: Là chủ nhiệm đề tài NCKH đã được công nhận  (6 điểm)" },
                  { score: 8, label: "Mức 4: Là chủ nhiệm đề tài NCKH cấp cơ sở được công nhận và công bố trên tạp chí có số ISSN trong nước trong vòng 3 năm. (8 điểm)" },
                  { score: 10, label: "Mức 5: Là chủ nhiệm đề tài NCKH cấp cơ sở được công nhận và công bố trên tạp chí có số ISSN trong nước trong vòng 1 năm. (10 điểm)" },
                ]
              },
              {
                id: 38,
                name: "Chủ nhiệm đề tài cấp cơ sở, có công bố trên tạp chí trong nước (≥2 bài/năm); Hoặc chủ nhiệm đề tài cấp Thành phố (tính 1 lần)",
                type: "single_choice",
                maxScore: 15,
                options: [
                  { score: 3, label: "Mức 1: Có tham gia ít nhất 2 đề tài NCKH với vai trò là người hỗ trợ chính/ Thư ký đề tài đã được phê duyệt đề cương và đang thực hiện (5 điểm)" },
                  { score: 6, label: "Mức 2: Là chủ nhiệm ít nhất 2 đề tài NCKH đã được phê duyệt đề cương và đang thực hiện. (10 điểm)" },
                  { score: 9, label: "Mức 3: Là chủ nhiệm ít nhất 2 đề tài đề tài NCKH đã hoàn thành đang trong quá trình chờ thẩm định (9 điểm)" },
                  { score: 12, label: "Mức 4: Là chủ nhiệm đề tài cấp cơ sở ≥ 2 bài/ năm hoặc đề tài cấp tỉnh/ thành phố đã được công nhận và công bố trên tạp chí có số ISSN trong nước trong vòng 2 năm (12 điểm)" },
                  { score: 15, label: "Mức 5: Là chủ nhiệm đề tài cấp cơ sở ≥ 2 bài/ năm hoặc đề tài cấp tỉnh/ thành phố đã được công nhận và công bố trên tạp chí có số ISSN trong nước và được mời báo cáo hội nghị điều dưỡng ít nhất 2 lần về đề tài đã công bố trong vòng 2 năm (15 điểm)" },
                ]
              },
              {
                id: 39,
                name: "Đăng bài báo nước ngoài  Hoặc chủ nhiệm đề tài cấp nhà nước",
                type: "single_choice",
                maxScore: 20,
                options: [
                  { score: 4, label: "Mức 1: Có tên trong bài báo được đăng tạp chí uy tín ở nước ngoài hoặc đang tham gia đề tài cấp nhà nước, đề tài đã được phê duyệt đề cương và đang trong quá trình hoàn tất (4 điểm)" },
                  { score: 8, label: "Mức 2: Có tên trong bài báo được đăng tạp chí uy tín ở nước ngoài hoặc  tham gia đề tài cấp nhà nước, đề tài đã hoàn thành và đnag chờ thẩm định (8 điểm)" },
                  { score: 12, label: "Mức 3: là chủ nhiệm đề tài được đăng tạp chí uy tín ở nước ngoài hoặc  tham gia đề tài cấp nhà nước, đề tài đã hoàn thành và đang chờ thẩm định (12 điểm)" },
                  { score: 16, label: "Mức 4: Là chủ nhiệm đề tài được đăng tạp chí uy tín ở nước ngoài hoặc đề tài cấp nhà nước được công nhận trong vòng 5 năm (16 điểm)" },
                  { score: 20, label: "Mức 5: Là chủ nhiệm đề tài được đăng tạp chí uy tín ở nước ngoài hoặc đề tài cấp nhà nước được công nhận và mời báo cáo trong các hội nghị quốc tế ít nhất 1 lần về đề tài trong vòng 5 năm (20 điểm)" },
                ]
              },
            ]
          },
          {
            id: "std_15",
            code: "TC 18",
            name: "Thực hành dựa trên bằng chứng",
            criteria: [
              {
                id: 40,
                name: "Thực hiện nghiên cứu và có giải pháp thích hợp dựa trên kết quả nghiên cứu",
                type: "single_choice",
                maxScore: 10,
                options: [
                  { score: 2, label: "Mức 1: Có tham gia ít nhất 1 đề tài NCKH/ SKCT liên quan đến thực hành chăm sóc đã được phê duyệt đề cương và đang trong quá trình thực hiện (2 điểm)" },
                  { score: 4, label: "Mức 2: là chủ nhiệm ít nhất 1 đề tài NCKH/ SKCT liên quan đến thực hành chăm sóc đã được phê duyệt đề cương và đang trong quá trình thực hiện (4 điểm)" },
                  { score: 6, label: "Mức 3: Là chủ nhiệm ít nhất 1 đề tài NCKH/ SKCT liên quan đến thực hành chăm sóc đã hoàn thành, đang chờ thẩm định. (6 điểm)" },
                  { score: 8, label: "Mức 4: Là chủ nhiệm ít nhất 1 đề tài NCKH/ SKCT liên quan đến thực hành chăm sóc đã được công nhận. (8 điểm)" },
                  { score: 10, label: "Mức 5: Là chủ nhiệm đề tài mà  giải pháp cải tiến/ thay đổi thực hành chăm sóc dựa trên kết quả nghiên cứu được phân tích và đánh giá khả năng áp dụng (10 điểm)" },
                ]
              },
              {
                id: 41,
                name: "Ứng dụng kết quả NCKH vào thực hành chăm sóc, quản lý công việc",
                type: "single_choice",
                maxScore: 10,
                options: [
                  { score: 2, label: "Mức 1: Là chủ nhiệm đề tài mà giải pháp có kế hoạch áp dụng tại ít nhất 1 khoa/ 1 nhóm đối tượng liên quan. (2 điểm)" },
                  { score: 4, label: "Mức 2: Là chủ nhiệm đề tài mà giải pháp cải tiến/ thay đổi thực hành chăm sóc dựa trên kết quả nghiên cứu được áp dụng ít nhất tại một khoa/ một nhóm đối tượng liên quan (4 điểm)" },
                  { score: 6, label: "Mức 3: Là chủ nhiệm đề tài mà giải pháp cải tiến/ thay đổi thực hành chăm sóc dựa trên kết quả nghiên cứu được áp dụng ít nhất tại một khoa/ một nhóm đối tượng liên quan và đánh giá kết quả áp dụng (6 điểm)" },
                  { score: 8, label: "Mức 4: Là chủ nhiệm đề tài mà giải pháp cải tiến/ thay đổi thực hành chăm sóc được đánh giá hiệu quả áp dụng (8 điểm)" },
                  { score: 10, label: "Mức 5: Là chủ nhiệm đề tài mà giải pháp cải tiến/ thay đổi thực hành chăm sóc được đánh giá hiệu quả áp dụng và được áp dụng toàn viện (10 điểm)" },
                ]
              },
              {
                id: 42,
                name: "Sử dụng các bằng chứng từ nghiên cứu khoa học để nâng cao chất lượng thực hành chăm sóc",
                type: "single_choice",
                maxScore: 10,
                options: [
                  { score: 2, label: "Mức 1: Là chủ nhiệm đề tài mà  giải pháp cải tiến/ thay đổi thực hành chăm sóc dựa trên kết quả nghiên cứu được bệnh viện/ trường công nhận và được giải thưởng của trường/ bệnh viện  (2 điểm)" },
                  { score: 4, label: "Mức 2: Là chủ nhiệm đề tài mà  giải pháp cải tiến/ thay đổi thực hành chăm sóc dựa trên kết quả nghiên cứu được công nhận và công bố trên các tạp chí có uy tín trong nước (4 điểm)" },
                  { score: 6, label: "Mức 3: Là chủ nhiệm đề tài mà  giải pháp cải tiến/ thay đổi thực hành chăm sóc dựa trên kết quả nghiên cứu được nhận giải thưởng uy tín trong nước (6 điểm)" },
                  { score: 8, label: "Mức 4: Là chủ nhiệm đề tài mà  giải pháp cải tiến/ thay đổi thực hành chăm sóc dựa trên kết quả nghiên cứu được công nhận và công bố trên các tạp chí có uy tín trong nước. Đang trong quá trình đăng ký bản quyền sở hữu trí tuệ (8 điểm)" },
                  { score: 10, label: "Mức 5: Kết quả NCKH/SKCT, phát minh mới được đăng ký bản quyền sở hữu trí tuệ trong vòng 2 năm (10 điểm)" },
                ]
              },
            ]
          },
        ]
      },
      {
        id: "domain_4",
        code: "I",
        name: "NĂNG LỰC LÃNH ĐẠO & QUẢN LÝ",
        maxScore: 100,
        standards: [
          {
            id: "std_16",
            code: "TC 19",
            name: "Quản lý và sử dụng các trang thiết bị, dụng cụ y tế có hiệu quả",
            criteria: [
              {
                id: 43,
                name: "Hiểu biết về quy trình, quy định quản lý, sử dụng trang thiết bị, dụng cụ y tế, vật tư phục vụ cho chăm sóc",
                type: "single_choice",
                maxScore: 5,
                options: [
                  { score: 1, label: "Mức 1: Biết được: các loại máy, VTYT tại khoa (1 điểm)" },
                  { score: 2, label: "Mức 2: Biết sử dụng, vận hành các trang thiết bị, VTYT tại khoa cần sự hỗ trợ thường xuyên. (2 điểm)" },
                  { score: 3, label: "Mức 3: Biết sử dụng, vận hành các trang thiết bị, VTYT tại khoa thỉnh thoảng cần sự hỗ trợ. (3 điểm)" },
                  { score: 4, label: "Mức 4: Biết sử dụng, vận hành các trang thiết bị, VTYT tại khoa một cách độc lập. (4 điểm)" },
                  { score: 5, label: "Mức 5: Có khả năng hướng dẩn quy trình, quy định về sử dụng, vận hành các trang thiết bị, VTYT tại khoa. (5 điểm)" },
                ]
              },
              {
                id: 44,
                name: "Đề xuất các thiết bị, vật tư phù hợp;",
                type: "single_choice",
                maxScore: 5,
                options: [
                  { score: 3, label: "Mức 3: Xác định được các yêu cầu về trang thiết bị và vật tư phù hợp với chăm sóc bệnh nhân dựa trên bằng chứng khoa học. (3 điểm)" },
                  { score: 4, label: "Mức 4: Xác định được các yêu cầu về trang thiết bị và vật tư phù hợp với chăm sóc bệnh nhân dựa trên bằng chứng khoa học và có thực hiện đánh giá tại khoa đơn vị  (4 điểm)" },
                  { score: 5, label: "Mức 5: Đề xuất được các VTYT, trang thiết bị dựa trên bằng chứng khoa học và đánh giá thực tế tại khoa, đon vị (5 điểm)" },
                ]
              },
              {
                id: 45,
                name: "Lập kế hoạch bảo quản TTB, vật tư 1 cách hiệu quả",
                type: "single_choice",
                maxScore: 10,
                options: [
                  { score: 6, label: "Mức 3: Lập được kế hoạch bảo quản trang thiết bị, vật tư (6 điểm)" },
                  { score: 8, label: "Mức 4: Đảm bảo thực hiện kế hoạch đúng tiến độ (8 điểm)" },
                  { score: 10, label: "Mức 5: Có sáng kiến cải tiến trong bảo quản trang thiết bị, vật tư (10 điểm)" },
                ]
              },
              {
                id: 46,
                name: "Sử dụng thành thạo các trang thiết bị, phương tiện sử dụng trong chăm sóc an toàn, hiệu quả",
                type: "single_choice",
                maxScore: 10,
                options: [
                  { score: 6, label: "Mức 3: Vận dụng thành thạo và xử lý các vấn đề phát sinh trong quá trình sử dụng các trang thiết bị, VTYT tại khoa (6 điểm)" },
                  { score: 8, label: "Mức 4: Hiểu rõ nguyên lý hoạt động và phòng ngửa các sự cố liên quan đến việc sử dụng trang thiết bị (8 điểm)" },
                  { score: 10, label: "Mức 5: Đánh giá, đo lường việc sử dụng, và đề xuất cải tiến chất lượng an toàn và hiệu quả. (10 điểm)" },
                ]
              },
            ]
          },
          {
            id: "std_17",
            code: "TC 20",
            name: "Sử dụng nguồn tài chính thích hợp để chăm sóc NB hiệu quả",
            criteria: [
              {
                id: 47,
                name: "Đánh giá được hiệu quả kinh tế của các biện pháp chăm sóc tại bệnh viện",
                type: "single_choice",
                maxScore: 10,
                options: [
                  { score: 8, label: "Mức 4: Có nghiên cứu/đề án khảo sát hiệu quả kinh tế của một biện pháp, lĩnh vực chăm sóc tại khoa, đơn vị. (5 điểm)" },
                  { score: 10, label: "Mức 5: Có nghiên cứu/đề án khảo sát hiệu quả kinh tế của một biện pháp, lĩnh vực chăm sóc tại các khoa có nhu cầu. (10 điểm)" },
                ]
              },
              {
                id: 48,
                name: "Xây dựng kế hoạch sử dụng các nguồn lực trong chăm sóc người bệnh trong phạm vi phân công hiệu quả",
                type: "single_choice",
                maxScore: 10,
                options: [
                  { score: 8, label: "Mức 4: Có đánh giá, phân tích nhu cầu nguồn nhân lực phục vụ cho công tác chăm sóc hiệu quả  (5 điểm)" },
                  { score: 10, label: "Mức 5: Xây dựng được kế hoạch phân bổ nguồn nhân lực phù hợp nhu cầu chăm sóc tại khoa, đơn vị. (10 điểm)" },
                ]
              },
              {
                id: 49,
                name: "Tổ chức, triển khai thực hiện kế hoạch hiệu quả",
                type: "single_choice",
                maxScore: 10,
                options: [
                  { score: 8, label: "Mức 4: Có kế hoạch quản lý và dự toán nguồn tài chính phục vụ cho chăm sóc tại khoa, đơn vị.  (5 điểm)" },
                  { score: 10, label: "Mức 5: Triển khai đánh giá và đo lường hiệu quả của kế hoạch. (10 điểm)" },
                ]
              },
              {
                id: 50,
                name: "Có đề án cải tiến giúp bệnh viện ứng dụng hiệu quả",
                type: "single_choice",
                maxScore: 10,
                options: [
                  { score: 8, label: "Mức 4: Triển khai và báo cáo kết quả đề án cải tiến tại khoa, đơn vị. (5 điểm)" },
                  { score: 10, label: "Mức 5: Đề án được thẩm định và công nhận hiệu quả bởi Hội đồng chuyên môn. Được triển khai ứng dụng tại bệnh viện. (10 điểm)" },
                ]
              },
            ]
          },
          {
            id: "std_18",
            code: "TC 21",
            name: "Thiết lập môi trường làm việc hiệu quả, an toàn",
            criteria: [
              {
                id: 51,
                name: "Thiết bị các nội dung liên quan đến sức khỏe nghề nghiệp và luật pháp về an toàn lao động",
                type: "single_choice",
                maxScore: 5,
                options: [
                  { score: 3, label: "Mức 3: Có kiến thức về an toàn lao động, sức khỏe nghề nghiệp  (3 điểm)" },
                  { score: 4, label: "Mức 4: Có phổ biến, triển khai cho đồng nghiệp các nội dung liên quan đến sức khỏe nghề nghiệp và luật pháp về an toàn lao động  (4 điểm)" },
                  { score: 5, label: "Mức 5: Đề xuất được các giải pháp bảo vệ sức khỏe nghề nghiệp và tăng cường lao động. (5 điểm)" },
                ]
              },
              {
                id: 52,
                name: "Tuân thủ các tiêu chuẩn và quy tắc về an toàn lao động",
                type: "single_choice",
                maxScore: 5,
                options: [
                  { score: 1, label: "Mức 1: Có trường hợp không tuân thủ → 0 điểm" },
                ]
              },
              {
                id: 53,
                name: "Tuân thủ các chính sách, quy trình về phòng ngừa cách ly và kiểm soát nhiễm khuẩn (kiểm soát môi trường chăm sóc, quản lý và xử lý chất thải)",
                type: "single_choice",
                maxScore: 10,
                options: [
                  { score: 6, label: "Mức 3: Tuân thủ theo các quy trình về kiểm soát nhiễm khuẩn trong chăm sóc Người bệnh của khoa KSNK (6 điểm)" },
                  { score: 8, label: "Mức 4: Có kế hoạch giám sát/tham gia giám sát tuân thủ các chính sách, quy trình (8 điểm)" },
                  { score: 10, label: "Mức 5: Có giải pháp cải thiện và tăng cường sự tuân thủ của nhân viên (10 điểm)" },
                ]
              },
              {
                id: 54,
                name: "Tuân thủ quy định dự phòng phơi nhiễm với các tác nhân gây bệnh và biết được phương pháp xử lý",
                type: "single_choice",
                maxScore: 5,
                options: [
                  { score: 3, label: "Mức 3: Tuân thủ/triển khai các quy định dự phòng phơi nhiễm với các tác nhân gây bệnh và biết được phương pháp xử lý (3 điểm)" },
                  { score: 4, label: "Mức 4: Có kế hoạch giám sát/tham gia giám sát tuân thủ quy định  (4 điểm)" },
                  { score: 5, label: "Mức 5: Có giải pháp cải thiện và tăng cường sự tuân thủ của nhân viên  (5 điểm)" },
                ]
              },
              {
                id: 55,
                name: "Tuân thủ các quy trình an toàn phòng cháy chữa cháy và các trường hợp khẩn cấp khác",
                type: "single_choice",
                maxScore: 5,
                options: [
                  { score: 4, label: "Mức 4: Có kiến thức về an toàn phòng cháy chữa cháy và các trường hợp khẩn cấp khác (sử dụng các phương tiện chữa cháy, thoát hiểm,…)  (3 điểm)" },
                  { score: 5, label: "Mức 5: Có kiến thức về xử lý/quản lý tinh huống (5 điểm)" },
                ]
              },
            ]
          },
        ]
      },
      {
        id: "domain_5",
        code: "V",
        name: "PHÁT TRIỂN  CHUYÊN MÔN CÁ NHÂN & CHẤT LƯỢNG",
        maxScore: 150,
        standards: [
          {
            id: "std_19",
            code: "TC 22",
            name: "Duy trì và phát triển năng lực cho cá nhân và đồng nghiệp",
            criteria: [
              {
                id: 56,
                name: "Xác định rõ mục tiêu, nguyện vọng phát triển nghề nghiệp và biết được điểm mạnh và yếu của bản thân",
                type: "single_choice",
                maxScore: 10,
                options: [
                  { score: 6, label: "Mức 3: Nêu được những điểm mạnh, điểm yếu cá nhân và nguyện vọng phát triển nghề nghiệp.  (4 điểm)" },
                  { score: 8, label: "Mức 4: Có kế hoạch và đang thực hiện kế hoạch phát triển nghề nghiệp. (8 điểm)" },
                  { score: 10, label: "Mức 5: Đạt được các bằng cấp nâng cao trình độ chuyên môn, nghiệp vụ trong vòng 3 năm. (10 điểm)" },
                ]
              },
              {
                id: 57,
                name: "Chủ động tham gia tích cực đầy đủ hoạt động đào tạo liên tục của bệnh viện cấp khoa, cấp bệnh viện để liên tục nâng cao kiến thức và kỹ năng",
                type: "single_choice",
                maxScore: 10,
                options: [
                  { score: 6, label: "Mức 3: Đạt được 12 tiết trong năm  (6 điểm)" },
                  { score: 8, label: "Mức 4: Đạt được 24 tiết trong năm  (8 điểm)" },
                  { score: 10, label: "Mức 5: Đạt được >24 tiết trong năm -Và ít nhất 50% các chương trình đào tạo tập huấn nâng cao kiến thức chuyên môn và kỹ năng khác do bệnh viện tổ chức (10 điểm)" },
                ]
              },
              {
                id: 58,
                name: "Có thái độ tích cực với những đổi mới, quan điểm trái chiều, thể hiện sự lắng nghe các kiến nghị và các đề xuất, thử nghiệm các phương pháp mới",
                type: "single_choice",
                maxScore: 10,
                options: [
                  { score: 10, label: "Mức 5: Có thái độ tích cực với những đổi mới, quan điểm trái chiều, thể hiện sự lắng nghe các kiến nghị và các đề xuất, thử nghiệm các phương pháp mới  (10 điểm)" },
                ]
              },
              {
                id: 59,
                name: "Hỗ trợ tích cực, đóng góp vào việc đào tạo, nâng cao trình độ, phát triển nghề nghiệp cho đồng nghiệp",
                type: "single_choice",
                maxScore: 10,
                options: [
                  { score: 4, label: "Mức 2: Tham gia hướng dẫn lâm sàng  (4 điểm)" },
                  { score: 6, label: "Mức 3: Tham gia biên soạn nội dung chương trình đào tạo  (6 điểm)" },
                  { score: 8, label: "Mức 4: Tham gia giảng dạy tại khoa/đơn vị (8 điểm)" },
                  { score: 10, label: "Mức 5: Tham gia giảng dạy toàn bệnh viện  (10 điểm)" },
                ]
              },
            ]
          },
          {
            id: "std_20",
            code: "TC 23",
            name: "Cải tiến chất lượng chăm sóc",
            criteria: [
              {
                id: 60,
                name: "Hiểu được sự cần thiết về các hoạt động đảm bảo chất lượng thông qua nghiên cứu, phản hồi, đánh giá thực hành",
                type: "single_choice",
                maxScore: 10,
                options: [
                  { score: 6, label: "Mức 3: Có khảo sát các vấn đề còn tồn động trong hoạt động chăm sóc tại khoa, đơn vị  (6 điểm)" },
                  { score: 8, label: "Mức 4: Phân tích để xác định các vấn đề tồn động cần khắc phục (8 điểm)" },
                  { score: 10, label: "Mức 5: Có sự đánh giá và   theo dõi thường xuyên các vấn đề tồn động (10 điểm)" },
                ]
              },
              {
                id: 61,
                name: "Tiếp nhận, báo cáo, đưa ra biện pháp khắc phục hiệu quả",
                type: "single_choice",
                maxScore: 10,
                options: [
                  { score: 10, label: "Mức 5: Có đưa ra biện pháp khắc phục nhằm đảm bảo chất lượng chăm sóc (10 điểm)" },
                ]
              },
              {
                id: 62,
                name: "Dựa trên các tìm kiếm về vấn đề tồn tại của chuyên môn và hành chánh, đưa giải pháp cải tiến phù hợp, hiệu quả",
                type: "single_choice",
                maxScore: 10,
                options: [
                  { score: 6, label: "Mức 3: Xây dựng được kế hoạch cải tiến trong hoạt động chăm sóc tại khoa, đơn vị  (6 điểm)" },
                  { score: 8, label: "Mức 4: Thực hiện kế hoạch cải tiến nâng cao (8 điểm)" },
                  { score: 10, label: "Mức 5: Đánh giá hiệu quả cải tiến đã được thực hiện  (10 điểm)" },
                ]
              },
            ]
          },
          {
            id: "std_21",
            code: "TC 24",
            name: "Quản lý chăm sóc người bệnh",
            criteria: [
              {
                id: 63,
                name: "Xây dựng kế hoạch làm việc cho cá nhân hiệu quả và khoa học",
                type: "single_choice",
                maxScore: 10,
                options: [
                  { score: 6, label: "Mức 3: Xây dựng được mục tiêu công việc theo vị trí phân công (12điểm)" },
                  { score: 8, label: "Mức 4: Hoàn thành 80% mục tiêu công việc đã được xác định  (16điểm)" },
                  { score: 10, label: "Mức 5: Hoàn thành 100% mục tiêu công việc đã được xác định (20điểm)" },
                ]
              },
              {
                id: 64,
                name: "Xác định khối lượng công việc và có cách sắp xếp theo thứ tự ưu tiên 1 cách hiệu quả, hợp lý",
                type: "single_choice",
                maxScore: 10,
                options: [
                  { score: 10, label: "Xác định khối lượng công việc và có cách sắp xếp theo thứ tự ưu tiên 1 cách hiệu quả, hợp lý" },
                ]
              },
              {
                id: 65,
                name: "Tổ chức, điều phối, phân công và ủy quyền nhiệm vụ cho các thành viên của nhóm chăm sóc một cách khoa học, hợp lý, hiệu quả",
                type: "single_choice",
                maxScore: 10,
                options: [
                  { score: 6, label: "Mức 3: Có sự phân công vai trò của các thành viên trong nhóm chăm sóc (6điểm)" },
                  { score: 8, label: "Mức 4: Có sự giám sát hỗ trợ cho các thành viên của nhóm chăm sóc (8điểm)" },
                  { score: 10, label: "Mức 5: Có sự phân công, hỗ trợ và chia sẻ thông tin trong nhóm (10điểm)" },
                ]
              },
            ]
          },
          {
            id: "std_22",
            code: "TC 25",
            name: "Sự trải nghiệm nghề nghiệp",
            criteria: [
              {
                id: 66,
                name: "BV hạng đặc biệt, hạng 1",
                type: "single_choice",
                maxScore: 50,
                options: [
                  { score: 5, label: "Mức 1: Cách tính thâm niên công tác đối với những nhân viên đã công tác tại các bệnh viện khác trước khi làm việc tại BV ĐHYD  Ghi chú: 1* và 2*: Bằng cấp trung học chỉ áp dụng đến năm 2024                 Đối với ĐD có thâm niên công tác từ các BV khác: trải nghiệm nghề nghiệp được tính bằng bậc lương theo BV chi trả quy đổi sang số năm (Ví dụ: Bậc lương CN là 2/9 --> trải nghiệm nghề nghiệp: 2x3-6 năm, bậc lương TH là 2/12 --> trải nghiệm nghề nghiệp: 2x2=4 năm)" },
                  { score: 10, label: "BV hạng 2, 3" },
                  { score: 35, label: "BV hạng đặc biệt, hạng 1" },
                  { score: 15, label: "BV hạng 2" },
                  { score: 45, label: "BV hạng đặc biệt, hạng 1" },
                  { score: 20, label: "BV hạng 2" },
                  { score: 50, label: "BV hạng đặc biệt, hạng 1" },
                  { score: 25, label: "BV hạng 2" },
                ]
              },
            ]
          },
        ]
      },
    ]
  },
  "anesthesia": {
    id: "anesthesia",
    name: "Kỹ thuật viên / Điều dưỡng Gây mê Hồi sức",
    shortName: "Gây mê hồi sức",
    totalCriteria: 67,
    maxScore: 955,
    units: ["Khoa Gây mê hồi sức"],
    domains: [
      {
        id: "domain_1",
        code: "I",
        name: "TIÊU CHUẨN BẰNG CẤP & TRÌNH ĐỘ CHUYÊN MÔN",
        maxScore: 180,
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
                  { label: "ĐH Điều dưỡng từ Châu Âu (trừ Đông Âu), Mỹ, Canada, New Zealand, Úc, Nhật Bản, Hàn Quốc, Singapore, Đài Loan, Malaysia", score: 100 }
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
          }
        ]
      },
      {
        id: "domain_2",
        code: "I",
        name: "NĂNG LỰC THỰC HÀNH CHĂM SÓC NGƯỜI BỆNH",
        maxScore: 440,
        standards: [
          {
            id: "std_2",
            code: "TC 5",
            name: "Hành nghề theo pháp luật",
            criteria: [
              {
                id: 7,
                name: "Tuân thủ các quy định tại cơ sở làm việc - Có mặt tại nơi làm việc - Tuân thủ thời gian làm việc - Tuân thủ quy định đồng phục, bảng tên - Tham gia hội họp, sinh hoạt tập thể  - Ý thức bảo vệ tài sản tại đơn vị/BV",
                type: "single_choice",
                maxScore: 5,
                options: [
                  { score: 1, label: "Mức 1: 4 lần vi phạm (1 điểm)" },
                  { score: 2, label: "Mức 2: 3 lần vi phạm (2 điểm)" },
                  { score: 3, label: "Mức 3: 2 lần vi phạm (3 điểm)" },
                  { score: 4, label: "Mức 4: 1 lần vi phạm (4 điểm)" },
                  { score: 5, label: "Mức 5: 0 lần vi phạm (5 điểm)" },
                ]
              },
              {
                id: 8,
                name: "Tuân thủ các quy định hành nghề theo luật định liên quan đến y tế, thực hành điều dưỡng, BYT  (Luật khám chữa bệnh, thông tư 07/2011, thông tư 23/2011, thông tư 51/2017, …)",
                type: "single_choice",
                maxScore: 5,
                options: [
                  { score: 1, label: "Mức 1: 4 lần vi phạm (1 điểm)" },
                  { score: 2, label: "Mức 2: 3 lần vi phạm (2 điểm)" },
                  { score: 3, label: "Mức 3: 2 lần vi phạm (3 điểm)" },
                  { score: 4, label: "Mức 4: 1 lần vi phạm (4 điểm)" },
                  { score: 5, label: "Mức 5: 0 lần vi phạm (5 điểm)" },
                ]
              },
              {
                id: 9,
                name: "Thực hiện tốt quy tắc ứng xử của tổ chức và luật định  - Sự phối hợp, hợp tác với đồng nghiệp - Ứng xử với đồng nghiệp - Giao tiếp với khách hàng/NB",
                type: "single_choice",
                maxScore: 5,
                options: [
                  { score: 3, label: "Mức 3: Phối hợp với đồng nghiệp nhưng chưa chủ động hoặc do được yêu cầu Quan hệ, giao tiếp tốt với đồng nghiệp, NB (3 điểm)" },
                  { score: 4, label: "Mức 4: Chủ động phối hợp với đồng nghiệp để giải quyết công việc Hòa nhã, vui vẻ, sẵn sàng hỗ trợ với đồng nghiệp, khách hàng/NB (4 điểm)" },
                  { score: 5, label: "Mức 5: Phối hợp công việc 1 cách nhanh nhẹn, hiệu quả Ứng xử nhanh nhẹn, giải quyết mọi vấn đề, quan hệ tốt với đồng nghiệp trong và ngoài đơn vị Giao tiếp tốt với NB, chăm sóc được NB khó tính (5 điểm)" },
                ]
              },
            ]
          },
          {
            id: "std_3",
            code: "TC 6",
            name: "Hành nghề theo tiêu chuẩn đạo đức nghề nghiệp",
            criteria: [
              {
                id: 10,
                name: "Chịu trách nhiệm cá nhân khi đưa ra các quyết định chăm sóc và can thiệp chăm sóc",
                type: "single_choice",
                maxScore: 5,
                options: [
                  { score: 4, label: "Mức 4: Tự ra quyết định kế hoạch chăm sóc và can thiệp cho NB (4 điểm)" },
                  { score: 5, label: "Mức 5: Có trách nhiệm trong công tác Tự giác nhận trách nhiệm khi có những sai sót (5 điểm)" },
                ]
              },
              {
                id: 11,
                name: "Tuân thủ tiêu chuẩn đạo đức, không đỗ lỗi cho đồng nghiệp, người bệnh đối với các sai sót của cá nhân. Bảo vệ hình ảnh đồng nghiệp trước người bệnh/người nhà và xã hội. - Không nhận tiền và lợi ích từ NB - Tôn trọng và tự nguyện tham gia các hoạt động của Hội ĐD - Tôn trọng và bảo vệ danh dự, uy tính của đồng nghiệp - Hợp tác, giúp đỡ và truyền thụ kinh nghiệm cho đồng nghiệp",
                type: "single_choice",
                maxScore: 5,
                options: [
                  { score: 1, label: "Mức 1: 4 lần vi phạm (1 điểm)" },
                  { score: 2, label: "Mức 2: 3 lần vi phạm (2 điểm)" },
                  { score: 3, label: "Mức 3: 2 lần vi phạm (3 điểm)" },
                  { score: 4, label: "Mức 4: 1 lần vi phạm (4 điểm)" },
                  { score: 5, label: "Mức 5: 0 lần vi phạm (5 điểm)" },
                ]
              },
              {
                id: 12,
                name: "Quảng bá hình ảnh người điều dưỡng, thể hiện tác phong và tư cách tốt, trang phục phù hợp, lời nói thuyết phục và cách cư xử đúng mực. - Tác phong và chuẩn mực (sạch sẽ, gọn gàng, tươm tất) - Tư cách và lời nói (nhanh nhẹn, vui vẻ, than thiện, hòa đồng) - Không ngừng nâng cao năng lực hành nghề - Tự tôn nghề nghiệp - Cam kết với cộng đồng và xã hội",
                type: "single_choice",
                maxScore: 5,
                options: [
                  { score: 1, label: "Mức 1: 4 lần vi phạm (1 điểm)" },
                  { score: 2, label: "Mức 2: 3 lần vi phạm (2 điểm)" },
                  { score: 3, label: "Mức 3: 2 lần vi phạm (3 điểm)" },
                  { score: 4, label: "Mức 4: 1 lần vi phạm (4 điểm)" },
                  { score: 5, label: "Mức 5: 0 lần vi phạm (5 điểm)" },
                ]
              },
            ]
          },
          {
            id: "std_4",
            code: "TC 7",
            name: "Hiểu biết về tình trang sức khỏe và về người bệnh",
            criteria: [
              {
                id: 13,
                name: "Hiểu và nắm vững tình trạng bệnh, các kết quả cận lâm sàng liên quan để tham khảo trong thực hành chăm sóc",
                type: "single_choice",
                maxScore: 10,
                options: [
                  { score: 2, label: "Mức 1: Trình bày được tình trạng bệnh và các cận lâm sàng liên quan (2 điểm)" },
                  { score: 4, label: "Mức 2: Hiểu được ý nghĩa các cận lâm sàng liên quan (4 điểm)" },
                  { score: 6, label: "Mức 3: Đánh giá được mức độ ưu tiên thực hiện cận lâm sàng:  -Thực hiện CLS -Bàn giao thông tin (6 điểm)" },
                  { score: 8, label: "Mức 4: Đọc được các kết quả cận lâm sàng (8 điểm)" },
                  { score: 10, label: "Mức 5: Nắm được Tiền sử bệnh, Tiền sử dị ứng. Nhận biết được kết quả cận lâm sàng bất thường và có can thiệp kịp thời (10 điểm)" },
                ]
              },
              {
                id: 14,
                name: "Lập kế hoạch chuẩn bị thuốc, dụng cụ, trang thiết bị và vật tư y tế phù hợp cho từng ca phẫu thuật",
                type: "single_choice",
                maxScore: 10,
                options: [
                  { score: 2, label: "Mức 1: Có phân tích các nhu cầu cần chuẩn bị cho người bệnh và Lập KH chuẩn bị nhưng chưa đầy đủ. (2 điểm)" },
                  { score: 4, label: "Mức 2: Lập KH chuẩn bị phù hợp với từng trường hợp phẫu thuật và xác định các vấn đề ưu tiên của kế hoạch chuẩn bị (4 điểm)" },
                  { score: 6, label: "Mức 3: Thực hiện được 60% kế hoạch đã lập ra. (6 điểm)" },
                  { score: 8, label: "Mức 4: Thực hiện được 80% kế hoạch đã lập ra. (8 điểm)" },
                  { score: 10, label: "Mức 5: Thực hiện được 100% kế hoạch đã lập ra. (10 điểm)" },
                ]
              },
              {
                id: 15,
                name: "Đảm bảo đầy đủ  thiết bị theo dõi, dụng cụ và các TTB ( máy GM, máy NS, máy đốt, dụng cụ kê tư thế, chêm lót…) phù hợp với tình trạng bệnh  phù hợp với tình trạng bệnh nhằm",
                type: "single_choice",
                maxScore: 10,
                options: [
                  { score: 6, label: "Mức 3: Thực hiện đầy đủ các bước 60%     (6 điểm)" },
                  { score: 8, label: "Mức 4: Thực hiện đầy đủ các bước 80%      (8 điểm)" },
                  { score: 10, label: "Mức 5: Thực hiện đầy đủ các bước 100% (10 điểm)" },
                ]
              },
              {
                id: 16,
                name: "Sử dụng thành thạo các thiết bị theo dõi, dụng cụ và các TTB ( máy GM, máy NS, máy đốt, dụng cụ kê tư thế, chêm lót…) phù hợp với tình trạng bệnh",
                type: "single_choice",
                maxScore: 10,
                options: [
                  { score: 6, label: "Mức 3: Thực hiện đầy đủ các bước 60%        (6 điểm)" },
                  { score: 8, label: "Mức 4: Thực hiện đầy đủ các bước 80%     (8 điểm)" },
                  { score: 10, label: "Mức 5: Thực hiện đầy đủ các bước 100% (10 điểm)" },
                ]
              },
              {
                id: 17,
                name: "Đảm  bảo ATNB  (kê tư thế tránh tì đè, té ngã, giữ ấm, kín đáo,…). Bảo quản các TTB đúng cách.",
                type: "single_choice",
                maxScore: 20,
                options: [
                  { score: 4, label: "Mức 1: Có thực hiện (5 nội dung /20 điểm) Mỗi nội dung 4 điểm" },
                ]
              },
            ]
          },
          {
            id: "std_5",
            code: "TC 8",
            name: "Năng lực thực hành kỹ thuật chăm sóc",
            criteria: [
              {
                id: 18,
                name: "Tuân thủ quy trình kỹ thuật trong phạm vi chuyên môn hành nghề (Competent)",
                type: "single_choice",
                maxScore: 80,
                options: [
                  { score: 16, label: "Mức 2: Thực hiện QTKTĐD dưới sự hỗ trợ, hướng dẫn thường xuyên (10 điểm)" },
                  { score: 24, label: "Mức 3: Thực hiện đầy đủ các bước QTKTĐD nhưng thỉnh thoảng còn cần sự hỗ trợ, hướng dẫn  (20 điểm)" },
                  { score: 32, label: "Mức 4: Thực hiện QTKTĐD đầy đủ các bước, độc lập, thao tác đúng;          Đảm bảo an toàn người bệnh. Thỉnh thoảng còn cần sự giám sát (30 điểm)" },
                  { score: 40, label: "Mức 5: Thực hiện độc lập,hoàn chỉnh QTKTĐD; Đảm bảo an toàn Người bệnh;                                           Xử lý được các tình huống đặc biệt;           Có thể lý giải được các nguyên nhân và giải pháp trong QTKT khó (40 điểm)" },
                  { score: 60, label: "Thực hiện thành thạo hầu hết tất cả các kỹ thuật điều dưỡng đảm bảo an toàn, chất lượng Có khả năng hướng dẫn người khác (sinh viên, học viên, nhân viên mới) (Mentor)" },
                  { score: 80, label: "Hiểu biết sâu về chuyên môn, thực hiện được các kỹ thuật khó, có khả năng phát triển thành chứng cứ trong thực hành hoặc vận dụng những chứng cứ mới vào chăm sóc (Expert)" },
                ]
              },
            ]
          },
          {
            id: "std_6",
            code: "TC 9",
            name: "Năng lực dùng thuốc an toàn và sử dụng TTB-VTYT an toàn, hiệu quả",
            criteria: [
              {
                id: 19,
                name: "Tuân thủ quy định khi dùng thuốc: hiểu biết tác dụng các thuốc sử trong gây mê và phẫu thuật. Thực hiện 5 đúng 2 thời điểm, Bảo đảm TAT (vk), LASA, THUỐC CCPV",
                type: "single_choice",
                maxScore: 10,
                options: [
                  { score: 2, label: "Mức 1: Thực hiện 2/10 nội dung  (2 điểm)" },
                  { score: 4, label: "Mức 2: Thực hiện 4/10 nội dung  (4 điểm)" },
                  { score: 6, label: "Mức 3: Thực hiện 6/10 nội dung  (6 điểm)" },
                  { score: 8, label: "Mức 4: Thực hiện 8/10 nội dung  (8 điểm)" },
                  { score: 10, label: "Mức 5: Thực hiện 10/10 nội dung  (10 điểm)" },
                  { score: 10, label: "Hiểu biết và nhận biết được sự tương tác tương kỵ giữa thuốc và thuốc, thuốc và dịch truyền, chỉ định và chống chỉ định khi dùng thuốc cho NB." },
                  { score: 10, label: "Phát hiện và biết cách xử lý ban đầu các dấu hiệu có hại của thuốc và thông tin kịp thời đến BS, điều dưỡng phụ trách thuốc, ĐDTK" },
                ]
              },
              {
                id: 19,
                name: "Tuân thủ sử dụng VTYT đúng và đủ",
                type: "single_choice",
                maxScore: 10,
                options: [
                  { score: 2, label: "Mức 1: Thực hiện 2/10 nội dung  (2 điểm)" },
                  { score: 4, label: "Mức 2: Thực hiện 4/10 nội dung  (4 điểm)" },
                  { score: 6, label: "Mức 3: Thực hiện 6/10 nội dung  (6 điểm)" },
                  { score: 8, label: "Mức 4: Thực hiện 8/10 nội dung  (8 điểm)" },
                  { score: 10, label: "Mức 5: Thực hiện 10/10 nội dung  (10 điểm)" },
                  { score: 10, label: "Hiểu biết và nhận biết được các TTBYT cần sử dụng phù hợp cho ca mổ." },
                  { score: 10, label: "Phát hiện kịp thời sự cố do sử dung thiết bị điện. Giữ ATNB khi có sử dụng thiết bị điện (máy đốt, máy nội soi,)." },
                ]
              },
            ]
          },
          {
            id: "std_7",
            code: "TC 10",
            name: "Năng lực chăm sóc liên tục",
            criteria: [
              {
                id: 20,
                name: "Người bệnh được theo dõi và chăm sóc liên tục suốt quá trình Phẫu thuật",
                type: "single_choice",
                maxScore: 10,
                options: [
                  { score: 2, label: "Mức 1: Thực hiện  < 30% theo dõi và chăm sóc liên tục trên NB (2 điểm)" },
                  { score: 4, label: "Mức 2: Thực hiện 30 - 50% theo dõi và chăm sóc liên tục  trên NB (4 điểm)" },
                  { score: 6, label: "Mức 3: Thực hiện 60 - 70% theo dõi và chăm sóc liên tục  trên NB (6 điểm)" },
                  { score: 8, label: "Mức 4: Thực hiện 80% kế hoạch (8 điểm)" },
                  { score: 10, label: "Mức 5: Thực hiện 100% theo dõi và chăm sóc liên tục  (10 điểm)" },
                ]
              },
              {
                id: 32,
                name: "Bàn giao tình trạng người bệnh với nhóm chăm sóc kế tiếp đầy đủ, chính xác",
                type: "single_choice",
                maxScore: 10,
                options: [
                  { score: 4, label: "Mức 2: Bàn giao ≤ 50% vấn đề cần theo dõi và chăm sóc của NB (4 điểm)" },
                  { score: 6, label: "Mức 3: Bàn giao 60 - 70% (6 điểm)" },
                  { score: 8, label: "Mức 4: Bàn giao 80 - 90% (8 điểm)" },
                  { score: 10, label: "Mức 5: Bàn giao 100% (10 điểm)" },
                ]
              },
              {
                id: 33,
                name: "Phối hợp hiệu quả với người bệnh, người nhà, và đồng nghiệp để đảm bảo người bệnh được theo dõi và chăm sóc liên tục",
                type: "single_choice",
                maxScore: 10,
                options: [
                  { score: 4, label: "Mức 2: NV nhận bàn giao nắm rõ được ≤ 50% vấn đề cần theo dõi và chăm sóc của NB  (4 điểm)" },
                  { score: 6, label: "Mức 3: NV nhận bàn giao nắm rõ được 60-80% vấn đề cần theo dõi và chăm sóc của NB  (6 điểm)" },
                  { score: 8, label: "Mức 4: NV nhận bàn giao nắm rõ được 100% vấn đề cần theo dõi và chăm sóc của NB  (8 điểm)" },
                  { score: 10, label: "Mức 5: NB hiểu rõ và phối hợp cùng ĐD theo dõi và chăm sóc cho NB (Đạt trên 60% nội dung hướng dẫn) (10 điểm)" },
                ]
              },
            ]
          },
          {
            id: "std_8",
            code: "TC 11",
            name: "Năng lực về việc tiên lượng và xử trí tình huống khó, cấp cứu",
            criteria: [
              {
                id: 21,
                name: "Phát hiện sớm những thay đổi đột ngột về tình trạng NB trong mổ và phòng ngừa sự cố phẫu thuật có thể xảy ra",
                type: "single_choice",
                maxScore: 10,
                options: [
                  { score: 2, label: "Mức 1: Nhận biết được các dấu hiệu sau:  Sự thay đổi dấu hiệu sinh tồn (1 điểm) và diễn tiến phẫu thuật (2 điểm);" },
                  { score: 4, label: "Mức 2: Nhận biết và ghi nhận sự thay đổi của dấu hiệu sinh tồn và các dấu hiệu đe dọa tính mạng của NB   (4 điểm)" },
                  { score: 6, label: "Mức 3: Nhận biết và ghi nhận sự thay đổi của dấu hiệu sinh tồn và các dấu hiệu đe dọa tính mạng của NB  và đưa ra phương pháp phòng ngừa tai biến  (6 điểm)" },
                  { score: 8, label: "Mức 4: Thực hiện đầy đủ và độc lập trong đánh giá các dấu hiệu cảnh báo sớm. Tiên lượng được các thay đổi tình trạng người bệnh phù hợp với tình huống lâm sàng. (8 điểm)" },
                  { score: 10, label: "Mức 5: Tiên lượng được các thay đổi tình trạng người bệnh phù hợp với tình huống lâm sàng. Biết cách giải thích các thay đổi bất thường dựa trên các đánh giá tình trạng lâm sàng người bệnh. (10 điểm)" },
                ]
              },
              {
                id: 35,
                name: "Biết cách xử trí phù hợp và thông báo kịp thời đến người có trách nhiệm, yêu cầu hỗ trợ kịp thời",
                type: "single_choice",
                maxScore: 20,
                options: [
                  { score: 4, label: "Mức 1: Quan sát, đánh giá tình huống và đảm bảo an toàn trong tình huống cấp cứu NB;           (12 điểm)" },
                  { score: 8, label: "Mức 2: Quan sát, đánh giá tình huống và đảm bảo an toàn trong tình huống cấp cứu NB, lập kế hoạch chuẩn bị.  (14 điểm)" },
                  { score: 12, label: "Mức 3: Quan sát, đánh giá tình huống và đảm bảo an toàn trong tình huống cấp cứu NB  Gọi hỗ trợ   (16 điểm)" },
                  { score: 16, label: "Mức 4: Quan sát, đánh giá tình huống cấp cứu NB  Gọi hỗ trợ và thực hiện công tác cấp cứu NB.   (18 điểm)" },
                  { score: 20, label: "Mức 5: Quan sát, đánh giá tình huống và đảm bảo an toàn cấp cứu NB  Đề xuất hay thực hiện các hành động phù hợp liên quan tình huống.. (20 điểm)" },
                ]
              },
              {
                id: 36,
                name: "Thực hiện cấp cứu đạt hiệu quả, phối hợp tốt với các thành viên trong nhóm cấp cứu",
                type: "single_choice",
                maxScore: 30,
                options: [
                  { score: 12, label: "Mức 2: Đánh giá được tình trạng người bệnh có nguy cơ tai biến, biến chứng. (24 điểm)" },
                  { score: 18, label: "Mức 3: Đánh giá được tình trạng người bệnh có nguy cơ tai biến, biến chứng.  - Xác định được nguy cơ tai biến, biến chứng. (26 điểm)" },
                  { score: 24, label: "Mức 4: Đánh giá được tình trạng người bệnh có nguy cơ tai biến, biến chứng.  - Xác định được nguy cơ tai biến, biến chứng.  - Chuẩn bị được các TTB và VTYT hỗ trợ cấp cứu. (28 điểm)" },
                  { score: 30, label: "Mức 5: Đánh giá được tình trạng người bệnh có nguy cơ tai biến, biến chứng. - Xác định được nguy cơ tai biến, biến chứng. - Chuẩn bị được các TTB và VTYT hỗ trợ cấp cứu. Thực hiện chuẩn xác  và đầy đủ: - Biết xác định các nguồn lực cần thiết chuẩn bị sẵn sàng cho tình huống cấp cứu (30 điểm)" },
                ]
              },
            ]
          },
          {
            id: "std_9",
            code: "TC 12",
            name: "Năng lực lập kế hoạch chăm sóc  NB phẫu thuật và can thiệp điều dưỡng",
            criteria: [
              {
                id: 22,
                name: "Chuẩn bị thuốc, phương tiện dụng cụ, trang thiết bị, VTYT tiêu hao phù hợp, đúng yêu cầu cho quá trình phẫu thuật. Thực hiện kỹ thuật và chăm sóc phù hợp, an toàn, hiệu quả",
                type: "single_choice",
                maxScore: 50,
                options: [
                  { score: 4, label: "Mức 1: Chuẩn bị 50%  (12 điểm)" },
                  { score: 8, label: "Mức 2: Chuẩn bị từ   50%- 70%     (14 điểm)" },
                  { score: 12, label: "Mức 3: Chuẩn bị từ    70% - 80%    (16 điểm)" },
                  { score: 16, label: "Mức 4: Chuẩn bị từ 90%  (18 điểm)" },
                  { score: 20, label: "Mức 5: Chuẩn bị 100%; các các TTB vả VTYT đáp ứng đúng yếu cầu phẫu thuật (20 điểm)" },
                  { score: 30, label: "Theo dõi, tiên lượng và đánh giá NB quá trình phẫu thuật và đánh giá diễn biến ca phẫu thuật. Tổ chức thực hiện các chăm sóc trong mổ và những bàn giao sau mổ phù hợp, an toàn, hiệu quả" },
                  { score: 50, label: "Cải tiến biểu mẫu ghi chép, đem lại hiệu quả cao, tiết kiệm được thời gian và nhân rộng mô hình cho nhiều khoa áp dụng" },
                ]
              },
            ]
          },
          {
            id: "std_10",
            code: "TC 13",
            name: "Thực hiện ATPT",
            criteria: [
              {
                id: 23,
                name: "Tạo dựng niềm tin với người bệnh trong giao tiếp, nhận dạng đúng người bệnh. Giúp NB an tâm, giảm lo lắng, hợp tác tốt.",
                type: "single_choice",
                maxScore: 20,
                options: [
                  { score: 4, label: "Mức 1: Đồng phục: đầy đủ, nguyên vẹn, sạch, thẳng.                         Thái độ: Hòa nhã, nhiệt tình.                            Sử dụng kính ngữ: xưng hô phù hợp.                Chủ động cung cấp thông tin cần thiết, phù hợp cho NB/NN            Tỉ lệ thực hiện đạt <50% (12 điểm)" },
                  { score: 8, label: "Mức 2: Đồng phục: đầy đủ, nguyên vẹn, sạch, thẳng.                          Thái độ: Hòa nhã, nhiệt tình.                               Sử dụng kính ngữ: xưng hô phù hợp.               Chủ động cung cấp thông tin cần thiết, phù hợp cho NB/NN            Tỉ lệ thực hiện đạt 50- 59%  (14 điểm)" },
                  { score: 12, label: "Mức 3: Đồng phục: đầy đủ, nguyên vẹn, sạch, thẳng.                          Thái độ: Hòa nhã, nhiệt tình.                            Sử dụng kính ngữ: xưng hô phù hợp.               Chủ động cung cấp thông tin cần thiết, phù hợp cho NB/NN           Tỉ lệ thực hiện đạt 60- 74% (16 điểm)" },
                  { score: 16, label: "Mức 4: Đồng phục: đầy đủ, nguyên vẹn, sạch, thẳng.                          Thái độ: Hòa nhã, nhiệt tình.                             Sử dụng kính ngữ: xưng hô phù hợp.               Chủ động cung cấp thông tin cần thiết, phù hợp cho NB/NN           Tỉ lệ thực hiện đạt 75 - 89% (18 điểm)" },
                  { score: 20, label: "Mức 5: Đồng phục: đầy đủ, nguyên vẹn, sạch, thẳng.                          Thái độ: Hòa nhã, nhiệt tình.                            Sử dụng kính ngữ: xưng hô phù hợp.               Chủ động cung cấp thông tin cần thiết, phù hợp cho NB/NN            Tỉ lệ thực hiện đạt ≥ 90% (20 điểm)" },
                  { score: 20, label: "Thực hiện bảng kiểm ATPT đúng thời điểm (trước, trong và sau phẫu thuật)" },
                  { score: 10, label: "Thực hiện đúng và đầy đủ các quy trình bàn giao Người bệnh trước, trong và sau phẫu thuật." },
                ]
              },
            ]
          },
          {
            id: "std_11",
            code: "TC 14",
            name: "Quản lý ghi chép và sử dụng hồ sơ bệnh án hiệu quả",
            criteria: [
              {
                id: 24,
                name: "Ghi chép hồ sơ điều dưỡng bảo đảm tính khách quan, chính xác, đầy đủ và kịp thời",
                type: "single_choice",
                maxScore: 50,
                options: [
                  { score: 2, label: "Mức 1: >20% (2 điểm)" },
                  { score: 4, label: "Mức 2: 16- 20% (4 điểm)" },
                  { score: 6, label: "Mức 3: 11 - 15% (6 điểm)" },
                  { score: 8, label: "Mức 4: 6 - 10% (8 điểm)" },
                  { score: 10, label: "Mức 5: ≤ 5% (10 điểm)" },
                  { score: 20, label: "Thu thập và nắm vững tình trạng bệnh: trước, trong quá trình phẫu thuật (tiền sử bệnh, tiền sử dị ứng….)" },
                  { score: 30, label: "Sử dụng công nghệ thông tin 1 cách hiệu quả trong việc tích hợp và cải tiến các biểu mẫu ghi chép" },
                  { score: 50, label: "Ứng dụng kết quả ghi chép, phân tích, diễn giải, và thực hiện nghiên cứu cải tiến, áp dụng thành công trên nhiều khoa" },
                ]
              },
            ]
          },
          {
            id: "std_12",
            code: "TC 15",
            name: "Giao tiếp hiệu quả với người bệnh, đồng nghiệp và cấp trên",
            criteria: [
              {
                id: 25,
                name: "Nhận thức được sự quan trọng trong việc giao tiếp với người bệnh, người nhà và nhân viên; Thường xuyên sử dụng AIDET trong giao tiếp",
                type: "single_choice",
                maxScore: 10,
                options: [
                  { score: 2, label: "Mức 1: Trình bày được 5 yếu tố trong mô hình AIDET (2 điểm)" },
                  { score: 4, label: "Mức 2: Ứng dụng được ≤  3/5 yếu tố AIET trong giao tiếp với NB (4 điểm)" },
                  { score: 6, label: "Mức 3: Ứng dụng được ≤  4/5 yếu tố AIET trong giao tiếp với NB (6 điểm)" },
                  { score: 8, label: "Mức 4: Ứng dụng được 5 yếu tố AIET trong giao tiếp với NB NB biết được những thông tin được cung cấp (I,D,E) (8 điểm)" },
                  { score: 10, label: "Mức 5: Ứng dụng được 5 yếu tố AIET trong giao tiếp với NB NB hiểu rõ được những thông tin được cung cấp  (10 điểm)" },
                ]
              },
              {
                id: 26,
                name: "Chủ động chia sẻ thông tin về quá trình chăm sóc người bệnh với đồng nghiệp; Thường xuyên ứng dụng hiệu quả SBAR trong bàn giao bệnh, trao đổi thông tin giữa đồng nghiệp",
                type: "single_choice",
                maxScore: 10,
                options: [
                  { score: 2, label: "Mức 1: Trình bày được định nghĩa SBAR Chưa ứng dụng SBAR trong bàn giao NB và trao đổi thông tin với đồng nghiệp (2 điểm)" },
                  { score: 4, label: "Mức 2: Ứng dụng SBAR trong báo cáo bệnh với Bác sĩ hoặc trong bàn giao phiên trực, chuyển khoa  (4 điểm)" },
                  { score: 6, label: "Mức 3: Ứng dụng SBAR trong báo cáo bệnh với BS và trong bàn giao phiên trực, chuyển khoa, nhưng chưa đầy đủ S, B, A, R (6 điểm)" },
                  { score: 8, label: "Mức 4: Ứng dụng SBAR trong báo cáo bệnh với BS và trong bàn giao phiên trực, chuyển khoa, và đầy đủ S, B, A, R, nhưng chưa đủ các thông tin của NB (8 điểm)" },
                  { score: 10, label: "Mức 5: Ứng dụng SBAR trong báo cáo bệnh với BS và trong bàn giao phiên trực, chuyển khoa, và đầy đủ S, B, A, R, và đầy đủ các thông tin của NB (10 điểm)" },
                ]
              },
              {
                id: 27,
                name: "Thể hiện lời nói, cử chỉ động viên, khuyến khích người bệnh an tâm điều trị",
                type: "single_choice",
                maxScore: 10,
                options: [
                  { score: 2, label: "Mức 1: Thái độ giao tiếp kém, có NB phàn nàn (2 điểm)" },
                  { score: 4, label: "Mức 2: Sử dụng từ ngữ chưa rõ ràng, dễ gây hiểu lầm (4 điểm)" },
                  { score: 6, label: "Mức 3: Sử dụng từ ngữ rõ ràng, dễ hiểu, nhưng chưa tích cực lắng nghe phản hồi của NB (6 điểm)" },
                  { score: 8, label: "Mức 4: Sử dụng từ ngữ rõ ràng, phù hợp với tình huống, lắng nghe NB, thái độ vui vẻ, ân cần, lịch sự (8 điểm)" },
                  { score: 10, label: "Mức 5: Luôn chia sẽ, động viên NB, thuyết phục được những NB khó tính hợp tác điều trị và chăm sóc  (10 điểm)" },
                ]
              },
              {
                id: 28,
                name: "Hợp tác làm việc nhóm và làm việc độc lập hiệu quả; Chia sẻ thông tin 1 cách hiệu quả; Thực hiện vai trò đại diện hoặc biện hộ cho người bệnh để đảm bảo các quyền, lợi ích và vì sự an toàn người bệnh.",
                type: "single_choice",
                maxScore: 10,
                options: [
                  { score: 2, label: "Mức 1: Hoàn thành công việc được phân công trong nhóm, thụ động, không có ý kiến đóng góp, không hỗ trợ các thành viên trong nhóm  (2 điểm)" },
                  { score: 4, label: "Mức 2: Hoàn thành công việc được phân công  và hỗ trợ các thành viên trong nhóm, chưa có ý kiến tích cực trong phát triển nhóm (4 điểm)" },
                  { score: 6, label: "Mức 3: Hoàn thành công việc được phân công và hỗ trợ nhóm, có ý kiến đóng góp tích cực (6 điểm)" },
                  { score: 8, label: "Mức 4: Nhiều ý kiến đóng góp tích cực, chia sẽ thông tin hiệu quả, thống nhất được ý kiến tập thể (8 điểm)" },
                  { score: 10, label: "Mức 5: Thực hiện vai trò đại diện hoặc biện hộ cho người bệnh để đảm bảo các quyền, lợi ích và vì sự an toàn người bệnh. (10 điểm)" },
                ]
              },
            ]
          },
        ]
      },
      {
        id: "domain_3",
        code: "I",
        name: "NĂNG LỰC ĐÀO TẠO  NGHIÊN CỨU KHOA HỌC THỰC HÀNH DỰA TRÊN CHỨNG CỨ (EBP)",
        maxScore: 125,
        standards: [
          {
            id: "std_13",
            code: "TC 16",
            name: "Đào tạo",
            criteria: [
              {
                id: 29,
                name: "- Phân tích được mối quan hệ giữa nhu cầu đào tạo với trình độ, vị trí việc làm của đối tượng thuộc phạm vi phụ trách (5 điểm)",
                type: "single_choice",
                maxScore: 5,
                options: [
                  { score: 3, label: "Mức 3: Cần sự hướng dẫn trong tìm hiểu, phân tích mối tương quan giữa nhu cầu đào tạo với trình độ, vị trí làm việc; (3 điểm)" },
                  { score: 4, label: "Mức 4: Thực hiện và báo cáo kết quả khảo sát, nghiên cứu mối quan hệ giữa nhu cầu đào tạo với trình độ, vị trí làm việc (4 điểm)" },
                  { score: 5, label: "Mức 5: Thực hiện và báo cáo kết quả khảo sát, nghiên cứu mối quan hệ giữa nhu cầu đào tạo với trình độ, vị trí làm việc; Đề xuất được các giải pháp dựa trên kết quả báo cáo. (5 điểm)" },
                  { score: 5, label: "- Xây dựng được kế hoạch đào tạo (5 điểm)" },
                ]
              },
              {
                id: 30,
                name: "Đề xuất, xây dựng các phương pháp đào tạo linh động, phù hợp với hoàn cảnh đảm bảo nâng cao chất lượng đào tạo",
                type: "single_choice",
                maxScore: 10,
                options: [
                  { score: 6, label: "Mức 3: Cần sự hỗ trợ trong xây dựng phương pháp đào tạo phù hợp với yêu cầu của nội dung đào tạo.  (6 điểm)" },
                  { score: 8, label: "Mức 4: Có phương pháp đào tạo phù hợp với nội dung, yêu cầu của nội dung đào tạo.  Vận dụng được phương pháp đào tạo phù hợp với hoàn cảnh đào tạo. (8 điểm)" },
                  { score: 10, label: "Mức 5: Có sự thay đổi thường xuyên các chương trình, nội dung đào tạo hàng năm  Vận dụng đa dạng trên ba phương pháp đào tạo phù hợp với yêu cầu của nội dung đào tạo  (10 điểm)" },
                ]
              },
              {
                id: 31,
                name: "Tổ chức thực hiện được kế hoạch đào tạo và tham gia đào tạo theo đúng tiến độ và đạt chất lượng: -Kế hoạch đào tạo, tham gia đào tạo theo đúng tiến độ (5đ) -Kế hoạch đào tạo đạt chất lượng (5đ)",
                type: "single_choice",
                maxScore: 5,
                options: [
                  { score: 3, label: "Mức 3: Cần sự hỗ trợ, hoặc giám sát tiến độ thực hiện kế hoạch đào tạo;  Có  dưới 2 chương trình  đào tạo trễ hạn dưới 1 tháng so với kế hoạch năm (3 điểm)" },
                  { score: 4, label: "Mức 4: Độc lập theo dõi kế hoạch đào tạo, tổ chức đào tạo đúng tiến độ;  Không có chương trình trễ hạn. (4 điểm)" },
                  { score: 5, label: "Mức 5: Biết phối hợp nhiều phương pháp, kỹ năng theo dõi kế hoạch đào tạo, tổ chức đào tạo đúng tiến độ;  Hoàn thành các nội dung, chương trình đào tạo sớm hơn tiến độ trong kế hoạch đề ra (5 điểm)" },
                ]
              },
              {
                id: 32,
                name: "Đánh giá được hiệu quả đào tạo: thống kê, phân tích, diễn giải và báo cáo theo kế hoạch; Có chỉ ra những nhược điểm khắc cần khắc phục và đề xuất giải pháp cải tiến chất lượng (-Thống kê, phân tích, diễn giải và báo cáo theo kế hoạch (5đ) -Cải tiến chất lượng đào tạo (5đ))",
                type: "single_choice",
                maxScore: 0,
                options: [
                  { score: 3, label: "Mức 3: Cần hướng dẫn trong đánh giá, đo lường hiệu quả trước & sau đào tạo; (3 điểm)" },
                  { score: 4, label: "Mức 4: Độc lập đánh giá, đo lường và báo cáo hiệu quả trước & sau đào tạo;  Cần sự hướng dẫn trong phân tích, diễn giải kết quả đo lường. (4 điểm)" },
                  { score: 5, label: "Mức 5: Biết cách vận dụng nhiều kỹ năng đánh giá, đo lường và báo cáo hiệu quả trước & sau đào tạo;  Đưa ra được phân tích, diễn giải kết quả đo lường, thống kê (5 điểm)" },
                ]
              },
              {
                id: 33,
                name: "Xây dựng được công cụ, phương pháp đánh giá thay đổi kiến thức của người được đào tạo và sau khi đào tạo",
                type: "single_choice",
                maxScore: 5,
                options: [
                  { score: 3, label: "Mức 3: Cần sự hướng dẫn liên tục, thường xuyên trong việc tìm, xây dựng công cụ, phương pháp đánh giá kiến thức của học viên. (3 điểm)" },
                  { score: 4, label: "Mức 4: Độc lập đưa ra được công cụ, phương pháp trong đánh giá kiến thức của học viên, viên chức trước & sau đào tạo.  Ứng dụng một phương pháp, công cụ đánh giá kiến thức học viên. (4 điểm)" },
                  { score: 5, label: "Mức 5: Tự tin, thành thạo trong  áp dụng công cụ, phương pháp đánh giá kiến thức của học viên, viên chức trước & sau đào tạo. Vận dụng trên hai công cụ đánh giá, đo lường kiến thức học viên. Giải thích được cơ sở khoa học cho phương pháp đánh giá. (5 điểm)" },
                ]
              },
              {
                id: 34,
                name: "Tham gia giảng dạy ít nhất 2 bài/năm/khoa hoặc 1 bài toàn bệnh viện",
                type: "single_choice",
                maxScore: 5,
                options: [
                  { score: 1, label: "Mức 1: có tham gia  \" đạt 5 điểm" },
                ]
              },
            ]
          },
          {
            id: "std_14",
            code: "TC 17",
            name: "Nghiên cứu khoa học",
            criteria: [
              {
                id: 35,
                name: "Hiểu biết về các kỹ thuật nghiên cứu, khảo sát, đánh giá, áp dụng phù hợp trong chăm sóc người bệnh",
                type: "single_choice",
                maxScore: 10,
                options: [
                  { score: 2, label: "Mức 1: Có tham gia NCKH với vai trò đối tượng lấy mẫu (2 điểm)" },
                  { score: 6, label: "Mức 3: Có được đào tạo cơ bản về NCKH và tham gia NCKH với vai trò người đi lấy mẫu (6 điểm)" },
                  { score: 8, label: "Mức 4: Có chứng chỉ/ chứng nhận đào tạo chuyên về NCKH và là thành viên của nhóm thực hiện đề tài NCKH  (8 điểm)" },
                  { score: 10, label: "Mức 5: Tham gia viết đề cương nghiên cứu khoa học (10 điểm)" },
                ]
              },
              {
                id: 36,
                name: "Sử dụng thành thạo công nghệ thông tin trong thu thập, phân tích số liệu (SPSS, STATA, R)",
                type: "single_choice",
                maxScore: 10,
                options: [
                  { score: 4, label: "Mức 2: Biết cách tìm và trích dẫn tài liệu liên quan đến nghiên cứu có giá trị (4 điểm)" },
                  { score: 6, label: "Mức 3: Biết cách tìm và trích dẫn tài liệu liên quan đến nghiên cứu có giá trị  Biết sử dụng phần mềm nhập liệu và phân tích số liệu (SPSS, STATA, R, …)  nhưng cần sử hỗ trợ  (6 điểm)" },
                  { score: 8, label: "Mức 4: Biết sử dụng thành thạo phần mềm nhập liệu và phân tích số liệu (SPSS, STATA, R, …)  (8 điểm)" },
                  { score: 10, label: "Mức 5: Có khả năng hướng dẫn các phần mềm nhập liệu và phân tích số liệu trong  NCKH (10 điểm)" },
                ]
              },
              {
                id: 37,
                name: "Chủ nhiệm đề tài cấp cơ sở, có công bố trên tạp chí trong nước",
                type: "single_choice",
                maxScore: 10,
                options: [
                  { score: 2, label: "Mức 1: Có tham gia NCKH với vai trò là người hỗ trợ chính/ Thư ký đề tài đã được phê duyệt đề cương và đang thực hiện (2 điểm)" },
                  { score: 4, label: "Mức 2: Là chủ nhiệm đề tài NCKH đã được phê duyệt đề cương và đang thực hiện. (4 điểm)" },
                  { score: 6, label: "Mức 3: Là chủ nhiệm đề tài NCKH đã được công nhận  (6 điểm)" },
                  { score: 8, label: "Mức 4: Là chủ nhiệm đề tài NCKH cấp cơ sở được công nhận và công bố trên tạp chí có số ISSN trong nước trong vòng 3 năm. (8 điểm)" },
                  { score: 10, label: "Mức 5: Là chủ nhiệm đề tài NCKH cấp cơ sở được công nhận và công bố trên tạp chí có số ISSN trong nước trong vòng 1 năm. (10 điểm)" },
                ]
              },
              {
                id: 38,
                name: "Chủ nhiệm đề tài cấp cơ sở, có công bố trên tạp chí trong nước (≥2 bài/năm); Hoặc chủ nhiệm đề tài cấp Thành phố (tính 1 lần)",
                type: "single_choice",
                maxScore: 15,
                options: [
                  { score: 3, label: "Mức 1: Có tham gia ít nhất 2 đề tài NCKH với vai trò là người hỗ trợ chính/ Thư ký đề tài đã được phê duyệt đề cương và đang thực hiện (5 điểm)" },
                  { score: 6, label: "Mức 2: Là chủ nhiệm ít nhất 2 đề tài NCKH đã được phê duyệt đề cương và đang thực hiện. (10 điểm)" },
                  { score: 9, label: "Mức 3: Là chủ nhiệm ít nhất 2 đề tài đề tài NCKH đã hoàn thành đang trong quá trình chờ thẩm định (9 điểm)" },
                  { score: 12, label: "Mức 4: Là chủ nhiệm đề tài cấp cơ sở ≥ 2 bài/ năm hoặc đề tài cấp tỉnh/ thành phố đã được công nhận và công bố trên tạp chí có số ISSN trong nước trong vòng 2 năm (12 điểm)" },
                  { score: 15, label: "Mức 5: Là chủ nhiệm đề tài cấp cơ sở ≥ 2 bài/ năm hoặc đề tài cấp tỉnh/ thành phố đã được công nhận và công bố trên tạp chí có số ISSN trong nước và được mời báo cáo hội nghị điều dưỡng ít nhất 2 lần về đề tài đã công bố trong vòng 2 năm (15 điểm)" },
                ]
              },
              {
                id: 39,
                name: "Đăng bài báo nước ngoài  Hoặc chủ nhiệm đề tài cấp nhà nước",
                type: "single_choice",
                maxScore: 20,
                options: [
                  { score: 4, label: "Mức 1: Có tên trong bài báo được đăng tạp chí uy tín ở nước ngoài hoặc đang tham gia đề tài cấp nhà nước, đề tài đã được phê duyệt đề cương và đang trong quá trình hoàn tất (4 điểm)" },
                  { score: 8, label: "Mức 2: Có tên trong bài báo được đăng tạp chí uy tín ở nước ngoài hoặc  tham gia đề tài cấp nhà nước, đề tài đã hoàn thành và đnag chờ thẩm định (8 điểm)" },
                  { score: 12, label: "Mức 3: là chủ nhiệm đề tài được đăng tạp chí uy tín ở nước ngoài hoặc  tham gia đề tài cấp nhà nước, đề tài đã hoàn thành và đang chờ thẩm định (12 điểm)" },
                  { score: 16, label: "Mức 4: Là chủ nhiệm đề tài được đăng tạp chí uy tín ở nước ngoài hoặc đề tài cấp nhà nước được công nhận trong vòng 5 năm (16 điểm)" },
                  { score: 20, label: "Mức 5: Là chủ nhiệm đề tài được đăng tạp chí uy tín ở nước ngoài hoặc đề tài cấp nhà nước được công nhận và mời báo cáo trong các hội nghị quốc tế ít nhất 1 lần về đề tài trong vòng 5 năm (20 điểm)" },
                ]
              },
            ]
          },
          {
            id: "std_15",
            code: "TC 18",
            name: "Thực hành dựa trên bằng chứng",
            criteria: [
              {
                id: 40,
                name: "Thực hiện nghiên cứu và có giải pháp thích hợp dựa trên kết quả nghiên cứu",
                type: "single_choice",
                maxScore: 10,
                options: [
                  { score: 2, label: "Mức 1: Có tham gia ít nhất 1 đề tài NCKH/ SKCT liên quan đến thực hành chăm sóc đã được phê duyệt đề cương và đang trong quá trình thực hiện (2 điểm)" },
                  { score: 4, label: "Mức 2: là chủ nhiệm ít nhất 1 đề tài NCKH/ SKCT liên quan đến thực hành chăm sóc đã được phê duyệt đề cương và đang trong quá trình thực hiện (4 điểm)" },
                  { score: 6, label: "Mức 3: Là chủ nhiệm ít nhất 1 đề tài NCKH/ SKCT liên quan đến thực hành chăm sóc đã hoàn thành, đang chờ thẩm định. (6 điểm)" },
                  { score: 8, label: "Mức 4: Là chủ nhiệm ít nhất 1 đề tài NCKH/ SKCT liên quan đến thực hành chăm sóc đã được công nhận. (8 điểm)" },
                  { score: 10, label: "Mức 5: Là chủ nhiệm đề tài mà  giải pháp cải tiến/ thay đổi thực hành chăm sóc dựa trên kết quả nghiên cứu được phân tích và đánh giá khả năng áp dụng (10 điểm)" },
                ]
              },
              {
                id: 41,
                name: "Ứng dụng kết quả NCKH vào thực hành chăm sóc, quản lý công việc",
                type: "single_choice",
                maxScore: 10,
                options: [
                  { score: 2, label: "Mức 1: Là chủ nhiệm đề tài mà giải pháp có kế hoạch áp dụng tại ít nhất 1 khoa/ 1 nhóm đối tượng liên quan. (2 điểm)" },
                  { score: 4, label: "Mức 2: Là chủ nhiệm đề tài mà giải pháp cải tiến/ thay đổi thực hành chăm sóc dựa trên kết quả nghiên cứu được áp dụng ít nhất tại một khoa/ một nhóm đối tượng liên quan (4 điểm)" },
                  { score: 6, label: "Mức 3: Là chủ nhiệm đề tài mà giải pháp cải tiến/ thay đổi thực hành chăm sóc dựa trên kết quả nghiên cứu được áp dụng ít nhất tại một khoa/ một nhóm đối tượng liên quan và đánh giá kết quả áp dụng (6 điểm)" },
                  { score: 8, label: "Mức 4: Là chủ nhiệm đề tài mà giải pháp cải tiến/ thay đổi thực hành chăm sóc được đánh giá hiệu quả áp dụng (8 điểm)" },
                  { score: 10, label: "Mức 5: Là chủ nhiệm đề tài mà giải pháp cải tiến/ thay đổi thực hành chăm sóc được đánh giá hiệu quả áp dụng và được áp dụng toàn viện (10 điểm)" },
                ]
              },
              {
                id: 42,
                name: "Sử dụng các bằng chứng từ nghiên cứu khoa học để nâng cao chất lượng thực hành chăm sóc",
                type: "single_choice",
                maxScore: 10,
                options: [
                  { score: 2, label: "Mức 1: Là chủ nhiệm đề tài mà  giải pháp cải tiến/ thay đổi thực hành chăm sóc dựa trên kết quả nghiên cứu được bệnh viện/ trường công nhận và được giải thưởng của trường/ bệnh viện  (2 điểm)" },
                  { score: 4, label: "Mức 2: Là chủ nhiệm đề tài mà  giải pháp cải tiến/ thay đổi thực hành chăm sóc dựa trên kết quả nghiên cứu được công nhận và công bố trên các tạp chí có uy tín trong nước (4 điểm)" },
                  { score: 6, label: "Mức 3: Là chủ nhiệm đề tài mà  giải pháp cải tiến/ thay đổi thực hành chăm sóc dựa trên kết quả nghiên cứu được nhận giải thưởng uy tín trong nước (6 điểm)" },
                  { score: 8, label: "Mức 4: Là chủ nhiệm đề tài mà  giải pháp cải tiến/ thay đổi thực hành chăm sóc dựa trên kết quả nghiên cứu được công nhận và công bố trên các tạp chí có uy tín trong nước. Đang trong quá trình đăng ký bản quyền sở hữu trí tuệ (8 điểm)" },
                  { score: 10, label: "Mức 5: Kết quả NCKH/SKCT, phát minh mới được đăng ký bản quyền sở hữu trí tuệ trong vòng 2 năm (10 điểm)" },
                ]
              },
            ]
          },
        ]
      },
      {
        id: "domain_4",
        code: "I",
        name: "NĂNG LỰC LÃNH ĐẠO & QUẢN LÝ",
        maxScore: 100,
        standards: [
          {
            id: "std_16",
            code: "TC 19",
            name: "Quản lý và sử dụng các trang thiết bị, dụng cụ y tế có hiệu quả",
            criteria: [
              {
                id: 43,
                name: "Hiểu biết về quy trình, quy định quản lý, sử dụng trang thiết bị, dụng cụ y tế, vật tư phục vụ cho chăm sóc",
                type: "single_choice",
                maxScore: 5,
                options: [
                  { score: 1, label: "Mức 1: Biết được: các loại máy, VTYT tại khoa (1 điểm)" },
                  { score: 2, label: "Mức 2: Biết sử dụng, vận hành các trang thiết bị, VTYT tại khoa cần sự hỗ trợ thường xuyên. (2 điểm)" },
                  { score: 3, label: "Mức 3: Biết sử dụng, vận hành các trang thiết bị, VTYT tại khoa thỉnh thoảng cần sự hỗ trợ. (3 điểm)" },
                  { score: 4, label: "Mức 4: Biết sử dụng, vận hành các trang thiết bị, VTYT tại khoa một cách độc lập. (4 điểm)" },
                  { score: 5, label: "Mức 5: Có khả năng hướng dẩn quy trình, quy định về sử dụng, vận hành các trang thiết bị, VTYT tại khoa. (5 điểm)" },
                ]
              },
              {
                id: 44,
                name: "Đề xuất các thiết bị, vật tư phù hợp;",
                type: "single_choice",
                maxScore: 5,
                options: [
                  { score: 3, label: "Mức 3: Xác định được các yêu cầu về trang thiết bị và vật tư phù hợp với chăm sóc bệnh nhân dựa trên bằng chứng khoa học. (3 điểm)" },
                  { score: 4, label: "Mức 4: Xác định được các yêu cầu về trang thiết bị và vật tư phù hợp với chăm sóc bệnh nhân dựa trên bằng chứng khoa học và có thực hiện đánh giá tại khoa đơn vị  (4 điểm)" },
                  { score: 5, label: "Mức 5: Đề xuất được các VTYT, trang thiết bị dựa trên bằng chứng khoa học và đánh giá thực tế tại khoa, đon vị (5 điểm)" },
                ]
              },
              {
                id: 45,
                name: "Lập kế hoạch bảo quản TTB, vật tư 1 cách hiệu quả",
                type: "single_choice",
                maxScore: 10,
                options: [
                  { score: 6, label: "Mức 3: Lập được kế hoạch bảo quản trang thiết bị, vật tư (6 điểm)" },
                  { score: 8, label: "Mức 4: Đảm bảo thực hiện kế hoạch đúng tiến độ (8 điểm)" },
                  { score: 10, label: "Mức 5: Có sáng kiến cải tiến trong bảo quản trang thiết bị, vật tư (10 điểm)" },
                ]
              },
              {
                id: 46,
                name: "Sử dụng thành thạo các trang thiết bị, phương tiện sử dụng trong chăm sóc an toàn, hiệu quả",
                type: "single_choice",
                maxScore: 10,
                options: [
                  { score: 6, label: "Mức 3: Vận dụng thành thạo và xử lý các vấn đề phát sinh trong quá trình sử dụng các trang thiết bị, VTYT tại khoa (6 điểm)" },
                  { score: 8, label: "Mức 4: Hiểu rõ nguyên lý hoạt động và phòng ngửa các sự cố liên quan đến việc sử dụng trang thiết bị (8 điểm)" },
                  { score: 10, label: "Mức 5: Đánh giá, đo lường việc sử dụng, và đề xuất cải tiến chất lượng an toàn và hiệu quả. (10 điểm)" },
                ]
              },
            ]
          },
          {
            id: "std_17",
            code: "TC 20",
            name: "Sử dụng nguồn tài chính thích hợp để chăm sóc NB hiệu quả",
            criteria: [
              {
                id: 47,
                name: "Đánh giá được hiệu quả kinh tế của các biện pháp chăm sóc tại bệnh viện",
                type: "single_choice",
                maxScore: 10,
                options: [
                  { score: 8, label: "Mức 4: Có nghiên cứu/đề án khảo sát hiệu quả kinh tế của một biện pháp, lĩnh vực chăm sóc tại khoa, đơn vị. (5 điểm)" },
                  { score: 10, label: "Mức 5: Có nghiên cứu/đề án khảo sát hiệu quả kinh tế của một biện pháp, lĩnh vực chăm sóc tại các khoa có nhu cầu. (10 điểm)" },
                ]
              },
              {
                id: 48,
                name: "Xây dựng kế hoạch sử dụng các nguồn lực trong chăm sóc người bệnh trong phạm vi phân công hiệu quả",
                type: "single_choice",
                maxScore: 10,
                options: [
                  { score: 8, label: "Mức 4: Có đánh giá, phân tích nhu cầu nguồn nhân lực phục vụ cho công tác chăm sóc hiệu quả  (5 điểm)" },
                  { score: 10, label: "Mức 5: Xây dựng được kế hoạch phân bổ nguồn nhân lực phù hợp nhu cầu chăm sóc tại khoa, đơn vị. (10 điểm)" },
                ]
              },
              {
                id: 49,
                name: "Tổ chức, triển khai thực hiện kế hoạch hiệu quả",
                type: "single_choice",
                maxScore: 10,
                options: [
                  { score: 8, label: "Mức 4: Có kế hoạch quản lý và dự toán nguồn tài chính phục vụ cho chăm sóc tại khoa, đơn vị.  (5 điểm)" },
                  { score: 10, label: "Mức 5: Triển khai đánh giá và đo lường hiệu quả của kế hoạch. (10 điểm)" },
                ]
              },
              {
                id: 50,
                name: "Có đề án cải tiến giúp bệnh viện ứng dụng hiệu quả",
                type: "single_choice",
                maxScore: 10,
                options: [
                  { score: 8, label: "Mức 4: Triển khai và báo cáo kết quả đề án cải tiến tại khoa, đơn vị. (5 điểm)" },
                  { score: 10, label: "Mức 5: Đề án được thẩm định và công nhận hiệu quả bởi Hội đồng chuyên môn. Được triển khai ứng dụng tại bệnh viện. (10 điểm)" },
                ]
              },
            ]
          },
          {
            id: "std_18",
            code: "TC 21",
            name: "Thiết lập môi trường làm việc hiệu quả, an toàn",
            criteria: [
              {
                id: 51,
                name: "Thiết bị các nội dung liên quan đến sức khỏe nghề nghiệp và luật pháp về an toàn lao động",
                type: "single_choice",
                maxScore: 5,
                options: [
                  { score: 3, label: "Mức 3: Có kiến thức về an toàn lao động, sức khỏe nghề nghiệp  (3 điểm)" },
                  { score: 4, label: "Mức 4: Có phổ biến, triển khai cho đồng nghiệp các nội dung liên quan đến sức khỏe nghề nghiệp và luật pháp về an toàn lao động  (4 điểm)" },
                  { score: 5, label: "Mức 5: Đề xuất được các giải pháp bảo vệ sức khỏe nghề nghiệp và tăng cường lao động. (5 điểm)" },
                ]
              },
              {
                id: 52,
                name: "Tuân thủ các tiêu chuẩn và quy tắc về an toàn lao động",
                type: "single_choice",
                maxScore: 5,
                options: [
                  { score: 1, label: "Mức 1: Có trường hợp không tuân thủ → 0 điểm" },
                ]
              },
              {
                id: 53,
                name: "Tuân thủ các chính sách, quy trình về phòng ngừa cách ly và kiểm soát nhiễm khuẩn (kiểm soát môi trường chăm sóc, quản lý và xử lý chất thải)",
                type: "single_choice",
                maxScore: 10,
                options: [
                  { score: 6, label: "Mức 3: Tuân thủ theo các quy trình về kiểm soát nhiễm khuẩn trong chăm sóc Người bệnh của khoa KSNK (6 điểm)" },
                  { score: 8, label: "Mức 4: Có kế hoạch giám sát/tham gia giám sát tuân thủ các chính sách, quy trình (8 điểm)" },
                  { score: 10, label: "Mức 5: Có giải pháp cải thiện và tăng cường sự tuân thủ của nhân viên (10 điểm)" },
                ]
              },
              {
                id: 54,
                name: "Tuân thủ quy định dự phòng phơi nhiễm với các tác nhân gây bệnh và biết được phương pháp xử lý",
                type: "single_choice",
                maxScore: 5,
                options: [
                  { score: 3, label: "Mức 3: Tuân thủ/triển khai các quy định dự phòng phơi nhiễm với các tác nhân gây bệnh và biết được phương pháp xử lý (3 điểm)" },
                  { score: 4, label: "Mức 4: Có kế hoạch giám sát/tham gia giám sát tuân thủ quy định  (4 điểm)" },
                  { score: 5, label: "Mức 5: Có giải pháp cải thiện và tăng cường sự tuân thủ của nhân viên  (5 điểm)" },
                ]
              },
              {
                id: 55,
                name: "Tuân thủ các quy trình an toàn phòng cháy chữa cháy và các trường hợp khẩn cấp khác",
                type: "single_choice",
                maxScore: 5,
                options: [
                  { score: 4, label: "Mức 4: Có kiến thức về an toàn phòng cháy chữa cháy và các trường hợp khẩn cấp khác (sử dụng các phương tiện chữa cháy, thoát hiểm,…)  (3 điểm)" },
                  { score: 5, label: "Mức 5: Có kiến thức về xử lý/quản lý tinh huống (5 điểm)" },
                ]
              },
            ]
          },
        ]
      },
      {
        id: "domain_5",
        code: "V",
        name: "PHÁT TRIỂN  CHUYÊN MÔN CÁ NHÂN & CHẤT LƯỢNG",
        maxScore: 150,
        standards: [
          {
            id: "std_19",
            code: "TC 22",
            name: "Duy trì và phát triển năng lực cho cá nhân và đồng nghiệp",
            criteria: [
              {
                id: 56,
                name: "Xác định rõ mục tiêu, nguyện vọng phát triển nghề nghiệp và biết được điểm mạnh và yếu của bản thân",
                type: "single_choice",
                maxScore: 10,
                options: [
                  { score: 6, label: "Mức 3: Nêu được những điểm mạnh, điểm yếu cá nhân và nguyện vọng phát triển nghề nghiệp.  (4 điểm)" },
                  { score: 8, label: "Mức 4: Có kế hoạch và đang thực hiện kế hoạch phát triển nghề nghiệp. (8 điểm)" },
                  { score: 10, label: "Mức 5: Đạt được các bằng cấp nâng cao trình độ chuyên môn, nghiệp vụ trong vòng 3 năm. (10 điểm)" },
                ]
              },
              {
                id: 57,
                name: "Chủ động tham gia tích cực đầy đủ hoạt động đào tạo liên tục của bệnh viện cấp khoa, cấp bệnh viện để liên tục nâng cao kiến thức và kỹ năng",
                type: "single_choice",
                maxScore: 10,
                options: [
                  { score: 6, label: "Mức 3: Đạt được 12 tiết trong năm  (6 điểm)" },
                  { score: 8, label: "Mức 4: Đạt được 24 tiết trong năm  (8 điểm)" },
                  { score: 10, label: "Mức 5: Đạt được >24 tiết trong năm -Và ít nhất 50% các chương trình đào tạo tập huấn nâng cao kiến thức chuyên môn và kỹ năng khác do bệnh viện tổ chức (10 điểm)" },
                ]
              },
              {
                id: 58,
                name: "Có thái độ tích cực với những đổi mới, quan điểm trái chiều, thể hiện sự lắng nghe các kiến nghị và các đề xuất, thử nghiệm các phương pháp mới",
                type: "single_choice",
                maxScore: 10,
                options: [
                  { score: 10, label: "Mức 5: Có thái độ tích cực với những đổi mới, quan điểm trái chiều, thể hiện sự lắng nghe các kiến nghị và các đề xuất, thử nghiệm các phương pháp mới  (10 điểm)" },
                ]
              },
              {
                id: 59,
                name: "Hỗ trợ tích cực, đóng góp vào việc đào tạo, nâng cao trình độ, phát triển nghề nghiệp cho đồng nghiệp",
                type: "single_choice",
                maxScore: 10,
                options: [
                  { score: 4, label: "Mức 2: Tham gia hướng dẫn lâm sàng  (4 điểm)" },
                  { score: 6, label: "Mức 3: Tham gia biên soạn nội dung chương trình đào tạo  (6 điểm)" },
                  { score: 8, label: "Mức 4: Tham gia giảng dạy tại khoa/đơn vị (8 điểm)" },
                  { score: 10, label: "Mức 5: Tham gia giảng dạy toàn bệnh viện  (10 điểm)" },
                ]
              },
            ]
          },
          {
            id: "std_20",
            code: "TC 23",
            name: "Cải tiến chất lượng chăm sóc",
            criteria: [
              {
                id: 60,
                name: "Hiểu được sự cần thiết về các hoạt động đảm bảo chất lượng thông qua nghiên cứu, phản hồi, đánh giá thực hành",
                type: "single_choice",
                maxScore: 10,
                options: [
                  { score: 6, label: "Mức 3: Có khảo sát các vấn đề còn tồn động trong hoạt động chăm sóc tại khoa, đơn vị  (6 điểm)" },
                  { score: 8, label: "Mức 4: Phân tích để xác định các vấn đề tồn động cần khắc phục (8 điểm)" },
                  { score: 10, label: "Mức 5: Có sự đánh giá và   theo dõi thường xuyên các vấn đề tồn động (10 điểm)" },
                ]
              },
              {
                id: 61,
                name: "Tiếp nhận, báo cáo, đưa ra biện pháp khắc phục hiệu quả",
                type: "single_choice",
                maxScore: 10,
                options: [
                  { score: 10, label: "Mức 5: Có đưa ra biện pháp khắc phục nhằm đảm bảo chất lượng chăm sóc (10 điểm)" },
                ]
              },
              {
                id: 62,
                name: "Dựa trên các tìm kiếm về vấn đề tồn tại của chuyên môn và hành chánh, đưa giải pháp cải tiến phù hợp, hiệu quả",
                type: "single_choice",
                maxScore: 10,
                options: [
                  { score: 6, label: "Mức 3: Xây dựng được kế hoạch cải tiến trong hoạt động chăm sóc tại khoa, đơn vị  (6 điểm)" },
                  { score: 8, label: "Mức 4: Thực hiện kế hoạch cải tiến nâng cao (8 điểm)" },
                  { score: 10, label: "Mức 5: Đánh giá hiệu quả cải tiến đã được thực hiện  (10 điểm)" },
                ]
              },
            ]
          },
          {
            id: "std_21",
            code: "TC 24",
            name: "Quản lý chăm sóc người bệnh",
            criteria: [
              {
                id: 63,
                name: "Xây dựng kế hoạch làm việc cho cá nhân hiệu quả và khoa học",
                type: "single_choice",
                maxScore: 10,
                options: [
                  { score: 6, label: "Mức 3: Xây dựng được mục tiêu công việc theo vị trí phân công (12điểm)" },
                  { score: 8, label: "Mức 4: Hoàn thành 80% mục tiêu công việc đã được xác định  (16điểm)" },
                  { score: 10, label: "Mức 5: Hoàn thành 100% mục tiêu công việc đã được xác định (20điểm)" },
                ]
              },
              {
                id: 64,
                name: "Xác định khối lượng công việc và có cách sắp xếp theo thứ tự ưu tiên 1 cách hiệu quả, hợp lý",
                type: "single_choice",
                maxScore: 10,
                options: [
                  { score: 10, label: "Xác định khối lượng công việc và có cách sắp xếp theo thứ tự ưu tiên 1 cách hiệu quả, hợp lý" },
                ]
              },
              {
                id: 65,
                name: "Tổ chức, điều phối, phân công và ủy quyền nhiệm vụ cho các thành viên của nhóm chăm sóc một cách khoa học, hợp lý, hiệu quả",
                type: "single_choice",
                maxScore: 10,
                options: [
                  { score: 6, label: "Mức 3: Có sự phân công vai trò của các thành viên trong nhóm chăm sóc (6điểm)" },
                  { score: 8, label: "Mức 4: Có sự giám sát hỗ trợ cho các thành viên của nhóm chăm sóc (8điểm)" },
                  { score: 10, label: "Mức 5: Có sự phân công, hỗ trợ và chia sẻ thông tin trong nhóm (10điểm)" },
                ]
              },
            ]
          },
          {
            id: "std_22",
            code: "TC 25",
            name: "Sự trải nghiệm nghề nghiệp",
            criteria: [
              {
                id: 66,
                name: "BV hạng đặc biệt, hạng 1",
                type: "single_choice",
                maxScore: 50,
                options: [
                  { score: 5, label: "Mức 1: Cách tính thâm niên công tác đối với những nhân viên đã công tác tại các bệnh viện khác trước khi làm việc tại BV ĐHYD  Ghi chú: 1* và 2*: Bằng cấp trung học chỉ áp dụng đến năm 2024                 Đối với ĐD có thâm niên công tác từ các BV khác: trải nghiệm nghề nghiệp được tính bằng bậc lương theo BV chi trả quy đổi sang số năm (Ví dụ: Bậc lương CN là 2/9 --> trải nghiệm nghề nghiệp: 2x3-6 năm, bậc lương TH là 2/12 --> trải nghiệm nghề nghiệp: 2x2=4 năm)" },
                  { score: 10, label: "BV hạng 2, 3" },
                  { score: 35, label: "BV hạng đặc biệt, hạng 1" },
                  { score: 15, label: "BV hạng 2" },
                  { score: 45, label: "BV hạng đặc biệt, hạng 1" },
                  { score: 20, label: "BV hạng 2" },
                  { score: 50, label: "BV hạng đặc biệt, hạng 1" },
                  { score: 25, label: "BV hạng 2" },
                ]
              },
            ]
          },
        ]
      },
    ]
  },
  "lab": {
    id: "lab",
    name: "Kỹ thuật viên Xét nghiệm & Sinh học phân tử",
    shortName: "Xét nghiệm",
    totalCriteria: 63,
    maxScore: 1125,
    units: ["Khoa Xét nghiệm", "Khoa Sinh học phân tử"],
    domains: [
      {
        id: "domain_1",
        code: "I",
        name: "TIÊU CHUẨN BẰNG CẤP & TRÌNH ĐỘ CHUYÊN MÔN",
        maxScore: 180,
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
                  { label: "Cao đẳng / Trung học Kỹ thuật y học từ trường khác", score: 15 },
                  { label: "Cao đẳng / Trung học Kỹ thuật y học từ ĐH Quốc tế Hồng Bàng", score: 20 },
                  { label: "Cao đẳng / Trung học Kỹ thuật y học từ ĐH Y khoa Phạm Ngọc Thạch", score: 25 },
                  { label: "Cao đẳng / Trung học Kỹ thuật y học từ ĐHYD TP.HCM", score: 30 },
                  { label: "ĐH Y Dược Huế, ĐHYD Cần Thơ, ĐH Kỹ thuật y học Nam Định, ĐH Nguyễn Tất Thành, ĐH khác", score: 50 },
                  { label: "ĐH Quốc tế Hồng Bàng", score: 60 },
                  { label: "ĐH Y Hà Nội, ĐH Y khoa Phạm Ngọc Thạch, ĐH Yersin", score: 70 },
                  { label: "ĐH Quốc tế Miền Đông", score: 80 },
                  { label: "Đại học Y Dược TP.HCM", score: 90 },
                  { label: "ĐH Kỹ thuật y học từ Châu Âu (trừ Đông Âu), Mỹ, Canada, New Zealand, Úc, Nhật Bản, Hàn Quốc, Singapore, Đài Loan, Malaysia", score: 100 }
                ]
              },
              {
                id: 2,
                name: "Bằng sau đại học (Chuyên khoa 1 / Thạc sĩ / Tiến sĩ)",
                type: "single_choice",
                maxScore: 40,
                options: [
                  { label: "Chưa có bằng sau đại học", score: 0 },
                  { label: "Chuyên khoa 1 / Thạc sĩ", score: 25 },
                  { label: "Tiến sĩ", score: 40 }
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
          }
        ]
      },
      {
        id: "domain_2",
        code: "I",
        name: "NĂNG LỰC THỰC HÀNH CHĂM SÓC NGƯỜI BỆNH",
        maxScore: 600,
        standards: [
          {
            id: "std_2",
            code: "TC 5",
            name: "Hành nghề theo pháp luật",
            criteria: [
              {
                id: 7,
                name: "Tuân thủ các quy định tại cơ sở làm việc - Có mặt tại nơi làm việc - Tuân thủ thời gian làm việc - Tuân thủ quy định đồng phục, bảng tên - Tham gia hội họp, sinh hoạt tập thể  - Ý thức bảo vệ tài sản tại đơn vị/BV",
                type: "single_choice",
                maxScore: 5,
                options: [
                  { score: 1, label: "Mức 1: 4 lần vi phạm (1 điểm)" },
                  { score: 2, label: "Mức 2: 3 lần vi phạm (2 điểm)" },
                  { score: 3, label: "Mức 3: 2 lần vi phạm (3 điểm)" },
                  { score: 4, label: "Mức 4: 1 lần vi phạm (4 điểm)" },
                  { score: 5, label: "Mức 5: 0 lần vi phạm (5 điểm)" },
                ]
              },
              {
                id: 8,
                name: "Tuân thủ các quy định hành nghề theo luật định liên quan đến y tế, thực hành Kỹ thuật Y xét nghiệm , BYT  (Luật khám chữa bệnh, Nghị định 103/2016, thông tư số 01/2013, thông tư 26/2013, thông tư 49/2018, thông tư 51/2017, …)",
                type: "single_choice",
                maxScore: 5,
                options: [
                  { score: 1, label: "Mức 1: 4 lần vi phạm (1 điểm)" },
                  { score: 2, label: "Mức 2: 3 lần vi phạm (2 điểm)" },
                  { score: 3, label: "Mức 3: 2 lần vi phạm (3 điểm)" },
                  { score: 4, label: "Mức 4: 1 lần vi phạm (4 điểm)" },
                  { score: 5, label: "Mức 5: 0 lần vi phạm (5 điểm)" },
                ]
              },
              {
                id: 9,
                name: "Thực hiện tốt quy tắc ứng xử của tổ chức và luật định  - Sự phối hợp, hợp tác với đồng nghiệp - Ứng xử với đồng nghiệp - Giao tiếp với khách hàng/NB",
                type: "single_choice",
                maxScore: 5,
                options: [
                  { score: 3, label: "Mức 3: Phối hợp với đồng nghiệp nhưng chưa chủ động hoặc do được yêu cầu Quan hệ, giao tiếp tốt với đồng nghiệp, NB (3 điểm)" },
                  { score: 4, label: "Mức 4: Chủ động phối hợp với đồng nghiệp để giải quyết công việc Hòa nhã, vui vẻ, sẵn sàng hỗ trợ với đồng nghiệp, khách hàng/NB (4 điểm)" },
                  { score: 5, label: "Mức 5: Phối hợp công việc 1 cách nhanh nhẹn, hiệu quả Ứng xử nhanh nhẹn, giải quyết mọi vấn đề, quan hệ tốt với đồng nghiệp trong và ngoài đơn vị Giao tiếp tốt với NB, chăm sóc được NB khó tính (5 điểm)" },
                ]
              },
            ]
          },
          {
            id: "std_3",
            code: "TC 6",
            name: "Hành nghề theo tiêu chuẩn đạo đức nghề nghiệp",
            criteria: [
              {
                id: 10,
                name: "Tuân thủ Quy định về Y Đức của nhân viên Y tế",
                type: "single_choice",
                maxScore: 5,
                options: [
                  { score: 2, label: "Mức 2: Nhân viên chủ yếu tuân thủ quy định về y đức nhưng đôi lần vi phạm do lơ là hoặc vô ý (2 điểm)" },
                  { score: 3, label: "Mức 3: Nhân viên tuân thủ đầy đủ quy định về y đức, nhưng cần phải cải thiện kỹ năng và hiểu biết để đạt được mức độ cao hơn (3 điểm)" },
                  { score: 4, label: "Mức 4: Nhân viên tuân thủ đầy đủ quy định về y đức, có kỹ năng và hiểu biết tốt về y đức trong công việc (4 điểm)" },
                  { score: 5, label: "Mức 5: Nhân viên tuân thủ đầy đủ quy định về y đức, có kỹ năng và hiểu biết sâu sắc về y đức trong công việc, còn giúp đỡ và hướng dẫn những người khác tuân thủ quy định về y đức (5 điểm)" },
                ]
              },
              {
                id: 11,
                name: "Tuân thủ tiêu chuẩn đạo đức, không đỗ lỗi cho đồng nghiệp, người bệnh đối với các sai sót của cá nhân. Bảo vệ hình ảnh đồng nghiệp trước người bệnh/người nhà và xã hội. - Không nhận tiền và lợi ích từ NB - Tôn trọng và tự nguyện tham gia các hoạt động của Hội ngành nghề xét nghiệm - Tôn trọng và bảo vệ danh dự, uy tính của đồng nghiệp - Hợp tác, giúp đỡ và truyền thụ kinh nghiệm cho đồng nghiệp",
                type: "single_choice",
                maxScore: 5,
                options: [
                  { score: 1, label: "Mức 1: 4 lần vi phạm (1 điểm)" },
                  { score: 2, label: "Mức 2: 3 lần vi phạm (2 điểm)" },
                  { score: 3, label: "Mức 3: 2 lần vi phạm (3 điểm)" },
                  { score: 4, label: "Mức 4: 1 lần vi phạm (4 điểm)" },
                  { score: 5, label: "Mức 5: 0 lần vi phạm (5 điểm)" },
                ]
              },
              {
                id: 12,
                name: "Quảng bá hình ảnh người Kỹ thuật Y xét nghiệm , thể hiện tác phong và tư cách tốt, trang phục phù hợp, lời nói thuyết phục và cách cư xử đúng mực. - Tác phong và chuẩn mực (sạch sẽ, gọn gàng, tươm tất) - Tư cách và lời nói (nhanh nhẹn, vui vẻ, than thiện, hòa đồng) - Không ngừng nâng cao năng lực hành nghề - Tự tôn nghề nghiệp - Cam kết với cộng đồng và xã hội",
                type: "single_choice",
                maxScore: 5,
                options: [
                  { score: 1, label: "Mức 1: 4 lần vi phạm (1 điểm)" },
                  { score: 2, label: "Mức 2: 3 lần vi phạm (2 điểm)" },
                  { score: 3, label: "Mức 3: 2 lần vi phạm (3 điểm)" },
                  { score: 4, label: "Mức 4: 1 lần vi phạm (4 điểm)" },
                  { score: 5, label: "Mức 5: 0 lần vi phạm (5 điểm)" },
                ]
              },
            ]
          },
          {
            id: "std_4",
            code: "TC 7",
            name: "Hiểu biết về an toàn sinh học",
            criteria: [
              {
                id: 13,
                name: "Phân loại cấp độ an toàn sinh học dựa trên các nhóm nguy cơ tại phòng xét nghiệm",
                type: "single_choice",
                maxScore: 10,
                options: [
                  { score: 2, label: "Mức 1: Nhân viên hiểu biết cơ bản về các nhóm nguy cơ sinh học (ví dụ: Nhóm nguy cơ 1 đến 4) nhưng chưa có khả năng phân loại chính xác cho từng loại xét nghiệm cụ thể. (2 diểm)" },
                  { score: 4, label: "Mức 2: Nhân viên có thể nhận diện được các nhóm nguy cơ sinh học dựa trên các hướng dẫn cơ bản nhưng cần sự hỗ trợ khi phân loại cho các loại xét nghiệm phức tạp. (4 diểm)" },
                  { score: 6, label: "Mức 3: Nhân viên có thể phân loại các cấp độ an toàn sinh học một cách độc lập dựa trên hướng dẫn và phân tích nguy cơ tại phòng xét nghiệm. (6 diểm)" },
                  { score: 8, label: "Mức 4: Nhân viên thành thạo trong việc phân loại và có thể hướng dẫn hoặc kiểm tra việc phân loại an toàn sinh học của đồng nghiệp. (8 diểm)" },
                  { score: 10, label: "Mức 5: Nhân viên có khả năng đánh giá và cải thiện hệ thống phân loại an toàn sinh học, đồng thời tham gia vào việc xây dựng các quy trình phân loại tại bệnh viện. (10 diểm)" },
                ]
              },
              {
                id: 14,
                name: "Quản lý an toàn phòng xét nghiệm: Đảm bảo nhiệm vụ và trách nhiệm của nhân viên an toàn",
                type: "single_choice",
                maxScore: 15,
                options: [
                  { score: 3, label: "Mức 1: Nhân viên hiểu nhiệm vụ cơ bản của nhân viên an toàn nhưng chưa thể thực hiện đầy đủ các trách nhiệm an toàn. (3 điểm)" },
                  { score: 6, label: "Mức 2: Nhân viên thực hiện các nhiệm vụ an toàn phòng xét nghiệm đơn giản dưới sự giám sát. (6 điểm)" },
                  { score: 9, label: "Mức 3: Nhân viên có khả năng tự quản lý an toàn trong khu vực của mình và đảm bảo rằng các tiêu chuẩn an toàn được tuân thủ. (9 điểm)" },
                  { score: 12, label: "Mức 4: Nhân viên có thể quản lý toàn bộ an toàn phòng xét nghiệm, đào tạo và hướng dẫn nhân viên khác về các quy trình an toàn. (12 điểm)" },
                  { score: 15, label: "Mức 5: Nhân viên có khả năng phát triển và cải thiện các chính sách an toàn, đóng góp vào việc quản lý rủi ro tại phòng xét nghiệm, đảm bảo tuân thủ các quy định quốc gia và quốc tế. (15 điểm)" },
                ]
              },
              {
                id: 15,
                name: "Phân loại chất thải và đảm bảo an toàn trong xử lý chất thải phòng xét nghiệm",
                type: "single_choice",
                maxScore: 20,
                options: [
                  { score: 4, label: "Mức 1: Nhân viên nhận diện được một số loại chất thải sinh học nhưng chưa hiểu rõ quy trình phân loại và xử lý an toàn. (4 điểm)" },
                  { score: 8, label: "Mức 2: Nhân viên có khả năng phân loại cơ bản các loại chất thải (sinh học, hóa học) và xử lý chúng dưới sự giám sát (8 điểm)" },
                  { score: 12, label: "Mức 3: Nhân viên phân loại và xử lý chất thải phòng xét nghiệm một cách độc lập, tuân thủ các hướng dẫn về an toàn. (12 điểm)" },
                  { score: 16, label: "Mức 4: Nhân viên thành thạo trong việc hướng dẫn và giám sát việc phân loại, xử lý chất thải, đồng thời đảm bảo an toàn cho đồng nghiệp. (16 điểm)" },
                  { score: 20, label: "Mức 5: Nhân viên có khả năng xây dựng và cải tiến các quy trình phân loại và xử lý chất thải, đảm bảo rằng toàn bộ quy trình đáp ứng các tiêu chuẩn về an toàn sinh học và môi trường. (20 điểm)" },
                ]
              },
              {
                id: 16,
                name: "Tuân thủ, đảm bảo an toàn trong việc lưu trữ mẫu bệnh phẩm",
                type: "single_choice",
                maxScore: 25,
                options: [
                  { score: 5, label: "Mức 1: Nhân viên hiểu quy trình cơ bản về lưu trữ mẫu nhưng có thể chưa nhận thức được các nguy cơ liên quan đến từng loại mẫu bệnh phẩm. (5 diểm)" },
                  { score: 10, label: "Mức 2: Nhân viên thực hiện việc lưu trữ mẫu bệnh phẩm dưới sự giám sát, tuân theo các quy trình được hướng dẫn. (10 diểm)" },
                  { score: 15, label: "Mức 3: Nhân viên có khả năng tự lưu trữ mẫu bệnh phẩm một cách an toàn, đảm bảo các điều kiện bảo quản phù hợp cho từng loại mẫu. (15 diểm)" },
                  { score: 20, label: "Mức 4: Nhân viên thành thạo trong việc quản lý và giám sát việc lưu trữ mẫu, đảm bảo rằng mọi mẫu bệnh phẩm đều được bảo quản theo đúng quy định và tiêu chuẩn an toàn (20 diểm)" },
                  { score: 25, label: "Mức 5: Nhân viên có thể xây dựng và cải tiến quy trình lưu trữ mẫu bệnh phẩm, đồng thời đảm bảo tuân thủ các tiêu chuẩn quốc gia và quốc tế về lưu trữ và vận chuyển mẫu bệnh phẩm. (25 diểm)" },
                ]
              },
              {
                id: 17,
                name: "Thực hành an toàn sinh học trong phòng xét nghiệm",
                type: "single_choice",
                maxScore: 40,
                options: [
                  { score: 8, label: "Mức 1: Nhân viên nắm được những thực hành an toàn sinh học cơ bản nhưng vẫn cần sự giám sát thường xuyên. (8 điểm)" },
                  { score: 16, label: "Mức 2: Nhân viên có thể tuân thủ các quy định an toàn sinh học cơ bản trong quá trình làm việc, với sự giám sát tối thiểu. (16 điểm)" },
                  { score: 24, label: "Mức 3: Nhân viên thực hiện các thực hành an toàn sinh học một cách độc lập, đảm bảo không vi phạm các quy định về an toàn. (24 điểm)" },
                  { score: 32, label: "Mức 4: Nhân viên có khả năng giám sát và hướng dẫn các đồng nghiệp về thực hành an toàn sinh học trong phòng xét nghiệm. (32 điểm)" },
                  { score: 40, label: "Mức 5: Nhân viên có thể phát triển và điều chỉnh các chính sách về thực hành an toàn sinh học tại phòng xét nghiệm, nhằm đảm bảo tuân thủ các tiêu chuẩn cao nhất về an toàn. (40 điểm)" },
                ]
              },
            ]
          },
          {
            id: "std_5",
            code: "TC 8",
            name: "Năng lực lập kế hoạch thực hiện hệ thống quản lý chất lượng xét nghiệm",
            criteria: [
              {
                id: 18,
                name: "Tuân thủ các bước thực hiện hệ thống quản lý chất lượng 12 thành tố và ISO 15189",
                type: "single_choice",
                maxScore: 50,
                options: [
                  { score: 2, label: "Mức 1: Nhân viên có hiểu biết cơ bản về hệ thống quản lý chất lượng 12 thành tố và ISO 15189, nhưng cần hướng dẫn chi tiết khi thực hiện. (2 điểm)" },
                  { score: 4, label: "Mức 2: Nhân viên có thể tuân thủ một số bước trong hệ thống quản lý chất lượng 12 thành tố và ISO 15189 khi có sự giám sát. (4 điểm)" },
                  { score: 6, label: "Mức 3: Nhân viên có khả năng thực hiện độc lập toàn bộ các bước của hệ thống quản lý chất lượng 12 thành tố và đảm bảo tuân thủ theo tiêu chuẩn ISO 15189. (6 điểm)" },
                  { score: 8, label: "Mức 4: Nhân viên thành thạo trong việc giám sát và hướng dẫn đồng nghiệp tuân thủ hệ thống quản lý chất lượng 12 thành tố và ISO 15189. (8 điểm)" },
                  { score: 10, label: "Mức 5: Nhân viên có thể xây dựng, điều chỉnh và cải tiến quy trình thực hiện hệ thống quản lý chất lượng 12 thành tố, đảm bảo phù hợp với tiêu chuẩn ISO 15189. (10 điểm)" },
                  { score: 20, label: "Xây dựng các chỉ số chất lượng của 03 giai đoạn quá trình xét nghiệm dựa trên mục tiêu chất lượng của phòng xét nghiệm" },
                  { score: 30, label: "Hiểu được cấu trúc hệ thống quản lý chất lượng và mối quan hệ với hệ thống tài liệu" },
                  { score: 50, label: "Thiết lập mục tiêu và kế hoạch chất lượng phòng xét nghiệm" },
                ]
              },
            ]
          },
          {
            id: "std_6",
            code: "TC 9",
            name: "Năng lực ứng dụng kỹ thuật xét nghiệm",
            criteria: [
              {
                id: 19,
                name: "Vận hành và thực hiện chạy mẫu bệnh phẩm trên hệ thống tự động",
                type: "single_choice",
                maxScore: 80,
                options: [
                  { score: 8, label: "Mức 1: Nhân viên hiểu biết cơ bản về quy trình chạy mẫu trên hệ thống tự động nhưng chưa có khả năng vận hành độc lập. (8 diểm)" },
                  { score: 16, label: "Mức 2: Nhân viên có thể vận hành hệ thống tự động dưới sự giám sát chặt chẽ. (16 diểm)" },
                  { score: 24, label: "Mức 3: Nhân viên vận hành và thực hiện chạy mẫu trên hệ thống tự động một cách độc lập, tuân thủ các quy trình kỹ thuật. (24 diểm)" },
                  { score: 32, label: "Mức 4: Nhân viên thành thạo trong việc vận hành, khắc phục sự cố cơ bản của hệ thống tự động và hướng dẫn đồng nghiệp sử dụng. (32 diểm)" },
                  { score: 40, label: "Mức 5: Nhân viên có khả năng đánh giá, cải tiến quy trình vận hành hệ thống tự động và đảm bảo hiệu quả hoạt động. (40 diểm)" },
                  { score: 50, label: "Hiệu chuẩn máy, thuốc thử đạt yêu cầu phân tích" },
                  { score: 60, label: "Hướng dẫn và đào tạo nhân viên mới" },
                  { score: 70, label: "Xây dựng và thực hiện quy trình kiểm soát chất lượng (nội kiểm, ngoại kiểm)" },
                  { score: 80, label: "Xác nhận giá trị sử dụng đã có: xét nghiệm định lượng, xét nghiệm định tính và bán định lượng" },
                ]
              },
            ]
          },
          {
            id: "std_7",
            code: "TC 10",
            name: "Năng lực đảm bảo chất lượng xét nghiệm",
            criteria: [
              {
                id: 20,
                name: "Thực hiện đảm bảo chất lượng trước xét nghiệm",
                type: "single_choice",
                maxScore: 20,
                options: [
                  { score: 4, label: "Mức 1: Nhân viên hiểu biết cơ bản về các quy trình trước xét nghiệm (như tiếp nhận, dán nhãn mẫu, nhận dạng người bệnh, lấy mẫu), nhưng cần sự giám sát để đảm bảo tuân thủ các quy trình. (4 điểm)" },
                  { score: 8, label: "Mức 2: Nhân viên có thể thực hiện độc lập các bước cơ bản của quy trình trước xét nghiệm như lấy mẫu, vận chuyển, và bảo quản mẫu bệnh phẩm, nhưng vẫn cần sự hướng dẫn cho các quy trình phức tạp hơn. (8 điểm)" },
                  { score: 12, label: "Mức 3: Nhân viên thành thạo trong việc thực hiện toàn bộ quy trình đảm bảo chất lượng trước xét nghiệm, từ chuẩn bị bệnh nhân, lấy mẫu, ghi nhãn chính xác đến vận chuyển và bảo quản mẫu bệnh phẩm một cách độc lập, đồng thời nhận diện và xử lý các yếu tố ảnh hưởng đến chất lượng mẫu. (12 điểm)" },
                  { score: 16, label: "Mức 4: Nhân viên có khả năng giám sát, đào tạo và đánh giá hiệu quả của các quy trình trước xét nghiệm, đảm bảo rằng các tiêu chuẩn chất lượng luôn được tuân thủ. (16 điểm)" },
                  { score: 20, label: "Mức 5: Nhân viên có thể phát triển và cải tiến quy trình đảm bảo chất lượng trước xét nghiệm, tối ưu hóa các bước để giảm thiểu sai sót, nâng cao độ chính xác và hiệu quả của quá trình này. (20 điểm)" },
                ]
              },
              {
                id: 32,
                name: "Đánh giá nội kiểm chất lượng và ngoại kiểm chất lượng trong xét nghiệm",
                type: "single_choice",
                maxScore: 30,
                options: [
                  { score: 6, label: "Mức 1: Nhân viên hiểu khái niệm cơ bản về nội kiểm và ngoại kiểm, nhưng chưa thể đánh giá độc lập. Họ cần sự hướng dẫn khi thực hiện các bước liên quan. (6 điểm)" },
                  { score: 12, label: "Mức 2: Nhân viên có thể thực hiện đánh giá nội kiểm, ngoại kiểm nhưng cần có sự giám sát. (12 điểm)" },
                  { score: 18, label: "Mức 3: Nhân  viên có khả năng thực hiện và đánh giá nội kiểm chất lượng một cách độc lập, đảm bảo rằng các kết quả xét nghiệm đạt độ chính xác yêu cầu, và biết cách đánh giá kết quả từ các chương trình ngoại kiểm, đảm bảo tính nhất quán giữa các lần kiểm tra. (18 điểm)" },
                  { score: 24, label: "Mức 4: Nhân viên thành thạo trong việc thiết lập, giám sát, và phân tích kết quả nội kiểm và ngoại kiểm, đảm bảo rằng mọi sai lệch đều được nhận diện và điều chỉnh kịp thời. Đồng thời, họ có thể hướng dẫn đồng nghiệp về các quy trình nội và ngoại kiểm. (24 điểm)" },
                  { score: 30, label: "Mức 5: Nhân viên có khả năng phát triển các chiến lược kiểm soát chất lượng, tối ưu hóa quy trình nội kiểm và ngoại kiểm, và xây dựng các chính sách kiểm soát chất lượng toàn diện cho phòng xét nghiệm, tham gia vào các chương trình ngoại kiểm quốc gia và quốc tế. (30 điểm)" },
                ]
              },
              {
                id: 33,
                name: "Nhận định và phát hành kết quả xét nghiệm sau phân tích",
                type: "single_choice",
                maxScore: 50,
                options: [
                  { score: 10, label: "Mức 1: Nhân viên có khả năng thực hiện việc kiểm tra các kết quả xét nghiệm sau phân tích nhưng cần sự giám sát và hướng dẫn để đánh giá tính hợp lý của kết quả. (10 điểm)" },
                  { score: 20, label: "Mức 2: Nhân viên có thể thực hiện kiểm tra kết quả sau phân tích dưới sự giám sát, đảm bảo không có sai sót rõ ràng và có thể hỗ trợ phát hành kết quả. (20 điểm)" },
                  { score: 30, label: "Mức 3: Nhân viên có khả năng đánh giá kết quả xét nghiệm sau phân tích một cách độc lập, phát hiện những bất thường và đưa ra nhận định về độ chính xác của kết quả trước khi phát hành. Họ có thể yêu cầu kiểm tra lại các bước nếu kết quả không đạt yêu cầu.(30 điểm)" },
                  { score: 40, label: "Mức 4: Nhân viên thành thạo trong việc nhận định và phát hành kết quả xét nghiệm, bao gồm đánh giá sự phù hợp của kết quả với tình trạng lâm sàng của bệnh nhân. Họ có thể hướng dẫn và giám sát các đồng nghiệp khác trong quy trình này. (40 điểm)" },
                  { score: 50, label: "Mức 5: Nhân viên có khả năng xây dựng quy trình đánh giá và phát hành kết quả xét nghiệm, đảm bảo sự phù hợp giữa các bước phân tích và lâm sàng, và có thể đóng góp vào việc phát triển các tiêu chuẩn chất lượng sau phân tích trong phòng xét nghiệm.(50 điểm)" },
                ]
              },
            ]
          },
          {
            id: "std_8",
            code: "TC 11",
            name: "Năng lực quản lý chất lượng xét nghiệm",
            criteria: [
              {
                id: 21,
                name: "Ghi chép và lưu trữ hồ sơ quản lý chất lượng xét nghiệm bảo đảm chính xác, đầy đủ và kịp thời",
                type: "single_choice",
                maxScore: 40,
                options: [
                  { score: 4, label: "Mức 1: Chỉ thực hiện ghi chép cơ bản và có thể thiếu chính xác hoặc đầy đủ. (4 điểm)" },
                  { score: 8, label: "Mức 2: Ghi chép và lưu trữ được cải thiện, nhưng đôi khi vẫn thiếu kịp thời hoặc thiếu thông tin. (8 điểm)" },
                  { score: 12, label: "Mức 3: Ghi chép và lưu trữ chính xác, đầy đủ, nhưng cần hỗ trợ về hệ thống hóa thông tin. (12 điểm)" },
                  { score: 16, label: "Mức 4: Có khả năng tự ghi chép, lưu trữ hồ sơ một cách đầy đủ, chính xác và kịp thời, cũng như sắp xếp có hệ thống. (16 điểm)" },
                  { score: 20, label: "Mức 5: Thành thạo trong việc quản lý hồ sơ và có khả năng cải tiến hệ thống lưu trữ và ghi chép để tối ưu hóa quy trình quản lý chất lượng. (20 điểm)" },
                  { score: 40, label: "Xây dựng chỉ số chất lượng (KPI) cho từng chỉ tiêu xét nghiệm cần theo dõi" },
                ]
              },
              {
                id: 35,
                name: "Theo dõi và đánh giá hiệu quả chỉ số chất lượng và áp dụng thực tiễn",
                type: "single_choice",
                maxScore: 60,
                options: [
                  { score: 24, label: "Mức 2: Có theo dõi nhưng chưa thể đánh giá hiệu quả chỉ số chất lượng rõ ràng (15 điểm)" },
                  { score: 36, label: "Mức 3: Bắt đầu đánh giá hiệu quả của chỉ số chất lượng và áp dụng vào thực tiễn nhưng chưa tối ưu (30 điểm)" },
                  { score: 48, label: "Mức 4: Theo dõi và đánh giá chỉ số chất lượng một cách có hệ thống và ứng dụng hiệu quả vào quy trình. (45 điểm)" },
                  { score: 60, label: "Mức 5: Thành thạo trong việc đánh giá chỉ số chất lượng, cải tiến liên tục và có khả năng tối ưu hóa các quy trình thực tiễn dựa trên đánh giá chỉ số chất lượng. (60 điểm)" },
                ]
              },
              {
                id: 36,
                name: "Cải tiến và phát triển sơ đồ quá trình xét nghiệm (trước, trong và sau xét nghiệm)",
                type: "single_choice",
                maxScore: 80,
                options: [
                  { score: 32, label: "Mức 2: Hiểu sơ bộ về quá trình xét nghiệm và có thể tham gia cải tiến dưới sự hướng dẫn (20 điểm)" },
                  { score: 48, label: "Mức 3: Có khả năng cải tiến các phần của quy trình xét nghiệm nhưng cần sự hỗ trợ. (40 điểm)" },
                  { score: 64, label: "Mức 4: Thực hiện cải tiến các quy trình xét nghiệm một cách độc lập và hiệu quả. (60 điểm)" },
                  { score: 80, label: "Mức 5: Thành thạo trong việc cải tiến và phát triển toàn bộ quy trình xét nghiệm (trước, trong và sau) và có khả năng hướng dẫn nhân viên khác trong việc này. (80 điểm)" },
                ]
              },
            ]
          },
          {
            id: "std_9",
            code: "TC 12",
            name: "Giao tiếp hiệu quả với đồng nghiệp và cấp trên",
            criteria: [
              {
                id: 22,
                name: "Hợp tác làm việc nhóm và làm việc độc lập hiệu quả Chia sẻ thông tin một cách hiệu quả",
                type: "single_choice",
                maxScore: 15,
                options: [
                  { score: 3, label: "Mức 1: Không thể làm việc trong nhóm, thường xuyên gây xung đột và không hoàn thành công việc cá nhân. Không chia sẻ thông tin, gây khó khăn cho đồng nghiệp và khách hàng. (3 điểm)" },
                  { score: 6, label: "Mức 2: Thỉnh thoảng hợp tác với nhóm nhưng thường cần sự hỗ trợ để hoàn thành công việc cá nhân Chia sẻ thông tin không đầy đủ hoặc không đúng lúc, gây hiểu lầm. (6 điểm)" },
                  { score: 9, label: "Mức 3: Có khả năng làm việc trong nhóm và độc lập, nhưng đôi khi thiếu sự chủ động. Chia sẻ thông tin khi cần thiết, nhưng chưa chủ động. (9 điểm)" },
                  { score: 12, label: "Mức 4: Hợp tác tốt trong nhóm, chủ động hoàn thành công việc cá nhân và hỗ trợ đồng nghiệp khi cần Chia sẻ thông tin một cách chủ động và kịp thời, giúp đồng nghiệp và khách hàng hiểu rõ hơn. (12 điểm)" },
                  { score: 15, label: "Mức 5: Là người dẫn dắt trong nhóm, luôn hoàn thành công việc cá nhân một cách xuất sắc và khuyến khích đồng nghiệp hợp tác. Luôn chủ động chia sẻ thông tin, tạo ra môi trường làm việc minh bạch và hiệu quả. (15 điểm)" },
                ]
              },
              {
                id: 23,
                name: "Chủ động chia sẻ những thông tin và phản hồi thường xuyên với đồng nghiệp và khách hàng bên trong (bác sĩ, điều dưỡng, hộ lý)",
                type: "single_choice",
                maxScore: 10,
                options: [
                  { score: 6, label: "Mức 3: -Thông báo kịp thời kết quả xét nghiệm có quyết định lâm sàng liên quan đến người bệnh cho bác sĩ điều trị; - Hỗ trợ, phối hợp với kỹ thuật y khác trong việc thực hiện kỹ thuật chuyên môn được giao. (6 điểm)" },
                  { score: 8, label: "Mức 4: - Thông báo kịp thời kết quả xét nghiệm có quyết định lâm sàng liên quan đến người bệnh cho bác sĩ điều trị; - Tham gia hội chẩn mẫu xét nghiệm khi được phân công. (8 điểm)" },
                  { score: 10, label: "Mức 5: - Thông báo kịp thời kết quả xét nghiệm có quyết định lâm sàng đến người bệnh cho bác sĩ điều trị; đề xuất chỉ định thêm xét nghiệm khác giúp chẩn đoán và điều trị trường hợp cần thiết; - Tham gia hội chẩn mẫu xét nghiệm khi được phân công. (10 điểm)" },
                ]
              },
              {
                id: 24,
                name: "Giao tiếp hiệu quả với đồng nghiệp và khách hàng bên trong",
                type: "single_choice",
                maxScore: 10,
                options: [
                  { score: 2, label: "Mức 1: Giao tiếp kém, thường xuyên gây hiểu lầm và không thể truyền đạt thông điệp.  (2 điểm)" },
                  { score: 4, label: "Mức 2: Giao tiếp không rõ ràng, cần cải thiện khả năng lắng nghe và phản hồi. (4 điểm)" },
                  { score: 6, label: "Mức 3: Giao tiếp hiệu quả ở mức độ cơ bản, nhưng chưa thực sự thu hút và thuyết phục.  (6 điểm)" },
                  { score: 8, label: "Mức 4: Giao tiếp rõ ràng, lắng nghe tốt và có khả năng thuyết phục đồng nghiệp (8 điểm)" },
                  { score: 10, label: "Mức 5: Giao tiếp xuất sắc, có khả năng truyền đạt thông điệp một cách rõ ràng và thuyết phục, đồng thời lắng nghe và phản hồi một cách nhạy bén, tạo ra mối quan hệ tốt với đồng nghiệp và khách hàng (10 điểm)" },
                ]
              },
              {
                id: 25,
                name: "Cam kết bảo mật thông tin bên trong và bên ngoài",
                type: "single_choice",
                maxScore: 15,
                options: [
                  { score: 9, label: "Mức 3: Có ý thức về bảo mật thông tin, nhưng đôi khi chưa thực hiện đầy đủ các biện pháp cần thiết. (5 điểm)" },
                  { score: 12, label: "Mức 4: Cam kết bảo mật thông tin, thực hiện tốt các quy định và hướng dẫn liên quan (10 điểm)" },
                  { score: 15, label: "Mức 5: Là tấm gương về bảo mật thông tin, chủ động đề xuất các biện pháp cải thiện quy trình bảo mật và đào tạo đồng nghiệp về tầm quan trọng của bảo mật thông tin. (15 điểm)" },
                ]
              },
            ]
          },
        ]
      },
      {
        id: "domain_3",
        code: "I",
        name: "NĂNG LỰC ĐÀO TẠO  NGHIÊN CỨU KHOA HỌC THỰC HÀNH DỰA TRÊN CHỨNG CỨ (EBP)",
        maxScore: 135,
        standards: [
          {
            id: "std_10",
            code: "TC 13",
            name: "Đào tạo",
            criteria: [
              {
                id: 26,
                name: "- Phân tích được mối quan hệ giữa nhu cầu đào tạo với trình độ, vị trí việc làm của đối tượng thuộc phạm vi phụ trách (5 điểm)",
                type: "single_choice",
                maxScore: 5,
                options: [
                  { score: 3, label: "Mức 3: Cần sự hướng dẫn trong tìm hiểu, phân tích mối tương quan giữa nhu cầu đào tạo với trình độ, vị trí làm việc; (3 điểm)" },
                  { score: 4, label: "Mức 4: Thực hiện và báo cáo kết quả khảo sát, nghiên cứu mối quan hệ giữa nhu cầu đào tạo với trình độ, vị trí làm việc (4 điểm)" },
                  { score: 5, label: "Mức 5: Thực hiện và báo cáo kết quả khảo sát, nghiên cứu mối quan hệ giữa nhu cầu đào tạo với trình độ, vị trí làm việc; Đề xuất được các giải pháp dựa trên kết quả báo cáo. (5 điểm)" },
                  { score: 5, label: "- Xây dựng được kế hoạch đào tạo (5 điểm)" },
                ]
              },
              {
                id: 27,
                name: "Đề xuất, xây dựng các phương pháp đào tạo linh động, phù hợp với hoàn cảnh đảm bảo nâng cao chất lượng đào tạo",
                type: "single_choice",
                maxScore: 10,
                options: [
                  { score: 6, label: "Mức 3: Cần sự hỗ trợ trong xây dựng phương pháp đào tạo phù hợp với yêu cầu của nội dung đào tạo.  (6 điểm)" },
                  { score: 8, label: "Mức 4: Có phương pháp đào tạo phù hợp với nội dung, yêu cầu của nội dung đào tạo.  Vận dụng được phương pháp đào tạo phù hợp với hoàn cảnh đào tạo. (8 điểm)" },
                  { score: 10, label: "Mức 5: Có sự thay đổi thường xuyên các chương trình, nội dung đào tạo hàng năm  Vận dụng đa dạng trên ba phương pháp đào tạo phù hợp với yêu cầu của nội dung đào tạo  (10 điểm)" },
                ]
              },
              {
                id: 28,
                name: "Tổ chức thực hiện được kế hoạch đào tạo và tham gia đào tạo theo đúng tiến độ và đạt chất lượng: -Kế hoạch đào tạo, tham gia đào tạo theo đúng tiến độ (5đ) -Kế hoạch đào tạo đạt chất lượng (5đ)",
                type: "single_choice",
                maxScore: 10,
                options: [
                  { score: 6, label: "Mức 3: Cần sự hỗ trợ, hoặc giám sát tiến độ thực hiện kế hoạch đào tạo;  Có  dưới 2 chương trình  đào tạo trễ hạn dưới 1 tháng so với kế hoạch năm (3 điểm)" },
                  { score: 8, label: "Mức 4: Độc lập theo dõi kế hoạch đào tạo, tổ chức đào tạo đúng tiến độ;  Không có chương trình trễ hạn. (4 điểm)" },
                  { score: 10, label: "Mức 5: Biết phối hợp nhiều phương pháp, kỹ năng theo dõi kế hoạch đào tạo, tổ chức đào tạo đúng tiến độ;  Hoàn thành các nội dung, chương trình đào tạo sớm hơn tiến độ trong kế hoạch đề ra (5 điểm)" },
                ]
              },
              {
                id: 29,
                name: "Đánh giá được hiệu quả đào tạo: thống kê, phân tích, diễn giải và báo cáo theo kế hoạch; Có chỉ ra những nhược điểm khắc cần khắc phục và đề xuất giải pháp cải tiến chất lượng (-Thống kê, phân tích, diễn giải và báo cáo theo kế hoạch (5đ) -Cải tiến chất lượng đào tạo (5đ))",
                type: "single_choice",
                maxScore: 5,
                options: [
                  { score: 3, label: "Mức 3: Cần hướng dẫn trong đánh giá, đo lường hiệu quả trước & sau đào tạo; (3 điểm)" },
                  { score: 4, label: "Mức 4: Độc lập đánh giá, đo lường và báo cáo hiệu quả trước & sau đào tạo;  Cần sự hướng dẫn trong phân tích, diễn giải kết quả đo lường. (4 điểm)" },
                  { score: 5, label: "Mức 5: Biết cách vận dụng nhiều kỹ năng đánh giá, đo lường và báo cáo hiệu quả trước & sau đào tạo;  Đưa ra được phân tích, diễn giải kết quả đo lường, thống kê (5 điểm)" },
                ]
              },
              {
                id: 30,
                name: "Xây dựng được công cụ, phương pháp đánh giá thay đổi kiến thức của người được đào tạo và sau khi đào tạo",
                type: "single_choice",
                maxScore: 5,
                options: [
                  { score: 3, label: "Mức 3: Cần sự hướng dẫn liên tục, thường xuyên trong việc tìm, xây dựng công cụ, phương pháp đánh giá kiến thức của học viên. (3 điểm)" },
                  { score: 4, label: "Mức 4: Độc lập đưa ra được công cụ, phương pháp trong đánh giá kiến thức của học viên, viên chức trước & sau đào tạo.  Ứng dụng một phương pháp, công cụ đánh giá kiến thức học viên. (4 điểm)" },
                  { score: 5, label: "Mức 5: Tự tin, thành thạo trong  áp dụng công cụ, phương pháp đánh giá kiến thức của học viên, viên chức trước & sau đào tạo. Vận dụng trên hai công cụ đánh giá, đo lường kiến thức học viên. Giải thích được cơ sở khoa học cho phương pháp đánh giá. (5 điểm)" },
                ]
              },
              {
                id: 31,
                name: "Tham gia giảng dạy ít nhất 2 bài/năm/khoa hoặc 1 bài toàn bệnh viện",
                type: "single_choice",
                maxScore: 5,
                options: [
                  { score: 1, label: "Mức 1: có tham gia  \" đạt 5 điểm" },
                ]
              },
            ]
          },
          {
            id: "std_11",
            code: "TC 14",
            name: "Nghiên cứu khoa học",
            criteria: [
              {
                id: 32,
                name: "Hiểu biết về các kỹ thuật nghiên cứu, khảo sát, đánh giá, áp dụng phù hợp trong chăm sóc người bệnh",
                type: "single_choice",
                maxScore: 10,
                options: [
                  { score: 2, label: "Mức 1: Có tham gia NCKH với vai trò đối tượng lấy mẫu (2 điểm)" },
                  { score: 6, label: "Mức 3: Có được đào tạo cơ bản về NCKH và tham gia NCKH với vai trò người đi lấy mẫu (6 điểm)" },
                  { score: 8, label: "Mức 4: Có chứng chỉ/ chứng nhận đào tạo chuyên về NCKH và là thành viên của nhóm thực hiện đề tài NCKH  (8 điểm)" },
                  { score: 10, label: "Mức 5: Tham gia viết đề cương nghiên cứu khoa học (10 điểm)" },
                ]
              },
              {
                id: 33,
                name: "Sử dụng thành thạo công nghệ thông tin trong thu thập, phân tích số liệu (SPSS, STATA, R)",
                type: "single_choice",
                maxScore: 10,
                options: [
                  { score: 4, label: "Mức 2: Biết cách tìm và trích dẫn tài liệu liên quan đến nghiên cứu có giá trị (4 điểm)" },
                  { score: 6, label: "Mức 3: Biết cách tìm và trích dẫn tài liệu liên quan đến nghiên cứu có giá trị Biết sử dụng phần mềm nhập liệu và phân tích số liệu (SPSS, STATA, R, …)  nhưng cần sử hỗ trợ  (6 điểm)" },
                  { score: 8, label: "Mức 4: Biết sử dụng thành thạo phần mềm nhập liệu và phân tích số liệu (SPSS, STATA, R, …)  (8 điểm)" },
                  { score: 10, label: "Mức 5: Có khả năng hướng dẫn các phần mềm nhập liệu và phân tích số liệu trong  NCKH (10 điểm)" },
                ]
              },
              {
                id: 34,
                name: "Chủ nhiệm đề tài cấp cơ sở, có công bố trên tạp chí trong nước",
                type: "single_choice",
                maxScore: 10,
                options: [
                  { score: 2, label: "Mức 1: Có tham gia NCKH với vai trò là người hỗ trợ chính/ Thư ký đề tài đã được phê duyệt đề cương và đang thực hiện (2 điểm)" },
                  { score: 4, label: "Mức 2: Là chủ nhiệm đề tài NCKH đã được phê duyệt đề cương và đang thực hiện. (4 điểm)" },
                  { score: 6, label: "Mức 3: Là chủ nhiệm đề tài NCKH đã được công nhận  (6 điểm)" },
                  { score: 8, label: "Mức 4: Là chủ nhiệm đề tài NCKH cấp cơ sở được công nhận và công bố trên tạp chí có số ISSN trong nước trong vòng 3 năm. (8 điểm)" },
                  { score: 10, label: "Mức 5: Là chủ nhiệm đề tài NCKH cấp cơ sở được công nhận và công bố trên tạp chí có số ISSN trong nước trong vòng 1 năm. (10 điểm)" },
                ]
              },
              {
                id: 35,
                name: "Chủ nhiệm đề tài cấp cơ sở, có công bố trên tạp chí trong nước (≥2 bài/năm); Hoặc chủ nhiệm đề tài cấp Thành phố (tính 1 lần)",
                type: "single_choice",
                maxScore: 15,
                options: [
                  { score: 3, label: "Mức 1: Có tham gia ít nhất 2 đề tài NCKH với vai trò là người hỗ trợ chính/ Thư ký đề tài đã được phê duyệt đề cương và đang thực hiện (5 điểm)" },
                  { score: 6, label: "Mức 2: Là chủ nhiệm ít nhất 2 đề tài NCKH đã được phê duyệt đề cương và đang thực hiện. (10 điểm)" },
                  { score: 9, label: "Mức 3: Là chủ nhiệm ít nhất 2 đề tài đề tài NCKH đã hoàn thành đang trong quá trình chờ thẩm định (9 điểm)" },
                  { score: 12, label: "Mức 4: Là chủ nhiệm đề tài cấp cơ sở ≥ 2 bài/ năm hoặc đề tài cấp tỉnh/ thành phố đã được công nhận và công bố trên tạp chí có số ISSN trong nước trong vòng 2 năm (12 điểm)" },
                  { score: 15, label: "Mức 5: Là chủ nhiệm đề tài cấp cơ sở ≥ 2 bài/ năm hoặc đề tài cấp tỉnh/ thành phố đã được công nhận và công bố trên tạp chí có số ISSN trong nước và được mời báo cáo hội nghị điều dưỡng ít nhất 2 lần về đề tài đã công bố trong vòng 2 năm (15 điểm)" },
                ]
              },
              {
                id: 36,
                name: "Đăng bài báo nước ngoài  Hoặc chủ nhiệm đề tài cấp nhà nước",
                type: "single_choice",
                maxScore: 20,
                options: [
                  { score: 4, label: "Mức 1: Có tên trong bài báo được đăng tạp chí uy tín ở nước ngoài hoặc đang tham gia đề tài cấp nhà nước, đề tài đã được phê duyệt đề cương và đang trong quá trình hoàn tất (4 điểm)" },
                  { score: 8, label: "Mức 2: Có tên trong bài báo được đăng tạp chí uy tín ở nước ngoài hoặc  tham gia đề tài cấp nhà nước, đề tài đã hoàn thành và đnag chờ thẩm định (8 điểm)" },
                  { score: 12, label: "Mức 3: là chủ nhiệm đề tài được đăng tạp chí uy tín ở nước ngoài hoặc  tham gia đề tài cấp nhà nước, đề tài đã hoàn thành và đang chờ thẩm định (12 điểm)" },
                  { score: 16, label: "Mức 4: Là chủ nhiệm đề tài được đăng tạp chí uy tín ở nước ngoài hoặc đề tài cấp nhà nước được công nhận trong vòng 5 năm (16 điểm)" },
                  { score: 20, label: "Mức 5: Là chủ nhiệm đề tài được đăng tạp chí uy tín ở nước ngoài hoặc đề tài cấp nhà nước được công nhận và mời báo cáo trong các hội nghị quốc tế ít nhất 1 lần về đề tài trong vòng 5 năm (20 điểm)" },
                ]
              },
            ]
          },
          {
            id: "std_12",
            code: "TC 15",
            name: "Thực hành dựa trên bằng chứng",
            criteria: [
              {
                id: 37,
                name: "Thực hiện nghiên cứu và có giải pháp thích hợp dựa trên kết quả nghiên cứu",
                type: "single_choice",
                maxScore: 10,
                options: [
                  { score: 2, label: "Mức 1: Có tham gia ít nhất 1 đề tài NCKH/ SKCT liên quan đến thực hành chăm sóc đã được phê duyệt đề cương và đang trong quá trình thực hiện (2 điểm)" },
                  { score: 4, label: "Mức 2: là chủ nhiệm ít nhất 1 đề tài NCKH/ SKCT liên quan đến thực hành chăm sóc đã được phê duyệt đề cương và đang trong quá trình thực hiện (4 điểm)" },
                  { score: 6, label: "Mức 3: Là chủ nhiệm ít nhất 1 đề tài NCKH/ SKCT liên quan đến thực hành chăm sóc đã hoàn thành, đang chờ thẩm định. (6 điểm)" },
                  { score: 8, label: "Mức 4: Là chủ nhiệm ít nhất 1 đề tài NCKH/ SKCT liên quan đến thực hành chăm sóc đã được công nhận. (8 điểm)" },
                  { score: 10, label: "Mức 5: Là chủ nhiệm đề tài mà  giải pháp cải tiến/ thay đổi thực hành chăm sóc dựa trên kết quả nghiên cứu được phân tích và đánh giá khả năng áp dụng (10 điểm)" },
                ]
              },
              {
                id: 38,
                name: "Ứng dụng kết quả NCKH vào thực hiện chuyên môn xét nghiệm, quản lý công việc",
                type: "single_choice",
                maxScore: 10,
                options: [
                  { score: 2, label: "Mức 1: Là chủ nhiệm đề tài mà giải pháp có kế hoạch áp dụng tại ít nhất 1 khoa/ 1 nhóm đối tượng liên quan. (2 điểm)" },
                  { score: 4, label: "Mức 2: Là chủ nhiệm đề tài mà giải pháp cải tiến/ thay đổi kỹ thuật xét nghiệm, quản lý chất lượng xét nghiệm, an toàn phòng xét nghiệm dựa trên kết quả nghiên cứu được áp dụng ít nhất tại một khoa/ một nhóm đối tượng liên quan (4 điểm)" },
                  { score: 6, label: "Mức 3: Là chủ nhiệm đề tài mà giải pháp cải tiến/ thay đổi kỹ thuật xét nghiệm, quản lý chất lượng xét nghiệm, an toàn phòng xét nghiệm dựa trên kết quả nghiên cứu được áp dụng ít nhất tại một khoa/ một nhóm đối tượng liên quan và đánh giá kết quả áp dụng (6 điểm)" },
                  { score: 8, label: "Mức 4: Là chủ nhiệm đề tài mà giải pháp cải tiến/ thay đổi kỹ thuật xét nghiệm, quản lý chất lượng xét nghiệm, an toàn phòng xét nghiệm được đánh giá hiệu quả áp dụng (8 điểm)" },
                  { score: 10, label: "Mức 5: Là chủ nhiệm đề tài mà giải pháp cải tiến/ thay đổi kỹ thuật xét nghiệm, quản lý chất lượng xét nghiệm, an toàn phòng xét nghiệm được đánh giá hiệu quả áp dụng và được áp dụng toàn viện (10 điểm)" },
                ]
              },
              {
                id: 39,
                name: "Sử dụng các bằng chứng từ nghiên cứu khoa học để nâng cao chất lượng xét nghiệm",
                type: "single_choice",
                maxScore: 10,
                options: [
                  { score: 2, label: "Mức 1: Là chủ nhiệm đề tài mà  giải pháp cải tiến/ thay đổi kỹ thuật xét nghiệm, quản lý chất lượng xét nghiệm, an toàn phòng xét nghiệm dựa trên kết quả nghiên cứu được bệnh viện/ trường công nhận và được giải thưởng của trường/ bệnh viện  (2 điểm)" },
                  { score: 4, label: "Mức 2: Là chủ nhiệm đề tài mà  giải pháp cải tiến/ thay đổi kỹ thuật xét nghiệm, quản lý chất lượng xét nghiệm, an toàn phòng xét nghiệm dựa trên kết quả nghiên cứu được công nhận và công bố trên các tạp chí có uy tín trong nước (4 điểm)" },
                  { score: 6, label: "Mức 3: Là chủ nhiệm đề tài mà  giải pháp cải tiến/ thay đổi kỹ thuật xét nghiệm, quản lý chất lượng xét nghiệm, an toàn phòng xét nghiệm dựa trên kết quả nghiên cứu được nhận giải thưởng uy tín trong nước (6 điểm)" },
                  { score: 8, label: "Mức 4: Là chủ nhiệm đề tài mà  giải pháp cải tiến/ thay đổi kỹ thuật xét nghiệm, quản lý chất lượng xét nghiệm, an toàn phòng xét nghiệm dựa trên kết quả nghiên cứu được công nhận và công bố trên các tạp chí có uy tín trong nước. Đang trong quá trình đăng ký bản quyền sở hữu trí tuệ (8 điểm)" },
                  { score: 10, label: "Mức 5: Kết quả NCKH/SKCT, phát minh mới được đăng ký bản quyền sở hữu trí tuệ trong vòng 2 năm (10 điểm)" },
                ]
              },
            ]
          },
        ]
      },
      {
        id: "domain_4",
        code: "I",
        name: "NĂNG LỰC LÃNH ĐẠO & QUẢN LÝ",
        maxScore: 100,
        standards: [
          {
            id: "std_13",
            code: "TC 16",
            name: "Quản lý và sử dụng các trang thiết bị, dụng cụ y tế có hiệu quả",
            criteria: [
              {
                id: 40,
                name: "Hiểu biết về quy trình, quy định quản lý, sử dụng trang thiết bị, dụng cụ y tế, vật tư phục vụ cho xét nghiệm",
                type: "single_choice",
                maxScore: 5,
                options: [
                  { score: 1, label: "Mức 1: Biết được: các loại thiết bị, hóa chất, sinh phẩm, vật tư tại khoa  (1 điểm)" },
                  { score: 2, label: "Mức 2: Biết sử dụng, vận hành các trang thiết bị, hóa chất, sinh phẩm, vật tư tại khoa cần sự hỗ trợ thường xuyên. (2 điểm)" },
                  { score: 3, label: "Mức 3: Biết sử dụng, vận hành các trang thiết bị, hóa chất, sinh phẩm, vật tư tại khoa thỉnh thoảng cần sự hỗ trợ.  (3 điểm)" },
                  { score: 4, label: "Mức 4: Biết sử dụng, vận hành các trang thiết bị, hóa chất, sinh phẩm, vật tư  tại khoa một cách độc lập.  (4 điểm)" },
                  { score: 5, label: "Mức 5: Có khả năng hướng dẩn quy trình, quy định về sử dụng, vận hành các trang thiết bị, hóa chất, sinh phẩm, vật tư tại khoa.  (5 điểm)" },
                ]
              },
              {
                id: 41,
                name: "Đề xuất các thiết bị, vật tư phù hợp;",
                type: "single_choice",
                maxScore: 5,
                options: [
                  { score: 3, label: "Mức 3: Xác định được các yêu cầu về trang thiết bị ,hóa chất, sinh phẩm, vật tư phù hợp với  kỹ thuật xét nghiệm dựa trên bằng chứng khoa học. ( 3 điểm)" },
                  { score: 4, label: "Mức 4: Xác định được các yêu cầu về trang thiết bị,  hóa chất, sinh phẩm, vật tư phù hợp với  kỹ thuật xét nghiệm dựa trên bằng chứng khoa học và có thực hiện đánh giá tại khoa/ đơn vị   (4 điểm)" },
                  { score: 5, label: "Mức 5: Đề xuất được các trang thiết bị,  hóa chất, sinh phẩm, vật tư phù hợp với  kỹ thuật xét nghiệm dựa trên bằng chứng khoa học và có thực hiện đánh giá tại khoa/ đơn vị   (5 điểm)" },
                ]
              },
              {
                id: 42,
                name: "Lập kế hoạch bảo quản TTB, vật tư 1 cách hiệu quả",
                type: "single_choice",
                maxScore: 10,
                options: [
                  { score: 6, label: "Mức 3: Lập được kế hoạch bảo quản trang thiết bị, hóa chất, sinh phẩm, vật tư (6 điểm)" },
                  { score: 8, label: "Mức 4: Đảm bảo thực hiện kế hoạch đúng tiến độ  (8 điểm)" },
                  { score: 10, label: "Mức 5: Có sáng kiến cải tiến trong bảo quản trang thiết bị, hóa chất, sinh phẩm, vật tư (10 điểm)" },
                ]
              },
              {
                id: 43,
                name: "Sử dụng thành thạo các trang thiết bị, phương tiện sử dụng trong xét nghiệm an toàn, hiệu quả",
                type: "single_choice",
                maxScore: 10,
                options: [
                  { score: 6, label: "Mức 3: Vận dụng thành thạo và xử lý các vấn đề phát sinh trong quá trình sử dụng các trang thiết bị, hóa chất, sinh phẩm, vật tư tại khoa  (6 điểm)" },
                  { score: 8, label: "Mức 4: Hiểu rõ nguyên lý hoạt động và phòng ngừa các sự cố liên quan đến việc sử dụng trang thiết bị, hóa chất, sinh phẩm, vật tư  (8 điểm)" },
                  { score: 10, label: "Mức 5: Đánh giá, đo lường việc sử dụng và đề xuất cải tiến việc sử dụng trang thiết bị, hóa chất, sinh phẩm, vật tư  an toàn và hiệu quả. (10 điểm)" },
                ]
              },
            ]
          },
          {
            id: "std_14",
            code: "TC 17",
            name: "Sử dụng nguồn tài chính thích hợp trong phân tích xét nghiệm hiệu quả",
            criteria: [
              {
                id: 44,
                name: "Đánh giá được hiệu quả kinh tế của các kỹ thuật xét nghiệm triển khai tại bệnh viện",
                type: "single_choice",
                maxScore: 10,
                options: [
                  { score: 8, label: "Mức 4: Có nghiên cứu/đề án khảo sát hiệu quả kinh tế của một kỹ thuật xét nghiệm thực hiện tại khoa, đơn vị. (5 điểm)" },
                  { score: 10, label: "Mức 5: Có nghiên cứu/đề án khảo sát hiệu quả kinh tế của kỹ thuật xét nghiệm thực hiện đáp ứng nhu cầu điều trị các khoa lâm sàng. (10 điểm)" },
                ]
              },
              {
                id: 45,
                name: "Xây dựng kế hoạch sử dụng các nguồn lực trong xét nghiệm trong phạm vi phân công hiệu quả",
                type: "single_choice",
                maxScore: 10,
                options: [
                  { score: 8, label: "Mức 4: Có đánh giá, phân tích nhu cầu nguồn nhân lực phục vụ cho công tác thực hiện chuyên môn xét nghiệm tại khoa hiệu quả  (5 điểm)" },
                  { score: 10, label: "Mức 5: Xây dựng được kế hoạch phân bổ nguồn nhân lực phù hợp nhu cầu thực hiện chuyên môn tại khoa, đơn vị.  (10 điểm)" },
                ]
              },
              {
                id: 46,
                name: "Tổ chức, triển khai thực hiện kế hoạch hiệu quả",
                type: "single_choice",
                maxScore: 10,
                options: [
                  { score: 8, label: "Mức 4: Có kế hoạch quản lý và dự toán nguồn tài chính phục vụ cho công tác chuyên môn tại khoa, đơn vị.  (5 điểm)" },
                  { score: 10, label: "Mức 5: Triển khai đánh giá và đo lường hiệu quả của kế hoạch. (10 điểm)" },
                ]
              },
              {
                id: 47,
                name: "Có đề án cải tiến giúp bệnh viện ứng dụng hiệu quả",
                type: "single_choice",
                maxScore: 10,
                options: [
                  { score: 8, label: "Mức 4: Triển khai và báo cáo kết quả đề án cải tiến tại khoa, đơn vị. (5 điểm)" },
                  { score: 10, label: "Mức 5: Đề án được thẩm định và công nhận hiệu quả bởi Hội đồng chuyên môn. Được triển khai ứng dụng tại bệnh viện. (10 điểm)" },
                ]
              },
            ]
          },
          {
            id: "std_15",
            code: "TC 18",
            name: "Thiết lập môi trường làm việc hiệu quả, an toàn",
            criteria: [
              {
                id: 48,
                name: "Thiết bị các nội dung liên quan đến sức khỏe nghề nghiệp và luật pháp về an toàn lao động",
                type: "single_choice",
                maxScore: 5,
                options: [
                  { score: 3, label: "Mức 3: Có kiến thức về an toàn sinh học phòng xét nghiệm, an toàn lao động, sức khỏe nghề nghiệp  (3 điểm)" },
                  { score: 4, label: "Mức 4: Có phổ biến, triển khai cho đồng nghiệp các nội dung liên quan đến an toàn sinh học phòng xét nghiệm, sức khỏe nghề nghiệp và luật pháp về an toàn lao động  (4 điểm)" },
                  { score: 5, label: "Mức 5: Đề xuất được các giải pháp bảo vệ sức khỏe nghề nghiệp, tăng cường an toàn lao động, an toàn sinh học phòng xét nghiệm.  (5 điểm)" },
                ]
              },
              {
                id: 49,
                name: "Tuân thủ các tiêu chuẩn và quy tắc về an toàn lao động",
                type: "single_choice",
                maxScore: 5,
                options: [
                  { score: 3, label: "Mức 3: Tuân thủ các tiêu chuẩn và quy tắc về an toàn lao động, nhưng đôi khi chưa thực hiện đầy đủ các biện pháp cần thiết (3 điểm)" },
                  { score: 4, label: "Mức 4: Tuân thủ tốt các tiêu chuẩn và quy tắc về an toàn lao động, thực hiện tốt các biện pháp phòng ngừa và đảm bảo an toàn (4 điểm)" },
                  { score: 5, label: "Mức 5: Là tấm gương về tuân thủ các tiêu chuẩn và quy tắc về an toàn lao động, chủ động đề xuất các biện pháp cải thiện quy trình an toàn và đào tạo đồng nghiệp về tầm quan trọng của an toàn lao động (5 điểm)" },
                ]
              },
              {
                id: 50,
                name: "Tuân thủ các chính sách, quy trình về phòng ngừa cách ly và kiểm soát nhiễm khuẩn (kiểm soát môi trường phân tích xét nghiệm, quản lý và xử lý chất thải)",
                type: "single_choice",
                maxScore: 10,
                options: [
                  { score: 6, label: "Mức 3: Tuân thủ theo các quy trình về kiểm soát nhiễm khuẩn trong chăm sóc Người bệnh của Ban KSNK  (6 điểm)" },
                  { score: 8, label: "Mức 4: Có kế hoạch giám sát/tham gia giám sát tuân thủ các chính sách, quy trình  (8 điểm)" },
                  { score: 10, label: "Mức 5: Có giải pháp cải thiện và tăng cường sự tuân thủ của nhân viên  (10 điểm)" },
                ]
              },
              {
                id: 51,
                name: "Tuân thủ quy định dự phòng phơi nhiễm với các tác nhân gây bệnh và biết được phương pháp xử lý",
                type: "single_choice",
                maxScore: 5,
                options: [
                  { score: 3, label: "Mức 3: Tuân thủ/triển khai các quy định dự phòng phơi nhiễm với các tác nhân gây bệnh và biết được phương pháp xử lý (3 điểm)" },
                  { score: 4, label: "Mức 4: Có kế hoạch giám sát/tham gia giám sát tuân thủ quy định  (4 điểm)" },
                  { score: 5, label: "Mức 5: Có giải pháp cải thiện và tăng cường sự tuân thủ của nhân viên  (5 điểm)" },
                ]
              },
              {
                id: 52,
                name: "Tuân thủ các quy trình an toàn phòng cháy chữa cháy và các trường hợp khẩn cấp khác",
                type: "single_choice",
                maxScore: 5,
                options: [
                  { score: 4, label: "Mức 4: Có kiến thức về an toàn phòng cháy chữa cháy và các trường hợp khẩn cấp khác (sử dụng các phương tiện chữa cháy, thoát hiểm,…)  (3 điểm)" },
                  { score: 5, label: "Mức 5: Có kiến thức về xử lý/quản lý tinh huống  (5 điểm)" },
                ]
              },
            ]
          },
        ]
      },
      {
        id: "domain_5",
        code: "V",
        name: "PHÁT TRIỂN  CHUYÊN MÔN CÁ NHÂN & CHẤT LƯỢNG",
        maxScore: 150,
        standards: [
          {
            id: "std_16",
            code: "TC 19",
            name: "Duy trì và phát triển năng lực cho cá nhân và đồng nghiệp",
            criteria: [
              {
                id: 53,
                name: "Xác định rõ mục tiêu, nguyện vọng phát triển nghề nghiệp và biết được điểm mạnh và yếu của bản thân",
                type: "single_choice",
                maxScore: 10,
                options: [
                  { score: 6, label: "Mức 3: Nêu được những điểm mạnh, điểm yếu cá nhân và nguyện vọng phát triển nghề nghiệp.  (4 điểm)" },
                  { score: 8, label: "Mức 4: Có kế hoạch và đang thực hiện kế hoạch phát triển nghề nghiệp. (8 điểm)" },
                  { score: 10, label: "Mức 5: Đạt được các bằng cấp nâng cao trình độ chuyên môn, nghiệp vụ trong vòng 3 năm. (10 điểm)" },
                ]
              },
              {
                id: 54,
                name: "Chủ động tham gia tích cực đầy đủ hoạt động đào tạo liên tục của bệnh viện cấp khoa, cấp bệnh viện để liên tục nâng cao kiến thức và kỹ năng",
                type: "single_choice",
                maxScore: 10,
                options: [
                  { score: 6, label: "Mức 3: Đạt được 12 tiết trong năm  (6 điểm)" },
                  { score: 8, label: "Mức 4: Đạt được 24 tiết trong năm  (8 điểm)" },
                  { score: 10, label: "Mức 5: Đạt được >24 tiết trong năm -Và ít nhất 50% các chương trình đào tạo tập huấn nâng cao kiến thức chuyên môn và kỹ năng khác do bệnh viện tổ chức (10 điểm)" },
                ]
              },
              {
                id: 55,
                name: "Có thái độ tích cực với những đổi mới, quan điểm trái chiều, thể hiện sự lắng nghe các kiến nghị và các đề xuất, thử nghiệm các phương pháp mới",
                type: "single_choice",
                maxScore: 10,
                options: [
                  { score: 10, label: "Mức 5: Có thái độ tích cực với những đổi mới, quan điểm trái chiều, thể hiện sự lắng nghe các kiến nghị và các đề xuất, thử nghiệm các phương pháp mới  (10 điểm)" },
                ]
              },
              {
                id: 56,
                name: "Hỗ trợ tích cực, đóng góp vào việc đào tạo, nâng cao trình độ, phát triển nghề nghiệp cho đồng nghiệp",
                type: "single_choice",
                maxScore: 10,
                options: [
                  { score: 4, label: "Mức 2: Tham gia hướng dẫn lâm sàng  (4 điểm)" },
                  { score: 6, label: "Mức 3: Tham gia biên soạn nội dung chương trình đào tạo  (6 điểm)" },
                  { score: 8, label: "Mức 4: Tham gia giảng dạy tại khoa/đơn vị (8 điểm)" },
                  { score: 10, label: "Mức 5: Tham gia giảng dạy toàn bệnh viện  (10 điểm)" },
                ]
              },
            ]
          },
          {
            id: "std_17",
            code: "TC 20",
            name: "Cải tiến chất lượng thực hành xét nghiệm",
            criteria: [
              {
                id: 57,
                name: "Hiểu được sự cần thiết về các hoạt động đảm bảo chất lượng thông qua nghiên cứu, phản hồi, đánh giá thực hành",
                type: "single_choice",
                maxScore: 10,
                options: [
                  { score: 6, label: "Mức 3: Có theo dõi và ghi nhận sự không phù hợp tại khoa, đơn vị  (6 điểm)" },
                  { score: 8, label: "Mức 4: Phân tích sự không phù hợp để xác định các vấn đề cần khắc phục (8 điểm)" },
                  { score: 10, label: "Mức 5: Có đánh giá và theo dõi sự không phù hợp (10 điểm)" },
                ]
              },
              {
                id: 58,
                name: "Tiếp nhận, báo cáo, đưa ra biện pháp khắc phục hiệu quả",
                type: "single_choice",
                maxScore: 10,
                options: [
                  { score: 10, label: "Mức 5: Có đưa ra hành động khắc phục và biện pháp phòng ngừa sự không phù hợp nhằm đảm bảo chất lượng xét nghiệm (10 điểm)" },
                ]
              },
              {
                id: 59,
                name: "Dựa trên các tìm kiếm về vấn đề tồn tại của chuyên môn và hành chánh, đưa giải pháp cải tiến phù hợp, hiệu quả",
                type: "single_choice",
                maxScore: 10,
                options: [
                  { score: 6, label: "Mức 3: Xây dựng được kế hoạch cải tiến chất lượng xét nghiệm tại Khoa, đơn vị (6 điểm)" },
                  { score: 8, label: "Mức 4: Thực hiện kế hoạch cải tiến chất lượng xét nghiệm (8 điểm)" },
                  { score: 10, label: "Mức 5: Đánh giá hiệu quả cải tiến chất lượng xét nghiệm đã được thực hiện  (10 điểm)" },
                ]
              },
            ]
          },
          {
            id: "std_18",
            code: "TC 21",
            name: "Quản lý chất lượng thực hành xét nghiệm",
            criteria: [
              {
                id: 60,
                name: "Xây dựng kế hoạch làm việc cho cá nhân hiệu quả và khoa học",
                type: "single_choice",
                maxScore: 10,
                options: [
                  { score: 6, label: "Mức 3: Xây dựng được mục tiêu công việc theo vị trí phân công (12điểm)" },
                  { score: 8, label: "Mức 4: Hoàn thành 80% mục tiêu công việc đã được xác định  (16điểm)" },
                  { score: 10, label: "Mức 5: Hoàn thành 100% mục tiêu công việc đã được xác định (20điểm)" },
                ]
              },
              {
                id: 61,
                name: "Xác định khối lượng công việc và có cách sắp xếp theo thứ tự ưu tiên 1 cách hiệu quả, hợp lý",
                type: "single_choice",
                maxScore: 10,
                options: [
                  { score: 10, label: "Xác định khối lượng công việc và có cách sắp xếp theo thứ tự ưu tiên 1 cách hiệu quả, hợp lý" },
                ]
              },
              {
                id: 62,
                name: "Tổ chức, điều phối, phân công và ủy quyền nhiệm vụ cho các thành viên của bộ phận xét nghiệm một cách khoa học, hợp lý, hiệu quả",
                type: "single_choice",
                maxScore: 10,
                options: [
                  { score: 6, label: "Mức 3: Có sự phân công vai trò của các thành viên trong mỗi bộ phận xét nghiệm  (6điểm)" },
                  { score: 8, label: "Mức 4: Có sự giám sát hỗ trợ cho các thành viên của mỗi bộ phận xét nghiệm  (8điểm)" },
                  { score: 10, label: "Mức 5: Có sự phân công, hỗ trợ và chia sẻ thông tin trong mỗi bộ phận xét nghiệm  (10điểm)" },
                ]
              },
            ]
          },
          {
            id: "std_19",
            code: "TC 22",
            name: "Sự trải nghiệm nghề nghiệp",
            criteria: [
              {
                id: 63,
                name: "BV hạng đặc biệt, hạng 1",
                type: "single_choice",
                maxScore: 50,
                options: [
                  { score: 5, label: "Mức 1: Cách tính thâm niên công tác đối với những nhân viên đã công tác tại các bệnh viện khác trước khi làm việc tại BV ĐHYD  Ghi chú: 1* và 2*: Bằng cấp trung học chỉ áp dụng đến năm 2024                 Đối với KTV Y có thâm niên công tác từ các BV khác: trải nghiệm nghề nghiệp được tính bằng bậc lương theo BV chi trả quy đổi sang số năm (Ví dụ: Bậc lương CN là 2/9 --> trải nghiệm nghề nghiệp: 2x3-6 năm, bậc lương TH là 2/12 --> trải nghiệm nghề nghiệp: 2x2=4 năm)" },
                  { score: 10, label: "BV hạng 2, 3" },
                  { score: 35, label: "BV hạng đặc biệt, hạng 1" },
                  { score: 15, label: "BV hạng 2" },
                  { score: 45, label: "BV hạng đặc biệt, hạng 1" },
                  { score: 20, label: "BV hạng 2" },
                  { score: 50, label: "BV hạng đặc biệt, hạng 1" },
                  { score: 25, label: "BV hạng 2" },
                ]
              },
            ]
          },
        ]
      },
    ]
  },
  "outpatient": {
    id: "outpatient",
    name: "Điều dưỡng Khoa Khám bệnh Ngoại trú",
    shortName: "Khoa Khám bệnh",
    totalCriteria: 73,
    maxScore: 845,
    units: ["Khoa Khám bệnh"],
    domains: [
      {
        id: "domain_1",
        code: "I",
        name: "TIÊU CHUẨN BẰNG CẤP",
        maxScore: 0,
        standards: [
          {
            id: "std_1",
            code: "TC 1",
            name: "Bằng cấp chuyên môn",
            criteria: [
              {
                id: 1,
                name: "Cao đẳng/Trung học    (Điểm công ưu tiên: ĐHYD TPHCM (+10))",
                type: "single_choice",
                maxScore: 0,
                options: [
                  { score: 4, label: "Mức 4: Chọn 1 đáp án phù hợp" },
                  { score: 5, label: "Mức 5: 20" },
                  { score: 0, label: "Đại học    (Điểm công ưu tiên:  - ĐH Quốc tế Miền Đông (+10)    - ĐHYD TPHCM (+20)        - ĐH từ các trường nước ngoài (+30)" },
                ]
              },
              {
                id: 2,
                name: "Chuyên khoa 1/Thạc sĩ",
                type: "single_choice",
                maxScore: 0,
                options: [
                  { score: 4, label: "Mức 4: Chọn 1 đáp án phù hợp" },
                  { score: 5, label: "Mức 5: 25" },
                  { score: 0, label: "Tiến sĩ" },
                ]
              },
            ]
          },
          {
            id: "std_2",
            code: "TC 2",
            name: "Chứng nhận",
            criteria: [
              {
                id: 3,
                name: "Trong nước ≥ 1 năm",
                type: "single_choice",
                maxScore: 0,
                options: [
                  { score: 5, label: "Mức 5: 5" },
                ]
              },
              {
                id: 4,
                name: "Nước ngoài ≥ 6 tháng",
                type: "single_choice",
                maxScore: 0,
                options: [
                  { score: 5, label: "Mức 5: 10" },
                ]
              },
            ]
          },
          {
            id: "std_3",
            code: "TC 3",
            name: "Ngoại ngữ",
            criteria: [
              {
                id: 5,
                name: "TOEIC 450; IELTS 4.5; TOEFL iBT 53",
                type: "single_choice",
                maxScore: 0,
                options: [
                  { score: 4, label: "Mức 4: Chọn 1 đáp án phù hợp" },
                  { score: 5, label: "Mức 5: 5" },
                  { score: 0, label: "TOEIC 600; IELTS 5.5; TOEFL iBT 65" },
                  { score: 0, label: "TOEIC 800; IELTS 6.5; TOEFL iBT 79" },
                ]
              },
            ]
          },
          {
            id: "std_4",
            code: "TC 4",
            name: "Tin học",
            criteria: [
              {
                id: 6,
                name: "Xử lý văn bản, bảng tính cơ bản",
                type: "single_choice",
                maxScore: 0,
                options: [
                  { score: 4, label: "Mức 4: Chọn 1 đáp án phù hợp" },
                  { score: 5, label: "Mức 5: 5" },
                  { score: 0, label: "Xử lý văn bản, bảng tính nâng cao; sử dụng thành thạo phần mềm trình chiếu" },
                ]
              },
            ]
          },
        ]
      },
      {
        id: "domain_2",
        code: "I",
        name: "NĂNG LỰC THỰC HÀNH CHĂM SÓC NGƯỜI BỆNH NGOẠI TRÚ",
        maxScore: 465,
        standards: [
          {
            id: "std_5",
            code: "TC 5",
            name: "Hành nghề theo pháp luật",
            criteria: [
              {
                id: 7,
                name: "Tuân thủ các quy định tại cơ sở làm việc - Có mặt tại nơi làm việc - Tuân thủ thời gian làm việc - Tuân thủ quy định đồng phục, bảng tên - Tham gia hội họp, sinh hoạt tập thể  - Ý thức bảo vệ tài sản tại đơn vị/BV",
                type: "single_choice",
                maxScore: 5,
                options: [
                  { score: 1, label: "Mức 1: 4 lần vi phạm (1 điểm)" },
                  { score: 2, label: "Mức 2: 3 lần vi phạm (2 điểm)" },
                  { score: 3, label: "Mức 3: 2 lần vi phạm (3 điểm)" },
                  { score: 4, label: "Mức 4: 1 lần vi phạm (4 điểm)" },
                  { score: 5, label: "Mức 5: 0 lần vi phạm (5 điểm)" },
                ]
              },
              {
                id: 8,
                name: "Tuân thủ các quy định hành nghề theo luật định liên quan đến y tế, thực hành điều dưỡng, BYT  (Luật khám chữa bệnh, thông tư 07/2011, thông tư 23/2011, thông tư 51/2017, …)",
                type: "single_choice",
                maxScore: 5,
                options: [
                  { score: 1, label: "Mức 1: 4 lần vi phạm (1 điểm)" },
                  { score: 2, label: "Mức 2: 3 lần vi phạm (2 điểm)" },
                  { score: 3, label: "Mức 3: 2 lần vi phạm (3 điểm)" },
                  { score: 4, label: "Mức 4: 1 lần vi phạm (4 điểm)" },
                  { score: 5, label: "Mức 5: 0 lần vi phạm (5 điểm)" },
                ]
              },
              {
                id: 9,
                name: "Thực hiện tốt quy tắc ứng xử của tổ chức và luật định  - Sự phối hợp, hợp tác với đồng nghiệp - Ứng xử với đồng nghiệp - Giao tiếp với khách hàng/NB",
                type: "single_choice",
                maxScore: 5,
                options: [
                  { score: 3, label: "Mức 3: Phối hợp với đồng nghiệp nhưng chưa chủ động hoặc do được yêu cầu  Quan hệ, giao tiếp tốt với đồng nghiệp, NB (3 điểm)" },
                  { score: 4, label: "Mức 4: Chủ động phối hợp với đồng nghiệp để giải quyết công việc Hòa nhã, vui vẻ, sẵn sàng hỗ trợ với đồng nghiệp, khách hàng/NB (4 điểm)" },
                  { score: 5, label: "Mức 5: Phối hợp công việc 1 cách nhanh nhẹn, hiệu quả Ứng xử nhanh nhẹn, giải quyết mọi vấn đề, quan hệ tốt với đồng nghiệp trong và ngoài đơn vị Giao tiếp tốt với NB, chăm sóc được NB khó tính (5 điểm)" },
                ]
              },
            ]
          },
          {
            id: "std_6",
            code: "TC 6",
            name: "Hành nghề theo tiêu chuẩn đạo đức nghề nghiệp",
            criteria: [
              {
                id: 10,
                name: "Chịu trách nhiệm cá nhân khi đưa ra các quyết định chăm sóc và can thiệp chăm sóc",
                type: "single_choice",
                maxScore: 5,
                options: [
                  { score: 4, label: "Mức 4: Tự ra quyết định kế hoạch chăm sóc và can thiệp cho NB (4 điểm)" },
                  { score: 5, label: "Mức 5: Có trách nhiệm trong công tác Tự giác nhận trách nhiệm khi có những sai sót (5 điểm)" },
                ]
              },
              {
                id: 11,
                name: "Tuân thủ tiêu chuẩn đạo đức, không đỗ lỗi cho đồng nghiệp, người bệnh đối với các sai sót của cá nhân. Bảo vệ hình ảnh đồng nghiệp trước người bệnh/người nhà và xã hội. - Không nhận tiền và lợi ích từ NB - Tôn trọng và tự nguyện tham gia các hoạt động của Hội ĐD - Tôn trọng và bảo vệ danh dự, uy tính của đồng nghiệp - Hợp tác, giúp đỡ và truyền thụ kinh nghiệm cho đồng nghiệp",
                type: "single_choice",
                maxScore: 5,
                options: [
                  { score: 1, label: "Mức 1: 4 lần vi phạm (1 điểm)" },
                  { score: 2, label: "Mức 2: 3 lần vi phạm (2 điểm)" },
                  { score: 3, label: "Mức 3: 2 lần vi phạm (3 điểm)" },
                  { score: 4, label: "Mức 4: 1 lần vi phạm (4 điểm)" },
                  { score: 5, label: "Mức 5: 0 lần vi phạm (5 điểm)" },
                ]
              },
              {
                id: 12,
                name: "Quảng bá hình ảnh người điều dưỡng, thể hiện tác phong và tư cách tốt, trang phục phù hợp, lời nói thuyết phục và cách cư xử đúng mực. - Tác phong và chuẩn mực (sạch sẽ, gọn gàng, tươm tất) - Tư cách và lời nói (nhanh nhẹn, vui vẻ, than thiện, hòa đồng) - Không ngừng nâng cao năng lực hành nghề - Tự tôn nghề nghiệp - Cam kết với cộng đồng và xã hội",
                type: "single_choice",
                maxScore: 5,
                options: [
                  { score: 1, label: "Mức 1: 4 lần vi phạm (1 điểm)" },
                  { score: 2, label: "Mức 2: 3 lần vi phạm (2 điểm)" },
                  { score: 3, label: "Mức 3: 2 lần vi phạm (3 điểm)" },
                  { score: 4, label: "Mức 4: 1 lần vi phạm (4 điểm)" },
                  { score: 5, label: "Mức 5: 0 lần vi phạm (5 điểm)" },
                ]
              },
            ]
          },
          {
            id: "std_7",
            code: "TC 7",
            name: "Hiểu biết về tình trang sức khỏe và về người bệnh",
            criteria: [
              {
                id: 13,
                name: "Biết đánh giá tình trạng sức khỏe NB (Quan sát NB, báo BS ngay các trường hợp bất thường)",
                type: "single_choice",
                maxScore: 15,
                options: [
                  { score: 3, label: "Mức 1: 4 lần vi phạm (3 điểm)" },
                  { score: 6, label: "Mức 2: 3 lần vi phạm (6 điểm)" },
                  { score: 9, label: "Mức 3: 2 lần vi phạm (9 điểm)" },
                  { score: 12, label: "Mức 4: 1 lần vi phạm (12 điểm)" },
                  { score: 15, label: "Mức 5: 0 lần vi phạm (15 điểm)" },
                ]
              },
              {
                id: 14,
                name: "Biết sắp xếp điều phối ưu tiên",
                type: "single_choice",
                maxScore: 15,
                options: [
                  { score: 3, label: "Mức 1: 4 lần vi phạm (3 điểm)" },
                  { score: 6, label: "Mức 2: 3 lần vi phạm (6 điểm)" },
                  { score: 9, label: "Mức 3: 2 lần vi phạm (9 điểm)" },
                  { score: 12, label: "Mức 4: 1 lần vi phạm (12 điểm)" },
                  { score: 15, label: "Mức 5: 0 lần vi phạm (15 điểm)" },
                ]
              },
              {
                id: 15,
                name: "Chuẩn bị và sắp xếp các CLS của NB phù hợp với từng thời điểm",
                type: "single_choice",
                maxScore: 15,
                options: [
                  { score: 3, label: "Mức 1: 4 lần vi phạm (3 điểm)" },
                  { score: 6, label: "Mức 2: 3 lần vi phạm (6 điểm)" },
                  { score: 9, label: "Mức 3: 2 lần vi phạm (9 điểm)" },
                  { score: 12, label: "Mức 4: 1 lần vi phạm (12 điểm)" },
                  { score: 15, label: "Mức 5: 0 lần vi phạm (15 điểm)" },
                ]
              },
              {
                id: 16,
                name: "Biết sắp xếp hướng dẫn NB trước phòng chờ (điều phối)",
                type: "single_choice",
                maxScore: 15,
                options: [
                  { score: 3, label: "Mức 1: 4 lần vi phạm (3 điểm)" },
                  { score: 6, label: "Mức 2: 3 lần vi phạm (6 điểm)" },
                  { score: 9, label: "Mức 3: 2 lần vi phạm (9 điểm)" },
                  { score: 12, label: "Mức 4: 1 lần vi phạm (12 điểm)" },
                  { score: 15, label: "Mức 5: 0 lần vi phạm (15 điểm)" },
                ]
              },
              {
                id: 17,
                name: "Tạo không gian chờ khám trật tự, gọn gàng, sạch sẽ",
                type: "single_choice",
                maxScore: 10,
                options: [
                  { score: 2, label: "Mức 1: 4 lần vi phạm (2 điểm)" },
                  { score: 4, label: "Mức 2: 3 lần vi phạm (4 điểm)" },
                  { score: 6, label: "Mức 3: 2 lần vi phạm (6 điểm)" },
                  { score: 8, label: "Mức 4: 1 lần vi phạm (8 điểm)" },
                  { score: 10, label: "Mức 5: 0 lần vi phạm (10 điểm)" },
                ]
              },
            ]
          },
          {
            id: "std_8",
            code: "TC 8",
            name: "Năng lực thực hành tại khoa khám bệnh",
            criteria: [
              {
                id: 18,
                name: "Tuân thủ quy trình nhận dạng NB (không sai sót trong tháng)",
                type: "single_choice",
                maxScore: 30,
                options: [
                  { score: 18, label: "Mức 3: vi phạm > 2 lần/tháng (0 điểm)" },
                  { score: 24, label: "Mức 4: vi phạm 1 lần/tháng (10 điểm)" },
                  { score: 30, label: "Mức 5: không vi phạm (30 điểm)" },
                ]
              },
              {
                id: 19,
                name: "Thực hiện đúng tất cả các quy trình vị trí được phân công và các quy trình chung của khoa, không có sai sót, sự cố chuyên môn",
                type: "single_choice",
                maxScore: 20,
                options: [
                  { score: 12, label: "Mức 3: vi phạm > 2 lần/tháng (0 điểm)" },
                  { score: 16, label: "Mức 4: vi phạm 1 lần/tháng (10 điểm)" },
                  { score: 20, label: "Mức 5: không vi phạm (20 điểm)" },
                ]
              },
              {
                id: 20,
                name: "Thao tác thuần thục và thực hiện tốt tất cả các quy trình tại 5 vị trí việc làm của khoa: * Bàn hướng dẫn - tư vấn khám bệnh * Đăng ký khám bệnh * Đo ECG * Rửa mũi xoang * Bàn khám",
                type: "single_choice",
                maxScore: 30,
                options: [
                  { score: 18, label: "Mức 3: vi phạm > 2 lần/tháng (0 điểm)" },
                  { score: 24, label: "Mức 4: vi phạm 1 lần/tháng (10 điểm)" },
                  { score: 30, label: "Mức 5: không vi phạm (30 điểm)" },
                ]
              },
            ]
          },
          {
            id: "std_9",
            code: "TC 9",
            name: "Năng lực dùng thuốc an toàn, hiệu quả",
            criteria: [
              {
                id: 21,
                name: "Tuân thủ quy định khi dùng thuốc; hướng dẫn dùng thuốc đúng, an toàn khi nhập liệu bệnh án, toa thuốc",
                type: "single_choice",
                maxScore: 10,
                options: [
                  { score: 6, label: "Mức 3: Không đạt yêu cầu (0 điểm)" },
                  { score: 8, label: "Mức 4: Đạt 50% (5 điểm)" },
                  { score: 10, label: "Mức 5: Đạt 100% (10 điểm)" },
                ]
              },
              {
                id: 22,
                name: "Hiểu biết và nhận biết được sự tương tác giữa thuốc và thuốc, thuốc và thức ăn, thông báo BS những cảnh báo thuốc, quy định mã ICD, BHYT",
                type: "single_choice",
                maxScore: 10,
                options: [
                  { score: 6, label: "Mức 3: Không đạt yêu cầu (0 điểm)" },
                  { score: 8, label: "Mức 4: Đạt 50% (5 điểm)" },
                  { score: 10, label: "Mức 5: Đạt 100% (10 điểm)" },
                ]
              },
              {
                id: 23,
                name: "Phát hiện và biết cách xử lý ban đầu các tác hại không mong muốn của thuốc và thông tin kịp thời đến BS, điều dưỡng phụ trách thuốc, ĐDTK",
                type: "single_choice",
                maxScore: 10,
                options: [
                  { score: 6, label: "Mức 3: Không đạt yêu cầu (0 điểm)" },
                  { score: 8, label: "Mức 4: Đạt 50% (5 điểm)" },
                  { score: 10, label: "Mức 5: Đạt 100% (10 điểm)" },
                ]
              },
            ]
          },
          {
            id: "std_10",
            code: "TC 10",
            name: "Năng lực thực hiện CPR - Xử trí Ngất - Động kinh",
            criteria: [
              {
                id: 24,
                name: "Phát hiện sớm những thay đổi đột ngột về tình trạng sức khỏe của người bệnh",
                type: "single_choice",
                maxScore: 5,
                options: [
                  { score: 1, label: "Mức 1: Biết cách nhận biết và ghi nhận sự thay đổi của tri giác, dấu hiệu sinh tồn và các dấu hiệu đe dọa tính mạng của NB" },
                ]
              },
              {
                id: 35,
                name: "Biết cách xử trí phù hợp và thông báo kịp thời đến người có trách nhiệm, yêu cầu hỗ trợ kịp thời",
                type: "single_choice",
                maxScore: 10,
                options: [
                  { score: 2, label: "Mức 1: Quan sát, đánh giá hoàn cảnh và đảm bảo an toàn trong tình huống cấp cứu NB  Chuyển NB đến khu vực an toàn hoặc đảm bào khu vực an toàn cho NB & NVYT. Có gọi hỗ trợ hoặc kích họạt hệ thống hỗ trợ cấp cứu" },
                ]
              },
              {
                id: 36,
                name: "Thực hiện xử trí hiệu quả các trường hợp cấp cứu tại khoa, tham gia hỗ trợ và phối hợp tốt với các thành viên trong nhóm cấp cứu tại khoa",
                type: "single_choice",
                maxScore: 20,
                options: [
                  { score: 4, label: "Mức 1: Đánh giá được tình trạng ngưng hô hấp tuần hoàn ở người bệnh;  Thỉnh thoảng cần sự hỗ trợ / nhắc nhở khi : - xác định được vị trí ấn tim và thể hiện kỹ thuật hỗ trợ thông khí cho NB; - Thực hiện được ấn tim : thông khí cho NB đảm bảo kỹ thuật chuẩn xác." },
                ]
              },
            ]
          },
          {
            id: "std_11",
            code: "TC 11",
            name: "Thiết lập mối quan hệ với người bệnh, hướng dẫn tận tình, tăng sự hài lòng",
            criteria: [
              {
                id: 25,
                name: "NB được tư vấn, hướng dẫn cụ thể: thực hiện CLS, thanh toán BHYT, vị trí mua thuốc",
                type: "single_choice",
                maxScore: 30,
                options: [
                  { score: 18, label: "Mức 3: Không đạt  (0 điểm)" },
                  { score: 24, label: "Mức 4: Đạt 50% (10 điểm)" },
                  { score: 30, label: "Mức 5: Đạt 100% (30 điểm)" },
                ]
              },
              {
                id: 26,
                name: "Thao tác và hướng dẫn thực hiện: - Các hình thức thanh toán không dùng tiền mặt - Các hình thức đăng ký khám bệnh trước ngày khám và trong ngày khám",
                type: "single_choice",
                maxScore: 30,
                options: [
                  { score: 18, label: "Mức 3: Không đạt  (0 điểm)" },
                  { score: 24, label: "Mức 4: Đạt 50% (10 điểm)" },
                  { score: 30, label: "Mức 5: Đạt 100% (30 điểm)" },
                ]
              },
            ]
          },
          {
            id: "std_12",
            code: "TC 12",
            name: "Năng lực xử lý tình huống tại khoa",
            criteria: [
              {
                id: 27,
                name: "Giải quyết tình huống đúng theo quy trình khi NB báo \"Dị ứng thuốc\"",
                type: "single_choice",
                maxScore: 20,
                options: [
                  { score: 12, label: "Mức 3: Không biết cách giải quyết (0đ)" },
                  { score: 16, label: "Mức 4: Có sự hướng dẫn (10đ)" },
                  { score: 20, label: "Mức 5: Xử lý độc lập (20đ)" },
                ]
              },
              {
                id: 28,
                name: "Giải quyết tình huống đúng theo quy trình khi NB yêu cầu \"Hoàn thuốc\", \"Hoàn tiền\"",
                type: "single_choice",
                maxScore: 20,
                options: [
                  { score: 12, label: "Mức 3: Không biết cách giải quyết (0đ)" },
                  { score: 16, label: "Mức 4: Có sự hướng dẫn (10đ)" },
                  { score: 20, label: "Mức 5: Xử lý độc lập (20đ)" },
                ]
              },
              {
                id: 29,
                name: "Giải quyết các tình huống liên quan đến BHYT, BHXH  tại các vị trí công việc",
                type: "single_choice",
                maxScore: 20,
                options: [
                  { score: 12, label: "Mức 3: Không biết cách giải quyết (0đ)" },
                  { score: 16, label: "Mức 4: Có sự hướng dẫn (10đ)" },
                  { score: 20, label: "Mức 5: Xử lý độc lập (20đ)" },
                ]
              },
            ]
          },
          {
            id: "std_13",
            code: "TC 13",
            name: "Thực hành 5S",
            criteria: [
              {
                id: 30,
                name: "Thực hiện đúng quy định 5S (không bị nhắc nhở, duy trì thực hiện tốt)",
                type: "single_choice",
                maxScore: 20,
                options: [
                  { score: 4, label: "Mức 1: Nhắc nhở lần 4  (0đ)" },
                  { score: 8, label: "Mức 2: Nhắc nhở lần 3 (5đ)" },
                  { score: 12, label: "Mức 3: Nhắc nhở lần 2  (10đ)" },
                  { score: 16, label: "Mức 4: Nhắc nhở lần 1  (15đ)" },
                  { score: 20, label: "Mức 5: Không vi phạm (20đ)" },
                ]
              },
            ]
          },
          {
            id: "std_14",
            code: "TC 14",
            name: "Giao tiếp hiệu quả với người bệnh, người nhà, đồng nghiệp và cấp trên",
            criteria: [
              {
                id: 31,
                name: "Giao tiếp hiệu quả với người bệnh, người nhà, đồng nghiệp và cấp trên; không có phản ánh về thái độ giao tiếp ứng xử",
                type: "single_choice",
                maxScore: 40,
                options: [
                  { score: 16, label: "Mức 2: Phản ánh đường dây nóng  (- 20đ)" },
                  { score: 24, label: "Mức 3: Thái độ giao tiếp không thân thiện  (0đ)" },
                  { score: 32, label: "Mức 4: Giao tiếp không dùng danh xưng  (20đ)" },
                  { score: 40, label: "Mức 5: Giao tiếp hiệu quả (40đ)" },
                ]
              },
              {
                id: 32,
                name: "Hợp tác làm việc nhóm và làm việc độc lập hiệu quả; Chủ động chia sẻ những thông tin và phản hồi thường xuyên với đồng nghiệp và khách hàng bên trong (BS, ĐD, HL)",
                type: "single_choice",
                maxScore: 20,
                options: [
                  { score: 12, label: "Mức 3: Không đạt  (0 điểm)" },
                  { score: 16, label: "Mức 4: Đạt 50% (10 điểm)" },
                  { score: 20, label: "Mức 5: Đạt 100% (20 điểm)" },
                ]
              },
              {
                id: 33,
                name: "Cam kết bảo mật thông tin bên trong và bên ngoài",
                type: "single_choice",
                maxScore: 20,
                options: [
                  { score: 12, label: "Mức 3: Không đạt  (0 điểm)" },
                  { score: 16, label: "Mức 4: Đạt 50% (10 điểm)" },
                  { score: 20, label: "Mức 5: Đạt 100% (20 điểm)" },
                ]
              },
            ]
          },
        ]
      },
      {
        id: "domain_3",
        code: "I",
        name: "NĂNG LỰC ĐÀO TẠO NGHIÊN CỨU KHOA HỌC THỰC HÀNH DỰA TRÊN CHỨNG CỨ (EBP)",
        maxScore: 130,
        standards: [
          {
            id: "std_15",
            code: "TC 15",
            name: "Đào tạo",
            criteria: [
              {
                id: 34,
                name: "Phân tích được mối quan hệ giữa nhu cầu đào tạo với trình độ, vị trí việc làm của đối tượng thuộc phạm vi phụ trách (5đ)  Xây dựng được kế hoạch đào tạo (5đ)",
                type: "single_choice",
                maxScore: 5,
                options: [
                  { score: 3, label: "Mức 3: Cần sự hướng dẫn trong tìm hiểu, phân tích mối tương quan giữa nhu cầu đào tạo với trình độ, vị trí làm việc; (3điểm)" },
                  { score: 4, label: "Mức 4: Thực hiện và báo cáo kết quả khảo sát, nghiên cứu mối quan hệ giữa nhu cầu đào tạo với trình độ, vị trí làm việc (4 điểm)" },
                  { score: 5, label: "Mức 5: Thực hiện và báo cáo kết quả khảo sát, nghiên cứu mối quan hệ giữa nhu cầu đào tạo với trình độ, vị trí làm việc; Đề xuất được các giải pháp dựa trên kết quả báo cáo.  (5 điểm)" },
                ]
              },
              {
                id: 35,
                name: "Đề xuất, xây dựng các phương pháp đào tạo linh động, phù hợp với hoàn cảnh đảm bảo nâng cao chất lượng đào tạo",
                type: "single_choice",
                maxScore: 10,
                options: [
                  { score: 6, label: "Mức 3: Cần sự hỗ trợ trong xây dựng phương pháp đào tạo phù hợp với yêu cầu của nội dung đào tạo. (6 điểm)" },
                  { score: 8, label: "Mức 4: Có phương pháp đào tạo phù hợp với nội dung, yêu cầu của nội dung đào tạo. Vận dụng được phương pháp đào tạo phù hợp với hoàn cảnh đào tạo. (8 điểm)" },
                  { score: 10, label: "Mức 5: Có sự thay đổi thường xuyên các chương trình, nội dung đào tạo hàng năm Vận dụng đa dạng trên ba phương pháp đào tạo phù hợp với yêu cầu của nội dung đào tạo  (10 điểm)" },
                  { score: 5, label: "Tổ chức thực hiện được kế hoạch đào tạo và tham gia đào tạo theo đúng tiến độ và đạt chất lượng: -Kế hoạch đào tạo, tham gia đào tạo theo đúng tiến độ (5đ) -Kế hoạch đào tạo đạt chất lượng (5đ)" },
                ]
              },
              {
                id: 36,
                name: "Tiêu chí 36",
                type: "single_choice",
                maxScore: 5,
                options: [
                  { score: 3, label: "Mức 3: Cần hướng dẫn trong xây dựng nội dung kế hoạch, chương trình đào tạo để đạt yêu cầu thẩm định nội dung. (3 điểm)" },
                  { score: 4, label: "Mức 4: Kế hoạch, chương trình đào tạo đạt yêu cầu thẩm định nội dung. Có công cụ, phương pháp đánh giá chất lượng thông qua đo lường kiến thức / thái độ / kỹ năng của học viên sau đào tạo (4 điểm)" },
                  { score: 5, label: "Mức 5: Kế hoạch, chương trình đào tạo đạt yêu cầu thẩm định nội dung. Có đánh giá chất lượng và báo cáo kết quả thông qua đo lường kiến thức / thái độ / kỹ năng của học viên sau đào tạo Kế hoạch đào tạo có tác động thay đổi đến kiến thức / thực hành / trình độ của nguồn nhân lực (5 điểm)" },
                  { score: 5, label: "Đánh giá được hiệu quả đào tạo: thống kê, phân tích, diễn giải và báo cáo theo kế hoạch; Có chỉ ra những nhược điểm cần khắc phục và đề xuất giải pháp cải tiến chất lượng (-Thống kê, phân tích, diễn giải và báo cáo theo kế hoạch (5đ) -Cải tiến chất lượng đào tạo (5đ))" },
                ]
              },
              {
                id: 37,
                name: "Tiêu chí 37",
                type: "single_choice",
                maxScore: 5,
                options: [
                  { score: 3, label: "Mức 3: Đưa ra được điểm yếu từ kết quả đánh giá. Cần hướng dẫn trong lập kế hoạch cải tiến chất lượng đào tạo. (3 điểm)" },
                  { score: 4, label: "Mức 4: Diễn giải, phân tích được điểm mạnh và điểm yếu từ kết quả đánh giá. Lập kế hoạch cải tiến chất lượng đào tạo. (4 điểm)" },
                  { score: 5, label: "Mức 5: Phân tích được điểm mạnh và điểm yếu từ kết quả đánh giá đào tạo. Thực hiện kế hoạch, đánh giá và báo cáo kết quả cải tiến chất lượng đào tạo. (5 điểm)" },
                ]
              },
              {
                id: 38,
                name: "Xây dựng được công cụ, phương pháp đánh giá thay đổi kiến thức của người được đào tạo và sau khi đào tạo",
                type: "single_choice",
                maxScore: 5,
                options: [
                  { score: 3, label: "Mức 3: Cần sự hướng dẫn liên tục, thường xuyên trong việc tìm, xây dựng công cụ, phương pháp đánh giá kiến thức của học viên. (3 điểm)" },
                  { score: 4, label: "Mức 4: Độc lập đưa ra được công cụ, phương pháp trong đánh giá kiến thức của học viên, viên chức trước & sau đào tạo. Ứng dụng một phương pháp, công cụ đánh giá kiến thức học viên. (4 điểm)" },
                  { score: 5, label: "Mức 5: Tự tin, thành thạo trong  áp dụng công cụ, phương pháp đánh giá kiến thức của học viên, viên chức trước & sau đào tạo. Vận dụng trên hai công cụ đánh giá, đo lường kiến thức học viên. Giải thích được cơ sở khoa học cho phương pháp đánh giá. (5 điểm)" },
                ]
              },
              {
                id: 39,
                name: "Tham gia giảng dạy ít nhất 2 bài/năm/khoa hoặc 1 bài toàn bệnh viện",
                type: "single_choice",
                maxScore: 5,
                options: [
                  { score: 1, label: "Mức 1: có tham gia  ⭢ đạt 5 điểm" },
                ]
              },
            ]
          },
          {
            id: "std_16",
            code: "TC 16",
            name: "Nghiên cứu khoa học",
            criteria: [
              {
                id: 40,
                name: "Hiểu biết về các kỹ thuật nghiên cứu, khảo sát, đánh giá, áp dụng phù hợp trong chăm sóc người bệnh",
                type: "single_choice",
                maxScore: 10,
                options: [
                  { score: 2, label: "Mức 1: Có tham gia NCKH với vai trò đối tượng lấy mẫu (2 điểm)" },
                  { score: 6, label: "Mức 3: Có được đào tạo cơ bản về NCKH và tham gia NCKH với vai trò người đi lấy mẫu (6 điểm)" },
                  { score: 8, label: "Mức 4: Có chứng chỉ/ chứng nhận đào tạo chuyên về NCKH và là thành viên của nhóm thực hiện đề tài NCKH (8 điểm)" },
                  { score: 10, label: "Mức 5: Tham gia viết đề cương nghiên cứu khoa học (10 điểm)" },
                ]
              },
              {
                id: 41,
                name: "Sử dụng thành thạo công nghệ thông tin trong thu thập, phân tích số liệu (SPSS, STATA, R)",
                type: "single_choice",
                maxScore: 10,
                options: [
                  { score: 4, label: "Mức 2: Biết cách tìm và trích dẫn tài liệu liên quan đến nghiên cứu có giá trị (4 điểm)" },
                  { score: 6, label: "Mức 3: Biết cách tìm và trích dẫn tài liệu liên quan đến nghiên cứu có giá trị Biết sử dụng phần mềm nhập liệu và phân tích số liệu (SPSS, STATA, R, …)  nhưng cần sử hỗ trợ (6 điểm)" },
                  { score: 8, label: "Mức 4: Biết sử dụng thành thạo phần mềm nhập liệu và phân tích số liệu (SPSS, STATA, R, …) (8 điểm)" },
                  { score: 10, label: "Mức 5: Có khả năng hướng dẫn các phần mềm nhập liệu và phân tích số liệu trong  NCKH (10 điểm)" },
                ]
              },
              {
                id: 42,
                name: "Chủ nhiệm đề tài cấp cơ sở, có công bố trên tạp chí trong nước",
                type: "single_choice",
                maxScore: 10,
                options: [
                  { score: 2, label: "Mức 1: Có tham gia NCKH với vai trò là người hỗ trợ chính/ Thư ký đề tài đã được phê duyệt đề cương và đang thực hiện (2 điểm)" },
                  { score: 4, label: "Mức 2: Là chủ nhiệm đề tài NCKH đã được phê duyệt đề cương và đang thực hiện. (4 điểm)" },
                  { score: 6, label: "Mức 3: Là chủ nhiệm đề tài NCKH đã được công nhận (6 điểm)" },
                  { score: 8, label: "Mức 4: Là chủ nhiệm đề tài NCKH cấp cơ sở được công nhận và công bố trên tạp chí có số ISSN trong nước trong vòng 3 năm. (8 điểm)" },
                  { score: 10, label: "Mức 5: Là chủ nhiệm đề tài NCKH cấp cơ sở được công nhận và công bố trên tạp chí có số ISSN trong nước trong vòng 1 năm. (10 điểm)" },
                ]
              },
              {
                id: 43,
                name: "Chủ nhiệm đề tài cấp cơ sở, có công bố trên tạp chí trong nước (≥ 2 bài/năm); Hoặc chủ nhiệm đề tài cấp Thành phố (tính 1 lần)",
                type: "single_choice",
                maxScore: 15,
                options: [
                  { score: 3, label: "Mức 1: Có tham gia ít nhất 2 đề tài NCKH với vai trò là người hỗ trợ chính/ Thư ký đề tài đã được phê duyệt đề cương và đang thực hiện (5 điểm)" },
                  { score: 6, label: "Mức 2: Là chủ nhiệm ít nhất 2 đề tài NCKH đã hoàn thành đang trong quá trình chờ thẩm định (9 điểm)" },
                  { score: 9, label: "Mức 3: Là chủ nhiệm ít nhất 2 đề tài NCKH đã được phê duyệt đề cương và đang thực hiện. (10 điểm)" },
                  { score: 12, label: "Mức 4: Là chủ nhiệm đề tài cấp cơ sở ≥ 2 bài/ năm hoặc đề tài cấp tỉnh/ thành phố đã được công nhận và công bố trên tạp chí có số ISSN trong nước trong vòng 2 năm (12 điểm)" },
                  { score: 15, label: "Mức 5: Là chủ nhiệm đề tài cấp cơ sở ≥ 2 bài/ năm hoặc đề tài cấp tỉnh/ thành phố đã được công nhận và công bố trên tạp chí có số ISSN trong nước và được mời báo cáo hội nghị điều dưỡng ít nhất 2 lần về đề tài đã công bố trong vòng 2 năm (15 điểm)" },
                ]
              },
              {
                id: 44,
                name: "Đăng bài báo nước ngoài  Hoặc chủ nhiệm đề tài cấp Nhà nước",
                type: "single_choice",
                maxScore: 20,
                options: [
                  { score: 4, label: "Mức 1: Có tên trong bài báo được đăng tạp chí uy tín ở nước ngoài hoặc đang tham gia đề tài cấp nhà nước, đề tài đã được phê duyệt đề cương và đang trong quá trình hoàn tất (4 điểm)" },
                  { score: 8, label: "Mức 2: Có tên trong bài báo được đăng tạp chí uy tín ở nước ngoài hoặc  tham gia đề tài cấp nhà nước, đề tài đã hoàn thành và đnag chờ thẩm định (8 điểm)" },
                  { score: 12, label: "Mức 3: là chủ nhiệm đề tài được đăng tạp chí uy tín ở nước ngoài hoặc  tham gia đề tài cấp nhà nước, đề tài đã hoàn thành và đang chờ thẩm định (12 điểm)" },
                  { score: 16, label: "Mức 4: Là chủ nhiệm đề tài được đăng tạp chí uy tín ở nước ngoài hoặc đề tài cấp nhà nước được công nhận trong vòng 5 năm (16 điểm)" },
                  { score: 20, label: "Mức 5: Là chủ nhiệm đề tài được đăng tạp chí uy tín ở nước ngoài hoặc đề tài cấp nhà nước được công nhận và mời báo cáo trong các hội nghị quốc tế ít nhất 1 lần về đề tài trong vòng 5 năm (20 điểm)" },
                ]
              },
            ]
          },
          {
            id: "std_17",
            code: "TC 17",
            name: "Thực hành dựa trên bằng chứng",
            criteria: [
              {
                id: 45,
                name: "Thực hiện nghiên cứu và có giải pháp thích hợp dựa trên kết quả nghiên cứu",
                type: "single_choice",
                maxScore: 10,
                options: [
                  { score: 2, label: "Mức 1: Có tham gia ít nhất 1 đề tài NCKH/ SKCT liên quan đến thực hành chăm sóc đã được phê duyệt đề cương và đang trong quá trình thực hiện (2 điểm)" },
                  { score: 4, label: "Mức 2: là chủ nhiệm ít nhất 1 đề tài NCKH/ SKCT liên quan đến thực hành chăm sóc đã được phê duyệt đề cương và đang trong quá trình thực hiện (4 điểm)" },
                  { score: 6, label: "Mức 3: Là chủ nhiệm ít nhất 1 đề tài NCKH/ SKCT liên quan đến thực hành chăm sóc đã hoàn thành, đang chờ thẩm định. (6 điểm)" },
                  { score: 8, label: "Mức 4: Là chủ nhiệm ít nhất 1 đề tài NCKH/ SKCT liên quan đến thực hành chăm sóc đã được công nhận. (8 điểm)" },
                  { score: 10, label: "Mức 5: Là chủ nhiệm đề tài mà  giải pháp cải tiến/ thay đổi thực hành chăm sóc dựa trên kết quả nghiên cứu được phân tích và đánh giá khả năng áp dụng (10 điểm)" },
                ]
              },
              {
                id: 46,
                name: "Ứng dụng kết quả nghiên cứu khoa học vào thực hành chăm sóc, quản lý công việc",
                type: "single_choice",
                maxScore: 10,
                options: [
                  { score: 2, label: "Mức 1: Là chủ nhiệm đề tài mà giải pháp có kế hoạch áp dụng tại ít nhất 1 khoa/ 1 nhóm đối tượng liên quan. (2 điểm)" },
                  { score: 4, label: "Mức 2: Là chủ nhiệm đề tài mà giải pháp cải tiến/ thay đổi thực hành chăm sóc dựa trên kết quả nghiên cứu được áp dụng ít nhất tại một khoa/ một nhóm đối tượng liên quan (4 điểm)" },
                  { score: 6, label: "Mức 3: Là chủ nhiệm đề tài mà giải pháp cải tiến/ thay đổi thực hành chăm sóc dựa trên kết quả nghiên cứu được áp dụng ít nhất tại một khoa/ một nhóm đối tượng liên quan và đánh giá kết quả áp dụng (6 điểm)" },
                  { score: 8, label: "Mức 4: Là chủ nhiệm đề tài mà giải pháp cải tiến/ thay đổi thực hành chăm sóc được đánh giá hiệu quả áp dụng (8 điểm)" },
                  { score: 10, label: "Mức 5: Là chủ nhiệm đề tài mà giải pháp cải tiến/ thay đổi thực hành chăm sóc được đánh giá hiệu quả áp dụng và được áp dụng toàn viện (10 điểm)" },
                ]
              },
              {
                id: 47,
                name: "Sử dụng các bằng chứng từ nghiên cứu khoa học để nâng cao chất lượng thực hành chăm sóc",
                type: "single_choice",
                maxScore: 10,
                options: [
                  { score: 2, label: "Mức 1: Là chủ nhiệm đề tài mà  giải pháp cải tiến/ thay đổi thực hành chăm sóc dựa trên kết quả nghiên cứu được bệnh viện/ trường công nhận và được giải thưởng của trường/ bệnh viện  (2 điểm)" },
                  { score: 4, label: "Mức 2: Là chủ nhiệm đề tài mà  giải pháp cải tiến/ thay đổi thực hành chăm sóc dựa trên kết quả nghiên cứu được công nhận và công bố trên các tạp chí có uy tín trong nước (4 điểm)" },
                  { score: 6, label: "Mức 3: Là chủ nhiệm đề tài mà  giải pháp cải tiến/ thay đổi thực hành chăm sóc dựa trên kết quả nghiên cứu được nhận giải thưởng uy tín trong nước (6 điểm)" },
                  { score: 8, label: "Mức 4: Là chủ nhiệm đề tài mà  giải pháp cải tiến/ thay đổi thực hành chăm sóc dựa trên kết quả nghiên cứu được công nhận và công bố trên các tạp chí có uy tín trong nước. Đang trong quá trình đăng ký bản quyền sở hữu trí tuệ (8 điểm)" },
                  { score: 10, label: "Mức 5: Kết quả NCKH/SKCT, phát minh mới được đăng ký bản quyền sở hữu trí tuệ trong vòng 2 năm (10 điểm)" },
                ]
              },
            ]
          },
        ]
      },
      {
        id: "domain_4",
        code: "I",
        name: "NĂNG LỰC LÃNH ĐẠO & QUẢN LÝ",
        maxScore: 100,
        standards: [
          {
            id: "std_18",
            code: "TC 18",
            name: "Quản lý và sử dụng các trang thiết bị, dụng cụ y tế có hiệu quả",
            criteria: [
              {
                id: 48,
                name: "Hiểu biết về quy trình, quy định quản lý, sử dụng trang thiết bị, dụng cụ y tế, vật tư tại các vị trí việc làm",
                type: "single_choice",
                maxScore: 5,
                options: [
                  { score: 1, label: "Mức 1: Biết được: các loại máy, VTYT tại khoa (1 điểm)" },
                  { score: 2, label: "Mức 2: Biết sử dụng, vận hành các trang thiết bị, VTYT tại khoa cần sự hỗ trợ thường xuyên. (2 điểm)" },
                  { score: 3, label: "Mức 3: Biết sử dụng, vận hành các trang thiết bị, VTYT tại khoa thỉnh thoảng cần sự hỗ trợ. (3 điểm)" },
                  { score: 4, label: "Mức 4: Biết sử dụng, vận hành các trang thiết bị, VTYT tại khoa một cách độc lập. (4 điểm)" },
                  { score: 5, label: "Mức 5: Có khả năng hướng dẩn quy trình, quy định về sử dụng, vận hành các trang thiết bị, VTYT tại khoa. (5 điểm)" },
                ]
              },
              {
                id: 49,
                name: "Đề xuất các thiết bị, vật tư phù hợp",
                type: "single_choice",
                maxScore: 5,
                options: [
                  { score: 3, label: "Mức 3: Xác định được các yêu cầu về trang thiết bị và vật tư phù hợp với chăm sóc bệnh nhân dựa trên bằng chứng khoa học. (3 điểm)" },
                  { score: 4, label: "Mức 4: Xác định được các yêu cầu về trang thiết bị và vật tư phù hợp với chăm sóc bệnh nhân dựa trên bằng chứng khoa học và có thực hiện đánh giá tại khoa đơn vị  (4 điểm)" },
                  { score: 5, label: "Mức 5: Đề xuất được các VTYT, trang thiết bị dựa trên bằng chứng khoa học và đánh giá thực tế tại khoa, đon vị (5 điểm)" },
                ]
              },
              {
                id: 50,
                name: "Lập kế hoạch bảo quản trang thiết bị, sử dụng vật tư một cách hiệu quả, tiết kiệm",
                type: "single_choice",
                maxScore: 10,
                options: [
                  { score: 6, label: "Mức 3: Lập được kế hoạch bảo quản trang thiết bị, vật tư (6 điểm)" },
                  { score: 8, label: "Mức 4: Đảm bảo thực hiện kế hoạch đúng tiến độ (8 điểm)" },
                  { score: 10, label: "Mức 5: Có sáng kiến cải tiến trong bảo quản trang thiết bị, vật tư (10 điểm)" },
                ]
              },
              {
                id: 51,
                name: "Sử dụng thành thạo các trang thiết bị, phương tiện sử dụng trong chăm sóc an toàn, hiệu quả",
                type: "single_choice",
                maxScore: 10,
                options: [
                  { score: 6, label: "Mức 3: Vận dụng thành thạo và xử lý các vấn đề phát sinh trong quá trình sử dụng các trang thiết bị, VTYT tại khoa (6 điểm)" },
                  { score: 8, label: "Mức 4: Hiểu rõ nguyên lý hoạt động và phòng ngửa các sự cố liên quan đến việc sử dụng trang thiết bị (8 điểm)" },
                  { score: 10, label: "Mức 5: Đánh giá, đo lường việc sử dụng, và đề xuất cải tiến chất lượng an toàn và hiệu quả. (10 điểm)" },
                ]
              },
            ]
          },
          {
            id: "std_19",
            code: "TC 19",
            name: "Sử dụng nguồn tài chính phù hợp và hiệu quả",
            criteria: [
              {
                id: 52,
                name: "Đánh giá được hiệu quả kinh tế của các biện pháp chăm sóc tại bệnh viện",
                type: "single_choice",
                maxScore: 10,
                options: [
                  { score: 8, label: "Mức 4: Có nghiên cứu/đề án khảo sát hiệu quả kinh tế của một biện pháp, lĩnh vực chăm sóc tại khoa, đơn vị. (5 điểm)" },
                  { score: 10, label: "Mức 5: Có nghiên cứu/đề án khảo sát hiệu quả kinh tế của một biện pháp, lĩnh vực chăm sóc tại các khoa có nhu cầu. (10 điểm)" },
                ]
              },
              {
                id: 53,
                name: "Xây dựng kế hoạch sử dụng các nguồn lực trong chăm sóc người bệnh trong phạm vi phân công hiệu quả",
                type: "single_choice",
                maxScore: 10,
                options: [
                  { score: 8, label: "Mức 4: Có đánh giá, phân tích nhu cầu nguồn nhân lực phục vụ cho công tác chăm sóc hiệu quả  (5 điểm)" },
                  { score: 10, label: "Mức 5: Xây dựng được kế hoạch phân bổ nguồn nhân lực phù hợp nhu cầu chăm sóc tại khoa, đơn vị. (10 điểm)" },
                ]
              },
              {
                id: 54,
                name: "Tổ chức, triển khai thực hiện kế hoạch hiệu quả",
                type: "single_choice",
                maxScore: 10,
                options: [
                  { score: 8, label: "Mức 4: Có kế hoạch quản lý và dự toán nguồn tài chính phục vụ cho chăm sóc tại khoa, đơn vị.  (5 điểm)" },
                  { score: 10, label: "Mức 5: Triển khai đánh giá và đo lường hiệu quả của kế hoạch. (10 điểm)" },
                ]
              },
              {
                id: 55,
                name: "Có đề án cải tiến giúp bệnh viện ứng dụng hiệu quả",
                type: "single_choice",
                maxScore: 10,
                options: [
                  { score: 8, label: "Mức 4: Triển khai và báo cáo kết quả đề án cải tiến tại khoa, đơn vị. (5 điểm)" },
                  { score: 10, label: "Mức 5: Đề án được thẩm định và công nhận hiệu quả bởi Hội đồng chuyên môn. Được triển khai ứng dụng tại bệnh viện. (10 điểm)" },
                ]
              },
            ]
          },
          {
            id: "std_20",
            code: "TC 20",
            name: "Thiết lập môi trường làm việc hiệu quả, an toàn",
            criteria: [
              {
                id: 56,
                name: "Thiết lập các nội dung liên quan đến sức khỏe nghề nghiệp và luật pháp về an toàn lao động",
                type: "single_choice",
                maxScore: 5,
                options: [
                  { score: 3, label: "Mức 3: Có kiến thức về an toàn lao động, sức khỏe nghề nghiệp  (3 điểm)" },
                  { score: 4, label: "Mức 4: Có phổ biến, triển khai cho đồng nghiệp các nội dung liên quan đến sức khỏe nghề nghiệp và luật pháp về an toàn lao động  (4 điểm)" },
                  { score: 5, label: "Mức 5: Đề xuất được các giải pháp bảo vệ sức khỏe nghề nghiệp và tăng cường lao động. (5 điểm)" },
                ]
              },
              {
                id: 57,
                name: "Tuân thủ các tiêu chuẩn và quy tắc về an toàn lao động",
                type: "single_choice",
                maxScore: 5,
                options: [
                  { score: 1, label: "Mức 1: Có trường hợp không tuân thủ → 0 điểm" },
                ]
              },
              {
                id: 58,
                name: "Tuân thủ các chính sách, quy trình về phòng ngừa cách ly và kiểm soát nhiễm khuẩn (kiểm soát môi trường chăm sóc, quản lý và xử lý chất thải)",
                type: "single_choice",
                maxScore: 10,
                options: [
                  { score: 6, label: "Mức 3: Tuân thủ theo các quy trình về kiểm soát nhiễm khuẩn trong chăm sóc Người bệnh của khoa KSNK (6 điểm)" },
                  { score: 8, label: "Mức 4: Có kế hoạch giám sát/tham gia giám sát tuân thủ các chính sách, quy trình (8 điểm)" },
                  { score: 10, label: "Mức 5: Có giải pháp cải thiện và tăng cường sự tuân thủ của nhân viên (10 điểm)" },
                ]
              },
              {
                id: 59,
                name: "Tuân thủ quy định dự phòng phơi nhiễm với các tác nhân gây bệnh và biết được phương pháp xử lý",
                type: "single_choice",
                maxScore: 5,
                options: [
                  { score: 3, label: "Mức 3: Tuân thủ/triển khai các quy định dự phòng phơi nhiễm với các tác nhân gây bệnh và biết được phương pháp xử lý (3 điểm)" },
                  { score: 4, label: "Mức 4: Có kế hoạch giám sát/tham gia giám sát tuân thủ quy định  (4 điểm)" },
                  { score: 5, label: "Mức 5: Có giải pháp cải thiện và tăng cường sự tuân thủ của nhân viên  (5 điểm)" },
                ]
              },
              {
                id: 60,
                name: "Tuân thủ các quy trình an toàn phòng cháy chữa cháy và các trường hợp khẩn cấp khác",
                type: "single_choice",
                maxScore: 5,
                options: [
                  { score: 4, label: "Mức 4: Có kiến thức về an toàn phòng cháy chữa cháy và các trường hợp khẩn cấp khác (sử dụng các phương tiện chữa cháy, thoát hiểm,…)  (3 điểm)" },
                  { score: 5, label: "Mức 5: Có kiến thức về xử lý/quản lý tinh huống (5 điểm)" },
                ]
              },
            ]
          },
        ]
      },
      {
        id: "domain_5",
        code: "V",
        name: "PHÁT TRIỂN CHUYÊN MÔN CÁ NHÂN & CHẤT LƯỢNG",
        maxScore: 150,
        standards: [
          {
            id: "std_21",
            code: "TC 21",
            name: "Duy trì và phát triển năng lực cho cá nhân và đồng nghiệp",
            criteria: [
              {
                id: 61,
                name: "Xác định rõ mục tiêu, nguyện vọng phát triển nghề nghiệp và biết được điểm mạnh và yếu của bản thân",
                type: "single_choice",
                maxScore: 10,
                options: [
                  { score: 6, label: "Mức 3: Nêu được những điểm mạnh, điểm yếu cá nhân và nguyện vọng phát triển nghề nghiệp.  (4 điểm)" },
                  { score: 8, label: "Mức 4: Có kế hoạch và đang thực hiện kế hoạch phát triển nghề nghiệp. (8 điểm)" },
                  { score: 10, label: "Mức 5: Đạt được các bằng cấp nâng cao trình độ chuyên môn, nghiệp vụ trong vòng 3 năm. (10 điểm)" },
                ]
              },
              {
                id: 62,
                name: "Chủ động tham gia tích cực đầy đủ hoạt động đào tạo liên tục của bệnh viện cấp khoa, cấp bệnh viện để liên tục nâng cao kiến thức và kỹ năng",
                type: "single_choice",
                maxScore: 10,
                options: [
                  { score: 6, label: "Mức 3: Đạt được 12 tiết trong năm  (6 điểm)" },
                  { score: 8, label: "Mức 4: Đạt được 24 tiết trong năm  (8 điểm)" },
                  { score: 10, label: "Mức 5: Đạt được >24 tiết trong năm -Và ít nhất 50% các chương trình đào tạo tập huấn nâng cao kiến thức chuyên môn và kỹ năng khác do bệnh viện tổ chức (10 điểm)" },
                ]
              },
              {
                id: 63,
                name: "Có thái độ tích cực với những đổi mới, quan điểm trái chiều, thể hiện sự lắng nghe các kiến nghị và các đề xuất, thử nghiệm các phương pháp mới",
                type: "single_choice",
                maxScore: 10,
                options: [
                  { score: 10, label: "Mức 5: Có thái độ tích cực với những đổi mới, quan điểm trái chiều, thể hiện sự lắng nghe các kiến nghị và các đề xuất, thử nghiệm các phương pháp mới  (10 điểm)" },
                ]
              },
              {
                id: 64,
                name: "Hỗ trợ tích cực, đóng góp vào việc đào tạo, nâng cao trình độ, phát triển nghề nghiệp cho đồng nghiệp",
                type: "single_choice",
                maxScore: 10,
                options: [
                  { score: 4, label: "Mức 2: Tham gia hướng dẫn lâm sàng  (4 điểm)" },
                  { score: 6, label: "Mức 3: Tham gia biên soạn nội dung chương trình đào tạo  (6 điểm)" },
                  { score: 8, label: "Mức 4: Tham gia giảng dạy tại khoa/đơn vị (8 điểm)" },
                  { score: 10, label: "Mức 5: Tham gia giảng dạy toàn bệnh viện  (10 điểm)" },
                ]
              },
            ]
          },
          {
            id: "std_22",
            code: "TC 22",
            name: "Cải tiến chất lượng trong từng vị trí việc làm",
            criteria: [
              {
                id: 65,
                name: "Hiểu được sự cần thiết về các hoạt động luôn đảm bảo chất lượng thông qua nghiên cứu, phản hồi, đánh giá thực hành",
                type: "single_choice",
                maxScore: 10,
                options: [
                  { score: 6, label: "Mức 3: Có khảo sát các vấn đề còn tồn động trong hoạt động chăm sóc tại khoa, đơn vị  (6 điểm)" },
                  { score: 8, label: "Mức 4: Phân tích để xác định các vấn đề tồn động cần khắc phục (8 điểm)" },
                  { score: 10, label: "Mức 5: Có sự đánh giá và   theo dõi thường xuyên các vấn đề tồn động (10 điểm)" },
                ]
              },
              {
                id: 66,
                name: "Tiếp nhận, báo cáo, đưa ra biện pháp khắc phục hiệu quả",
                type: "single_choice",
                maxScore: 10,
                options: [
                  { score: 10, label: "Mức 5: Có đưa ra biện pháp khắc phục nhằm đảm bảo chất lượng chăm sóc (10 điểm)" },
                ]
              },
              {
                id: 67,
                name: "Dựa trên các tìm kiếm về vấn đề tồn tại của chuyên môn và hành chánh, đưa giải pháp cải tiến phù hợp, hiệu quả",
                type: "single_choice",
                maxScore: 10,
                options: [
                  { score: 6, label: "Mức 3: Xây dựng được kế hoạch cải tiến trong hoạt động chăm sóc tại khoa, đơn vị  (6 điểm)" },
                  { score: 8, label: "Mức 4: Thực hiện kế hoạch cải tiến nâng cao (8 điểm)" },
                  { score: 10, label: "Mức 5: Đánh giá hiệu quả cải tiến đã được thực hiện  (10 điểm)" },
                ]
              },
            ]
          },
          {
            id: "std_23",
            code: "TC 23",
            name: "Quản lý chăm sóc người bệnh",
            criteria: [
              {
                id: 68,
                name: "Xây dựng kế hoạch làm việc cho cá nhân hiệu quả và khoa học",
                type: "single_choice",
                maxScore: 10,
                options: [
                  { score: 6, label: "Mức 3: Xây dựng được mục tiêu công việc theo vị trí phân công (6 điểm)" },
                  { score: 8, label: "Mức 4: Hoàn thành 80% mục tiêu công việc đã được xác định  (8 điểm)" },
                  { score: 10, label: "Mức 5: Hoàn thành 100%  mục tiêu công việc  đã được xác định  (10 điểm)" },
                ]
              },
              {
                id: 69,
                name: "Xác định khối lượng công việc và có cách sắp xếp theo thứ tự ưu tiên một cách hiệu quả, hợp lý",
                type: "single_choice",
                maxScore: 10,
                options: [
                  { score: 6, label: "Mức 3: Xây dựng được mục tiêu công việc theo vị trí phân công (6 điểm)" },
                  { score: 8, label: "Mức 4: Hoàn thành 80% mục tiêu công việc đã được xác định  (8 điểm)" },
                  { score: 10, label: "Mức 5: Hoàn thành 100%  mục tiêu công việc  đã được xác định  (10 điểm)" },
                ]
              },
              {
                id: 70,
                name: "Tổ chức, điều phối, phân công và ủy quyền nhiệm vụ cho các thành viên của nhóm làm việc một cách khoa học, hợp lý, hiệu quả",
                type: "single_choice",
                maxScore: 10,
                options: [
                  { score: 6, label: "Mức 3: Có sự phân công vai trò của các thành viên trong nhóm chăm sóc (6 điểm)" },
                  { score: 8, label: "Mức 4: Có sự giám sát hỗ trợ cho các thành viên của nhóm chăm sóc (8 điểm)" },
                  { score: 10, label: "Mức 5: Có sự phân công, hỗ trợ và chia sẻ thông tin trong nhóm (10 điểm)" },
                ]
              },
            ]
          },
          {
            id: "std_24",
            code: "TC 24",
            name: "Sự trải nghiệm nghề nghiệp",
            criteria: [
              {
                id: 71,
                name: "BV hạng đặc biệt, hạng 1",
                type: "single_choice",
                maxScore: 50,
                options: [
                  { score: 5, label: "Mức 1: Cách tính thâm niên công tác đối với những nhân viên đã công tác tại các bệnh viện khác trước khi làm việc tại BV ĐHYD  Ghi chú: 1* và 2*: Bằng cấp trung học chỉ áp dụng đến năm 2024                 Đối với ĐD có thâm niên công tác từ các BV khác: trải nghiệm nghề nghiệp được tính bằng bậc lương theo BV chi trả quy đổi sang số năm (Ví dụ: Bậc lương CN là 2/9 --> trải nghiệm nghề nghiệp: 2x3-6 năm, bậc lương TH là 2/12 --> trải nghiệm nghề nghiệp: 2x2=4 năm)" },
                  { score: 10, label: "BV hạng 2, 3" },
                  { score: 35, label: "BV hạng đặc biệt, hạng 1" },
                  { score: 15, label: "BV hạng 2" },
                  { score: 45, label: "BV hạng đặc biệt, hạng 1" },
                  { score: 20, label: "BV hạng 2" },
                  { score: 50, label: "BV hạng đặc biệt, hạng 1" },
                  { score: 25, label: "BV hạng 2" },
                ]
              },
            ]
          },
        ]
      },
    ]
  },
};

// Lấy Khung Tiêu chuẩn Năng lực phù hợp cho từng Khoa / Đơn vị
function getFrameworkForUnit(unitName) {
  if (!unitName) return DEPARTMENT_FRAMEWORKS.clinical;
  for (const key in DEPARTMENT_FRAMEWORKS) {
    const fw = DEPARTMENT_FRAMEWORKS[key];
    if (fw.units.some(u => unitName.toLowerCase().includes(u.toLowerCase()) || u.toLowerCase().includes(unitName.toLowerCase()))) {
      return fw;
    }
  }
  return DEPARTMENT_FRAMEWORKS.clinical;
}

