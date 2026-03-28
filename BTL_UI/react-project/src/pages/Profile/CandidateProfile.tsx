import { Card, Avatar, Typography, Collapse, Button, Empty } from 'antd';
import { UserOutlined, FileTextOutlined, HeartOutlined, SettingOutlined, MailOutlined, LockOutlined, CreditCardOutlined, LogoutOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { NguoiDung } from '../../types';

const { Title, Text } = Typography;
const { Panel } = Collapse;

const CandidateProfile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<NguoiDung | null>(null);

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

  return (
    <div style={{ 
      minHeight: 'calc(100vh - 64px)',
      background: '#f5f5f5',
      padding: '24px 0'
    }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 20px' }}>
        <Card 
          style={{ 
            borderRadius: '8px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            marginBottom: '24px'
          }}
        >
          {/* Profile Header */}
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: 24 }}>
            <Avatar 
              size={80} 
              icon={<UserOutlined />}
              style={{ backgroundColor: '#667eea', marginRight: 20 }}
            />
            <div>
              <Title level={3} style={{ margin: 0, marginBottom: 4 }}>
                {user?.hoTen || 'Việt Nguyễn Quốc'}
              </Title>
              <Text type="secondary" style={{ display: 'block', marginBottom: 4 }}>
                Tài khoản đã xác thực
              </Text>
              <Text style={{ color: '#666' }}>
                ID {user?.maNguoiDung} | {user?.email}
              </Text>
            </div>
          </div>

          {/* Collapsible Sections */}
          <Collapse 
            defaultActiveKey={['1']} 
            ghost
            expandIconPosition="end"
          >
            {/* Quản lý tìm việc */}
            <Panel 
              header={
                <div style={{ display: 'flex', alignItems: 'center', fontSize: '16px', fontWeight: 500 }}>
                  <FileTextOutlined style={{ marginRight: 12, fontSize: '20px', color: '#667eea' }} />
                  Quản lý tìm việc
                </div>
              } 
              key="1"
            >
              <div style={{ paddingLeft: 32 }}>
                <div style={{ padding: '12px 0', cursor: 'pointer', color: '#666' }}>
                  Việc làm đã lưu
                </div>
                <div style={{ padding: '12px 0', cursor: 'pointer', color: '#00b14f', fontWeight: 500 }}>
                  Việc làm đã ứng tuyển
                </div>
                <div style={{ padding: '12px 0', cursor: 'pointer', color: '#666' }}>
                  Việc làm phù hợp với bạn
                </div>
                <div style={{ padding: '12px 0', cursor: 'pointer', color: '#666' }}>
                  Cài đặt gợi ý việc làm
                </div>
              </div>
            </Panel>

            {/* Quản lý CV & Cover letter */}
            <Panel 
              header={
                <div style={{ display: 'flex', alignItems: 'center', fontSize: '16px', fontWeight: 500 }}>
                  <HeartOutlined style={{ marginRight: 12, fontSize: '20px', color: '#667eea' }} />
                  Quản lý CV & Cover letter
                </div>
              } 
              key="2"
            >
              <div style={{ paddingLeft: 32 }}>
                <div style={{ padding: '12px 0', cursor: 'pointer', color: '#666' }}>
                  CV của tôi
                </div>
                <div style={{ padding: '12px 0', cursor: 'pointer', color: '#666' }}>
                  Cover Letter của tôi
                </div>
                <div style={{ padding: '12px 0', cursor: 'pointer', color: '#666' }}>
                  Nhà tuyển dụng muốn kết nối với bạn
                </div>
                <div style={{ padding: '12px 0', cursor: 'pointer', color: '#666' }}>
                  Nhà tuyển dụng xem hồ sơ
                </div>
              </div>
            </Panel>

            {/* Cài đặt email & thông báo */}
            <Panel 
              header={
                <div style={{ display: 'flex', alignItems: 'center', fontSize: '16px', fontWeight: 500 }}>
                  <MailOutlined style={{ marginRight: 12, fontSize: '20px', color: '#667eea' }} />
                  Cài đặt email & thông báo
                </div>
              } 
              key="3"
            >
              <div style={{ paddingLeft: 32 }}>
                <div style={{ padding: '12px 0', cursor: 'pointer', color: '#666' }}>
                  Cài đặt thông báo việc làm
                </div>
                <div style={{ padding: '12px 0', cursor: 'pointer', color: '#666' }}>
                  Cài đặt nhận email
                </div>
              </div>
            </Panel>

            {/* Cá nhân & Bảo mật */}
            <Panel 
              header={
                <div style={{ display: 'flex', alignItems: 'center', fontSize: '16px', fontWeight: 500 }}>
                  <LockOutlined style={{ marginRight: 12, fontSize: '20px', color: '#667eea' }} />
                  Cá nhân & Bảo mật
                </div>
              } 
              key="4"
            >
              <div style={{ paddingLeft: 32 }}>
                <div style={{ padding: '12px 0' }}>
                  <Text strong>Email:</Text> <Text>{user?.email}</Text>
                </div>
                <div style={{ padding: '12px 0' }}>
                  <Text strong>Số điện thoại:</Text> <Text>{user?.soDienThoai || 'Chưa cập nhật'}</Text>
                </div>
              </div>
            </Panel>

            {/* Nâng cấp tài khoản */}
            <Panel 
              header={
                <div style={{ display: 'flex', alignItems: 'center', fontSize: '16px', fontWeight: 500 }}>
                  <CreditCardOutlined style={{ marginRight: 12, fontSize: '20px', color: '#667eea' }} />
                  Nâng cấp tài khoản
                </div>
              } 
              key="5"
            >
              <div style={{ paddingLeft: 32, padding: '12px 0' }}>
                <Empty description="Chưa có gói nâng cấp" />
              </div>
            </Panel>
          </Collapse>

          {/* Logout Button */}
          <div style={{ marginTop: 24, paddingTop: 24, borderTop: '1px solid #f0f0f0' }}>
            <Button 
              block 
              size="large"
              icon={<LogoutOutlined />}
              onClick={handleLogout}
              style={{ 
                height: '48px',
                fontSize: '16px',
                color: '#666'
              }}
            >
              Đăng xuất
            </Button>
          </div>
        </Card>

        {/* Content Area - Việc làm đã ứng tuyển */}
        <Card 
          title="Việc làm đã ứng tuyển"
          style={{ 
            borderRadius: '8px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}
        >
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
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
        </Card>
      </div>
    </div>
  );
};

export default CandidateProfile;