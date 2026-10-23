/**
 * NyayaSetu — Indic Text-to-Speech API
 * Powered by Sarvam AI Bulbul:v3 Indic Voice Synthesis Model
 */

const SARVAM_TTS_URL = 'https://api.sarvam.ai/text-to-speech';
const SARVAM_KEY = process.env.SARVAM_KEY || 'sk_lin1rbw1_M6FBDUkcZJ9hSgNfvp3Aftl2';

// Speaker mapping per language for natural voice delivery
const SPEAKERS = {
  'hi-IN': 'aditya',
  'mr-IN': 'ishita_mr_conversational',
  'en-IN': 'dev_en_conversational',
  'ta-IN': 'gokul_ta_narration',
  'te-IN': 'kavitha_te_conversation',
  'kn-IN': 'chaitra_kn_conversation',
  'bn-IN': 'roopa_bn_conversational',
  'gu-IN': 'pooja_gu_conversational'
};

async function handleTts(req, res) {
  if (req.method !== 'POST') {
    res.writeHead(405, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Method Not Allowed' }));
    return;
  }

  let body = '';
  req.on('data', chunk => { body += chunk; });
  req.on('end', async () => {
    try {
      const parsed = JSON.parse(body || '{}');
      const text = (parsed.text || '').trim();
      const lang = (parsed.lang || 'hi-IN').trim();

      if (!text) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Text is required for voice synthesis.' }));
        return;
      }

      const targetLang = lang.includes('-') ? lang : `${lang}-IN`;
      const speaker = SPEAKERS[targetLang] || 'aditya';

      const sarvamRes = await fetch(SARVAM_TTS_URL, {
        method: 'POST',
        headers: {
          'api-subscription-key': SARVAM_KEY,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          inputs: [text.substring(0, 500)], // Sarvam max input length per chunk
          target_language_code: targetLang,
          speaker: speaker,
          model: 'bulbul:v3'
        })
      });

      if (!sarvamRes.ok) {
        const errText = await sarvamRes.text();
        console.error('[Sarvam TTS Error]:', sarvamRes.status, errText);
        res.writeHead(sarvamRes.status, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'TTS synthesis failed', details: errText }));
        return;
      }

      const data = await sarvamRes.json();
      const audioBase64 = (data.audios && data.audios[0]) || '';

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        audio: audioBase64,
        format: 'audio/wav',
        speaker: speaker
      }));
    } catch (err) {
      console.error('[API /api/ai/tts error]:', err);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: err.message || 'Internal TTS error' }));
    }
  });
}

module.exports = handleTts;
