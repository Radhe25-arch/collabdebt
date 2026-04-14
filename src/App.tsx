import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LandingLayout } from './layouts/LandingLayout';
import { AppLayout } from './layouts/AppLayout';
import { Landing } from './pages/Landing';
import { Dashboard } from './pages/Dashboard';
import { Courses } from './pages/Courses';
import { CourseDetail } from './pages/CourseDetail';
import { Leaderboard } from './pages/Leaderboard';
import { Tournaments } from './pages/Tournaments';
import { Battles } from './pages/Battles';
import { Quests } from './pages/Quests';
import { AIMentor } from './pages/AIMentor';
import { Forum } from './pages/Forum';
import { Profile } from './pages/Profile';
import { Settings } from './pages/Settings';
import { Workspaces } from './pages/Workspaces';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Landing */}
        <Route path="/" element={<LandingLayout />}>
          <Route index element={<Landing />} />
        </Route>

        {/* App Dashboard */}
        <Route path="/app" element={<AppLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="courses" element={<Courses />} />
          <Route path="courses/:id" element={<CourseDetail />} />
          <Route path="leaderboard" element={<Leaderboard />} />
          <Route path="tournaments" element={<Tournaments />} />
          <Route path="workspaces" element={<Workspaces />} />
          <Route path="battles" element={<Battles />} />
          <Route path="quests" element={<Quests />} />
          <Route path="mentor" element={<AIMentor />} />
          <Route path="forum" element={<Forum />} />
          <Route path="profile" element={<Profile />} />
          <Route path="settings" element={<Settings />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
