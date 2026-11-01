import React, { useState } from 'react';
import { X, Trophy } from 'lucide-react';
import { debatesAPI } from '../services/api';
import toast from 'react-hot-toast';

export default function PerspectiveModeModal({ isOpen, onClose, debateId, lang = 'en' }) {
  const [argument, setArgument] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (!argument.trim()) return;
    setLoading(true);
    try {
      const res = await debatesAPI.submitPerspective(debateId, argument, lang);
      setResult(res.data);
      toast.success(lang === 'ar' ? '+50 DP / +50 XP' : '+50 DP / +50 XP unlocked!');
    } catch (err) {
      toast.error(lang === 'ar' ? 'فشل التقييم.' : 'Failed to evaluate perspective.');
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
          {lang === 'ar' ? 'تحدي وضع المنظور' : 'Perspective Mode Challenge'}
        </h2>
        
        {!result ? (
          <>
            <p style={{ color: 'var(--text-muted)', marginBottom: '24px', lineHeight: '1.5' }}>
              {lang === 'ar' ? 'اكتب أقوى حجة تدعم موقف خصمك. (+50 DP / +50 XP)' : 'Write the strongest argument supporting the opposing stance. (+50 DP / +50 XP)'}
            </p>
            <textarea 
              value={argument}
              onChange={(e) => setArgument(e.target.value)}
              placeholder={lang === 'ar' ? 'اكتب حجة الخصم هنا...' : 'Write the opposing argument...'}
              style={{
                width: '100%', height: '140px', padding: '16px', borderRadius: '12px',
                background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-color)',
                color: 'white', outline: 'none', resize: 'vertical', marginBottom: '24px'
              }}
            />
            <button className="btn-primary" onClick={handleSubmit} disabled={loading || !argument.trim()} style={{ width: '100%', justifyContent: 'center' }}>
              {loading ? (lang === 'ar' ? 'جاري التقييم...' : 'Evaluating...') : (lang === 'ar' ? 'تقديم الحجة' : 'Submit Argument')}
            </button>
          </>
        ) : (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <Trophy size={48} color="#818cf8" style={{ margin: '0 auto 16px auto' }} />
            <h3 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '8px', color: '#818cf8' }}>
              {result.score || 85}/100
            </h3>
            <p style={{ color: 'var(--text-muted)', lineHeight: '1.6', marginBottom: '24px' }}>
              {result.feedback || (lang === 'ar' ? 'حجة ممتازة من منظور الخصم!' : 'Excellent steelmanning of the opposing view!')}
            </p>
            <button className="btn-secondary" onClick={onClose}>
              {lang === 'ar' ? 'إغلاق' : 'Close'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
