export const IDS = ['T.UL', 'T.UR', 'T.LL', 'T.LR', 'B.UL', 'B.UR', 'B.LL', 'B.LR'];

// With theta = acute (or positive) angle at T.UR:
// UL = 180 - theta, UR = theta, LL = theta, LR = 180 - theta
const QUAD_VALUE = {
  UL: (t) => 180 - t,
  UR: (t) => t,
  LL: (t) => t,
  LR: (t) => 180 - t,
};

export const angleValue = (id, theta) => {
  const [line, quad] = id.split('.');
  return QUAD_VALUE[quad](theta);
};

const OPP = { UL: 'LR', LR: 'UL', UR: 'LL', LL: 'UR' };
const isInterior = (l, q) =>
  (l === 'T' && (q === 'LL' || q === 'LR')) ||
  (l === 'B' && (q === 'UL' || q === 'UR'));

export function relationBetween(a, b) {
  if (a === b) return 'same';
  const [la, qa] = a.split('.');
  const [lb, qb] = b.split('.');

  if (la === lb) {
    return OPP[qa] === qb ? 'vertically-opposite' : 'linear-pair';
  }

  if (qa === qb) return 'corresponding';

  const sameSide = qa[1] === qb[1];
  const ia = isInterior(la, qa);
  const ib = isInterior(lb, qb);

  if (ia && ib) {
    return sameSide ? 'co-interior' : 'alternate-interior';
  }
  if (!ia && !ib) {
    return sameSide ? 'co-exterior' : 'alternate-exterior';
  }

  return 'derived'; // two-step chain e.g. T.UL vs B.UR
}

export const EQUAL_RELATIONS = new Set([
  'same',
  'vertically-opposite',
  'corresponding',
  'alternate-interior',
  'alternate-exterior',
]);

export const SUPPLEMENTARY_RELATIONS = new Set([
  'linear-pair',
  'co-interior',
  'co-exterior',
]);

export function valueRelation(a, b, theta) {
  const x = angleValue(a, theta);
  const y = angleValue(b, theta);
  if (x === y) return 'equal';
  if (x + y === 180) return 'supplementary';
  return 'neither';
}

export const REASON_FOR = {
  'vertically-opposite': 'vertically-opposite',
  'linear-pair': 'straight-line',
  'corresponding': 'corresponding',
  'alternate-interior': 'alternate',
  'alternate-exterior': 'alternate',
  'co-interior': 'co-interior',
  'co-exterior': 'co-interior',
};

export const REASON_TEXT = {
  'vertically-opposite': 'Vertically opposite angles are equal.',
  'straight-line': 'Angles on a straight line add up to 180°.',
  'corresponding': 'Corresponding angles on parallel lines are equal.',
  'alternate': 'Alternate angles on parallel lines are equal.',
  'co-interior': 'Co-interior (allied) angles add up to 180°.',
  'triangle-sum': 'Angles in a triangle add up to 180°.',
  'exterior-angle': 'The exterior angle equals the sum of the two remote interior angles.',
  'around-point': 'Angles around a point add up to 360°.',
  'polygon-interior': 'Interior angle sum is (n − 2) × 180°.',
  'regular-polygon': 'In a regular polygon, all interior angles are equal.',
};
