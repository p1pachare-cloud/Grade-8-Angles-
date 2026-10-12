// Seeded Mulberry32 PRNG and child stream generator
export function createRng(seed) {
  let a = (seed >>> 0) || 123456789;
  const next = () => {
    a = (a + 0x6D2B79F5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  const int = (lo, hi) => lo + Math.floor(next() * (hi - lo + 1));
  const pick = (arr) => arr[Math.floor(next() * arr.length)];
  const shuffle = (arr) => {
    const out = [...arr];
    for (let i = out.length - 1; i > 0; i--) {
      const j = Math.floor(next() * (i + 1));
      [out[i], out[j]] = [out[j], out[i]];
    }
    return out;
  };
  const chance = (p) => next() < p;
  return { next, int, pick, shuffle, chance };
}

// Derive independent child seeds so retrying a world doesn't shift random streams of other worlds
export const childSeed = (seed, ...salts) =>
  salts.reduce((s, x) => (Math.imul(s ^ (x + 0x9E3779B9), 0x85EBCA6B) >>> 0), seed >>> 0);
