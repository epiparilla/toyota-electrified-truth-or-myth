import React, { useState, useEffect } from 'react';
import { Clock, CheckCircle2, FastForward } from 'lucide-react';
import { VEHICLES } from '../data/vehicles';
import { sounds } from '../audio/soundEffects';

export default function CarPreviewScreen({ duration = 6, onComplete, testMode }) {
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
        sounds.playTick(prev <= 3);
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
        <div style={{
          display: 'inline-block',
          fontSize: '0.72rem',
          fontWeight: 700,
          color: 'var(--border-cyan)',
          letterSpacing: '2px',
          textTransform: 'uppercase',
          marginBottom: '2px'
        }}>
          Phase 1 of 2
        </div>
        <div className="phase-instruction">
          Study the Lineup
        </div>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          Familiarize yourself with the vehicle designs & model names
        </p>
      </div>

      {/* SCROLLABLE CAR LIST */}
      <div className="car-list-scroll">
        {VEHICLES.map((vehicle) => (
          <div key={vehicle.id} className="car-preview-item">
            <div className="car-thumb-wrap">
              <img
                src={vehicle.image}
                alt={vehicle.name}
                className="car-thumb-img"
                loading="eager"
              />
            </div>

            <div className="car-info-wrap">
              <div className="car-name-text">{vehicle.name}</div>
              <div className="car-type-badge">{vehicle.type}</div>
              <div className="car-tag">{vehicle.badge}</div>
            </div>

            <CheckCircle2 className="car-check-icon" />
          </div>
        ))}
      </div>

      {/* COUNTDOWN & CONTROLS FOOTER */}
      <div style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <div className="progress-bar-wrap">
          <div
            className={`progress-bar-fill ${timeLeft <= 3 ? 'urgent' : ''}`}
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <div className={`countdown-pill ${timeLeft <= 3 ? 'urgent' : ''}`} style={{ flex: 1 }}>
            <Clock size={20} color={timeLeft <= 3 ? 'var(--toyota-red-bright)' : 'var(--border-cyan)'} />
            <span>Countdown: {timeLeft}s</span>
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
