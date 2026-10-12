import { buildNumericOptions } from './distractors.js';
import { pickContext } from '../data/namesAndPlaces.js';

export function genTriangle(rng, difficulty, ctx) {
  const who = pickContext(rng, ctx);
  let a, b, c;
  let kind = 'scalene';

  if (difficulty === 1) {
    // Scalene with round numbers
    a = rng.pick([40, 45, 50, 55, 60, 65, 70]);
    b = rng.pick([30, 35, 40, 45, 50, 55]);
    c = 180 - a - b;
  } else if (difficulty === 2) {
    // Isosceles
    kind = 'isosceles';
    const base = rng.int(35, 75);
    a = base;
    b = base;
    c = 180 - 2 * base;
  } else {
    // Scalene with arbitrary integers or right triangle
    a = rng.int(28, 84);
    b = rng.int(25, 180 - a - 25);
    c = 180 - a - b;
  }

  const answer = c;
  const wrongAnswer1 = Math.max(10, 360 - a - b);
  const wrongAnswer2 = Math.max(10, 90 - (a + b) % 90);

  const candidates = [
    { value: wrongAnswer1, tag: 'wrong-total' },
    { value: wrongAnswer2, tag: 'comp-vs-supp' },
    { value: a, tag: 'treated-as-equal' },
  ];

  const options = buildNumericOptions(rng, answer, candidates);

  const questionText = `${who.name} is constructing a stabilizing triangular truss for the ${who.landmark}. Two angles of the triangle measure ${a}° and ${b}°. Find the third angle x.`;

  return {
    id: `triangle_sum-${ctx.world}-${ctx.slot}-${a}-${b}-${c}`,
    type: 'triangle_sum',
    world: ctx.world,
    slot: ctx.slot,
    isSpiral: Boolean(ctx.isSpiral),
    difficulty,
    questionText,
    figure: {
      kind: 'triangle',
      labels: [
        { at: 'A', text: `${a}°` },
        { at: 'B', text: `${b}°` },
        { at: 'C', text: 'x', unknown: true },
      ],
    },
    figureNotToScale: true,
    answerFormat: 'numeric',
    options,
    correctAnswer: answer,
    unit: '°',
    hint1: 'The three interior angles of any triangle always add up to 180°.',
    hint2: `${a} + ${b} + x = 180°. Add the two known angles, then subtract from 180°.`,
    explanation: `The interior angles of a triangle sum to 180°. ${a}° + ${b}° = ${a + b}°. Thus x = 180° − ${a + b}° = ${answer}°.`,
    context: who,
    signature: `triangle_sum|${a}|${b}|${c}`,
    meta: { a, b, c, kind, answer },
  };
}
