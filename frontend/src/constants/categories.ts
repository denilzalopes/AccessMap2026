export const CAT_MAP: Record<string, { label: string; color: string; icon: string; group: string }> = {
  // Voirie
  STEP:                  { label: 'Marche / Escalier',       color: '#F97316', icon: '🪜', group: 'Voirie' },
  RAMP:                  { label: 'Rampe manquante',          color: '#4B55E8', icon: '↗️', group: 'Voirie' },
  SIDEWALK:              { label: 'Trottoir inaccessible',    color: '#06B6D4', icon: '🚶', group: 'Voirie' },
  SIGNAGE:               { label: 'Signalétique inadaptée',   color: '#E879A0', icon: '⚠️', group: 'Voirie' },
  PARKING:               { label: 'Stationnement PMR',        color: '#9CA3AF', icon: '🅿️', group: 'Voirie' },
  // Transports
  ELEVATOR:              { label: 'Ascenseur en panne',       color: '#22C55E', icon: '🛗', group: 'Transports' },
  ESCALATOR_BROKEN:      { label: 'Escalator en panne',       color: '#F59E0B', icon: '🔧', group: 'Transports' },
  INACCESSIBLE_ENTRY:    { label: 'Entrée inaccessible',      color: '#EF4444', icon: '🚪', group: 'Transports' },
  INACCESSIBLE_PLATFORM: { label: 'Quai inaccessible',        color: '#8B5CF6', icon: '🚉', group: 'Transports' },
  INACCESSIBLE_STOP:     { label: 'Arrêt bus inaccessible',   color: '#EC4899', icon: '🚌', group: 'Transports' },
  NARROW_PASSAGE:        { label: 'Passage trop étroit',      color: '#64748B', icon: '↔️', group: 'Transports' },
};

export const CAT_GROUPS = {
  Voirie:     ['STEP','RAMP','SIDEWALK','SIGNAGE','PARKING'],
  Transports: ['ELEVATOR','ESCALATOR_BROKEN','INACCESSIBLE_ENTRY','INACCESSIBLE_PLATFORM','INACCESSIBLE_STOP','NARROW_PASSAGE'],
};
