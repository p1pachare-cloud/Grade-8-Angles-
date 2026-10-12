import { buildNumericOptions } from './distractors.js';
import { pickContext } from '../data/namesAndPlaces.js';

export function genCompSupp(rng, difficulty, ctx) {
  const who = pickContext(rng, ctx);
  const isComp = difficulty === 1 ? rng.chance(0.5) : rng.pick([true, false]);

  let angle;
  if (isComp) {
    angle = difficulty === 1 ? rng.pick([15, 25, 30, 35, 45, 50, 60, 65, 75]) : rng.int(11, 79);
  } else {
    angle = difficulty === 1 ? rng.pick([30, 45, 60, 75, 110, 120, 135, 150]) : rng.int(21, 159);
  }

  const targetSum = isComp ? 90 : 180;
  const answer = targetSum - angle;
  const relationName = isComp ? 'complement' : 'supplement';
  const oppositeSum = isComp ? 180 : 90;
  const wrongOppositeAnswer = oppositeSum - angle;

  const candidates = [
    { value: wrongOppositeAnswer, tag: 'comp-vs-supp' },
    { value: angle, tag: 'treated-as-equal' },
    { value: Math.abs(targetSum - angle + 10), tag: 'wrong-total' },
  ];

  const options = buildNumericOptions(rng, answer, candidates);

  const questionText = `${who.name} is calculating steel frame angles for the ${who.landmark}. An angle measures ${angle}°. What is its ${relationName}?`;

  return {
    id: `comp_supp-${ctx.world}-${ctx.slot}-${angle}-${targetSum}`,
    type: 'comp_supp',
    world: ctx.world,
    slot: ctx.slot,
    isSpiral: Boolean(ctx.isSpiral),
    difficulty,
    questionText,
    figure: {
      kind: 'angle',
      rays: isComp ? [0, angle, 90] : [0, angle, 180],
      labels: [
        { at: 'given', text: `${angle}°` },
        { at: 'unknown', text: 'x', unknown: true },
      ],
    },
    figureNotToScale: true,
    answerFormat: 'mcq',
    options,
    correctAnswer: answer,
    unit: '°',
    hint1: isComp
      ? 'Complementary angles add up to 90°.'
      : 'Supplementary angles add up to 180°.',
    hint2: `${angle} + x = ${targetSum}°. Subtract ${angle} from ${targetSum}.`,
    explanation: `${isComp ? 'Complementary angles sum to 90°' : 'Supplementary angles sum to 180°'}: x = ${targetSum} − ${angle} = ${answer}°.`,
    context: who,
    signature: `comp_supp|${isComp ? 'comp' : 'supp'}|${angle}`,
    meta: { angle, targetSum, answer },
  };
}
