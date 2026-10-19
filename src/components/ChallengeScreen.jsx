import React, { useEffect, useRef, useState } from 'react';
import { Clock, Sparkles } from 'lucide-react';
import { sounds } from '../audio/soundEffects';

export default function ChallengeScreen({ questions, duration, maxQuestions, onComplete, testMode }) {
  const [timeLeft, setTimeLeft] = useState(duration);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [selection, setSelection] = useState(null);
  const answersRef = useRef([]);
  const completedRef = useRef(false);
  const transitionTimerRef = useRef(null);
  const questionLimit = Math.min(Math.max(maxQuestions, 1), questions.length);
  const question = questions[index];

  const completeChallenge = (results = answersRef.current) => {
    if (completedRef.current) return;
    completedRef.current = true;
    onComplete(results);
  };

  useEffect(() => {
    const timer = setInterval(() => setTimeLeft((value) => {
      if (value <= 1) {
        clearInterval(timer);
        completeChallenge();
        return 0;
      }
      return value - 1;
    }), 1000);
    return () => clearInterval(timer);
  }, [duration, onComplete]);

  useEffect(() => () => {
    if (transitionTimerRef.current) clearTimeout(transitionTimerRef.current);
  }, []);

  const answer = (choice) => {
    if (completedRef.current || timeLeft <= 0 || selection) return;
    sounds.playClick();
    setSelection(choice);
    const nextAnswers = [...answersRef.current, { ...question, choice }];
    answersRef.current = nextAnswers;
    setAnswers(nextAnswers);

    if (nextAnswers.length >= questionLimit) {
      transitionTimerRef.current = setTimeout(() => completeChallenge(nextAnswers), 420);
      return;
    }

    transitionTimerRef.current = setTimeout(() => {
      setIndex((current) => current + 1);
      setSelection(null);
    }, 420);
  };

  return (
    <div className={`screen-container quiz-screen challenge-screen${selection ? ' is-transitioning' : ''}`}>
      <div className="quiz-topbar"><div><span>Challenge round</span><strong>Choose carefully. Your answer is final.</strong></div><div className="quiz-timer urgent"><Clock size={18} /> {timeLeft}s</div></div>
      <div className="randomizer-stack" aria-hidden="true"><span /><span /><span /></div>
      <div className={`challenge-card${selection ? ` is-${selection.toLowerCase()}` : ''}`} key={`${question.id}-${index}`}>
        <div className="learning-card-meta"><span>{question.category}</span><b><Sparkles size={15} /> {index + 1} / {questionLimit}</b></div>
        <p>{question.statement}</p>
      </div>
      <div className="answer-buttons">
        <button className={`truth-btn${selection === 'TRUTH' ? ' is-selected' : ''}`} onClick={() => answer('TRUTH')} disabled={timeLeft <= 0 || Boolean(selection)} aria-pressed={selection === 'TRUTH'}>Truth</button>
        <button className={`myth-btn${selection === 'MYTH' ? ' is-selected' : ''}`} onClick={() => answer('MYTH')} disabled={timeLeft <= 0 || Boolean(selection)} aria-pressed={selection === 'MYTH'}>Myth</button>
      </div>
      <p className="final-answer-note">Your choice will lock immediately.</p>
      {testMode && <button className="qa-skip" onClick={completeChallenge}>QA: End Challenge</button>}
    </div>
  );
}
