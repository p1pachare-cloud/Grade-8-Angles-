import React, { useState, useEffect } from 'react';
import { Award, Sparkles, CheckCircle2, RotateCcw, Share2 } from 'lucide-react';
import Mascot from '../Mascot';
import { BADGES } from '../../utils/badgeEngine';
import { getArchitectTitle } from '../../utils/scoring';
import { reflectNarration } from '../../utils/narration';
import { narrate, playChime } from '../../utils/audio';

export default function ReflectPhase({
  onRestart,
  audioEnabled,
  xp,
  worldScores = [],
  unlockedBadges = [],
}) {
  const [reflectionText, setReflectionText] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    narrate(reflectNarration(), audioEnabled);
  }, [audioEnabled]);

  const handleSaveJournal = () => {
    playChime();
    setSaved(true);
  };

  const totalCorrect = worldScores.reduce((sum, ws) => sum + (ws || 0), 0);
  const architectTitle = getArchitectTitle(xp);

  return (
    <div className="phase-container reflect-phase">
      <div className="glass-card phase-card">
        <div className="phase-header">
          <div>
            <span className="phase-tag">PHASE 5 — REFLECT</span>
            <h2>Lesson Completion &amp; Architecture Journal</h2>
          </div>
          <span style={{ color: '#ffd54f', fontWeight: 800 }}>
            World Skyline Festival Restored! 🏛️
          </span>
        </div>

        {/* Certificate Card */}
        <div className="completion-certificate-card glass-card">
          <div className="cert-header">
            <Mascot mood="celebrating" size="large" />
            <div>
              <span className="phase-tag" style={{ background: 'rgba(255,193,7,0.2)', color: '#ffd54f' }}>
                {architectTitle}
              </span>
              <h1 className="cert-title">Global Angle Architect!</h1>
              <p className="cert-subtitle">Measuring, Relating &amp; Reasoning About Angles — Grade 8 Math</p>
            </div>
          </div>

          <div className="cert-stats-row">
            <div className="cert-stat-box">
              <span className="stat-value">{xp}</span>
              <span className="stat-label">Total XP Earned</span>
            </div>
            <div className="cert-stat-box">
              <span className="stat-value">{totalCorrect}/100</span>
              <span className="stat-label">Questions Correct</span>
            </div>
            <div className="cert-stat-box">
              <span className="stat-value">{unlockedBadges.length}/{BADGES.length}</span>
              <span className="stat-label">Badges Unlocked</span>
            </div>
          </div>

          {/* Badges Panel */}
          <div className="badges-grid-container">
            <h3 style={{ fontFamily: 'var(--font-display)', color: '#ffd54f', fontSize: '1.3rem' }}>
              🏅 Architectural Badges
            </h3>
            <div className="badges-flex-row">
              {BADGES.map((badge) => {
                const isUnlocked = unlockedBadges.includes(badge.id);
                return (
                  <div
                    key={badge.id}
                    className={`badge-chip-card ${isUnlocked ? 'badge-unlocked' : 'badge-locked'}`}
                    title={badge.description}
                  >
                    <span>{badge.label}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Reflection Journal Prompt */}
          <div className="reflection-journal-box">
            <h3 style={{ fontFamily: 'var(--font-display)', color: '#ffd54f', fontSize: '1.25rem' }}>
              📓 Architect's Engineering Journal
            </h3>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              "Pick one angle rule that surprised you today (Linear pair 180°, vertically opposite equal, parallel line transversals, triangle sum 180°, exterior angles, or polygon formulas). Explain it to Vertex in your own words, or describe where you'd use it in engineering!"
            </p>

            <textarea
              className="journal-textarea"
              placeholder="Write your explanation or drawing notes here..."
              rows={4}
              value={reflectionText}
              onChange={(e) => setReflectionText(e.target.value)}
            />

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 10 }}>
              <button
                className="btn btn-primary"
                onClick={handleSaveJournal}
                disabled={saved || !reflectionText.trim()}
              >
                <CheckCircle2 size={16} />
                <span>{saved ? 'Journal Entry Saved! ✨' : 'Save to Architecture Log'}</span>
              </button>
            </div>
          </div>

          {/* Action buttons */}
          <div className="cert-actions-row">
            <button className="btn btn-secondary" onClick={onRestart}>
              <RotateCcw size={16} />
              <span>Restart Mission</span>
            </button>
            <button
              className="btn btn-primary"
              onClick={() => {
                alert('Congratulations! Your Global Angle Architect certification is saved.');
              }}
            >
              <Share2 size={16} />
              <span>Share with Teacher</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
