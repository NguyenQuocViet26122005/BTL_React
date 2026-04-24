import { useEffect, useState } from 'react';
import { Card, Table, Tag, Button, Space, message, Modal, Form, Input, InputNumber, DatePicker, Descriptions } from 'antd';
import { EyeOutlined, GiftOutlined, UserOutlined, FileOutlined } from '@ant-design/icons';
import { applicationService } from '../../services/applicationService';
import { offerService } from '../../services/offerService';
import type { DonUngTuyen } from '../../types';
import dayjs from 'dayjs';

const { TextArea } = Input;

const ManageApplicationsPage = () => {
  const [applications, setApplications] = useState<DonUngTuyen[]>([]);
  const [loading, setLoading] = useState(false);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [offerModalOpen, setOfferModalOpen] = useState(false);
  const [selectedApp, setSelectedApp] = useState<DonUngTuyen | null>(null);
  const [sending, setSending] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const userData = JSON.parse(userStr);
      fetchApplications(userData.maNguoiDung);
    }
  }, []);

  const fetchApplications = async (maNguoiDung: number) => {
    try {
      setLoading(true);
      const response = await applicationService.getCompanyApplications(maNguoiDung);
      if (response.success && response.data) {
        setApplications(response.data);
      }
    } catch (error: any) {
      console.error('Error fetching applications:', error);
      message.error('Khong the tai danh sach don ung tuyen!');
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetail = (app: DonUngTuyen) => {
    setSelectedApp(app);
    setDetailModalOpen(true);
  };

  const handleOpenOfferModal = (app: DonUngTuyen) => {
    setSelectedApp(app);
    form.setFieldsValue({
      viTriCongViec: app.tieuDeTin,
      mucLuong: 15000000,
      donViTien: 'VND',
      ngayBatDauDuKien: dayjs().add(1, 'month'),
      ngayHetHan: dayjs().add(7, 'day'),
    });
    setOfferModalOpen(true);
  };

  const handleSendOffer = async (values: any) => {
    if (!selectedApp) return;

    try {
      setSending(true);
      const response = await offerService.create({
        maDon: selectedApp.maDon,
        viTriCongViec: values.viTriCongViec,
        mucLuong: values.mucLuong,
        donViTien: values.donViTien || 'VND',
        ngayBatDauDuKien: values.ngayBatDauDuKien ? values.ngayBatDauDuKien.format('YYYY-MM-DD') : undefined,
        ngayHetHan: values.ngayHetHan ? values.ngayHetHan.format('YYYY-MM-DD') : undefined,
        ghiChu: values.ghiChu
      });

      if (response.success) {
        message.success('Gui thu moi thanh cong!');
        setOfferModalOpen(false);
        setSelectedApp(null);
        form.resetFields();
      } else {
        message.error(response.message || 'Gui thu moi that bai');
      }
    } catch (error: any) {
      console.error('Error sending offer:', error);
      message.error(error.response?.data?.message || 'Gui thu moi that bai!');
    } finally {
      setSending(false);
    }
  };

  const handleUpdateStatus = async (maDon: number, trangThai: string) => {
    try {
      const response = await applicationService.updateStatus(maDon, { trangThai });
      if (response.success) {
        message.success('Cap nhat trang thai thanh cong!');
        const userStr = localStorage.getItem('user');
        if (userStr) {
          const userData = JSON.parse(userStr);
          fetchApplications(userData.maNguoiDung);
        }
      }
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Cap nhat that bai!');
    }
  };

  const getStatusColor = (status: string) => {
    const colorMap: any = {
      'DaNop': 'blue',
      'DangXem': 'orange',
      'PhongVan': 'purple',
      'TuChoi': 'red',
      'ChapNhan': 'green'
    };
    return colorMap[status] || 'default';
  };

  const getStatusText = (status: string) => {
    const textMap: any = {
      'DaNop': 'Da nop',
      'DangXem': 'Dang xem',
      'PhongVan': 'Phong van',
      'TuChoi': 'Tu choi',
      'ChapNhan': 'Chap nhan'
    };
    return textMap[status] || status;
  };

  const columns = [
    {
      title: 'Ung vien',
      dataIndex: 'tenUngVien',
      key: 'tenUngVien',
      render: (text: string) => <strong><UserOutlined /> {text}</strong>,
    },
    {
      title: 'Vi tri ung tuyen',
      dataIndex: 'tieuDeTin',
      key: 'tieuDeTin',
    },
    {
      title: 'Ngay nop',
      dataIndex: 'ngayNop',
      key: 'ngayNop',
      render: (date: string) => dayjs(date).format('DD/MM/YYYY'),
    },
    {
      title: 'Trang thai',
      dataIndex: 'trangThai',
      key: 'trangThai',
      render: (status: string) => (
        <Tag color={getStatusColor(status)}>
          {getStatusText(status)}
        </Tag>
      ),
    },
    {
      title: 'Thao tac',
      key: 'action',
      render: (_: any, record: DonUngTuyen) => (
        <Space size="small" direction="vertical">
          <Space size="small">
            <Button 
              type="link" 
              size="small"
              icon={<EyeOutlined />}
              onClick={() => handleViewDetail(record)}
            >
              Chi tiet
            </Button>
            <Button 
              type="link" 
              size="small"
              icon={<GiftOutlined />}
              style={{ color: '#52c41a' }}
              onClick={() => handleOpenOfferModal(record)}
            >
              Gui thu moi
            </Button>
          </Space>
          <Space size="small">
            {record.trangThai === 'DaNop' && (
              <Button 
                type="link" 
                size="small"
                onClick={() => handleUpdateStatus(record.maDon, 'DangXem')}
              >
                Danh dau da xem
              </Button>
            )}
            {(record.trangThai === 'DaNop' || record.trangThai === 'DangXem') && (
              <>
                <Button 
                  type="link" 
                  size="small"
                  onClick={() => handleUpdateStatus(record.maDon, 'PhongVan')}
                >
                  Moi phong van
                </Button>
                <Button 
                  type="link" 
                  size="small"
                  danger
                  onClick={() => handleUpdateStatus(record.maDon, 'TuChoi')}
                >
                  Tu choi
                </Button>
              </>
            )}
          </Space>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: '24px', maxWidth: 1400, margin: '0 auto' }}>
      <div style={{ marginBottom: 24 }}>
        <h1>Quan ly don ung tuyen</h1>
        <p>Xem va xu ly cac don ung tuyen tu ung vien</p>
      </div>

      <Card>
        <Table 
          columns={columns} 
          dataSource={applications} 
          rowKey="maDon"
          loading={loading}
          pagination={{ pageSize: 10 }}
        />
      </Card>

      <Modal
        title="Chi tiet don ung tuyen"
        open={detailModalOpen}
        onCancel={() => {
          setDetailModalOpen(false);
          setSelectedApp(null);
        }}
        width={800}
        footer={[
          <Button key="close" onClick={() => {
            setDetailModalOpen(false);
            setSelectedApp(null);
          }}>
            Dong
          </Button>
        ]}
      >
        {selectedApp && (
          <div>
            <Descriptions column={2} bordered style={{ marginBottom: 16 }}>
              <Descriptions.Item label="Ung vien" span={2}>
                <strong style={{ fontSize: 16 }}><UserOutlined /> {selectedApp.tenUngVien}</strong>
              </Descriptions.Item>
              <Descriptions.Item label="Vi tri ung tuyen" span={2}>
                {selectedApp.tieuDeTin}
              </Descriptions.Item>
              <Descriptions.Item label="Trang thai">
                <Tag color={getStatusColor(selectedApp.trangThai)}>
                  {getStatusText(selectedApp.trangThai)}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Ngay nop">
                {dayjs(selectedApp.ngayNop).format('DD/MM/YYYY HH:mm')}
              </Descriptions.Item>
              <Descriptions.Item label="CV da su dung" span={2}>
                <Space>
                  <FileOutlined />
                  {selectedApp.tenFileCV || 'Khong co thong tin'}
                </Space>
              </Descriptions.Item>
            </Descriptions>

            {selectedApp.thuGioiThieu && (
              <>
                <h3>Thu gioi thieu</h3>
                <Card style={{ backgroundColor: '#f5f5f5' }}>
                  <p style={{ whiteSpace: 'pre-wrap', margin: 0 }}>
                    {selectedApp.thuGioiThieu}
                  </p>
                </Card>
              </>
            )}
          </div>
        )}
      </Modal>

      <Modal
        title="Gui thu moi lam viec"
        open={offerModalOpen}
        onCancel={() => {
          setOfferModalOpen(false);
          setSelectedApp(null);
          form.resetFields();
        }}
        footer={null}
        width={700}
      >
        {selectedApp && (
          <>
            <p style={{ marginBottom: 16, padding: 12, background: '#e6f7ff', borderRadius: 4 }}>
              <UserOutlined /> Gui thu moi cho: <strong>{selectedApp.tenUngVien}</strong>
            </p>
            <Form
              form={form}
              layout="vertical"
              onFinish={handleSendOffer}
            >
              <Form.Item
                name="viTriCongViec"
                label="Vi tri cong viec"
                rules={[{ required: true, message: 'Vui long nhap vi tri!' }]}
              >
                <Input placeholder="VD: Senior Frontend Developer" />
              </Form.Item>

              <Form.Item
                name="mucLuong"
                label="Muc luong"
                rules={[{ required: true, message: 'Vui long nhap muc luong!' }]}
              >
                <InputNumber 
                  style={{ width: '100%' }}
                  min={0}
                  step={1000000}
                  formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  placeholder="VD: 15000000"
                />
              </Form.Item>

              <Form.Item
                name="donViTien"
                label="Don vi tien"
                initialValue="VND"
              >
                <Input placeholder="VD: VND, USD" />
              </Form.Item>

              <Form.Item
                name="ngayBatDauDuKien"
                label="Ngay bat dau du kien"
              >
                <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
              </Form.Item>

              <Form.Item
                name="ngayHetHan"
                label="Han phan hoi"
              >
                <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
              </Form.Item>

              <Form.Item
                name="ghiChu"
                label="Ghi chu"
              >
                <TextArea 
                  rows={4}
                  placeholder="Loi nhan gui ung vien, thong tin them..."
                />
              </Form.Item>

              <Form.Item>
                <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
                  <Button onClick={() => {
                    setOfferModalOpen(false);
                    setSelectedApp(null);
                    form.resetFields();
                  }}>
                    Huy
                  </Button>
                  <Button type="primary" htmlType="submit" loading={sending} icon={<GiftOutlined />}>
                    Gui thu moi
                  </Button>
                </Space>
              </Form.Item>
            </Form>
          </>
        )}
      </Modal>
    </div>
  );
};

export default ManageApplicationsPage;