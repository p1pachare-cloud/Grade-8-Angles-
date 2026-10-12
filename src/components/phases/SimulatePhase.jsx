import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { ArrowRight, ArrowLeft, CheckCircle, Sparkles } from 'lucide-react';
import { STATIONS } from '../../data/stationContent';
import AngleLabStation from '../simulations/AngleLabStation';
import TransversalStation from '../simulations/TransversalStation';
import SumLabStation from '../simulations/SumLabStation';
import EquationBuilderStation from '../simulations/EquationBuilderStation';
import { simulateStationIntro } from '../../utils/narration';
import { narrate } from '../../utils/audio';

export default function SimulatePhase({
  onNext,
  audioEnabled,
  completedStations = [false, false, false, false],
  setCompletedStations,
  onSimulationsComplete,
}) {
  const [stationIdx, setStationIdx] = useState(0);
  const [transitionMsg, setTransitionMsg] = useState(null);
  const [showAllDoneModal, setShowAllDoneModal] = useState(false);

  const handleStationComplete = (index) => {
    const updated = [...completedStations];
    updated[index] = true;
    if (setCompletedStations) setCompletedStations(updated);

    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
      });
    } catch (e) {}

    if (index < 3) {
      const nextIdx = index + 1;
      const nextStation = STATIONS[nextIdx];
      setTransitionMsg(`🎉 Station ${String.fromCharCode(65 + index)} Complete! Jumping to Station ${String.fromCharCode(65 + nextIdx)}: ${nextStation.name}...`);

      setTimeout(() => {
        setStationIdx(nextIdx);
        setTransitionMsg(null);
        narrate(simulateStationIntro(nextIdx), audioEnabled);
        window.scrollTo({ top: 100, behavior: 'smooth' });
      }, 1000);
    } else {
      // Completed Station D (all 4 stations mastered)
      try {
        confetti({
          particleCount: 120,
          spread: 90,
          origin: { y: 0.5 },
        });
      } catch (e) {}
      if (onSimulationsComplete) onSimulationsComplete();
      setShowAllDoneModal(true);
    }
  };

  const allDone = completedStations.every(Boolean);

  return (
    <div className="phase-container simulate-phase-curious">
      <div className="glass-card simulate-main-card">
        {/* Phase Header */}
        <div className="simulate-phase-top-bar">
          <div className="simulate-title-group">
            <span className="phase-tag">PHASE 3 — SIMULATE</span>
            <h2 className="simulate-main-title">The Angle Engineering Laboratory</h2>
            <p className="simulate-tagline">
              Master the 4 core interactive stations to unlock the Global Landmark Challenge!
            </p>
          </div>

          {/* 4 Stations Hub Tabs */}
          <div className="simulate-stations-hub">
            {STATIONS.map((st, i) => {
              const isActive = i === stationIdx;
              const isDone = completedStations[i];
              return (
                <div
                  key={st.id}
                  className={`station-hub-card ${isActive ? 'is-active-station' : ''} ${isDone ? 'is-station-done' : ''}`}
                  onClick={() => {
                    setStationIdx(i);
                    narrate(simulateStationIntro(i), audioEnabled);
                  }}
                >
                  <div className="station-card-icon-row">
                    <span className="station-icon-badge">{st.icon}</span>
                    <span className="station-tag-label">{st.tag}</span>
                    {isDone && <CheckCircle size={16} className="done-check-icon" />}
                  </div>
                  <h4 className="station-hub-name">{st.name}</h4>
                  <p className="station-hub-desc">{st.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Transition Toast */}
        {transitionMsg && (
          <div className="station-jump-alert">
            <Sparkles size={20} color="#ffd54f" />
            <span>{transitionMsg}</span>
          </div>
        )}

        {/* Active Station Stage */}
        <div className="simulation-active-stage">
          {stationIdx === 0 && (
            <AngleLabStation
              audioEnabled={audioEnabled}
              onComplete={() => handleStationComplete(0)}
            />
          )}

          {stationIdx === 1 && (
            <TransversalStation
              audioEnabled={audioEnabled}
              onComplete={() => handleStationComplete(1)}
            />
          )}

          {stationIdx === 2 && (
            <SumLabStation
              audioEnabled={audioEnabled}
              onComplete={() => handleStationComplete(2)}
            />
          )}

          {stationIdx === 3 && (
            <EquationBuilderStation
              audioEnabled={audioEnabled}
              onComplete={() => handleStationComplete(3)}
            />
          )}
        </div>

        {/* Station Navigation Controls & Next Phase Button */}
        <div className="simulate-footer-row">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {stationIdx > 0 && (
              <button
                className="btn btn-secondary"
                onClick={() => {
                  const prev = stationIdx - 1;
                  setStationIdx(prev);
                  narrate(simulateStationIntro(prev), audioEnabled);
                }}
                style={{ padding: '8px 14px', fontSize: '0.85rem' }}
              >
                <ArrowLeft size={16} />
                <span>Prev Station</span>
              </button>
            )}

            {stationIdx < 3 && (
              <button
                className="btn btn-secondary"
                onClick={() => {
                  const nxt = stationIdx + 1;
                  setStationIdx(nxt);
                  narrate(simulateStationIntro(nxt), audioEnabled);
                }}
                style={{ padding: '8px 14px', fontSize: '0.85rem' }}
              >
                <span>Next Station ({STATIONS[stationIdx + 1].name})</span>
                <ArrowRight size={16} />
              </button>
            )}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#ffd54f', fontSize: '0.9rem' }}>
              {allDone ? (
                <>
                  <Sparkles size={18} />
                  <span>All 4 Stations Mastered! Lab Technician Badge Unlocked!</span>
                </>
              ) : (
                <span>Complete all 4 stations or proceed to practice anytime.</span>
              )}
            </div>

            <button className="btn btn-primary" onClick={onNext}>
              <span>Proceed to 100 Landmark Challenges</span>
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Full Completion Modal after Station 4 */}
      {showAllDoneModal && (
        <div className="phase-complete-modal-overlay">
          <div className="phase-complete-modal-content glass-card">
            <div style={{ fontSize: '3.2rem', marginBottom: 6 }}>🏆</div>
            <span className="phase-tag" style={{ color: '#00e676' }}>PHASE 3 COMPLETE</span>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', color: '#ffd54f', margin: '8px 0' }}>
              All 4 Angle Stations Mastered!
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', maxWidth: 440, margin: '0 auto 20px', lineHeight: 1.5 }}>
              You've conquered protractors, parallel line transversals, polygon angle sums, and algebraic equations! Ready to put your skills to the test across 10 global landmarks?
            </p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
              <button
                className="btn btn-secondary"
                onClick={() => setShowAllDoneModal(false)}
              >
                <span>Review Stations</span>
              </button>
              <button
                className="btn btn-primary"
                onClick={() => {
                  setShowAllDoneModal(false);
                  onNext();
                }}
                style={{ padding: '12px 24px', fontSize: '1rem' }}
              >
                <span>Start Practice Phase</span>
                <ArrowRight size={20} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
