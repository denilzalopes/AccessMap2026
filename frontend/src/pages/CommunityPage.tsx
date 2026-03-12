import { useState, useEffect } from 'react';
import { useAuth } from '../App';
import toast from 'react-hot-toast';

const REPORT_API = import.meta.env.VITE_REPORT_API_URL || 'http://localhost:8082';

const CAT_MAP: Record<string, { label: string; color: string }> = {
  STEP:     { label: 'Marche',       color: '#F97316' },
  RAMP:     { label: 'Rampe',        color: '#4B55E8' },
  ELEVATOR: { label: 'Ascenseur',    color: '#22C55E' },
  SIDEWALK: { label: 'Trottoir',     color: '#06B6D4' },
  SIGNAGE:  { label: 'Signalétique', color: '#E879A0' },
  PARKING:  { label: 'Parking',      color: '#9CA3AF' },
};

export default function CommunityPage() {
  const { userId } = useAuth();
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter,  setFilter]  = useState('ALL');
  const [voting,  setVoting]  = useState<string | null>(null);

  useEffect(() => {
    fetch(`${REPORT_API}/api/reports`)
      .then(r => r.ok ? r.json() : [])
      .then(data => { setReports(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const handleVote = async (reportId: string, createdBy: string, type: 'UP' | 'DOWN') => {
    if (!userId) { toast.error('Connectez-vous pour voter'); return; }
    if (createdBy === userId) { toast.error('Vous ne pouvez pas voter pour votre propre signalement'); return; }
    setVoting(reportId + type);
    try {
      const token = localStorage.getItem('accessToken');
      const res = await fetch(
        `${REPORT_API}/api/reports/${reportId}/vote?userId=${userId}&type=${type}`,
        { method: 'POST', headers: { Authorization: `Bearer ${token}` } }
      );
      if (!res.ok) throw new Error();
      const updated = await res.json();
      setReports(prev => prev.map(r => r.id === reportId ? updated : r));
      toast.success(type === 'UP' ? 'Vote positif enregistré' : 'Vote negatif enregistré');
    } catch {
      toast.error('Erreur lors du vote');
    }
    setVoting(null);
  };

  const filtered = filter === 'ALL' ? reports : reports.filter(r => r.category === filter);
  const sorted   = [...filtered].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return (
    <div style={{ minHeight: '100dvh', background: '#07071A', fontFamily: "'Plus Jakarta Sans',system-ui,sans-serif", paddingBottom: 80 }}>
      <div style={{ padding: '52px 20px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <h1 style={{ color: '#F0F2FF', fontSize: 22, fontWeight: 700, margin: '0 0 4px' }}>Communauté</h1>
        <p style={{ color: 'rgba(240,242,255,0.35)', fontSize: 13, margin: 0 }}>
          {reports.length} signalement{reports.length !== 1 ? 's' : ''} partagé{reports.length !== 1 ? 's' : ''}
        </p>
      </div>

      <div style={{ display: 'flex', gap: 8, padding: '12px 20px', overflowX: 'auto', scrollbarWidth: 'none' }}>
        {[{ id: 'ALL', label: 'Tous', color: '#4B55E8' },
          ...Object.entries(CAT_MAP).map(([id, v]) => ({ id, label: v.label, color: v.color }))
        ].map(f => (
          <button key={f.id} onClick={() => setFilter(f.id)} style={{
            flexShrink: 0, padding: '6px 14px', borderRadius: 20, border: 'none', cursor: 'pointer',
            fontSize: 12, fontWeight: 600, fontFamily: 'inherit',
            background: filter === f.id ? f.color : 'rgba(255,255,255,0.06)',
            color:      filter === f.id ? 'white'  : 'rgba(240,242,255,0.4)',
            transition: 'all 0.15s'
          }}>{f.label}</button>
        ))}
      </div>

      {loading && (
        <div style={{ display: 'flex', justifyContent: 'center', padding: 60 }}>
          <div style={{ width: 36, height: 36, border: '3px solid rgba(75,85,232,0.2)', borderTopColor: '#4B55E8', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
        </div>
      )}

      {!loading && sorted.length === 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '60px 20px' }}>
          <p style={{ color: 'rgba(240,242,255,0.4)', fontSize: 15 }}>Aucun signalement pour cette catégorie</p>
        </div>
      )}

      {!loading && sorted.length > 0 && (
        <div style={{ padding: '8px 20px' }}>
          {sorted.map((r: any) => {
            const cat     = CAT_MAP[r.category] || { label: r.category, color: '#4B55E8' };
            const isOwner = r.createdBy === userId;
            const diff    = Date.now() - new Date(r.createdAt).getTime();
            const h       = Math.floor(diff / 3600000);
            const d       = Math.floor(h / 24);
            const ago     = d > 0 ? `il y a ${d}j` : h > 0 ? `il y a ${h}h` : 'à l instant';

            return (
              <div key={r.id} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: 16, marginBottom: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                  <span style={{ background: cat.color + '22', color: cat.color, fontSize: 11, fontWeight: 700, padding: '4px 10px', borderRadius: 20, border: `1px solid ${cat.color}44` }}>
                    {cat.label}
                  </span>
                  <span style={{ color: 'rgba(240,242,255,0.25)', fontSize: 11 }}>{ago}</span>
                </div>

                {r.description && (
                  <p style={{ color: '#F0F2FF', fontSize: 14, margin: '0 0 10px', lineHeight: 1.5 }}>{r.description}</p>
                )}
                {r.photoUrl && (
                  <img src={r.photoUrl} alt="Photo" style={{ width: '100%', borderRadius: 10, marginBottom: 10, objectFit: 'cover', maxHeight: 180 }} />
                )}

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 }}>
                  <span style={{ color: 'rgba(240,242,255,0.3)', fontSize: 11 }}>
                    {r.latitude?.toFixed(4)}, {r.longitude?.toFixed(4)}
                  </span>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button
                      onClick={() => handleVote(r.id, r.createdBy, 'UP')}
                      disabled={!!voting || isOwner}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 4,
                        padding: '5px 10px', borderRadius: 20,
                        border: '1px solid rgba(34,197,94,0.3)',
                        background: 'rgba(34,197,94,0.08)',
                        color: isOwner ? 'rgba(255,255,255,0.2)' : '#22C55E',
                        fontSize: 12, fontWeight: 600,
                        cursor: isOwner ? 'not-allowed' : 'pointer',
                        fontFamily: 'inherit', transition: 'all 0.15s'
                      }}
                    >
                      👍 {r.votesUp || 0}
                    </button>
                    <button
                      onClick={() => handleVote(r.id, r.createdBy, 'DOWN')}
                      disabled={!!voting || isOwner}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 4,
                        padding: '5px 10px', borderRadius: 20,
                        border: '1px solid rgba(239,68,68,0.3)',
                        background: 'rgba(239,68,68,0.08)',
                        color: isOwner ? 'rgba(255,255,255,0.2)' : '#EF4444',
                        fontSize: 12, fontWeight: 600,
                        cursor: isOwner ? 'not-allowed' : 'pointer',
                        fontFamily: 'inherit', transition: 'all 0.15s'
                      }}
                    >
                      👎 {r.votesDown || 0}
                    </button>
                  </div>
                </div>

                {isOwner && (
                  <p style={{ color: 'rgba(240,242,255,0.2)', fontSize: 10, textAlign: 'right', marginTop: 6 }}>
                    Votre signalement — vote désactivé
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
