import React, { useState } from 'react';
import { Delete, Check } from 'lucide-react';
import { playClick } from '../../utils/audio';

export default function DegreePad({ onSubmit, unit = '°' }) {
  const [val, setVal] = useState('');

  const handleDigit = (digit) => {
    playClick();
    if (val.length < 8) {
      setVal((prev) => prev + digit);
    }
  };

  const handleDot = () => {
    playClick();
    if (!val.includes('.') && val.length < 8) {
      setVal((prev) => (prev ? prev + '.' : '0.'));
    }
  };

  const handleDelete = () => {
    playClick();
    setVal((prev) => prev.slice(0, -1));
  };

  const handleClear = () => {
    playClick();
    setVal('');
  };

  const handleSubmit = () => {
    if (val.trim()) {
      onSubmit(val.trim());
      setVal('');
    }
  };

  return (
    <div className="number-pad-container">
      <div className="numpad-display-box">
        <span>{val || '0'}</span>
        {unit && <span style={{ fontSize: '1.2rem', color: '#ff7043', marginLeft: 4 }}>{unit}</span>}
      </div>

      <div className="numpad-keys-grid">
        {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
          <button
            key={digit}
            className="numpad-key"
            onClick={() => handleDigit(digit)}
          >
            {digit}
          </button>
        ))}
        <button className="numpad-key" onClick={handleDot}>.</button>
        <button className="numpad-key" onClick={() => handleDigit('0')}>0</button>
        <button className="numpad-key" onClick={handleDelete} title="Backspace">
          <Delete size={20} />
        </button>
      </div>

      <div style={{ display: 'flex', gap: 10, width: '100%' }}>
        <button
          className="btn btn-secondary"
          style={{ flex: 1, padding: '10px 14px' }}
          onClick={handleClear}
        >
          Clear
        </button>
        <button
          className="btn btn-primary"
          style={{ flex: 2, padding: '10px 14px' }}
          onClick={handleSubmit}
          disabled={!val}
        >
          <Check size={18} />
          <span>Submit</span>
        </button>
      </div>
    </div>
  );
}
