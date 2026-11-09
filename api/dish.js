// POST /api/dish  { image: "data:image/jpeg;base64,..." }  ->  { dish, confidence }
const { readBody, originAllowed, callClaude } = require('./_shared');

const PROMPT = 'This photo shows a meal someone is about to eat, most likely Indian home, canteen or delivery food. Reply with only JSON: {"dish": string, "confidence": "high" | "medium" | "low"}. "dish" is a plain everyday name of 2 to 5 words, for example "dal-chawal with salad" or "masala dosa". If it is not food, use an empty string. Do not comment on health, calories or portions.';

module.exports = async (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') return res.status(405).json({ error: 'Use POST.' });
  if (!process.env.ANTHROPIC_API_KEY) return res.status(503).json({ error: 'AI is not set up on this deployment.' });
  if (!originAllowed(req)) return res.status(403).json({ error: 'This origin is not allowed.' });

  const { image } = readBody(req);
  const m = typeof image === 'string' && image.match(/^data:(image\/(?:jpeg|png|webp));base64,([A-Za-z0-9+/=]+)$/);
  if (!m) return res.status(400).json({ error: 'Send a JPEG, PNG or WebP image as a data URL.' });
  if (m[2].length > 3_000_000) return res.status(413).json({ error: 'That photo is too large.' });

  try {
    const text = await callClaude({
      max_tokens: 100,
      messages: [{ role: 'user', content: [
        { type: 'image', source: { type: 'base64', media_type: m[1], data: m[2] } },
        { type: 'text', text: PROMPT }
      ] }]
    });
    const json = JSON.parse((text.match(/\{[\s\S]*\}/) || ['{}'])[0]);
    const dish = typeof json.dish === 'string' ? json.dish.slice(0, 60) : '';
    const confidence = ['high', 'medium', 'low'].includes(json.confidence) ? json.confidence : 'low';
    return res.status(200).json({ dish, confidence });
  } catch (e) {
    return res.status(e.status === 429 ? 429 : 502).json({ error: 'Could not name the dish just now.' });
  }
};
