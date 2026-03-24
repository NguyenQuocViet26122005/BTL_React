import { useState, useEffect } from 'react';
import { Row, Col, Card, Radio, Checkbox, Select, Spin, Typography, Space, Button } from 'antd';
import { FilterOutlined, ReloadOutlined } from '@ant-design/icons';
import filterService from '../../services/filterService';
import type { DanhMucDto, LinhVucDto } from '../../services/filterService';

const { Title, Text } = Typography;

interface JobFilters {
  nghiThu7: string;
  danhMuc: number[];
  kinhNghiem: string;
  hinhThucLamViec: string;
  linhVucCongTy: number[];
  mucLuong: string[];
  capBac: string[];
}

const JobFilterPage = () => {
  const [filters, setFilters] = useState<JobFilters>({
    nghiThu7: 'all',
    danhMuc: [],
    kinhNghiem: 'all',
    hinhThucLamViec: 'all',
    linhVucCongTy: [],
    mucLuong: [],
    capBac: []
  });

  const [danhMucs, setDanhMucs] = useState<DanhMucDto[]>([]);
  const [linhVucs, setLinhVucs] = useState<LinhVucDto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFilterData();
  }, []);

  const loadFilterData = async () => {
    try {
      setLoading(true);
      const [danhMucData, linhVucData] = await Promise.all([
        filterService.getAllDanhMuc(),
        filterService.getAllLinhVuc()
      ]);
      setDanhMucs(danhMucData);
      setLinhVucs(linhVucData);
    } catch (error) {
      console.error('Loi khi tai du lieu filter:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFilters({
      nghiThu7: 'all',
      danhMuc: [],
      kinhNghiem: 'all',
      hinhThucLamViec: 'all',
      linhVucCongTy: [],
      mucLuong: [],
      capBac: []
    });
  };

  const handleApplyFilters = () => {
    console.log('Ap dung bo loc:', filters);
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '100px 0' }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', background: '#f0f2f5', minHeight: '100vh' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <Row gutter={[24, 24]}>
          <Col xs={24} lg={6}>
            <Card 
              title={
                <Space>
                  <FilterOutlined />
                  <span>Bo loc tim kiem</span>
                </Space>
              }
              extra={
                <Button 
                  type="link" 
                  size="small" 
                  icon={<ReloadOutlined />}
                  onClick={handleReset}
                >
                  Dat lai
                </Button>
              }
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                
                <div>
                  <Title level={5}>Nghi thu 7</Title>
                  <Radio.Group 
                    value={filters.nghiThu7}
                    onChange={(e) => setFilters({...filters, nghiThu7: e.target.value})}
                    style={{ width: '100%' }}
                  >
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <Radio value="all">Khong loc</Radio>
                      <Radio value="working">Lam thu 7</Radio>
                      <Radio value="off">Nghi thu 7</Radio>
                      <Radio value="not_mentioned">Tin dang khong de cap</Radio>
                    </div>
                  </Radio.Group>
                </div>

                <div>
                  <Title level={5}>Loc theo danh muc nghe</Title>
                  <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                    {danhMucs.slice(0, 10).map(dm => (
                      <div key={dm.maDanhMuc} style={{ marginBottom: '8px' }}>
                        <Checkbox
                          checked={filters.danhMuc.includes(dm.maDanhMuc)}
                          onChange={(e) => {
                            const newDanhMuc = e.target.checked
                              ? [...filters.danhMuc, dm.maDanhMuc]
                              : filters.danhMuc.filter(id => id !== dm.maDanhMuc);
                            setFilters({...filters, danhMuc: newDanhMuc});
                          }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', width: '200px' }}>
                            <Text ellipsis style={{ flex: 1 }}>{dm.tenDanhMuc}</Text>
                            <Text type="secondary">({dm.soLuongTin})</Text>
                          </div>
                        </Checkbox>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <Title level={5}>Kinh nghiem</Title>
                  <Radio.Group 
                    value={filters.kinhNghiem}
                    onChange={(e) => setFilters({...filters, kinhNghiem: e.target.value})}
                    style={{ width: '100%' }}
                  >
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <Radio value="all">Tat ca</Radio>
                      <Radio value="none">Khong yeu cau</Radio>
                      <Radio value="under1">Duoi 1 nam</Radio>
                      <Radio value="1">1 nam</Radio>
                      <Radio value="2">2 nam</Radio>
                      <Radio value="3">3 nam</Radio>
                      <Radio value="4">4 nam</Radio>
                      <Radio value="5">5 nam</Radio>
                      <Radio value="over5">Tren 5 nam</Radio>
                    </div>
                  </Radio.Group>
                </div>

                <div>
                  <Title level={5}>Hinh thuc lam viec</Title>
                  <Radio.Group 
                    value={filters.hinhThucLamViec}
                    onChange={(e) => setFilters({...filters, hinhThucLamViec: e.target.value})}
                    style={{ width: '100%' }}
                  >
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <Radio value="all">Tat ca</Radio>
                      <Radio value="fulltime">Toan thoi gian</Radio>
                      <Radio value="parttime">Ban thoi gian</Radio>
                      <Radio value="intern">Thuc tap</Radio>
                      <Radio value="other">Khac</Radio>
                    </div>
                  </Radio.Group>
                </div>

                <div>
                  <Title level={5}>Linh vuc cong ty</Title>
                  <Select
                    mode="multiple"
                    placeholder="Tat ca linh vuc"
                    style={{ width: '100%' }}
                    value={filters.linhVucCongTy}
                    onChange={(value) => setFilters({...filters, linhVucCongTy: value})}
                    options={linhVucs.map(lv => ({
                      label: lv.tenLinhVuc,
                      value: lv.maLinhVuc
                    }))}
                  />
                </div>

                <div>
                  <Title level={5}>Muc luong</Title>
                  <Checkbox.Group
                    value={filters.mucLuong}
                    onChange={(values) => setFilters({...filters, mucLuong: values as string[]})}
                    style={{ width: '100%' }}
                  >
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <Checkbox value="under10">Duoi 10 trieu</Checkbox>
                      <Checkbox value="10-15">10 - 15 trieu</Checkbox>
                      <Checkbox value="15-20">15 - 20 trieu</Checkbox>
                      <Checkbox value="20-25">20 - 25 trieu</Checkbox>
                      <Checkbox value="25-30">25 - 30 trieu</Checkbox>
                      <Checkbox value="30-50">30 - 50 trieu</Checkbox>
                      <Checkbox value="over50">Tren 50 trieu</Checkbox>
                      <Checkbox value="negotiate">Thoa thuan</Checkbox>
                    </div>
                  </Checkbox.Group>
                </div>

                <div>
                  <Title level={5}>Cap bac</Title>
                  <Checkbox.Group
                    value={filters.capBac}
                    onChange={(values) => setFilters({...filters, capBac: values as string[]})}
                    style={{ width: '100%' }}
                  >
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <Checkbox value="nhanvien">Nhan vien</Checkbox>
                      <Checkbox value="truongnhom">Truong nhom</Checkbox>
                      <Checkbox value="truongphong">Truong/Pho phong</Checkbox>
                      <Checkbox value="quanly">Quan ly / Giam sat</Checkbox>
                      <Checkbox value="giamdoc">Giam doc</Checkbox>
                      <Checkbox value="thuctap">Thuc tap sinh</Checkbox>
                    </div>
                  </Checkbox.Group>
                </div>

                <Button 
                  type="primary" 
                  block 
                  size="large"
                  onClick={handleApplyFilters}
                >
                  Ap dung bo loc
                </Button>
              </div>
            </Card>
          </Col>

          <Col xs={24} lg={18}>
            <Card title="Ket qua tim kiem">
              <div style={{ textAlign: 'center', padding: '60px 0' }}>
                <Text type="secondary">Danh sach viec lam se hien thi o day</Text>
              </div>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default JobFilterPage;