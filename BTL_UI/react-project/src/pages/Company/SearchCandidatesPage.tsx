import React, { useState, useEffect } from 'react';
import { Card, Input, Select, Button, Table, message, Tag, Space } from 'antd';
import { SearchOutlined, EyeOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { CANDIDATE_STATUS, getCandidateStatusColor, getCandidateStatusText } from '../../utils/candidateStatus';
import PageContainer from '../../components/Layout/PageContainer';

const { Option } = Select;

interface HoSoUngVien {
  maHoSo: number;
  tenNguoiDung: string;
  email: string;
  soDienThoai: string;
  tieuDe: string;
  tomTat: string;
  thanhPho: string;
  tinhTrangTimViec: string;
  mucLuongMongMuon: number;
  ngayCapNhat: string;
}

const SearchCandidatesPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [candidates, setCandidates] = useState<HoSoUngVien[]>([]);
  const [searchParams, setSearchParams] = useState({
    tuKhoa: '',
    thanhPho: '',
    tinhTrang: '',
  });

  const fetchCandidates = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      
      if (searchParams.tuKhoa) params.append('tuKhoa', searchParams.tuKhoa);
      if (searchParams.thanhPho) params.append('thanhPho', searchParams.thanhPho);
      if (searchParams.tinhTrang) params.append('tinhTrang', searchParams.tinhTrang);

      console.log('Searching with params:', params.toString());

      const response = await api.get('/ho-so/tim-kiem?' + params.toString());

      console.log('Response:', response.data);

      if (response.data.success) {
        setCandidates(response.data.data || []);
        if (!response.data.data || response.data.data.length === 0) {
          message.info('Không tìm thấy ứng viên phù hợp');
        }
      } else {
        message.error(response.data.message || 'Không thể tải danh sách ứng viên');
      }
    } catch (error: any) {
      console.error('Error fetching candidates:', error);
      if (error.response?.status === 401) {
        message.error('Phiên đăng nhập hết hạn, vui lòng đăng nhập lại');
      } else if (error.response?.status === 403) {
        message.error('Bạn không có quyền truy cập chức năng này');
      } else {
        message.error(error.response?.data?.message || 'Không thể tải danh sách ứng viên');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCandidates();
  }, []);

  const columns = [
    {
      title: 'Họ tên',
      dataIndex: 'tenNguoiDung',
      key: 'tenNguoiDung',
      width: 150,
    },
    {
      title: 'Tiêu đề',
      dataIndex: 'tieuDe',
      key: 'tieuDe',
      width: 200,
    },
    {
      title: 'Thành phố',
      dataIndex: 'thanhPho',
      key: 'thanhPho',
      width: 120,
    },
    {
      title: 'Tình trạng',
      dataIndex: 'tinhTrangTimViec',
      key: 'tinhTrangTimViec',
      width: 150,
      render: (status: string) => <Tag color={getCandidateStatusColor(status)}>{status ? getCandidateStatusText(status) : 'N/A'}</Tag>,
    },
    {
      title: 'Mức lương mong muốn',
      dataIndex: 'mucLuongMongMuon',
      key: 'mucLuongMongMuon',
      width: 150,
      render: (salary: number) => salary ? salary.toLocaleString() + ' VND' : 'Thỏa thuận',
    },
    {
      title: 'Hành động',
      key: 'action',
      width: 150,
      render: (_: any, record: HoSoUngVien) => (
        <Space>
          <Button
            type="primary"
            icon={<EyeOutlined />}
            size="small"
            onClick={() => navigate('/company/candidates/' + record.maHoSo)}
          >
            Xem
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <PageContainer>
      <Card title="Tìm kiếm ứng viên" style={{ marginBottom: 24 }}>
        <Space direction="vertical" style={{ width: '100%' }} size="middle">
          <Input
            placeholder="Tìm theo tên, tiêu đề, kỹ năng..."
            prefix={<SearchOutlined />}
            value={searchParams.tuKhoa}
            onChange={(e) => setSearchParams({ ...searchParams, tuKhoa: e.target.value })}
            onPressEnter={fetchCandidates}
          />
          
          <Space wrap>
            <Select
              placeholder="Thành phố"
              style={{ width: 200 }}
              value={searchParams.thanhPho || undefined}
              onChange={(value) => setSearchParams({ ...searchParams, thanhPho: value })}
              allowClear
            >
              <Option value="Hà Nội">Hà Nội</Option>
              <Option value="Hồ Chí Minh">Hồ Chí Minh</Option>
              <Option value="Đà Nẵng">Đà Nẵng</Option>
              <Option value="Hải Phòng">Hải Phòng</Option>
              <Option value="Cần Thơ">Cần Thơ</Option>
            </Select>

            <Select
              placeholder="Tình trạng"
              style={{ width: 200 }}
              value={searchParams.tinhTrang || undefined}
              onChange={(value) => setSearchParams({ ...searchParams, tinhTrang: value })}
              allowClear
            >
              <Option value={CANDIDATE_STATUS.SANG_TIM_VIEC}>Sẵn sàng tìm việc</Option>
              <Option value={CANDIDATE_STATUS.MO_TIM_VIEC}>Mở tìm việc</Option>
              <Option value={CANDIDATE_STATUS.KHONG_TIM_VIEC}>Không tìm việc</Option>
            </Select>

            <Button type="primary" icon={<SearchOutlined />} onClick={fetchCandidates}>
              Tìm kiếm
            </Button>
          </Space>
        </Space>
      </Card>

      <Card title={'Kết quả tìm kiếm (' + candidates.length + ' ung vien)'}>
        <Table
          columns={columns}
          dataSource={candidates}
          rowKey="maHoSo"
          loading={loading}
          pagination={{ pageSize: 10 }}
          locale={{ emptyText: 'Chưa có ứng viên nào' }}
        />
      </Card>
    </PageContainer>
  );
};

export default SearchCandidatesPage;