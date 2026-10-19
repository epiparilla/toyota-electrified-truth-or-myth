import React, { useCallback, useEffect, useRef, useState } from 'react';
import Header from './components/Header';
import QuizWelcomeScreen from './components/QuizWelcomeScreen';
import LearningScreen from './components/LearningScreen';
import ChallengeScreen from './components/ChallengeScreen';
import ReviewScreen from './components/ReviewScreen';
import QuizSettingsModal from './components/QuizSettingsModal';
import WinScreen from './components/WinScreen';
import LoseScreen from './components/LoseScreen';
import ScreenSaver from './components/ScreenSaver';
import { QUESTIONS, shuffleQuestions } from './data/questions';
import { sounds } from './audio/soundEffects';
import { clearAllCachedVideos, deleteCachedVideoById, getCachedVideos, saveMultipleVideos } from './utils/videoStorage';

const DEFAULT_SETTINGS = {
  idleTimeout: 180, // Idle seconds before screen saver starts
  videoAudioEnabled: true, // Screen saver audio enabled by default
  videoVolume: 0.95, // Screen saver audio volume
  learningDuration: 30,
  challengeDuration: 15,
  challengeQuestionCount: 5,
  targetScore: 3,
  autoResetDuration: 15,
  soundEnabled: true, soundVolume: 0.95, facilitatorControlOpacity: 0.4, testMode: false
};

