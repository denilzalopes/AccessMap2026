import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const NAV = [
  { path: '/', label: 'Carte', icon: <svg viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" width={22} height={22}><polygon points="2 5 8 2 14 5 20 2 20 18 14 21 8 18 2 21"/><line x1="8" y1="2" x2="8" y2="18"/><line x1="14" y1="5" x2="14" y2="21"/></svg> },
  { path: '/my-reports', label: 'Signalements', icon: <svg viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" width={22} height={22}><rect x="3" y="2" width="16" height="18" rx="2"/><line x1="7" y1="8" x2="15" y2="8"/><line x1="7" y1="12" x2="15" y2="12"/><line x1="7" y1="16" x2="11" y2="16"/></svg> },
  { path: '/community', label: 'Communauté', icon: <svg viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" width={22} height={22}><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg> },
  { path: '/profile', label: 'Profil', icon: <svg viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" width={22} height={22}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg> },
];

const FILTERS = [
  { id: 'all',      label: 'Tous',       color: '#818CF8' },
  { id: 'STEP',     label: 'Marches',    color: '#F97316' },
  { id: 'RAMP',     label: 'Rampes',     color: '#4B55E8' },
  { id: 'ELEVATOR', label: 'Ascenseurs', color: '#22C55E' },
  { id: 'SIDEWALK', label: 'Trottoirs',  color: '#06B6D4' },
  { id: 'PARKING',  label: 'Parking',    color: '#E879A0' },
];

const CAT_COLOR: Record<string, string> = {
  STEP:'#F97316', RAMP:'#4B55E8', ELEVATOR:'#22C55E',
  SIDEWALK:'#06B6D4', SIGNAGE:'#E879A0', PARKING:'#9CA3AF',
};

export default function MapPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [filter, setFilter] = useState('all');
  const [showTransport, setShowTransport] = useState(false);
  const [transportType, setTransportType] = useState('all');
  const transportMarkersRef = (window as any).__transportMarkers || [];
  const [reports, setReports] = useState<any[]>([]);
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletMapRef = useRef<any>(null);

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
    return () => { if (leafletMapRef.current) { leafletMapRef.current.remove(); leafletMapRef.current = null; } };
  }, []);

  const fetchTransports = async (lat: number, lon: number, type: string) => {
    const L = (window as any).L;
    if (!L || !leafletMapRef.current) return;
    // Supprimer anciens marqueurs
    if ((window as any).__transportMarkers) {
      (window as any).__transportMarkers.forEach((m: any) => m.remove());
    }
    (window as any).__transportMarkers = [];
    if (!showTransport) return;
    try {
      const query = `[out:json][timeout:15];(
        node["highway"="bus_stop"](around:1200,${lat},${lon});
        node["amenity"="bus_station"](around:1200,${lat},${lon});
        node["railway"="subway_entrance"](around:1200,${lat},${lon});
        node["railway"="station"](around:1200,${lat},${lon});
      );out body;`;
      const res = await fetch('https://overpass-api.de/api/interpreter?data=' + encodeURIComponent(query));
      const data = await res.json();
      (data.elements || []).forEach((t: any) => {
        const isMetro = t.tags?.railway === 'subway_entrance';
        const isTrain = t.tags?.railway === 'station';
        const isBus   = t.tags?.highway === 'bus_stop' || t.tags?.amenity === 'bus_station';
        if (type === 'metro' && !isMetro) return;
        if (type === 'train' && !isTrain) return;
        if (type === 'bus' && !isBus) return;
        const icon  = isMetro ? '🚇' : isTrain ? '🚉' : '🚌';
        const color = isMetro ? '#818CF8' : isTrain ? '#F59E0B' : '#22C55E';
        const name  = t.tags?.name || (isMetro ? 'Metro' : isTrain ? 'Gare' : 'Arret bus');
        const marker = L.marker([t.lat, t.lon], {
          icon: L.divIcon({
            className: '',
            html: `<div style="background:${color};border:2px solid white;border-radius:50%;width:30px;height:30px;display:flex;align-items:center;justify-content:center;font-size:15px;box-shadow:0 2px 8px rgba(0,0,0,0.5)">${icon}</div>`,
            iconSize: [30, 30], iconAnchor: [15, 15],
          })
        }).addTo(leafletMapRef.current)
          .bindPopup(`<div style="font-family:'Plus Jakarta Sans',sans-serif;padding:4px"><strong>${name}</strong><br/><span style="color:#666;font-size:12px">${icon} ${isMetro ? 'Metro' : isTrain ? 'Gare' : 'Bus'}</span></div>`);
        (window as any).__transportMarkers.push(marker);
      });
    } catch(e) { console.error('Transport error', e); }
  };

  const initMap = () => {
    if (!mapRef.current || !(window as any).L) return;
    const L = (window as any).L;
    const map = L.map(mapRef.current, { center: [48.8566, 2.3522], zoom: 14, zoomControl: false });
    // Tiles sombres CartoDB — cohérent avec le thème
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '© OpenStreetMap © CARTO', maxZoom: 19,
    }).addTo(map);
    L.control.zoom({ position: 'bottomright' }).addTo(map);
    leafletMapRef.current = map;

    const token = localStorage.getItem('accessToken');
    fetch(`${import.meta.env.VITE_REPORT_API_URL || 'http://localhost:8082'}/api/reports`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    }).then(r => r.json()).then(data => {
      const arr = Array.isArray(data) ? data : data.content || [];
      setReports(arr);
      arr.forEach((r: any) => addMarker(L, map, r));
    }).catch(() => {});

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(pos => {
        map.setView([pos.coords.latitude, pos.coords.longitude], 15);
        const icon = L.divIcon({
          html: `<div style="width:14px;height:14px;background:#4B55E8;border:3px solid white;border-radius:50%;box-shadow:0 0 0 6px rgba(75,85,232,0.3)"></div>`,
          className: '', iconSize: [14, 14], iconAnchor: [7, 7],
        });
        L.marker([pos.coords.latitude, pos.coords.longitude], { icon }).addTo(map);
      }, () => {});
    }
  };

  const addMarker = (L: any, map: any, report: any) => {
    if (!report.latitude || !report.longitude) return;
    const color = CAT_COLOR[report.category] || '#818CF8';
    const icon = L.divIcon({
      html: `<div style="display:flex;flex-direction:column;align-items:center">
        <div style="width:22px;height:28px;background:${color};border-radius:11px 11px 3px 3px;display:flex;align-items:center;justify-content:center;box-shadow:0 4px 14px rgba(0,0,0,0.5)">
          <div style="width:8px;height:8px;background:white;border-radius:50%"></div>
        </div>
        <div style="width:0;height:0;border-left:5px solid transparent;border-right:5px solid transparent;border-top:7px solid ${color}"></div>
      </div>`,
      className: '', iconSize: [22, 35], iconAnchor: [11, 35],
    });
    L.marker([report.latitude, report.longitude], { icon }).addTo(map)
      .bindPopup(`<div style="font-family:'Plus Jakarta Sans',sans-serif;background:#141435;color:#F0F2FF;padding:12px;border-radius:10px;min-width:180px;border:1px solid rgba(255,255,255,0.1)">
        <div style="display:flex;align-items:center;gap:6px;margin-bottom:6px">
          <div style="width:8px;height:8px;border-radius:50%;background:${color};flex-shrink:0"></div>
          <span style="font-weight:700;font-size:12px;color:#F0F2FF">${report.category}</span>
        </div>
        <div style="font-size:11px;color:rgba(240,242,255,0.5);margin-bottom:8px">${report.description || 'Aucune description'}</div>
        <div style="display:flex;gap:10px;font-size:11px">
          <span style="color:rgba(255,255,255,0.5);font-size:11px">📍 Chargement adresse...</span>
          <span style="color:#22C55E;font-weight:600">👍 ${report.votesUp || 0}</span>
          <span style="color:#E879A0;font-weight:600">👎 ${report.votesDown || 0}</span>
        </div>
      </div>`);
  };

  return (
    <div style={{ height:'100dvh', display:'flex', flexDirection:'column', background:'#07071A', fontFamily:"'Plus Jakarta Sans',system-ui,sans-serif", position:'relative', overflow:'hidden' }}>
      
      {/* Header */}
      <div style={{ background:'#07071A', padding:'52px 16px 10px', zIndex:20, flexShrink:0 }}>
        <div style={{ display:'flex', alignItems:'center', gap:10, background:'rgba(255,255,255,0.06)', borderRadius:14, padding:'11px 16px', marginBottom:10, border:'1px solid rgba(255,255,255,0.07)' }}>
          <svg viewBox="0 0 20 20" fill="none" stroke="rgba(240,242,255,0.3)" strokeWidth={1.6} strokeLinecap="round" width={16} height={16}><circle cx="9" cy="9" r="7"/><line x1="14" y1="14" x2="18" y2="18"/></svg>
          <input placeholder="Rechercher un lieu..." style={{ flex:1, border:'none', background:'transparent', fontSize:15, color:'#F0F2FF', outline:'none', fontFamily:'inherit' }}/>
        </div>
        <div style={{ display:'flex', gap:8, overflowX:'auto', scrollbarWidth:'none', paddingBottom:4, flexWrap:'nowrap' }}>
          <button
            onClick={() => {
              const newVal = !showTransport;
              setShowTransport(newVal);
              const center = leafletMapRef.current?.getCenter();
              if (newVal && center) fetchTransports(center.lat, center.lng, transportType);
              else if (!newVal && (window as any).__transportMarkers) {
                (window as any).__transportMarkers.forEach((m: any) => m.remove());
                (window as any).__transportMarkers = [];
              }
            }}
            style={{ flexShrink:0, padding:'6px 14px', borderRadius:20, border:'none', cursor:'pointer', fontSize:12, fontWeight:600, fontFamily:'inherit', background: showTransport ? '#4B55E8' : 'rgba(255,255,255,0.06)', color: showTransport ? 'white' : 'rgba(240,242,255,0.4)', transition:'all 0.15s', display:'flex', alignItems:'center', gap:5 }}
          >
            🚇 Transports
          </button>
          {showTransport && ['all','bus','metro','train'].map(t => (
            <button key={t} onClick={() => {
              setTransportType(t);
              const center = leafletMapRef.current?.getCenter();
              if (center) fetchTransports(center.lat, center.lng, t);
            }} style={{ flexShrink:0, padding:'6px 14px', borderRadius:20, border:'none', cursor:'pointer', fontSize:11, fontWeight:600, fontFamily:'inherit', background: transportType === t ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.04)', color: transportType === t ? 'white' : 'rgba(240,242,255,0.4)', transition:'all 0.15s' }}>
              {t === 'all' ? 'Tous' : t === 'bus' ? '🚌 Bus' : t === 'metro' ? '🚇 Metro' : '🚉 Gares'}
            </button>
          ))}
          {FILTERS.map(f => (
            <button key={f.id} onClick={() => setFilter(f.id)} style={{ flexShrink:0, padding:'6px 14px', borderRadius:20, border:'none', cursor:'pointer', fontSize:12, fontWeight:600, fontFamily:'inherit', background: filter===f.id ? f.color : 'rgba(255,255,255,0.06)', color: filter===f.id ? 'white' : 'rgba(240,242,255,0.4)', transition:'all 0.15s', display:'flex', alignItems:'center', gap:5 }}>
              {filter !== f.id && <div style={{ width:6, height:6, borderRadius:'50%', background:f.color }}/>}
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Carte */}
      <div style={{ flex:1, position:'relative' }}>
        <div ref={mapRef} style={{ width:'100%', height:'100%' }}/>
        {reports.length > 0 && (
          <div style={{ position:'absolute', top:12, left:12, background:'rgba(20,20,53,0.85)', backdropFilter:'blur(8px)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:20, padding:'5px 12px', fontSize:12, fontWeight:700, color:'#F0F2FF', zIndex:20 }}>
            📍 {reports.length} signalement{reports.length > 1 ? 's' : ''}
          </div>
        )}
      </div>

      {/* FAB */}
      <button onClick={() => navigate('/report/new')}
        onMouseEnter={e => (e.currentTarget.style.transform='scale(1.08)')}
        onMouseLeave={e => (e.currentTarget.style.transform='scale(1)')}
        style={{ position:'absolute', bottom:76, right:16, width:54, height:54, borderRadius:'50%', background:'#4B55E8', border:'none', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 4px 20px rgba(75,85,232,0.45)', zIndex:1000, transition:'transform 0.2s' }}>
        <svg viewBox="0 0 20 20" fill="none" stroke="white" strokeWidth={2.5} strokeLinecap="round" width={22} height={22}><line x1="10" y1="4" x2="10" y2="16"/><line x1="4" y1="10" x2="16" y2="10"/></svg>
      </button>

      {/* Bottom nav */}
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
