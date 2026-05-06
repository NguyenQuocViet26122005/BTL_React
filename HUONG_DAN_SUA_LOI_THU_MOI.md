# HƯỚNG DẪN SỬA LỖI THƯ MỜI KHÔNG HIỂN THỊ

## VẤN ĐỀ
Bạn đã gửi 2 thư mời (MaThuMoi = 2, 3) và chúng đã có trong database, nhưng không hiển thị ở frontend trang "Quan ly thu moi da gui".

## NGUYÊN NHÂN
Khi bạn đăng nhập, hệ thống lưu thông tin user vào localStorage bao gồm `maCongTy`. Tuy nhiên, code backend đã được sửa để query `maCongTy` từ database, nhưng bạn chưa đăng xuất và đăng nhập lại, nên localStorage vẫn giữ giá trị `maCongTy: null`.

Frontend kiểm tra:
```typescript
if (!user.maCongTy) {
  message.warning('Tai khoan chua co thong tin cong ty');
  return;
}
```

Vì `maCongTy` là null, nên API không được gọi và không có dữ liệu hiển thị.

## CÁCH SỬA - 3 BƯỚC

### BƯỚC 1: Chạy SQL để kiểm tra dữ liệu
Mở SQL Server Management Studio và chạy file `verify-offers-debug.sql` để xem:
- Thư mời có tồn tại không
- Thư mời thuộc về công ty nào (MaCongTy)
- Email của chủ sở hữu công ty là gì

### BƯỚC 2: Đăng xuất và đăng nhập lại
1. Mở trình duyệt
2. Nhấn F12 để mở Developer Tools
3. Vào tab Console
4. Gõ lệnh: `localStorage.clear()` và nhấn Enter
5. Đóng Developer Tools
6. Đăng nhập lại với tài khoản nhà tuyển dụng (email từ BƯỚC 1)

### BƯỚC 3: Kiểm tra localStorage sau khi đăng nhập
1. Nhấn F12 lại
2. Vào tab Console
3. Gõ lệnh: `JSON.parse(localStorage.getItem('user'))`
4. Kiểm tra xem có trường `maCongTy` không và giá trị là bao nhiêu

Nếu `maCongTy` có giá trị (ví dụ: 1, 2, 3...), thì đã thành công!

### BƯỚC 4: Vào trang Quan ly thu moi
Vào trang "Quan ly thu moi da gui" và kiểm tra xem 2 thư mời đã hiển thị chưa.

## KIỂM TRA THÊM

Nếu vẫn không hiển thị, mở Developer Tools (F12) -> tab Network:
1. Reload trang
2. Tìm request đến `/api/thu-moi/cong-ty/{maCongTy}`
3. Xem response trả về gì
4. Chụp màn hình và gửi cho tôi

## GHI CHÚ KỸ THUẬT

Backend đã được sửa ở `AuthRepository.cs`:
```csharp
if (nguoiDung.MaVaiTro == 2) // Nhà tuyển dụng
{
    var congTy = _context.CongTies
        .FirstOrDefault(c => c.MaChuSoHuu == nguoiDung.MaNguoiDung);
    maCongTy = congTy?.MaCongTy;
}
```

Frontend kiểm tra ở `ManageOffersPage.tsx`:
```typescript
const user = JSON.parse(userStr);
if (!user.maCongTy) {
    message.warning('Tai khoan chua co thong tin cong ty');
    return;
}
```

API endpoint: `GET /api/thu-moi/cong-ty/{maCongTy}`

Repository query:
```csharp
return _context.ThuMoiLamViecs
    .Include(t => t.MaNguoiPhatHanhNavigation)
    .Include(t => t.MaDonNavigation)
        .ThenInclude(d => d.MaUngVienNavigation)
    .Include(t => t.MaDonNavigation)
        .ThenInclude(d => d.MaTinNavigation)
    .Where(t => t.MaDonNavigation.MaTinNavigation.MaCongTy == maCongTy)
    .OrderByDescending(t => t.NgayTao)
    .ToList();
```

Điều kiện WHERE: `t.MaDonNavigation.MaTinNavigation.MaCongTy == maCongTy`

Nghĩa là: ThuMoi -> DonUngTuyen -> TinTuyenDung -> MaCongTy
