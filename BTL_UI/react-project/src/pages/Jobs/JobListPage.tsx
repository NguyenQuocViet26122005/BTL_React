import { useEffect, useMemo, useState } from 'react';
import { Row, Col, Card, Input, Button, Typography, Tag, Space, Pagination, Spin, Radio, Checkbox, Divider, Empty, message } from 'antd';
import { SearchOutlined, EnvironmentOutlined, DollarOutlined, ClockCircleOutlined, FilterOutlined, ReloadOutlined } from '@ant-design/icons';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { jobService } from '../../services/jobService';
import filterService from '../../services/filterService';
import type { DanhMucDto } from '../../services/filterService';
import type { TinTuyenDung } from '../../types';
import dayjs from 'dayjs';
import PageContainer from '../../components/Layout/PageContainer';

const { Title, Text, Paragraph } = Typography;
const { Search } = Input;

const EXPERIENCE_OPTIONS = ['Khong yeu cau', 'Duoi 1 nam', '1 nam', '2 nam', '3 nam', 'Tren 3 nam'] as const;
const WORK_TYPE_OPTIONS = ['Toan thoi gian', 'Ban thoi gian', 'Thuc tap'] as const;
const SALARY_OPTIONS = [
  { value: 'under10', label: 'Duoi 10 trieu' },
  { value: '10-15', label: '10-15 trieu' },
  { value: '15-20', label: '15-20 trieu' },
  { value: '20-30', label: '20-30 trieu' },
  { value: 'over30', label: 'Tren 30 trieu' },
] as const;

interface JobFilters {
  danhMuc: number[];
  kinhNghiem: string;
  hinhThucLamViec: string;
  mucLuong: string[];
}

const PAGE_SIZE = 9;

