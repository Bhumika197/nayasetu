/**
 * Vercel Serverless Function: /api/digilocker/config
 * Manages DigiLocker gateway credentials & environment settings.
 */

const { getConfig, saveConfig, parseRequestBody, sendJsonResponse, handleCors } = require('../_digilocker_helper');

module.exports = async (req, res) => {
  if (handleCors(req, res)) return;

  if (req.method === 'GET') {
    const cfg = getConfig(req);
    const safeCfg = {
      clientId: cfg.clientId,
      environment: cfg.environment,
      redirectUri: cfg.redirectUri,
      scope: cfg.scope,
      registeredEntity: cfg.registeredEntity,
      hasSecret: !!cfg.clientSecret,
      clientSecretMasked: cfg.clientSecret ? '••••••••••••••••' : '',
      isVercel: cfg.isVercel,
      hasEnvSecrets: cfg.hasEnvSecrets
    };
    return sendJsonResponse(res, 200, safeCfg);
  }

  if (req.method === 'POST') {
    try {
      const body = await parseRequestBody(req);
      const result = saveConfig(body);
      return sendJsonResponse(res, result.success ? 200 : 400, result);
    } catch (err) {
      return sendJsonResponse(res, 400, { success: false, error: err.message });
    }
  }

  return sendJsonResponse(res, 405, { error: 'Method not allowed' });
};
