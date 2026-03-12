import { useAddress } from '../hooks/useAddress';

const CAT_MAP: Record<string, { label: string; color: string }> = {
  STEP:     { label: 'Marche',       color: '#F97316' },
  RAMP:     { label: 'Rampe',        color: '#4B55E8' },
  ELEVATOR: { label: 'Ascenseur',    color: '#22C55E' },
  SIDEWALK: { label: 'Trottoir',     color: '#06B6D4' },
  SIGNAGE:  { label: 'Signaletique', color: '#E879A0' },
  PARKING:  { label: 'Parking',      color: '#9CA3AF' },
};

const STATUS_MAP: Record<string, { label: string; color: string }> = {
  PENDING:   { label: 'En attente', color: '#F59E0B' },
  VALIDATED: { label: 'Valide',     color: '#22C55E' },
  REJECTED:  { label: 'Rejete',     color: '#EF4444' },
};

interface Props {
  report: any;
  showStatus?: boolean;
  showVotes?: boolean;
  onVote?: (id: string, type: 'UP' | 'DOWN') => void;
  isOwner?: boolean;
  voting?: string | null;
  actions?: React.ReactNode;
}

export default function ReportCard({ report: r, showStatus, showVotes, onVote, isOwner, voting, actions }: Props) {
  const cat    = CAT_MAP[r.category] || { label: r.category, color: '#4B55E8' };
  const status = STATUS_MAP[r.status] || { label: r.status, color: '#9CA3AF' };
  const address = useAddress(r.latitude, r.longitude);

  const diff = Date.now() - new Date(r.createdAt).getTime();
  const h    = Math.floor(diff / 3600000);
  const d    = Math.floor(h / 24);
  const ago  = d > 0 ? `il y a ${d}j` : h > 0 ? `il y a ${h}h` : 'a l instant';

  return (
    <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: 16, marginBottom: 12 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <span style={{ background: cat.color + '22', color: cat.color, fontSize: 11, fontWeight: 700, padding: '4px 10px', borderRadius: 20, border: `1px solid ${cat.color}44` }}>
          {cat.label}
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {showStatus && <span style={{ color: status.color, fontSize: 11, fontWeight: 600 }}>{status.label}</span>}
          <span style={{ color: 'rgba(240,242,255,0.25)', fontSize: 11 }}>{ago}</span>
        </div>
      </div>

      {/* Description */}
      {r.description && (
        <p style={{ color: '#F0F2FF', fontSize: 14, margin: '0 0 10px', lineHeight: 1.5 }}>{r.description}</p>
      )}

      {/* Photo */}
      {r.photoUrl && (
        <img src={r.photoUrl} alt="Photo" style={{ width: '100%', borderRadius: 10, marginBottom: 10, objectFit: 'cover', maxHeight: 180 }} />
      )}

      {/* Adresse */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 6, marginBottom: showVotes ? 10 : 0 }}>
        <svg width="12" height="12" fill="#4B55E8" viewBox="0 0 24 24" style={{ flexShrink: 0, marginTop: 2 }}>
          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
        </svg>
        <span style={{ color: 'rgba(240,242,255,0.4)', fontSize: 12, lineHeight: 1.4 }}>{address}</span>
      </div>

      {/* Votes */}
      {showVotes && onVote && (
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 6, marginTop: 8 }}>
          <button
            onClick={() => onVote(r.id, 'UP')}
            disabled={!!voting || isOwner}
            style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '5px 10px', borderRadius: 20, border: '1px solid rgba(34,197,94,0.3)', background: 'rgba(34,197,94,0.08)', color: isOwner ? 'rgba(255,255,255,0.2)' : '#22C55E', fontSize: 12, fontWeight: 600, cursor: isOwner ? 'not-allowed' : 'pointer', fontFamily: 'inherit' }}
          >
            👍 {r.votesUp || 0}
          </button>
          <button
            onClick={() => onVote(r.id, 'DOWN')}
            disabled={!!voting || isOwner}
            style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '5px 10px', borderRadius: 20, border: '1px solid rgba(239,68,68,0.3)', background: 'rgba(239,68,68,0.08)', color: isOwner ? 'rgba(255,255,255,0.2)' : '#EF4444', fontSize: 12, fontWeight: 600, cursor: isOwner ? 'not-allowed' : 'pointer', fontFamily: 'inherit' }}
          >
            👎 {r.votesDown || 0}
          </button>
        </div>
      )}

      {/* Actions custom (modifier/supprimer etc.) */}
      {actions && <div style={{ marginTop: 12 }}>{actions}</div>}

      {isOwner && showVotes && (
        <p style={{ color: 'rgba(240,242,255,0.2)', fontSize: 10, textAlign: 'right', marginTop: 4 }}>
          Votre signalement - vote desactive
        </p>
      )}
    </div>
  );
}
