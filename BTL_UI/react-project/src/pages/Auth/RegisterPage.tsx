import { Form, Input, Button, Card, Typography, message, Radio } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined, PhoneOutlined, IdcardOutlined } from '@ant-design/icons';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../../services/authService';

const { Title, Text } = Typography;

interface RegisterFormValues {
  tenDangNhap: string;
  matKhau: string;
  email: string;
  hoTen: string;
  maVaiTro: number;
  soDienThoai?: string;
}

const RegisterPage = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const onFinish = async (values: RegisterFormValues) => {
    try {
      const response = await authService.register(values);
      
      if (response.success) {
        message.success('Đăng ký thành công! Vui lòng đăng nhập.');
        navigate('/login');
      }
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Đăng ký thất bại!');
    }
  };

  return (
    <div style={{
      minHeight: 'calc(100vh - 64px - 200px)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '40px 20px',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    }}>
      <Card style={{ width: '100%', maxWidth: '500px', boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}>
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <Title level={2}>Đăng Ký</Title>
          <Text type="secondary">Tạo tài khoản mới để bắt đầu</Text>
        </div>

        <Form
          form={form}
          name="register"
          onFinish={onFinish}
          layout="vertical"
          size="large"
          initialValues={{ maVaiTro: 3 }}
        >
          <Form.Item
            name="hoTen"
            label="Họ và tên"
            rules={[{ required: true, message: 'Vui lòng nhập họ tên!' }]}
          >
            <Input 
              prefix={<IdcardOutlined />} 
              placeholder="Nhập họ và tên"
            />
          </Form.Item>

          <Form.Item
            name="tenDangNhap"
            label="Tên đăng nhập"
            rules={[
              { required: true, message: 'Vui lòng nhập tên đăng nhập!' },
              { min: 4, message: 'Tên đăng nhập phải có ít nhất 4 ký tự!' }
            ]}
          >
            <Input 
              prefix={<UserOutlined />} 
              placeholder="Nhập tên đăng nhập"
            />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Vui lòng nhập email!' },
              { type: 'email', message: 'Email không hợp lệ!' }
            ]}
          >
            <Input 
              prefix={<MailOutlined />} 
              placeholder="Nhập email"
            />
          </Form.Item>

          <Form.Item
            name="soDienThoai"
            label="Số điện thoại"
            rules={[
              { pattern: /^[0-9]{10}$/, message: 'Số điện thoại phải có 10 chữ số!' }
            ]}
          >
            <Input 
              prefix={<PhoneOutlined />} 
              placeholder="Nhập số điện thoại"
            />
          </Form.Item>

          <Form.Item
            name="matKhau"
            label="Mật khẩu"
            rules={[
              { required: true, message: 'Vui lòng nhập mật khẩu!' },
              { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự!' }
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Nhập mật khẩu"
            />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            label="Xác nhận mật khẩu"
            dependencies={['matKhau']}
            rules={[
              { required: true, message: 'Vui lòng xác nhận mật khẩu!' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('matKhau') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('Mật khẩu không khớp!'));
                },
              }),
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Nhập lại mật khẩu"
            />
          </Form.Item>

          <Form.Item
            name="maVaiTro"
            label="Bạn là"
            rules={[{ required: true, message: 'Vui lòng chọn vai trò!' }]}
          >
            <Radio.Group>
              <Radio value={3}>Ứng viên</Radio>
              <Radio value={2}>Nhà tuyển dụng</Radio>
            </Radio.Group>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Đăng ký
            </Button>
          </Form.Item>

          <div style={{ textAlign: 'center' }}>
            <Text>Đã có tài khoản? </Text>
            <Link to="/login">Đăng nhập ngay</Link>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default RegisterPage;
