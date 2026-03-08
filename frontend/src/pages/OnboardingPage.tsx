import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const slides = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2} strokeLinecap="round" width={40} height={40}>
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
        <circle cx="12" cy="10" r="3"/>
      </svg>
    ),
    color: '#6366F1',
    title: "Bienvenue sur AccessMap",
    subtitle: "Cartographiez ensemble les obstacles urbains pour rendre la ville accessible à tous",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2} strokeLinecap="round" width={40} height={40}>
        <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/>
        <line x1="4" y1="22" x2="4" y2="15"/>
      </svg>
    ),
    color: '#F97316',
    title: "Signalez les obstacles",
    subtitle: "Marches, rampes manquantes, ascenseurs en panne — photographiez et signalez en quelques secondes",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2} strokeLinecap="round" width={40} height={40}>
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    ),
    color: '#22C55E',
    title: "Ensemble, on avance",
    subtitle: "Votez pour valider les signalements de la communauté et aidez ceux qui en ont besoin",
  },
];

export default function OnboardingPage() {
  const [current, setCurrent] = useState(0);
  const navigate = useNavigate();

  const next = () => {
    if (current < slides.length - 1) setCurrent(c => c + 1);
    else navigate('/');
  };

  const s = slides[current];

  return (
    <div style={{
      minHeight: '100dvh', background: '#fff',
      fontFamily: "'DM Sans', system-ui, sans-serif",
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'space-between', padding: '60px 32px 48px',
      maxWidth: 390, margin: '0 auto',
    }}>
      {/* Skip */}
      <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-end' }}>
        <button onClick={() => navigate('/')} style={{
          background: 'none', border: 'none', color: '#9CA3AF',
          fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
        }}>
          Passer
        </button>
      </div>

      {/* Illustration */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{
          width: 140, height: 140, borderRadius: '50%',
          background: s.color,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: `0 20px 60px ${s.color}40`,
          transition: 'all 0.4s ease',
        }}>
          {s.icon}
        </div>
      </div>

      {/* Text */}
      <div style={{ textAlign: 'center', marginBottom: 48 }}>
        <h1 style={{
          fontSize: 26, fontWeight: 800, color: '#111',
          letterSpacing: '-0.5px', margin: '0 0 12px', lineHeight: 1.2,
        }}>
          {s.title}
        </h1>
        <p style={{ fontSize: 16, color: '#6B7280', lineHeight: 1.6, margin: 0 }}>
          {s.subtitle}
        </p>
      </div>

      {/* Dots */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 32 }}>
        {slides.map((_, i) => (
          <div key={i} onClick={() => setCurrent(i)} style={{
            width: i === current ? 24 : 8, height: 8, borderRadius: 4,
            background: i === current ? s.color : '#E5E7EB',
            cursor: 'pointer', transition: 'all 0.3s',
          }}/>
        ))}
      </div>

      {/* Button */}
      <button onClick={next} style={{
        width: '100%', padding: '15px', borderRadius: 16,
        border: 'none', background: s.color, color: '#fff',
        fontSize: 16, fontWeight: 700, fontFamily: 'inherit',
        cursor: 'pointer', boxShadow: `0 4px 20px ${s.color}40`,
        transition: 'all 0.15s',
      }}>
        {current < slides.length - 1 ? 'Suivant' : "C'est parti !"}
      </button>
    </div>
  );
}
