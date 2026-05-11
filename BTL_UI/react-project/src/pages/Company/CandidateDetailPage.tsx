import React, { useState, useEffect } from 'react';
import { Card, Descriptions, Button, message, Spin, Tag } from 'antd';
import { ArrowLeftOutlined, MailOutlined, PhoneOutlined, LinkedinOutlined, GithubOutlined, GlobalOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../services/api';
import { getCandidateStatusColor, getCandidateStatusText } from '../../utils/candidateStatus';
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
      const response = await api.get('/ho-so/' + maHoSo);

      if (response.data.success) {
        setCandidate(response.data.data);
      }
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Không thể tải thông tin ứng viên');
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
    return <div>Không tìm thấy ứng viên</div>;
  }

  return (
    <div style={{ padding: '24px' }}>
      <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/company/candidates')} style={{ marginBottom: 16 }}>
        Quay lại
      </Button>

      <Card title={'Hồ sơ: ' + candidate.tenNguoiDung}>
        <Descriptions bordered column={2}>
          <Descriptions.Item label="Họ tên">{candidate.tenNguoiDung}</Descriptions.Item>
          <Descriptions.Item label="Email">
            <a href={'mailto:' + candidate.email}>
              <MailOutlined /> {candidate.email}
            </a>
          </Descriptions.Item>
          <Descriptions.Item label="Số điện thoại">
            <PhoneOutlined /> {candidate.soDienThoai}
          </Descriptions.Item>
          <Descriptions.Item label="Ngày sinh">
            {candidate.ngaySinh ? dayjs(candidate.ngaySinh).format('DD/MM/YYYY') : 'Chưa cập nhật'}
          </Descriptions.Item>
          <Descriptions.Item label="Giới tính">{candidate.gioiTinh || 'Chưa cập nhật'}</Descriptions.Item>
          <Descriptions.Item label="Thành phố">{candidate.thanhPho || 'Chưa cập nhật'}</Descriptions.Item>
          <Descriptions.Item label="Địa chỉ" span={2}>{candidate.diaChi || 'Chưa cập nhật'}</Descriptions.Item>
          <Descriptions.Item label="Tiêu đề" span={2}>{candidate.tieuDe}</Descriptions.Item>
          <Descriptions.Item label="Tóm tắt" span={2}>{candidate.tomTat}</Descriptions.Item>
          <Descriptions.Item label="Tình trạng">
            <Tag color={getCandidateStatusColor(candidate.tinhTrangTimViec)}>
              {getCandidateStatusText(candidate.tinhTrangTimViec)}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Mức lương mong muốn">
            {candidate.mucLuongMongMuon ? candidate.mucLuongMongMuon.toLocaleString() + ' VND' : 'Thỏa thuận'}
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
