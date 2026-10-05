const dns = require('dns');
try {
  dns.setServers(['8.8.8.8', '1.1.1.1', '8.8.4.4']);
} catch(e) {}

try {
  const undici = require('undici');
  if (undici && undici.Agent && undici.setGlobalDispatcher) {
    const agent = new undici.Agent({
      connect: {
        lookup: (hostname, options, callback) => {
          if (hostname === 'api.vercel.com') {
            return callback(null, [{ address: '76.76.21.112', family: 4 }]);
          }
          if (hostname === 'vercel.com') {
            return callback(null, [{ address: '76.76.21.21', family: 4 }]);
          }
          if (hostname === 'bmnbwofludntkmjeskqj.supabase.co') {
            return callback(null, [{ address: '104.18.38.10', family: 4 }]);
          }
          dns.lookup(hostname, options, callback);
        },
        rejectUnauthorized: false
      }
    });
    undici.setGlobalDispatcher(agent);
  }
} catch(e) {}
