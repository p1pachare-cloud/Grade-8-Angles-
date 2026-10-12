export const REASONS = [
  {
    id: 'straight-line',
    labels: {
      neutral: 'Angles on a straight line add up to 180°',
      us: 'Linear pair angles are supplementary (add to 180°)',
      uk: 'Angles on a straight line sum to 180°',
      sg: 'Adjacent angles on a straight line sum to 180°',
      in: 'Linear pair of angles sum to 180°',
    },
  },
  {
    id: 'vertically-opposite',
    labels: {
      neutral: 'Vertically opposite angles are equal',
      us: 'Vertical angles are congruent',
      uk: 'Vertically opposite angles are equal',
      sg: 'Vertically opposite angles are equal',
      in: 'Vertically opposite angles are equal',
    },
  },
  {
    id: 'around-point',
    labels: {
      neutral: 'Angles around a point add up to 360°',
      us: 'Angles around a point sum to 360°',
      uk: 'Angles at a point add up to 360°',
      sg: 'Angles at a point sum to 360°',
      in: 'Angles around a point add up to 360°',
    },
  },
  {
    id: 'corresponding',
    labels: {
      neutral: 'Corresponding angles on parallel lines are equal',
      us: 'Corresponding angles are congruent (parallel lines)',
      uk: 'Corresponding angles are equal (F-angles)',
      sg: 'Corresponding angles are equal (parallel lines)',
      in: 'Corresponding angles are equal',
    },
  },
  {
    id: 'alternate',
    labels: {
      neutral: 'Alternate angles on parallel lines are equal',
      us: 'Alternate interior angles are congruent',
      uk: 'Alternate angles are equal (Z-angles)',
      sg: 'Alternate angles are equal (parallel lines)',
      in: 'Alternate interior angles are equal',
    },
  },
  {
    id: 'co-interior',
    labels: {
      neutral: 'Co-interior angles on parallel lines add up to 180°',
      us: 'Same-side interior angles are supplementary (180°)',
      uk: 'Co-interior (allied) angles sum to 180° (C-angles)',
      sg: 'Interior angles on same side of transversal sum to 180°',
      in: 'Co-interior angles are supplementary',
    },
  },
  {
    id: 'triangle-sum',
    labels: {
      neutral: 'Angles in a triangle add up to 180°',
      us: 'Triangle angle sum theorem (180°)',
      uk: 'Angle sum of a triangle is 180°',
      sg: 'Angle sum of triangle is 180°',
      in: 'Angle sum property of triangle (180°)',
    },
  },
  {
    id: 'exterior-angle',
    labels: {
      neutral: 'Exterior angle of a triangle equals the sum of the two remote interior angles',
      us: 'Exterior angle theorem',
      uk: 'Exterior angle of triangle = sum of opposite interior angles',
      sg: 'Exterior angle of triangle = sum of interior opposite angles',
      in: 'Exterior angle theorem',
    },
  },
  {
    id: 'quad-sum',
    labels: {
      neutral: 'Angles in a quadrilateral add up to 360°',
      us: 'Quadrilateral angle sum is 360°',
      uk: 'Angle sum of a quadrilateral is 360°',
      sg: 'Angle sum of quadrilateral is 360°',
      in: 'Angle sum property of quadrilateral is 360°',
    },
  },
  {
    id: 'polygon-interior',
    labels: {
      neutral: 'Interior angles of an n-sided polygon add up to (n − 2) × 180°',
      us: 'Polygon interior angle sum theorem',
      uk: 'Interior angle sum of polygon = (n − 2) × 180°',
      sg: 'Interior angle sum of polygon = (n − 2) × 180°',
      in: 'Interior angle sum of polygon is (n − 2) × 180°',
    },
  },
];

export function getReasonLabel(reasonId, glossary = 'neutral') {
  const item = REASONS.find((r) => r.id === reasonId);
  if (!item) return reasonId;
  return item.labels[glossary] || item.labels.neutral;
}

export function buildReasonOptions(rng, correctId, glossary = 'neutral') {
  const correct = REASONS.find((r) => r.id === correctId) || REASONS[0];
  const others = rng.shuffle(REASONS.filter((r) => r.id !== correct.id)).slice(0, 3);
  return rng.shuffle([correct, ...others]).map((r) => ({
    id: r.id,
    label: r.labels[glossary] || r.labels.neutral,
  }));
}
