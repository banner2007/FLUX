
const https = require('https');

const data = JSON.stringify({
    prompt: "test de conexión flux"
});

const options = {
    hostname: 'flux-production-593a.up.railway.app',
    port: 443,
    path: '/generate',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
    }
};

console.log("🔹 Probando conexión directa a Railway...");

const req = https.request(options, (res) => {
    console.log(`🔸 Estado: ${res.statusCode} ${res.statusMessage}`);
    console.log('🔸 Headers:', JSON.stringify(res.headers, null, 2));

    res.on('data', (d) => {
        process.stdout.write(d);
    });
});

req.on('error', (error) => {
    console.error("❌ Error de conexión:", error);
});

req.write(data);
req.end();
