import { useEffect, useState } from 'react';
import { Card, Form, Input, Button, DatePicker, Select, InputNumber, message, Spin, Row, Col, Divider } from 'antd';
import { SaveOutlined, UserOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { resumeService } from '../../services/resumeService';
import dayjs from 'dayjs';

const { TextArea } = Input;

// Reusable component for CV form
export const CandidateResumeContent = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [hasResume, setHasResume] = useState(false);
  const [resumeId, setResumeId] = useState<number | null>(null);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const userData = JSON.parse(userStr);
      setUser(userData);
      fetchResume(userData.maNguoiDung);
    } else {
      message.error('Vui long dang nhap!');
      navigate('/login');
    }
  }, [navigate]);

  const fetchResume = async (maNguoiDung: number) => {
    try {
      setLoading(true);
      const response = await resumeService.getMyResume(maNguoiDung);

      if (response.success && response.data) {
        setHasResume(true);
        setResumeId(response.data.maHoSo);

        form.setFieldsValue({
          hoTen: response.data.hoTen,
          email: response.data.email,
          soDienThoai: response.data.soDienThoai,
          tieuDe: response.data.tieuDe,
          tomTat: response.data.tomTat,
          ngaySinh: response.data.ngaySinh ? dayjs(response.data.ngaySinh) : null,
          gioiTinh: response.data.gioiTinh,
          diaChi: response.data.diaChi,
          thanhPho: response.data.thanhPho,
          linkedIn: response.data.linkedIn,
          gitHub: response.data.gitHub,
          portfolio: response.data.portfolio,
          tinhTrangTimViec: response.data.tinhTrangTimViec,
          mucLuongMongMuon: response.data.mucLuongMongMuon
        });
      } else {
        setHasResume(false);
        form.setFieldsValue({
          hoTen: user?.hoTen || '',
          email: user?.email || ''
        });
      }
    } catch (error: any) {
      console.log('No resume found, creating new');
      setHasResume(false);
      if (user) {
        form.setFieldsValue({
          hoTen: user.hoTen || '',
          email: user.email || ''
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (values: any) => {
    try {
      setSubmitting(true);

      const resumeData = {
        maNguoiDung: user.maNguoiDung,
        hoTen: values.hoTen,
        email: values.email,
        soDienThoai: values.soDienThoai,
        tieuDe: values.tieuDe,
        tomTat: values.tomTat,
        ngaySinh: values.ngaySinh ? values.ngaySinh.format('YYYY-MM-DD') : null,
        gioiTinh: values.gioiTinh,
        diaChi: values.diaChi,
        thanhPho: values.thanhPho,
        linkedIn: values.linkedIn,
        gitHub: values.gitHub,
        portfolio: values.portfolio,
        tinhTrangTimViec: values.tinhTrangTimViec || 'SanSang',
        mucLuongMongMuon: values.mucLuongMongMuon
      };

      if (hasResume && resumeId) {
        await resumeService.updateResume(resumeId, resumeData);
        message.success('Cap nhat ho so thanh cong!');
      } else {
        await resumeService.createResume(resumeData);
        message.success('Tao ho so thanh cong!');
        fetchResume(user.maNguoiDung);
      }
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Co loi xay ra!');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleSubmit}
    >
      <Divider>Thong tin ca nhan</Divider>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="hoTen"
            label="Ho va ten"
            rules={[{ required: true, message: 'Vui long nhap ho ten!' }]}
          >
            <Input placeholder="Nguyen Van A" />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Vui long nhap email!' },
              { type: 'email', message: 'Email khong hop le!' }
            ]}
          >
            <Input placeholder="email@example.com" />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="soDienThoai"
            label="So dien thoai"
            rules={[{ required: true, message: 'Vui long nhap so dien thoai!' }]}
          >
            <Input placeholder="0123456789" />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="ngaySinh"
            label="Ngay sinh"
            rules={[{ required: true, message: 'Vui long chon ngay sinh!' }]}
          >
            <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" placeholder="Chon ngay sinh" />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="gioiTinh"
            label="Gioi tinh"
          >
            <Select placeholder="Chon gioi tinh">
              <Select.Option value="Nam">Nam</Select.Option>
              <Select.Option value="Nu">Nu</Select.Option>
              <Select.Option value="Khac">Khac</Select.Option>
            </Select>
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="thanhPho"
            label="Thanh pho"
          >
            <Input placeholder="Ha Noi" />
          </Form.Item>
        </Col>
      </Row>

      <Form.Item
        name="diaChi"
        label="Dia chi"
      >
        <Input placeholder="123 Nguyen Trai, Thanh Xuan" />
      </Form.Item>

      <Divider>Thong tin nghe nghiep</Divider>

      <Form.Item
        name="tieuDe"
        label="Tieu de / Vi tri mong muon"
        rules={[{ required: true, message: 'Vui long nhap tieu de!' }]}
      >
        <Input placeholder="VD: Frontend Developer" />
      </Form.Item>

      <Form.Item
        name="tomTat"
        label="Gioi thieu ban than"
        rules={[{ required: true, message: 'Vui long nhap gioi thieu!' }]}
      >
        <TextArea
          rows={4}
          placeholder="Gioi thieu ve ban than, kinh nghiem, ky nang..."
        />
      </Form.Item>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="tinhTrangTimViec"
            label="Tinh trang tim viec"
          >
            <Select placeholder="Chon tinh trang">
              <Select.Option value="SanSang">San sang</Select.Option>
              <Select.Option value="TimKiem">Dang tim kiem</Select.Option>
              <Select.Option value="MoXem">Mo xem co hoi</Select.Option>
              <Select.Option value="KhongTimKiem">Khong tim kiem</Select.Option>
            </Select>
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="mucLuongMongMuon"
            label="Muc luong mong muon (VND)"
          >
            <InputNumber
              style={{ width: '100%' }}
              min={0}
              step={1000000}
              formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              placeholder="VD: 15000000"
            />
          </Form.Item>
        </Col>
      </Row>

      <Divider>Lien ket mang xa hoi</Divider>

      <Form.Item
        name="linkedIn"
        label="LinkedIn"
      >
        <Input placeholder="https://linkedin.com/in/username" />
      </Form.Item>

      <Form.Item
        name="gitHub"
        label="GitHub"
      >
        <Input placeholder="https://github.com/username" />
      </Form.Item>

      <Form.Item
        name="portfolio"
        label="Portfolio / Website"
      >
        <Input placeholder="https://yourportfolio.com" />
      </Form.Item>

      <Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          icon={<SaveOutlined />}
          size="large"
          block
          loading={submitting}
        >
          {hasResume ? 'Cap nhat ho so' : 'Tao ho so'}
        </Button>
      </Form.Item>
    </Form>
  );
};

// Page wrapper component
const CandidateResumePage = () => {
  return (
    <div style={{ padding: '24px', maxWidth: 1000, margin: '0 auto' }}>
      <Card
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <UserOutlined />
            <span>Ho so ung vien</span>
          </div>
        }
      >
        <CandidateResumeContent />
      </Card>
    </div>
  );
};

export default CandidateResumePage;
