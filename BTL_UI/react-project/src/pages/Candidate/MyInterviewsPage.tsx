import { useState, useEffect } from 'react';
import { Card, Table, Tag, Empty, Spin } from 'antd';
import { CalendarOutlined, ClockCircleOutlined, EnvironmentOutlined } from '@ant-design/icons';
import { interviewService } from '../../services/interviewService';
import type { LichPhongVan } from '../../services/interviewService';
import { applicationService } from '../../services/applicationService';
import dayjs from 'dayjs';

const MyInterviewsPage = () => {
  const [interviews, setInterviews] = useState<LichPhongVan[]>([]);
  const [loading, setLoading] = useState(false);

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

  const getStatusColor = (status: string) => {
    const colors: any = {
      'ChuaPhongVan': 'blue',
      'DaPhongVan': 'green',
      'HuyBo': 'red',
      'DoiLich': 'orange'
    };
    return colors[status] || 'default';
  };

  const getStatusText = (status: string) => {
    const texts: any = {
      'ChuaPhongVan': 'Chua phong van',
      'DaPhongVan': 'Da phong van',
      'HuyBo': 'Huy bo',
      'DoiLich': 'Doi lich'
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
    </div>
  );
};

export default MyInterviewsPage;