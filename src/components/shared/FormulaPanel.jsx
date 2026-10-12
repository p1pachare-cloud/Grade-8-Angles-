import React, { useState } from 'react';
import { BookOpen, X } from 'lucide-react';
import { RULE_CARDS } from '../../data/ruleCards';
import RuleCard from './RuleCard';

export default function FormulaPanel() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        className="formula-trigger-btn"
        onClick={() => setIsOpen(!isOpen)}
        title="View Geometric Angle Rules"
      >
        <BookOpen size={18} />
        <span>Angle Rules</span>
      </button>

      {isOpen && (
        <div className="formula-modal-backdrop" onClick={() => setIsOpen(false)}>
          <div className="formula-modal-card glass-card" onClick={(e) => e.stopPropagation()}>
            <div className="formula-modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <BookOpen size={22} color="#ffd54f" />
                <h3 style={{ fontFamily: 'var(--font-display)', margin: 0, color: '#ffd54f' }}>
                  Architect's Angle Field Guide
                </h3>
              </div>
              <button className="modal-close-btn" onClick={() => setIsOpen(false)}>
                <X size={20} />
              </button>
            </div>

            <div className="formula-rules-grid">
              {RULE_CARDS.map((rule) => (
                <RuleCard key={rule.id} rule={rule} />
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
