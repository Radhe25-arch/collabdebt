import React, { useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/globals.css';
import { useAuthStore } from './store';
import api, { setAccessToken, getAccessToken } from './lib/api';

function Root() {
  const { setUser, logout, isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated) return;
    const token = getAccessToken();
    if (token) {
      api.get('/auth/me', { headers: { Authorization: `Bearer ${token}` } })
        .then(({ data }) => setUser(data.user))
        .catch(() => {
          api.post('/auth/refresh', {}, { withCredentials: true })
            .then(({ data }) => { setAccessToken(data.accessToken); return api.get('/auth/me'); })
            .then(({ data }) => setUser(data.user))
            .catch(() => { if (!window.location.pathname.includes('/onboarding')) logout(); });
        });
    } else {
      api.post('/auth/refresh', {}, { withCredentials: true })
        .then(({ data }) => { setAccessToken(data.accessToken); return api.get('/auth/me'); })
        .then(({ data }) => setUser(data.user))
        .catch(() => { if (!window.location.pathname.includes('/onboarding')) logout(); });
    }
  }, []);

  return <App />;
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>
);
