# HƯỚNG DẪN SỬ DỤNG CÁC CHỨC NĂNG MỚI

## 🚀 CÁCH TRUY CẬP

### Bước 1: Đăng nhập với tài khoản Nhà tuyển dụng
1. Mở trình duyệt và truy cập: `http://localhost:3000`
2. Click nút **"Đăng nhập"** ở góc phải trên
3. Đăng nhập với tài khoản có vai trò **Nhà tuyển dụng** (maVaiTro = 2)

### Bước 2: Xem menu mới
Sau khi đăng nhập, bạn sẽ thấy menu ở header có thêm 2 nút mới:

```
┌─────────────────────────────────────────────────────────────┐
│ VietHire  [Trang chu] [Viec lam] [Dashboard] [Don ung tuyen]│
│           [Lich phong van] [Tim ung vien] [Thu moi da gui]  │
└─────────────────────────────────────────────────────────────┘
```

---

## 📋 CÁC CHỨC NĂNG MỚI

### 1. 🔍 TÌM ỨNG VIÊN

**Cách truy cập**: Click nút **"Tim ung vien"** trên menu

**Hoặc**: Truy cập trực tiếp `http://localhost:3000/company/candidates`

**Chức năng**:
- ✅ Tìm kiếm theo từ khóa (tên, tiêu đề, kỹ năng)
- ✅ Lọc theo thành phố (Hà Nội, Hồ Chí Minh, Đà Nẵng...)
- ✅ Lọc theo tình trạng tìm việc (Sẵn sàng, Mở, Không tìm việc)
- ✅ Hiển thị kết quả dạng bảng với pagination
- ✅ Xem chi tiết hồ sơ ứng viên

**Cách sử dụng**:
1. Nhập từ khóa vào ô tìm kiếm (ví dụ: "developer", "java", "react")
2. Chọn thành phố từ dropdown (optional)
3. Chọn tình trạng từ dropdown (optional)
4. Click nút **"Tìm kiếm"**
5. Xem kết quả trong bảng
6. Click nút **"Xem"** để xem chi tiết hồ sơ ứng viên

---

### 2. 👤 XEM HỒ SƠ ỨNG VIÊN CHI TIẾT

**Cách truy cập**: 
- Từ trang "Tìm ứng viên", click nút **"Xem"** trên hàng ứng viên
- Hoặc truy cập trực tiếp: `http://localhost:3000/company/candidates/{maHoSo}`

**Thông tin hiển thị**:
- ✅ Thông tin cá nhân: Họ tên, Email, SĐT, Ngày sinh, Giới tính
- ✅ Địa chỉ: Địa chỉ chi tiết, Thành phố
- ✅ Thông tin nghề nghiệp: Tiêu đề, Tóm tắt
- ✅ Tình trạng tìm việc (với màu sắc)
- ✅ Mức lương mong muốn
- ✅ Liên kết mạng xã hội:
  - LinkedIn (click để mở)
  - GitHub (click để mở)
  - Portfolio (click để mở)

**Chức năng**:
- Click vào email để gửi email
- Click vào LinkedIn/GitHub/Portfolio để mở trang web
- Click nút **"Quay lại"** để về danh sách

---

### 3. 📧 QUẢN LÝ THƯ MỜI ĐÃ GỬI

**Cách truy cập**: Click nút **"Thu moi da gui"** trên menu

**Hoặc**: Truy cập trực tiếp `http://localhost:3000/company/offers`

**Chức năng**:
- ✅ Xem danh sách tất cả thư mời đã gửi
- ✅ Xem chi tiết thư mời
- ✅ Xóa thư mời chưa được phản hồi
- ✅ Theo dõi trạng thái thư mời

**Thông tin hiển thị**:
- Tên ứng viên
- Vị trí công việc
- Mức lương
- Ngày bắt đầu dự kiến
- Hạn phản hồi
- Trạng thái:
  - 🟠 **Chờ phản hồi** (màu cam)
  - 🟢 **Đã đồng ý** (màu xanh)
  - 🔴 **Đã từ chối** (màu đỏ)

**Cách sử dụng**:
1. Xem danh sách thư mời trong bảng
2. Click nút **"Xem"** để xem chi tiết thư mời (mở modal)
3. Click nút **"Xóa"** để xóa thư mời (chỉ hiện với thư mời "Chờ phản hồi")
4. Xác nhận xóa trong dialog

---

## 🎯 CÁC CHỨC NĂNG KHÁC (API ĐÃ SẴN SÀNG)

### 4. ✏️ SỬA LỊCH PHỎNG VẤN
**API**: `PUT /api/lich-phong-van/{maLich}`
**Trạng thái**: Backend đã sẵn sàng, cần cập nhật UI

### 5. 🗑️ XÓA LỊCH PHỎNG VẤN
**API**: `DELETE /api/lich-phong-van/{maLich}`
**Trạng thái**: Backend đã sẵn sàng, cần cập nhật UI

### 6. ✏️ SỬA KẾT QUẢ PHỎNG VẤN
**API**: `PUT /api/ket-qua-phong-van/{maKetQua}`
**Trạng thái**: Backend đã sẵn sàng

---

## 🖼️ GIAO DIỆN

