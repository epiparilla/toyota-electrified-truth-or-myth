import React, { useEffect, useState } from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';
import { sounds } from '../audio/soundEffects';

export default function LoseScreen({
  stats = { timeSpent: 30 },
  autoResetDuration = 6,
  onRestart
}) {
  const [timeLeft, setTimeLeft] = useState(autoResetDuration);

  // Auto-reset countdown
  useEffect(() => {
    if (timeLeft <= 0) {
      onRestart();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          onRestart();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, onRestart]);

  const progressPercent = Math.max(0, Math.min(100, (timeLeft / autoResetDuration) * 100));

  return (
    <div className="screen-container">
      <div className="result-screen-content">
        {/* RED WARNING BADGE */}
        <div className="result-badge-icon lose">
          <AlertTriangle size={44} color="var(--toyota-red-bright)" />
        </div>

        <h2 className="result-headline lose">
          Time's Up <br />
          Thank You for Playing
        </h2>

        <p className="result-subtext">
          Keep exploring Toyota electrified facts and come back for another challenge.
        </p>

        <div className="stats-card">
          <div className="stat-col" style={{ flex: 1 }}>
            <span className="stat-label">Correct Answers</span>
            <span className="stat-val" style={{ color: 'var(--text-main)' }}>
              {stats.pairsFound}
            </span>
          </div>
        </div>
      </div>

      {/* FOOTER & AUTO-RESET */}
      <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <div className="progress-bar-wrap">
          <div className="progress-bar-fill urgent" style={{ width: `${progressPercent}%` }} />
        </div>

        <div style={{ textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          Queue resetting in <strong style={{ color: '#FFFFFF' }}>{timeLeft}s</strong>
        </div>

        <button
          type="button"
          className="btn-toyota-red"
          style={{ width: '100%' }}
          onClick={() => {
            sounds.playClick();
            onRestart();
          }}
        >
          <RotateCcw size={22} />
          Next Player
        </button>

      </div>
    </div>
  );
}
