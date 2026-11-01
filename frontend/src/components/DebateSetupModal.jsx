import React, { useState } from 'react';
import { X, Sparkles, Scale, Atom, BookOpen, Vote, Shield, Swords, Loader, User, Clock, Theater, FileQuestion, Book } from 'lucide-react';
import { translations } from '../utils/translations';

const SUGGESTED_TOPICS_EN = [
  "Should international law enforce global AI regulation?",
  "Cryptocurrencies are a net negative for global financial stability.",
  "Social media platforms should be treated as public utilities.",
  "Mass surveillance is justified in the name of national security.",
  "Open source development is inherently superior to proprietary software."
];

const SUGGESTED_TOPICS_AR = [
  "هل يجب على القانون الدولي فرض تنظيم حاسم وشامل للذكاء الاصطناعي؟",
  "العملات المشفرة تشكل خطراً صافياً على الاستقرار المالي العالمي.",
  "يجب معاملة منصات التواصل الاجتماعي كمرافق عامة تخضع للرقابة."
];

const STANDARD_PERSONAS = [
  'LAWYER', 'SCIENTIST', 'PHILOSOPHER', 'POLITICIAN', 'HISTORIAN', 'TROLL', 'RAGEBAITER', 'DEVILS_ADVOCATE'
];

const HISTORICAL_THINKERS = [
  'SOCRATES', 'ARISTOTLE', 'PLATO', 'ALAN TURING', 'CARL SAGAN', 'EINSTEIN', 'LINCOLN', 'SUN TZU'
];

const ROLEPLAY_SCENARIOS = [
  { id: 'minister_vs_opp', label: 'Minister vs Opposition', context: 'Minister of Defense vs Opposition' },
  { id: 'ai_ethics_ceo', label: 'AI Ethics Board vs Tech CEO', context: 'AI Ethics Board vs Tech CEO' },
  { id: 'climate_summit', label: 'Climate Summit', context: 'Climate Summit' },
  { id: 'courtroom_cross', label: 'Courtroom Cross-Exam', context: 'Courtroom Cross-Exam' }
];

const LITERARY_BOOKS = [
  { id: '1984', title: '1984', author: 'George Orwell', thesis: 'Mass surveillance and censorship are justified for state security.' },
  { id: 'brave_new_world', title: 'Brave New World', author: 'Aldous Huxley', thesis: 'A society of engineered happiness is better than one with painful freedom.' },
  { id: 'crime_punishment', title: 'Crime and Punishment', author: 'Fyodor Dostoevsky', thesis: 'Extraordinary individuals are morally exempt from ordinary laws.' }
];

