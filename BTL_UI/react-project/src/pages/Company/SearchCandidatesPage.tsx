import React, { useState, useEffect } from 'react';
import { Card, Input, Select, Button, Table, message, Tag, Space } from 'antd';
import { SearchOutlined, EyeOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

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
      const token = localStorage.getItem('token');
      const params = new URLSearchParams();
      
      if (searchParams.tuKhoa) params.append('tuKhoa', searchParams.tuKhoa);
      if (searchParams.thanhPho) params.append('thanhPho', searchParams.thanhPho);
      if (searchParams.tinhTrang) params.append('tinhTrang', searchParams.tinhTrang);

      const response = await axios.get(
        'http://localhost:5114/api/ho-so/tim-kiem?' + params.toString(),
        { headers: { Authorization: 'Bearer ' + token } }
      );

      if (response.data.success) {
        setCandidates(response.data.data || []);
      }
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Khong the tai danh sach ung vien');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCandidates();
  }, []);

  const columns = [
    {
      title: 'Ho ten',
      dataIndex: 'tenNguoiDung',
      key: 'tenNguoiDung',
      width: 150,
    },
    {
      title: 'Tieu de',
      dataIndex: 'tieuDe',
      key: 'tieuDe',
      width: 200,
    },
    {
      title: 'Thanh pho',
      dataIndex: 'thanhPho',
      key: 'thanhPho',
      width: 120,
    },
    {
      title: 'Tinh trang',
      dataIndex: 'tinhTrangTimViec',
      key: 'tinhTrangTimViec',
      width: 150,
      render: (status: string) => {
        const colorMap: Record<string, string> = {
          'SangTimViec': 'green',
          'MoTimViec': 'blue',
          'KhongTimViec': 'gray',
        };
        return <Tag color={colorMap[status] || 'default'}>{status}</Tag>;
      },
    },
    {
      title: 'Muc luong mong muon',
      dataIndex: 'mucLuongMongMuon',
      key: 'mucLuongMongMuon',
      width: 150,
      render: (salary: number) => salary ? salary.toLocaleString() + ' VND' : 'Thoa thuan',
    },
    {
      title: 'Hanh dong',
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
    <div style={{ padding: '24px' }}>
      <Card title="Tim kiem ung vien" style={{ marginBottom: 24 }}>
        <Space direction="vertical" style={{ width: '100%' }} size="middle">
          <Input
            placeholder="Tim theo ten, tieu de, ky nang..."
            prefix={<SearchOutlined />}
            value={searchParams.tuKhoa}
            onChange={(e) => setSearchParams({ ...searchParams, tuKhoa: e.target.value })}
            onPressEnter={fetchCandidates}
          />
          
          <Space wrap>
            <Select
              placeholder="Thanh pho"
              style={{ width: 200 }}
              value={searchParams.thanhPho || undefined}
              onChange={(value) => setSearchParams({ ...searchParams, thanhPho: value })}
              allowClear
            >
              <Option value="Ha Noi">Ha Noi</Option>
              <Option value="Ho Chi Minh">Ho Chi Minh</Option>
              <Option value="Da Nang">Da Nang</Option>
            </Select>

            <Select
              placeholder="Tinh trang"
              style={{ width: 200 }}
              value={searchParams.tinhTrang || undefined}
              onChange={(value) => setSearchParams({ ...searchParams, tinhTrang: value })}
              allowClear
            >
              <Option value="SangTimViec">San sang tim viec</Option>
              <Option value="MoTimViec">Mo tim viec</Option>
              <Option value="KhongTimViec">Khong tim viec</Option>
            </Select>

            <Button type="primary" icon={<SearchOutlined />} onClick={fetchCandidates}>
              Tim kiem
            </Button>
          </Space>
        </Space>
      </Card>

      <Card title={'Ket qua tim kiem (' + candidates.length + ' ung vien)'}>
        <Table
          columns={columns}
          dataSource={candidates}
          rowKey="maHoSo"
          loading={loading}
          pagination={{ pageSize: 10 }}
        />
      </Card>
    </div>
  );
};

export default SearchCandidatesPage;