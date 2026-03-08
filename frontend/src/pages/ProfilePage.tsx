import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../App';

export default function ProfilePage() {
  const { displayName, logout, prefs, updatePrefs } = useAuth();
  const navigate = useNavigate();
  const [textSize, setTextSize] = useState<'small' | 'medium' | 'large'>(prefs.textSize as any || 'medium');

  const handleLogout = () => { logout(); navigate('/login'); };

  const Toggle = ({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) => (
    <div onClick={() => onChange(!value)} style={{ width: 44, height: 26, borderRadius: 13, background: value ? '#6366F1' : '#E5E7EB', cursor: 'pointer', position: 'relative', transition: 'background 0.2s', flexShrink: 0 }}>
      <div style={{ position: 'absolute', top: 3, left: value ? 21 : 3, width: 20, height: 20, borderRadius: '50%', background: '#fff', boxShadow: '0 1px 4px rgba(0,0,0,0.2)', transition: 'left 0.2s' }}/>
    </div>
  );

  const tabs = [
    { id: 'carte', label: 'Carte', path: '/', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" width={22} height={22}><polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"/><line x1="9" y1="3" x2="9" y2="18"/><line x1="15" y1="6" x2="15" y2="21"/></svg> },
    { id: 'signalements', label: 'Signalements', path: '/my-reports', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" width={22} height={22}><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/></svg> },
    { id: 'communaute', label: 'Communauté', path: '/community', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" width={22} height={22}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg> },
    { id: 'profil', label: 'Profil', path: '/profile', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" width={22} height={22}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg> },
  ];

  const initials = (displayName || 'U').split(' ').map((w: string) => w[0]).join('').slice(0, 2).toUpperCase();

  return (
    <div style={{ maxWidth: 390, margin: '0 auto', minHeight: '100dvh', background: '#F8F9FA', fontFamily: "'DM Sans', system-ui, sans-serif", display: 'flex', flexDirection: 'column' }}>
      {/* Header violet */}
      <div style={{ background: '#6366F1', padding: '56px 20px 80px', position: 'relative' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <h1 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: '#fff' }}>Mon profil</h1>
          <button style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(255,255,255,0.2)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={1.8} strokeLinecap="round" width={18} height={18}><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
          </button>
        </div>
        {/* Avatar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, fontWeight: 800, color: '#6366F1', boxShadow: '0 4px 16px rgba(0,0,0,0.15)', position: 'relative' }}>
            {initials}
            <div style={{ position: 'absolute', bottom: 2, right: 2, width: 16, height: 16, borderRadius: '50%', background: '#22C55E', border: '2px solid #6366F1' }}/>
          </div>
          <div>
            <div style={{ fontSize: 18, fontWeight: 800, color: '#fff' }}>{displayName || 'Utilisateur'}</div>
            <div style={{ display: 'inline-block', background: 'rgba(255,255,255,0.2)', borderRadius: 20, padding: '3px 10px', fontSize: 12, fontWeight: 600, color: '#fff', marginTop: 4 }}>Contributeur actif</div>
          </div>
        </div>
      </div>

      {/* Stats card */}
      <div style={{ margin: '0 16px', marginTop: -36, background: '#fff', borderRadius: 20, padding: '20px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', display: 'flex', justifyContent: 'space-around', position: 'relative', zIndex: 10, marginBottom: 16 }}>
        {[{ v: '24', l: 'SIGNALÉS', c: '#6366F1' }, { v: '156', l: 'VOTES', c: '#F97316' }, { v: '8', l: 'VALIDÉS', c: '#22C55E' }].map(s => (
          <div key={s.l} style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 26, fontWeight: 800, color: s.c }}>{s.v}</div>
            <div style={{ fontSize: 10, fontWeight: 700, color: '#9CA3AF', letterSpacing: '0.5px' }}>{s.l}</div>
          </div>
        ))}
      </div>

      <div style={{ flex: 1, padding: '0 16px', overflowY: 'auto', paddingBottom: 100 }}>
        {/* Accessibilité */}
        <div style={{ background: '#fff', borderRadius: 20, padding: '20px', marginBottom: 16 }}>
          <h2 style={{ margin: '0 0 16px', fontSize: 15, fontWeight: 800, color: '#111' }}>Accessibilité</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {[
              { icon: '👁', label: 'Mode haute visibilité', key: 'highVisibility', value: prefs.highVisibility },
              { icon: '🔊', label: 'Lecture vocale', key: 'voiceReading', value: prefs.voiceReading },
            ].map(item => (
              <div key={item.key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ fontSize: 18 }}>{item.icon}</span>
                  <span style={{ fontSize: 14, fontWeight: 600, color: '#374151' }}>{item.label}</span>
                </div>
                <Toggle value={item.value as boolean} onChange={v => updatePrefs({ [item.key]: v })}/>
              </div>
            ))}
            {/* Text size */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
                <span style={{ fontSize: 18 }}>🔤</span>
                <span style={{ fontSize: 14, fontWeight: 600, color: '#374151' }}>Taille du texte</span>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                {(['small', 'medium', 'large'] as const).map(s => (
                  <button key={s} onClick={() => { setTextSize(s); updatePrefs({ textSize: s }); }} style={{ flex: 1, padding: '8px 0', borderRadius: 10, border: '2px solid', borderColor: textSize === s ? '#6366F1' : '#E5E7EB', background: textSize === s ? '#EEF2FF' : '#fff', fontSize: 12, fontWeight: 700, fontFamily: 'inherit', color: textSize === s ? '#6366F1' : '#9CA3AF', cursor: 'pointer', transition: 'all 0.15s' }}>
                    {s === 'small' ? 'Normal' : s === 'medium' ? 'Grand' : 'Très grand'}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Compte */}
        <div style={{ background: '#fff', borderRadius: 20, overflow: 'hidden', marginBottom: 16 }}>
          {[
            { icon: '⚙️', label: 'Paramètres du compte' },
            { icon: '🔔', label: 'Notifications' },
            { icon: '🔒', label: 'Confidentialité' },
            { icon: '❓', label: 'Aide et support' },
          ].map((item, i, arr) => (
            <button key={item.label} style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', background: 'none', border: 'none', borderBottom: i < arr.length - 1 ? '1px solid #F3F4F6' : 'none', cursor: 'pointer', fontFamily: 'inherit' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ fontSize: 18 }}>{item.icon}</span>
                <span style={{ fontSize: 14, fontWeight: 600, color: '#374151' }}>{item.label}</span>
              </div>
              <svg viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth={2} strokeLinecap="round" width={16} height={16}><polyline points="9 18 15 12 9 6"/></svg>
            </button>
          ))}
        </div>

        {/* Logout */}
        <button onClick={handleLogout} style={{ width: '100%', padding: '14px', borderRadius: 14, border: '2px solid #FEE2E2', background: '#FFF5F5', color: '#EF4444', fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
          Se déconnecter
        </button>
      </div>

      {/* Bottom nav */}
      <div style={{ display: 'flex', background: '#fff', borderTop: '1px solid #F3F4F6', padding: '8px 0 8px', position: 'sticky', bottom: 0, zIndex: 30 }}>
        {tabs.map(tab => (
          <button key={tab.id} onClick={() => navigate(tab.path)} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, border: 'none', background: 'transparent', cursor: 'pointer', padding: '4px 0', color: tab.id === 'profil' ? '#6366F1' : '#9CA3AF', fontFamily: 'inherit' }}>
            {tab.icon}
            <span style={{ fontSize: 10, fontWeight: 600 }}>{tab.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
