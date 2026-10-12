import React from 'react';
import { regularPolygonPoints, polygonInteriorSum } from '../../../engine/angleMath';

export default function PolygonDiagram({
  n = 5,
  showTriangulation = true,
  width = 340,
  height = 280,
}) {
  const cx = width / 2;
  const cy = height / 2;
  const pts = regularPolygonPoints(n, cx, cy, 105);

  const triangleCount = n - 2;
  const totalSum = polygonInteriorSum(n);

  return (
    <div className="polygon-diagram-wrapper" style={{ width, height, position: 'relative' }}>
      <svg viewBox={`0 0 ${width} ${height}`} width="100%" height="100%">
        <defs>
          <linearGradient id="polyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(0, 229, 255, 0.2)" />
            <stop offset="100%" stopColor="rgba(124, 92, 191, 0.3)" />
          </linearGradient>
        </defs>

        {/* Polygon perimeter */}
        <polygon
          points={pts.map((p) => `${p.x},${p.y}`).join(' ')}
          fill="url(#polyGrad)"
          stroke="#00e5ff"
          strokeWidth="3.5"
          strokeLinejoin="round"
        />

        {/* Diagonals from Vertex 0 splitting into n - 2 triangles */}
        {showTriangulation &&
          Array.from({ length: n - 3 }).map((_, i) => {
            const targetIdx = i + 2;
            return (
              <line
                key={i}
                x1={pts[0].x}
                y1={pts[0].y}
                x2={pts[targetIdx].x}
                y2={pts[targetIdx].y}
                stroke="#ffd54f"
                strokeWidth="2.5"
                strokeDasharray="4,4"
              />
            );
          })}

        {/* Vertices */}
        {pts.map((p, i) => (
          <circle
            key={i}
            cx={p.x}
            cy={p.y}
            r="5"
            fill={i === 0 ? '#ff4081' : '#ffd54f'}
            stroke="#ffffff"
            strokeWidth="1.8"
          />
        ))}

        {/* Center triangulation label */}
        <text
          x={cx}
          y={cy + 8}
          fill="#ffffff"
          fontSize="14"
          fontWeight="800"
          fontFamily="var(--font-display)"
          textAnchor="middle"
        >
          {triangleCount} Triangles × 180° = {totalSum}°
        </text>
      </svg>
    </div>
  );
}