### Menu Header (Nhà tuyển dụng)
```
┌──────────────────────────────────────────────────────────────┐
│ VietHire                                    🔔 [User Menu]    │
├──────────────────────────────────────────────────────────────┤
│ [Trang chu] [Viec lam]                                        │
│ [📊 Dashboard] [👥 Don ung tuyen] [📅 Lich phong van]        │
│ [👥 Tim ung vien] [🎁 Thu moi da gui]                        │
└──────────────────────────────────────────────────────────────┘
```

### Trang Tìm ứng viên
```
┌──────────────────────────────────────────────────────────────┐
│ Tim kiem ung vien                                             │
├──────────────────────────────────────────────────────────────┤
│ [🔍 Tim theo ten, tieu de, ky nang...                      ] │
│ [Thanh pho ▼] [Tinh trang ▼] [Tim kiem]                     │
└──────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│ Ket qua tim kiem (X ung vien)                                │
├──────────────────────────────────────────────────────────────┤
│ Ho ten    │ Tieu de      │ Thanh pho │ Tinh trang │ Hanh dong│
│ Nguyen A  │ Developer    │ Ha Noi    │ [San sang] │ [Xem]   │
│ Tran B    │ Designer     │ HCM       │ [Mo]       │ [Xem]   │
└──────────────────────────────────────────────────────────────┘
```

### Trang Chi tiết ứng viên
```
┌──────────────────────────────────────────────────────────────┐
│ [← Quay lai]                                                  │
│                                                               │
│ Ho so: Nguyen Van A                                          │
├──────────────────────────────────────────────────────────────┤
│ Ho ten:        Nguyen Van A    │ Email:    📧 email@...      │
│ So dien thoai: 📞 0123456789   │ Ngay sinh: 01/01/1990      │
│ Gioi tinh:     Nam             │ Thanh pho: Ha Noi          │
│ Dia chi:       123 ABC Street                                │
│ Tieu de:       Senior Developer                              │
│ Tom tat:       5 years experience...                         │
│ Tinh trang:    [San sang tim viec]                          │
│ Muc luong:     20,000,000 VND                               │
│ LinkedIn:      🔗 linkedin.com/in/...                        │
│ GitHub:        🔗 github.com/...                             │
│ Portfolio:     🔗 portfolio.com                              │
└──────────────────────────────────────────────────────────────┘
```

### Trang Quản lý thư mời
```
┌──────────────────────────────────────────────────────────────┐
│ Quan ly thu moi da gui (X thu moi)                           │
├──────────────────────────────────────────────────────────────┤
│ Ung vien │ Vi tri    │ Muc luong │ Ngay BD │ Trang thai │ ... │
│ Nguyen A │ Developer │ 20M VND   │ 01/05   │ [Cho PH]   │[Xem]│
│ Tran B   │ Designer  │ 15M VND   │ 15/05   │ [Da dong y]│[Xem]│
└──────────────────────────────────────────────────────────────┘
```

---

## 💡 MẸO SỬ DỤNG

### Tìm kiếm hiệu quả:
1. **Tìm theo kỹ năng**: Nhập "java", "react", "python"...
2. **Tìm theo vị trí**: Nhập "developer", "designer", "manager"...
3. **Kết hợp filters**: Dùng cả từ khóa + thành phố + tình trạng

### Xem hồ sơ:
1. Click vào email để gửi email trực tiếp
2. Click vào LinkedIn/GitHub để xem profile chi tiết
3. Lưu ý mức lương mong muốn để đàm phán

### Quản lý thư mời:
1. Theo dõi trạng thái bằng màu sắc
2. Xóa thư mời nếu gửi nhầm (chỉ khi chưa phản hồi)
3. Xem chi tiết để biết ghi chú và thông tin đầy đủ

---

## ⚠️ LƯU Ý

1. **Quyền truy cập**: Chỉ nhà tuyển dụng (maVaiTro = 2) mới thấy các menu này
2. **Token**: Cần đăng nhập để sử dụng, token được lưu trong localStorage
3. **Xóa thư mời**: Chỉ có thể xóa thư mời có trạng thái "Chờ phản hồi"
4. **Pagination**: Mỗi trang hiển thị tối đa 10 records

---

## 🐛 TROUBLESHOOTING

### Không thấy menu mới?
- ✅ Kiểm tra đã đăng nhập với tài khoản nhà tuyển dụng chưa
- ✅ Refresh lại trang (F5)
- ✅ Xóa cache và đăng nhập lại

### Không tải được dữ liệu?
- ✅ Kiểm tra backend đang chạy (http://localhost:5114)
- ✅ Kiểm tra token còn hạn không
- ✅ Xem console log để biết lỗi chi tiết

### Lỗi 401 Unauthorized?
- ✅ Token hết hạn, đăng nhập lại
- ✅ Tài khoản không có quyền truy cập

### Lỗi 404 Not Found?
- ✅ Kiểm tra URL có đúng không
- ✅ Kiểm tra backend API có chạy không

---

## 📞 HỖ TRỢ

Nếu gặp vấn đề, kiểm tra:
1. Console log trong trình duyệt (F12)
2. Network tab để xem API calls
3. Backend logs để xem lỗi server

---

**Chúc bạn sử dụng hiệu quả!** 🎉
