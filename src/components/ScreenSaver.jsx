import React, { useEffect, useRef, useState } from 'react';
import { ChevronRight, Sparkles } from 'lucide-react';
import { FALLBACK_SCREENSAVER_VEHICLES } from '../data/screensaverVehicles';
import { sounds } from '../audio/soundEffects';

const SCREENSAVER_TAGLINES = ['#BeyondZero', '#MoveYourWorld', '#MobilityForAll'];

function FadingVehicleScene({ vehicle, isFading }) {
  return (
    <div className={isFading ? 'screensaver-vehicle-scene is-fading' : 'screensaver-vehicle-scene'} aria-hidden="true">
      <img src={vehicle.image} alt="" className="screensaver-vehicle-img" />
      <div className="screensaver-vehicle-info">
        <span className="hero-tag"><Sparkles size={13} /> {vehicle.badge}</span>
        <div className="screensaver-model-name">{vehicle.fullName}</div>
        <div style={{ fontSize: '0.85rem', color: 'var(--border-cyan)', letterSpacing: '1.5px', textTransform: 'uppercase' }}>
          {vehicle.type} • {vehicle.accentText}
        </div>
      </div>
    </div>
  );
}

export default function ScreenSaver({
  playlist = [],
  videoVolume = 0.8,
  videoAudioEnabled = true,
  videoScalingMode = 'contain',
  onDismiss
}) {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [slideIndex, setSlideIndex] = useState(0);
  const [outgoingVehicle, setOutgoingVehicle] = useState(null);
  const [isVehicleFading, setIsVehicleFading] = useState(false);
  const videoRef = useRef(null);

  const hasCustomVideos = playlist.length > 0;
  const currentVideo = hasCustomVideos ? playlist[currentVideoIndex] : null;
  const activeVehicle = FALLBACK_SCREENSAVER_VEHICLES[slideIndex];
  const activeTagline = SCREENSAVER_TAGLINES[slideIndex % SCREENSAVER_TAGLINES.length];

  useEffect(() => {
    if (!hasCustomVideos || !videoRef.current) return;

    const video = videoRef.current;
    video.volume = Math.max(0, Math.min(1, videoVolume));
    video.muted = !videoAudioEnabled;

    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise
        .catch(() => {
          video.muted = true;
          video.play().catch(() => {});
        });
    }
  }, [currentVideoIndex, hasCustomVideos, videoAudioEnabled, videoVolume]);

  useEffect(() => {
    if (hasCustomVideos) return undefined;

    const timer = setTimeout(() => {
      setOutgoingVehicle(activeVehicle);
      setIsVehicleFading(false);
      setSlideIndex((previous) => (previous + 1) % FALLBACK_SCREENSAVER_VEHICLES.length);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setIsVehicleFading(true));
      });
    }, 4500);

    return () => clearTimeout(timer);
  }, [activeVehicle, hasCustomVideos]);

  useEffect(() => {
    if (!isVehicleFading) return undefined;

    const timer = setTimeout(() => {
      setOutgoingVehicle(null);
      setIsVehicleFading(false);
    }, 650);

    return () => clearTimeout(timer);
  }, [isVehicleFading]);

  const handleVideoEnded = () => {
    if (playlist.length > 1) {
      setCurrentVideoIndex((previous) => (previous + 1) % playlist.length);
    } else if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {});
    }
  };

  const handleWakeUp = () => {
    sounds.playClick();
    onDismiss();
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (['Space', 'Enter', 'Escape'].includes(event.code)) handleWakeUp();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div
      className="screensaver-overlay"
      onClick={handleWakeUp}
      role="button"
      tabIndex={0}
      aria-label="Screen Saver Active - Touch anywhere to start"
    >
      <div className="screensaver-portrait-frame">
        <div className="screensaver-fallback-loop">
          <div className="screensaver-glow-orb orb-1" />
          <div className="screensaver-glow-orb orb-2" />
          <div className="screensaver-grid-bg" />

          <div className="screensaver-content-wrap">
            <div className="screensaver-brand">
              <img className="screensaver-brand-logo" src="/toyota-logo.png" alt="Toyota" />
            </div>

            <div className="screensaver-electrified-title">Toyota Electrified</div>

            <div className="screensaver-showcase-frame">
              {hasCustomVideos ? (
                <div className="screensaver-video-wrapper">
                  <video
                    ref={videoRef}
                    key={currentVideo.id || currentVideo.url}
                    src={currentVideo.url}
                    autoPlay
                    playsInline
                    loop={playlist.length === 1}
                    onEnded={handleVideoEnded}
                    className="screensaver-video-media"
                    style={{ objectFit: videoScalingMode === 'cover' ? 'cover' : 'contain' }}
                  />
                </div>
              ) : (
                <>
                  <img
                    key={activeVehicle.id}
                    src={activeVehicle.image}
                    alt={activeVehicle.name}
                    className="screensaver-vehicle-img"
                  />
                  <div className="screensaver-vehicle-info">
                    <span className="hero-tag"><Sparkles size={13} /> {activeVehicle.badge}</span>
                    <div className="screensaver-model-name">{activeVehicle.fullName}</div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--border-cyan)', letterSpacing: '1.5px', textTransform: 'uppercase' }}>
                      {activeVehicle.type} • {activeVehicle.accentText}
                    </div>
                  </div>
                  {outgoingVehicle && <FadingVehicleScene vehicle={outgoingVehicle} isFading={isVehicleFading} />}
                </>
              )}
            </div>

            <div className="screensaver-feature-line" key={activeTagline}>{activeTagline}</div>
          </div>
        </div>

        <div className="screensaver-prompt-bar">
          <div className="screensaver-touch-pill" onClick={handleWakeUp}>
            <span className="screensaver-touch-dot" />
            <span className="screensaver-touch-text">TOUCH SCREEN TO START</span>
            <ChevronRight size={20} color="var(--toyota-red-bright)" className="screensaver-touch-arrow" />
          </div>
        </div>
      </div>
    </div>
  );
}
