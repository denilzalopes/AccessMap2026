import { useState, useEffect } from 'react';

const REPORT_API = import.meta.env.VITE_REPORT_API_URL || 'http://localhost:8082';

const CAT_MAP: Record<string, { label: string; color: string; icon: string }> = {
  STEP:     { label: 'Marche',       color: '#F97316', icon: '🪜' },
  RAMP:     { label: 'Rampe',        color: '#4B55E8', icon: '↗️' },
  ELEVATOR: { label: 'Ascenseur',    color: '#22C55E', icon: '🛗' },
  SIDEWALK: { label: 'Trottoir',     color: '#06B6D4', icon: '🚶' },
  SIGNAGE:  { label: 'Signalétique', color: '#E879A0', icon: '⚠️' },
  PARKING:  { label: 'Parking',      color: '#9CA3AF', icon: '🅿️' },
};

export default function CommunityPage() {
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');

  useEffect(() => {
    fetch(`${REPORT_API}/api/reports`)
      .then(r => { if (!r.ok) throw new Error(); return r.json(); })
      .then(data => { setReports(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const filtered = filter === 'ALL' ? reports : reports.filter(r => r.category === filter);
  const sorted = [...filtered].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return (
    <div style={{ minHeight: '100dvh', background: '#07071A', fontFamily: "\'Plus Jakarta Sans\',system-ui,sans-serif", paddingBottom: 80 }}>
      <div style={{ padding: '52px 20px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <h1 style={{ color: '#F0F2FF', fontSize: 22, fontWeight: 700, margin: '0 0 4px' }}>Communauté</h1>
        <p style={{ color: 'rgba(240,242,255,0.35)', fontSize: 13, margin: 0 }}>{reports.length} signalement{reports.length !== 1 ? 's' : ''} partagé{reports.length !== 1 ? 's' : ''}</p>
      </div>

      {/* Filtres */}
      <div style={{ display: 'flex', gap: 8, padding: '12px 20px', overflowX: 'auto', scrollbarWidth: 'none' }}>
        {[{ id: 'ALL', label: 'Tous', color: '#4B55E8' }, ...Object.entries(CAT_MAP).map(([id, v]) => ({ id, label: v.label, color: v.color }))].map(f => (
          <button key={f.id} onClick={() => setFilter(f.id)} style={{ flexShrink: 0, padding: '6px 14px', borderRadius: 20, border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 600, fontFamily: 'inherit', background: filter === f.id ? f.color : 'rgba(255,255,255,0.06)', color: filter === f.id ? 'white' : 'rgba(240,242,255,0.4)', transition: 'all 0.15s' }}>
            {f.label}
          </button>
        ))}
      </div>

      {loading && (
        <div style={{ display: 'flex', justifyContent: 'center', padding: 60 }}>
          <div style={{ color: 'rgba(240,242,255,0.4)', fontSize: 14 }}>Chargement...</div>
        </div>
      )}

      {!loading && sorted.length === 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '60px 20px', gap: 12 }}>
          <div style={{ width: 64, height: 64, borderRadius: 20, background: 'rgba(75,85,232,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="32" height="32" fill="none" viewBox="0 0 24 24"><path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" stroke="#4B55E8" strokeWidth="2" strokeLinecap="round"/></svg>
          </div>
          <p style={{ color: 'rgba(240,242,255,0.5)', fontSize: 15, textAlign: 'center', margin: 0 }}>Aucun signalement pour cette catégorie</p>
        </div>
      )}

      {!loading && sorted.length > 0 && (
        <div style={{ padding: '8px 20px' }}>
          {sorted.map((r: any) => {
            const cat = CAT_MAP[r.category] || { label: r.category, color: '#4B55E8', icon: '📍' };
            const ago = (() => {
              const diff = Date.now() - new Date(r.createdAt).getTime();
              const h = Math.floor(diff / 3600000);
              const d = Math.floor(h / 24);
              if (d > 0) return `il y a ${d}j`;
              if (h > 0) return `il y a ${h}h`;
              return 'à l\u2019instant';
            })();
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
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: 'rgba(240,242,255,0.3)', fontSize: 11 }}>
                    📍 {r.latitude?.toFixed(4)}, {r.longitude?.toFixed(4)}
                  </span>
                  <div style={{ display: 'flex', gap: 10 }}>
                    <span style={{ color: 'rgba(240,242,255,0.3)', fontSize: 11 }}>👍 {r.votesUp || 0}</span>
                    <span style={{ color: 'rgba(240,242,255,0.3)', fontSize: 11 }}>👎 {r.votesDown || 0}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
