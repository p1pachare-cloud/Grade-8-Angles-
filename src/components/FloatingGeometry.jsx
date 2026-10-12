import React from 'react';

const FLOATING_ITEMS = [
  { symbol: '∠ABC', top: '12%', left: '8%', delay: '0s', dur: '22s' },
  { symbol: '180°', top: '25%', left: '88%', delay: '4s', dur: '26s' },
  { symbol: '360°', top: '75%', left: '6%', delay: '2s', dur: '24s' },
  { symbol: 'θ', top: '65%', left: '92%', delay: '6s', dur: '20s' },
  { symbol: '90°', top: '42%', left: '4%', delay: '8s', dur: '28s' },
  { symbol: '∥', top: '85%', left: '78%', delay: '5s', dur: '25s' },
  { symbol: 'x°', top: '18%', left: '72%', delay: '3s', dur: '23s' },
  { symbol: '△ABC', top: '48%', left: '94%', delay: '7s', dur: '27s' },
];

export default function FloatingGeometry() {
  return (
    <div className="floating-numbers" aria-hidden="true">
      {FLOATING_ITEMS.map((item, idx) => (
        <div
          key={idx}
          className="floating-number"
          style={{
            top: item.top,
            left: item.left,
            animationDelay: item.delay,
            animationDuration: item.dur,
          }}
        >
          {item.symbol}
        </div>
      ))}
    </div>
  );
}
