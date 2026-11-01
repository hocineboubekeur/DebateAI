import React, { useState, useEffect } from 'react';
import { Trophy, Crown, CheckCircle2, MessageSquare, Send } from 'lucide-react';
import { coachingAPI } from '../services/api';

import { translations } from '../utils/translations';

export default function TournamentsPage({ lang = 'en' }) {
  const [clubs, setClubs] = useState([]);
  const [tournaments, setTournaments] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  const [activeGuildChat, setActiveGuildChat] = useState(null);
  const [guildMessages, setGuildMessages] = useState({});
  const [chatInput, setChatInput] = useState('');

  useEffect(() => {
    async function loadTournaments() {
      try {
        const res = await coachingAPI.getTournaments();
        setClubs(res.data.clubs);
        setTournaments(res.data.tournaments);
        setLeaderboard(res.data.leaderboard);
      } catch (err) {
        console.error("Error loading tournaments:", err);
      } finally {
        setLoading(false);
      }
    }
    loadTournaments();
  }, []);

  const toggleClubJoin = (clubId) => {
    setClubs(clubs.map(cItem => cItem.id === clubId ? { ...cItem, joined: !cItem.joined, members_count: cItem.joined ? cItem.members_count - 1 : cItem.members_count + 1 } : cItem));
  };

  const handleSendGuildMessage = (e) => {
    e.preventDefault();
    if (!chatInput.trim() || !activeGuildChat) return;
    
    const guildId = activeGuildChat.id;
    const newMessage = { user: 'You', time: 'Just now', text: chatInput.trim() };
    
    setGuildMessages({
      ...guildMessages,
      [guildId]: [...(guildMessages[guildId] || []), newMessage]
    });
    setChatInput('');
  };

  if (loading) {
    return (
      <div style={{ maxWidth: '1080px', margin: '0 auto', padding: '0 24px 40px 24px', display: 'flex', flexDirection: 'column', gap: '28px' }}>
        <div>
          <div className="skeleton-box" style={{ width: '400px', height: '36px', marginBottom: '8px' }}></div>
          <div className="skeleton-box" style={{ width: '600px', height: '20px' }}></div>
        </div>
        <div>
          <div className="skeleton-box" style={{ width: '200px', height: '24px', marginBottom: '14px' }}></div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
            {[1, 2].map(i => (
              <div key={i} className="glass-panel" style={{ padding: '24px', borderRadius: '20px', height: '180px' }}>
                <div className="skeleton-box" style={{ width: '100%', height: '100%' }}></div>
              </div>
            ))}
          </div>
        </div>
        <div>
          <div className="skeleton-box" style={{ width: '200px', height: '24px', marginBottom: '14px' }}></div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
            {[1, 2, 3].map(i => (
              <div key={i} className="glass-panel" style={{ padding: '24px', borderRadius: '20px', height: '160px' }}>
                <div className="skeleton-box" style={{ width: '100%', height: '100%' }}></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1080px', margin: '0 auto', padding: '0 24px 40px 24px', display: 'flex', flexDirection: 'column', gap: '28px' }}>
      
      {/* Page Header */}
      <div>
        <h2 style={{ fontSize: '1.8rem', fontWeight: 800 }} className="gradient-gold">Clubs, Leagues & Seasonal Tournaments</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Join reasoning clubs/guilds, unlock guild perks, compete in elimination brackets, and climb global leaderboards</p>
      </div>

      {/* Tournaments Grid */}
      <div>
        <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '14px', color: '#ffffff' }}>Active Seasonal Leagues</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
          {tournaments.map((tournament) => (
            <div 
              key={tournament.id}
              className="glass-panel" 
              style={{
                padding: '24px',
                borderRadius: '20px',
                background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.12) 0%, rgba(15, 23, 42, 0.85) 100%)',
                border: '1px solid rgba(245, 158, 11, 0.3)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <span className="badge badge-amber">{tournament.status}</span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{tournament.participants} Debaters</span>
                </div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '8px', color: '#ffffff' }}>{tournament.title}</h3>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
                  Prize Pool: <strong style={{ color: '#34d399' }}>{tournament.prize_pool}</strong>
                </p>
              </div>

              <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Format: {tournament.format}</span>
                <button className="btn-primary" style={{ padding: '8px 16px', fontSize: '0.82rem' }}>
                  Enter Tournament Bracket
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Reasoning Clubs & Guilds Section */}
      <div>
        <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '14px', color: '#ffffff' }}>Reasoning Guilds & Clubs</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
          {clubs.map((club) => (
            <div 
              key={club.id}
              className="glass-panel" 
              style={{
                padding: '24px',
                borderRadius: '20px',
                border: club.joined ? '1px solid rgba(16, 185, 129, 0.4)' : '1px solid var(--border-color)',
                background: club.joined ? 'rgba(16, 185, 129, 0.08)' : 'rgba(255,255,255,0.02)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <span className="badge badge-purple">{club.perk || '+10% XP Guild Perk'}</span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{club.members_count} Members</span>
                </div>
                
                <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '6px', color: '#ffffff' }}>{club.name}</h4>
                <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', lineHeight: '1.4', marginBottom: '16px' }}>{club.description}</p>
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button 
                  className={club.joined ? "btn-secondary" : "btn-primary"}
                  onClick={() => toggleClubJoin(club.id)}
                  style={{
                    flex: 1,
                    justifyContent: 'center',
                    padding: '10px',
                    fontSize: '0.85rem',
                    borderColor: club.joined ? '#34d399' : 'var(--border-color)',
                    color: club.joined ? '#34d399' : 'white'
                  }}
                >
                  {club.joined ? <><CheckCircle2 size={16} /> Guild Member</> : 'Join Guild'}
                </button>

                {club.joined && (
                  <button 
                    className="btn-secondary" 
                    onClick={() => setActiveGuildChat(club)}
                    style={{ padding: '10px 14px' }}
                    title="Open Guild Strategy Chat"
                  >
                    <MessageSquare size={16} color="#818cf8" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Guild Strategy Chat Modal */}
      {activeGuildChat && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(9, 13, 22, 0.85)', backdropFilter: 'blur(12px)',
          zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px'
        }}>
          <div className="glass-panel" style={{ width: '100%', maxWidth: '600px', borderRadius: '24px', padding: '28px', border: '1px solid var(--border-glow)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>{activeGuildChat.name} Strategy Lounge</h3>
                <span style={{ fontSize: '0.78rem', color: '#34d399' }}>● Active Guild Chat Room ({activeGuildChat.members_count} members online)</span>
              </div>
              <button onClick={() => setActiveGuildChat(null)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '1.2rem' }}>✕</button>
            </div>

            <div style={{ background: 'rgba(0,0,0,0.3)', borderRadius: '16px', padding: '16px', height: '280px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '16px' }}>
              {(guildMessages[activeGuildChat.id] || []).map((m, idx) => (
                <div key={idx} style={{ background: m.user === 'You' ? 'rgba(99, 102, 241, 0.2)' : 'rgba(255,255,255,0.04)', padding: '10px 14px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '4px' }}>
                    <strong style={{ color: m.user === 'You' ? '#34d399' : '#818cf8' }}>{m.user}</strong>
                    <span style={{ color: 'var(--text-muted)' }}>{m.time}</span>
                  </div>
                  <p style={{ fontSize: '0.88rem', color: 'white' }}>{m.text}</p>
                </div>
              ))}
            </div>

            <form onSubmit={handleSendGuildMessage} style={{ display: 'flex', gap: '10px' }}>
              <input 
                type="text" 
                value={chatInput} 
                onChange={(e) => setChatInput(e.target.value)} 
                placeholder="Share strategy or ask guild debaters..." 
                maxLength={500}
                style={{ flex: 1, padding: '12px 16px', borderRadius: '12px', background: 'rgba(255,255,255,0.06)', border: '1px solid var(--border-color)', color: 'white', outline: 'none' }}
              />
              <button type="submit" className="btn-primary" style={{ padding: '12px 20px' }}>
                <Send size={16} /> Send
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Global Leaderboard Table */}
      <div className="glass-panel" style={{ padding: '28px', borderRadius: '24px' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Crown size={20} color="#fbbf24" />
          Global Debater Leaderboard (Season 4)
        </h3>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
                <th style={{ padding: '12px' }}>Rank</th>
                <th style={{ padding: '12px' }}>Debater</th>
                <th style={{ padding: '12px' }}>Title</th>
                <th style={{ padding: '12px' }}>Level</th>
                <th style={{ padding: '12px', textAlign: 'right' }}>Debate Points</th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.map((u) => (
                <tr key={u.rank} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <td style={{ padding: '12px', fontWeight: 800, color: u.rank === 1 ? '#fbbf24' : u.rank === 2 ? '#cbd5e1' : u.rank === 3 ? '#d97706' : 'var(--text-muted)' }}>
                    #{u.rank}
                  </td>
                  <td style={{ padding: '12px', fontWeight: 700, color: 'white' }}>{u.username}</td>
                  <td style={{ padding: '12px' }}><span className="badge badge-purple">{u.title}</span></td>
                  <td style={{ padding: '12px', color: '#c084fc' }}>Lvl {u.level}</td>
                  <td style={{ padding: '12px', textAlign: 'right', fontWeight: 800, color: '#34d399' }}>{u.dp} DP</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
