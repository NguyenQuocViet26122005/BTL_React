# BÁO CÁO HỆ THỐNG QUẢN LÝ VIỆC LÀM

## 1. Tổng quan đề tài

Hệ thống quản lý việc làm là website hỗ trợ kết nối ứng viên và nhà tuyển dụng. Ứng viên có thể tìm kiếm việc làm, tạo hồ sơ, tải CV, nộp đơn và theo dõi quá trình tuyển dụng. Nhà tuyển dụng có thể quản lý công ty, đăng tin tuyển dụng, xem hồ sơ ứng viên, xử lý đơn ứng tuyển, lên lịch phỏng vấn, ghi kết quả và gửi thư mời làm việc. Quản trị viên có chức năng kiểm duyệt tin tuyển dụng.

Hệ thống được xây dựng theo mô hình frontend React kết nối backend ASP.NET Core Web API, dữ liệu lưu trữ trong SQL Server thông qua Entity Framework Core.

## 2. Công nghệ sử dụng

### Backend

- ASP.NET Core 8 Web API.
- Entity Framework Core 8.
- SQL Server.
- JWT Bearer Authentication.
- Swagger/OpenAPI.
- Mô hình phân lớp Controller → BLL/Service → DAL/Repository → Database.

### Frontend

- React 19.
- TypeScript.
- Vite.
- Ant Design.
- Axios.
- React Router DOM.

## 3. Kiến trúc hệ thống

```text
React UI
  ↓ Axios + JWT
ASP.NET Core Web API
  ↓ BLL/Service
DAL/Repository
  ↓ Entity Framework Core
SQL Server
```

### Cấu trúc backend

```text
BTL_CNW/
├── Controllers/        API endpoints
├── BLL/                xử lý nghiệp vụ
├── DAL/                truy cập dữ liệu
├── DTO/                dữ liệu truyền qua API
├── Models/             entity EF Core
├── Services/           JWT service
├── Attributes/         phân quyền vai trò
└── wwwroot/uploads/    lưu file CV
```

### Cấu trúc frontend

```text
BTL_UI/react-project/
├── src/pages/          các màn hình nghiệp vụ
├── src/components/     layout, auth, CV, notification
├── src/services/       gọi API backend
├── src/types/          TypeScript types
└── src/utils/          helper auth, status, event bus
```

## 4. Đối tượng sử dụng

| Đối tượng | Mô tả |
|---|---|
| Khách | Xem trang chủ, danh sách việc làm, chi tiết việc làm, đăng ký/đăng nhập |
| Ứng viên | Quản lý hồ sơ/CV, lưu tin, nộp đơn, xem lịch phỏng vấn, nhận thư mời |
| Nhà tuyển dụng | Quản lý công ty, đăng tin, xử lý đơn, phỏng vấn, gửi thư mời, xem thống kê |
| Admin | Kiểm duyệt tin tuyển dụng |

## 5. Phân quyền và xác thực

Hệ thống dùng JWT để xác thực. Sau khi đăng nhập thành công, backend trả về token. Frontend lưu token trong `localStorage` và Axios tự động gắn token vào header:

```text
Authorization: Bearer <token>
```

Frontend dùng `ProtectedRoute` để bảo vệ các route theo vai trò:

- Admin.
- Candidate.
- Company.

Backend cấu hình JWT Bearer Authentication trong `Program.cs` và có custom attribute hỗ trợ phân quyền.

## 6. Cơ sở dữ liệu

Các bảng/entity chính:

| Nhóm | Bảng/entity |
|---|---|
| Người dùng | `NguoiDung`, `VaiTro` |
| Công ty | `CongTy`, `LinhVuc` |
| Việc làm | `TinTuyenDung`, `DanhMucViecLam`, `KyNang`, `TinDaLuu` |
| Hồ sơ ứng viên | `HoSoUngVien`, `HocVan`, `KinhNghiemLamViec`, `KyNangUngVien`, `FileCV` |
| Tuyển dụng | `DonUngTuyen`, `LichPhongVan`, `KetQuaPhongVan`, `ThuMoiLamViec` |
| Hỗ trợ | `ThongBao`, `GoiYViecLam`, `NhatKyXemCV` |
| Thống kê | `v_PipelineTuyenDung`, `v_ThongKeTinCongTy` |

Một số ràng buộc nghiệp vụ trong DB:

