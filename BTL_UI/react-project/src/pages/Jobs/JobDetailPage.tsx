import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Button, Tag, Descriptions, Spin, message, Row, Col, Modal, Form, Input } from 'antd';
import { EnvironmentOutlined, DollarOutlined, CalendarOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { getTinTuyenDungById } from '../../services/jobService';
import { applicationService } from '../../services/applicationService';
import { eventBus, EVENTS } from '../../utils/eventBus';
import type { TinTuyenDung } from '../../types';
import dayjs from 'dayjs';

const { TextArea } = Input;

const JobDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [job, setJob] = useState<TinTuyenDung | null>(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form] = Form.useForm();

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
        message.error('Khong tim thay tin tuyen dung');
        setTimeout(() => navigate('/jobs'), 2000);
      }
    } catch (error) {
      message.error('Co loi xay ra khi tai du lieu');
      setTimeout(() => navigate('/jobs'), 2000);
    } finally {
      setLoading(false);
    }
  };

  const handleApply = () => {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    
    if (!token || !userStr) {
      message.warning('Vui long dang nhap de ung tuyen');
      setTimeout(() => navigate('/login'), 1000);
      return;
    }

    const user = JSON.parse(userStr);
    if (user.maVaiTro !== 3) {
      message.error('Chi ung vien moi co the ung tuyen!');
      return;
    }

    setIsModalOpen(true);
  };

  const handleSubmitApplication = async (values: any) => {
    try {
      setSubmitting(true);
      const userStr = localStorage.getItem('user');
      if (!userStr) {
        message.error('Vui long dang nhap lai!');
        return;
      }
      
      const user = JSON.parse(userStr);
      
      const response = await applicationService.submitApplication({
        maTin: parseInt(id!),
        maUngVien: user.maNguoiDung,
        maFileCV: 1,
        thuGioiThieu: values.thuGioiThieu
      });

      if (response.success) {
        message.success('Nop don ung tuyen thanh cong!');
        eventBus.emit(EVENTS.APPLICATION_SUBMITTED);
        setIsModalOpen(false);
        form.resetFields();
      }
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Nop don that bai!');
    } finally {
      setSubmitting(false);
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
      return `${job.mucLuongToiThieu / 1000000}-${job.mucLuongToiDa / 1000000} trieu VND`;
    }
    return 'Thoa thuan';
  };

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '24px' }}>
      <Button 
        icon={<ArrowLeftOutlined />} 
        onClick={() => navigate('/jobs')}
        style={{ marginBottom: 16 }}
      >
        Quay lai
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
                <CalendarOutlined /> Han nop: {dayjs(job.hanNopHoSo).format('DD/MM/YYYY')}
              </Tag>
            </div>

            <Descriptions title="Thong tin chung" bordered column={1} style={{ marginBottom: 24 }}>
              <Descriptions.Item label="Cong ty">{job.tenCongTy}</Descriptions.Item>
              <Descriptions.Item label="Dia diem">{job.diaDiem}</Descriptions.Item>
              <Descriptions.Item label="Thanh pho">{job.thanhPho}</Descriptions.Item>
              <Descriptions.Item label="Muc luong">{formatSalary()}</Descriptions.Item>
              <Descriptions.Item label="Han nop ho so">{dayjs(job.hanNopHoSo).format('DD/MM/YYYY')}</Descriptions.Item>
              <Descriptions.Item label="Ngay dang">{job.ngayDang ? dayjs(job.ngayDang).format('DD/MM/YYYY') : 'N/A'}</Descriptions.Item>
            </Descriptions>

            <Card title="Mo ta cong viec" style={{ marginBottom: 16 }}>
              <div style={{ whiteSpace: 'pre-wrap' }}>{job.moTa}</div>
            </Card>

            <Card title="Yeu cau cong viec" style={{ marginBottom: 16 }}>
              <div style={{ whiteSpace: 'pre-wrap' }}>{job.yeuCau}</div>
            </Card>

            <Card title="Quyen loi">
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
              Ung tuyen ngay
            </Button>

            <Card title="Thong tin tom tat" size="small">
              <p><strong>Muc luong:</strong> {formatSalary()}</p>
              <p><strong>Dia diem:</strong> {job.diaDiem}</p>
              <p><strong>Han nop:</strong> {dayjs(job.hanNopHoSo).format('DD/MM/YYYY')}</p>
            </Card>

            <Card title="Thong tin cong ty" size="small" style={{ marginTop: 16 }}>
              <h3>{job.tenCongTy}</h3>
              <p><EnvironmentOutlined /> {job.thanhPho}</p>
            </Card>
          </Card>
        </Col>
      </Row>

      <Modal
        title="Ung tuyen vao vi tri"
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
          form.resetFields();
        }}
        footer={null}
        width={600}
      >
        <div style={{ marginBottom: 16 }}>
          <h3>{job?.tieuDe}</h3>
          <p>{job?.tenCongTy}</p>
        </div>

        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmitApplication}
        >
          <Form.Item
            name="thuGioiThieu"
            label="Thu gioi thieu"
            rules={[
              { required: true, message: 'Vui long nhap thu gioi thieu!' },
              { min: 50, message: 'Thu gioi thieu phai co it nhat 50 ky tu!' }
            ]}
          >
            <TextArea 
              rows={6} 
              placeholder="Gioi thieu ban than, kinh nghiem va ly do ban phu hop voi vi tri nay..."
            />
          </Form.Item>

          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit" 
              block 
              size="large"
              loading={submitting}
            >
              Nop don ung tuyen
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default JobDetailPage;
