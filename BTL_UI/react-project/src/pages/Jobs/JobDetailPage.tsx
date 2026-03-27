import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Button, Tag, Descriptions, Spin, message, Row, Col } from 'antd';
import { EnvironmentOutlined, DollarOutlined, CalendarOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { getTinTuyenDungById } from '../../services/jobService';
import type { TinTuyenDung } from '../../types';
import dayjs from 'dayjs';

const JobDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [job, setJob] = useState<TinTuyenDung | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchJobDetail(parseInt(id));
    }
  }, [id]);

  const fetchJobDetail = async (maTin: number) => {
    try {
      setLoading(true);
      const response = await getTinTuyenDungById(maTin);
      if (response.success && response.data) {
        setJob(response.data);
      } else {
        message.error('Không tìm thấy tin tuyển dụng');
        setTimeout(() => navigate('/jobs'), 2000);
      }
    } catch (error) {
      message.error('Có lỗi xảy ra khi tải dữ liệu');
      setTimeout(() => navigate('/jobs'), 2000);
    } finally {
      setLoading(false);
    }
  };

  const handleApply = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      message.warning('Vui lòng đăng nhập để ứng tuyển');
      setTimeout(() => navigate('/login'), 1000);
    } else {
      message.info('Chức năng ứng tuyển đang được phát triển');
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!job) {
    return null;
  }

  const formatSalary = () => {
    if (job.mucLuongToiThieu && job.mucLuongToiDa) {
      return `${job.mucLuongToiThieu / 1000000}-${job.mucLuongToiDa / 1000000} triệu VNĐ`;
    }
    return 'Thỏa thuận';
  };

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '24px' }}>
      <Button 
        icon={<ArrowLeftOutlined />} 
        onClick={() => navigate('/jobs')}
        style={{ marginBottom: 16 }}
      >
        Quay lại
      </Button>

      <Row gutter={[24, 24]}>
        <Col xs={24} lg={16}>
          <Card>
            <h1 style={{ marginBottom: 16 }}>{job.tieuDe}</h1>
            
            <div style={{ marginBottom: 24 }}>
              <Tag color="blue" style={{ marginRight: 8 }}>
                <EnvironmentOutlined /> {job.diaDiem}
              </Tag>
              <Tag color="green" style={{ marginRight: 8 }}>
                <DollarOutlined /> {formatSalary()}
              </Tag>
              <Tag color="orange">
                <CalendarOutlined /> Hạn nộp: {dayjs(job.hanNopHoSo).format('DD/MM/YYYY')}
              </Tag>
            </div>

            <Descriptions title="Thông tin chung" bordered column={1} style={{ marginBottom: 24 }}>
              <Descriptions.Item label="Công ty">{job.tenCongTy}</Descriptions.Item>
              <Descriptions.Item label="Địa điểm">{job.diaDiem}</Descriptions.Item>
              <Descriptions.Item label="Thành phố">{job.thanhPho}</Descriptions.Item>
              <Descriptions.Item label="Mức lương">{formatSalary()}</Descriptions.Item>
              <Descriptions.Item label="Hạn nộp hồ sơ">{dayjs(job.hanNopHoSo).format('DD/MM/YYYY')}</Descriptions.Item>
              <Descriptions.Item label="Ngày đăng">{job.ngayDang ? dayjs(job.ngayDang).format('DD/MM/YYYY') : 'N/A'}</Descriptions.Item>
            </Descriptions>

            <Card title="Mô tả công việc" style={{ marginBottom: 16 }}>
              <div style={{ whiteSpace: 'pre-wrap' }}>{job.moTa}</div>
            </Card>

            <Card title="Yêu cầu công việc" style={{ marginBottom: 16 }}>
              <div style={{ whiteSpace: 'pre-wrap' }}>{job.yeuCau}</div>
            </Card>

            <Card title="Quyền lợi">
              <div style={{ whiteSpace: 'pre-wrap' }}>{job.quyenLoi}</div>
            </Card>
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          <Card>
            <Button 
              type="primary" 
              size="large" 
              block
              onClick={handleApply}
              style={{ marginBottom: 16 }}
            >
              Ứng tuyển ngay
            </Button>

            <Card title="Thông tin tóm tắt" size="small">
              <p><strong>Mức lương:</strong> {formatSalary()}</p>
              <p><strong>Địa điểm:</strong> {job.diaDiem}</p>
              <p><strong>Hạn nộp:</strong> {dayjs(job.hanNopHoSo).format('DD/MM/YYYY')}</p>
            </Card>

            <Card title="Thông tin công ty" size="small" style={{ marginTop: 16 }}>
              <h3>{job.tenCongTy}</h3>
              <p><EnvironmentOutlined /> {job.thanhPho}</p>
            </Card>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default JobDetailPage;