const JobListPage = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [jobs, setJobs] = useState<TinTuyenDung[]>([]);
  const [loading, setLoading] = useState(false);
  const [filterLoading, setFilterLoading] = useState(true);
  const [danhMucs, setDanhMucs] = useState<DanhMucDto[]>([]);
  const [searchInput, setSearchInput] = useState(searchParams.get('search') ?? '');

  const filters = useMemo<JobFilters>(() => ({
    danhMuc: searchParams.getAll('danhMuc').map(Number).filter(Number.isFinite),
    kinhNghiem: searchParams.get('kinhNghiem') ?? 'all',
    hinhThucLamViec: searchParams.get('hinhThucLamViec') ?? 'all',
    mucLuong: searchParams.getAll('mucLuong'),
  }), [searchParams]);

  const currentPage = Math.max(Number(searchParams.get('page') ?? '1') || 1, 1);
  const searchText = searchParams.get('search') ?? '';

  useEffect(() => {
    setSearchInput(searchText);
  }, [searchText]);

  useEffect(() => {
    loadFilterData();
  }, []);

  useEffect(() => {
    fetchJobs();
  }, [searchParams]);

  const loadFilterData = async () => {
    try {
      setFilterLoading(true);
      const danhMucData = await filterService.getAllDanhMuc();
      setDanhMucs(danhMucData);
    } catch {
      message.error('Khong the tai du lieu bo loc');
    } finally {
      setFilterLoading(false);
    }
  };

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const hasFilters = Boolean(
        searchText ||
        filters.danhMuc.length ||
        filters.kinhNghiem !== 'all' ||
        filters.hinhThucLamViec !== 'all' ||
        filters.mucLuong.length
      );

      const response = hasFilters
        ? await jobService.filterJobs({
            search: searchText || undefined,
            danhMuc: filters.danhMuc.length ? filters.danhMuc : undefined,
            kinhNghiem: filters.kinhNghiem !== 'all' ? filters.kinhNghiem : undefined,
            hinhThucLamViec: filters.hinhThucLamViec !== 'all' ? filters.hinhThucLamViec : undefined,
            mucLuong: filters.mucLuong.length ? filters.mucLuong : undefined,
          })
        : await jobService.getAllJobs();

      if (response.success && response.data) {
        setJobs(response.data);
      } else {
        setJobs([]);
      }
    } catch {
      message.error('Khong the tai danh sach viec lam');
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  const updateParams = (updater: (params: URLSearchParams) => void) => {
    const params = new URLSearchParams(searchParams);
    updater(params);
    if (!params.get('page')) params.delete('page');
    setSearchParams(params);
  };

  const handleFilterChange = (nextFilters: JobFilters) => {
    updateParams((params) => {
      params.delete('danhMuc');
      nextFilters.danhMuc.forEach((id) => params.append('danhMuc', id.toString()));

      if (nextFilters.kinhNghiem !== 'all') params.set('kinhNghiem', nextFilters.kinhNghiem);
      else params.delete('kinhNghiem');

      if (nextFilters.hinhThucLamViec !== 'all') params.set('hinhThucLamViec', nextFilters.hinhThucLamViec);
      else params.delete('hinhThucLamViec');

      params.delete('mucLuong');
      nextFilters.mucLuong.forEach((value) => params.append('mucLuong', value));
      params.delete('page');
    });
  };

  const handleSearch = (value: string) => {
    const query = value.trim();
    updateParams((params) => {
      if (query) params.set('search', query);
      else params.delete('search');
      params.delete('page');
    });
  };

  const handleReset = () => {
    setSearchInput('');
    setSearchParams(new URLSearchParams());
  };

  const paginatedJobs = jobs.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const formatSalary = (min?: number, max?: number) => {
    if (!min && !max) return 'Thoa thuan';
    if (min && max) return `${(min / 1000000).toFixed(0)}-${(max / 1000000).toFixed(0)} trieu`;
    if (min) return `Tu ${(min / 1000000).toFixed(0)} trieu`;
    return 'Thoa thuan';
  };

  return (
    <PageContainer>
      <Row gutter={[20, 20]}>
        <Col xs={24} lg={6}>
          <div style={{ background: '#fff', border: '1px solid #f0f0f0', borderRadius: '8px', padding: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <Space>
                <FilterOutlined />
                <Text strong>Bo loc</Text>
              </Space>
              <Button type="link" size="small" icon={<ReloadOutlined />} onClick={handleReset} style={{ padding: 0 }}>
                Dat lai
              </Button>
            </div>

            {filterLoading ? (
              <div style={{ textAlign: 'center', padding: '20px' }}><Spin /></div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <Text strong style={{ display: 'block', marginBottom: '8px' }}>Danh muc nghe</Text>
                  <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                    {danhMucs.map((dm) => (
                      <div key={dm.maDanhMuc} style={{ marginBottom: '6px' }}>
                        <Checkbox
                          checked={filters.danhMuc.includes(dm.maDanhMuc)}
                          onChange={(e) => {
                            const nextDanhMuc = e.target.checked
                              ? [...filters.danhMuc, dm.maDanhMuc]
                              : filters.danhMuc.filter((id) => id !== dm.maDanhMuc);
                            handleFilterChange({ ...filters, danhMuc: nextDanhMuc });
                          }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', width: '180px' }}>
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
                  <Radio.Group value={filters.kinhNghiem} onChange={(e) => handleFilterChange({ ...filters, kinhNghiem: e.target.value })} style={{ width: '100%' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <Radio value="all">Tat ca</Radio>
                      {EXPERIENCE_OPTIONS.map((value) => <Radio key={value} value={value}>{value}</Radio>)}
                    </div>
                  </Radio.Group>
                </div>

                <Divider style={{ margin: '8px 0' }} />

                <div>
                  <Text strong style={{ display: 'block', marginBottom: '8px' }}>Hinh thuc lam viec</Text>
                  <Radio.Group value={filters.hinhThucLamViec} onChange={(e) => handleFilterChange({ ...filters, hinhThucLamViec: e.target.value })} style={{ width: '100%' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <Radio value="all">Tat ca</Radio>
                      {WORK_TYPE_OPTIONS.map((value) => <Radio key={value} value={value}>{value}</Radio>)}
                    </div>
                  </Radio.Group>
                </div>

                <Divider style={{ margin: '8px 0' }} />

                <div>
                  <Text strong style={{ display: 'block', marginBottom: '8px' }}>Muc luong</Text>
                  <Checkbox.Group value={filters.mucLuong} onChange={(values) => handleFilterChange({ ...filters, mucLuong: values as string[] })} style={{ width: '100%' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      {SALARY_OPTIONS.map((option) => <Checkbox key={option.value} value={option.value}>{option.label}</Checkbox>)}
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
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onSearch={handleSearch}
              style={{ marginBottom: '16px' }}
            />
            <Text type="secondary">Tim thay {jobs.length} viec lam</Text>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '100px 0' }}><Spin size="large" /></div>
          ) : jobs.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 0' }}>
              <Empty description="Khong tim thay viec lam phu hop" />
            </div>
          ) : (
            <>
              <Row gutter={[16, 16]} style={{ marginTop: '20px' }}>
                {paginatedJobs.map((job) => (
                  <Col xs={24} sm={12} lg={8} key={job.maTin}>
                    <Card hoverable onClick={() => navigate(`/jobs/${job.maTin}`)} style={{ height: '100%' }}>
                      <Space direction="vertical" style={{ width: '100%' }} size="small">
                        <Title level={5} style={{ margin: 0, minHeight: '48px' }}>{job.tieuDe}</Title>
                        <Text type="secondary" strong>{job.tenCongTy || 'Cong ty'}</Text>
                        <Space wrap>
                          <Tag icon={<EnvironmentOutlined />} color="blue">{job.thanhPho}</Tag>
                          <Tag icon={<DollarOutlined />} color="green">{formatSalary(job.mucLuongToiThieu, job.mucLuongToiDa)}</Tag>
                        </Space>
                        <Paragraph ellipsis={{ rows: 2 }} style={{ margin: '8px 0', minHeight: '44px' }}>{job.moTa}</Paragraph>
                        <Space style={{ marginTop: 'auto' }}>
                          <ClockCircleOutlined />
                          <Text type="secondary" style={{ fontSize: '12px' }}>Han nop: {dayjs(job.hanNopHoSo).format('DD/MM/YYYY')}</Text>
                        </Space>
                      </Space>
                    </Card>
                  </Col>
                ))}
              </Row>

              {jobs.length > PAGE_SIZE && (
                <div style={{ textAlign: 'center', marginTop: '40px' }}>
                  <Pagination
                    current={currentPage}
                    total={jobs.length}
                    pageSize={PAGE_SIZE}
                    showSizeChanger={false}
                    onChange={(page) => updateParams((params) => {
                      if (page > 1) params.set('page', page.toString());
                      else params.delete('page');
                    })}
                  />
                </div>
              )}
            </>
          )}
        </Col>
      </Row>
    </PageContainer>
  );
};

export default JobListPage;
