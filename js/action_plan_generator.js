/**
 * Bộ sinh Kế hoạch Hành động Cá nhân (Action Plan Generator)
 * Bệnh viện Đại học Y Dược TP. Hồ Chí Minh (Cơ sở 2)
 * Tính năng:
 *  - Đánh giá năng lực theo 5 Tiêu chuẩn Bắt buộc UMC
 *  - So sánh kết quả 2024 vs 2025 (Tăng trưởng điểm số & cấp độ)
 *  - Động viên, khen thưởng tích cực & Bộ huy hiệu vinh danh cống hiến
 *  - Đề xuất kế hoạch năm tới (2026): Danh mục chứng chỉ CME chuyên ngành cụ thể, số tiết bắt buộc (≥24 tiết)
 *  - Hoạch định kế hoạch hành động năm sau chi tiết cho từng Lĩnh vực (Lĩnh vực 1 -> 5)
 */

const ActionPlanEngine = {
  // Tính toán điểm chi tiết theo 5 lĩnh vực
  calculateScores(scoresObj, nurseUnit) {
    const domainScores = {
      domain_1: 0,
      domain_2: 0,
      domain_3: 0,
      domain_4: 0,
      domain_5: 0
    };
    let totalScore = 0;

    let domains = typeof DOMAINS_DATA !== "undefined" ? DOMAINS_DATA : [];
    if (typeof getFrameworkForUnit === "function" && nurseUnit) {
      const fw = getFrameworkForUnit(nurseUnit);
      if (fw && fw.domains && fw.domains.length > 0) domains = fw.domains;
    }

    domains.forEach(domain => {
      domain.standards.forEach(std => {
        std.criteria.forEach(crit => {
          const score = scoresObj && scoresObj[crit.id] !== undefined ? Number(scoresObj[crit.id]) : 0;
          domainScores[domain.id] = (domainScores[domain.id] || 0) + score;
          totalScore += score;
        });
      });
    });

    return { domainScores, totalScore };
  },

  // Đánh giá cấp độ năng lực và kiểm tra các tiêu chuẩn bắt buộc
  evaluateCompetency(nurse, scoresObj) {
    const { domainScores, totalScore } = this.calculateScores(scoresObj || nurse?.managerScores || nurse?.selfScores, nurse ? nurse.unit : null);
    
    let achievedLevel = 0;
    const levelChecks = [];

    if (totalScore > 0) {
      for (let lvl = 1; lvl <= 7; lvl++) {
        const config = COMPETENCY_LEVELS.find(l => l.level === lvl);
        if (!config) continue;

        const check = {
          level: lvl,
          title: config.title,
          passedTotalScore: totalScore >= config.minTotalScore,
          passedDomainScores: true,
          domainChecks: {},
          passedDegree: true,
          passedExperience: true,
          passedTeachingResearch: true,
          passedExam: true,
          reasonsFailed: []
        };

        // 1. Điểm tổng
        if (!check.passedTotalScore) {
          check.reasonsFailed.push(`Tổng điểm đạt ${totalScore}/${config.minTotalScore} điểm.`);
        }

        // 2. Điểm sàn từng lĩnh vực
        Object.keys(config.minDomainScores).forEach(dId => {
          const dScore = domainScores[dId] || 0;
          const reqScore = config.minDomainScores[dId];
          const dPassed = dScore >= reqScore;
          check.domainChecks[dId] = { score: dScore, required: reqScore, passed: dPassed };
          if (!dPassed) {
            check.passedDomainScores = false;
            const dObj = DOMAINS_DATA.find(d => d.id === dId);
            check.reasonsFailed.push(`Lĩnh vực ${dObj ? dObj.code : dId} đạt ${dScore}/${reqScore} điểm khuyến nghị.`);
          }
        });

        // 3. Bằng cấp
        if (lvl >= 4 && !["Đại Học", "Cử nhân", "Thạc sĩ", "Chuyên khoa 1", "Tiến sĩ", "CKI", "CKII"].some(deg => (nurse?.degree || "").toLowerCase().includes(deg.toLowerCase()))) {
          check.passedDegree = false;
          check.reasonsFailed.push(`Yêu cầu bằng Cử nhân/Đại học trở lên (hiện tại: ${nurse?.degree || "Chưa rõ"}).`);
        }
        if (lvl >= 5 && !["Thạc sĩ", "Chuyên khoa 1", "Tiến sĩ", "CKI", "CKII"].some(deg => (nurse?.degree || "").toLowerCase().includes(deg.toLowerCase()))) {
          check.passedDegree = false;
          check.reasonsFailed.push(`Yêu cầu Thạc sĩ / Chuyên khoa trở lên (hiện tại: ${nurse?.degree || "Đại học"}).`);
        }

        // 4. Thâm niên
        const totalMonths = ((nurse?.experienceYears || 0) * 12) + (nurse?.experienceMonths || 0);
        if (totalMonths < config.experienceReqMonths) {
          check.passedExperience = false;
          check.reasonsFailed.push(`Thâm niên lâm sàng yêu cầu ${config.experienceDesc} (hiện tại: ${nurse?.experienceText || (nurse?.experienceYears || 0) + " năm"}).`);
        }

        // 5. NCKH & Đào tạo bắt buộc
        if (config.hasTeachingResearch && !nurse?.hasTeachingResearch) {
          check.passedTeachingResearch = false;
          check.reasonsFailed.push(`Yêu cầu có bài giảng (≥2 bài/năm) và chủ nhiệm đề tài NCKH cấp cơ sở.`);
        }

        // 6. Điểm thi trung bình
        if (config.minExamScore > 0) {
          if (typeof nurse?.examScore === "number") {
            if (nurse.examScore < config.minExamScore) {
              check.passedExam = false;
              check.reasonsFailed.push(`Điểm thi trung bình yêu cầu ≥ 7.0 (hiện tại: ${nurse.examScore}).`);
            }
          } else if (typeof nurse?.examScore === "string") {
            const scoreLower = nurse.examScore.toLowerCase();
            if (scoreLower.includes("chưa thi") && lvl >= 3) {
              check.passedExam = false;
              check.reasonsFailed.push(`Chưa có điểm kiểm tra tay nghề định kỳ (yêu cầu ≥ 7.0).`);
            }
          }
        }

        check.isEligible = check.passedTotalScore && check.passedDegree && check.passedExperience && check.passedTeachingResearch && check.passedExam;
        levelChecks.push(check);

        if (check.isEligible) {
          achievedLevel = lvl;
        }
      }
    }

    const currentConfig = achievedLevel > 0 
      ? (COMPETENCY_LEVELS.find(l => l.level === achievedLevel) || COMPETENCY_LEVELS[0])
      : {
          level: 0,
          title: "Chưa đánh giá",
          badge: "Chưa tự đánh giá",
          minTotalScore: 0,
          color: "#94a3b8",
          icon: "⏳"
        };
    const nextConfig = COMPETENCY_LEVELS.find(l => l.level === (achievedLevel === 0 ? 1 : achievedLevel + 1));

    return {
      achievedLevel,
      currentConfig,
      nextConfig,
      totalScore,
      domainScores,
      levelChecks
    };
  },

  // Đề xuất danh mục khóa học CME chuyên khoa cụ thể cho năm 2026
  getRecommendedCmeCourses(unitName, achievedLevel) {
    const u = (unitName || "").toLowerCase();

    if (u.includes("sản")) {
      return [
        { title: "Cấp cứu Sản khoa & Xử trí Băng huyết sau sinh theo lưu đồ chuẩn", hours: 24, institution: "Bệnh viện Từ Dũ / ĐH Y Dược TP.HCM", priority: "Bắt buộc", targetSkill: "Kiểm soát chảy máu sau sinh, kỹ thuật chèn bóng tử cung Bakri và hồi sức sốc sản khoa." },
        { title: "Hồi sức Sơ sinh tại Phòng sinh (NRP) & Chăm sóc Thiết yếu Bà mẹ - Trẻ sơ sinh (EENC)", hours: 24, institution: "ĐH Y Dược TP.HCM", priority: "Bắt buộc", targetSkill: "Kỹ năng hồi sức sơ sinh ngạt, thông khí áp lực dương qua mask, chăm sóc da kề da EENC." },
        { title: "Theo dõi & Phân tích Đồ thị tim thai - Cơn gò tử cung (Monitoring Sản khoa CTG)", hours: 16, institution: "Hội Phụ Sản TP.HCM", priority: "Khuyến nghị", targetSkill: "Đọc và nhận diện biến đổi nhịp tim thai bất thường, phát hiện sớm suy thai cấp trong chuyển dạ." }
      ];
    } else if (u.includes("chấn thương") || u.includes("ctch")) {
      return [
        { title: "Chăm sóc Vết thương Chuyên sâu & Liệu pháp Hút áp lực âm (VAC) Ngoại Chấn thương", hours: 24, institution: "ĐH Y Dược TP.HCM", priority: "Bắt buộc", targetSkill: "Quy trình chăm sóc vết thương hở gãy xương phức tạp, thay băng vô khuẩn và vận hành máy hút áp lực âm VAC." },
        { title: "Quản lý Giảm đau Đa mô thức & Phục hồi chức năng sớm sau Phẫu thuật Chỉnh hình (ERAS)", hours: 24, institution: "Bệnh viện ĐHYD TP.HCM", priority: "Bắt buộc", targetSkill: "Ứng dụng thang điểm VAS, kiểm soát đau chu phẫu và hướng dẫn tập vận động sớm ngày 1 sau mổ." },
        { title: "Kỹ thuật Bó bột chuẩn y khoa & Dự phòng Thuyên tắc huyết khối Tĩnh mạch sâu (VTE)", hours: 16, institution: "Hội Chấn thương Chỉnh hình TP.HCM", priority: "Khuyến nghị", targetSkill: "Đánh giá hội chứng chèn ép khoang, theo dõi tuần hoàn đầu chi sau bó bột và tiêm thuốc kháng đông dự phòng VTE." }
      ];
    } else if (u.includes("ngoại")) {
      return [
        { title: "Chăm sóc Dẫn lưu Ngoại khoa, Ống mở thông & Ống thông dạ dày chuyên sâu", hours: 24, institution: "ĐH Y Dược TP.HCM", priority: "Bắt buộc", targetSkill: "Theo dõi màu sắc, số lượng dịch dẫn lưu ổ bụng, ngực; kỹ thuật chăm sóc hậu môn nhân tạo và sonde dẫn lưu kín." },
        { title: "Kiểm soát Nhiễm khuẩn Vết mổ & Quy trình Rửa tay Ngoại khoa vô khuẩn", hours: 24, institution: "Khoa Kiểm soát Nhiễm khuẩn - BV ĐHYD TP.HCM", priority: "Bắt buộc", targetSkill: "Nhận diện sớm nhiễm trùng vết mổ nông/sâu, kỹ thuật cách ly phòng ngừa và quản lý kháng sinh dự phòng." },
        { title: "Chăm sóc Bệnh nhân Chu phẫu Đường tiêu hóa & Gan mật tụy", hours: 16, institution: "ĐH Y Dược TP.HCM", priority: "Khuyến nghị", targetSkill: "Chuẩn bị tiền phẫu nội soi, theo dõi xì rò miệng nối và phục hồi nhu động ruột sau mổ." }
      ];
    } else if (u.includes("gây mê") || u.includes("gmhs") || u.includes("hồi tỉnh") || u.includes("shpt")) {
      return [
        { title: "Quản lý Đường thở Khó & Kỹ thuật Hồi sức Cấp cứu Tim phổi Nâng cao (ACLS)", hours: 24, institution: "ĐH Y Dược TP.HCM", priority: "Bắt buộc", targetSkill: "Sử dụng đèn soi thanh quản video, đặt mask thanh quản cấp cứu, sốc điện khử rung tim và dùng thuốc hồi sinh tim phổi." },
        { title: "Theo dõi Huyết động Chu phẫu, An toàn Gây mê & Xử trí Biến chứng Hồi tỉnh", hours: 24, institution: "Hội Gây mê Hồi sức Việt Nam", priority: "Bắt buộc", targetSkill: "Cài đặt máy thở, theo dõi EtCO2, SpO2, huyết áp động mạch xâm lấn và thang điểm hồi tỉnh Aldrete." },
        { title: "Dự phòng & Xử trí Ngộ độc Thuốc tê cục bộ (LAST) & Sốc phản vệ phòng mổ", hours: 16, institution: "ĐH Y Dược TP.HCM", priority: "Bắt buộc", targetSkill: "Nhận diện dấu hiệu LAST, chuẩn bị dung dịch nhũ dịch Lipid 20% và lưu đồ cấp cứu phản vệ Bộ Y tế." }
      ];
    } else if (u.includes("chẩn đoán") || u.includes("cdha") || u.includes("cđha")) {
      return [
        { title: "An toàn Bức xạ Y tế & Kỹ thuật Chăm sóc Bệnh nhân Chụp CT-Scanner / MRI", hours: 24, institution: "Trung tâm Đào tạo An toàn Bức xạ - ĐHYD TP.HCM", priority: "Bắt buộc", targetSkill: "Tuân thủ nguyên tắc ALARA trong chắn tia, kiểm tra an toàn kim loại trước khi vào phòng MRI." },
        { title: "Xử trí Cấp cứu Sốc Phản vệ do Thuốc Cản quang đường tĩnh mạch", hours: 24, institution: "ĐH Y Dược TP.HCM", priority: "Bắt buộc", targetSkill: "Phác đồ Adrenaline tiêm bắp tức thì khi bệnh nhân dị ứng thuốc cản quang, thở oxy và hồi sức thể tích." },
        { title: "Kỹ thuật Vô khuẩn & Phụ dụng cụ trong Can thiệp Mạch máu DSA", hours: 16, institution: "Hội Điện quang Can thiệp TP.HCM", priority: "Khuyến nghị", targetSkill: "Chuẩn bị bàn dụng cụ can thiệp tim mạch / mạch não vô khuẩn, băng ép cầm máu vị trí chọc động mạch đùi/quay." }
      ];
    } else if (u.includes("xét nghiệm") || u.includes("xn")) {
      return [
        { title: "Quản lý Chất lượng Xét nghiệm Y học theo Tiêu chuẩn ISO 15189:2022", hours: 24, institution: "ĐH Y Dược TP.HCM", priority: "Bắt buộc", targetSkill: "Kiểm soát chất lượng nội kiểm (IQC), ngoại kiểm (EQS), truy xuất nguồn gốc mẫu và đánh giá sai số phân tích." },
        { title: "An toàn Sinh học Phòng Xét nghiệm Y học Cấp II & Quản lý Chất thải Nguy hại", hours: 24, institution: "Viện Pasteur TP.HCM / ĐHYD TP.HCM", priority: "Bắt buộc", targetSkill: "Thao tác trong tủ an toàn sinh học cấp II, xử lý sự cố tràn đổ mẫu bệnh phẩm truyền nhiễm." },
        { title: "Kỹ thuật Lấy mẫu Máu chuẩn CLSI & Hạn chế Tán huyết / Đông dây", hours: 16, institution: "ĐH Y Dược TP.HCM", priority: "Khuyến nghị", targetSkill: "Thứ tự rút ống máu chân không vacutainer, đảo trộn đúng quy cách và bảo quản nhiệt độ chuẩn." }
      ];
    } else if (u.includes("phục hồi") || u.includes("phcn")) {
      return [
        { title: "Vận động Trị liệu & Phục hồi Chức năng Thần kinh sau Đột quỵ Não", hours: 24, institution: "ĐH Y Dược TP.HCM", priority: "Bắt buộc", targetSkill: "Kỹ thuật ức chế mẫu co cứng, tạo thuận cảm thụ bản thể thần kinh cơ (PNF) và tập đứng - dáng đi." },
        { title: "Phục hồi Chức năng Hệ Cơ Xương Khớp & Vật lý Trị liệu sau Chấn thương", hours: 24, institution: "Hội Phục hồi Chức năng Việt Nam", priority: "Bắt buộc", targetSkill: "Tập vận động thụ động/chủ động tầm vận động khớp (ROM), ứng dụng sóng ngắn, siêu âm trị liệu và laser giảm đau." },
        { title: "Lượng giá Chức năng Sinh hoạt Hàng ngày (ADL) & Sử dụng Dụng cụ Trợ giúp", hours: 16, institution: "ĐH Y Dược TP.HCM", priority: "Khuyến nghị", targetSkill: "Đánh giá chỉ số Barthel, FIM và hướng dẫn người bệnh sử dụng khung tập đi, nạng an toàn." }
      ];
    } else if (u.includes("tai mũi họng") || u.includes("tmh")) {
      return [
        { title: "Quy trình Chăm sóc Bệnh nhân Mở Khí Quản & Hút Đàm nhớt Vô khuẩn", hours: 24, institution: "Bệnh viện Tai Mũi Họng TP.HCM / ĐHYD TP.HCM", priority: "Bắt buộc", targetSkill: "Thay canule mở khí quản, vệ sinh nòng trong, hút đàm áp lực chuẩn tránh tổn thương niêm mạc khí quản." },
        { title: "Cấp cứu Chảy máu Mũi nặng & Chăm sóc Sau Phẫu thuật Đầu Mặt Cổ", hours: 24, institution: "ĐH Y Dược TP.HCM", priority: "Bắt buộc", targetSkill: "Phụ nhét bấc mũi trước/sau, theo dõi chảy máu sau cắt amidan và nhận diện sớm khó thở cấp." },
        { title: "Kiểm soát Nhiễm khuẩn & Tiệt khuẩn Ống nội soi Mềm Tai Mũi Họng", hours: 16, institution: "Hội Tai Mũi Họng TP.HCM", priority: "Khuyến nghị", targetSkill: "Quy trình ngâm khử khuẩn mức độ cao ống soi mềm, bảo quản tránh lây nhiễm chéo." }
      ];
    } else {
      // Nội soi, Khám bệnh, KSNK, Ban Điều dưỡng
      return [
        { title: "Giao tiếp Y khoa Nâng cao theo Mô hình AIDET & Kỹ năng Giải thích Người bệnh", hours: 24, institution: "Bệnh viện Đại học Y Dược TP.HCM", priority: "Bắt buộc", targetSkill: "Quy tắc 5 bước AIDET, kỹ năng lắng nghe thấu cảm, giải quyết phàn nàn và giảm thiểu bức xúc người bệnh." },
        { title: "Phương pháp Nghiên cứu Khoa học Điều dưỡng & Thực hành Dựa vào Bằng chứng (EBP)", hours: 24, institution: "Khoa Điều dưỡng - ĐH Y Dược TP.HCM", priority: "Bắt buộc", targetSkill: "Xây dựng câu hỏi PICO, tìm kiếm y văn Pubmed/Cochrane, thiết kế nghiên cứu mô tả và viết báo cáo khoa học." },
        { title: "Quản lý Sự cố Y khoa Tự nguyện & 6 Mục tiêu An toàn Người bệnh Quốc tế (IPSG)", hours: 16, institution: "Phòng Quản lý Chất lượng - BV ĐHYD TP.HCM", priority: "Bắt buộc", targetSkill: "Báo cáo sự cố suýt xảy ra (Near-miss), phân tích nguyên nhân gốc rễ RCA và phòng ngừa té ngã." }
      ];
    }
  },

  // Hoạch định kế hoạch năm sau (2026) chi tiết cho từng Lĩnh vực (Lĩnh vực 1 -> 5)
  generateDomainActionPlans(nurse, evaluationResult) {
    const { achievedLevel, nextConfig, domainScores } = evaluationResult;
    const isLevel4Plus = achievedLevel >= 4;

    return [
      {
        domainId: "domain_1",
        domainCode: "1",
        domainName: "Trình Độ Chuyên Môn & Đào Tạo Liên Tục (CME)",
        currentScore: domainScores.domain_1,
        targetScore: nextConfig ? nextConfig.minDomainScores.domain_1 : 140,
        actions: [
          `Hoàn thành tối thiểu 24 - 48 tiết đào tạo liên tục CME trong năm 2026 theo đúng quy định Thông tư 22/2013/TT-BYT.`,
          `Tham gia các khóa đào tạo kỹ năng lâm sàng nâng cao chuyên khoa tại ${nurse.unit}.`,
          nurse.degree.includes("Thạc") || nurse.degree.includes("Tiến") ? `Tiếp tục cập nhật kiến thức chuyên sâu và tham gia các hội nghị khoa học quốc gia/quốc tế.` : `Lập kế hoạch đăng ký học nâng cao trình độ chuyên môn (Cử nhân / Thạc sĩ Điều dưỡng) tại ĐH Y Dược TP.HCM.`
        ]
      },
      {
        domainId: "domain_2",
        domainCode: "2",
        domainName: "Năng Lực Thực Hành Chăm Sóc Lâm Sàng",
        currentScore: domainScores.domain_2,
        targetScore: nextConfig ? nextConfig.minDomainScores.domain_2 : 450,
        actions: [
          `Tuân thủ 100% các quy trình kỹ thuật chuyên môn và bảng kiểm chăm sóc người bệnh tại ${nurse.unit}.`,
          `Thực hành thuần thục mô hình bàn giao người bệnh SBAR (Situation - Background - Assessment - Recommendation) giữa các ca trực.`,
          `Nâng cao kỹ năng nhận diện sớm các dấu hiệu cảnh báo suy giảm sức khỏe người bệnh (Early Warning Score - EWS) để báo động cấp cứu kịp thời.`,
          isLevel4Plus ? `Chủ trì hội chẩn điều dưỡng các ca bệnh nặng, ca bệnh chăm sóc phức tạp tại khoa.` : `Rèn luyện thuần thục các kỹ thuật chăm sóc khó và thành thạo sử dụng các trang thiết bị y tế hiện đại.`
        ]
      },
      {
        domainId: "domain_3",
        domainCode: "3",
        domainName: "Đào Tạo, Hướng Dẫn & Nghiên Cứu Khoa Học",
        currentScore: domainScores.domain_3,
        targetScore: nextConfig ? nextConfig.minDomainScores.domain_3 : 50,
        actions: [
          isLevel4Plus || nurse.hasTeachingResearch ? 
            `Chủ nhiệm ít nhất 1 đề tài Nghiên cứu khoa học cấp cơ sở hoặc sáng kiến cải tiến kỹ thuật năm 2026.` : 
            `Đăng ký tham gia làm thành viên nghiên cứu trong đề tài NCKH cấp khoa/bệnh viện năm 2026.`,
          `Chuẩn bị và thực hiện tối thiểu 2 bài báo cáo sinh hoạt chuyên môn điều dưỡng tại ${nurse.unit}.`,
          `Tích cực tham gia công tác kèm cặp, hướng dẫn lâm sàng cho điều dưỡng mới, điều dưỡng tập sự và sinh viên thực tập.`
        ]
      },
      {
        domainId: "domain_4",
        domainCode: "4",
        domainName: "Quản Lý Khoa Phòng, 5S & An Toàn Người Bệnh",
        currentScore: domainScores.domain_4,
        targetScore: nextConfig ? nextConfig.minDomainScores.domain_4 : 150,
        actions: [
          `Triển khai hiệu quả 6 Mục tiêu An toàn Người bệnh Quốc tế (IPSG), đặc biệt là Nhận diện chính xác người bệnh và An toàn sử dụng thuốc nguy cơ cao.`,
          `Chủ động tham gia duy trì phong trào 5S (Sàng lọc - Sắp xếp - Sạch sẽ - Săn sóc - Sẵn sàng) tại tủ thuốc, xe tiêm và buồng bệnh.`,
          `Tích cực tham gia văn hóa an toàn người bệnh thông qua báo cáo sự cố y khoa tự nguyện (Near-miss) nhằm cải tiến hệ thống, phòng ngừa sự cố tái diễn.`
        ]
      },
      {
        domainId: "domain_5",
        domainCode: "5",
        domainName: "Đạo Đức Nghề Nghiệp, Giao Tiếp AIDET & Văn Hóa Tổ Chức",
        currentScore: domainScores.domain_5,
        targetScore: nextConfig ? nextConfig.minDomainScores.domain_5 : 200,
        actions: [
          `Áp dụng triệt để quy tắc 5 bước AIDET (Acknowledge - Introduce - Duration - Explanation - Thank you) trong mọi tình huống tiếp xúc với người bệnh và thân nhân.`,
          `Tôn trọng quyền riêng tư, bảo mật thông tin bệnh án và giữ gìn hình ảnh người điều dưỡng tận tụy, văn minh, chuyên nghiệp.`,
          `Duy trì tỷ lệ hài lòng của người bệnh đối với dịch vụ chăm sóc điều dưỡng đạt ≥ 95%.`
        ]
      }
    ];
  },

  // So sánh kết quả năm 2024 vs 2025
  generateYearComparison(nurse, evaluationResult) {
    const currentScore = evaluationResult.totalScore;
    const currentLevel = evaluationResult.achievedLevel;
    const score2024 = nurse.totalScore2024;
    
    let level2024 = null;
    if (score2024) {
      if (score2024 >= 700) level2024 = 4;
      else if (score2024 >= 400) level2024 = 3;
      else if (score2024 >= 300) level2024 = 2;
      else level2024 = 1;
    }

    const scoreDiff = score2024 ? currentScore - score2024 : null;
    const levelDiff = level2024 ? currentLevel - level2024 : null;

    let growthStatusText = "";
    let growthBadgeClass = "badge-done";

    if (scoreDiff !== null) {
      if (scoreDiff > 0) {
        growthStatusText = `Tăng trưởng xuất sắc (+${scoreDiff} điểm${levelDiff > 0 ? `, thăng +${levelDiff} Cấp bậc` : ''})`;
        growthBadgeClass = "badge-done";
      } else if (scoreDiff === 0) {
        growthStatusText = "Duy trì phong độ năng lực ổn định";
        growthBadgeClass = "badge-waiting";
      } else {
        growthStatusText = `Cần bồi dưỡng bổ sung (${scoreDiff} điểm)`;
        growthBadgeClass = "badge-locked";
      }
    } else {
      growthStatusText = "Năm đầu tiên thiết lập mốc đánh giá năng lực chuẩn";
      growthBadgeClass = "badge-done";
    }

    return {
      score2024: score2024 || "Chưa có",
      level2024: level2024 ? `Cấp ${level2024}` : "N/A",
      score2025: currentScore,
      level2025: `Cấp ${currentLevel}`,
      scoreDiff,
      levelDiff,
      growthStatusText,
      growthBadgeClass
    };
  },

  // Sinh Kế hoạch Hành động Cá nhân Tổng Thể
  generateActionPlan(nurse, evaluationResult) {
    const { achievedLevel, nextConfig, domainScores, totalScore, levelChecks } = evaluationResult;
    const nextLevelCheck = levelChecks.find(c => c.level === achievedLevel + 1);
    
    const gaps = [];
    const recommendedCme = this.getRecommendedCmeCourses(nurse.unit, achievedLevel);
    const domainPlans = this.generateDomainActionPlans(nurse, evaluationResult);
    const comparison = this.generateYearComparison(nurse, evaluationResult);

    const roadmap = {
      shortTerm: [],   // 1 - 3 tháng
      mediumTerm: [],  // 3 - 6 tháng
      longTerm: []     // 6 - 12 tháng
    };

    if (!nextConfig) {
      return {
        isTopLevel: true,
        summary: `Chúc mừng Anh/Chị đã đạt Cấp độ Năng lực cao nhất (Cấp 7 - Chuyên gia Cao cấp). Tiếp tục vai trò cố vấn, dẫn dắt thế hệ điều dưỡng trẻ và phát triển ngành Điều dưỡng!`,
        gaps: ["Duy trì chuẩn mực lâm sàng đỉnh cao và đẩy mạnh NCKH quốc tế."],
        recommendedCme,
        domainPlans,
        comparison,
        badges: this.generateMotivationalFeedback(nurse, evaluationResult).badges,
        roadmap: {
          shortTerm: ["Tham gia hội đồng cố vấn chuyên môn Ban Điều dưỡng", "Chủ trì xây dựng hướng dẫn lâm sàng chuẩn hóa cấp Bệnh viện"],
          mediumTerm: ["Thực hiện các công trình NCKH đăng tạp chí y khoa", "Đào tạo giảng viên lâm sàng (TOT) cho đội ngũ điều dưỡng trưởng"],
          longTerm: ["Mở rộng hợp tác đào tạo và hội nhập chuẩn điều dưỡng khu vực ASEAN"]
        }
      };
    }

    // 1. Phân tích khoảng cách điểm số
    const scoreDiff = nextConfig.minTotalScore - totalScore;
    if (scoreDiff > 0) {
      gaps.push(`Tổng điểm ĐGNL cần nâng thêm ${scoreDiff} điểm (từ ${totalScore}đ lên tối thiểu ${nextConfig.minTotalScore}đ để đạt Cấp ${nextConfig.level}).`);
    }

    // 2. Phân tích điểm sàn từng lĩnh vực
    DOMAINS_DATA.forEach(d => {
      const current = domainScores[d.id] || 0;
      const target = nextConfig.minDomainScores[d.id] || 0;
      if (current < target) {
        gaps.push(`Lĩnh vực ${d.code} (${d.name}) cần bồi dưỡng thêm ${target - current} điểm để đạt mốc ${target}đ.`);
      }
    });

    // 3. Phân tích điều kiện bắt buộc
    if (nextLevelCheck) {
      if (!nextLevelCheck.passedTeachingResearch) {
        gaps.push(`Cần bổ sung tiêu chuẩn NCKH & Giảng dạy: Đăng ký giảng ≥ 2 bài/năm và làm Chủ nhiệm 1 đề tài NCKH cấp cơ sở.`);
        roadmap.shortTerm.push("Đăng ký chủ đề bài giảng sinh hoạt chuyên môn tại khoa với ĐD Trưởng.");
        roadmap.mediumTerm.push("Hoàn thành giảng 2 buổi chuyên môn và viết đề cương nghiên cứu khoa học cấp cơ sở.");
        roadmap.longTerm.push("Nghiệm thu đề tài NCKH cấp cơ sở và viết bài báo gửi đăng tập san y học.");
      }

      if (!nextLevelCheck.passedExam) {
        gaps.push(`Kiểm tra tay nghề định kỳ: Cần đạt điểm thi lý thuyết & lâm sàng ≥ 7.0 điểm.`);
        roadmap.shortTerm.push("Ôn tập lý thuyết quy trình chăm sóc và kỹ thuật lâm sàng chuẩn UMC.");
        roadmap.mediumTerm.push("Tham gia kỳ thi kiểm tra tay nghề điều dưỡng định kỳ, mục tiêu đạt ≥ 8.0 điểm.");
      }

      if (!nextLevelCheck.passedDegree) {
        gaps.push(`Chuẩn bằng cấp: Cần kế hoạch nâng chuẩn lên ${nextConfig.degreeReq}.`);
        roadmap.longTerm.push("Lập kế hoạch thi tuyển và tham gia khóa đào tạo Sau đại học (Cử nhân / Thạc sĩ Điều dưỡng).");
      }

      if (!nextLevelCheck.passedExperience) {
        gaps.push(`Thâm niên lâm sàng: Cần tích lũy thêm thời gian công tác để đạt mốc ${nextConfig.experienceDesc}.`);
      }
    }

    // Roadmap bổ sung
    roadmap.shortTerm.push(`Hoàn thành đợt 1 tích lũy tín chỉ CME chuyên ngành ${nurse.unit} (≥12 tiết).`);
    roadmap.shortTerm.push(`Thực hành chuẩn mực 5 bước AIDET và bàn giao bệnh nhân an toàn SBAR.`);
    roadmap.mediumTerm.push(`Tham gia dự án cải tiến 5S khoa phòng và kiểm toán quy trình vô khuẩn.`);
    roadmap.mediumTerm.push(`Đạt 100% chỉ tiêu 24 tiết CME hàng năm chuẩn Bộ Y tế.`);
    roadmap.longTerm.push(`Hoàn thiện toàn bộ hồ sơ minh chứng số hóa để Ban Điều dưỡng thẩm định thăng cấp.`);

    return {
      isTopLevel: false,
      targetLevel: nextConfig.level,
      targetTitle: nextConfig.title,
      scoreDiff: Math.max(0, scoreDiff),
      gaps,
      recommendedCme,
      domainPlans,
      comparison,
      badges: this.generateMotivationalFeedback(nurse, evaluationResult).badges,
      roadmap
    };
  },

  // Sinh Lời Động viên Tích cực và Huy hiệu Vinh danh (Positive Motivation & Badges)
  generateMotivationalFeedback(nurse, evaluationResult) {
    const { achievedLevel, totalScore, domainScores } = evaluationResult;
    const badges = [];

    // 1. Huy hiệu Thâm niên & Vinh danh Florence Nightingale
    if (nurse.experienceYears >= 15) {
      badges.push({
        id: "badge_nightingale",
        icon: "🕯️",
        title: "Vinh danh Florence Nightingale",
        image: "assets/florence_nightingale.jpg",
        desc: `Với hơn ${nurse.experienceYears} năm tận tụy cống hiến tại ${nurse.unit}, Anh/Chị kế thừa xuất sắc ngọn đèn bất diệt và tinh thần phụng sự cao cả của Người khai sinh ngành Điều dưỡng thế giới.`
      });
    } else if (nurse.experienceYears >= 5) {
      badges.push({
        id: "badge_core",
        icon: "🛡️",
        title: "Cột Trụ Chuyên Môn",
        desc: "Kinh nghiệm lâm sàng dày dặn, phản xạ nhanh nhạy và đảm bảo an toàn tuyệt đối cho người bệnh."
      });
    } else {
      badges.push({
        id: "badge_rising_star",
        icon: "🌟",
        title: "Ngôi Sao Triển Vọng",
        desc: "Nhân tố trẻ giàu nhiệt huyết, tiếp thu nhanh và luôn tràn đầy năng lượng phụng sự người bệnh."
      });
    }

    // 2. Huy hiệu Lâm sàng & Chăm sóc
    if (domainScores.domain_2 >= 300) {
      badges.push({
        id: "badge_clinical_master",
        icon: "👐",
        title: "Bàn Tay Vàng Lâm Sàng",
        desc: "Kỹ năng thực hành chăm sóc điêu luyện, mang lại sự tin cậy và an tâm tuyệt đối cho người bệnh."
      });
    }

    // 3. Huy hiệu Đào tạo & NCKH
    if (nurse.hasTeachingResearch || domainScores.domain_3 >= 20) {
      badges.push({
        id: "badge_researcher",
        icon: "📚",
        title: "Ngọn Đèn Tri Thức",
        desc: "Tích cực nghiên cứu khoa học, ứng dụng y học chứng cứ EBP và truyền thụ kinh nghiệm cho đồng nghiệp."
      });
    }

    // 4. Huy hiệu Giao tiếp AIDET/Đạo đức
    if (domainScores.domain_5 >= 140) {
      badges.push({
        id: "badge_compassion",
        icon: "💖",
        title: "Trái Tim Nhân Ái (AIDET)",
        desc: "Giao tiếp ân cần, thấu cảm sâu sắc với nỗi đau của người bệnh và tuân thủ đạo đức nghề nghiệp."
      });
    }

    // 5. Huy hiệu CME & Học tập liên tục
    if (nurse.cmeList && nurse.cmeList.length >= 1) {
      badges.push({
        id: "badge_lifelong_learner",
        icon: "🎓",
        title: "Học Tập Suốt Đời",
        desc: "Chủ động cập nhật kiến thức y khoa liên tục qua các khóa đào tạo CME chất lượng cao."
      });
    }

    let headline = "";
    let quote = "";
    let message = "";

    if (achievedLevel >= 4) {
      headline = `Biểu Dương Thành Tích Xuất Sắc – Cột Trụ Chuyên Môn Cấp ${achievedLevel}`;
      quote = "Lòng tận tụy và chuyên môn vững vàng là ngọn đèn dẫn lối cho sự an toàn và phục hồi của người bệnh.";
      message = `Trân trọng chúc mừng Bạn ${nurse.fullName}! Với thành tích xuất sắc đạt chuẩn Năng lực Cấp ${achievedLevel} (${totalScore} điểm), Bạn là tấm gương sáng về tay nghề điêu luyện, tinh thần trách nhiệm và phẩm chất cao quý của người điều dưỡng UMC. Ban Điều dưỡng và Lãnh đạo Khoa ghi nhận, biểu dương những đóng góp to lớn của Bạn cho người bệnh và sự phát triển của ${nurse.unit}!`;
    } else if (achievedLevel === 3) {
      headline = `Ghi Nhận Nỗ Lực & Đạt Chuẩn Năng Lực Vững Vàng – Cấp ${achievedLevel}`;
      quote = "Thành công là tổng hòa của sự kiên trì mỗi ngày, lòng yêu nghề sâu sắc và khát khao vươn tới sự hoàn thiện chuyên môn.";
      message = `Chào Bạn ${nurse.fullName}, kết quả đánh giá Năng lực Cấp 3 (${totalScore} điểm) khẳng định tay nghề lâm sàng vững vàng và sự cống hiến bền bỉ của Bạn tại ${nurse.unit}. Bạn đang ở giai đoạn chín muồi nhất của sự nghiệp điều dưỡng và chỉ còn một bước ngắn nữa (bổ sung bài giảng & đề tài NCKH) để chạm mốc Cấp 4. Tập thể khoa luôn đồng hành, tin tưởng và tạo mọi điều kiện để Bạn bứt phá trong năm tới!`;
    } else if (achievedLevel === 2) {
      headline = `Chúc Mừng Sự Trưởng Thành Vượt Bậc – Điều Dưỡng Lâm Sàng Cấp ${achievedLevel}`;
      quote = "Mỗi bước chân chăm sóc người bệnh hôm nay là viên gạch xây nên bản lĩnh của một điều dưỡng viên xuất sắc mai sau.";
      message = `Thân gửi Bạn ${nurse.fullName}, chúc mừng Bạn đã đạt chuẩn Năng lực Cấp 2 với điểm số ấn tượng ${totalScore} điểm! Điểm số này cùng kỹ năng thực hành ngày càng thuần thục cho thấy sự trưởng thành vượt bậc của Bạn tại ${nurse.unit}. Hãy giữ vững ngọn lửa đam mê, tích cực rèn luyện kỹ thuật chuyên sâu và giao tiếp thấu cảm để sẵn sàng thăng Cấp 3 trong kỳ đánh giá tiếp theo nhé!`;
    } else {
      headline = `Chào Đón & Khích Lệ Tinh Thần – Điều Dưỡng Cấp ${achievedLevel}`;
      quote = "Khởi đầu của mọi hành trình vĩ đại luôn bắt đầu từ những việc nhỏ bé được làm bằng cả trái tim chân thành.";
      message = `Chào bạn trẻ ${nurse.fullName}, chào mừng Bạn đến với ngôi nhà chung Điều dưỡng UMC! Đạt kết quả đánh giá Cấp 1 (${totalScore} điểm) là một khởi đầu vững chắc. Mỗi giọt mồ hôi bên giường bệnh, mỗi nụ cười của bệnh nhân xuất viện sẽ bồi đắp nên sự tự hào và kinh nghiệm quý giá cho Bạn. Hãy luôn tự tin, học hỏi không ngừng từ các anh chị đi trước, Bạn chính là tương lai tươi sáng của khoa chúng ta!`;
    }

    return {
      badges,
      headline,
      message,
      quote
    };
  },

  // Sinh Bằng Vinh Danh Năng Lực Điều Dưỡng UMC (Certificate of Honors)
  generateHonorsCertificate(nurse, evalResult) {
    const level = evalResult.achievedLevel;
    const score = evalResult.totalScore;
    
    let honorRankTitle = "ĐIỀU DƯỠNG THÀNH THẠO - CHUYÊN GIA LÂM SÀNG CẤP CAO";
    let honorCitation = "Hội đồng Đánh giá & Phân cấp Năng lực Điều dưỡng Bệnh viện Đại học Y Dược TP.HCM trân trọng vinh danh và trao tặng danh hiệu cao quý này nhằm ghi nhận những thành tích xuất sắc, kỹ năng lâm sàng điêu luyện, năng lực nghiên cứu khoa học và sự đóng góp to lớn cho chất lượng chăm sóc người bệnh.";
    
    if (level === 4) {
      honorRankTitle = "ĐIỀU DƯỠNG THÀNH THẠO - CỘT TRỤ CHUYÊN MÔN & ĐÀO TẠO (CẤP 4)";
      honorCitation = "Ghi nhận sự cống hiến vượt trội, tinh thần làm chủ kỹ thuật lâm sàng chuyên sâu, dẫn dắt đội ngũ và hoàn thành xuất sắc các chỉ tiêu NCKH & Đào tạo năm 2025.";
    } else if (level === 3) {
      honorRankTitle = "ĐIỀU DƯỠNG LÂM SÀNG ĐẠT CHUẨN NĂNG LỰC XUẤT SẮC (CẤP 3)";
      honorCitation = "Biểu dương năng lực chuyên môn vững vàng, khả năng độc lập xử trí các tình huống lâm sàng phức tạp và sự tận tụy chăm sóc an toàn người bệnh.";
    } else if (level === 2) {
      honorRankTitle = "ĐIỀU DƯỠNG LÂM SÀNG TIẾN BỘ VƯỢT BẬC & VỮNG VÀNG (CẤP 2)";
      honorCitation = "Biểu dương tinh thần nỗ lực rèn luyện, nâng cao tay nghề thực hành và thái độ phục vụ người bệnh chuẩn mực văn hóa AIDET.";
    } else {
      honorRankTitle = "ĐIỀU DƯỠNG TRẺ NHIỆT HUYẾT & TRIỂN VỌNG (CẤP 1)";
      honorCitation = "Ghi nhận sự khởi đầu tự tin, tinh thần học hỏi cầu tiến và nhiệt huyết cống hiến cho sự nghiệp chăm sóc sức khỏe nhân dân.";
    }

    return {
      certificateNumber: `UMC-DGNL-2025/${nurse.code || nurse.id}`,
      decisionNumber: "128/QĐ-ĐHYD-TCCB",
      recipientName: nurse.fullName,
      degree: nurse.degree || "Đại Học",
      unit: nurse.unit,
      level: level,
      levelBadge: evalResult.currentConfig.badge,
      score: score,
      totalScore: score,
      honorsTitle: honorRankTitle,
      honorRankTitle: honorRankTitle,
      citation: honorCitation,
      hospitalSigner: "GS. TS. Trịnh Thị Diệu Thường",
      hospitalSignerTitle: "PHÓ GIÁM ĐỐC BỆNH VIỆN",
      nursingSigner: "ThS. Phan Thị Tâm Đan",
      nursingSignerTitle: "ĐIỀU DƯỠNG TRƯỞNG BỆNH VIỆN - TRƯỞNG BAN ĐIỀU DƯỠNG",
      signers: {
        nursingBoardHead: "ThS. Phan Thị Tâm Đan",
        nursingBoardTitle: "ĐIỀU DƯỠNG TRƯỞNG BV - TRƯỞNG BAN ĐIỀU DƯỠNG",
        hospitalDirector: "GS. TS. Trịnh Thị Diệu Thường",
        hospitalTitle: "PHÓ GIÁM ĐỐC BỆNH VIỆN"
      },
      issueDate: "Ngày 15 tháng 02 năm 2025"
    };
  },

  // Phân tích dữ liệu & Khuyến nghị Quy hoạch Cán bộ / Phát triển Tài năng
  analyzeTalentProfiles(nursesList) {
    const list = nursesList || [];
    
    // 1. Nhóm Tiềm năng Quản lý & Lãnh đạo (Leadership Track)
    // Tiêu chí: Lĩnh vực 4 (Quản lý, An toàn, 5S) cao + Lĩnh vực 5 (Giao tiếp AIDET, Đạo đức) cao + Thâm niên >= 5 năm + Cấp 3 hoặc 4
    const managementTalents = [];

    // 2. Nhóm Chuyên gia Lâm sàng Chuyên sâu (Clinical Nurse Specialist - CNS)
    // Tiêu chí: Lĩnh vực 2 (Thực hành kỹ thuật) cao + Điểm thi kiểm tra tay nghề >= 8.5
    const clinicalSpecialists = [];

    // 3. Nhóm Giảng viên Lâm sàng & Nghiên cứu Khoa học (Nurse Educator & Researcher)
    // Tiêu chí: Lĩnh vực 3 (Đào tạo & NCKH) cao + Bằng Thạc sĩ/Đại học + hasTeachingResearch
    const educatorResearchers = [];

    // 4. Nhóm Nhân tố Trẻ Triển vọng (Rising Star Talent)
    // Tiêu chí: Thâm niên < 3 năm + Tổng điểm >= 400 + Điểm thi tay nghề giỏi
    const risingStars = [];

    list.forEach(nurse => {
      const { domainScores, totalScore } = this.calculateScores(nurse.managerScores || nurse.selfScores);
      const evalRes = this.evaluateCompetency(nurse, nurse.managerScores || nurse.selfScores);
      const lvl = evalRes.achievedLevel;
      const expY = nurse.experienceYears || 0;
      const deg = (nurse.degree || "").toLowerCase();
      const examSc = typeof nurse.examScore === "number" ? nurse.examScore : 8.5;

      // Check Management Track
      if ((domainScores.domain_4 >= 30 || lvl >= 4) && (domainScores.domain_5 >= 50) && expY >= 5) {
        managementTalents.push({
          nurse,
          level: lvl,
          totalScore,
          domain4Score: domainScores.domain_4,
          domain5Score: domainScores.domain_5,
          strengthDesc: `Quản lý khoa phòng tốt (${domainScores.domain_4}đ), Giao tiếp AIDET xuất sắc (${domainScores.domain_5}đ), Thâm niên ${expY} năm`,
          recommendation: lvl >= 4 ? "Quy hoạch Điều dưỡng Trưởng khoa / Điều dưỡng Phụ trách đơn vị" : "Đề xuất Trưởng kíp trực lâm sàng & Tổ Quản lý Chất lượng",
          priorityTag: lvl >= 4 ? "Ưu tiên số 1" : "Quy hoạch kế cận",
          tagClass: "bg-indigo-100 text-indigo-800"
        });
      }

      // Check Clinical Specialist Track
      if (domainScores.domain_2 >= 320 || (lvl >= 3 && examSc >= 8.0)) {
        clinicalSpecialists.push({
          nurse,
          level: lvl,
          totalScore,
          domain2Score: domainScores.domain_2,
          strengthDesc: `Tay nghề lâm sàng điêu luyện (${domainScores.domain_2}đ), Điểm kiểm tra tay nghề: ${nurse.examScore}`,
          recommendation: `Phát triển Chuyên gia Lâm sàng (CNS) mũi nhọn: ERAS, VAC, NRP, Hồi sức cấp cứu tại ${nurse.unit}`,
          priorityTag: "Chuyên gia mũi nhọn",
          tagClass: "bg-emerald-100 text-emerald-800"
        });
      }

      // Check Educator & Researcher Track
      if (nurse.hasTeachingResearch || domainScores.domain_3 >= 20 || deg.includes("thạc") || deg.includes("ck")) {
        educatorResearchers.push({
          nurse,
          level: lvl,
          totalScore,
          domain3Score: domainScores.domain_3,
          strengthDesc: `Trình độ ${nurse.degree}, Năng lực Đào tạo & NCKH tốt (${domainScores.domain_3}đ)`,
          recommendation: "Giảng viên lâm sàng (Preceptor) hướng dẫn tân tuyển & Chủ nhiệm đề tài NCKH cấp cơ sở",
          priorityTag: "Giảng viên - NCKH",
          tagClass: "bg-purple-100 text-purple-800"
        });
      }

      // Check Rising Star
      if (expY <= 3 && (totalScore >= 380 || examSc >= 8.5)) {
        risingStars.push({
          nurse,
          level: lvl,
          totalScore,
          strengthDesc: `Điều dưỡng trẻ (${expY} năm KN) có điểm số xuất sắc (${totalScore}đ), CME tích cực`,
          recommendation: "Ươm mầm nhân lực kế cận, cử tham gia các khóa đào tạo chuyên sâu & Hội nghị NCKH",
          priorityTag: "Tài năng trẻ",
          tagClass: "bg-amber-100 text-amber-800"
        });
      }
    });

    return {
      managementTalents: managementTalents.slice(0, 10),
      clinicalSpecialists: clinicalSpecialists.slice(0, 10),
      educatorResearchers: educatorResearchers.slice(0, 10),
      risingStars: risingStars.slice(0, 10)
    };
  }
};
