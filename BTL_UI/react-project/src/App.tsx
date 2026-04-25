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
            <Route path="company/dashboard" element={<CompanyDashboard />} />
            <Route path="company/interviews" element={<InterviewSchedulePage />} />
            <Route path="company/applications" element={<ManageApplicationsPage />} />
            <Route path="company/candidates" element={<SearchCandidatesPage />} />
            <Route path="company/candidates/:maHoSo" element={<CandidateDetailPage />} />
            <Route path="company/offers" element={<ManageOffersPage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="recruiter/profile" element={<RecruiterProfile />} />
            <Route path="candidate/applications" element={<MyApplicationsPage />} />
            <Route path="candidate/interviews" element={<MyInterviewsPage />} />
            <Route path="candidate/offers" element={<MyOffersPage />} />
            <Route path="candidate/resume" element={<CandidateResumePage />} />
            <Route path="admin/jobs" element={<AdminJobApprovalPage />} />
            <Route path="notifications" element={<NotificationsPage />} />
            <Route path="test-connection" element={<TestConnection />} />
          </Route>
        </Routes>
      </Router>
    </ConfigProvider>
  );
}

export default App;