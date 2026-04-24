import { useEffect, useState } from 'react';
import { Card, Table, Tag, Button, Space, message, Modal, Form, Input, InputNumber, DatePicker, Descriptions, Alert, Dropdown } from 'antd';
import type { MenuProps } from 'antd';
import { EyeOutlined, GiftOutlined, UserOutlined, FileOutlined, DownloadOutlined, FilePdfOutlined, MoreOutlined, CheckOutlined, CloseOutlined, CalendarOutlined } from '@ant-design/icons';
import { applicationService } from '../../services/applicationService';
import { offerService } from '../../services/offerService';
import type { DonUngTuyen } from '../../types';
import dayjs from 'dayjs';

const { TextArea } = Input;

const ManageApplicationsPage = () => {
  const [applications, setApplications] = useState<DonUngTuyen[]>([]);
  const [loading, setLoading] = useState(false);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [cvModalOpen, setCvModalOpen] = useState(false);
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

  const handleViewCV = (app: DonUngTuyen) => {
    setSelectedApp(app);
    setCvModalOpen(true);
  };

  const handleDownloadCV = (cvPath: string, cvName: string) => {
    const link = document.createElement('a');
    link.href = `https://localhost:44314${cvPath}`;
    link.download = cvName;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
      'VaoDanhSach': 'purple',
      'TuChoi': 'red',
      'RutDon': 'gray'
    };
    return colorMap[status] || 'default';
  };

  const getStatusText = (status: string) => {
    const textMap: any = {
      'DaNop': 'Da nop',
      'DangXem': 'Dang xem',
      'VaoDanhSach': 'Vao danh sach',
      'TuChoi': 'Tu choi',
      'RutDon': 'Rut don'
    };
    return textMap[status] || status;
  };

  const getActionMenuItems = (record: DonUngTuyen): MenuProps['items'] => {
    const items: MenuProps['items'] = [];

    if (record.trangThai === 'DaNop') {
      items.push({
        key: 'mark-viewed',
        label: 'Danh dau da xem',
        icon: <CheckOutlined />,
        onClick: () => handleUpdateStatus(record.maDon, 'DangXem')
      });
    }

    if (record.trangThai === 'DaNop' || record.trangThai === 'DangXem') {
      items.push({
        key: 'invite-interview',
        label: 'Vao danh sach',
        icon: <CalendarOutlined />,
        onClick: () => handleUpdateStatus(record.maDon, 'VaoDanhSach')
      });
      items.push({
        key: 'reject',
        label: 'Tu choi',
        icon: <CloseOutlined />,
        danger: true,
        onClick: () => handleUpdateStatus(record.maDon, 'TuChoi')
      });
    }

    return items;
  };

  const columns = [
    {
      title: 'Ung vien',
      dataIndex: 'tenUngVien',
      key: 'tenUngVien',
      render: (text: string) => (
        <div>
          <UserOutlined style={{ marginRight: 8 }} />
          <strong>{text}</strong>
        </div>
      ),
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
      width: 280,
      render: (_: any, record: DonUngTuyen) => {
        const menuItems = getActionMenuItems(record);
        
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', width: '100%' }}>
            <Space size={4} wrap>
              <Button 
                type="primary"
                size="small"
                icon={<EyeOutlined />}
                onClick={() => handleViewDetail(record)}
              >
                Chi tiet
              </Button>
              <Button 
                size="small"
                icon={<FilePdfOutlined />}
                onClick={() => handleViewCV(record)}
                disabled={!record.duongDanFileCV}
              >
                Xem CV
              </Button>
              <Button 
                type="default"
                size="small"
                icon={<GiftOutlined />}
                style={{ borderColor: '#52c41a', color: '#52c41a' }}
                onClick={() => handleOpenOfferModal(record)}
              >
                Gui thu moi
              </Button>
            </Space>
            
            {menuItems && menuItems.length > 0 && (
              <Dropdown menu={{ items: menuItems }} trigger={['click']}>
                <Button size="small" block icon={<MoreOutlined />}>
                  Cap nhat trang thai
                </Button>
              </Dropdown>
            )}
          </div>
        );
      },
    },
  ];

  return (
    <div style={{ background: '#fff', minHeight: 'calc(100vh - 64px)' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
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
                  {selectedApp.duongDanFileCV && (
                    <Button 
                      type="link" 
                      size="small" 
                      icon={<DownloadOutlined />}
                      onClick={() => handleDownloadCV(selectedApp.duongDanFileCV!, selectedApp.tenFileCV || 'CV.pdf')}
                    >
                      Tai xuong
                    </Button>
                  )}
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
        title="Xem CV ung vien"
        open={cvModalOpen}
        onCancel={() => {
          setCvModalOpen(false);
          setSelectedApp(null);
        }}
        width={900}
        footer={[
          selectedApp?.duongDanFileCV && (
            <Button 
              key="download" 
              type="primary"
              icon={<DownloadOutlined />}
              onClick={() => handleDownloadCV(selectedApp.duongDanFileCV!, selectedApp.tenFileCV || 'CV.pdf')}
            >
              Tai xuong CV
            </Button>
          ),
          <Button key="close" onClick={() => {
            setCvModalOpen(false);
            setSelectedApp(null);
          }}>
            Dong
          </Button>
        ]}
      >
        {selectedApp && (
          <div>
            <Alert 
              message={`CV cua ung vien: ${selectedApp.tenUngVien}`}
              type="info"
              showIcon
              style={{ marginBottom: 16 }}
            />

            <Descriptions column={2} bordered style={{ marginBottom: 16 }}>
              <Descriptions.Item label="Ten file" span={2}>
                <Space>
                  <FilePdfOutlined style={{ fontSize: 20, color: '#ff4d4f' }} />
                  <strong>{selectedApp.tenFileCV || 'CV.pdf'}</strong>
                </Space>
              </Descriptions.Item>
              <Descriptions.Item label="Vi tri ung tuyen" span={2}>
                {selectedApp.tieuDeTin}
              </Descriptions.Item>
              <Descriptions.Item label="Ngay nop">
                {dayjs(selectedApp.ngayNop).format('DD/MM/YYYY HH:mm')}
              </Descriptions.Item>
              <Descriptions.Item label="Trang thai">
                <Tag color={getStatusColor(selectedApp.trangThai)}>
                  {getStatusText(selectedApp.trangThai)}
                </Tag>
              </Descriptions.Item>
            </Descriptions>

            {selectedApp.duongDanFileCV ? (
              <div style={{ 
                border: '1px solid #d9d9d9', 
                borderRadius: '4px', 
                padding: '16px',
                background: '#fafafa',
                textAlign: 'center'
              }}>
                <FilePdfOutlined style={{ fontSize: 64, color: '#ff4d4f', marginBottom: 16 }} />
                <p style={{ marginBottom: 16 }}>
                  <strong>File CV: {selectedApp.tenFileCV}</strong>
                </p>
                <Space>
                  <Button 
                    type="primary"
                    icon={<DownloadOutlined />}
                    onClick={() => handleDownloadCV(selectedApp.duongDanFileCV!, selectedApp.tenFileCV || 'CV.pdf')}
                  >
                    Tai xuong de xem
                  </Button>
                  <Button 
                    icon={<EyeOutlined />}
                    onClick={() => window.open(`https://localhost:44314${selectedApp.duongDanFileCV}`, '_blank')}
                  >
                    Xem trong tab moi
                  </Button>
                </Space>
              </div>
            ) : (
              <Alert 
                message="Ung vien chua upload CV"
                type="warning"
                showIcon
              />
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
      </Modal>      </div>
    </div>
  );
};

export default ManageApplicationsPage;