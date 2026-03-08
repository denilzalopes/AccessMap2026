import { createContext, useContext, useEffect, useState } from 'react';
import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import type { AccessibilityPrefs, AuthResponse } from './types';

// Pages
import MapPage from './pages/MapPage';
import ReportFormPage from './pages/ReportFormPage';
import MyReportsPage from './pages/MyReportsPage';
import CommunityPage from './pages/CommunityPage';
import ProfilePage from './pages/ProfilePage';
import LoginPage from './pages/LoginPage';
import OnboardingPage from './pages/OnboardingPage';

// ── Contexte Auth ─────────────────────────────────────────────────────────────
interface AuthContextType {
  isAuthenticated: boolean;
  userId: string | null;
  displayName: string | null;
  role: string | null;
  login: (data: AuthResponse) => void;
  logout: () => void;
  prefs: AccessibilityPrefs;
  updatePrefs: (prefs: Partial<AccessibilityPrefs>) => void;
}

const defaultPrefs: AccessibilityPrefs = {
  highVisibility: false,
  voiceReading: false,
  textSize: 'medium'
};

export const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  userId: null,
  displayName: null,
  role: null,
  login: () => {},
  logout: () => {},
  prefs: defaultPrefs,
  updatePrefs: () => {}
});

export const useAuth = () => useContext(AuthContext);

// ── Guard route privée ────────────────────────────────────────────────────────
function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
}

// ── Bottom Navigation ─────────────────────────────────────────────────────────
function BottomNav() {
  const location = useLocation();
  const hiddenRoutes = ['/login', '/onboarding', '/report/new'];
  if (hiddenRoutes.some(r => location.pathname.startsWith(r))) return null;

  const tabs = [
    { path: '/', icon: '🗺️', label: 'Carte' },
    { path: '/my-reports', icon: '📋', label: 'Signalements' },
    { path: '/community', icon: '👥', label: 'Communauté' },
    { path: '/profile', icon: '👤', label: 'Profil' }
  ];

  return (
    <nav
      className="bottom-nav"
      role="navigation"
      aria-label="Navigation principale"
    >
      {tabs.map(tab => (
        <a
          key={tab.path}
          href={tab.path}
          className={`bottom-nav__item ${location.pathname === tab.path ? 'bottom-nav__item--active' : ''}`}
          aria-label={tab.label}
          aria-current={location.pathname === tab.path ? 'page' : undefined}
        >
          <span className="bottom-nav__icon" aria-hidden="true">{tab.icon}</span>
          <span className="bottom-nav__label">{tab.label}</span>
        </a>
      ))}
    </nav>
  );
}

// ── App Principal ─────────────────────────────────────────────────────────────
export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('accessToken'));
  const [userId, setUserId] = useState<string | null>(localStorage.getItem('userId'));
  const [displayName, setDisplayName] = useState<string | null>(localStorage.getItem('displayName'));
  const [role, setRole] = useState<string | null>(localStorage.getItem('role'));
  const [prefs, setPrefs] = useState<AccessibilityPrefs>(() => {
    try {
      return JSON.parse(localStorage.getItem('prefs') || 'null') ?? defaultPrefs;
    } catch { return defaultPrefs; }
  });

  // Appliquer les préférences d'accessibilité au document
  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-text-size', prefs.textSize);
    root.setAttribute('data-high-visibility', String(prefs.highVisibility));
  }, [prefs]);

  const login = (data: AuthResponse) => {
    localStorage.setItem('accessToken', data.accessToken);
    localStorage.setItem('refreshToken', data.refreshToken);
    localStorage.setItem('userId', data.userId);
    localStorage.setItem('displayName', data.displayName);
    localStorage.setItem('role', data.role);
    setIsAuthenticated(true);
    setUserId(data.userId);
    setDisplayName(data.displayName);
    setRole(data.role);
  };

  const logout = () => {
    localStorage.clear();
    setIsAuthenticated(false);
    setUserId(null);
    setDisplayName(null);
    setRole(null);
  };

  const updatePrefs = (newPrefs: Partial<AccessibilityPrefs>) => {
    setPrefs(prev => {
      const updated = { ...prev, ...newPrefs };
      localStorage.setItem('prefs', JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, userId, displayName, role, login, logout, prefs, updatePrefs }}>
      <BrowserRouter>
        <div className="app" data-text-size={prefs.textSize} data-high-visibility={prefs.highVisibility}>
          <Toaster
            position="top-center"
            toastOptions={{
              duration: 3000,
              style: { fontFamily: 'Sora, sans-serif', fontSize: '14px' }
            }}
          />
          <Routes>
            <Route path="/onboarding" element={<OnboardingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/" element={<PrivateRoute><MapPage /></PrivateRoute>} />
            <Route path="/my-reports" element={<PrivateRoute><MyReportsPage /></PrivateRoute>} />
            <Route path="/community" element={<PrivateRoute><CommunityPage /></PrivateRoute>} />
            <Route path="/profile" element={<PrivateRoute><ProfilePage /></PrivateRoute>} />
            <Route path="/report/new" element={<PrivateRoute><ReportFormPage /></PrivateRoute>} />
          </Routes>
          <BottomNav />
        </div>
      </BrowserRouter>
    </AuthContext.Provider>
  );
}
