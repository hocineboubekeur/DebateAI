import React from 'react';
import { ArrowLeft, Clock, Volume2, VolumeX, Gavel } from 'lucide-react';

export default function ArenaHeader({ 
  debate, 
  roundCount, 
  timeLeft, 
  autoTTS, 
  setAutoTTS, 
  onFinishDebate, 
  onExitArena, 
  turnsLength, 
  loading 
}) {
  const formatTimer = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="glass-panel" style={{ padding: '16px 24px', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        <button className="btn-secondary" onClick={onExitArena} style={{ padding: '8px 12px' }}>
          <ArrowLeft size={16} /> Exit Arena
        </button>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
            <span className="badge badge-purple">Round {roundCount}</span>
            <span className="badge badge-emerald">Stance: {debate?.user_side}</span>
            <span className="badge badge-amber">{debate?.style} Style</span>
          </div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>{debate?.topic}</h2>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        {/* Round Timer Countdown Widget */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(239, 68, 68, 0.12)', border: '1px solid rgba(239, 68, 68, 0.3)', padding: '6px 14px', borderRadius: '20px', color: '#fca5a5', fontWeight: 700, fontSize: '0.9rem' }}>
          <Clock size={16} color="#fca5a5" /> {formatTimer(timeLeft)}
        </div>

        {/* TTS Audio Readout Toggle */}
        <button 
          type="button"
          className="btn-secondary" 
          onClick={() => setAutoTTS(!autoTTS)}
          style={{ padding: '8px 14px', fontSize: '0.82rem', borderColor: autoTTS ? '#34d399' : 'var(--border-color)' }}
        >
          {autoTTS ? <Volume2 size={16} color="#34d399" /> : <VolumeX size={16} color="var(--text-muted)" />}
          {autoTTS ? 'Voice Readout ON' : 'Voice Readout OFF'}
        </button>

      </div>
    </div>
  );
}
