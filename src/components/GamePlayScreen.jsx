import React, { useState, useEffect, useRef } from 'react';
import { Clock, Zap, CheckCircle2, AlertTriangle, Eye, Award, XCircle, Pause, Play } from 'lucide-react';
import { sounds } from '../audio/soundEffects';

export default function GamePlayScreen({
  cards,
  gameDuration = 30,
  targetPairsToWin = 3,
  onWin,
  onLose,
  testMode
}) {
  const [timeLeft, setTimeLeft] = useState(gameDuration);
  const [flippedCards, setFlippedCards] = useState([]); // indices of flipped cards (max 2)
  const [matchedCardIds, setMatchedCardIds] = useState(new Set());
  const [mismatchingCardIds, setMismatchingCardIds] = useState(new Set());
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [isTimerPaused, setIsTimerPaused] = useState(false);
  const [xRayMode, setXRayMode] = useState(false);

  const timerRef = useRef(null);
  const startTimeRef = useRef(Date.now());

  // Main Game Countdown Timer
  useEffect(() => {
    if (isTimerPaused) return;

    if (timeLeft <= 0) {
      sounds.playLose();
      const elapsed = Math.round((Date.now() - startTimeRef.current) / 1000);
      onLose({ timeSpent: Math.min(gameDuration, elapsed) });
      return;
    }

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          sounds.playLose();
          const elapsed = Math.round((Date.now() - startTimeRef.current) / 1000);
          onLose({ timeSpent: Math.min(gameDuration, elapsed) });
          return 0;
        }
        if (prev <= 6) {
          sounds.playTick(true);
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [timeLeft, isTimerPaused, gameDuration, onLose]);

  // Card Tap Handler
  const handleCardClick = (card, index) => {
    if (isEvaluating) return;
    if (matchedCardIds.has(card.cardId)) return;
    if (flippedCards.length === 1 && flippedCards[0] === index) return;

    sounds.playFlip();

    const newFlipped = [...flippedCards, index];
    setFlippedCards(newFlipped);

    // If second card flipped, evaluate match
    if (newFlipped.length === 2) {
      setIsEvaluating(true);
      const firstCard = cards[newFlipped[0]];
      const secondCard = cards[newFlipped[1]];

      // Check match: same vehicleId and not the same physical card
      if (firstCard.vehicleId === secondCard.vehicleId && firstCard.cardId !== secondCard.cardId) {
        // MATCH!
        setTimeout(() => {
          sounds.playMatch();
          setMatchedCardIds((prev) => {
            const next = new Set(prev);
            next.add(firstCard.cardId);
            next.add(secondCard.cardId);

            const matchedPairs = Math.floor(next.size / 2);
            if (matchedPairs >= targetPairsToWin) {
              const elapsed = Math.round((Date.now() - startTimeRef.current) / 1000);
              setTimeout(() => {
                onWin({ timeSpent: elapsed, pairsFound: matchedPairs });
              }, 400);
            }
            return next;
          });

          setFlippedCards([]);
          setIsEvaluating(false);
        }, 150);
      } else {
        // MISMATCH!
        setTimeout(() => {
          sounds.playMismatch();
          setMismatchingCardIds(new Set([firstCard.cardId, secondCard.cardId]));

          setTimeout(() => {
            setMismatchingCardIds(new Set());
            setFlippedCards([]);
            setIsEvaluating(false);
          }, 450);
        }, 200);
      }
    }
  };

  const matchedPairsCount = Math.floor(matchedCardIds.size / 2);
  const progressPercent = Math.max(0, Math.min(100, (timeLeft / gameDuration) * 100));

  return (
    <div className="screen-container">
      {/* TEST MODE QUICK CONTROLS */}
      {testMode && (
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: 'rgba(238, 0, 0, 0.2)',
          border: '1px solid rgba(238, 0, 0, 0.4)',
          borderRadius: '8px',
          padding: '4px 10px',
          marginBottom: '8px',
          fontSize: '0.72rem'
        }}>
          <span style={{ fontWeight: 800, color: '#FF6B6B' }}>TEST HELPER:</span>
          <div style={{ display: 'flex', gap: '6px' }}>
            <button
              type="button"
              className="btn-secondary"
              style={{ padding: '3px 8px', fontSize: '0.7rem' }}
              onClick={() => setXRayMode(!xRayMode)}
            >
              <Eye size={12} /> {xRayMode ? 'Hide X-Ray' : 'X-Ray'}
            </button>
            <button
              type="button"
              className="btn-secondary"
              style={{ padding: '3px 8px', fontSize: '0.7rem' }}
              onClick={() => setIsTimerPaused(!isTimerPaused)}
            >
              {isTimerPaused ? <Play size={12} /> : <Pause size={12} />}
            </button>
            <button
              type="button"
              className="btn-secondary"
              style={{ padding: '3px 8px', fontSize: '0.7rem', color: 'var(--success-green)' }}
              onClick={() => onWin({ timeSpent: 5, pairsFound: targetPairsToWin })}
            >
              Instant Win
            </button>
            <button
              type="button"
              className="btn-secondary"
              style={{ padding: '3px 8px', fontSize: '0.7rem', color: 'var(--toyota-red-bright)' }}
              onClick={() => onLose({ timeSpent: gameDuration })}
            >
              Instant Lose
            </button>
          </div>
        </div>
      )}

      {/* HEADS-UP DISPLAY (HUD) */}
      <div className="game-hud">
        <div className="hud-item">
          <span className="hud-label">Pairs Matched</span>
          <div className="hud-value target">
            {matchedPairsCount} <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>/ {targetPairsToWin}</span>
          </div>
        </div>

        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '0.65rem', color: 'var(--border-cyan)', letterSpacing: '1px', textTransform: 'uppercase', fontWeight: 700 }}>
            Active Session
          </div>
          <div style={{ fontSize: '0.8rem', color: '#FFFFFF', fontWeight: 600 }}>
            Find {targetPairsToWin} Pairs
          </div>
        </div>

        <div className="hud-item" style={{ alignItems: 'flex-end' }}>
          <span className="hud-label">Time Left</span>
          <div className={`hud-value ${timeLeft <= 8 ? 'timer-pulse' : ''}`}>
            {timeLeft}s
          </div>
        </div>
      </div>

      {/* 4x4 GAME GRID */}
      <div className="grid-container">
        {cards.map((card, index) => {
          const isFlipped = flippedCards.includes(index) || matchedCardIds.has(card.cardId) || xRayMode;
          const isMatched = matchedCardIds.has(card.cardId);
          const isMismatch = mismatchingCardIds.has(card.cardId);

          return (
            <div
              key={card.cardId}
              className={`memory-card ${isFlipped ? 'is-flipped' : ''}`}
              onClick={() => handleCardClick(card, index)}
            >
              <div className="memory-card-inner">
                {/* Face-Down Back */}
                <div className="card-face card-back-pattern">
                  <svg className="card-back-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                  </svg>
                  <span className="card-back-text">EV MATCH</span>
                </div>

                {/* Face-Up Front */}
                <div className={`card-face card-content-face ${isMatched ? 'is-matched' : ''} ${isMismatch ? 'is-mismatch' : ''}`}>
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
                      {isMatched && (
                        <CheckCircle2 size={16} color="var(--success-green)" style={{ marginTop: '2px' }} />
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* FOOTER TIMER BAR */}
      <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <div className="progress-bar-wrap">
          <div
            className={`progress-bar-fill ${timeLeft <= 8 ? 'urgent' : ''}`}
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '4px 8px',
          fontSize: '0.75rem',
          color: 'var(--text-muted)'
        }}>
          <span>Touch 2 panels to reveal</span>
          <span>Match each photo with its identical photo</span>
        </div>
      </div>
    </div>
  );
}
