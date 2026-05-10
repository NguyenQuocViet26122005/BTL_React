import { Card, Avatar, Typography, Button, Form, Input, message, Modal, Tabs, Descriptions, Tag, Space, DatePicker, Select, Row, Col, Divider, Empty, List, Popconfirm, InputNumber } from 'antd';
import { UserOutlined, LockOutlined, LogoutOutlined, EditOutlined, SaveOutlined, LinkedinOutlined, GithubOutlined, GlobalOutlined, EnvironmentOutlined, FileOutlined, MailOutlined, BookOutlined, PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { NguoiDung, HoSoUngVien } from '../../types';
import { offerService } from '../../services/offerService';
import { educationService, HocVan, TaoHocVanDto } from '../../services/educationService';
import { resumeService } from '../../services/resumeService';
import { profileService } from '../../services/profileService';
import CvManager from '../../components/CV/CvManager';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { TextArea } = Input;

const CandidateProfile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<NguoiDung | null>(null);
  const [hoSo, setHoSo] = useState<HoSoUngVien | null>(null);
  const [loading, setLoading] = useState(false);
  const [editingPersonal, setEditingPersonal] = useState(false);
  const [passwordModalVisible, setPasswordModalVisible] = useState(false);
  const [hasResume, setHasResume] = useState(false);

  const [personalForm] = Form.useForm();
  const [passwordForm] = Form.useForm();

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const userData = JSON.parse(userStr);
      setUser(userData);
      loadResumeData(userData.maNguoiDung);
    }
  }, []);

  const loadResumeData = async (maNguoiDung: number) => {
    setLoading(true);
    try {
      const res = await resumeService.getMyResume(maNguoiDung);
      if (res.success && res.data) {
        setHoSo(res.data);
        setHasResume(true);
        personalForm.setFieldsValue({
          tieuDe: res.data.tieuDe,
          tomTat: res.data.tomTat,
          ngaySinh: res.data.ngaySinh ? dayjs(res.data.ngaySinh) : null,
          gioiTinh: res.data.gioiTinh,
          diaChi: res.data.diaChi,
          thanhPho: res.data.thanhPho,
          linkedIn: res.data.linkedIn,
          gitHub: res.data.gitHub,
          portfolio: res.data.portfolio,
          tinhTrangTimViec: res.data.tinhTrangTimViec,
          mucLuongMongMuon: res.data.mucLuongMongMuon,
        });
      } else {
        setHasResume(false);
      }
    } catch (error: any) {
      console.error('Error loading resume:', error);
      setHasResume(false);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePersonal = async (values: any) => {
    if (!hoSo || !user) return;
    setLoading(true);
    try {
      const updateData = {
        maNguoiDung: user.maNguoiDung,
        hoTen: user.hoTen,
        email: user.email,
        soDienThoai: user.soDienThoai || '0000000000',
        ...values,
        ngaySinh: values.ngaySinh ? values.ngaySinh.format('YYYY-MM-DD') : null,
      };
      await resumeService.updateResume(hoSo.maHoSo, updateData);
      message.success('Cap nhat ho so thanh cong');
      setEditingPersonal(false);
      loadResumeData(user.maNguoiDung);
    } catch (error: any) {
      console.error('Update error:', error.response?.data);
      message.error(error.response?.data?.message || 'Cap nhat that bai');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (values: any) => {
    if (!user) return;
    setLoading(true);
    try {
      await profileService.changePassword(user.maNguoiDung, values);
      message.success('Doi mat khau thanh cong');
      setPasswordModalVisible(false);
      passwordForm.resetFields();
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Doi mat khau that bai');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    message.success('Dang xuat thanh cong');
    navigate('/login');
  };

  const handleCreateResume = () => {
    navigate('/candidate/resume');
  };

  if (!hasResume) {
    return (
      <div style={{ minHeight: 'calc(100vh - 64px)', background: '#f5f5f5', padding: '24px 0' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 20px' }}>
          <Card style={{ borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', marginBottom: '24px' }}>
            <Row gutter={24} align="middle">
              <Col>
                <Avatar size={80} icon={<UserOutlined />} style={{ backgroundColor: '#667eea' }} />
              </Col>
              <Col flex="auto">
                <Title level={3} style={{ margin: 0, marginBottom: 4 }}>{user?.hoTen || 'Ung vien'}</Title>
                <Text type="secondary" style={{ display: 'block', marginBottom: 4 }}>Tai khoan ung vien</Text>
                <Text style={{ color: '#666' }}>{user?.email}</Text>
              </Col>
              <Col>
                <Button danger icon={<LogoutOutlined />} onClick={handleLogout}>Dang xuat</Button>
              </Col>
            </Row>
          </Card>
          <Card>
            <Empty description="Ban chua co ho so ung vien" image={Empty.PRESENTED_IMAGE_SIMPLE}>
              <Button type="primary" onClick={handleCreateResume}>Tao ho so ngay</Button>
            </Empty>
          </Card>
        </div>
      </div>
    );
  }

  const tabItems = [
    {
      key: 'personal',
      label: <span><UserOutlined /> Thong tin ca nhan</span>,
      children: (
        <Card>
          <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Title level={4} style={{ margin: 0 }}>Thong tin ca nhan</Title>
            {!editingPersonal && (
              <Button type="primary" icon={<EditOutlined />} onClick={() => setEditingPersonal(true)}>Chinh sua</Button>
            )}
          </div>
          {editingPersonal ? (
            <Form form={personalForm} layout="vertical" onFinish={handleUpdatePersonal}>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item label="Tieu de" name="tieuDe">
                    <Input size="large" placeholder="VD: Senior Frontend Developer" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="Ngay sinh" name="ngaySinh">
                    <DatePicker size="large" style={{ width: '100%' }} format="DD/MM/YYYY" />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item label="Gioi tinh" name="gioiTinh">
                    <Select size="large" placeholder="Chon gioi tinh">
                      <Select.Option value="Nam">Nam</Select.Option>
                      <Select.Option value="Nu">Nu</Select.Option>
                      <Select.Option value="Khac">Khac</Select.Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="Thanh pho" name="thanhPho">
                    <Input size="large" prefix={<EnvironmentOutlined />} />
                  </Form.Item>
                </Col>
              </Row>
              <Form.Item label="Dia chi" name="diaChi">
                <Input size="large" />
              </Form.Item>
              <Form.Item label="Tom tat" name="tomTat">
                <TextArea rows={4} placeholder="Gioi thieu ngan ve ban than..." />
              </Form.Item>
              <Row gutter={16}>
                <Col span={8}>
                  <Form.Item label="LinkedIn" name="linkedIn">
                    <Input size="large" prefix={<LinkedinOutlined />} placeholder="linkedin.com/in/..." />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="GitHub" name="gitHub">
                    <Input size="large" prefix={<GithubOutlined />} placeholder="github.com/..." />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="Portfolio" name="portfolio">
                    <Input size="large" prefix={<GlobalOutlined />} placeholder="yoursite.com" />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item label="Tinh trang tim viec" name="tinhTrangTimViec">
                    <Select size="large">
                      <Select.Option value="Dang tim viec">Dang tim viec</Select.Option>
                      <Select.Option value="San sang">San sang</Select.Option>
                      <Select.Option value="Khong tim viec">Khong tim viec</Select.Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="Muc luong mong muon (VND)" name="mucLuongMongMuon">
                    <Input size="large" type="number" placeholder="VD: 20000000" />
                  </Form.Item>
                </Col>
              </Row>
              <Space>
                <Button type="primary" htmlType="submit" loading={loading} icon={<SaveOutlined />}>Luu thay doi</Button>
                <Button onClick={() => setEditingPersonal(false)}>Huy</Button>
              </Space>
            </Form>
          ) : (
            <Descriptions column={2} bordered>
              <Descriptions.Item label="Tieu de" span={2}>{hoSo?.tieuDe || 'Chua cap nhat'}</Descriptions.Item>
              <Descriptions.Item label="Ngay sinh">{hoSo?.ngaySinh ? dayjs(hoSo.ngaySinh).format('DD/MM/YYYY') : 'Chua cap nhat'}</Descriptions.Item>
              <Descriptions.Item label="Gioi tinh">{hoSo?.gioiTinh || 'Chua cap nhat'}</Descriptions.Item>
              <Descriptions.Item label="Dia chi">{hoSo?.diaChi || 'Chua cap nhat'}</Descriptions.Item>
              <Descriptions.Item label="Thanh pho">{hoSo?.thanhPho || 'Chua cap nhat'}</Descriptions.Item>
              <Descriptions.Item label="Tom tat" span={2}>{hoSo?.tomTat || 'Chua cap nhat'}</Descriptions.Item>
              <Descriptions.Item label="LinkedIn">{hoSo?.linkedIn ? <a href={hoSo.linkedIn} target="_blank" rel="noopener noreferrer">{hoSo.linkedIn}</a> : 'Chua cap nhat'}</Descriptions.Item>
              <Descriptions.Item label="GitHub">{hoSo?.gitHub ? <a href={hoSo.gitHub} target="_blank" rel="noopener noreferrer">{hoSo.gitHub}</a> : 'Chua cap nhat'}</Descriptions.Item>
              <Descriptions.Item label="Portfolio" span={2}>{hoSo?.portfolio ? <a href={hoSo.portfolio} target="_blank" rel="noopener noreferrer">{hoSo.portfolio}</a> : 'Chua cap nhat'}</Descriptions.Item>
              <Descriptions.Item label="Tinh trang"><Tag color={hoSo?.tinhTrangTimViec === 'Dang tim viec' ? 'green' : 'default'}>{hoSo?.tinhTrangTimViec || 'Chua cap nhat'}</Tag></Descriptions.Item>
              <Descriptions.Item label="Muc luong mong muon">{hoSo?.mucLuongMongMuon ? `${hoSo.mucLuongMongMuon.toLocaleString()} VND` : 'Chua cap nhat'}</Descriptions.Item>
            </Descriptions>
          )}
        </Card>
      ),
    },
    {
      key: 'cv',
      label: <span><FileOutlined /> Quan ly CV</span>,
      children: hoSo ? <CvManager maHoSo={hoSo.maHoSo} /> : <Empty description="Vui long tao ho so truoc" />,
    },
    {
      key: 'education',
      label: <span><BookOutlined /> Hoc van</span>,
      children: <EducationTab />,
    },
    {
      key: 'offers',
      label: <span><MailOutlined /> Thu moi</span>,
      children: <OffersTab />,
    },
        {
      key: 'security',
      label: <span><LockOutlined /> Bao mat</span>,
      children: (
        <Card>
          <Title level={4}>Bao mat tai khoan</Title>
          <Text type="secondary">Quan ly mat khau va cac cai dat bao mat cua ban</Text>
          <Divider />
          <div style={{ marginBottom: 24 }}>
            <Text strong>Mat khau</Text>
            <div style={{ marginTop: 8 }}>
              <Button type="primary" icon={<LockOutlined />} onClick={() => setPasswordModalVisible(true)}>Doi mat khau</Button>
            </div>
          </div>
        </Card>
      ),
    },
  ];

  return (
    <div style={{ minHeight: 'calc(100vh - 64px)', background: '#f5f5f5', padding: '24px 0' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 20px' }}>
        <Card style={{ borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', marginBottom: '24px' }}>
          <Row gutter={24} align="middle">
            <Col>
              <Avatar size={80} icon={<UserOutlined />} style={{ backgroundColor: '#667eea' }} />
            </Col>
            <Col flex="auto">
              <Title level={3} style={{ margin: 0, marginBottom: 4 }}>{user?.hoTen || 'Ung vien'}</Title>
              <Text type="secondary" style={{ display: 'block', marginBottom: 4 }}>{hoSo?.tieuDe || 'Tai khoan ung vien'}</Text>
              <Text style={{ color: '#666' }}>{user?.email}</Text>
            </Col>
            <Col>
              <Button danger icon={<LogoutOutlined />} onClick={handleLogout}>Dang xuat</Button>
            </Col>
          </Row>
        </Card>
        <Card style={{ borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }} loading={loading}>
          <Tabs items={tabItems} />
        </Card>
      </div>

      <Modal
        title="Doi mat khau"
        open={passwordModalVisible}
        onCancel={() => {
          setPasswordModalVisible(false);
          passwordForm.resetFields();
        }}
        footer={null}
      >
        <Form form={passwordForm} layout="vertical" onFinish={handleChangePassword}>
          <Form.Item
            label="Mat khau cu"
            name="matKhauCu"
            rules={[{ required: true, message: 'Vui long nhap mat khau cu' }]}
          >
            <Input.Password size="large" />
          </Form.Item>
          <Form.Item
            label="Mat khau moi"
            name="matKhauMoi"
            rules={[
              { required: true, message: 'Vui long nhap mat khau moi' },
              { min: 6, message: 'Mat khau phai co it nhat 6 ky tu' }
            ]}
          >
            <Input.Password size="large" />
          </Form.Item>
          <Form.Item
            label="Xac nhan mat khau moi"
            name="xacNhanMatKhau"
            dependencies={['matKhauMoi']}
            rules={[
              { required: true, message: 'Vui long xac nhan mat khau moi' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('matKhauMoi') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('Mat khau xac nhan khong khop'));
                },
              }),
            ]}
          >
            <Input.Password size="large" />
          </Form.Item>
          <Form.Item style={{ marginBottom: 0 }}>
            <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
              <Button onClick={() => { setPasswordModalVisible(false); passwordForm.resetFields(); }}>Huy</Button>
              <Button type="primary" htmlType="submit" loading={loading}>Doi mat khau</Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};


const EducationTab = () => {
  const [educations, setEducations] = useState<HocVan[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form] = Form.useForm();
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;

  useEffect(() => {
    if (hoSo) loadEducations();
  }, [hoSo]);

  const loadEducations = async () => {
    if (!hoSo) return;
    setLoading(true);
    try {
      const res = await educationService.getByHoSo(hoSo.maHoSo);
      if (res.success) setEducations(res.data || []);
    } catch (error) {
      message.error('Khong the tai hoc van');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (values: any) => {
    if (!hoSo) return;
    try {
      const data: TaoHocVanDto = {
        maHoSo: hoSo.maHoSo,
        truongHoc: values.truongHoc,
        bangCap: values.bangCap,
        chuyenNganh: values.chuyenNganh,
        diemTrungBinh: values.diemTrungBinh,
        ngayBatDau: values.ngayBatDau ? values.ngayBatDau.format('YYYY-MM-DD') : undefined,
        ngayKetThuc: values.ngayKetThuc ? values.ngayKetThuc.format('YYYY-MM-DD') : undefined,
        dangHocKhong: values.dangHocKhong || false,
      };

      if (editingId) {
        await educationService.update(editingId, data);
        message.success('Cap nhat hoc van thanh cong');
      } else {
        await educationService.create(data);
        message.success('Them hoc van thanh cong');
      }

      setModalVisible(false);
      setEditingId(null);
      form.resetFields();
      loadEducations();
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Thao tac that bai');
    }
  };

  const handleEdit = (edu: HocVan) => {
    setEditingId(edu.maHocVan);
    form.setFieldsValue({
      truongHoc: edu.truongHoc,
      bangCap: edu.bangCap,
      chuyenNganh: edu.chuyenNganh,
      diemTrungBinh: edu.diemTrungBinh,
      ngayBatDau: edu.ngayBatDau ? dayjs(edu.ngayBatDau) : null,
      ngayKetThuc: edu.ngayKetThuc ? dayjs(edu.ngayKetThuc) : null,
      dangHocKhong: edu.dangHocKhong,
    });
    setModalVisible(true);
  };

  const handleDelete = async (maHocVan: number) => {
    try {
      await educationService.delete(maHocVan);
      message.success('Xoa hoc van thanh cong');
      loadEducations();
    } catch (error: any) {
      message.error('Xoa that bai');
    }
  };

  const handleAdd = () => {
    setEditingId(null);
    form.resetFields();
    setModalVisible(true);
  };

  return (
    <Card loading={loading}>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <Title level={4} style={{ margin: 0 }}>Hoc van</Title>
          <Text type="secondary">Qua trinh hoc tap cua ban</Text>
        </div>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>Them hoc van</Button>
      </div>
      <Divider />
      {educations.length === 0 ? (
        <Empty description="Chua co thong tin hoc van" />
      ) : (
        <List
          dataSource={educations}
          renderItem={(edu) => (
            <List.Item
              actions={[
                <Button type="link" icon={<EditOutlined />} onClick={() => handleEdit(edu)}>Sua</Button>,
                <Popconfirm title="Ban co chac muon xoa?" onConfirm={() => handleDelete(edu.maHocVan)}>
                  <Button type="link" danger icon={<DeleteOutlined />}>Xoa</Button>
                </Popconfirm>
              ]}
            >
              <List.Item.Meta
                title={<Text strong>{edu.truongHoc}</Text>}
                description={
                  <div>
                    {edu.bangCap && <div><Text type="secondary">Bang cap: </Text>{edu.bangCap}</div>}
                    {edu.chuyenNganh && <div><Text type="secondary">Chuyen nganh: </Text>{edu.chuyenNganh}</div>}
                    {edu.diemTrungBinh && <div><Text type="secondary">Diem TB: </Text>{edu.diemTrungBinh}</div>}
                    <div>
                      <Text type="secondary">Thoi gian: </Text>
                      {edu.ngayBatDau ? dayjs(edu.ngayBatDau).format('MM/YYYY') : '?'} - {edu.dangHocKhong ? 'Hien tai' : edu.ngayKetThuc ? dayjs(edu.ngayKetThuc).format('MM/YYYY') : '?'}
                    </div>
                  </div>
                }
              />
            </List.Item>
          )}
        />
      )}

      <Modal
        title={editingId ? 'Cap nhat hoc van' : 'Them hoc van'}
        open={modalVisible}
        onCancel={() => { setModalVisible(false); setEditingId(null); form.resetFields(); }}
        footer={null}
        width={600}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item label="Truong hoc" name="truongHoc" rules={[{ required: true, message: 'Vui long nhap ten truong' }]}>
            <Input size="large" placeholder="VD: Dai hoc Bach Khoa Ha Noi" />
          </Form.Item>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Bang cap" name="bangCap">
                <Input size="large" placeholder="VD: Cu nhan" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Chuyen nganh" name="chuyenNganh">
                <Input size="large" placeholder="VD: Cong nghe thong tin" />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item label="Diem trung binh" name="diemTrungBinh">
            <InputNumber size="large" style={{ width: '100%' }} min={0} max={4} step={0.1} placeholder="VD: 3.5" />
          </Form.Item>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Ngay bat dau" name="ngayBatDau">
                <DatePicker size="large" style={{ width: '100%' }} format="MM/YYYY" picker="month" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Ngay ket thuc" name="ngayKetThuc">
                <DatePicker size="large" style={{ width: '100%' }} format="MM/YYYY" picker="month" />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="dangHocKhong" valuePropName="checked">
            <Space>
              <input type="checkbox" />
              <Text>Dang hoc</Text>
            </Space>
          </Form.Item>
          <Form.Item style={{ marginBottom: 0 }}>
            <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
              <Button onClick={() => { setModalVisible(false); setEditingId(null); form.resetFields(); }}>Huy</Button>
              <Button type="primary" htmlType="submit">Luu</Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};


const OffersTab = () => {
  const [offers, setOffers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;

  useEffect(() => {
    if (user) loadOffers();
  }, []);

  const loadOffers = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const res = await offerService.getByUngVien(user.maNguoiDung);
      if (res.success) setOffers(res.data || []);
    } catch (error) {
      message.error('Khong the tai thu moi');
    } finally {
      setLoading(false);
    }
  };

  const handleRespond = async (maThuMoi: number, trangThai: string) => {
    try {
      await offerService.respond(maThuMoi, { trangThai, ghiChu: '' });
      message.success('Phan hoi thanh cong');
      loadOffers();
    } catch (error: any) {
      message.error('Phan hoi that bai');
    }
  };

  return (
    <Card loading={loading}>
      <Title level={4}>Thu moi lam viec</Title>
      <Text type="secondary">Danh sach thu moi lam viec tu cac nha tuyen dung</Text>
      <Divider />
      {offers.length === 0 ? (
        <Empty description="Chua co thu moi nao" />
      ) : (
        offers.map(offer => (
          <Card key={offer.maThuMoi} style={{ marginBottom: 16 }}>
            <Descriptions column={2} bordered>
              <Descriptions.Item label="Cong ty">{offer.tenCongTy || 'N/A'}</Descriptions.Item>
              <Descriptions.Item label="Vi tri">{offer.viTriCongViec}</Descriptions.Item>
              <Descriptions.Item label="Muc luong">{offer.mucLuong.toLocaleString()} {offer.donViTien || 'VND'}</Descriptions.Item>
              <Descriptions.Item label="Ngay bat dau">{offer.ngayBatDauDuKien ? dayjs(offer.ngayBatDauDuKien).format('DD/MM/YYYY') : 'Chua xac dinh'}</Descriptions.Item>
              <Descriptions.Item label="Han phan hoi">{offer.ngayHetHan ? dayjs(offer.ngayHetHan).format('DD/MM/YYYY') : 'Khong gioi han'}</Descriptions.Item>
              <Descriptions.Item label="Trang thai">
                <Tag color={offer.trangThai === 'ChoDongY' ? 'blue' : offer.trangThai === 'DaDongY' ? 'green' : 'red'}>
                  {offer.trangThai === 'ChoDongY' ? 'Cho dong y' : offer.trangThai === 'DaDongY' ? 'Da dong y' : 'Tu choi'}
                </Tag>
              </Descriptions.Item>
              {offer.ghiChu && <Descriptions.Item label="Ghi chu" span={2}>{offer.ghiChu}</Descriptions.Item>}
            </Descriptions>
            {offer.trangThai === 'ChoDongY' && (
              <Space style={{ marginTop: 16 }}>
                <Button type="primary" onClick={() => handleRespond(offer.maThuMoi, 'DaDongY')}>Chap nhan</Button>
                <Button danger onClick={() => handleRespond(offer.maThuMoi, 'TuChoi')}>Tu choi</Button>
              </Space>
            )}
          </Card>
        ))
      )}
    </Card>
  );
};

export default CandidateProfile;


