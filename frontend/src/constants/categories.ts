export const CAT_MAP: Record<string, { label: string; color: string; group: string }> = {
  // Voirie
  STEP:                  { label: 'Marche / Escalier',        color: '#F97316', group: 'Voirie' },
  RAMP:                  { label: 'Rampe manquante',           color: '#4B55E8', group: 'Voirie' },
  SIDEWALK:              { label: 'Trottoir inaccessible',     color: '#06B6D4', group: 'Voirie' },
  SIGNAGE:               { label: 'Signalétique inadaptée',    color: '#E879A0', group: 'Voirie' },
  PARKING:               { label: 'Stationnement PMR',         color: '#9CA3AF', group: 'Voirie' },
  // Transports — en panne
  ELEVATOR:              { label: 'Ascenseur en panne',        color: '#F59E0B', group: 'En panne' },
  ESCALATOR_BROKEN:      { label: 'Escalator en panne',        color: '#F97316', group: 'En panne' },
  // Transports — absent
  NO_ELEVATOR:           { label: 'Pas d ascenseur',           color: '#EF4444', group: 'Absent' },
  NO_ESCALATOR:          { label: 'Pas d escalator',           color: '#DC2626', group: 'Absent' },
  // Transports — accès
  INACCESSIBLE_ENTRY:    { label: 'Entrée inaccessible',       color: '#8B5CF6', group: 'Accès' },
  INACCESSIBLE_PLATFORM: { label: 'Quai inaccessible',         color: '#7C3AED', group: 'Accès' },
  INACCESSIBLE_STOP:     { label: 'Arrêt bus inaccessible',    color: '#EC4899', group: 'Accès' },
  NARROW_PASSAGE:        { label: 'Passage trop étroit',       color: '#64748B', group: 'Accès' },
};

export const CAT_GROUPS: Record<string, string[]> = {
  'Voirie':    ['STEP','RAMP','SIDEWALK','SIGNAGE','PARKING'],
  'En panne':  ['ELEVATOR','ESCALATOR_BROKEN'],
  'Absent':    ['NO_ELEVATOR','NO_ESCALATOR'],
  'Accès':     ['INACCESSIBLE_ENTRY','INACCESSIBLE_PLATFORM','INACCESSIBLE_STOP','NARROW_PASSAGE'],
};
