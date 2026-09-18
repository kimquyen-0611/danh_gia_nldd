// api/index.js - Vercel Serverless Function Entrypoint
// Chuyển tiếp toàn bộ yêu cầu HTTP /api/* tới ứng dụng Express
const app = require('../assets/backend/server');

module.exports = app;