export default function DebateSetupModal({ isOpen, onClose, onStartDebate, lang = 'en', loading = false }) {
  const t = translations[lang] || translations.en;
  const topicsList = lang === 'ar' ? SUGGESTED_TOPICS_AR : SUGGESTED_TOPICS_EN;

  const [activeTab, setActiveTab] = useState('STANDARD');
  const [topic, setTopic] = useState('');
  const [userSide, setUserSide] = useState('FOR');
  const [style, setStyle] = useState('FORMAL');
  const [difficulty, setDifficulty] = useState('BALANCED');

  // specific fields
  const [selectedStandard, setSelectedStandard] = useState('PHILOSOPHER');
  const [selectedHistorical, setSelectedHistorical] = useState('SOCRATES');
  const [selectedRoleplay, setSelectedRoleplay] = useState('Minister of Defense vs Opposition');
  const [selectedBook, setSelectedBook] = useState('Mass surveillance and censorship are justified for state security.');

  if (!isOpen) return null;

  const handleRandomTopic = () => {
    const randomItem = topicsList[Math.floor(Math.random() * topicsList.length)];
    setTopic(randomItem);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    let persona = 'PHILOSOPHER';
    let is_mystery = false;
    let roleplay_context = '';
    let finalTopic = topic.trim();
    if (!finalTopic && activeTab !== 'LITERARY') {
      finalTopic = topicsList[0];
    }

    if (activeTab === 'STANDARD') {
      persona = selectedStandard;
    } else if (activeTab === 'HISTORICAL') {
      persona = selectedHistorical;
    } else if (activeTab === 'ROLEPLAY') {
      persona = 'ROLEPLAYER';
      roleplay_context = selectedRoleplay;
    } else if (activeTab === 'MYSTERY') {
      persona = 'MYSTERY';
      is_mystery = true;
    } else if (activeTab === 'LITERARY') {
      persona = 'LITERARY_CRITIC';
      finalTopic = selectedBook;
    }

    onStartDebate({
      topic: finalTopic,
      user_side: userSide,
      persona,
      is_mystery,
      roleplay_context,
      style,
      difficulty,
      lang
    });
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(9, 13, 22, 0.85)',
      backdropFilter: 'blur(12px)',
      zIndex: 1000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div className="glass-panel" style={{ width: '100%', maxWidth: '720px', padding: '32px', borderRadius: '24px', border: '1px solid var(--border-glow)', maxHeight: '90vh', overflowY: 'auto', position: 'relative' }}>
        
        {loading && (
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(9, 13, 22, 0.85)', backdropFilter: 'blur(8px)', zIndex: 10,
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'white'
          }}>
            <Loader className="spin" size={48} color="#818cf8" />
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }} className="gradient-text">Initializing Debate...</h2>
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800 }} className="gradient-text">{t.setup_title}</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{t.setup_subtitle}</p>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
            <X size={24} />
          </button>
        </div>

        {/* 5 Distinct Tabs */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '20px' }}>
          {[
            { id: 'STANDARD', icon: <User size={16}/>, label: 'Standard Personas' },
            { id: 'HISTORICAL', icon: <Clock size={16}/>, label: 'Historical Thinkers' },
            { id: 'ROLEPLAY', icon: <Theater size={16}/>, label: 'Roleplay Scenarios' },
            { id: 'MYSTERY', icon: <FileQuestion size={16}/>, label: 'Mystery Debater' },
            { id: 'LITERARY', icon: <Book size={16}/>, label: 'Literary Book Club' }
          ].map(tab => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                padding: '8px 12px', borderRadius: '8px', border: 'none',
                background: activeTab === tab.id ? '#6366f1' : 'rgba(255,255,255,0.05)',
                color: activeTab === tab.id ? 'white' : 'var(--text-muted)',
                cursor: 'pointer'
              }}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Context-Specific Selections */}
          {activeTab === 'STANDARD' && (
            <div>
              <label style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '8px' }}>Select Persona</label>
              <select value={selectedStandard} onChange={(e) => setSelectedStandard(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '12px', background: '#0f172a', border: '1px solid var(--border-color)', color: 'white' }}>
                {STANDARD_PERSONAS.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
          )}

          {activeTab === 'HISTORICAL' && (
            <div>
              <label style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '8px' }}>Select Historical Thinker</label>
              <select value={selectedHistorical} onChange={(e) => setSelectedHistorical(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '12px', background: '#0f172a', border: '1px solid var(--border-color)', color: 'white' }}>
                {HISTORICAL_THINKERS.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
          )}

          {activeTab === 'ROLEPLAY' && (
            <div>
              <label style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '8px' }}>Select Scenario</label>
              <select value={selectedRoleplay} onChange={(e) => setSelectedRoleplay(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '12px', background: '#0f172a', border: '1px solid var(--border-color)', color: 'white' }}>
                {ROLEPLAY_SCENARIOS.map(s => <option key={s.id} value={s.context}>{s.label}</option>)}
              </select>
            </div>
          )}

          {activeTab === 'MYSTERY' && (
            <div style={{ background: 'rgba(168, 85, 247, 0.1)', border: '1px solid #a855f7', padding: '16px', borderRadius: '12px', color: '#e9d5ff' }}>
              <strong style={{ display: 'block', marginBottom: '4px' }}>❓ Secret Opponent</strong>
              A secret opponent chosen by AI — identity revealed only upon debate completion!
            </div>
          )}

          {activeTab === 'LITERARY' && (
            <div>
              <label style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '8px' }}>Select Book Moral Thesis</label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {LITERARY_BOOKS.map(b => (
                  <label key={b.id} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: selectedBook === b.thesis ? 'rgba(99, 102, 241, 0.2)' : 'rgba(255,255,255,0.02)', cursor: 'pointer' }}>
                    <input type="radio" name="book" value={b.thesis} checked={selectedBook === b.thesis} onChange={() => setSelectedBook(b.thesis)} />
                    <div>
                      <strong style={{ color: 'white', display: 'block' }}>{b.title} ({b.author})</strong>
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{b.thesis}</span>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Topic Input (Hidden for Literary as it pre-fills the thesis) */}
          {activeTab !== 'LITERARY' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <label style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-muted)' }}>{t.topic_label}</label>
                <button type="button" onClick={handleRandomTopic} style={{ background: 'none', border: 'none', color: '#818cf8', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600 }}>{t.random_topic}</button>
              </div>
              <textarea rows="3" value={topic} onChange={(e) => setTopic(e.target.value)} placeholder={t.topic_placeholder} style={{ width: '100%', padding: '12px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-color)', color: 'white', fontSize: '0.95rem' }} />
            </div>
          )}

          {/* Stance Choice */}
          <div>
            <label style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '8px' }}>{t.user_side_label}</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <button type="button" onClick={() => setUserSide('FOR')} style={{ padding: '12px', borderRadius: '12px', border: userSide === 'FOR' ? '2px solid #34d399' : '1px solid var(--border-color)', background: userSide === 'FOR' ? 'rgba(16, 185, 129, 0.15)' : 'transparent', color: userSide === 'FOR' ? '#34d399' : 'var(--text-muted)', fontWeight: 700 }}>For</button>
              <button type="button" onClick={() => setUserSide('AGAINST')} style={{ padding: '12px', borderRadius: '12px', border: userSide === 'AGAINST' ? '2px solid #f43f5e' : '1px solid var(--border-color)', background: userSide === 'AGAINST' ? 'rgba(244, 63, 94, 0.15)' : 'transparent', color: userSide === 'AGAINST' ? '#f43f5e' : 'var(--text-muted)', fontWeight: 700 }}>Against</button>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '16px' }}>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '8px' }}>{t.style_label}</label>
              <select value={style} onChange={(e) => setStyle(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '12px', background: '#0f172a', border: '1px solid var(--border-color)', color: 'white' }}>
                <option value="FORMAL">Formal</option>
                <option value="SOCRATIC">Socratic</option>
                <option value="RAPID_FIRE">Rapid Fire</option>
                <option value="COURTROOM">Courtroom</option>
              </select>
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '8px' }}>{t.diff_label}</label>
              <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '12px', background: '#0f172a', border: '1px solid var(--border-color)', color: 'white' }}>
                <option value="NOVICE">Novice</option>
                <option value="BALANCED">Balanced</option>
                <option value="MASTER">Master</option>
                <option value="GRANDMASTER">Grandmaster</option>
              </select>
            </div>
          </div>

          <button type="submit" className="btn-primary" disabled={loading} style={{ justifyContent: 'center', padding: '14px', fontSize: '1rem', marginTop: '8px', opacity: loading ? 0.7 : 1 }}>
            {loading ? <Loader className="spin" size={18} /> : t.begin_debate_btn}
          </button>
        </form>

      </div>
    </div>
  );
}
