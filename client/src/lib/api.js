import axios from 'axios';
import toast from 'react-hot-toast';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  withCredentials: true,
  timeout: 15000,
});

let accessToken = null;

export function setAccessToken(token) {
  accessToken = token;
  if (token) localStorage.setItem('_at', token);
  else localStorage.removeItem('_at');
}

export function clearAccessToken() {
  accessToken = null;
  localStorage.removeItem('_at');
}

export function getAccessToken() {
  if (!accessToken) accessToken = localStorage.getItem('_at');
  return accessToken;
}

api.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

let refreshing = false;
let queue = [];
const SKIP_REFRESH_URLS = ['/auth/login', '/auth/register', '/auth/refresh', '/auth/logout'];

// Debounce 500 error toasts — max 1 per 10 seconds to prevent toast spam
let lastErrorToast = 0;
const ERROR_TOAST_COOLDOWN = 10000;

// Routes where 500 errors should NOT trigger a toast (background / polling)
const SILENT_500_ROUTES = ['/notifications', '/leaderboard', '/social', '/community', '/friends'];

api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const original = err.config;
    const url = original?.url || '';
    const isAuthRoute = SKIP_REFRESH_URLS.some((r) => url.includes(r));

    if (err.response?.status === 401 && !original._retry && !isAuthRoute) {
      original._retry = true;
      if (refreshing) {
        return new Promise((resolve, reject) => queue.push({ resolve, reject }))
          .then(() => api(original));
      }
      refreshing = true;
      try {
        const { data } = await axios.post(`${api.defaults.baseURL}/auth/refresh`, {}, { withCredentials: true });
        setAccessToken(data.accessToken);
        queue.forEach(({ resolve }) => resolve());
        queue = [];
        original.headers.Authorization = `Bearer ${data.accessToken}`;
        return api(original);
      } catch (refreshErr) {
        queue.forEach(({ reject }) => reject(refreshErr));
        queue = [];
        clearAccessToken();
        try {
          const stored = JSON.parse(localStorage.getItem('skillforge-auth') || '{}');
          stored.state = { ...stored.state, user: null, isAuthenticated: false };
          localStorage.setItem('skillforge-auth', JSON.stringify(stored));
        } catch (_) {}
        window.location.href = '/login';
        return Promise.reject(refreshErr);
      } finally {
        refreshing = false;
      }
    }
    const message = err.response?.data?.error || err.message;
    if (err.response?.status >= 500) {
      const isSilentRoute = SILENT_500_ROUTES.some(r => url.includes(r));
      if (!isSilentRoute) {
        const now = Date.now();
        if (now - lastErrorToast > ERROR_TOAST_COOLDOWN) {
          lastErrorToast = now;
          toast.error('Server error. Try again.');
        }
      }
    }
    return Promise.reject({ ...err, message });
  }
);

export default api;
