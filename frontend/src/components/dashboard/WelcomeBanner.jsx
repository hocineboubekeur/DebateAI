import React from 'react';
import { Plus } from 'lucide-react';
import { translations } from '../../utils/translations';

export default function WelcomeBanner({ user, onStartNewDebate, lang = 'en' }) {
  const t = translations[lang] || translations.en;

  return (
    <div className="glass-panel" style={{
      padding: '36px',
      borderRadius: '24px',
      background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.2) 0%, rgba(168, 85, 247, 0.15) 100%)',
      border: '1px solid rgba(168, 85, 247, 0.3)',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexWrap: 'wrap',
      gap: '20px'
    }}>
      <div>
        <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '6px' }} className="gradient-text">
          {t.dash_welcome}, {user?.username || 'DebateChampion'}!
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', maxWidth: '600px' }}>
          {t.dash_subtitle}
        </p>
      </div>

      <button className="btn-primary" onClick={onStartNewDebate} style={{ padding: '14px 28px', fontSize: '1rem' }}>
        <Plus size={20} /> {t.start_debate}
      </button>
    </div>
  );
}
