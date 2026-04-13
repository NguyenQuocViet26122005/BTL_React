import { useEffect, useState } from 'react';
import { Card, Table, Tag, Button, Space, message, Empty } from 'antd';
import { EyeOutlined, FileTextOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { applicationService } from '../../services/applicationService';
import type { DonUngTuyen } from '../../types';
import dayjs from 'dayjs';

const MyApplicationsPage = () => {
  const navigate = useNavigate();
  const [applications, setApplications] = useState<DonUngTuyen[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const userData = JSON.parse(userStr);
      fetchApplications(userData.maNguoiDung);
    } else {
      message.error('Vui long dang nhap!');
      navigate('/login');
    }
  }, [navigate]);

  const fetchApplications = async (maUngVien: number) => {
    try {
      setLoading(true);
      console.log('Fetching applications for user:', maUngVien);
      const response = await applicationService.getMyApplications(maUngVien);
      console.log('API Response:', response);
      
      if (response.success && response.data) {
        console.log('Applications data:', response.data);
        setApplications(response.data);
      } else {
        console.log('No data or failed:', response);
        message.warning(response.message || 'Khong co don ung tuyen nao');
      }
    } catch (error: any) {
      console.error('Error fetching applications:', error);
      message.error(error.response?.data?.message || 'Khong the tai danh sach don ung tuyen!');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    const colorMap: any = {
      'DaNop': 'blue',
      'DangXem': 'orange',
      'PhongVan': 'purple',
      'TuChoi': 'red',
      'ChapNhan': 'green'
    };
    return colorMap[status] || 'default';
  };

  const getStatusText = (status: string) => {
    const textMap: any = {
      'DaNop': 'Da nop',
      'DangXem': 'Dang xem',
      'PhongVan': 'Phong van',
      'TuChoi': 'Tu choi',
      'ChapNhan': 'Chap nhan'
    };
    return textMap[status] || status;
  };

  const columns = [
    {
      title: 'Vi tri ung tuyen',
      dataIndex: 'tieuDeTin',
      key: 'tieuDeTin',
      render: (text: string) => <strong>{text}</strong>,
    },
    {
      title: 'Ngay nop',
      dataIndex: 'ngayNop',
      key: 'ngayNop',
      render: (date: string) => dayjs(date).format('DD/MM/YYYY HH:mm'),
    },
    {
      title: 'Trang thai',
      dataIndex: 'trangThai',
      key: 'trangThai',
      render: (status: string) => (
        <Tag color={getStatusColor(status)}>
          {getStatusText(status)}
        </Tag>
      ),
    },
    {
      title: 'Thao tac',
      key: 'action',
      render: (_: any, record: DonUngTuyen) => (
        <Space size="middle">
          <Button 
            type="link" 
            icon={<EyeOutlined />}
            onClick={() => navigate(`/jobs/${record.maTin}`)}
          >
            Xem tin
          </Button>
          <Button 
            type="link" 
            icon={<FileTextOutlined />}
            onClick={() => message.info('Chuc nang xem chi tiet don dang phat trien')}
          >
            Chi tiet
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: '24px', maxWidth: 1200, margin: '0 auto' }}>
      <div style={{ marginBottom: 24 }}>
        <h1>Don ung tuyen cua toi</h1>
        <p>Quan ly tat ca cac don ung tuyen ban da nop</p>
      </div>

      <Card>
        {applications.length === 0 && !loading ? (
          <Empty 
            description="Ban chua nop don ung tuyen nao"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          >
            <Button type="primary" onClick={() => navigate('/jobs')}>
              Tim viec ngay
            </Button>
          </Empty>
        ) : (
          <Table 
            columns={columns} 
            dataSource={applications} 
            rowKey="maDon"
            loading={loading}
            pagination={{ pageSize: 10 }}
          />
        )}
      </Card>
    </div>
  );
};

export default MyApplicationsPage;
