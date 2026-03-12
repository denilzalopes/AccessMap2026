import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../App';
import { getAddressOnce, searchPlaces } from '../hooks/useAddress';
import { CAT_MAP, CAT_GROUPS } from '../constants/categories';
import toast from 'react-hot-toast';

const API_URL           = import.meta.env.VITE_REPORT_API_URL || 'http://localhost:8082';
const CLOUDINARY_CLOUD  = 'djp4phexi';
const CLOUDINARY_PRESET = 'accessmap_unsigned';

const IconPin = () => (
  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
    <circle cx="12" cy="9" r="2.5" fill="currentColor" stroke="none"/>
  </svg>
);
const IconCamera = () => (
  <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
    <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/>
    <circle cx="12" cy="13" r="4"/>
  </svg>
);
const IconLocate = () => (
  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <circle cx="12" cy="12" r="3"/>
    <path d="M12 2v3M12 19v3M2 12h3M19 12h3"/>
    <circle cx="12" cy="12" r="9" strokeDasharray="2 4"/>
  </svg>
);
const IconSearch = () => (
  <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
  </svg>
);
const IconChevron = () => (
  <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
    <path d="M15 18l-6-6 6-6"/>
  </svg>
);
const IconRoad = () => (
  <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
    <path d="M12 2L8 22M16 2l-4 20M3 8h18M3 16h18"/>
  </svg>
);
const IconTrain = () => (
  <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
    <rect x="4" y="2" width="16" height="16" rx="3"/>
    <path d="M4 12h16M8 18l-2 4M16 18l2 4M8 7h8"/>
    <circle cx="8.5" cy="15" r="1" fill="currentColor" stroke="none"/>
    <circle cx="15.5" cy="15" r="1" fill="currentColor" stroke="none"/>
  </svg>
);

