import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import viVN from 'antd/locale/vi_VN';
import MainLayout from './components/Layout/MainLayout';
import HomePage from './pages/Home/HomePage';
import LoginPage from './pages/Auth/LoginPage';
import RegisterPage from './pages/Auth/RegisterPage';
import JobListPage from './pages/Jobs/JobListPage';
import JobDetailPage from './pages/Jobs/JobDetailPage';
import JobFilterPage from './pages/Jobs/JobFilterPage';
import SavedJobsPage from './pages/Jobs/SavedJobsPage';
import CompanyDashboard from './pages/Company/CompanyDashboard';
import InterviewSchedulePage from './pages/Company/InterviewSchedulePage';
import ManageApplicationsPage from './pages/Company/ManageApplicationsPage';
import SearchCandidatesPage from './pages/Company/SearchCandidatesPage';
import CandidateDetailPage from './pages/Company/CandidateDetailPage';
import ManageOffersPage from './pages/Company/ManageOffersPage';
import ProfilePage from './pages/Profile/ProfilePage';
import RecruiterProfile from './pages/Profile/RecruiterProfile';
import MyApplicationsPage from './pages/Candidate/MyApplicationsPage';
import MyInterviewsPage from './pages/Candidate/MyInterviewsPage';
import MyOffersPage from './pages/Candidate/MyOffersPage';
import CandidateResumePage from './pages/Candidate/CandidateResumePage';
import AdminJobApprovalPage from './pages/Admin/AdminJobApprovalPage';
import NotificationsPage from './pages/Notifications/NotificationsPage';
import TestConnection from './pages/TestConnection';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import { ROLE_ADMIN, ROLE_CANDIDATE, ROLE_COMPANY } from './utils/auth';
import './App.css';

function App() {
  return (
    <ConfigProvider locale={viVN}>
      <Router>
        <Routes>
          {/* Routes without layout (Login, Register) */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          
          {/* Routes with layout */}
          <Route path="/" element={<MainLayout />}>
            <Route index element={<HomePage />} />
            <Route path="jobs" element={<JobListPage />} />
            <Route path="jobs/:id" element={<JobDetailPage />} />
            <Route path="jobs/filter" element={<JobFilterPage />} />
            <Route path="jobs/saved" element={<ProtectedRoute allowedRoles={[ROLE_CANDIDATE]}><SavedJobsPage /></ProtectedRoute>} />
            <Route path="company/dashboard" element={<ProtectedRoute allowedRoles={[ROLE_COMPANY]}><CompanyDashboard /></ProtectedRoute>} />
            <Route path="company/interviews" element={<ProtectedRoute allowedRoles={[ROLE_COMPANY]}><InterviewSchedulePage /></ProtectedRoute>} />
            <Route path="company/applications" element={<ProtectedRoute allowedRoles={[ROLE_COMPANY]}><ManageApplicationsPage /></ProtectedRoute>} />
            <Route path="company/candidates" element={<ProtectedRoute allowedRoles={[ROLE_COMPANY]}><SearchCandidatesPage /></ProtectedRoute>} />
            <Route path="company/candidates/:maHoSo" element={<ProtectedRoute allowedRoles={[ROLE_COMPANY]}><CandidateDetailPage /></ProtectedRoute>} />
            <Route path="company/offers" element={<ProtectedRoute allowedRoles={[ROLE_COMPANY]}><ManageOffersPage /></ProtectedRoute>} />
            <Route path="profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
            <Route path="recruiter/profile" element={<ProtectedRoute allowedRoles={[ROLE_COMPANY]}><RecruiterProfile /></ProtectedRoute>} />
            <Route path="candidate/applications" element={<ProtectedRoute allowedRoles={[ROLE_CANDIDATE]}><MyApplicationsPage /></ProtectedRoute>} />
            <Route path="candidate/interviews" element={<ProtectedRoute allowedRoles={[ROLE_CANDIDATE]}><MyInterviewsPage /></ProtectedRoute>} />
            <Route path="candidate/offers" element={<ProtectedRoute allowedRoles={[ROLE_CANDIDATE]}><MyOffersPage /></ProtectedRoute>} />
            <Route path="candidate/resume" element={<ProtectedRoute allowedRoles={[ROLE_CANDIDATE]}><CandidateResumePage /></ProtectedRoute>} />
            <Route path="admin/jobs" element={<ProtectedRoute allowedRoles={[ROLE_ADMIN]}><AdminJobApprovalPage /></ProtectedRoute>} />
            <Route path="notifications" element={<ProtectedRoute><NotificationsPage /></ProtectedRoute>} />
            <Route path="test-connection" element={<TestConnection />} />
          </Route>
        </Routes>
      </Router>
    </ConfigProvider>
  );
}

export default App;