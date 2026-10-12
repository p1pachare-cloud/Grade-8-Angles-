import React, { useRef, useState, useCallback, useEffect } from 'react';
import { IDS, angleValue, valueRelation } from '../../../engine/transversal';

export default function TransversalDiagram({
  theta = 65,
  onChangeTheta,
  selected = [],
  onSelectAngle,
  mode = 'explore',
  targetAngleId = null,
  activeAngleId = null,
  width = 360,
  height = 300,
}) {
  const [isDraggingSlope, setIsDraggingSlope] = useState(false);
  const svgRef = useRef(null);

  const cx = width / 2;
  const topY = 95;
  const botY = 205;

  // Transversal slope angle (in degrees from horizontal)
  // When theta is 65°, angle of line is ~65°
  const lineDx = 140;
  const topX = cx;
  const botX = cx;

  const rad = (theta * Math.PI) / 180;
  const offsetDx = (botY - topY) / (2 * Math.tan(rad) || 1);

  const tX1 = cx - offsetDx - 40;
  const tY1 = botY + 45;
  const tX2 = cx + offsetDx + 40;
  const tY2 = topY - 45;

  // Handle transversal dragging
  const handlePointer = useCallback(
    (e) => {
      if (!onChangeTheta || !svgRef.current) return;
      const rect = svgRef.current.getBoundingClientRect();
      const clientX = e.touches && e.touches.length > 0 ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches && e.touches.length > 0 ? e.touches[0].clientY : e.clientY;

      if (!rect.width || !rect.height) return;

      const scaleX = width / rect.width;
      const scaleY = height / rect.height;

      const px = (clientX - rect.left) * scaleX;
      const py = (clientY - rect.top) * scaleY;

      // Calculate angle of transversal through center (cx, (topY+botY)/2)
      const cyCenter = (topY + botY) / 2;
      const dx = px - cx;
      const dy = cyCenter - py;

      let deg = Math.round((Math.atan2(dy, dx) * 180) / Math.PI);
      if (deg < 30) deg = 30;
      if (deg > 150) deg = 150;
      onChangeTheta(deg);
    },
    [cx, onChangeTheta, topY, botY, width, height]
  );

  useEffect(() => {
    const onMove = (e) => {
      if (isDraggingSlope) handlePointer(e);
    };
    const onUp = () => setIsDraggingSlope(false);
    if (isDraggingSlope) {
      window.addEventListener('pointermove', onMove);
      window.addEventListener('pointerup', onUp);
    }
    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
    };
  }, [isDraggingSlope, handlePointer]);

  // Sector coordinates for the 8 angles
  const getAngleCoords = (id) => {
    const isTop = id.startsWith('T');
    const yCenter = isTop ? topY : botY;
    const xCenter = isTop ? cx + offsetDx * 0.4 : cx - offsetDx * 0.4;
    const quad = id.split('.')[1];

    const dx = quad.includes('R') ? 22 : -22;
    const dy = quad.includes('U') ? -18 : 18;

    return { x: xCenter + dx, y: yCenter + dy };
  };

  const getAngleColor = (id) => {
    if (selected.includes(id)) return '#ffd54f';
    if (id === activeAngleId) return '#00e5ff';

    if (activeAngleId && mode === 'explore') {
      const rel = valueRelation(activeAngleId, id, theta);
      if (rel === 'equal') return '#00e676'; // green for equal
      if (rel === 'supplementary') return '#ff9800'; // amber for supplementary
    }

    return 'rgba(255, 255, 255, 0.7)';
  };

  return (
    <div className="transversal-diagram-box" style={{ width, height, position: 'relative' }}>
      <svg
        ref={svgRef}
        viewBox={`0 0 ${width} ${height}`}
        width="100%"
        height="100%"
      >
        <defs>
          <filter id="tglow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Top Parallel Line */}
        <line
          x1={cx - lineDx}
          y1={topY}
          x2={cx + lineDx}
          y2={topY}
          stroke="#00e5ff"
          strokeWidth="3.5"
          strokeLinecap="round"
        />
        {/* Parallel Arrow Marker Top */}
        <path
          d={`M ${cx - 50} ${topY - 6} L ${cx - 40} ${topY} L ${cx - 50} ${topY + 6}`}
          fill="none"
          stroke="#ffd54f"
          strokeWidth="2.5"
        />

        {/* Bottom Parallel Line */}
        <line
          x1={cx - lineDx}
          y1={botY}
          x2={cx + lineDx}
          y2={botY}
          stroke="#00e5ff"
          strokeWidth="3.5"
          strokeLinecap="round"
        />
        {/* Parallel Arrow Marker Bottom */}
        <path
          d={`M ${cx - 50} ${botY - 6} L ${cx - 40} ${botY} L ${cx - 50} ${botY + 6}`}
          fill="none"
          stroke="#ffd54f"
          strokeWidth="2.5"
        />

        {/* Transversal Line */}
        <line
          x1={tX1}
          y1={tY1}
          x2={tX2}
          y2={tY2}
          stroke="#ff4081"
          strokeWidth="4"
          strokeLinecap="round"
        />

        {/* Draggable Handle at Top of Transversal */}
        {onChangeTheta && (
          <circle
            cx={tX2}
            cy={tY2}
            r="11"
            fill="#ff4081"
            stroke="#ffffff"
            strokeWidth="2.5"
            style={{ cursor: 'grab', filter: 'drop-shadow(0 0 6px #ff4081)' }}
            onPointerDown={() => setIsDraggingSlope(true)}
          />
        )}

        {/* 8 Clickable Angle Markers */}
        {IDS.map((id) => {
          const pos = getAngleCoords(id);
          const val = angleValue(id, theta);
          const color = getAngleColor(id);
          const isTarget = id === targetAngleId;
          const isSelected = selected.includes(id) || id === activeAngleId;

          return (
            <g
              key={id}
              onClick={() => onSelectAngle && onSelectAngle(id)}
              style={{ cursor: onSelectAngle ? 'pointer' : 'default' }}
            >
              <circle
                cx={pos.x}
                cy={pos.y}
                r="16"
                fill={isSelected ? color : 'rgba(26, 26, 94, 0.85)'}
                stroke={color}
                strokeWidth={isTarget ? 3 : 1.8}
                filter={isSelected ? 'url(#tglow)' : undefined}
              />
              <text
                x={pos.x}
                y={pos.y + 4}
                fill={isSelected ? '#0a0a2e' : '#ffffff'}
                fontSize="11"
                fontWeight="800"
                fontFamily="var(--font-display)"
                textAnchor="middle"
              >
                {val}°
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
