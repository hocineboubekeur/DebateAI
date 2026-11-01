import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Play, Filter, Award, Target, MessageSquare } from 'lucide-react';
import { debatesAPI } from '../services/api';

export default function GlobalDebateSearch({ isOpen, onClose, onSelectDebate, lang }) {
  const [query, setQuery] = useState('');
  const [persona, setPersona] = useState('');
  const [minScore, setMinScore] = useState(0);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) {
          onClose();
        } else {
          onClose(); // This might trigger a toggle, wait this logic needs to just open.
          // In App.jsx we'll handle the toggle, but here if it's already open, close it.
        }
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current.focus(), 100);
    }
  }, [isOpen]);

  useEffect(() => {
    const searchDebates = async () => {
      if (!query && !persona && minScore === 0) {
        setResults([]);
        return;
      }
      setLoading(true);
      try {
        const res = await debatesAPI.search(query, persona, minScore);
        setResults(res.data);
      } catch (err) {
        console.error("Search failed", err);
      } finally {
        setLoading(false);
      }
    };

    const debounce = setTimeout(searchDebates, 300);
    return () => clearTimeout(debounce);
  }, [query, persona, minScore]);

  if (!isOpen) return null;

  return (
    <>
      <div 
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          zIndex: 9999,
          backdropFilter: 'blur(4px)',
        }}
        onClick={onClose}
      />
      <div 
        style={{
          position: 'fixed',
          top: 0,
          right: lang === 'ar' ? 'auto' : 0,
          left: lang === 'ar' ? 0 : 'auto',
          bottom: 0,
          width: '100%',
          maxWidth: '400px',
          backgroundColor: 'var(--bg-color)',
          borderLeft: lang === 'ar' ? 'none' : '1px solid var(--border-color)',
          borderRight: lang === 'ar' ? '1px solid var(--border-color)' : 'none',
          boxShadow: '-4px 0 24px rgba(0,0,0,0.2)',
          zIndex: 10000,
          display: 'flex',
          flexDirection: 'column',
          transform: isOpen ? 'translateX(0)' : `translateX(${lang === 'ar' ? '-100%' : '100%'})`,
          transition: 'transform 0.3s ease',
        }}
      >
        <div style={{ padding: '20px', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h2 style={{ margin: 0, fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Search size={20} color="#818cf8" />
            {lang === 'ar' ? 'بحث شامل' : 'Global Search'}
          </h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
            <X size={24} />
          </button>
        </div>

        <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <input
            ref={inputRef}
            type="text"
            placeholder={lang === 'ar' ? 'ابحث في المواضيع والمحتوى...' : 'Search topics and content...'}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="input-field"
            style={{ width: '100%' }}
          />

          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <select 
              value={persona} 
              onChange={(e) => setPersona(e.target.value)}
              className="input-field"
              style={{ padding: '6px 12px', fontSize: '0.85rem', flex: 1 }}
            >
              <option value="">{lang === 'ar' ? 'جميع الشخصيات' : 'All Personas'}</option>
              <option value="Socrates">Socrates</option>
              <option value="Machiavelli">Machiavelli</option>
              <option value="Einstein">Einstein</option>
              <option value="Steve Jobs">Steve Jobs</option>
            </select>

            <select 
              value={minScore} 
              onChange={(e) => setMinScore(Number(e.target.value))}
              className="input-field"
              style={{ padding: '6px 12px', fontSize: '0.85rem', flex: 1 }}
            >
              <option value={0}>{lang === 'ar' ? 'أي درجة' : 'Any Score'}</option>
              <option value={50}>50+ Score</option>
              <option value={75}>75+ Score</option>
              <option value={90}>90+ Score</option>
            </select>
          </div>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '0 20px 20px' }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '20px', color: 'var(--text-muted)' }}>
              {lang === 'ar' ? 'جاري البحث...' : 'Searching...'}
            </div>
          ) : results.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {results.map((debate) => (
                <div key={debate.id} style={{ 
                  background: 'rgba(255,255,255,0.03)', 
                  border: '1px solid var(--border-color)',
                  borderRadius: '12px',
                  padding: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <h3 style={{ margin: 0, fontSize: '1rem' }}>{debate.topic}</h3>
                    {debate.score_overall !== undefined && (
                      <span style={{ 
                        background: 'rgba(16, 185, 129, 0.2)', 
                        color: '#34d399', 
                        padding: '2px 8px', 
                        borderRadius: '12px',
                        fontSize: '0.8rem',
                        fontWeight: 'bold'
                      }}>
                        {debate.score_overall} pts
                      </span>
                    )}
                  </div>
                  <div style={{ display: 'flex', gap: '12px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Target size={14} /> {debate.persona}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <MessageSquare size={14} /> {debate.turns?.length || 0} {lang === 'ar' ? 'أدوار' : 'turns'}
                    </span>
                  </div>
                  {debate.snippet && (
                    <div style={{ 
                      fontSize: '0.85rem', 
                      fontStyle: 'italic', 
                      color: 'var(--text-muted)',
                      borderLeft: '2px solid rgba(255,255,255,0.1)',
                      paddingLeft: '8px',
                      marginTop: '4px'
                    }}>
                      "{debate.snippet}"
                    </div>
                  )}
                  <button 
                    className="btn-secondary"
                    style={{ marginTop: '8px', padding: '6px' }}
                    onClick={() => {
                      onSelectDebate(debate);
                      onClose();
                    }}
                  >
                    <Play size={16} /> {lang === 'ar' ? 'مشاهدة الإعادة' : 'View Replay'}
                  </button>
                </div>
              ))}
            </div>
          ) : (query || persona || minScore > 0) ? (
            <div style={{ textAlign: 'center', padding: '20px', color: 'var(--text-muted)' }}>
              {lang === 'ar' ? 'لم يتم العثور على نتائج.' : 'No results found.'}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-muted)' }}>
              <Search size={40} style={{ opacity: 0.2, marginBottom: '16px' }} />
              <p>{lang === 'ar' ? 'ابدأ البحث في المناظرات السابقة.' : 'Start searching through past debates.'}</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
