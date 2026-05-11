import { Layout, Row, Col, Space, Typography } from 'antd';
import { 
  FacebookOutlined, 
  TwitterOutlined, 
  LinkedinOutlined, 
  YoutubeOutlined,
  MailOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
  GlobalOutlined
} from '@ant-design/icons';
import { Link } from 'react-router-dom';

const mutedTextStyle = { color: 'rgba(255,255,255,0.65)' };

const { Footer: AntFooter } = Layout;
const { Title, Text, Paragraph } = Typography;

const Footer = () => {
  return (
    <AntFooter style={{ 
      background: '#001529', 
      color: '#fff',
      padding: '40px 20px 20px'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <Row gutter={[32, 32]}>
          {/* Cột 1: Về VietHire */}
          <Col xs={24} sm={12} md={6}>
            <Title level={4} style={{ color: '#fff', marginBottom: '20px' }}>
              🇻🇳 VietHire
            </Title>
            <Paragraph style={{ color: 'rgba(255,255,255,0.65)', marginBottom: '20px' }}>
              Nền tảng tuyển dụng hàng đầu Việt Nam, kết nối ứng viên tài năng với các doanh nghiệp uy tín.
            </Paragraph>
            <Space size="large">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                <FacebookOutlined style={{ fontSize: '20px', color: '#fff' }} />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                <TwitterOutlined style={{ fontSize: '20px', color: '#fff' }} />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
                <LinkedinOutlined style={{ fontSize: '20px', color: '#fff' }} />
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer">
                <YoutubeOutlined style={{ fontSize: '20px', color: '#fff' }} />
              </a>
            </Space>
          </Col>

          {/* Cột 2: Dành cho ứng viên */}
          <Col xs={24} sm={12} md={6}>
            <Title level={5} style={{ color: '#fff', marginBottom: '20px' }}>
              Dành cho ứng viên
            </Title>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <Link to="/jobs" style={{ color: 'rgba(255,255,255,0.65)' }}>
                Tìm việc làm
              </Link>
              <Link to="/jobs" style={{ color: 'rgba(255,255,255,0.65)' }}>
                Danh sách công ty
              </Link>
              <Link to="/profile" style={{ color: 'rgba(255,255,255,0.65)' }}>
                Quản lý hồ sơ
              </Link>
              <Link to="/candidate/applications" style={{ color: 'rgba(255,255,255,0.65)' }}>
                Đơn ứng tuyển
              </Link>
              <Link to="/candidate/interviews" style={{ color: 'rgba(255,255,255,0.65)' }}>
                Lịch phỏng vấn
              </Link>
            </div>
          </Col>

          {/* Cột 3: Dành cho nhà tuyển dụng */}
          <Col xs={24} sm={12} md={6}>
            <Title level={5} style={{ color: '#fff', marginBottom: '20px' }}>
              Dành cho nhà tuyển dụng
            </Title>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <Link to="/register" style={{ color: 'rgba(255,255,255,0.65)' }}>
                Đăng ký tuyển dụng
              </Link>
              <Link to="/company/dashboard" style={{ color: 'rgba(255,255,255,0.65)' }}>
                Đăng tin tuyển dụng
              </Link>
              <Link to="/company/dashboard" style={{ color: 'rgba(255,255,255,0.65)' }}>
                Quản lý tuyển dụng
              </Link>
              <Link to="/company/candidates" style={{ color: 'rgba(255,255,255,0.65)' }}>
                Tìm ứng viên
              </Link>
              <Link to="/company/dashboard" style={{ color: 'rgba(255,255,255,0.65)' }}>
                Bảng giá dịch vụ
              </Link>
            </div>
          </Col>

          {/* Cột 4: Liên hệ */}
          <Col xs={24} sm={12} md={6}>
            <Title level={5} style={{ color: '#fff', marginBottom: '20px' }}>
              Liên hệ
            </Title>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <Space>
                <EnvironmentOutlined style={{ color: '#1890ff' }} />
                <Text style={{ color: 'rgba(255,255,255,0.65)' }}>
                  Hà Nội, Việt Nam
                </Text>
              </Space>
              <Space>
                <PhoneOutlined style={{ color: '#52c41a' }} />
                <Text style={{ color: 'rgba(255,255,255,0.65)' }}>
                  1900 xxxx
                </Text>
              </Space>
              <Space>
                <MailOutlined style={{ color: '#faad14' }} />
                <Text style={{ color: 'rgba(255,255,255,0.65)' }}>
                  contact@viethire.vn
                </Text>
              </Space>
              <Space>
                <GlobalOutlined style={{ color: '#f5222d' }} />
                <Text style={{ color: 'rgba(255,255,255,0.65)' }}>
                  www.viethire.vn
                </Text>
              </Space>
            </div>
          </Col>
        </Row>

        {/* Đường kẻ ngang */}
        <div style={{ 
          borderTop: '1px solid rgba(255,255,255,0.1)', 
          margin: '30px 0 20px',
        }} />

        {/* Copyright & Links */}
        <Row justify="space-between" align="middle">
          <Col xs={24} md={12} style={{ textAlign: 'center', marginBottom: '10px' }}>
            <Text style={{ color: 'rgba(255,255,255,0.45)' }}>
              © 2024 VietHire. All rights reserved.
            </Text>
          </Col>
          <Col xs={24} md={12} style={{ textAlign: 'center' }}>
            <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <span style={mutedTextStyle}>Điều khoản sử dụng</span>
              <span style={{ color: 'rgba(255,255,255,0.3)' }}>|</span>
              <span style={mutedTextStyle}>Chính sách bảo mật</span>
              <span style={{ color: 'rgba(255,255,255,0.3)' }}>|</span>
              <span style={mutedTextStyle}>Về chúng tôi</span>
            </div>
          </Col>
        </Row>
      </div>
    </AntFooter>
  );
};

export default Footer;