import { useEffect, useState } from 'react';
import { Card, Table, Tag, Button, Space, message, Empty, Modal, Descriptions, Alert, Divider } from 'antd';
import { EyeOutlined, FileTextOutlined, InfoCircleOutlined, FileOutlined, DownloadOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { applicationService } from '../../services/applicationService';
import type { DonUngTuyen } from '../../types';
import dayjs from 'dayjs';

const MyApplicationsPage = () => {
  const navigate = useNavigate();
  const [applications, setApplications] = useState<DonUngTuyen[]>([]);
  const [loading, setLoading] = useState(false);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedApp, setSelectedApp] = useState<DonUngTuyen | null>(null);

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
      const response = await applicationService.getMyApplications(maUngVien);
      
      if (response.success && response.data) {
        setApplications(response.data);
      } else {
        message.warning(response.message || 'Khong co don ung tuyen nao');
      }
    } catch (error: any) {
      console.error('Error fetching applications:', error);
      message.error(error.response?.data?.message || 'Khong the tai danh sach don ung tuyen!');
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetail = (app: DonUngTuyen) => {
    setSelectedApp(app);
    setDetailModalOpen(true);
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
            icon={<InfoCircleOutlined />}
            onClick={() => handleViewDetail(record)}
          >
            Chi tiet
          </Button>
          <Button 
            type="link" 
            icon={<EyeOutlined />}
            onClick={() => navigate(`/jobs/${record.maTin}`)}
          >
            Xem tin
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

      <Modal
        title="Chi tiet don ung tuyen"
        open={detailModalOpen}
        onCancel={() => {
          setDetailModalOpen(false);
          setSelectedApp(null);
        }}
        width={800}
        footer={[
          <Button key="viewJob" onClick={() => {
            if (selectedApp) navigate(`/jobs/${selectedApp.maTin}`);
          }}>
            Xem tin tuyen dung
          </Button>,
          <Button key="close" type="primary" onClick={() => {
            setDetailModalOpen(false);
            setSelectedApp(null);
          }}>
            Dong
          </Button>
        ]}
      >
        {selectedApp && (
          <div>
            <Descriptions column={2} bordered style={{ marginBottom: 16 }}>
              <Descriptions.Item label="Vi tri ung tuyen" span={2}>
                <strong style={{ fontSize: 16 }}>{selectedApp.tieuDeTin}</strong>
              </Descriptions.Item>
              <Descriptions.Item label="Trang thai">
                <Tag color={getStatusColor(selectedApp.trangThai)}>
                  {getStatusText(selectedApp.trangThai)}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Ngay nop">
                {dayjs(selectedApp.ngayNop).format('DD/MM/YYYY HH:mm')}
              </Descriptions.Item>
              <Descriptions.Item label="Ngay cap nhat" span={2}>
                {selectedApp.ngayCapNhat ? dayjs(selectedApp.ngayCapNhat).format('DD/MM/YYYY HH:mm') : 'Chua cap nhat'}
              </Descriptions.Item>
              <Descriptions.Item label="CV da su dung" span={2}>
                <Space>
                  <FileOutlined />
                  {selectedApp.tenFileCV || 'Khong co thong tin'}
                  {selectedApp.duongDanFileCV && (
                    <Button 
                      type="link" 
                      size="small" 
                      icon={<DownloadOutlined />}
                      href={`https://localhost:44314${selectedApp.duongDanFileCV}`}
                      target="_blank"
                    >
                      Tai xuong
                    </Button>
                  )}
                </Space>
              </Descriptions.Item>
            </Descriptions>

            <Divider>Thu gioi thieu</Divider>
            {selectedApp.thuGioiThieu ? (
              <Card style={{ backgroundColor: '#f5f5f5' }}>
                <p style={{ whiteSpace: 'pre-wrap', margin: 0 }}>
                  {selectedApp.thuGioiThieu}
                </p>
              </Card>
            ) : (
              <Alert message="Khong co thu gioi thieu" type="info" />
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default MyApplicationsPage;