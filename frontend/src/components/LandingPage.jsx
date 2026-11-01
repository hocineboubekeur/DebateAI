import React, { useState } from 'react';
import { Swords, Play, Sparkles, Trophy, Users, Shield, ArrowRight, Star, CheckCircle, Brain } from 'lucide-react';
import { translations } from '../utils/translations';

export default function LandingPage({ onStartDebating, onOpenAuth, platformStats, lang = 'en' }) {
  const [isDemoOpen, setIsDemoOpen] = useState(false);
  const t = translations[lang] || translations.en;

  const featuredTopics = lang === 'ar' ? [
    { title: "تنظيم الذكاء الاصطناعي والسلامة الرقمية", category: "تكنولوجيا", difficulty: "متوازن", persona: "المحامي" },
    { title: "الدخل الأساسي الشامل بعد الأتمتة", category: "اقتصاد", difficulty: "خبير", persona: "العالم" },
    { title: "خصخصة استكشاف الفضاء الخارجي", category: "سياسات", difficulty: "عادي", persona: "السياسي" },
    { title: "الهندسة الوراثية للبشر والجينوم", category: "أخلاقيات", difficulty: "أستاذ", persona: "الفيلسوف" },
  ] : [
    { title: "AI Regulation & Safety", category: "Technology", difficulty: "Balanced", persona: "The Lawyer" },
    { title: "Universal Basic Income", category: "Economics", difficulty: "Master", persona: "The Scientist" },
    { title: "Space Exploration Privatization", category: "Policy", difficulty: "Casual", persona: "The Politician" },
    { title: "Human Genetic Engineering", category: "Ethics", difficulty: "Grandmaster", persona: "The Philosopher" },
  ];

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px 60px 24px', display: 'flex', flexDirection: 'column', gap: '56px' }}>
      
      {/* Hero Section */}
      <div className="glass-panel" style={{
        padding: '60px 40px',
        borderRadius: '32px',
        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.25) 0%, rgba(168, 85, 247, 0.18) 50%, rgba(6, 182, 212, 0.12) 100%)',
        border: '1px solid rgba(168, 85, 247, 0.35)',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div className="badge badge-purple" style={{ marginBottom: '16px', padding: '8px 18px', fontSize: '0.85rem' }}>
          <Sparkles size={16} /> {t.landing_badge}
        </div>

        <h1 style={{ fontSize: '3.6rem', fontWeight: 800, lineHeight: '1.15', marginBottom: '20px' }} className="gradient-text">
          {t.landing_hero_title}
        </h1>

        <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', maxWidth: '720px', margin: '0 auto 36px auto', lineHeight: '1.6' }}>
          {t.landing_hero_subtitle}
        </p>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
          <button className="btn-primary" onClick={onStartDebating} style={{ padding: '16px 36px', fontSize: '1.1rem' }}>
            <Swords size={22} /> {t.landing_start_btn}
          </button>
          <button className="btn-secondary" onClick={() => setIsDemoOpen(true)} style={{ padding: '16px 28px', fontSize: '1.1rem' }}>
            <Play size={20} color="#a855f7" /> {t.landing_demo_btn}
          </button>
        </div>

        {/* Live Platform Stats */}
        {platformStats && platformStats.total_debates > 10 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '20px', marginTop: '48px', paddingTop: '32px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
            <div>
              <h3 style={{ fontSize: '2rem', fontWeight: 800, color: '#f8fafc' }}>{platformStats.total_debates}</h3>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{t.landing_stats_debates}</span>
            </div>
            <div>
              <h3 style={{ fontSize: '2rem', fontWeight: 800, color: '#fbbf24' }}>{platformStats.total_fallacies || 0}</h3>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{t.landing_stats_fallacies}</span>
            </div>
            <div>
              <h3 style={{ fontSize: '2rem', fontWeight: 800, color: '#34d399' }}>{platformStats.win_rate || '0%'}</h3>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{t.landing_stats_winrate}</span>
            </div>
            <div>
              <h3 style={{ fontSize: '2rem', fontWeight: 800, color: '#818cf8' }}>{platformStats.total_users || 0}</h3>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{t.landing_stats_active}</span>
            </div>
          </div>
        ) : (
          <div style={{ marginTop: '48px', paddingTop: '32px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
            <span className="badge badge-amber" style={{ padding: '8px 18px', fontSize: '1rem' }}>
              Beta Platform — Join the growing community!
            </span>
          </div>
        )}
      </div>

      {/* Featured Topics Section */}
      <div>
        <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '24px' }}>
          {lang === 'ar' ? 'أبرز القضايا والمواضيع للتحدي' : 'Featured Challenge Topics'}
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
          {featuredTopics.map((item, idx) => (
            <div key={idx} className="glass-panel" style={{ padding: '24px', borderRadius: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <span className="badge badge-purple" style={{ marginBottom: '12px' }}>{item.category}</span>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '12px' }}>{item.title}</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '20px' }}>
                  {lang === 'ar' ? `المخصومة: ${item.persona} • الصعوبة: ${item.difficulty}` : `Opponent: ${item.persona} • Difficulty: ${item.difficulty}`}
                </p>
              </div>
              <button className="btn-secondary" onClick={onStartDebating} style={{ width: '100%', justifyContent: 'center' }}>
                {t.start_debate} <ArrowRight size={16} />
              </button>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
