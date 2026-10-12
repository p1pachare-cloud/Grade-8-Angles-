import { buildNumericOptions } from './distractors.js';
import { buildReasonOptions } from '../data/reasons.js';
import { pickContext } from '../data/namesAndPlaces.js';

export function genAlgebra(rng, difficulty, ctx) {
  const who = pickContext(rng, ctx);

  const scenario = difficulty === 1
    ? 'straight_line'
    : rng.pick(['straight_line', 'vertical_opposite', 'triangle']);

  if (scenario === 'straight_line') {
    // (a*x + c1) + (b*x + c2) = 180
    // Choose integer x first!
    const x = rng.int(10, 35);
    const a = rng.pick([2, 3]);
    const b = rng.pick([1, 2]);
    const totalXCoeff = a + b;
    // We need c1 + c2 = 180 - totalXCoeff * x
    const remainder = 180 - totalXCoeff * x;
    const c1 = rng.int(0, 30);
    const c2 = remainder - c1;

    const angle1 = a * x + c1;
    const angle2 = b * x + c2;

    const expr1 = c1 === 0 ? `${a}x` : c1 > 0 ? `${a}x + ${c1}` : `${a}x − ${Math.abs(c1)}`;
    const expr2 = c2 === 0 ? `${b}x` : c2 > 0 ? `${b}x + ${c2}` : `${b}x − ${Math.abs(c2)}`;

    const answer = x;
    const options = buildNumericOptions(rng, answer, [
      { value: answer + 5, tag: 'algebra-step-slip' },
      { value: Math.max(5, answer - 5), tag: 'algebra-step-slip' },
      { value: angle1, tag: 'wrong-relation' },
    ]);

    const questionText = `${who.name} models two adjacent angles on a straight line at the ${who.landmark}. The angles are expressed as (${expr1})° and (${expr2})°. Find the value of x.`;

    return {
      id: `algebra-line-${ctx.world}-${ctx.slot}-${x}-${a}-${b}`,
      type: 'algebra',
      world: ctx.world,
      slot: ctx.slot,
      isSpiral: Boolean(ctx.isSpiral),
      difficulty,
      questionText,
      figure: {
        kind: 'line',
        labels: [
          { at: 'angle1', text: `(${expr1})°` },
          { at: 'angle2', text: `(${expr2})°` },
        ],
      },
      figureNotToScale: true,
      answerFormat: 'numeric',
      options,
      correctAnswer: answer,
      unit: '',
      reason: {
        prompt: 'Which geometric rule allows you to form this equation?',
        options: buildReasonOptions(rng, 'straight-line', ctx.glossary || 'neutral'),
        correct: 'straight-line',
      },
      hint1: 'Angles on a straight line add up to 180°: (${expr1}) + (${expr2}) = 180.',
      hint2: `Combine like terms: (${a} + ${b})x + (${c1 + c2}) = 180 → ${totalXCoeff}x = ${180 - (c1 + c2)}.`,
      explanation: `Angles on a straight line sum to 180°: (${expr1}) + (${expr2}) = 180. Combine terms: ${totalXCoeff}x + ${c1 + c2} = 180 → ${totalXCoeff}x = ${180 - (c1 + c2)} → x = ${answer}.`,
      context: who,
      signature: `algebra|line|${x}|${a}-${b}`,
      meta: { x, a, b, c1, c2, answer },
    };
  }

  if (scenario === 'vertical_opposite') {
    // (a*x + c1) = (b*x + c2)
    const x = rng.int(12, 35);
    const b = rng.pick([1, 2]);
    const a = b + rng.pick([1, 2]);
    // a*x + c1 = b*x + c2 -> (a-b)*x = c2 - c1
    const diff = (a - b) * x;
    const c1 = rng.int(5, 20);
    const c2 = c1 + diff;

    const expr1 = `${a}x + ${c1}`;
    const expr2 = `${b}x + ${c2}`;

    const answer = x;
    const options = buildNumericOptions(rng, answer, [
      { value: answer + 4, tag: 'algebra-step-slip' },
      { value: Math.max(5, answer - 4), tag: 'algebra-step-slip' },
    ]);

    const questionText = `${who.name} finds two vertically opposite angles at the ${who.landmark} labelled (${expr1})° and (${expr2})°. Find the value of x.`;

    return {
      id: `algebra-vert-${ctx.world}-${ctx.slot}-${x}-${a}-${b}`,
      type: 'algebra',
      world: ctx.world,
      slot: ctx.slot,
      isSpiral: Boolean(ctx.isSpiral),
      difficulty,
      questionText,
      figure: {
        kind: 'cross',
        labels: [
          { at: 'angle1', text: `(${expr1})°` },
          { at: 'angle2', text: `(${expr2})°` },
        ],
      },
      figureNotToScale: true,
      answerFormat: 'numeric',
      options,
      correctAnswer: answer,
      unit: '',
      reason: {
        prompt: 'Which geometric rule connects these two angles?',
        options: buildReasonOptions(rng, 'vertically-opposite', ctx.glossary || 'neutral'),
        correct: 'vertically-opposite',
      },
      hint1: 'Vertically opposite angles are equal: set the two expressions equal to each other.',
      hint2: `${expr1} = ${expr2} → subtract ${b}x and ${c1} from both sides.`,
      explanation: `Vertically opposite angles are equal: ${expr1} = ${expr2}. Subtract ${b}x from both sides: ${a - b}x = ${c2 - c1} → x = ${answer}.`,
      context: who,
      signature: `algebra|vert|${x}|${a}-${b}`,
      meta: { x, a, b, c1, c2, answer },
    };
  }

  // scenario === 'triangle'
  const x = rng.int(10, 25);
  const a = rng.pick([2, 3]);
  const b = rng.pick([2, 3]);
  const c = rng.pick([1, 2]);
  const sumCoeff = a + b + c;
  const rem = 180 - sumCoeff * x;
  const c1 = rng.int(0, 15);
  const c2 = rem - c1;

  const expr1 = c1 > 0 ? `${a}x + ${c1}` : `${a}x`;
  const expr2 = c2 > 0 ? `${b}x + ${c2}` : `${b}x`;
  const expr3 = `${c}x`;

  const answer = x;
  const options = buildNumericOptions(rng, answer, [
    { value: answer + 5, tag: 'algebra-step-slip' },
    { value: Math.max(5, answer - 5), tag: 'algebra-step-slip' },
  ]);

  const questionText = `${who.name} models the three angles of a triangle at the ${who.landmark} as (${expr1})°, (${expr2})°, and (${expr3})°. Calculate x.`;

  return {
    id: `algebra-tri-${ctx.world}-${ctx.slot}-${x}`,
    type: 'algebra',
    world: ctx.world,
    slot: ctx.slot,
    isSpiral: Boolean(ctx.isSpiral),
    difficulty,
    questionText,
    figure: {
      kind: 'triangle',
      labels: [
        { at: 'A', text: `(${expr1})°` },
        { at: 'B', text: `(${expr2})°` },
        { at: 'C', text: `(${expr3})°` },
      ],
    },
    figureNotToScale: true,
    answerFormat: 'numeric',
    options,
    correctAnswer: answer,
    unit: '',
    reason: {
      prompt: 'Which theorem allows you to set up this equation?',
      options: buildReasonOptions(rng, 'triangle-sum', ctx.glossary || 'neutral'),
      correct: 'triangle-sum',
    },
    hint1: 'The three angles of a triangle add up to 180°.',
    hint2: `(${expr1}) + (${expr2}) + (${expr3}) = 180.`,
    explanation: `Triangle angle sum is 180°: (${expr1}) + (${expr2}) + (${expr3}) = 180 → ${sumCoeff}x + ${c1 + c2} = 180 → x = ${answer}.`,
    context: who,
    signature: `algebra|tri|${x}`,
    meta: { x, answer },
  };
}
