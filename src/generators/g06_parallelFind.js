import { IDS, angleValue, relationBetween, EQUAL_RELATIONS, REASON_FOR, REASON_TEXT } from '../engine/transversal.js';
import { buildNumericOptions } from './distractors.js';
import { buildReasonOptions } from '../data/reasons.js';
import { pickContext } from '../data/namesAndPlaces.js';

export function genParallelFind(rng, difficulty, ctx) {
  const who = pickContext(rng, ctx);
  const theta = difficulty === 1 ? rng.pick([40, 50, 60, 70, 110, 120, 130]) : rng.int(25, 155);

  const given = rng.pick(IDS);
  let target = rng.pick(IDS.filter((i) => i !== given));

  // In easy/medium keep to single-step relations
  const maxTries = 30;
  for (let t = 0; t < maxTries && difficulty < 3 && relationBetween(given, target) === 'derived'; t++) {
    target = rng.pick(IDS.filter((i) => i !== given));
  }

  const rel = relationBetween(given, target);
  const gv = angleValue(given, theta);
  const answer = angleValue(target, theta);
  const reasonId = REASON_FOR[rel] || 'corresponding';

  const options = buildNumericOptions(rng, answer, [
    { value: gv, tag: 'treated-as-equal' },
    { value: Math.abs(180 - answer), tag: 'wrong-relation' },
    { value: Math.abs(90 - (gv % 90)), tag: 'comp-vs-supp' },
  ]);

  const questionText = `${who.name} is aligning two parallel beams at the ${who.landmark}. Angle ${given} measures ${gv}°. Calculate the angle marked x.`;

  return {
    id: `parallel_find-${ctx.world}-${ctx.slot}-${theta}-${given}-${target}`,
    type: 'parallel_find',
    world: ctx.world,
    slot: ctx.slot,
    isSpiral: Boolean(ctx.isSpiral),
    difficulty,
    questionText,
    figure: {
      kind: 'transversal',
      parallel: true,
      labels: [
        { at: given, text: `${gv}°` },
        { at: target, text: 'x', unknown: true },
      ],
      rotation: rng.int(-15, 15),
    },
    figureNotToScale: true,
    answerFormat: 'numeric',
    options,
    correctAnswer: answer,
    unit: '°',
    reason: {
      prompt: 'Which geometric rule justifies this angle?',
      options: buildReasonOptions(rng, reasonId, ctx.glossary || 'neutral'),
      correct: reasonId,
    },
    hint1: 'Determine first: are the two angles equal, or do they add to 180°?',
    hint2: EQUAL_RELATIONS.has(rel)
      ? `These are ${rel.replace('-', ' ')} angles on parallel lines, so they are equal.`
      : `These are co-interior or adjacent angles on parallel lines, so they add to 180°: x = 180 − ${gv}.`,
    explanation: `${REASON_TEXT[reasonId] || 'Using parallel line properties.'} Therefore x = ${answer}°.`,
    context: who,
    signature: `parallel_find|${theta}|${given}|${target}`,
    meta: { theta, given, target, rel, answer },
  };
}
