import { useState, useEffect } from 'react';
import { useAuth } from '../App';
import toast from 'react-hot-toast';

const REPORT_API = import.meta.env.VITE_REPORT_API_URL || 'http://localhost:8082';
const AUTH_API   = import.meta.env.VITE_AUTH_API_URL   || 'http://localhost:8080';

const CAT_MAP: Record<string, { label: string; color: string }> = {
  STEP:     { label: 'Marche',       color: '#F97316' },
  RAMP:     { label: 'Rampe',        color: '#4B55E8' },
  ELEVATOR: { label: 'Ascenseur',    color: '#22C55E' },
  SIDEWALK: { label: 'Trottoir',     color: '#06B6D4' },
  SIGNAGE:  { label: 'Signalétique', color: '#E879A0' },
  PARKING:  { label: 'Parking',      color: '#9CA3AF' },
};

export default function ProfilePage() {
  const { displayName, userId, logout } = useAuth();
  const [reports, setReports]       = useState<any[]>([]);
  const [loading, setLoading]       = useState(true);
  const [tab, setTab]               = useState<'stats'|'settings'>('stats');
  const [joinDate]                  = useState(() => localStorage.getItem('joinDate') || new Date().toISOString().split('T')[0]);

  // Changer mot de passe
  const [oldPwd,  setOldPwd]  = useState('');
  const [newPwd,  setNewPwd]  = useState('');
  const [newPwd2, setNewPwd2] = useState('');
  const [pwdLoading, setPwdLoading] = useState(false);
  const [showPwdForm, setShowPwdForm] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem('joinDate')) {
      localStorage.setItem('joinDate', new Date().toISOString().split('T')[0]);
    }
  }, []);

  useEffect(() => {
    if (!userId) { setLoading(false); return; }
    const token = localStorage.getItem('accessToken');
    fetch(`${REPORT_API}/api/reports/user/${userId}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(r => r.ok ? r.json() : [])
      .then(data => { setReports(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, [userId]);

  const totalVotesUp   = reports.reduce((s, r) => s + (r.votesUp   || 0), 0);
  const totalVotesDown = reports.reduce((s, r) => s + (r.votesDown || 0), 0);
  const catCounts = reports.reduce((acc: Record<string,number>, r) => {
    acc[r.category] = (acc[r.category] || 0) + 1; return acc;
  }, {});
  const topCats   = Object.entries(catCounts).sort((a,b) => b[1]-a[1]).slice(0,3);
  const pending   = reports.filter(r => r.status === 'PENDING').length;
  const validated = reports.filter(r => r.status === 'VALIDATED').length;

  const handleChangePwd = async () => {
    if (!newPwd || !oldPwd) { toast.error('Remplissez tous les champs'); return; }
    if (newPwd !== newPwd2) { toast.error('Les mots de passe ne correspondent pas'); return; }
    if (newPwd.length < 6)  { toast.error('Minimum 6 caractères'); return; }
    setPwdLoading(true);
    try {
      const token = localStorage.getItem('accessToken');
      const res = await fetch(`${AUTH_API}/api/auth/change-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ oldPassword: oldPwd, newPassword: newPwd })
      });
      if (!res.ok) throw new Error('Mot de passe actuel incorrect');
      toast.success('Mot de passe modifié ✅');
      setOldPwd(''); setNewPwd(''); setNewPwd2(''); setShowPwdForm(false);
    } catch (e: any) { toast.error(e.message); }
    setPwdLoading(false);
  };

  const S = {
    page:    { minHeight:'100dvh', background:'#07071A', fontFamily:"'Plus Jakarta Sans',system-ui,sans-serif", paddingBottom:80 },
    avatar:  { width:64, height:64, borderRadius:'50%', background:'linear-gradient(135deg,#4B55E8,#818CF8)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:26, fontWeight:700, color:'white', flexShrink:0 },
    card:    { background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.07)', borderRadius:16, padding:16, marginBottom:12 },
    tabBtn:  (on: boolean) => ({ flex:1, padding:'10px', border:'none', borderRadius:12, background: on ? '#4B55E8' : 'rgba(255,255,255,0.05)', color: on ? 'white' : 'rgba(240,242,255,0.4)', fontWeight:600, fontSize:13, cursor:'pointer', fontFamily:'inherit', transition:'all 0.15s' }),
    stat:    (c: string)   => ({ flex:1, background:`${c}11`, border:`1px solid ${c}33`, borderRadius:14, padding:'14px 12px', textAlign:'center' as const }),
    statNum: (c: string)   => ({ fontSize:26, fontWeight:800, color:c }),
    statLbl: { fontSize:11, color:'rgba(240,242,255,0.4)', marginTop:2 },
    input:   { width:'100%', padding:'11px 14px', borderRadius:10, border:'1px solid rgba(255,255,255,0.1)', background:'rgba(255,255,255,0.05)', color:'#F0F2FF', fontSize:14, fontFamily:'inherit', outline:'none', marginBottom:10 },
    settingRow: { display:'flex', alignItems:'center', justifyContent:'space-between', padding:'14px 0', borderBottom:'1px solid rgba(255,255,255,0.05)' } as const,
  };

  return (
    <div style={S.page}>
      {/* Header */}
      <div style={{ padding:'52px 20px 20px', borderBottom:'1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ display:'flex', alignItems:'center', gap:16 }}>
          <div style={S.avatar}>{displayName?.[0]?.toUpperCase() ?? 'U'}</div>
          <div>
            <p style={{ color:'#F0F2FF', fontSize:18, fontWeight:700, margin:0 }}>{displayName ?? 'Utilisateur'}</p>
            <span style={{ background:'rgba(75,85,232,0.2)', color:'#818CF8', fontSize:11, fontWeight:700, padding:'3px 10px', borderRadius:20, display:'inline-block', marginTop:4 }}>
              Contributeur
            </span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display:'flex', gap:8, padding:'16px 20px 4px' }}>
        <button style={S.tabBtn(tab==='stats')}    onClick={() => setTab('stats')}>📊 Statistiques</button>
        <button style={S.tabBtn(tab==='settings')} onClick={() => setTab('settings')}>⚙️ Paramètres</button>
      </div>

      <div style={{ padding:'12px 20px' }}>

        {/* ── STATS ──────────────────────────────────────────────────────── */}
        {tab === 'stats' && (
          loading ? (
            <div style={{ textAlign:'center', padding:40, color:'rgba(240,242,255,0.3)', fontSize:14 }}>Chargement...</div>
          ) : (
            <>
              {/* Date d'inscription */}
              <div style={{ ...S.card, display:'flex', alignItems:'center', gap:12, marginBottom:12 }}>
                <div style={{ width:36, height:36, borderRadius:10, background:'rgba(75,85,232,0.15)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                  <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="#818CF8" strokeWidth={2}><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>
                </div>
                <div>
                  <p style={{ color:'rgba(240,242,255,0.35)', fontSize:11, fontWeight:700, textTransform:'uppercase', letterSpacing:'1px', margin:0 }}>Membre depuis</p>
                  <p style={{ color:'#F0F2FF', fontSize:14, fontWeight:600, margin:'2px 0 0' }}>
                    {new Date(joinDate).toLocaleDateString('fr-FR', { day:'2-digit', month:'long', year:'numeric' })}
                  </p>
                </div>
              </div>

              {/* Compteurs */}
              <div style={{ display:'flex', gap:10, marginBottom:12 }}>
                <div style={S.stat('#4B55E8')}>
                  <div style={S.statNum('#818CF8')}>{reports.length}</div>
                  <div style={S.statLbl}>Signalements</div>
                </div>
                <div style={S.stat('#22C55E')}>
                  <div style={S.statNum('#22C55E')}>{totalVotesUp}</div>
                  <div style={S.statLbl}>Votes 👍</div>
                </div>
                <div style={S.stat('#EF4444')}>
                  <div style={S.statNum('#EF4444')}>{totalVotesDown}</div>
                  <div style={S.statLbl}>Votes 👎</div>
                </div>
              </div>

              {/* Statuts */}
              <div style={{ display:'flex', gap:10, marginBottom:12 }}>
                <div style={S.stat('#F59E0B')}>
                  <div style={S.statNum('#F59E0B')}>{pending}</div>
                  <div style={S.statLbl}>En attente</div>
                </div>
                <div style={S.stat('#22C55E')}>
                  <div style={S.statNum('#22C55E')}>{validated}</div>
                  <div style={S.statLbl}>Validés</div>
                </div>
              </div>

              {/* Top catégories */}
              {topCats.length > 0 && (
                <div style={S.card}>
                  <p style={{ color:'rgba(240,242,255,0.4)', fontSize:11, fontWeight:700, textTransform:'uppercase', letterSpacing:'1.5px', marginBottom:14 }}>Top catégories</p>
                  {topCats.map(([cat, count]) => {
                    const c = CAT_MAP[cat] || { label: cat, color: '#4B55E8' };
                    const pct = Math.round((count / reports.length) * 100);
                    return (
                      <div key={cat} style={{ marginBottom:12 }}>
                        <div style={{ display:'flex', justifyContent:'space-between', marginBottom:5 }}>
                          <span style={{ color:c.color, fontSize:13, fontWeight:600 }}>{c.label}</span>
                          <span style={{ color:'rgba(240,242,255,0.4)', fontSize:12 }}>{count} ({pct}%)</span>
                        </div>
                        <div style={{ height:4, background:'rgba(255,255,255,0.07)', borderRadius:4, overflow:'hidden' }}>
                          <div style={{ width:`${pct}%`, height:'100%', background:c.color, borderRadius:4 }}/>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {reports.length === 0 && (
                <div style={{ textAlign:'center', padding:'20px 0', color:'rgba(240,242,255,0.3)', fontSize:14 }}>
                  Créez votre premier signalement pour voir vos stats !
                </div>
              )}
            </>
          )
        )}

        {/* ── PARAMÈTRES ─────────────────────────────────────────────────── */}
        {tab === 'settings' && (
          <div style={S.card}>
            {/* Changer mot de passe */}
            <div style={S.settingRow}>
              <div>
                <p style={{ color:'#F0F2FF', fontSize:14, fontWeight:600, margin:0 }}>Mot de passe</p>
                <p style={{ color:'rgba(240,242,255,0.4)', fontSize:12, margin:'2px 0 0' }}>Modifier votre mot de passe</p>
              </div>
              <button onClick={() => setShowPwdForm(!showPwdForm)} style={{ background:'rgba(75,85,232,0.15)', border:'1px solid rgba(75,85,232,0.3)', borderRadius:8, color:'#818CF8', fontSize:12, fontWeight:600, padding:'6px 12px', cursor:'pointer', fontFamily:'inherit' }}>
                {showPwdForm ? 'Annuler' : 'Modifier'}
              </button>
            </div>

            {showPwdForm && (
              <div style={{ paddingTop:12 }}>
                <input type="password" placeholder="Mot de passe actuel" value={oldPwd}  onChange={e => setOldPwd(e.target.value)}  style={S.input}/>
                <input type="password" placeholder="Nouveau mot de passe" value={newPwd}  onChange={e => setNewPwd(e.target.value)}  style={S.input}/>
                <input type="password" placeholder="Confirmer le nouveau" value={newPwd2} onChange={e => setNewPwd2(e.target.value)} style={{ ...S.input, marginBottom:14 }}/>
                <button onClick={handleChangePwd} disabled={pwdLoading} style={{ width:'100%', padding:'12px', background:'#4B55E8', border:'none', borderRadius:10, color:'white', fontSize:14, fontWeight:600, cursor:'pointer', fontFamily:'inherit', opacity: pwdLoading ? 0.6 : 1 }}>
                  {pwdLoading ? 'Modification...' : 'Confirmer'}
                </button>
              </div>
            )}

            {/* Version */}
            <div style={{ ...S.settingRow, borderBottom:'none' }}>
              <div>
                <p style={{ color:'#F0F2FF', fontSize:14, fontWeight:600, margin:0 }}>Version</p>
                <p style={{ color:'rgba(240,242,255,0.4)', fontSize:12, margin:'2px 0 0' }}>AccessMap v1.0.0</p>
              </div>
            </div>

            {/* Déconnexion */}
            <div style={{ paddingTop:8 }}>
              <button onClick={logout} style={{ width:'100%', padding:14, background:'rgba(239,68,68,0.1)', border:'1px solid rgba(239,68,68,0.3)', borderRadius:12, color:'#EF4444', fontSize:14, fontWeight:600, cursor:'pointer', fontFamily:'inherit' }}>
                Se déconnecter
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
