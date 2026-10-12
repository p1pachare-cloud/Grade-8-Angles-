import { buildNumericOptions } from './distractors.js';
import { pickContext } from '../data/namesAndPlaces.js';

export function genVertical(rng, difficulty, ctx) {
  const who = pickContext(rng, ctx);
  const givenAngle = difficulty === 1 ? rng.pick([35, 45, 55, 65, 75, 115, 125, 135]) : rng.int(22, 158);

  const askOpposite = rng.chance(0.6);
  const targetRelation = askOpposite ? 'vertically opposite' : 'adjacent on the straight line';
  const answer = askOpposite ? givenAngle : 180 - givenAngle;

  const candidates = [
    { value: askOpposite ? 180 - givenAngle : givenAngle, tag: 'adjacent-vs-opposite' },
    { value: 90 - (givenAngle % 90), tag: 'comp-vs-supp' },
    { value: Math.abs(answer + 10), tag: 'wrong-total' },
  ];

  const options = buildNumericOptions(rng, answer, candidates);

  const questionText = `${who.name} is inspecting crossing support beams at the ${who.landmark}. One angle measures ${givenAngle}°. Find the angle marked x that is ${targetRelation}.`;

  return {
    id: `vertical_adjacent-${ctx.world}-${ctx.slot}-${givenAngle}-${askOpposite ? 'opp' : 'adj'}`,
    type: 'vertical_adjacent',
    world: ctx.world,
    slot: ctx.slot,
    isSpiral: Boolean(ctx.isSpiral),
    difficulty,
    questionText,
    figure: {
      kind: 'cross',
      rays: [0, givenAngle, 180, 180 + givenAngle],
      labels: [
        { at: 'given', text: `${givenAngle}°` },
        { at: askOpposite ? 'opposite' : 'adjacent', text: 'x', unknown: true },
      ],
    },
    figureNotToScale: true,
    answerFormat: 'numeric',
    options,
    correctAnswer: answer,
    unit: '°',
    hint1: askOpposite
      ? 'Vertically opposite angles are formed by two intersecting straight lines and are equal.'
      : 'Adjacent angles forming a straight line sum to 180°.',
    hint2: askOpposite
      ? `Because vertically opposite angles are equal, x = ${givenAngle}°.`
      : `Because adjacent angles on a straight line add to 180°, x = 180 − ${givenAngle}°.`,
    explanation: askOpposite
      ? `Vertically opposite angles are equal: x = ${givenAngle}°.`
      : `Adjacent angles on a straight line add to 180°: x = 180° − ${givenAngle}° = ${answer}°.`,
    context: who,
    signature: `vertical_adjacent|${givenAngle}|${askOpposite ? 'opp' : 'adj'}`,
    meta: { givenAngle, askOpposite, answer },
  };
}
