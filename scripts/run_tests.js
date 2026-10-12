import {
  classifyAngle,
  complement,
  supplement,
  polygonInteriorSum,
  regularInterior,
  regularExterior,
} from '../src/engine/angleMath.js';

import {
  IDS,
  angleValue,
  relationBetween,
  valueRelation,
} from '../src/engine/transversal.js';

import { toSpeech } from '../src/engine/speakify.js';
import { buildSessionQuestions, buildWorldQuestions } from '../src/generators/index.js';
import { assertValid } from '../src/generators/validate.js';

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    passed++;
  } else {
    failed++;
    console.error(`❌ FAILED: ${message}`);
  }
}

console.log('🧪 Starting Global Angle Architects Unit & Generator Tests...\n');

// 1. Math formulas
assert(classifyAngle(45) === 'acute', 'classifyAngle(45) === acute');
assert(classifyAngle(90) === 'right', 'classifyAngle(90) === right');
assert(classifyAngle(135) === 'obtuse', 'classifyAngle(135) === obtuse');
assert(classifyAngle(180) === 'straight', 'classifyAngle(180) === straight');
assert(classifyAngle(270) === 'reflex', 'classifyAngle(270) === reflex');

assert(complement(30) === 60, 'complement(30) === 60');
assert(supplement(70) === 110, 'supplement(70) === 110');
assert(polygonInteriorSum(3) === 180, 'polygonInteriorSum(3) === 180');
assert(polygonInteriorSum(4) === 360, 'polygonInteriorSum(4) === 360');
assert(polygonInteriorSum(5) === 540, 'polygonInteriorSum(5) === 540');
assert(polygonInteriorSum(6) === 720, 'polygonInteriorSum(6) === 720');
assert(regularInterior(6) === 120, 'regularInterior(6) === 120');
assert(regularExterior(6) === 60, 'regularExterior(6) === 60');

// 2. Transversal relations
assert(relationBetween('T.UR', 'T.LL') === 'vertically-opposite', 'T.UR vs T.LL is vertically opposite');
assert(relationBetween('T.UR', 'B.UR') === 'corresponding', 'T.UR vs B.UR is corresponding');
assert(relationBetween('T.LL', 'B.UR') === 'alternate-interior', 'T.LL vs B.UR is alternate-interior');
assert(relationBetween('T.LL', 'B.UL') === 'co-interior', 'T.LL vs B.UL is co-interior');

const theta = 65;
assert(valueRelation('T.UR', 'T.LL', theta) === 'equal', 'T.UR equals T.LL in degree value');
assert(valueRelation('T.UR', 'B.UR', theta) === 'equal', 'T.UR equals B.UR in degree value');
assert(valueRelation('T.UR', 'T.UL', theta) === 'supplementary', 'T.UR and T.UL add to 180°');
assert(valueRelation('T.LL', 'B.UL', theta) === 'supplementary', 'T.LL and B.UL add to 180° (co-interior)');

// 3. toSpeech conversion
const spoken1 = toSpeech('Angle ∠ABC measures 110°');
assert(spoken1.includes('angle A B C') && spoken1.includes('one hundred and ten degrees'), `toSpeech: ${spoken1}`);

const spoken2 = toSpeech('(2x + 10) = 180');
assert(spoken2.includes('two x plus ten') && spoken2.includes('equals') && spoken2.includes('one hundred and eighty'), `toSpeech equation: ${spoken2}`);

// 4. Session builder test: Generates 100 questions across 10 worlds
console.log('Generating full 100-question session...');
const session = buildSessionQuestions(999888);
assert(session.length === 100, `Session contains 100 questions (got ${session.length})`);

// 5. Check all 100 questions with independent validator
let validCount = 0;
session.forEach((q) => {
  try {
    assertValid(q);
    validCount++;
  } catch (err) {
    console.error(`Invalid question ${q.id}:`, err.message);
  }
});
assert(validCount === 100, `All 100 generated questions pass assertValid (passed: ${validCount}/100)`);

// 6. Test Seed Determinism (same seed must yield identical questions)
const sessionClone = buildSessionQuestions(999888);
const isIdentical = session.every((q, i) => q.id === sessionClone[i].id && q.correctAnswer === sessionClone[i].correctAnswer);
assert(isIdentical, 'Same seed produces identical questions deterministically');

console.log(`\n========================================`);
console.log(`✅ Tests Completed! Passed: ${passed}, Failed: ${failed}`);
console.log(`========================================\n`);

if (failed > 0) {
  process.exit(1);
}
