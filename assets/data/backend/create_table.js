const { Client } = require('pg');
require('dotenv').config();

const createTableSql = `
CREATE TABLE IF NOT EXISTS yeu_cau (
  id BIGSERIAL PRIMARY KEY,
  ho_ten VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  so_dien_thoai VARCHAR(50),
  noi_dung TEXT NOT NULL,
  trang_thai VARCHAR(50) DEFAULT 'cho_xu_ly',
  created_at TIMESTAMPTZ DEFAULT NOW()
);
`;

async function main() {
  console.log('Connecting to database...');
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    console.log('Connected to PostgreSQL successfully.');
    console.log('Creating table "yeu_cau"...');
    await client.query(createTableSql);
    console.log('✅ Bảng "yeu_cau" đã được tạo thành công trên Supabase!');
    
    // Verify table columns
    const res = await client.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'yeu_cau' 
      ORDER BY ordinal_position;
    `);
    console.log('Danh sách các cột trong bảng:');
    console.table(res.rows);
  } catch (error) {
    console.error('❌ Lỗi:', error.message);
    if (error.message.includes('password authentication failed')) {
      console.error('👉 GỢI Ý: Vui lòng thay "password" trong file backend/.env bằng mật khẩu thật của database Supabase.');
    }
  } finally {
    await client.end().catch(() => {});
  }
}

main();
