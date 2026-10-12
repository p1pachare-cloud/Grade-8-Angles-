import React from 'react';

export default function Mascot({ mood = 'idle', size = 'medium', className = '' }) {
  const sizePx = size === 'large' ? 120 : size === 'medium' ? 80 : 50;

  return (
    <div
      className={`mascot-robot mascot-mood-${mood} ${className}`}
      style={{ width: sizePx, height: sizePx }}
      title={`Vertex (${mood})`}
    >
      <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="vertexHeadGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00e5ff" />
            <stop offset="50%" stopColor="#3f51b5" />
            <stop offset="100%" stopColor="#7c5cbf" />
          </linearGradient>
          <linearGradient id="vertexAntenna" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffd54f" />
            <stop offset="100%" stopColor="#ff7043" />
          </linearGradient>
          <filter id="vertexGlow">
            <feGaussianBlur stdDeviation="3.5" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Compass Antenna with Glowing Bulb */}
        <line x1="50" y1="18" x2="50" y2="6" stroke="#ffd54f" strokeWidth="3" strokeLinecap="round" />
        <circle cx="50" cy="5" r="3.8" fill="#ffd54f" filter="url(#vertexGlow)" />

        {/* Protractor-shaped Head (Semi-circle Arc with Bottom Diameter) */}
        {/* Arc from (14, 60) to (86, 60) curving up to (50, 20) */}
        <path
          d="M 14 62 A 38 38 0 0 1 86 62 Z"
          fill="url(#vertexHeadGrad)"
          filter="url(#vertexGlow)"
          stroke="#ffffff"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />

        {/* Protractor Degree Degree Ticks along the Curved Rim */}
        <line x1="28" y1="38" x2="32" y2="42" stroke="rgba(255,255,255,0.6)" strokeWidth="1.5" />
        <line x1="50" y1="24" x2="50" y2="30" stroke="rgba(255,255,255,0.8)" strokeWidth="2" />
        <line x1="72" y1="38" x2="68" y2="42" stroke="rgba(255,255,255,0.6)" strokeWidth="1.5" />

        {/* Inner Protractor Transparent Cutout Window */}
        <path
          d="M 28 62 A 22 22 0 0 1 72 62 Z"
          fill="rgba(11, 8, 38, 0.4)"
          stroke="rgba(0, 229, 255, 0.4)"
          strokeWidth="1.2"
        />

        {/* Visor Screen */}
        <ellipse cx="50" cy="48" rx="20" ry="12" fill="#0b0826" stroke="#00e5ff" strokeWidth="1.5" />

        {/* Eyes Based on Mood */}
        {mood === 'happy' || mood === 'celebrating' ? (
          <>
            <path d="M 39 47 Q 44 41 49 47" stroke="#00e5ff" strokeWidth="3" fill="none" strokeLinecap="round" />
            <path d="M 51 47 Q 56 41 61 47" stroke="#00e5ff" strokeWidth="3" fill="none" strokeLinecap="round" />
          </>
        ) : mood === 'thinking' || mood === 'curious' ? (
          <>
            <circle cx="43" cy="46" r="3" fill="#ffd54f" />
            <ellipse cx="57" cy="45" rx="4.5" ry="2.2" fill="#ffd54f" />
          </>
        ) : (
          <>
            <circle cx="42" cy="46" r="3.2" fill="#00e5ff" />
            <circle cx="58" cy="46" r="3.2" fill="#00e5ff" />
          </>
        )}

        {/* Mouth Based on Mood */}
        {mood === 'celebrating' || mood === 'happy' ? (
          <path d="M 44 54 Q 50 60 56 54" stroke="#ff4081" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        ) : mood === 'thinking' ? (
          <line x1="45" y1="54" x2="55" y2="53" stroke="#ffd54f" strokeWidth="2" strokeLinecap="round" />
        ) : (
          <path d="M 45 54 Q 50 57 55 54" stroke="#ffffff" strokeWidth="2" fill="none" strokeLinecap="round" />
        )}

        {/* Compass Legs at the Bottom */}
        {/* Left Leg */}
        <path d="M 32 63 L 24 92" stroke="#7c5cbf" strokeWidth="3" strokeLinecap="round" />
        <circle cx="24" cy="92" r="2.5" fill="#ffd54f" />

        {/* Right Leg */}
        <path d="M 68 63 L 76 92" stroke="#7c5cbf" strokeWidth="3" strokeLinecap="round" />
        <circle cx="76" cy="92" r="2.5" fill="#00e5ff" />

        {/* Center Hinge Needle */}
        <circle cx="50" cy="62" r="3" fill="#ffffff" stroke="#3f51b5" strokeWidth="1.5" />
      </svg>
    </div>
  );
}
