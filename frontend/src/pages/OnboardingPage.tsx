import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SLIDES = [
  {
    color: '#4B55E8', dimColor: 'rgba(75,85,232,0.15)',
    icon: (
      <svg viewBox="0 0 64 64" fill="none" width="64" height="64">
        <rect x="6" y="8" width="36" height="32" rx="4" stroke="#818CF8" strokeWidth="2.5"/>
        <line x1="6" y1="18" x2="42" y2="18" stroke="#818CF8" strokeWidth="2"/>
        <line x1="13" y1="26" x2="26" y2="26" stroke="#818CF8" strokeWidth="2" strokeLinecap="round"/>
        <circle cx="50" cy="48" r="11" fill="rgba(75,85,232,0.2)" stroke="#818CF8" strokeWidth="2.5"/>
        <line x1="50" y1="43" x2="50" y2="53" stroke="#818CF8" strokeWidth="2.5" strokeLinecap="round"/>
        <line x1="45" y1="48" x2="55" y2="48" stroke="#818CF8" strokeWidth="2.5" strokeLinecap="round"/>
      </svg>
    ),
    title: 'Signalez les obstacles',
    desc: 'Contribuez à améliorer l\'accessibilité en signalant les barrières et obstacles rencontrés.',
  },
  {
    color: '#E879A0', dimColor: 'rgba(232,121,160,0.12)',
    icon: (
      <svg viewBox="0 0 64 64" fill="none" width="64" height="64">
        <circle cx="20" cy="22" r="10" stroke="#E879A0" strokeWidth="2.5"/>
        <circle cx="44" cy="22" r="10" stroke="#E879A0" strokeWidth="2.5"/>
        <path d="M8 54v-4a12 12 0 0 1 12-12h24a12 12 0 0 1 12 12v4" stroke="#E879A0" strokeWidth="2.5" strokeLinecap="round"/>
      </svg>
    ),
    title: 'Partagez avec la communauté',
    desc: 'Échangez des informations, des photos et des conseils avec d\'autres contributeurs.',
  },
  {
    color: '#22C55E', dimColor: 'rgba(34,197,94,0.12)',
    icon: (
      <svg viewBox="0 0 64 64" fill="none" width="64" height="64">
        <path d="M32 6C18.75 6 8 16.75 8 30c0 18.5 24 34 24 34s24-15.5 24-34C56 16.75 45.25 6 32 6z" stroke="#22C55E" strokeWidth="2.5" fill="rgba(34,197,94,0.1)"/>
        <circle cx="32" cy="28" r="8" stroke="#22C55E" strokeWidth="2.5"/>
        <polyline points="26,28 30,32 38,24" stroke="#22C55E" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    title: 'Accessible à tous.',
    desc: 'Trouvez des itinéraires adaptés et des lieux accessibles selon vos besoins spécifiques.',
  },
];

export default function OnboardingPage() {
  const navigate = useNavigate();
  const [idx, setIdx] = useState(0);
  const slide = SLIDES[idx];
  const isLast = idx === SLIDES.length - 1;

  return (
    <div style={{ height:'100dvh', background:'#07071A', fontFamily:"'Plus Jakarta Sans',system-ui,sans-serif", display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'32px 28px', position:'relative', overflow:'hidden' }}>

      {/* Glow */}
      <div style={{ position:'absolute', width:320, height:320, borderRadius:'50%', background:`radial-gradient(circle, ${slide.dimColor} 0%, transparent 70%)`, top:'30%', left:'50%', transform:'translate(-50%,-50%)', transition:'background 0.4s', pointerEvents:'none' }}/>

      {/* Card */}
      <div style={{ width:'100%', background:'#141435', border:'1px solid rgba(255,255,255,0.07)', borderRadius:28, padding:'40px 28px 32px', display:'flex', flexDirection:'column', alignItems:'center', gap:20, boxShadow:'0 20px 60px rgba(0,0,0,0.4)', position:'relative', zIndex:1 }}>

        {/* Icon */}
        <div style={{ width:96, height:96, borderRadius:28, background: slide.dimColor, border:`1px solid ${slide.color}30`, display:'flex', alignItems:'center', justifyContent:'center' }}>
          {slide.icon}
        </div>

        <div style={{ textAlign:'center' }}>
          <h2 style={{ fontSize:22, fontWeight:800, color:'#F0F2FF', letterSpacing:'-0.5px', marginBottom:10, lineHeight:1.2 }}>{slide.title}</h2>
          <p style={{ fontSize:14, color:'rgba(240,242,255,0.45)', lineHeight:1.7 }}>{slide.desc}</p>
        </div>

        {/* Dots */}
        <div style={{ display:'flex', gap:7, alignItems:'center' }}>
          {SLIDES.map((_, i) => (
            <div key={i} onClick={() => setIdx(i)} style={{ height:6, borderRadius:3, cursor:'pointer', transition:'all 0.2s', width: i===idx ? 20 : 6, background: i===idx ? slide.color : 'rgba(255,255,255,0.15)' }}/>
          ))}
        </div>

        {/* Buttons */}
        <div style={{ width:'100%', display:'flex', gap:10 }}>
          {!isLast && (
            <button onClick={() => navigate('/login')} style={{ flex:1, padding:13, borderRadius:12, border:'1px solid rgba(255,255,255,0.08)', background:'transparent', color:'rgba(240,242,255,0.5)', fontSize:14, fontWeight:600, cursor:'pointer', fontFamily:'inherit' }}>
              Passer
            </button>
          )}
          <button onClick={() => isLast ? navigate('/login') : setIdx(i => i+1)}
            style={{ flex:isLast?undefined:1, width:isLast?'100%':undefined, padding:13, borderRadius:12, border:'none', background:slide.color, color:'white', fontSize:14, fontWeight:700, cursor:'pointer', fontFamily:'inherit', boxShadow:`0 4px 18px ${slide.color}50` }}>
            {isLast ? 'Commencer →' : 'Suivant'}
          </button>
        </div>
      </div>

      <style>{`@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap');`}</style>
    </div>
  );
}
