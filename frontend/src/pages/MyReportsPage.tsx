import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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

const CATEGORIES = Object.entries(CAT_MAP).map(([id, v]) => ({ id, label: v.label }));

const STATUS_MAP: Record<string, { label: string; color: string }> = {
  PENDING:   { label: 'En attente', color: '#F59E0B' },
  VALIDATED: { label: 'Validé',     color: '#22C55E' },
  REJECTED:  { label: 'Rejeté',     color: '#EF4444' },
};

interface EditState {
  id: string;
  category: string;
  description: string;
  photoUrl: string;
}

export default function MyReportsPage() {
  const { userId } = useAuth();
  const navigate   = useNavigate();
  const [reports, setReports]       = useState<any[]>([]);
  const [loading, setLoading]       = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [editState, setEditState]   = useState<EditState | null>(null);
  const [saving, setSaving]         = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const token = localStorage.getItem('accessToken');

  const fetchReports = () => {
    if (!userId) { setLoading(false); return; }
    fetch(`${REPORT_API}/api/reports/user/${userId}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(r => r.ok ? r.json() : [])
      .then(data => { setReports(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => { setLoading(false); });
  };

  useEffect(() => { fetchReports(); }, [userId]);

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      const res = await fetch(`${REPORT_API}/api/reports/${id}?userId=${userId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok && res.status !== 204) throw new Error();
      setReports(prev => prev.filter(r => r.id !== id));
      toast.success('Signalement supprimé');
    } catch {
      toast.error('Erreur lors de la suppression');
    }
    setDeletingId(null);
    setConfirmDeleteId(null);
  };

  const handleSave = async () => {
    if (!editState) return;
    setSaving(true);
    try {
      const res = await fetch(`${REPORT_API}/api/reports/${editState.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          category:    editState.category,
          description: editState.description,
          photoUrl:    editState.photoUrl,
          latitude:    reports.find(r => r.id === editState.id)?.latitude,
          longitude:   reports.find(r => r.id === editState.id)?.longitude,
          createdBy:   userId,
        })
      });
      if (!res.ok) throw new Error();
      const updated = await res.json();
      setReports(prev => prev.map(r => r.id === editState.id ? updated : r));
      toast.success('Signalement modifié ✅');
      setEditState(null);
    } catch {
      toast.error('Erreur lors de la modification');
    }
    setSaving(false);
  };

  const S = {
    page:    { minHeight: '100dvh', background: '#07071A', fontFamily: "'Plus Jakarta Sans',system-ui,sans-serif", paddingBottom: 80 },
    header:  { padding: '52px 20px 20px', borderBottom: '1px solid rgba(255,255,255,0.06)' },
    h1:      { color: '#F0F2FF', fontSize: 22, fontWeight: 700, margin: 0 },
    count:   { color: 'rgba(240,242,255,0.35)', fontSize: 13, marginTop: 4 },
    card:    { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: 16, marginBottom: 12 },
    input:   { width: '100%', padding: '10px 14px', borderRadius: 10, border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.06)', color: '#F0F2FF', fontSize: 14, fontFamily: 'inherit', outline: 'none', marginBottom: 10 } as React.CSSProperties,
    select:  { width: '100%', padding: '10px 14px', borderRadius: 10, border: '1px solid rgba(255,255,255,0.1)', background: '#0F1030', color: '#F0F2FF', fontSize: 14, fontFamily: 'inherit', outline: 'none', marginBottom: 10 } as React.CSSProperties,
    btnEdit: { flex: 1, padding: '8px', border: '1px solid rgba(75,85,232,0.4)', borderRadius: 10, background: 'rgba(75,85,232,0.1)', color: '#818CF8', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' },
    btnDel:  { flex: 1, padding: '8px', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 10, background: 'rgba(239,68,68,0.08)', color: '#EF4444', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' },
  };

  return (
    <div style={S.page}>
      <div style={S.header}>
        <h1 style={S.h1}>Mes signalements</h1>
        {!loading && <p style={S.count}>{reports.length} signalement{reports.length !== 1 ? 's' : ''}</p>}
      </div>

      {loading && (
        <div style={{ display: 'flex', justifyContent: 'center', padding: 60 }}>
          <div style={{ width: 36, height: 36, border: '3px solid rgba(75,85,232,0.2)', borderTopColor: '#4B55E8', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
        </div>
      )}

      {!loading && reports.length === 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '60px 20px', gap: 16 }}>
          <div style={{ width: 64, height: 64, borderRadius: 20, background: 'rgba(75,85,232,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="32" height="32" fill="none" viewBox="0 0 24 24"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" stroke="#4B55E8" strokeWidth="2" strokeLinecap="round"/></svg>
          </div>
          <p style={{ color: 'rgba(240,242,255,0.5)', fontSize: 15, textAlign: 'center', margin: 0 }}>Aucun signalement pour l'instant</p>
          <button onClick={() => navigate('/report/new')} style={{ padding: '12px 24px', background: '#4B55E8', border: 'none', borderRadius: 12, color: 'white', fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
            Créer un signalement
          </button>
        </div>
      )}

      {!loading && reports.length > 0 && (
        <div style={{ padding: '16px 20px' }}>
          {[...reports]
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
            .map((r: any) => {
              const cat    = CAT_MAP[r.category] || { label: r.category, color: '#4B55E8' };
              const status = STATUS_MAP[r.status] || { label: r.status, color: '#9CA3AF' };
              const isEditing = editState?.id === r.id;

              return (
                <div key={r.id} style={S.card}>
                  {/* En-tête carte */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                    <span style={{ background: cat.color + '22', color: cat.color, fontSize: 11, fontWeight: 700, padding: '4px 10px', borderRadius: 20, border: `1px solid ${cat.color}44` }}>
                      {cat.label}
                    </span>
                    <span style={{ color: status.color, fontSize: 11, fontWeight: 600 }}>{status.label}</span>
                  </div>

                  {/* Mode édition */}
                  {isEditing ? (
                    <div>
                      <select
                        value={editState.category}
                        onChange={e => setEditState({ ...editState, category: e.target.value })}
                        style={S.select}
                      >
                        {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
                      </select>
                      <textarea
                        value={editState.description}
                        onChange={e => setEditState({ ...editState, description: e.target.value })}
                        placeholder="Description..."
                        rows={3}
                        style={{ ...S.input, resize: 'none' } as React.CSSProperties}
                      />
                      <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
                        <button onClick={() => setEditState(null)} style={{ ...S.btnDel, flex: 1 }}>Annuler</button>
                        <button onClick={handleSave} disabled={saving} style={{ ...S.btnEdit, flex: 2, opacity: saving ? 0.6 : 1 }}>
                          {saving ? 'Enregistrement...' : '✅ Sauvegarder'}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      {r.description && (
                        <p style={{ color: '#F0F2FF', fontSize: 14, margin: '0 0 10px', lineHeight: 1.5 }}>{r.description}</p>
                      )}
                      {r.photoUrl && (
                        <img src={r.photoUrl} alt="Photo" style={{ width: '100%', borderRadius: 10, marginBottom: 10, objectFit: 'cover', maxHeight: 160 }} />
                      )}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                        <span style={{ color: 'rgba(240,242,255,0.3)', fontSize: 11 }}>
                          {r.latitude?.toFixed(4)}, {r.longitude?.toFixed(4)}
                        </span>
                        <span style={{ color: 'rgba(240,242,255,0.25)', fontSize: 11 }}>
                          {new Date(r.createdAt).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })}
                        </span>
                      </div>

                      {/* Boutons action */}
                      {confirmDeleteId === r.id ? (
                        <div style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 12, padding: 12, textAlign: 'center' }}>
                          <p style={{ color: '#F0F2FF', fontSize: 13, marginBottom: 10 }}>Confirmer la suppression ?</p>
                          <div style={{ display: 'flex', gap: 8 }}>
                            <button onClick={() => setConfirmDeleteId(null)} style={{ ...S.btnEdit, flex: 1 }}>Non</button>
                            <button
                              onClick={() => handleDelete(r.id)}
                              disabled={deletingId === r.id}
                              style={{ ...S.btnDel, flex: 1, opacity: deletingId === r.id ? 0.6 : 1 }}
                            >
                              {deletingId === r.id ? '...' : 'Oui, supprimer'}
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div style={{ display: 'flex', gap: 8 }}>
                          <button
                            onClick={() => setEditState({ id: r.id, category: r.category, description: r.description || '', photoUrl: r.photoUrl || '' })}
                            style={S.btnEdit}
                          >
                            ✏️ Modifier
                          </button>
                          <button onClick={() => setConfirmDeleteId(r.id)} style={S.btnDel}>
                            🗑️ Supprimer
                          </button>
                        </div>
                      )}
                    </>
                  )}
                </div>
              );
            })}
        </div>
      )}
    </div>
  );
}
