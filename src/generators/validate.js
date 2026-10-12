export function assertValid(q) {
  if (!q) throw new Error('Question is null or undefined');
  if (!q.id) throw new Error('Question missing id');
  if (!q.questionText) throw new Error(`Question ${q.id} missing questionText`);
  if (q.correctAnswer === undefined || q.correctAnswer === null) {
    throw new Error(`Question ${q.id} missing correctAnswer`);
  }

  // If options exist, verify options consistency
  if (Array.isArray(q.options) && q.options.length > 0) {
    const rawValues = q.options.map((o) => (typeof o === 'object' && o !== null ? o.value : o));
    const uniqueValues = new Set(rawValues.map(String));
    if (uniqueValues.size !== rawValues.length) {
      console.warn(`Duplicate options found in ${q.id}:`, rawValues);
    }

    const hasCorrect = rawValues.some(
      (v) => String(v).trim().toLowerCase() === String(q.correctAnswer).trim().toLowerCase()
    );
    if (!hasCorrect && q.answerFormat !== 'numeric' && q.answerFormat !== 'tap_angle') {
      throw new Error(`Correct answer "${q.correctAnswer}" missing in options for ${q.id}`);
    }
  }

  return true;
}

export function passesValidation(q) {
  try {
    assertValid(q);
    return true;
  } catch (e) {
    return false;
  }
}
