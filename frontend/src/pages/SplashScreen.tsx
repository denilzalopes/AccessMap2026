import { useEffect, useState } from 'react';

export default function SplashScreen() {
  const [msg, setMsg] = useState('Chargement...');

  useEffect(() => {
    const t1 = setTimeout(() => setMsg('Réveil des serveurs en cours... ☕'), 3000);
    const t2 = setTimeout(() => setMsg('Presque prêt, encore quelques secondes...'), 8000);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  return (
    <div style={{
      position: 'fixed', inset: 0,
      background: '#07071A',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      gap: 20, zIndex: 9999,
      fontFamily: "'Plus Jakarta Sans',system-ui,sans-serif"
    }}>
      {/* Logo */}
      <div style={{ width: 64, height: 64, borderRadius: 20, background: 'linear-gradient(135deg,#4B55E8,#6366F1)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 40px rgba(75,85,232,0.4)' }}>
        <svg viewBox="0 0 40 48" width="36" height="36" fill="none">
          <path d="M20 2C12.27 2 6 8.27 6 16c0 10.5 14 30 14 30s14-19.5 14-30C34 8.27 27.73 2 20 2z" fill="white" opacity=".95"/>
          <circle cx="20" cy="14" r="2.5" fill="#4B55E8"/>
        </svg>
      </div>

      {/* Spinner */}
      <div style={{
        width: 36, height: 36,
        border: '3px solid rgba(75,85,232,0.2)',
        borderTopColor: '#4B55E8',
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite'
      }} />

      {/* Message */}
      <p style={{ color: 'rgba(240,242,255,0.4)', fontSize: 14, margin: 0, textAlign: 'center', padding: '0 40px' }}>
        {msg}
      </p>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
