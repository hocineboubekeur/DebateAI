import React, { useState, useEffect } from 'react';
import { Brain, Sparkles, CheckCircle2, TrendingUp, Compass, Award } from 'lucide-react';
import { coachingAPI } from '../services/api';
import { translations } from '../utils/translations';

export default function DebateDNA({ lang = 'en' }) {
  const t = translations[lang] || translations.en;
  const [dnaData, setDnaData] = useState(null);
  const [coachReport, setCoachReport] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCoaching() {
      try {
        const [dnaRes, reportRes] = await Promise.all([
          coachingAPI.getDNA(),
          coachingAPI.getReport()
        ]);
        setDnaData(dnaRes.data);
        setCoachReport(reportRes.data);
      } catch (err) {
        console.error("Error loading coaching data:", err);
      } finally {
        setLoading(false);
      }
    }
    loadCoaching();
  }, []);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-muted)' }}>
        <Sparkles size={40} className="pulse-glow" color="#a855f7" />
        <p style={{ marginTop: '12px' }}>
          {lang === 'ar' ? 'جارٍ تحليل حمض المناظرة والمهارات البلاغية...' : 'Analyzing your long-term Debate DNA...'}
        </p>
      </div>
    );
  }

  const metrics = dnaData?.metrics;
  const coachAdvice = coachReport?.coach_advice;

  if (!metrics || metrics.length === 0) {
    return (
      <div style={{ maxWidth: '1080px', margin: '0 auto', padding: '0 24px 40px 24px', textAlign: 'center' }}>
        <div style={{ padding: '40px', background: 'rgba(255,255,255,0.05)', borderRadius: '20px' }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>
            {lang === 'ar' ? 'أكمل مناظرتك الأولى لرؤية تحليل حمض المناظرة' : 'Complete your first debate to see your DNA analysis'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1080px', margin: '0 auto', padding: '0 24px 40px 24px', display: 'flex', flexDirection: 'column', gap: '28px' }}>
      
      {/* Header */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
          <Brain size={24} color="#818cf8" />
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800 }} className="gradient-text">
            {lang === 'ar' ? 'ملف حمض المناظرة (Debate DNA)' : 'Debate DNA Profile'}
          </h2>
        </div>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          {lang === 'ar' ? 'تحليل شامل لـ 10 محاور مهارية يتطور تلقائياً مع كل مناظرة تجريها' : 'Comprehensive 10-axis skill breakdown evolving across all your AI debates'}
        </p>
      </div>

      {/* 10-Axis Metrics Grid */}
      <div className="glass-panel" style={{ padding: '28px', borderRadius: '24px' }}>
        <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '20px' }}>
          {lang === 'ar' ? 'مصفوفة التفكير والمنطق (10 أبعاد)' : '10-Dimension Reasoning Matrix'}
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
          {metrics.map((m, idx) => (
            <div key={idx} style={{ background: 'rgba(255,255,255,0.03)', padding: '16px', borderRadius: '14px', border: '1px solid var(--border-color)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.88rem' }}>
                <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{m.name}</span>
                <span style={{ fontWeight: 700, color: '#818cf8' }}>{m.score}/100</span>
              </div>
              <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.08)', borderRadius: '4px', overflow: 'hidden' }}>
                <div 
                  style={{ 
                    width: `${m.score}%`, 
                    height: '100%', 
                    background: 'linear-gradient(90deg, #6366f1, #c084fc)',
                    borderRadius: '4px',
                    transition: 'width 0.6s ease' 
                  }} 
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Personal AI Coach Advice Panel */}
      <div className="glass-panel" style={{
        padding: '32px',
        borderRadius: '24px',
        background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.15) 0%, rgba(99, 102, 241, 0.1) 100%)',
        border: '1px solid rgba(168, 85, 247, 0.3)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
          <div style={{ background: '#a855f7', padding: '10px', borderRadius: '12px' }}>
            <Sparkles size={22} color="#ffffff" />
          </div>
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>
              {lang === 'ar' ? 'تقرير المدرب البلاغي بالذكاء الاصطناعي' : 'Personal AI Coach Weekly Evaluation'}
            </h3>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              {lang === 'ar' ? 'مستخرج تلقائياً من تحليل خزنة مناظراتك' : 'Synthesized from your debate vault history'}
            </span>
          </div>
        </div>

        {coachAdvice && (
          <p style={{ fontSize: '1rem', color: 'var(--text-main)', lineHeight: '1.6', marginBottom: '24px', fontStyle: 'italic', background: 'rgba(0,0,0,0.2)', padding: '16px 20px', borderRadius: '14px', borderLeft: '4px solid #a855f7' }}>
            "{coachAdvice}"
          </p>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
          
          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#34d399', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <CheckCircle2 size={16} /> {lang === 'ar' ? 'أقوى المهارات المسجلة' : 'Strongest Skills'}
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {(coachReport?.strongest_skills || []).map((s, i) => (
                <div key={i} className="badge badge-emerald" style={{ padding: '8px 12px', width: 'fit-content', fontSize: '0.82rem' }}>{s}</div>
              ))}
            </div>
          </div>

          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#fbbf24', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <TrendingUp size={16} /> {lang === 'ar' ? 'تمارين التظهير الموصى بها' : 'Recommended Focus Drills'}
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {(coachReport?.recommended_exercises || []).map((ex, i) => (
                <div key={i} className="badge badge-amber" style={{ padding: '8px 12px', width: 'fit-content', fontSize: '0.82rem' }}>{ex}</div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
