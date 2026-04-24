# PHAN TICH NGHIEP VU HE THONG TUYEN DUNG BTL_CNW

## 1. TONG QUAN HE THONG

### 1.1. Muc dich
He thong quan ly tuyen dung truc tuyen ket noi giua:
- **Ung vien**: Tim kiem va ung tuyen viec lam
- **Nha tuyen dung (Cong ty)**: Dang tin, quan ly ung vien
- **Admin**: Quan ly va kiem duyet he thong

### 1.2. Cac doi tuong tham gia
1. **Ung vien** (maVaiTro = 3)
2. **Nha tuyen dung** (maVaiTro = 2) 
3. **Admin** (maVaiTro = 1)
4. **Khach** (chua dang nhap)

---

## 2. LUONG NGHIEP VU CHINH

### 2.1. LUONG DANG KY VA DANG NHAP

#### A. Dang ky tai khoan
**Actor**: Khach
**Muc tieu**: Tao tai khoan moi

**Cac buoc**:
1. Khach truy cap trang dang ky
2. Chon vai tro: Ung vien hoac Nha tuyen dung
3. Nhap thong tin:
   - Email (unique)
   - Mat khau (min 6 ky tu)
   - Ho ten
   - So dien thoai
4. He thong kiem tra:
   - Email chua ton tai
   - Mat khau hop le
5. Tao tai khoan thanh cong
6. Tu dong dang nhap

**Ket qua**:
- Tai khoan moi duoc tao
- Nhan token JWT
- Chuyen den trang tuong ung theo vai tro


#### B. Dang nhap
**Actor**: Nguoi dung da dang ky
**Muc tieu**: Truy cap he thong

**Cac buoc**:
1. Nhap email va mat khau
2. He thong xac thuc
3. Tra ve token JWT
4. Luu token va thong tin user vao localStorage
5. Chuyen huong theo vai tro:
   - Admin → /admin/jobs
   - Nha tuyen dung → /company/dashboard
   - Ung vien → /jobs

**Ket qua**: Dang nhap thanh cong, truy cap duoc cac chuc nang

---

### 2.2. LUONG NGHIEP VU UNG VIEN

#### A. Tao ho so ung vien
**Actor**: Ung vien
**Tien quyet**: Da dang nhap
**Muc tieu**: Tao profile de ung tuyen

**Cac buoc**:
1. Vao trang Profile
2. Nhap thong tin co ban:
   - Tieu de (VD: "Senior Java Developer")
   - Tom tat (gioi thieu ban than)
   - Ngay sinh, gioi tinh
   - Dia chi, thanh pho
3. Nhap thong tin lien he:
   - LinkedIn, GitHub, Portfolio
4. Nhap mong muon:
   - Tinh trang tim viec
   - Muc luong mong muon
5. Luu ho so

**Ket qua**: Ho so ung vien duoc tao, co the ung tuyen viec lam

#### B. Upload CV
**Actor**: Ung vien
**Tien quyet**: Da co ho so
**Muc tieu**: Tai len file CV

**Cac buoc**:
1. Vao tab "Quan ly CV"
2. Chon file PDF/DOC/DOCX (max 5MB)
3. He thong kiem tra dinh dang va kich thuoc
4. Upload thanh cong
5. CV dau tien tu dong dat lam mac dinh
6. Co the upload nhieu CV
7. Co the dat CV nao lam mac dinh
8. Co the xoa CV khong can

**Ket qua**: Co file CV de ung tuyen

#### C. Tim kiem viec lam
**Actor**: Ung vien / Khach
**Muc tieu**: Tim viec lam phu hop

**Cac buoc**:
1. Vao trang danh sach viec lam
2. Su dung bo loc:
   - Tim kiem theo tu khoa
   - Loc theo danh muc nghe nghiep
   - Loc theo kinh nghiem
   - Loc theo hinh thuc lam viec
   - Loc theo thanh pho
   - Loc theo muc luong
3. Xem ket qua
4. Click vao tin de xem chi tiet

**Ket qua**: Tim duoc viec lam phu hop

#### D. Ung tuyen viec lam
**Actor**: Ung vien
**Tien quyet**: Da dang nhap, da co ho so va CV
**Muc tieu**: Nop don ung tuyen

