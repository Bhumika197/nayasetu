/**
 * NyayaSetu API — POST /api/search/submit
 * Submits CNR + Captcha to official eCourts portal, returns normalized JSON or explicit error.
 */

const { submitSearch } = require('../../ecourts_service');

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

module.exports = async function handleSubmitSearch(req, res) {
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
    const sessionId = body.sessionId;
    const captcha = body.captcha;

    if (!sessionId) {
      res.writeHead(400);
      res.end(JSON.stringify({ error: 'SESSION_REQUIRED', message: 'sessionId is required' }));
      return;
    }

    if (!captcha) {
      res.writeHead(400);
      res.end(JSON.stringify({ error: 'CAPTCHA_REQUIRED', message: 'captcha text is required' }));
      return;
    }

    const caseData = await submitSearch(sessionId, captcha, clientIp);
    res.writeHead(200);
    res.end(JSON.stringify(caseData));
  } catch (err) {
    const status = err.status || 400;
    const responsePayload = {
      error: err.code || 'PORTAL_ERROR',
      message: err.message || 'Error communicating with eCourts portal'
    };

    // If WRONG_CAPTCHA, return the fresh captcha image so user can immediately retry
    if (err.captchaImage) {
      responsePayload.captchaImage = err.captchaImage;
    }

    res.writeHead(status);
    res.end(JSON.stringify(responsePayload));
  }
};