- Email người dùng là duy nhất.
- Mã số thuế công ty là duy nhất.
- Một ứng viên chỉ có một hồ sơ ứng viên.
- Một ứng viên không được nộp trùng một tin tuyển dụng.
- Một lịch phỏng vấn chỉ có một kết quả.
- Một đơn ứng tuyển chỉ có một thư mời làm việc.

## 7. Các chức năng chính

### 7.1 Đăng ký, đăng nhập và phân quyền

Mục tiêu: cho phép người dùng tạo tài khoản, đăng nhập và sử dụng hệ thống theo vai trò.

API:

- `POST /api/auth/dang-ky`
- `POST /api/auth/dang-nhap`
- `GET /api/auth/me`

Frontend:

- `/login`
- `/register`
- `ProtectedRoute`

Dữ liệu liên quan:

- `NguoiDung`
- `VaiTro`

Kết quả:

- Người dùng đăng nhập thành công nhận JWT.
- Route được bảo vệ theo vai trò ứng viên, công ty, admin.

### 7.2 Quản lý hồ sơ ứng viên và CV

Mục tiêu: ứng viên tạo hồ sơ nghề nghiệp, cập nhật thông tin cá nhân, học vấn, kinh nghiệm, kỹ năng và tải CV.

API:

- `POST /api/ho-so`
- `GET /api/ho-so/cua-toi/{maNguoiDung}`
- `GET /api/ho-so/{maHoSo}`
- `GET /api/ho-so/tim-kiem`
- `GET /api/ho-so/danh-sach`
- `PUT /api/ho-so/{maHoSo}`
- `POST /api/ho-so/{maHoSo}/cv/upload`
- `GET /api/ho-so/{maHoSo}/cv`
- `GET /api/ho-so/cv/{maFileCv}`
- `GET /api/hoc-van/ho-so/{maHoSo}`
- `POST /api/hoc-van`
- `PUT /api/hoc-van/{maHocVan}`
- `DELETE /api/hoc-van/{maHocVan}`
- `GET /api/kinh-nghiem/ho-so/{maHoSo}`
- `POST /api/kinh-nghiem`
- `PUT /api/kinh-nghiem/{maKinhNghiem}`
- `DELETE /api/kinh-nghiem/{maKinhNghiem}`

Frontend:

- `/candidate/resume`
- `CandidateResumePage.tsx`
- `CandidateProfile.tsx`
- `CvManager.tsx`

Dữ liệu:

- `HoSoUngVien`
- `FileCV`
- `HocVan`
- `KinhNghiemLamViec`
- `KyNangUngVien`

### 7.3 Quản lý công ty/nhà tuyển dụng

Mục tiêu: nhà tuyển dụng tạo và cập nhật hồ sơ công ty để đăng tin tuyển dụng.

API:

- `POST /api/cong-ty`
- `GET /api/cong-ty`
- `GET /api/cong-ty/{maCongTy}`
- `GET /api/cong-ty/cua-toi/{maNguoiDung}`
- `GET /api/cong-ty/theo-email/{email}`
- `PUT /api/cong-ty/{maCongTy}`
- `PUT /api/cong-ty/{maCongTy}/duyet`
- `DELETE /api/cong-ty/{maCongTy}`

Frontend:

- `/recruiter/profile`
- `/company/dashboard`

Thông tin công ty gồm:

- Tên công ty.
- Email, số điện thoại.
- Mã số thuế.
- Logo, website.
- Lĩnh vực, quy mô.
- Địa chỉ, thành phố, quốc gia.
- Mô tả.
- Trạng thái duyệt.

### 7.4 Quản lý tin tuyển dụng và tìm kiếm việc làm

Mục tiêu: nhà tuyển dụng đăng tin, ứng viên tìm kiếm/lưu tin, admin duyệt tin.

API:

- `GET /api/tin-tuyen-dung`
- `GET /api/tin-tuyen-dung/filter`
- `GET /api/tin-tuyen-dung/{maTin}`
- `GET /api/tin-tuyen-dung/cong-ty/{maCongTy}`
- `GET /api/tin-tuyen-dung/cua-toi/{maNguoiDang}`
- `POST /api/tin-tuyen-dung`
- `PUT /api/tin-tuyen-dung/{maTin}`
- `PUT /api/tin-tuyen-dung/{maTin}/trang-thai`
- `GET /api/DanhMuc`
- `GET /api/DanhMuc/parent/{parentId}`
- `GET /api/DanhMuc/linhvuc`
- `POST /api/tin-da-luu/{maTin}`
- `DELETE /api/tin-da-luu/{maTin}`
- `GET /api/tin-da-luu/cua-toi`

