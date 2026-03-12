import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../App';
import { CAT_MAP } from '../constants/categories';
import { useAddress } from '../hooks/useAddress';
import toast from 'react-hot-toast';

const REPORT_API = import.meta.env.VITE_REPORT_API_URL || 'http://localhost:8082';

const STATUS_MAP: Record<string, { label: string; color: string }> = {
  PENDING:   { label: 'En attente', color: '#F59E0B' },
  VALIDATED: { label: 'Validé',     color: '#22C55E' },
  REJECTED:  { label: 'Rejeté',     color: '#EF4444' },
};

const IconThumbUp = () => (
  <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path d="M14 9V5a3 3 0 00-3-3l-4 9v11h11.28a2 2 0 002-1.7l1.38-9a2 2 0 00-2-2.3H14z"/>
    <path d="M7 22H4a2 2 0 01-2-2v-7a2 2 0 012-2h3"/>
  </svg>
);
const IconThumbDown = () => (
  <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path d="M10 15v4a3 3 0 003 3l4-9V2H5.72a2 2 0 00-2 1.7l-1.38 9a2 2 0 002 2.3H10z"/>
    <path d="M17 2h2.67A2.31 2.31 0 0122 4v7a2.31 2.31 0 01-2.33 2H17"/>
  </svg>
);
const IconPin = () => (
  <svg width="11" height="11" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
  </svg>
);

function ReportItem({ r, userId, onVote, voting }: { r: any; userId: string | null; onVote: (id: string, type: 'UP'|'DOWN') => void; voting: string | null }) {
  const cat     = CAT_MAP[r.category] || { label: r.category, color: '#818CF8' };
  const status  = STATUS_MAP[r.status] || { label: r.status, color: '#9CA3AF' };
  const address = useAddress(r.latitude, r.longitude);
  const isOwner = r.createdBy === userId;

  const diff = Date.now() - new Date(r.createdAt).getTime();
  const h = Math.floor(diff / 3600000);
  const d = Math.floor(h / 24);
  const ago = d > 0 ? `il y a ${d}j` : h > 0 ? `il y a ${h}h` : 'à l instant';

  return (
    <div style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.07)', borderRadius:16, padding:16, marginBottom:12 }}>
      {/* Header */}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:10 }}>
        <span style={{ background:cat.color+'22', color:cat.color, fontSize:11, fontWeight:700, padding:'4px 10px', borderRadius:20, border:`1px solid ${cat.color}44` }}>
          {cat.label}
        </span>
        <div style={{ display:'flex', alignItems:'center', gap:8 }}>
          <span style={{ color:status.color, fontSize:11, fontWeight:600 }}>{status.label}</span>
          <span style={{ color:'rgba(240,242,255,0.25)', fontSize:11 }}>{ago}</span>
        </div>
      </div>

      {/* Description */}
      {r.description && (
        <p style={{ color:'#F0F2FF', fontSize:14, margin:'0 0 10px', lineHeight:1.5 }}>{r.description}</p>
      )}

      {/* Photo */}
      {r.photoUrl && (
        <img src={r.photoUrl} alt="Photo" style={{ width:'100%', borderRadius:10, marginBottom:10, objectFit:'cover', maxHeight:180 }}/>
      )}

      {/* Adresse réelle */}
      <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom:10 }}>
        <span style={{ color:'#4B55E8' }}><IconPin/></span>
        <span style={{ color:'rgba(240,242,255,0.4)', fontSize:12 }}>{address}</span>
      </div>

      {/* Votes */}
      <div style={{ display:'flex', justifyContent:'flex-end', gap:8 }}>
        <button
          onClick={() => onVote(r.id, 'UP')}
          disabled={!!voting || isOwner}
          style={{ display:'flex', alignItems:'center', gap:5, padding:'6px 12px', borderRadius:20, border:'1px solid rgba(34,197,94,0.3)', background:'rgba(34,197,94,0.08)', color: isOwner ? 'rgba(255,255,255,0.2)' : '#22C55E', fontSize:12, fontWeight:600, cursor: isOwner ? 'not-allowed' : 'pointer', fontFamily:'inherit' }}
        >
          <IconThumbUp/> {r.votesUp || 0}
        </button>
        <button
          onClick={() => onVote(r.id, 'DOWN')}
          disabled={!!voting || isOwner}
          style={{ display:'flex', alignItems:'center', gap:5, padding:'6px 12px', borderRadius:20, border:'1px solid rgba(239,68,68,0.3)', background:'rgba(239,68,68,0.08)', color: isOwner ? 'rgba(255,255,255,0.2)' : '#EF4444', fontSize:12, fontWeight:600, cursor: isOwner ? 'not-allowed' : 'pointer', fontFamily:'inherit' }}
        >
          <IconThumbDown/> {r.votesDown || 0}
        </button>
      </div>

      {isOwner && (
        <p style={{ color:'rgba(240,242,255,0.2)', fontSize:10, textAlign:'right', marginTop:4 }}>Votre signalement</p>
      )}
    </div>
  );
}

