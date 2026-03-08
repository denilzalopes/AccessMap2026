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

export default function CommunityPage() {
  const { isAuthenticated, userId } = useAuth();
  const navigate = useNavigate();
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [voted, setVoted] = useState<Record<string, 'up' | 'down'>>({});

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    fetch(`${API}?page=0&size=20`, { headers: token ? { Authorization: `Bearer ${token}` } : {} })
      .then(r => r.json()).then(d => setReports(Array.isArray(d) ? d : d.content || []))
      .catch(() => setReports([])).finally(() => setLoading(false));
  }, []);

  const vote = async (id: string, type: 'up' | 'down') => {
    if (!isAuthenticated) { navigate('/login'); return; }
    const token = localStorage.getItem('accessToken');
    try {
      await fetch(`${API}/${id}/vote?userId=${userId}&type=${type}`, { method: 'POST', headers: { Authorization: `Bearer ${token}` } });
      setVoted(v => ({ ...v, [id]: type }));
      setReports(rs => rs.map(r => r.id === id ? { ...r, votesUp: r.votesUp + (type === 'up' ? 1 : 0), votesDown: r.votesDown + (type === 'down' ? 1 : 0) } : r));
    } catch {}
  };

  const tabs = [
    { id: 'carte', label: 'Carte', path: '/', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" width={22} height={22}><polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"/><line x1="9" y1="3" x2="9" y2="18"/><line x1="15" y1="6" x2="15" y2="21"/></svg> },
    { id: 'signalements', label: 'Signalements', path: '/my-reports', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" width={22} height={22}><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/></svg> },
    { id: 'communaute', label: 'Communauté', path: '/community', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" width={22} height={22}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg> },
    { id: 'profil', label: 'Profil', path: '/profile', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" width={22} height={22}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg> },
  ];

  return (
    <div style={{ maxWidth: 390, margin: '0 auto', minHeight: '100dvh', background: '#F8F9FA', fontFamily: "'DM Sans', system-ui, sans-serif", display: 'flex', flexDirection: 'column' }}>
      <div style={{ background: '#fff', padding: '56px 20px 16px', borderBottom: '1px solid #F3F4F6' }}>
        <h1 style={{ margin: 0, fontSize: 24, fontWeight: 800, color: '#111', letterSpacing: '-0.5px' }}>Communauté</h1>
        <p style={{ margin: '4px 0 0', fontSize: 14, color: '#9CA3AF' }}>Validez les signalements de vos voisins</p>
      </div>

      <div style={{ flex: 1, padding: '16px', overflowY: 'auto', paddingBottom: 90 }}>
        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[1,2,3].map(i => <div key={i} style={{ background: '#fff', borderRadius: 16, height: 160 }}/>)}
          </div>
        ) : reports.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>🏙️</div>
            <div style={{ fontSize: 16, fontWeight: 700, color: '#374151' }}>Aucun signalement pour le moment</div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {reports.map(r => {
              const st = STATUS_LABEL[r.status] || STATUS_LABEL.PENDING;
              const myVote = voted[r.id];
              return (
                <div key={r.id} style={{ background: '#fff', borderRadius: 16, overflow: 'hidden', boxShadow: '0 1px 6px rgba(0,0,0,0.06)' }}>
                  {r.photoUrl && <img src={r.photoUrl} alt="" style={{ width: '100%', height: 140, objectFit: 'cover' }}/>}
                  <div style={{ padding: '14px 16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                      <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                        <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 20, background: '#EEF2FF', color: '#6366F1' }}>
                          {CAT_ICON[r.category]} {r.category}
                        </span>
                        <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 20, background: st.bg, color: st.color }}>
                          {st.label}
                        </span>
                      </div>
                    </div>
                    <h3 style={{ margin: '0 0 4px', fontSize: 15, fontWeight: 800, color: '#111' }}>
                      {r.description?.slice(0, 50) || `Obstacle ${r.category}`}
                    </h3>
                    <div style={{ display: 'flex', gap: 12, fontSize: 12, color: '#9CA3AF', marginBottom: 12 }}>
                      <span>📍 {r.latitude?.toFixed(3)}, {r.longitude?.toFixed(3)}</span>
                      <span>🕐 {new Date(r.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}</span>
                    </div>
                    <div style={{ borderTop: '1px solid #F3F4F6', paddingTop: 12, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: 12, color: '#9CA3AF', fontWeight: 600 }}>Ce signalement est-il correct ?</span>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button onClick={() => vote(r.id, 'up')} style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '6px 12px', borderRadius: 20, border: '1.5px solid', borderColor: myVote === 'up' ? '#6366F1' : '#E5E7EB', background: myVote === 'up' ? '#EEF2FF' : '#fff', cursor: 'pointer', fontSize: 12, fontWeight: 700, color: myVote === 'up' ? '#6366F1' : '#6B7280', fontFamily: 'inherit' }}>
                          👍 {r.votesUp}
                        </button>
                        <button onClick={() => vote(r.id, 'down')} style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '6px 12px', borderRadius: 20, border: '1.5px solid', borderColor: myVote === 'down' ? '#EF4444' : '#E5E7EB', background: myVote === 'down' ? '#FFF5F5' : '#fff', cursor: 'pointer', fontSize: 12, fontWeight: 700, color: myVote === 'down' ? '#EF4444' : '#6B7280', fontFamily: 'inherit' }}>
                          👎 {r.votesDown}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div style={{ display: 'flex', background: '#fff', borderTop: '1px solid #F3F4F6', padding: '8px 0 8px', position: 'sticky', bottom: 0, zIndex: 30 }}>
        {tabs.map(tab => (
          <button key={tab.id} onClick={() => navigate(tab.path)} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, border: 'none', background: 'transparent', cursor: 'pointer', padding: '4px 0', color: tab.id === 'communaute' ? '#6366F1' : '#9CA3AF', fontFamily: 'inherit' }}>
            {tab.icon}
            <span style={{ fontSize: 10, fontWeight: 600 }}>{tab.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