export default function App() {
  // Load settings from localStorage with fallback
  const [settings, setSettings] = useState(() => {
    try {
      const saved = localStorage.getItem('toyota_pevs_settings');
      const resolvedSettings = saved ? { ...DEFAULT_SETTINGS, ...JSON.parse(saved) } : DEFAULT_SETTINGS;
      return {
        ...resolvedSettings,
        idleTimeout: Math.min(Math.max(resolvedSettings.idleTimeout, 5), 600),
        learningDuration: Math.min(Math.max(resolvedSettings.learningDuration, 5), 120),
        challengeDuration: Math.min(Math.max(resolvedSettings.challengeDuration, 5), 120),
        autoResetDuration: Math.min(Math.max(resolvedSettings.autoResetDuration, 5), 120),
        targetScore: Math.min(resolvedSettings.targetScore, resolvedSettings.challengeQuestionCount)
      };
    } catch {
      return DEFAULT_SETTINGS;
    }
  });

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [phase, setPhase] = useState('welcome');
  const [questionOrder, setQuestionOrder] = useState(() => shuffleQuestions());
  const [answers, setAnswers] = useState([]);
  const [score, setScore] = useState(0);

  const [isScreenSaverActive, setIsScreenSaverActive] = useState(false);
  const [videoPlaylist, setVideoPlaylist] = useState([]);

  const idleTimerRef = useRef(null);
  const playlistRef = useRef([]);

  const replaceVideoPlaylist = useCallback((items) => {
    playlistRef.current.forEach((item) => item.url && URL.revokeObjectURL(item.url));
    const nextPlaylist = items.map((item) => ({ ...item, url: URL.createObjectURL(item.blob) }));
    playlistRef.current = nextPlaylist;
    setVideoPlaylist(nextPlaylist);
  }, []);

  // Sync sound settings & persist to localStorage
  useEffect(() => {
    sounds.setMuted(!settings.soundEnabled);
    sounds.setVolume(settings.soundVolume);
    try {
      localStorage.setItem('toyota_pevs_settings', JSON.stringify(settings));
    } catch {
      // Storage safe
    }
  }, [settings]);

  useEffect(() => {
    let isMounted = true;
    getCachedVideos().then((stored) => {
      if (isMounted) replaceVideoPlaylist(stored);
    }).catch(() => {});
    return () => {
      isMounted = false;
      playlistRef.current.forEach((item) => item.url && URL.revokeObjectURL(item.url));
      playlistRef.current = [];
    };
  }, [replaceVideoPlaylist]);

  const importVideos = async (files) => {
    const updated = await saveMultipleVideos(files);
    replaceVideoPlaylist(updated);
  };
  const deleteVideo = async (id) => {
    const updated = await deleteCachedVideoById(id);
    replaceVideoPlaylist(updated);
  };
  const clearVideos = async () => { await clearAllCachedVideos(); replaceVideoPlaylist([]); };


  // Reset Idle Timer
  const resetIdleTimer = useCallback(() => {
    if (idleTimerRef.current) {
      clearTimeout(idleTimerRef.current);
    }

    // Only activate screensaver when on welcome screen and settings modal is closed
    if (phase === 'welcome' && !isSettingsOpen && !isScreenSaverActive) {
      idleTimerRef.current = setTimeout(() => {
        setIsScreenSaverActive(true);
      }, (settings.idleTimeout || 30) * 1000);
    }
  }, [phase, isSettingsOpen, isScreenSaverActive, settings.idleTimeout]);

  // Global activity listener to detect user idle state
  useEffect(() => {
    resetIdleTimer();

    const activityEvents = ['pointerdown', 'pointermove', 'keydown', 'touchstart'];
    const handleUserActivity = () => {
      resetIdleTimer();
    };

    activityEvents.forEach((evt) => {
      window.addEventListener(evt, handleUserActivity, { passive: true });
    });

    return () => {
      if (idleTimerRef.current) {
        clearTimeout(idleTimerRef.current);
      }
      activityEvents.forEach((evt) => {
        window.removeEventListener(evt, handleUserActivity);
      });
    };
  }, [resetIdleTimer]);

  const handleStartGame = () => { setQuestionOrder(shuffleQuestions(QUESTIONS)); setAnswers([]); setScore(0); setPhase('learning'); };

  const handleRestart = () => {
    setPhase('welcome');
  };

  const handleToggleSound = () => {
    const next = !settings.soundEnabled;
    setSettings((prev) => ({ ...prev, soundEnabled: next }));
    sounds.setMuted(!next);
    if (next) sounds.playClick();
  };

  const updateSetting = (key, value) => setSettings((current) => {
    const nextSettings = { ...current, [key]: value };
    if (key === 'challengeQuestionCount') {
      nextSettings.targetScore = Math.min(current.targetScore, value);
    }
    return nextSettings;
  });

  return (
    <div className="kiosk-wrapper">
      {/* FULLSCREEN VIDEO LOOP SCREEN SAVER (LOCKED TO 9:16 PORTRAIT) */}
      {isScreenSaverActive && (
        <ScreenSaver
          playlist={videoPlaylist}
          videoVolume={settings.videoVolume !== undefined ? settings.videoVolume : 0.8}
          videoAudioEnabled={settings.videoAudioEnabled !== false}
          onDismiss={() => {
            setIsScreenSaverActive(false);
            resetIdleTimer();
          }}
        />
      )}

      <Header
        onOpenSettings={() => setIsSettingsOpen(true)}
        soundEnabled={settings.soundEnabled}
        onToggleSound={handleToggleSound}
        facilitatorControlOpacity={settings.facilitatorControlOpacity}
        showSettings={phase === 'welcome'}
      />

      {phase === 'welcome' && <QuizWelcomeScreen onStart={handleStartGame} />}
      {phase === 'learning' && <LearningScreen questions={questionOrder} duration={settings.learningDuration} testMode={settings.testMode} onComplete={() => setPhase('challenge')} />}
      {phase === 'challenge' && <ChallengeScreen questions={questionOrder} duration={settings.challengeDuration} maxQuestions={settings.challengeQuestionCount} testMode={settings.testMode} onComplete={(result) => { setAnswers(result); setPhase('review'); }} />}
      {phase === 'review' && <ReviewScreen answers={answers} onComplete={(result) => { setScore(result); setPhase(result >= settings.targetScore ? 'win' : 'lose'); }} />}
      {phase === 'win' && <WinScreen stats={{ pairsFound: score, timeSpent: answers.length }} autoResetDuration={settings.autoResetDuration} onRestart={handleRestart} />}
      {phase === 'lose' && <LoseScreen stats={{ pairsFound: score, timeSpent: answers.length }} autoResetDuration={settings.autoResetDuration} onRestart={handleRestart} />}
      <QuizSettingsModal isOpen={phase === 'welcome' && isSettingsOpen} onClose={() => setIsSettingsOpen(false)} settings={settings} onUpdate={updateSetting} onReset={() => setSettings(DEFAULT_SETTINGS)} playlist={videoPlaylist} onImportVideos={importVideos} onDeleteVideo={deleteVideo} onClearVideos={clearVideos} onPreviewScreenSaver={() => { setIsSettingsOpen(false); setIsScreenSaverActive(true); }} />
    </div>
  );
}
