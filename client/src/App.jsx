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
import TypingTestPage  from '@/pages/TypingTestPage';
import RoomsPage, { RoomPage } from '@/pages/RoomsPage';
import SupportPage     from '@/pages/SupportPage';
import PrivacyPage     from '@/pages/PrivacyPage';
import ProfilePage     from '@/pages/ProfilePage';
import SettingsPage    from '@/pages/SettingsPage';
import AdminPage       from '@/pages/AdminPage';
import JobsPage        from '@/pages/JobsPage';
import EmployerPage    from '@/pages/EmployerPage';
import ForumPage       from '@/pages/ForumPage';

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
        const stored = JSON.parse(localStorage.getItem('skillforge-auth') || '{}');
        stored.state = { user: data.user, isAuthenticated: true, isLoading: false };
        localStorage.setItem('skillforge-auth', JSON.stringify(stored));
        window.location.href = data.user?.onboarded === false ? '/onboarding' : '/dashboard';
      })
      .catch(() => { window.location.href = '/login'; });
  }, []);

  return (
    <div style={{
      minHeight: '100vh', background: '#000000', color: '#FFFFFF',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: "'JetBrains Mono', monospace"
    }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{
          width: 24, height: 24, border: '1.5px solid rgba(255,255,255,0.1)',
          borderTopColor: '#3B82F6', borderRadius: '50%',
          animation: 'spin 0.8s linear infinite', margin: '0 auto 12px'
        }} />
        <span style={{ fontSize: 11, color: '#666', textTransform: 'uppercase', letterSpacing: '0.15em' }}>
          AUTHENTICATING...
        </span>
      </div>
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
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: 'rgba(0,0,0,0.92)',
            backdropFilter: 'blur(40px)',
            color: '#FFFFFF',
            border: '1px solid rgba(255,255,255,0.08)',
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '11px',
            borderRadius: '4px',
            letterSpacing: '0.05em',
            boxShadow: 'none',
          },
          success: { iconTheme: { primary: '#10B981', secondary: '#000000' } },
          error:   { iconTheme: { primary: '#DC2626', secondary: '#000000' } },
        }}
      />
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
          <Route path="/quests"                element={<QuestPage />} />
          <Route path="/portfolio"             element={<PortfolioPage />} />
          <Route path="/mentor"                element={<MentorPage />} />
          <Route path="/typing-test"           element={<TypingTestPage />} />
          <Route path="/jobs"                  element={<JobsPage />} />
          <Route path="/employer"              element={<EmployerPage />} />
          <Route path="/forum"                 element={<ForumPage />} />
          <Route path="/rooms"                 element={<RoomsPage />} />
          <Route path="/rooms/:id"             element={<RoomPage />} />
          <Route path="/support"               element={<SupportPage />} />
          <Route path="/privacy"               element={<PrivacyPage />} />
          <Route path="/profile"               element={<ProfilePage />} />
          <Route path="/settings"              element={<SettingsPage />} />
          <Route path="/admin"                 element={<AdminPage />} />
          <Route path="*"                      element={<Navigate to="/dashboard" replace />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
