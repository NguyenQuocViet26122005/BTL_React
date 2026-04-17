import { Form, Input, Button, Card, Typography, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../../services/authService';

const { Title, Text } = Typography;

interface LoginFormValues {
  email: string;
  matKhau: string;
}

const LoginPage = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const onFinish = async (values: LoginFormValues) => {
    try {
      const response = await authService.login(values);
      console.log('Login response:', response);
      
      if (response.success && response.data) {
        localStorage.setItem('token', response.data.token);
        
        console.log('Backend user data:', response.data.user);
        
        const user = response.data.user;
        
        console.log('User data to save:', user);
        localStorage.setItem('user', JSON.stringify(user));
        
        message.success('Dang nhap thanh cong!');
        
        // Redirect based on role
        if (user.MaVaiTro === 1) {
          navigate('/admin/dashboard');
        } else if (user.MaVaiTro === 2) {
          navigate('/company/dashboard');
        } else {
          navigate('/');
        }
      }
    } catch (error: any) {
      console.error('Login error:', error);
      message.error(error.response?.data?.message || 'Dang nhap that bai!');
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '40px 20px',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    }}>
      <Card style={{ width: '100%', maxWidth: '500px', boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}>
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <Title level={2}>Dang Nhap</Title>
          <Text type="secondary">Chao mung ban quay tro lai!</Text>
        </div>

        <Form
          form={form}
          name="login"
          onFinish={onFinish}
          layout="vertical"
          size="large"
        >
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Vui long nhap email!' },
              { type: 'email', message: 'Email khong dung dinh dang!' }
            ]}
          >
            <Input 
              prefix={<UserOutlined />} 
              placeholder="Nhap email"
            />
          </Form.Item>

          <Form.Item
            name="matKhau"
            label="Mat khau"
            rules={[{ required: true, message: 'Vui long nhap mat khau!' }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Nhap mat khau"
            />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Dang nhap
            </Button>
          </Form.Item>

          <div style={{ textAlign: 'center' }}>
            <Text>Chua co tai khoan? </Text>
            <Link to="/register">Dang ky ngay</Link>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default LoginPage;
