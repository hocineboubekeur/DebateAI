import React from 'react';
import { Activity } from 'lucide-react';

export default function TelemetryTab({ telemetry }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
        <div className="glass-panel" style={{ padding: '20px', borderRadius: '18px' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Real Total Debates</span>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#818cf8', margin: '4px 0' }}>
            {telemetry?.total_debates || 0}
          </h2>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{telemetry?.completed_count || 0} Completed</span>
        </div>

        <div className="glass-panel" style={{ padding: '20px', borderRadius: '18px' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Real User Win Rate</span>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#34d399', margin: '4px 0' }}>
            {telemetry?.win_rate || '0%'}
          </h2>
          <span style={{ fontSize: '0.75rem', color: '#34d399' }}>{telemetry?.user_wins || 0} Total Wins</span>
        </div>

        <div className="glass-panel" style={{ padding: '20px', borderRadius: '18px' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Real Registered Debaters</span>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#c084fc', margin: '4px 0' }}>
            {telemetry?.total_users || 0}
          </h2>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>SQLite Database Users</span>
        </div>

        <div className="glass-panel" style={{ padding: '20px', borderRadius: '18px' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Active Gemini API Keys</span>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#fbbf24', margin: '4px 0' }}>
            {telemetry?.active_api_keys || 5} Keys
          </h2>
          <span style={{ fontSize: '0.75rem', color: '#34d399' }}>Round-robin rotation</span>
        </div>
      </div>

      <div className="glass-panel" style={{ padding: '24px', borderRadius: '20px' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Activity size={18} color="#818cf8" /> Live Model Rotation Status
        </h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {(telemetry?.models_pool || []).map((m, idx) => (
            <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px solid var(--border-color)', fontSize: '0.88rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#34d399' }} />
                <strong style={{ color: 'white' }}>{m.model}</strong>
              </div>
              <div style={{ display: 'flex', gap: '20px', color: 'var(--text-muted)', fontSize: '0.82rem' }}>
                <span>Key Rotation Pool: <strong style={{ color: '#34d399' }}>{m.key_count} Keys</strong></span>
                <span className="badge badge-emerald">ACTIVE</span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
