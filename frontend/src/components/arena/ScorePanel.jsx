import React from 'react';

export default function ScorePanel({ avgLogic, avgPersuasion, totalFallacies }) {
  return (
    <div className="glass-panel" style={{ padding: '12px 24px', borderRadius: '16px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', fontSize: '0.82rem' }}>
      <div>
        <span style={{ color: 'var(--text-muted)' }}>Logic Score: </span>
        <strong style={{ color: '#818cf8' }}>{avgLogic}/100</strong>
        <div style={{ height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px', marginTop: '4px', overflow: 'hidden' }}>
          <div style={{ width: `${avgLogic}%`, height: '100%', background: '#818cf8' }} />
        </div>
      </div>

      <div>
        <span style={{ color: 'var(--text-muted)' }}>Persuasion Index: </span>
        <strong style={{ color: '#34d399' }}>{avgPersuasion}/100</strong>
        <div style={{ height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px', marginTop: '4px', overflow: 'hidden' }}>
          <div style={{ width: `${avgPersuasion}%`, height: '100%', background: '#34d399' }} />
        </div>
      </div>

      <div>
        <span style={{ color: 'var(--text-muted)' }}>Fallacies Triggered: </span>
        <strong style={{ color: totalFallacies === 0 ? '#34d399' : '#fb7185' }}>{totalFallacies} Detected</strong>
        <div style={{ height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px', marginTop: '4px', overflow: 'hidden' }}>
          <div style={{ width: `${Math.min(100, totalFallacies * 25)}%`, height: '100%', background: totalFallacies === 0 ? '#34d399' : '#fb7185' }} />
        </div>
      </div>
    </div>
  );
}
