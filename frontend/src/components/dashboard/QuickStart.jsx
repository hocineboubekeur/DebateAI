import React from 'react';
import { ArrowRight } from 'lucide-react';
import { translations } from '../../utils/translations';

export default function QuickStart({ onStartNewDebate, personas, lang = 'en' }) {
  const t = translations[lang] || translations.en;

  return (
    <div>
      <h3 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '16px' }}>{t.dash_quick_start}</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
        {personas.map((p) => (
          <div key={p.id} className="glass-panel" style={{ padding: '20px', borderRadius: '18px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <span className="badge badge-purple" style={{ marginBottom: '8px' }}>AI PERSONA</span>
              <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '6px' }}>{p.name}</h4>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: '1.4', marginBottom: '16px' }}>{p.desc}</p>
            </div>
            <button className="btn-secondary" onClick={onStartNewDebate} style={{ width: '100%', justifyContent: 'center', fontSize: '0.85rem' }}>
              {t.start_debate} <ArrowRight size={14} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
