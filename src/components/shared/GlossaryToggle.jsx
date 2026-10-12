import React from 'react';
import { Globe } from 'lucide-react';

export default function GlossaryToggle({ value = 'neutral', onChange }) {
  const regions = [
    { id: 'neutral', label: 'Neutral / Global' },
    { id: 'us', label: 'US (Common Core)' },
    { id: 'uk', label: 'UK (Key Stage 3)' },
    { id: 'sg', label: 'Singapore (MOE)' },
    { id: 'in', label: 'India (CBSE/NCERT)' },
  ];

  return (
    <div className="glossary-pill-container" title="Select School Terminology Dialect">
      <Globe size={15} color="#00e5ff" />
      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>School Terms:</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="glossary-select"
      >
        {regions.map((r) => (
          <option key={r.id} value={r.id} style={{ background: '#1a1a5e', color: '#fff' }}>
            {r.label}
          </option>
        ))}
      </select>
    </div>
  );
}
