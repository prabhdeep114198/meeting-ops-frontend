import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Sidebar } from './components/Navigation/Sidebar';
import { Header } from './components/Navigation/Header';

// 10 Screens
import { Login } from './pages/Login';
import { MeetingsList } from './pages/MeetingsList';
import { NewMeeting } from './pages/NewMeeting';
import { MeetingDetail } from './pages/MeetingDetail';
import { ReviewQueue } from './pages/ReviewQueue';
import { DraftActionDetail } from './pages/DraftActionDetail';
import { HistoryArchive } from './pages/HistoryArchive';
import { AdminIntegrations } from './pages/AdminIntegrations';
import { AdminTeam } from './pages/AdminTeam';
import { OpsDashboard } from './pages/OpsDashboard';

const AppLayout = () => {
  const location = useLocation();
  const isLoginPage = location.pathname === '/login' || location.pathname === '/';

  if (isLoginPage) {
    return (
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    );
  }

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content">
        <Header />
        <Routes>
          <Route path="/dashboard" element={<OpsDashboard />} />
          <Route path="/meetings" element={<MeetingsList />} />
          <Route path="/meetings/new" element={<NewMeeting />} />
          <Route path="/meetings/:id" element={<MeetingDetail />} />
          <Route path="/review-queue" element={<ReviewQueue />} />
          <Route path="/review-queue/:draftActionId" element={<DraftActionDetail />} />
          <Route path="/history" element={<HistoryArchive />} />
          <Route path="/admin/integrations" element={<AdminIntegrations />} />
          <Route path="/admin/team" element={<AdminTeam />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <AppLayout />
      </Router>
    </AuthProvider>
  );
}
