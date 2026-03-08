import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../App';

const API = 'http://localhost:8082/api/reports';

const STATUS_LABEL: Record<string, { label: string; color: string; bg: string }> = {
  PENDING:   { label: 'En attente', color: '#F97316', bg: '#FFF7ED' },
  VALIDATED: { label: 'Validé',     color: '#22C55E', bg: '#F0FDF4' },
  REJECTED:  { label: 'Rejeté',     color: '#EF4444', bg: '#FFF5F5' },
  RESOLVED:  { label: 'Résolu',     color: '#6366F1', bg: '#EEF2FF' },
};

const CAT_ICON: Record<string, string> = {
  STEP: '🚶', RAMP: '♿', ELEVATOR: '🛗', SIDEWALK: '🛤️', SIGNAGE: 'ℹ️', PARKING: '🅿️',
};

export default function MyReportsPage() {
  const { isAuthenticated, userId } = useAuth();
  const navigate = useNavigate();
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) return;
    const token = localStorage.getItem('accessToken');
    fetch(`${API}/user/${userId}`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json()).then(setReports).catch(() => setReports([])).finally(() => setLoading(false));
  }, [isAuthenticated]);

  const tabs = [
    { id: 'carte', label: 'Carte', path: '/', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" width={22} height={22}><polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"/><line x1="9" y1="3" x2="9" y2="18"/><line x1="15" y1="6" x2="15" y2="21"/></svg> },
    { id: 'signalements', label: 'Signalements', path: '/my-reports', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" width={22} height={22}><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/></svg> },
    { id: 'communaute', label: 'Communauté', path: '/community', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" width={22} height={22}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg> },
    { id: 'profil', label: 'Profil', path: '/profile', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" width={22} height={22}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg> },
  ];

  return (
    <div style={{ maxWidth: 390, margin: '0 auto', minHeight: '100dvh', background: '#F8F9FA', fontFamily: "'DM Sans', system-ui, sans-serif", display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{ background: '#fff', padding: '56px 20px 16px', borderBottom: '1px solid #F3F4F6' }}>
        <h1 style={{ margin: 0, fontSize: 24, fontWeight: 800, color: '#111', letterSpacing: '-0.5px' }}>Mes signalements</h1>
        <p style={{ margin: '4px 0 0', fontSize: 14, color: '#9CA3AF' }}>
          {loading ? 'Chargement...' : `${reports.length} signalement${reports.length !== 1 ? 's' : ''}`}
        </p>
      </div>

      {/* List */}
      <div style={{ flex: 1, padding: '16px', overflowY: 'auto', paddingBottom: 80 }}>
        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[1, 2, 3].map(i => (
              <div key={i} style={{ background: '#fff', borderRadius: 16, height: 100, animation: 'pulse 1.5s infinite' }}/>
            ))}
          </div>
        ) : reports.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>📭</div>
            <div style={{ fontSize: 16, fontWeight: 700, color: '#374151', marginBottom: 8 }}>Aucun signalement</div>
            <div style={{ fontSize: 14, color: '#9CA3AF', marginBottom: 24 }}>Signalez votre premier obstacle urbain !</div>
            <button onClick={() => navigate('/report')} style={{ padding: '12px 24px', background: '#6366F1', color: '#fff', border: 'none', borderRadius: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', boxShadow: '0 4px 16px rgba(99,102,241,0.35)' }}>
              Signaler un obstacle
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {reports.map(r => {
              const st = STATUS_LABEL[r.status] || STATUS_LABEL.PENDING;
              return (
                <div key={r.id} style={{ background: '#fff', borderRadius: 16, overflow: 'hidden', boxShadow: '0 1px 6px rgba(0,0,0,0.06)' }}>
                  {r.photoUrl && <img src={r.photoUrl} alt="" style={{ width: '100%', height: 120, objectFit: 'cover' }}/>}
                  <div style={{ padding: '14px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 8 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ fontSize: 18 }}>{CAT_ICON[r.category] || '📍'}</span>
                        <div>
                          <div style={{ fontSize: 14, fontWeight: 700, color: '#111' }}>{r.category}</div>
                          <div style={{ fontSize: 12, color: '#9CA3AF' }}>
                            {new Date(r.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </div>
                        </div>
                      </div>
                      <span style={{ fontSize: 11, fontWeight: 700, padding: '4px 10px', borderRadius: 20, background: st.bg, color: st.color }}>
                        {st.label}
                      </span>
                    </div>
                    {r.description && <p style={{ margin: '0 0 10px', fontSize: 13, color: '#6B7280', lineHeight: 1.5 }}>{r.description}</p>}
                    <div style={{ display: 'flex', gap: 16, fontSize: 12, color: '#9CA3AF', fontWeight: 600 }}>
                      <span>👍 {r.votesUp}</span>
                      <span>👎 {r.votesDown}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* FAB */}
      <button onClick={() => navigate('/report')} style={{ position: 'fixed', bottom: 76, right: 20, width: 56, height: 56, borderRadius: '50%', background: '#6366F1', border: 'none', boxShadow: '0 4px 20px rgba(99,102,241,0.4)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 30 }}>
        <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2.5} strokeLinecap="round" width={26} height={26}><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
      </button>

      {/* Bottom nav */}
      <div style={{ display: 'flex', background: '#fff', borderTop: '1px solid #F3F4F6', padding: '8px 0 8px', position: 'sticky', bottom: 0, zIndex: 30 }}>
        {tabs.map(tab => (
          <button key={tab.id} onClick={() => navigate(tab.path)} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, border: 'none', background: 'transparent', cursor: 'pointer', padding: '4px 0', color: tab.id === 'signalements' ? '#6366F1' : '#9CA3AF', fontFamily: 'inherit' }}>
            {tab.icon}
            <span style={{ fontSize: 10, fontWeight: 600 }}>{tab.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
