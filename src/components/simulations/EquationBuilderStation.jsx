import React, { useState } from 'react';
import { Check, Sparkles, Plus, Trash2 } from 'lucide-react';
import DegreePad from '../shared/DegreePad';
import { playChime, playBuzz, playClick } from '../../utils/audio';

export default function EquationBuilderStation({ onComplete, audioEnabled }) {
  const [step, setStep] = useState(1); // 1 = choose rule, 2 = build equation, 3 = solve for x
  const [selectedRule, setSelectedRule] = useState(null);
  const [trayChips, setTrayChips] = useState([]);
  const [solvedX, setSolvedX] = useState('');
  const [feedback, setFeedback] = useState(null);

  // Scenario: Two angles on straight line: (3x + 15)° and (2x + 25)°
  // Sum = 180° -> 5x + 40 = 180 -> 5x = 140 -> x = 28
  const chipsBank = ['(3x + 15)', '+', '(2x + 25)', '=', '180', '360', '90', '−'];

  const handleAddChip = (chip) => {
    playClick();
    if (trayChips.length < 5) {
      setTrayChips([...trayChips, chip]);
    }
  };

  const handleRemoveChip = (index) => {
    playClick();
    setTrayChips(trayChips.filter((_, i) => i !== index));
  };

  const handleClearTray = () => {
    playClick();
    setTrayChips([]);
  };

  const checkRule = () => {
    if (selectedRule === 'straight') {
      playChime();
      setStep(2);
      setFeedback(null);
    } else {
      playBuzz();
      setFeedback('These two angles lie on a straight line. Which rule connects them?');
    }
  };

  const checkEquation = () => {
    // Valid: (3x + 15) + (2x + 25) = 180 or reversed
    if (
      (trayChips[0] === '(3x + 15)' && trayChips[1] === '+' && trayChips[2] === '(2x + 25)' && trayChips[3] === '=' && trayChips[4] === '180') ||
      (trayChips[0] === '(2x + 25)' && trayChips[1] === '+' && trayChips[2] === '(3x + 15)' && trayChips[3] === '=' && trayChips[4] === '180')
    ) {
      playChime();
      setStep(3);
      setFeedback(null);
    } else {
      playBuzz();
      setFeedback('Equation should add the two angle expressions and equate to 180 (e.g. (3x + 15) + (2x + 25) = 180).');
    }
  };

  const checkSolve = (val) => {
    if (String(val).trim() === '28') {
      playChime();
      setFeedback('Station D Mastered! 🎉 All simulation stations complete! Advancing to Practice Phase...');
      setTimeout(() => {
        onComplete();
      }, 900);
    } else {
      playBuzz();
      setFeedback('Solve 5x + 40 = 180 → 5x = 140 → x = 140 ÷ 5 = 28.');
    }
  };

  return (
    <div className="station-container glass-card">
      <div className="station-header">
        <div>
          <span className="station-phase-tag">STATION D · ABSTRACT</span>
          <h3>Equation Builder — Algebraic Angle Proofs</h3>
        </div>
        <div className="station-steps-pill">
          <span>Step {step} of 3</span>
        </div>
      </div>

      <div className="station-body-grid">
        <div className="station-control-panel">
          {step === 1 && (
            <>
              <h4 style={{ color: '#ffd54f' }}>Step 1: Select the Geometric Rule</h4>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem' }}>
                Angles <strong>(3x + 15)°</strong> and <strong>(2x + 25)°</strong> lie adjacent on a flat line. Choose the valid rule:
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 14 }}>
                <button
                  className={`mcq-option-btn ${selectedRule === 'straight' ? 'selected' : ''}`}
                  onClick={() => setSelectedRule('straight')}
                >
                  <span>Angles on a straight line add up to 180°</span>
                </button>
                <button
                  className={`mcq-option-btn ${selectedRule === 'point' ? 'selected' : ''}`}
                  onClick={() => setSelectedRule('point')}
                >
                  <span>Angles around a point add up to 360°</span>
                </button>
                <button
                  className={`mcq-option-btn ${selectedRule === 'equal' ? 'selected' : ''}`}
                  onClick={() => setSelectedRule('equal')}
                >
                  <span>Vertically opposite angles are equal</span>
                </button>
              </div>

              <button
                className="btn btn-primary"
                onClick={checkRule}
                disabled={!selectedRule}
                style={{ marginTop: 20 }}
              >
                <span>Confirm Rule</span>
                <Check size={18} />
              </button>
            </>
          )}

          {step === 2 && (
            <>
              <h4 style={{ color: '#ffd54f' }}>Step 2: Build the Equation in the Tray</h4>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem' }}>
                Click chips below to construct the equation that equates the two angles to 180°.
              </p>

              {/* Equation Tray */}
              <div className="equation-tray-box">
                {trayChips.length === 0 ? (
                  <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.9rem' }}>
                    Click chips to place them into the equation tray...
                  </span>
                ) : (
                  trayChips.map((c, i) => (
                    <span
                      key={i}
                      className="tray-chip-item"
                      onClick={() => handleRemoveChip(i)}
                      title="Click chip to remove"
                      style={{ cursor: 'pointer' }}
                    >
                      {c} <span style={{ fontSize: '0.75rem', opacity: 0.6, marginLeft: 2 }}>×</span>
                    </span>
                  ))
                )}
              </div>

              {/* Chip bank */}
              <div className="chips-bank-row" style={{ marginTop: 14 }}>
                {chipsBank.map((chip, i) => (
                  <button key={i} className="expression-chip-btn" onClick={() => handleAddChip(chip)}>
                    {chip}
                  </button>
                ))}
              </div>

              <div style={{ display: 'flex', gap: 10, marginTop: 18 }}>
                <button className="btn btn-secondary" onClick={handleClearTray}>
                  <Trash2 size={16} />
                  <span>Clear</span>
                </button>
                <button className="btn btn-primary" onClick={checkEquation} disabled={trayChips.length < 5}>
                  <Check size={18} />
                  <span>Verify Equation</span>
                </button>
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <h4 style={{ color: '#ffd54f' }}>Step 3: Solve for x</h4>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem' }}>
                (3x + 15) + (2x + 25) = 180 → <strong>5x + 40 = 180</strong>. Enter the value of x on the degree pad:
              </p>
              <DegreePad onSubmit={checkSolve} unit="" />
            </>
          )}

          {feedback && <div className="feedback-hint-box" style={{ marginTop: 14 }}>{feedback}</div>}
        </div>

        <div className="station-visual-stage">
          <svg viewBox="0 0 320 220" width="100%" height="220">
            {/* Straight line with ray */}
            <line x1="30" y1="130" x2="290" y2="130" stroke="#00e5ff" strokeWidth="4" strokeLinecap="round" />
            <line x1="160" y1="130" x2="225" y2="40" stroke="#ff4081" strokeWidth="3.5" strokeLinecap="round" />
            <circle cx="160" cy="130" r="5" fill="#ffd54f" />

            <text x="110" y="115" fill="#00e5ff" fontSize="13" fontWeight="800">(3x + 15)°</text>
            <text x="210" y="115" fill="#ff4081" fontSize="13" fontWeight="800">(2x + 25)°</text>
          </svg>
        </div>
      </div>
    </div>
  );
}
