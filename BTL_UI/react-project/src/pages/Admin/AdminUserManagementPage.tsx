import { useEffect, useState } from 'react';
import { Button, Card, Input, Popconfirm, Select, Space, Table, Tag, message } from 'antd';
import type { AdminUser } from '../../types';
import { getAdminUsers, lockAdminUser, unlockAdminUser } from '../../services/adminUserService';
import dayjs from 'dayjs';
import PageContainer from '../../components/Layout/PageContainer';

const AdminUserManagementPage = () => {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [status, setStatus] = useState<'all' | 'active' | 'locked'>('all');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    fetchUsers();
  }, [search, status, page, pageSize]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await getAdminUsers({ search, status, page, pageSize });
      if (response.success && response.data) {
        setUsers(response.data.items);
        setTotal(response.data.total);
      }
    } catch (error) {
      console.error('Error fetching admin users:', error);
      message.error('Khong the tai danh sach nguoi dung');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setPage(1);
    setSearch(searchInput.trim());
  };

  const handleStatusChange = (value: 'all' | 'active' | 'locked') => {
    setPage(1);
    setStatus(value);
  };

  const handleLockToggle = async (user: AdminUser, nextActiveState: boolean) => {
    try {
      const response = nextActiveState
        ? await unlockAdminUser(user.maNguoiDung)
        : await lockAdminUser(user.maNguoiDung);

      if (response.success) {
        message.success(response.message);
        fetchUsers();
      }
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Cap nhat trang thai that bai');
    }
  };

  const columns = [
    {
      title: 'Ma',
      dataIndex: 'maNguoiDung',
      key: 'maNguoiDung',
      width: 80,
    },
    {
      title: 'Ho ten',
      dataIndex: 'hoTen',
      key: 'hoTen',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'So dien thoai',
      dataIndex: 'soDienThoai',
      key: 'soDienThoai',
      render: (value?: string) => value || 'N/A',
    },
    {
      title: 'Vai tro',
      dataIndex: 'tenVaiTro',
      key: 'tenVaiTro',
    },
    {
      title: 'Trang thai',
      dataIndex: 'dangHoatDong',
      key: 'dangHoatDong',
      render: (value: boolean) => (
        <Tag color={value ? 'green' : 'red'}>{value ? 'Hoat dong' : 'Da khoa'}</Tag>
      ),
    },
    {
      title: 'Ngay tao',
      dataIndex: 'ngayTao',
      key: 'ngayTao',
      render: (value: string) => dayjs(value).format('DD/MM/YYYY HH:mm'),
    },
    {
      title: 'Thao tac',
      key: 'action',
      width: 140,
      render: (_: unknown, record: AdminUser) => (
        <Popconfirm
          title={record.dangHoatDong ? 'Khoa tai khoan' : 'Mo khoa tai khoan'}
          description={record.dangHoatDong ? 'Ban co chac chan muon khoa tai khoan nay?' : 'Ban co chac chan muon mo khoa tai khoan nay?'}
          onConfirm={() => handleLockToggle(record, !record.dangHoatDong)}
          okText={record.dangHoatDong ? 'Khoa' : 'Mo khoa'}
          cancelText="Huy"
        >
          <Button danger={record.dangHoatDong} type={!record.dangHoatDong ? 'primary' : 'default'}>
            {record.dangHoatDong ? 'Khoa' : 'Mo khoa'}
          </Button>
        </Popconfirm>
      ),
    },
  ];

  return (
    <PageContainer maxWidth="1400px" padding="24px">
      <h1>Quan ly nguoi dung</h1>
      <p>Xem danh sach, tim kiem va khoa/mo khoa tai khoan nguoi dung</p>

      <Card style={{ marginBottom: 16 }}>
        <Space wrap>
          <Input.Search
            placeholder="Tim theo ten, email, so dien thoai"
            allowClear
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onSearch={handleSearch}
            style={{ width: 320 }}
          />
          <Select
            value={status}
            onChange={handleStatusChange}
            style={{ width: 180 }}
            options={[
              { value: 'all', label: 'Tat ca trang thai' },
              { value: 'active', label: 'Dang hoat dong' },
              { value: 'locked', label: 'Da khoa' },
            ]}
          />
        </Space>
      </Card>

      <Card>
        <Table
          columns={columns}
          dataSource={users}
          rowKey="maNguoiDung"
          loading={loading}
          pagination={{
            current: page,
            pageSize,
            total,
            showSizeChanger: true,
            onChange: (nextPage, nextPageSize) => {
              setPage(nextPage);
              setPageSize(nextPageSize);
            },
          }}
          scroll={{ x: 1000 }}
        />
      </Card>
    </PageContainer>
  );
};

export default AdminUserManagementPage;
