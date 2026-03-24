import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import viVN from 'antd/locale/vi_VN';
import MainLayout from './components/Layout/MainLayout';
import HomePage from './pages/Home/HomePage';
import LoginPage from './pages/Auth/LoginPage';
import RegisterPage from './pages/Auth/RegisterPage';
import JobListPage from './pages/Jobs/JobListPage';
import JobFilterPage from './pages/Jobs/JobFilterPage';
import TestConnection from './pages/TestConnection';
import './App.css';

function App() {
  return (
    <ConfigProvider locale={viVN}>
      <Router>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<HomePage />} />
            <Route path="login" element={<LoginPage />} />
            <Route path="register" element={<RegisterPage />} />
            <Route path="jobs" element={<JobListPage />} />
            <Route path="jobs/filter" element={<JobFilterPage />} />
            <Route path="test-connection" element={<TestConnection />} />
          </Route>
        </Routes>
      </Router>
    </ConfigProvider>
  );
}

export default App;