import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../App';
import toast from 'react-hot-toast';

const API_URL = import.meta.env.VITE_AUTH_API_URL || 'http://localhost:8080';

const EyeIcon = ({ open }: { open: boolean }) => open ? (
  <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round">
    <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94"/>
    <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/>
    <line x1="1" y1="1" x2="23" y2="23"/>
  </svg>
) : (
  <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
);

export default function LoginPage() {
  const { login } = useAuth();
  const navigate  = useNavigate();
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [loading,  setLoading]  = useState(false);
  const [showPwd,  setShowPwd]  = useState(false);

  const handleLogin = async () => {
    if (!email || !password) { toast.error('Remplissez tous les champs'); return; }
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) throw new Error('Email ou mot de passe incorrect');
      const data = await res.json();
      login(data);
      toast.success(`Bienvenue ${data.displayName} 👋`);
      navigate('/');
    } catch (e: any) { toast.error(e.message); }
    setLoading(false);
  };

  const inp: React.CSSProperties = {
    width: '100%', padding: '14px 16px', borderRadius: 14,
    border: '1px solid rgba(255,255,255,0.08)',
    background: 'rgba(255,255,255,0.05)', color: '#F0F2FF',
    fontSize: 15, fontFamily: 'inherit', outline: 'none',
    transition: 'border-color 0.2s',
  };

  return (
    <div style={{ minHeight: '100dvh', background: '#07071A', fontFamily: "'Plus Jakarta Sans',system-ui,sans-serif", display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '32px 24px' }}>

      {/* Logo */}
      <div style={{ marginBottom: 32, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
        <div style={{ width: 72, height: 72, borderRadius: 22, background: 'linear-gradient(135deg,#4B55E8,#6366F1)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 60px rgba(75,85,232,0.4)' }}>
          <svg viewBox="0 0 40 48" width="38" height="38" fill="none">
            <path d="M20 2C12.27 2 6 8.27 6 16c0 10.5 14 30 14 30s14-19.5 14-30C34 8.27 27.73 2 20 2z" fill="white" opacity=".95"/>
            <circle cx="20" cy="14" r="2.5" fill="#4B55E8"/>
            <line x1="14" y1="19" x2="26" y2="19" stroke="#4B55E8" strokeWidth="2" strokeLinecap="round"/>
            <line x1="17" y1="19" x2="17" y2="26" stroke="#4B55E8" strokeWidth="2" strokeLinecap="round"/>
            <line x1="23" y1="19" x2="23" y2="26" stroke="#4B55E8" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 32, fontWeight: 800, color: '#F0F2FF', letterSpacing: '-1px' }}>
            Access<span style={{ color: '#818CF8' }}>Map</span>
          </div>
          <div style={{ fontSize: 14, color: 'rgba(240,242,255,0.4)', marginTop: 4 }}>
            Cartographie collaborative de l'accessibilité
          </div>
        </div>
      </div>

      {/* Form */}
      <div style={{ width: '100%', maxWidth: 400, display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div>
          <label style={{ fontSize: 11, fontWeight: 700, color: 'rgba(240,242,255,0.35)', textTransform: 'uppercase', letterSpacing: '1.5px', display: 'block', marginBottom: 7 }}>Email</label>
          <input
            type="email" placeholder="votre@email.com" value={email}
            onChange={e => setEmail(e.target.value)} style={inp}
            onFocus={e => (e.target.style.borderColor = '#4B55E8')}
            onBlur={e  => (e.target.style.borderColor = 'rgba(255,255,255,0.08)')}
          />
        </div>

        <div>
          <label style={{ fontSize: 11, fontWeight: 700, color: 'rgba(240,242,255,0.35)', textTransform: 'uppercase', letterSpacing: '1.5px', display: 'block', marginBottom: 7 }}>Mot de passe</label>
          <div style={{ position: 'relative' }}>
            <input
              type={showPwd ? 'text' : 'password'} placeholder="••••••••" value={password}
              onChange={e => setPassword(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleLogin()}
              style={{ ...inp, paddingRight: 48 }}
              onFocus={e => (e.target.style.borderColor = '#4B55E8')}
              onBlur={e  => (e.target.style.borderColor = 'rgba(255,255,255,0.08)')}
            />
            <button
              onClick={() => setShowPwd(!showPwd)}
              style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(240,242,255,0.3)', padding: 0, display: 'flex', alignItems: 'center' }}
            >
              <EyeIcon open={showPwd} />
            </button>
          </div>
        </div>

        <button
          onClick={handleLogin} disabled={loading}
          style={{ marginTop: 4, width: '100%', padding: 15, borderRadius: 14, border: 'none', background: loading ? '#353575' : '#4B55E8', color: 'white', fontSize: 15, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, boxShadow: '0 4px 20px rgba(75,85,232,0.35)', transition: 'all 0.2s' }}
        >
          {loading
            ? <><div style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }}/> Connexion...</>
            : 'Se connecter'}
        </button>

        <div style={{ textAlign: 'center', fontSize: 14, color: 'rgba(240,242,255,0.4)' }}>
          Pas encore de compte ?{' '}
          <button onClick={() => navigate('/register')} style={{ background: 'none', border: 'none', color: '#818CF8', fontWeight: 700, cursor: 'pointer', fontSize: 14, fontFamily: 'inherit' }}>
            Créer un compte
          </button>
        </div>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
