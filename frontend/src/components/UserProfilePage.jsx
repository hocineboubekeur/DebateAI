import React, { useState } from 'react';
import { User, Trophy, Flame, Award, Brain, Shield, Sparkles, CheckCircle2, Pencil, Check, X, LogIn } from 'lucide-react';
import { authAPI } from '../services/api';
import DebateDNA from './DebateDNA';
import AchievementsModal from './AchievementsModal';

import { translations } from '../utils/translations';

export default function UserProfilePage({ user, onUserUpdate, onOpenAuth, lang = 'en' }) {
  const t = translations[lang] || translations.en;
  const [activeSubTab, setActiveSubTab] = useState('overview');
  const [isEditingName, setIsEditingName] = useState(false);
  const [editName, setEditName] = useState(user?.username || 'DebateChampion');
  const [nameError, setNameError] = useState('');
  const [saving, setSaving] = useState(false);

  const level = user?.level || 0;
  const xp = user?.xp || 0;
  const dp = user?.dp || 0;
  const title = user?.current_title || "No Title Yet";
  const streak = user?.streak_days || 0;

  const handleSaveName = async () => {
    if (!editName.trim()) return;
    setSaving(true);
    setNameError('');
    try {
      const res = await authAPI.updateProfile({ username: editName.trim() });
      if (onUserUpdate) onUserUpdate(res.data);
      setIsEditingName(false);
    } catch (err) {
      const msg = err?.response?.data?.error || 'Failed to update name.';
      setNameError(msg);
    } finally {
      setSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setEditName(user?.username || 'DebateChampion');
    setIsEditingName(false);
    setNameError('');
  };

  return (
    <div style={{ maxWidth: '1080px', margin: '0 auto', padding: '0 24px 40px 24px', display: 'flex', flexDirection: 'column', gap: '28px' }}>
      
      {/* Profile Header Hero */}
      <div className="glass-panel" style={{
        padding: '32px',
        borderRadius: '24px',
        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.2) 0%, rgba(168, 85, 247, 0.15) 100%)',
        border: '1px solid rgba(168, 85, 247, 0.3)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '24px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{
            width: '80px',
            height: '80px',
            borderRadius: '24px',
            background: 'linear-gradient(135deg, #6366f1, #a855f7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 24px rgba(99, 102, 241, 0.4)'
          }}>
            <User size={40} color="#ffffff" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
              {isEditingName ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    autoFocus
                    onKeyDown={(e) => { if (e.key === 'Enter') handleSaveName(); if (e.key === 'Escape') handleCancelEdit(); }}
                    style={{
                      fontSize: '1.4rem',
                      fontWeight: 800,
                      background: 'rgba(255,255,255,0.08)',
                      border: '2px solid #818cf8',
                      borderRadius: '10px',
                      color: 'white',
                      padding: '6px 12px',
                      outline: 'none',
                      width: '200px'
                    }}
                  />
                  <button onClick={handleSaveName} disabled={saving} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#34d399' }} title="Save">
                    <Check size={22} />
                  </button>
                  <button onClick={handleCancelEdit} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#fb7185' }} title="Cancel">
                    <X size={22} />
                  </button>
                </div>
              ) : (
                <>
                  <h2 style={{ fontSize: '1.8rem', fontWeight: 800 }}>{user?.username || 'DebateChampion'}</h2>
                  <button 
                    onClick={() => { setEditName(user?.username || 'DebateChampion'); setIsEditingName(true); }}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: '4px' }}
                    title="Edit display name"
                  >
                    <Pencil size={16} />
                  </button>
                </>
              )}
              <span className="badge badge-purple">{title}</span>
            </div>
            {nameError && <p style={{ color: '#fb7185', fontSize: '0.8rem', marginBottom: '4px' }}>{nameError}</p>}
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Level {level} Competitor • Reasoning Practitioner</p>
          </div>
        </div>

        {/* Stats Pills & Sign In Button */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
          <div style={{ background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '10px 18px', borderRadius: '16px', textAlign: 'center' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Career Points</span>
            <strong style={{ fontSize: '1.2rem', color: '#34d399' }}>{dp} DP</strong>
          </div>

          <div style={{ background: 'rgba(245, 158, 11, 0.15)', border: '1px solid rgba(245, 158, 11, 0.3)', padding: '10px 18px', borderRadius: '16px', textAlign: 'center' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Daily Streak</span>
            <strong style={{ fontSize: '1.2rem', color: '#fbbf24' }}>{streak} Days</strong>
          </div>

          <div style={{ background: 'rgba(99, 102, 241, 0.15)', border: '1px solid rgba(99, 102, 241, 0.3)', padding: '10px 18px', borderRadius: '16px', textAlign: 'center' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Experience</span>
            <strong style={{ fontSize: '1.2rem', color: '#818cf8' }}>{xp} XP</strong>
          </div>

          {/* Sign In / Switch Account Button */}
          <button 
            className="btn-primary" 
            onClick={onOpenAuth}
            style={{ padding: '12px 20px', gap: '8px', fontSize: '0.9rem', height: 'fit-content', alignSelf: 'center' }}
          >
            <LogIn size={18} />
            Sign In / Switch Account
          </button>
        </div>
      </div>

      {/* Subtab Navigation */}
      <div style={{ display: 'flex', gap: '10px', background: 'rgba(255,255,255,0.04)', padding: '4px', borderRadius: '12px', border: '1px solid var(--border-color)', width: 'fit-content' }}>
        {[
          { key: 'overview', label: 'Overview Statistics' },
          { key: 'dna', label: 'Debate DNA Matrix' },
          { key: 'achievements', label: 'Badges & Achievements' }
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveSubTab(tab.key)}
            style={{
              padding: '8px 18px',
              borderRadius: '8px',
              border: 'none',
              background: activeSubTab === tab.key ? '#6366f1' : 'transparent',
              color: 'white',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Subtab Content */}
      {activeSubTab === 'overview' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
          <div className="glass-panel" style={{ padding: '24px', borderRadius: '20px' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '14px' }}>Career Milestones</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              <div>• Total Debates Completed: <strong style={{ color: 'white' }}>{user?.total_debates || 0}</strong></div>
              <div>• Overall Win Rate: <strong style={{ color: '#34d399' }}>{user?.win_rate || '0%'}</strong></div>
              <div>• Highest Scoring Persona Defeated: <strong style={{ color: '#c084fc' }}>{user?.highest_persona_defeated || 'None'}</strong></div>
              <div>• Favorite Style: <strong style={{ color: '#fbbf24' }}>{user?.favorite_style || 'Not enough data'}</strong></div>
            </div>
          </div>

          <div className="glass-panel" style={{ padding: '24px', borderRadius: '20px' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '14px' }}>Unlocked Career Titles</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {user?.unlocked_titles?.length ? user.unlocked_titles.map(t => (
                <span key={t} className="badge badge-purple" style={{ padding: '6px 12px' }}>{t}</span>
              )) : (
                <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>No titles yet</span>
              )}
            </div>
          </div>
        </div>
      )}

      {activeSubTab === 'dna' && <DebateDNA lang={lang} />}

      {activeSubTab === 'achievements' && <AchievementsModal lang={lang} />}

    </div>
  );
}
