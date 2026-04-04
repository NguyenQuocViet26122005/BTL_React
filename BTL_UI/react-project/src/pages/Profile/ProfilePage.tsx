import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Spin } from 'antd';
import CandidateProfile from './CandidateProfile';
import RecruiterProfile from './RecruiterProfile';

const ProfilePage = () => {
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      navigate('/login');
      return;
    }

    try {
      const user = JSON.parse(userStr);
      setUserRole(user.maVaiTro);
    } catch (error) {
      console.error('Error parsing user data:', error);
      navigate('/login');
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh' 
      }}>
        <Spin size="large" />
      </div>
    );
  }

  // MaVaiTro: 1 = QuanTriVien, 2 = NhaTuyenDung, 3 = UngVien
  if (userRole === 2) {
    return <RecruiterProfile />;
  } else if (userRole === 3) {
    return <CandidateProfile />;
  } else {
    // Admin hoac vai tro khac - co the tao AdminProfile sau
    return <CandidateProfile />;
  }
};

export default ProfilePage;