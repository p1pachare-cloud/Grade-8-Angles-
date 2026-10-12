import React from 'react';

const PHASE_CARDS = [
  {
    id: 'wonder',
    emoji: '🤔',
    title: 'Wonder',
    subtitle: 'Liam’s Dublin Bridge Crossing Mystery',
  },
  {
    id: 'story',
    emoji: '📖',
    title: 'Story',
    subtitle: 'The Global Angle Architects',
  },
  {
    id: 'simulate',
    emoji: '🧪',
    title: 'Simulate',
    subtitle: '4 Engineering Simulation Stations',
  },
  {
    id: 'practice',
    emoji: '🎮',
    title: 'Practice',
    subtitle: '100 Procedurally Seeded Challenges',
  },
  {
    id: 'reflect',
    emoji: '📓',
    title: 'Reflect',
    subtitle: 'Architect Journal & Badges',
  },
];

export default function IntroScreen({ onStart, onSelectPhase }) {
  return (
    <div className="intro-screen-layout">
      {/* Top Grade Pill */}
      <div className="grade-badge-pill">
        <span>✨ Grade 8 Math • Global Geometry &amp; Reasoning</span>
      </div>

      {/* Main Title & Subtitle */}
      <h1 className="hero-main-title">Global Angle Architects — Angles</h1>
      <h2 className="hero-subtitle">Measuring, Relating &amp; Reasoning About Angles!</h2>

      {/* Intro Description Box */}
      <div className="hero-description-box">
        <p>
          Stop guessing angles by looks and start proving by rules! Join Liam, Sarah, Yuki, Aisha, and the Global Angle Architects to rebuild 10 world landmark models following Storm Zigzag. Discover straight line facts, parallel transversal rules, and triangle theorems with Vertex the Robot! 📐🌍
        </p>
      </div>

      {/* 5 Phase Cards Row */}
      <div className="phase-cards-row">
        {PHASE_CARDS.map((card) => (
          <div
            key={card.id}
            className="home-phase-card"
            onClick={() => (onSelectPhase ? onSelectPhase(card.id) : onStart())}
          >
            <div className="phase-card-emoji">{card.emoji}</div>
            <h3 className="phase-card-title">{card.title}</h3>
            <span className="phase-card-subtitle">{card.subtitle}</span>
          </div>
        ))}
      </div>

      {/* Main CTA Button */}
      <button className="btn-begin-journey" onClick={onStart}>
        <span className="rocket-icon">🚀</span>
        <span>Begin Your Journey!</span>
      </button>

      {/* Bottom Feature Tags */}
      <div className="bottom-feature-tags">
        <div className="feature-tag-pill">
          <span>🎯 100 Random Questions</span>
        </div>
        <div className="feature-tag-pill">
          <span>📐 4 Interactive Lab Stations</span>
        </div>
        <div className="feature-tag-pill">
          <span>🏆 9 Badges &amp; Streak Fire</span>
        </div>
      </div>
    </div>
  );
}
