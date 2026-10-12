import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function cleanAudio() {
  const audioDir = path.resolve(__dirname, '../public/assets/audio');
  const mapPath = path.resolve(__dirname, '../src/utils/audioMap.js');

  if (!fs.existsSync(audioDir)) {
    console.log('[clean] No public/assets/audio directory found. Nothing to clean.');
    return;
  }

  let audioMap = {};
  if (fs.existsSync(mapPath)) {
    try {
      const module = await import(`file://${mapPath}?t=${Date.now()}`);
      audioMap = module.audioMap || {};
    } catch (e) {
      console.warn('[clean] Could not read audioMap.js:', e.message);
    }
  }

  const validFiles = new Set(
    Object.values(audioMap).map((p) => path.basename(p))
  );

  const filesOnDisk = fs.readdirSync(audioDir);
  let removedCount = 0;

  for (const file of filesOnDisk) {
    const fullPath = path.join(audioDir, file);
    const stats = fs.statSync(fullPath);

    if (!validFiles.has(file) || stats.size === 0) {
      fs.unlinkSync(fullPath);
      removedCount++;
    }
  }

  console.log(`[clean] Cleanup completed. Removed ${removedCount} file(s).`);
}

cleanAudio();
