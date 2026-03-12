export const CAT_MAP: Record<string, { label: string; color: string; group: string }> = {
  // Voirie
  STEP:                  { label: 'Marche / Escalier',      color: '#F97316', group: 'Voirie' },
  RAMP:                  { label: 'Rampe manquante',         color: '#4B55E8', group: 'Voirie' },
  SIDEWALK:              { label: 'Trottoir inaccessible',   color: '#06B6D4', group: 'Voirie' },
  SIGNAGE:               { label: 'Signalétique inadaptée',  color: '#E879A0', group: 'Voirie' },
  PARKING:               { label: 'Stationnement PMR',       color: '#9CA3AF', group: 'Voirie' },
  // Transports publics
  ELEVATOR:              { label: 'Ascenseur en panne',      color: '#F59E0B', group: 'Transports publics' },
  ESCALATOR_BROKEN:      { label: 'Escalator en panne',      color: '#F97316', group: 'Transports publics' },
  NO_ELEVATOR:           { label: 'Pas d ascenseur',         color: '#EF4444', group: 'Transports publics' },
  NO_ESCALATOR:          { label: 'Pas d escalator',         color: '#DC2626', group: 'Transports publics' },
  INACCESSIBLE_ENTRY:    { label: 'Entrée inaccessible',     color: '#8B5CF6', group: 'Transports publics' },
  INACCESSIBLE_PLATFORM: { label: 'Quai inaccessible',       color: '#7C3AED', group: 'Transports publics' },
  INACCESSIBLE_STOP:     { label: 'Arrêt bus inaccessible',  color: '#EC4899', group: 'Transports publics' },
  NARROW_PASSAGE:        { label: 'Passage trop étroit',     color: '#64748B', group: 'Transports publics' },
};

export const CAT_GROUPS: Record<string, string[]> = {
  'Voirie':           ['STEP','RAMP','SIDEWALK','SIGNAGE','PARKING'],
  'Transports publics': ['ELEVATOR','ESCALATOR_BROKEN','NO_ELEVATOR','NO_ESCALATOR','INACCESSIBLE_ENTRY','INACCESSIBLE_PLATFORM','INACCESSIBLE_STOP','NARROW_PASSAGE'],
};
