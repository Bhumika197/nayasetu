/**
 * NyayaSetu API — POST /api/search/start
 * Initializes session with official eCourts portal, fetches fresh captcha image.
 */

const { startSearch } = require('../../ecourts_service');

function readJsonBody(req) {
  return new Promise((resolve) => {
    if (req.body && typeof req.body === 'object') return resolve(req.body);
    let data = '';
    req.on('data', chunk => data += chunk);
    req.on('end', () => {
      try {
        resolve(data ? JSON.parse(data) : {});
      } catch (e) {
        resolve({});
      }
    });
  });
}

module.exports = async function handleSearchStart(req, res) {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');

  if (req.method !== 'POST') {
    res.writeHead(405);
    res.end(JSON.stringify({ error: 'METHOD_NOT_ALLOWED', message: 'Use POST method' }));
    return;
  }

  const clientIp = (req.headers['x-forwarded-for'] || '').split(',')[0].trim() ||
                   req.socket?.remoteAddress || '127.0.0.1';

  try {
    const body = await readJsonBody(req);
    const cnr = body.cnr || req.query?.cnr;

    const result = await startSearch(cnr, clientIp);
    res.writeHead(200);
    res.end(JSON.stringify(result));
  } catch (err) {
    const status = err.status || 400;
    res.writeHead(status);
    res.end(JSON.stringify({
      error: err.code || 'PORTAL_ERROR',
      message: err.message || 'Error communicating with eCourts portal'
    }));
  }
};
