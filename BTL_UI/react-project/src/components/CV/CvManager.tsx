import { useState, useEffect } from 'react';
import { Card, Upload, Button, List, message, Popconfirm, Tag, Space } from 'antd';
import { UploadOutlined, FileOutlined, DeleteOutlined, StarOutlined, StarFilled, DownloadOutlined } from '@ant-design/icons';
import type { UploadProps } from 'antd';
import cvService, { type FileCv } from '../../services/cvService';
import dayjs from 'dayjs';

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
        message.error('Chi chap nhan file PDF, DOC, DOCX!');
        return Upload.LIST_IGNORE;
      }

      const isLt5M = file.size / 1024 / 1024 < 5;
      if (!isLt5M) {
        message.error('File phai nho hon 5MB!');
        return Upload.LIST_IGNORE;
      }

      setUploading(true);
      try {
        const laMacDinh = cvList.length === 0;
        const res = await cvService.uploadCv(maHoSo, file, laMacDinh);
        if (res.success) {
          message.success('Tai CV thanh cong!');
          loadCvList();
          onCvChange?.();
        }
      } catch (error: any) {
        message.error(error.response?.data?.message || 'Tai CV that bai!');
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
        message.success('Dat CV mac dinh thanh cong!');
        loadCvList();
        onCvChange?.();
      }
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Dat mac dinh that bai!');
    }
  };

  const handleDelete = async (maFileCv: number) => {
    try {
      const res = await cvService.deleteCv(maFileCv);
      if (res.success) {
        message.success('Xoa CV thanh cong!');
        loadCvList();
        onCvChange?.();
      }
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Xoa CV that bai!');
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
    <Card title="Quan ly CV" loading={loading}>
      <Upload {...uploadProps}>
        <Button icon={<UploadOutlined />} loading={uploading} type="primary" style={{ marginBottom: 16 }}>
          Tai len CV moi
        </Button>
      </Upload>

      <p style={{ color: '#666', fontSize: 12, marginBottom: 16 }}>
        Chi chap nhan file PDF, DOC, DOCX. Kich thuoc toi da 5MB.
      </p>

      {cvList.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px 0', color: '#999' }}>
          <FileOutlined style={{ fontSize: 48, marginBottom: 16 }} />
          <p>Chua co CV nao. Hay tai len CV dau tien cua ban!</p>
        </div>
      ) : (
        <List
          dataSource={cvList}
          renderItem={(cv) => (
            <List.Item
              actions={[
                cv.laMacDinh ? (
                  <Tag color="gold" icon={<StarFilled />}>Mac dinh</Tag>
                ) : (
                  <Button
                    type="link"
                    size="small"
                    icon={<StarOutlined />}
                    onClick={() => handleSetDefault(cv.maFileCv)}
                  >
                    Dat mac dinh
                  </Button>
                ),
                <Button
                  type="link"
                  size="small"
                  icon={<DownloadOutlined />}
                  href={`https://localhost:44314${cv.duongDanFile}`}
                  target="_blank"
                >
                  Tai xuong
                </Button>,
                <Popconfirm
                  title="Xoa CV"
                  description="Ban co chac chan muon xoa CV nay?"
                  onConfirm={() => handleDelete(cv.maFileCv)}
                  okText="Xoa"
                  cancelText="Huy"
                >
                  <Button type="link" size="small" danger icon={<DeleteOutlined />}>
                    Xoa
                  </Button>
                </Popconfirm>
              ]}
            >
              <List.Item.Meta
                avatar={<span style={{ fontSize: 24, fontWeight: 'bold' }}>{getFileIcon(cv.loaiFile)}</span>}
                title={
                  <Space>
                    {cv.tenFile}
                    {cv.laMacDinh && <Tag color="gold">Mac dinh</Tag>}
                  </Space>
                }
                description={
                  <div>
                    <div>Kich thuoc: {formatFileSize(cv.kichThuoc)}</div>
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