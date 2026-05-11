import { Layout, Button, Space, Dropdown } from 'antd';
import { UserOutlined, LogoutOutlined, SettingOutlined, DashboardOutlined, CalendarOutlined, FileTextOutlined, GiftOutlined, TeamOutlined } from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import type { NguoiDung } from '../../types';
import NotificationBell from '../Notifications/NotificationBell';

const { Header: AntHeader } = Layout;

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState<NguoiDung | null>(null);

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        setUser(JSON.parse(userStr));
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/');
  };

  const menuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: 'Thông tin cá nhân',
      onClick: () => navigate('/profile')
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: 'Cài đặt',
      onClick: () => {}
    },
    {
      type: 'divider' as const
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Đăng xuất',
      onClick: handleLogout
    }
  ];

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  const getButtonStyle = (path: string) => ({
    color: '#fff',
    background: isActive(path) ? '#1890ff' : 'transparent',
    borderRadius: '4px',
    transition: 'all 0.3s ease',
    transform: isActive(path) ? 'scale(1.05)' : 'scale(1)',
  });

  return (
    <AntHeader style={{ 
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 20px',
      background: '#001529'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '30px' }}>
        <div style={{ 
          color: '#fff', 
          fontSize: '20px', 
          fontWeight: 'bold',
          cursor: 'pointer'
        }} onClick={() => navigate('/')}>
          VietHire
        </div>
        
        <Space size="middle">
          <Button 
            type="link" 
            style={getButtonStyle('/')} 
            onClick={() => navigate('/')}
          >
            Trang chủ
          </Button>
          <Button 
            type="link" 
            style={getButtonStyle('/jobs')} 
            onClick={() => navigate('/jobs')}
          >
            Việc làm
          </Button>
          {user && user.maVaiTro === 2 && (
            <>
              <Button 
                type="link" 
                style={getButtonStyle('/company/dashboard')} 
                onClick={() => navigate('/company/dashboard')}
              >
                <DashboardOutlined /> Dashboard
              </Button>
              <Button 
                type="link" 
                style={getButtonStyle('/company/applications')} 
                onClick={() => navigate('/company/applications')}
              >
                <TeamOutlined /> Đơn ứng tuyển
              </Button>
              <Button 
                type="link" 
                style={getButtonStyle('/company/interviews')} 
                onClick={() => navigate('/company/interviews')}
              >
                <CalendarOutlined /> Lịch phỏng vấn
              </Button>
              <Button 
                type="link" 
                style={getButtonStyle('/company/candidates')} 
                onClick={() => navigate('/company/candidates')}
              >
                <TeamOutlined /> Tìm ứng viên
              </Button>
              <Button 
                type="link" 
                style={getButtonStyle('/company/offers')} 
                onClick={() => navigate('/company/offers')}
              >
                <GiftOutlined /> Thư mời đã gửi
              </Button>
            </>
          )}
          {user && user.maVaiTro === 3 && (
            <>
              <Button 
                type="link" 
                style={getButtonStyle('/candidate/applications')} 
                onClick={() => navigate('/candidate/applications')}
              >
                <FileTextOutlined /> Đơn ứng tuyển
              </Button>
              <Button 
                type="link" 
                style={getButtonStyle('/candidate/interviews')} 
                onClick={() => navigate('/candidate/interviews')}
              >
                <CalendarOutlined /> Lịch phỏng vấn
              </Button>
              <Button 
                type="link" 
                style={getButtonStyle('/candidate/offers')} 
                onClick={() => navigate('/candidate/offers')}
              >
                <GiftOutlined /> Thư mời
              </Button>
            </>
          )}
          {user && user.maVaiTro === 1 && (
            <Button 
              type="link" 
              style={getButtonStyle('/admin/jobs')} 
              onClick={() => navigate('/admin/jobs')}
            >
              <DashboardOutlined /> Quản lý tin
            </Button>
        
          )}
        </Space>
      </div>

      <Space size="middle">
        {user ? (
          <>
            <NotificationBell maNguoiDung={user.maNguoiDung} />
            <Dropdown menu={{ items: menuItems }} placement="bottomRight">
              <Button 
                type="link" 
                style={{ 
                  color: '#fff',
                  background: '#1890ff',
                  borderRadius: '4px',
                  padding: '4px 15px',
                  transition: 'all 0.3s ease'
                }}
              >
                <UserOutlined /> {user.hoTen}
              </Button>
            </Dropdown>
          </>
        ) : (
          <>
            <Button onClick={() => navigate('/login')}>
              Đăng nhập
            </Button>
            <Button type="primary" onClick={() => navigate('/register')}>
              Đăng ký
            </Button>
          </>
        )}
      </Space>
    </AntHeader>
  );
};

export default Header;