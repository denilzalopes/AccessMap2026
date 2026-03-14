import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../App';
import toast from 'react-hot-toast';

const AUTH_API = import.meta.env.VITE_AUTH_API_URL || 'http://localhost:8080';

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

export default function RegisterPage() {
  const { login } = useAuth();
  const navigate  = useNavigate();
  const [displayName, setDisplayName] = useState('');
  const [email,       setEmail]       = useState('');
  const [password,    setPassword]    = useState('');
  const [password2,   setPassword2]   = useState('');
  const [loading,     setLoading]     = useState(false);
  const [showPwd,     setShowPwd]     = useState(false);

  const handleSubmit = async () => {
    if (!displayName || !email || !password) { toast.error('Remplissez tous les champs'); return; }
    if (password !== password2) { toast.error('Les mots de passe ne correspondent pas'); return; }
    if (password.length < 6) { toast.error('Minimum 6 caractères'); return; }
    setLoading(true);
    try {
      const res = await fetch(`${AUTH_API}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ displayName, email, password }),
      });
      if (!res.ok) {
        const err = await res.text();
        throw new Error(err || 'Erreur lors de l inscription');
      }
      const data = await res.json();
      login(data);
      localStorage.setItem('joinDate', new Date().toISOString().split('T')[0]);
      toast.success(`Bienvenue ${data.displayName} !`);
      navigate('/');
    } catch (e: any) { toast.error(e.message); }
    setLoading(false);
  };

  const inp: React.CSSProperties = {
    width: '100%', padding: '13px 16px', borderRadius: 12,
    border: '1px solid rgba(255,255,255,0.08)',
    background: 'rgba(255,255,255,0.05)', color: '#F0F2FF',
    fontSize: 15, fontFamily: 'inherit', outline: 'none',
    transition: 'border-color 0.2s',
  };

  const lbl: React.CSSProperties = {
    color: 'rgba(240,242,255,0.4)', fontSize: 11, fontWeight: 700,
    display: 'block', marginBottom: 6,
    textTransform: 'uppercase', letterSpacing: '1px',
  };

  return (
    <div style={{ minHeight: '100dvh', background: '#07071A', fontFamily: "'Plus Jakarta Sans',system-ui,sans-serif", display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <div style={{ width: '100%', maxWidth: 400 }}>

        {/* Logo */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, marginBottom: 32 }}>
          <div style={{ width: 56, height: 56, borderRadius: 18, background: 'linear-gradient(135deg,#4B55E8,#818CF8)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 32px rgba(75,85,232,0.35)' }}>
            <svg width="28" height="28" fill="none" viewBox="0 0 24 24">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill="white"/>
              <circle cx="12" cy="9" r="2.5" fill="rgba(75,85,232,0.6)"/>
            </svg>
          </div>
          <div style={{ textAlign: 'center' }}>
            <h1 style={{ color: '#F0F2FF', fontSize: 24, fontWeight: 800, margin: 0, letterSpacing: '-0.5px' }}>
              Créer un compte
            </h1>
            <p style={{ color: 'rgba(240,242,255,0.35)', fontSize: 14, margin: '4px 0 0' }}>
              Rejoignez la communauté AccessMap
            </p>
          </div>
        </div>

        {/* Form */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <label style={lbl}>Nom affiché</label>
            <input type="text" placeholder="Votre prénom ou pseudo" value={displayName}
              onChange={e => setDisplayName(e.target.value)} style={inp}
              onFocus={e => (e.target.style.borderColor = '#4B55E8')}
              onBlur={e  => (e.target.style.borderColor = 'rgba(255,255,255,0.08)')}
            />
          </div>

          <div>
            <label style={lbl}>Email</label>
            <input type="email" placeholder="votre@email.com" value={email}
              onChange={e => setEmail(e.target.value)} style={inp}
              onFocus={e => (e.target.style.borderColor = '#4B55E8')}
              onBlur={e  => (e.target.style.borderColor = 'rgba(255,255,255,0.08)')}
            />
          </div>

          <div>
            <label style={lbl}>Mot de passe</label>
            <div style={{ position: 'relative' }}>
              <input type={showPwd ? 'text' : 'password'} placeholder="Minimum 6 caractères" value={password}
                onChange={e => setPassword(e.target.value)} style={{ ...inp, paddingRight: 48 }}
                onFocus={e => (e.target.style.borderColor = '#4B55E8')}
                onBlur={e  => (e.target.style.borderColor = 'rgba(255,255,255,0.08)')}
              />
              <button onClick={() => setShowPwd(!showPwd)}
                style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(240,242,255,0.3)', padding: 0, display: 'flex', alignItems: 'center' }}>
                <EyeIcon open={showPwd} />
              </button>
            </div>
          </div>

          <div>
            <label style={lbl}>Confirmer le mot de passe</label>
            <input type="password" placeholder="Répétez le mot de passe" value={password2}
              onChange={e => setPassword2(e.target.value)} style={inp}
              onFocus={e => (e.target.style.borderColor = '#4B55E8')}
              onBlur={e  => (e.target.style.borderColor = 'rgba(255,255,255,0.08)')}
            />
          </div>

          <button onClick={handleSubmit} disabled={loading}
            style={{ marginTop: 4, width: '100%', padding: '14px', background: loading ? '#353575' : '#4B55E8', border: 'none', borderRadius: 12, color: 'white', fontSize: 15, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'inherit', boxShadow: '0 4px 20px rgba(75,85,232,0.35)', transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
            {loading
              ? <><div style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }}/> Création...</>
              : 'Créer mon compte'}
          </button>

          <p style={{ textAlign: 'center', color: 'rgba(240,242,255,0.4)', fontSize: 14, margin: 0 }}>
            Déjà un compte ?{' '}
            <Link to="/login" style={{ color: '#818CF8', fontWeight: 700, textDecoration: 'none' }}>Se connecter</Link>
          </p>
        </div>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
