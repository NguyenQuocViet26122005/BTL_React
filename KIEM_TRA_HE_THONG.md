# Kiểm tra hệ thống - Những gì còn thiếu

## ✅ ĐÃ CÓ - BACKEND (API Controllers)

### 1. AuthController ✅
- POST /api/auth/dang-ky
- POST /api/auth/dang-nhap

### 2. TinTuyenDungController ✅
- GET /api/tin-tuyen-dung (public - danh sách tin đã duyệt)
- GET /api/tin-tuyen-dung/{id}
- GET /api/tin-tuyen-dung/cua-toi/{maNguoiDung}
- POST /api/tin-tuyen-dung (tạo tin mới)
- PUT /api/tin-tuyen-dung/{id} (cập nhật tin)
- DELETE /api/tin-tuyen-dung/{id} (xóa tin)

### 3. DonUngTuyenController ✅
- POST /api/don-ung-tuyen (nộp đơn)
- GET /api/don-ung-tuyen/cua-toi/{maUngVien}
- GET /api/don-ung-tuyen/theo-tin/{maTin}
- GET /api/don-ung-tuyen/{maDon}
- PUT /api/don-ung-tuyen/{maDon}/trang-thai

### 4. HoSoUngVienController ✅
- POST /api/ho-so (tạo hồ sơ)
- GET /api/ho-so/cua-toi/{maNguoiDung}
- GET /api/ho-so/{maHoSo}
- PUT /api/ho-so/{maHoSo}

### 5. LichPhongVanController ✅
- POST /api/lich-phong-van (tạo lịch)
- GET /api/lich-phong-van/theo-don/{maDon}
- GET /api/lich-phong-van/{maLich}
- PUT /api/lich-phong-van/{maLich}/trang-thai

### 6. DashboardController ✅
- GET /api/dashboard/thong-ke/{maNguoiDung}
- GET /api/dashboard/lich-phong-van-sap-toi/{maNguoiDung}
- GET /api/dashboard/bieu-do-luot-xem/{maNguoiDung}
- GET /api/dashboard/bieu-do-don-ung-tuyen/{maNguoiDung}

### 7. ProfileController ✅
- GET /api/profile/{maNguoiDung}
- PUT /api/profile/{maNguoiDung}
- POST /api/profile/{maNguoiDung}/doi-mat-khau

### 8. CongTyController ✅
- POST /api/cong-ty (tạo công ty)
- GET /api/cong-ty (lấy tất cả - admin)
- GET /api/cong-ty/{id}
- GET /api/cong-ty/email/{email}
- PUT /api/cong-ty/{id}

### 9. DanhMucController ✅
- GET /api/danhmuc (lấy danh mục việc làm)

---

## ✅ ĐÃ CÓ - FRONTEND (Pages)

### 1. Auth Pages ✅
- LoginPage.tsx
- RegisterPage.tsx

### 2. Job Pages ✅
- JobListPage.tsx (danh sách việc làm)
- JobDetailPage.tsx (chi tiết việc làm)
- JobFilterPage.tsx (lọc việc làm)

### 3. Company Pages ✅
- CompanyDashboard.tsx (dashboard nhà tuyển dụng với CRUD tin tuyển dụng)

### 4. Profile Pages ✅
- ProfilePage.tsx (profile chung)
- CandidateProfile.tsx (profile ứng viên)
- RecruiterProfile.tsx (profile nhà tuyển dụng)

### 5. Candidate Pages ✅
- MyApplicationsPage.tsx (đơn ứng tuyển của tôi)
- CandidateResumePage.tsx (hồ sơ ứng viên)

### 6. Home Page ✅
- HomePage.tsx

---

## ❌ THIẾU - FRONTEND Services

### 1. applicationService.ts ⚠️
Cần kiểm tra xem đã có đầy đủ các hàm:
- nopDon() - Nộp đơn ứng tuyển
- getMyApplications() - Lấy đơn của ứng viên
- getApplicationsByJob() - Lấy đơn theo tin (cho nhà tuyển dụng)
- getApplicationDetail() - Chi tiết đơn
- updateApplicationStatus() - Cập nhật trạng thái đơn

### 2. resumeService.ts ⚠️
Cần kiểm tra:
- createResume() - Tạo hồ sơ
- getMyResume() - Lấy hồ sơ của tôi
- getResumeById() - Lấy hồ sơ theo ID
- updateResume() - Cập nhật hồ sơ

---

## ❌ THIẾU - FRONTEND Pages/Features

### 1. Trang quản lý đơn ứng tuyển cho Nhà tuyển dụng ❌
**Chưa có:** Trang để nhà tuyển dụng xem và quản lý các đơn ứng tuyển vào tin của mình
- Xem danh sách đơn ứng tuyển theo từng tin
- Xem chi tiết đơn ứng tuyển
- Cập nhật trạng thái đơn (Mới, Đang xem, Vào danh sách, Từ chối, v.v.)
- Tạo lịch phỏng vấn cho ứng viên

