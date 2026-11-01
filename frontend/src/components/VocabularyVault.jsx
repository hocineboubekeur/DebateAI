import React, { useState, useEffect } from 'react';
import { Search, Plus, Book, RefreshCw, Star, Trash2 } from 'lucide-react';
import { vocabularyAPI } from '../services/api';
import toast from 'react-hot-toast';

export default function VocabularyVault({ lang = 'en' }) {
  const [words, setWords] = useState([]);
  const [filter, setFilter] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [newWord, setNewWord] = useState('');

  const [activeCard, setActiveCard] = useState(null);
  const [flipped, setFlipped] = useState(false);

  useEffect(() => {
    fetchWords();
  }, [filter]);

  const fetchWords = async () => {
    setLoading(true);
    try {
      const res = await vocabularyAPI.list(filter === 'DUE', lang);
      setWords(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleExpandAndAdd = async () => {
    if (!newWord.trim()) return;
    setLoading(true);
    try {
      const expandRes = await vocabularyAPI.expand(newWord, lang);
      await vocabularyAPI.create(expandRes.data);
      toast.success(lang === 'ar' ? 'تمت الإضافة بنجاح' : 'Word added successfully!');
      setNewWord('');
      setShowAdd(false);
      fetchWords();
    } catch (err) {
      toast.error(lang === 'ar' ? 'خطأ في الإضافة' : 'Error adding word');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await vocabularyAPI.delete(id);
      setWords(words.filter(w => w.id !== id));
      if (activeCard && activeCard.id === id) setActiveCard(null);
    } catch (err) {
      toast.error(lang === 'ar' ? 'حدث خطأ' : 'Error deleting word');
    }
  };

  const handleRate = async (id, rating) => {
    try {
      await vocabularyAPI.update(id, { recall_rating: rating });
      toast.success(lang === 'ar' ? 'تم حفظ التقييم' : 'Rating saved');
      setFlipped(false);
      setActiveCard(null);
      fetchWords();
    } catch (err) {
      console.error(err);
    }
  };

  const filteredWords = words.filter(w => (w.word || '').toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div style={{ maxWidth: '1080px', margin: '0 auto', padding: '0 24px 40px 24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800 }} className="gradient-text">
            {lang === 'ar' ? 'خزنة المفردات' : 'Vocabulary Vault'}
          </h2>
        </div>
        
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.05)', padding: '8px 14px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
            <Search size={16} color="var(--text-muted)" />
            <input 
              type="text" 
              placeholder={lang === 'ar' ? 'بحث...' : 'Search...'} 
              value={searchTerm} 
              onChange={(e) => setSearchTerm(e.target.value)} 
              style={{ background: 'none', border: 'none', color: 'white', outline: 'none', fontSize: '0.88rem' }}
            />
          </div>
          <select 
            value={filter} 
            onChange={(e) => setFilter(e.target.value)}
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-color)', color: 'white', borderRadius: '12px', padding: '8px 14px', outline: 'none' }}
          >
            <option value="ALL" style={{ background: '#0f172a' }}>{lang === 'ar' ? 'الكل' : 'All Words'}</option>
            <option value="DUE" style={{ background: '#0f172a' }}>{lang === 'ar' ? 'للمراجعة' : 'Due for Review'}</option>
          </select>
          <button className="btn-primary" onClick={() => setShowAdd(true)}>
            <Plus size={16} /> {lang === 'ar' ? 'إضافة كلمة' : 'Add Word'}
          </button>
        </div>
      </div>

      {showAdd && (
        <div className="glass-panel" style={{ padding: '24px', borderRadius: '20px', display: 'flex', gap: '12px', alignItems: 'center' }}>
          <input 
            type="text" 
            placeholder={lang === 'ar' ? 'أدخل كلمة...' : 'Enter a word...'} 
            value={newWord}
            onChange={(e) => setNewWord(e.target.value)}
            style={{ flex: 1, padding: '12px 16px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-color)', color: 'white', outline: 'none' }}
          />
          <button className="btn-primary" onClick={handleExpandAndAdd} disabled={loading || !newWord.trim()}>
            {loading ? <RefreshCw size={16} className="spin" /> : <Star size={16} />} 
            {lang === 'ar' ? 'إثراء وتوليد' : 'AI Enrich & Add'}
          </button>
          <button className="btn-secondary" onClick={() => setShowAdd(false)}>
            {lang === 'ar' ? 'إلغاء' : 'Cancel'}
          </button>
        </div>
      )}

      {activeCard ? (
        <div className="glass-panel" style={{ padding: '40px', borderRadius: '24px', textAlign: 'center', minHeight: '300px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ position: 'absolute', top: '24px', right: '24px', display: 'flex', gap: '8px' }}>
            <button className="btn-secondary" style={{ padding: '8px' }} onClick={() => handleDelete(activeCard.id)}>
              <Trash2 size={16} color="#fb7185" />
            </button>
          </div>
          
          <h3 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '16px' }}>{activeCard.word}</h3>
          
          {flipped ? (
            <div style={{ animation: 'fadeIn 0.3s' }}>
              <p style={{ fontSize: '1.1rem', color: '#818cf8', marginBottom: '8px' }}>{activeCard.phonetic}</p>
              <p style={{ fontSize: '1.2rem', marginBottom: '16px' }}>{activeCard.definition}</p>
              <p style={{ fontStyle: 'italic', color: 'var(--text-muted)', marginBottom: '16px' }}>"{activeCard.context_sentence}"</p>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '32px' }}>
                {(activeCard.synonyms || []).map(syn => (
                  <span key={syn} className="badge badge-purple">{syn}</span>
                ))}
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'center', gap: '16px' }}>
                <button className="btn-secondary" style={{ borderColor: '#fb7185', color: '#fb7185' }} onClick={() => handleRate(activeCard.id, 'hard')}>
                  {lang === 'ar' ? 'صعب' : 'Hard'}
                </button>
                <button className="btn-secondary" style={{ borderColor: '#f59e0b', color: '#f59e0b' }} onClick={() => handleRate(activeCard.id, 'good')}>
                  {lang === 'ar' ? 'جيد' : 'Good'}
                </button>
                <button className="btn-secondary" style={{ borderColor: '#34d399', color: '#34d399' }} onClick={() => handleRate(activeCard.id, 'easy')}>
                  {lang === 'ar' ? 'سهل' : 'Easy'}
                </button>
              </div>
            </div>
          ) : (
            <button className="btn-primary" style={{ margin: '0 auto' }} onClick={() => setFlipped(true)}>
              {lang === 'ar' ? 'أظهر الإجابة' : 'Show Answer'}
            </button>
          )}
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '16px' }}>
          {filteredWords.map(w => (
            <div 
              key={w.id} 
              className="glass-panel hover-card" 
              onClick={() => { setActiveCard(w); setFlipped(false); }}
              style={{ padding: '24px', borderRadius: '16px', cursor: 'pointer', textAlign: 'center' }}
            >
              <Book size={24} color="#818cf8" style={{ margin: '0 auto 12px auto' }} />
              <h4 style={{ fontSize: '1.2rem', fontWeight: 700 }}>{w.word}</h4>
              <div style={{ marginTop: '12px' }}>
                <span className="badge badge-emerald">Mastery: {w.mastery_level || 0}</span>
              </div>
            </div>
          ))}
          {filteredWords.length === 0 && !loading && (
            <p style={{ color: 'var(--text-muted)', gridColumn: '1 / -1', textAlign: 'center', padding: '40px' }}>
              {lang === 'ar' ? 'لا توجد كلمات' : 'No words found.'}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
