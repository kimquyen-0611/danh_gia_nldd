const liveUrls = [
  'https://danh-gia-nldd-umc.vercel.app/',
  'https://danh-gia-nldd-umc.vercel.app/styles.css',
  'https://danh-gia-nldd-umc.vercel.app/app.js',
  'https://danh-gia-nldd-umc.vercel.app/api_client.js',
  'https://danh-gia-nldd-umc.vercel.app/supabase_client.js',
  'https://danh-gia-nldd-umc.vercel.app/api/health',
  'https://danh-gia-nldd-umc.vercel.app/api/status'
];

(async () => {
  console.log('====================================================');
  console.log('  KIỂM TRA TRẠNG THÁI PRODUCTION TRÊN VERCEL');
  console.log('====================================================\n');

  for (const url of liveUrls) {
    try {
      const res = await fetch(url);
      const isOk = res.ok;
      let extra = '';
      if (url.includes('/api/')) {
        try {
          const json = await res.json();
          extra = ` -> ${JSON.stringify(json)}`;
        } catch { }
      }
      console.log(`${isOk ? '✅' : '❌'} [${res.status}] ${url}${extra}`);
    } catch (e) {
      console.log(`❌ Lỗi kết nối: ${url} (${e.message})`);
    }
  }

  console.log('\n🎉 KIỂM TRA HOÀN TẤT!');
})();
