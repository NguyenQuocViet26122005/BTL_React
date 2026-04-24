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
      message.error('Khong the tai chi tiet tin tuyen dung!');
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
      message.error('Khong the tai thong tin tin tuyen dung!');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (maTin: number) => {
    try {
      const response = await deleteTinTuyenDung(maTin);
      if (response.success) {
        message.success('Xoa tin tuyen dung thanh cong!');
        fetchJobs(user.maNguoiDung);
        eventBus.emit(EVENTS.JOB_DELETED);
      }
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Xoa tin that bai!');
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
          message.success('Cap nhat tin tuyen dung thanh cong!');
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
          message.success('Dang tin tuyen dung thanh cong!');
          setIsModalOpen(false);
          form.resetFields();
          fetchJobs(user.maNguoiDung);
          eventBus.emit(EVENTS.JOB_CREATED);
        }
      }
    } catch (error: any) {
      message.error(error.response?.data?.message || (isEditMode ? 'Cap nhat tin that bai!' : 'Dang tin that bai!'));
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
      title: 'Tieu de',
      dataIndex: 'tieuDe',
      key: 'tieuDe',
    },
    {
      title: 'Trang thai',
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
      title: 'Dia diem',
      dataIndex: 'diaDiem',
      key: 'diaDiem',
    },
    {
      title: 'Han nop',
      dataIndex: 'hanNopHoSo',
      key: 'hanNopHoSo',
      render: (date: string) => date ? dayjs(date).format('DD/MM/YYYY') : 'N/A',
    },
    {
      title: 'Thao tac',
      key: 'action',
      render: (_: any, record: TinTuyenDung) => (
        <Space size="middle">
          <Button 
            type="link" 
            icon={<InfoCircleOutlined />}
            onClick={() => handleViewDetail(record.maTin)}
          >
            Chi tiet
          </Button>
          <Button 
            type="link" 
            icon={<EditOutlined />}
            onClick={() => handleEdit(record.maTin)}
          >
            Sua
          </Button>
          <Popconfirm
            title="Xoa tin tuyen dung"
            description="Ban co chac chan muon xoa tin nay?"
            onConfirm={() => handleDelete(record.maTin)}
            okText="Xoa"
            cancelText="Huy"
          >
            <Button 
              type="link" 
              danger
              icon={<DeleteOutlined />}
            >
              Xoa
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
        <h1>Chao mung, {user?.hoTen || 'Nha tuyen dung'}</h1>
        <p>Quan ly tin tuyen dung va ung vien cua ban</p>
      </div>

      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Tong tin tuyen dung"
              value={stats.totalJobs}
              prefix={<FileTextOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Tin dang tuyen"
              value={stats.activeJobs}
              prefix={<FileTextOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Tong don ung tuyen"
              value={stats.totalApplications}
              prefix={<UserOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Don cho duyet"
              value={stats.pendingApplications}
              prefix={<EyeOutlined />}
            />
          </Card>
        </Col>
      </Row>

      <Card
        title="Tin tuyen dung cua ban"
        extra={
          <Button 
            type="primary" 
            icon={<PlusOutlined />}
            onClick={() => setIsModalOpen(true)}
          >
            Dang tin moi
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
        title={isEditMode ? "Sua tin tuyen dung" : "Dang tin tuyen dung moi"}
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
            label="Tieu de"
            rules={[{ required: true, message: 'Vui long nhap tieu de!' }]}
          >
            <Input placeholder="VD: Senior Frontend Developer" />
          </Form.Item>

          <Form.Item
            name="moTa"
            label="Mo ta cong viec"
            rules={[{ required: true, message: 'Vui long nhap mo ta!' }]}
          >
            <TextArea rows={4} placeholder="Mo ta chi tiet cong viec..." />
          </Form.Item>

          <Form.Item
            name="yeuCau"
            label="Yeu cau"
          >
            <TextArea rows={3} placeholder="Yeu cau kinh nghiem, ky nang..." />
          </Form.Item>

          <Form.Item
            name="quyenLoi"
            label="Quyen loi"
          >
            <TextArea rows={3} placeholder="Che do phuc loi, bao hiem..." />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="hinhThucLamViec"
                label="Hinh thuc lam viec"
              >
                <Select placeholder="Chon hinh thuc">
                  <Select.Option value="ToanThoiGian">Toan thoi gian</Select.Option>
                  <Select.Option value="BanThoiGian">Ban thoi gian</Select.Option>
                  <Select.Option value="ThucTap">Thuc tap</Select.Option>
                  <Select.Option value="FreeLance">Freelance</Select.Option>
                  <Select.Option value="Remote">Remote</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="kinhNghiem"
                label="Kinh nghiem"
              >
                <Select placeholder="Chon kinh nghiem">
                  <Select.Option value="MoiRa">Moi ra truong</Select.Option>
                  <Select.Option value="Junior">Junior (1-2 nam)</Select.Option>
                  <Select.Option value="Mid">Mid (2-5 nam)</Select.Option>
                  <Select.Option value="Senior">Senior (5+ nam)</Select.Option>
                  <Select.Option value="TruongNhom">Truong nhom</Select.Option>
                  <Select.Option value="QuanLy">Quan ly</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="mucLuongToiThieu"
                label="Muc luong toi thieu (VND)"
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
                label="Muc luong toi da (VND)"
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
                label="Dia diem"
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
                label="Han nop ho so"
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
        title="Chi tiet tin tuyen dung"
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
            <p><strong>Trang thai:</strong> <Tag color={selectedJob.trangThai === 'DaDuyet' ? 'green' : 'orange'}>{selectedJob.trangThai}</Tag></p>
            <p><strong>Hinh thuc:</strong> {selectedJob.hinhThucLamViec}</p>
            <p><strong>Kinh nghiem:</strong> {selectedJob.kinhNghiem}</p>
            <p><strong>Muc luong:</strong> {selectedJob.mucLuongToiThieu?.toLocaleString()} - {selectedJob.mucLuongToiDa?.toLocaleString()} VND</p>
            <p><strong>Dia diem:</strong> {selectedJob.diaDiem}, {selectedJob.thanhPho}</p>
            <p><strong>Han nop:</strong> {selectedJob.hanNopHoSo ? dayjs(selectedJob.hanNopHoSo).format('DD/MM/YYYY') : 'N/A'}</p>
            <p><strong>So luong tuyen:</strong> {selectedJob.soLuongTuyen}</p>
            <p><strong>Luot xem:</strong> {selectedJob.luotXem || 0}</p>
            <hr />
            <h3>Mo ta cong viec</h3>
            <p>{selectedJob.moTa}</p>
            <h3>Yeu cau</h3>
            <p>{selectedJob.yeuCau}</p>
            <h3>Quyen loi</h3>
            <p>{selectedJob.quyenLoi}</p>
          </div>
        )}
      </Modal>      </div>
    </div>
  );
};

export default CompanyDashboard;