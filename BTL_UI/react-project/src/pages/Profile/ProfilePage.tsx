import { Card, Button, Result, Spin } from 'antd';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CandidateProfile from './CandidateProfile';
import RecruiterProfile from './RecruiterProfile';
import { getStoredUser, ROLE_ADMIN, ROLE_CANDIDATE, ROLE_COMPANY } from '../../utils/auth';

const ProfilePage = () => {
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = getStoredUser();
    if (!user) {
      navigate('/login');
      return;
    }

    setUserRole(user.maVaiTro);
    setLoading(false);
  }, [navigate]);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (userRole === ROLE_COMPANY) return <RecruiterProfile />;
  if (userRole === ROLE_CANDIDATE) return <CandidateProfile />;

  if (userRole === ROLE_ADMIN) {
    return (
      <div style={{ minHeight: 'calc(100vh - 64px)', background: '#f5f5f5', padding: '24px' }}>
        <Card style={{ maxWidth: 720, margin: '0 auto' }}>
          <Result
            status="info"
            title="Tài khoản quản trị viên"
            subTitle="Quản trị viên sử dụng trang quản lý tin tuyển dụng."
            extra={<Button type="primary" onClick={() => navigate('/admin/jobs')}>Đến trang quản lý</Button>}
          />
        </Card>
      </div>
    );
  }

  return (
    <div style={{ minHeight: 'calc(100vh - 64px)', background: '#f5f5f5', padding: '24px' }}>
      <Card style={{ maxWidth: 720, margin: '0 auto' }}>
        <Result status="warning" title="Vai trò tài khoản không hợp lệ" extra={<Button onClick={() => navigate('/')}>Về trang chủ</Button>} />
      </Card>
    </div>
  );
};

export default ProfilePage;
