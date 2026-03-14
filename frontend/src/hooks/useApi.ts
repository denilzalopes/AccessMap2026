const AUTH_URL = import.meta.env.VITE_AUTH_API_URL || 'http://localhost:8080';

export async function apiFetch(url: string, options: RequestInit = {}): Promise<Response> {
  let token = localStorage.getItem('accessToken');

  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      ...options.headers,
    },
  });

  // Token expiré → refresh automatique
  if (res.status === 401 || res.status === 403) {
    const refreshToken = localStorage.getItem('refreshToken');
    if (refreshToken) {
      try {
        const refreshRes = await fetch(`${AUTH_URL}/api/auth/refresh`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refreshToken }),
        });
        if (refreshRes.ok) {
          const data = await refreshRes.json();
          localStorage.setItem('accessToken',  data.accessToken);
          localStorage.setItem('refreshToken', data.refreshToken);
          // Retry avec le nouveau token
          return fetch(url, {
            ...options,
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${data.accessToken}`,
              ...options.headers,
            },
          });
        }
      } catch (e) {
        localStorage.clear();
        window.location.href = '/login';
      }
    }
  }

  return res;
}
