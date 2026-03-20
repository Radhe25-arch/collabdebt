import { BrowserRouter, Routes, Route, Navigate, useSearchParams } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useEffect } from 'react';
import { useAuthStore } from '@/store';
import { setAccessToken } from '@/lib/api';
import api from '@/lib/api';
import AppLayout from '@/components/layout/AppLayout';

import LandingPage     from '@/pages/LandingPage';
import LoginPage       from '@/pages/LoginPage';
import RegisterPage    from '@/pages/RegisterPage';
import OnboardingPage  from '@/pages/OnboardingPage';
import DashboardPage   from '@/pages/DashboardPage';
import CoursesPage     from '@/pages/CoursesPage';
import CoursePage      from '@/pages/CoursePage';
import LessonPage      from '@/pages/LessonPage';
import LeaderboardPage from '@/pages/LeaderboardPage';
import TournamentsPage from '@/pages/TournamentsPage';
import TournamentPage  from '@/pages/TournamentPage';
import BattlesPage     from '@/pages/BattlesPage';
import BattlePage      from '@/pages/BattlePage';
import QuestPage       from '@/pages/QuestPage';
import PortfolioPage   from '@/pages/PortfolioPage';
import MentorPage      from '@/pages/MentorPage';
import RoomsPage, { RoomPage } from '@/pages/RoomsPage';
import ProfilePage     from '@/pages/ProfilePage';
import CommunityPage   from '@/pages/CommunityPage';
import FriendsPage     from '@/pages/FriendsPage';
import SettingsPage    from '@/pages/SettingsPage';
import AdminPage       from '@/pages/AdminPage';

function AuthCallback() {
  const [params] = useSearchParams();
  const { setUser } = useAuthStore();

  useEffect(() => {
    const token = params.get('token');
    if (!token) { window.location.href = '/login'; return; }
    setAccessToken(token);
    api.get('/auth/me', { headers: { Authorization: `Bearer ${token}` } })
      .then(({ data }) => {
        setUser(data.user);
        const stored = JSON.parse(localStorage.getItem('codearena-auth') || '{}');
        stored.state = { user: data.user, isAuthenticated: true, isLoading: false };
        localStorage.setItem('codearena-auth', JSON.stringify(stored));
        window.location.href = data.user?.onboarded === false ? '/onboarding' : '/dashboard';
      })
      .catch(() => { window.location.href = '/login'; });
  }, []);

  return (
    <div style={{ minHeight: '100vh', background: '#0A0A0F', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'monospace' }}>
      signing you in...
    </div>
  );
}

function PrivateRoute({ children }) {
  const { isAuthenticated } = useAuthStore();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

function PublicRoute({ children }) {
  const { isAuthenticated } = useAuthStore();
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : children;
}

export default function App() {
  return (
    <BrowserRouter>
      <Toaster position="bottom-right" toastOptions={{
        style: { background: '#16161F', color: '#F0EEF8', border: '1px solid rgba(124,58,237,0.3)', fontFamily: "'JetBrains Mono', monospace", fontSize: '13px' },
        success: { iconTheme: { primary: '#00D9B5', secondary: '#0A0A0F' } },
        error:   { iconTheme: { primary: '#f87171', secondary: '#0A0A0F' } },
      }} />
      <Routes>
        <Route path="/"              element={<LandingPage />} />
        <Route path="/login"         element={<PublicRoute><LoginPage /></PublicRoute>} />
        <Route path="/register"      element={<PublicRoute><RegisterPage /></PublicRoute>} />
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route path="/onboarding"    element={<OnboardingPage />} />
        <Route path="/u/:username"   element={<ProfilePage />} />

        <Route element={<PrivateRoute><AppLayout /></PrivateRoute>}>
          <Route path="/dashboard"             element={<DashboardPage />} />
          <Route path="/courses"               element={<CoursesPage />} />
          <Route path="/courses/:slug"         element={<CoursePage />} />
          <Route path="/courses/:slug/:lesson" element={<LessonPage />} />
          <Route path="/leaderboard"           element={<LeaderboardPage />} />
          <Route path="/tournaments"           element={<TournamentsPage />} />
          <Route path="/tournaments/:id"       element={<TournamentPage />} />
          <Route path="/battles"               element={<BattlesPage />} />
          <Route path="/battles/:id"           element={<BattlePage />} />
          <Route path="/community"             element={<CommunityPage />} />
          <Route path="/friends"               element={<FriendsPage />} />
          <Route path="/quests"                element={<QuestPage />} />
          <Route path="/portfolio"             element={<PortfolioPage />} />
          <Route path="/mentor"                element={<MentorPage />} />
          <Route path="/rooms"                 element={<RoomsPage />} />
          <Route path="/rooms/:id"             element={<RoomPage />} />
          <Route path="/profile"              element={<ProfilePage />} />
          <Route path="/settings"             element={<SettingsPage />} />
          <Route path="/admin"                element={<AdminPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
