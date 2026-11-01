import React from 'react';

export default function UsersTab({ usersList, handleUserAction }) {
  return (
    <div className="glass-panel" style={{ padding: '24px', borderRadius: '20px' }}>
      <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '16px' }}>Real Debater User Management</h3>
      
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
              <th style={{ padding: '12px' }}>ID</th>
              <th style={{ padding: '12px' }}>Username</th>
              <th style={{ padding: '12px' }}>Email</th>
              <th style={{ padding: '12px' }}>Level & XP</th>
              <th style={{ padding: '12px' }}>Points</th>
              <th style={{ padding: '12px' }}>Status</th>
              <th style={{ padding: '12px', textAlign: 'right' }}>DB Actions</th>
            </tr>
          </thead>
          <tbody>
            {usersList.map(u => (
              <tr key={u.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <td style={{ padding: '12px', color: 'var(--text-muted)' }}>#{u.id}</td>
                <td style={{ padding: '12px', fontWeight: 700, color: 'white' }}>
                  {u.username} {u.is_staff && <span className="badge badge-amber" style={{ marginLeft: '6px' }}>ADMIN</span>}
                </td>
                <td style={{ padding: '12px', color: 'var(--text-muted)' }}>{u.email}</td>
                <td style={{ padding: '12px', color: '#c084fc' }}>Level {u.level} ({u.xp} XP)</td>
                <td style={{ padding: '12px', color: '#34d399', fontWeight: 700 }}>{u.dp} DP</td>
                <td style={{ padding: '12px' }}>
                  <span className={`badge ${u.is_active ? 'badge-emerald' : 'badge-purple'}`}>
                    {u.status}
                  </span>
                </td>
                <td style={{ padding: '12px', textAlign: 'right', display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                  <button onClick={() => handleUserAction(u.id, 'grant_bonus')} className="btn-secondary" style={{ padding: '6px 10px', fontSize: '0.78rem' }}>
                    +500 DP
                  </button>
                  <button onClick={() => handleUserAction(u.id, 'toggle_admin')} className="btn-secondary" style={{ padding: '6px 10px', fontSize: '0.78rem', color: u.is_staff ? '#fbbf24' : '#818cf8' }}>
                    {u.is_staff ? 'Revoke Admin' : 'Make Admin'}
                  </button>
                  <button onClick={() => handleUserAction(u.id, 'toggle_ban')} className="btn-secondary" style={{ padding: '6px 10px', fontSize: '0.78rem', color: u.is_active ? '#fb7185' : '#34d399' }}>
                    {u.is_active ? 'Ban' : 'Unban'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
