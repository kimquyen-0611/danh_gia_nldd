// db.js - Quản lý kết nối Supabase (Hỗ trợ cả Connection Pool PostgreSQL và Supabase HTTPS Engine)
const { Pool } = require('pg');
require('dotenv').config();

let pool = null;
let usePgPool = false;

// Khởi tạo Pool nếu DATABASE_URL hợp lệ
if (process.env.DATABASE_URL && !process.env.DATABASE_URL.includes(':password@')) {
  try {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false },
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 5000
    });

    pool.on('error', (err) => {
      console.warn('⚠️ Lỗi kết nối pool PostgreSQL:', err.message);
    });

    pool.connect()
      .then((client) => {
        usePgPool = true;
        console.log('✅ Đã kết nối Supabase qua PostgreSQL Connection Pool!');
        client.release();
      })
      .catch((err) => {
        console.log('ℹ️ Không kết nối trực tiếp cổng 5432 (chuyển sang Supabase HTTPS API):', err.message);
      });
  } catch (err) {
    console.warn('Không thể khởi tạo Pool:', err.message);
  }
} else {
  console.log('ℹ️ Đang sử dụng chế độ Supabase HTTPS REST Engine (Bảo mật & Ổn định cao).');
}

// Hàm query đa năng: Ưu tiên PostgreSQL Pool, nếu chưa có thì dùng Supabase REST API
const query = async (sql, params = []) => {
  if (usePgPool && pool) {
    return pool.query(sql, params);
  }
  throw new Error('Chế độ PostgreSQL Pool chưa kích hoạt. Vui lòng sử dụng phương thức API.');
};

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://ogqblclswauwvqnifbtw.supabase.co';
const SUPABASE_SECRET_KEY = process.env.SUPABASE_SECRET_KEY || 'YOUR_SUPABASE_SECRET_KEY_HERE';

// Hàm thao tác trực tiếp với Supabase REST API (dùng SUPABASE_SECRET_KEY từ .env hoặc fallback)
const supabaseApi = {
  async insert(table, data) {
    const url = `${SUPABASE_URL}/rest/v1/${table}`;
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_SECRET_KEY,
        'Authorization': `Bearer ${SUPABASE_SECRET_KEY}`,
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

  async upsert(table, data, onConflict = 'id') {
    const url = `${SUPABASE_URL}/rest/v1/${table}?on_conflict=${onConflict}`;
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_SECRET_KEY,
        'Authorization': `Bearer ${SUPABASE_SECRET_KEY}`,
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

  async select(table, { limit = 100, page = 1, order = null, queryParams = '' } = {}) {
    const offset = (page - 1) * limit;
    let url = `${SUPABASE_URL}/rest/v1/${table}?select=*&limit=${limit}&offset=${offset}`;
    if (order) {
      url += `&order=${order}`;
    }
    if (queryParams) {
      url += `&${queryParams}`;
    }
    const res = await fetch(url, {
      headers: {
        'apikey': SUPABASE_SECRET_KEY,
        'Authorization': `Bearer ${SUPABASE_SECRET_KEY}`,
        'Accept': 'application/json'
      }
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Supabase API lỗi (${res.status}): ${errorText}`);
    }
    return res.json();
  },

  async delete(table, id, idField = 'id') {
    const url = `${SUPABASE_URL}/rest/v1/${table}?${idField}=eq.${id}`;
    const res = await fetch(url, {
      method: 'DELETE',
      headers: {
        'apikey': SUPABASE_SECRET_KEY,
        'Authorization': `Bearer ${SUPABASE_SECRET_KEY}`
      }
    });
    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Supabase API lỗi (${res.status}): ${errorText}`);
    }
    return { success: true };
  }
};

// Helper methods tiện ích
const getAllUsers = async () => {
  return await supabaseApi.select('umc_users', { limit: 500 });
};

const getAllSubmissions = async () => {
  return await supabaseApi.select('umc_submissions', { limit: 500 });
};

const saveUser = async (user) => {
  return await supabaseApi.upsert('umc_users', user, 'id');
};

const saveSubmission = async (sub) => {
  return await supabaseApi.upsert('umc_submissions', sub, 'id');
};

module.exports = {
  query,
  pool,
  supabaseApi,
  getAllUsers,
  getAllSubmissions,
  saveUser,
  saveSubmission
};

