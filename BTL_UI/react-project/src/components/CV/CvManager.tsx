import { useState, useEffect } from 'react';
import { Card, Upload, Button, List, message, Popconfirm, Tag, Space } from 'antd';
import { UploadOutlined, FileOutlined, DeleteOutlined, StarOutlined, StarFilled, DownloadOutlined } from '@ant-design/icons';
import type { UploadProps } from 'antd';
import cvService, { type FileCv } from '../../services/cvService';
import dayjs from 'dayjs';
import { getFileUrl } from '../../services/api';

interface CvManagerProps {
  maHoSo: number;
  onCvChange?: () => void;
}

const CvManager = ({ maHoSo, onCvChange }: CvManagerProps) => {
  const [cvList, setCvList] = useState<FileCv[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (maHoSo) {
      loadCvList();
    }
  }, [maHoSo]);

  const loadCvList = async () => {
    setLoading(true);
    try {
      const res = await cvService.getCvByHoSo(maHoSo);
      if (res.success && res.data) {
        setCvList(res.data);
      }
    } catch (error) {
      console.error('Error loading CV list:', error);
    } finally {
      setLoading(false);
    }
  };

  const uploadProps: UploadProps = {
    name: 'file',
    accept: '.pdf,.doc,.docx',
    beforeUpload: async (file) => {
      const isPDF = file.type === 'application/pdf';
      const isDoc = file.type === 'application/msword';
      const isDocx = file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
      
      if (!isPDF && !isDoc && !isDocx) {
        message.error('Chỉ chấp nhận file PDF, DOC, DOCX!');
        return Upload.LIST_IGNORE;
      }

      const isLt5M = file.size / 1024 / 1024 < 5;
      if (!isLt5M) {
        message.error('File phải nhỏ hơn 5MB!');
        return Upload.LIST_IGNORE;
      }

      setUploading(true);
      try {
        const laMacDinh = cvList.length === 0;
        const res = await cvService.uploadCv(maHoSo, file, laMacDinh);
        if (res.success) {
          message.success('Tải CV thành công!');
          loadCvList();
          onCvChange?.();
        }
      } catch (error: any) {
        message.error(error.response?.data?.message || 'Tải CV thất bại!');
      } finally {
        setUploading(false);
      }

      return false;
    },
    showUploadList: false
  };

  const handleSetDefault = async (maFileCv: number) => {
    try {
      const res = await cvService.setDefaultCv(maFileCv, maHoSo);
      if (res.success) {
        message.success('Đặt CV mặc định thành công!');
        loadCvList();
        onCvChange?.();
      }
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Đặt mặc định thất bại!');
    }
  };

  const handleDelete = async (maFileCv: number) => {
    try {
      const res = await cvService.deleteCv(maFileCv);
      if (res.success) {
        message.success('Xóa CV thành công!');
        loadCvList();
        onCvChange?.();
      }
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Xóa CV thất bại!');
    }
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return 'N/A';
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  const getFileIcon = (loaiFile?: string) => {
    if (loaiFile === '.pdf') return 'PDF';
    if (loaiFile === '.doc' || loaiFile === '.docx') return 'DOC';
    return 'FILE';
  };

  return (
    <Card title="Quản lý CV" loading={loading}>
      <Upload {...uploadProps}>
        <Button icon={<UploadOutlined />} loading={uploading} type="primary" style={{ marginBottom: 16 }}>
          Tải lên CV mới
        </Button>
      </Upload>

      <p style={{ color: '#666', fontSize: 12, marginBottom: 16 }}>
        Chỉ chấp nhận file PDF, DOC, DOCX. Kích thước tối đa 5MB.
      </p>

      {cvList.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px 0', color: '#999' }}>
          <FileOutlined style={{ fontSize: 48, marginBottom: 16 }} />
          <p>Chưa có CV nào. Hãy tải lên CV đầu tiên của bạn!</p>
        </div>
      ) : (
        <List
          dataSource={cvList}
          renderItem={(cv) => (
            <List.Item
              actions={[
                cv.laMacDinh ? (
                  <Tag color="gold" icon={<StarFilled />}>Mặc định</Tag>
                ) : (
                  <Button
                    type="link"
                    size="small"
                    icon={<StarOutlined />}
                    onClick={() => handleSetDefault(cv.maFileCv)}
                  >
                    Đặt mặc định
                  </Button>
                ),
                <Button
                  type="link"
                  size="small"
                  icon={<DownloadOutlined />}
                  href={getFileUrl(cv.duongDanFile)}
                  target="_blank"
                >
                  Tải xuống
                </Button>,
                <Popconfirm
                  title="Xóa CV"
                  description="Bạn có chắc chắn muốn xóa CV này?"
                  onConfirm={() => handleDelete(cv.maFileCv)}
                  okText="Xóa"
                  cancelText="Hủy"
                >
                  <Button type="link" size="small" danger icon={<DeleteOutlined />}>
                    Xóa
                  </Button>
                </Popconfirm>
              ]}
            >
              <List.Item.Meta
                avatar={<span style={{ fontSize: 24, fontWeight: 'bold' }}>{getFileIcon(cv.loaiFile)}</span>}
                title={
                  <Space>
                    {cv.tenFile}
                    {cv.laMacDinh && <Tag color="gold">Mặc định</Tag>}
                  </Space>
                }
                description={
                  <div>
                    <div>Kích thước: {formatFileSize(cv.kichThuoc)}</div>
                    <div>Ngay tai: {dayjs(cv.ngayTai).format('DD/MM/YYYY HH:mm')}</div>
                  </div>
                }
              />
            </List.Item>
          )}
        />
      )}
    </Card>
  );
};

export default CvManager;