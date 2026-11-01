import React from 'react';
import { Search } from 'lucide-react';

export default function AuditTab({ searchTerm, setSearchTerm, filteredLogs }) {
  return (
    <div className="glass-panel" style={{ padding: '24px', borderRadius: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Real Debate Transcripts & Judge Audit Log</h3>
        
        <div style={{ position: 'relative', width: '260px' }}>
          <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '10px' }} />
          <input 
            type="text" 
            placeholder="Filter by topic..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: '100%', padding: '8px 12px 8px 36px', borderRadius: '10px', background: 'rgba(255,255,255,0.06)', border: '1px solid var(--border-color)', color: 'white', fontSize: '0.85rem', outline: 'none' }}
          />
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {filteredLogs.length === 0 ? (
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>No debate logs found matching query.</p>
        ) : (
          filteredLogs.map(l => (
            <div key={l.id} style={{ padding: '16px', background: 'rgba(255,255,255,0.03)', borderRadius: '14px', border: '1px solid var(--border-color)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontWeight: 700, color: 'white', fontSize: '0.95rem' }}>Debate #{l.id}: {l.topic}</span>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>User: @{l.user}</span>
                  <span className={`badge ${l.winner === 'USER' ? 'badge-emerald' : 'badge-purple'}`}>Winner: {l.winner}</span>
                </div>
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>
                <strong>AI Judge Summary:</strong> {l.judge_summary}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
