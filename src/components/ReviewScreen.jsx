import React from 'react';
import { CheckCircle2, XCircle } from 'lucide-react';

export default function ReviewScreen({ answers, onComplete }) {
  const score = answers.filter((item) => item.choice === item.answer).length;
  return <div className="screen-container quiz-screen review-screen">
    <div className="review-score"><span>Challenge complete</span><strong>{score} / {answers.length} Correct</strong></div>
    <div className="review-list">
      {answers.map((item, index) => {
        const correct = item.choice === item.answer;
        return <article className={`review-card ${correct ? 'correct' : 'incorrect'}`} key={`${item.id}-${index}`}>
          {correct ? <CheckCircle2 size={22} /> : <XCircle size={22} />}<div><span>{item.category}</span><p>{item.statement}</p><small>Your answer: <b>{item.choice}</b> · Correct answer: <b>{item.answer}</b></small><em>{item.explanation}</em></div>
        </article>;
      })}
    </div>
    <button className="btn-toyota-red" onClick={() => onComplete(score)}>See Result</button>
  </div>;
}
