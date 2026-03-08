import axios, { AxiosInstance } from 'axios';
import type { AuthResponse, CreateReportRequest, MapReport, Report, User } from '../types';

// Client axios de base
const api: AxiosInstance = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' }
});

// Intercepteur requête — ajoute le token JWT
api.interceptors.request.use(config => {
  const token = localStorage.getItem('accessToken');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Intercepteur réponse — refresh token auto si 401
api.interceptors.response.use(
  response => response,
  async error => {
    if (error.response?.status === 401) {
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        try {
          const { data } = await axios.post<AuthResponse>('/api/auth/refresh', { refreshToken });
          localStorage.setItem('accessToken', data.accessToken);
          localStorage.setItem('refreshToken', data.refreshToken);
          error.config.headers.Authorization = `Bearer ${data.accessToken}`;
          return api.request(error.config);
        } catch {
          localStorage.clear();
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

// ── Auth ─────────────────────────────────────────────────────────────────────
export const authApi = {
  register: (email: string, password: string, displayName: string) =>
    api.post<AuthResponse>('/auth/register', { email, password, displayName }),

  login: (email: string, password: string) =>
    api.post<AuthResponse>('/auth/login', { email, password }),

  refresh: (refreshToken: string) =>
    api.post<AuthResponse>('/auth/refresh', { refreshToken })
};

// ── Reports ──────────────────────────────────────────────────────────────────
export const reportsApi = {
  getAll: () => api.get<Report[]>('/reports'),
  getById: (id: string) => api.get<Report>(`/reports/${id}`),
  getByUser: (userId: string) => api.get<Report[]>(`/reports/user/${userId}`),
  getNearby: (lat: number, lon: number, radius = 500) =>
    api.get<Report[]>('/reports/nearby', { params: { lat, lon, radius } }),
  create: (req: CreateReportRequest) => api.post<Report>('/reports', req),
  updateStatus: (id: string, status: string) =>
    api.patch<Report>(`/reports/${id}/status`, null, { params: { status } }),
  vote: (reportId: string, userId: string, type: 'UP' | 'DOWN') =>
    api.post<Report>(`/reports/${reportId}/vote`, null, { params: { userId, type } }),
  delete: (id: string) => api.delete(`/reports/${id}`)
};

// ── Map ───────────────────────────────────────────────────────────────────────
export const mapApi = {
  getData: (category?: string, status?: string) =>
    api.get<MapReport[]>('/map/reports', { params: { category, status } })
};

// ── Users ─────────────────────────────────────────────────────────────────────
export const usersApi = {
  getById: (id: string) => api.get<User>(`/users/${id}`),
  update: (id: string, data: Partial<User>) => api.put<User>(`/users/${id}`, data)
};

export default api;
