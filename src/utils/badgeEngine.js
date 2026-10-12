export const BADGES = [
  {
    id: 'angle_scout',
    label: '🏅 Angle Scout',
    description: 'Complete the Wonder and Story phases of the global mission.',
    condition: (s) => s.phaseComplete?.wonder && s.phaseComplete?.story,
  },
  {
    id: 'lab_technician',
    label: '🔬 Lab Technician',
    description: 'Complete all 4 Engineering Simulation stations.',
    condition: (s) => Array.isArray(s.simStationsComplete) && s.simStationsComplete.every(Boolean),
  },
  {
    id: 'parallel_pro',
    label: '🧭 Parallel Pro',
    description: 'Score 8 or more out of 10 in either Tokyo or Taj Mahal parallel lines worlds.',
    condition: (s) => (s.worldScores?.[4] ?? 0) >= 8 || (s.worldScores?.[5] ?? 0) >= 8,
  },
  {
    id: 'angle_champion',
    label: '🥇 Angle Champion',
    description: 'Achieve 80% or higher overall accuracy across the 100 practice questions.',
    condition: (s) => (s.worldScores || []).reduce((t, x) => t + (x || 0), 0) >= 80,
  },
  {
    id: 'perfect_blueprint',
    label: '💎 Perfect Blueprint',
    description: 'Score a perfect 10/10 in any landmark challenge world.',
    condition: (s) => (s.worldScores || []).some((x) => x === 10),
  },
  {
    id: 'streak_star',
    label: '🔥 Streak Star',
    description: 'Reach a continuous streak of 10 consecutive correct answers.',
    condition: (s) => (s.maxStreak ?? 0) >= 10,
  },
  {
    id: 'sharp_eye',
    label: '🎯 Sharp Eye',
    description: 'Complete Station B Transversal Explorer with zero errors.',
    condition: (s) => s.stationBPerfect === true,
  },
  {
    id: 'reasoning_master',
    label: '🧠 Reasoning Master',
    description: 'Provide 10 correct geometric justifications in reason prompts.',
    condition: (s) => (s.reasonsCorrect ?? 0) >= 10,
  },
  {
    id: 'global_architect',
    label: '🌍 Global Architect',
    description: 'Complete all phases of the Grade 8 Angles course.',
    condition: (s) => s.phaseComplete && Object.values(s.phaseComplete).every(Boolean),
  },
];

export function checkBadges(state) {
  const current = state.badges || [];
  return BADGES.filter((b) => !current.includes(b.id) && b.condition(state)).map((b) => b.id);
}
