import { createContext, useContext, useEffect, useState } from 'react';
import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import type { AccessibilityPrefs, AuthResponse } from './types';
import { warmupServices } from './WarmupService';
import SplashScreen from './pages/SplashScreen';
import RegisterPage from './pages/RegisterPage';
import AdminPage from './pages/AdminPage';
import MapPage from './pages/MapPage';
import ReportFormPage from './pages/ReportFormPage';
import MyReportsPage from './pages/MyReportsPage';
import CommunityPage from './pages/CommunityPage';
import ProfilePage from './pages/ProfilePage';
import LoginPage from './pages/LoginPage';
import OnboardingPage from './pages/OnboardingPage';

interface AuthContextType {
  isAuthenticated: boolean;
  userId:      string | null;
  displayName: string | null;
  email:       string | null;
  role:        string | null;
  login:       (data: AuthResponse) => void;
  logout:      () => void;
  prefs:       AccessibilityPrefs;
  updatePrefs: (prefs: Partial<AccessibilityPrefs>) => void;
}

const defaultPrefs: AccessibilityPrefs = {
  highVisibility: false,
  voiceReading:   false,
  textSize:       'medium'
};

export const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  userId:      null,
  displayName: null,
  email:       null,
  role:        null,
  login:       () => {},
  logout:      () => {},
  prefs:       defaultPrefs,
  updatePrefs: () => {}
});

export const useAuth = () => useContext(AuthContext);

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
}

function BottomNav() {
  const location = useLocation();
  const hiddenRoutes = ['/login', '/register', '/onboarding', '/report/new'];
  if (hiddenRoutes.some(r => location.pathname.startsWith(r))) return null;

  const tabs = [
    { path: '/', icon: <svg width="22" height="22" fill="none" viewBox="0 0 24 24"><path d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 13l4.553 2.276A1 1 0 0021 21.382V10.618a1 1 0 00-.553-.894L15 7m0 13V7m0 0L9 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>, label: 'Carte' },
    { path: '/my-reports', icon: <svg width="22" height="22" fill="none" viewBox="0 0 24 24"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>, label: 'Signalements' },
    { path: '/community', icon: <svg width="22" height="22" fill="none" viewBox="0 0 24 24"><path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>, label: 'Communauté' },
    { path: '/profile', icon: <svg width="22" height="22" fill="none" viewBox="0 0 24 24"><path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>, label: 'Profil' }
  ];

  return (
    <nav className="bottom-nav" role="navigation" aria-label="Navigation principale">
      {tabs.map(tab => (
        <a key={tab.path} href={tab.path}
          className={`bottom-nav__item ${location.pathname === tab.path ? 'bottom-nav__item--active' : ''}`}
          aria-label={tab.label} aria-current={location.pathname === tab.path ? 'page' : undefined}>
          <span className="bottom-nav__icon" aria-hidden="true" style={{display:"flex",alignItems:"center",justifyContent:"center"}}>{tab.icon}</span>
          <span className="bottom-nav__label">{tab.label}</span>
        </a>
      ))}
    </nav>
  );
}

export default function App() {
  const [warmupDone, setWarmupDone]         = useState(false);
  const [warmupProgress, setWarmupProgress] = useState(0);
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('accessToken'));
  const [userId,      setUserId]      = useState<string | null>(localStorage.getItem('userId'));
  const [displayName, setDisplayName] = useState<string | null>(localStorage.getItem('displayName'));
  const [email,       setEmail]       = useState<string | null>(localStorage.getItem('email'));
  const [role,        setRole]        = useState<string | null>(localStorage.getItem('role'));
  const [prefs, setPrefs] = useState<AccessibilityPrefs>(() => {
    try { return JSON.parse(localStorage.getItem('prefs') || 'null') ?? defaultPrefs; }
    catch { return defaultPrefs; }
  });

  useEffect(() => {
    warmupServices(pct => setWarmupProgress(pct))
      .finally(() => { setWarmupProgress(100); setTimeout(() => setWarmupDone(true), 500); });
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-text-size', prefs.textSize);
    root.setAttribute('data-high-visibility', String(prefs.highVisibility));
  }, [prefs]);

  const login = (data: AuthResponse) => {
    localStorage.setItem('accessToken',  data.accessToken);
    localStorage.setItem('refreshToken', data.refreshToken);
    localStorage.setItem('userId',       data.userId);
    localStorage.setItem('displayName',  data.displayName);
    localStorage.setItem('email',        data.email ?? '');
    localStorage.setItem('role',         data.role);
    setIsAuthenticated(true);
    setUserId(data.userId);
    setDisplayName(data.displayName);
    setEmail(data.email ?? null);
    setRole(data.role);
  };

  const logout = () => {
    localStorage.clear();
    setIsAuthenticated(false);
    setUserId(null);
    setDisplayName(null);
    setEmail(null);
    setRole(null);
  };

  const updatePrefs = (newPrefs: Partial<AccessibilityPrefs>) => {
    setPrefs(prev => {
      const updated = { ...prev, ...newPrefs };
      localStorage.setItem('prefs', JSON.stringify(updated));
      return updated;
    });
  };

  if (!warmupDone) return <SplashScreen />;

  return (
    <AuthContext.Provider value={{ isAuthenticated, userId, displayName, email, role, login, logout, prefs, updatePrefs }}>
      <BrowserRouter>
        <div className="app" data-text-size={prefs.textSize} data-high-visibility={prefs.highVisibility}>
          <Toaster position="top-center" toastOptions={{ duration: 3000, style: { fontFamily: 'Sora, sans-serif', fontSize: '14px' } }} />
          <Routes>
            <Route path="/onboarding" element={<OnboardingPage />} />
            <Route path="/login"      element={<LoginPage />} />
            <Route path="/register"   element={<RegisterPage />} />
            <Route path="/admin"      element={<PrivateRoute><AdminPage /></PrivateRoute>} />
            <Route path="/"           element={<PrivateRoute><MapPage /></PrivateRoute>} />
            <Route path="/my-reports" element={<PrivateRoute><MyReportsPage /></PrivateRoute>} />
            <Route path="/community"  element={<PrivateRoute><CommunityPage /></PrivateRoute>} />
            <Route path="/profile"    element={<PrivateRoute><ProfilePage /></PrivateRoute>} />
            <Route path="/report/new" element={<PrivateRoute><ReportFormPage /></PrivateRoute>} />
          </Routes>
          <BottomNav />
        </div>
      </BrowserRouter>
    </AuthContext.Provider>
  );
}
