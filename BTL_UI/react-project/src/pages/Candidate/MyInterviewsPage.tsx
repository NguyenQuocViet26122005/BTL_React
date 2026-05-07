import { useState, useEffect } from 'react';
import { Card, Table, Tag, Empty, Spin, Button, Modal, Descriptions } from 'antd';
import { CalendarOutlined, ClockCircleOutlined, EnvironmentOutlined, EyeOutlined } from '@ant-design/icons';
import { interviewService } from '../../services/interviewService';
import { interviewResultService } from '../../services/interviewResultService';
import type { LichPhongVan } from '../../services/interviewService';
import { applicationService } from '../../services/applicationService';
import { message } from 'antd';
import dayjs from 'dayjs';

const MyInterviewsPage = () => {
  const [interviews, setInterviews] = useState<LichPhongVan[]>([]);
  const [loading, setLoading] = useState(false);
  const [resultModalVisible, setResultModalVisible] = useState(false);
  const [selectedResult, setSelectedResult] = useState<any>(null);

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const userData = JSON.parse(userStr);
      loadInterviews(userData.maNguoiDung);
    }
  }, []);

  const loadInterviews = async (maUngVien: number) => {
    setLoading(true);
    try {
      const appsRes = await applicationService.getMyApplications(maUngVien);
      if (appsRes.success && appsRes.data) {
        const allInterviews: LichPhongVan[] = [];
        for (const app of appsRes.data) {
          const res = await interviewService.getByApplication(app.maDon);
          if (res.success && res.data) {
            const interviewsWithInfo = res.data.map((interview: LichPhongVan) => ({
              ...interview,
              viTriUngTuyen: app.tieuDeTin
            }));
            allInterviews.push(...interviewsWithInfo);
          }
        }
        setInterviews(allInterviews);
      }
    } catch (error) {
      console.error('Error loading interviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const viewResult = async (maLich: number) => {
    try {
      const res = await interviewResultService.getByLich(maLich);
      if (res.success && res.data) {
        setSelectedResult(res.data);
        setResultModalVisible(true);
      } else {
        message.info('Chua co ket qua phong van');
      }
    } catch (error) {
      message.error('Khong the tai ket qua');
    }
  };

  const getStatusColor = (status: string) => {
    const colors: any = {
      'DaLen': 'blue',
      'HoanThanh': 'green',
      'HuyBo': 'red',
      'VangMat': 'orange'
    };
    return colors[status] || 'default';
  };

  const getStatusText = (status: string) => {
    const texts: any = {
      'DaLen': 'Da len lich',
      'HoanThanh': 'Hoan thanh',
      'HuyBo': 'Huy bo',
      'VangMat': 'Vang mat'
    };
    return texts[status] || status;
  };

  const columns = [
    {
      title: 'Vi tri ung tuyen',
      dataIndex: 'viTriUngTuyen',
      key: 'viTriUngTuyen',
      render: (text: string) => <div style={{ fontWeight: 500 }}>{text}</div>
    },
    {
      title: 'Vong phong van',
      dataIndex: 'vongPhongVan',
      key: 'vongPhongVan',
      render: (vong: number) => `Vong ${vong}`
    },
    {
      title: 'Thoi gian',
      dataIndex: 'thoiGian',
      key: 'thoiGian',
      render: (time: string, record: LichPhongVan) => (
        <div>
          <div><CalendarOutlined /> {dayjs(time).format('DD/MM/YYYY')}</div>
          <div><ClockCircleOutlined /> {dayjs(time).format('HH:mm')} ({record.thoiLuongPhut || 60} phut)</div>
        </div>
      )
    },
    {
      title: 'Hinh thuc',
      dataIndex: 'hinhThuc',
      key: 'hinhThuc',
      render: (hinhThuc: string, record: LichPhongVan) => (
        <div>
          <div>{hinhThuc}</div>
          {record.diaDiem && (
            <div style={{ fontSize: 12, color: '#666' }}>
              <EnvironmentOutlined /> {record.diaDiem}
            </div>
          )}
        </div>
      )
    },
    {
      title: 'Nguoi lien he',
      dataIndex: 'tenNguoiLich',
      key: 'tenNguoiLich'
    },
    {
      title: 'Trang thai',
      dataIndex: 'trangThai',
      key: 'trangThai',
      render: (status: string) => (
        <Tag color={getStatusColor(status)}>{getStatusText(status)}</Tag>
      )
    },
    {
      title: 'Ghi chu',
      dataIndex: 'ghiChu',
      key: 'ghiChu',
      render: (text: string) => text || '-'
    },
    {
      title: 'Ket qua',
      key: 'ketQua',
      render: (_: any, record: LichPhongVan) => {
        if (record.trangThai === 'HoanThanh') {
          return (
            <Button 
              size="small" 
              icon={<EyeOutlined />}
              onClick={() => viewResult(record.maLich)}
            >
              Xem
            </Button>
          );
        }
        return '-';
      }
    }
  ];

  return (
    <div style={{ padding: 24 }}>
      <Card
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <CalendarOutlined />
            <span>Lich phong van cua toi</span>
          </div>
        }
      >
        {loading ? (
          <div style={{ textAlign: 'center', padding: 40 }}>
            <Spin size="large" />
          </div>
        ) : interviews.length === 0 ? (
          <Empty description="Ban chua co lich phong van nao" />
        ) : (
          <Table
            columns={columns}
            dataSource={interviews}
            rowKey="maLich"
            pagination={{ pageSize: 10 }}
          />
        )}
      </Card>

      <Modal
        title="Ket qua phong van"
        open={resultModalVisible}
        onCancel={() => {
          setResultModalVisible(false);
          setSelectedResult(null);
        }}
        footer={[
          <Button key="close" type="primary" onClick={() => {
            setResultModalVisible(false);
            setSelectedResult(null);
          }}>
            Dong
          </Button>
        ]}
        width={600}
      >
        {selectedResult && (
          <Descriptions column={1} bordered>
            <Descriptions.Item label="Diem tong quat">
              <Tag color="blue">{selectedResult.diemTongQuat}/5</Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Diem ky thuat">
              <Tag color="blue">{selectedResult.diemKyThuat}/5</Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Diem ky nang mem">
              <Tag color="blue">{selectedResult.diemKyNangMem}/5</Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Ket qua">
              <Tag color={selectedResult.ketQua === 'Dat' ? 'green' : selectedResult.ketQua === 'KhongDat' ? 'red' : 'orange'}>
                {selectedResult.ketQua === 'Dat' ? 'Dat' : selectedResult.ketQua === 'KhongDat' ? 'Khong dat' : 'Cho danh gia'}
              </Tag>
            </Descriptions.Item>
            {selectedResult.nhanXet && (
              <Descriptions.Item label="Nhan xet">
                <div style={{ whiteSpace: 'pre-wrap' }}>{selectedResult.nhanXet}</div>
              </Descriptions.Item>
            )}
            <Descriptions.Item label="Nguoi danh gia">
              {selectedResult.tenNguoiDanhGia || 'N/A'}
            </Descriptions.Item>
            <Descriptions.Item label="Ngay danh gia">
              {dayjs(selectedResult.ngayTao).format('DD/MM/YYYY HH:mm')}
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
    </div>
  );
};

export default MyInterviewsPage;