import React, { useState, useEffect } from 'react';
import { coachingAPI } from '../services/api';
import { History, Target, TrendingUp, Trophy, Star, ChevronRight } from 'lucide-react';

export default function DebateTimeline({ lang }) {
  const [timelineData, setTimelineData] = useState([]);
  const [capsuleData, setCapsuleData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [timelineRes, capsuleRes] = await Promise.all([
          coachingAPI.getTimeline(),
          coachingAPI.getCapsule(lang)
        ]);
        setTimelineData(timelineRes.data?.events || []);
        setCapsuleData(capsuleRes.data || null);
      } catch (err) {
        console.error("Failed to load timeline data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [lang]);

  if (loading) {
    return <div style={{ padding: '40px', textAlign: 'center' }}>Loading timeline...</div>;
  }

  const stats = capsuleData?.stats || {};
  const winRate = stats.win_rate || 0;
  const avgScore = stats.avg_overall_score || 0;
  const debatesCount = stats.total_debates || 0;
  const aiSummary = capsuleData?.ai_summary || '';
  const topStrength = capsuleData?.top_strength || '';
  const focusArea = capsuleData?.focus_area || '';

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '24px', display: 'flex', flexDirection: 'column', gap: '32px' }}>
      
      <div style={{ textAlign: 'center' }}>
        <h1 style={{ fontSize: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
          <History size={32} color="#818cf8" />
          {lang === 'ar' ? 'الجدول الزمني لتطورك' : 'Your Evolution Timeline'}
        </h1>
        <p style={{ color: 'var(--text-muted)' }}>
          {lang === 'ar' ? 'تتبع رحلتك وتطور مهاراتك عبر الزمن.' : 'Track your journey and skill evolution over time.'}
        </p>
      </div>

      {capsuleData && (
        <div style={{ 
          background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(168, 85, 247, 0.1))',
          border: '1px solid rgba(168, 85, 247, 0.3)',
          borderRadius: '16px',
          padding: '24px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: '0 0 16px', color: '#c084fc' }}>
            <Star size={24} />
            {lang === 'ar' ? 'كبسولة الزمن الشهرية للذكاء الاصطناعي' : 'Monthly AI Time Capsule'}
          </h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '16px' }}>
            <div style={{ background: 'rgba(255,255,255,0.05)', padding: '16px', borderRadius: '12px', textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#818cf8' }}>{winRate}%</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{lang === 'ar' ? 'معدل الفوز' : 'Win Rate'}</div>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.05)', padding: '16px', borderRadius: '12px', textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#34d399' }}>{avgScore}</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{lang === 'ar' ? 'متوسط الدرجات' : 'Avg Score'}</div>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.05)', padding: '16px', borderRadius: '12px', textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#fbbf24' }}>{debatesCount}</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{lang === 'ar' ? 'المناظرات' : 'Debates'}</div>
            </div>
          </div>

          <div style={{ background: 'rgba(0,0,0,0.2)', padding: '16px', borderRadius: '12px', marginBottom: '16px' }}>
            <h4 style={{ margin: '0 0 8px', color: '#e2e8f0' }}>{lang === 'ar' ? 'تعليق الذكاء الاصطناعي' : 'AI Growth Commentary'}</h4>
            <p style={{ margin: 0, fontSize: '0.95rem', lineHeight: 1.5, color: '#94a3b8' }}>
              {aiSummary || (lang === 'ar' ? 'لا يوجد تعليق كافٍ بعد.' : 'Not enough data for commentary yet.')}
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <h4 style={{ margin: '0 0 8px', display: 'flex', alignItems: 'center', gap: '6px', color: '#34d399' }}>
                <TrendingUp size={16} /> {lang === 'ar' ? 'نقاط القوة' : 'Top Strength'}
              </h4>
              <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.9rem' }}>{topStrength || 'N/A'}</p>
            </div>
            <div>
              <h4 style={{ margin: '0 0 8px', display: 'flex', alignItems: 'center', gap: '6px', color: '#fb7185' }}>
                <Target size={16} /> {lang === 'ar' ? 'مجالات التركيز' : 'Focus Area'}
              </h4>
              <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.9rem' }}>{focusArea || 'N/A'}</p>
            </div>
          </div>
        </div>
      )}

      <div>
        <h3 style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '12px', marginBottom: '24px' }}>
          {lang === 'ar' ? 'سجل الإنجازات' : 'Milestone Log'}
        </h3>
        
        <div style={{ position: 'relative', paddingLeft: lang === 'ar' ? 0 : '16px', paddingRight: lang === 'ar' ? '16px' : 0 }}>
          <div style={{ 
            position: 'absolute', 
            top: 0, 
            bottom: 0, 
            left: lang === 'ar' ? 'auto' : 0, 
            right: lang === 'ar' ? 0 : 'auto',
            width: '2px', 
            background: 'var(--border-color)' 
          }} />
          
          {timelineData.length === 0 ? (
            <div style={{ padding: '20px', color: 'var(--text-muted)' }}>
              {lang === 'ar' ? 'لم يتم العثور على أحداث بعد.' : 'No timeline events found yet.'}
            </div>
          ) : (
            timelineData.map((event, index) => (
              <div key={index} style={{ position: 'relative', marginBottom: '24px', paddingLeft: lang === 'ar' ? 0 : '24px', paddingRight: lang === 'ar' ? '24px' : 0 }}>
                <div style={{
                  position: 'absolute',
                  top: '4px',
                  left: lang === 'ar' ? 'auto' : '-4px',
                  right: lang === 'ar' ? '-4px' : 'auto',
                  width: '10px',
                  height: '10px',
                  borderRadius: '50%',
                  background: event.type === 'LEVEL_UP' ? '#c084fc' : event.type === 'ACHIEVEMENT' ? '#fbbf24' : '#6366f1',
                  boxShadow: '0 0 8px rgba(99, 102, 241, 0.6)'
                }} />
                
                <div style={{ 
                  background: 'rgba(255,255,255,0.03)', 
                  border: '1px solid var(--border-color)', 
                  borderRadius: '12px', 
                  padding: '16px',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '12px'
                }}>
                  <div style={{ background: 'rgba(255,255,255,0.1)', padding: '8px', borderRadius: '8px' }}>
                    {event.type === 'LEVEL_UP' && <TrendingUp size={20} color="#c084fc" />}
                    {event.type === 'ACHIEVEMENT' && <Trophy size={20} color="#fbbf24" />}
                    {event.type === 'DEBATE' && <Target size={20} color="#6366f1" />}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                      <h4 style={{ margin: 0, fontSize: '1.05rem' }}>{event.title}</h4>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        {new Date(event.date).toLocaleDateString(lang === 'ar' ? 'ar-EG' : 'en-US')}
                      </span>
                    </div>
                    <p style={{ margin: 0, fontSize: '0.9rem', color: '#94a3b8' }}>
                      {event.description}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
