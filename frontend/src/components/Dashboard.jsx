import React from 'react';
import { useNavigate } from 'react-router-dom';
import WelcomeBanner from './dashboard/WelcomeBanner';
import StatsWidget from './dashboard/StatsWidget';
import QuickStart from './dashboard/QuickStart';

export default function Dashboard({ user, debates = [], onStartNewDebate, onSelectDebate, setActiveTab, lang = 'en' }) {
  const navigate = useNavigate();
  
  const totalDebates = debates.length;
  const userWins = debates.filter(d => d.winner === 'USER').length;
  const winRate = totalDebates > 0 ? Math.round((userWins / totalDebates) * 100) : 0;
  const dnaScore = 0;

  const personas = lang === 'ar' ? [
    { id: 'LAWYER', name: 'المحامي', desc: 'أدلة وقوانين حاسمة وحجج فقهية' },
    { id: 'SCIENTIST', name: 'العالم', desc: 'بيانات ومنطق تجريبي ودراسات موثقة' },
    { id: 'PHILOSOPHER', name: 'الفيلسوف', desc: 'منهج سقراطي وأخلاقيات تحليليّة' },
    { id: 'POLITICIAN', name: 'السياسي', desc: 'بلاغة وإقناع جماهيري وسياسات' },
  ] : [
    { id: 'LAWYER', name: 'The Lawyer', desc: 'Formal legal evidence & technical flaw dissection' },
    { id: 'SCIENTIST', name: 'The Scientist', desc: 'Empirical data, peer-reviewed logic & probability' },
    { id: 'PHILOSOPHER', name: 'The Philosopher', desc: 'Socratic questioning, ethical bounds & axioms' },
    { id: 'POLITICIAN', name: 'The Politician', desc: 'Persuasive framing & pragmatic policy impact' },
  ];

  return (
    <div style={{ maxWidth: '1140px', margin: '0 auto', padding: '0 24px 40px 24px', display: 'flex', flexDirection: 'column', gap: '32px' }}>
      
      <WelcomeBanner 
        user={user} 
        onStartNewDebate={onStartNewDebate} 
        lang={lang} 
      />

      <StatsWidget 
        totalDebates={totalDebates} 
        winRate={winRate} 
        dnaScore={dnaScore} 
        user={user} 
        lang={lang} 
      />

      {totalDebates === 0 && (
        <div style={{ textAlign: 'center', padding: '40px', background: 'rgba(255,255,255,0.05)', borderRadius: '20px' }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>
            {lang === 'ar' ? 'أكمل مناظرتك الأولى لرؤية الإحصائيات!' : 'Complete your first debate to see stats!'}
          </p>
        </div>
      )}

      <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '20px', padding: '24px' }}>
        <h3 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '16px' }}>
          {lang === 'ar' ? 'المهام اليومية' : 'Daily Missions'}
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ background: 'rgba(255,255,255,0.02)', padding: '16px', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontWeight: 600 }}>{lang === 'ar' ? 'أكمل مناظرة واحدة' : 'Complete 1 Debate'}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                <div style={{ width: '100px', height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', marginTop: '4px', overflow: 'hidden' }}>
                  <div style={{ width: '50%', height: '100%', background: '#10b981' }}></div>
                </div>
              </div>
            </div>
            <button className="btn-secondary" style={{ padding: '6px 12px', background: '#10b981', color: 'white', border: 'none' }}>
              {lang === 'ar' ? 'احصل على المكافأة' : 'Claim (50 XP)'}
            </button>
          </div>
        </div>
      </div>

      <div onClick={() => navigate('/sandbox')} style={{ background: 'linear-gradient(135deg, #6366f1, #a855f7)', borderRadius: '20px', padding: '24px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'white' }}>
        <div>
          <h3 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '1.8rem' }}>⚡</span>
            {lang === 'ar' ? 'صندوق الرمل للمهارات' : 'Skill Sandbox'}
          </h3>
          <p style={{ fontSize: '0.9rem', opacity: 0.9 }}>
            {lang === 'ar' ? 'مارس مهارات النقاش في تحديات صغيرة مدتها 60 ثانية' : 'Practice your debating skills in 60-second micro-challenges.'}
          </p>
        </div>
        <button style={{ background: 'rgba(255,255,255,0.2)', border: 'none', padding: '12px 24px', borderRadius: '12px', color: 'white', fontWeight: 600, cursor: 'pointer' }}>
          {lang === 'ar' ? 'العب الآن' : 'Play Now'}
        </button>
      </div>

      <QuickStart 
        onStartNewDebate={onStartNewDebate} 
        personas={personas} 
        lang={lang} 
      />

    </div>
  );
}

