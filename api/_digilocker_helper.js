/**
 * NyayaSetu — DigiLocker OAuth 2.0 Shared Helper
 * Compatible with both Vercel Serverless Functions and local Node.js server.
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

// Path to local config file (used in local development)
const CONFIG_FILE = path.join(__dirname, '..', 'digilocker_config.json');

// Default config fallback
const DEFAULT_CONFIG = {
  clientId: '',
  clientSecret: '',
  environment: 'production', // 'production' (meripehchaan.gov.in) or 'sandbox' (api.digitallocker.gov.in)
  redirectUri: 'http://localhost:3000/callback.html',
  scope: 'openid profile in.gov.uidai:eaadhaar',
  registeredEntity: 'Ramdeobaba University (RBU) - IDEA Lab NyayaSetu'
};

/**
 * Determine active DigiLocker configuration.
 * Priority:
 * 1. Environment variables (Vercel Production / Staging)
 * 2. digilocker_config.json (Local file)
 * 3. Default fallback values
 */
function getConfig(req) {
  let fileConfig = {};
  if (fs.existsSync(CONFIG_FILE)) {
    try {
      fileConfig = JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf8'));
    } catch (e) {
      // Ignore JSON parse errors in local dev
    }
  }

  // Detect dynamic host for redirect URI (especially on Vercel)
  const dynamicHost = (req && (req.headers['x-forwarded-host'] || req.headers['host'])) || '';
  const proto = (req && (req.headers['x-forwarded-proto'] || (dynamicHost.includes('localhost') ? 'http' : 'https'))) || 'https';
  const inferredRedirectUri = dynamicHost 
    ? `${proto}://${dynamicHost}/callback.html` 
    : (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}/callback.html` : DEFAULT_CONFIG.redirectUri);

  const clientId = process.env.DIGILOCKER_CLIENT_ID || fileConfig.clientId || DEFAULT_CONFIG.clientId;
  const clientSecret = process.env.DIGILOCKER_CLIENT_SECRET || fileConfig.clientSecret || DEFAULT_CONFIG.clientSecret;
  const environment = process.env.DIGILOCKER_ENV || process.env.DIGILOCKER_ENVIRONMENT || fileConfig.environment || DEFAULT_CONFIG.environment;
  const redirectUri = process.env.DIGILOCKER_REDIRECT_URI || fileConfig.redirectUri || inferredRedirectUri;
  const scope = process.env.DIGILOCKER_SCOPE || fileConfig.scope || DEFAULT_CONFIG.scope;
  const registeredEntity = process.env.DIGILOCKER_ENTITY || fileConfig.registeredEntity || DEFAULT_CONFIG.registeredEntity;

  return {
    clientId,
    clientSecret,
    environment,
    redirectUri,
    scope,
    registeredEntity,
    isVercel: !!process.env.VERCEL,
    hasEnvSecrets: !!(process.env.DIGILOCKER_CLIENT_ID || process.env.DIGILOCKER_CLIENT_SECRET)
  };
}

/**
 * Save configuration to local file (in local development only).
 * On Vercel, the filesystem is read-only, so runtime updates are noted accordingly.
 */
function saveConfig(updated) {
  if (process.env.VERCEL) {
    // Vercel read-only filesystem notice
    return {
      success: true,
      persistedToFile: false,
      message: 'Running in Vercel Serverless environment. For persistent production credentials, configure DIGILOCKER_CLIENT_ID and DIGILOCKER_CLIENT_SECRET in your Vercel Project Settings > Environment Variables.'
    };
  }

  try {
    const current = getConfig();
    const merged = {
      clientId: updated.clientId !== undefined ? updated.clientId.trim() : current.clientId,
      clientSecret: updated.clientSecret !== undefined && updated.clientSecret !== '' 
        ? updated.clientSecret.trim() 
        : current.clientSecret,
      environment: updated.environment || current.environment,
      redirectUri: updated.redirectUri || current.redirectUri,
      scope: updated.scope || current.scope,
      registeredEntity: updated.registeredEntity || current.registeredEntity
    };
    fs.writeFileSync(CONFIG_FILE, JSON.stringify(merged, null, 2), 'utf8');
    return { success: true, persistedToFile: true, message: 'Configuration saved successfully to digilocker_config.json.' };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

/**
 * Helper to parse request body across Vercel serverless and raw Node HTTP server
 */
function parseRequestBody(req) {
  return new Promise((resolve, reject) => {
    // If Vercel has already parsed body
    if (req.body && typeof req.body === 'object') {
      return resolve(req.body);
    }
    if (typeof req.body === 'string') {
      try {
        return resolve(JSON.parse(req.body));
      } catch (e) {
        return resolve({});
      }
    }

    let raw = '';
    req.on('data', chunk => { raw += chunk; });
    req.on('end', () => {
      if (!raw) return resolve({});
      try {
        resolve(JSON.parse(raw));
      } catch (e) {
        reject(e);
      }
    });
    req.on('error', err => reject(err));
  });
}

/**
 * Send JSON response supporting both Express/Vercel helpers and raw Node.js ServerResponse
 */
function sendJsonResponse(res, statusCode, data) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (typeof res.status === 'function' && typeof res.json === 'function') {
    return res.status(statusCode).json(data);
  }

  res.writeHead(statusCode, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(data));
}

/**
 * Handle CORS preflight
 */
function handleCors(req, res) {
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    if (typeof res.status === 'function') {
      res.status(204).end();
    } else {
      res.writeHead(204);
      res.end();
    }
    return true;
  }
  return false;
}

/**
 * Perform HTTPS POST to DigiLocker MeriPehchaan Token Endpoint
 */
function exchangeAuthorizationCode(tokenHost, postData, clientId, clientSecret) {
  return new Promise((resolve, reject) => {
    const tokenReq = https.request({
      hostname: tokenHost,
      path: '/public/oauth2/1/token',
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(postData),
        'Authorization': 'Basic ' + Buffer.from(`${clientId}:${clientSecret}`).toString('base64')
      }
    }, tokenRes => {
      let body = '';
      tokenRes.on('data', c => { body += c; });
      tokenRes.on('end', () => {
        try {
          const json = JSON.parse(body);
          resolve({ status: tokenRes.statusCode, data: json, raw: body });
        } catch (e) {
          resolve({ status: tokenRes.statusCode, raw: body, parseError: true });
        }
      });
    });

    tokenReq.on('error', err => reject(err));
    tokenReq.write(postData);
    tokenReq.end();
  });
}

/**
 * Fetch verified user demographic profile using Access Token
 */
function fetchDigiLockerUser(tokenHost, accessToken, clientId) {
  return new Promise((resolve, reject) => {
    const req = https.request({
      hostname: tokenHost,
      path: '/public/oauth2/1/user',
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'X-Client-Id': clientId
      }
    }, res => {
      let body = '';
      res.on('data', c => { body += c; });
      res.on('end', () => {
        try {
          const json = JSON.parse(body);
          resolve(json);
        } catch (e) {
          resolve(null);
        }
      });
    });

    req.on('error', err => reject(err));
    req.end();
  });
}

module.exports = {
  getConfig,
  saveConfig,
  parseRequestBody,
  sendJsonResponse,
  handleCors,
  exchangeAuthorizationCode,
  fetchDigiLockerUser
};
