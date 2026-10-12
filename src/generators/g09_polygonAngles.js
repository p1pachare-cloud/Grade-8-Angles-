import { polygonInteriorSum, regularInterior, regularExterior } from '../engine/angleMath.js';
import { buildNumericOptions } from './distractors.js';
import { pickContext } from '../data/namesAndPlaces.js';

export function genPolygon(rng, difficulty, ctx) {
  const who = pickContext(rng, ctx);
  const mode = difficulty === 1
    ? rng.pick(['quad-missing', 'sum-n'])
    : difficulty === 2
    ? rng.pick(['regular-interior', 'regular-exterior', 'sum-n'])
    : rng.pick(['regular-interior', 'find-n-from-exterior', 'pentagon-missing']);

  if (mode === 'quad-missing') {
    const a = rng.pick([80, 85, 90, 95, 100, 105, 110]);
    const b = rng.pick([70, 75, 80, 85, 90, 100]);
    const c = rng.pick([65, 75, 85, 95, 105]);
    const answer = 360 - a - b - c;

    const options = buildNumericOptions(rng, answer, [
      { value: Math.max(10, 180 - a - b), tag: 'wrong-total' },
      { value: a, tag: 'treated-as-equal' },
    ]);

    const questionText = `${who.name} is surveying a quadrilateral paving stone at the ${who.landmark}. Three angles measure ${a}°, ${b}°, and ${c}°. Find the fourth angle x.`;

    return {
      id: `polygon-quad-${ctx.world}-${ctx.slot}-${a}-${b}-${c}`,
      type: 'polygon',
      world: ctx.world,
      slot: ctx.slot,
      isSpiral: Boolean(ctx.isSpiral),
      difficulty,
      questionText,
      figure: {
        kind: 'quad',
        labels: [
          { at: 'A', text: `${a}°` },
          { at: 'B', text: `${b}°` },
          { at: 'C', text: `${c}°` },
          { at: 'D', text: 'x', unknown: true },
        ],
      },
      figureNotToScale: true,
      answerFormat: 'numeric',
      options,
      correctAnswer: answer,
      unit: '°',
      hint1: 'The interior angles of any quadrilateral always add up to 360°.',
      hint2: `${a} + ${b} + ${c} + x = 360°. Add the 3 known angles and subtract from 360°.`,
      explanation: `Quadrilateral angle sum = 360°. ${a}° + ${b}° + ${c}° = ${a + b + c}°. Therefore x = 360° − ${a + b + c}° = ${answer}°.`,
      context: who,
      signature: `polygon|quad|${a}-${b}-${c}`,
      meta: { a, b, c, answer },
    };
  }

  if (mode === 'regular-interior') {
    const n = difficulty === 2 ? rng.pick([5, 6, 8, 10]) : rng.pick([5, 6, 8, 9, 10, 12]);
    const answer = regularInterior(n);

    const wrongSum = polygonInteriorSum(n);
    const wrongTimesN = Math.round((n * 180) / n);

    const options = buildNumericOptions(rng, answer, [
      { value: wrongSum, tag: 'polygon-n-times-180' },
      { value: regularExterior(n), tag: 'wrong-relation' },
      { value: wrongTimesN, tag: 'polygon-n-times-180' },
    ]);

    const polygonNames = {
      5: 'pentagon',
      6: 'hexagon',
      8: 'octagon',
      9: 'nonagon',
      10: 'decagon',
      12: 'dodecagon',
    };

    const questionText = `${who.name} is crafting a regular ${polygonNames[n] || `${n}-sided polygon`} tile for the ${who.landmark}. Calculate the size of each interior angle.`;

    return {
      id: `polygon-reg-int-${ctx.world}-${ctx.slot}-${n}`,
      type: 'polygon',
      world: ctx.world,
      slot: ctx.slot,
      isSpiral: Boolean(ctx.isSpiral),
      difficulty,
      questionText,
      figure: {
        kind: 'polygon',
        n,
        labels: [{ at: 'angle', text: 'x', unknown: true }],
      },
      figureNotToScale: true,
      answerFormat: 'numeric',
      options,
      correctAnswer: answer,
      unit: '°',
      hint1: 'The interior angle sum of an n-sided polygon is (n − 2) × 180°. Divide the sum by n for a regular polygon.',
      hint2: `For n = ${n}: Sum = (${n} − 2) × 180° = ${wrongSum}°. Each angle = ${wrongSum}° ÷ ${n}.`,
      explanation: `Interior sum = (${n} − 2) × 180° = ${wrongSum}°. Since the polygon is regular, each angle = ${wrongSum}° ÷ ${n} = ${answer}°.`,
      context: who,
      signature: `polygon|reg_int|${n}`,
      meta: { n, answer },
    };
  }

  // default: sum-n
  const n = rng.pick([5, 6, 7, 8, 10]);
  const answer = polygonInteriorSum(n);
  const wrongN180 = n * 180;

  const options = buildNumericOptions(rng, answer, [
    { value: wrongN180, tag: 'polygon-n-times-180' },
    { value: (n - 1) * 180, tag: 'forgot-angle' },
  ]);

  const questionText = `${who.name} is planning a plaza layout with an ${n}-sided polygon at the ${who.landmark}. Find the total sum of all interior angles.`;

  return {
    id: `polygon-sum-${ctx.world}-${ctx.slot}-${n}`,
    type: 'polygon',
    world: ctx.world,
    slot: ctx.slot,
    isSpiral: Boolean(ctx.isSpiral),
    difficulty,
    questionText,
    figure: {
      kind: 'polygon',
      n,
      labels: [{ at: 'sum', text: 'Sum = ?' }],
    },
    figureNotToScale: true,
    answerFormat: 'numeric',
    options,
    correctAnswer: answer,
    unit: '°',
    hint1: 'Formula for interior angle sum: (n − 2) × 180°.',
    hint2: `Substitute n = ${n}: (${n} − 2) × 180° = ${n - 2} × 180°.`,
    explanation: `An ${n}-sided polygon splits into ${n - 2} triangles: (${n} − 2) × 180° = ${n - 2} × 180° = ${answer}°.`,
    context: who,
    signature: `polygon|sum|${n}`,
    meta: { n, answer },
  };
}
