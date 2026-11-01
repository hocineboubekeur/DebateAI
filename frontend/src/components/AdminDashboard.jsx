import React, { useState, useEffect } from 'react';
import { Lock, Activity, Users, FileText, PlusCircle } from 'lucide-react';
import { adminAPI } from '../services/api';
import AdminHeader from './admin/AdminHeader';
import TelemetryTab from './admin/TelemetryTab';
import UsersTab from './admin/UsersTab';
import AuditTab from './admin/AuditTab';
import ContentTab from './admin/ContentTab';

export default function AdminDashboard({ user, lang = 'en' }) {
  const isAdmin = user && user.is_staff;
  const [activeTab, setActiveTab] = useState('telemetry');

  // Real Database State
  const [telemetry, setTelemetry] = useState(null);
  const [usersList, setUsersList] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState('');
  const [newFallacyName, setNewFallacyName] = useState('');
  const [newFallacyCat, setNewFallacyCat] = useState('Informal Fallacy');
  const [newFallacySummary, setNewFallacySummary] = useState('');
  const [contentMsg, setContentMsg] = useState('');

  useEffect(() => {
    if (isAdmin) {
      loadAdminData();
    }
  }, [isAdmin]);

  const loadAdminData = async () => {
    setLoading(true);
    try {
      const [telRes, usersRes, auditRes] = await Promise.all([
        adminAPI.getTelemetry(),
        adminAPI.getUsers(),
        adminAPI.getAudit()
      ]);
      setTelemetry(telRes.data);
      setUsersList(usersRes.data);
      setAuditLogs(auditRes.data);
    } catch (err) {
      console.error("Error loading admin database metrics:", err);
    } finally {
      setLoading(false);
    }
  };


  const handleUserAction = async (userId, action) => {
    try {
      const res = await adminAPI.userAction(userId, action);
      setUsersList(usersList.map(u => u.id === userId ? {
        ...u,
        is_active: res.data.is_active,
        is_staff: res.data.is_staff,
        status: res.data.status,
        dp: res.data.dp,
        xp: res.data.xp,
        level: res.data.level
      } : u));
    } catch (err) {
      console.error("User action error:", err);
    }
  };

  const handleAddFallacy = (e) => {
    e.preventDefault();
    if (!newFallacyName.trim()) return;
    setContentMsg(`Successfully published "${newFallacyName}" to the Rhetoric Library!`);
    setNewFallacyName('');
    setNewFallacySummary('');
    setTimeout(() => setContentMsg(''), 4000);
  };

  if (!isAdmin) {
    return (
      <div style={{ maxWidth: '480px', margin: '60px auto', padding: '0 20px' }}>
        <div className="glass-panel" style={{ padding: '36px', borderRadius: '24px', border: '1px solid rgba(168, 85, 247, 0.4)', textAlign: 'center' }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '20px', background: 'linear-gradient(135deg, #6366f1, #a855f7)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px auto' }}>
            <Lock size={32} color="#ffffff" />
          </div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '8px' }} className="gradient-text">Access Denied</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: '24px' }}>You must be an administrator to view this page.</p>
        </div>
      </div>
    );
  }

  const filteredLogs = auditLogs.filter(l => l.topic.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div style={{ maxWidth: '1140px', margin: '0 auto', padding: '0 24px 40px 24px', display: 'flex', flexDirection: 'column', gap: '28px' }}>
      
      <AdminHeader loadAdminData={loadAdminData} />

      {/* Subtab Toggle */}
      <div style={{ display: 'flex', gap: '8px', background: 'rgba(255,255,255,0.04)', padding: '4px', borderRadius: '14px', border: '1px solid var(--border-color)', width: 'fit-content', flexWrap: 'wrap' }}>
        {[
          { key: 'telemetry', label: 'System Telemetry & Health', icon: Activity },
          { key: 'users', label: 'User Management', icon: Users },
          { key: 'audit', label: 'Debate Quality Audit', icon: FileText },
          { key: 'content', label: 'Content Manager', icon: PlusCircle },
        ].map(t => {
          const Icon = t.icon;
          const isActive = activeTab === t.key;
          return (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 18px',
                borderRadius: '10px',
                border: 'none',
                background: isActive ? '#6366f1' : 'transparent',
                color: 'white',
                fontWeight: 600,
                fontSize: '0.88rem',
                cursor: 'pointer'
              }}
            >
              <Icon size={16} /> {t.label}
            </button>
          );
        })}
      </div>

      {activeTab === 'telemetry' && <TelemetryTab telemetry={telemetry} />}
      
      {activeTab === 'users' && <UsersTab usersList={usersList} handleUserAction={handleUserAction} />}
      
      {activeTab === 'audit' && (
        <AuditTab 
          searchTerm={searchTerm} 
          setSearchTerm={setSearchTerm} 
          filteredLogs={filteredLogs} 
        />
      )}
      
      {activeTab === 'content' && (
        <ContentTab 
          contentMsg={contentMsg}
          handleAddFallacy={handleAddFallacy}
          newFallacyName={newFallacyName}
          setNewFallacyName={setNewFallacyName}
          newFallacyCat={newFallacyCat}
          setNewFallacyCat={setNewFallacyCat}
          newFallacySummary={newFallacySummary}
          setNewFallacySummary={setNewFallacySummary}
        />
      )}
    </div>
  );
}
