import React, { useState, useEffect } from 'react';
import { Card, Table, Tag, Button, message, Space, Modal } from 'antd';
import { EyeOutlined, DeleteOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import api from '../../services/api';
import { getStoredUser } from '../../utils/auth';

interface ThuMoi {
  maThuMoi: number;
  maDon: number;
  tenUngVien: string;
  viTriCongViec: string;
  mucLuong: number;
  donViTien: string;
  ngayBatDauDuKien: string;
  ngayHetHan: string;
  trangThai: string;
  ngayTao: string;
  ghiChu: string;
}

const ManageOffersPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [offers, setOffers] = useState<ThuMoi[]>([]);
  const [selectedOffer, setSelectedOffer] = useState<ThuMoi | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  useEffect(() => {
    fetchOffers();
  }, []);

  const fetchOffers = async () => {
    setLoading(true);
    try {
      const user = getStoredUser();

      if (!user) {
        message.error('Vui lòng đăng nhập lại');
        setLoading(false);
        return;
      }
      
      const response = await api.get(`/thu-moi/nguoi-phat-hanh/${user.maNguoiDung}`);

      console.log('API Response:', response.data);


      if (response.data.success) {
        setOffers(response.data.data || []);
      } else {
        message.error(response.data.message || 'Khong the tai danh sach thu moi');
      }
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Khong the tai danh sach thu moi');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (maThuMoi: number) => {
    Modal.confirm({
      title: 'Xac nhan xoa',
      content: 'Ban co chac chan muon xoa thu moi nay?',
      okText: 'Xoa',
      cancelText: 'Huy',
      onOk: async () => {
        try {
          await api.delete(`/thu-moi/${maThuMoi}`);
          message.success('Xoa thu moi thanh cong');
          fetchOffers();
        } catch (error: any) {
          message.error(error.response?.data?.message || 'Khong the xoa thu moi');
        }
      },
    });
  };

  const columns = [
    {
      title: 'Ung vien',
      dataIndex: 'tenUngVien',
      key: 'tenUngVien',
      width: 150,
    },
    {
      title: 'Cong ty',
      dataIndex: 'tenCongTy',
      key: 'tenCongTy',
      width: 150,
    },
    {
      title: 'Vi tri',
      dataIndex: 'viTriCongViec',
      key: 'viTriCongViec',
      width: 200,
    },
    {
      title: 'Muc luong',
      dataIndex: 'mucLuong',
      key: 'mucLuong',
      width: 150,
      render: (salary: number, record: ThuMoi) => 
        salary ? salary.toLocaleString() + ' ' + (record.donViTien || 'VND') : 'N/A',
    },
    {
      title: 'Ngay bat dau',
      dataIndex: 'ngayBatDauDuKien',
      key: 'ngayBatDauDuKien',
      width: 120,
      render: (date: string) => date ? dayjs(date).format('DD/MM/YYYY') : 'N/A',
    },
    {
      title: 'Han phan hoi',
      dataIndex: 'ngayHetHan',
      key: 'ngayHetHan',
      width: 120,
      render: (date: string) => date ? dayjs(date).format('DD/MM/YYYY') : 'N/A',
    },
    {
      title: 'Trang thai',
      dataIndex: 'trangThai',
      key: 'trangThai',
      width: 120,
      render: (status: string) => {
        const colorMap: Record<string, string> = {
          'ChoPhanHoi': 'orange',
          'DaDongY': 'green',
          'DaTuChoi': 'red',
        };
        const textMap: Record<string, string> = {
          'ChoPhanHoi': 'Cho phan hoi',
          'DaDongY': 'Da dong y',
          'DaTuChoi': 'Da tu choi',
        };
        return <Tag color={colorMap[status] || 'default'}>{textMap[status] || status}</Tag>;
      },
    },
    {
      title: 'Hanh dong',
      key: 'action',
      width: 150,
      render: (_: any, record: ThuMoi) => (
        <Space>
          <Button
            type="primary"
            icon={<EyeOutlined />}
            size="small"
            onClick={() => {
              setSelectedOffer(record);
              setShowDetailModal(true);
            }}
          >
            Xem
          </Button>
          {record.trangThai === 'ChoPhanHoi' && (
            <Button
              danger
              icon={<DeleteOutlined />}
              size="small"
              onClick={() => handleDelete(record.maThuMoi)}
            >
              Xoa
            </Button>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div style={{ background: '#fff', minHeight: 'calc(100vh - 64px)' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      <Card title={'Quan ly thu moi da gui (' + offers.length + ' thu moi tu tat ca cong ty)'}>
        <Table
          columns={columns}
          dataSource={offers}
          rowKey="maThuMoi"
          loading={loading}
          pagination={{ pageSize: 10 }}
          locale={{ emptyText: 'Chua co thu moi nao' }}
        />
      </Card>

      <Modal
        title="Chi tiet thu moi"
        open={showDetailModal}
        onCancel={() => setShowDetailModal(false)}
        footer={[
          <Button key="close" onClick={() => setShowDetailModal(false)}>
            Dong
          </Button>,
        ]}
      >
        {selectedOffer && (
          <div>
            <p><strong>Ung vien:</strong> {selectedOffer.tenUngVien || 'N/A'}</p>
            <p><strong>Vi tri:</strong> {selectedOffer.viTriCongViec}</p>
            <p><strong>Muc luong:</strong> {selectedOffer.mucLuong ? selectedOffer.mucLuong.toLocaleString() : 'N/A'} {selectedOffer.donViTien || 'VND'}</p>
            <p><strong>Ngay bat dau:</strong> {selectedOffer.ngayBatDauDuKien ? dayjs(selectedOffer.ngayBatDauDuKien).format('DD/MM/YYYY') : 'N/A'}</p>
            <p><strong>Han phan hoi:</strong> {selectedOffer.ngayHetHan ? dayjs(selectedOffer.ngayHetHan).format('DD/MM/YYYY') : 'N/A'}</p>
            <p><strong>Trang thai:</strong> {selectedOffer.trangThai}</p>
            {selectedOffer.ghiChu && (
              <p><strong>Ghi chu:</strong> {selectedOffer.ghiChu}</p>
            )}
          </div>
        )}
      </Modal>
      </div>
    </div>
  );
};

export default ManageOffersPage;
