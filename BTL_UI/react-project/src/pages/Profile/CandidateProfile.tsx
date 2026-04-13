import { Card, Avatar, Typography, Row, Col, Empty, Button, Divider } from 'antd';
import { UserOutlined, FileTextOutlined, HeartOutlined, MailOutlined, LockOutlined, CreditCardOutlined, LogoutOutlined, DownOutlined, UpOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { NguoiDung } from '../../types';
import { CandidateResumeContent } from '../Candidate/CandidateResumePage';

const { Title, Text } = Typography;

const CandidateProfile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<NguoiDung | null>(null);
  const [activeMenu, setActiveMenu] = useState('applied-jobs');
  const [expandedSections, setExpandedSections] = useState<string[]>(['job-management']);

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      setUser(JSON.parse(userStr));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const toggleSection = (key: string) => {
    if (expandedSections.includes(key)) {
      setExpandedSections(expandedSections.filter(k => k !== key));
    } else {
      setExpandedSections([...expandedSections, key]);
    }
  };

  const menuItems = [
    {
      key: 'job-management',
      icon: <FileTextOutlined />,
      label: 'Quản lý tìm việc',
      children: [
        { key: 'saved-jobs', label: 'Việc làm đã lưu' },
        { key: 'applied-jobs', label: 'Việc làm đã ứng tuyển' },
        { key: 'suitable-jobs', label: 'Việc làm phù hợp với bạn' },
        { key: 'job-settings', label: 'Cài đặt gợi ý việc làm' },
      ]
    },
    {
      key: 'cv-management',
      icon: <HeartOutlined />,
      label: 'Quản lý CV & Cover letter',
      children: [
        { key: 'my-cv', label: 'CV của tôi' },
        { key: 'cover-letter', label: 'Cover Letter của tôi' },
        { key: 'recruiter-connect', label: 'Nhà tuyển dụng muốn kết nối với bạn' },
        { key: 'profile-views', label: 'Nhà tuyển dụng xem hồ sơ' },
      ]
    },
    {
      key: 'email-settings',
      icon: <MailOutlined />,
      label: 'Cài đặt email & thông báo',
      children: [
        { key: 'job-notifications', label: 'Cài đặt thông báo việc làm' },
        { key: 'email-settings-sub', label: 'Cài đặt nhận email' },
      ]
    },
    {
      key: 'security',
      icon: <LockOutlined />,
      label: 'Cá nhân & Bảo mật',
      children: []
    },
    {
      key: 'upgrade',
      icon: <CreditCardOutlined />,
      label: 'Nâng cấp tài khoản',
      children: []
    },
  ];

  const handleMenuClick = (key: string) => {
    setActiveMenu(key);
  };

  const renderContent = () => {
    if (activeMenu === 'my-cv') {
      return (
        <div style={{ padding: '24px' }}>
          <Title level={4} style={{ marginBottom: 24 }}>CV của tôi</Title>
          <CandidateResumeContent />
        </div>
      );
    }

    if (activeMenu === 'applied-jobs') {
      return (
        <div style={{ textAlign: 'center', padding: '80px 20px' }}>
          <div style={{ marginBottom: 24 }}>
            <svg width="120" height="120" viewBox="0 0 120 120" style={{ margin: '0 auto' }}>
              <rect x="20" y="30" width="80" height="60" rx="4" fill="#e8f5e9" stroke="#4caf50" strokeWidth="2"/>
              <circle cx="60" cy="50" r="15" fill="#4caf50" opacity="0.3"/>
              <path d="M 45 65 Q 60 75 75 65" stroke="#4caf50" strokeWidth="3" fill="none"/>
            </svg>
          </div>
          <Title level={4} style={{ marginBottom: 12 }}>
            Bạn chưa ứng tuyển công việc nào!
          </Title>
          <Text type="secondary" style={{ fontSize: '15px', display: 'block', marginBottom: 24 }}>
            Bắt đầu sự nghiệp mơ ước với hàng nghìn việc làm chất lượng tại VietHire
          </Text>
          <Button 
            type="primary" 
            size="large"
            onClick={() => navigate('/jobs')}
            style={{ 
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              border: 'none',
              height: '44px',
              padding: '0 32px',
              fontSize: '16px'
            }}
          >
            Tìm việc ngay
          </Button>
        </div>
      );
    }

    if (activeMenu === 'security') {
      return (
        <div style={{ padding: '24px' }}>
          <Title level={4} style={{ marginBottom: 24 }}>Thông tin cá nhân</Title>
          <div style={{ marginBottom: 16 }}>
            <Text strong>Email: </Text>
            <Text>{user?.email}</Text>
          </div>
          <div style={{ marginBottom: 16 }}>
            <Text strong>Số điện thoại: </Text>
            <Text>{user?.soDienThoai || '4343543545'}</Text>
          </div>
        </div>
      );
    }

    if (activeMenu === 'upgrade') {
      return (
        <div style={{ textAlign: 'center', padding: '80px 20px' }}>
          <Empty description="Chưa có gói nâng cấp" />
        </div>
      );
    }

    return (
      <div style={{ textAlign: 'center', padding: '80px 20px' }}>
        <Empty description="Nội dung đang cập nhật" />
      </div>
    );
  };

  return (
    <div style={{ 
      minHeight: 'calc(100vh - 64px)',
      background: '#f5f5f5',
      padding: '24px 0'
    }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 20px' }}>
        {/* Profile Header */}
        <Card 
          style={{ 
            borderRadius: '8px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            marginBottom: '24px',
            textAlign: 'center'
          }}
        >
          <Avatar 
            size={80} 
            icon={<UserOutlined />}
            style={{ backgroundColor: '#667eea', marginBottom: 16 }}
          />
          <Title level={3} style={{ margin: 0, marginBottom: 4 }}>
            {user?.hoTen || 'cl'}
          </Title>
          <Text type="secondary" style={{ display: 'block', marginBottom: 4 }}>
            Tài khoản đã xác thực
          </Text>
          <Text style={{ color: '#666' }}>
            ID {user?.maNguoiDung} | {user?.email}
          </Text>
        </Card>

        {/* Main Content */}
        <Row gutter={24}>
          {/* Left Sidebar Menu */}
          <Col xs={24} md={8}>
            <Card 
              style={{ 
                borderRadius: '8px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
              }}
              bodyStyle={{ padding: 0 }}
            >
              {menuItems.map((section, index) => (
                <div key={section.key}>
                  <div 
                    style={{ 
                      padding: '16px 20px',
                      fontWeight: 500,
                      fontSize: '15px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      cursor: 'pointer',
                      background: activeMenu === section.key && section.children.length === 0 ? '#e6f7ff' : 'transparent',
                      transition: 'all 0.3s'
                    }}
                    onClick={() => {
                      if (section.children.length > 0) {
                        toggleSection(section.key);
                      } else {
                        setActiveMenu(section.key);
                      }
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <span style={{ marginRight: 12, fontSize: '18px', color: '#667eea' }}>
                        {section.icon}
                      </span>
                      {section.label}
                    </div>
                    {section.children.length > 0 && (
                      expandedSections.includes(section.key) ? <UpOutlined /> : <DownOutlined />
                    )}
                  </div>
                  {section.children.length > 0 && expandedSections.includes(section.key) && (
                    <div style={{ paddingLeft: 52, background: '#fafafa' }}>
                      {section.children.map((child) => (
                        <div
                          key={child.key}
                          onClick={() => setActiveMenu(child.key)}
                          style={{
                            padding: '12px 20px',
                            cursor: 'pointer',
                            color: activeMenu === child.key ? '#00b14f' : '#666',
                            fontWeight: activeMenu === child.key ? 500 : 400,
                            background: activeMenu === child.key ? '#e6f7ff' : 'transparent',
                            transition: 'all 0.3s'
                          }}
                        >
                          {child.label}
                        </div>
                      ))}
                    </div>
                  )}
                  {index < menuItems.length - 1 && <Divider style={{ margin: 0 }} />}
                </div>
              ))}
              
              <Divider style={{ margin: 0 }} />
              
              {/* Logout Button */}
              <div 
                onClick={handleLogout}
                style={{ 
                  padding: '16px 20px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  color: '#666',
                  transition: 'all 0.3s'
                }}
              >
                <LogoutOutlined style={{ marginRight: 12, fontSize: '18px' }} />
                Đăng xuất
              </div>
            </Card>
          </Col>

          {/* Right Content Area */}
          <Col xs={24} md={16}>
            <Card 
              style={{ 
                borderRadius: '8px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                minHeight: '500px'
              }}
            >
              {renderContent()}
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default CandidateProfile;