**Cac buoc**:
1. Xem chi tiet tin tuyen dung
2. Click "Ung tuyen ngay"
3. Chon CV (mac dinh la CV mac dinh)
4. Viet thu gioi thieu (min 50 ky tu)
5. Nop don
6. He thong tao don ung tuyen voi trang thai "DaNop"

**Ket qua**: Don ung tuyen duoc gui den nha tuyen dung

#### E. Theo doi don ung tuyen
**Actor**: Ung vien
**Muc tieu**: Xem trang thai don da nop

**Cac buoc**:
1. Vao "Don ung tuyen"
2. Xem danh sach don da nop
3. Xem trang thai:
   - DaNop: Moi nop, chua duoc xem
   - DangXem: Nha tuyen dung dang xem xet
   - VaoDanhSach: Duoc chon vao danh sach phong van
   - TuChoi: Bi tu choi
4. Xem chi tiet don

**Ket qua**: Nam duoc trang thai ung tuyen

#### F. Xem lich phong van
**Actor**: Ung vien
**Muc tieu**: Xem lich phong van da duoc sap xep

**Cac buoc**:
1. Vao "Lich phong van"
2. Xem danh sach lich:
   - Vi tri ung tuyen
   - Cong ty
   - Thoi gian, dia diem
   - Hinh thuc (Online/Truc tiep/Dien thoai)
   - Trang thai
3. Chuan bi cho phong van

**Ket qua**: Biet lich phong van, khong bo lo

---

### 2.3. LUONG NGHIEP VU NHA TUYEN DUNG

#### A. Cap nhat thong tin cong ty
**Actor**: Nha tuyen dung
**Tien quyet**: Da dang nhap
**Muc tieu**: Hoan thien profile cong ty

**Cac buoc**:
1. Vao Profile
2. Nhap thong tin cong ty:
   - Ten cong ty
   - Ma so thue
   - Logo
   - Website
   - Linh vuc
   - Quy mo
   - Dia chi, thanh pho
   - Mo ta cong ty
3. Luu thong tin
4. Doi admin duyet (neu can)

**Ket qua**: Profile cong ty hoan chinh, tang uy tin

#### B. Dang tin tuyen dung
**Actor**: Nha tuyen dung
**Muc tieu**: Tim ung vien

**Cac buoc**:
1. Vao Dashboard
2. Click "Dang tin moi"
3. Nhap thong tin:
   - Tieu de vi tri
   - Mo ta cong viec
   - Yeu cau ung vien
   - Quyen loi
   - Hinh thuc lam viec
   - Kinh nghiem yeu cau
   - Muc luong
   - Dia diem, thanh pho
   - Han nop ho so
   - So luong tuyen
4. Luu tin
5. Tin co trang thai "ChoXetDuyet"
6. Doi admin duyet

**Ket qua**: Tin tuyen dung duoc tao, cho duyet

#### C. Quan ly tin tuyen dung
**Actor**: Nha tuyen dung
**Muc tieu**: Sua, xoa tin da dang

**Cac buoc**:
1. Vao Dashboard
2. Xem danh sach tin da dang
3. Loc theo trang thai:
   - ChoXetDuyet: Dang cho admin duyet
   - DaDuyet: Da duoc duyet, dang hien thi
   - TuChoi: Bi admin tu choi
   - DaDong: Da dong tuyen
4. Sua tin: Cap nhat thong tin
5. Xoa tin: Xoa tin khong can
6. Dong tin: Dong tuyen khi du nguoi

**Ket qua**: Quan ly tin tuyen dung hieu qua


#### D. Quan ly don ung tuyen
**Actor**: Nha tuyen dung
**Muc tieu**: Xem va xu ly don ung tuyen

**Cac buoc**:
1. Vao Dashboard
2. Xem thong ke:
   - Tong don ung tuyen
   - Don moi (DaNop)
   - Don dang xem (DangXem)
   - Don vao danh sach (VaoDanhSach)
3. Xem danh sach don theo tin tuyen dung
4. Loc don theo trang thai
5. Xem chi tiet don:
   - Thong tin ung vien
   - CV
   - Thu gioi thieu
