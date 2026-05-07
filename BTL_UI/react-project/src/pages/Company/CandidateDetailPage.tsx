import React, { useState, useEffect } from 'react';
import { Card, Descriptions, Button, message, Spin, Tag, Modal, Form, Input, InputNumber, DatePicker, Space } from 'antd';
import { ArrowLeftOutlined, MailOutlined, PhoneOutlined, LinkedinOutlined, GithubOutlined, GlobalOutlined, SendOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import { offerService } from '../../services/offerService';
import axios from 'axios';
import dayjs from 'dayjs';

const { TextArea } = Input;

interface HoSoUngVien {
  maHoSo: number;
  maNguoiDung: number;
  tenNguoiDung: string;
  email: string;
  soDienThoai: string;
  tieuDe: string;
  tomTat: string;
  ngaySinh: string;
  gioiTinh: string;
  diaChi: string;
  thanhPho: string;
  linkedIn: string;
  gitHub: string;
  portfolio: string;
  tinhTrangTimViec: string;
  mucLuongMongMuon: number;
}

const CandidateDetailPage: React.FC = () => {
  const navigate = useNavigate();
  const { maHoSo } = useParams<{ maHoSo: string }>();
  const [loading, setLoading] = useState(true);
  const [candidate, setCandidate] = useState<HoSoUngVien | null>(null);
  const [offerModalVisible, setOfferModalVisible] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchCandidateDetail();
  }, [maHoSo]);

  const fetchCandidateDetail = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        'https://localhost:44314/api/ho-so/' + maHoSo,
        { headers: { Authorization: 'Bearer ' + token } }
      );

      if (response.data.success) {
        setCandidate(response.data.data);
      }
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Khong the tai thong tin ung vien');
    } finally {
      setLoading(false);
    }
  };

  const handleSendOffer = () => {
    if (!candidate) return;
    form.setFieldsValue({
      viTriCongViec: candidate.tieuDe,
      mucLuong: candidate.mucLuongMongMuon || 0
    });
    setOfferModalVisible(true);
  };

  const handleSubmitOffer = async (values: any) => {
    if (!candidate) return;
    setLoading(true);
    try {
      const data = {
        maDon: 0,
        viTriCongViec: values.viTriCongViec,
        mucLuong: values.mucLuong,
        donViTien: values.donViTien || 'VND',
        ngayBatDauDuKien: values.ngayBatDauDuKien ? values.ngayBatDauDuKien.format('YYYY-MM-DD') : undefined,
        ngayHetHan: values.ngayHetHan ? values.ngayHetHan.format('YYYY-MM-DD') : undefined,
        ghiChu: values.ghiChu
      };

      await offerService.create(data);
      message.success('Gui thu moi thanh cong');
      setOfferModalVisible(false);
      form.resetFields();
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Gui thu moi that bai');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '100px' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!candidate) {
    return <div>Khong tim thay ung vien</div>;
  }

  return (
    <div style={{ padding: '24px' }}>
      <Space style={{ marginBottom: 16 }}>
        <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/company/candidates')}>
          Quay lai
        </Button>
        <Button type="primary" icon={<SendOutlined />} onClick={handleSendOffer}>
          Gui thu moi lam viec
        </Button>
      </Space>

      <Card title={'Ho so: ' + candidate.tenNguoiDung}>
        <Descriptions bordered column={2}>
          <Descriptions.Item label="Ho ten">{candidate.tenNguoiDung}</Descriptions.Item>
          <Descriptions.Item label="Email">
            <a href={'mailto:' + candidate.email}>
              <MailOutlined /> {candidate.email}
            </a>
          </Descriptions.Item>
          <Descriptions.Item label="So dien thoai">
            <PhoneOutlined /> {candidate.soDienThoai}
          </Descriptions.Item>
          <Descriptions.Item label="Ngay sinh">
            {candidate.ngaySinh ? dayjs(candidate.ngaySinh).format('DD/MM/YYYY') : 'Chua cap nhat'}
          </Descriptions.Item>
          <Descriptions.Item label="Gioi tinh">{candidate.gioiTinh || 'Chua cap nhat'}</Descriptions.Item>
          <Descriptions.Item label="Thanh pho">{candidate.thanhPho || 'Chua cap nhat'}</Descriptions.Item>
          <Descriptions.Item label="Dia chi" span={2}>{candidate.diaChi || 'Chua cap nhat'}</Descriptions.Item>
          <Descriptions.Item label="Tieu de" span={2}>{candidate.tieuDe}</Descriptions.Item>
          <Descriptions.Item label="Tom tat" span={2}>{candidate.tomTat}</Descriptions.Item>
          <Descriptions.Item label="Tinh trang">
            <Tag color={candidate.tinhTrangTimViec === 'SangTimViec' ? 'green' : 'blue'}>
              {candidate.tinhTrangTimViec}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Muc luong mong muon">
            {candidate.mucLuongMongMuon ? candidate.mucLuongMongMuon.toLocaleString() + ' VND' : 'Thoa thuan'}
          </Descriptions.Item>
          {candidate.linkedIn && (
            <Descriptions.Item label="LinkedIn">
              <a href={candidate.linkedIn} target="_blank" rel="noopener noreferrer">
                <LinkedinOutlined /> {candidate.linkedIn}
              </a>
            </Descriptions.Item>
          )}
          {candidate.gitHub && (
            <Descriptions.Item label="GitHub">
              <a href={candidate.gitHub} target="_blank" rel="noopener noreferrer">
                <GithubOutlined /> {candidate.gitHub}
              </a>
            </Descriptions.Item>
          )}
          {candidate.portfolio && (
            <Descriptions.Item label="Portfolio" span={2}>
              <a href={candidate.portfolio} target="_blank" rel="noopener noreferrer">
                <GlobalOutlined /> {candidate.portfolio}
              </a>
            </Descriptions.Item>
          )}
        </Descriptions>
      </Card>

      <Modal
        title="Gui thu moi lam viec"
        open={offerModalVisible}
        onCancel={() => { setOfferModalVisible(false); form.resetFields(); }}
        footer={null}
        width={600}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmitOffer}>
          <Form.Item name="viTriCongViec" label="Vi tri cong viec" rules={[{ required: true, message: 'Vui long nhap vi tri' }]}>
            <Input placeholder="VD: Senior Java Developer" />
          </Form.Item>
          <Form.Item name="mucLuong" label="Muc luong" rules={[{ required: true, message: 'Vui long nhap muc luong' }]}>
            <InputNumber style={{ width: '100%' }} formatter={value => ${value}.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} parser={value => value!.replace(/\$\s?|(,*)/g, '')} placeholder="Nhap muc luong" />
          </Form.Item>
          <Form.Item name="donViTien" label="Don vi tien" initialValue="VND">
            <Input placeholder="VND" />
          </Form.Item>
          <Form.Item name="ngayBatDauDuKien" label="Ngay bat dau du kien">
            <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
          </Form.Item>
          <Form.Item name="ngayHetHan" label="Han phan hoi">
            <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
          </Form.Item>
          <Form.Item name="ghiChu" label="Ghi chu">
            <TextArea rows={4} placeholder="Nhap ghi chu ve thu moi..." />
          </Form.Item>
          <Form.Item style={{ marginBottom: 0 }}>
            <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
              <Button onClick={() => { setOfferModalVisible(false); form.resetFields(); }}>Huy</Button>
              <Button type="primary" htmlType="submit" loading={loading}>Gui thu moi</Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default CandidateDetailPage;
