// Shared helpers for Gutly's serverless functions (Vercel, Node 18+).
// The Anthropic API key lives only in the ANTHROPIC_API_KEY environment variable.
const MODEL = process.env.ANTHROPIC_MODEL || 'claude-haiku-5-5';

function readBody(req) {
  if (req.body && typeof req.body === 'object') return req.body;
  try { return JSON.parse(req.body || '{}'); } catch (_) { return {}; }
}

// Only answer browser calls coming from this deployment (or from ALLOWED_ORIGINS, comma-separated).
function originAllowed(req) {
  const origin = req.headers.origin;
  if (!origin) return true;
  let host;
  try { host = new URL(origin).host; } catch (_) { return false; }
  if (host === req.headers.host) return true;
  const extra = (process.env.ALLOWED_ORIGINS || '').split(',').map(s => s.trim()).filter(Boolean);
  return extra.some(o => { try { return new URL(o).host === host; } catch (_) { return o === host; } });
}

async function callClaude(payload) {
  const r = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': process.env.ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json'
    },
    body: JSON.stringify({ model: MODEL, ...payload })
  });
  if (!r.ok) {
    const err = new Error('Anthropic API error ' + r.status);
    err.status = r.status;
    throw err;
  }
  const j = await r.json();
  return (j.content || []).filter(c => c.type === 'text').map(c => c.text).join('').trim();
}

module.exports = { MODEL, readBody, originAllowed, callClaude };
