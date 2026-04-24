import { useState, useEffect } from 'react';
import { Badge, Button } from 'antd';
import { BellOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { notificationService } from '../../services/notificationService';

interface NotificationBellProps {
  maNguoiDung: number;
}

const NotificationBell = ({ maNguoiDung }: NotificationBellProps) => {
  const navigate = useNavigate();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    loadUnreadCount();
    
    // Poll every 30 seconds for new notifications
    const interval = setInterval(loadUnreadCount, 30000);
    
    return () => clearInterval(interval);
  }, [maNguoiDung]);

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

  return (
    <Badge count={unreadCount} offset={[-5, 5]}>
      <Button
        type="link"
        icon={<BellOutlined style={{ fontSize: 18 }} />}
        onClick={() => navigate('/notifications')}
        style={{ color: '#fff' }}
      />
    </Badge>
  );
};

export default NotificationBell;