Frontend:

- `/jobs`
- `/jobs/filter`
- `/jobs/:id`
- `/jobs/saved`
- `/admin/jobs`

Tin tuyển dụng gồm:

- Tiêu đề.
- Mô tả.
- Yêu cầu.
- Quyền lợi.
- Hình thức làm việc.
- Kinh nghiệm.
- Mức lương.
- Địa điểm.
- Hạn nộp hồ sơ.
- Số lượng tuyển.
- Trạng thái.

Tin mới mặc định có trạng thái `ChoXetDuyet`.

### 7.5 Quản lý đơn ứng tuyển

Mục tiêu: ứng viên nộp đơn bằng CV, nhà tuyển dụng theo dõi và xử lý đơn.

API:

- `POST /api/don-ung-tuyen`
- `GET /api/don-ung-tuyen/cua-toi/{maUngVien}`
- `GET /api/don-ung-tuyen/theo-tin/{maTin}`
- `GET /api/don-ung-tuyen/theo-cong-ty/{maCongTy}`
- `GET /api/don-ung-tuyen/{maDon}`
- `PUT /api/don-ung-tuyen/{maDon}/trang-thai`

Frontend:

- `/candidate/applications`
- `/company/applications`
- `JobDetailPage.tsx`

Luồng:

```text
Ứng viên xem tin → chọn CV → nộp đơn
→ nhà tuyển dụng xem đơn
→ cập nhật trạng thái
→ lên lịch phỏng vấn nếu phù hợp
```

### 7.6 Quản lý phỏng vấn, kết quả và thư mời làm việc

Mục tiêu: hoàn thiện pipeline tuyển dụng sau khi ứng viên nộp đơn.

API lịch phỏng vấn:

- `POST /api/lich-phong-van`
- `GET /api/lich-phong-van/theo-don/{maDon}`
- `GET /api/lich-phong-van/{maLich}`
- `PUT /api/lich-phong-van/{maLich}`
- `PUT /api/lich-phong-van/{maLich}/trang-thai`
- `DELETE /api/lich-phong-van/{maLich}`

API kết quả phỏng vấn:

- `POST /api/ket-qua-phong-van`
- `GET /api/ket-qua-phong-van/{maKetQua}`
- `GET /api/ket-qua-phong-van/lich/{maLich}`
- `GET /api/ket-qua-phong-van/ung-vien/{maUngVien}`
- `PUT /api/ket-qua-phong-van/{maKetQua}`
- `DELETE /api/ket-qua-phong-van/{maKetQua}`

API thư mời:

- `POST /api/thu-moi`
- `GET /api/thu-moi/{maThuMoi}`
- `GET /api/thu-moi/ung-vien/{maUngVien}`
- `GET /api/thu-moi/cong-ty/{maCongTy}`
- `GET /api/thu-moi/nguoi-phat-hanh/{maNguoiPhatHanh}`
- `PUT /api/thu-moi/{maThuMoi}/phan-hoi`
- `DELETE /api/thu-moi/{maThuMoi}`

Frontend:

- `/company/interviews`
- `/candidate/interviews`
- `/company/offers`
- `/candidate/offers`

Luồng:

```text
Đơn ứng tuyển phù hợp
→ nhà tuyển dụng tạo lịch phỏng vấn
→ ứng viên xem lịch
→ nhà tuyển dụng ghi kết quả
→ gửi thư mời làm việc
→ ứng viên phản hồi
```

### 7.7 Dashboard và thông báo

Dashboard giúp nhà tuyển dụng theo dõi số liệu tuyển dụng.

API dashboard:

- `GET /api/dashboard/thong-ke/{maNguoiDung}`
- `GET /api/dashboard/lich-phong-van-sap-toi/{maNguoiDung}`
- `GET /api/dashboard/bieu-do-luot-xem/{maNguoiDung}`
- `GET /api/dashboard/bieu-do-don-ung-tuyen/{maNguoiDung}`

Thông báo giúp người dùng nhận cập nhật trong hệ thống.

API thông báo:

- `GET /api/thong-bao/cua-toi/{maNguoiDung}`
- `GET /api/thong-bao/chua-doc/{maNguoiDung}`
- `PUT /api/thong-bao/{maThongBao}/da-doc`
- `PUT /api/thong-bao/tat-ca-da-doc/{maNguoiDung}`

Frontend:

- `/company/dashboard`
- `/notifications`
- `NotificationBell.tsx`

## 8. Luồng nghiệp vụ chính

