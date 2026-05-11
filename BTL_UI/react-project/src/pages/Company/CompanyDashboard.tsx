import { Card, Row, Col, Statistic, Button, Table, Tag, Modal, Form, Input, InputNumber, DatePicker, Select, message, Space, Popconfirm } from 'antd';
import { PlusOutlined, FileTextOutlined, UserOutlined, EyeOutlined, EditOutlined, DeleteOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import { getTinTuyenDungByUser, createTinTuyenDung, updateTinTuyenDung, deleteTinTuyenDung, getTinTuyenDungById } from '../../services/jobService';
import { applicationService } from '../../services/applicationService';
import { eventBus, EVENTS } from '../../utils/eventBus';
import type { TinTuyenDung, DonUngTuyen } from '../../types';
import dayjs from 'dayjs';

const { TextArea } = Input;

const CompanyDashboard = () => {
  const [user, setUser] = useState<any>(null);
  const [jobs, setJobs] = useState<TinTuyenDung[]>([]);
  const [applications, setApplications] = useState<DonUngTuyen[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingJobId, setEditingJobId] = useState<number | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<TinTuyenDung | null>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const userData = JSON.parse(userStr);
      setUser(userData);
      fetchJobs(userData.maNguoiDung);
      fetchApplications(userData.maNguoiDung);
    }

    // Listen for events
    const handleJobCreated = () => {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        const userData = JSON.parse(userStr);
        fetchJobs(userData.maNguoiDung);
      }
    };

    const handleApplicationSubmitted = () => {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        const userData = JSON.parse(userStr);
        fetchApplications(userData.maNguoiDung);
      }
    };

    eventBus.on(EVENTS.JOB_CREATED, handleJobCreated);
    eventBus.on(EVENTS.JOB_UPDATED, handleJobCreated);
    eventBus.on(EVENTS.JOB_DELETED, handleJobCreated);
    eventBus.on(EVENTS.APPLICATION_SUBMITTED, handleApplicationSubmitted);

    return () => {
      eventBus.off(EVENTS.JOB_CREATED, handleJobCreated);
      eventBus.off(EVENTS.JOB_UPDATED, handleJobCreated);
      eventBus.off(EVENTS.JOB_DELETED, handleJobCreated);
      eventBus.off(EVENTS.APPLICATION_SUBMITTED, handleApplicationSubmitted);
    };
  }, []);

  const fetchJobs = async (maNguoiDung: number) => {
    try {
      setLoading(true);
      const response = await getTinTuyenDungByUser(maNguoiDung);
      if (response.success && response.data) {
        setJobs(response.data);
      }
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchApplications = async (maNguoiDung: number) => {
    try {
      const response = await applicationService.getCompanyApplications(maNguoiDung);
      if (response.success && response.data) {
        setApplications(response.data);
      }
    } catch (error) {
      console.error('Error fetching applications:', error);
    }
  };

  const handleViewDetail = async (maTin: number) => {
    try {
      setLoading(true);
      const response = await getTinTuyenDungById(maTin);
      if (response.success && response.data) {
        setSelectedJob(response.data);
        setIsDetailModalOpen(true);
      }
    } catch (error) {
      message.error('Không thể tải chi tiết tin tuyển dụng!');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async (maTin: number) => {
    try {
      setLoading(true);
      const response = await getTinTuyenDungById(maTin);
      if (response.success && response.data) {
        const job = response.data;
        form.setFieldsValue({
          tieuDe: job.tieuDe,
          moTa: job.moTa,
          yeuCau: job.yeuCau,
          quyenLoi: job.quyenLoi,
          hinhThucLamViec: job.hinhThucLamViec,
          kinhNghiem: job.kinhNghiem,
          mucLuongToiThieu: job.mucLuongToiThieu,
          mucLuongToiDa: job.mucLuongToiDa,
          diaDiem: job.diaDiem,
          thanhPho: job.thanhPho,
          hanNopHoSo: job.hanNopHoSo ? dayjs(job.hanNopHoSo) : null,
          soLuongTuyen: job.soLuongTuyen
        });
        setEditingJobId(maTin);
        setIsEditMode(true);
        setIsModalOpen(true);
      }
    } catch (error) {
      message.error('Không thể tải thông tin tin tuyển dụng!');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (maTin: number) => {
    try {
      const response = await deleteTinTuyenDung(maTin);
      if (response.success) {
        message.success('Xóa tin tuyển dụng thành công!');
        fetchJobs(user.maNguoiDung);
        eventBus.emit(EVENTS.JOB_DELETED);
      }
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Xóa tin thất bại!');
    }
  };

  const handleCreateJob = async (values: any) => {
    try {
      const jobData = {
        maCongTy: user.maCongTy || 1,
        maNguoiDang: user.maNguoiDung,
        tieuDe: values.tieuDe,
        moTa: values.moTa,
        yeuCau: values.yeuCau,
        quyenLoi: values.quyenLoi,
        hinhThucLamViec: values.hinhThucLamViec || 'ToanThoiGian',
        kinhNghiem: values.kinhNghiem,
        mucLuong: values.mucLuongToiThieu || values.mucLuongToiDa || 1000000,
        mucLuongToiThieu: values.mucLuongToiThieu,
        mucLuongToiDa: values.mucLuongToiDa,
        diaDiem: values.diaDiem,
        thanhPho: values.thanhPho,
        hanNopHoSo: values.hanNopHoSo ? values.hanNopHoSo.format('YYYY-MM-DD') : null,
        soLuongTuyen: values.soLuongTuyen || 1
      };

      if (isEditMode && editingJobId) {
        const response = await updateTinTuyenDung(editingJobId, jobData);
        if (response.success) {
          message.success('Cập nhật tin tuyển dụng thành công!');
          setIsModalOpen(false);
          setIsEditMode(false);
          setEditingJobId(null);
          form.resetFields();
          fetchJobs(user.maNguoiDung);
          eventBus.emit(EVENTS.JOB_UPDATED);
        }
      } else {
        const response = await createTinTuyenDung(jobData);
        if (response.success) {
          message.success('Đăng tin tuyển dụng thành công!');
          setIsModalOpen(false);
          form.resetFields();
          fetchJobs(user.maNguoiDung);
          eventBus.emit(EVENTS.JOB_CREATED);
        }
      }
    } catch (error: any) {
      message.error(error.response?.data?.message || (isEditMode ? 'Cập nhật tin thất bại!' : 'Đăng tin thất bại!'));
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setIsEditMode(false);
    setEditingJobId(null);
    form.resetFields();
  };

  const stats = {
    totalJobs: jobs.length,
    activeJobs: jobs.filter(j => j.trangThai === 'active' || j.trangThai === 'DaDuyet').length,
    totalApplications: applications.length,
    pendingApplications: applications.filter(a => a.trangThai === 'DaNop' || a.trangThai === 'DangXem').length
  };

  const columns = [
    {
      title: 'Tiêu đề',
      dataIndex: 'tieuDe',
      key: 'tieuDe',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'trangThai',
      key: 'trangThai',
      render: (status: string) => {
        const colorMap: any = {
          'DaDuyet': 'green',
          'ChoDuyet': 'orange',
          'TuChoi': 'red',
          'DaDong': 'default'
        };
        return <Tag color={colorMap[status] || 'default'}>{status}</Tag>;
      },
    },
    {
      title: 'Địa điểm',
      dataIndex: 'diaDiem',
      key: 'diaDiem',
    },
    {
      title: 'Hạn nộp',
      dataIndex: 'hanNopHoSo',
      key: 'hanNopHoSo',
      render: (date: string) => date ? dayjs(date).format('DD/MM/YYYY') : 'N/A',
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_: any, record: TinTuyenDung) => (
        <Space size="middle">
          <Button 
            type="link" 
            icon={<InfoCircleOutlined />}
            onClick={() => handleViewDetail(record.maTin)}
          >
            Chi tiết
          </Button>
          <Button 
            type="link" 
            icon={<EditOutlined />}
            onClick={() => handleEdit(record.maTin)}
          >
            Sửa
          </Button>
          <Popconfirm
            title="Xóa tin tuyển dụng"
            description="Bạn có chắc chắn muốn xóa tin này?"
            onConfirm={() => handleDelete(record.maTin)}
            okText="Xóa"
            cancelText="Hủy"
          >
            <Button 
              type="link" 
              danger
              icon={<DeleteOutlined />}
            >
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ background: '#fff', minHeight: 'calc(100vh - 64px)' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      <div style={{ marginBottom: 24 }}>
        <h1>Chào mừng, {user?.hoTen || 'Nhà tuyển dụng'}</h1>
        <p>Quản lý tin tuyển dụng và ứng viên của bạn</p>
      </div>

      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Tổng tin tuyển dụng"
              value={stats.totalJobs}
              prefix={<FileTextOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Tin đang tuyển"
              value={stats.activeJobs}
              prefix={<FileTextOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Tổng đơn ứng tuyển"
              value={stats.totalApplications}
              prefix={<UserOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Đơn chờ duyệt"
              value={stats.pendingApplications}
              prefix={<EyeOutlined />}
            />
          </Card>
        </Col>
      </Row>

      <Card
        title="Tin tuyển dụng của bạn"
        extra={
          <Button 
            type="primary" 
            icon={<PlusOutlined />}
            onClick={() => setIsModalOpen(true)}
          >
            Đăng tin mới
          </Button>
        }
      >
        <Table 
          columns={columns} 
          dataSource={jobs} 
          rowKey="maTin"
          loading={loading}
          pagination={{ pageSize: 10 }}
        />
      </Card>

      <Modal
        title={isEditMode ? "Sửa tin tuyen dung" : "Đăng tin tuyển dụng mới"}
        open={isModalOpen}
        onCancel={handleCloseModal}
        footer={null}
        width={800}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleCreateJob}
        >
          <Form.Item
            name="tieuDe"
            label="Tiêu đề"
            rules={[{ required: true, message: 'Vui lòng nhập tiêu đề!' }]}
          >
            <Input placeholder="VD: Senior Frontend Developer" />
          </Form.Item>

          <Form.Item
            name="moTa"
            label="Mô tả công việc"
            rules={[{ required: true, message: 'Vui lòng nhập mô tả!' }]}
          >
            <TextArea rows={4} placeholder="Mô tả chi tiết công việc..." />
          </Form.Item>

          <Form.Item
            name="yeuCau"
            label="Yêu cầu"
          >
            <TextArea rows={3} placeholder="Yêu cầu kinh nghiệm, kỹ năng..." />
          </Form.Item>

          <Form.Item
            name="quyenLoi"
            label="Quyền lợi"
          >
            <TextArea rows={3} placeholder="Chế độ phúc lợi, bảo hiểm..." />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="hinhThucLamViec"
                label="Hình thức làm việc"
              >
                <Select placeholder="Chọn hình thức">
                  <Select.Option value="ToanThoiGian">Toàn thời gian</Select.Option>
                  <Select.Option value="BanThoiGian">Bán thời gian</Select.Option>
                  <Select.Option value="ThucTap">Thực tập</Select.Option>
                  <Select.Option value="FreeLance">Freelance</Select.Option>
                  <Select.Option value="Remote">Remote</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="kinhNghiem"
                label="Kinh nghiệm"
              >
                <Select placeholder="Chon kinh nghiem">
                  <Select.Option value="MoiRa">Mới ra trường</Select.Option>
                  <Select.Option value="Junior">Junior (1-2 năm)</Select.Option>
                  <Select.Option value="Mid">Mid (2-5 năm)</Select.Option>
                  <Select.Option value="Senior">Senior (5+ năm)</Select.Option>
                  <Select.Option value="TruongNhom">Trưởng nhóm</Select.Option>
                  <Select.Option value="QuanLy">Quản lý</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="mucLuongToiThieu"
                label="Mức lương tối thiểu (VND)"
              >
                <InputNumber 
                  style={{ width: '100%' }}
                  min={0}
                  step={1000000}
                  formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="mucLuongToiDa"
                label="Mức lương tối đa (VND)"
              >
                <InputNumber 
                  style={{ width: '100%' }}
                  min={0}
                  step={1000000}
                  formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="diaDiem"
                label="Địa điểm"
              >
                <Input placeholder="VD: 123 Nguyen Trai, Thanh Xuan" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="thanhPho"
                label="Thanh pho"
              >
                <Input placeholder="VD: Ha Noi" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="hanNopHoSo"
                label="Hạn nộp ho so"
              >
                <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="soLuongTuyen"
                label="So luong tuyen"
                initialValue={1}
              >
                <InputNumber style={{ width: '100%' }} min={1} />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item>
            <Button type="primary" htmlType="submit" block size="large">
              {isEditMode ? 'Cap nhat' : 'Dang tin'}
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Chi tiết tin tuyen dung"
        open={isDetailModalOpen}
        onCancel={() => setIsDetailModalOpen(false)}
        footer={[
          <Button key="close" onClick={() => setIsDetailModalOpen(false)}>
            Dong
          </Button>
        ]}
        width={800}
      >
        {selectedJob && (
          <div>
            <h2>{selectedJob.tieuDe}</h2>
            <p><strong>Trạng thái:</strong> <Tag color={selectedJob.trangThai === 'DaDuyet' ? 'green' : 'orange'}>{selectedJob.trangThai}</Tag></p>
            <p><strong>Hinh thuc:</strong> {selectedJob.hinhThucLamViec}</p>
            <p><strong>Kinh nghiệm:</strong> {selectedJob.kinhNghiem}</p>
            <p><strong>Muc luong:</strong> {selectedJob.mucLuongToiThieu?.toLocaleString()} - {selectedJob.mucLuongToiDa?.toLocaleString()} VND</p>
            <p><strong>Địa điểm:</strong> {selectedJob.diaDiem}, {selectedJob.thanhPho}</p>
            <p><strong>Hạn nộp:</strong> {selectedJob.hanNopHoSo ? dayjs(selectedJob.hanNopHoSo).format('DD/MM/YYYY') : 'N/A'}</p>
            <p><strong>So luong tuyen:</strong> {selectedJob.soLuongTuyen}</p>
            <p><strong>Luot xem:</strong> {selectedJob.luotXem || 0}</p>
            <hr />
            <h3>Mô tả công việc</h3>
            <p>{selectedJob.moTa}</p>
            <h3>Yêu cầu</h3>
            <p>{selectedJob.yeuCau}</p>
            <h3>Quyền lợi</h3>
            <p>{selectedJob.quyenLoi}</p>
          </div>
        )}
      </Modal>      </div>
    </div>
  );
};

export default CompanyDashboard;