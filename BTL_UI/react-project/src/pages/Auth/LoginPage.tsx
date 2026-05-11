import { Form, Input, Button, Card, Typography, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../../services/authService';
import { getDefaultRouteForRole, normalizeUser } from '../../utils/auth';

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
        
        const user = normalizeUser(response.data.user);

        if (!user) {
          message.error('Dữ liệu tài khoản không hợp lệ!');
          return;
        }

        console.log('User data to save:', user);
        localStorage.setItem('user', JSON.stringify(user));

        message.success('Đăng nhập thành công!');
        navigate(getDefaultRouteForRole(user.maVaiTro));
      }
    } catch (error: any) {
      console.error('Login error:', error);
      message.error(error.response?.data?.message || 'Đăng nhập thất bại!');
    }
  };

  return (
    <div style={{
      minHeight: 'calc(100vh - 64px)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '40px 20px',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    }}>
      <Card style={{ width: '100%', maxWidth: '500px', boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}>
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <Title level={2}>Đăng nhập</Title>
          <Text type="secondary">Chào mừng bạn quay trở lại!</Text>
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
              { required: true, message: 'Vui lòng nhập email!' },
              { type: 'email', message: 'Email không đúng định dạng!' }
            ]}
          >
            <Input 
              prefix={<UserOutlined />} 
              placeholder="Nhập email"
            />
          </Form.Item>

          <Form.Item
            name="matKhau"
            label="Mật khẩu"
            rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Nhập mật khẩu"
            />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Đăng nhập
            </Button>
          </Form.Item>

          <div style={{ textAlign: 'center' }}>
            <Text>Chưa có tài khoản? </Text>
            <Link to="/register">Đăng ký ngay</Link>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default LoginPage;
