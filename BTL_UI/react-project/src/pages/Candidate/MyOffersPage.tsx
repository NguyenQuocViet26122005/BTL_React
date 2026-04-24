import { useEffect, useState } from 'react';
import { Card, Table, Tag, Button, Space, message, Empty, Modal, Descriptions, Alert, Divider, Input } from 'antd';
import { FileTextOutlined, CheckOutlined, CloseOutlined, EyeOutlined, DollarOutlined, CalendarOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { offerService, type ThuMoiLamViec } from '../../services/offerService';
import dayjs from 'dayjs';

const { TextArea } = Input;

const MyOffersPage = () => {
  const navigate = useNavigate();
  const [offers, setOffers] = useState<ThuMoiLamViec[]>([]);
  const [loading, setLoading] = useState(false);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [respondModalOpen, setRespondModalOpen] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState<ThuMoiLamViec | null>(null);
  const [respondType, setRespondType] = useState<'accept' | 'reject'>('accept');
  const [respondNote, setRespondNote] = useState('');
  const [responding, setResponding] = useState(false);

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const userData = JSON.parse(userStr);
      fetchOffers(userData.maNguoiDung);
    } else {
      message.error('Vui long dang nhap!');
      navigate('/login');
    }
  }, [navigate]);

  const fetchOffers = async (maUngVien: number) => {
    try {
      setLoading(true);
      const response = await offerService.getByUngVien(maUngVien);
      
      if (response.success && response.data) {
        setOffers(response.data);
      } else {
        message.warning(response.message || 'Khong co thu moi nao');
      }
    } catch (error: any) {
      console.error('Error fetching offers:', error);
      message.error(error.response?.data?.message || 'Khong the tai danh sach thu moi!');
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetail = (offer: ThuMoiLamViec) => {
    setSelectedOffer(offer);
    setDetailModalOpen(true);
  };

  const handleOpenRespond = (offer: ThuMoiLamViec, type: 'accept' | 'reject') => {
    setSelectedOffer(offer);
    setRespondType(type);
    setRespondNote('');
    setRespondModalOpen(true);
  };

  const handleRespond = async () => {
    if (!selectedOffer) return;

    try {
      setResponding(true);
      const response = await offerService.respond(selectedOffer.maThuMoi, {
        trangThai: respondType === 'accept' ? 'DaChapNhan' : 'DaTuChoi',
        ghiChu: respondNote
      });

      if (response.success) {
        message.success(respondType === 'accept' ? 'Da chap nhan thu moi!' : 'Da tu choi thu moi!');
        setRespondModalOpen(false);
        setSelectedOffer(null);
        setRespondNote('');
        // Reload offers
        const userStr = localStorage.getItem('user');
        if (userStr) {
          const userData = JSON.parse(userStr);
          fetchOffers(userData.maNguoiDung);
        }
      } else {
        message.error(response.message || 'Phan hoi that bai');
      }
    } catch (error: any) {
      console.error('Error responding to offer:', error);
      message.error(error.response?.data?.message || 'Phan hoi that bai!');
    } finally {
      setResponding(false);
    }
  };

  const getStatusColor = (status: string) => {
    const colorMap: any = {
      'ChoXacNhan': 'orange',
      'DaChapNhan': 'green',
      'DaTuChoi': 'red',
      'HetHan': 'gray'
    };
    return colorMap[status] || 'default';
  };

  const getStatusText = (status: string) => {
    const textMap: any = {
      'ChoXacNhan': 'Cho xac nhan',
      'DaChapNhan': 'Da chap nhan',
      'DaTuChoi': 'Da tu choi',
      'HetHan': 'Het han'
    };
    return textMap[status] || status;
  };

  const columns = [
    {
      title: 'Vi tri cong viec',
      dataIndex: 'viTriCongViec',
      key: 'viTriCongViec',
      render: (text: string) => <strong>{text}</strong>,
    },
    {
      title: 'Cong ty',
      dataIndex: 'tenCongTy',
      key: 'tenCongTy',
    },
    {
      title: 'Muc luong',
      dataIndex: 'mucLuong',
      key: 'mucLuong',
      render: (luong: number, record: ThuMoiLamViec) => (
        <span style={{ color: '#52c41a', fontWeight: 'bold' }}>
          {luong.toLocaleString()} {record.donViTien || 'VND'}
        </span>
      ),
    },
    {
      title: 'Ngay tao',
      dataIndex: 'ngayTao',
      key: 'ngayTao',
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
      render: (_: any, record: ThuMoiLamViec) => (
        <Space size="small">
          <Button 
            type="link" 
            icon={<EyeOutlined />}
            onClick={() => handleViewDetail(record)}
          >
            Chi tiet
          </Button>
          {record.trangThai === 'ChoXacNhan' && (
            <>
              <Button 
                type="link" 
                icon={<CheckOutlined />}
                style={{ color: '#52c41a' }}
                onClick={() => handleOpenRespond(record, 'accept')}
              >
                Chap nhan
              </Button>
              <Button 
                type="link" 
                danger
                icon={<CloseOutlined />}
                onClick={() => handleOpenRespond(record, 'reject')}
              >
                Tu choi
              </Button>
            </>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: '24px', maxWidth: 1200, margin: '0 auto' }}>
      <div style={{ marginBottom: 24 }}>
        <h1>Thu moi lam viec</h1>
        <p>Quan ly cac thu moi lam viec tu nha tuyen dung</p>
      </div>

      <Card>
        {offers.length === 0 && !loading ? (
          <Empty 
            description="Ban chua co thu moi lam viec nao"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          >
            <Button type="primary" onClick={() => navigate('/jobs')}>
              Tim viec ngay
            </Button>
          </Empty>
        ) : (
          <Table 
            columns={columns} 
            dataSource={offers} 
            rowKey="maThuMoi"
            loading={loading}
            pagination={{ pageSize: 10 }}
          />
        )}
      </Card>

      <Modal
        title="Chi tiet thu moi lam viec"
        open={detailModalOpen}
        onCancel={() => {
          setDetailModalOpen(false);
          setSelectedOffer(null);
        }}
        width={800}
        footer={[
          <Button key="close" type="primary" onClick={() => {
            setDetailModalOpen(false);
            setSelectedOffer(null);
          }}>
            Dong
          </Button>
        ]}
      >
        {selectedOffer && (
          <div>
            <Alert 
              message={`Trang thai: ${getStatusText(selectedOffer.trangThai)}`}
              type={selectedOffer.trangThai === 'DaChapNhan' ? 'success' : selectedOffer.trangThai === 'DaTuChoi' ? 'error' : 'warning'}
              showIcon
              style={{ marginBottom: 16 }}
            />

            <Descriptions column={2} bordered style={{ marginBottom: 16 }}>
              <Descriptions.Item label="Vi tri cong viec" span={2}>
                <strong style={{ fontSize: 16 }}>{selectedOffer.viTriCongViec}</strong>
              </Descriptions.Item>
              <Descriptions.Item label="Cong ty" span={2}>
                {selectedOffer.tenCongTy}
              </Descriptions.Item>
              <Descriptions.Item label="Muc luong" span={2}>
                <span style={{ fontSize: 18, color: '#52c41a', fontWeight: 'bold' }}>
                  <DollarOutlined /> {selectedOffer.mucLuong.toLocaleString()} {selectedOffer.donViTien || 'VND'}
                </span>
              </Descriptions.Item>
              <Descriptions.Item label="Ngay bat dau du kien">
                <CalendarOutlined /> {selectedOffer.ngayBatDauDuKien ? dayjs(selectedOffer.ngayBatDauDuKien).format('DD/MM/YYYY') : 'Chua xac dinh'}
              </Descriptions.Item>
              <Descriptions.Item label="Han phan hoi">
                {selectedOffer.ngayHetHan ? dayjs(selectedOffer.ngayHetHan).format('DD/MM/YYYY') : 'Khong co'}
              </Descriptions.Item>
              <Descriptions.Item label="Nguoi phat hanh" span={2}>
                {selectedOffer.tenNguoiPhatHanh}
              </Descriptions.Item>
              <Descriptions.Item label="Ngay tao">
                {dayjs(selectedOffer.ngayTao).format('DD/MM/YYYY HH:mm')}
              </Descriptions.Item>
              <Descriptions.Item label="Ngay phan hoi">
                {selectedOffer.ngayPhanHoi ? dayjs(selectedOffer.ngayPhanHoi).format('DD/MM/YYYY HH:mm') : 'Chua phan hoi'}
              </Descriptions.Item>
            </Descriptions>

            {selectedOffer.ghiChu && (
              <>
                <Divider>Ghi chu</Divider>
                <Card style={{ backgroundColor: '#f5f5f5' }}>
                  <p style={{ whiteSpace: 'pre-wrap', margin: 0 }}>
                    {selectedOffer.ghiChu}
                  </p>
                </Card>
              </>
            )}
          </div>
        )}
      </Modal>

      <Modal
        title={respondType === 'accept' ? 'Chap nhan thu moi' : 'Tu choi thu moi'}
        open={respondModalOpen}
        onCancel={() => {
          setRespondModalOpen(false);
          setSelectedOffer(null);
          setRespondNote('');
        }}
        onOk={handleRespond}
        confirmLoading={responding}
        okText={respondType === 'accept' ? 'Chap nhan' : 'Tu choi'}
        cancelText="Huy"
        okButtonProps={{ 
          danger: respondType === 'reject',
          type: respondType === 'accept' ? 'primary' : 'default'
        }}
      >
        {selectedOffer && (
          <div>
            <Alert 
              message={respondType === 'accept' 
                ? 'Ban co chac chan muon chap nhan thu moi lam viec nay?' 
                : 'Ban co chac chan muon tu choi thu moi lam viec nay?'}
              type={respondType === 'accept' ? 'success' : 'warning'}
              showIcon
              style={{ marginBottom: 16 }}
            />

            <Descriptions column={1} bordered style={{ marginBottom: 16 }}>
              <Descriptions.Item label="Vi tri">
                <strong>{selectedOffer.viTriCongViec}</strong>
              </Descriptions.Item>
              <Descriptions.Item label="Cong ty">
                {selectedOffer.tenCongTy}
              </Descriptions.Item>
              <Descriptions.Item label="Muc luong">
                <span style={{ color: '#52c41a', fontWeight: 'bold' }}>
                  {selectedOffer.mucLuong.toLocaleString()} {selectedOffer.donViTien || 'VND'}
                </span>
              </Descriptions.Item>
            </Descriptions>

            <div>
              <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>
                Ghi chu (tuy chon):
              </label>
              <TextArea 
                rows={4}
                value={respondNote}
                onChange={(e) => setRespondNote(e.target.value)}
                placeholder={respondType === 'accept' 
                  ? 'VD: Cam on quy cong ty da gui thu moi. Toi rat vui mung duoc lam viec tai day...'
                  : 'VD: Cam on quy cong ty da gui thu moi. Tuy nhien, toi da co lua chon khac phu hop hon...'}
              />
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default MyOffersPage;