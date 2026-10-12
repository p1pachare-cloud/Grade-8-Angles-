import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { ArrowRight } from 'lucide-react';
import Mascot from '../Mascot';

export default function FeedbackOverlay({ feedback, onContinue }) {
  if (!feedback) return null;

  const { isCorrect, xpEarned, explanation } = feedback;

  useEffect(() => {
    if (isCorrect) {
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.6 },
        });
      } catch (e) {}
    }
  }, [isCorrect]);

  return (
    <div className="feedback-overlay-backdrop">
      <div className={`feedback-modal-card ${isCorrect ? 'correct' : 'incorrect'}`}>
        <Mascot mood={isCorrect ? 'celebrating' : 'thinking'} size="large" />

        <h3 className="feedback-title">
          {isCorrect ? 'Geometric Precision! 🎉' : 'Keep Exploring! 🤔'}
        </h3>

        {isCorrect && xpEarned > 0 && (
          <div className="feedback-xp-burst">
            <span>+{xpEarned} XP Earned! ⚡</span>
          </div>
        )}

        {explanation && (
          <p className="feedback-explanation">
            {explanation}
          </p>
        )}

        <button className="btn btn-primary" onClick={onContinue} style={{ minWidth: 180 }}>
          <span>Continue</span>
          <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
}
