export const TOTALS = {
  RIGHT: 90,
  LINE: 180,
  TRIANGLE: 180,
  POINT: 360,
  QUAD: 360,
};

export const complement = (a) => 90 - a;
export const supplement = (a) => 180 - a;

export function classifyAngle(deg) {
  const d = Math.round(deg);
  if (d > 0 && d < 90) return 'acute';
  if (d === 90) return 'right';
  if (d > 90 && d < 180) return 'obtuse';
  if (d === 180) return 'straight';
  if (d > 180 && d < 360) return 'reflex';
  if (d === 360) return 'full';
  return 'acute';
}

export const polygonInteriorSum = (n) => (n - 2) * 180;
export const regularInterior = (n) => Math.round(polygonInteriorSum(n) / n);
export const regularExterior = (n) => Math.round(360 / n);

// n values whose regular interior/exterior angle is a whole number of degrees
export const REGULAR_N = [3, 4, 5, 6, 8, 9, 10, 12, 15, 18, 20];

export function exteriorOfTriangle(remoteA, remoteB) {
  return remoteA + remoteB;
}

// Random partition of `total` into `n` positive integer parts, each >= minPart, multiples of `step`
export function randomPartition(rng, total, n, minPart = 15, step = 1) {
  const units = Math.floor(total / step);
  const minU = Math.ceil(minPart / step);
  const free = units - n * minU;
  if (free < 0) {
    // Fallback if bounds are tight
    const base = Math.floor(total / n);
    const res = Array(n).fill(base);
    res[0] += total - base * n;
    return res;
  }
  const cuts = Array.from({ length: n - 1 }, () => rng.int(0, free)).sort((a, b) => a - b);
  const parts = [];
  let prev = 0;
  for (const c of [...cuts, free]) {
    parts.push((c - prev + minU) * step);
    prev = c;
  }
  return parts;
}

export function snapAngle(deg, step = 1) {
  return Math.round(deg / step) * step;
}

// Polar to Cartesian for SVG drawing (angle 0 is +x axis, CCW)
export function polarToCartesian(cx, cy, r, angleInDegrees) {
  const rad = (angleInDegrees * Math.PI) / 180;
  return {
    x: cx + r * Math.cos(rad),
    y: cy - r * Math.sin(rad),
  };
}

// Regular polygon vertices
export function regularPolygonPoints(n, cx = 150, cy = 150, r = 100, rotation = -90) {
  const pts = [];
  const step = 360 / n;
  for (let i = 0; i < n; i++) {
    const angle = rotation + i * step;
    pts.push(polarToCartesian(cx, cy, r, angle));
  }
  return pts;
}

// Arc path helper
export function describeArc(cx, cy, r, startAngle, endAngle) {
  const start = polarToCartesian(cx, cy, r, endAngle);
  const end = polarToCartesian(cx, cy, r, startAngle);
  const diff = (endAngle - startAngle + 360) % 360;
  const largeArcFlag = diff <= 180 ? '0' : '1';
  return [
    'M', start.x, start.y,
    'A', r, r, 0, largeArcFlag, 0, end.x, end.y,
  ].join(' ');
}
