# 🔐 Hướng dẫn Phân quyền JWT - BTL_CNW

## 📋 Tổng quan

Hệ thống đã được implement JWT Authentication với 3 vai trò chính:
- **QuanTriVien** (Admin) - Quản lý toàn bộ hệ thống
- **NhaTuyenDung** (Recruiter) - Đăng tin, quản lý tuyển dụng
- **UngVien** (Candidate) - Ứng tuyển, quản lý hồ sơ

## 🚀 Cách sử dụng

### 1. Đăng ký tài khoản
```http
POST /api/auth/dang-ky
Content-Type: application/json

{
  "maVaiTro": 2,  // 2 = NhaTuyenDung, 3 = UngVien
  "hoTen": "Nguyễn Văn A",
  "email": "user@example.com",
  "soDienThoai": "0123456789",
  "matKhau": "password123"
}
```

### 2. Đăng nhập
```http
POST /api/auth/dang-nhap
Content-Type: application/json

{
  "email": "user@example.com",
  "matKhau": "password123"
}
```

**Response:**
```json
{
  "message": "Đăng nhập thành công!",
  "user": {
    "maNguoiDung": 1,
    "hoTen": "Nguyễn Văn A",
    "email": "user@example.com",
    "tenVaiTro": "NhaTuyenDung"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### 3. Sử dụng token trong các API calls
```http
GET /api/auth/me
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## 🔒 Ma trận phân quyền

| API Endpoint | QuanTriVien | NhaTuyenDung | UngVien | Public |
|--------------|-------------|--------------|---------|--------|
| **Auth APIs** |
| POST /auth/dang-ky | ✅ | ✅ | ✅ | ✅ |
| POST /auth/dang-nhap | ✅ | ✅ | ✅ | ✅ |
| GET /auth/me | ✅ | ✅ | ✅ | ❌ |
| **Công ty APIs** |
| POST /cong-ty | ❌ | ✅ | ❌ | ❌ |
| GET /cong-ty | ✅ | ❌ | ❌ | ❌ |
| GET /cong-ty/{id} | ✅ | ✅ | ✅ | ❌ |
| PUT /cong-ty/{id} | ❌ | ✅ | ❌ | ❌ |
| PUT /cong-ty/{id}/duyet | ✅ | ❌ | ❌ | ❌ |
| DELETE /cong-ty/{id} | ✅ | ❌ | ❌ | ❌ |
| **Tin tuyển dụng APIs** |
| GET /tin-tuyen-dung | ✅ | ✅ | ✅ | ✅ |
| GET /tin-tuyen-dung/{id} | ✅ | ✅ | ✅ | ✅ |
| POST /tin-tuyen-dung | ❌ | ✅ | ❌ | ❌ |
| PUT /tin-tuyen-dung/{id} | ❌ | ✅ | ❌ | ❌ |
| PUT /tin-tuyen-dung/{id}/trang-thai | ✅ | ✅ | ❌ | ❌ |
| DELETE /tin-tuyen-dung/{id} | ✅ | ✅ | ❌ | ❌ |
| **Đơn ứng tuyển APIs** |
| POST /don-ung-tuyen | ❌ | ❌ | ✅ | ❌ |
| GET /don-ung-tuyen/cua-toi/{id} | ❌ | ❌ | ✅ | ❌ |
| GET /don-ung-tuyen/theo-tin/{id} | ❌ | ✅ | ❌ | ❌ |
| GET /don-ung-tuyen/{id} | ❌ | ✅ | ✅ | ❌ |
| PUT /don-ung-tuyen/{id}/trang-thai | ❌ | ✅ | ❌ | ❌ |
| **Hồ sơ ứng viên APIs** |
| POST /ho-so | ❌ | ❌ | ✅ | ❌ |
| GET /ho-so/cua-toi/{id} | ❌ | ❌ | ✅ | ❌ |
| GET /ho-so/{id} | ❌ | ✅ | ✅ | ❌ |
| PUT /ho-so/{id} | ❌ | ❌ | ✅ | ❌ |
| **Lịch phỏng vấn APIs** |
| POST /lich-phong-van | ❌ | ✅ | ❌ | ❌ |
| GET /lich-phong-van/theo-don/{id} | ❌ | ✅ | ✅ | ❌ |
| GET /lich-phong-van/{id} | ❌ | ✅ | ✅ | ❌ |
| PUT /lich-phong-van/{id}/trang-thai | ❌ | ✅ | ❌ | ❌ |

## 🛠️ Cấu hình JWT

Trong `appsettings.json`:
```json
{
  "JwtSettings": {
    "SecretKey": "BTL_CNW_JWT_SECRET_KEY_2024_VERY_LONG_AND_SECURE_KEY_FOR_AUTHENTICATION",
    "Issuer": "BTL_CNW_API",
    "Audience": "BTL_CNW_CLIENT",
    "ExpiryInMinutes": 60
  }
}
```

## 🔍 Thông tin trong JWT Token

Token chứa các claims sau:
- `nameid`: ID người dùng
- `name`: Họ tên
- `email`: Email
- `role`: Tên vai trò (QuanTriVien/NhaTuyenDung/UngVien)
- `MaVaiTro`: ID vai trò (1/2/3)

## ⚠️ Lưu ý bảo mật

1. **Token expiry**: Token có thời hạn 60 phút
2. **HTTPS only**: Chỉ sử dụng HTTPS trong production
3. **Secret key**: Thay đổi secret key trong production
4. **CORS**: Cấu hình CORS phù hợp với domain frontend

## 🧪 Test với Postman/HTTP Client

1. Đăng nhập để lấy token
2. Copy token từ response
3. Thêm header: `Authorization: Bearer <token>`
4. Gọi các API cần authentication

## 🚨 Xử lý lỗi

- **401 Unauthorized**: Token không hợp lệ hoặc hết hạn
- **403 Forbidden**: Không có quyền truy cập endpoint này
- **400 Bad Request**: Dữ liệu đầu vào không hợp lệ

## 📱 Frontend Integration

```javascript
// Lưu token sau khi đăng nhập
localStorage.setItem('token', response.data.token);

// Thêm token vào header cho mọi request
axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

// Hoặc cho từng request
const config = {
  headers: {
    'Authorization': `Bearer ${token}`
  }
};
axios.get('/api/auth/me', config);
```