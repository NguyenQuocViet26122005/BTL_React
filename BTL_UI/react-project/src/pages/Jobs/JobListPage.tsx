import { useState, useEffect, useCallback } from 'react';
import { Row, Col, Card, Input, Button, Typography, Tag, Space, Pagination, Spin, Radio, Checkbox, Divider } from 'antd';
import { SearchOutlined, EnvironmentOutlined, DollarOutlined, ClockCircleOutlined, FilterOutlined, ReloadOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { jobService } from '../../services/jobService';
import filterService from '../../services/filterService';
import { eventBus, EVENTS } from '../../utils/eventBus';
import type { DanhMucDto } from '../../services/filterService';
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

interface JobFilters {
  danhMuc: number[];
  kinhNghiem: string;
  hinhThucLamViec: string;
  mucLuong: string[];
}

const JobListPage = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 9;

  const [filters, setFilters] = useState<JobFilters>({
    danhMuc: [],
    kinhNghiem: 'all',
    hinhThucLamViec: 'all',
    mucLuong: []
  });

  const [danhMucs, setDanhMucs] = useState<DanhMucDto[]>([]);
  const [filterLoading, setFilterLoading] = useState(true);

  useEffect(() => {
    fetchJobs();
    loadFilterData();

    // Listen for job events
    const handleJobChange = () => {
      fetchJobs();
      loadFilterData();
    };

    eventBus.on(EVENTS.JOB_CREATED, handleJobChange);
    eventBus.on(EVENTS.JOB_UPDATED, handleJobChange);
    eventBus.on(EVENTS.JOB_DELETED, handleJobChange);

    return () => {
      eventBus.off(EVENTS.JOB_CREATED, handleJobChange);
      eventBus.off(EVENTS.JOB_UPDATED, handleJobChange);
      eventBus.off(EVENTS.JOB_DELETED, handleJobChange);
    };
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

  const loadFilterData = async () => {
    try {
      setFilterLoading(true);
      const danhMucData = await filterService.getAllDanhMuc();
      setDanhMucs(danhMucData);
    } catch (error) {
      console.error('Loi khi tai du lieu filter:', error);
    } finally {
      setFilterLoading(false);
    }
  };

  const applyFilters = useCallback(async (newFilters: JobFilters, search: string) => {
    setLoading(true);
    setCurrentPage(1);
    try {
      const salaryRanges: { [key: string]: { min?: number; max?: number } } = {
        'under10': { max: 10000000 },
        '10-15': { min: 10000000, max: 15000000 },
        '15-20': { min: 15000000, max: 20000000 },
        '20-30': { min: 20000000, max: 30000000 },
        'over30': { min: 30000000 }
      };

      let mucLuongMin: number | undefined;
      let mucLuongMax: number | undefined;

      if (newFilters.mucLuong.length > 0) {
        const ranges = newFilters.mucLuong.map(key => salaryRanges[key]).filter(Boolean);
        if (ranges.length > 0) {
          const mins = ranges.map(r => r.min || 0).filter(v => v > 0);
          const maxs = ranges.map(r => r.max || Infinity).filter(v => v < Infinity);
          if (mins.length > 0) mucLuongMin = Math.min(...mins);
          if (maxs.length > 0) mucLuongMax = Math.max(...maxs);
        }
      }

      const response = await jobService.filterJobs({
        search: search || undefined,
        danhMuc: newFilters.danhMuc.length > 0 ? newFilters.danhMuc : undefined,
        kinhNghiem: newFilters.kinhNghiem !== 'all' ? newFilters.kinhNghiem : undefined,
        hinhThucLamViec: newFilters.hinhThucLamViec !== 'all' ? newFilters.hinhThucLamViec : undefined,
        mucLuongMin,
        mucLuongMax
      });

      if (response.success && response.data) {
        setJobs(response.data);
      }
    } catch (error) {
      console.error('Error filtering jobs:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleFilterChange = (newFilters: JobFilters) => {
    setFilters(newFilters);
    applyFilters(newFilters, searchText);
  };

  const handleSearchChange = (value: string) => {
    setSearchText(value);
    applyFilters(filters, value);
  };

  const handleReset = () => {
    const resetFilters = {
      danhMuc: [],
      kinhNghiem: 'all',
      hinhThucLamViec: 'all',
      mucLuong: []
    };
    setFilters(resetFilters);
    setSearchText('');
    fetchJobs();
  };

  const paginatedJobs = jobs.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const formatSalary = (min?: number, max?: number) => {
    if (!min && !max) return 'Thoa thuan';
    if (min && max) return `${(min / 1000000).toFixed(0)}-${(max / 1000000).toFixed(0)} trieu`;
    if (min) return `Tu ${(min / 1000000).toFixed(0)} trieu`;
    return 'Thoa thuan';
  };

  return (
    <div style={{ background: '#fff', minHeight: 'calc(100vh - 64px)' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
        <Row gutter={[20, 20]}>
          <Col xs={24} lg={6}>
            <div style={{ 
              background: '#fff', 
              border: '1px solid #f0f0f0',
              borderRadius: '8px',
              padding: '16px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <Space>
                  <FilterOutlined />
                  <Text strong>Bo loc</Text>
                </Space>
                <Button 
                  type="link" 
                  size="small" 
                  icon={<ReloadOutlined />}
                  onClick={handleReset}
                  style={{ padding: 0 }}
                >
                  Dat lai
                </Button>
              </div>

              {filterLoading ? (
                <div style={{ textAlign: 'center', padding: '20px' }}>
                  <Spin />
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  
                  <div>
                    <Text strong style={{ display: 'block', marginBottom: '8px' }}>Danh muc nghe</Text>
                    <div style={{ maxHeight: '250px', overflowY: 'auto' }}>
                      {danhMucs.slice(0, 10).map(dm => (
                        <div key={dm.maDanhMuc} style={{ marginBottom: '6px' }}>
                          <Checkbox
                            checked={filters.danhMuc.includes(dm.maDanhMuc)}
                            onChange={(e) => {
                              const newDanhMuc = e.target.checked
                                ? [...filters.danhMuc, dm.maDanhMuc]
                                : filters.danhMuc.filter(id => id !== dm.maDanhMuc);
                              handleFilterChange({...filters, danhMuc: newDanhMuc});
                            }}
                          >
                            <div style={{ display: 'flex', justifyContent: 'space-between', width: '160px' }}>
                              <Text ellipsis style={{ flex: 1, fontSize: '13px' }}>{dm.tenDanhMuc}</Text>
                              <Text type="secondary" style={{ fontSize: '12px' }}>({dm.soLuongTin})</Text>
                            </div>
                          </Checkbox>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Divider style={{ margin: '8px 0' }} />

                  <div>
                    <Text strong style={{ display: 'block', marginBottom: '8px' }}>Kinh nghiem</Text>
                    <Radio.Group 
                      value={filters.kinhNghiem}
                      onChange={(e) => handleFilterChange({...filters, kinhNghiem: e.target.value})}
                      style={{ width: '100%' }}
                    >
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <Radio value="all">Tat ca</Radio>
                        <Radio value="Khong yeu cau">Khong yeu cau</Radio>
                        <Radio value="Duoi 1 nam">Duoi 1 nam</Radio>
                        <Radio value="1 nam">1 nam</Radio>
                        <Radio value="2 nam">2 nam</Radio>
                        <Radio value="3 nam">3 nam</Radio>
                        <Radio value="Tren 3 nam">Tren 3 nam</Radio>
                      </div>
                    </Radio.Group>
                  </div>

                  <Divider style={{ margin: '8px 0' }} />

                  <div>
                    <Text strong style={{ display: 'block', marginBottom: '8px' }}>Hinh thuc lam viec</Text>
                    <Radio.Group 
                      value={filters.hinhThucLamViec}
                      onChange={(e) => handleFilterChange({...filters, hinhThucLamViec: e.target.value})}
                      style={{ width: '100%' }}
                    >
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <Radio value="all">Tat ca</Radio>
                        <Radio value="Toan thoi gian">Toan thoi gian</Radio>
                        <Radio value="Ban thoi gian">Ban thoi gian</Radio>
                        <Radio value="Thuc tap">Thuc tap</Radio>
                      </div>
                    </Radio.Group>
                  </div>

                  <Divider style={{ margin: '8px 0' }} />

                  <div>
                    <Text strong style={{ display: 'block', marginBottom: '8px' }}>Muc luong</Text>
                    <Checkbox.Group
                      value={filters.mucLuong}
                      onChange={(values) => handleFilterChange({...filters, mucLuong: values as string[]})}
                      style={{ width: '100%' }}
                    >
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <Checkbox value="under10">Duoi 10 trieu</Checkbox>
                        <Checkbox value="10-15">10-15 trieu</Checkbox>
                        <Checkbox value="15-20">15-20 trieu</Checkbox>
                        <Checkbox value="20-30">20-30 trieu</Checkbox>
                        <Checkbox value="over30">Tren 30 trieu</Checkbox>
                      </div>
                    </Checkbox.Group>
                  </div>
                </div>
              )}
            </div>
          </Col>

          <Col xs={24} lg={18}>
            <div>
              <Title level={2} style={{ marginBottom: '16px' }}>Tim Viec Lam</Title>
              <Search
                placeholder="Tim kiem theo vi tri, cong ty, dia diem..."
                size="large"
                enterButton={<Button type="primary" icon={<SearchOutlined />}>Tim kiem</Button>}
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                onSearch={handleSearchChange}
                style={{ marginBottom: '16px' }}
              />
              <Text type="secondary">
                Tim thay {jobs.length} viec lam
              </Text>
            </div>

            {loading ? (
              <div style={{ textAlign: 'center', padding: '100px 0' }}>
                <Spin size="large" />
              </div>
            ) : (
              <>
                <Row gutter={[16, 16]} style={{ marginTop: '20px' }}>
                  {paginatedJobs.map((job) => (
                    <Col xs={24} sm={12} lg={8} key={job.maTin}>
                      <Card
                        hoverable
                        onClick={() => navigate(`/jobs/${job.maTin}`)}
                        style={{ height: '100%' }}
                      >
                        <Space direction="vertical" style={{ width: '100%' }} size="small">
                          <Title level={5} style={{ margin: 0, minHeight: '48px' }}>
                            {job.tieuDe}
                          </Title>
                          
                          <Text type="secondary" strong>
                            {job.tenCongTy || 'Cong ty'}
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
                              Han nop: {dayjs(job.hanNopHoSo).format('DD/MM/YYYY')}
                            </Text>
                          </Space>
                        </Space>
                      </Card>
                    </Col>
                  ))}
                </Row>

                {jobs.length > pageSize && (
                  <div style={{ textAlign: 'center', marginTop: '40px' }}>
                    <Pagination
                      current={currentPage}
                      total={jobs.length}
                      pageSize={pageSize}
                      onChange={(page) => setCurrentPage(page)}
                      showSizeChanger={false}
                    />
                  </div>
                )}

                {jobs.length === 0 && (
                  <div style={{ textAlign: 'center', padding: '60px 0' }}>
                    <Title level={4}>Khong tim thay viec lam phu hop</Title>
                    <Text type="secondary">Thu tim kiem voi tu khoa khac</Text>
                  </div>
                )}
              </>
            )}
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default JobListPage;