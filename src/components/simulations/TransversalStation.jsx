import React, { useState } from 'react';
import { Check, Sparkles, ArrowRight, HelpCircle } from 'lucide-react';
import TransversalDiagram from '../shared/diagrams/TransversalDiagram';
import { IDS, angleValue, valueRelation, relationBetween } from '../../engine/transversal';
import { playChime, playBuzz, playClick } from '../../utils/audio';

export default function TransversalStation({ onComplete, audioEnabled, onRecordError }) {
  const [round, setRound] = useState(1); // 1 = explore, 2 = pick equal, 3 = pick supplementary, 4 = converse
  const [theta, setTheta] = useState(65);
  const [activeId, setActiveId] = useState('T.UR');
  const [selected, setSelected] = useState([]);
  const [feedback, setFeedback] = useState(null);
  const [errors, setErrors] = useState(0);

  // Round 2 setup
  const targetEqual = 'T.UR'; // equal are T.LL, B.UR, B.LL
  const expectedEqual = ['T.LL', 'B.UR', 'B.LL'];

  // Round 3 setup
  const targetSupp = 'T.UR'; // supplementary are T.UL, T.LR, B.UL, B.LR
  const expectedSupp = ['T.UL', 'T.LR', 'B.UL', 'B.LR'];

  // Round 4 converse
  const [converseAnswer, setConverseAnswer] = useState(null);

  const handleAngleTap = (id) => {
    playClick();
    if (round === 1) {
      setActiveId(id);
    } else if (round === 2 || round === 3) {
      if (selected.includes(id)) {
        setSelected(selected.filter((item) => item !== id));
      } else {
        setSelected([...selected, id]);
      }
    }
  };

  const advanceFromExplore = () => {
    playChime();
    setRound(2);
    setSelected([]);
    setFeedback(null);
  };

  const checkPickEqual = () => {
    const isCorrect =
      expectedEqual.every((id) => selected.includes(id)) &&
      selected.length === expectedEqual.length;

    if (isCorrect) {
      playChime();
      setFeedback('Brilliant! You identified all equal angle pairs! 🎉');
      setTimeout(() => {
        setFeedback(null);
        setSelected([]);
        setRound(3);
      }, 1200);
    } else {
      playBuzz();
      setErrors((prev) => prev + 1);
      if (onRecordError) onRecordError();
      setFeedback('Not quite all matching angles. Remember: vertically opposite, alternate, and corresponding angles are equal!');
    }
  };

  const checkPickSupplementary = () => {
    const isCorrect =
      expectedSupp.every((id) => selected.includes(id)) &&
      selected.length === expectedSupp.length;

    if (isCorrect) {
      playChime();
      setFeedback('Awesome! All supplementary angles add to 180°! 🚀');
      setTimeout(() => {
        setFeedback(null);
        setSelected([]);
        setRound(4);
      }, 1200);
    } else {
      playBuzz();
      setErrors((prev) => prev + 1);
      if (onRecordError) onRecordError();
      setFeedback('Look for angles that form a linear straight pair (180°) or co-interior inside the lines!');
    }
  };

  const checkConverse = () => {
    if (converseAnswer === 'yes') {
      playChime();
      onComplete(errors === 0);
    } else {
      playBuzz();
      setFeedback('Check again: if corresponding angles are equal (65° = 65°), the lines MUST be parallel!');
    }
  };

  return (
    <div className="station-container glass-card">
      <div className="station-header">
        <div>
          <span className="station-phase-tag">STATION B · PICTORIAL</span>
          <h3>Transversal Explorer — Parallel Line Relations</h3>
        </div>
        <div className="station-steps-pill">
          <span>Step {round} of 4</span>
        </div>
      </div>

      <div className="station-body-grid">
        <div className="station-control-panel">
          {round === 1 && (
            <>
              <h4 style={{ color: '#ffd54f' }}>Step 1: Explore Parallel Lines &amp; Transversals</h4>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem' }}>
                Tap any angle on the diagram. Notice how equal angles illuminate in{' '}
                <span style={{ color: '#00e676', fontWeight: 800 }}>Green</span>, and supplementary angles (adding to 180°) illuminate in{' '}
                <span style={{ color: '#ff9800', fontWeight: 800 }}>Amber</span>!
              </p>
              <div className="rule-showcase-box" style={{ marginTop: 12 }}>
                <div style={{ color: '#00e5ff', fontWeight: 800 }}>Active Angle: {activeId} ({angleValue(activeId, theta)}°)</div>
                <div style={{ fontSize: '0.85rem', marginTop: 4 }}>
                  Drag the red transversal handle to change the crossing angle and watch all 8 angles synchronize!
                </div>
              </div>
              <button className="btn btn-primary" onClick={advanceFromExplore} style={{ marginTop: 20 }}>
                <span>Proceed to Pair Detective</span>
                <ArrowRight size={18} />
              </button>
            </>
          )}

          {round === 2 && (
            <>
              <h4 style={{ color: '#ffd54f' }}>Step 2: Tap ALL Angles Equal to {targetEqual}</h4>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem' }}>
                The glowing angle {targetEqual} is {angleValue(targetEqual, theta)}°. Select all 3 other angles that are exactly equal to it.
              </p>
              <div style={{ color: '#00e5ff', fontSize: '0.9rem', fontWeight: 700, margin: '10px 0' }}>
                Selected: {selected.join(', ') || 'None yet'}
              </div>
              <button className="btn btn-primary" onClick={checkPickEqual} style={{ marginTop: 14 }}>
                <Check size={18} />
                <span>Verify Equal Angles</span>
              </button>
            </>
          )}

          {round === 3 && (
            <>
              <h4 style={{ color: '#ffd54f' }}>Step 3: Tap Supplementary Angles (Sum to 180°)</h4>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem' }}>
                Angle {targetSupp} is {angleValue(targetSupp, theta)}°. Tap all angles that add to 180° with it (co-interior and linear pairs).
              </p>
              <div style={{ color: '#ff9800', fontSize: '0.9rem', fontWeight: 700, margin: '10px 0' }}>
                Selected: {selected.join(', ') || 'None yet'} ({selected.length} of 4)
              </div>
              <button className="btn btn-primary" onClick={checkPickSupplementary} style={{ marginTop: 14 }}>
                <Check size={18} />
                <span>Verify Supplementary Angles</span>
              </button>
            </>
          )}

          {round === 4 && (
            <>
              <h4 style={{ color: '#ffd54f' }}>Step 4: The Parallel Line Converse</h4>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem' }}>
                Two lines are cut by a road. Both corresponding angles measure <strong>65°</strong>. Are the two lines guaranteed to be parallel?
              </p>
              <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
                <button
                  className={`mcq-option-btn ${converseAnswer === 'yes' ? 'selected' : ''}`}
                  onClick={() => setConverseAnswer('yes')}
                  style={{ flex: 1 }}
                >
                  <span>Yes, Parallel!</span>
                </button>
                <button
                  className={`mcq-option-btn ${converseAnswer === 'no' ? 'selected' : ''}`}
                  onClick={() => setConverseAnswer('no')}
                  style={{ flex: 1 }}
                >
                  <span>No, Not Parallel</span>
                </button>
              </div>
              <button
                className="btn btn-primary"
                onClick={checkConverse}
                disabled={!converseAnswer}
                style={{ marginTop: 20 }}
              >
                <Check size={18} />
                <span>Complete Station B</span>
              </button>
            </>
          )}

          {feedback && <div className="feedback-hint-box" style={{ marginTop: 14 }}>{feedback}</div>}
        </div>

        <div className="station-visual-stage">
          <TransversalDiagram
            theta={theta}
            onChangeTheta={(deg) => setTheta(deg)}
            selected={selected}
            activeAngleId={activeId}
            targetAngleId={round === 2 ? targetEqual : round === 3 ? targetSupp : null}
            mode={round === 1 ? 'explore' : 'pick'}
            onSelectAngle={handleAngleTap}
          />
        </div>
      </div>
    </div>
  );
}
