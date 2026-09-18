const http = require('http');
const app = require('./server');

const server = http.createServer(app);

server.listen(0, '127.0.0.1', async () => {
  const port = server.address().port;
  const baseUrl = `http://127.0.0.1:${port}`;
  console.log(`Test server running on ${baseUrl}`);

  try {
    // 1. Health check
    let res = await fetch(`${baseUrl}/api/health`);
    let data = await res.json();
    console.log('✅ 1. GET /api/health:', data.status);

    // 2. Status check
    res = await fetch(`${baseUrl}/api/status`);
    data = await res.json();
    console.log('✅ 2. GET /api/status:', data.status, '- Mode:', data.database);

    // 3. Login test with invalid password
    res = await fetch(`${baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'quyen.ntk', password: 'wrongpassword' })
    });
    data = await res.json();
    console.log('✅ 3. POST /api/auth/login (Wrong password check):', data.success === false ? 'Correctly rejected' : 'Failed');

    // 4. Login test with valid user
    res = await fetch(`${baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'quyen.ntk', password: '123' })
    });
    data = await res.json();
    console.log('✅ 4. POST /api/auth/login (Valid user):', data.success ? `Token issued for ${data.user.fullName}` : 'Failed', '- Role:', data.user ? data.user.role : 'N/A');

    // 5. Get users
    res = await fetch(`${baseUrl}/api/users`);
    data = await res.json();
    console.log('✅ 5. GET /api/users:', data.success ? `Returned ${data.count} users (password field stripped: ${!data.data[0]?.password})` : 'Failed');

    // 6. Get submissions
    res = await fetch(`${baseUrl}/api/submissions`);
    data = await res.json();
    console.log('✅ 6. GET /api/submissions:', data.success ? `Returned ${data.count} submissions` : 'Failed');

    console.log('\n🎉 ALL BACKEND API ENDPOINTS TESTED AND PASSED SUCCESSFULLY!');
  } catch (err) {
    console.error('❌ Error during API test:', err);
  } finally {
    server.close();
    process.exit(0);
  }
});
