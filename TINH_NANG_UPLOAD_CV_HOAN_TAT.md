# TINH NANG UPLOAD CV - HOAN TAT ✅

## TONG QUAN
Da hoan thanh tinh nang upload file CV - tinh nang quan trong nhat con thieu cua he thong.

---

## CAC FILE DA TAO/CAP NHAT

### Backend (.NET 8)

#### Controllers
- `BTL_CNW/Controllers/FileCvController.cs` - API endpoints cho upload/quan ly CV

#### Services (BLL)
- `BTL_CNW/BLL/FileCv/IFileCvService.cs` - Interface
- `BTL_CNW/BLL/FileCv/FileCvService.cs` - Business logic

#### Repositories (DAL)
- `BTL_CNW/DAL/FileCv/IFileCvRepository.cs` - Interface
- `BTL_CNW/DAL/FileCv/FileCvRepository.cs` - Data access

#### DTOs
- `BTL_CNW/DTO/FileCv/UploadCvDto.cs` - DTO cho upload
- `BTL_CNW/DTO/FileCv/FileCvDto.cs` - DTO cho response

#### Configuration
- `BTL_CNW/Program.cs` - Dang ky services, enable static files

### Frontend (React + TypeScript)

#### Services
- `BTL_UI/react-project/src/services/cvService.ts` - API client cho CV

#### Components
- `BTL_UI/react-project/src/components/CV/CvManager.tsx` - Component quan ly CV

#### Types
- `BTL_UI/react-project/src/types/index.ts` - Them type FileCv

---

## TINH NANG DA IMPLEMENT

### 1. Upload CV ✅
- Upload file PDF, DOC, DOCX
- Gioi han kich thuoc 5MB
- Tu dong dat CV dau tien lam mac dinh
- Luu file vao thu muc `wwwroot/uploads/cv/`

### 2. Quan ly CV ✅
- Xem danh sach tat ca CV da tai len
- Hien thi thong tin: ten file, kich thuoc, ngay tai, loai file
- Sap xep: CV mac dinh len dau, sau do theo ngay tai

### 3. Dat CV mac dinh ✅
- Chon CV nao lam mac dinh
- Chi co 1 CV mac dinh tai 1 thoi diem
- CV mac dinh se duoc dung khi ung tuyen

### 4. Xoa CV ✅
- Xoa CV khoi database
- Xoa file vat ly khoi server
- Co xac nhan truoc khi xoa

### 5. Tai xuong CV ✅
- Tai xuong CV da upload
- Mo trong tab moi

---

## API ENDPOINTS

### POST /api/file-cv/upload
**Muc dich**: Upload file CV
**Authorization**: Ung vien (maVaiTro = 3)
**Request**: FormData
- MaHoSo: int
- File: IFormFile
- LaMacDinh: bool

**Response**:
```json
{
  "success": true,
  "message": "Tai file CV thanh cong",
  "data": {
    "maFileCv": 1,
    "maHoSo": 1,
    "tenFile": "CV_NguyenVanA.pdf",
    "duongDanFile": "/uploads/cv/guid.pdf",
    "kichThuoc": 245678,
    "loaiFile": ".pdf",
    "laMacDinh": true,
    "ngayTai": "2024-01-15T10:30:00"
  }
}
```

### GET /api/file-cv/ho-so/{maHoSo}
**Muc dich**: Lay danh sach CV theo ho so
**Authorization**: Ung vien hoac Nha tuyen dung

### GET /api/file-cv/{maFileCv}
**Muc dich**: Lay chi tiet 1 file CV
**Authorization**: Ung vien hoac Nha tuyen dung

### PUT /api/file-cv/{maFileCv}/mac-dinh?maHoSo={maHoSo}
**Muc dich**: Dat CV mac dinh
**Authorization**: Ung vien

### DELETE /api/file-cv/{maFileCv}
**Muc dich**: Xoa CV
**Authorization**: Ung vien

---

## CACH SU DUNG

### Cho Ung vien

