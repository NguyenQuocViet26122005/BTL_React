# PHAN TICH TRANG PROFILE UNG VIEN

## HIEN TAI DA CO

### 1. Thong tin ca nhan (HoSoUngVien) ✅
- Tieu de (VD: Senior Frontend Developer)
- Tom tat ve ban than
- Ngay sinh
- Gioi tinh
- Dia chi, Thanh pho
- LinkedIn, GitHub, Portfolio
- Tinh trang tim viec
- Muc luong mong muon

### 2. Bao mat ✅
- Doi mat khau
- Dang xuat

## CON THIEU - CAN THEM VAO

### 3. HOC VAN (HocVan) ❌ QUAN TRONG
**Du lieu:**
- Truong hoc (required)
- Bang cap (VD: Cu nhan, Thac si)
- Chuyen nganh
- Diem trung binh (GPA)
- Ngay bat dau - Ngay ket thuc
- Dang hoc khong (checkbox)

**Chuc nang:**
- Hien thi danh sach hoc van
- Them hoc van moi
- Sua hoc van
- Xoa hoc van

### 4. KINH NGHIEM LAM VIEC (KinhNghiemLamViec) ❌ QUAN TRONG
**Du lieu:**
- Ten cong ty (required)
- Vi tri (required)
- Mo ta cong viec
- Ngay bat dau - Ngay ket thuc
- Dang lam khong (checkbox)

**Chuc nang:**
- Hien thi danh sach kinh nghiem
- Them kinh nghiem moi
- Sua kinh nghiem
- Xoa kinh nghiem

### 5. KY NANG (KyNangUngVien) ❌ QUAN TRONG
**Du lieu:**
- Ten ky nang (VD: ReactJS, NodeJS, Python)
- Trinh do (VD: Beginner, Intermediate, Advanced, Expert)

**Chuc nang:**
- Hien thi danh sach ky nang
- Them ky nang moi
- Xoa ky nang
- Hien thi dang tag/badge

### 6. FILE CV (FileCv) ❌ QUAN TRONG
**Du lieu:**
- Ten file
- Duong dan file
- Kich thuoc
- Loai file (PDF, DOCX)
- La mac dinh (checkbox)
- Ngay tai len

**Chuc nang:**
- Upload CV (PDF, DOCX)
- Danh sach CV da upload
- Xem/Download CV
- Xoa CV
- Dat CV mac dinh

### 7. THONG KE ❌ BO SUNG
- Tong so don ung tuyen
- Tong so tin da luu
- Tong so lich phong van
- Profile completion (% hoan thanh)

## CAU TRUC TAB DE XUAT

```
Tab 1: Thong tin ca nhan ✅ (Da co)
Tab 2: Hoc van ❌ (Can them)
Tab 3: Kinh nghiem ❌ (Can them)
Tab 4: Ky nang ❌ (Can them)
Tab 5: CV cua toi ❌ (Can them)
Tab 6: Bao mat ✅ (Da co)
```

## UU TIEN THUC HIEN

### GIAI DOAN 1 (CAP THIET)
1. Tab Hoc van - CRUD hoc van
2. Tab Kinh nghiem - CRUD kinh nghiem
3. Tab Ky nang - CRUD ky nang

### GIAI DOAN 2 (QUAN TRONG)
4. Tab CV - Upload/Download/Delete CV

### GIAI DOAN 3 (BO SUNG)
5. Thong ke profile completion
6. Tich hop voi trang ung tuyen

## API CAN TAO (BACKEND)

### HocVanController ❌
```
POST   /api/hoc-van - Them hoc van
PUT    /api/hoc-van/{id} - Cap nhat hoc van
DELETE /api/hoc-van/{id} - Xoa hoc van
GET    /api/hoc-van/ho-so/{maHoSo} - Lay danh sach hoc van
```

### KinhNghiemController ❌
```
POST   /api/kinh-nghiem - Them kinh nghiem
PUT    /api/kinh-nghiem/{id} - Cap nhat kinh nghiem
DELETE /api/kinh-nghiem/{id} - Xoa kinh nghiem
GET    /api/kinh-nghiem/ho-so/{maHoSo} - Lay danh sach kinh nghiem
```

### KyNangController ❌
```
POST   /api/ky-nang-ung-vien - Them ky nang cho ung vien
DELETE /api/ky-nang-ung-vien/{maHoSo}/{maKyNang} - Xoa ky nang
GET    /api/ky-nang-ung-vien/ho-so/{maHoSo} - Lay danh sach ky nang
GET    /api/ky-nang - Lay tat ca ky nang (de chon)
```

### FileCVController ❌
```
POST   /api/file-cv/upload - Upload CV
GET    /api/file-cv/ho-so/{maHoSo} - Lay danh sach CV
GET    /api/file-cv/{id}/download - Download CV
DELETE /api/file-cv/{id} - Xoa CV
PUT    /api/file-cv/{id}/set-default - Dat CV mac dinh
```

## KET LUAN

Trang profile hien tai chi co **30%** chuc nang.
Can them **4 tab moi** de hoan thien:
1. Hoc van
2. Kinh nghiem
3. Ky nang
4. CV

Sau khi them xong, trang profile se dat **100%** va ung vien co the:
- Quan ly ho so day du
- Upload CV
- Ung tuyen viec lam voi thong tin hoan chinh
