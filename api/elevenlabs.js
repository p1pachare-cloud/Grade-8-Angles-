import crypto from 'node:crypto';

export const STYLE_SETTINGS = {
  celebration:   { stability: 0.12, similarity_boost: 0.45, style: 0.75, use_speaker_boost: true },
  encouragement: { stability: 0.16, similarity_boost: 0.50, style: 0.65, use_speaker_boost: true },
  question:      { stability: 0.20, similarity_boost: 0.55, style: 0.55, use_speaker_boost: true },
  emphasis:      { stability: 0.16, similarity_boost: 0.50, style: 0.60, use_speaker_boost: true },
  thinking:      { stability: 0.24, similarity_boost: 0.60, style: 0.35, use_speaker_boost: true },
  statement:     { stability: 0.20, similarity_boost: 0.55, style: 0.50, use_speaker_boost: true },
  instruction:   { stability: 0.20, similarity_boost: 0.55, style: 0.50, use_speaker_boost: true },
};

const serverCache = new Map();

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  const { text, style = 'statement' } = req.body ?? {};
  if (typeof text !== 'string' || text.length === 0 || text.length > 450) return res.status(400).end();
  if (!STYLE_SETTINGS[style]) return res.status(400).end();

  const key = crypto.createHash('sha256').update(`${style}::${text}`).digest('hex');
  if (serverCache.has(key)) {
    return res.setHeader('Content-Type', 'audio/mpeg').setHeader('X-Cache', 'HIT').send(serverCache.get(key));
  }

  const apiKey = process.env.ELEVENLABS_API_KEY || process.env.VITE_ELEVENLABS_API_KEY;
  if (!apiKey) return res.status(503).json({ error: 'ELEVENLABS_API_KEY not configured' });

  try {
    const r = await fetch('https://api.elevenlabs.io/v1/text-to-speech/Xb7hH8MSUJpSbSDYk0k2', {
      method: 'POST',
      headers: {
        'xi-api-key': apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text,
        model_id: 'eleven_multilingual_v2',
        voice_settings: STYLE_SETTINGS[style],
      }),
    });
    if (!r.ok) return res.status(502).end();
    const buf = Buffer.from(await r.arrayBuffer());
    serverCache.set(key, buf);
    res.setHeader('Content-Type', 'audio/mpeg').setHeader('X-Cache', 'MISS').send(buf);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
