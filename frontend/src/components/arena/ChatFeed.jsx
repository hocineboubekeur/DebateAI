import React from 'react';
import { Bot, User, Volume2, AlertTriangle, Sparkles } from 'lucide-react';

export default function ChatFeed({ 
  turns, 
  loading, 
  personaName, 
  chatEndRef, 
  speakText 
}) {
  return (
    <div className="glass-panel" style={{
      padding: '28px',
      borderRadius: '24px',
      minHeight: '460px',
      maxHeight: '580px',
      overflowY: 'auto',
      display: 'flex',
      flexDirection: 'column',
      gap: '24px'
    }}>
      {turns.length === 0 ? (
        <div style={{ textAlign: 'center', margin: 'auto', color: 'var(--text-muted)' }}>
          <Bot size={48} style={{ opacity: 0.4, marginBottom: '12px' }} />
          <p>Initializing AI Debater persona ({personaName})...</p>
        </div>
      ) : (
        turns.map((turn, index) => {
          const isUser = turn.speaker === 'USER';
          return (
            <div 
              key={index} 
              style={{
                display: 'flex',
                gap: '14px',
                alignSelf: isUser ? 'flex-end' : 'flex-start',
                maxWidth: '82%',
                flexDirection: isUser ? 'row-reverse' : 'row'
              }}
            >
              {/* Avatar */}
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '12px',
                background: isUser ? 'linear-gradient(135deg, #34d399, #059669)' : 'linear-gradient(135deg, #6366f1, #a855f7)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                {isUser ? <User size={20} color="#ffffff" /> : <Bot size={20} color="#ffffff" />}
              </div>

              {/* Speech Bubble */}
              <div style={{
                background: isUser ? 'rgba(16, 185, 129, 0.12)' : 'rgba(30, 41, 59, 0.85)',
                border: isUser ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid var(--border-color)',
                padding: '16px 20px',
                borderRadius: isUser ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                color: 'var(--text-main)',
                lineHeight: '1.6',
                fontSize: '0.95rem'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  <span style={{ fontWeight: 700, color: isUser ? '#34d399' : '#c084fc' }}>
                    {isUser ? 'You' : personaName}
                  </span>
                  <button 
                    onClick={() => speakText(turn.text)} 
                    style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
                    title="Play Audio Readout"
                  >
                    <Volume2 size={14} />
                  </button>
                </div>

                <p style={{ whiteSpace: 'pre-wrap' }}>{turn.text}</p>

                {/* Fallacies Warning Chip */}
                {isUser && turn.fallacies_detected && turn.fallacies_detected.length > 0 && (
                  <div style={{ marginTop: '12px', background: 'rgba(244, 63, 94, 0.15)', border: '1px solid rgba(244, 63, 94, 0.3)', padding: '8px 12px', borderRadius: '8px', fontSize: '0.8rem', color: '#fb7185' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700, marginBottom: '2px' }}>
                      <AlertTriangle size={14} /> Fallacy Alert Detected
                    </div>
                    {turn.fallacies_detected.map((f, i) => (
                      <div key={i}>• <strong>{f.name}:</strong> {f.reason}</div>
                    ))}
                  </div>
                )}

              </div>
            </div>
          );
        })
      )}

      {loading && (
        <div style={{ display: 'flex', gap: '14px', alignSelf: 'flex-start' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'linear-gradient(135deg, #6366f1, #a855f7)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Bot size={20} color="#ffffff" />
          </div>
          <div className="glass-panel" style={{ padding: '14px 20px', borderRadius: '18px', color: 'var(--text-muted)', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sparkles size={16} className="pulse-glow" color="#a855f7" />
            {personaName} is formulating counter-argument...
          </div>
        </div>
      )}

      <div ref={chatEndRef} />
    </div>
  );
}
