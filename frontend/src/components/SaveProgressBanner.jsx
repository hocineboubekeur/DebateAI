import React, { useState } from 'react';
import { Trophy, X, UserPlus } from 'lucide-react';

import { translations } from '../utils/translations';

export default function SaveProgressBanner({ onSignUp, onDismiss, lang = 'en' }) {
  const t = translations[lang] || translations.en;
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  const handleDismiss = () => {
    setVisible(false);
    if (onDismiss) onDismiss();
  };

  return (
    <div style={{
      position: 'fixed',
      bottom: '24px',
      left: '50%',
      transform: 'translateX(-50%)',
      maxWidth: '640px',
      width: 'calc(100% - 48px)',
      zIndex: 900,
      background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.95) 0%, rgba(168, 85, 247, 0.95) 100%)',
      borderRadius: '20px',
      padding: '20px 24px',
      display: 'flex',
      alignItems: 'center',
      gap: '16px',
      boxShadow: '0 12px 40px rgba(99, 102, 241, 0.4), 0 0 0 1px rgba(255,255,255,0.15) inset',
      animation: 'slideUp 0.5s ease-out'
    }}>
      <div style={{
        width: '48px',
        height: '48px',
        borderRadius: '14px',
        background: 'rgba(255,255,255,0.2)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0
      }}>
        <Trophy size={26} color="#fbbf24" />
      </div>

      <div style={{ flex: 1 }}>
        <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'white', marginBottom: '3px' }}>
          🏆 {t.save_banner_title}
        </h4>
        <p style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.8)', lineHeight: '1.4' }}>
          {t.save_banner_desc}
        </p>
      </div>

      <button
        onClick={onSignUp}
        style={{
          background: 'white',
          color: '#6366f1',
          border: 'none',
          borderRadius: '12px',
          padding: '10px 20px',
          fontWeight: 700,
          fontSize: '0.88rem',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          flexShrink: 0,
          transition: 'transform 0.2s ease'
        }}
        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
      >
        <UserPlus size={16} /> {t.save_banner_sign_in}
      </button>

      <button
        onClick={handleDismiss}
        style={{
          background: 'none',
          border: 'none',
          color: 'rgba(255,255,255,0.6)',
          cursor: 'pointer',
          padding: '4px',
          flexShrink: 0
        }}
        title="Dismiss"
      >
        <X size={18} />
      </button>

      <style>{`
        @keyframes slideUp {
          from { transform: translateX(-50%) translateY(100px); opacity: 0; }
          to { transform: translateX(-50%) translateY(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
