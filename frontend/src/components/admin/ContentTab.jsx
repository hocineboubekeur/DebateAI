import React from 'react';
import { PlusCircle } from 'lucide-react';

export default function ContentTab({
  contentMsg,
  handleAddFallacy,
  newFallacyName,
  setNewFallacyName,
  newFallacyCat,
  setNewFallacyCat,
  newFallacySummary,
  setNewFallacySummary
}) {
  return (
    <div className="glass-panel" style={{ padding: '24px', borderRadius: '20px', maxWidth: '640px' }}>
      <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '16px' }}>Add Fallacy Article to Library</h3>
      
      {contentMsg && (
        <div style={{ background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '10px 14px', borderRadius: '10px', fontSize: '0.85rem', color: '#34d399', marginBottom: '16px' }}>
          {contentMsg}
        </div>
      )}

      <form onSubmit={handleAddFallacy} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div>
          <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>Fallacy Name</label>
          <input 
            type="text" 
            value={newFallacyName}
            onChange={(e) => setNewFallacyName(e.target.value)}
            placeholder="e.g. Appeal to Ignorance"
            required
            style={{ width: '100%', padding: '12px 16px', borderRadius: '10px', background: 'rgba(255,255,255,0.06)', border: '1px solid var(--border-color)', color: 'white', outline: 'none' }}
          />
        </div>

        <div>
          <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>Category</label>
          <select 
            value={newFallacyCat}
            onChange={(e) => setNewFallacyCat(e.target.value)}
            style={{ width: '100%', padding: '12px 16px', borderRadius: '10px', background: 'rgba(255,255,255,0.06)', border: '1px solid var(--border-color)', color: 'white', outline: 'none' }}
          >
            <option value="Informal Fallacy" style={{ background: '#0f172a' }}>Informal Fallacy</option>
            <option value="Formal Fallacy" style={{ background: '#0f172a' }}>Formal Fallacy</option>
            <option value="Rhetorical Fallacy" style={{ background: '#0f172a' }}>Rhetorical Fallacy</option>
          </select>
        </div>

        <div>
          <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>Summary & Explanation</label>
          <textarea 
            rows="3"
            value={newFallacySummary}
            onChange={(e) => setNewFallacySummary(e.target.value)}
            placeholder="Provide concise summary of the logical flaw..."
            required
            style={{ width: '100%', padding: '12px 16px', borderRadius: '10px', background: 'rgba(255,255,255,0.06)', border: '1px solid var(--border-color)', color: 'white', outline: 'none', fontFamily: 'inherit' }}
          />
        </div>

        <button type="submit" className="btn-primary" style={{ justifyContent: 'center', padding: '12px' }}>
          <PlusCircle size={18} /> Publish New Fallacy to Library
        </button>
      </form>
    </div>
  );
}
