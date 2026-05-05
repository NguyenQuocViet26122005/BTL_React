import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Button, Tag, Descriptions, Spin, message, Row, Col, Modal, Form, Input, Select, Alert } from 'antd';
import { EnvironmentOutlined, DollarOutlined, CalendarOutlined, ArrowLeftOutlined, FileOutlined, HeartOutlined, HeartFilled } from '@ant-design/icons';
import savedJobService from '../../services/savedJobService';
import { getTinTuyenDungById } from '../../services/jobService';
import { applicationService } from '../../services/applicationService';
import cvService, { type FileCv } from '../../services/cvService';
import { resumeService } from '../../services/resumeService';
import { eventBus, EVENTS } from '../../utils/eventBus';
import type { TinTuyenDung } from '../../types';
import dayjs from 'dayjs';
import { getStoredUser, ROLE_CANDIDATE } from '../../utils/auth';

const { TextArea } = Input;

const JobDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [job, setJob] = useState<TinTuyenDung | null>(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [cvList, setCvList] = useState<FileCv[]>([]);
  const [loadingCv, setLoadingCv] = useState(false);
  const [hasResume, setHasResume] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [savingJob, setSavingJob] = useState(false);
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
        await checkSavedStatus(maTin);
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

  const checkSavedStatus = async (maTin: number) => {
    try {
      const user = getStoredUser();
      if (!user || user.maVaiTro !== ROLE_CANDIDATE) return;

      const response = await savedJobService.getMySavedJobs();
      if (response.success && response.data) {
        const saved = response.data.some(item => item.maTin === maTin);
        setIsSaved(saved);
      }
    } catch (error) {
      console.error('Error checking saved status:', error);
    }
  };

  const handleToggleSave = async () => {
    const user = getStoredUser();
    if (!user) {
      message.warning('Vui lòng đăng nhập để lưu tin');
      setTimeout(() => navigate('/login'), 1000);
      return;
    }

    if (user.maVaiTro !== ROLE_CANDIDATE) {
      message.error('Chỉ ứng viên mới có thể lưu tin!');
      return;
    }

    if (!job) return;

    setSavingJob(true);
    try {
      if (isSaved) {
        const response = await savedJobService.unsaveJob(job.maTin);
        if (response.success) {
          message.success('Đã bỏ lưu tin');
          setIsSaved(false);
        }
      } else {
        const response = await savedJobService.saveJob(job.maTin);
        if (response.success) {
          message.success('Đã lưu tin');
          setIsSaved(true);
        }
      }
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Thao tác thất bại');
    } finally {
      setSavingJob(false);
    }
  };

  const loadCvList = async (maNguoiDung: number) => {
    setLoadingCv(true);
    try {
      const resResume = await resumeService.getMyResume(maNguoiDung);
      if (resResume.success && resResume.data) {
        setHasResume(true);
        const resCv = await cvService.getCvByHoSo(resResume.data.maHoSo);
        if (resCv.success && resCv.data) {
          setCvList(resCv.data);
          const defaultCv = resCv.data.find(cv => cv.laMacDinh);
          if (defaultCv) {
            form.setFieldValue('maFileCV', defaultCv.maFileCv);
          }
        }
      } else {
        setHasResume(false);
      }
    } catch (error) {
      console.error('Error loading CV:', error);
    } finally {
      setLoadingCv(false);
    }
  };

  const handleApply = () => {
    const token = localStorage.getItem('token');
    const user = getStoredUser();

    if (!token || !user) {
      message.warning('Vui lòng đăng nhập để ứng tuyển');
      setTimeout(() => navigate('/login'), 1000);
      return;
    }

    if (user.maVaiTro !== ROLE_CANDIDATE) {
      message.error('Chỉ ứng viên mới có thể ứng tuyển!');
      return;
    }

    loadCvList(user.maNguoiDung);
    setIsModalOpen(true);
  };

  const handleSubmitApplication = async (values: any) => {
    try {
      setSubmitting(true);
      const user = getStoredUser();
      if (!user) {
        message.error('Vui lòng đăng nhập lại!');
        return;
      }

      if (!values.maFileCV) {
        message.error('Vui lòng chọn CV!');
        return;
      }
      
      const response = await applicationService.submitApplication({
        maTin: parseInt(id!),
        maUngVien: user.maNguoiDung,
        maFileCV: values.maFileCV,
        thuGioiThieu: values.thuGioiThieu
      });

      if (response.success) {
        message.success('Nộp đơn ứng tuyển thành công!');
        eventBus.emit(EVENTS.APPLICATION_SUBMITTED);
        setIsModalOpen(false);
        form.resetFields();
      }
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Nộp đơn thất bại!');
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
      return `${job.mucLuongToiThieu / 1000000}-${job.mucLuongToiDa / 1000000} triệu VND`;
    }
    return 'Thỏa thuận';
  };

  return (
    <div style={{ background: '#fff', minHeight: 'calc(100vh - 64px)' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
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
              block
              icon={isSaved ? <HeartFilled /> : <HeartOutlined />}
              loading={savingJob}
              onClick={handleToggleSave}
              style={{ marginBottom: 12 }}
            >
              {isSaved ? 'Đã lưu tin' : 'Lưu tin'}
            </Button>

            <Button
              type="primary"
              size="large" 
              block
              onClick={handleApply}
              style={{ marginBottom: 16 }}
            >
              Ứng tuyển ngay
            </Button>

            <Card title="Thong tin tom tat" size="small">
              <p><strong>Mức lương:</strong> {formatSalary()}</p>
              <p><strong>Địa điểm:</strong> {job.diaDiem}</p>
              <p><strong>Hạn nộp:</strong> {dayjs(job.hanNopHoSo).format('DD/MM/YYYY')}</p>
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

        {!hasResume ? (
          <Alert
            message="Ban chua co hồ sơ ung vien"
            description="Vui long tao hồ sơ ung vien truoc khi ung tuyen"
            type="warning"
            showIcon
            action={
              <Button size="small" type="primary" onClick={() => navigate('/candidate/resume')}>
                Tao hồ sơ
              </Button>
            }
          />
        ) : cvList.length === 0 ? (
          <Alert
            message="Ban chua co CV nao"
            description="Vui long tai len CV truoc khi ung tuyen"
            type="warning"
            showIcon
            action={
              <Button size="small" type="primary" onClick={() => navigate('/profile')}>
                Tai len CV
              </Button>
            }
          />
        ) : (
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmitApplication}
          >
            <Form.Item
              name="maFileCV"
              label="Chon CV"
              rules={[{ required: true, message: 'Vui lòng chọn CV!' }]}
            >
              <Select
                placeholder="Chon CV de ung tuyen"
                loading={loadingCv}
                size="large"
              >
                {cvList.map(cv => (
                  <Select.Option key={cv.maFileCv} value={cv.maFileCv}>
                    <FileOutlined /> {cv.tenFile} {cv.laMacDinh && <Tag color="gold">Mac dinh</Tag>}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>

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
        )}
      </Modal>
      </div>
    </div>
  );
};

export default JobDetailPage;