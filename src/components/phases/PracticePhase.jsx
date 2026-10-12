import React, { useState, useEffect } from 'react';
import { Flame, Zap, Star, ArrowRight, HelpCircle } from 'lucide-react';
import WorldMap from '../quiz/WorldMap';
import QuestionRenderer from '../quiz/QuestionRenderer';
import ReasonPicker from '../quiz/ReasonPicker';
import FeedbackOverlay from '../shared/FeedbackOverlay';
import FormulaPanel from '../shared/FormulaPanel';
import GlossaryToggle from '../shared/GlossaryToggle';
import { WORLDS } from '../../data/worlds';
import { buildSession } from '../../generators';
import { calcXP, calcStars, canUnlockWorld, REASON_BONUS } from '../../utils/scoring';
import { getMisconceptionHint } from '../../data/misconceptions';
import { narrate, playChime, playBuzz } from '../../utils/audio';
import { correctNarration, incorrectNarration } from '../../utils/narration';

export default function PracticePhase({
  onNext,
  audioEnabled,
  xp,
  setXp,
  streak,
  setStreak,
  maxStreak,
  setMaxStreak,
  worldScores,
  setWorldScores,
  seed,
  retryCounters,
  glossary = 'neutral',
  setGlossary,
  onReasonCorrect,
}) {
  const [sessionQuestions, setSessionQuestions] = useState([]);
  const [currentWorld, setCurrentWorld] = useState(0);
  const [questionIdxInWorld, setQuestionIdxInWorld] = useState(0);
  const [attemptCount, setAttemptCount] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [showingReasonStep, setShowingReasonStep] = useState(false);
  const [pendingAnswerData, setPendingAnswerData] = useState(null);

  // Generate 100 questions once based on seed
  useEffect(() => {
    const questions = buildSession(seed || 12345, retryCounters || Array(10).fill(0), glossary);
    setSessionQuestions(questions);
  }, [seed, retryCounters, glossary]);

  const worldQuestions = sessionQuestions.slice(currentWorld * 10, (currentWorld + 1) * 10);
  const currentQuestion = worldQuestions[questionIdxInWorld] || worldQuestions[0];
  const worldMeta = WORLDS[currentWorld] || WORLDS[0];

  const handleSelectAnswer = (answer, chosenTag = null) => {
    if (!currentQuestion) return;

    const isCorrect =
      String(answer).trim().toLowerCase() ===
      String(currentQuestion.correctAnswer).trim().toLowerCase();

    if (isCorrect) {
      playChime();
      const baseXP = calcXP(attemptCount + 1, 0, streak);

      // Check if this question requires "Give the reason"
      if (currentQuestion.reason && !showingReasonStep) {
        setPendingAnswerData({ baseXP });
        setShowingReasonStep(true);
        return;
      }

      // If no reason needed
      commitCorrectAnswer(baseXP, 0);
    } else {
      playBuzz();
      setStreak(0);
      const nextAttempt = attemptCount + 1;
      setAttemptCount(nextAttempt);

      const specificHint = chosenTag ? getMisconceptionHint(chosenTag) : currentQuestion.hint1;
      narrate(incorrectNarration(specificHint), audioEnabled);

      if (nextAttempt >= 3) {
        setFeedback({
          isCorrect: false,
          xpEarned: 0,
          explanation: currentQuestion.explanation,
        });
      }
    }
  };

  const handleReasonPick = (chosenReasonId) => {
    const isReasonCorrect = chosenReasonId === currentQuestion.reason.correct;
    const bonus = isReasonCorrect ? REASON_BONUS : 0;
    if (isReasonCorrect) {
      playChime();
      if (onReasonCorrect) onReasonCorrect();
    }
    setShowingReasonStep(false);
    commitCorrectAnswer(pendingAnswerData?.baseXP || 10, bonus);
  };

  const commitCorrectAnswer = (baseXP, reasonBonus = 0) => {
    const xpEarned = baseXP + reasonBonus;
    setXp((prev) => prev + xpEarned);

    const newStreak = streak + 1;
    setStreak(newStreak);
    if (newStreak > maxStreak) setMaxStreak(newStreak);

    const updatedScores = [...worldScores];
    updatedScores[currentWorld] = (updatedScores[currentWorld] || 0) + 1;
    setWorldScores(updatedScores);

    narrate(correctNarration(), audioEnabled);
    setFeedback({
      isCorrect: true,
      xpEarned,
      explanation: currentQuestion.explanation,
    });
  };

  const handleContinueFeedback = () => {
    setFeedback(null);
    setAttemptCount(0);
    setShowingReasonStep(false);
    setPendingAnswerData(null);

    if (questionIdxInWorld < worldQuestions.length - 1) {
      setQuestionIdxInWorld((prev) => prev + 1);
    } else {
      // Completed world
      if (currentWorld < 9) {
        setCurrentWorld((prev) => prev + 1);
        setQuestionIdxInWorld(0);
      } else {
        // Completed all 10 worlds
        onNext();
      }
    }
  };

  return (
    <div className="phase-container practice-phase">
      {/* Top HUD: XP, Streak, Formula Sheet, Dialect */}
      <div className="practice-top-hud">
        <div className="hud-metric-pill xp-pill">
          <Zap size={18} color="#ffd54f" />
          <span>{xp} XP</span>
        </div>

        <div className="hud-metric-pill streak-pill">
          <Flame size={18} color="#ff7043" />
          <span>{streak} Streak 🔥</span>
        </div>

        <FormulaPanel />

        {setGlossary && (
          <GlossaryToggle value={glossary} onChange={setGlossary} />
        )}
      </div>

      {/* World Map Progression Bar */}
      <WorldMap
        worldScores={worldScores}
        currentWorld={currentWorld}
        onSelectWorld={(wIdx) => {
          setCurrentWorld(wIdx);
          setQuestionIdxInWorld(0);
          setAttemptCount(0);
          setFeedback(null);
          setShowingReasonStep(false);
        }}
      />

      {/* Current World Header */}
      <div className="practice-world-info-bar">
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: '1.4rem' }}>{worldMeta.icon}</span>
          <div>
            <h3 style={{ fontFamily: 'var(--font-display)', margin: 0, color: '#ffd54f', fontSize: '1.15rem' }}>
              World {currentWorld + 1}: {worldMeta.landmark}
            </h3>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              {worldMeta.city}, {worldMeta.country} · {worldMeta.focus}
            </span>
          </div>
        </div>

        <div className="question-slot-counter">
          <span>Question {questionIdxInWorld + 1} / 10</span>
        </div>
      </div>

      {/* Main Question Display */}
      {currentQuestion && (
        <div style={{ width: '100%', position: 'relative' }}>
          <QuestionRenderer
            question={currentQuestion}
            onSelectAnswer={handleSelectAnswer}
            attemptCount={attemptCount}
            audioEnabled={audioEnabled}
          />

          {/* Reason Picker Modal */}
          {showingReasonStep && currentQuestion.reason && (
            <ReasonPicker
              reason={currentQuestion.reason}
              onPickReason={handleReasonPick}
            />
          )}
        </div>
      )}

      {/* Feedback Overlay Modal */}
      {feedback && (
        <FeedbackOverlay
          feedback={feedback}
          onContinue={handleContinueFeedback}
        />
      )}
    </div>
  );
}
