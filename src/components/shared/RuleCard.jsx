import React from 'react';

export default function RuleCard({ rule, isSelected, onClick, selectable = false }) {
  if (!rule) return null;
  return (
    <div
      className={`rule-card-chip ${isSelected ? 'selected' : ''} ${selectable ? 'selectable' : ''}`}
      onClick={selectable && onClick ? onClick : undefined}
      style={{
        borderLeft: `4px solid ${rule.color || '#00e5ff'}`,
        cursor: selectable ? 'pointer' : 'default',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ fontSize: '1.2rem' }}>{rule.icon || '📐'}</span>
        <h4 style={{ fontFamily: 'var(--font-display)', margin: 0, color: '#ffffff', fontSize: '0.95rem' }}>
          {rule.title}
        </h4>
      </div>
      <div style={{ color: rule.color || '#ffd54f', fontWeight: 800, fontSize: '0.85rem', marginTop: 4 }}>
        {rule.formula}
      </div>
      <p style={{ margin: '4px 0 0', fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
        {rule.description}
      </p>
    </div>
  );
}