**Cần tạo:**
- `BTL_UI/react-project/src/pages/Company/ApplicationManagement.tsx`
- Route: `/company/applications` hoặc `/company/applications/:maTin`

### 2. Trang quản lý lịch phỏng vấn ❌
**Chưa có:** Trang quản lý lịch phỏng vấn
- Xem danh sách lịch phỏng vấn
- Tạo lịch phỏng vấn mới
- Cập nhật trạng thái lịch phỏng vấn
- Xem chi tiết lịch phỏng vấn

**Cần tạo:**
- `BTL_UI/react-project/src/pages/Company/InterviewSchedule.tsx`
- `BTL_UI/react-project/src/pages/Candidate/MyInterviews.tsx`
- Service: `interviewService.ts`

### 3. Trang tạo/chỉnh sửa hồ sơ ứng viên ❌
**Chưa có:** Form đầy đủ để ứng viên tạo/sửa hồ sơ
- CandidateResumePage.tsx có thể chưa đầy đủ chức năng

**Cần kiểm tra và bổ sung:**
- Form tạo hồ sơ với đầy đủ trường
- Upload CV file
- Thêm học vấn, kinh nghiệm, kỹ năng

### 4. Trang quản lý công ty ❌
**Chưa có:** Trang để nhà tuyển dụng quản lý thông tin công ty
- Tạo công ty mới (nếu chưa có)
- Cập nhật thông tin công ty
- Upload logo công ty

**Cần tạo:**
- `BTL_UI/react-project/src/pages/Company/CompanyProfile.tsx`
- Route: `/company/profile`

---

## 🔧 CẦN CẢI THIỆN

### 1. CompanyDashboard.tsx
**Hiện tại:** Chỉ hiển thị stats cơ bản (hardcoded)
**Cần:** Tích hợp với Dashboard API để hiển thị:
- Thống kê thực từ backend
- Lịch phỏng vấn sắp tới
- Biểu đồ lượt xem
- Biểu đồ đơn ứng tuyển theo tháng

### 2. Navigation/Menu
**Cần kiểm tra:** MainLayout có đầy đủ menu items cho:
- Nhà tuyển dụng: Dashboard, Tin tuyển dụng, Đơn ứng tuyển, Lịch phỏng vấn, Profile
- Ứng viên: Tìm việc, Đơn của tôi, Hồ sơ, Lịch phỏng vấn, Profile

---

## 📋 DANH SÁCH ƯU TIÊN CẦN LÀM

### Mức độ CAO (Cần làm ngay):
1. ✅ RecruiterProfile - ĐÃ XONG
2. ❌ ApplicationManagement (Quản lý đơn ứng tuyển cho nhà tuyển dụng)
3. ❌ InterviewService + InterviewSchedule pages
4. ⚠️ Kiểm tra và hoàn thiện applicationService.ts
5. ⚠️ Kiểm tra và hoàn thiện resumeService.ts

### Mức độ TRUNG BÌNH:
6. ❌ CompanyProfile (Quản lý thông tin công ty)
7. ⚠️ Cải thiện CandidateResumePage với form đầy đủ
8. ⚠️ Cập nhật CompanyDashboard với dashboard API

### Mức độ THẤP (Nice to have):
9. ❌ Trang thống kê chi tiết với biểu đồ
10. ❌ Trang quản lý thông báo
11. ❌ Trang tìm kiếm nâng cao

---

## 🎯 KẾ HOẠCH TIẾP THEO

### Bước 1: Kiểm tra Services
```bash
# Kiểm tra các file service xem đã đầy đủ chưa
- applicationService.ts
- resumeService.ts
```

### Bước 2: Tạo trang quản lý đơn ứng tuyển
```
ApplicationManagement.tsx
- Danh sách đơn ứng tuyển theo tin
- Chi tiết đơn
- Cập nhật trạng thái
- Nút tạo lịch phỏng vấn
```

### Bước 3: Tạo service và trang lịch phỏng vấn
```
interviewService.ts
InterviewSchedule.tsx (cho nhà tuyển dụng)
MyInterviews.tsx (cho ứng viên)
```

### Bước 4: Hoàn thiện các trang còn lại
```
CompanyProfile.tsx
Cải thiện CandidateResumePage.tsx
```

---

## 📝 GHI CHÚ

- Backend đã có đầy đủ API
- Frontend còn thiếu một số trang quan trọng
- Cần tập trung vào trang quản lý đơn ứng tuyển và lịch phỏng vấn
- Dashboard cần tích hợp với API thực
