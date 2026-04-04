import { Card, Avatar, Typography, Row, Col, Button, Divider, Form, Input, message, Modal, Tabs, Descriptions, Tag, Space } from 'antd';
import { UserOutlined, BankOutlined, LockOutlined, LogoutOutlined, EditOutlined, SaveOutlined, GlobalOutlined, EnvironmentOutlined, TeamOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { NguoiDung, Profile, CongTy } from '../../types';
import { profileService } from '../../services/profileService';
import { companyService, type CapNhatCongTyDto } from '../../services/companyService';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

const RecruiterProfile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<NguoiDung | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [company, setCompany] = useState<CongTy | null>(null);
  const [loading, setLoading] = useState(false);
  const [editingPersonal, setEditingPersonal] = useState(false);
  const [editingCompany, setEditingCompany] = useState(false);
  const [passwordModalVisible, setPasswordModalVisible] = useState(false);

  const [personalForm] = Form.useForm();
  const [companyForm] = Form.useForm();
  const [passwordForm] = Form.useForm();

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const userData = JSON.parse(userStr);
      setUser(userData);
      loadProfileData(userData.maNguoiDung, userData.email);
    }
  }, []);

  const loadProfileData = async (maNguoiDung: number, email: string) => {
    setLoading(true);
    try {
      const profileRes = await profileService.getProfile(maNguoiDung);
      if (profileRes.success && profileRes.data) {
        setProfile(profileRes.data);
        personalForm.setFieldsValue({
          hoTen: profileRes.data.hoTen,
          soDienThoai: profileRes.data.soDienThoai,
        });
      }

      const companyRes = await companyService.getCompanyByEmail(email);
      if (companyRes.success && companyRes.data) {
        setCompany(companyRes.data);
        companyForm.setFieldsValue({
          tenCongTy: companyRes.data.tenCongTy,
          website: companyRes.data.website,
          quyMo: companyRes.data.quyMo,
          diaChi: companyRes.data.diaChi,
          thanhPho: companyRes.data.thanhPho,
          moTa: companyRes.data.moTa,
        });
      }
    } catch (error: any) {
      console.error('Error loading profile:', error);
      message.error(error.response?.data?.message || 'Không thể tải thông tin profile');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePersonal = async (values: any) => {
    if (!user) return;
    setLoading(true);
    try {
      await profileService.updateProfile(user.maNguoiDung, values);
      message.success('Cập nhật thông tin cá nhân thành công');
      setEditingPersonal(false);
      loadProfileData(user.maNguoiDung, user.email);
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Cập nhật thất bại');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateCompany = async (values: CapNhatCongTyDto) => {
    if (!company) return;
    setLoading(true);
    try {
      await companyService.updateCompany(company.maCongTy, values);
      message.success('Cập nhật thông tin công ty thành công');
      setEditingCompany(false);
      if (user) {
        loadProfileData(user.maNguoiDung, user.email);
      }
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Cập nhật thất bại');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (values: any) => {
    if (!user) return;
    setLoading(true);
    try {
      await profileService.changePassword(user.maNguoiDung, values);
      message.success('Đổi mật khẩu thành công');
      setPasswordModalVisible(false);
      passwordForm.resetFields();
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Đổi mật khẩu thất bại');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    message.success('Đăng xuất thành công');
    navigate('/login');
  };

  const tabItems = [
    {
      key: 'personal',
      label: (
        <span>
          <UserOutlined /> Thông tin cá nhân
        </span>
      ),
      children: (
        <Card>
          <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Title level={4} style={{ margin: 0 }}>Thông tin cá nhân</Title>
            {!editingPersonal && (
              <Button 
                type="primary" 
                icon={<EditOutlined />}
                onClick={() => setEditingPersonal(true)}
              >
                Chỉnh sửa
              </Button>
            )}
          </div>
          
          {editingPersonal ? (
            <Form
              form={personalForm}
              layout="vertical"
              onFinish={handleUpdatePersonal}
            >
              <Form.Item
                label="Họ tên"
                name="hoTen"
                rules={[{ required: true, message: 'Vui lòng nhập họ tên' }]}
              >
                <Input size="large" />
              </Form.Item>
              
              <Form.Item
                label="Số điện thoại"
                name="soDienThoai"
              >
                <Input size="large" />
              </Form.Item>

              <Space>
                <Button 
                  type="primary" 
                  htmlType="submit" 
                  loading={loading}
                  icon={<SaveOutlined />}
                >
                  Lưu thay đổi
                </Button>
                <Button onClick={() => setEditingPersonal(false)}>
                  Hủy
                </Button>
              </Space>
            </Form>
          ) : (
            <Descriptions column={1} bordered>
              <Descriptions.Item label="Họ tên">{profile?.hoTen}</Descriptions.Item>
              <Descriptions.Item label="Email">{profile?.email}</Descriptions.Item>
              <Descriptions.Item label="Số điện thoại">{profile?.soDienThoai || 'Chưa cập nhật'}</Descriptions.Item>
              <Descriptions.Item label="Trạng thái">
                <Tag color={profile?.dangHoatDong ? 'green' : 'red'}>
                  {profile?.dangHoatDong ? 'Đang hoạt động' : 'Không hoạt động'}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Ngày tạo">
                {profile?.ngayTao ? new Date(profile.ngayTao).toLocaleDateString('vi-VN') : '-'}
              </Descriptions.Item>
            </Descriptions>
          )}
        </Card>
      ),
    },
    {
      key: 'company',
      label: (
        <span>
          <BankOutlined /> Thông tin công ty
        </span>
      ),
      children: (
        <Card>
          <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Title level={4} style={{ margin: 0 }}>Thông tin công ty</Title>
            {company && !editingCompany && (
              <Button 
                type="primary" 
                icon={<EditOutlined />}
                onClick={() => setEditingCompany(true)}
              >
                Chỉnh sửa
              </Button>
            )}
          </div>

          {!company ? (
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
              <BankOutlined style={{ fontSize: 48, color: '#ccc', marginBottom: 16 }} />
              <Paragraph type="secondary">Bạn chưa có thông tin công ty</Paragraph>
              <Button type="primary" onClick={() => navigate('/company/create')}>
                Tạo công ty
              </Button>
            </div>
          ) : editingCompany ? (
            <Form
              form={companyForm}
              layout="vertical"
              onFinish={handleUpdateCompany}
            >
              <Form.Item
                label="Tên công ty"
                name="tenCongTy"
                rules={[{ required: true, message: 'Vui lòng nhập tên công ty' }]}
              >
                <Input size="large" prefix={<BankOutlined />} />
              </Form.Item>

              <Form.Item
                label="Website"
                name="website"
              >
                <Input size="large" prefix={<GlobalOutlined />} placeholder="https://example.com" />
              </Form.Item>

              <Form.Item
                label="Quy mô"
                name="quyMo"
              >
                <Input size="large" prefix={<TeamOutlined />} placeholder="VD: 50-100 nhân viên" />
              </Form.Item>

              <Form.Item
                label="Địa chỉ"
                name="diaChi"
              >
                <Input size="large" prefix={<EnvironmentOutlined />} />
              </Form.Item>

              <Form.Item
                label="Thành phố"
                name="thanhPho"
              >
                <Input size="large" />
              </Form.Item>

              <Form.Item
                label="Mô tả công ty"
                name="moTa"
              >
                <TextArea rows={4} placeholder="Giới thiệu về công ty..." />
              </Form.Item>

              <Space>
                <Button 
                  type="primary" 
                  htmlType="submit" 
                  loading={loading}
                  icon={<SaveOutlined />}
                >
                  Lưu thay đổi
                </Button>
                <Button onClick={() => setEditingCompany(false)}>
                  Hủy
                </Button>
              </Space>
            </Form>
          ) : (
            <Descriptions column={1} bordered>
              <Descriptions.Item label="Tên công ty">{company.tenCongTy}</Descriptions.Item>
              <Descriptions.Item label="Mã số thuế">{company.maSoThue || 'Chưa cập nhật'}</Descriptions.Item>
              <Descriptions.Item label="Website">
                {company.website ? (
                  <a href={company.website} target="_blank" rel="noopener noreferrer">
                    {company.website}
                  </a>
                ) : 'Chưa cập nhật'}
              </Descriptions.Item>
              <Descriptions.Item label="Quy mô">{company.quyMo || 'Chưa cập nhật'}</Descriptions.Item>
              <Descriptions.Item label="Địa chỉ">{company.diaChi || 'Chưa cập nhật'}</Descriptions.Item>
              <Descriptions.Item label="Thành phố">{company.thanhPho || 'Chưa cập nhật'}</Descriptions.Item>
              <Descriptions.Item label="Trạng thái">
                <Tag color={company.daDuocDuyet ? 'green' : 'orange'}>
                  {company.daDuocDuyet ? 'Đã duyệt' : 'Chờ duyệt'}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Mô tả">
                {company.moTa || 'Chưa cập nhật'}
              </Descriptions.Item>
            </Descriptions>
          )}
        </Card>
      ),
    },
    {
      key: 'security',
      label: (
        <span>
          <LockOutlined /> Bảo mật
        </span>
      ),
      children: (
        <Card>
          <Title level={4}>Bảo mật tài khoản</Title>
          <Paragraph type="secondary">
            Quản lý mật khẩu và các cài đặt bảo mật của bạn
          </Paragraph>
          
          <Divider />
          
          <div style={{ marginBottom: 24 }}>
            <Text strong>Mật khẩu</Text>
            <div style={{ marginTop: 8 }}>
              <Button 
                type="primary" 
                icon={<LockOutlined />}
                onClick={() => setPasswordModalVisible(true)}
              >
                Đổi mật khẩu
              </Button>
            </div>
          </div>
        </Card>
      ),
    },
  ];

  return (
    <div style={{ 
      minHeight: 'calc(100vh - 64px)',
      background: '#f5f5f5',
      padding: '24px 0'
    }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 20px' }}>
        <Card 
          style={{ 
            borderRadius: '8px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            marginBottom: '24px',
          }}
        >
          <Row gutter={24} align="middle">
            <Col>
              <Avatar 
                size={80} 
                icon={<UserOutlined />}
                style={{ backgroundColor: '#667eea' }}
              />
            </Col>
            <Col flex="auto">
              <Title level={3} style={{ margin: 0, marginBottom: 4 }}>
                {user?.hoTen || 'Nhà tuyển dụng'}
              </Title>
              <Text type="secondary" style={{ display: 'block', marginBottom: 4 }}>
                {company?.tenCongTy || 'Chưa có công ty'}
              </Text>
              <Text style={{ color: '#666' }}>
                {user?.email}
              </Text>
            </Col>
            <Col>
              <Button 
                danger
                icon={<LogoutOutlined />}
                onClick={handleLogout}
              >
                Đăng xuất
              </Button>
            </Col>
          </Row>
        </Card>

        <Card 
          style={{ 
            borderRadius: '8px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}
          loading={loading}
        >
          <Tabs items={tabItems} />
        </Card>
      </div>

      <Modal
        title="Đổi mật khẩu"
        open={passwordModalVisible}
        onCancel={() => {
          setPasswordModalVisible(false);
          passwordForm.resetFields();
        }}
        footer={null}
      >
        <Form
          form={passwordForm}
          layout="vertical"
          onFinish={handleChangePassword}
        >
          <Form.Item
            label="Mật khẩu cũ"
            name="matKhauCu"
            rules={[{ required: true, message: 'Vui lòng nhập mật khẩu cũ' }]}
          >
            <Input.Password size="large" />
          </Form.Item>

          <Form.Item
            label="Mật khẩu mới"
            name="matKhauMoi"
            rules={[
              { required: true, message: 'Vui lòng nhập mật khẩu mới' },
              { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự' }
            ]}
          >
            <Input.Password size="large" />
          </Form.Item>

          <Form.Item
            label="Xác nhận mật khẩu mới"
            name="xacNhanMatKhau"
            dependencies={['matKhauMoi']}
            rules={[
              { required: true, message: 'Vui lòng xác nhận mật khẩu mới' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('matKhauMoi') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('Mật khẩu xác nhận không khớp'));
                },
              }),
            ]}
          >
            <Input.Password size="large" />
          </Form.Item>

          <Form.Item style={{ marginBottom: 0 }}>
            <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
              <Button onClick={() => {
                setPasswordModalVisible(false);
                passwordForm.resetFields();
              }}>
                Hủy
              </Button>
              <Button type="primary" htmlType="submit" loading={loading}>
                Đổi mật khẩu
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default RecruiterProfile;
