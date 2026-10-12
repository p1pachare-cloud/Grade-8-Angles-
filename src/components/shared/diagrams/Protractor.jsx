import React, { useRef, useState, useCallback, useEffect } from 'react';
import { polarToCartesian } from '../../../engine/angleMath';

export default function Protractor({
  angle = 45,
  onChange,
  step = 1,
  snap = true,
  targetAngle = null,
  readOnly = false,
  width = 340,
  height = 240,
}) {
  const svgRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  const cx = width / 2;
  const cy = height - 35;
  const radius = 135;

  const handlePointer = useCallback(
    (e) => {
      if (readOnly || !onChange || !svgRef.current) return;
      const rect = svgRef.current.getBoundingClientRect();
      const clientX = e.touches && e.touches.length > 0 ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches && e.touches.length > 0 ? e.touches[0].clientY : e.clientY;

      if (!rect.width || !rect.height) return;

      const scaleX = width / rect.width;
      const scaleY = height / rect.height;

      const svgX = (clientX - rect.left) * scaleX;
      const svgY = (clientY - rect.top) * scaleY;

      const x = svgX - cx;
      const y = cy - svgY;

      let rad = Math.atan2(y, x);
      let deg = Math.round((rad * 180) / Math.PI);
      if (deg < 0) {
        deg = x >= 0 ? 0 : 180;
      }
      if (deg > 180) deg = 180;

      if (snap) {
        deg = Math.round(deg / step) * step;
      }
      onChange(deg);
    },
    [cx, cy, height, onChange, readOnly, snap, step, width]
  );

  const onPointerDown = (e) => {
    if (readOnly) return;
    setIsDragging(true);
    handlePointer(e);
  };

  useEffect(() => {
    const handleMove = (e) => {
      if (isDragging) handlePointer(e);
    };
    const handleUp = () => setIsDragging(false);

    if (isDragging) {
      window.addEventListener('pointermove', handleMove);
      window.addEventListener('pointerup', handleUp);
      window.addEventListener('touchmove', handleMove, { passive: false });
      window.addEventListener('touchend', handleUp);
    }
    return () => {
      window.removeEventListener('pointermove', handleMove);
      window.removeEventListener('pointerup', handleUp);
      window.removeEventListener('touchmove', handleMove);
      window.removeEventListener('touchend', handleUp);
    };
  }, [isDragging, handlePointer]);

  const adjustAngle = (delta) => {
    if (readOnly || !onChange) return;
    const next = Math.max(0, Math.min(180, angle + delta));
    onChange(next);
  };

  // Current movable arm endpoint (positive angle points upward into protractor dome)
  const rayPt = polarToCartesian(cx, cy, radius, angle);
  const targetPt = targetAngle !== null ? polarToCartesian(cx, cy, radius, targetAngle) : null;

  return (
    <div className="protractor-container" style={{ width: '100%', maxWidth: width, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <svg
        ref={svgRef}
        viewBox={`0 0 ${width} ${height}`}
        width="100%"
        height={height}
        onPointerDown={onPointerDown}
        style={{ cursor: readOnly ? 'default' : 'pointer', touchAction: 'none', display: 'block' }}
      >
        <defs>
          <linearGradient id="protractorBodyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(0, 229, 255, 0.15)" />
            <stop offset="100%" stopColor="rgba(124, 92, 191, 0.25)" />
          </linearGradient>
        </defs>

        {/* Semi-circular Protractor Body */}
        <path
          d={`M ${cx - radius} ${cy} A ${radius} ${radius} 0 0 1 ${cx + radius} ${cy} Z`}
          fill="url(#protractorBodyGrad)"
          stroke="#00e5ff"
          strokeWidth="2.5"
        />

        {/* Inner transparent window */}
        <path
          d={`M ${cx - 55} ${cy} A 55 55 0 0 1 ${cx + 55} ${cy} Z`}
          fill="rgba(10, 10, 46, 0.7)"
          stroke="rgba(255, 255, 255, 0.25)"
          strokeWidth="1.5"
        />

        {/* Degree Ticks (Every 10° and 5°) */}
        {Array.from({ length: 19 }).map((_, i) => {
          const deg = i * 10;
          const outer = polarToCartesian(cx, cy, radius, deg);
          const inner = polarToCartesian(cx, cy, radius - (deg % 30 === 0 ? 14 : 8), deg);
          const labelPt = polarToCartesian(cx, cy, radius - 24, deg);

          return (
            <g key={i}>
              <line
                x1={inner.x}
                y1={inner.y}
                x2={outer.x}
                y2={outer.y}
                stroke={deg % 90 === 0 ? '#ffd54f' : 'rgba(255, 255, 255, 0.6)'}
                strokeWidth={deg % 90 === 0 ? '2' : '1'}
              />
              {deg % 30 === 0 && (
                <text
                  x={labelPt.x}
                  y={labelPt.y + 4}
                  fill="rgba(255, 255, 255, 0.85)"
                  fontSize="10"
                  fontWeight="700"
                  textAnchor="middle"
                >
                  {deg}
                </text>
              )}
            </g>
          );
        })}

        {/* Target Angle Ghost Ray (if given) */}
        {targetPt && (
          <line
            x1={cx}
            y1={cy}
            x2={targetPt.x}
            y2={targetPt.y}
            stroke="#ff4081"
            strokeWidth="3"
            strokeDasharray="4,4"
          />
        )}

        {/* Base Fixed Ray (0° horizontal) */}
        <line
          x1={cx}
          y1={cy}
          x2={cx + radius}
          y2={cy}
          stroke="#00e5ff"
          strokeWidth="3.5"
          strokeLinecap="round"
        />

        {/* Movable Arm Ray */}
        <line
          x1={cx}
          y1={cy}
          x2={rayPt.x}
          y2={rayPt.y}
          stroke="#ffd54f"
          strokeWidth="4"
          strokeLinecap="round"
        />

        {/* Draggable Handle on End */}
        {!readOnly && (
          <circle
            cx={rayPt.x}
            cy={rayPt.y}
            r="12"
            fill="#ffd54f"
            stroke="#ffffff"
            strokeWidth="2.5"
            style={{ filter: 'drop-shadow(0 0 6px rgba(255, 213, 79, 0.8))' }}
          />
        )}

        {/* Center Pivot Point */}
        <circle cx={cx} cy={cy} r="5" fill="#ffffff" stroke="#3f51b5" strokeWidth="2" />
      </svg>

      {/* Live Readout Badge & Fine Controls */}
      <div className="protractor-readout-badge" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, marginTop: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ color: '#ffd54f', fontWeight: 800, fontSize: '1.25rem' }}>
            {angle}°
          </span>
          {targetAngle !== null && (
            <span style={{ fontSize: '0.85rem', color: Math.abs(angle - targetAngle) <= 2 ? '#00e676' : 'rgba(255,255,255,0.6)' }}>
              (Target: {targetAngle}°)
            </span>
          )}
        </div>

        {!readOnly && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 2 }}>
            <button
              type="button"
              onClick={() => adjustAngle(-5)}
              title="-5 degrees"
              style={{ padding: '3px 8px', fontSize: '0.78rem', fontWeight: 'bold', borderRadius: 6, background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.25)', color: '#fff', cursor: 'pointer' }}
            >
              −5°
            </button>
            <button
              type="button"
              onClick={() => adjustAngle(-1)}
              title="-1 degree"
              style={{ padding: '3px 8px', fontSize: '0.78rem', fontWeight: 'bold', borderRadius: 6, background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.25)', color: '#fff', cursor: 'pointer' }}
            >
              −1°
            </button>
            <button
              type="button"
              onClick={() => adjustAngle(1)}
              title="+1 degree"
              style={{ padding: '3px 8px', fontSize: '0.78rem', fontWeight: 'bold', borderRadius: 6, background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.25)', color: '#fff', cursor: 'pointer' }}
            >
              +1°
            </button>
            <button
              type="button"
              onClick={() => adjustAngle(5)}
              title="+5 degrees"
              style={{ padding: '3px 8px', fontSize: '0.78rem', fontWeight: 'bold', borderRadius: 6, background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.25)', color: '#fff', cursor: 'pointer' }}
            >
              +5°
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
