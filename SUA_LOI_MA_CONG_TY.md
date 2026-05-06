# SỬA LỖI "TÀI KHOẢN CHƯA CÓ THÔNG TIN CÔNG TY"

## ✅ ĐÃ SỬA

Tôi đã cập nhật code để tự động lấy `maCongTy` khi đăng nhập:

### 1. Cập nhật NguoiDungDto
- **File**: `BTL_CNW/DTO/Auth/NguoiDungDto.cs`
- **Thêm**: `public int? MaCongTy { get; set; }`

### 2. Cập nhật AuthRepository
- **File**: `BTL_CNW/DAL/Auth/AuthRepository.cs`
- **Thay đổi**: Method `DangNhap()` bây giờ sẽ:
  - Include `CongTies` khi query
  - Tự động lấy `maCongTy` nếu user là nhà tuyển dụng (maVaiTro = 2)
  - Trả về `maCongTy` trong NguoiDungDto

## 🔧 CÁCH SỬA

### Bước 1: Đảm bảo tài khoản có công ty
Bạn cần đảm bảo trong database, tài khoản nhà tuyển dụng đã có công ty:

```sql
-- Kiểm tra xem user có công ty chưa
SELECT u.MaNguoiDung, u.HoTen, u.Email, c.MaCongTy, c.TenCongTy
FROM NguoiDung u
LEFT JOIN CongTy c ON c.MaNguoiDaiDien = u.MaNguoiDung
WHERE u.MaVaiTro = 2;

-- Nếu chưa có, tạo công ty cho user
INSERT INTO CongTy (MaNguoiDaiDien, TenCongTy, Email, DaDuocDuyet, TrangThai, NgayTao)
VALUES (
    1, -- MaNguoiDung của nhà tuyển dụng
    'Cong ty ABC',
    'company@example.com',
    1, -- Đã duyệt
    'HoatDong',
    GETDATE()
);
```

### Bước 2: Restart backend
```bash
cd BTL_CNW
dotnet run
```

### Bước 3: Đăng xuất và đăng nhập lại
1. Trong ứng dụng web, click vào tên user
2. Chọn "Đăng xuất"
3. Đăng nhập lại với tài khoản nhà tuyển dụng

### Bước 4: Kiểm tra trong Console
Mở Console (F12) và gõ:
```javascript
const user = JSON.parse(localStorage.getItem('user'));
console.log('User:', user);
console.log('MaCongTy:', user.maCongTy);
```

Bạn sẽ thấy `maCongTy` có giá trị (ví dụ: 1, 2, 3...)

## 🎯 KẾT QUẢ

Sau khi làm theo các bước trên:
- ✅ Trang "Tìm ứng viên" sẽ hoạt động
- ✅ Trang "Thư mời đã gửi" sẽ hoạt động
- ✅ Không còn lỗi "Tài khoản chưa có thông tin công ty"

## 📝 LƯU Ý

### Nếu vẫn còn lỗi:

#### 1. Kiểm tra database
```sql
-- Xem tất cả công ty
SELECT * FROM CongTy;

-- Xem user và công ty
SELECT u.MaNguoiDung, u.HoTen, u.Email, u.MaVaiTro, c.MaCongTy, c.TenCongTy
FROM NguoiDung u
LEFT JOIN CongTy c ON c.MaNguoiDaiDien = u.MaNguoiDung
WHERE u.MaVaiTro = 2;
```

#### 2. Tạo công ty nếu chưa có
Nếu user chưa có công ty, bạn có 2 cách:

**Cách 1: Tạo trực tiếp trong database**
```sql
INSERT INTO CongTy (MaNguoiDaiDien, TenCongTy, Email, DaDuocDuyet, TrangThai, NgayTao)
VALUES (
    [MaNguoiDung], -- Thay bằng ID của user
    'Ten Cong Ty',
    'email@company.com',
    1,
    'HoatDong',
    GETDATE()
);
```

**Cách 2: Sử dụng API tạo công ty**
- Endpoint: `POST /api/cong-ty`
- Đăng nhập với tài khoản nhà tuyển dụng
- Tạo công ty qua UI hoặc Postman

#### 3. Clear cache và đăng nhập lại
```javascript
// Trong Console
localStorage.clear();
// Sau đó refresh và đăng nhập lại
```

## 🔍 DEBUG

Nếu vẫn gặp vấn đề, kiểm tra:

### 1. Backend logs
Xem console của backend khi đăng nhập, sẽ thấy query SQL

### 2. Network tab
- Mở Developer Tools (F12)
- Tab Network
- Đăng nhập
- Xem response của `/api/auth/dang-nhap`
- Kiểm tra `data.maCongTy` có giá trị không

### 3. Console logs
Frontend đã có console.log để debug:
- "Fetching offers for company: X"
- "Searching with params: ..."
- "Response: ..."

## ✨ TỔNG KẾT

**Nguyên nhân**: NguoiDungDto không có field `maCongTy`, nên khi đăng nhập không lấy được thông tin công ty

**Giải pháp**: 
1. ✅ Thêm `MaCongTy` vào NguoiDungDto
2. ✅ Cập nhật AuthRepository để lấy maCongTy khi đăng nhập
3. ⏳ Đảm bảo user có công ty trong database
4. ⏳ Đăng xuất và đăng nhập lại

Sau khi làm xong, tất cả sẽ hoạt động bình thường! 🎉
