import React, { useState, useEffect } from 'react';
import { BookOpen, HelpCircle, CheckCircle, Award, Sparkles, Lightbulb, Target, Brain, LayoutTemplate } from 'lucide-react';
import { libraryAPI } from '../services/api';
import { translations } from '../utils/translations';

import { STRATEGIES_EN, STRATEGIES_AR, FAMOUS_DEBATES_EN, FAMOUS_DEBATES_AR, TEMPLATES_EN, TEMPLATES_AR, BOOKS_EN, BOOKS_AR } from '../data/rhetoricData';

export default function RhetoricLibrary({ onRewardXP, onStartNewDebate, lang = 'en' }) {
  const t = translations[lang] || translations.en;
  const [subTab, setSubTab] = useState('fallacies');
  const [fallacies, setFallacies] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [selectedOption, setSelectedOption] = useState('');
  const [quizResult, setQuizResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [selectedBookModal, setSelectedBookModal] = useState(null);
  const [bookClubBooks, setBookClubBooks] = useState([]);

  const strategiesList = lang === 'ar' ? STRATEGIES_AR : STRATEGIES_EN;
  const famousDebatesList = lang === 'ar' ? FAMOUS_DEBATES_AR : FAMOUS_DEBATES_EN;
  const templatesList = lang === 'ar' ? TEMPLATES_AR : TEMPLATES_EN;
  const booksList = lang === 'ar' ? BOOKS_AR : BOOKS_EN;

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const [fRes, qRes, bcRes] = await Promise.all([
          libraryAPI.getFallacies(lang),
          libraryAPI.getQuizzes(lang),
          libraryAPI.getBookClub(lang)
        ]);
        setFallacies(fRes.data);
        setQuizzes(qRes.data);
        setBookClubBooks(bcRes.data);
        if (qRes.data && qRes.data.length > 0) {
          const randIdx = Math.floor(Math.random() * qRes.data.length);
          setCurrentQuizIndex(randIdx);
          setSelectedQuiz(qRes.data[randIdx]);
        }
      } catch (err) {
        console.error("Error loading library data:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [lang]);

  const submitAnswer = async (quiz, option) => {
    try {
      const res = await libraryAPI.submitQuiz(quiz.id, option, lang);
      setQuizResult(res.data);
      if (res.data.correct && onRewardXP) {
        onRewardXP(res.data.xp_earned);
      }
    } catch (err) {
      console.error("Error submitting quiz:", err);
    }
  };

  const handleQuizSubmit = (e) => {
    e.preventDefault();
  };

  const handleNextQuiz = () => {
    if (!quizzes || quizzes.length === 0) return;
    let nextIdx = Math.floor(Math.random() * quizzes.length);
    if (quizzes.length > 1 && nextIdx === currentQuizIndex) {
      nextIdx = (currentQuizIndex + 1) % quizzes.length;
    }
    setCurrentQuizIndex(nextIdx);
    setSelectedQuiz(quizzes[nextIdx]);
    setSelectedOption('');
    setQuizResult(null);
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-muted)' }}>
        <BookOpen size={40} className="pulse-glow" color="#818cf8" />
        <p style={{ marginTop: '12px' }}>Loading Rhetoric & Logic Knowledge Base...</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1080px', margin: '0 auto', padding: '0 24px 40px 24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Subtab Toggle */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800 }} className="gradient-text">{t.nav_library}</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            {lang === 'ar' ? 'أتقن المغالطات المنطقية، الاستراتيجيات البلاغية، واختبر مهاراتك القيادية' : 'Master logical fallacies, rhetoric strategies, and test your skills'}
          </p>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', background: 'rgba(255,255,255,0.05)', padding: '4px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
          {[
            { id: 'fallacies', label: t.lib_fallacies },
            { id: 'strategies', label: t.lib_strategies },
            { id: 'famous', label: t.lib_famous },
            { id: 'templates', label: t.lib_templates },
            { id: 'books', label: t.lib_books },
            { id: 'bookclub', label: lang === 'ar' ? 'نادي الكتاب والمناظرات' : 'Book Club Debates' },
            { id: 'quizzes', label: t.lib_quizzes }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setSubTab(tab.id)}
              style={{
                padding: '8px 16px',
                borderRadius: '8px',
                border: 'none',
                background: subTab === tab.id ? '#6366f1' : 'transparent',
                color: 'white',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'background 0.2s'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Fallacies Tab */}
      {subTab === 'fallacies' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
          {fallacies.map((item) => (
            <div key={item.id} className="glass-panel" style={{ padding: '24px', borderRadius: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className="badge badge-purple">{item.category}</span>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>ID #{item.id}</span>
              </div>

              <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>{item.name}</h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>{item.summary}</p>

              <div style={{ background: 'rgba(244, 63, 94, 0.1)', padding: '12px', borderRadius: '12px', borderLeft: '3px solid #f43f5e', fontSize: '0.84rem' }}>
                <strong style={{ color: '#fb7185', display: 'block', marginBottom: '4px' }}>
                  {lang === 'ar' ? 'مثال خاطئ (مغالطة):' : 'Fallacious Example:'}
                </strong>
                <span style={{ color: 'var(--text-muted)' }}>{item.example_bad}</span>
              </div>

              <div style={{ background: 'rgba(16, 185, 129, 0.1)', padding: '12px', borderRadius: '12px', borderLeft: '3px solid #10b981', fontSize: '0.84rem' }}>
                <strong style={{ color: '#34d399', display: 'block', marginBottom: '4px' }}>{t.lib_counter_tip}</strong>
                <span style={{ color: 'var(--text-muted)' }}>{item.how_to_counter}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Strategies Tab */}
      {subTab === 'strategies' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
          {strategiesList.map((item, index) => (
            <div key={index} className="glass-panel" style={{ padding: '24px', borderRadius: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                {item.icon}
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>{item.title}</h3>
              </div>

              <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>{item.description}</p>

              <div style={{ background: 'rgba(99, 102, 241, 0.1)', padding: '12px', borderRadius: '12px', borderLeft: '3px solid #6366f1', fontSize: '0.84rem' }}>
                <strong style={{ color: '#818cf8', display: 'block', marginBottom: '4px' }}>
                  {lang === 'ar' ? 'نصيحة احترافية:' : 'Pro Tip:'}
                </strong>
                <span style={{ color: 'var(--text-muted)' }}>{item.proTip}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Famous Debates Tab */}
      {subTab === 'famous' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
          {famousDebatesList.map((item, index) => (
            <div key={index} className="glass-panel" style={{ padding: '24px', borderRadius: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className="badge badge-purple">{item.year}</span>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{item.technique}</span>
              </div>

              <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>{item.title}</h3>
              <p style={{ fontSize: '0.84rem', color: '#818cf8', fontWeight: 600 }}>{item.topic}</p>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>{item.context}</p>

              <div style={{ background: 'rgba(245, 158, 11, 0.1)', padding: '12px', borderRadius: '12px', borderLeft: '3px solid #f59e0b', fontSize: '0.84rem' }}>
                <strong style={{ color: '#fbbf24', display: 'block', marginBottom: '4px' }}>
                  {lang === 'ar' ? 'الفائدة الرئيسية:' : 'Key Takeaway:'}
                </strong>
                <span style={{ color: 'var(--text-muted)' }}>{item.takeaway}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Templates Tab */}
      {subTab === 'templates' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '20px' }}>
          {templatesList.map((item, index) => (
            <div key={index} className="glass-panel" style={{ padding: '24px', borderRadius: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>{item.title}</h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>{item.description}</p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {item.steps.map((step, sIdx) => (
                  <div key={sIdx} style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(255,255,255,0.03)', padding: '10px 14px', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
                    <span style={{ width: '24px', height: '24px', borderRadius: '50%', background: '#6366f1', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 700 }}>
                      {sIdx + 1}
                    </span>
                    <span style={{ fontSize: '0.88rem', color: 'white', fontWeight: 600 }}>{step}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Recommended Books Tab (ALL 8 BOOKS) */}
      {subTab === 'books' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
          {booksList.map((book, index) => (
            <div key={index} className="glass-panel" style={{ padding: '24px', borderRadius: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '16px' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <span className="badge badge-purple">{book.year}</span>
                  <span style={{ fontSize: '0.78rem', color: '#34d399', fontWeight: 700 }}>{book.focus}</span>
                </div>

                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'white', marginBottom: '4px' }}>{book.title}</h3>
                <p style={{ fontSize: '0.82rem', color: '#818cf8', marginBottom: '12px', fontWeight: 600 }}>{book.author}</p>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: '1.5', marginBottom: '16px' }}>{book.summary}</p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                  {book.takeaways.map((tItem, tIdx) => (
                    <div key={tIdx} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <CheckCircle size={14} color="#34d399" />
                      <span>{tItem}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button 
                className="btn-secondary" 
                onClick={() => setSelectedBookModal(book)}
                style={{ width: '100%', justifyContent: 'center', fontSize: '0.85rem' }}
              >
                {lang === 'ar' ? 'قراءة ملخص وملاحظات الفصول' : 'Read Study Guide & Summary'}
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Book Study Guide Modal */}
      {selectedBookModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(9, 13, 22, 0.85)', backdropFilter: 'blur(12px)',
          zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px'
        }}>
          <div className="glass-panel" style={{ width: '100%', maxWidth: '640px', padding: '32px', borderRadius: '24px', border: '1px solid var(--border-glow)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div>
                <h3 style={{ fontSize: '1.4rem', fontWeight: 800 }} className="gradient-text">{selectedBookModal.title}</h3>
                <p style={{ color: '#818cf8', fontSize: '0.88rem' }}>By {selectedBookModal.author} ({selectedBookModal.year})</p>
              </div>
              <button onClick={() => setSelectedBookModal(null)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '1.4rem' }}>✕</button>
            </div>

            <div style={{ whiteSpace: 'pre-wrap', color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.6', background: 'rgba(0,0,0,0.3)', padding: '20px', borderRadius: '16px', maxHeight: '360px', overflowY: 'auto' }}>
              {selectedBookModal.notes}
            </div>
          </div>
        </div>
      )}

      {/* Interactive Quiz Tab */}
      {subTab === 'quizzes' && (
        <div className="glass-panel" style={{ padding: '32px', borderRadius: '24px', maxWidth: '720px', margin: '0 auto', width: '100%' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
            <div>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 800 }} className="gradient-text">
                {lang === 'ar' ? 'تحدي كشف المغالطات المنطقية (+XP)' : 'Fallacy Detection Challenge (+XP)'}
              </h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                {lang === 'ar' ? 'سؤال عشوائي اختباري لقياس قدرتك على كشف المغالطات' : 'Test your sharp skills by detecting fallacies in real scenarios'}
              </p>
            </div>
            <span className="badge badge-amber" style={{ padding: '6px 12px', fontSize: '0.85rem' }}>
              {lang === 'ar' ? `سؤال عشوائي #${currentQuizIndex + 1}` : `Random Question #${currentQuizIndex + 1}`}
            </span>
          </div>

          {selectedQuiz ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Question Box */}
              <div style={{ background: 'rgba(99, 102, 241, 0.1)', padding: '20px', borderRadius: '16px', border: '1px solid rgba(99, 102, 241, 0.3)' }}>
                <span className="badge badge-purple" style={{ marginBottom: '10px' }}>
                  {lang === 'ar' ? `مكافأة: +${selectedQuiz.xp_reward} نقطة خبرة` : `Reward: +${selectedQuiz.xp_reward} XP`}
                </span>
                <p style={{ fontSize: '1.1rem', fontWeight: 700, color: 'white', lineHeight: '1.6' }}>
                  {selectedQuiz.question}
                </p>
              </div>

              {/* Form & Options directly below */}
              <form onSubmit={handleQuizSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#c084fc' }}>
                  {lang === 'ar' ? 'اختر الإجابة الصحيحة:' : 'Select the Correct Option:'}
                </h4>

                {['A', 'B', 'C', 'D'].map(opt => {
                  const optKey = `option_${opt.toLowerCase()}`;
                  const isSelected = selectedOption === opt;
                  return (
                    <label 
                      key={opt} 
                      style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '12px', 
                        padding: '14px 18px', 
                        borderRadius: '14px', 
                        background: isSelected ? 'rgba(99, 102, 241, 0.25)' : 'rgba(255,255,255,0.03)', 
                        border: isSelected ? '2px solid #818cf8' : '1px solid var(--border-color)', 
                        cursor: quizResult ? 'default' : 'pointer',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      <input 
                        type="radio" 
                        name="quiz_opt" 
                        value={opt} 
                        checked={isSelected} 
                        onChange={() => {
                          if (!quizResult) {
                            setSelectedOption(opt);
                            submitAnswer(selectedQuiz, opt);
                          }
                        }} 
                        disabled={!!quizResult}
                      />
                      <span style={{ fontSize: '0.95rem', color: 'white', fontWeight: isSelected ? 700 : 400 }}>
                        <strong style={{ color: '#818cf8', marginRight: '6px' }}>{opt}:</strong> {selectedQuiz[optKey]}
                      </span>
                    </label>
                  );
                })}


              </form>

              {/* Quiz Result Feedback & Next Question Button */}
              {quizResult && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '8px' }}>
                  <div style={{ 
                    padding: '20px', 
                    borderRadius: '16px', 
                    background: quizResult.correct ? 'rgba(16, 185, 129, 0.15)' : 'rgba(244, 63, 94, 0.15)', 
                    border: quizResult.correct ? '1px solid #34d399' : '1px solid #f43f5e' 
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                      <span style={{ fontSize: '1.3rem' }}>{quizResult.correct ? '🎉' : '❌'}</span>
                      <strong style={{ color: quizResult.correct ? '#34d399' : '#fb7185', fontSize: '1.1rem' }}>
                        {quizResult.correct 
                          ? (lang === 'ar' ? `إجابة صحيحة! تم كسب +${quizResult.xp_earned} XP` : `Correct Answer! +${quizResult.xp_earned} XP Claimed`) 
                          : (lang === 'ar' ? `إجابة خاطئة (الإجابة الصحيحة هي: ${quizResult.correct_option})` : `Incorrect (Correct Option: ${quizResult.correct_option})`)}
                      </strong>
                    </div>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>
                      {quizResult.explanation}
                    </p>
                  </div>

                  <button 
                    type="button" 
                    className="btn-primary" 
                    onClick={handleNextQuiz}
                    style={{ justifyContent: 'center', padding: '14px', fontSize: '1rem', background: 'linear-gradient(135deg, #10b981 0%, #06b6d4 100%)' }}
                  >
                    {lang === 'ar' ? 'السؤال التالي ➔' : 'Next Question ➔'}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <p style={{ color: 'var(--text-muted)', textAlign: 'center' }}>
              {lang === 'ar' ? 'لا توجد أسئلة متاحة حالياً.' : 'No quiz questions available right now.'}
            </p>
          )}
        </div>
      )}

      {/* Book Club Debates Tab */}
      {subTab === 'bookclub' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
          {bookClubBooks.map((book, index) => (
            <div key={index} className="glass-panel" style={{ padding: '24px', borderRadius: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '16px' }}>
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'white', marginBottom: '4px' }}>{book.title}</h3>
                <p style={{ fontSize: '0.82rem', color: '#818cf8', marginBottom: '12px', fontWeight: 600 }}>{book.author}</p>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: '1.5', marginBottom: '16px' }}>{book.topic}</p>
              </div>
              <button 
                className="btn-primary" 
                onClick={() => onStartNewDebate && onStartNewDebate(book.topic)}
                style={{ width: '100%', justifyContent: 'center', fontSize: '0.85rem' }}
              >
                {lang === 'ar' ? 'ناقش هذا الكتاب' : 'Debate This Book'}
              </button>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
