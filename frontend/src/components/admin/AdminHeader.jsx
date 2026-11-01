import React from 'react';
import { ShieldCheck, RefreshCw } from 'lucide-react';

export default function AdminHeader({ loadAdminData }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800 }} className="gradient-text">Administrator Console</h2>
          <span className="badge badge-amber" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <ShieldCheck size={14} /> LIVE DATABASE CONNECTED
          </span>
        </div>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Real-time database statistics, user accounts, and debate audit logs</p>
      </div>

      <div style={{ display: 'flex', gap: '10px' }}>
        <button className="btn-secondary" onClick={loadAdminData} style={{ padding: '8px 14px' }}>
          <RefreshCw size={16} /> Refresh Metrics
        </button>
      </div>
    </div>
  );
}
