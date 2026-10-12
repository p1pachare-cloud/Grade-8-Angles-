import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { ArrowRight, CheckCircle, Sparkles } from 'lucide-react';
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

  const handleStationComplete = (index) => {
    const updated = [...completedStations];
    updated[index] = true;
    if (setCompletedStations) setCompletedStations(updated);

    if (index < 3) {
      setStationIdx(index + 1);
      narrate(simulateStationIntro(index + 1), audioEnabled);
    } else {
      try {
        confetti({
          particleCount: 80,
          spread: 80,
          origin: { y: 0.5 },
        });
      } catch (e) {}
      if (onSimulationsComplete) onSimulationsComplete();
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

        {/* Footer Next Button */}
        <div className="simulate-footer-row">
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
  );
}
