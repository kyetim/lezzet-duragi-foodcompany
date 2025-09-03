// 🔥 En Basit HTTP Server Test
const http = require('http');

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({
    message: '🎉 Backend çalışıyor!',
    url: req.url,
    timestamp: new Date().toISOString()
  }));
});

const PORT = 8080;

server.listen(PORT, () => {
  console.log(`🚀 Test Server çalışıyor: http://localhost:${PORT}`);
});

server.on('error', (err) => {
  console.error('❌ Server Error:', err);
});
