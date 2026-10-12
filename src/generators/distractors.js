// candidates: [{ value, tag }] from named misconceptions. Fills with offsets if needed.
export function buildNumericOptions(rng, correct, candidates = [], count = 4) {
  const seen = new Set([correct]);
  const out = [{ value: correct }];

  // 1. Add valid candidates from named misconceptions
  for (const c of rng.shuffle(candidates)) {
    if (
      c &&
      typeof c.value === 'number' &&
      c.value > 0 &&
      c.value < 360 &&
      Number.isInteger(c.value) &&
      !seen.has(c.value)
    ) {
      seen.add(c.value);
      out.push(c);
    }
    if (out.length === count) break;
  }

  // 2. Fill remaining slots with plausible mathematical offsets
  const offsets = rng.shuffle([-20, -15, -10, -5, 5, 10, 15, 20, 30, -30]);
  for (const o of offsets) {
    if (out.length === count) break;
    const v = correct + o;
    if (v > 0 && v < 360 && !seen.has(v)) {
      seen.add(v);
      out.push({ value: v });
    }
  }

  // 3. Fallback if still short
  let alt = 15;
  while (out.length < count) {
    if (!seen.has(alt) && alt !== correct) {
      seen.add(alt);
      out.push({ value: alt });
    }
    alt += 10;
  }

  return rng.shuffle(out);
}
