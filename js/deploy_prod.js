const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const appData = process.env.APPDATA;
const authPath = path.join(appData, 'com.vercel.cli', 'Data', 'auth.json');
let token = '';

if (fs.existsSync(authPath)) {
  const auth = JSON.parse(fs.readFileSync(authPath, 'utf8'));
  token = auth.token;
}

const vercelCmd = path.resolve('./node_modules/.bin/vercel.cmd');
const cmd = token ? `"${vercelCmd}" --prod --yes --token ${token}` : `"${vercelCmd}" --prod --yes`;

console.log('Deploying to Vercel production...');
try {
  const output = execSync(cmd, { encoding: 'utf8', stdio: 'inherit' });
  console.log('Deploy succeeded!');
} catch (e) {
  console.error('Deploy error:', e.message);
  process.exit(1);
}
