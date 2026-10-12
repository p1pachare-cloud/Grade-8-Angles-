import { createRng, childSeed } from '../engine/rng.js';
import { assertValid } from './validate.js';

import { genClassify } from './g01_classify.js';
import { genCompSupp } from './g02_compSupp.js';
import { genLinePoint } from './g03_linePoint.js';
import { genVertical } from './g04_verticalAdjacent.js';
import { genParallelName } from './g05_parallelName.js';
import { genParallelFind } from './g06_parallelFind.js';
import { genTriangle } from './g07_triangleSum.js';
import { genExterior } from './g08_exteriorAngle.js';
import { genPolygon } from './g09_polygonAngles.js';
import { genAlgebra } from './g10_algebraJustify.js';

export const GENERATORS = {
  classify: genClassify,
  comp_supp: genCompSupp,
  line_point: genLinePoint,
  vertical_adjacent: genVertical,
  parallel_name: genParallelName,
  parallel_find: genParallelFind,
  triangle_sum: genTriangle,
  exterior_angle: genExterior,
  polygon: genPolygon,
  algebra: genAlgebra,
};

const TYPES = [
  'classify',
  'comp_supp',
  'line_point',
  'vertical_adjacent',
  'parallel_name',
  'parallel_find',
  'triangle_sum',
  'exterior_angle',
  'polygon',
  'algebra',
];

const FOCUS_PLAN = {
  classify:          [1, 1, 1, 1, 2, 2, 2, 3],
  comp_supp:         [1, 1, 1, 2, 2, 2, 3, 3],
  line_point:        [1, 1, 1, 2, 2, 2, 3, 3],
  vertical_adjacent: [1, 1, 1, 2, 2, 2, 3, 3],
  parallel_name:     [1, 1, 1, 2, 2, 2, 3, 3],
  parallel_find:     [1, 1, 2, 2, 2, 3, 3, 3],
  triangle_sum:      [1, 1, 1, 2, 2, 2, 3, 3],
  exterior_angle:    [1, 1, 2, 2, 2, 3, 3, 3],
  polygon:           [1, 1, 2, 2, 2, 3, 3, 3],
  algebra:           [1, 2, 2, 2, 3, 3, 3, 3],
};

const SPIRAL_DIFFICULTY = [1, 2];

export function buildWorldQuestions(seed, world, retry = 0, glossary = 'neutral') {
  const rng = createRng(childSeed(seed, world, retry));
  const type = TYPES[world] || 'classify';
  const focus = rng.shuffle(FOCUS_PLAN[type] || [1, 1, 2, 2, 2, 2, 3, 3]).map((d) => ({
    type,
    d,
    spiral: false,
  }));

  const spiralTypes = world === 0
    ? ['classify', 'classify']
    : [rng.pick(TYPES.slice(0, world)), rng.pick(TYPES.slice(0, world))];

  const spiral = spiralTypes.map((t, i) => ({
    type: t,
    d: SPIRAL_DIFFICULTY[i],
    spiral: true,
  }));

  // Interleave spiral questions at slots 3 and 7
  const plan = [...focus];
  plan.splice(3, 0, spiral[0]);
  plan.splice(7, 0, spiral[1]);

  const seen = new Set();
  return plan.map((p, slot) => {
    for (let attempt = 0; attempt < 60; attempt++) {
      const slotRng = createRng(childSeed(seed, world, retry, slot, attempt));
      const generatorFn = GENERATORS[p.type] || genClassify;
      const q = generatorFn(slotRng, p.d, { world, slot, isSpiral: p.spiral, glossary });
      if (seen.has(q.signature)) continue;
      assertValid(q);
      seen.add(q.signature);
      return q;
    }
    // Fallback: guaranteed valid question
    const slotRng = createRng(childSeed(seed, world, retry, slot, 99));
    return (GENERATORS[p.type] || genClassify)(slotRng, p.d, { world, slot, isSpiral: p.spiral, glossary });
  });
}

export function buildSessionQuestions(seed = 12345, retryCounters = Array(10).fill(0), glossary = 'neutral') {
  return Array.from({ length: 10 }, (_, w) =>
    buildWorldQuestions(seed, w, retryCounters[w] || 0, glossary)
  ).flat();
}

export const buildSession = buildSessionQuestions;
