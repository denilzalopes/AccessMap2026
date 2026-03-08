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
  voiceReading: boolean;
  textSize: 'small' | 'medium' | 'large';
}

// ── Authentification ─────────────────────────────────────────────────────────
export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  userId: string;
  email: string;
  displayName: string;
  role: Role;
  tokenType: string;
}

// ── Signalements ─────────────────────────────────────────────────────────────
export type Category = 'STEP' | 'RAMP' | 'ELEVATOR' | 'SIDEWALK' | 'SIGNAGE' | 'PARKING';
export type ReportStatus = 'PENDING' | 'VALIDATED' | 'REJECTED' | 'RESOLVED';
export type VoteType = 'UP' | 'DOWN';

export interface Report {
  id: string;
  latitude: number;
  longitude: number;
  category: Category;
  description?: string;
  photoUrl?: string;
  status: ReportStatus;
  createdBy: string;
  createdAt: string;
  votesUp: number;
  votesDown: number;
}

export interface MapReport {
  id: string;
  latitude: number;
  longitude: number;
  category: Category;
  status: ReportStatus;
  votesUp: number;
  votesDown: number;
  description?: string;
}

export interface CreateReportRequest {
  latitude: number;
  longitude: number;
  category: Category;
  description?: string;
  photoUrl?: string;
  createdBy: string;
}

// ── Labels UI ─────────────────────────────────────────────────────────────────
export const CATEGORY_LABELS: Record<Category, string> = {
  STEP: 'Marche',
  RAMP: 'Rampe',
  ELEVATOR: 'Ascenseur',
  SIDEWALK: 'Trottoir',
  SIGNAGE: 'Signalétique',
  PARKING: 'Stationnement'
};

export const CATEGORY_ICONS: Record<Category, string> = {
  STEP: '🪜',
  RAMP: '⛰️',
  ELEVATOR: '🛗',
  SIDEWALK: '🚶',
  SIGNAGE: '🔷',
  PARKING: '🅿️'
};

export const STATUS_COLORS: Record<ReportStatus, string> = {
  PENDING: '#FBBF24',
  VALIDATED: '#34D399',
  REJECTED: '#F87171',
  RESOLVED: '#60A5FA'
};

export const STATUS_LABELS: Record<ReportStatus, string> = {
  PENDING: 'En attente',
  VALIDATED: 'Validé',
  REJECTED: 'Rejeté',
  RESOLVED: 'Résolu'
};
