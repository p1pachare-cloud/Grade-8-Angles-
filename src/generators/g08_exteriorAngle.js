import { buildNumericOptions } from './distractors.js';
import { pickContext } from '../data/namesAndPlaces.js';

export function genExterior(rng, difficulty, ctx) {
  const who = pickContext(rng, ctx);
  const a = difficulty === 1 ? rng.pick([30, 40, 50, 60]) : rng.int(25, 75);
  const b = difficulty === 1 ? rng.pick([35, 45, 55, 65]) : rng.int(25, 80);
  const exterior = a + b;

  const askExterior = difficulty === 1 || rng.chance(0.5);
  const answer = askExterior ? exterior : b;

  const candidates = [
    { value: Math.abs(180 - exterior), tag: 'wrong-relation' },
    { value: a + b + 180 - (a + b), tag: 'exterior-wrong-sum' },
    { value: Math.max(10, exterior - 20), tag: 'wrong-total' },
  ];

  const options = buildNumericOptions(rng, answer, candidates);

  const questionText = askExterior
    ? `${who.name} is extending a triangle roof strut at the ${who.landmark}. The two opposite interior angles measure ${a}° and ${b}°. Find the exterior angle x.`
    : `${who.name} measures the exterior angle of a triangle at the ${who.landmark} as ${exterior}°. One remote interior angle is ${a}°. Find the other remote interior angle x.`;

  return {
    id: `exterior_angle-${ctx.world}-${ctx.slot}-${a}-${b}-${askExterior ? 'ext' : 'int'}`,
    type: 'exterior_angle',
    world: ctx.world,
    slot: ctx.slot,
    isSpiral: Boolean(ctx.isSpiral),
    difficulty,
    questionText,
    figure: {
      kind: 'triangle',
      extend: 'base',
      labels: [
        { at: 'remote1', text: `${a}°` },
        { at: 'remote2', text: askExterior ? `${b}°` : 'x', unknown: !askExterior },
        { at: 'exterior', text: askExterior ? 'x' : `${exterior}°`, unknown: askExterior },
      ],
    },
    figureNotToScale: true,
    answerFormat: 'numeric',
    options,
    correctAnswer: answer,
    unit: '°',
    hint1: 'The exterior angle of a triangle is equal to the sum of the two remote (opposite) interior angles.',
    hint2: askExterior
      ? `x = ${a} + ${b}°.`
      : `${a} + x = ${exterior}°. Subtract ${a} from ${exterior}.`,
    explanation: askExterior
      ? `Exterior angle = sum of remote interior angles: x = ${a}° + ${b}° = ${answer}°.`
      : `Exterior angle theorem: ${a}° + x = ${exterior}°, so x = ${exterior}° − ${a}° = ${answer}°.`,
    context: who,
    signature: `exterior_angle|${a}|${b}|${askExterior ? 'ext' : 'int'}`,
    meta: { a, b, exterior, askExterior, answer },
  };
}
