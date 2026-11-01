import React, { useState, useEffect } from 'react';
import { Swords, Trophy, Flame, BookOpen, Users, Brain, Shield, Award, Crown, User, LogIn, LogOut, CheckCircle2, ShieldCheck, Globe, Zap, Search, History } from 'lucide-react';
import { translations } from '../utils/translations';

export default function Navbar({ activeTab, setActiveTab, user, isLoggedIn, lang, setLang, onStartNewDebate, onOpenAuth, onLogout, onOpenSearch }) {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const t = translations[lang] || translations.en;

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 60) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const navItems = [
    { id: 'dashboard', label: t.nav_dashboard, icon: Swords },
    { id: 'vault', label: t.nav_vault, icon: Shield },
    { id: 'timeline', label: lang === 'ar' ? 'الجدول الزمني' : 'Timeline', icon: History },
    { id: 'sandbox', label: lang === 'ar' ? 'صندوق الرمل' : 'Sandbox', icon: Zap },
    { id: 'dna', label: t.nav_dna, icon: Brain },
    { id: 'vocabulary', label: t.nav_vocabulary || 'Vocabulary', icon: BookOpen },
    { id: 'library', label: t.nav_library, icon: BookOpen },
    { id: 'community', label: t.nav_community, icon: Users },
    { id: 'tournaments', label: t.nav_tournaments, icon: Crown },
    { id: 'achievements', label: t.nav_achievements, icon: Award },
    { id: 'profile', label: t.nav_profile, icon: User },
  ];

  if (user?.is_staff) {
    navItems.push({ id: 'admin', label: t.nav_admin, icon: ShieldCheck });
  }

  const currentLevel = user?.level || 1;
  const currentXP = user?.xp || 0;
  const currentDP = user?.dp || 0;
  const streak = user?.streak_days || 0;
  const xpPercentage = Math.min(100, currentXP % 100);

  const toggleLanguage = () => {
    const nextLang = lang === 'ar' ? 'en' : 'ar';
    setLang(nextLang);
    localStorage.setItem('debateai_lang', nextLang);
    document.documentElement.dir = nextLang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = nextLang;
  };

  return (
    <header className="glass-panel" style={{
      margin: '16px',
      padding: '12px 24px',
      borderRadius: '16px',
      position: 'sticky',
      top: '16px',
      zIndex: 100,
      transform: isVisible ? 'translateY(0)' : 'translateY(-120%)',
      transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        
        {/* Brand Logo */}
        <div 
          onClick={() => setActiveTab('dashboard')} 
          style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}
        >
          <div style={{
            background: 'linear-gradient(135deg, #6366f1, #a855f7)',
            padding: '10px',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 16px rgba(99, 102, 241, 0.4)'
          }}>
            <Swords size={24} color="#ffffff" />
          </div>
          <div>
            <h1 style={{ fontSize: '1.4rem', fontWeight: 800 }} className="gradient-text">DebateAI</h1>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', letterSpacing: '0.05em' }}>{t.brand_subtitle}</span>
          </div>
        </div>

        {/* Nav Links */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'rgba(255,255,255,0.04)', padding: '4px', borderRadius: '12px', border: '1px solid var(--border-color)', flexWrap: 'wrap' }}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  border: 'none',
                  background: isActive ? 'linear-gradient(135deg, rgba(99, 102, 241, 0.25), rgba(168, 85, 247, 0.25))' : 'transparent',
                  color: isActive ? '#ffffff' : 'var(--text-muted)',
                  borderBottom: isActive ? '2px solid #818cf8' : '2px solid transparent',
                  fontWeight: isActive ? 600 : 400,
                  fontSize: '0.84rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                <Icon size={15} color={isActive ? '#818cf8' : 'var(--text-muted)'} />
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* User Stats & Language Toggle */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          
          {/* Search Button */}
          <button
            onClick={onOpenSearch}
            className="btn-secondary"
            style={{
              padding: '6px 10px',
              fontSize: '0.82rem',
              gap: '6px',
            }}
            title="Search / بحث (Ctrl+K)"
          >
            <Search size={16} color="var(--text-color)" />
          </button>

          {/* Language Switcher Button */}
          <button
            onClick={toggleLanguage}
            className="btn-secondary"
            style={{
              padding: '6px 12px',
              fontSize: '0.82rem',
              gap: '6px',
              borderColor: 'rgba(168, 85, 247, 0.4)',
              color: '#c084fc',
              fontWeight: 700
            }}
            title="Switch Language / تغيير اللغة"
          >
            <Globe size={15} />
            {lang === 'ar' ? 'English 🇬🇧' : 'العربية 🇸🇦'}
          </button>

          {/* Streak Counter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(245, 158, 11, 0.12)', padding: '6px 12px', borderRadius: '20px', border: '1px solid rgba(245, 158, 11, 0.3)' }}>
            <Flame size={18} color="#f59e0b" className="pulse-glow" />
            <span style={{ fontWeight: 700, fontSize: '0.85rem', color: '#fbbf24' }}>{streak}d</span>
          </div>

          {/* DP Points Badge */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(16, 185, 129, 0.12)', padding: '6px 12px', borderRadius: '20px', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
            <Trophy size={16} color="#34d399" />
            <span style={{ fontWeight: 700, fontSize: '0.85rem', color: '#34d399' }}>{currentDP} DP</span>
          </div>

          {/* Level & XP */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', minWidth: '90px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 600 }}>
              <span style={{ color: '#c084fc' }}>Lvl {currentLevel}</span>
              <span style={{ color: 'var(--text-muted)' }}>{currentXP % 100}/100</span>
            </div>
            <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden' }}>
              <div style={{ width: `${xpPercentage}%`, height: '100%', background: 'linear-gradient(90deg, #6366f1, #a855f7)', transition: 'width 0.4s ease' }} />
            </div>
          </div>

          {/* Dynamic Auth Button */}
          {isLoggedIn ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                background: 'rgba(16, 185, 129, 0.15)',
                border: '1px solid rgba(16, 185, 129, 0.4)',
                padding: '6px 12px',
                borderRadius: '10px',
                color: '#34d399',
                fontSize: '0.82rem',
                fontWeight: 700
              }}>
                <CheckCircle2 size={14} /> {t.signed_in} (@{user?.username || 'Debater'})
              </div>
              <button 
                className="btn-secondary" 
                onClick={onLogout}
                style={{ padding: '6px 12px', fontSize: '0.8rem', color: '#fb7185', borderColor: 'rgba(244, 63, 94, 0.3)' }}
                title={t.disconnect}
              >
                <LogOut size={14} /> {t.disconnect}
              </button>
            </div>
          ) : (
            <button className="btn-secondary" onClick={onOpenAuth} style={{ gap: '6px' }}>
              <LogIn size={16} color="#818cf8" /> {t.sign_in}
            </button>
          )}

          {/* Start Debate Button */}
          <button className="btn-primary" onClick={onStartNewDebate}>
            <Swords size={18} /> {t.start_debate}
          </button>
        </div>

      </div>
    </header>
  );
}
