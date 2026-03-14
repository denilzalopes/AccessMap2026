import { useState, useEffect } from 'react';
import { useAuth } from '../App';
import { CAT_MAP } from '../constants/categories';
import toast from 'react-hot-toast';

const REPORT_API = import.meta.env.VITE_REPORT_API_URL || 'http://localhost:8082';

export default function AdminPage() {
  const { role } = useAuth();
  const [reports, setReports]   = useState<any[]>([]);
  const [loading, setLoading]   = useState(true);
  const [actionId, setActionId] = useState<string | null>(null);

  useEffect(() => {
    if (role !== 'ADMIN' && role !== 'MODERATOR') { setLoading(false); return; }
    fetch(`${REPORT_API}/api/reports/pending?requesterRole=${role}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
    })
      .then(r => r.ok ? r.json() : [])
      .then(data => { setReports(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, [role]);

  const handleAction = async (id: string, status: 'VALIDATED' | 'REJECTED') => {
    setActionId(id + status);
    try {
      const res = await fetch(
        `${REPORT_API}/api/reports/${id}/status?status=${status}&requesterRole=${role}`,
        { method: 'PATCH', headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` } }
      );
      if (!res.ok) throw new Error();
      setReports(prev => prev.filter(r => r.id !== id));
      toast.success(status === 'VALIDATED' ? 'Signalement validé ✅' : 'Signalement rejeté');
    } catch {
      toast.error('Erreur lors de la modération');
    }
    setActionId(null);
  };

  if (role !== 'ADMIN' && role !== 'MODERATOR') {
    return (
      <div style={{ minHeight: '100dvh', background: '#07071A', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Plus Jakarta Sans',system-ui,sans-serif" }}>
        <p style={{ color: '#EF4444', fontSize: 16 }}>Accès refusé</p>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100dvh', background: '#07071A', fontFamily: "'Plus Jakarta Sans',system-ui,sans-serif", paddingBottom: 80 }}>
      <div style={{ padding: '52px 20px 20px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 4 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(239,68,68,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="#EF4444" strokeWidth={2}>
              <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
            </svg>
          </div>
          <h1 style={{ color: '#F0F2FF', fontSize: 22, fontWeight: 700, margin: 0 }}>Modération</h1>
        </div>
        <p style={{ color: 'rgba(240,242,255,0.35)', fontSize: 13, margin: 0 }}>
          {reports.length} signalement{reports.length !== 1 ? 's' : ''} en attente
        </p>
      </div>

      {loading && (
        <div style={{ display: 'flex', justifyContent: 'center', padding: 60 }}>
          <div style={{ width: 36, height: 36, border: '3px solid rgba(75,85,232,0.2)', borderTopColor: '#4B55E8', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
        </div>
      )}

      {!loading && reports.length === 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '60px 20px', gap: 12 }}>
          <div style={{ width: 64, height: 64, borderRadius: 20, background: 'rgba(34,197,94,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="#22C55E" strokeWidth={2}><path d="M5 13l4 4L19 7"/></svg>
          </div>
          <p style={{ color: 'rgba(240,242,255,0.5)', fontSize: 15 }}>Aucun signalement en attente</p>
          <p style={{ color: 'rgba(240,242,255,0.25)', fontSize: 13 }}>Tous les signalements ont été traités</p>
        </div>
      )}

      {!loading && reports.length > 0 && (
        <div style={{ padding: '16px 20px' }}>
          {reports.map((r: any) => {
            const cat = CAT_MAP[r.category] || { label: r.category, color: '#4B55E8' };
            return (
              <div key={r.id} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: 16, marginBottom: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                  <span style={{ background: cat.color + '22', color: cat.color, fontSize: 11, fontWeight: 700, padding: '4px 10px', borderRadius: 20, border: `1px solid ${cat.color}44` }}>
                    {cat.label}
                  </span>
                  <span style={{ color: 'rgba(240,242,255,0.25)', fontSize: 11 }}>
                    {new Date(r.createdAt).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </span>
                </div>

                {/* ── Titre ── */}
                {r.title && (
                  <p style={{ color: '#F0F2FF', fontSize: 15, fontWeight: 600, margin: '0 0 6px' }}>{r.title}</p>
                )}

                {r.description && (
                  <p style={{ color: 'rgba(240,242,255,0.7)', fontSize: 14, margin: '0 0 10px', lineHeight: 1.5 }}>{r.description}</p>
                )}

                {r.imageUrl && (
                  <img src={r.imageUrl} alt="Photo" style={{ width: '100%', borderRadius: 10, marginBottom: 10, objectFit: 'cover', maxHeight: 200 }} />
                )}

                {/* ── Auteur ── */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', background: 'rgba(75,85,232,0.08)', border: '1px solid rgba(75,85,232,0.15)', borderRadius: 10, marginBottom: 12 }}>
                  <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'linear-gradient(135deg,#4B55E8,#818CF8)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: 'white', flexShrink: 0 }}>
                    {(r.authorName || 'A')[0].toUpperCase()}
                  </div>
                  <div>
                    <p style={{ color: '#818CF8', fontSize: 13, fontWeight: 600, margin: 0 }}>{r.authorName || 'Anonyme'}</p>
                    {r.authorEmail && <p style={{ color: 'rgba(240,242,255,0.3)', fontSize: 11, margin: 0 }}>{r.authorEmail}</p>}
                  </div>
                </div>

                <div style={{ color: 'rgba(240,242,255,0.3)', fontSize: 11, marginBottom: 14 }}>
                  📍 {r.latitude?.toFixed(5)}, {r.longitude?.toFixed(5)}
                </div>

                <div style={{ display: 'flex', gap: 10 }}>
                  <button
                    onClick={() => handleAction(r.id, 'VALIDATED')}
                    disabled={!!actionId}
                    style={{ flex: 1, padding: '11px', border: 'none', borderRadius: 12, background: 'rgba(34,197,94,0.15)', color: '#22C55E', fontSize: 14, fontWeight: 700, cursor: actionId ? 'not-allowed' : 'pointer', fontFamily: 'inherit', opacity: actionId && actionId !== r.id + 'VALIDATED' ? 0.5 : 1 }}
                  >
                    {actionId === r.id + 'VALIDATED' ? '...' : '✅ Valider'}
                  </button>
                  <button
                    onClick={() => handleAction(r.id, 'REJECTED')}
                    disabled={!!actionId}
                    style={{ flex: 1, padding: '11px', border: 'none', borderRadius: 12, background: 'rgba(239,68,68,0.1)', color: '#EF4444', fontSize: 14, fontWeight: 700, cursor: actionId ? 'not-allowed' : 'pointer', fontFamily: 'inherit', opacity: actionId && actionId !== r.id + 'REJECTED' ? 0.5 : 1 }}
                  >
                    {actionId === r.id + 'REJECTED' ? '...' : '❌ Rejeter'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
