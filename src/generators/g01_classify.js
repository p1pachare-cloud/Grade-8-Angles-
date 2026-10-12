import { classifyAngle } from '../engine/angleMath.js';
import { pickContext } from '../data/namesAndPlaces.js';

export function genClassify(rng, difficulty, ctx) {
  const who = pickContext(rng, ctx);

  let angle;
  if (difficulty === 1) {
    // Multiples of 15°
    angle = rng.pick([30, 45, 60, 75, 90, 105, 120, 135, 150, 180, 210, 240, 270, 300]);
  } else if (difficulty === 2) {
    // Any whole number degree
    angle = rng.int(15, 345);
    if (angle === 90 || angle === 180) angle += 5; // keep classification distinct
  } else {
    // Boundary edge cases: 89, 91, 179, 181, 269, 271
    angle = rng.pick([89, 91, 179, 181, 269, 271, 359]);
  }

  const category = classifyAngle(angle);

  const mode = rng.pick(['classify_from_degrees', 'classify_from_degrees', 'name_degrees']);
  const allTypes = ['Acute', 'Right', 'Obtuse', 'Straight', 'Reflex'];

  const categoryCapitalized = category.charAt(0).toUpperCase() + category.slice(1);

  if (mode === 'name_degrees' && difficulty <= 2) {
    const questionText = `${who.name} measured an angle of ${angle}° at the ${who.landmark}. Which classification best describes this angle?`;
    const options = allTypes.map((t) => ({ value: t }));

    return {
      id: `classify-${ctx.world}-${ctx.slot}-${angle}`,
      type: 'classify',
      world: ctx.world,
      slot: ctx.slot,
      isSpiral: Boolean(ctx.isSpiral),
      difficulty,
      questionText,
      figure: {
        kind: 'angle',
        rays: [0, angle],
        labels: [{ at: 'angle', text: `${angle}°` }],
      },
      figureNotToScale: false,
      answerFormat: 'mcq',
      options,
      correctAnswer: categoryCapitalized,
      unit: '',
      hint1: 'Remember: Acute (<90°), Right (90°), Obtuse (90°–180°), Straight (180°), Reflex (>180°).',
      hint2: `${angle}° is ${angle < 90 ? 'less than 90°' : angle === 90 ? 'exactly 90°' : angle < 180 ? 'between 90° and 180°' : angle === 180 ? 'exactly 180°' : 'greater than 180°'}.`,
      explanation: `An angle of ${angle}° is ${category} because it is ${
        category === 'acute'
          ? 'between 0° and 90°'
          : category === 'right'
          ? 'exactly 90°'
          : category === 'obtuse'
          ? 'between 90° and 180°'
          : category === 'straight'
          ? 'exactly 180°'
          : 'between 180° and 360°'
      }.`,
      context: who,
      signature: `classify|${angle}|${category}`,
      meta: { angle, category },
    };
  }

  const questionText = `${who.name} is surveying a joint at the ${who.landmark}. The angle measures ${angle}°. What type of angle is it?`;
  const options = allTypes.map((t) => ({ value: t }));

  return {
    id: `classify-${ctx.world}-${ctx.slot}-${angle}`,
    type: 'classify',
    world: ctx.world,
    slot: ctx.slot,
    isSpiral: Boolean(ctx.isSpiral),
    difficulty,
    questionText,
    figure: {
      kind: 'angle',
      rays: [0, angle],
      labels: [{ at: 'angle', text: `${angle}°` }],
    },
    figureNotToScale: false,
    answerFormat: 'mcq',
    options,
    correctAnswer: categoryCapitalized,
    unit: '',
    hint1: 'Acute is <90°, right is 90°, obtuse is 90°–180°, reflex is >180°.',
    hint2: `Compare ${angle}° with 90° and 180°.`,
    explanation: `${angle}° is classified as ${category} because it is ${
      category === 'acute'
        ? 'less than 90°'
        : category === 'right'
        ? 'exactly 90°'
        : category === 'obtuse'
        ? 'greater than 90° but less than 180°'
        : category === 'straight'
        ? 'exactly 180°'
        : 'greater than 180°'
    }.`,
    context: who,
    signature: `classify|${angle}|${category}`,
    meta: { angle, category },
  };
}
