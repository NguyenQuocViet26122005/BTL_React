import { useState, useEffect } from 'react';
import { Card, List, Badge, Button, Empty, message, Spin } from 'antd';
import { BellOutlined, CheckOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/vi';
import { notificationService, type ThongBao } from '../../services/notificationService';

dayjs.extend(relativeTime);
dayjs.locale('vi');

const NotificationsPage = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<ThongBao[]>([]);
  const [loading, setLoading] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const maNguoiDung = user.maNguoiDung;

  useEffect(() => {
    loadNotifications();
    loadUnreadCount();
  }, []);

  const loadNotifications = async () => {
    setLoading(true);
    try {
      const response = await notificationService.getNotifications(maNguoiDung);
      if (response.success && response.data) {
        setNotifications(response.data);
      }
    } catch (error) {
      message.error('Khong the tai thong bao');
    } finally {
      setLoading(false);
    }
  };

  const loadUnreadCount = async () => {
    try {
      const response = await notificationService.getUnreadCount(maNguoiDung);
      if (response.success) {
        setUnreadCount((response.data as any).count || 0);
      }
    } catch (error) {
      console.error('Khong the dem thong bao chua doc');
    }
  };

  const handleMarkAsRead = async (maThongBao: number) => {
    try {
      await notificationService.markAsRead(maThongBao);
      setNotifications(prev =>
        prev.map(n => n.maThongBao === maThongBao ? { ...n, daDoc: true } : n)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      message.error('Khong the danh dau da doc');
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead(maNguoiDung);
      setNotifications(prev => prev.map(n => ({ ...n, daDoc: true })));
      setUnreadCount(0);
      message.success('Da danh dau tat ca da doc');
    } catch (error) {
      message.error('Khong the danh dau tat ca da doc');
    }
  };

  const handleNotificationClick = (notification: ThongBao) => {
    if (!notification.daDoc) {
      handleMarkAsRead(notification.maThongBao);
    }

    if (notification.loaiLienKet && notification.maLienKet) {
      switch (notification.loaiLienKet) {
        case 'DonUngTuyen':
          navigate('/profile');
          break;
        case 'LichPhongVan':
          navigate('/candidate/interviews');
          break;
        case 'TinTuyenDung':
          navigate(`/jobs/${notification.maLienKet}`);
          break;
        default:
          break;
      }
    }
  };

  const getNotificationIcon = (loaiThongBao: string) => {
    return <BellOutlined style={{ fontSize: 24, color: '#1890ff' }} />;
  };

  return (
    <div style={{ padding: '24px', maxWidth: 1200, margin: '0 auto' }}>
      <Card
        title={
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>
              <BellOutlined /> Thong bao {unreadCount > 0 && <Badge count={unreadCount} />}
            </span>
            {unreadCount > 0 && (
              <Button type="link" icon={<CheckOutlined />} onClick={handleMarkAllAsRead}>
                Danh dau tat ca da doc
              </Button>
            )}
          </div>
        }
      >
        <Spin spinning={loading}>
          {notifications.length === 0 ? (
            <Empty description="Khong co thong bao nao" />
          ) : (
            <List
              dataSource={notifications}
              renderItem={(item) => (
                <List.Item
                  style={{
                    backgroundColor: item.daDoc ? 'white' : '#e6f7ff',
                    padding: '16px',
                    cursor: 'pointer',
                    borderRadius: '4px',
                    marginBottom: '8px'
                  }}
                  onClick={() => handleNotificationClick(item)}
                >
                  <List.Item.Meta
                    avatar={getNotificationIcon(item.loaiThongBao)}
                    title={
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ fontWeight: item.daDoc ? 'normal' : 'bold' }}>
                          {item.tieuDe}
                        </span>
                        <span style={{ fontSize: 12, color: '#999' }}>
                          {dayjs(item.ngayTao).fromNow()}
                        </span>
                      </div>
                    }
                    description={item.noiDung}
                  />
                </List.Item>
              )}
            />
          )}
        </Spin>
      </Card>
    </div>
  );
};

export default NotificationsPage;