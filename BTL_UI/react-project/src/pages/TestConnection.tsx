import { useState } from 'react';
import { Card, Button, Space, Typography, Alert, Spin, Descriptions, Tag } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined, ApiOutlined } from '@ant-design/icons';
import { jobService } from '../services/jobService';
import { authService } from '../services/authService';

const { Title, Text } = Typography;

const TestConnection = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const testPublicAPI = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await jobService.getAllJobs();
      setResult({
        success: true,
        message: 'Kết nối thành công!',
        data: response.data,
        count: response.data?.length || 0
      });
    } catch (err: any) {
      setError(err.message || 'Kết nối thất bại');
      setResult({
        success: false,
        message: err.response?.data?.message || err.message
      });
    } finally {
      setLoading(false);
    }
  };

  const testAuthAPI = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await authService.login({
        email: 'admin@test.com',
        matKhau: 'admin123'
      });
      setResult({
        success: true,
        message: 'Đăng nhập thành công!',
        token: response.data?.token?.substring(0, 50) + '...',
        user: response.data?.user
      });
    } catch (err: any) {
      setError(err.message || 'Đăng nhập thất bại');
      setResult({
        success: false,
        message: err.response?.data?.message || err.message
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '40px 20px', maxWidth: '800px', margin: '0 auto' }}>
      <Card>
        <Space direction="vertical" style={{ width: '100%' }} size="large">
          <div>
            <Title level={3}>
              <ApiOutlined /> Test Kết Nối Backend
            </Title>
            <Text type="secondary">
              Backend URL: <Text code>https://localhost:44314/api</Text>
            </Text>
          </div>

          <Space>
            <Button 
              type="primary" 
              onClick={testPublicAPI}
              loading={loading}
              icon={<ApiOutlined />}
            >
              Test API Public (Danh sách việc làm)
            </Button>
            
            <Button 
              onClick={testAuthAPI}
              loading={loading}
              icon={<ApiOutlined />}
            >
              Test API Auth (Đăng nhập)
            </Button>
          </Space>

          {loading && (
            <div style={{ textAlign: 'center', padding: '20px' }}>
              <Spin size="large" />
              <div style={{ marginTop: '10px' }}>
                <Text>Đang kết nối...</Text>
              </div>
            </div>
          )}

          {error && (
            <Alert
              message="Lỗi kết nối"
              description={error}
              type="error"
              showIcon
              icon={<CloseCircleOutlined />}
            />
          )}

          {result && !loading && (
            <>
              <Alert
                message={result.success ? 'Thành công' : 'Thất bại'}
                description={result.message}
                type={result.success ? 'success' : 'error'}
                showIcon
                icon={result.success ? <CheckCircleOutlined /> : <CloseCircleOutlined />}
              />

              {result.success && (
                <Card title="Kết quả" size="small">
                  <Descriptions column={1} bordered size="small">
                    {result.count !== undefined && (
                      <Descriptions.Item label="Số lượng việc làm">
                        <Tag color="blue">{result.count}</Tag>
                      </Descriptions.Item>
                    )}
                    
                    {result.token && (
                      <Descriptions.Item label="Token">
                        <Text code style={{ fontSize: '11px' }}>{result.token}</Text>
                      </Descriptions.Item>
                    )}
                    
                    {result.user && (
                      <>
                        <Descriptions.Item label="User ID">
                          {result.user.maNguoiDung}
                        </Descriptions.Item>
                        <Descriptions.Item label="Tên đăng nhập">
                          {result.user.tenDangNhap}
                        </Descriptions.Item>
                        <Descriptions.Item label="Họ tên">
                          {result.user.hoTen}
                        </Descriptions.Item>
                        <Descriptions.Item label="Email">
                          {result.user.email}
                        </Descriptions.Item>
                        <Descriptions.Item label="Vai trò">
                          <Tag color={result.user.maVaiTro === 1 ? 'red' : result.user.maVaiTro === 2 ? 'blue' : 'green'}>
                            {result.user.maVaiTro === 1 ? 'Admin' : result.user.maVaiTro === 2 ? 'HR' : 'Candidate'}
                          </Tag>
                        </Descriptions.Item>
                      </>
                    )}
                  </Descriptions>
                </Card>
              )}
            </>
          )}

          <Card title="Hướng dẫn" size="small" type="inner">
            <Space direction="vertical">
              <Text>1. Đảm bảo Backend đang chạy tại: <Text code>https://localhost:44314</Text></Text>
              <Text>2. Kiểm tra Swagger: <a href="https://localhost:44314/swagger" target="_blank">https://localhost:44314/swagger</a></Text>
              <Text>3. Nếu gặp lỗi SSL, click "Advanced" → "Proceed to localhost"</Text>
              <Text>4. Nếu gặp lỗi CORS, kiểm tra backend đã enable CORS</Text>
            </Space>
          </Card>
        </Space>
      </Card>
    </div>
  );
};

export default TestConnection;

