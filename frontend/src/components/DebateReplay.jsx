import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { Trophy, Award, CheckCircle, AlertTriangle, Share2, ArrowLeft, Brain, Shield, Sparkles, Download, BookOpen, Users } from 'lucide-react';
import DebateJournalModal from './DebateJournalModal';
import PerspectiveModeModal from './PerspectiveModeModal';

import { translations } from '../utils/translations';

export default function DebateReplay({ debate, evaluation, onBack, onPublish, lang = 'en' }) {
  const [isJournalOpen, setIsJournalOpen] = useState(false);
  const [isPerspectiveOpen, setIsPerspectiveOpen] = useState(false);
  const t = translations[lang] || translations.en;
  const isWinner = debate?.winner === 'USER';

  useEffect(() => {
    if (isWinner) {
      confetti({
        particleCount: 120,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  }, [isWinner]);

  const detCats = evaluation?.detailed_categories?.user || {};
  const logicVal = detCats.logic || debate?.score_logic || 80;
  const evidenceVal = detCats.evidence || debate?.score_evidence || 75;
  const rebuttalVal = detCats.rebuttal || debate?.score_rebuttal || 85;
  const consistencyVal = detCats.consistency || debate?.score_consistency || 80;
  const clarityVal = detCats.clarity || debate?.score_clarity || 85;
  const questionsVal = detCats.question_handling || debate?.score_questions || 80;
  const persuasionVal = detCats.persuasion || debate?.score_persuasion || 75;

  const isDraw = debate?.winner === 'Draw' || evaluation?.is_draw;
  const confidence = evaluation?.confidence_score || debate?.confidence || 75;
  const mov = evaluation?.margin_of_victory || debate?.margin_of_victory || 0;
  const turningPoints = evaluation?.key_turning_points || [];
  const recommendations = evaluation?.top_recommendations || [];

  const handleDownloadJSON = () => {
    const exportData = {
      exported_at: new Date().toISOString(),
      topic: debate?.topic,
      user_side: debate?.user_side,
      persona: debate?.persona,
      style: debate?.style,
      difficulty: debate?.difficulty,
      winner: debate?.winner || evaluation?.winner_declaration,
      is_draw: isDraw,
      confidence_score: confidence,
      margin_of_victory: mov,
      scores: {
        user_overall: evaluation?.user_score || debate?.score_overall,
        ai_overall: evaluation?.ai_score,
        categories: {
          logic: logicVal,
          evidence: evidenceVal,
          rebuttal: rebuttalVal,
          consistency: consistencyVal,
          clarity: clarityVal,
          question_handling: questionsVal,
          persuasion: persuasionVal
        }
      },
      turns: (debate?.turns || []).map((t, i) => ({
        round: t.round_number || Math.floor(i / 2) + 1,
        speaker: t.speaker,
        text: t.text,
        logic_score: t.logic_score,
        persuasion_score: t.persuasion_score,
        fallacies_detected: t.fallacies_detected
      })),
      evaluation: {
        judge_summary: evaluation?.judge_summary,
        fallacies_found: evaluation?.fallacies_found,
        key_turning_points: turningPoints,
        top_recommendations: recommendations
      }
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const safeTopic = (debate?.topic || 'debate').replace(/[^a-zA-Z0-9]/g, '_').slice(0, 40);
    a.href = url;
    a.download = `debate_${safeTopic}_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{ maxWidth: '1080px', margin: '0 auto', padding: '0 24px 40px 24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Navigation Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <button className="btn-secondary" onClick={onBack}>
          <ArrowLeft size={16} /> {lang === 'ar' ? 'العودة إلى لوحة التحكم' : 'Back to Dashboard'}
        </button>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button className="btn-secondary" onClick={handleDownloadJSON}>
            <Download size={16} /> {lang === 'ar' ? 'حفظ بصيغة JSON' : 'Save as JSON'}
          </button>
          <button className="btn-primary" onClick={onPublish}>
            <Share2 size={16} /> {lang === 'ar' ? 'نشر في المجتمع' : 'Publish to Community'}
          </button>
        </div>
      </div>

      {debate?.is_mystery && (
        <div className="glass-panel" style={{ padding: '24px', borderRadius: '20px', background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.25) 0%, rgba(15, 23, 42, 0.9) 100%)', border: '1px solid #a855f7', textAlign: 'center' }}>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#e9d5ff', marginBottom: '8px' }}>
            🎉 Mystery Opponent Revealed: You were debating {debate.persona}!
          </h2>
          <p style={{ color: 'var(--text-muted)' }}>Their identity has been unmasked.</p>
        </div>
      )}

      {/* Winner / Draw Hero Banner */}
      <div className="glass-panel" style={{
        padding: '36px',
        borderRadius: '24px',
        textAlign: 'center',
        background: isDraw
          ? 'linear-gradient(135deg, rgba(245, 158, 11, 0.25) 0%, rgba(15, 23, 42, 0.9) 100%)'
          : isWinner 
            ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.25) 0%, rgba(99, 102, 241, 0.15) 100%)'
            : 'linear-gradient(135deg, rgba(244, 63, 94, 0.25) 0%, rgba(15, 23, 42, 0.9) 100%)',
        border: isDraw 
          ? '1px solid rgba(245, 158, 11, 0.4)' 
          : isWinner ? '1px solid rgba(16, 185, 129, 0.4)' : '1px solid rgba(244, 63, 94, 0.4)'
      }}>
        <div style={{
          width: '72px',
          height: '72px',
          borderRadius: '50%',
          background: isDraw ? 'rgba(245, 158, 11, 0.2)' : isWinner ? 'rgba(16, 185, 129, 0.2)' : 'rgba(244, 63, 94, 0.2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 16px auto',
          border: isDraw ? '2px solid #fbbf24' : isWinner ? '2px solid #34d399' : '2px solid #fb7185'
        }}>
          <Trophy size={36} color={isDraw ? '#fbbf24' : isWinner ? '#34d399' : '#fb7185'} />
        </div>

        <h1 style={{ fontSize: '2.2rem', fontWeight: 800, marginBottom: '8px' }} className={isWinner ? 'gradient-gold' : ''}>
          {isDraw 
            ? (lang === 'ar' ? '🤝 انتهت المناظرة بالتعادل!' : '🤝 DEBATE ENDED IN A DRAW!') 
            : isWinner 
              ? (lang === 'ar' ? '🎉 فوز في المناظرة!' : '🎉 DEBATE VICTORY UNLOCKED!') 
              : (lang === 'ar' ? '⚔️ الفائز: الذكاء الاصطناعي' : '⚔️ DEBATE CONCLUDED - AI WON')}
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', maxWidth: '680px', margin: '0 auto 20px auto', lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>
          {evaluation?.judge_summary || `The AI Judges have reviewed all turns for topic "${debate?.topic}".`}
        </p>

        <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <span className="badge badge-purple" style={{ padding: '8px 16px', fontSize: '0.88rem' }}>
            {lang === 'ar' ? `ثقة القضاة: ${confidence}%` : `AI Confidence: ${confidence}%`}
          </span>
          <span className="badge badge-amber" style={{ padding: '8px 16px', fontSize: '0.88rem' }}>
            {lang === 'ar' ? `فارق النقاط: ${mov} نقطة` : `Margin of Victory: ${mov} pts`}
          </span>
          <span className="badge badge-emerald" style={{ padding: '8px 16px', fontSize: '0.88rem' }}>
            {isWinner ? '+150 DP' : isDraw ? '+100 DP' : '+50 DP'}
          </span>
        </div>
      </div>

      {/* 7-Category Scorecard Grid */}
      <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginTop: '8px' }} className="gradient-text">
        {lang === 'ar' ? 'تقييم المحكمين حسب الفئات السبع (0-100)' : '7-Category Official Judge Scorecard (0-100)'}
      </h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
        
        <div className="glass-panel" style={{ padding: '18px', borderRadius: '18px', textAlign: 'center' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>
            {lang === 'ar' ? 'المنطق (25%)' : 'Logic (25%)'}
          </span>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#818cf8', margin: '4px 0' }}>{logicVal}/100</h2>
        </div>

        <div className="glass-panel" style={{ padding: '18px', borderRadius: '18px', textAlign: 'center' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>
            {lang === 'ar' ? 'الأدلة والحقائق (20%)' : 'Evidence (20%)'}
          </span>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#34d399', margin: '4px 0' }}>{evidenceVal}/100</h2>
        </div>

        <div className="glass-panel" style={{ padding: '18px', borderRadius: '18px', textAlign: 'center' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>
            {lang === 'ar' ? 'قوة التفنيد (20%)' : 'Rebuttal (20%)'}
          </span>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#c084fc', margin: '4px 0' }}>{rebuttalVal}/100</h2>
        </div>

        <div className="glass-panel" style={{ padding: '18px', borderRadius: '18px', textAlign: 'center' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>
            {lang === 'ar' ? 'الاتساق (15%)' : 'Consistency (15%)'}
          </span>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#38bdf8', margin: '4px 0' }}>{consistencyVal}/100</h2>
        </div>

        <div className="glass-panel" style={{ padding: '18px', borderRadius: '18px', textAlign: 'center' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>
            {lang === 'ar' ? 'الوضوح (10%)' : 'Clarity (10%)'}
          </span>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#f59e0b', margin: '4px 0' }}>{clarityVal}/100</h2>
        </div>

        <div className="glass-panel" style={{ padding: '18px', borderRadius: '18px', textAlign: 'center' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>
            {lang === 'ar' ? 'الرد على الأسئلة (5%)' : 'Questions (5%)'}
          </span>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#a855f7', margin: '4px 0' }}>{questionsVal}/100</h2>
        </div>

        <div className="glass-panel" style={{ padding: '18px', borderRadius: '18px', textAlign: 'center' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>
            {lang === 'ar' ? 'الإقناع البلاغي (5%)' : 'Persuasion (5%)'}
          </span>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#fb7185', margin: '4px 0' }}>{persuasionVal}/100</h2>
        </div>

      </div>

      {/* Chess-Style Key Turning Points */}
      <div className="glass-panel" style={{ padding: '28px', borderRadius: '20px' }}>
        <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Brain size={20} color="#818cf8" />
          Chess-Style Round Turning Points Analysis
        </h3>

        {turningPoints.length === 0 ? (
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Both sides maintained balanced momentum throughout the debate rounds.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {turningPoints.map((tp, idx) => (
              <div 
                key={idx}
                style={{
                  padding: '14px 18px',
                  borderRadius: '12px',
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid var(--border-color)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px'
                }}
              >
                <span className="badge badge-purple" style={{ flexShrink: 0 }}>Round {tp.round || idx + 1}</span>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-main)' }}>
                  {typeof tp === 'string' ? tp : (tp.description || JSON.stringify(tp))}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* AI Judge Recommendations */}
      <div className="glass-panel" style={{ padding: '28px', borderRadius: '20px', border: '1px solid rgba(168, 85, 247, 0.3)' }}>
        <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Sparkles size={20} color="#c084fc" />
          Key Recommendations for Next Debate
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {recommendations.map((rec, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '0.92rem', color: 'var(--text-muted)' }}>
              <CheckCircle size={18} color="#34d399" style={{ flexShrink: 0, marginTop: '2px' }} />
              <span>{rec}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginTop: '16px' }}>
        <button className="btn-secondary" onClick={() => setIsJournalOpen(true)}>
          <BookOpen size={16} /> {lang === 'ar' ? 'يوميات المناظرة' : 'Reflection Journal'}
        </button>
        <button className="btn-secondary" onClick={() => setIsPerspectiveOpen(true)}>
          <Users size={16} /> {lang === 'ar' ? 'تحدي وضع المنظور' : 'Perspective Mode Challenge'}
        </button>
      </div>

      <DebateJournalModal isOpen={isJournalOpen} onClose={() => setIsJournalOpen(false)} debateId={debate?.id} lang={lang} />
      <PerspectiveModeModal isOpen={isPerspectiveOpen} onClose={() => setIsPerspectiveOpen(false)} debateId={debate?.id} lang={lang} />
    </div>
  );
}
