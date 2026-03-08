import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const filters = ['Tous', 'Marches', 'Rampes', 'Ascenseurs', 'Parking'];

const CAT_COLOR: Record<string, string> = {
  STEP: '#6366F1', RAMP: '#F97316', ELEVATOR: '#22C55E',
  SIDEWALK: '#EAB308', SIGNAGE: '#EC4899', PARKING: '#6B7280',
};

const tabs = [
  { id: 'carte', label: 'Carte', path: '/', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" width={22} height={22}><polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"/><line x1="9" y1="3" x2="9" y2="18"/><line x1="15" y1="6" x2="15" y2="21"/></svg> },
  { id: 'signalements', label: 'Signalements', path: '/my-reports', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" width={22} height={22}><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/></svg> },
  { id: 'communaute', label: 'Communauté', path: '/community', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" width={22} height={22}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg> },
  { id: 'profil', label: 'Profil', path: '/profile', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" width={22} height={22}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg> },
];

export default function MapPage() {
  const [filter, setFilter] = useState('Tous');
  const [activeTab, setActiveTab] = useState('carte');
  const [reports, setReports] = useState<any[]>([]);
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletMapRef = useRef<any>(null);
  const navigate = useNavigate();

  // Charger Leaflet dynamiquement
  useEffect(() => {
    if (!mapRef.current || leafletMapRef.current) return;

    // Injecter le CSS Leaflet
    if (!document.getElementById('leaflet-css')) {
      const link = document.createElement('link');
      link.id = 'leaflet-css';
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(link);
    }

    // Injecter le JS Leaflet
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
    script.onload = () => initMap();
    document.head.appendChild(script);

    return () => {
      if (leafletMapRef.current) {
        leafletMapRef.current.remove();
        leafletMapRef.current = null;
      }
    };
  }, []);

  const initMap = () => {
    if (!mapRef.current || !(window as any).L) return;
    const L = (window as any).L;

    const map = L.map(mapRef.current, {
      center: [48.8566, 2.3522],
      zoom: 14,
      zoomControl: false,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap',
      maxZoom: 19,
    }).addTo(map);

    // Zoom control en bas à droite
    L.control.zoom({ position: 'bottomright' }).addTo(map);

    leafletMapRef.current = map;

    // Charger les signalements
    const token = localStorage.getItem('accessToken');
    fetch('http://localhost:8082/api/reports', {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
      .then(r => r.json())
      .then(data => {
        const arr = Array.isArray(data) ? data : data.content || [];
        setReports(arr);
        arr.forEach((r: any) => addMarker(L, map, r));
      })
      .catch(() => {});

    // Géolocalisation
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        map.setView([pos.coords.latitude, pos.coords.longitude], 15);
        const locIcon = L.divIcon({
          html: `<div style="width:16px;height:16px;background:#6366F1;border:3px solid white;border-radius:50%;box-shadow:0 0 0 4px rgba(99,102,241,0.3)"></div>`,
          className: '', iconSize: [16, 16], iconAnchor: [8, 8],
        });
        L.marker([pos.coords.latitude, pos.coords.longitude], { icon: locIcon }).addTo(map);
      }, () => {});
    }
  };

  const addMarker = (L: any, map: any, report: any) => {
    if (!report.latitude || !report.longitude) return;
    const color = CAT_COLOR[report.category] || '#6366F1';
    const icon = L.divIcon({
      html: `<div style="width:20px;height:20px;background:${color};border:3px solid white;border-radius:50%;box-shadow:0 2px 8px rgba(0,0,0,0.25)"></div>`,
      className: '', iconSize: [20, 20], iconAnchor: [10, 10],
    });
    L.marker([report.latitude, report.longitude], { icon })
      .addTo(map)
      .bindPopup(`
        <div style="font-family:'DM Sans',sans-serif;padding:4px">
          <div style="font-weight:700;font-size:13px;color:#111">${report.category}</div>
          <div style="font-size:12px;color:#6B7280;margin-top:2px">${report.description || ''}</div>
          <div style="display:flex;gap:8px;margin-top:6px;font-size:11px;color:#9CA3AF">
            <span>👍 ${report.votesUp || 0}</span>
            <span>👎 ${report.votesDown || 0}</span>
          </div>
        </div>
      `);
  };

  return (
    <div style={{ maxWidth: 390, margin: '0 auto', height: '100dvh', display: 'flex', flexDirection: 'column', background: '#fff', fontFamily: "'DM Sans', system-ui, sans-serif", position: 'relative', overflow: 'hidden' }}>
      {/* Status bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 20px 4px', fontSize: 12, fontWeight: 600, color: '#111', zIndex: 20, background: '#fff' }}>
        <span>9:41</span>
        <div style={{ display: 'flex', gap: 5, alignItems: 'center' }}>
          <svg width="15" height="11" viewBox="0 0 15 11"><rect x="0" y="3" width="2.5" height="8" rx="0.8" fill="#111"/><rect x="4" y="2" width="2.5" height="9" rx="0.8" fill="#111"/><rect x="8" y="0" width="2.5" height="11" rx="0.8" fill="#111"/><rect x="12" y="1" width="2.5" height="10" rx="0.8" fill="#D1D5DB"/></svg>
          <div style={{ width: 23, height: 11, border: '1.5px solid #111', borderRadius: 3, padding: '1.5px 2px', display: 'flex', gap: 1.5 }}><div style={{ flex: 1, background: '#111', borderRadius: 1 }}/><div style={{ flex: 1, background: '#111', borderRadius: 1 }}/><div style={{ flex: 0.5, background: '#D1D5DB', borderRadius: 1 }}/></div>
        </div>
      </div>

      {/* Search */}
      <div style={{ padding: '8px 16px 10px', background: '#fff', zIndex: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', background: '#F3F4F6', borderRadius: 14, padding: '10px 14px', gap: 10 }}>
          <svg viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth={1.8} strokeLinecap="round" width={18} height={18}><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input placeholder="Rechercher un lieu..." style={{ flex: 1, border: 'none', background: 'transparent', fontSize: 15, color: '#374151', outline: 'none', fontFamily: 'inherit' }}/>
          <svg viewBox="0 0 24 24" fill="none" stroke="#6366F1" strokeWidth={1.8} strokeLinecap="round" width={18} height={18}><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/></svg>
        </div>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 8, padding: '0 16px 12px', overflowX: 'auto', scrollbarWidth: 'none', background: '#fff', zIndex: 20 }}>
        {filters.map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{ flexShrink: 0, padding: '6px 14px', borderRadius: 20, border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600, fontFamily: 'inherit', background: filter === f ? '#6366F1' : '#F3F4F6', color: filter === f ? '#fff' : '#6B7280', transition: 'all 0.15s' }}>
            {f}
          </button>
        ))}
      </div>

      {/* Leaflet Map */}
      <div style={{ flex: 1, position: 'relative' }}>
        <div ref={mapRef} style={{ width: '100%', height: '100%' }} />
        {/* Compteur signalements */}
        {reports.length > 0 && (
          <div style={{ position: 'absolute', top: 12, left: 12, background: '#fff', borderRadius: 20, padding: '6px 12px', fontSize: 12, fontWeight: 700, color: '#374151', boxShadow: '0 2px 8px rgba(0,0,0,0.12)', zIndex: 400 }}>
            📍 {reports.length} signalement{reports.length > 1 ? 's' : ''}
          </div>
        )}
      </div>

      {/* FAB */}
      <button onClick={() => navigate('/report/new')} style={{ position: 'absolute', bottom: 90, right: 20, width: 56, height: 56, borderRadius: '50%', background: '#6366F1', border: 'none', boxShadow: '0 4px 20px rgba(99,102,241,0.4)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999, transition: 'transform 0.15s' }}
        onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.08)')}
        onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}>
        <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2.5} strokeLinecap="round" width={26} height={26}><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
      </button>

      {/* Bottom nav */}
      <div style={{ display: 'flex', background: '#fff', borderTop: '1px solid #F3F4F6', padding: '8px 0 8px', zIndex: 30 }}>
        {tabs.map(tab => (
          <button key={tab.id} onClick={() => { setActiveTab(tab.id); navigate(tab.path); }} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, border: 'none', background: 'transparent', cursor: 'pointer', padding: '4px 0', color: activeTab === tab.id ? '#6366F1' : '#9CA3AF', fontFamily: 'inherit', transition: 'color 0.15s' }}>
            {tab.icon}
            <span style={{ fontSize: 10, fontWeight: 600 }}>{tab.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
