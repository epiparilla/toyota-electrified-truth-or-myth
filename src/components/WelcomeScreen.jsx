import React, { useState, useEffect } from 'react';
import { Play, Sparkles, Zap } from 'lucide-react';
import { VEHICLES } from '../data/vehicles';
import { sounds } from '../audio/soundEffects';

function shuffleShowcaseVehicles(lastVehicleId) {
  const order = [...VEHICLES];

  for (let index = order.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [order[index], order[randomIndex]] = [order[randomIndex], order[index]];
  }

  // Avoid showing the same vehicle twice at the point where a new loop begins.
  if (lastVehicleId && order.length > 1 && order[0].id === lastVehicleId) {
    const swapIndex = order.findIndex((vehicle) => vehicle.id !== lastVehicleId);
    [order[0], order[swapIndex]] = [order[swapIndex], order[0]];
  }

  return order;
}

export default function WelcomeScreen({ onStartGame, testMode, targetPairs }) {
  const [showcaseVehicles, setShowcaseVehicles] = useState(() => shuffleShowcaseVehicles());
  const [heroIndex, setHeroIndex] = useState(0);

  // Start with a random order whenever this screen appears, then reshuffle after each full loop.
  useEffect(() => {
    const timer = setInterval(() => {
      setHeroIndex((previousIndex) => {
        if (previousIndex < showcaseVehicles.length - 1) {
          return previousIndex + 1;
        }

        const lastVehicleId = showcaseVehicles[previousIndex]?.id;
        setShowcaseVehicles(shuffleShowcaseVehicles(lastVehicleId));
        return 0;
      });
    }, 4000);
    return () => clearInterval(timer);
  }, [showcaseVehicles]);

  const currentVehicle = showcaseVehicles[heroIndex];

  return (
    <div className="screen-container" style={{ justifyContent: 'space-between', paddingBottom: '24px' }}>
      {testMode && (
        <div className="test-mode-bar">
          <span className="test-badge">QA Test Mode Active</span>
        </div>
      )}

      {/* TITLE & CALLOUT */}
      <div style={{ textAlign: 'center', marginTop: '6px' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--border-cyan)', fontSize: '0.8rem', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '4px' }}>
          <Zap size={14} color="var(--border-cyan)" />
          <span>Interactive Memory Challenge</span>
        </div>
        <h1 style={{
          fontFamily: 'var(--font-heading)',
          fontSize: '2.3rem',
          fontWeight: 900,
          letterSpacing: '2px',
          textTransform: 'uppercase',
          lineHeight: 1.05,
          color: '#FFFFFF',
          textShadow: '0 0 20px rgba(0, 240, 255, 0.4)'
        }}>
          Electrified <br />
          <span style={{ color: 'var(--border-cyan)' }}>Match Challenge</span>
        </h1>
        <p style={{
          fontSize: '0.9rem',
          color: 'var(--text-muted)',
          marginTop: '6px',
          letterSpacing: '0.5px'
        }}>
          Memorize the cards and match Toyota electrified vehicles to win.
        </p>
      </div>

      {/* HERO ATTRACT SHOWCASE */}
      <div className="hero-visual-wrap">
        <img
          key={currentVehicle.id}
          src={currentVehicle.image}
          alt={currentVehicle.name}
          className="hero-img"
        />
        <div className="hero-gradient-overlay">
          <span className="hero-tag">
            <Sparkles size={12} />
            {currentVehicle.badge}
          </span>
          <div className="hero-model-title">{currentVehicle.fullName}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--border-cyan)', letterSpacing: '1px', textTransform: 'uppercase' }}>
            {currentVehicle.type} • {currentVehicle.accentText}
          </div>
        </div>
      </div>

      {/* MISSION TARGET */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        margin: '4px 0'
      }}>
        <div style={{
          background: 'rgba(14, 21, 37, 0.7)',
          border: '1px solid rgba(0, 240, 255, 0.25)',
          borderRadius: '10px',
          padding: '10px',
          textAlign: 'center',
          width: '100%',
          maxWidth: '230px'
        }}>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>
            Mission Target
          </div>
          <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', fontWeight: 800, color: 'var(--success-green)' }}>
            Match {targetPairs} Pairs
          </div>
        </div>

        <div style={{
          display: 'none',
          background: 'rgba(14, 21, 37, 0.7)',
          border: '1px solid rgba(0, 240, 255, 0.25)',
          borderRadius: '10px',
          padding: '10px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>
            Format
          </div>
          <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', fontWeight: 800, color: 'var(--border-cyan)' }}>
            Photo ↔ Name
          </div>
        </div>
      </div>

      {/* START CTA BUTTON */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', marginTop: '6px' }}>
        <button
          type="button"
          className="btn-toyota-red"
          style={{ width: '100%', maxWidth: '380px' }}
          onClick={() => {
            sounds.playClick();
            onStartGame();
          }}
        >
          <Play size={24} fill="#FFFFFF" />
          Start Game
        </button>
      </div>
    </div>
  );
}
