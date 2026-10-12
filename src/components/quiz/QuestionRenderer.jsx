import React, { useState, useEffect } from 'react';
import DiagramFor from './DiagramFor';
import HintOverlay from './HintOverlay';
import DegreePad from '../shared/DegreePad';

export default function QuestionRenderer({
  question,
  onSelectAnswer,
  attemptCount = 0,
  audioEnabled = true,
}) {
  const [selectedOption, setSelectedOption] = useState(null);

  useEffect(() => {
    setSelectedOption(null);
  }, [question?.id]);

  if (!question) return null;

  const handleOptionClick = (opt) => {
    const val = typeof opt === 'object' && opt !== null ? opt.value : opt;
    setSelectedOption(val);
    onSelectAnswer(val, opt?.tag);
  };

  return (
    <div className="question-renderer-card glass-card">
      <div className="question-top-bar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div className="question-type-badge">
          <span>Question Type: {question.type?.toUpperCase().replace(/_/g, ' ')}</span>
        </div>
      </div>

      <h3 className="question-text-title">{question.questionText}</h3>

      {/* Visual diagram scaffold if available */}
      {question.figure && (
        <div className="question-visual-scaffold">
          <DiagramFor figure={question.figure} notToScale={question.figureNotToScale} />
        </div>
      )}

      {/* Format-specific answer controls */}
      {question.answerFormat === 'numeric' ? (
        <DegreePad onSubmit={(val) => onSelectAnswer(val)} unit={question.unit || '°'} />
      ) : (
        <div className="mcq-options-grid">
          {question.options &&
            question.options.map((option, idx) => {
              const val = typeof option === 'object' && option !== null ? option.value : option;
              const isSelected = selectedOption === val;
              return (
                <button
                  key={idx}
                  className={`mcq-option-btn ${isSelected ? 'selected' : ''}`}
                  onClick={() => handleOptionClick(option)}
                >
                  <span className="option-letter">{String.fromCharCode(65 + idx)}.</span>
                  <span className="option-text">{String(val)}{question.unit ? question.unit : ''}</span>
                </button>
              );
            })}
        </div>
      )}

      {/* Graduated Hints */}
      <HintOverlay
        hint1={question.hint1}
        hint2={question.hint2}
        explanation={question.explanation}
        attemptCount={attemptCount}
      />
    </div>
  );
}
