import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { ThumbsUp, Eye, Users, ArrowRight, MessageSquare, Send } from 'lucide-react';
import { communityAPI } from '../services/api';
import { translations } from '../utils/translations';



export default function CommunityFeed({ onSelectDebate, lang = 'en' }) {
  const [feed, setFeed] = useState([]);
  const [loading, setLoading] = useState(true);
  const [commentInputs, setCommentInputs] = useState({});


  useEffect(() => {
    async function loadFeed() {
      try {
        const res = await communityAPI.getFeed();
        if (res.data && res.data.length > 0) {
          setFeed(res.data);
        } else {
          setFeed([]);
        }
      } catch (err) {
        console.error("Error loading community feed:", err);
        setFeed([]);
      } finally {
        setLoading(false);
      }
    }
    loadFeed();
  }, [lang]);

  const handleLike = async (pubId) => {
    try {
      const res = await communityAPI.toggleLike(pubId);
      setFeed(feed.map(p => p.id === pubId ? { ...p, likes_count: res.data.likes_count } : p));
    } catch (err) {
      console.error("Error toggling like:", err);
    }
  };

  const handleAddComment = async (pubId, e) => {
    e.preventDefault();
    const text = commentInputs[pubId]?.trim();
    if (!text) return;

    try {
      const res = await communityAPI.addComment(pubId, text);
      setFeed(feed.map(p => {
        if (p.id === pubId) {
          return {
            ...p,
            comments: [...(p.comments || []), res.data]
          };
        }
        return p;
      }));
      setCommentInputs({ ...commentInputs, [pubId]: '' });
    } catch (err) {
      console.error("Error adding comment:", err);
      toast.error(lang === 'ar' ? 'فشل إضافة التعليق. حاول مرة أخرى.' : 'Failed to add comment. Please try again.');
    }
  };

  if (loading) {
    return (
      <div style={{ maxWidth: '1080px', margin: '0 auto', padding: '0 24px 40px 24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div>
          <div className="skeleton-box" style={{ width: '300px', height: '36px', marginBottom: '8px' }}></div>
          <div className="skeleton-box" style={{ width: '450px', height: '20px' }}></div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '20px' }}>
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="glass-panel" style={{ padding: '24px', borderRadius: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div className="skeleton-box" style={{ width: '36px', height: '36px', borderRadius: '50%' }}></div>
                  <div>
                    <div className="skeleton-box" style={{ width: '100px', height: '16px', marginBottom: '4px' }}></div>
                    <div className="skeleton-box" style={{ width: '60px', height: '12px' }}></div>
                  </div>
                </div>
                <div className="skeleton-box" style={{ width: '80px', height: '24px', borderRadius: '20px' }}></div>
              </div>
              <div className="skeleton-box" style={{ width: '100%', height: '24px' }}></div>
              <div className="skeleton-box" style={{ width: '70%', height: '24px' }}></div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <div className="skeleton-box" style={{ width: '90px', height: '24px', borderRadius: '20px' }}></div>
                <div className="skeleton-box" style={{ width: '90px', height: '24px', borderRadius: '20px' }}></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1080px', margin: '0 auto', padding: '0 24px 40px 24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      <div>
        <h2 style={{ fontSize: '1.8rem', fontWeight: 800 }} className="gradient-text">
          {lang === 'ar' ? 'ساحة مجتمع المناظرين' : 'Public Debate Community'}
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          {lang === 'ar' ? 'استكشف مناظرات أفضل العقول، أبدِ إعجابك، وشارك التعليقات والتحليلات البلاغية' : 'Explore public debates, upvote brilliant rebuttals, and engage in logical discussions'}
        </p>
      </div>

      {feed.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px', background: 'rgba(255,255,255,0.05)', borderRadius: '20px' }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>
            {lang === 'ar' ? 'لا توجد مناظرات منشورة بعد — كن أول من يشارك!' : 'No debates published yet — be the first to share!'}
          </p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '20px' }}>
          {feed.map((post) => (
            <div key={post.id} className="glass-panel" style={{ padding: '24px', borderRadius: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'linear-gradient(135deg, #38bdf8, #818cf8)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700 }}>
                    {post.publisher ? post.publisher[0] : 'U'}
                  </div>
                  <div>
                    <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'white' }}>{post.publisher || 'Debater'}</h4>
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{post.created_at || 'Just now'}</span>
                  </div>
                </div>

                <span className={`badge ${post.winner === 'USER' ? 'badge-emerald' : 'badge-amber'}`}>
                  {post.winner === 'USER' ? (lang === 'ar' ? '🏆 فوز المناظر' : '🏆 USER WIN') : (lang === 'ar' ? '🤖 فوز الذكاء الاصطناعي' : '🤖 AI WIN')}
                </span>
              </div>

              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, lineHeight: '1.4' }}>{post.topic}</h3>
              
              <div style={{ display: 'flex', gap: '8px', fontSize: '0.8rem' }}>
                <span className="badge badge-purple">{lang === 'ar' ? `الموقف: ${post.user_side}` : `Stance: ${post.user_side}`}</span>
                <span className="badge badge-amber">{lang === 'ar' ? `الشخصية: ${post.persona}` : `Persona: ${post.persona}`}</span>
              </div>

              {/* Like & Actions */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', paddingTop: '12px', borderTop: '1px solid var(--border-color)' }}>
                <button 
                  onClick={() => handleLike(post.id)} 
                  style={{ background: 'none', border: 'none', color: '#38bdf8', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.88rem', fontWeight: 600 }}
                >
                  <ThumbsUp size={16} /> {post.likes_count || 0} {lang === 'ar' ? 'إعجاب' : 'Likes'}
                </button>

                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', fontSize: '0.88rem' }}>
                  <MessageSquare size={16} /> {post.comments?.length || 0} {lang === 'ar' ? 'تعليق' : 'Comments'}
                </div>
              </div>

              {/* Comments List */}
              {post.comments && post.comments.length > 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', background: 'rgba(0,0,0,0.2)', padding: '12px', borderRadius: '12px' }}>
                  {post.comments.map((c, idx) => (
                    <div key={idx} style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                      <strong style={{ color: '#818cf8' }}>{c.author}: </strong>
                      <span>{c.text}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Add Comment Form */}
              <form onSubmit={(e) => handleAddComment(post.id, e)} style={{ display: 'flex', gap: '8px' }}>
                <input 
                  type="text" 
                  placeholder={lang === 'ar' ? 'أضف تعليقاً على المناظرة...' : 'Add a commentary...'} 
                  value={commentInputs[post.id] || ''} 
                  onChange={(e) => setCommentInputs({ ...commentInputs, [post.id]: e.target.value })}
                  maxLength={500}
                  style={{ flex: 1, padding: '8px 12px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-color)', color: 'white', fontSize: '0.82rem', outline: 'none' }}
                />
                <button type="submit" className="btn-secondary" style={{ padding: '8px 12px', fontSize: '0.82rem' }}>
                  <Send size={14} />
                </button>
              </form>

            </div>
          ))}
        </div>
      )}

    </div>
  );
}
