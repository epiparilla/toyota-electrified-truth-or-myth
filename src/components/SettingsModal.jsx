import React, { useRef, useState } from 'react';
import {
  X,
  Sliders,
  Volume2,
  Clock,
  Film,
  Upload,
  Trash2,
  Eye,
  RotateCcw,
  Wrench,
  FileVideo,
  Plus,
  Maximize2
} from 'lucide-react';
import { sounds } from '../audio/soundEffects';
import { formatFileSize } from '../utils/videoStorage';

export default function SettingsModal({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
  onResetDefaults,
  videoPlaylist = [],
  onImportVideos,
  onDeleteVideo,
  onClearAllVideos,
  onPreviewScreenSaver
}) {
  const fileInputRef = useRef(null);
  const [isImporting, setIsImporting] = useState(false);

  if (!isOpen) return null;

  const handleChange = (key, value) => {
    onUpdateSettings({ ...settings, [key]: value });
  };

  const handleFileChange = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    try {
      setIsImporting(true);
      await onImportVideos(files);
      sounds.playMatch();
    } catch (err) {
      console.error('Failed to import video files:', err);
      sounds.playMismatch();
      alert('Could not cache video files. Please try valid MP4 or WebM video files.');
    } finally {
      setIsImporting(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const totalPlaylistSize = videoPlaylist.reduce((acc, v) => acc + (v.size || 0), 0);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="settings-card" onClick={(e) => e.stopPropagation()}>
        <div className="settings-title-row">
          <div className="settings-title">
            <Sliders size={22} color="var(--border-cyan)" />
            Technician & Kiosk Config
          </div>
          <button
            type="button"
            className="tech-icon-btn"
            onClick={() => {
              sounds.playClick();
              onClose();
            }}
            aria-label="Close Settings"
          >
            <X size={18} />
          </button>
        </div>

        {/* SCREEN SAVER & IDLE CONFIG */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'var(--border-cyan)', fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Film size={16} />
            <span>Screen Saver & Video Playlist</span>
          </div>
          <span style={{
            fontSize: '0.68rem',
            padding: '2px 8px',
            borderRadius: '4px',
            background: 'rgba(0, 240, 255, 0.1)',
            border: '1px solid rgba(0, 240, 255, 0.3)',
            color: 'var(--border-cyan)'
          }}>
            9:16 Portrait Enforced
          </span>
        </div>

        {/* Idle Waiting Time Slider */}
        <div className="setting-row">
          <div className="setting-label-row">
            <span>Idle Waiting Time Before Screen Saver</span>
            <span className="setting-val-badge">{settings.idleTimeout}s</span>
          </div>
          <input
            type="range"
            min="5"
            max="180"
            step="5"
            className="setting-slider"
            value={settings.idleTimeout}
            onChange={(e) => handleChange('idleTimeout', Number(e.target.value))}
          />
        </div>

        <div className="setting-row">
          <div className="setting-label-row">
            <span>Facilitator Control Opacity</span>
            <span className="setting-val-badge">{Math.round((settings.facilitatorControlOpacity ?? 0.5) * 100)}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            className="setting-slider"
            value={settings.facilitatorControlOpacity ?? 0.5}
            onChange={(e) => handleChange('facilitatorControlOpacity', Number(e.target.value))}
          />
        </div>

        {/* Multiple Video Import & Playlist Container */}
        <div style={{
          background: 'rgba(14, 21, 37, 0.75)',
          border: '1px solid rgba(0, 240, 255, 0.3)',
          borderRadius: '10px',
          padding: '12px',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>Import Video Loops</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                Select multiple files (MP4/WebM) to loop sequentially
              </div>
            </div>

            <input
              type="file"
              ref={fileInputRef}
              multiple
              accept="video/mp4,video/webm,video/*"
              style={{ display: 'none' }}
              onChange={handleFileChange}
            />

            <button
              type="button"
              className="btn-toyota-red"
              style={{
                padding: '7px 16px',
                fontSize: '0.82rem',
                letterSpacing: '1px',
                gap: '6px'
              }}
              disabled={isImporting}
              onClick={() => {
                sounds.playClick();
                fileInputRef.current?.click();
              }}
            >
              {videoPlaylist.length > 0 ? <Plus size={14} /> : <Upload size={14} />}
              {isImporting ? 'Caching...' : videoPlaylist.length > 0 ? 'Add Files' : 'Import Videos'}
            </button>
          </div>

          {/* Video Playlist Items */}
          {videoPlaylist.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                fontSize: '0.75rem',
                color: 'var(--success-green)',
                borderBottom: '1px solid rgba(0, 240, 255, 0.15)',
                paddingBottom: '4px'
              }}>
                <span>{videoPlaylist.length} Video{videoPlaylist.length > 1 ? 's' : ''} in Playlist ({formatFileSize(totalPlaylistSize)})</span>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    type="button"
                    className="btn-secondary"
                    style={{ padding: '3px 8px', fontSize: '0.7rem', display: 'flex', alignItems: 'center', gap: '4px' }}
                    onClick={() => {
                      sounds.playClick();
                      onPreviewScreenSaver();
                    }}
                  >
                    <Eye size={12} /> Preview
                  </button>
                  <button
                    type="button"
                    className="btn-secondary"
                    style={{ padding: '3px 8px', fontSize: '0.7rem', color: '#FF6B6B', borderColor: 'rgba(238, 0, 0, 0.4)' }}
                    onClick={() => {
                      sounds.playClick();
                      onClearAllVideos();
                    }}
                  >
                    Clear All
                  </button>
                </div>
              </div>

              <div style={{
                maxHeight: '140px',
                overflowY: 'auto',
                display: 'flex',
                flexDirection: 'column',
                gap: '6px',
                paddingRight: '4px'
              }}>
                {videoPlaylist.map((video, idx) => (
                  <div
                    key={video.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      background: 'rgba(10, 16, 28, 0.8)',
                      border: '1px solid rgba(0, 240, 255, 0.2)',
                      borderRadius: '6px',
                      padding: '6px 10px'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0, flex: 1 }}>
                      <span style={{ fontSize: '0.72rem', color: 'var(--border-cyan)', fontWeight: 800 }}>#{idx + 1}</span>
                      <FileVideo size={15} color="var(--border-cyan)" style={{ flexShrink: 0 }} />
                      <div style={{ minWidth: 0, overflow: 'hidden' }}>
                        <div style={{ fontSize: '0.78rem', fontWeight: 600, color: '#FFFFFF', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                          {video.name}
                        </div>
                        <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                          {formatFileSize(video.size)}
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: 'var(--text-muted)',
                        cursor: 'pointer',
                        padding: '4px',
                        display: 'flex',
                        alignItems: 'center'
                      }}
                      onClick={() => {
                        sounds.playClick();
                        onDeleteVideo(video.id);
                      }}
                      title="Remove Video"
                    >
                      <Trash2 size={13} hover="color: #FF6B6B" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: '0.75rem',
              color: 'var(--text-muted)'
            }}>
              <span>No custom videos imported yet. (Default animated attract loop active)</span>
              <button
                type="button"
                className="btn-secondary"
                style={{ padding: '4px 8px', fontSize: '0.72rem', display: 'flex', alignItems: 'center', gap: '4px' }}
                onClick={() => {
                  sounds.playClick();
                  onPreviewScreenSaver();
                }}
              >
                <Eye size={12} /> Preview
              </button>
            </div>
          )}

          {/* SCREENSAVER AUDIO SETTINGS */}
          <div style={{
            borderTop: '1px solid rgba(0, 240, 255, 0.15)',
            paddingTop: '8px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px'
          }}>
            <div className="toggle-switch-row" style={{ padding: '4px 0' }}>
              <div>
                <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Enable Video Audio</span>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                  Play audio tracks accompanying imported screensaver videos
                </div>
              </div>
              <div
                className={`toggle-switch ${settings.videoAudioEnabled ? 'active' : ''}`}
                onClick={() => {
                  const next = !settings.videoAudioEnabled;
                  handleChange('videoAudioEnabled', next);
                  sounds.playClick();
                }}
              >
                <div className="toggle-knob" />
              </div>
            </div>

            {settings.videoAudioEnabled && (
              <div className="setting-row">
                <div className="setting-label-row">
                  <span>Video Audio Volume</span>
                  <span className="setting-val-badge">{Math.round((settings.videoVolume || 0.8) * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  className="setting-slider"
                  value={settings.videoVolume !== undefined ? settings.videoVolume : 0.8}
                  onChange={(e) => handleChange('videoVolume', Number(e.target.value))}
                />
              </div>
            )}
          </div>
        </div>

        {/* GAMEPLAY TIMERS */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--border-cyan)', fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', marginTop: '6px' }}>
          <Clock size={16} />
          <span>Gameplay Timers (Testing Mode)</span>
        </div>

        {/* Grid Preview Duration */}
        <div className="setting-row">
          <div className="setting-label-row">
            <span>Grid Peek Time</span>
            <span className="setting-val-badge">{settings.gridPreviewDuration}s</span>
          </div>
          <input
            type="range"
            min="1"
            max="20"
            step="1"
            className="setting-slider"
            value={settings.gridPreviewDuration}
            onChange={(e) => handleChange('gridPreviewDuration', Number(e.target.value))}
          />
        </div>

        {/* Setting 3: Main Game Duration */}
        <div className="setting-row">
          <div className="setting-label-row">
            <span>Main Game Play Time</span>
            <span className="setting-val-badge">{settings.gameDuration}s</span>
          </div>
          <input
            type="range"
            min="5"
            max="120"
            step="5"
            className="setting-slider"
            value={settings.gameDuration}
            onChange={(e) => handleChange('gameDuration', Number(e.target.value))}
          />
        </div>

        {/* Setting 4: Required Pairs to Win */}
        <div className="setting-row">
          <div className="setting-label-row">
            <span>Pairs Needed to Win (Goal)</span>
            <span className="setting-val-badge" style={{ color: 'var(--success-green)' }}>
              {settings.targetPairsToWin} Pairs
            </span>
          </div>
          <input
            type="range"
            min="1"
            max="8"
            step="1"
            className="setting-slider"
            value={settings.targetPairsToWin}
            onChange={(e) => handleChange('targetPairsToWin', Number(e.target.value))}
          />
        </div>

        {/* Setting 5: Auto-Reset Timer */}
        <div className="setting-row">
          <div className="setting-label-row">
            <span>Win/Lose Screen Auto-Reset</span>
            <span className="setting-val-badge">{settings.autoResetDuration}s</span>
          </div>
          <input
            type="range"
            min="2"
            max="20"
            step="1"
            className="setting-slider"
            value={settings.autoResetDuration}
            onChange={(e) => handleChange('autoResetDuration', Number(e.target.value))}
          />
        </div>

        {/* GAME SFX SETTINGS */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--border-cyan)', fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', marginTop: '4px' }}>
          <Volume2 size={16} />
          <span>Game Sound Effects</span>
        </div>

        <div className="toggle-switch-row">
          <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>Enable UI / Match Chimes</span>
          <div
            className={`toggle-switch ${settings.soundEnabled ? 'active' : ''}`}
            onClick={() => {
              const next = !settings.soundEnabled;
              sounds.setMuted(!next);
              handleChange('soundEnabled', next);
              if (next) sounds.playClick();
            }}
          >
            <div className="toggle-knob" />
          </div>
        </div>

        <div className="setting-row">
          <div className="setting-label-row">
            <span>Game Audio Volume</span>
            <span className="setting-val-badge">{Math.round(settings.soundVolume * 100)}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            className="setting-slider"
            value={settings.soundVolume}
            onChange={(e) => {
              const vol = Number(e.target.value);
              sounds.setVolume(vol);
              handleChange('soundVolume', vol);
            }}
          />
        </div>

        {/* QA TESTING MODE TOGGLE */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--toyota-red-bright)', fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', marginTop: '4px' }}>
          <Wrench size={16} />
          <span>QA Test Helper Mode</span>
        </div>

        <div className="toggle-switch-row">
          <div>
            <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>Enable Test Mode Helpers</div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
              Adds Skip Phase, X-Ray Vision, and Instant Win buttons
            </div>
          </div>
          <div
            className={`toggle-switch ${settings.testMode ? 'active' : ''}`}
            onClick={() => {
              handleChange('testMode', !settings.testMode);
              sounds.playClick();
            }}
          >
            <div className="toggle-knob" />
          </div>
        </div>

        {/* BUTTON ACTIONS */}
        <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
          <button
            type="button"
            className="btn-secondary"
            style={{ padding: '10px', fontSize: '0.9rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
            onClick={() => {
              sounds.playClick();
              onResetDefaults();
            }}
          >
            <RotateCcw size={16} />
            Reset Defaults
          </button>
          <button
            type="button"
            className="btn-toyota-red"
            style={{ flex: 1, padding: '10px', fontSize: '0.95rem' }}
            onClick={() => {
              sounds.playClick();
              onClose();
            }}
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
