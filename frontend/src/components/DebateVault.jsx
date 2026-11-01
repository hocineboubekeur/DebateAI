import React, { useState, useEffect } from 'react';
import { Search, Shield, ArrowRight, Filter, Swords, Download, Edit2, Trash2, Tag, Save, X } from 'lucide-react';
import { translations } from '../utils/translations';
import { debatesAPI } from '../services/api';
import toast from 'react-hot-toast';

export default function DebateVault({ debates = [], onSelectDebate, lang = 'en' }) {
  const t = translations[lang] || translations.en;
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPersona, setSelectedPersona] = useState('ALL');
  const [localDebates, setLocalDebates] = useState([]);
  
  useEffect(() => {
    setLocalDebates(debates);
  }, [debates]);

  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editTags, setEditTags] = useState('');

  const filtered = localDebates.filter((d) => {
    const matchesSearch = (d.topic || '').toLowerCase().includes(searchTerm.toLowerCase()) || (d.custom_title || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPersona = selectedPersona === 'ALL' || d.persona === selectedPersona;
    return matchesSearch && matchesPersona;
  });

  const handleExport = async (id, topic) => {
    try {
      const res = await debatesAPI.export(id);
      const blob = new Blob([JSON.stringify(res.data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      const safeTopic = (topic || 'debate').replace(/[^a-zA-Z0-9]/g, '_').slice(0, 40);
      a.href = url;
      a.download = `debate_${safeTopic}_${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      toast.error(lang === 'ar' ? 'فشل التصدير' : 'Failed to export debate.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm(lang === 'ar' ? 'هل أنت متأكد من حذف هذه المناظرة؟' : 'Are you sure you want to delete this debate?')) return;
    try {
      await debatesAPI.deleteDebate(id);
      setLocalDebates(prev => prev.filter(d => d.id !== id));
      toast.success(lang === 'ar' ? 'تم الحذف' : 'Debate deleted.');
    } catch (err) {
      toast.error(lang === 'ar' ? 'فشل الحذف' : 'Failed to delete debate.');
    }
  };

  const parseTags = (tags) => {
    if (!tags) return [];
    if (Array.isArray(tags)) return tags.filter(Boolean);
    if (typeof tags === 'string') return tags.split(',').map(t => t.trim()).filter(Boolean);
    return [];
  };

  const startEdit = (d) => {
    setEditingId(d.id);
    setEditTitle(d.custom_title || d.topic);
    setEditTags(Array.isArray(d.tags) ? d.tags.join(', ') : (d.tags || ''));
  };

  const saveEdit = async (id) => {
    try {
      await debatesAPI.manage(id, { custom_title: editTitle, tags: editTags });
      setLocalDebates(prev => prev.map(d => d.id === id ? { ...d, custom_title: editTitle, tags: editTags } : d));
      setEditingId(null);
      toast.success(lang === 'ar' ? 'تم الحفظ' : 'Changes saved.');
    } catch (err) {
      toast.error(lang === 'ar' ? 'فشل الحفظ' : 'Failed to save changes.');
    }
  };

  return (
    <div style={{ maxWidth: '1080px', margin: '0 auto', padding: '0 24px 40px 24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800 }} className="gradient-text">
            {lang === 'ar' ? 'أرشيف خزنة المناظرات' : 'Debate Vault Archive'}
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            {lang === 'ar' ? 'ابحث وأعد تشغيل كل مناظرة مع السجل وتقييم قاضي الذكاء الاصطناعي' : 'Search and replay every debate turn, transcript, and AI judge evaluation'}
          </p>
        </div>

        {/* Filter Controls */}
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.05)', padding: '8px 14px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
            <Search size={16} color="var(--text-muted)" />
            <input 
              type="text" 
              placeholder={lang === 'ar' ? 'البحث حسب الموضوع...' : 'Search by topic...'} 
              value={searchTerm} 
              onChange={(e) => setSearchTerm(e.target.value)} 
              style={{ background: 'none', border: 'none', color: 'white', outline: 'none', fontSize: '0.88rem' }}
            />
          </div>

          <select 
            value={selectedPersona} 
            onChange={(e) => setSelectedPersona(e.target.value)}
            style={{
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid var(--border-color)',
              color: 'white',
              borderRadius: '12px',
              padding: '8px 14px',
              outline: 'none',
              fontSize: '0.88rem'
            }}
          >
            <option value="ALL" style={{ background: '#0f172a' }}>{lang === 'ar' ? 'جميع الشخصيات' : 'All Personas'}</option>
            <option value="PHILOSOPHER" style={{ background: '#0f172a' }}>{t.persona_philosopher}</option>
            <option value="LAWYER" style={{ background: '#0f172a' }}>{t.persona_lawyer}</option>
            <option value="SCIENTIST" style={{ background: '#0f172a' }}>{t.persona_scientist}</option>
            <option value="DEVILS_ADVOCATE" style={{ background: '#0f172a' }}>{t.persona_devils}</option>
          </select>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="glass-panel" style={{ padding: '60px', textAlign: 'center', color: 'var(--text-muted)' }}>
          <Shield size={48} style={{ opacity: 0.3, marginBottom: '12px' }} />
          <p>{lang === 'ar' ? 'لم يتم العثور على مناظرات مطابقة في الأرشيف.' : 'No debates found matching your search filter.'}</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
          {filtered.map((d) => (
            <div key={d.id} className="glass-panel" style={{ padding: '24px', borderRadius: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '16px' }}>
              
              {editingId === d.id ? (
                <div>
                  <input
                    type="text"
                    value={editTitle}
                    onChange={e => setEditTitle(e.target.value)}
                    placeholder="Custom Title"
                    style={{ width: '100%', marginBottom: '8px', background: 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '6px 10px' }}
                  />
                  <input
                    type="text"
                    value={editTags}
                    onChange={e => setEditTags(e.target.value)}
                    placeholder="Tags (comma separated)"
                    style={{ width: '100%', marginBottom: '8px', background: 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '6px 10px' }}
                  />
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button className="btn-primary" style={{ padding: '4px 8px', fontSize: '0.8rem' }} onClick={() => saveEdit(d.id)}><Save size={14} /> Save</button>
                    <button className="btn-secondary" style={{ padding: '4px 8px', fontSize: '0.8rem' }} onClick={() => setEditingId(null)}><X size={14} /> Cancel</button>
                  </div>
                </div>
              ) : (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <span className={`badge ${d.winner === 'USER' ? 'badge-emerald' : 'badge-amber'}`}>
                      {d.winner === 'USER' ? (lang === 'ar' ? '🏆 فوز المناظر' : '🏆 USER WIN') : (lang === 'ar' ? '🤖 فوز الذكاء الاصطناعي' : '🤖 AI WIN')}
                    </span>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{d.persona}</span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '8px' }}>{d.custom_title || d.topic}</h3>
                    <div style={{ display: 'flex', gap: '4px' }}>
                      <button onClick={() => startEdit(d)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}><Edit2 size={14}/></button>
                      <button onClick={() => handleDelete(d.id)} style={{ background: 'none', border: 'none', color: '#fb7185', cursor: 'pointer' }}><Trash2 size={14}/></button>
                    </div>
                  </div>
                  {parseTags(d.tags).length > 0 && (
                    <div style={{ marginBottom: '8px', display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                      {parseTags(d.tags).map(tag => (
                        <span key={tag} className="badge badge-purple" style={{ fontSize: '0.7rem', padding: '2px 6px' }}><Tag size={10} style={{ marginRight: '4px' }}/>{tag}</span>
                      ))}
                    </div>
                  )}
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                    {lang === 'ar' ? `الموقف: ${d.user_side} • الصعوبة: ${d.difficulty}` : `Stance: ${d.user_side} • Difficulty: ${d.difficulty}`}
                  </p>
                </div>
              )}

              <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                <button 
                  className="btn-secondary" 
                  onClick={() => onSelectDebate && onSelectDebate(d)}
                  style={{ flex: 1, justifyContent: 'center', fontSize: '0.85rem' }}
                >
                  {lang === 'ar' ? 'إعادة العرض' : 'Replay'} <ArrowRight size={14} />
                </button>
                <button 
                  className="btn-secondary" 
                  onClick={() => handleExport(d.id, d.topic)}
                  style={{ justifyContent: 'center', fontSize: '0.85rem' }}
                  title="Export Summary"
                >
                  <Download size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
