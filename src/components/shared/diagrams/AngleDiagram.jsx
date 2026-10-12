import React from 'react';
import { polarToCartesian, regularPolygonPoints } from '../../../engine/angleMath';

export default function AngleDiagram({ figure, notToScale = true, width = 320, height = 300 }) {
  if (!figure) return null;

  const cx = width / 2;
  const cy = height / 2;
  const kind = figure.kind || 'angle';

  return (
    <div className="angle-diagram-wrapper" style={{ width, height, position: 'relative' }}>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        width="100%"
        height="100%"
        className="angle-diagram-svg"
      >
        <defs>
          <filter id="diagramGlow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* 1. Angle / Rays */}
        {kind === 'angle' && (
          <g>
            <circle cx={cx} cy={cy} r="4" fill="#ffd54f" />
            {(figure.rays || [0, 60]).map((deg, i) => {
              const pt = polarToCartesian(cx, cy, 110, -deg);
              return (
                <line
                  key={i}
                  x1={cx}
                  y1={cy}
                  x2={pt.x}
                  y2={pt.y}
                  stroke="#00e5ff"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                />
              );
            })}
            {/* Angle Arc */}
            <circle
              cx={cx}
              cy={cy}
              r="34"
              fill="none"
              stroke="#ffd54f"
              strokeWidth="2"
              strokeDasharray="4,4"
            />
            {/* Labels */}
            {(figure.labels || []).map((lbl, idx) => (
              <text
                key={idx}
                x={cx + 45}
                y={cy - 20 - idx * 20}
                fill={lbl.unknown ? '#ff7043' : '#ffd54f'}
                fontWeight="800"
                fontSize="16"
                fontFamily="var(--font-display)"
              >
                {lbl.text}
              </text>
            ))}
          </g>
        )}

        {/* 2. Crossing Lines (Vertical / Adjacent) */}
        {kind === 'cross' && (
          <g>
            {/* Line 1: Horizontal */}
            <line
              x1={cx - 130}
              y1={cy}
              x2={cx + 130}
              y2={cy}
              stroke="#00e5ff"
              strokeWidth="3.5"
              strokeLinecap="round"
            />
            {/* Line 2: Diagonal */}
            <line
              x1={cx - 95}
              y1={cy + 95}
              x2={cx + 95}
              y2={cy - 95}
              stroke="#7c5cbf"
              strokeWidth="3.5"
              strokeLinecap="round"
            />
            <circle cx={cx} cy={cy} r="4.5" fill="#ffd54f" />
            {/* Labels */}
            {(figure.labels || []).map((lbl, idx) => {
              const pos =
                idx === 0
                  ? { x: cx + 45, y: cy - 25 }
                  : { x: cx - 45, y: cy + 35 };
              return (
                <text
                  key={idx}
                  x={pos.x}
                  y={pos.y}
                  fill={lbl.unknown ? '#ff7043' : '#ffd54f'}
                  fontWeight="800"
                  fontSize="16"
                  fontFamily="var(--font-display)"
                  textAnchor="middle"
                >
                  {lbl.text}
                </text>
              );
            })}
          </g>
        )}

        {/* 3. Straight Line with Rays */}
        {kind === 'line' && (
          <g>
            <line
              x1={cx - 130}
              y1={cy + 30}
              x2={cx + 130}
              y2={cy + 30}
              stroke="#00e5ff"
              strokeWidth="3.5"
              strokeLinecap="round"
            />
            <line
              x1={cx}
              y1={cy + 30}
              x2={cx + 50}
              y2={cy - 85}
              stroke="#ff4081"
              strokeWidth="3.5"
              strokeLinecap="round"
            />
            <circle cx={cx} cy={cy + 30} r="4.5" fill="#ffd54f" />
            {(figure.labels || []).map((lbl, idx) => {
              const xPos = idx === 0 ? cx + 35 : cx - 45;
              return (
                <text
                  key={idx}
                  x={xPos}
                  y={cy + 15}
                  fill={lbl.unknown ? '#ff7043' : '#ffd54f'}
                  fontWeight="800"
                  fontSize="15"
                  fontFamily="var(--font-display)"
                  textAnchor="middle"
                >
                  {lbl.text}
                </text>
              );
            })}
          </g>
        )}

        {/* 4. Around a Point */}
        {kind === 'point' && (
          <g>
            <circle cx={cx} cy={cy} r="5" fill="#ffd54f" filter="url(#diagramGlow)" />
            {(figure.rays || [0, 90, 200]).map((deg, i) => {
              const pt = polarToCartesian(cx, cy, 105, -deg);
              return (
                <line
                  key={i}
                  x1={cx}
                  y1={cy}
                  x2={pt.x}
                  y2={pt.y}
                  stroke="#00e5ff"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              );
            })}
            {(figure.labels || []).map((lbl, idx) => (
              <text
                key={idx}
                x={cx + (idx % 2 === 0 ? 35 : -45)}
                y={cy + (idx < 2 ? -25 : 35)}
                fill={lbl.unknown ? '#ff7043' : '#ffd54f'}
                fontWeight="800"
                fontSize="15"
                fontFamily="var(--font-display)"
                textAnchor="middle"
              >
                {lbl.text}
              </text>
            ))}
          </g>
        )}

        {/* 5. Transversal on Parallel Lines */}
        {kind === 'transversal' && (
          <g transform={`rotate(${figure.rotation || 0} ${cx} ${cy})`}>
            {/* Top Parallel Line */}
            <line
              x1={cx - 130}
              y1={cy - 45}
              x2={cx + 130}
              y2={cy - 45}
              stroke="#00e5ff"
              strokeWidth="3.5"
              strokeLinecap="round"
            />
            {/* Bottom Parallel Line */}
            <line
              x1={cx - 130}
              y1={cy + 45}
              x2={cx + 130}
              y2={cy + 45}
              stroke="#00e5ff"
              strokeWidth="3.5"
              strokeLinecap="round"
            />
            {/* Parallel Marks > > */}
            <path d={`M ${cx - 50} ${cy - 50} L ${cx - 40} ${cy - 45} L ${cx - 50} ${cy - 40}`} fill="none" stroke="#ffd54f" strokeWidth="2.5" />
            <path d={`M ${cx - 50} ${cy + 40} L ${cx - 40} ${cy + 45} L ${cx - 50} ${cy + 50}`} fill="none" stroke="#ffd54f" strokeWidth="2.5" />

            {/* Transversal Line */}
            <line
              x1={cx - 70}
              y1={cy + 110}
              x2={cx + 70}
              y2={cy - 110}
              stroke="#ff4081"
              strokeWidth="3.5"
              strokeLinecap="round"
            />
            {(figure.labels || []).map((lbl, idx) => {
              const isTop = (lbl.at || '').startsWith('T') || idx === 0;
              return (
                <text
                  key={idx}
                  x={cx + (isTop ? 28 : -28)}
                  y={isTop ? cy - 55 : cy + 65}
                  fill={lbl.unknown ? '#ff7043' : '#ffd54f'}
                  fontWeight="800"
                  fontSize="15"
                  fontFamily="var(--font-display)"
                  textAnchor="middle"
                >
                  {lbl.text}
                </text>
              );
            })}
          </g>
        )}

        {/* 6. Triangle & Exterior */}
        {kind === 'triangle' && (
          <g>
            <polygon
              points={`${cx},${cy - 80} ${cx - 95},${cy + 65} ${cx + 75},${cy + 65}`}
              fill="rgba(63, 81, 181, 0.25)"
              stroke="#00e5ff"
              strokeWidth="3"
              strokeLinejoin="round"
            />
            {figure.extend && (
              <line
                x1={cx + 75}
                y1={cy + 65}
                x2={cx + 140}
                y2={cy + 65}
                stroke="#ff4081"
                strokeWidth="3"
                strokeDasharray="4,4"
              />
            )}
            {(figure.labels || []).map((lbl, idx) => {
              const pos =
                idx === 0
                  ? { x: cx, y: cy - 90 }
                  : idx === 1
                  ? { x: cx - 75, y: cy + 50 }
                  : { x: cx + (figure.extend ? 105 : 60), y: cy + (figure.extend ? 55 : 50) };
              return (
                <text
                  key={idx}
                  x={pos.x}
                  y={pos.y}
                  fill={lbl.unknown ? '#ff7043' : '#ffd54f'}
                  fontWeight="800"
                  fontSize="15"
                  fontFamily="var(--font-display)"
                  textAnchor="middle"
                >
                  {lbl.text}
                </text>
              );
            })}
          </g>
        )}

        {/* 7. Polygon (Regular or n-gon) */}
        {(kind === 'polygon' || kind === 'quad') && (
          <g>
            {(() => {
              const n = kind === 'quad' ? 4 : figure.n || 5;
              const pts = regularPolygonPoints(n, cx, cy, 95);
              return (
                <>
                  <polygon
                    points={pts.map((p) => `${p.x},${p.y}`).join(' ')}
                    fill="rgba(124, 92, 191, 0.25)"
                    stroke="#00e5ff"
                    strokeWidth="3"
                    strokeLinejoin="round"
                  />
                  {pts.map((p, i) => (
                    <circle key={i} cx={p.x} cy={p.y} r="3.5" fill="#ffd54f" />
                  ))}
                  {(figure.labels || []).map((lbl, idx) => (
                    <text
                      key={idx}
                      x={cx}
                      y={cy + 6}
                      fill={lbl.unknown ? '#ff7043' : '#ffd54f'}
                      fontWeight="800"
                      fontSize="16"
                      fontFamily="var(--font-display)"
                      textAnchor="middle"
                    >
                      {lbl.text}
                    </text>
                  ))}
                </>
              );
            })()}
          </g>
        )}
      </svg>

      {notToScale && (
        <div className="not-to-scale-badge">
          <span>* Diagram not accurately drawn</span>
        </div>
      )}
    </div>
  );
}
