export const MISCONCEPTION_HINTS = {
  'wrong-total': 'Check the total: a full turn at a point is 360°, a straight line is 180°.',
  'comp-vs-supp': 'Complementary angles add to 90°. Supplementary angles add to 180°.',
  'treated-as-equal': 'Co-interior (allied) angles are on the same side and add to 180°, not equal.',
  'wrong-relation': 'Alternate angles are on opposite sides of the transversal and are equal.',
  'forgot-angle': 'Count every angle at the point or on the line. Did you include them all?',
  'polygon-n-times-180': 'A polygon splits into n − 2 triangles, not n triangles: sum is (n − 2) × 180°.',
  'exterior-wrong-sum': 'The exterior angle equals the two remote interior angles added together.',
  'algebra-step-slip': 'Check your algebra steps carefully: simplify the expressions and isolate x.',
  'adjacent-vs-opposite': 'Vertically opposite angles face across the crossing vertex; adjacent angles share a ray.',
  'reflex-misread': 'A reflex angle is strictly greater than 180° and less than 360°.',
};

export const getMisconceptionHint = (tag, fallback = 'Check the geometric angle relationships carefully!') => {
  return MISCONCEPTION_HINTS[tag] || fallback;
};
