/**
 * NyayaSetu — Swayam Indic Voice Assistant
 * Strictly refers to the Constitution of India and Indian statutory law.
 */

const STATUTORY_AI_URL = process.env.STATUTORY_AI_URL || 'http://127.0.0.1:20128/v1/chat/completions';
const STATUTORY_AI_KEY = process.env.STATUTORY_AI_KEY || 'sk-b5b1c59c6e610a57-63f816-d1de8b9f';
const STATUTORY_AI_MODEL = process.env.STATUTORY_AI_MODEL || 'auto/best-free';

async function handleVoice(req, res) {
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
      const query = (parsed.query || '').trim();
      const lang = (parsed.lang || 'Hindi').trim();

      if (!query) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Voice/text query is required.' }));
        return;
      }

      const prompt = `STRICT STATUTORY INSTRUCTION:
You must strictly and exclusively refer to the Constitution of India, statutory Indian legislations (including Bharatiya Nyaya Sanhita 2023 / Indian Penal Code, Bharatiya Nagarik Suraksha Sanhita 2023 / Code of Criminal Procedure, Bharatiya Sakshya Adhiniyam 2023 / Indian Evidence Act, Code of Civil Procedure 1908, Negotiable Instruments Act 1881, Consumer Protection Act 2019, Transfer of Property Act 1882, Right to Information Act 2005, and applicable Central/State Acts), and established Supreme Court of India precedents.
Do NOT give generic AI advice or hallucinated provisions. State only verifiable Indian statutory law.

Citizen Query: "${query}"

Respond in ${lang} language concisely (maximum 2-3 short sentences). Clearly mention the applicable Indian statutory section, legal remedy, or court/forum.`;

      const gatewayRes = await fetch(STATUTORY_AI_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${STATUTORY_AI_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: STATUTORY_AI_MODEL,
          messages: [
            {
              role: 'system',
              content: 'You are an authoritative Indian legal compliance assistant. Strictly refer to the Constitution of India and Indian statutory acts.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.1
        })
      });

      if (!gatewayRes.ok) {
        const errText = await gatewayRes.text();
        res.writeHead(gatewayRes.status, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Statutory Gateway error', details: errText }));
        return;
      }

      const gatewayData = await gatewayRes.json();
      const text = gatewayData.choices?.[0]?.message?.content || 'No response received from statutory engine.';
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ reply: text, text }));
    } catch (err) {
      console.error('[API /api/ai/voice error]:', err);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: err.message || 'Internal voice AI error' }));
    }
  });
}

module.exports = handleVoice;
