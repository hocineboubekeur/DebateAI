import React, { useState, useEffect } from 'react';
import { Award, Lock, CheckCircle2, Shield, Flame, Zap, Trophy } from 'lucide-react';
import { achievementsAPI } from '../services/api';
import { translations } from '../utils/translations';

const ACHIEVEMENTS_EN = [
  { id: 1, code: "FIRST_DEBATE", title: "First Words", description: "Completed your very first debate.", category: "BEGINNER", xp_reward: 50, dp_reward: 100 },
  { id: 2, code: "WINNER", title: "Mind Changer", description: "Won your first debate against an AI opponent.", category: "WINNING", xp_reward: 100, dp_reward: 200 },
  { id: 3, code: "LOGIC_MASTER", title: "Sherlock Holmes", description: "Scored 90+ in Logic during a formal debate.", category: "EVIDENCE", xp_reward: 150, dp_reward: 300 },
  { id: 4, code: "DEVILS_SURVIVOR", title: "Devil's Survivor", description: "Survived 5 rounds against Devil's Advocate persona.", category: "PERSONAS", xp_reward: 200, dp_reward: 400 },
  { id: 5, code: "DARK_LORD", title: "Slayer of Advocates", description: "Defeated Devil's Advocate on Grandmaster difficulty.", category: "SECRET", is_secret: true, xp_reward: 250, dp_reward: 500 },
  { id: 6, code: "STREAK_3", title: "Streak Master", description: "Maintained a 3-day consecutive debate streak.", category: "CONSISTENCY", xp_reward: 100, dp_reward: 150 },
  { id: 7, code: "SOCRATIC_WIN", title: "Socratic Scholar", description: "Won a debate using Socratic Questioning style.", category: "STYLE", xp_reward: 120, dp_reward: 250 },
  { id: 8, code: "QUIZ_ACE", title: "Quiz Champion", description: "Answered 5 library quiz questions correctly.", category: "LEARNING", xp_reward: 80, dp_reward: 120 },
  { id: 9, code: "COMMUNITY_PUB", title: "Community Star", description: "Published your first debate to the Community Arena.", category: "SOCIAL", xp_reward: 75, dp_reward: 100 },
  { id: 10, code: "THE_UNSTOPPABLE", title: "Unstoppable Force", description: "Achieved a 5-game winning streak.", category: "SECRET", is_secret: true, xp_reward: 300, dp_reward: 600 }
];

const ACHIEVEMENTS_AR = [
  { id: 1, code: "FIRST_DEBATE", title: "الكلمات الأولى", description: "أكملت أول مناظرة لك على المنصة.", category: "المبتدئين", xp_reward: 50, dp_reward: 100 },
  { id: 2, code: "WINNER", title: "مغير العقول", description: "فزت بأول مناظرة ضد خصم الذكاء الاصطناعي.", category: "الانتصارات", xp_reward: 100, dp_reward: 200 },
  { id: 3, code: "LOGIC_MASTER", title: "شرلوك هولمز المنطق", description: "حققت درجة 90+ في المنطق أثناء مناظرة رسمية.", category: "الأدلة", xp_reward: 150, dp_reward: 300 },
  { id: 4, code: "DEVILS_SURVIVOR", title: "الناجي من محامي الشيطان", description: "صمدت 5 جولات كاملة ضد شخصية محامي الشيطان.", category: "الشخصيات", xp_reward: 200, dp_reward: 400 },
  { id: 5, code: "DARK_LORD", title: "قاهر محامي الشيطان", description: "هزمت محامي الشيطان في مستوى الصعوبة الأستاذ.", category: "إنجاز سري", is_secret: true, xp_reward: 250, dp_reward: 500 },
  { id: 6, code: "STREAK_3", title: "سيد السلسلة", description: "حافظت على سلسلة مناظرات يومية لمدة 3 أيام متتالية.", category: "الاستمرارية", xp_reward: 100, dp_reward: 150 },
  { id: 7, code: "SOCRATIC_WIN", title: "الباحث السقراطي", description: "فزت بمناظرة باستخدام المنهج السقراطي.", category: "الأسلوب", xp_reward: 120, dp_reward: 250 },
  { id: 8, code: "QUIZ_ACE", title: "بطل الاختبارات", description: "أجبت على 5 أسئلة في اختبارات المكتبة بشكل صحيح.", category: "التعلم", xp_reward: 80, dp_reward: 120 },
  { id: 9, code: "COMMUNITY_PUB", title: "نجم المجتمع", description: "نشرت أول مناظرة لك في ساحة المجتمع العامة.", category: "التفاعل", xp_reward: 75, dp_reward: 100 },
  { id: 10, code: "THE_UNSTOPPABLE", title: "القوة التي لا تُقهر", description: "حققت سلسلة 5 انتصارات متتالية.", category: "إنجاز سري", is_secret: true, xp_reward: 300, dp_reward: 600 }
];

