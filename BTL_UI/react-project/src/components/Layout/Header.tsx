import { Layout, Button, Space } from 'antd';
import { useNavigate } from 'react-router-dom';

const { Header: AntHeader } = Layout;

const Header = () => {
  const navigate = useNavigate();

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
          🇻🇳 VietHire
        </div>
        
        <Space>
          <Button type="link" style={{ color: '#fff' }} onClick={() => navigate('/')}>
            Trang chủ
          </Button>
          <Button type="link" style={{ color: '#fff' }} onClick={() => navigate('/jobs')}>
            Việc làm
          </Button>
        </Space>
      </div>

      <Space>
        <Button onClick={() => navigate('/login')}>
          Đăng nhập
        </Button>
        <Button type="primary" onClick={() => navigate('/register')}>
          Đăng ký
        </Button>
      </Space>
    </AntHeader>
  );
};

export default Header;
