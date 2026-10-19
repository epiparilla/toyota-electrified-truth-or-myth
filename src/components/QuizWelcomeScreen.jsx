import React from 'react';
import { Play } from 'lucide-react';
import { sounds } from '../audio/soundEffects';

export default function QuizWelcomeScreen({ onStart }) {
  return (
    <div className="screen-container quiz-welcome">
      <div className="quiz-title-block">
        <h1 className="quiz-title">
          Electrified <br />
          <span className="quiz-title-game-name">
            <span className="quiz-title-truth">Truth</span>{' '}
            <span className="quiz-title-or">or</span>{' '}
            <span className="quiz-title-myth">Myth</span>
          </span>
        </h1>
        <p className="quiz-intro">Discover the facts behind Toyota electrified mobility, then put your knowledge to the test.</p>
      </div>
      <div className="quiz-welcome-card">
        <div className="quiz-card-label">How it works</div>
        <div className="quiz-steps"><span>Explore</span><b>→</b><span>Remember</span><b>→</b><span>Choose</span></div>
        <p>Reveal as many Toyota electrified facts as you can before the challenge begins.</p>
      </div>
      <button className="btn-toyota-red quiz-start" onClick={() => { sounds.playClick(); onStart(); }}>
        <Play size={24} fill="#FFFFFF" /> Start Challenge
      </button>
    </div>
  );
}
