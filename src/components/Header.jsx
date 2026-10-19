import React from 'react';
import { Settings, Volume2, VolumeX } from 'lucide-react';
import { sounds } from '../audio/soundEffects';

export default function Header({ onOpenSettings, soundEnabled, onToggleSound, facilitatorControlOpacity = 0.5, showSettings = true }) {
  return (
    <header className="kiosk-header">
      <div className="brand-row">
        <div className="brand-logo-wrap">
          <img className="brand-logo-image" src="/toyota-logo.png" alt="Toyota" />
        </div>
      </div>

      <button
        type="button"
        className="tech-icon-btn tech-icon-btn--audio"
        style={{ '--facilitator-control-opacity': facilitatorControlOpacity }}
        onClick={onToggleSound}
        aria-label="Toggle Sound"
      >
        {soundEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
      </button>
      {showSettings && (
        <button
          type="button"
          className="tech-icon-btn tech-icon-btn--settings"
          style={{ '--facilitator-control-opacity': facilitatorControlOpacity }}
          onClick={() => {
            sounds.playClick();
            onOpenSettings();
          }}
          aria-label="Settings"
        >
          <Settings size={18} />
        </button>
      )}
    </header>
  );
}
