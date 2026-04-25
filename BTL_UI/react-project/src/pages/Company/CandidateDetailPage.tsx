import React, { useState, useEffect } from 'react';
import { Card, Descriptions, Button, message, Spin, Tag, Space, Modal, Form, Input, InputNumber, DatePicker } from 'antd';
import { ArrowLeftOutlined, MailOutlined, PhoneOutlined, LinkedinOutlined, GithubOutlined, GlobalOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import dayjs from 'dayjs';

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

  useEffect(() => {
    fetchCandidateDetail();
  }, [maHoSo]);

  const fetchCandidateDetail = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        'http://localhost:5114/api/ho-so/' + maHoSo,
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
      <Button
        icon={<ArrowLeftOutlined />}
        onClick={() => navigate('/company/candidates')}
        style={{ marginBottom: 16 }}
      >
        Quay lai
      </Button>

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
    </div>
  );
};

export default CandidateDetailPage;