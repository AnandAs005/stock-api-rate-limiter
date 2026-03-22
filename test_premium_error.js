const http = require('http');

async function testPremiumErrorMessage() {
  const symbol = 'AAPL';
  const apiKey = 'api_premium_free_123';
  const url = `http://localhost:3001/stock-price/${symbol}`;

  console.log(`Testing Premium Error Message (Sending 105 requests)...`);
  
  const requests = [];
  for (let i = 1; i <= 105; i++) {
    requests.push(new Promise((resolve) => {
      const req = http.get(url, {
        headers: { 'x-api-key': apiKey }
      }, (res) => {
        let data = '';
        res.on('data', (chunk) => { data += chunk; });
        res.on('end', () => {
          if (res.statusCode === 429) {
            const body = JSON.parse(data);
            console.log(`Request ${i} (429):`, body.error);
          } else if (i > 100) {
            console.log(`Request ${i}: ${res.statusCode}`);
          }
          resolve();
        });
      });
      req.on('error', (e) => {
        console.error(`Request ${i} Error: ${e.message}`);
        resolve();
      });
    }));
  }

  await Promise.all(requests);
}

testPremiumErrorMessage();
