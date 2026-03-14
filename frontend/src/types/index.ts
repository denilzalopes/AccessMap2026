// ── Utilisateurs ────────────────────────────────────────────────────────────
export type Role = 'CONTRIBUTOR' | 'MODERATOR' | 'ADMIN';

export interface User {
  id: string;
  email: string;
  displayName: string;
  role: Role;
  accessibilityPrefs: AccessibilityPrefs;
  createdAt: string;
}

export interface AccessibilityPrefs {
  highVisibility: boolean;
  voiceReading:   boolean;
  textSize:       'small' | 'medium' | 'large';
}

// ── Authentification ─────────────────────────────────────────────────────────
export interface AuthResponse {
  accessToken:  string;
  refreshToken: string;
  userId:       string;
  email:        string;
  displayName:  string;
  role:         Role;
  tokenType:    string;
}

// ── Signalements ─────────────────────────────────────────────────────────────
export type Category =
  | 'STEP' | 'RAMP' | 'SIDEWALK' | 'SIGNAGE' | 'PARKING'
  | 'ELEVATOR' | 'ESCALATOR_BROKEN'
  | 'NO_ELEVATOR' | 'NO_ESCALATOR'
  | 'INACCESSIBLE_ENTRY' | 'INACCESSIBLE_PLATFORM' | 'INACCESSIBLE_STOP' | 'NARROW_PASSAGE';

export type ReportStatus = 'PENDING' | 'VALIDATED' | 'REJECTED' | 'RESOLVED';
export type VoteType = 'UP' | 'DOWN';

export interface Report {
  id:           string;
  userId:       string;
  authorName:   string;
  authorEmail:  string;
  title:        string;
  description?: string;
  category:     Category;
  status:       ReportStatus;
  latitude:     number;
  longitude:    number;
  imageUrl?:    string;
  createdAt:    string;
  updatedAt?:   string;
  votesUp?:     number;
  votesDown?:   number;
}

export interface MapReport {
  id:           string;
  latitude:     number;
  longitude:    number;
  category:     Category;
  status:       ReportStatus;
  votesUp?:     number;
  votesDown?:   number;
  description?: string;
}

export interface CreateReportRequest {
  userId:       string;
  authorName:   string;
  authorEmail:  string;
  title:        string;
  description?: string;
  category:     Category;
  latitude:     number;
  longitude:    number;
  imageUrl?:    string;
}

// ── Labels UI ─────────────────────────────────────────────────────────────────
export const CATEGORY_LABELS: Record<Category, string> = {
  STEP:                  'Marche / Escalier',
  RAMP:                  'Rampe manquante',
  SIDEWALK:              'Trottoir impraticable',
  SIGNAGE:               'Signalétique absente',
  PARKING:               'Stationnement inaccessible',
  ELEVATOR:              'Ascenseur en panne',
  ESCALATOR_BROKEN:      'Escalator en panne',
  NO_ELEVATOR:           'Ascenseur absent',
  NO_ESCALATOR:          'Escalator absent',
  INACCESSIBLE_ENTRY:    'Entrée inaccessible',
  INACCESSIBLE_PLATFORM: 'Quai inaccessible',
  INACCESSIBLE_STOP:     'Arrêt inaccessible',
  NARROW_PASSAGE:        'Passage étroit',
};

export const CATEGORY_ICONS: Record<Category, string> = {
  STEP:                  '🪜',
  RAMP:                  '⛰️',
  SIDEWALK:              '🚶',
  SIGNAGE:               '🔷',
  PARKING:               '🅿️',
  ELEVATOR:              '🛗',
  ESCALATOR_BROKEN:      '🔧',
  NO_ELEVATOR:           '🚫🛗',
  NO_ESCALATOR:          '🚫',
  INACCESSIBLE_ENTRY:    '🚪',
  INACCESSIBLE_PLATFORM: '🚉',
  INACCESSIBLE_STOP:     '🚌',
  NARROW_PASSAGE:        '↔️',
};

export const STATUS_COLORS: Record<ReportStatus, string> = {
  PENDING:   '#FBBF24',
  VALIDATED: '#34D399',
  REJECTED:  '#F87171',
  RESOLVED:  '#60A5FA',
};

export const STATUS_LABELS: Record<ReportStatus, string> = {
  PENDING:   'En attente',
  VALIDATED: 'Validé',
  REJECTED:  'Rejeté',
  RESOLVED:  'Résolu',
};