6. Cap nhat trang thai don:
   - DaNop → DangXem: Dang xem xet
   - DangXem → VaoDanhSach: Chon vao danh sach phong van
   - DangXem → TuChoi: Tu choi

**Ket qua**: Quan ly don ung tuyen, loc ung vien phu hop

#### E. Sap xep lich phong van
**Actor**: Nha tuyen dung
**Tien quyet**: Don ung tuyen co trang thai "VaoDanhSach"
**Muc tieu**: Hen lich phong van ung vien

**Cac buoc**:
1. Vao "Lich phong van"
2. Click "Tao lich phong van"
3. Chon don ung tuyen
4. Nhap thong tin:
   - Vong phong van (1, 2, 3...)
   - Hinh thuc (Online/Truc tiep/Dien thoai)
   - Thoi gian
   - Thoi luong (phut)
   - Dia diem (neu truc tiep) hoac link (neu online)
   - Ghi chu
5. Tao lich
6. Ung vien se thay lich trong he thong

**Ket qua**: Lich phong van duoc sap xep

#### F. Quan ly lich phong van
**Actor**: Nha tuyen dung
**Muc tieu**: Theo doi va cap nhat lich

**Cac buoc**:
1. Xem danh sach lich phong van
2. Loc theo trang thai:
   - ChuaPhongVan: Chua den gio
   - DaPhongVan: Da phong van xong
   - HuyBo: Da huy
   - DoiLich: Can doi lich
3. Cap nhat trang thai sau phong van
4. Ghi ket qua phong van (neu co)

**Ket qua**: Quan ly lich phong van tot

#### G. Xem thong ke Dashboard
**Actor**: Nha tuyen dung
**Muc tieu**: Nam bat tinh hinh tuyen dung

**Thong ke hien thi**:
1. Tin tuyen dung:
   - Tong tin dang
   - Tin dang tuyen
   - Tin da dong
   - Tin cho xet duyet
2. Don ung tuyen:
   - Tong don
   - Don moi
   - Don dang xem
   - Don vao danh sach
3. Luot xem:
   - Tong luot xem tin
4. Lich phong van:
   - Lich hom nay
   - Lich tuan nay
5. Bieu do:
   - Luot xem theo ngay
   - Don ung tuyen theo thang

**Ket qua**: Danh gia hieu qua tuyen dung

---

### 2.4. LUONG NGHIEP VU ADMIN

#### A. Duyet tin tuyen dung
**Actor**: Admin
**Muc tieu**: Kiem duyet tin truoc khi hien thi

**Cac buoc**:
1. Vao "Quan ly tin"
2. Xem danh sach tin cho duyet (ChoXetDuyet)
3. Xem chi tiet tin:
   - Tieu de, mo ta
   - Yeu cau, quyen loi
   - Thong tin cong ty
4. Quyet dinh:
   - **Duyet**: Tin duoc hien thi tren trang viec lam
   - **Tu choi**: Nhap ly do tu choi
5. Cap nhat trang thai tin

**Ket qua**: 
- Tin duyet: Hien thi cho ung vien
- Tin tu choi: Nha tuyen dung biet ly do, sua lai

#### B. Quan ly tat ca tin tuyen dung
**Actor**: Admin
**Muc tieu**: Giam sat toan bo tin tren he thong

**Cac buoc**:
1. Xem tat ca tin (khong phan biet trang thai)
2. Xem thong ke:
   - Tong tin
   - Tin cho duyet
   - Tin da duyet
   - Tin tu choi
3. Loc theo trang thai
4. Tim kiem tin
5. Xem chi tiet bat ky tin nao

**Ket qua**: Nam bat toan bo hoat dong dang tin

#### C. Duyet cong ty (Chua implement)
**Actor**: Admin
**Muc tieu**: Xac minh cong ty that

**Cac buoc** (Du kien):
1. Xem danh sach cong ty cho duyet
2. Kiem tra thong tin:
   - Ma so thue
   - Dia chi
   - Website
3. Duyet hoac tu choi
4. Cong ty duyet moi dang duoc tin

**Ket qua**: Dam bao cong ty uy tin

#### D. Quan ly nguoi dung (Chua implement)
**Actor**: Admin
**Muc tieu**: Quan ly tai khoan

