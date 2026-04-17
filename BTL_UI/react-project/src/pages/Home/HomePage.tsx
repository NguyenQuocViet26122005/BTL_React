import { Row, Col, Card, Input, Button, Typography, Space, Statistic } from 'antd';
import { SearchOutlined, RocketOutlined, TeamOutlined, SafetyOutlined, TrophyOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Title, Paragraph } = Typography;
const { Search } = Input;

const HomePage = () => {
  const navigate = useNavigate();

  const handleSearch = (value: string) => {
    navigate('/jobs?search=' + value);
  };

  return (
    <div style={{ width: '100%' }}>
      {/* Hero Section */}
      <div style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '80px 20px',
        textAlign: 'center',
        color: '#fff',
        width: '100%'
      }}>
        <Title level={1} style={{ color: '#fff', fontSize: 'clamp(28px, 5vw, 48px)', marginBottom: '20px' }}>
          Tìm Công Việc Mơ Ước Của Bạn
        </Title>
        <Paragraph style={{ color: '#fff', fontSize: 'clamp(14px, 2vw, 18px)', marginBottom: '40px' }}>
          Hàng nghìn cơ hội việc làm đang chờ đón bạn
        </Paragraph>
        
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <Search
            placeholder="Tìm kiếm công việc, vị trí, công ty..."
            size="large"
            enterButton={
              <Button type="primary" size="large" icon={<SearchOutlined />}>
                Tìm kiếm
              </Button>
            }
            onSearch={handleSearch}
            style={{ width: '100%' }}
          />
        </div>

        <Space size="large" style={{ marginTop: '40px', flexWrap: 'wrap', justifyContent: 'center' }}>
          <Button size="large" type="default" onClick={() => navigate('/jobs')}>
            Xem tất cả việc làm
          </Button>
          <Button size="large" onClick={() => navigate('/register')} style={{ background: '#fff', color: '#667eea' }}>
            Đăng ký ngay
          </Button>
        </Space>
      </div>

      {/* Statistics Section */}
      <div style={{ padding: '60px 20px', background: '#fff' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <Row gutter={[32, 32]} justify="center">
            <Col xs={24} sm={12} md={6}>
              <Card 
                style={{ 
                  textAlign: 'center',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                  borderRadius: '8px',
                  transition: 'all 0.3s ease'
                }}
                hoverable
              >
                <Statistic
                  title="Việc làm"
                  value={1234}
                  prefix={<RocketOutlined style={{ color: '#1890ff' }} />}
                  
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card 
                style={{ 
                  textAlign: 'center',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                  borderRadius: '8px',
                  transition: 'all 0.3s ease'
                }}
                hoverable
              >
                <Statistic
                  title="Công ty"
                  value={567}
                  prefix={<TeamOutlined style={{ color: '#52c41a' }} />}
                  
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card 
                style={{ 
                  textAlign: 'center',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                  borderRadius: '8px',
                  transition: 'all 0.3s ease'
                }}
                hoverable
              >
                <Statistic
                  title="Ứng viên"
                  value={8901}
                  prefix={<SafetyOutlined style={{ color: '#faad14' }} />}
                  
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card 
                style={{ 
                  textAlign: 'center',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                  borderRadius: '8px',
                  transition: 'all 0.3s ease'
                }}
                hoverable
              >
                <Statistic
                  title="Tuyển dụng thành công"
                  value={2345}
                  prefix={<TrophyOutlined style={{ color: '#f5222d' }} />}
                  
                />
              </Card>
            </Col>
          </Row>
        </div>
      </div>

      {/* Features Section */}
      <div style={{ padding: '60px 20px', background: '#f0f2f5' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <Title level={2} style={{ textAlign: 'center', marginBottom: '50px' }}>
            Tại Sao Chọn VietHire?
          </Title>
          
          <Row gutter={[32, 32]}>
            <Col xs={24} md={8}>
              <Card 
                hoverable 
                style={{ 
                  height: '100%', 
                  textAlign: 'center',
                  boxShadow: '0 6px 16px rgba(0, 0, 0, 0.12)',
                  borderRadius: '12px',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = '0 12px 24px rgba(0, 0, 0, 0.2)';
                  e.currentTarget.style.transform = 'translateY(-8px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = '0 6px 16px rgba(0, 0, 0, 0.12)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <RocketOutlined style={{ fontSize: '48px', color: '#1890ff', marginBottom: '20px' }} />
                <Title level={4}>Tìm việc nhanh chóng</Title>
                <Paragraph>
                  Hệ thống tìm kiếm thông minh giúp bạn tìm được công việc phù hợp chỉ trong vài phút
                </Paragraph>
              </Card>
            </Col>
            
            <Col xs={24} md={8}>
              <Card 
                hoverable 
                style={{ 
                  height: '100%', 
                  textAlign: 'center',
                  boxShadow: '0 6px 16px rgba(0, 0, 0, 0.12)',
                  borderRadius: '12px',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = '0 12px 24px rgba(0, 0, 0, 0.2)';
                  e.currentTarget.style.transform = 'translateY(-8px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = '0 6px 16px rgba(0, 0, 0, 0.12)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <SafetyOutlined style={{ fontSize: '48px', color: '#52c41a', marginBottom: '20px' }} />
                <Title level={4}>Uy tín & Bảo mật</Title>
                <Paragraph>
                  Thông tin của bạn được bảo mật tuyệt đối. Chỉ chia sẻ với nhà tuyển dụng khi bạn đồng ý
                </Paragraph>
              </Card>
            </Col>
            
            <Col xs={24} md={8}>
              <Card 
                hoverable 
                style={{ 
                  height: '100%', 
                  textAlign: 'center',
                  boxShadow: '0 6px 16px rgba(0, 0, 0, 0.12)',
                  borderRadius: '12px',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = '0 12px 24px rgba(0, 0, 0, 0.2)';
                  e.currentTarget.style.transform = 'translateY(-8px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = '0 6px 16px rgba(0, 0, 0, 0.12)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <TeamOutlined style={{ fontSize: '48px', color: '#faad14', marginBottom: '20px' }} />
                <Title level={4}>Hỗ trợ 24/7</Title>
                <Paragraph>
                  Đội ngũ hỗ trợ chuyên nghiệp luôn sẵn sàng giúp đỡ bạn trong quá trình tìm việc
                </Paragraph>
              </Card>
            </Col>
          </Row>
        </div>
      </div>

      {/* CTA Section */}
      <div style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '60px 20px',
        textAlign: 'center',
        color: '#fff'
      }}>
        <Title level={2} style={{ color: '#fff', marginBottom: '20px' }}>
          Sẵn Sàng Bắt Đầu Hành Trình Mới?
        </Title>
        <Paragraph style={{ color: '#fff', fontSize: '16px', marginBottom: '30px' }}>
          Tham gia cùng hàng nghìn ứng viên và nhà tuyển dụng trên VietHire
        </Paragraph>
        <Space size="large" style={{ flexWrap: 'wrap', justifyContent: 'center' }}>
          <Button size="large" type="default" onClick={() => navigate('/register')}>
            Đăng ký làm ứng viên
          </Button>
          <Button size="large" onClick={() => navigate('/register')} style={{ background: '#fff', color: '#667eea' }}>
            Đăng ký làm nhà tuyển dụng
          </Button>
        </Space>
      </div>
    </div>
  );
};

export default HomePage;
