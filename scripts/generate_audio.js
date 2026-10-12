import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { spawnSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env.local if present
const envLocalPath = path.resolve(__dirname, '../.env.local');
if (fs.existsSync(envLocalPath) && process.loadEnvFile) {
  try {
    process.loadEnvFile(envLocalPath);
  } catch (e) {}
}

const STYLE_SETTINGS = {
  celebration:   { stability: 0.12, similarity_boost: 0.45, style: 0.75, use_speaker_boost: true },
  encouragement: { stability: 0.16, similarity_boost: 0.50, style: 0.65, use_speaker_boost: true },
  question:      { stability: 0.20, similarity_boost: 0.55, style: 0.55, use_speaker_boost: true },
  emphasis:      { stability: 0.16, similarity_boost: 0.50, style: 0.60, use_speaker_boost: true },
  thinking:      { stability: 0.24, similarity_boost: 0.60, style: 0.35, use_speaker_boost: true },
  statement:     { stability: 0.20, similarity_boost: 0.55, style: 0.50, use_speaker_boost: true },
  instruction:   { stability: 0.20, similarity_boost: 0.55, style: 0.50, use_speaker_boost: true },
};

// Fixed narration phrases per PRD & TRD — Strictly paragraph text and questions ONLY (never titles)
const phrases = [
  // Phase 1 — Wonder
  { text: "Liam is repairing a model bridge. Two beams cross each other, and one angle measures one hundred and ten degrees.", style: 'thinking' },
  { text: "Without a protractor, can you figure out the other three angles?", style: 'question' },
  { text: "Let's discover the secret rules of angles!", style: 'encouragement' },

  // Phase 2 — Story
  { text: "Wei in Singapore starts a video call. John, Mike, Sarah, Emma, Liam, Sofia, Noah, Aisha, Carlos, and Yuki all join. The World Youth Skyline Festival opens in three days, and ten landmark models need fixing.", style: 'statement' },
  { text: "Storm Zigzag has bent the beams of every model. Vertex the robot beeps. Only perfect angles can make the landmarks stand tall again!", style: 'emphasis' },
  { text: "Sarah in Sydney is rebuilding the Opera House. Two sails cross at the top, and one angle is sixty-five degrees. She spots a pattern. The angle opposite is exactly the same!", style: 'statement' },
  { text: "Yuki in Tokyo points at the busy crossing. Two straight roads run side by side, and a third road cuts across both. She notices that the angles at the two junctions match, like copies of each other.", style: 'statement' },
  { text: "Aisha in Dubai checks the tower frame. Three angles make a triangle. She adds them up: the total is always one hundred and eighty degrees, no matter how the triangle is shaped.", style: 'emphasis' },
  { text: "Vertex hands each architect an Angle Tool. Ten landmarks, ten skills. Together they can restore every angle and open the festival on time!", style: 'encouragement' },

  // Phase 3 — Station instructions
  { text: "Drag the ray to build the angle. Watch the protractor and stop when it matches the target!", style: 'instruction' },
  { text: "Drag the crossing line and watch the angles. Which ones always stay equal?", style: 'question' },
  { text: "Tear off the corners of the triangle and line them up. What do you notice about the total?", style: 'question' },
  { text: "Choose the rule, build the equation, then solve for x.", style: 'instruction' },

  // Phase 4 — Feedback & hints
  { text: "Perfect! You restored that angle like a true architect!", style: 'celebration' },
  { text: "Not quite! Let's check the diagram again.", style: 'encouragement' },
  { text: "Let's look at the rule together. Angles on a straight line add up to one hundred and eighty degrees.", style: 'thinking' },
  { text: "Angles around a point add up to three hundred and sixty degrees.", style: 'thinking' },
  { text: "Watch the angles move. Can you spot which ones are equal?", style: 'thinking' },
  { text: "Which rule gives you this angle?", style: 'question' },

  // Badges
  { text: "Badge unlocked! You are an Angle Scout!", style: 'celebration' },
  { text: "Badge unlocked! Lab Technician! You completed all four stations!", style: 'celebration' },
  { text: "Badge unlocked! Angle Champion! You scored over eighty percent!", style: 'celebration' },

  // Phase 5 — Reflect
  { text: "What an adventure! Can you explain one angle rule to me in your own words?", style: 'thinking' },
  { text: "Lesson complete! You are a Global Angle Architect Champion!", style: 'celebration' },
];

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .slice(0, 45);
}

function generateNeuralTTS(text, filePath) {
  try {
    const res = spawnSync('edge-tts', [
      '--voice', 'en-US-JennyNeural',
      '--text', text,
      '--write-media', filePath,
    ]);
    return res.status === 0 && fs.existsSync(filePath) && fs.statSync(filePath).size > 100;
  } catch (e) {
    return false;
  }
}

async function run() {
  const apiKey = (process.env.VITE_ELEVENLABS_API_KEY || process.env.ELEVENLABS_API_KEY || '').trim();
  const audioDir = path.resolve(__dirname, '../public/assets/audio');
  if (!fs.existsSync(audioDir)) {
    fs.mkdirSync(audioDir, { recursive: true });
  }

  const audioMap = {};

  for (let i = 0; i < phrases.length; i++) {
    const { text, style } = phrases[i];
    const filename = `audio_${slugify(text)}_${i}.mp3`;
    const filePath = path.join(audioDir, filename);
    const publicPath = `/assets/audio/${filename}`;

    // Skip if already generated
    if (fs.existsSync(filePath) && fs.statSync(filePath).size > 500) {
      audioMap[text] = publicPath;
      continue;
    }

    let generated = false;
    if (apiKey) {
      try {
        const resp = await fetch('https://api.elevenlabs.io/v1/text-to-speech/Xb7hH8MSUJpSbSDYk0k2', {
          method: 'POST',
          headers: {
            'xi-api-key': apiKey,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            text,
            model_id: 'eleven_multilingual_v2',
            voice_settings: STYLE_SETTINGS[style] || STYLE_SETTINGS.statement,
          }),
        });

        if (resp.ok) {
          const buffer = Buffer.from(await resp.arrayBuffer());
          fs.writeFileSync(filePath, buffer);
          audioMap[text] = publicPath;
          generated = true;
          await new Promise((r) => setTimeout(r, 400));
        }
      } catch (e) {}
    }

    if (!generated) {
      const ok = generateNeuralTTS(text, filePath);
      if (ok) {
        audioMap[text] = publicPath;
        generated = true;
      }
    }
  }

  const mapFileContent = `// Auto-generated by scripts/generate_audio.js\nexport const audioMap = ${JSON.stringify(audioMap, null, 2)};\n`;
  fs.writeFileSync(path.resolve(__dirname, '../src/utils/audioMap.js'), mapFileContent);
  console.log(`🎉 Audio generation script executed: ${Object.keys(audioMap).length} mapped.`);
}

run();
