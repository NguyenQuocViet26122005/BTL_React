import { Card, Row, Col, Statistic, Button, Table, Tag } from 'antd';
import { PlusOutlined, FileTextOutlined, UserOutlined, EyeOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

const CompanyDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      setUser(JSON.parse(userStr));
    }
  }, []);

  // Mock data for statistics
  const stats = {
    totalJobs: 12,
    activeJobs: 8,
    totalApplications: 45,
    pendingApplications: 15
  };

  // Mock data for recent jobs
  const recentJobs = [
    {
      key: '1',
      title: 'Senior Frontend Developer',
      status: 'active',
      applications: 12,
      views: 156,
      deadline: '2026-04-15'
    },
    {
      key: '2',
      title: 'Backend Developer',
      status: 'active',
      applications: 8,
      views: 98,
      deadline: '2026-04-20'
    },
    {
      key: '3',
      title: 'UI/UX Designer',
      status: 'closed',
      applications: 25,
      views: 234,
      deadline: '2026-03-25'
    }
  ];

  const columns = [
    {
      title: 'Tieu de',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Trang thai',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'active' ? 'green' : 'red'}>
          {status === 'active' ? 'Dang tuyen' : 'Da dong'}
        </Tag>
      ),
    },
    {
      title: 'Don ung tuyen',
      dataIndex: 'applications',
      key: 'applications',
    },
    {
      title: 'Luot xem',
      dataIndex: 'views',
      key: 'views',
    },
    {
      title: 'Han nop',
      dataIndex: 'deadline',
      key: 'deadline',
    },
  ];

  return (
    <div style={{ padding: '24px', maxWidth: 1200, margin: '0 auto' }}>
      <div style={{ marginBottom: 24 }}>
        <h1>Chao mung, {user?.hoTen || 'Nha tuyen dung'}</h1>
        <p>Quan ly tin tuyen dung va ung vien cua ban</p>
      </div>

      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Tong tin tuyen dung"
              value={stats.totalJobs}
              prefix={<FileTextOutlined />}
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Tin dang tuyen"
              value={stats.activeJobs}
              prefix={<FileTextOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Tong don ung tuyen"
              value={stats.totalApplications}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#cf1322' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Don cho duyet"
              value={stats.pendingApplications}
              prefix={<EyeOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
      </Row>

      <Card
        title="Tin tuyen dung gan day"
        extra={
          <Button type="primary" icon={<PlusOutlined />}>
            Dang tin moi
          </Button>
        }
      >
        <Table columns={columns} dataSource={recentJobs} pagination={false} />
      </Card>
    </div>
  );
};

export default CompanyDashboard;