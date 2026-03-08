import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../App';
import toast from 'react-hot-toast';

const API = 'http://localhost:8082/api/reports';

const CATEGORIES = [
  { id: 'STEP', label: 'Marche', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" width={22} height={22}><polyline points="4 20 4 14 8 14 8 10 12 10 12 6 16 6 16 2 20 2"/></svg> },
  { id: 'RAMP', label: 'Rampe', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" width={22} height={22}><line x1="4" y1="20" x2="20" y2="4"/><line x1="4" y1="20" x2="20" y2="20"/></svg> },
  { id: 'ELEVATOR', label: 'Ascenseur', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" width={22} height={22}><rect x="2" y="2" width="20" height="20" rx="3"/><polyline points="8 10 12 6 16 10"/><polyline points="8 14 12 18 16 14"/></svg> },
  { id: 'SIDEWALK', label: 'Trottoir', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" width={22} height={22}><line x1="4" y1="20" x2="20" y2="20"/><path d="M4 20 L12 4 L20 20"/></svg> },
  { id: 'SIGNAGE', label: 'Signalétique', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" width={22} height={22}><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg> },
  { id: 'PARKING', label: 'Stationnement', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" width={22} height={22}><rect x="2" y="2" width="20" height="20" rx="3"/><path d="M8 12h4a2 2 0 0 0 0-4H8v8"/></svg> },
];

interface NominatimResult {
  display_name: string;
  lat: string;
  lon: string;
}

export default function ReportFormPage() {
  const { isAuthenticated, userId } = useAuth();
  const navigate = useNavigate();
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [addressInput, setAddressInput] = useState('');
  const [suggestions, setSuggestions] = useState<NominatimResult[]>([]);
  const [selectedAddress, setSelectedAddress] = useState('Paris, France');
  const [latitude, setLatitude] = useState(48.8566);
  const [longitude, setLongitude] = useState(2.3522);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (pos) => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;
        setLatitude(lat);
        setLongitude(lon);
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`,
            { headers: { 'Accept-Language': 'fr' } }
          );
          const data = await res.json();
          setSelectedAddress(data.display_name?.split(',').slice(0, 3).join(',') || 'Position actuelle');
        } catch {}
      }, () => {});
    }
  }, []);

  useEffect(() => {
    if (addressInput.length < 3) { setSuggestions([]); setShowSuggestions(false); return; }
    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    searchTimeout.current = setTimeout(async () => {
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(addressInput)}&format=json&limit=5&countrycodes=fr`,
          { headers: { 'Accept-Language': 'fr' } }
        );
        const data = await res.json();
        setSuggestions(data);
        setShowSuggestions(true);
      } catch {}
    }, 400);
  }, [addressInput]);

  const selectSuggestion = (s: NominatimResult) => {
    setSelectedAddress(s.display_name.split(',').slice(0, 3).join(','));
    setLatitude(parseFloat(s.lat));
    setLongitude(parseFloat(s.lon));
    setAddressInput('');
    setSuggestions([]);
    setShowSuggestions(false);
  };

  if (!isAuthenticated) {
    return (
      <div style={{ minHeight: '100dvh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'DM Sans', system-ui, sans-serif" }}>
        <div style={{ textAlign: 'center' }}>
          <p style={{ color: '#6B7280', marginBottom: 16 }}>Connectez-vous pour signaler un obstacle</p>
          <button onClick={() => navigate('/login')} style={{ padding: '12px 24px', background: '#6366F1', color: '#fff', border: 'none', borderRadius: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
            Se connecter
          </button>
        </div>
      </div>
    );
  }

  const handleSubmit = async () => {
    if (!category) { toast.error('Choisissez une catégorie'); return; }
    setLoading(true);
    try {
      const token = localStorage.getItem('accessToken');
      const res = await fetch(API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ category, description, latitude, longitude, createdBy: userId }),
      });
      if (!res.ok) throw new Error('Erreur lors de la création');
      toast.success('Signalement envoyé ! ✅');
      navigate('/');
    } catch (e: any) { toast.error(e.message); }
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: 390, margin: '0 auto', minHeight: '100dvh', background: '#fff', fontFamily: "'DM Sans', system-ui, sans-serif", display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', alignItems: 'center', padding: '56px 20px 16px', gap: 12 }}>
        <button onClick={() => navigate(-1)} style={{ width: 40, height: 40, borderRadius: 12, border: 'none', background: '#F3F4F6', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg viewBox="0 0 24 24" fill="none" stroke="#374151" strokeWidth={2} strokeLinecap="round" width={18} height={18}><polyline points="15 18 9 12 15 6"/></svg>
        </button>
        <h1 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: '#111', letterSpacing: '-0.3px' }}>Signaler un obstacle</h1>
      </div>

      <div style={{ flex: 1, padding: '0 20px 100px', overflowY: 'auto' }}>
        {/* Localisation */}
        <div style={{ marginBottom: 24 }}>
          <label style={{ fontSize: 13, fontWeight: 700, color: '#374151', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: 10 }}>Localisation</label>
          <div style={{ background: '#F9FAFB', border: '1.5px solid #E5E7EB', borderRadius: 14, padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
            <div style={{ width: 36, height: 36, background: '#EEF2FF', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="#6366F1" strokeWidth={2} strokeLinecap="round" width={18} height={18}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#111', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{selectedAddress}</div>
              <div style={{ fontSize: 11, color: '#9CA3AF' }}>{latitude.toFixed(4)}, {longitude.toFixed(4)}</div>
            </div>
          </div>

          <div style={{ position: 'relative' }}>
            <div style={{ display: 'flex', alignItems: 'center', background: '#F3F4F6', borderRadius: 12, padding: '10px 14px', gap: 10 }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth={1.8} strokeLinecap="round" width={16} height={16}><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              <input
                placeholder="Rechercher une adresse..."
                value={addressInput}
                onChange={e => setAddressInput(e.target.value)}
                onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                style={{ flex: 1, border: 'none', background: 'transparent', fontSize: 14, color: '#374151', outline: 'none', fontFamily: 'inherit' }}
              />
              {addressInput.length > 0 && (
                <button onClick={() => { setAddressInput(''); setSuggestions([]); }} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: '#9CA3AF' }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" width={14} height={14}><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </button>
              )}
            </div>

            {showSuggestions && suggestions.length > 0 && (
              <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: '#fff', borderRadius: 12, boxShadow: '0 8px 24px rgba(0,0,0,0.12)', zIndex: 100, overflow: 'hidden', marginTop: 4, border: '1px solid #E5E7EB' }}>
                {suggestions.map((s, i) => (
                  <button key={i} onMouseDown={() => selectSuggestion(s)} style={{ width: '100%', padding: '12px 16px', background: 'none', border: 'none', borderBottom: i < suggestions.length - 1 ? '1px solid #F3F4F6' : 'none', cursor: 'pointer', display: 'flex', alignItems: 'flex-start', gap: 10, textAlign: 'left', fontFamily: 'inherit' }}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth={1.8} strokeLinecap="round" width={16} height={16} style={{ marginTop: 2, flexShrink: 0 }}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: '#111', lineHeight: 1.3 }}>{s.display_name.split(',')[0]}</div>
                      <div style={{ fontSize: 11, color: '#9CA3AF', marginTop: 2 }}>{s.display_name.split(',').slice(1, 3).join(',')}</div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Catégorie */}
        <div style={{ marginBottom: 24 }}>
          <label style={{ fontSize: 13, fontWeight: 700, color: '#374151', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: 10 }}>Catégorie</label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
            {CATEGORIES.map(cat => (
              <button key={cat.id} onClick={() => setCategory(cat.id)} style={{ padding: '14px 8px', borderRadius: 14, border: '2px solid', borderColor: category === cat.id ? '#6366F1' : '#E5E7EB', background: category === cat.id ? '#EEF2FF' : '#fff', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, fontFamily: 'inherit', color: category === cat.id ? '#6366F1' : '#6B7280', transition: 'all 0.15s' }}>
                {cat.icon}
                <span style={{ fontSize: 11, fontWeight: 600 }}>{cat.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Photo */}
        <div style={{ marginBottom: 24 }}>
          <label style={{ fontSize: 13, fontWeight: 700, color: '#374151', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: 10 }}>Photo</label>
          <div style={{ border: '2px dashed #E5E7EB', borderRadius: 14, padding: '28px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, cursor: 'pointer', background: '#FAFAFA' }}>
            <div style={{ display: 'flex', gap: 16 }}>
              <div style={{ width: 44, height: 44, background: '#F3F4F6', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth={1.8} strokeLinecap="round" width={20} height={20}><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
              </div>
              <div style={{ width: 44, height: 44, background: '#F3F4F6', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth={1.8} strokeLinecap="round" width={20} height={20}><rect x="2" y="2" width="20" height="20" rx="3"/><path d="M8 12h8M12 8v8"/></svg>
              </div>
            </div>
            <span style={{ fontSize: 13, color: '#9CA3AF', fontWeight: 500 }}>Ajouter une photo</span>
          </div>
        </div>

        {/* Description */}
        <div style={{ marginBottom: 24 }}>
          <label style={{ fontSize: 13, fontWeight: 700, color: '#374151', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: 10 }}>
            Description <span style={{ color: '#9CA3AF', textTransform: 'none', letterSpacing: 0 }}>(facultatif)</span>
          </label>
          <textarea
            placeholder="Décrivez l'obstacle rencontré..."
            value={description}
            onChange={e => setDescription(e.target.value)}
            rows={4}
            style={{ width: '100%', padding: '12px 14px', borderRadius: 14, border: '1.5px solid #E5E7EB', fontSize: 15, fontFamily: 'inherit', outline: 'none', color: '#111', background: '#F9FAFB', resize: 'none', boxSizing: 'border-box', lineHeight: 1.5 }}
          />
        </div>
      </div>

      {/* Submit */}
      <div style={{ padding: '16px 20px 36px', borderTop: '1px solid #F3F4F6', background: '#fff' }}>
        <button onClick={handleSubmit} disabled={loading} style={{ width: '100%', padding: '15px', borderRadius: 14, border: 'none', background: '#6366F1', color: '#fff', fontSize: 15, fontWeight: 700, fontFamily: 'inherit', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1, boxShadow: '0 4px 16px rgba(99,102,241,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
          <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2.5} strokeLinecap="round" width={18} height={18}><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
          {loading ? 'Envoi...' : 'Envoyer le signalement'}
        </button>
      </div>
    </div>
  );
}
