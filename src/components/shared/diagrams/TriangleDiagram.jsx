import React from 'react';

export default function TriangleDiagram({
  vertices = [
    { x: 160, y: 55 },
    { x: 50, y: 220 },
    { x: 270, y: 220 },
  ],
  isTorn = false,
  showExterior = false,
  width = 340,
  height = 260,
}) {
  const [A, B, C] = vertices;

  // Compute angles
  const dist = (p1, p2) => Math.hypot(p1.x - p2.x, p1.y - p2.y);
  const a = dist(B, C);
  const b = dist(A, C);
  const c = dist(A, B);

  const angleA = Math.round(
    (Math.acos((b * b + c * c - a * a) / (2 * b * c || 1)) * 180) / Math.PI
  );
  const angleB = Math.round(
    (Math.acos((a * a + c * c - b * b) / (2 * a * c || 1)) * 180) / Math.PI
  );
  const angleC = 180 - angleA - angleB;

  return (
    <div className="triangle-diagram-wrapper" style={{ width, height, position: 'relative' }}>
      <svg viewBox={`0 0 ${width} ${height}`} width="100%" height="100%">
        <defs>
          <linearGradient id="triFill" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(0, 229, 255, 0.2)" />
            <stop offset="100%" stopColor="rgba(124, 92, 191, 0.3)" />
          </linearGradient>
        </defs>

        {!isTorn ? (
          <>
            {/* Triangle polygon */}
            <polygon
              points={`${A.x},${A.y} ${B.x},${B.y} ${C.x},${C.y}`}
              fill="url(#triFill)"
              stroke="#00e5ff"
              strokeWidth="3.5"
              strokeLinejoin="round"
            />

            {/* Vertices handles */}
            {[A, B, C].map((pt, i) => (
              <circle
                key={i}
                cx={pt.x}
                cy={pt.y}
                r="6"
                fill="#ffd54f"
                stroke="#ffffff"
                strokeWidth="2"
              />
            ))}

            {/* Exterior line extension if enabled */}
            {showExterior && (
              <>
                <line
                  x1={C.x}
                  y1={C.y}
                  x2={C.x + 65}
                  y2={C.y}
                  stroke="#ff4081"
                  strokeWidth="3"
                  strokeDasharray="4,4"
                />
                <circle cx={C.x + 25} cy={C.y - 12} r="14" fill="rgba(255, 64, 129, 0.3)" stroke="#ff4081" />
                <text x={C.x + 25} y={C.y - 8} fill="#ff4081" fontSize="11" fontWeight="800" textAnchor="middle">
                  {angleA + angleB}°
                </text>
              </>
            )}

            {/* Corner Angle Badges */}
            <text x={A.x} y={A.y + 26} fill="#ffd54f" fontSize="12" fontWeight="800" textAnchor="middle">
              {angleA}°
            </text>
            <text x={B.x + 26} y={B.y - 10} fill="#ffd54f" fontSize="12" fontWeight="800" textAnchor="middle">
              {angleB}°
            </text>
            <text x={C.x - 26} y={C.y - 10} fill="#ffd54f" fontSize="12" fontWeight="800" textAnchor="middle">
              {angleC}°
            </text>
          </>
        ) : (
          /* Torn Corners Lined Up on Straight Line */
          <g>
            <line
              x1={30}
              y1={170}
              x2={310}
              y2={170}
              stroke="#ffd54f"
              strokeWidth="4"
              strokeLinecap="round"
            />
            {/* Sector A */}
            <path
              d="M 110 170 A 55 55 0 0 1 170 170 Z"
              fill="#00e5ff"
              opacity="0.8"
              stroke="#ffffff"
              strokeWidth="2"
            />
            {/* Sector B */}
            <path
              d="M 170 170 A 55 55 0 0 1 230 170 Z"
              fill="#ff4081"
              opacity="0.8"
              stroke="#ffffff"
              strokeWidth="2"
            />
            {/* Sector C */}
            <path
              d="M 50 170 A 55 55 0 0 1 110 170 Z"
              fill="#00e676"
              opacity="0.8"
              stroke="#ffffff"
              strokeWidth="2"
            />
            <text x={80} y={150} fill="#ffffff" fontSize="12" fontWeight="800" textAnchor="middle">
              {angleA}°
            </text>
            <text x={140} y={145} fill="#ffffff" fontSize="12" fontWeight="800" textAnchor="middle">
              {angleB}°
            </text>
            <text x={200} y={150} fill="#ffffff" fontSize="12" fontWeight="800" textAnchor="middle">
              {angleC}°
            </text>

            <text x={170} y={215} fill="#ffd54f" fontSize="16" fontWeight="900" textAnchor="middle" fontFamily="var(--font-display)">
              Total on Straight Line = 180°!
            </text>
          </g>
        )}
      </svg>
    </div>
  );
}
