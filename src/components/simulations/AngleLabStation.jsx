import React, { useState } from 'react';
import { Check, Sparkles, ArrowRight, RotateCcw } from 'lucide-react';
import Protractor from '../shared/diagrams/Protractor';
import Mascot from '../Mascot';
import { classifyAngle } from '../../engine/angleMath';
import { playChime, playBuzz, playClick } from '../../utils/audio';

export default function AngleLabStation({ onComplete, audioEnabled }) {
  const [part, setPart] = useState(1); // 1 = Build angle, 2 = Straight & Point, 3 = Crossing lines
  const [builtAngle, setBuiltAngle] = useState(45);
  const [targetAngle, setTargetAngle] = useState(135);
  const [feedback, setFeedback] = useState(null);

  // Part 3 crossing slider
  const [crossAngle, setCrossAngle] = useState(65);
  const [seenCount, setSeenCount] = useState(1);
  const [selectedRule, setSelectedRule] = useState(null);

  // Part 1: Submit build
  const checkBuiltAngle = () => {
    const diff = Math.abs(builtAngle - targetAngle);
    if (diff <= 2) {
      playChime();
      setFeedback('Spot on! Exactly within tolerance! 🎉');
      setTimeout(() => {
        setFeedback(null);
        setPart(2);
      }, 1400);
    } else {
      playBuzz();
      setFeedback(`Not quite — reading is ${builtAngle}°, target is ${targetAngle}°. Adjust the ray!`);
    }
  };

  // Part 2: Advance
  const finishPart2 = () => {
    playChime();
    setPart(3);
  };

  // Part 3: Slider change
  const handleSlider = (e) => {
    const val = Number(e.target.value);
    setCrossAngle(val);
    setSeenCount((prev) => prev + 1);
  };

  const finishPart3 = () => {
    if (selectedRule === 'equal') {
      playChime();
      onComplete();
    } else {
      playBuzz();
      setFeedback('Check again: What is always true about opposite angles?');
    }
  };

  return (
    <div className="station-container glass-card">
      <div className="station-header">
        <div>
          <span className="station-phase-tag">STATION A · CONCRETE</span>
          <h3>Angle Lab — The Master Protractor</h3>
        </div>
        <div className="station-steps-pill">
          <span>Part {part} of 3</span>
        </div>
      </div>

      {part === 1 && (
        <div className="station-body-grid">
          <div className="station-control-panel">
            <h4 style={{ color: '#ffd54f' }}>Part 1: Build the Target Angle</h4>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
              Drag the golden ray on the protractor to construct an angle of exactly{' '}
              <strong style={{ color: '#00e5ff', fontSize: '1.2rem' }}>{targetAngle}°</strong>.
            </p>
            <div className="angle-classification-pill">
              <span>Type: {classifyAngle(builtAngle).toUpperCase()}</span>
            </div>

            <button className="btn btn-primary" onClick={checkBuiltAngle} style={{ marginTop: 20 }}>
              <Check size={18} />
              <span>Verify Angle ({builtAngle}°)</span>
            </button>

            {feedback && <div className="feedback-hint-box">{feedback}</div>}
          </div>

          <div className="station-visual-stage">
            <Protractor
              angle={builtAngle}
              targetAngle={targetAngle}
              onChange={(deg) => setBuiltAngle(deg)}
              step={1}
            />
          </div>
        </div>
      )}

      {part === 2 && (
        <div className="station-body-grid">
          <div className="station-control-panel">
            <h4 style={{ color: '#ffd54f' }}>Part 2: Angles on a Line &amp; Around a Point</h4>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
              Observe the two fundamental geometric axioms:
            </p>
            <div className="rule-showcase-box">
              <div style={{ color: '#00e5ff', fontWeight: 800 }}>Straight Line Axiom:</div>
              <div>Angles along a straight flat edge always add to <strong>180°</strong>.</div>
            </div>
            <div className="rule-showcase-box" style={{ marginTop: 10 }}>
              <div style={{ color: '#ffd54f', fontWeight: 800 }}>Full Revolution Axiom:</div>
              <div>Angles completing a circle around any point add to <strong>360°</strong>.</div>
            </div>

            <button className="btn btn-primary" onClick={finishPart2} style={{ marginTop: 24 }}>
              <span>Continue to Crossing Rays</span>
              <ArrowRight size={18} />
            </button>
          </div>

          <div className="station-visual-stage">
            <svg viewBox="0 0 320 220" width="100%" height="220">
              {/* Straight line demonstration */}
              <line x1="40" y1="70" x2="280" y2="70" stroke="#00e5ff" strokeWidth="4" strokeLinecap="round" />
              <line x1="160" y1="70" x2="220" y2="20" stroke="#ffd54f" strokeWidth="3" strokeLinecap="round" />
              <circle cx="160" cy="70" r="4.5" fill="#ffffff" />
              <text x="135" y="60" fill="#ffd54f" fontSize="12" fontWeight="800">125°</text>
              <text x="185" y="60" fill="#00e5ff" fontSize="12" fontWeight="800">55°</text>
              <text x="160" y="95" fill="rgba(255,255,255,0.7)" fontSize="11" textAnchor="middle">125° + 55° = 180° (Straight line)</text>

              {/* Around a point circle */}
              <circle cx="160" cy="165" r="32" fill="none" stroke="#ff4081" strokeWidth="2" strokeDasharray="4,4" />
              <circle cx="160" cy="165" r="4.5" fill="#ffd54f" />
              <text x="160" y="170" fill="#ffd54f" fontSize="12" fontWeight="800" textAnchor="middle">360°</text>
            </svg>
          </div>
        </div>
      )}

      {part === 3 && (
        <div className="station-body-grid">
          <div className="station-control-panel">
            <h4 style={{ color: '#ffd54f' }}>Part 3: Crossing Lines (Vertically Opposite)</h4>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
              Drag the angle slider to see the 4 angles update live in real-time. Notice which ones always match!
            </p>

            <div style={{ marginTop: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: 6 }}>
                <span>Adjust Crossing Angle:</span>
                <span style={{ color: '#ffd54f', fontWeight: 800 }}>{crossAngle}°</span>
              </div>
              <input
                type="range"
                min="25"
                max="155"
                value={crossAngle}
                onChange={handleSlider}
                className="custom-range-slider"
              />
            </div>

            <div style={{ marginTop: 16 }}>
              <p style={{ fontSize: '0.9rem', color: '#00e5ff', fontWeight: 700 }}>
                What rule holds true when two straight lines cross?
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 8 }}>
                <button
                  className={`mcq-option-btn ${selectedRule === 'equal' ? 'selected' : ''}`}
                  onClick={() => setSelectedRule('equal')}
                >
                  <span>Vertically opposite angles are always equal!</span>
                </button>
                <button
                  className={`mcq-option-btn ${selectedRule === 'all180' ? 'selected' : ''}`}
                  onClick={() => setSelectedRule('all180')}
                >
                  <span>All four angles are always identical.</span>
                </button>
              </div>
            </div>

            <button
              className="btn btn-primary"
              onClick={finishPart3}
              disabled={!selectedRule}
              style={{ marginTop: 20 }}
            >
              <Check size={18} />
              <span>Complete Station A</span>
            </button>

            {feedback && <div className="feedback-hint-box">{feedback}</div>}
          </div>

          <div className="station-visual-stage">
            <svg viewBox="0 0 300 240" width="100%" height="240">
              <line x1="30" y1="120" x2="270" y2="120" stroke="#00e5ff" strokeWidth="3.5" strokeLinecap="round" />
              {/* Dynamic crossing line based on crossAngle */}
              {(() => {
                const rad = (crossAngle * Math.PI) / 180;
                const dx = 100 * Math.cos(rad);
                const dy = 100 * Math.sin(rad);
                return (
                  <line
                    x1={150 - dx}
                    y1={120 + dy}
                    x2={150 + dx}
                    y2={120 - dy}
                    stroke="#ff4081"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                  />
                );
              })()}
              <circle cx="150" cy="120" r="5" fill="#ffd54f" />

              {/* Opposite equal angles in green, adjacent in cyan */}
              <text x="180" y="105" fill="#00e676" fontSize="13" fontWeight="800">{crossAngle}°</text>
              <text x="120" y="145" fill="#00e676" fontSize="13" fontWeight="800">{crossAngle}°</text>
              <text x="120" y="105" fill="#00e5ff" fontSize="13" fontWeight="800">{180 - crossAngle}°</text>
              <text x="180" y="145" fill="#00e5ff" fontSize="13" fontWeight="800">{180 - crossAngle}°</text>
            </svg>
          </div>
        </div>
      )}
    </div>
  );
}
