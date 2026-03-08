import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../App';
import toast from 'react-hot-toast';

const API = 'http://localhost:8080/api/auth';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState<'login' | 'register'>('login');
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ email: '', password: '', displayName: '' });

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  const handleLogin = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/login`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.email, password: form.password }),
      });
      if (!res.ok) throw new Error((await res.json()).message || 'Erreur connexion');
      login(await res.json());
      navigate('/');
    } catch (e: any) { toast.error(e.message); }
    setLoading(false);
  };

  const handleRegister = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/register`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.email, password: form.password, displayName: form.displayName }),
      });
      if (!res.ok) throw new Error((await res.json()).message || 'Erreur inscription');
      login(await res.json());
      navigate('/onboarding');
    } catch (e: any) { toast.error(e.message); }
    setLoading(false);
  };

  return (
    <div style={{
      minHeight: '100dvh', background: '#fff',
      fontFamily: "'DM Sans', system-ui, sans-serif",
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', padding: '24px',
    }}>
      {/* Logo */}
      <div style={{ marginBottom: 40, textAlign: 'center' }}>
        <div style={{
          width: 64, height: 64, background: '#6366F1', borderRadius: 20,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 16px',
          boxShadow: '0 8px 24px rgba(99,102,241,0.35)',
        }}>
          <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2} strokeLinecap="round" width={32} height={32}>
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
            <circle cx="12" cy="10" r="3"/>
          </svg>
        </div>
        <div style={{ fontSize: 26, fontWeight: 800, color: '#111', letterSpacing: '-0.5px' }}>AccessMap</div>
        <div style={{ fontSize: 14, color: '#9CA3AF', marginTop: 4 }}>Rendons la ville accessible à tous</div>
      </div>

      {/* Card */}
      <div style={{ width: '100%', maxWidth: 400 }}>
        {/* Tabs */}
        <div style={{
          display: 'flex', background: '#F3F4F6', borderRadius: 14, padding: 4, marginBottom: 28,
        }}>
          {(['login', 'register'] as const).map(t => (
            <button key={t} onClick={() => setTab(t)} style={{
              flex: 1, padding: '10px 0', borderRadius: 11, border: 'none',
              cursor: 'pointer', fontSize: 14, fontWeight: 700, fontFamily: 'inherit',
              background: tab === t ? '#fff' : 'transparent',
              color: tab === t ? '#111' : '#9CA3AF',
              boxShadow: tab === t ? '0 1px 6px rgba(0,0,0,0.1)' : 'none',
              transition: 'all 0.2s',
            }}>
              {t === 'login' ? 'Connexion' : 'Inscription'}
            </button>
          ))}
        </div>

        {/* Fields */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {tab === 'register' && (
            <div>
              <label style={{ fontSize: 13, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>
                Nom d'affichage
              </label>
              <input
                placeholder="Ex: Marie Dupont"
                value={form.displayName}
                onChange={e => set('displayName', e.target.value)}
                style={inputStyle}
              />
            </div>
          )}
          <div>
            <label style={{ fontSize: 13, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>
              Adresse email
            </label>
            <input
              type="email" placeholder="vous@exemple.com"
              value={form.email} onChange={e => set('email', e.target.value)}
              style={inputStyle}
            />
          </div>
          <div>
            <label style={{ fontSize: 13, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>
              Mot de passe
            </label>
            <input
              type="password" placeholder="••••••••"
              value={form.password} onChange={e => set('password', e.target.value)}
              onKeyDown={e => e.key === 'Enter' && (tab === 'login' ? handleLogin() : handleRegister())}
              style={inputStyle}
            />
          </div>

          <button
            onClick={tab === 'login' ? handleLogin : handleRegister}
            disabled={loading}
            style={{
              marginTop: 8, padding: '14px', borderRadius: 14, border: 'none',
              background: '#6366F1', color: '#fff', fontSize: 15, fontWeight: 700,
              fontFamily: 'inherit', cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1,
              boxShadow: '0 4px 16px rgba(99,102,241,0.35)',
              transition: 'all 0.15s',
            }}
          >
            {loading ? 'Chargement...' : tab === 'login' ? 'Se connecter' : "S'inscrire"}
          </button>
        </div>
      </div>
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '12px 14px', borderRadius: 12,
  border: '1.5px solid #E5E7EB', fontSize: 15, fontFamily: 'inherit',
  outline: 'none', color: '#111', background: '#F9FAFB',
  boxSizing: 'border-box', transition: 'border-color 0.15s',
};