### 8.1 Luồng ứng viên

```text
Đăng ký/đăng nhập
→ tạo hồ sơ ứng viên
→ tải CV
→ tìm kiếm việc làm
→ lưu tin hoặc nộp đơn
→ theo dõi trạng thái đơn
→ xem lịch phỏng vấn
→ nhận và phản hồi thư mời
```

### 8.2 Luồng nhà tuyển dụng

```text
Đăng ký/đăng nhập
→ tạo/cập nhật công ty
→ đăng tin tuyển dụng
→ chờ admin duyệt
→ xem đơn ứng tuyển
→ xem CV/hồ sơ ứng viên
→ cập nhật trạng thái đơn
→ lên lịch phỏng vấn
→ ghi kết quả
→ gửi thư mời
→ xem dashboard
```

### 8.3 Luồng admin

```text
Đăng nhập
→ xem danh sách tin chờ duyệt
→ duyệt hoặc cập nhật trạng thái tin tuyển dụng
```

## 9. Route frontend chính

| Route | Chức năng |
|---|---|
| `/` | Trang chủ |
| `/login` | Đăng nhập |
| `/register` | Đăng ký |
| `/jobs` | Danh sách việc làm |
| `/jobs/:id` | Chi tiết việc làm |
| `/jobs/filter` | Lọc việc làm |
| `/jobs/saved` | Tin đã lưu |
| `/candidate/resume` | Hồ sơ/CV ứng viên |
| `/candidate/applications` | Đơn đã nộp |
| `/candidate/interviews` | Lịch phỏng vấn ứng viên |
| `/candidate/offers` | Thư mời làm việc của ứng viên |
| `/company/dashboard` | Dashboard công ty |
| `/company/applications` | Quản lý đơn ứng tuyển |
| `/company/interviews` | Quản lý lịch phỏng vấn |
| `/company/candidates` | Tìm kiếm ứng viên |
| `/company/candidates/:maHoSo` | Chi tiết ứng viên |
| `/company/offers` | Quản lý thư mời |
| `/recruiter/profile` | Hồ sơ nhà tuyển dụng |
| `/admin/jobs` | Admin duyệt tin |
| `/notifications` | Thông báo |

## 10. Đánh giá đồng nhất giữa code và báo cáo

Các service frontend tương ứng với controller backend:

| Frontend service | Backend controller |
|---|---|
| `authService.ts` | `AuthController` |
| `jobService.ts` | `TinTuyenDungController` |
| `applicationService.ts` | `DonUngTuyenController` |
| `resumeService.ts`, `cvService.ts` | `HoSoUngVienController` |
| `companyService.ts` | `CongTyController` |
| `interviewService.ts` | `LichPhongVanController` |
| `interviewResultService.ts` | `KetQuaPhongVanController` |
| `offerService.ts` | `ThuMoiLamViecController` |
| `notificationService.ts` | `ThongBaoController` |
| `dashboardService.ts` | `DashboardController` |
| `savedJobService.ts` | `TinDaLuuController` |

Nhìn chung, backend API, frontend route, service gọi API và entity DB đang đồng nhất với nghiệp vụ tuyển dụng.

## 11. Nhận xét kỹ thuật

Ưu điểm:

- Backend phân lớp rõ ràng.
- Có DTO riêng cho nghiệp vụ.
- Có JWT Authentication.
- Frontend bảo vệ route theo vai trò.
- DB có đầy đủ quan hệ tuyển dụng.
- Có các module mở rộng như dashboard, thông báo, CV, offer, interview.

Điểm cần lưu ý khi triển khai thật:

- CORS đang cho phép mọi origin, phù hợp môi trường phát triển nhưng nên giới hạn khi deploy.
- Frontend đang hard-code API base URL `https://localhost:44314/api`, nên chuyển sang biến môi trường.
- File upload cần kiểm soát định dạng/kích thước khi đưa vào production.

## 12. Kết luận

Hệ thống đã triển khai đầy đủ các chức năng cốt lõi của nền tảng tuyển dụng: xác thực, phân quyền, hồ sơ ứng viên, CV, công ty, tin tuyển dụng, tìm kiếm việc làm, lưu tin, đơn ứng tuyển, lịch phỏng vấn, kết quả phỏng vấn, thư mời làm việc, thông báo và dashboard. Kiến trúc frontend React kết hợp backend ASP.NET Core Web API phù hợp với yêu cầu hệ thống hướng dịch vụ và nội dung báo cáo bài tập lớn.