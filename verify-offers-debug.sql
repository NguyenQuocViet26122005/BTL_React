-- KIEM TRA DAY DU DE DEBUG THU MOI KHONG HIEN THI
USE QuanLyViecLam;
GO

PRINT '=== 1. KIEM TRA THU MOI TRONG DATABASE ===';
SELECT 
    tm.MaThuMoi,
    tm.MaDon,
    tm.ViTriCongViec,
    tm.MucLuong,
    tm.TrangThai,
    tm.NgayTao
FROM ThuMoiLamViec tm
WHERE tm.MaThuMoi IN (2, 3);

PRINT '';
PRINT '=== 2. KIEM TRA DON UNG TUYEN LIEN QUAN ===';
SELECT 
    d.MaDon,
    d.MaTin,
    d.MaUngVien,
    uv.HoTen as TenUngVien
FROM DonUngTuyen d
LEFT JOIN NguoiDung uv ON d.MaUngVien = uv.MaNguoiDung
WHERE d.MaDon IN (4, 6);

PRINT '';
PRINT '=== 3. KIEM TRA TIN TUYEN DUNG VA CONG TY ===';
SELECT 
    t.MaTin,
    t.TieuDe,
    t.MaCongTy,
    c.TenCongTy,
    c.MaChuSoHuu,
    nd.Email as EmailChuSoHuu,
    nd.HoTen as TenChuSoHuu
FROM TinTuyenDung t
INNER JOIN CongTy c ON t.MaCongTy = c.MaCongTy
INNER JOIN NguoiDung nd ON c.MaChuSoHuu = nd.MaNguoiDung
WHERE t.MaTin IN (
    SELECT MaTin FROM DonUngTuyen WHERE MaDon IN (4, 6)
);

PRINT '';
PRINT '=== 4. KIEM TRA FULL JOIN - THU MOI -> DON -> TIN -> CONG TY ===';
SELECT 
    tm.MaThuMoi,
    tm.MaDon,
    tm.ViTriCongViec,
    tm.TrangThai,
    d.MaTin,
    t.TieuDe as TenTin,
    t.MaCongTy,
    c.TenCongTy,
    c.MaChuSoHuu as MaChuSoHuuCongTy,
    nd.Email as EmailChuSoHuu
FROM ThuMoiLamViec tm
LEFT JOIN DonUngTuyen d ON tm.MaDon = d.MaDon
LEFT JOIN TinTuyenDung t ON d.MaTin = t.MaTin
LEFT JOIN CongTy c ON t.MaCongTy = c.MaCongTy
LEFT JOIN NguoiDung nd ON c.MaChuSoHuu = nd.MaNguoiDung
WHERE tm.MaThuMoi IN (2, 3);

PRINT '';
PRINT '=== 5. KIEM TRA TAT CA CONG TY ===';
SELECT 
    c.MaCongTy,
    c.TenCongTy,
    c.MaChuSoHuu,
    nd.Email as EmailChuSoHuu,
    nd.HoTen as TenChuSoHuu,
    nd.MaVaiTro
FROM CongTy c
INNER JOIN NguoiDung nd ON c.MaChuSoHuu = nd.MaNguoiDung;

PRINT '';
PRINT '=== 6. TEST API QUERY - LAY THU MOI THEO CONG TY ===';
-- Gia su MaCongTy = 1 (thay doi theo ket qua tren)
DECLARE @TestMaCongTy INT = 1;

SELECT 
    tm.MaThuMoi,
    tm.MaDon,
    tm.ViTriCongViec,
    tm.MucLuong,
    tm.TrangThai,
    uv.HoTen as TenUngVien,
    c.TenCongTy
FROM ThuMoiLamViec tm
INNER JOIN DonUngTuyen d ON tm.MaDon = d.MaDon
INNER JOIN NguoiDung uv ON d.MaUngVien = uv.MaNguoiDung
INNER JOIN TinTuyenDung t ON d.MaTin = t.MaTin
INNER JOIN CongTy c ON t.MaCongTy = c.MaCongTy
WHERE t.MaCongTy = @TestMaCongTy
ORDER BY tm.NgayTao DESC;
