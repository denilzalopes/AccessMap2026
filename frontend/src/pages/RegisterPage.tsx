import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../App';
import toast from 'react-hot-toast';

const AUTH_API = import.meta.env.VITE_AUTH_API_URL || 'http://localhost:8080';

export default function RegisterPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail]             = useState('');
  const [password, setPassword]       = useState('');
  const [password2, setPassword2]     = useState('');
  const [loading, setLoading]         = useState(false);
  const [showPwd, setShowPwd]         = useState(false);

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
      // Connexion automatique après inscription
      login(data);
      localStorage.setItem('joinDate', new Date().toISOString().split('T')[0]);
      toast.success(`Bienvenue ${data.displayName} !`);
      navigate('/');
    } catch (e: any) { toast.error(e.message); }
    setLoading(false);
  };

  const S = {
    page:   { minHeight: '100dvh', background: '#07071A', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Plus Jakarta Sans',system-ui,sans-serif", padding: '20px' },
    box:    { width: '100%', maxWidth: 400 },
    logo:   { width: 56, height: 56, borderRadius: 18, background: 'linear-gradient(135deg,#4B55E8,#818CF8)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', boxShadow: '0 8px 32px rgba(75,85,232,0.35)' },
    title:  { color: '#F0F2FF', fontSize: 24, fontWeight: 800, textAlign: 'center' as const, margin: '0 0 6px' },
    sub:    { color: 'rgba(240,242,255,0.4)', fontSize: 14, textAlign: 'center' as const, margin: '0 0 32px' },
    label:  { color: 'rgba(240,242,255,0.6)', fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 6, textTransform: 'uppercase' as const, letterSpacing: '0.8px' },
    input:  { width: '100%', padding: '13px 16px', borderRadius: 12, border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.05)', color: '#F0F2FF', fontSize: 15, fontFamily: 'inherit', outline: 'none', marginBottom: 16 },
    btn:    { width: '100%', padding: '14px', background: loading ? 'rgba(75,85,232,0.5)' : '#4B55E8', border: 'none', borderRadius: 12, color: 'white', fontSize: 15, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'inherit', marginTop: 4 },
    link:   { color: '#818CF8', textDecoration: 'none', fontWeight: 600 },
  };

  return (
    <div style={S.page}>
      <div style={S.box}>
        {/* Logo */}
        <div style={S.logo}>
          <svg width="28" height="28" fill="none" viewBox="0 0 24 24">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill="white"/>
            <circle cx="12" cy="9" r="2.5" fill="rgba(255,255,255,0.5)"/>
          </svg>
        </div>

        <h1 style={S.title}>Créer un compte</h1>
        <p style={S.sub}>Rejoignez la communauté AccessMap</p>

        <div>
          <label style={S.label}>Nom affiché</label>
          <input
            type="text"
            placeholder="Votre prénom ou pseudo"
            value={displayName}
            onChange={e => setDisplayName(e.target.value)}
            style={S.input}
          />

          <label style={S.label}>Email</label>
          <input
            type="email"
            placeholder="votre@email.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
            style={S.input}
          />

          <label style={S.label}>Mot de passe</label>
          <div style={{ position: 'relative', marginBottom: 16 }}>
            <input
              type={showPwd ? 'text' : 'password'}
              placeholder="Minimum 6 caractères"
              value={password}
              onChange={e => setPassword(e.target.value)}
              style={{ ...S.input, marginBottom: 0, paddingRight: 48 }}
            />
            <button onClick={() => setShowPwd(!showPwd)} style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(240,242,255,0.4)', fontSize: 18 }}>
              {showPwd ? '🙈' : '👁️'}
            </button>
          </div>

          <label style={S.label}>Confirmer le mot de passe</label>
          <input
            type="password"
            placeholder="Répétez le mot de passe"
            value={password2}
            onChange={e => setPassword2(e.target.value)}
            style={S.input}
          />

          <button onClick={handleSubmit} disabled={loading} style={S.btn}>
            {loading ? 'Création du compte...' : 'Créer mon compte'}
          </button>

          <p style={{ textAlign: 'center', marginTop: 20, color: 'rgba(240,242,255,0.4)', fontSize: 14 }}>
            Déjà un compte ?{' '}
            <Link to="/login" style={S.link}>Se connecter</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