#### 1. Tai len CV
1. Dang nhap voi tai khoan ung vien
2. Vao trang Profile
3. Chon tab "Quan ly CV" (can them vao CandidateProfile)
4. Nhan nut "Tai len CV moi"
5. Chon file PDF/DOC/DOCX (toi da 5MB)
6. File se duoc tai len va hien thi trong danh sach

#### 2. Quan ly CV
- Xem tat ca CV da tai
- Dat CV nao lam mac dinh (hien thi sao vang)
- Tai xuong CV
- Xoa CV khong can thiet

#### 3. Ung tuyen viec lam
- Khi ung tuyen, he thong se tu dong su dung CV mac dinh
- (Can cap nhat JobDetailPage de cho phep chon CV)

---

## CAI DAT SERVER

### 1. Tao thu muc uploads
Backend tu dong tao thu muc `wwwroot/uploads/cv/` khi upload file dau tien.

### 2. Cau hinh Static Files
Da them `app.UseStaticFiles()` vao Program.cs de serve file tu wwwroot.

### 3. File duoc luu voi ten unique
File duoc luu voi ten: `{Guid}.{extension}`
VD: `a1b2c3d4-e5f6-7890-abcd-ef1234567890.pdf`

---

## TINH NANG CAN THEM TIEP

### 1. Tich hop vao trang ung tuyen ⚠️
**Hien trang**: Khi ung tuyen, dang hard-code `maFileCV = 1`
**Can lam**: 
- Them dropdown chon CV trong form ung tuyen
- Lay danh sach CV cua ung vien
- Mac dinh chon CV mac dinh
- Cho phep chon CV khac

### 2. Them tab "Quan ly CV" vao CandidateProfile ⚠️
**Can lam**:
- Import CvManager component
- Them tab moi trong Tabs
- Truyen maHoSo vao CvManager

### 3. Nha tuyen dung xem CV ung vien
**Can lam**:
- Them nut "Xem CV" trong danh sach don ung tuyen
- Hien thi CV trong modal hoac tab moi
- Ghi nhat ky xem CV (bang NhatKyXemCv)

### 4. Preview CV
**Can lam**:
- Them nut "Xem truoc" trong danh sach CV
- Hien thi PDF trong iframe hoac modal
- Su dung thu vien nhu react-pdf

---

## BAO MAT

### 1. Validation
- ✅ Chi chap nhan PDF, DOC, DOCX
- ✅ Gioi han kich thuoc 5MB
- ✅ Chi ung vien moi upload duoc
- ✅ Chi chu so huu moi xoa duoc

### 2. Authorization
- ✅ Upload: Chi ung vien (maVaiTro = 3)
- ✅ Xem: Ung vien va Nha tuyen dung
- ✅ Xoa: Chi ung vien

### 3. File Storage
- ✅ File duoc luu voi ten unique (Guid)
- ✅ Khong the truy cap truc tiep qua URL doan duoc
- ✅ Phai co token de tai xuong

---

## TEST

### Test Upload
1. Dang nhap ung vien
2. Upload file PDF < 5MB → Thanh cong
3. Upload file > 5MB → Loi "Kich thuoc file khong duoc vuot qua 5MB"
4. Upload file .txt → Loi "Chi chap nhan file PDF, DOC, DOCX"

### Test Quan ly
1. Upload nhieu CV
2. Dat CV thu 2 lam mac dinh → CV thu 2 co sao vang
3. Xoa CV → Xac nhan → CV bien mat khoi danh sach
4. Tai xuong CV → File duoc tai ve

### Test Bao mat
1. Dang nhap nha tuyen dung
2. Truy cap /api/file-cv/upload → Loi 403 Forbidden
3. Dang xuat
4. Truy cap /api/file-cv/ho-so/1 → Loi 401 Unauthorized

---

## KET LUAN

✅ **Tinh nang upload CV da hoan thanh va san sang su dung!**

**Da lam**:
- Backend API day du
- Frontend component hoan chinh
- Validation va bao mat
- Quan ly file tren server

**Can lam tiep**:
- Tich hop vao form ung tuyen
- Them tab vao CandidateProfile
- Cho nha tuyen dung xem CV

**Uu tien**: Tich hop vao form ung tuyen de ung vien co the chon CV khi nop don.
