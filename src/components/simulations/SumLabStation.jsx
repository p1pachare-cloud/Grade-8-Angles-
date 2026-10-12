import React, { useState } from 'react';
import { Check, Sparkles, Scissors, ArrowRight } from 'lucide-react';
import TriangleDiagram from '../shared/diagrams/TriangleDiagram';
import PolygonDiagram from '../shared/diagrams/PolygonDiagram';
import { polygonInteriorSum } from '../../engine/angleMath';
import { playChime, playBuzz, playClick } from '../../utils/audio';

export default function SumLabStation({ onComplete, audioEnabled }) {
  const [part, setPart] = useState(1); // 1 = triangle tear, 2 = exterior theorem, 3 = polygon splitter
  const [isTorn, setIsTorn] = useState(false);
  const [polySides, setPolySides] = useState(5);
  const [feedback, setFeedback] = useState(null);

  // Part 1: Tear triangle corners
  const handleTear = () => {
    playClick();
    setIsTorn(!isTorn);
    if (!isTorn) {
      playChime();
    }
  };

  const advancePart1 = () => {
    playChime();
    setPart(2);
  };

  const advancePart2 = () => {
    playChime();
    setPart(3);
  };

  const finishStationC = () => {
    playChime();
    onComplete();
  };

  return (
    <div className="station-container glass-card">
      <div className="station-header">
        <div>
          <span className="station-phase-tag">STATION C · PICTORIAL</span>
          <h3>Sum Lab — Triangles &amp; Polygon Angle Theorems</h3>
        </div>
        <div className="station-steps-pill">
          <span>Part {part} of 3</span>
        </div>
      </div>

      {part === 1 && (
        <div className="station-body-grid">
          <div className="station-control-panel">
            <h4 style={{ color: '#ffd54f' }}>Part 1: The Triangle Tear Proof</h4>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem' }}>
              Every triangle in geometry has three corners. Tear off the three corners and assemble them along a straight baseline!
            </p>

            <button className="btn btn-secondary" onClick={handleTear} style={{ marginTop: 12 }}>
              <Scissors size={18} />
              <span>{isTorn ? 'Reassemble Triangle' : 'Tear Corners & Line Up!'}</span>
            </button>

            {isTorn && (
              <div className="rule-showcase-box" style={{ marginTop: 16 }}>
                <div style={{ color: '#00e5ff', fontWeight: 800 }}>Discovery:</div>
                <div>The three vertices align seamlessly along a straight line. Thus: <strong>A + B + C = 180°</strong>!</div>
              </div>
            )}

            <button
              className="btn btn-primary"
              onClick={advancePart1}
              disabled={!isTorn}
              style={{ marginTop: 20 }}
            >
              <span>Continue to Exterior Angles</span>
              <ArrowRight size={18} />
            </button>
          </div>

          <div className="station-visual-stage">
            <TriangleDiagram isTorn={isTorn} />
          </div>
        </div>
      )}

      {part === 2 && (
        <div className="station-body-grid">
          <div className="station-control-panel">
            <h4 style={{ color: '#ffd54f' }}>Part 2: Exterior Angle Theorem</h4>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem' }}>
              Extend one base edge of a triangle outward. The exterior angle formed outside the triangle is equal to the sum of the two remote interior angles!
            </p>

            <div className="rule-showcase-box" style={{ marginTop: 14 }}>
              <div style={{ color: '#ff4081', fontWeight: 800 }}>Theorem:</div>
              <div>Exterior Angle = Remote Angle 1 + Remote Angle 2</div>
            </div>

            <button className="btn btn-primary" onClick={advancePart2} style={{ marginTop: 24 }}>
              <span>Continue to Polygon Slicer</span>
              <ArrowRight size={18} />
            </button>
          </div>

          <div className="station-visual-stage">
            <TriangleDiagram isTorn={false} showExterior={true} />
          </div>
        </div>
      )}

      {part === 3 && (
        <div className="station-body-grid">
          <div className="station-control-panel">
            <h4 style={{ color: '#ffd54f' }}>Part 3: Polygon Triangulation Slicer</h4>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem' }}>
              Select any polygon side count. Watch how drawing diagonals from a single vertex slices the shape into exactly <strong>(n − 2)</strong> triangles!
            </p>

            <div style={{ marginTop: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: 6 }}>
                <span>Polygon Sides:</span>
                <span style={{ color: '#00e5ff', fontWeight: 800 }}>{polySides} sides</span>
              </div>
              <input
                type="range"
                min="4"
                max="10"
                value={polySides}
                onChange={(e) => {
                  playClick();
                  setPolySides(Number(e.target.value));
                }}
                className="custom-range-slider"
              />
            </div>

            <div className="rule-showcase-box" style={{ marginTop: 14 }}>
              <div style={{ color: '#ffd54f', fontWeight: 800 }}>Angle Sum Formula:</div>
              <div>
                ({polySides} − 2) × 180° = <strong>{polygonInteriorSum(polySides)}°</strong> total!
              </div>
            </div>

            <button className="btn btn-primary" onClick={finishStationC} style={{ marginTop: 22 }}>
              <Check size={18} />
              <span>Complete Station C</span>
            </button>
          </div>

          <div className="station-visual-stage">
            <PolygonDiagram n={polySides} showTriangulation={true} />
          </div>
        </div>
      )}
    </div>
  );
}
