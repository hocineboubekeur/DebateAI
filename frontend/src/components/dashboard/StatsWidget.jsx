import React from 'react';
import { Swords, Trophy, Brain, Award } from 'lucide-react';
import { translations } from '../../utils/translations';

export default function StatsWidget({ totalDebates, winRate, dnaScore, user, lang = 'en' }) {
  const t = translations[lang] || translations.en;

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
      <div className="glass-panel" style={{ padding: '24px', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{ padding: '14px', borderRadius: '16px', background: 'rgba(99, 102, 241, 0.15)' }}>
          <Swords size={28} color="#818cf8" />
        </div>
        <div>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block' }}>{t.dash_total_debates}</span>
          <strong style={{ fontSize: '1.6rem', color: '#ffffff' }}>{totalDebates}</strong>
        </div>
      </div>

      <div className="glass-panel" style={{ padding: '24px', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{ padding: '14px', borderRadius: '16px', background: 'rgba(16, 185, 129, 0.15)' }}>
          <Trophy size={28} color="#34d399" />
        </div>
        <div>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block' }}>{t.dash_win_rate}</span>
          <strong style={{ fontSize: '1.6rem', color: '#34d399' }}>{winRate}%</strong>
        </div>
      </div>

      <div className="glass-panel" style={{ padding: '24px', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{ padding: '14px', borderRadius: '16px', background: 'rgba(168, 85, 247, 0.15)' }}>
          <Brain size={28} color="#c084fc" />
        </div>
        <div>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block' }}>{t.dash_dna_score}</span>
          <strong style={{ fontSize: '1.6rem', color: '#c084fc' }}>{dnaScore} / 100</strong>
        </div>
      </div>

      <div className="glass-panel" style={{ padding: '24px', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{ padding: '14px', borderRadius: '16px', background: 'rgba(245, 158, 11, 0.15)' }}>
          <Award size={28} color="#fbbf24" />
        </div>
        <div>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block' }}>{t.dash_career_dp}</span>
          <strong style={{ fontSize: '1.6rem', color: '#fbbf24' }}>{user?.dp || 0} DP</strong>
        </div>
      </div>
    </div>
  );
}
