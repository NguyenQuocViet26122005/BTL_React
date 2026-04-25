import React, { useState, useEffect } from 'react';
import { Card, Table, Tag, Button, message, Space, Modal } from 'antd';
import { EyeOutlined, DeleteOutlined } from '@ant-design/icons';
import axios from 'axios';
import dayjs from 'dayjs';

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
      const token = localStorage.getItem('token');
      const userStr = localStorage.getItem('user');
      if (!userStr) return;
      
      const user = JSON.parse(userStr);
      const response = await axios.get(
        'http://localhost:5114/api/thu-moi/cong-ty/' + user.maCongTy,
        { headers: { Authorization: 'Bearer ' + token } }
      );

      if (response.data.success) {
        setOffers(response.data.data || []);
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
          const token = localStorage.getItem('token');
          await axios.delete(
            'http://localhost:5114/api/thu-moi/' + maThuMoi,
            { headers: { Authorization: 'Bearer ' + token } }
          );
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
        salary.toLocaleString() + ' ' + (record.donViTien || 'VND'),
    },
    {
      title: 'Ngay bat dau',
      dataIndex: 'ngayBatDauDuKien',
      key: 'ngayBatDauDuKien',
      width: 120,
      render: (date: string) => dayjs(date).format('DD/MM/YYYY'),
    },
    {
      title: 'Han phan hoi',
      dataIndex: 'ngayHetHan',
      key: 'ngayHetHan',
      width: 120,
      render: (date: string) => dayjs(date).format('DD/MM/YYYY'),
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
        return <Tag color={colorMap[status]}>{textMap[status] || status}</Tag>;
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
    <div style={{ padding: '24px' }}>
      <Card title={'Quan ly thu moi da gui (' + offers.length + ' thu moi)'}>
        <Table
          columns={columns}
          dataSource={offers}
          rowKey="maThuMoi"
          loading={loading}
          pagination={{ pageSize: 10 }}
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
            <p><strong>Ung vien:</strong> {selectedOffer.tenUngVien}</p>
            <p><strong>Vi tri:</strong> {selectedOffer.viTriCongViec}</p>
            <p><strong>Muc luong:</strong> {selectedOffer.mucLuong.toLocaleString()} {selectedOffer.donViTien}</p>
            <p><strong>Ngay bat dau:</strong> {dayjs(selectedOffer.ngayBatDauDuKien).format('DD/MM/YYYY')}</p>
            <p><strong>Han phan hoi:</strong> {dayjs(selectedOffer.ngayHetHan).format('DD/MM/YYYY')}</p>
            <p><strong>Trang thai:</strong> {selectedOffer.trangThai}</p>
            {selectedOffer.ghiChu && (
              <p><strong>Ghi chu:</strong> {selectedOffer.ghiChu}</p>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ManageOffersPage;