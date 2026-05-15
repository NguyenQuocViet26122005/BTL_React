import React, { useState, useEffect } from 'react';
import { Card, List, Button, message, Empty, Tag, Space, Spin } from 'antd';
import { HeartFilled, EnvironmentOutlined, DollarOutlined, EyeOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import savedJobService from '../../services/savedJobService';
import type { SavedJobItem } from '../../services/savedJobService';
import dayjs from 'dayjs';

const SavedJobsPage: React.FC = () => {
  const navigate = useNavigate();
  const [savedJobs, setSavedJobs] = useState<SavedJobItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchSavedJobs();
  }, []);

  const fetchSavedJobs = async () => {
    setLoading(true);
    try {
      const response = await savedJobService.getMySavedJobs();
      if (response.success && response.data) {
        setSavedJobs(response.data);
      }
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Khong the tai danh sach tin da luu');
    } finally {
      setLoading(false);
    }
  };

  const handleUnsave = async (maTin: number) => {
    try {
      const response = await savedJobService.unsaveJob(maTin);
      if (response.success) {
        message.success('Da bo luu tin');
        fetchSavedJobs();
      }
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Bo luu tin that bai');
    }
  };

  const formatSalary = (min?: number, max?: number, currency?: string) => {
    const unit = currency || 'VND';
    if (min && max) {
      return `${min.toLocaleString()} - ${max.toLocaleString()} ${unit}`;
    } else if (min) {
      return `Tu ${min.toLocaleString()} ${unit}`;
    } else if (max) {
      return `Toi da ${max.toLocaleString()} ${unit}`;
    }
    return 'Thoa thuan';
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '100px' }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      <Card title={<span><HeartFilled style={{ color: '#ff4d4f', marginRight: 8 }} />Tin tuyen dung da luu ({savedJobs.length})</span>}>
        {savedJobs.length === 0 ? (
          <Empty description="Ban chua luu tin tuyen dung nao" />
        ) : (
          <List
            itemLayout="vertical"
            dataSource={savedJobs}
            renderItem={(item) => (
              <List.Item
                key={item.maTin}
                actions={[
                  <Button
                    type="primary"
                    icon={<EyeOutlined />}
                    onClick={() => navigate(`/jobs/${item.maTin}`)}
                  >
                    Xem chi tiet
                  </Button>,
                  <Button
                    danger
                    icon={<HeartFilled />}
                    onClick={() => handleUnsave(item.maTin)}
                  >
                    Bo luu
                  </Button>
                ]}
              >
                <List.Item.Meta
                  title={
                    <a onClick={() => navigate(`/jobs/${item.maTin}`)} style={{ fontSize: '18px', cursor: 'pointer' }}>
                      {item.tieuDe}
                    </a>
                  }
                  description={
                    <Space direction="vertical" size="small">
                      <div>
                        <strong>{item.tenCongTy}</strong>
                      </div>
                      <Space wrap>
                        {item.thanhPho && (
                          <Tag icon={<EnvironmentOutlined />} color="blue">
                            {item.thanhPho}
                          </Tag>
                        )}
                        <Tag icon={<DollarOutlined />} color="green">
                          {formatSalary(item.mucLuongToiThieu, item.mucLuongToiDa, item.donViTien)}
                        </Tag>
                      </Space>
                      <div style={{ color: '#999', fontSize: '12px' }}>
                        Da luu: {dayjs(item.ngayLuu).format('DD/MM/YYYY HH:mm')}
                      </div>
                    </Space>
                  }
                />
              </List.Item>
            )}
          />
        )}
      </Card>
    </div>
  );
};

export default SavedJobsPage;
