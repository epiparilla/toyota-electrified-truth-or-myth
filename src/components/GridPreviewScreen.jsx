import React, { useState, useEffect } from 'react';
import { Eye, Clock, FastForward } from 'lucide-react';
import { sounds } from '../audio/soundEffects';

export default function GridPreviewScreen({ cards, duration = 4, onComplete, testMode }) {
  const [timeLeft, setTimeLeft] = useState(duration);

  useEffect(() => {
    setTimeLeft(duration);
  }, [duration]);

  useEffect(() => {
    if (timeLeft <= 0) {
      onComplete();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          onComplete();
          return 0;
        }
        sounds.playTick(prev <= 2);
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, onComplete]);

  const progressPercent = Math.max(0, Math.min(100, (timeLeft / duration) * 100));

  return (
    <div className="screen-container">
      {/* PHASE HEADER */}
      <div style={{ textAlign: 'center', marginBottom: '8px' }}>
        <div className="phase-instruction">
          Memorize Card Locations
        </div>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          Tiles will flip face-down when countdown reaches zero!
        </p>
      </div>

      {/* 4x4 GRID (ALL FACE-UP PREVIEW WITH GREEN GLOW BORDERS) */}
      <div className="grid-container">
        {cards.map((card) => (
          <div key={card.cardId} className="memory-card is-flipped">
            <div className="memory-card-inner">
              {/* Back side (hidden during preview) */}
              <div className="card-face card-back-pattern" />

              {/* Front side (revealed with green border) */}
              <div className="card-face card-content-face preview-mode">
                {card.cardType === 'photo' ? (
                  <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                    <img
                      src={card.image}
                      alt={card.title}
                      className="card-photo-img"
                    />
                    <div className="card-photo-overlay">
                      <span className="card-photo-badge">{card.title}</span>
                    </div>
                  </div>
                ) : (
                  <div className="card-name-content">
                    <span className="card-powertrain-pill">{card.badge}</span>
                    <div className="card-model-name">{card.title}</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* COUNTDOWN & CONTROLS FOOTER */}
      <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <div className="progress-bar-wrap">
          <div
            className={`progress-bar-fill ${timeLeft <= 2 ? 'urgent' : ''}`}
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <div className={`countdown-pill ${timeLeft <= 2 ? 'urgent' : ''}`} style={{ flex: 1 }}>
            <Clock size={20} color={timeLeft <= 2 ? 'var(--toyota-red-bright)' : 'var(--border-cyan)'} />
            <span>Flipping in: {timeLeft}s</span>
          </div>

          {testMode && (
            <button
              type="button"
              className="btn-secondary"
              style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '4px' }}
              onClick={() => {
                sounds.playClick();
                onComplete();
              }}
              title="Skip preview (Test Mode)"
            >
              <FastForward size={16} />
              Skip
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
