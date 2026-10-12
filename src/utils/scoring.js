export function calcXP(attemptNumber = 1, hintsUsed = 0, streak = 0) {
  const base = attemptNumber === 1 ? 10 : hintsUsed > 0 ? 5 : 7;
  const streakBonus = streak >= 5 ? 5 : 0;
  return base + streakBonus;
}

export const REASON_BONUS = 3;

export function calcStars(correct) {
  if (correct === null || correct === undefined) return 0;
  if (correct >= 9) return 3;
  if (correct >= 7) return 2;
  if (correct >= 6) return 1; // 1-star minimum gate to unlock next world
  return 0;
}

export const canUnlockWorld = (score) => score !== null && score !== undefined && score >= 6;

export const calcTotalStars = (scores = []) =>
  scores.reduce((sum, s) => sum + (s === null ? 0 : calcStars(s)), 0);

export function getArchitectTitle(xp) {
  if (xp >= 900) return 'Legendary Grand Architect 👑';
  if (xp >= 700) return 'Master Structural Engineer 🏛️';
  if (xp >= 500) return 'Senior Geometric Planner 📐';
  if (xp >= 300) return 'Certified Angle Specialist 🧭';
  if (xp >= 150) return 'Apprentice Blueprint Builder ✏️';
  return 'Junior Angle Scout 🔭';
}
