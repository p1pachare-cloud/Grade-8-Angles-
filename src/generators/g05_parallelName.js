import { IDS, relationBetween } from '../engine/transversal.js';
import { pickContext } from '../data/namesAndPlaces.js';

export function genParallelName(rng, difficulty, ctx) {
  const who = pickContext(rng, ctx);
  const a = rng.pick(IDS);
  // Pick a from T or B, and pick b so it forms one of the standard relationships
  const [la, qa] = a.split('.');
  const otherLine = la === 'T' ? 'B' : 'T';

  // Available relation types for this question:
  // 1. Corresponding (same quad on other line)
  // 2. Alternate (opposite interior/exterior on other line)
  // 3. Co-interior (same-side interior/exterior on other line)
  // 4. Vertically opposite (opposite quad on same line)
  const relKind = difficulty === 1
    ? 'corresponding'
    : rng.pick(['corresponding', 'alternate', 'co-interior', 'vertically-opposite']);

  const OPP = { UL: 'LR', LR: 'UL', UR: 'LL', LL: 'UR' };
  let b;

  if (relKind === 'corresponding') {
    b = otherLine + '.' + qa;
  } else if (relKind === 'alternate') {
    // alternate interior: T.LL <-> B.UR, T.LR <-> B.UL
    // alternate exterior: T.UL <-> B.LR, T.UR <-> B.LL
    b = otherLine + '.' + OPP[qa];
  } else if (relKind === 'co-interior') {
    // same side: T.LL <-> B.UL, T.LR <-> B.UR
    const sameSideQuad = qa.startsWith('U') ? 'L' + qa[1] : 'U' + qa[1];
    b = otherLine + '.' + sameSideQuad;
  } else {
    // vertically opposite: same line, opposite quad
    b = la + '.' + OPP[qa];
  }

  const rawRel = relationBetween(a, b);
  const relationNames = {
    'corresponding': 'Corresponding angles',
    'alternate-interior': 'Alternate angles',
    'alternate-exterior': 'Alternate angles',
    'co-interior': 'Co-interior (allied) angles',
    'co-exterior': 'Co-interior (allied) angles',
    'vertically-opposite': 'Vertically opposite angles',
  };

  const correctAnswer = relationNames[rawRel] || 'Corresponding angles';

  const allChoices = [
    'Corresponding angles',
    'Alternate angles',
    'Co-interior (allied) angles',
    'Vertically opposite angles',
  ];

  const options = allChoices.map((c) => ({ value: c }));

  const questionText = `${who.name} is studying two parallel tracks cut by a transversal road at the ${who.landmark}. What is the geometric relationship between angle ${a} and angle ${b}?`;

  return {
    id: `parallel_name-${ctx.world}-${ctx.slot}-${a}-${b}`,
    type: 'parallel_name',
    world: ctx.world,
    slot: ctx.slot,
    isSpiral: Boolean(ctx.isSpiral),
    difficulty,
    questionText,
    figure: {
      kind: 'transversal',
      parallel: true,
      labels: [
        { at: a, text: 'Angle 1' },
        { at: b, text: 'Angle 2' },
      ],
      rotation: rng.int(-10, 10),
    },
    figureNotToScale: true,
    answerFormat: 'mcq',
    options,
    correctAnswer,
    unit: '',
    hint1: 'Look at the positions: are they in matching spots (F-shape), on opposite sides inside (Z-shape), or on the same side inside (C-shape)?',
    hint2: rawRel.includes('corresponding')
      ? 'They are in matching corners on both parallel lines.'
      : rawRel.includes('alternate')
      ? 'They are on alternating sides of the transversal line.'
      : rawRel.includes('co-interior')
      ? 'They are inside the parallel lines on the same side of the transversal.'
      : 'Notice if they cross at the same vertex or share a straight line.',
    explanation: `Angle ${a} and angle ${b} are ${correctAnswer.toLowerCase()}.`,
    context: who,
    signature: `parallel_name|${a}|${b}`,
    meta: { a, b, rawRel, correctAnswer },
  };
}
