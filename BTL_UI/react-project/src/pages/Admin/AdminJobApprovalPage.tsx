import { useState, useEffect } from 'react';
import { Card, Table, Tag, Button, Space, message, Modal, Popconfirm, Input } from 'antd';
import { CheckOutlined, CloseOutlined, EyeOutlined } from '@ant-design/icons';
import { jobService } from '../../services/jobService';
import { eventBus, EVENTS } from '../../utils/eventBus';
import type { TinTuyenDung } from '../../types';
import dayjs from 'dayjs';

const { TextArea } = Input;

const AdminJobApprovalPage = () => {
  const [jobs, setJobs] = useState<TinTuyenDung[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedJob, setSelectedJob] = useState<TinTuyenDung | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [rejectingJobId, setRejectingJobId] = useState<number | null>(null);

  useEffect(() => {
    fetchAllJobs();
  }, []);

  const fetchAllJobs = async () => {
    setLoading(true);
    try {
      const response = await jobService.getAllJobsForAdmin();
      if (response.success && response.data) {
        setJobs(response.data);
      }
    } catch (error) {
      console.error('Error fetching jobs:', error);
      message.error('Khong the tai danh sach tin tuyen dung');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (maTin: number) => {
    try {
      const response = await jobService.updateJobStatus(maTin, 'DaDuyet');
      if (response.success) {
        message.success('Da duyet tin tuyen dung');
        fetchAllJobs();
        eventBus.emit(EVENTS.JOB_UPDATED);
      }
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Duyet tin that bai');
    }
  };

  const handleReject = async () => {
    if (!rejectingJobId) return;
    
    try {
      const response = await jobService.updateJobStatus(rejectingJobId, 'TuChoi', rejectReason);
      if (response.success) {
        message.success('Da tu choi tin tuyen dung');
        setIsRejectModalOpen(false);
        setRejectReason('');
        setRejectingJobId(null);
        fetchAllJobs();
        eventBus.emit(EVENTS.JOB_UPDATED);
      }
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Tu choi tin that bai');
    }
  };

  const handleViewDetail = async (maTin: number) => {
    try {
      const response = await jobService.getTinTuyenDungById(maTin);
      if (response.success && response.data) {
        setSelectedJob(response.data);
        setIsDetailModalOpen(true);
      }
    } catch (error) {
      message.error('Khong the tai chi tiet tin');
    }
  };

  const openRejectModal = (maTin: number) => {
    setRejectingJobId(maTin);
    setIsRejectModalOpen(true);
  };

  const getStatusColor = (status: string) => {
    const colors: any = {
      ChoXetDuyet: 'orange',
      DaDuyet: 'green',
      TuChoi: 'red',
      DaDong: 'default'
    };
    return colors[status] || 'default';
  };

  const getStatusText = (status: string) => {
    const texts: any = {
      ChoXetDuyet: 'Cho xet duyet',
      DaDuyet: 'Da duyet',
      TuChoi: 'Tu choi',
      DaDong: 'Da dong'
    };
    return texts[status] || status;
  };

  const columns = [
    {
      title: 'Ma tin',
      dataIndex: 'maTin',
      key: 'maTin',
      width: 80
    },
    {
      title: 'Tieu de',
      dataIndex: 'tieuDe',
      key: 'tieuDe',
      width: 250
    },
    {
      title: 'Cong ty',
      dataIndex: 'tenCongTy',
      key: 'tenCongTy',
      width: 200
    },
    {
      title: 'Dia diem',
      dataIndex: 'thanhPho',
      key: 'thanhPho',
      width: 120
    },
    {
      title: 'Ngay dang',
      dataIndex: 'ngayTao',
      key: 'ngayTao',
      width: 120,
      render: (date: string) => date ? dayjs(date).format('DD/MM/YYYY') : 'N/A'
    },
    {
      title: 'Trang thai',
      dataIndex: 'trangThai',
      key: 'trangThai',
      width: 130,
      render: (status: string) => (
        <Tag color={getStatusColor(status)}>{getStatusText(status)}</Tag>
      )
    },
    {
      title: 'Thao tac',
      key: 'action',
      width: 200,
      fixed: 'right' as const,
      render: (_: any, record: TinTuyenDung) => (
        <Space size="small">
          <Button
            type="link"
            size="small"
            icon={<EyeOutlined />}
            onClick={() => handleViewDetail(record.maTin)}
          >
            Xem
          </Button>
          {record.trangThai === 'ChoXetDuyet' && (
            <>
              <Popconfirm
                title="Duyet tin tuyen dung"
                description="Ban co chac chan muon duyet tin nay?"
                onConfirm={() => handleApprove(record.maTin)}
                okText="Duyet"
                cancelText="Huy"
              >
                <Button
                  type="primary"
                  size="small"
                  icon={<CheckOutlined />}
                >
                  Duyet
                </Button>
              </Popconfirm>
              <Button
                danger
                size="small"
                icon={<CloseOutlined />}
                onClick={() => openRejectModal(record.maTin)}
              >
                Tu choi
              </Button>
            </>
          )}
        </Space>
      )
    }
  ];

  const stats = {
    total: jobs.length,
    pending: jobs.filter(j => j.trangThai === 'ChoXetDuyet').length,
    approved: jobs.filter(j => j.trangThai === 'DaDuyet').length,
    rejected: jobs.filter(j => j.trangThai === 'TuChoi').length
  };

  return (
    <div style={{ padding: 24, maxWidth: 1400, margin: '0 auto' }}>
      <h1>Quan ly tin tuyen dung</h1>
      <p>Duyet va quan ly tat ca tin tuyen dung tren he thong</p>

      <Space style={{ marginBottom: 16 }} size="large">
        <Card size="small">
          <div>Tong tin: <strong>{stats.total}</strong></div>
        </Card>
        <Card size="small">
          <div>Cho duyet: <strong style={{ color: '#fa8c16' }}>{stats.pending}</strong></div>
        </Card>
        <Card size="small">
          <div>Da duyet: <strong style={{ color: '#52c41a' }}>{stats.approved}</strong></div>
        </Card>
        <Card size="small">
          <div>Tu choi: <strong style={{ color: '#ff4d4f' }}>{stats.rejected}</strong></div>
        </Card>
      </Space>

      <Card>
        <Table
          columns={columns}
          dataSource={jobs}
          rowKey="maTin"
          loading={loading}
          pagination={{ pageSize: 20 }}
          scroll={{ x: 1200 }}
        />
      </Card>

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
            <p><strong>Cong ty:</strong> {selectedJob.tenCongTy}</p>
            <p><strong>Trang thai:</strong> <Tag color={getStatusColor(selectedJob.trangThai)}>{getStatusText(selectedJob.trangThai)}</Tag></p>
            <p><strong>Hinh thuc:</strong> {selectedJob.hinhThucLamViec}</p>
            <p><strong>Kinh nghiem:</strong> {selectedJob.kinhNghiem}</p>
            <p><strong>Muc luong:</strong> {selectedJob.mucLuongToiThieu?.toLocaleString()} - {selectedJob.mucLuongToiDa?.toLocaleString()} VND</p>
            <p><strong>Dia diem:</strong> {selectedJob.diaDiem}, {selectedJob.thanhPho}</p>
            <p><strong>Han nop:</strong> {selectedJob.hanNopHoSo ? dayjs(selectedJob.hanNopHoSo).format('DD/MM/YYYY') : 'N/A'}</p>
            <p><strong>So luong tuyen:</strong> {selectedJob.soLuongTuyen}</p>
            <p><strong>Ngay dang:</strong> {selectedJob.ngayTao ? dayjs(selectedJob.ngayTao).format('DD/MM/YYYY HH:mm') : 'N/A'}</p>
            <hr />
            <h3>Mo ta cong viec</h3>
            <p style={{ whiteSpace: 'pre-wrap' }}>{selectedJob.moTa}</p>
            <h3>Yeu cau</h3>
            <p style={{ whiteSpace: 'pre-wrap' }}>{selectedJob.yeuCau}</p>
            <h3>Quyen loi</h3>
            <p style={{ whiteSpace: 'pre-wrap' }}>{selectedJob.quyenLoi}</p>
          </div>
        )}
      </Modal>

      <Modal
        title="Tu choi tin tuyen dung"
        open={isRejectModalOpen}
        onCancel={() => {
          setIsRejectModalOpen(false);
          setRejectReason('');
          setRejectingJobId(null);
        }}
        onOk={handleReject}
        okText="Tu choi"
        cancelText="Huy"
        okButtonProps={{ danger: true }}
      >
        <p>Vui long nhap ly do tu choi:</p>
        <TextArea
          rows={4}
          value={rejectReason}
          onChange={(e) => setRejectReason(e.target.value)}
          placeholder="VD: Noi dung khong phu hop, thieu thong tin..."
        />
      </Modal>
    </div>
  );
};

export default AdminJobApprovalPage;