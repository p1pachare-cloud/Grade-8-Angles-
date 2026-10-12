import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';

export default function HintOverlay({ hint1, hint2, explanation, attemptCount = 0 }) {
  const [expanded, setExpanded] = useState(false);

  // If no attempts or no hints, don't show
  if (attemptCount === 0 && !expanded) {
    return (
      <div style={{ marginTop: 14 }}>
        <button
          className="hint-accordion-trigger"
          onClick={() => setExpanded(true)}
          title="Need a hint?"
        >
          <HelpCircle size={15} color="#ffd54f" />
          <span>Need a hint? (Level 1)</span>
        </button>
      </div>
    );
  }

  return (
    <div className="hint-overlay-card">
      <div
        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}
        onClick={() => setExpanded(!expanded)}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#ffd54f', fontWeight: 800, fontSize: '0.9rem' }}>
          <HelpCircle size={16} />
          <span>Architect Hints ({attemptCount >= 2 ? 'Level 2' : 'Level 1'})</span>
        </div>
        {expanded ? <ChevronUp size={16} color="#ffd54f" /> : <ChevronDown size={16} color="#ffd54f" />}
      </div>

      <div style={{ marginTop: 8, fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
        {/* Hint 1 shown on attempt 1 */}
        {hint1 && (
          <div style={{ marginBottom: 6 }}>
            <strong style={{ color: '#00e5ff' }}>Hint: </strong> {hint1}
          </div>
        )}

        {/* Hint 2 shown on attempt 2 */}
        {attemptCount >= 2 && hint2 && (
          <div style={{ marginTop: 6, borderTop: '1px dashed rgba(255,255,255,0.2)', paddingTop: 6 }}>
            <strong style={{ color: '#ffd54f' }}>Equation: </strong> {hint2}
          </div>
        )}

        {/* Worked solution explanation on attempt 3 */}
        {attemptCount >= 3 && explanation && (
          <div style={{ marginTop: 6, borderTop: '1px dashed rgba(255,255,255,0.2)', paddingTop: 6 }}>
            <strong style={{ color: '#00e676' }}>Full Solution: </strong> {explanation}
          </div>
        )}
      </div>
    </div>
  );
}
