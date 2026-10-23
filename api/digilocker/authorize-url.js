/**
 * Vercel Serverless Function: /api/digilocker/authorize-url
 * Generates official Government of India OAuth 2.0 authorization redirect URL.
 */

const { getConfig, sendJsonResponse, handleCors } = require('../_digilocker_helper');

module.exports = async (req, res) => {
  if (handleCors(req, res)) return;

  if (req.method !== 'GET') {
    return sendJsonResponse(res, 405, { error: 'Method not allowed' });
  }

  const cfg = getConfig(req);
  const state = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

  // Parse query parameters
  const query = req.query || {};
  let clientProvidedRedirectUri = query.redirect_uri;

  // If deployed on Vercel or custom domain, dynamically compute callback URL if not provided
  const redirectUri = clientProvidedRedirectUri || cfg.redirectUri;

  const baseUrl = cfg.environment === 'sandbox'
    ? 'https://api.digitallocker.gov.in/public/oauth2/1/authorize'
    : 'https://digilocker.meripehchaan.gov.in/public/oauth2/1/authorize';

  const authUrl = `${baseUrl}?response_type=code` +
    `&client_id=${encodeURIComponent(cfg.clientId || 'NYAYASETU_RBU_GOV')}` +
    `&redirect_uri=${encodeURIComponent(redirectUri)}` +
    `&state=${encodeURIComponent(state)}` +
    `&scope=${encodeURIComponent(cfg.scope || 'openid profile')}`;

  return sendJsonResponse(res, 200, {
    authUrl,
    state,
    clientId: cfg.clientId,
    environment: cfg.environment,
    redirectUri: redirectUri,
    isVercel: cfg.isVercel
  });
};
