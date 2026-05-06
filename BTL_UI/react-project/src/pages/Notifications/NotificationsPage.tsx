import { useState, useEffect } from 'react';
import { Card, List, Badge, Button, Empty, message, Spin } from 'antd';
import { BellOutlined, CheckOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/vi';
import { notificationService, type ThongBao } from '../../services/notificationService';
import { getStoredUser } from '../../utils/auth';
import PageContainer from '../../components/Layout/PageContainer';

dayjs.extend(relativeTime);
dayjs.locale('vi');

const NotificationsPage = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<ThongBao[]>([]);
  const [loading, setLoading] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const maNguoiDung = getStoredUser()?.maNguoiDung;

  useEffect(() => {
    if (!maNguoiDung) return;
    loadNotifications(maNguoiDung);
    loadUnreadCount(maNguoiDung);
  }, [maNguoiDung]);

  const loadNotifications = async (userId: number) => {
    setLoading(true);
    try {
      const response = await notificationService.getNotifications(userId);
      if (response.success && response.data) {
        setNotifications(response.data);
      }
    } catch (error) {
      message.error('Không thể tải thông báo');
    } finally {
      setLoading(false);
    }
  };

  const loadUnreadCount = async (userId: number) => {
    try {
      const response = await notificationService.getUnreadCount(userId);
      if (response.success) {
        setUnreadCount((response.data as any).count || 0);
      }
    } catch (error) {
      console.error('Không thể đếm thông báo chưa đọc');
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
      message.error('Không thể đánh dấu đã đọc');
    }
  };

  const handleMarkAllAsRead = async () => {
    if (!maNguoiDung) return;
    try {
      await notificationService.markAllAsRead(maNguoiDung);
      setNotifications(prev => prev.map(n => ({ ...n, daDoc: true })));
      setUnreadCount(0);
      message.success('Đã đánh dấu tất cả đã đọc');
    } catch (error) {
      message.error('Không thể đánh dấu tất cả đã đọc');
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

  const getNotificationIcon = () => {
    return <BellOutlined style={{ fontSize: 24, color: '#1890ff' }} />;
  };

  return (
    <PageContainer>
      <Card
        title={
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>
              <BellOutlined /> Thông báo {unreadCount > 0 && <Badge count={unreadCount} />}
            </span>
            {unreadCount > 0 && (
              <Button type="link" icon={<CheckOutlined />} onClick={handleMarkAllAsRead}>
                Đánh dấu tất cả đã đọc
              </Button>
            )}
          </div>
        }
      >
        <Spin spinning={loading}>
          {notifications.length === 0 ? (
            <Empty description="Không có thông báo nào" />
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
                    avatar={getNotificationIcon()}
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
    </PageContainer>
  );
};

export default NotificationsPage;