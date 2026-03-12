import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../App';
import { getAddressOnce } from '../hooks/useAddress';
import { CAT_MAP, CAT_GROUPS } from '../constants/categories';
import toast from 'react-hot-toast';

const API_URL        = import.meta.env.VITE_REPORT_API_URL || 'http://localhost:8082';
const CLOUDINARY_CLOUD  = 'djp4phexi';
const CLOUDINARY_PRESET = 'accessmap_unsigned';

export default function ReportFormPage() {
  const { userId } = useAuth();
  const navigate   = useNavigate();

  const [category, setCategory]     = useState('');
  const [description, setDescription] = useState('');
  const [latitude, setLatitude]     = useState<number | null>(null);
  const [longitude, setLongitude]   = useState<number | null>(null);
  const [photoUrl, setPhotoUrl]     = useState('');
  const [address, setAddress]       = useState('');
  const [locationSearch, setLocationSearch] = useState('');
  const [locationResults, setLocationResults] = useState<any[]>([]);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [locating, setLocating]     = useState(false);
  const [step, setStep]             = useState<1|2|3>(1);

  // Géolocalisation auto
  const handleGeolocate = () => {
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      async pos => {
        setLatitude(pos.coords.latitude);
        setLongitude(pos.coords.longitude);
        const addr = await getAddressOnce(pos.coords.latitude, pos.coords.longitude);
        setAddress(addr);
        setLocating(false);
      },
      () => { toast.error('Impossible de vous localiser'); setLocating(false); }
    );
  };

  // Recherche lieu via Nominatim
  const searchLocation = async (q: string) => {
    setLocationSearch(q);
    if (q.length < 3) { setLocationResults([]); return; }
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q)}&format=json&limit=5&accept-language=fr&countrycodes=fr`
      );
      const data = await res.json();
      setLocationResults(data);
    } catch { setLocationResults([]); }
  };

  const selectLocation = (item: any) => {
    setLatitude(parseFloat(item.lat));
    setLongitude(parseFloat(item.lon));
    setAddress(item.display_name.split(',').slice(0,3).join(', '));
    setLocationSearch('');
    setLocationResults([]);
    toast.success('Lieu sélectionné');
  };

  // Upload photo Cloudinary
  const uploadPhoto = async (file: File) => {
    setUploadingPhoto(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      fd.append('upload_preset', CLOUDINARY_PRESET);
      const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD}/image/upload`, { method: 'POST', body: fd });
      const data = await res.json();
      setPhotoUrl(data.secure_url);
      toast.success('Photo ajoutée');
    } catch { toast.error('Erreur upload photo'); }
    setUploadingPhoto(false);
  };

  // Soumettre
  const handleSubmit = async () => {
    if (!category)  { toast.error('Choisissez une catégorie'); return; }
    if (!latitude)  { toast.error('Localisez le problème'); return; }
    if (!userId)    { toast.error('Connectez-vous'); return; }
    setSubmitting(true);
    try {
      const token = localStorage.getItem('accessToken');
      const res = await fetch(`${API_URL}/api/reports`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ category, description, latitude, longitude, createdBy: userId, photoUrl: photoUrl || null })
      });
      if (!res.ok) throw new Error();
      toast.success('Signalement créé !');
      navigate('/my-reports');
    } catch { toast.error('Erreur lors de la création'); }
    setSubmitting(false);
  };

  const S = {
    page:    { minHeight:'100dvh', background:'#07071A', fontFamily:"'Plus Jakarta Sans',system-ui,sans-serif", paddingBottom:80 },
    header:  { display:'flex', alignItems:'center', gap:12, padding:'52px 20px 16px', borderBottom:'1px solid rgba(255,255,255,0.06)' },
    back:    { width:36, height:36, borderRadius:12, border:'none', background:'rgba(255,255,255,0.07)', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 },
    section: { padding:'20px 20px 0' },
    label:   { color:'rgba(240,242,255,0.5)', fontSize:11, fontWeight:700, textTransform:'uppercase' as const, letterSpacing:'1px', marginBottom:10, display:'block' },
    input:   { width:'100%', padding:'12px 14px', borderRadius:12, border:'1px solid rgba(255,255,255,0.08)', background:'rgba(255,255,255,0.05)', color:'#F0F2FF', fontSize:14, fontFamily:'inherit', outline:'none' } as React.CSSProperties,
    catBtn:  (active: boolean, color: string) => ({ padding:'10px 14px', borderRadius:12, border:`1px solid ${active ? color : 'rgba(255,255,255,0.07)'}`, background: active ? color+'22' : 'rgba(255,255,255,0.03)', color: active ? color : 'rgba(240,242,255,0.5)', fontSize:13, fontWeight:600, cursor:'pointer', fontFamily:'inherit', display:'flex', alignItems:'center', gap:6, transition:'all 0.15s', flexShrink:0 } as React.CSSProperties),
    groupLabel: { color:'rgba(240,242,255,0.3)', fontSize:10, fontWeight:700, textTransform:'uppercase' as const, letterSpacing:'1.5px', margin:'12px 0 6px' },
  };

  return (
    <div style={S.page}>
      {/* Header */}
      <div style={S.header}>
        <button style={S.back} onClick={() => navigate(-1)}>
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="#F0F2FF" strokeWidth={2.5}><path d="M15 18l-6-6 6-6"/></svg>
        </button>
        <div>
          <h1 style={{ color:'#F0F2FF', fontSize:18, fontWeight:700, margin:0 }}>Nouveau signalement</h1>
          <p style={{ color:'rgba(240,242,255,0.35)', fontSize:12, margin:'2px 0 0' }}>Signalez un obstacle d'accessibilité</p>
        </div>
      </div>

      <div style={{ padding:'0 20px' }}>

        {/* ── ÉTAPE 1 : Catégorie ── */}
        <div style={S.section}>
          <span style={S.label}>1. Type d'obstacle</span>

          {Object.entries(CAT_GROUPS).map(([group, cats]) => (
            <div key={group}>
              <p style={S.groupLabel}>{group === 'Voirie' ? '🏙️ Voirie' : '🚇 Transports publics'}</p>
              <div style={{ display:'flex', flexWrap:'wrap', gap:8 }}>
                {cats.map(id => {
                  const c = CAT_MAP[id];
                  return (
                    <button key={id} onClick={() => setCategory(id)} style={S.catBtn(category === id, c.color)}>
                      <span>{c.icon}</span> {c.label}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* ── ÉTAPE 2 : Localisation ── */}
        <div style={{ ...S.section, marginTop:20 }}>
          <span style={S.label}>2. Localisation</span>

          {/* Recherche lieu */}
          <div style={{ position:'relative', marginBottom:10 }}>
            <input
              placeholder="Rechercher une station, rue, gare..."
              value={locationSearch}
              onChange={e => searchLocation(e.target.value)}
              style={S.input}
            />
            {locationResults.length > 0 && (
              <div style={{ position:'absolute', top:'100%', left:0, right:0, background:'#141435', border:'1px solid rgba(255,255,255,0.1)', borderRadius:12, zIndex:100, overflow:'hidden', marginTop:4 }}>
                {locationResults.map((item, i) => (
                  <button key={i} onClick={() => selectLocation(item)} style={{ width:'100%', padding:'10px 14px', border:'none', borderBottom:'1px solid rgba(255,255,255,0.05)', background:'transparent', color:'#F0F2FF', fontSize:13, textAlign:'left', cursor:'pointer', fontFamily:'inherit' }}>
                    📍 {item.display_name.split(',').slice(0,3).join(', ')}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Géolocalisation auto */}
          <button onClick={handleGeolocate} disabled={locating} style={{ width:'100%', padding:'12px', borderRadius:12, border:'1px solid rgba(75,85,232,0.3)', background:'rgba(75,85,232,0.08)', color:'#818CF8', fontSize:14, fontWeight:600, cursor:'pointer', fontFamily:'inherit', display:'flex', alignItems:'center', justifyContent:'center', gap:8 }}>
            {locating ? '📡 Localisation...' : '📍 Utiliser ma position actuelle'}
          </button>

          {/* Adresse détectée */}
          {address && (
            <div style={{ display:'flex', alignItems:'center', gap:8, padding:'10px 14px', background:'rgba(75,85,232,0.08)', border:'1px solid rgba(75,85,232,0.2)', borderRadius:10, marginTop:10 }}>
              <svg width="14" height="14" fill="#4B55E8" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/></svg>
              <span style={{ color:'#818CF8', fontSize:13 }}>{address}</span>
            </div>
          )}
        </div>

        {/* ── ÉTAPE 3 : Description + Photo ── */}
        <div style={{ ...S.section, marginTop:20 }}>
          <span style={S.label}>3. Description & Photo</span>

          <textarea
            placeholder="Décrivez l'obstacle... (ex: ascenseur en panne depuis 3 jours, aucun accès alternatif)"
            value={description}
            onChange={e => setDescription(e.target.value)}
            rows={3}
            style={{ ...S.input, resize:'none', marginBottom:10 } as React.CSSProperties}
          />

          {/* Upload photo */}
          <label style={{ display:'block', padding:'12px', borderRadius:12, border:'1px dashed rgba(255,255,255,0.15)', background:'rgba(255,255,255,0.02)', cursor:'pointer', textAlign:'center' as const }}>
            <input type="file" accept="image/*" style={{ display:'none' }} onChange={e => e.target.files?.[0] && uploadPhoto(e.target.files[0])} />
            {uploadingPhoto ? (
              <span style={{ color:'rgba(240,242,255,0.4)', fontSize:13 }}>Upload en cours...</span>
            ) : photoUrl ? (
              <img src={photoUrl} alt="Photo" style={{ width:'100%', borderRadius:8, maxHeight:160, objectFit:'cover' }} />
            ) : (
              <span style={{ color:'rgba(240,242,255,0.3)', fontSize:13 }}>📷 Ajouter une photo (optionnel)</span>
            )}
          </label>
        </div>

        {/* ── Bouton soumettre ── */}
        <div style={{ padding:'20px 0' }}>
          <button
            onClick={handleSubmit}
            disabled={submitting || !category || !latitude}
            style={{ width:'100%', padding:'15px', background: (!category || !latitude) ? 'rgba(75,85,232,0.3)' : '#4B55E8', border:'none', borderRadius:14, color:'white', fontSize:15, fontWeight:700, cursor: (!category || !latitude) ? 'not-allowed' : 'pointer', fontFamily:'inherit', transition:'all 0.15s' }}
          >
            {submitting ? 'Envoi en cours...' : 'Envoyer le signalement'}
          </button>
          {(!category || !latitude) && (
            <p style={{ color:'rgba(240,242,255,0.25)', fontSize:12, textAlign:'center', marginTop:8 }}>
              {!category ? 'Choisissez un type d obstacle' : 'Localisez le problème'}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
