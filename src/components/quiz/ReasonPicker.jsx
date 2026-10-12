import React, { useState } from 'react';
import { HelpCircle, Check, Award } from 'lucide-react';
import { playClick } from '../../utils/audio';

export default function ReasonPicker({ reason, onPickReason }) {
  const [selectedId, setSelectedId] = useState(null);

  if (!reason) return null;

  const handleSelect = (rId) => {
    playClick();
    setSelectedId(rId);
  };

  const handleConfirm = () => {
    if (selectedId) {
      onPickReason(selectedId);
    }
  };

  return (
    <div className="reason-picker-modal glass-card">
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
        <Award size={20} color="#ffd54f" />
        <h4 style={{ fontFamily: 'var(--font-display)', color: '#ffd54f', margin: 0, fontSize: '1.15rem' }}>
          Step 2: Justify Your Answer (+3 XP Bonus!)
        </h4>
      </div>
      <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', marginBottom: 14 }}>
        {reason.prompt || 'Which geometric rule justifies this angle?'}
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {(reason.options || []).map((opt) => {
          const optId = typeof opt === 'object' ? opt.id : opt;
          const optLabel = typeof opt === 'object' ? opt.label : opt;
          const isSelected = selectedId === optId;

          return (
            <button
              key={optId}
              className={`mcq-option-btn ${isSelected ? 'selected' : ''}`}
              onClick={() => handleSelect(optId)}
              style={{ textAlign: 'left', padding: '10px 14px' }}
            >
              <span>{optLabel}</span>
            </button>
          );
        })}
      </div>

      <button
        className="btn btn-primary"
        onClick={handleConfirm}
        disabled={!selectedId}
        style={{ marginTop: 16, width: '100%' }}
      >
        <Check size={18} />
        <span>Submit Geometric Reason</span>
      </button>
    </div>
  );
}
