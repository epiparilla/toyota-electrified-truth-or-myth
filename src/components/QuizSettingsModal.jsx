import React, { useRef } from 'react';
import { Clock, Eye, Film, RotateCcw, Sliders, Trash2, Upload, Volume2, X } from 'lucide-react';

const Slider = ({ label, value, min, max, step, suffix = 's', onChange }) => <div className="setting-row"><div className="setting-label-row"><span>{label}</span><span className="setting-val-badge">{value}{suffix}</span></div><input className="setting-slider" type="range" min={min} max={max} step={step} value={value} onChange={(event) => onChange(Number(event.target.value))} /></div>;

export default function QuizSettingsModal({ isOpen, onClose, settings, onUpdate, onReset, playlist, onImportVideos, onDeleteVideo, onClearVideos, onPreviewScreenSaver }) {
  const fileInputRef = useRef(null);
  if (!isOpen) return null;
  return <div className="modal-overlay" onClick={onClose}><div className="settings-card" onClick={(event) => event.stopPropagation()}>
    <div className="settings-title-row"><div className="settings-title"><Sliders size={22} color="var(--border-cyan)" /> Technician & Kiosk Config</div><button className="tech-icon-btn" onClick={onClose}><X size={18} /></button></div>
    <div className="settings-section-title"><Clock size={16} /> Game Configuration</div>
    <Slider label="Fact Exploration Time" value={settings.learningDuration} min={5} max={120} step={1} onChange={(value) => onUpdate('learningDuration', value)} />
    <Slider label="Truth or Myth Challenge Time" value={settings.challengeDuration} min={5} max={120} step={1} onChange={(value) => onUpdate('challengeDuration', value)} />
    <Slider label="Statements per Challenge" value={settings.challengeQuestionCount} min={1} max={14} step={1} suffix="" onChange={(value) => onUpdate('challengeQuestionCount', value)} />
    <Slider label="Correct Answers Needed to Win" value={Math.min(settings.targetScore, settings.challengeQuestionCount)} min={1} max={settings.challengeQuestionCount} step={1} suffix="" onChange={(value) => onUpdate('targetScore', value)} />
    <Slider label="Result Screen Auto-Reset" value={settings.autoResetDuration} min={5} max={120} step={1} onChange={(value) => onUpdate('autoResetDuration', value)} />
    <div className="settings-section-title">Facilitator controls</div>
    <Slider label="Facilitator Control Opacity" value={Math.round(settings.facilitatorControlOpacity * 100)} min={0} max={100} step={5} suffix="%" onChange={(value) => onUpdate('facilitatorControlOpacity', value / 100)} />
    <div className="settings-section-title"><Film size={16} /> Screen Saver & Video Playlist</div>
    <Slider label="Idle Waiting Time Before Screen Saver" value={settings.idleTimeout} min={5} max={600} step={1} onChange={(value) => onUpdate('idleTimeout', value)} />
    <div className="playlist-actions"><input ref={fileInputRef} type="file" accept="video/mp4,video/webm,video/*" multiple hidden onChange={(event) => event.target.files?.length && onImportVideos(event.target.files)} /><button className="btn-secondary" onClick={() => fileInputRef.current?.click()}><Upload size={15} /> Import Videos</button><button className="btn-secondary" onClick={onPreviewScreenSaver}><Eye size={15} /> Preview</button>{playlist.length > 0 && <button className="btn-secondary playlist-danger" onClick={onClearVideos}><Trash2 size={15} /> Clear</button>}</div>
    {playlist.length > 0 && <div className="playlist-list">{playlist.map((video) => <div key={video.id}><span>{video.name}</span><button onClick={() => onDeleteVideo(video.id)} aria-label={`Remove ${video.name}`}><Trash2 size={14} /></button></div>)}</div>}
    <div className="toggle-switch-row"><span>Enable Video Audio</span><button className={`toggle-switch ${settings.videoAudioEnabled ? 'active' : ''}`} onClick={() => onUpdate('videoAudioEnabled', !settings.videoAudioEnabled)}><i className="toggle-knob" /></button></div>
    {settings.videoAudioEnabled && <Slider label="Video Audio Volume" value={Math.round(settings.videoVolume * 100)} min={0} max={100} step={5} suffix="%" onChange={(value) => onUpdate('videoVolume', value / 100)} />}
    <div className="settings-section-title"><Volume2 size={16} /> Game sound</div>
    <div className="toggle-switch-row"><span>Enable UI / Match Chimes</span><button className={`toggle-switch ${settings.soundEnabled ? 'active' : ''}`} onClick={() => onUpdate('soundEnabled', !settings.soundEnabled)}><i className="toggle-knob" /></button></div>
    <Slider label="Game Audio Volume" value={Math.round(settings.soundVolume * 100)} min={0} max={100} step={5} suffix="%" onChange={(value) => onUpdate('soundVolume', value / 100)} />
    <div className="settings-section-title settings-section-title--qa">QA Testing</div>
    <div className="toggle-switch-row"><span>Enable Test Mode Helpers</span><button className={`toggle-switch ${settings.testMode ? 'active' : ''}`} onClick={() => onUpdate('testMode', !settings.testMode)}><i className="toggle-knob" /></button></div>
    <div className="settings-footer"><button className="btn-secondary" onClick={onReset}><RotateCcw size={16} /> Reset Defaults</button><button className="btn-toyota-red" onClick={onClose}>Done</button></div>
  </div></div>;
}
