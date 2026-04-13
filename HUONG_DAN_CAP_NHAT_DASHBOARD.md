# Hướng dẫn cập nhật CompanyDashboard để sử dụng API thực

## Đã hoàn thành:
✅ RecruiterProfile.tsx - Trang profile nhà tuyển dụng
✅ App.tsx - Đã thêm route `/recruiter/profile`

## Cần cập nhật CompanyDashboard.tsx:

### 1. Thêm imports (sau dòng import jobService):
```typescript
import { getDashboardStats, getLichPhongVanSapToi } from '../../services/dashboardService';
import type { DashboardStats, LichPhongVanSapToi } from '../../types';
```

### 2. Thêm icon CalendarOutlined vào import icons:
```typescript
import { ..., CalendarOutlined } from '@ant-design/icons';
```

### 3. Thêm List vào import antd:
```typescript
import { ..., List } from 'antd';
```

### 4. Thêm states (sau dòng `const [jobs, setJobs] = ...`):
```typescript
const [stats, setStats] = useState<DashboardStats | null>(null);
const [upcomingInterviews, setUpcomingInterviews] = useState<LichPhongVanSapToi[]>([]);
```

### 5. Thay thế hàm `fetchJobs` bằng `fetchDashboardData`:
```typescript
const fetchDashboardData = async (maNguoiDung: number) => {
  try {
    setLoading(true);
    const [jobsRes, statsRes, interviewsRes] = await Promise.all([
      getTinTuyenDungByUser(maNguoiDung),
      getDashboardStats(maNguoiDung),
      getLichPhongVanSapToi(maNguoiDung, 7)
    ]);
    
    if (jobsRes.success && jobsRes.data) {
      setJobs(jobsRes.data);
    }
    if (statsRes.success && statsRes.data) {
      setStats(statsRes.data);
    }
    if (interviewsRes.success && interviewsRes.data) {
      setUpcomingInterviews(interviewsRes.data);
    }
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
  } finally {
    setLoading(false);
  }
};

const fetchJobs = async (maNguoiDung: number) => {
  fetchDashboardData(maNguoiDung);
};
```

### 6. Cập nhật useEffect:
```typescript
useEffect(() => {
  const userStr = localStorage.getItem('user');
  if (userStr) {
    const userData = JSON.parse(userStr);
    setUser(userData);
    fetchDashboardData(userData.maNguoiDung); // Thay fetchJobs bằng fetchDashboardData
  }
}, []);
```

### 7. Thay thế phần stats (xóa object stats cũ và thay bằng):
```typescript
// Xóa dòng này:
// const stats = { totalJobs: ..., activeJobs: ..., ... };

// Stats sẽ lấy từ API qua state
```

### 8. Cập nhật Statistic cards để dùng stats từ API:
```typescript
<Statistic
  title="Tong tin tuyen dung"
  value={stats?.tongTinDang || 0}
  prefix={<FileTextOutlined />}
/>

<Statistic
  title="Tin dang tuyen"
  value={stats?.tinDangTuyen || 0}
  prefix={<FileTextOutlined />}
/>

<Statistic
  title="Tong don ung tuyen"
  value={stats?.tongDonUngTuyen || 0}
  prefix={<UserOutlined />}
/>

<Statistic
  title="Don moi"
  value={stats?.donMoi || 0}
  prefix={<EyeOutlined />}
/>
```

### 9. Thêm card lịch phỏng vấn (sau Card tin tuyển dụng):
```typescript
<Row gutter={[16, 16]} style={{ marginTop: 24 }}>
  <Col xs={24} lg={8}>
    <Card 
      title={
        <span>
          <CalendarOutlined style={{ marginRight: 8 }} />
          Lich phong van sap toi
        </span>
      }
    >
      <List
        dataSource={upcomingInterviews}
        loading={loading}
        locale={{ emptyText: 'Khong co lich phong van' }}
        renderItem={(item) => (
          <List.Item>
            <List.Item.Meta
              title={item.tenUngVien}
              description={
                <>
                  <div>{item.viTriUngTuyen}</div>
                  <div style={{ fontSize: '12px', color: '#999' }}>
                    {dayjs(item.thoiGian).format('DD/MM/YYYY HH:mm')}
                  </div>
                  <Tag color={item.hinhThuc === 'Online' ? 'blue' : 'green'}>
                    {item.hinhThuc}
                  </Tag>
                </>
              }
            />
          </List.Item>
        )}
      />
    </Card>
  </Col>
</Row>
```

## Tóm tắt:
- Dashboard giờ sẽ hiển thị thống kê thực từ backend
- Hiển thị lịch phỏng vấn sắp tới
- Tất cả data được load song song để tăng performance

## Test:
1. Chạy backend: `dotnet run` trong thư mục BTL_CNW
2. Chạy frontend: `npm run dev` trong thư mục BTL_UI/react-project
3. Đăng nhập với tài khoản nhà tuyển dụng
4. Truy cập `/company/dashboard` để xem dashboard
5. Truy cập `/recruiter/profile` để xem profile
