import React, { useEffect, useState } from 'react';
import { Trophy, RotateCcw, Sparkles, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { sounds } from '../audio/soundEffects';

export default function WinScreen({
  stats = { timeSpent: 12, pairsFound: 3 },
  autoResetDuration = 6,
  onRestart
}) {
  const [timeLeft, setTimeLeft] = useState(autoResetDuration);

  // Trigger celebration sounds & confetti bursts
  useEffect(() => {
    sounds.playWin();

    // High energy confetti blast
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#00F0FF', '#10B981', '#EE0000', '#FFFFFF']
      });

      const timer2 = setTimeout(() => {
        confetti({
          particleCount: 50,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ['#00F0FF', '#10B981', '#FFFFFF']
        });
        confetti({
          particleCount: 50,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ['#00F0FF', '#EE0000', '#FFFFFF']
        });
      }, 400);

      return () => clearTimeout(timer2);
    } catch (e) {
      // Confetti fallback
    }
  }, []);

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
    <div className="screen-container result-screen">
      <div className="result-screen-content">
        {/* GLOWING VICTORY BADGE */}
        <div className="result-badge-icon win">
          <Trophy size={44} color="var(--success-green)" />
        </div>

        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--success-green)', fontSize: '0.8rem', fontWeight: 800, letterSpacing: '2px', textTransform: 'uppercase' }}>
          <Sparkles size={16} />
          <span>Mission Accomplished</span>
        </div>

        <h2 className="result-headline win">
          Congratulations! <br />
          You Win!
        </h2>

        <p className="result-subtext">
          Great work. You know your Toyota electrified facts.
        </p>

        {/* PERFORMANCE STATS */}
        <div className="stats-card">
          <div className="stat-col">
            <span className="stat-label">Questions Answered</span>
            <span className="stat-val" style={{ color: 'var(--border-cyan)' }}>
              {stats.timeSpent}
            </span>
          </div>

          <div style={{ width: '1px', background: 'rgba(0, 240, 255, 0.2)' }} />

          <div className="stat-col">
            <span className="stat-label">Correct Answers</span>
            <span className="stat-val" style={{ color: 'var(--success-green)' }}>
              {stats.pairsFound}
            </span>
          </div>
        </div>
      </div>

      {/* FOOTER & AUTO-RESET */}
      <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <div className="progress-bar-wrap">
          <div className="progress-bar-fill" style={{ width: `${progressPercent}%` }} />
        </div>

        <div style={{ textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          Resetting for next player in <strong style={{ color: '#FFFFFF' }}>{timeLeft}s</strong>
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