export default function AchievementsModal({ lang = 'en' }) {
  const t = translations[lang] || translations.en;
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);

  const fallbackData = lang === 'ar' ? ACHIEVEMENTS_AR : ACHIEVEMENTS_EN;

  useEffect(() => {
    async function loadAchievements() {
      setLoading(true);
      try {
        const res = await achievementsAPI.list();
        if (res.data && res.data.length > 0) {
          setAchievements(res.data);
        } else {
          setAchievements(fallbackData);
        }
      } catch (err) {
        console.error("Error loading achievements:", err);
        setAchievements(fallbackData);
      } finally {
        setLoading(false);
      }
    }
    loadAchievements();
  }, [lang]);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-muted)' }}>
        <Award size={40} className="pulse-glow" color="#fbbf24" />
        <p style={{ marginTop: '12px' }}>
          {lang === 'ar' ? 'جارٍ تحميل الأوسمة والإنجازات...' : 'Loading Achievements & Title Badges...'}
        </p>
      </div>
    );
  }

  const unlockedCount = achievements.filter(a => a.unlocked).length;

  return (
    <div style={{ maxWidth: '1080px', margin: '0 auto', padding: '0 24px 40px 24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800 }} className="gradient-text">
            {lang === 'ar' ? 'خزنة الإنجازات والأوسمة' : 'Achievements Vault'}
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            {lang === 'ar' ? 'افتح الأوسمة والنقاط الإضافية من خلال التحديات والحجج المنطقية' : 'Unlock badges and bonus DP by mastering debate techniques'}
          </p>
        </div>

        <div className="badge badge-amber" style={{ padding: '8px 16px', fontSize: '0.9rem' }}>
          <Trophy size={16} /> {unlockedCount} / {achievements.length} {lang === 'ar' ? 'تم فتحها' : 'Unlocked'}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
        {achievements.map((item) => {
          const isUnlocked = item.unlocked;
          const fallbackItem = fallbackData.find(f => f.code === item.code) || item;
          const displayTitle = fallbackItem.title;
          const displayDesc = fallbackItem.description;
          const displayCat = fallbackItem.category;

          return (
            <div 
              key={item.id} 
              className="glass-panel" 
              style={{
                padding: '24px',
                borderRadius: '20px',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '16px',
                opacity: isUnlocked ? 1 : 0.65,
                border: isUnlocked ? '1px solid rgba(251, 191, 36, 0.4)' : '1px solid var(--border-color)',
                background: isUnlocked ? 'linear-gradient(135deg, rgba(251, 191, 36, 0.1) 0%, rgba(15, 23, 42, 0.6) 100%)' : 'rgba(255,255,255,0.02)'
              }}
            >
              <div style={{
                padding: '14px',
                borderRadius: '16px',
                background: isUnlocked ? 'rgba(251, 191, 36, 0.2)' : 'rgba(255,255,255,0.05)',
                color: isUnlocked ? '#fbbf24' : 'var(--text-muted)'
              }}>
                {isUnlocked ? <Trophy size={24} /> : <Lock size={24} />}
              </div>

              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <span className="badge badge-purple" style={{ fontSize: '0.75rem' }}>{displayCat}</span>
                  <span style={{ fontSize: '0.8rem', color: '#fbbf24', fontWeight: 700 }}>+{item.dp_reward || 100} DP</span>
                </div>

                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'white', marginBottom: '4px' }}>
                  {item.is_secret && !isUnlocked ? (lang === 'ar' ? '🏆 إنجاز سري غامض' : '🔒 Secret Achievement') : displayTitle}
                </h3>
                <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>
                  {item.is_secret && !isUnlocked ? (lang === 'ar' ? 'واصل المناظرة والتحدي لكشف هذا الإنجاز السري!' : 'Keep debating to discover this secret trophy!') : displayDesc}
                </p>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
