import React, { useState } from 'react';
import { X, Mail, Code2, Globe, User, Shield, CheckCircle2, Loader2 } from 'lucide-react';
import { authAPI } from '../services/api';

import { translations } from '../utils/translations';

export default function AuthModal({ isOpen, onClose, onLoginSuccess, lang = 'en' }) {
  const t = translations[lang] || translations.en;
  const [mode, setMode] = useState('login'); // 'login' or 'register'
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [expLevel, setExpLevel] = useState('Intermediate');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleQuickOAuth = (provider) => {
    // OAuth integration planned for future release
    setError(lang === 'ar' ? `تسجيل دخول ${provider} قريبًا!` : `${provider} sign-in coming soon!`);
  };

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      let res;
      if (mode === 'register') {
        res = await authAPI.register({
          username,
          email,
          password
        });
      } else {
        res = await authAPI.login({
          username,
          password
        });
      }
      
      const token = res.data.token;
      const profile = res.data.user;
      
      if (token) {
        localStorage.setItem('debateai_token', token);
      }
      
      onLoginSuccess(profile, token);
      onClose();
    } catch (err) {
      const msg = err?.response?.data?.error 
        || (err?.response?.data?.username && `Username: ${err.response.data.username[0]}`)
        || 'Authentication failed. Try a different username.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(9, 13, 22, 0.85)',
      backdropFilter: 'blur(12px)',
      zIndex: 1000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div className="glass-panel" style={{ width: '100%', maxWidth: '520px', padding: '32px', borderRadius: '24px', border: '1px solid var(--border-glow)' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }} className="gradient-text">
              {mode === 'register' ? t.auth_create_account : t.auth_welcome_back}
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              {mode === 'register' ? t.auth_signup_desc : t.auth_signin_desc}
            </p>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
            <X size={24} />
          </button>
        </div>

        {/* OAuth Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
          <button 
            type="button" 
            className="btn-secondary" 
            onClick={() => handleQuickOAuth('google')}
            disabled={loading}
            style={{ justifyContent: 'center', padding: '12px' }}
          >
            <Globe size={18} color="#ea4335" /> {t.auth_google_coming}
          </button>

          <button 
            type="button" 
            className="btn-secondary" 
            onClick={() => handleQuickOAuth('github')}
            disabled={loading}
            style={{ justifyContent: 'center', padding: '12px' }}
          >
            <Code2 size={18} /> {t.auth_github_coming}
          </button>
        </div>

        <div style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.8rem', margin: '16px 0' }}>
          — {mode === 'register' ? t.auth_or_signup : t.auth_or_signin} —
        </div>

        {error && (
          <div style={{ background: 'rgba(244, 63, 94, 0.15)', border: '1px solid rgba(244, 63, 94, 0.3)', padding: '10px 14px', borderRadius: '10px', fontSize: '0.85rem', color: '#fb7185', marginBottom: '16px' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>{t.auth_username}</label>
            <input 
              type="text" 
              value={username} 
              onChange={(e) => setUsername(e.target.value)}
              placeholder={t.auth_choose_username}
              required
              minLength={3}
              maxLength={30}
              style={{ width: '100%', padding: '12px 16px', borderRadius: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-color)', color: 'white', outline: 'none' }}
            />
          </div>

          {mode === 'register' && (
            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>{t.auth_email}</label>
              <input 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                maxLength={100}
                style={{ width: '100%', padding: '12px 16px', borderRadius: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-color)', color: 'white', outline: 'none' }}
              />
            </div>
          )}

          <div>
            <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>{t.auth_password}</label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)}
              placeholder={t.auth_create_password}
              required
              minLength={6}
              maxLength={128}
              style={{ width: '100%', padding: '12px 16px', borderRadius: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-color)', color: 'white', outline: 'none' }}
            />
          </div>

          {mode === 'register' && (
            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>{t.auth_exp_level}</label>
              <select 
                value={expLevel} 
                onChange={(e) => setExpLevel(e.target.value)}
                style={{ width: '100%', padding: '12px 16px', borderRadius: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-color)', color: 'white', outline: 'none' }}
              >
                <option value="Novice" style={{ background: '#0f172a' }}>{t.auth_novice}</option>
                <option value="Intermediate" style={{ background: '#0f172a' }}>{t.auth_intermediate}</option>
                <option value="Advanced" style={{ background: '#0f172a' }}>{t.auth_advanced}</option>
              </select>
            </div>
          )}

          <button type="submit" className="btn-primary" disabled={loading} style={{ width: '100%', justifyContent: 'center', marginTop: '8px', padding: '12px' }}>
            {loading ? <><Loader2 size={18} className="pulse-glow" /> {t.auth_processing}</> : (mode === 'register' ? t.auth_create_and_start : t.auth_sign_in)}
          </button>
        </form>

        {/* Toggle between Login/Register */}
        <div style={{ textAlign: 'center', marginTop: '18px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          {mode === 'login' ? (
            <>{t.auth_no_account} <button onClick={() => { setMode('register'); setError(''); }} style={{ background: 'none', border: 'none', color: '#818cf8', cursor: 'pointer', fontWeight: 700 }}>{t.auth_sign_up}</button></>
          ) : (
            <>{t.auth_have_account} <button onClick={() => { setMode('login'); setError(''); }} style={{ background: 'none', border: 'none', color: '#818cf8', cursor: 'pointer', fontWeight: 700 }}>{t.auth_sign_in}</button></>
          )}
        </div>

      </div>
    </div>
  );
}
