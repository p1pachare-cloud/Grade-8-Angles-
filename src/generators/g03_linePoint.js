import { randomPartition } from '../engine/angleMath.js';
import { buildNumericOptions } from './distractors.js';
import { pickContext } from '../data/namesAndPlaces.js';

export function genLinePoint(rng, difficulty, ctx) {
  const who = pickContext(rng, ctx);
  const total = difficulty === 1 ? rng.pick([180, 360]) : rng.pick([180, 360, 360]);

  const parts = total === 180
    ? (difficulty === 3 ? 3 : 2)
    : (difficulty === 1 ? 3 : difficulty === 2 ? 4 : 5);

  const step = difficulty === 1 ? 5 : 1;
  const angles = randomPartition(rng, total, parts, 20, step);
  const hiddenIdx = rng.int(0, parts - 1);
  const known = angles.filter((_, i) => i !== hiddenIdx);
  const answer = angles[hiddenIdx];

  const shape = total === 180 ? 'on a straight line' : 'around a point';
  const knownText = known.map((k) => `${k}°`).join(', ');

  const wrongTotalAnswer = Math.max(15, (total === 180 ? 360 : 180) - known.reduce((s, k) => s + k, 0));
  const forgotOne = Math.max(15, total - (known.reduce((s, k) => s + k, 0) - Math.max(...known)));

  const options = buildNumericOptions(rng, answer, [
    { value: wrongTotalAnswer, tag: 'wrong-total' },
    { value: forgotOne, tag: 'forgot-angle' },
    { value: Math.abs(90 - (known[0] % 90)), tag: 'comp-vs-supp' },
  ]);

  const questionText = `${who.name} is tuning a ${who.object} at the ${who.landmark}. ${parts} angles ${shape} measure ${knownText} and x. Find x.`;

  return {
    id: `line_point-${ctx.world}-${ctx.slot}-${total}-${angles.join('_')}`,
    type: 'line_point',
    world: ctx.world,
    slot: ctx.slot,
    isSpiral: Boolean(ctx.isSpiral),
    difficulty,
    questionText,
    figure: {
      kind: total === 180 ? 'line' : 'point',
      rays: angles.map((_, i) => (i * 360) / parts),
      labels: angles.map((a, i) => ({
        at: `A${i}`,
        text: i === hiddenIdx ? 'x' : `${a}°`,
        unknown: i === hiddenIdx,
      })),
    },
    figureNotToScale: true,
    answerFormat: 'numeric',
    options,
    correctAnswer: answer,
    unit: '°',
    hint1: total === 180
      ? 'Angles on a straight line always sum to 180°.'
      : 'Angles around a point (full turn) always sum to 360°.',
    hint2: `${known.join(' + ')} + x = ${total}°. Subtract the sum of known angles from ${total}°.`,
    explanation: `Angles ${shape} add up to ${total}°. Sum of known angles: ${known.join(' + ')} = ${
      total - answer
    }°. Therefore x = ${total} − ${total - answer} = ${answer}°.`,
    context: who,
    signature: `line_point|${total}|${angles.join('-')}|${hiddenIdx}`,
    meta: { total, angles, hiddenIdx, answer },
  };
}
