import { useState, useEffect } from 'react';
import { Card, Table, Button, Modal, Form, Input, DatePicker, Select, InputNumber, message, Tag, Space } from 'antd';
import { PlusOutlined, CalendarOutlined, ClockCircleOutlined, EnvironmentOutlined, FormOutlined } from '@ant-design/icons';
import { interviewService } from '../../services/interviewService';
import type { LichPhongVan, TaoLichDto } from '../../services/interviewService';
import { applicationService } from '../../services/applicationService';
import { interviewResultService } from '../../services/interviewResultService';
import type { TaoKetQuaDto } from '../../services/interviewResultService';
import dayjs from 'dayjs';

const { TextArea } = Input;

const InterviewSchedulePage = () => {
  const [interviews, setInterviews] = useState<LichPhongVan[]>([]);
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [resultModalVisible, setResultModalVisible] = useState(false);
  const [selectedInterview, setSelectedInterview] = useState<LichPhongVan | null>(null);
  const [form] = Form.useForm();
  const [resultForm] = Form.useForm();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const userData = JSON.parse(userStr);
      setUser(userData);
      if (user) loadApplications(user.maNguoiDung);
    }
  }, []);

  const loadApplications = async (maNguoiDung: number) => {
    setLoading(true);
    try {
      const res = await applicationService.getCompanyApplications(maNguoiDung);
      if (res.success && res.data) {
        setApplications(res.data);
        loadAllInterviews(res.data);
      }
    } catch (error) {
      console.error('Error loading applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadAllInterviews = async (apps: any[]) => {
    try {
      const allInterviews: LichPhongVan[] = [];
      for (const app of apps) {
        const res = await interviewService.getByApplication(app.maDon);
        if (res.success && res.data) {
          const interviewsWithInfo = res.data.map((interview: LichPhongVan) => ({
            ...interview,
            tenUngVien: app.tenUngVien,
            emailUngVien: app.emailUngVien,
            viTriUngTuyen: app.tieuDeTin
          }));
          allInterviews.push(...interviewsWithInfo);
        }
      }
      setInterviews(allInterviews);
    } catch (error) {
      console.error('Error loading interviews:', error);
    }
  };

  const handleCreateInterview = async (values: any) => {
    if (!user) return;
    setLoading(true);
    try {
      const data: TaoLichDto = {
        maDon: values.maDon,
        maNguoiLich: user.maNguoiDung,
        vongPhongVan: values.vongPhongVan || 1,
        hinhThuc: values.hinhThuc,
        thoiGian: values.thoiGian.format('YYYY-MM-DDTHH:mm:ss'),
        thoiLuongPhut: values.thoiLuongPhut,
        diaDiem: values.diaDiem,
        ghiChu: values.ghiChu
      };
      await interviewService.createInterview(data);
      message.success('Tao lich phong van thanh cong');
      setModalVisible(false);
      form.resetFields();
      if (user) loadApplications(user.maNguoiDung);
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Tao lich that bai');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (maLich: number, trangThai: string) => {
    try {
      await interviewService.updateStatus(maLich, trangThai);
      message.success('Cap nhat trang thai thanh cong');
      if (user) loadApplications(user.maNguoiDung);
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Cap nhat that bai');
    }
  };

  const handleOpenResultModal = (interview: LichPhongVan) => {
    setSelectedInterview(interview);
    setResultModalVisible(true);
  };

  const handleSubmitResult = async (values: any) => {
    if (!selectedInterview) return;
    setLoading(true);
    try {
      const data: TaoKetQuaDto = {
        maLich: selectedInterview.maLich,
        diemTongQuat: values.diemTongQuat,
        diemKyThuat: values.diemKyThuat,
        diemKyNangMem: values.diemKyNangMem,
        ketQua: values.ketQua,
        nhanXet: values.nhanXet
      };
      await interviewResultService.create(data);
      message.success('Nhap ket qua phong van thanh cong');
      setResultModalVisible(false);
      resultForm.resetFields();
      setSelectedInterview(null);
      if (user) loadApplications(user.maNguoiDung);
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Nhap ket qua that bai');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    const colors: any = {
      'ChuaPhongVan': 'blue',
      'DaPhongVan': 'green',
      'HuyBo': 'red',
      'DoiLich': 'orange'
    };
    return colors[status] || 'default';
  };

  const getStatusText = (status: string) => {
    const texts: any = {
      'ChuaPhongVan': 'Chua phong van',
      'DaPhongVan': 'Da phong van',
      'HuyBo': 'Huy bo',
      'DoiLich': 'Doi lich'
    };
    return texts[status] || status;
  };

  const columns = [
    {
      title: 'Ung vien',
      dataIndex: 'tenUngVien',
      key: 'tenUngVien',
      render: (text: string, record: LichPhongVan) => (
        <div>
          <div style={{ fontWeight: 500 }}>{text}</div>
          <div style={{ fontSize: 12, color: '#666' }}>{record.emailUngVien}</div>
        </div>
      )
    },
    {
      title: 'Vi tri',
      dataIndex: 'viTriUngTuyen',
      key: 'viTriUngTuyen'
    },
    {
      title: 'Vong',
      dataIndex: 'vongPhongVan',
      key: 'vongPhongVan',
      render: (vong: number) => `Vong ${vong}`
    },
    {
      title: 'Thoi gian',
      dataIndex: 'thoiGian',
      key: 'thoiGian',
      render: (time: string, record: LichPhongVan) => (
        <div>
          <div><CalendarOutlined /> {dayjs(time).format('DD/MM/YYYY')}</div>
          <div><ClockCircleOutlined /> {dayjs(time).format('HH:mm')} ({record.thoiLuongPhut || 60} phut)</div>
        </div>
      )
    },
    {
      title: 'Hinh thuc',
      dataIndex: 'hinhThuc',
      key: 'hinhThuc',
      render: (hinhThuc: string, record: LichPhongVan) => (
        <div>
          <div>{hinhThuc}</div>
          {record.diaDiem && (
            <div style={{ fontSize: 12, color: '#666' }}>
              <EnvironmentOutlined /> {record.diaDiem}
            </div>
          )}
        </div>
      )
    },
    {
      title: 'Trang thai',
      dataIndex: 'trangThai',
      key: 'trangThai',
      render: (status: string) => (
        <Tag color={getStatusColor(status)}>{getStatusText(status)}</Tag>
      )
    },
    {
      title: 'Thao tac',
      key: 'action',
      render: (_: any, record: LichPhongVan) => (
        <Space>
          {record.trangThai === 'ChuaPhongVan' && (
            <>
              <Button size="small" onClick={() => handleUpdateStatus(record.maLich, 'DaPhongVan')}>
                Hoan thanh
              </Button>
              <Button size="small" danger onClick={() => handleUpdateStatus(record.maLich, 'HuyBo')}>
                Huy
              </Button>
            </>
          )}
          {record.trangThai === 'DaPhongVan' && (
            <Button 
              size="small" 
              type="primary" 
              icon={<FormOutlined />}
              onClick={() => handleOpenResultModal(record)}
            >
              Nhap ket qua
            </Button>
          )}
        </Space>
      )
    }
  ];

  return (
    <div style={{ padding: 24 }}>
      <Card
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <CalendarOutlined />
            <span>Quan ly lich phong van</span>
          </div>
        }
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={() => setModalVisible(true)}>
            Tao lich phong van
          </Button>
        }
      >
        <Table
          columns={columns}
          dataSource={interviews}
          rowKey="maLich"
          loading={loading}
          pagination={{ pageSize: 10 }}
        />
      </Card>

      <Modal
        title="Nhap ket qua phong van"
        open={resultModalVisible}
        onCancel={() => {
          setResultModalVisible(false);
          resultForm.resetFields();
          setSelectedInterview(null);
        }}
        footer={null}
        width={600}
      >
        <Form form={resultForm} layout="vertical" onFinish={handleSubmitResult}>
          {selectedInterview && (
            <div style={{ marginBottom: 16, padding: 12, background: '#f5f5f5', borderRadius: 4 }}>
              <div><strong>Ung vien:</strong> {selectedInterview.tenUngVien}</div>
              <div><strong>Vi tri:</strong> {selectedInterview.viTriUngTuyen}</div>
              <div><strong>Thoi gian:</strong> {dayjs(selectedInterview.thoiGian).format('DD/MM/YYYY HH:mm')}</div>
            </div>
          )}

          <Form.Item
            name="diemTongQuat"
            label="Diem tong quat (0-100)"
            rules={[{ required: true, message: 'Vui long nhap diem tong quat' }]}
          >
            <InputNumber min={0} max={100} style={{ width: '100%' }} placeholder="Nhap diem tong quat" />
          </Form.Item>

          <Form.Item
            name="diemKyThuat"
            label="Diem ky thuat (0-100)"
            rules={[{ required: true, message: 'Vui long nhap diem ky thuat' }]}
          >
            <InputNumber min={0} max={100} style={{ width: '100%' }} placeholder="Nhap diem ky thuat" />
          </Form.Item>

          <Form.Item
            name="diemKyNangMem"
            label="Diem ky nang mem (0-100)"
            rules={[{ required: true, message: 'Vui long nhap diem ky nang mem' }]}
          >
            <InputNumber min={0} max={100} style={{ width: '100%' }} placeholder="Nhap diem ky nang mem" />
          </Form.Item>

          <Form.Item
            name="ketQua"
            label="Ket qua"
            rules={[{ required: true, message: 'Vui long chon ket qua' }]}
          >
            <Select placeholder="Chon ket qua">
              <Select.Option value="Dat">Dat</Select.Option>
              <Select.Option value="KhongDat">Khong dat</Select.Option>
              <Select.Option value="CanXemXet">Can xem xet</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item name="nhanXet" label="Nhan xet">
            <TextArea rows={4} placeholder="Nhap nhan xet ve ung vien..." />
          </Form.Item>

          <Form.Item style={{ marginBottom: 0 }}>
            <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
              <Button onClick={() => { setResultModalVisible(false); resultForm.resetFields(); setSelectedInterview(null); }}>
                Huy
              </Button>
              <Button type="primary" htmlType="submit" loading={loading}>
                Luu ket qua
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Tao lich phong van"
        open={modalVisible}
        onCancel={() => {
          setModalVisible(false);
          form.resetFields();
        }}
        footer={null}
        width={600}
      >
        <Form form={form} layout="vertical" onFinish={handleCreateInterview}>
          <Form.Item
            name="maDon"
            label="Don ung tuyen"
            rules={[{ required: true, message: 'Vui long chon don ung tuyen' }]}
          >
            <Select placeholder="Chon don ung tuyen" showSearch optionFilterProp="children">
              {applications.map(app => (
                <Select.Option key={app.maDon} value={app.maDon}>
                  {app.tenUngVien} - {app.tieuDeTin}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name="vongPhongVan" label="Vong phong van" initialValue={1}>
            <InputNumber min={1} max={5} style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            name="hinhThuc"
            label="Hinh thuc"
            rules={[{ required: true, message: 'Vui long chon hinh thuc' }]}
            initialValue="Online"
          >
            <Select>
              <Select.Option value="Online">Online</Select.Option>
              <Select.Option value="Truc tiep">Truc tiep</Select.Option>
              <Select.Option value="Dien thoai">Dien thoai</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="thoiGian"
            label="Thoi gian"
            rules={[{ required: true, message: 'Vui long chon thoi gian' }]}
          >
            <DatePicker
              showTime
              format="DD/MM/YYYY HH:mm"
              style={{ width: '100%' }}
              placeholder="Chon ngay gio phong van"
            />
          </Form.Item>

          <Form.Item name="thoiLuongPhut" label="Thoi luong (phut)" initialValue={60}>
            <InputNumber min={15} max={240} step={15} style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item name="diaDiem" label="Dia diem">
            <Input placeholder="VD: Phong hop A, Tang 3 hoac link Zoom" />
          </Form.Item>

          <Form.Item name="ghiChu" label="Ghi chu">
            <TextArea rows={3} placeholder="Ghi chu them ve lich phong van..." />
          </Form.Item>

          <Form.Item style={{ marginBottom: 0 }}>
            <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
              <Button onClick={() => { setModalVisible(false); form.resetFields(); }}>
                Huy
              </Button>
              <Button type="primary" htmlType="submit" loading={loading}>
                Tao lich
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default InterviewSchedulePage;