**Cac buoc** (Du kien):
1. Xem danh sach nguoi dung
2. Loc theo vai tro
3. Khoa/Mo khoa tai khoan
4. Xoa tai khoan vi pham
5. Xem hoat dong nguoi dung

**Ket qua**: He thong sach, khong spam

---

## 3. QUY TAC NGHIEP VU

### 3.1. Quy tac ve Tai khoan
1. Email phai unique (khong trung)
2. Mat khau toi thieu 6 ky tu
3. Moi nguoi dung chi co 1 vai tro
4. Khong doi vai tro sau khi dang ky

### 3.2. Quy tac ve Ho so Ung vien
1. Moi ung vien chi co 1 ho so
2. Phai co ho so moi ung tuyen duoc
3. Co the co nhieu CV
4. Chi co 1 CV mac dinh tai 1 thoi diem
5. CV phai la PDF, DOC, DOCX, max 5MB

### 3.3. Quy tac ve Tin tuyen dung
1. Tin moi co trang thai "ChoXetDuyet"
2. Chi tin "DaDuyet" moi hien thi cho ung vien
3. Tin "TuChoi" khong hien thi, nha tuyen dung phai sua
4. Han nop ho so phai lon hon ngay hien tai
5. Muc luong toi thieu <= Muc luong toi da
6. So luong tuyen >= 1

### 3.4. Quy tac ve Don ung tuyen
1. Moi ung vien chi ung tuyen 1 lan cho 1 tin
2. Khong ung tuyen lai tin da ung tuyen
3. Phai chon CV khi ung tuyen
4. Thu gioi thieu toi thieu 50 ky tu
5. Trang thai don theo thu tu:
   - DaNop → DangXem → VaoDanhSach → (Phong van)
   - DaNop → DangXem → TuChoi

### 3.5. Quy tac ve Lich phong van
1. Chi tao lich cho don co trang thai "VaoDanhSach"
2. Thoi gian phong van phai lon hon thoi gian hien tai
3. Thoi luong toi thieu 15 phut
4. Co the co nhieu vong phong van (1, 2, 3...)
5. Moi don co the co nhieu lich (cac vong khac nhau)

### 3.6. Quy tac ve Phan quyen
1. **Khach** (chua dang nhap):
   - Xem danh sach viec lam
   - Xem chi tiet viec lam
   - Dang ky, dang nhap

2. **Ung vien** (maVaiTro = 3):
   - Tat ca quyen cua Khach
   - Tao/sua ho so
   - Upload/quan ly CV
   - Ung tuyen viec lam
   - Xem don da nop
   - Xem lich phong van
   - Cap nhat profile

3. **Nha tuyen dung** (maVaiTro = 2):
   - Dang tin tuyen dung
   - Sua/xoa tin cua minh
   - Xem don ung tuyen
   - Cap nhat trang thai don
   - Tao lich phong van
   - Xem thong ke
   - Cap nhat thong tin cong ty

4. **Admin** (maVaiTro = 1):
   - Duyet/tu choi tin tuyen dung
   - Xem tat ca tin
   - Duyet cong ty (chua co)
   - Quan ly nguoi dung (chua co)

---

## 4. TRANG THAI VA CHUYEN DOI

### 4.1. Trang thai Tin tuyen dung
```
[Tao moi] → ChoXetDuyet
           ↓
    [Admin duyet] → DaDuyet → [Hien thi cho ung vien]
           ↓
    [Admin tu choi] → TuChoi → [Nha tuyen dung sua]
           
[Nha tuyen dung dong] → DaDong
[Het han nop] → HetHan
```

### 4.2. Trang thai Don ung tuyen
```
[Ung vien nop] → DaNop
                  ↓
[Nha tuyen dung xem] → DangXem
                        ↓
            [Chon] → VaoDanhSach → [Tao lich phong van]
                        ↓
            [Khong chon] → TuChoi
```

### 4.3. Trang thai Lich phong van
```
[Tao lich] → ChuaPhongVan
              ↓
[Den gio] → [Phong van]
              ↓
[Hoan thanh] → DaPhongVan
              ↓
[Can doi] → DoiLich
              ↓
[Khong den] → HuyBo
```
