import React, { useEffect, useMemo, useState } from 'react';
import { ChevronRight, Clock, Lightbulb } from 'lucide-react';
import { sounds } from '../audio/soundEffects';

export default function LearningScreen({ questions, duration, onComplete, testMode }) {
  const [timeLeft, setTimeLeft] = useState(duration);
  const [revealed, setRevealed] = useState(() => new Set());
  const orderedQuestions = useMemo(() => questions, [questions]);

  useEffect(() => {
    setTimeLeft(duration);
    const timer = setInterval(() => setTimeLeft((value) => value <= 1 ? (clearInterval(timer), onComplete(), 0) : value - 1), 1000);
    return () => clearInterval(timer);
  }, [duration, onComplete]);

  const reveal = (id) => {
    if (!revealed.has(id)) sounds.playClick();
    setRevealed((current) => new Set(current).add(id));
  };

  return (
    <div className="screen-container quiz-screen">
      <div className="quiz-topbar"><div><span>Explore the facts</span><strong>Tap cards to reveal</strong></div><div className="quiz-timer"><Clock size={18} /> {timeLeft}s</div></div>
      <div className="learning-scroll">
        {orderedQuestions.map((question, index) => {
          const isRevealed = revealed.has(question.id);
          return <button key={question.id} className={`learning-card ${isRevealed ? 'revealed' : ''}`} onClick={() => reveal(question.id)}>
            <div className="learning-card-meta"><span>{question.category}</span><b>#{String(index + 1).padStart(2, '0')}</b></div>
            <p>{question.statement}</p>
            {isRevealed ? <div className="learning-answer"><strong>{question.answer}</strong><span>{question.explanation}</span></div> : <div className="learning-reveal">Tap to reveal <ChevronRight size={16} /></div>}
          </button>;
        })}
      </div>
      <div className="learning-hint"><Lightbulb size={16} /> Remember as many facts as you can.</div>
      {testMode && <button className="qa-skip" onClick={onComplete}>QA: Skip to Challenge</button>}
    </div>
  );
}