export default function ReportFormPage() {
  const { userId } = useAuth();
  const navigate   = useNavigate();

  const [category,     setCategory]     = useState('');
  const [description,  setDescription]  = useState('');
  const [latitude,     setLatitude]     = useState<number | null>(null);
  const [longitude,    setLongitude]    = useState<number | null>(null);
  const [photoUrl,     setPhotoUrl]     = useState('');
  const [address,      setAddress]      = useState('');
  const [searchQuery,  setSearchQuery]  = useState('');
  const [searchResults,setSearchResults]= useState<any[]>([]);
  const [uploading,    setUploading]    = useState(false);
  const [submitting,   setSubmitting]   = useState(false);
  const [locating,     setLocating]     = useState(false);

  // Autocomplete Photon
  useEffect(() => {
    if (searchQuery.length < 3) { setSearchResults([]); return; }
    const t = setTimeout(async () => {
      const results = await searchPlaces(searchQuery);
      setSearchResults(results);
    }, 400);
    return () => clearTimeout(t);
  }, [searchQuery]);

  const selectPlace = (feature: any) => {
    const [lon, lat] = feature.geometry.coordinates;
    const p = feature.properties;
    setLatitude(lat);
    setLongitude(lon);
    const parts = [
      p.housenumber && p.street ? `${p.housenumber} ${p.street}` : p.street,
      p.city || p.town || p.village,
    ].filter(Boolean);
    setAddress(parts.join(', ') || p.name || '');
    setSearchQuery('');
    setSearchResults([]);
  };

  const handleGeolocate = () => {
    if (!navigator.geolocation) { toast.error('Géolocalisation non supportée'); return; }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      async pos => {
        setLatitude(pos.coords.latitude);
        setLongitude(pos.coords.longitude);
        const addr = await getAddressOnce(pos.coords.latitude, pos.coords.longitude);
        setAddress(addr);
        setLocating(false);
        toast.success('Position détectée');
      },
      err => {
        setLocating(false);
        if (err.code === 1) toast.error('Autorisez la géolocalisation dans les paramètres du navigateur');
        else toast.error('Impossible de vous localiser');
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const uploadPhoto = async (file: File) => {
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      fd.append('upload_preset', CLOUDINARY_PRESET);
      const res  = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD}/image/upload`, { method:'POST', body:fd });
      const data = await res.json();
      setPhotoUrl(data.secure_url);
      toast.success('Photo ajoutée');
    } catch { toast.error('Erreur upload photo'); }
    setUploading(false);
  };

  const handleSubmit = async () => {
    if (!category) { toast.error('Choisissez un type d obstacle'); return; }
    if (!latitude)  { toast.error('Localisez le problème'); return; }
    setSubmitting(true);
    try {
      const token = localStorage.getItem('accessToken');
      const res = await fetch(`${API_URL}/api/reports`, {
        method: 'POST',
        headers: { 'Content-Type':'application/json', Authorization:`Bearer ${token}` },
        body: JSON.stringify({ category, description, latitude, longitude, createdBy:userId, photoUrl: photoUrl || null })
      });
      if (!res.ok) throw new Error();
      toast.success('Signalement créé !');
      navigate('/my-reports');
    } catch { toast.error('Erreur lors de la création'); }
    setSubmitting(false);
  };

  const ready = !!category && !!latitude;

  return (
    <div style={{ minHeight:'100dvh', background:'#07071A', fontFamily:"'Plus Jakarta Sans',system-ui,sans-serif", paddingBottom:80 }}>

      {/* Header */}
      <div style={{ display:'flex', alignItems:'center', gap:12, padding:'52px 20px 20px', borderBottom:'1px solid rgba(255,255,255,0.06)' }}>
        <button onClick={() => navigate(-1)} style={{ width:36, height:36, borderRadius:12, border:'none', background:'rgba(255,255,255,0.07)', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', color:'#F0F2FF', flexShrink:0 }}>
          <IconChevron/>
        </button>
        <div>
          <h1 style={{ color:'#F0F2FF', fontSize:18, fontWeight:700, margin:0 }}>Nouveau signalement</h1>
          <p style={{ color:'rgba(240,242,255,0.35)', fontSize:12, margin:'2px 0 0' }}>Signalez un obstacle d'accessibilité</p>
        </div>
      </div>

      <div style={{ padding:'20px' }}>

        {/* ── 1. Catégorie ── */}
        <div style={{ marginBottom:24 }}>
          <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:12 }}>
            <span style={{ width:20, height:20, borderRadius:6, background:'#4B55E8', color:'white', fontSize:11, fontWeight:700, display:'flex', alignItems:'center', justifyContent:'center' }}>1</span>
            <span style={{ color:'rgba(240,242,255,0.6)', fontSize:12, fontWeight:700, textTransform:'uppercase', letterSpacing:'1px' }}>Type d'obstacle</span>
          </div>

          {Object.entries(CAT_GROUPS).map(([group, cats]) => (
            <div key={group} style={{ marginBottom:16 }}>
              <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom:8 }}>
                <span style={{ color:'#4B55E8' }}>{group === 'Voirie' ? <IconRoad/> : <IconTrain/>}</span>
                <span style={{ color:'rgba(240,242,255,0.35)', fontSize:10, fontWeight:700, textTransform:'uppercase', letterSpacing:'1.5px' }}>
                  {group === 'Voirie' ? 'Voirie' : 'Transports publics'}
                </span>
              </div>
              <div style={{ display:'flex', flexWrap:'wrap', gap:8 }}>
                {cats.map(id => {
                  const c = CAT_MAP[id];
                  const active = category === id;
                  return (
                    <button key={id} onClick={() => setCategory(id)} style={{ padding:'9px 14px', borderRadius:12, border:`1px solid ${active ? c.color : 'rgba(255,255,255,0.07)'}`, background: active ? c.color+'22' : 'rgba(255,255,255,0.03)', color: active ? c.color : 'rgba(240,242,255,0.5)', fontSize:13, fontWeight:600, cursor:'pointer', fontFamily:'inherit', transition:'all 0.15s' }}>
                      {c.label}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* ── 2. Localisation ── */}
        <div style={{ marginBottom:24 }}>
          <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:12 }}>
            <span style={{ width:20, height:20, borderRadius:6, background:'#4B55E8', color:'white', fontSize:11, fontWeight:700, display:'flex', alignItems:'center', justifyContent:'center' }}>2</span>
            <span style={{ color:'rgba(240,242,255,0.6)', fontSize:12, fontWeight:700, textTransform:'uppercase', letterSpacing:'1px' }}>Localisation</span>
          </div>

          {/* Recherche */}
          <div style={{ position:'relative', marginBottom:10 }}>
            <div style={{ display:'flex', alignItems:'center', gap:10, background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:12, padding:'11px 14px' }}>
              <span style={{ color:'rgba(240,242,255,0.3)' }}><IconSearch/></span>
              <input
                placeholder="Chercher une station, rue, adresse..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                style={{ flex:1, border:'none', background:'transparent', color:'#F0F2FF', fontSize:14, outline:'none', fontFamily:'inherit' }}
              />
            </div>
            {searchResults.length > 0 && (
              <div style={{ position:'absolute', top:'100%', left:0, right:0, background:'#141435', border:'1px solid rgba(255,255,255,0.1)', borderRadius:12, zIndex:100, overflow:'hidden', marginTop:4, boxShadow:'0 8px 32px rgba(0,0,0,0.6)' }}>
                {searchResults.map((item, i) => {
                  const p = item.properties;
                  const label = [p.housenumber && p.street ? `${p.housenumber} ${p.street}` : p.street, p.city || p.town].filter(Boolean).join(', ') || p.name || '';
                  return (
                    <button key={i} onClick={() => selectPlace(item)} style={{ width:'100%', padding:'11px 14px', border:'none', borderBottom:'1px solid rgba(255,255,255,0.05)', background:'transparent', color:'#F0F2FF', fontSize:13, textAlign:'left', cursor:'pointer', fontFamily:'inherit', display:'flex', alignItems:'center', gap:10 }}>
                      <span style={{ color:'#4B55E8', flexShrink:0 }}><IconPin/></span>
                      <span style={{ overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{label}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Géolocalisation */}
          <button onClick={handleGeolocate} disabled={locating} style={{ width:'100%', padding:'12px', borderRadius:12, border:'1px solid rgba(75,85,232,0.3)', background:'rgba(75,85,232,0.08)', color:'#818CF8', fontSize:14, fontWeight:600, cursor: locating ? 'not-allowed' : 'pointer', fontFamily:'inherit', display:'flex', alignItems:'center', justifyContent:'center', gap:8 }}>
            <IconLocate/>
            {locating ? 'Localisation en cours...' : 'Utiliser ma position actuelle'}
          </button>

          {address && (
            <div style={{ display:'flex', alignItems:'center', gap:8, padding:'10px 14px', background:'rgba(75,85,232,0.08)', border:'1px solid rgba(75,85,232,0.2)', borderRadius:10, marginTop:10 }}>
              <span style={{ color:'#4B55E8', flexShrink:0 }}><IconPin/></span>
              <span style={{ color:'#818CF8', fontSize:13 }}>{address}</span>
            </div>
          )}
        </div>

        {/* ── 3. Description + Photo ── */}
        <div style={{ marginBottom:24 }}>
          <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:12 }}>
            <span style={{ width:20, height:20, borderRadius:6, background:'#4B55E8', color:'white', fontSize:11, fontWeight:700, display:'flex', alignItems:'center', justifyContent:'center' }}>3</span>
            <span style={{ color:'rgba(240,242,255,0.6)', fontSize:12, fontWeight:700, textTransform:'uppercase', letterSpacing:'1px' }}>Description & Photo</span>
          </div>

          <textarea
            placeholder="Décrivez l'obstacle... (ex: ascenseur en panne depuis 3 jours)"
            value={description}
            onChange={e => setDescription(e.target.value)}
            rows={3}
            style={{ width:'100%', padding:'12px 14px', borderRadius:12, border:'1px solid rgba(255,255,255,0.08)', background:'rgba(255,255,255,0.05)', color:'#F0F2FF', fontSize:14, fontFamily:'inherit', outline:'none', resize:'none', marginBottom:10, boxSizing:'border-box' }}
          />

          <label style={{ display:'block', padding:'14px', borderRadius:12, border:'1px dashed rgba(255,255,255,0.15)', background:'rgba(255,255,255,0.02)', cursor:'pointer', textAlign:'center' }}>
            <input type="file" accept="image/*" style={{ display:'none' }} onChange={e => e.target.files?.[0] && uploadPhoto(e.target.files[0])} />
            {uploading ? (
              <span style={{ color:'rgba(240,242,255,0.4)', fontSize:13 }}>Upload en cours...</span>
            ) : photoUrl ? (
              <img src={photoUrl} alt="Photo" style={{ width:'100%', borderRadius:8, maxHeight:160, objectFit:'cover' }} />
            ) : (
              <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:8 }}>
                <span style={{ color:'rgba(240,242,255,0.3)' }}><IconCamera/></span>
                <span style={{ color:'rgba(240,242,255,0.3)', fontSize:13 }}>Ajouter une photo (optionnel)</span>
              </div>
            )}
          </label>
        </div>

        {/* Bouton soumettre */}
        <button
          onClick={handleSubmit}
          disabled={submitting || !ready}
          style={{ width:'100%', padding:'15px', background: ready ? '#4B55E8' : 'rgba(75,85,232,0.25)', border:'none', borderRadius:14, color: ready ? 'white' : 'rgba(255,255,255,0.3)', fontSize:15, fontWeight:700, cursor: ready ? 'pointer' : 'not-allowed', fontFamily:'inherit', transition:'all 0.15s' }}
        >
          {submitting ? 'Envoi en cours...' : 'Envoyer le signalement'}
        </button>
        {!ready && (
          <p style={{ color:'rgba(240,242,255,0.25)', fontSize:12, textAlign:'center', marginTop:8 }}>
            {!category ? 'Choisissez un type d obstacle' : 'Localisez le problème'}
          </p>
        )}
      </div>
    </div>
  );
}
