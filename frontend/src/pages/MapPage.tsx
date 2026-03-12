import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const NAV = [
  { path: '/', label: 'Carte', icon: <svg viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" width={22} height={22}><polygon points="2 5 8 2 14 5 20 2 20 18 14 21 8 18 2 21"/><line x1="8" y1="2" x2="8" y2="18"/><line x1="14" y1="5" x2="14" y2="21"/></svg> },
  { path: '/my-reports', label: 'Signalements', icon: <svg viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" width={22} height={22}><rect x="3" y="2" width="16" height="18" rx="2"/><line x1="7" y1="8" x2="15" y2="8"/><line x1="7" y1="12" x2="15" y2="12"/><line x1="7" y1="16" x2="11" y2="16"/></svg> },
  { path: '/community', label: 'Communauté', icon: <svg viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" width={22} height={22}><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg> },
  { path: '/profile', label: 'Profil', icon: <svg viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" width={22} height={22}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg> },
];

const FILTERS = [
  { id: 'all',                  label: 'Tous',        color: '#818CF8' },
  { id: 'STEP',                 label: 'Marches',     color: '#F97316' },
  { id: 'RAMP',                 label: 'Rampes',      color: '#4B55E8' },
  { id: 'ELEVATOR',             label: 'Ascenseurs',  color: '#22C55E' },
  { id: 'SIDEWALK',             label: 'Trottoirs',   color: '#06B6D4' },
  { id: 'INACCESSIBLE_STOP',    label: 'Arrets bus',  color: '#EC4899' },
  { id: 'INACCESSIBLE_PLATFORM',label: 'Quais',       color: '#8B5CF6' },
];

const CAT_COLOR: Record<string, string> = {
  STEP:'#F97316', RAMP:'#4B55E8', ELEVATOR:'#22C55E',
  SIDEWALK:'#06B6D4', SIGNAGE:'#E879A0', PARKING:'#9CA3AF',
  ESCALATOR_BROKEN:'#F59E0B', INACCESSIBLE_ENTRY:'#EF4444',
  INACCESSIBLE_PLATFORM:'#8B5CF6', INACCESSIBLE_STOP:'#EC4899',
  NARROW_PASSAGE:'#64748B',
};

export default function MapPage() {
  const navigate  = useNavigate();
  const location  = useLocation();
  const [filter, setFilter]   = useState('all');
  const [reports, setReports] = useState<any[]>([]);
  const mapRef        = useRef<HTMLDivElement>(null);
  const leafletMapRef = useRef<any>(null);
  const markersRef    = useRef<any[]>([]);

  // Recherche
  const [searchQuery, setSearchQuery]     = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searchFocus, setSearchFocus]     = useState(false);

  useEffect(() => {
    if (!mapRef.current || leafletMapRef.current) return;
    if (!document.getElementById('leaflet-css')) {
      const link = document.createElement('link');
      link.id = 'leaflet-css'; link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(link);
    }
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
    script.onload = () => initMap();
    document.head.appendChild(script);
    return () => {
      if (leafletMapRef.current) { leafletMapRef.current.remove(); leafletMapRef.current = null; }
    };
  }, []);

  // Recherche Nominatim
  useEffect(() => {
    if (searchQuery.length < 3) { setSearchResults([]); return; }
    const t = setTimeout(async () => {
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(searchQuery)}&format=json&limit=5&accept-language=fr`
        );
        const data = await res.json();
        setSearchResults(data);
      } catch { setSearchResults([]); }
    }, 400);
    return () => clearTimeout(t);
  }, [searchQuery]);

  const selectSearchResult = (item: any) => {
    const lat = parseFloat(item.lat);
    const lon = parseFloat(item.lon);
    leafletMapRef.current?.setView([lat, lon], 16);
    setSearchQuery(item.display_name.split(',').slice(0,2).join(', '));
    setSearchResults([]);
    setSearchFocus(false);
  };

  const initMap = () => {
    if (!mapRef.current || !(window as any).L) return;
    const L = (window as any).L;
    const map = L.map(mapRef.current, { center: [48.8566, 2.3522], zoom: 14, zoomControl: false });
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '© OpenStreetMap © CARTO', maxZoom: 19,
    }).addTo(map);
    L.control.zoom({ position: 'bottomright' }).addTo(map);
    leafletMapRef.current = map;

    // Géolocalisation
    navigator.geolocation.getCurrentPosition(
      pos => {
        map.setView([pos.coords.latitude, pos.coords.longitude], 15);
        const icon = L.divIcon({
          html: `<div style="width:14px;height:14px;background:#4B55E8;border:3px solid white;border-radius:50%;box-shadow:0 0 0 6px rgba(75,85,232,0.3)"></div>`,
          className: '', iconSize: [14,14], iconAnchor: [7,7],
        });
        L.marker([pos.coords.latitude, pos.coords.longitude], { icon }).addTo(map);
      },
      () => {} // silencieux — pas de toast ici
    );

    // Charger signalements
    const token = localStorage.getItem('accessToken');
    fetch(`${import.meta.env.VITE_REPORT_API_URL || 'http://localhost:8082'}/api/reports`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
      .then(r => r.json())
      .then(data => {
        const arr = Array.isArray(data) ? data : data.content || [];
        setReports(arr);
        arr.forEach((r: any) => addMarker(L, map, r));
      })
      .catch(() => {});
  };

  const addMarker = (L: any, map: any, report: any) => {
    if (!report.latitude || !report.longitude) return;
    const color = CAT_COLOR[report.category] || '#818CF8';
    const icon = L.divIcon({
      html: `<div style="display:flex;flex-direction:column;align-items:center">
        <div style="width:22px;height:28px;background:${color};border-radius:11px 11px 3px 3px;display:flex;align-items:center;justify-content:center;box-shadow:0 4px 14px rgba(0,0,0,0.5)">
          <div style="width:8px;height:8px;background:white;border-radius:50%"></div>
        </div>
        <div style="width:4px;height:4px;background:${color};border-radius:50%;margin-top:1px"></div>
      </div>`,
      className: '', iconSize: [22,34], iconAnchor: [11,34],
    });
    const marker = L.marker([report.latitude, report.longitude], { icon })
      .addTo(map)
      .bindPopup(`<div style="font-family:'Plus Jakarta Sans',sans-serif;min-width:180px">
        <strong style="color:#1a1a2e">${report.category}</strong><br/>
        <span style="color:#666;font-size:12px">${report.description || ''}</span><br/>
        <div style="margin-top:6px;display:flex;gap:8px">
          <span style="color:#22C55E;font-weight:600">👍 ${report.votesUp || 0}</span>
          <span style="color:#E879A0;font-weight:600">👎 ${report.votesDown || 0}</span>
        </div>
      </div>`);
    markersRef.current.push({ marker, category: report.category });
  };

  // Filtre markers
  useEffect(() => {
    markersRef.current.forEach(({ marker, category }) => {
      if (filter === 'all' || filter === category) {
        marker.getElement()?.style.setProperty('display', 'block');
      } else {
        marker.getElement()?.style.setProperty('display', 'none');
      }
    });
  }, [filter]);

  return (
    <div style={{ height:'100dvh', display:'flex', flexDirection:'column', background:'#07071A', fontFamily:"'Plus Jakarta Sans',system-ui,sans-serif", position:'relative', overflow:'hidden' }}>

      {/* Header */}
      <div style={{ background:'#07071A', padding:'52px 16px 10px', zIndex:20, flexShrink:0 }}>

        {/* Barre de recherche */}
        <div style={{ position:'relative', marginBottom:10 }}>
          <div style={{ display:'flex', alignItems:'center', gap:10, background:'rgba(255,255,255,0.06)', borderRadius:14, padding:'11px 16px', border:'1px solid rgba(255,255,255,0.07)' }}>
            <svg viewBox="0 0 20 20" fill="none" stroke="rgba(240,242,255,0.3)" strokeWidth={1.6} strokeLinecap="round" width={16} height={16}><circle cx="9" cy="9" r="7"/><line x1="14" y1="14" x2="18" y2="18"/></svg>
            <input
              placeholder="Rechercher un lieu, une station..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              onFocus={() => setSearchFocus(true)}
              style={{ flex:1, border:'none', background:'transparent', fontSize:15, color:'#F0F2FF', outline:'none', fontFamily:'inherit' }}
            />
            {searchQuery.length > 0 && (
              <button onClick={() => { setSearchQuery(''); setSearchResults([]); }} style={{ background:'none', border:'none', cursor:'pointer', color:'rgba(240,242,255,0.4)', fontSize:16, padding:0 }}>✕</button>
            )}
          </div>

          {/* Résultats recherche */}
          {searchResults.length > 0 && searchFocus && (
            <div style={{ position:'absolute', top:'100%', left:0, right:0, background:'#141435', border:'1px solid rgba(255,255,255,0.1)', borderRadius:12, zIndex:100, overflow:'hidden', marginTop:4, boxShadow:'0 8px 32px rgba(0,0,0,0.5)' }}>
              {searchResults.map((item, i) => (
                <button key={i} onClick={() => selectSearchResult(item)} style={{ width:'100%', padding:'12px 16px', border:'none', borderBottom:'1px solid rgba(255,255,255,0.05)', background:'transparent', color:'#F0F2FF', fontSize:13, textAlign:'left', cursor:'pointer', fontFamily:'inherit', display:'flex', alignItems:'center', gap:10 }}>
                  <svg width="14" height="14" fill="#4B55E8" viewBox="0 0 24 24" style={{ flexShrink:0 }}><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/></svg>
                  <span style={{ overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                    {item.display_name.split(',').slice(0,3).join(', ')}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Filtres */}
        <div style={{ display:'flex', gap:8, overflowX:'auto', scrollbarWidth:'none', paddingBottom:4 }}>
          {FILTERS.map(f => (
            <button key={f.id} onClick={() => setFilter(f.id)} style={{ flexShrink:0, padding:'6px 14px', borderRadius:20, border:'none', cursor:'pointer', fontSize:12, fontWeight:600, fontFamily:'inherit', background: filter===f.id ? f.color : 'rgba(255,255,255,0.06)', color: filter===f.id ? 'white' : 'rgba(240,242,255,0.4)', transition:'all 0.15s', display:'flex', alignItems:'center', gap:5 }}>
              {filter !== f.id && <div style={{ width:6, height:6, borderRadius:'50%', background:f.color }}/>}
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Carte */}
      <div style={{ flex:1, position:'relative' }} onClick={() => setSearchFocus(false)}>
        <div ref={mapRef} style={{ width:'100%', height:'100%' }}/>
        {reports.length > 0 && (
          <div style={{ position:'absolute', top:12, left:12, background:'rgba(20,20,53,0.85)', backdropFilter:'blur(8px)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:20, padding:'5px 12px', fontSize:12, fontWeight:700, color:'#F0F2FF', zIndex:20 }}>
            {reports.length} signalement{reports.length > 1 ? 's' : ''}
          </div>
        )}
      </div>

      {/* FAB */}
      <button onClick={() => navigate('/report/new')}
        style={{ position:'absolute', bottom:76, right:16, width:54, height:54, borderRadius:'50%', background:'#4B55E8', border:'none', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 4px 20px rgba(75,85,232,0.45)', zIndex:1000, transition:'transform 0.2s' }}
        onMouseEnter={e => (e.currentTarget.style.transform='scale(1.08)')}
        onMouseLeave={e => (e.currentTarget.style.transform='scale(1)')}>
        <svg viewBox="0 0 20 20" fill="none" stroke="white" strokeWidth={2.5} strokeLinecap="round" width={22} height={22}><line x1="10" y1="4" x2="10" y2="16"/><line x1="4" y1="10" x2="16" y2="10"/></svg>
      </button>

      {/* Nav */}
      <nav style={{ display:'flex', background:'#0F1030', borderTop:'1px solid rgba(255,255,255,0.07)', padding:'8px 0 12px', zIndex:1000, flexShrink:0 }}>
        {NAV.map(tab => {
          const active = location.pathname === tab.path;
          return (
            <button key={tab.path} onClick={() => navigate(tab.path)} style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', gap:3, border:'none', background:'transparent', cursor:'pointer', padding:'4px 0', fontFamily:'inherit', color: active ? '#818CF8' : 'rgba(240,242,255,0.3)', transition:'color 0.15s' }}>
              {tab.icon}
              <span style={{ fontSize:10, fontWeight:600 }}>{tab.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
