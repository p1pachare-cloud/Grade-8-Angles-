import React, { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, MapPin, Box, Image as ImageIcon } from 'lucide-react';
import Mascot from '../Mascot';
import { STORY_PANELS } from '../../data/storyContent';
import { getStoryNarration } from '../../utils/narration';
import { narrate } from '../../utils/audio';

export default function StoryPhase({ onNext, audioEnabled }) {
  const [panelIndex, setPanelIndex] = useState(0);
  const [viewMode, setViewMode] = useState('image'); // default to 'image' for visual storytelling
  const panel = STORY_PANELS[panelIndex];

  useEffect(() => {
    narrate(getStoryNarration(panelIndex), audioEnabled);
  }, [panelIndex, audioEnabled]);

  const handleNext = () => {
    if (panelIndex < STORY_PANELS.length - 1) {
      setPanelIndex((prev) => prev + 1);
    } else {
      onNext();
    }
  };

  const handlePrev = () => {
    if (panelIndex > 0) {
      setPanelIndex((prev) => prev - 1);
    }
  };

  return (
    <div className="phase-container story-phase">
      <div className="glass-card phase-card story-phase-card">
        <div className="phase-header">
          <div>
            <span className="phase-tag">PHASE 2 — STORY</span>
            <h2 className="story-main-heading">The Global Angle Architects</h2>
          </div>

          <div className="panel-dots">
            {STORY_PANELS.map((p, idx) => (
              <button
                key={p.id}
                className={`panel-dot ${idx === panelIndex ? 'active' : ''}`}
                onClick={() => setPanelIndex(idx)}
                title={`Panel ${idx + 1}: ${p.title}`}
              />
            ))}
          </div>
        </div>

        <div className="story-content-wrapper">
          {/* Visual Showcase Card */}
          <div className="story-visual-card">
            <div className="story-card-top-bar">
              <div className="story-location-badge">
                <MapPin size={16} />
                <span>{panel.location}</span>
              </div>

              <div className="story-view-toggle">
                <button
                  className={`story-toggle-btn ${viewMode === 'image' ? 'active' : ''}`}
                  onClick={() => setViewMode('image')}
                >
                  <ImageIcon size={14} />
                  <span>Story Scene</span>
                </button>
                <button
                  className={`story-toggle-btn ${viewMode === 'interactive' ? 'active' : ''}`}
                  onClick={() => setViewMode('interactive')}
                >
                  <Box size={14} />
                  <span>Geometry Model</span>
                </button>
              </div>

              <div className="panel-counter-badge">
                <span>Panel {panelIndex + 1} of 6</span>
              </div>
            </div>

            {/* Visual Display: Story Illustration or Interactive Geometry */}
            {viewMode === 'image' ? (
              <div className="story-image-container">
                <img
                  src={panel.image}
                  alt={panel.title}
                  className="story-panel-image"
                  onError={() => setViewMode('interactive')}
                />
                <div className="story-image-overlay-pill">
                  <span>📍 {panel.location}</span>
                </div>
              </div>
            ) : (
              <div className="visual-graphic-container">
                {panel.visualType === 'worldMap' && (
                  <svg width="340" height="250" viewBox="0 0 320 220">
                    <ellipse cx="160" cy="110" rx="140" ry="90" fill="none" stroke="#283593" strokeWidth="2" strokeDasharray="5,5" />
                    <ellipse cx="160" cy="110" rx="95" ry="60" fill="none" stroke="#3f51b5" strokeWidth="1.5" />
                    {[
                      { x: 80, y: 70, label: 'Liam (Dublin)' },
                      { x: 140, y: 80, label: 'Sarah (Sydney)' },
                      { x: 250, y: 85, label: 'Yuki (Tokyo)' },
                      { x: 190, y: 130, label: 'Wei (Singapore)' },
                      { x: 210, y: 110, label: 'Aisha (Dubai)' },
                    ].map((pin, i) => (
                      <g key={i}>
                        <circle cx={pin.x} cy={pin.y} r="5" fill="#ffd54f" />
                        <circle cx={pin.x} cy={pin.y} r="10" fill="none" stroke="#ffd54f" opacity="0.4" />
                        <text x={pin.x} y={pin.y - 10} fill="#ffffff" fontSize="10" fontWeight="700" textAnchor="middle">
                          {pin.label}
                        </text>
                      </g>
                    ))}
                  </svg>
                )}

                {panel.visualType === 'stormSwirl' && (
                  <svg width="340" height="250" viewBox="0 0 320 220">
                    <path d="M 60 110 Q 160 30 260 110 Q 160 190 60 110" fill="none" stroke="#ff4081" strokeWidth="3" strokeDasharray="6,6" />
                    <path d="M 100 110 Q 160 60 220 110 Q 160 160 100 110" fill="none" stroke="#00e5ff" strokeWidth="3" />
                    <text x="160" y="115" fill="#ffd54f" fontSize="18" fontWeight="900" textAnchor="middle">
                      🌪️ Storm Zigzag!
                    </text>
                  </svg>
                )}

                {panel.visualType === 'operaSails' && (
                  <svg width="340" height="250" viewBox="0 0 320 220">
                    <path d="M 50 180 Q 130 50 160 50 Q 190 50 270 180 Z" fill="rgba(0, 229, 255, 0.2)" stroke="#00e5ff" strokeWidth="3" />
                    <path d="M 90 180 Q 160 80 180 80 Q 200 80 250 180 Z" fill="rgba(124, 92, 191, 0.25)" stroke="#7c5cbf" strokeWidth="2.5" />
                    <text x="160" y="42" fill="#ffd54f" fontSize="13" fontWeight="800" textAnchor="middle">
                      Crossing Sails = 65°
                    </text>
                  </svg>
                )}

                {panel.visualType === 'tokyoCrossing' && (
                  <svg width="340" height="250" viewBox="0 0 320 220">
                    <line x1="40" y1="80" x2="280" y2="80" stroke="#00e5ff" strokeWidth="4" />
                    <line x1="40" y1="150" x2="280" y2="150" stroke="#00e5ff" strokeWidth="4" />
                    <line x1="90" y1="200" x2="230" y2="30" stroke="#ff4081" strokeWidth="4" />
                    <text x="160" y="190" fill="#ffd54f" fontSize="13" fontWeight="800" textAnchor="middle">
                      Parallel Roads &amp; Transversal
                    </text>
                  </svg>
                )}

                {panel.visualType === 'dubaiTower' && (
                  <svg width="340" height="250" viewBox="0 0 320 220">
                    <polygon points="160,30 80,180 240,180" fill="rgba(0, 230, 118, 0.2)" stroke="#00e676" strokeWidth="3" />
                    <text x="160" y="115" fill="#ffd54f" fontSize="14" fontWeight="900" textAnchor="middle">
                      Triangle Sum = 180°
                    </text>
                  </svg>
                )}

                {panel.visualType === 'angleTools' && (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
                    <Mascot mood="celebrating" size="large" />
                    <span style={{ color: '#ffd54f', fontWeight: 800, fontSize: '1.05rem' }}>
                      10 Landmarks · 10 Angle Tools!
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Narrative Story Card */}
          <div className="story-text-card">
            <div className="story-text-header">
              <div className="story-character-tag">
                <span>👤 Architect: {panel.character}</span>
              </div>
              <h3 className="story-panel-title">{panel.title}</h3>
            </div>

            <div className="story-narration-box">
              <p className="story-narration-paragraph">{panel.narrative}</p>
            </div>

            <div className="story-navigation-bar">
              <button
                className="btn btn-secondary"
                onClick={handlePrev}
                disabled={panelIndex === 0}
                style={{ padding: '12px 22px', fontSize: '1rem' }}
              >
                <ArrowLeft size={18} />
                <span>Previous Panel</span>
              </button>

              <button
                className="btn btn-primary"
                onClick={handleNext}
                style={{ padding: '12px 26px', fontSize: '1rem' }}
              >
                <span>{panelIndex === STORY_PANELS.length - 1 ? 'Enter Angle Lab Stations' : 'Next Story Panel'}</span>
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
