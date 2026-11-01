import React, { useState } from 'react';
import { X, CheckCircle } from 'lucide-react';
import { debatesAPI } from '../services/api';
import toast from 'react-hot-toast';

export default function DebateJournalModal({ isOpen, onClose, debateId, lang = 'en' }) {
  const [reflection, setReflection] = useState('');
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState(null);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (!reflection.trim()) return;
    setLoading(true);
    try {
      const res = await debatesAPI.reflect(debateId, reflection, lang);
      setFeedback(res.data.feedback || (lang === 'ar' ? 'تعليق جيد!' : 'Great reflection!'));
      toast.success(lang === 'ar' ? '+30 نقطة خبرة' : '+30 XP reward unlocked!');
    } catch (err) {
      toast.error(lang === 'ar' ? 'فشل إرسال التعليق.' : 'Failed to submit reflection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '24px'
    }}>
      <div className="glass-panel" style={{ width: '100%', maxWidth: '600px', padding: '32px', borderRadius: '24px', position: 'relative' }}>
        <button onClick={onClose} style={{ position: 'absolute', top: '24px', right: '24px', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
          <X size={24} />
        </button>

        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '16px' }} className="gradient-text">
          {lang === 'ar' ? 'يوميات المناظرة' : 'Debate Journal'}
        </h2>
        
        {!feedback ? (
          <>
            <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>
              {lang === 'ar' ? 'ماذا تعلمت من هذه المناظرة؟ (احصل على +30 XP)' : 'What did you learn from this debate? (+30 XP)'}
            </p>
            <textarea 
              value={reflection}
              onChange={(e) => setReflection(e.target.value)}
              placeholder={lang === 'ar' ? 'اكتب أفكارك هنا...' : 'Write your reflection...'}
              style={{
                width: '100%', height: '120px', padding: '16px', borderRadius: '12px',
                background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-color)',
                color: 'white', outline: 'none', resize: 'vertical', marginBottom: '24px'
              }}
            />
            <button className="btn-primary" onClick={handleSubmit} disabled={loading || !reflection.trim()} style={{ width: '100%', justifyContent: 'center' }}>
              {loading ? (lang === 'ar' ? 'جاري الإرسال...' : 'Submitting...') : (lang === 'ar' ? 'إرسال' : 'Submit Reflection')}
            </button>
          </>
        ) : (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <CheckCircle size={48} color="#34d399" style={{ margin: '0 auto 16px auto' }} />
            <h3 style={{ fontSize: '1.2rem', marginBottom: '12px' }}>{lang === 'ar' ? 'تقييم المدرب AI' : 'AI Coach Feedback'}</h3>
            <p style={{ color: 'var(--text-muted)', lineHeight: '1.6' }}>{feedback}</p>
            <button className="btn-secondary" onClick={onClose} style={{ marginTop: '24px' }}>
              {lang === 'ar' ? 'إغلاق' : 'Close'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
