import React, { useState, useEffect } from 'react';
import { ArrowRight, Sparkles, HelpCircle } from 'lucide-react';
import Mascot from '../Mascot';
import { wonderNarration } from '../../utils/narration';
import { narrate, playClick, playChime } from '../../utils/audio';

export default function WonderPhase({ onNext, audioEnabled }) {
  const [revealed, setRevealed] = useState(false);
  const [userGuess, setUserGuess] = useState('');
  const [mascotMood, setMascotMood] = useState('curious');

  useEffect(() => {
    narrate(wonderNarration(), audioEnabled);
  }, [audioEnabled]);

  const handleGuess = () => {
    playChime();
    setRevealed(true);
    setMascotMood('celebrating');
  };

  return (
    <div className="phase-container wonder-phase">
      <div className="glass-card phase-card">
        <div className="phase-header">
          <div>
            <span className="phase-tag">PHASE 1 — WONDER</span>
            <h2>The Mystery of the Dublin Bridge Beams</h2>
          </div>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Dublin, Ireland 🇮🇪
          </span>
        </div>

        <div className="wonder-content-grid">
          {/* Visual Crossing Beams Stage */}
          <div className="wonder-visual-panel">
            <span style={{ fontSize: '0.95rem', fontWeight: 800, color: '#ffd54f' }}>
              Liam's Model Bridge · Two Crossing Beams
            </span>

            <div className="interactive-svg-stage" style={{ width: 320, height: 320 }}>
              <svg viewBox="0 0 320 320" width="100%" height="100%">
                <defs>
                  <linearGradient id="beamGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#00e5ff" />
                    <stop offset="100%" stopColor="#3f51b5" />
                  </linearGradient>
                  <filter id="neonGlow">
                    <feGaussianBlur stdDeviation="4" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>

                {/* Horizontal Baseline Beam */}
                <line
                  x1="30"
                  y1="160"
                  x2="290"
                  y2="160"
                  stroke="url(#beamGrad)"
                  strokeWidth="8"
                  strokeLinecap="round"
                  filter="url(#neonGlow)"
                />

                {/* Crossing Angled Beam (110° slope) */}
                <line
                  x1="80"
                  y1="260"
                  x2="240"
                  y2="60"
                  stroke="#7c5cbf"
                  strokeWidth="8"
                  strokeLinecap="round"
                  filter="url(#neonGlow)"
                />

                {/* Central Hinge Bolt */}
                <circle cx="160" cy="160" r="9" fill="#ffd54f" stroke="#ffffff" strokeWidth="2.5" />

                {/* Angle 1: Glowing 110° */}
                <circle cx="120" cy="135" r="18" fill="rgba(255, 213, 79, 0.25)" stroke="#ffd54f" strokeWidth="2" />
                <text x="120" y="140" fill="#ffd54f" fontSize="13" fontWeight="900" textAnchor="middle">
                  110°
                </text>

                {/* Three Mystery Angles Marked '?' */}
                {/* Angle 2: Adjacent Left (70°) */}
                <circle cx="120" cy="185" r="18" fill="rgba(0, 229, 255, 0.2)" stroke="#00e5ff" strokeWidth="2" />
                <text x="120" y="190" fill="#00e5ff" fontSize="14" fontWeight="900" textAnchor="middle">
                  {revealed ? '70°' : '?'}
                </text>

                {/* Angle 3: Vertically Opposite (110°) */}
                <circle cx="200" cy="185" r="18" fill="rgba(255, 64, 129, 0.2)" stroke="#ff4081" strokeWidth="2" />
                <text x="200" y="190" fill="#ff4081" fontSize="14" fontWeight="900" textAnchor="middle">
                  {revealed ? '110°' : '?'}
                </text>

                {/* Angle 4: Adjacent Right (70°) */}
                <circle cx="200" cy="135" r="18" fill="rgba(0, 230, 118, 0.2)" stroke="#00e676" strokeWidth="2" />
                <text x="200" y="140" fill="#00e676" fontSize="14" fontWeight="900" textAnchor="middle">
                  {revealed ? '70°' : '?'}
                </text>
              </svg>
            </div>
          </div>

          {/* Wonder Story Hook Panel */}
          <div className="wonder-inquiry-panel">
            <div className="wonder-speech-bubble">
              <p style={{ fontSize: '1.05rem', lineHeight: 1.6, color: '#ffffff' }}>
                "Liam is repairing a scale model bridge in Dublin. Two heavy beams cross each other, and one angle measures exactly <strong>110°</strong>."
              </p>
              <p style={{ fontSize: '1.05rem', lineHeight: 1.6, color: '#ffd54f', marginTop: 10, fontWeight: 700 }}>
                "Without picking up a protractor, can you figure out what the other three angles must be?"
              </p>
            </div>

            <div className="wonder-interactive-box">
              <span style={{ fontSize: '0.95rem', fontWeight: 700, color: '#00e5ff' }}>
                Take a guess for the angle right opposite the 110°:
              </span>
              <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
                <input
                  type="number"
                  placeholder="e.g. 110"
                  value={userGuess}
                  onChange={(e) => setUserGuess(e.target.value)}
                  className="wonder-guess-input"
                />
                <button className="btn btn-secondary" onClick={handleGuess}>
                  <span>Reveal Secret!</span>
                </button>
              </div>
            </div>

            {revealed && (
              <div className="wonder-revelation-box" style={{ animation: 'bounceIn 0.5s ease-out' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#00e676', fontWeight: 800 }}>
                  <Sparkles size={18} />
                  <span>The Opposite Angle is Exactly 110°!</span>
                </div>
                <p style={{ margin: '6px 0 0', fontSize: '0.92rem', color: 'var(--text-secondary)' }}>
                  And the two side angles are <strong>70°</strong> because 110° + 70° = 180° on a straight line!
                </p>
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 24 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <Mascot mood={mascotMood} size="medium" />
                <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                  Vertex: "Let's discover the secret rules of angles!"
                </span>
              </div>

              <button className="btn btn-primary" onClick={onNext}>
                <span>Enter Story</span>
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
