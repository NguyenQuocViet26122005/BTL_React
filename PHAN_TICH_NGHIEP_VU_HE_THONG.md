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


---

## 5. CAC TRUONG HOP DAC BIET

### 5.1. Truong hop Ung vien
1. **Ung tuyen nhung chua co ho so**:
   - He thong yeu cau tao ho so truoc
   - Chuyen den trang tao ho so

2. **Ung tuyen nhung chua co CV**:
   - He thong yeu cau upload CV truoc
   - Chuyen den trang quan ly CV

3. **Ung tuyen tin da ung tuyen**:
   - He thong bao loi "Da ung tuyen tin nay"
   - Khong cho ung tuyen lai

4. **Ung tuyen tin het han**:
   - He thong bao loi "Tin da het han nop ho so"
   - Khong cho ung tuyen

5. **Xem lich phong van nhung chua co lich**:
   - Hien thi "Chua co lich phong van nao"
   - Goi y tim viec va ung tuyen

### 5.2. Truong hop Nha tuyen dung
1. **Dang tin nhung chua co thong tin cong ty**:
   - He thong yeu cau cap nhat thong tin cong ty
   - Chuyen den trang profile

2. **Tin bi admin tu choi**:
   - Nha tuyen dung thay ly do tu choi
   - Sua tin va gui lai de duyet

3. **Khong co don ung tuyen nao**:
   - Dashboard hien thi 0
   - Goi y kiem tra tin co hap dan khong

4. **Tao lich cho don chua vao danh sach**:
   - He thong bao loi
   - Yeu cau cap nhat trang thai don truoc

5. **Xoa tin da co don ung tuyen**:
   - He thong canh bao
   - Yeu cau xac nhan
   - Cac don lien quan van ton tai

### 5.3. Truong hop Admin
1. **Duyet tin khong hop le**:
   - Admin tu choi va ghi ro ly do
   - Nha tuyen dung sua lai

2. **Tin spam hoac lua dao**:
   - Admin tu choi vinh vien
   - Co the khoa tai khoan cong ty

3. **Nhieu tin cho duyet cung luc**:
   - Hien thi danh sach uu tien theo ngay tao
   - Duyet lan luot

---

## 6. TICH HOP VA TUONG TAC

### 6.1. Event Bus (Real-time updates)
He thong su dung Event Bus de dong bo du lieu:

1. **JOB_CREATED**: Khi tao tin moi
   - Dashboard cap nhat so luong tin
   - Danh sach tin tu dong refresh

2. **JOB_UPDATED**: Khi sua tin
   - Danh sach tin cap nhat
   - Chi tiet tin cap nhat

3. **JOB_DELETED**: Khi xoa tin
   - Danh sach tin cap nhat
   - Dashboard cap nhat thong ke

4. **APPLICATION_SUBMITTED**: Khi nop don
   - Dashboard nha tuyen dung cap nhat so don moi
   - Danh sach don tu dong refresh

5. **APPLICATION_UPDATED**: Khi cap nhat trang thai don
   - Danh sach don cap nhat
   - Thong ke cap nhat

6. **INTERVIEW_CREATED**: Khi tao lich phong van
   - Danh sach lich cap nhat
   - Ung vien thay lich moi

7. **INTERVIEW_UPDATED**: Khi cap nhat lich
   - Danh sach lich cap nhat
   - Thong bao cho ung vien (neu co)

### 6.2. Luong du lieu
```
[Ung vien] → [Don ung tuyen] → [Nha tuyen dung]
                ↓
         [Lich phong van]
                ↓
         [Ket qua phong van]
                ↓
         [Tuyen dung/Tu choi]
```

---

## 7. BAO CAO VA THONG KE

### 7.1. Thong ke cho Nha tuyen dung
1. **Tong quan**:
   - So tin dang tuyen
   - So don ung tuyen
   - So lich phong van
   - Luot xem tin

2. **Bieu do**:
   - Luot xem theo ngay (7 ngay gan nhat)
   - Don ung tuyen theo thang (6 thang gan nhat)

3. **Hieu qua tuyen dung**:
   - Ty le chuyen doi: Luot xem → Don ung tuyen
   - Thoi gian trung binh xu ly don
   - Ty le ung vien dat phong van

### 7.2. Thong ke cho Admin (Chua implement)
1. **Tong quan he thong**:
   - Tong nguoi dung
   - Tong cong ty
   - Tong tin tuyen dung
   - Tong don ung tuyen

2. **Hoat dong**:
   - Nguoi dung moi theo ngay
   - Tin moi theo ngay
   - Don moi theo ngay

3. **Chat luong**:
   - Ty le tin bi tu choi
   - Ty le cong ty uy tin
   - Ty le ung vien thanh cong

---

## 8. TINH NANG MO RONG (Chua implement)

### 8.1. Luu tin yeu thich
**Muc dich**: Ung vien luu tin de xem lai sau
**Nghiep vu**:
- Ung vien click "Luu tin"
- Tin duoc luu vao danh sach yeu thich
- Xem lai trong "Tin da luu"
- Bo luu khi khong quan tam

### 8.2. Goi y viec lam
**Muc dich**: Goi y viec phu hop cho ung vien
**Nghiep vu**:
- He thong phan tich ho so ung vien
- Tim tin tuyen dung phu hop:
  - Theo ky nang
  - Theo kinh nghiem
  - Theo muc luong mong muon
  - Theo dia diem
- Hien thi danh sach goi y
- Ung vien ung tuyen truc tiep

