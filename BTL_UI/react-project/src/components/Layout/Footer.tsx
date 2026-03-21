import { Layout, Typography } from 'antd';

const { Footer: AntFooter } = Layout;
const { Text } = Typography;

const Footer = () => {
  return (
    <AntFooter style={{ 
      background: '#001529', 
      color: '#fff',
      textAlign: 'center',
      padding: '20px'
    }}>
      <Text style={{ color: 'rgba(255,255,255,0.65)' }}>
        © 2024 JobPortal. All rights reserved.
      </Text>
    </AntFooter>
  );
};

export default Footer;
