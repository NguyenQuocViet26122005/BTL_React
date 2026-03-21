import { useState, useEffect } from 'react';
import { Row, Col, Card, Input, Button, Typography, Tag, Space, Pagination, Spin } from 'antd';
import { SearchOutlined, EnvironmentOutlined, DollarOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { jobService } from '../../services/jobService';
import dayjs from 'dayjs';

const { Title, Text, Paragraph } = Typography;
const { Search } = Input;

interface Job {
  maTin: number;
  maCongTy: number;
  tenCongTy?: string;
  tieuDe: string;
  moTa: string;
  mucLuongToiThieu?: number;
  mucLuongToiDa?: number;
  thanhPho: string;
  hanNopHoSo: string;
}

const JobListPage = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 9;

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const response = await jobService.getAllJobs();
      if (response.success && response.data) {
        setJobs(response.data);
      }
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredJobs = jobs.filter(job =>
    job.tieuDe.toLowerCase().includes(searchText.toLowerCase()) ||
    job.thanhPho?.toLowerCase().includes(searchText.toLowerCase())
  );

  const paginatedJobs = filteredJobs.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const formatSalary = (min?: number, max?: number) => {
    if (!min && !max) return 'Thỏa thuận';
    if (min && max) return `${(min / 1000000).toFixed(0)}-${(max / 1000000).toFixed(0)} triệu`;
    if (min) return `Từ ${(min / 1000000).toFixed(0)} triệu`;
    return 'Thỏa thuận';
  };

  return (
    <div style={{ padding: '40px 20px', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: '30px' }}>
        <Title level={2}>Tìm Việc Làm</Title>
        <Search
          placeholder="Tìm kiếm theo vị trí, công ty, địa điểm..."
          size="large"
          enterButton={<Button type="primary" icon={<SearchOutlined />}>Tìm kiếm</Button>}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          style={{ maxWidth: '600px' }}
        />
      </div>

      {/* Results count */}
      <div style={{ marginBottom: '20px' }}>
        <Text type="secondary">
          Tìm thấy {filteredJobs.length} việc làm
        </Text>
      </div>

      {/* Job List */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 0' }}>
          <Spin size="large" />
        </div>
      ) : (
        <>
          <Row gutter={[16, 16]}>
            {paginatedJobs.map((job) => (
              <Col xs={24} sm={12} lg={8} key={job.maTin}>
                <Card
                  hoverable
                  onClick={() => navigate(`/jobs/${job.maTin}`)}
                  style={{ height: '100%', display: 'flex', flexDirection: 'column' }}
                >
                  <Space direction="vertical" style={{ width: '100%' }} size="small">
                    <Title level={5} style={{ margin: 0, minHeight: '48px' }}>
                      {job.tieuDe}
                    </Title>
                    
                    <Text type="secondary" strong>
                      {job.tenCongTy || 'Công ty'}
                    </Text>

                    <Space wrap>
                      <Tag icon={<EnvironmentOutlined />} color="blue">
                        {job.thanhPho}
                      </Tag>
                      <Tag icon={<DollarOutlined />} color="green">
                        {formatSalary(job.mucLuongToiThieu, job.mucLuongToiDa)}
                      </Tag>
                    </Space>

                    <Paragraph 
                      ellipsis={{ rows: 2 }} 
                      style={{ margin: '8px 0', minHeight: '44px' }}
                    >
                      {job.moTa}
                    </Paragraph>

                    <Space style={{ marginTop: 'auto' }}>
                      <ClockCircleOutlined />
                      <Text type="secondary" style={{ fontSize: '12px' }}>
                        Hạn nộp: {dayjs(job.hanNopHoSo).format('DD/MM/YYYY')}
                      </Text>
                    </Space>
                  </Space>
                </Card>
              </Col>
            ))}
          </Row>

          {/* Pagination */}
          {filteredJobs.length > pageSize && (
            <div style={{ textAlign: 'center', marginTop: '40px' }}>
              <Pagination
                current={currentPage}
                total={filteredJobs.length}
                pageSize={pageSize}
                onChange={(page) => setCurrentPage(page)}
                showSizeChanger={false}
              />
            </div>
          )}

          {/* Empty state */}
          {filteredJobs.length === 0 && (
            <div style={{ textAlign: 'center', padding: '60px 0' }}>
              <Title level={4}>Không tìm thấy việc làm phù hợp</Title>
              <Text type="secondary">Thử tìm kiếm với từ khóa khác</Text>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default JobListPage;