### 8.3. Nhat ky xem CV
**Muc dich**: Ung vien biet ai da xem CV
**Nghiep vu**:
- Nha tuyen dung xem CV ung vien
- He thong ghi nhat ky
- Ung vien xem duoc:
  - Cong ty nao da xem
  - Thoi gian xem
  - So lan xem

### 8.4. Thu moi lam viec
**Muc dich**: Nha tuyen dung moi ung vien truc tiep
**Nghiep vu**:
- Nha tuyen dung tim kiem ung vien
- Gui thu moi cho ung vien phu hop
- Ung vien nhan thong bao
- Ung vien xem thu moi
- Ung vien chap nhan hoac tu choi

### 8.5. Ket qua phong van
**Muc dich**: Ghi nhan ket qua sau phong van
**Nghiep vu**:
- Sau phong van, nha tuyen dung ghi ket qua:
  - Danh gia (1-5 sao)
  - Nhan xet
  - Quyet dinh: Qua vong / Khong qua
- Neu qua vong, tao lich vong tiep theo
- Neu khong qua, cap nhat trang thai don "TuChoi"
- Neu qua tat ca vong, tuyen dung

### 8.6. Quan ly ky nang, hoc van, kinh nghiem
**Muc dich**: Ho so ung vien day du hon
**Nghiep vu**:
- Ung vien them ky nang:
  - Ten ky nang
  - Muc do (1-5)
- Ung vien them hoc van:
  - Truong
  - Chuyen nganh
  - Bang cap
  - Thoi gian
- Ung vien them kinh nghiem:
  - Cong ty
  - Vi tri
  - Mo ta cong viec
  - Thoi gian

### 8.7. Thong bao
**Muc dich**: Cap nhat thong tin kip thoi
**Nghiep vu**:
- He thong gui thong bao khi:
  - Co don ung tuyen moi (cho nha tuyen dung)
  - Trang thai don thay doi (cho ung vien)
  - Co lich phong van moi (cho ung vien)
  - Lich phong van thay doi (cho ung vien)
  - Tin bi tu choi (cho nha tuyen dung)
  - Tin duoc duyet (cho nha tuyen dung)
- Nguoi dung xem thong bao
- Danh dau da doc

### 8.8. Email thong bao
**Muc dich**: Thong bao qua email
**Nghiep vu**:
- Gui email khi co su kien quan trong
- Email chua link den he thong
- Nguoi dung click link de xem chi tiet

---

## 9. KET LUAN

### 9.1. Diem manh cua he thong
1. ✅ Luong nghiep vu ro rang, logic
2. ✅ Phan quyen ro ret
3. ✅ Trang thai chuyen doi hop ly
4. ✅ Co kiem duyet (Admin) dam bao chat luong
5. ✅ Event Bus giup dong bo du lieu real-time
6. ✅ Dashboard truc quan, thong ke tot

### 9.2. Diem can cai thien
1. ⚠️ Chua co thong bao real-time
2. ⚠️ Chua co email thong bao
3. ⚠️ Chua co goi y viec lam thong minh
4. ⚠️ Chua co tim kiem ung vien cho nha tuyen dung
5. ⚠️ Chua co quan ly ky nang, hoc van chi tiet
6. ⚠️ Chua co ket qua phong van

### 9.3. Uu tien phat trien
**Uu tien cao** (1-2 tuan):
1. Tich hop CV vao form ung tuyen
2. Them tab quan ly CV vao profile
3. Cho nha tuyen dung xem CV ung vien

**Uu tien trung binh** (2-4 tuan):
1. Quan ly ky nang, hoc van, kinh nghiem
2. Ket qua phong van
3. He thong thong bao
4. Luu tin yeu thich

**Uu tien thap** (1+ thang):
1. Goi y viec lam
2. Email thong bao
3. Tim kiem ung vien
4. Thu moi lam viec
5. Nhat ky xem CV

---

## PHU LUC: SO DO NGHIEP VU

### A. So do Use Case tong quan
```
[Khach]
  - Xem viec lam
  - Tim kiem viec lam
  - Dang ky
  - Dang nhap

[Ung vien] (ke thua Khach)
  - Tao ho so
  - Upload CV
  - Ung tuyen
  - Xem don da nop
  - Xem lich phong van
  - Cap nhat profile

[Nha tuyen dung]
  - Dang tin tuyen dung
  - Quan ly tin
  - Xem don ung tuyen
  - Cap nhat trang thai don
  - Tao lich phong van
  - Xem thong ke
  - Cap nhat thong tin cong ty

[Admin]
  - Duyet tin tuyen dung
  - Tu choi tin
  - Xem tat ca tin
  - Quan ly he thong
```

### B. Quan he giua cac doi tuong
```
NguoiDung (1) ----< (n) HoSoUngVien
HoSoUngVien (1) ----< (n) FileCv
NguoiDung (1) ----< (n) DonUngTuyen
TinTuyenDung (1) ----< (n) DonUngTuyen
FileCv (1) ----< (n) DonUngTuyen
DonUngTuyen (1) ----< (n) LichPhongVan
CongTy (1) ----< (n) TinTuyenDung
NguoiDung (1) ----< (1) CongTy
```

### C. Chu trinh song cua Don ung tuyen
```
1. Ung vien tao ho so
2. Ung vien upload CV
3. Ung vien tim viec lam
4. Ung vien ung tuyen (tao Don)
5. Nha tuyen dung xem don
6. Nha tuyen dung cap nhat trang thai
7. Nha tuyen dung tao lich phong van
8. Phong van
9. Ghi ket qua
10. Tuyen dung hoac tu choi
```

---

**Ket thuc phan tich nghiep vu**