export default function CommunityPage() {
  const { userId } = useAuth();
  const navigate   = useNavigate();
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter,  setFilter]  = useState('ALL');
  const [voting,  setVoting]  = useState<string | null>(null);

  useEffect(() => {
    fetch(`${REPORT_API}/api/reports?status=VALIDATED`)
      .then(r => r.ok ? r.json() : [])
      .then(data => { const arr = Array.isArray(data) ? data : data.content || []; setReports(arr.filter((r:any) => r.status === 'VALIDATED')); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const handleVote = async (id: string, type: 'UP' | 'DOWN') => {
    if (!userId) { toast.error('Connectez-vous pour voter'); return; }
    setVoting(id + type);
    try {
      await fetch(`${REPORT_API}/api/reports/${id}/vote?userId=${userId}&type=${type}`, { method:'POST' });
      setReports(prev => prev.map(r => r.id === id ? {
        ...r,
        votesUp:   type === 'UP'   ? (r.votesUp   || 0) + 1 : r.votesUp,
        votesDown: type === 'DOWN' ? (r.votesDown || 0) + 1 : r.votesDown,
      } : r));
    } catch { toast.error('Erreur vote'); }
    setVoting(null);
  };

  const filtered = filter === 'ALL' ? reports : reports.filter(r => r.category === filter);

  const filters = [
    { id:'ALL', label:'Tous', color:'#818CF8' },
    ...Object.keys(CAT_MAP).map(id => ({ id, label: CAT_MAP[id].label, color: CAT_MAP[id].color }))
  ];

  return (
    <div style={{ minHeight:'100dvh', background:'#07071A', fontFamily:"'Plus Jakarta Sans',system-ui,sans-serif", paddingBottom:80 }}>
      {/* Header */}
      <div style={{ padding:'52px 20px 16px', borderBottom:'1px solid rgba(255,255,255,0.06)' }}>
        <h1 style={{ color:'#F0F2FF', fontSize:22, fontWeight:700, margin:'0 0 4px' }}>Communauté</h1>
        <p style={{ color:'rgba(240,242,255,0.35)', fontSize:13, margin:0 }}>{reports.length} signalement{reports.length !== 1 ? 's' : ''}</p>
      </div>

      {/* Filtres */}
      <div style={{ padding:'12px 0 0', borderBottom:'1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ display:'flex', gap:8, overflowX:'auto', scrollbarWidth:'none', padding:'0 20px 12px' }}>
          {filters.map(f => (
            <button key={f.id} onClick={() => setFilter(f.id)} style={{ flexShrink:0, padding:'6px 14px', borderRadius:20, border:'none', cursor:'pointer', fontSize:12, fontWeight:600, fontFamily:'inherit', background: filter===f.id ? f.color : 'rgba(255,255,255,0.06)', color: filter===f.id ? 'white' : 'rgba(240,242,255,0.4)', transition:'all 0.15s' }}>
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Liste */}
      <div style={{ padding:'16px 20px' }}>
        {loading && (
          <div style={{ display:'flex', justifyContent:'center', padding:60 }}>
            <div style={{ width:32, height:32, border:'3px solid rgba(75,85,232,0.2)', borderTopColor:'#4B55E8', borderRadius:'50%', animation:'spin 0.8s linear infinite' }}/>
          </div>
        )}
        {!loading && filtered.length === 0 && (
          <p style={{ color:'rgba(240,242,255,0.3)', textAlign:'center', padding:40 }}>Aucun signalement</p>
        )}
        {!loading && filtered.map(r => (
          <ReportItem key={r.id} r={r} userId={userId} onVote={handleVote} voting={voting}/>
        ))}
      </div>

      {/* FAB */}
      <button onClick={() => navigate('/report/new')}
        style={{ position:'fixed', bottom:86, right:16, width:52, height:52, borderRadius:'50%', background:'#4B55E8', border:'none', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 4px 20px rgba(75,85,232,0.45)', zIndex:1000 }}
        onMouseEnter={e => (e.currentTarget.style.transform='scale(1.08)')}
        onMouseLeave={e => (e.currentTarget.style.transform='scale(1)')}>
        <svg viewBox="0 0 20 20" fill="none" stroke="white" strokeWidth={2.5} strokeLinecap="round" width={20} height={20}><line x1="10" y1="4" x2="10" y2="16"/><line x1="4" y1="10" x2="16" y2="10"/></svg>
      </button>
    </div>
  );
}
