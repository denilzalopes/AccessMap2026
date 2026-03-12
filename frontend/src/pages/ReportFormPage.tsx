import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../App';
import toast from 'react-hot-toast';

const API_URL = import.meta.env.VITE_REPORT_API_URL || 'http://localhost:8082';
const CLOUDINARY_CLOUD = 'djp4phexi';
const CLOUDINARY_PRESET = 'accessmap_unsigned';

const CATS = [
  { id:'STEP',      label:'Marche',       color:'#F97316', bg:'rgba(249,115,22,0.12)',
    icon: <svg viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" width={20} height={20}><path d="M4 18 L8 14 L8 10 L12 10 L12 6 L16 6 L16 2 L20 2"/><line x1="4" y1="18" x2="20" y2="18"/></svg> },
  { id:'RAMP',      label:'Rampe',        color:'#4B55E8', bg:'rgba(75,85,232,0.12)',
    icon: <svg viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" width={20} height={20}><line x1="3" y1="19" x2="19" y2="5"/><line x1="3" y1="19" x2="19" y2="19"/></svg> },
  { id:'ELEVATOR',  label:'Ascenseur',    color:'#22C55E', bg:'rgba(34,197,94,0.12)',
    icon: <svg viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" width={20} height={20}><rect x="5" y="2" width="12" height="18" rx="2"/><polyline points="9 8 12 5 15 8"/><polyline points="9 14 12 17 15 14"/></svg> },
  { id:'SIDEWALK',  label:'Trottoir',     color:'#06B6D4', bg:'rgba(6,182,212,0.12)',
    icon: <svg viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" width={20} height={20}><rect x="2" y="2" width="8" height="8" rx="1"/><rect x="12" y="2" width="8" height="8" rx="1"/><rect x="2" y="12" width="8" height="8" rx="1"/><rect x="12" y="12" width="8" height="8" rx="1"/></svg> },
  { id:'SIGNAGE',   label:'Signalétique', color:'#E879A0', bg:'rgba(232,121,160,0.12)',
    icon: <svg viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" width={20} height={20}><circle cx="11" cy="11" r="9"/><line x1="11" y1="7" x2="11" y2="11"/><circle cx="11" cy="15" r="0.5" fill="currentColor"/></svg> },
  { id:'PARKING',   label:'Parking',      color:'#9CA3AF', bg:'rgba(156,163,175,0.12)',
    icon: <svg viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" width={20} height={20}><rect x="3" y="3" width="16" height="16" rx="3"/><path d="M9 15V7h4a3 3 0 0 1 0 6H9"/></svg> },
];

interface Suggestion { display_name: string; lat: string; lon: string; }

export default function ReportFormPage() {
  const { isAuthenticated, userId } = useAuth();
  const navigate = useNavigate();
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [addressInput, setAddressInput] = useState('');
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [showSugg, setShowSugg] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState('Paris, France');
  const [latitude, setLatitude] = useState(48.8566);
  const [longitude, setLongitude] = useState(2.3522);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const timeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    navigator.geolocation?.getCurrentPosition(async pos => {
      setLatitude(pos.coords.latitude);
      setLongitude(pos.coords.longitude);
      try {
        const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${pos.coords.latitude}&lon=${pos.coords.longitude}&format=json`, { headers: { 'Accept-Language': 'fr' } });
        const d = await res.json();
        setSelectedAddress(d.display_name?.split(',').slice(0, 3).join(',') || 'Position actuelle');
      } catch {}
    }, () => {});
  }, []);

  useEffect(() => {
    if (addressInput.length < 3) { setSuggestions([]); setShowSugg(false); return; }
    if (timeout.current) clearTimeout(timeout.current);
    timeout.current = setTimeout(async () => {
      try {
        const res = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(addressInput)}&format=json&limit=5&countrycodes=fr`, { headers: { 'Accept-Language': 'fr' } });
        const d = await res.json();
        setSuggestions(d); setShowSugg(true);
      } catch {}
    }, 400);
  }, [addressInput]);

  const selectSugg = (s: Suggestion) => {
    setSelectedAddress(s.display_name.split(',').slice(0, 3).join(','));
    setLatitude(parseFloat(s.lat)); setLongitude(parseFloat(s.lon));
    setAddressInput(''); setSuggestions([]); setShowSugg(false);
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhotoFile(file);
    const reader = new FileReader();
    reader.onload = (ev) => setPhotoPreview(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const uploadToCloudinary = async (file: File): Promise<string | null> => {
    setUploadingPhoto(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', CLOUDINARY_PRESET);
      const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD}/image/upload`, {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      return data.secure_url || null;
    } catch {
      return null;
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleSubmit = async () => {
    if (!category) { toast.error('Choisissez une catégorie'); return; }
    setLoading(true);
    try {
      let photoUrl: string | null = null;
      if (photoFile) {
        photoUrl = await uploadToCloudinary(photoFile);
      }
      const token = localStorage.getItem('accessToken');
      const res = await fetch(`${API_URL}/api/reports`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ category, description, latitude, longitude, createdBy: userId, photoUrl }),
      });
      if (!res.ok) throw new Error('Erreur lors de la création');
      toast.success('Signalement envoyé ✅');
      navigate('/');
    } catch (e: any) { toast.error(e.message); }
    setLoading(false);
  };

  const S = {
    page: { minHeight:'100dvh', background:'#07071A', fontFamily:"'Plus Jakarta Sans',system-ui,sans-serif", display:'flex', flexDirection:'column' as const },
    header: { display:'flex', alignItems:'center', gap:12, padding:'52px 20px 16px' },
    backBtn: { width:38, height:38, borderRadius:12, border:'none', background:'rgba(255,255,255,0.07)', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 },
    h1: { margin:0, fontSize:18, fontWeight:800, color:'#F0F2FF', letterSpacing:'-0.3px' },
    section: { marginBottom:24 },
    label: { fontSize:11, fontWeight:700, color:'rgba(240,242,255,0.35)', textTransform:'uppercase' as const, letterSpacing:'1.5px', display:'block', marginBottom:10 },
    card: { background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.07)', borderRadius:14, padding:'12px 16px', display:'flex', alignItems:'center', gap:12, marginBottom:10 },
    searchRow: { display:'flex', alignItems:'center', background:'rgba(255,255,255,0.05)', borderRadius:12, padding:'10px 14px', gap:10, border:'1px solid rgba(255,255,255,0.07)' },
    input: { flex:1, border:'none', background:'transparent', fontSize:14, color:'#F0F2FF', outline:'none', fontFamily:'inherit' },
    catGrid: { display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:10 },
    textarea: { width:'100%', padding:'12px 14px', borderRadius:14, border:'1px solid rgba(255,255,255,0.1)', fontSize:15, fontFamily:'inherit', outline:'none', color:'#F0F2FF', background:'rgba(255,255,255,0.04)', resize:'none' as const, boxSizing:'border-box' as const, lineHeight:1.6 },
    footer: { padding:'16px 20px 36px', borderTop:'1px solid rgba(255,255,255,0.07)', background:'#07071A' },
    sendBtn: (disabled: boolean) => ({ width:'100%', padding:15, borderRadius:14, border:'none', background:'#4B55E8', color:'white', fontSize:15, fontWeight:700, fontFamily:'inherit', cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? 0.6 : 1, boxShadow:'0 4px 20px rgba(75,85,232,0.35)', display:'flex', alignItems:'center', justifyContent:'center', gap:8 }),
  };

  if (!isAuthenticated) return (
    <div style={{ ...S.page, alignItems:'center', justifyContent:'center' }}>
      <div style={{ textAlign:'center', padding:32 }}>
        <p style={{ color:'rgba(240,242,255,0.5)', marginBottom:16, fontSize:15 }}>Connectez-vous pour signaler un obstacle</p>
        <button onClick={() => navigate('/login')} style={{ padding:'12px 28px', background:'#4B55E8', color:'white', border:'none', borderRadius:12, fontWeight:700, cursor:'pointer', fontFamily:'inherit', fontSize:15 }}>Se connecter</button>
      </div>
    </div>
  );

  return (
    <div style={S.page}>
      <div style={S.header}>
        <button onClick={() => navigate(-1)} style={S.backBtn}>
          <svg viewBox="0 0 20 20" fill="none" stroke="rgba(240,242,255,0.6)" strokeWidth={2} strokeLinecap="round" width={16} height={16}><polyline points="13 4 7 10 13 16"/></svg>
        </button>
        <h1 style={S.h1}>Nouveau signalement</h1>
      </div>

      <div style={{ flex:1, padding:'0 20px 100px', overflowY:'auto' }}>

        {/* Localisation */}
        <div style={S.section}>
          <span style={S.label}>Localisation</span>
          <div style={S.card}>
            <div style={{ width:34, height:34, background:'rgba(75,85,232,0.15)', borderRadius:10, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
              <svg viewBox="0 0 20 22" fill="none" stroke="#818CF8" strokeWidth={1.8} strokeLinecap="round" width={16} height={16}><path d="M10 1C6.13 1 3 4.13 3 8c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/><circle cx="10" cy="8" r="2.5"/></svg>
            </div>
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ fontSize:13, fontWeight:600, color:'#F0F2FF', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{selectedAddress}</div>
              <div style={{ fontSize:11, color:'rgba(240,242,255,0.35)', marginTop:2 }}>{latitude.toFixed(4)}, {longitude.toFixed(4)}</div>
            </div>
          </div>
          <div style={{ position:'relative' }}>
            <div style={S.searchRow}>
              <svg viewBox="0 0 18 18" fill="none" stroke="rgba(240,242,255,0.25)" strokeWidth={1.6} strokeLinecap="round" width={14} height={14}><circle cx="8" cy="8" r="6"/><line x1="13" y1="13" x2="17" y2="17"/></svg>
              <input placeholder="Rechercher une adresse..." value={addressInput}
                onChange={e => setAddressInput(e.target.value)}
                onFocus={() => suggestions.length > 0 && setShowSugg(true)}
                onBlur={() => setTimeout(() => setShowSugg(false), 200)}
                style={S.input}/>
            </div>
            {showSugg && suggestions.length > 0 && (
              <div style={{ position:'absolute', top:'100%', left:0, right:0, background:'#141435', borderRadius:12, boxShadow:'0 8px 24px rgba(0,0,0,0.5)', zIndex:100, overflow:'hidden', marginTop:4, border:'1px solid rgba(255,255,255,0.1)' }}>
                {suggestions.map((s, i) => (
                  <button key={i} onMouseDown={() => selectSugg(s)} style={{ width:'100%', padding:'11px 16px', background:'none', border:'none', borderBottom: i < suggestions.length-1 ? '1px solid rgba(255,255,255,0.05)' : 'none', cursor:'pointer', textAlign:'left', fontFamily:'inherit', color:'#F0F2FF', fontSize:13 }}>
                    {s.display_name.split(',').slice(0,2).join(',')}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Catégorie */}
        <div style={S.section}>
          <span style={S.label}>Catégorie</span>
          <div style={S.catGrid}>
            {CATS.map(cat => {
              const sel = category === cat.id;
              return (
                <button key={cat.id} onClick={() => setCategory(cat.id)} style={{ padding:'14px 8px', borderRadius:14, border:'1.5px solid', borderColor: sel ? cat.color : 'rgba(255,255,255,0.08)', background: sel ? cat.bg : 'rgba(255,255,255,0.03)', cursor:'pointer', display:'flex', flexDirection:'column', alignItems:'center', gap:6, fontFamily:'inherit', color: sel ? cat.color : 'rgba(240,242,255,0.4)', transition:'all 0.15s' }}>
                  {cat.icon}
                  <span style={{ fontSize:10, fontWeight:700 }}>{cat.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Photo */}
        <div style={S.section}>
          <span style={S.label}>Photo</span>
          <input ref={fileInputRef} type="file" accept="image/*" capture="environment" onChange={handlePhotoChange} style={{ display:'none' }}/>
          <div onClick={() => fileInputRef.current?.click()} style={{ border:'1.5px dashed rgba(255,255,255,0.12)', borderRadius:14, overflow:'hidden', cursor:'pointer', background:'rgba(255,255,255,0.02)', minHeight:100, display:'flex', alignItems:'center', justifyContent:'center' }}>
            {photoPreview ? (
              <img src={photoPreview} alt="preview" style={{ width:'100%', maxHeight:200, objectFit:'cover', display:'block' }}/>
            ) : (
              <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:8, padding:24 }}>
                <svg viewBox="0 0 24 22" fill="none" stroke="rgba(240,242,255,0.25)" strokeWidth={1.6} strokeLinecap="round" width={28} height={28}><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2v12z"/><circle cx="12" cy="12" r="4"/></svg>
                <span style={{ fontSize:13, color:'rgba(240,242,255,0.25)', fontWeight:500 }}>Appuyer pour ajouter une photo</span>
              </div>
            )}
          </div>
          {photoPreview && (
            <button onClick={() => { setPhotoFile(null); setPhotoPreview(null); }} style={{ marginTop:8, background:'none', border:'none', color:'rgba(240,242,255,0.4)', fontSize:12, cursor:'pointer', fontFamily:'inherit' }}>
              ✕ Supprimer la photo
            </button>
          )}
        </div>

        {/* Description */}
        <div style={S.section}>
          <span style={S.label}>Description <span style={{ textTransform:'none', letterSpacing:0, color:'rgba(240,242,255,0.2)' }}>(facultatif)</span></span>
          <textarea placeholder="Décrivez l'obstacle..." value={description} onChange={e => setDescription(e.target.value)} rows={4} style={S.textarea}/>
        </div>
      </div>

      <div style={S.footer}>
        <button onClick={handleSubmit} disabled={loading || uploadingPhoto} style={S.sendBtn(loading || uploadingPhoto)}>
          <svg viewBox="0 0 20 20" fill="none" stroke="white" strokeWidth={2.2} strokeLinecap="round" width={16} height={16}><polygon points="22 2 15 22 11 13 2 9 22 2" fill="white" stroke="none"/></svg>
          {uploadingPhoto ? 'Upload photo...' : loading ? 'Envoi...' : 'Envoyer le signalement'}
        </button>
      </div>
    </div>
  );
}
