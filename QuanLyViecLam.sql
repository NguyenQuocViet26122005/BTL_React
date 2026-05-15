-- ============================================================
--  CƠ SỞ DỮ LIỆU HỆ THỐNG QUẢN LÝ VIỆC LÀM TRỰC TUYẾN
--  (Job Portal)  –  T-SQL / SQL Server
--  Vai trò: QuanTriVien | NhaTuyenDung | UngVien
-- ============================================================

USE master;
GO

IF EXISTS (SELECT name FROM sys.databases WHERE name = N'QuanLyViecLam')
    DROP DATABASE QuanLyViecLam;
GO

CREATE DATABASE QuanLyViecLam
    COLLATE Vietnamese_CI_AS;
GO

USE QuanLyViecLam;
GO

-- ============================================================
-- 1. VAI TRÒ & NGƯỜI DÙNG
-- ============================================================

CREATE TABLE VaiTro (
    MaVaiTro    INT IDENTITY(1,1) PRIMARY KEY,
    TenVaiTro   NVARCHAR(20)  NOT NULL UNIQUE
                    CHECK (TenVaiTro IN (N'QuanTriVien', N'NhaTuyenDung', N'UngVien')),
    MoTa        NVARCHAR(255)
);
GO

CREATE TABLE NguoiDung (
    MaNguoiDung     INT IDENTITY(1,1) PRIMARY KEY,
    MaVaiTro        INT           NOT NULL,
    HoTen           NVARCHAR(150) NOT NULL,
    Email           NVARCHAR(255) NOT NULL UNIQUE,
    SoDienThoai     NVARCHAR(20),
    MatKhauMaHoa    NVARCHAR(255) NOT NULL,
    AnhDaiDien      NVARCHAR(500),
    DangHoatDong    BIT           NOT NULL DEFAULT 1,
    DaXacThucEmail  BIT           NOT NULL DEFAULT 0,
    NgayTao         DATETIME2     NOT NULL DEFAULT SYSDATETIME(),
    NgayCapNhat     DATETIME2     NOT NULL DEFAULT SYSDATETIME(),
    CONSTRAINT fk_NguoiDung_VaiTro FOREIGN KEY (MaVaiTro) REFERENCES VaiTro(MaVaiTro)
);
GO

CREATE TRIGGER trg_NguoiDung_CapNhat
ON NguoiDung AFTER UPDATE AS
BEGIN
    SET NOCOUNT ON;
    UPDATE NguoiDung SET NgayCapNhat = SYSDATETIME()
    FROM NguoiDung nd INNER JOIN inserted i ON nd.MaNguoiDung = i.MaNguoiDung;
END;
GO

-- ============================================================
-- 2. CÔNG TY
-- ============================================================

CREATE TABLE LinhVuc (
    MaLinhVuc  INT IDENTITY(1,1) PRIMARY KEY,
    TenLinhVuc NVARCHAR(100) NOT NULL UNIQUE
);
GO

CREATE TABLE CongTy (
    MaCongTy       INT IDENTITY(1,1) PRIMARY KEY,
    MaChuSoHuu     INT           NOT NULL,   -- NguoiDung có vai trò NhaTuyenDung
    TenCongTy      NVARCHAR(255) NOT NULL,
    MaSoThue       NVARCHAR(50)  UNIQUE,
    Logo           NVARCHAR(500),
    Website        NVARCHAR(500),
    MaLinhVuc      INT,
    QuyMo          NVARCHAR(10)
                       CHECK (QuyMo IN ('1-10','11-50','51-200','201-500','500+')),
    DiaChi         NVARCHAR(MAX),
    ThanhPho       NVARCHAR(100),
    QuocGia        NVARCHAR(100)  DEFAULT N'Việt Nam',
    MoTa           NVARCHAR(MAX),
    DaDuocDuyet    BIT            NOT NULL DEFAULT 0,   -- QuanTriVien duyệt
    NgayTao        DATETIME2      NOT NULL DEFAULT SYSDATETIME(),
    NgayCapNhat    DATETIME2      NOT NULL DEFAULT SYSDATETIME(),
    CONSTRAINT fk_CongTy_ChuSoHuu FOREIGN KEY (MaChuSoHuu) REFERENCES NguoiDung(MaNguoiDung),
    CONSTRAINT fk_CongTy_LinhVuc  FOREIGN KEY (MaLinhVuc)  REFERENCES LinhVuc(MaLinhVuc)
);
GO

CREATE TRIGGER trg_CongTy_CapNhat
ON CongTy AFTER UPDATE AS
BEGIN
    SET NOCOUNT ON;
    UPDATE CongTy SET NgayCapNhat = SYSDATETIME()
    FROM CongTy ct INNER JOIN inserted i ON ct.MaCongTy = i.MaCongTy;
END;
GO

-- ============================================================
-- 3. KỸ NĂNG
-- ============================================================

CREATE TABLE KyNang (
    MaKyNang  INT IDENTITY(1,1) PRIMARY KEY,
    TenKyNang NVARCHAR(100) NOT NULL UNIQUE
);
GO

-- ============================================================
-- 4. DANH MỤC VIỆC LÀM & TIN TUYỂN DỤNG
-- ============================================================

CREATE TABLE DanhMucViecLam (
    MaDanhMuc    INT IDENTITY(1,1) PRIMARY KEY,
    TenDanhMuc   NVARCHAR(100) NOT NULL UNIQUE,
    MaDanhMucCha INT,
    CONSTRAINT fk_DanhMuc_Cha FOREIGN KEY (MaDanhMucCha) REFERENCES DanhMucViecLam(MaDanhMuc)
);
GO

CREATE TABLE TinTuyenDung (
    MaTin               INT IDENTITY(1,1) PRIMARY KEY,
    MaCongTy            INT           NOT NULL,
    MaNguoiDang         INT           NOT NULL,   -- NhaTuyenDung
    MaDanhMuc           INT,
    TieuDe              NVARCHAR(255) NOT NULL,
    MoTa                NVARCHAR(MAX) NOT NULL,
    YeuCau              NVARCHAR(MAX),
    QuyenLoi            NVARCHAR(MAX),
    HinhThucLamViec     NVARCHAR(20)  NOT NULL DEFAULT N'ToanThoiGian'
                            CHECK (HinhThucLamViec IN (N'ToanThoiGian',N'BanThoiGian',
                                                       N'ThucTap',N'FreeLance',N'Remote')),
    KinhNghiem          NVARCHAR(20)  DEFAULT N'MoiRa'
                            CHECK (KinhNghiem IN (N'MoiRa',N'Junior',N'Mid',
                                                  N'Senior',N'TruongNhom',N'QuanLy')),
    MucLuongToiThieu    DECIMAL(15,2),
    MucLuongToiDa       DECIMAL(15,2),
    DonViTien           NVARCHAR(10)  DEFAULT N'VND',
    DiaDiem             NVARCHAR(255),
    ThanhPho            NVARCHAR(100),
    HanNopHoSo         DATE,
    SoLuongTuyen        INT           DEFAULT 1,
    TrangThai           NVARCHAR(20)  NOT NULL DEFAULT N'ChoXetDuyet'
                            CHECK (TrangThai IN (N'BanNhap',N'ChoXetDuyet',N'DaDuyet',
                                                 N'TuChoi',N'DaDong',N'HetHan')),
    LyDoTuChoi          NVARCHAR(MAX),
    LuotXem             INT           NOT NULL DEFAULT 0,
    NgayTao             DATETIME2     NOT NULL DEFAULT SYSDATETIME(),
    NgayCapNhat         DATETIME2     NOT NULL DEFAULT SYSDATETIME(),
    CONSTRAINT fk_TinTD_CongTy   FOREIGN KEY (MaCongTy)     REFERENCES CongTy(MaCongTy),
    CONSTRAINT fk_TinTD_NguoiDang FOREIGN KEY (MaNguoiDang) REFERENCES NguoiDung(MaNguoiDung),
    CONSTRAINT fk_TinTD_DanhMuc  FOREIGN KEY (MaDanhMuc)    REFERENCES DanhMucViecLam(MaDanhMuc)
);
GO

CREATE TRIGGER trg_TinTuyenDung_CapNhat
ON TinTuyenDung AFTER UPDATE AS
BEGIN
    SET NOCOUNT ON;
    UPDATE TinTuyenDung SET NgayCapNhat = SYSDATETIME()
    FROM TinTuyenDung t INNER JOIN inserted i ON t.MaTin = i.MaTin;
END;
GO

-- Kỹ năng yêu cầu cho mỗi tin tuyển dụng
CREATE TABLE KyNangTin (
    MaTin     INT NOT NULL,
    MaKyNang  INT NOT NULL,
    CONSTRAINT pk_KyNangTin PRIMARY KEY (MaTin, MaKyNang),
    CONSTRAINT fk_KNT_Tin  FOREIGN KEY (MaTin)    REFERENCES TinTuyenDung(MaTin) ON DELETE CASCADE,
    CONSTRAINT fk_KNT_Ky   FOREIGN KEY (MaKyNang) REFERENCES KyNang(MaKyNang)
);
GO

-- Full-text search cho tìm kiếm tin tuyển dụng
-- Tạo unique index riêng (bắt buộc cho Full-text key index)
CREATE UNIQUE INDEX uix_TinTuyenDung_MaTin ON TinTuyenDung(MaTin);
GO
-- Fix lỗi 7642: kiểm tra trước khi tạo catalog
IF NOT EXISTS (SELECT 1 FROM sys.fulltext_catalogs WHERE name = 'ftc_TinTuyenDung')
BEGIN
    CREATE FULLTEXT CATALOG ftc_TinTuyenDung AS DEFAULT;
END;
GO
-- Fix lỗi 7653: dùng tên unique index thay vì tên constraint PK
IF NOT EXISTS (SELECT 1 FROM sys.fulltext_indexes fi
               JOIN sys.tables t ON fi.object_id = t.object_id
               WHERE t.name = 'TinTuyenDung')
BEGIN
    CREATE FULLTEXT INDEX ON TinTuyenDung(TieuDe, MoTa)
        KEY INDEX uix_TinTuyenDung_MaTin
        ON ftc_TinTuyenDung
        WITH CHANGE_TRACKING AUTO;
END;
GO

-- ============================================================
-- 5. HỒ SƠ ỨNG VIÊN & CV
-- ============================================================

CREATE TABLE HoSoUngVien (
    MaHoSo          INT IDENTITY(1,1) PRIMARY KEY,
    MaNguoiDung     INT           NOT NULL UNIQUE,
    TieuDe          NVARCHAR(255),
    TomTat          NVARCHAR(MAX),
    NgaySinh        DATE,
    GioiTinh        NVARCHAR(10)  CHECK (GioiTinh IN (N'Nam',N'Nu',N'Khac')),
    DiaChi          NVARCHAR(MAX),
    ThanhPho        NVARCHAR(100),
    LinkedIn        NVARCHAR(500),
    GitHub          NVARCHAR(500),
    Portfolio       NVARCHAR(500),
    TinhTrangTimViec NVARCHAR(20) DEFAULT N'SanSang'
                        CHECK (TinhTrangTimViec IN (N'SanSang',N'Thang1',N'Thang3',N'KhongTimViec')),
    MucLuongMongMuon DECIMAL(15,2),
    NgayTao         DATETIME2     NOT NULL DEFAULT SYSDATETIME(),
    NgayCapNhat     DATETIME2     NOT NULL DEFAULT SYSDATETIME(),
    CONSTRAINT fk_HoSo_NguoiDung FOREIGN KEY (MaNguoiDung) REFERENCES NguoiDung(MaNguoiDung)
);
GO

-- Kỹ năng của ứng viên (dùng để gợi ý việc làm)
CREATE TABLE KyNangUngVien (
    MaHoSo    INT          NOT NULL,
    MaKyNang  INT          NOT NULL,
    TrinhDo   NVARCHAR(20) DEFAULT N'TrungBinh'
                  CHECK (TrinhDo IN (N'CoBan',N'TrungBinh',N'NangCao',N'ChuyenGia')),
    CONSTRAINT pk_KyNangUngVien PRIMARY KEY (MaHoSo, MaKyNang),
    CONSTRAINT fk_KNUV_HoSo  FOREIGN KEY (MaHoSo)   REFERENCES HoSoUngVien(MaHoSo) ON DELETE CASCADE,
    CONSTRAINT fk_KNUV_KyNang FOREIGN KEY (MaKyNang) REFERENCES KyNang(MaKyNang)
);
GO

-- Học vấn
CREATE TABLE HocVan (
    MaHocVan    INT IDENTITY(1,1) PRIMARY KEY,
    MaHoSo      INT           NOT NULL,
    TruongHoc   NVARCHAR(255) NOT NULL,
    BangCap     NVARCHAR(100),
    ChuyenNganh NVARCHAR(150),
    DiemTrungBinh DECIMAL(4,2),
    NgayBatDau  DATE,
    NgayKetThuc DATE,
    DangHocKhong BIT          DEFAULT 0,
    CONSTRAINT fk_HocVan_HoSo FOREIGN KEY (MaHoSo) REFERENCES HoSoUngVien(MaHoSo) ON DELETE CASCADE
);
GO

-- Kinh nghiệm làm việc
CREATE TABLE KinhNghiemLamViec (
    MaKinhNghiem INT IDENTITY(1,1) PRIMARY KEY,
    MaHoSo       INT           NOT NULL,
    TenCongTy    NVARCHAR(255) NOT NULL,
    ViTri        NVARCHAR(255) NOT NULL,
    MoTa         NVARCHAR(MAX),
    NgayBatDau   DATE,
    NgayKetThuc  DATE,
    DangLamKhong BIT           DEFAULT 0,
    CONSTRAINT fk_KNLV_HoSo FOREIGN KEY (MaHoSo) REFERENCES HoSoUngVien(MaHoSo) ON DELETE CASCADE
);
GO

-- File CV / Resume (upload)
CREATE TABLE FileCV (
    MaFileCV    INT IDENTITY(1,1) PRIMARY KEY,
    MaHoSo      INT           NOT NULL,
    TenFile     NVARCHAR(255) NOT NULL,
    DuongDanFile NVARCHAR(500) NOT NULL,   -- lưu path trên S3 / Azure Blob / MinIO
    KichThuoc   INT,                       -- bytes
    LoaiFile    NVARCHAR(100) DEFAULT N'application/pdf',
    LaMacDinh   BIT           NOT NULL DEFAULT 0,
    NgayTai     DATETIME2     NOT NULL DEFAULT SYSDATETIME(),
    CONSTRAINT fk_FileCV_HoSo FOREIGN KEY (MaHoSo) REFERENCES HoSoUngVien(MaHoSo) ON DELETE CASCADE
);
GO

-- ============================================================
-- 6. ĐƠN ỨNG TUYỂN
-- ============================================================

CREATE TABLE DonUngTuyen (
    MaDon           INT IDENTITY(1,1) PRIMARY KEY,
    MaTin           INT           NOT NULL,
    MaUngVien       INT           NOT NULL,   -- NguoiDung vai trò UngVien
    MaFileCV        INT           NOT NULL,
    ThuGioiThieu    NVARCHAR(MAX),
    TrangThai       NVARCHAR(20)  NOT NULL DEFAULT N'DaNop'
                        CHECK (TrangThai IN (N'DaNop',N'DangXem',N'VaoDanhSach',
                                             N'TuChoi',N'RutDon')),
    NgayNop         DATETIME2     NOT NULL DEFAULT SYSDATETIME(),
    NgayCapNhat     DATETIME2     NOT NULL DEFAULT SYSDATETIME(),
    CONSTRAINT fk_Don_Tin       FOREIGN KEY (MaTin)      REFERENCES TinTuyenDung(MaTin),
    CONSTRAINT fk_Don_UngVien   FOREIGN KEY (MaUngVien)  REFERENCES NguoiDung(MaNguoiDung),
    CONSTRAINT fk_Don_FileCV    FOREIGN KEY (MaFileCV)   REFERENCES FileCV(MaFileCV),
    CONSTRAINT uq_DonUngTuyen   UNIQUE (MaTin, MaUngVien)   -- mỗi người chỉ nộp 1 lần/tin
);
GO

CREATE TRIGGER trg_DonUngTuyen_CapNhat
ON DonUngTuyen AFTER UPDATE AS
BEGIN
    SET NOCOUNT ON;
    UPDATE DonUngTuyen SET NgayCapNhat = SYSDATETIME()
    FROM DonUngTuyen d INNER JOIN inserted i ON d.MaDon = i.MaDon;
END;
GO

-- ============================================================
-- 7. PHỎNG VẤN & KẾT QUẢ
-- ============================================================

CREATE TABLE LichPhongVan (
    MaLich          INT IDENTITY(1,1) PRIMARY KEY,
    MaDon           INT           NOT NULL,
    MaNguoiLich     INT           NOT NULL,   -- NhaTuyenDung tạo lịch
    VongPhongVan    TINYINT       NOT NULL DEFAULT 1,
    HinhThuc        NVARCHAR(20)  NOT NULL DEFAULT N'Online'
                        CHECK (HinhThuc IN (N'DienThoai',N'Online',N'TrucTiep',N'KiemTra')),
    ThoiGian        DATETIME2     NOT NULL,
    ThoiLuongPhut   SMALLINT      DEFAULT 60,
    DiaDiem         NVARCHAR(500),   -- địa điểm hoặc link meeting
    GhiChu          NVARCHAR(MAX),
    TrangThai       NVARCHAR(20)  NOT NULL DEFAULT N'DaLen'
                        CHECK (TrangThai IN (N'DaLen',N'HoanThanh',N'HuyBo',N'VangMat')),
    NgayTao         DATETIME2     NOT NULL DEFAULT SYSDATETIME(),
    NgayCapNhat     DATETIME2     NOT NULL DEFAULT SYSDATETIME(),
    CONSTRAINT fk_LPV_Don        FOREIGN KEY (MaDon)       REFERENCES DonUngTuyen(MaDon) ON DELETE CASCADE,
    CONSTRAINT fk_LPV_NguoiLich  FOREIGN KEY (MaNguoiLich) REFERENCES NguoiDung(MaNguoiDung)
);
GO

-- Kết quả phỏng vấn
CREATE TABLE KetQuaPhongVan (
    MaKetQua        INT IDENTITY(1,1) PRIMARY KEY,
    MaLich          INT          NOT NULL UNIQUE,
    MaNguoiDanhGia  INT          NOT NULL,
    DiemTongQuat    TINYINT      CHECK (DiemTongQuat BETWEEN 1 AND 5),
    DiemKyThuat     TINYINT,
    DiemKyNangMem   TINYINT,
    KetQua          NVARCHAR(20) NOT NULL
                        CHECK (KetQua IN (N'Dat',N'KhongDat',N'ChoDanh')),
    NhanXet         NVARCHAR(MAX),
    NgayTao         DATETIME2    NOT NULL DEFAULT SYSDATETIME(),
    CONSTRAINT fk_KQPV_Lich       FOREIGN KEY (MaLich)         REFERENCES LichPhongVan(MaLich) ON DELETE CASCADE,
    CONSTRAINT fk_KQPV_NguoiDanhGia FOREIGN KEY (MaNguoiDanhGia) REFERENCES NguoiDung(MaNguoiDung)
);
GO

-- ============================================================
-- 8. THƯ MỜI LÀM VIỆC (OFFER)
-- ============================================================

CREATE TABLE ThuMoiLamViec (
    MaThuMoi        INT IDENTITY(1,1) PRIMARY KEY,
    MaDon           INT           NOT NULL UNIQUE,
    MaNguoiPhatHanh INT           NOT NULL,   -- NhaTuyenDung
    ViTriCongViec   NVARCHAR(255) NOT NULL,
    MucLuong        DECIMAL(15,2) NOT NULL,
    DonViTien       NVARCHAR(10)  DEFAULT N'VND',
    NgayBatDauDuKien DATE,
    NgayHetHan      DATE,
    FileThuMoi      NVARCHAR(500),   -- đường dẫn file offer letter
    TrangThai       NVARCHAR(20)  NOT NULL DEFAULT N'ChoPhanHoi'
                        CHECK (TrangThai IN (N'ChoPhanHoi',N'DaDongY',N'DaTuChoi',N'HetHan')),
    NgayPhanHoi     DATETIME2,
    GhiChu          NVARCHAR(MAX),
    NgayTao         DATETIME2     NOT NULL DEFAULT SYSDATETIME(),
    NgayCapNhat     DATETIME2     NOT NULL DEFAULT SYSDATETIME(),
    CONSTRAINT fk_TM_Don         FOREIGN KEY (MaDon)           REFERENCES DonUngTuyen(MaDon),
    CONSTRAINT fk_TM_NguoiPhatHanh FOREIGN KEY (MaNguoiPhatHanh) REFERENCES NguoiDung(MaNguoiDung)
);
GO

-- ============================================================
-- 9. THÔNG BÁO
-- ============================================================

CREATE TABLE ThongBao (
    MaThongBao  BIGINT IDENTITY(1,1) PRIMARY KEY,
    MaNguoiDung INT           NOT NULL,
    LoaiThongBao NVARCHAR(100) NOT NULL,   -- vd: 'NopDonThanhCong', 'LichPhongVanMoi'
    TieuDe      NVARCHAR(255) NOT NULL,
    NoiDung     NVARCHAR(MAX),
    LoaiLienKet NVARCHAR(50),              -- 'DonUngTuyen' | 'LichPhongVan' | 'ThuMoi' | 'TinTuyenDung'
    MaLienKet   INT,
    DaDoc       BIT           NOT NULL DEFAULT 0,
    NgayTao     DATETIME2     NOT NULL DEFAULT SYSDATETIME(),
    CONSTRAINT fk_TB_NguoiDung FOREIGN KEY (MaNguoiDung) REFERENCES NguoiDung(MaNguoiDung) ON DELETE CASCADE
);
GO

CREATE INDEX idx_ThongBao_NguoiDung_DaDoc ON ThongBao(MaNguoiDung, DaDoc);
GO

-- ============================================================
-- 10. GỢI Ý VIỆC LÀM
-- ============================================================

CREATE TABLE GoiYViecLam (
    MaGoiY      BIGINT IDENTITY(1,1) PRIMARY KEY,
    MaHoSo      INT           NOT NULL,
    MaTin       INT           NOT NULL,
    DiemPhuHop  DECIMAL(5,4)  NOT NULL DEFAULT 0.0,   -- 0.0000 → 1.0000
    LyDo        NVARCHAR(255),                          -- vd: 'KyNangPhuHop'
    NgayTao     DATETIME2     NOT NULL DEFAULT SYSDATETIME(),
    CONSTRAINT uq_GoiY UNIQUE (MaHoSo, MaTin),
    CONSTRAINT fk_GoiY_HoSo FOREIGN KEY (MaHoSo) REFERENCES HoSoUngVien(MaHoSo) ON DELETE CASCADE,
    CONSTRAINT fk_GoiY_Tin  FOREIGN KEY (MaTin)  REFERENCES TinTuyenDung(MaTin)
);
GO

-- ============================================================
-- 11. TIN ĐÃ LƯU
-- ============================================================

CREATE TABLE TinDaLuu (
    MaNguoiDung INT       NOT NULL,
    MaTin       INT       NOT NULL,
    NgayLuu     DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    CONSTRAINT pk_TinDaLuu PRIMARY KEY (MaNguoiDung, MaTin),
    CONSTRAINT fk_TDL_NguoiDung FOREIGN KEY (MaNguoiDung) REFERENCES NguoiDung(MaNguoiDung) ON DELETE CASCADE,
    CONSTRAINT fk_TDL_Tin       FOREIGN KEY (MaTin)       REFERENCES TinTuyenDung(MaTin)
);
GO

-- ============================================================
-- 12. NHẬT KÝ TRUY CẬP CV (Bảo mật – ai xem hồ sơ)
-- ============================================================

CREATE TABLE NhatKyXemCV (
    MaNhatKy    BIGINT IDENTITY(1,1) PRIMARY KEY,
    MaFileCV    INT           NOT NULL,
    MaNguoiXem  INT           NOT NULL,   -- NhaTuyenDung hoặc QuanTriVien
    NgayXem     DATETIME2     NOT NULL DEFAULT SYSDATETIME(),
    DiaChiIP    NVARCHAR(45),
    MucDich     NVARCHAR(255),
    CONSTRAINT fk_NKXCV_FileCV    FOREIGN KEY (MaFileCV)   REFERENCES FileCV(MaFileCV),
    CONSTRAINT fk_NKXCV_NguoiXem  FOREIGN KEY (MaNguoiXem) REFERENCES NguoiDung(MaNguoiDung)
);
GO

-- ============================================================
-- 13. VIEW BÁO CÁO / DASHBOARD
-- ============================================================

-- View: Thống kê tin theo công ty
CREATE OR ALTER VIEW v_ThongKeTinCongTy AS
SELECT
    ct.MaCongTy,
    ct.TenCongTy,
    COUNT(t.MaTin)                                                  AS TongSoTin,
    SUM(CASE WHEN t.TrangThai = N'DaDuyet' THEN 1 ELSE 0 END)      AS TinDangTuyen,
    SUM(CASE WHEN t.TrangThai = N'DaDong'  THEN 1 ELSE 0 END)      AS TinDaDong
FROM CongTy ct
LEFT JOIN TinTuyenDung t ON t.MaCongTy = ct.MaCongTy
GROUP BY ct.MaCongTy, ct.TenCongTy;
GO

-- View: Pipeline tuyển dụng theo từng tin
CREATE OR ALTER VIEW v_PipelineTuyenDung AS
SELECT
    t.MaTin,
    t.TieuDe,
    ct.TenCongTy,
    COUNT(DISTINCT d.MaDon)                                              AS TongDonNop,
    SUM(CASE WHEN d.TrangThai = N'DaNop'       THEN 1 ELSE 0 END)      AS DaNop,
    SUM(CASE WHEN d.TrangThai = N'DangXem'     THEN 1 ELSE 0 END)      AS DangXem,
    SUM(CASE WHEN d.TrangThai = N'VaoDanhSach' THEN 1 ELSE 0 END)      AS VaoDanhSach,
    SUM(CASE WHEN d.TrangThai = N'TuChoi'      THEN 1 ELSE 0 END)      AS TuChoi,
    COUNT(DISTINCT pv.MaLich)                                            AS SoLichPhongVan,
    COUNT(DISTINCT tm.MaThuMoi)                                          AS SoThuMoi,
    SUM(CASE WHEN tm.TrangThai = N'DaDongY'    THEN 1 ELSE 0 END)      AS SoNhanViec
FROM TinTuyenDung t
JOIN CongTy ct               ON ct.MaCongTy = t.MaCongTy
LEFT JOIN DonUngTuyen d      ON d.MaTin     = t.MaTin
LEFT JOIN LichPhongVan pv    ON pv.MaDon    = d.MaDon
LEFT JOIN ThuMoiLamViec tm   ON tm.MaDon    = d.MaDon
GROUP BY t.MaTin, t.TieuDe, ct.TenCongTy;
GO

-- ============================================================
-- 14. DỮ LIỆU MẪU BAN ĐẦU
-- ============================================================

SET IDENTITY_INSERT VaiTro ON;
INSERT INTO VaiTro (MaVaiTro, TenVaiTro, MoTa) VALUES
    (1, N'QuanTriVien',  N'Quản trị toàn bộ hệ thống'),
    (2, N'NhaTuyenDung', N'Đăng tin và quản lý tuyển dụng'),
    (3, N'UngVien',      N'Tìm kiếm và ứng tuyển việc làm');
SET IDENTITY_INSERT VaiTro OFF;
GO

INSERT INTO NguoiDung (MaVaiTro, HoTen, Email, SoDienThoai, MatKhauMaHoa, DangHoatDong, DaXacThucEmail) VALUES 
(1, N'Admin System', 'admin@btl.com', '0123456789', 'admin123', 1, 1),
(2, N'Nguyễn Văn Hùng', 'recruiter1@fpt.com', '0987654321', 'recruiter123', 1, 1),
(2, N'Trần Thị Mai', 'recruiter2@viettel.com', '0976543210', 'recruiter123', 1, 1),
(3, N'Lê Minh Tuấn', 'candidate1@gmail.com', '0965432109', 'candidate123', 1, 1),
(3, N'Phạm Thị Lan', 'candidate2@gmail.com', '0954321098', 'candidate123', 1, 1),
(3, N'Hoàng Đức Nam', 'candidate3@gmail.com', '0943210987', 'candidate123', 1, 1);

INSERT INTO CongTy (MaChuSoHuu, TenCongTy, MaSoThue, Website, MaLinhVuc, QuyMo, DiaChi, ThanhPho, QuocGia, MoTa, DaDuocDuyet) VALUES 
(2, N'Công ty FPT Software', '0123456789', 'https://fpt-software.com', 1, '500+', N'Tòa nhà FPT, Cầu Giấy', N'Hà Nội', N'Việt Nam', N'Công ty phần mềm hàng đầu Việt Nam', 1),
(3, N'Viettel Digital', '0987654321', 'https://vietteldigital.vn', 1, '201-500', N'Tòa nhà Viettel, Hai Bà Trưng', N'Hà Nội', N'Việt Nam', N'Công ty công nghệ số của Viettel', 1);


INSERT INTO HoSoUngVien (MaNguoiDung, TieuDe, TomTat, NgaySinh, GioiTinh, DiaChi, ThanhPho, LinkedIn, GitHub, TinhTrangTimViec, MucLuongMongMuon) VALUES 
(4, N'Full-stack Developer', N'3 năm kinh nghiệm phát triển web với React và .NET', '1995-05-15', N'Nam', N'123 Nguyễn Trãi, Thanh Xuân', N'Hà Nội', 'linkedin.com/in/leminhtuan', 'github.com/leminhtuan', N'SanSang', 20000000),
(5, N'Frontend Developer', N'2 năm kinh nghiệm React, Vue.js', '1997-08-20', N'Nu', N'456 Lê Văn Lương, Cầu Giấy', N'Hà Nội', 'linkedin.com/in/phamthilan', 'github.com/phamthilan', N'SanSang', 15000000),
(6, N'Backend Developer', N'4 năm kinh nghiệm Java Spring Boot', '1993-12-10', N'Nam', N'789 Hoàng Quốc Việt, Cầu Giấy', N'Hà Nội', 'linkedin.com/in/hoangducnam', 'github.com/hoangducnam', N'SanSang', 25000000);

INSERT INTO FileCV (MaHoSo, TenFile, DuongDanFile, KichThuoc, LoaiFile, LaMacDinh) VALUES 
(1, N'CV_LeMinhTuan.pdf', '/uploads/cv/cv_leminhtuan_2024.pdf', 1024000, 'application/pdf', 1),
(2, N'CV_PhamThiLan.pdf', '/uploads/cv/cv_phamthilan_2024.pdf', 856000, 'application/pdf', 1),
(3, N'CV_HoangDucNam.pdf', '/uploads/cv/cv_hoangducnam_2024.pdf', 1200000, 'application/pdf', 1);


INSERT INTO TinTuyenDung (MaCongTy, MaNguoiDang, MaDanhMuc, TieuDe, MoTa, YeuCau, QuyenLoi, HinhThucLamViec, KinhNghiem, MucLuongToiThieu, MucLuongToiDa, DonViTien, DiaDiem, ThanhPho, HanNopHoSo, SoLuongTuyen, TrangThai) VALUES 
(1, 2, 1, N'Tuyển Senior .NET Developer', 
N'Phát triển ứng dụng web với .NET Core, Entity Framework, SQL Server', 
N'- 3+ năm kinh nghiệm .NET
- Thành thạo C#, ASP.NET Core
- Kinh nghiệm Entity Framework, SQL Server', 
N'- Lương cạnh tranh
- Bảo hiểm đầy đủ
- Môi trường làm việc chuyên nghiệp', 
N'ToanThoiGian', N'Senior', 18000000, 30000000, N'VND', N'Tòa nhà FPT, Cầu Giấy', N'Hà Nội', '2024-12-31', 2, N'DaDuyet'),

(1, 2, 1, N'Tuyển React Developer', 
N'Phát triển giao diện người dùng với React, TypeScript', 
N'- 2+ năm kinh nghiệm React
- Thành thạo JavaScript, TypeScript
- Kinh nghiệm Redux, React Hooks', 
N'- Lương từ 15-25 triệu
- Thưởng dự án
- Đào tạo công nghệ mới', 
N'ToanThoiGian', N'Mid', 15000000, 25000000, N'VND', N'Tòa nhà FPT, Cầu Giấy', N'Hà Nội', '2024-12-31', 3, N'DaDuyet'),

(2, 3, 1, N'Tuyển Java Spring Boot Developer', 
N'Phát triển backend với Java Spring Boot, microservices', 
N'- 3+ năm kinh nghiệm Java
- Thành thạo Spring Boot, Spring Security
- Kinh nghiệm microservices, Docker', 
N'- Lương hấp dẫn
- Cơ hội thăng tiến
- Làm việc với công nghệ mới nhất', 
N'ToanThoiGian', N'Senior', 20000000, 35000000, N'VND', N'Tòa nhà Viettel, Hai Bà Trưng', N'Hà Nội', '2024-12-31', 2, N'DaDuyet');



INSERT INTO DonUngTuyen (MaTin, MaUngVien, MaFileCV, ThuGioiThieu, TrangThai) VALUES 
(1, 4, 1, N'Tôi có 3 năm kinh nghiệm phát triển .NET và rất quan tâm đến vị trí này.', N'DaNop'),
(2, 5, 2, N'Tôi có kinh nghiệm 2 năm với React và mong muốn được làm việc tại FPT.', N'DaNop'),
(3, 6, 3, N'Với 4 năm kinh nghiệm Java Spring Boot, tôi tin có thể đóng góp tốt cho dự án.', N'VaoDanhSach');

INSERT INTO LichPhongVan (MaDon, MaNguoiLich, VongPhongVan, HinhThuc, ThoiGian, ThoiLuongPhut, DiaDiem, GhiChu, TrangThai) VALUES 
(3, 3, 1, N'Online', '2024-04-15 14:00:00', 60, N'https://meet.google.com/abc-defg-hij', N'Phỏng vấn kỹ thuật Java Spring Boot', N'DaLen');


INSERT INTO LinhVuc (TenLinhVuc) VALUES
    (N'Công nghệ thông tin'),
    (N'Tài chính – Ngân hàng'),
    (N'Thương mại điện tử'),
    (N'Sản xuất – Kỹ thuật'),
    (N'Giáo dục – Đào tạo'),
    (N'Y tế – Dược phẩm'),
    (N'Marketing – Truyền thông'),
    (N'Bất động sản');
GO

INSERT INTO KyNang (TenKyNang) VALUES
    (N'JavaScript'),(N'TypeScript'),(N'Python'),(N'Java'),(N'C#'),
    (N'React'),(N'Vue.js'),(N'Node.js'),(N'Spring Boot'),(N'.NET'),
    (N'MySQL'),(N'PostgreSQL'),(N'MongoDB'),(N'Redis'),
    (N'Docker'),(N'Kubernetes'),(N'AWS'),(N'Git'),
    (N'Machine Learning'),(N'Phân tích dữ liệu'),
    (N'Quản lý dự án'),(N'Giao tiếp'),(N'Lãnh đạo');
GO

INSERT INTO DanhMucViecLam (TenDanhMuc) VALUES
    (N'Lập trình – Phần mềm'),
    (N'Thiết kế – UI/UX'),
    (N'Kinh doanh – Bán hàng'),
    (N'Marketing – Digital'),
    (N'Nhân sự – Hành chính'),
    (N'Kế toán – Tài chính'),
    (N'Vận hành – Hậu cần'),
    (N'Kỹ thuật – Cơ khí');
GO
select * from DanhMucViecLam


-- Script thêm 30 công việc mẫu
USE QuanLyViecLam;
GO

-- Thêm 10 công ty mới (MaChuSoHuu = 2 là recruiter1@fpt.com)
INSERT INTO CongTy (MaChuSoHuu, TenCongTy, MaSoThue, Website, QuyMo, DiaChi, ThanhPho, MoTa, DaDuocDuyet)
VALUES 
(2, N'Viettel Group', '0100109106', 'https://viettel.com.vn', '500+', N'Số 1 Giang Văn Minh, Ba Đình', N'Hà Nội', N'Tập đoàn viễn thông và công nghệ hàng đầu Việt Nam', 1),
(2, N'VinGroup', '0104024665', 'https://vingroup.net', '500+', N'Số 7 Bằng Lăng 1, Hoàng Mai', N'Hà Nội', N'Tập đoàn kinh tế tư nhân đa ngành lớn nhất Việt Nam', 1),
(2, N'Shopee Vietnam', '0312120987', 'https://careers.shopee.vn', '201-500', N'Tòa nhà Viettel, Quận 10', N'Hồ Chí Minh', N'Nền tảng thương mại điện tử hàng đầu Đông Nam Á', 1),
(2, N'Grab Vietnam', '0313301968', 'https://grab.careers', '201-500', N'Tòa nhà Sài Gòn Centre, Quận 1', N'Hồ Chí Minh', N'Siêu ứng dụng giao thông và giao đồ ăn', 1),
(2, N'Tiki Corporation', '0312192258', 'https://tiki.vn/tuyen-dung', '51-200', N'52 Út Tịch, Quận Tân Bình', N'Hồ Chí Minh', N'Sàn thương mại điện tử hàng đầu Việt Nam', 1),
(2, N'VNG Corporation', '0303669688', 'https://careers.vng.com.vn', '201-500', N'Z06 Đường số 13, Quận 2', N'Hồ Chí Minh', N'Công ty công nghệ và giải trí trực tuyến', 1),
(2, N'Techcombank', '0100109403', 'https://www.techcombank.com.vn', '500+', N'191 Bà Triệu, Hai Bà Trưng', N'Hà Nội', N'Ngân hàng thương mại cổ phần hàng đầu', 1),
(2, N'Momo', '0313255119', 'https://momo.vn/tuyen-dung', '51-200', N'Lầu M, Phú Mỹ Hưng Tower', N'Hồ Chí Minh', N'Ví điện tử và siêu ứng dụng thanh toán', 1),
(2, N'VPBank', '0100218068', 'https://www.vpbank.com.vn', '500+', N'89 Láng Hạ, Đống Đa', N'Hà Nội', N'Ngân hàng thương mại cổ phần Việt Nam Thịnh Vượng', 1),
(2, N'Lazada Vietnam', '0312155396', 'https://www.lazada.vn/careers', '51-200', N'Tòa nhà Viettel, Quận 10', N'Hồ Chí Minh', N'Nền tảng thương mại điện tử', 1);
GO

-- Thêm 30 tin tuyển dụng (MaCongTy từ 4-13, MaNguoiDang=2, MaDanhMuc: 1=IT, 2=Design, 3=Marketing, 4=Design, 5=HR)

INSERT INTO TinTuyenDung (MaCongTy, MaNguoiDang, MaDanhMuc, TieuDe, MoTa, YeuCau, QuyenLoi, HinhThucLamViec, KinhNghiem, MucLuongToiThieu, MucLuongToiDa, DonViTien, DiaDiem, ThanhPho, HanNopHoSo, SoLuongTuyen, TrangThai)
VALUES
(10, 2, 1, N'Backend Developer (Java Spring Boot)', N'Phát triển và bảo trì hệ thống backend cho các dự án lớn của Viettel', N'- 2+ năm kinh nghiệm Java Spring Boot
- Thành thạo MySQL, PostgreSQL
- Kinh nghiệm Microservices, Docker, Kubernetes', N'- Lương: 20-35 triệu
- Thưởng dự án, thưởng quý
- Bảo hiểm đầy đủ', N'ToanThoiGian', N'Mid', 20000000, 35000000, N'VND', N'Tòa nhà Viettel, Quận 10', N'Hồ Chí Minh', '2024-12-31', 3, N'DaDuyet'),

(10, 2, 1, N'Mobile Developer (Flutter)', N'Phát triển ứng dụng di động đa nền tảng với Flutter', N'- 1+ năm kinh nghiệm Flutter/Dart
- Hiểu biết về RESTful API
- Có kinh nghiệm publish app lên Store', N'- Lương: 15-28 triệu
- Làm việc với công nghệ mới
- Team trẻ, năng động', N'ToanThoiGian', N'Junior', 15000000, 28000000, N'VND', N'Số 1 Giang Văn Minh, Ba Đình', N'Hà Nội', '2024-12-31', 2, N'DaDuyet'),

(11, 2, 1, N'Full Stack Developer (React + Node.js)', N'Xây dựng và phát triển các ứng dụng web cho hệ sinh thái VinGroup', N'- 3+ năm kinh nghiệm React, Node.js
- Thành thạo TypeScript, MongoDB
- Kinh nghiệm CI/CD, AWS/Azure', N'- Lương: 25-40 triệu
- Thưởng hiệu suất cao
- Bảo hiểm cao cấp', N'ToanThoiGian', N'Senior', 25000000, 40000000, N'VND', N'Số 7 Bằng Lăng 1, Hoàng Mai', N'Hà Nội', '2024-12-31', 2, N'DaDuyet'),

(11, 2, 1, N'DevOps Engineer', N'Quản lý hạ tầng và triển khai tự động cho các dự án công nghệ', N'- 2+ năm kinh nghiệm DevOps
- Thành thạo Docker, Kubernetes, Jenkins
- Kinh nghiệm AWS/GCP/Azure', N'- Lương: 22-38 triệu
- Làm việc với công nghệ cloud hiện đại
- Đào tạo chứng chỉ AWS/Azure', N'ToanThoiGian', N'Mid', 22000000, 38000000, N'VND', N'Số 7 Bằng Lăng 1, Hoàng Mai', N'Hà Nội', '2024-12-31', 2, N'DaDuyet'),

(9, 2, 1, N'Data Engineer', N'Xây dựng và tối ưu data pipeline cho hệ thống thương mại điện tử', N'- 2+ năm kinh nghiệm Data Engineering
- Thành thạo Python, SQL, Spark
- Kinh nghiệm Airflow, Kafka', N'- Lương: 25-45 triệu
- Thưởng theo KPI
- Bảo hiểm cao cấp', N'ToanThoiGian', N'Mid', 25000000, 45000000, N'VND', N'Tòa nhà Viettel, Quận 10', N'Hồ Chí Minh', '2024-12-31', 2, N'DaDuyet');
GO

INSERT INTO TinTuyenDung (MaCongTy, MaNguoiDang, MaDanhMuc, TieuDe, MoTa, YeuCau, QuyenLoi, HinhThucLamViec, KinhNghiem, MucLuongToiThieu, MucLuongToiDa, DonViTien, DiaDiem, ThanhPho, HanNopHoSo, SoLuongTuyen, TrangThai)
VALUES
(9, 2, 1, N'QA Automation Engineer', N'Phát triển và duy trì hệ thống test tự động', N'- 1+ năm kinh nghiệm QA Automation
- Thành thạo Selenium, Appium
- Biết Java/Python', N'- Lương: 15-25 triệu
- Môi trường năng động
- Đào tạo kỹ năng', N'ToanThoiGian', N'Junior', 15000000, 25000000, N'VND', N'Tòa nhà Viettel, Quận 10', N'Hồ Chí Minh', '2024-12-31', 3, N'DaDuyet'),

(10, 2, 1, N'iOS Developer', N'Phát triển ứng dụng Grab cho nền tảng iOS', N'- 2+ năm kinh nghiệm iOS (Swift)
- Thành thạo UIKit, SwiftUI
- Kinh nghiệm MVVM, Clean Architecture', N'- Lương: 22-40 triệu
- Thưởng theo hiệu suất
- Bảo hiểm cao cấp', N'ToanThoiGian', N'Mid', 22000000, 40000000, N'VND', N'Tòa nhà Sài Gòn Centre, Quận 1', N'Hồ Chí Minh', '2024-12-31', 2, N'DaDuyet'),

(10, 2, 1, N'Android Developer', N'Phát triển ứng dụng Grab cho nền tảng Android', N'- 2+ năm kinh nghiệm Android (Kotlin)
- Thành thạo Jetpack Compose
- Kinh nghiệm MVVM, Clean Architecture', N'- Lương: 22-40 triệu
- Thưởng dự án
- Bảo hiểm đầy đủ', N'ToanThoiGian', N'Mid', 22000000, 40000000, N'VND', N'Tòa nhà Sài Gòn Centre, Quận 1', N'Hồ Chí Minh', '2024-12-31', 2, N'DaDuyet'),

(11, 2, 1, N'Frontend Developer (Vue.js)', N'Phát triển giao diện website Tiki với Vue.js', N'- 2+ năm kinh nghiệm Vue.js
- Thành thạo Vuex, Vue Router
- Biết HTML5, CSS3, JavaScript ES6+', N'- Lương: 18-32 triệu
- Thưởng theo doanh số
- Bảo hiểm đầy đủ', N'ToanThoiGian', N'Mid', 18000000, 32000000, N'VND', N'52 Út Tịch, Quận Tân Bình', N'Hồ Chí Minh', '2024-12-31', 3, N'DaDuyet'),

(11, 2, 1, N'AI/ML Engineer', N'Xây dựng hệ thống gợi ý sản phẩm và phân tích dữ liệu', N'- 2+ năm kinh nghiệm AI/ML
- Thành thạo Python, TensorFlow/PyTorch
- Kinh nghiệm Recommendation System', N'- Lương: 28-50 triệu
- Thưởng dự án cao
- Làm việc với Big Data', N'ToanThoiGian', N'Senior', 28000000, 50000000, N'VND', N'52 Út Tịch, Quận Tân Bình', N'Hồ Chí Minh', '2024-12-31', 1, N'DaDuyet');
GO

-- Finance & Banking (5 jobs)
INSERT INTO TinTuyenDung (MaCongTy, MaNguoiDang, MaDanhMuc, TieuDe, MoTa, YeuCau, QuyenLoi, HinhThucLamViec, KinhNghiem, MucLuongToiThieu, MucLuongToiDa, DonViTien, DiaDiem, ThanhPho, HanNopHoSo, SoLuongTuyen, TrangThai)
VALUES
(13, 2, 6, N'Business Analyst', N'Phân tích nghiệp vụ và tư vấn giải pháp công nghệ cho ngân hàng', N'- 2+ năm kinh nghiệm BA trong lĩnh vực tài chính
- Hiểu biết về quy trình ngân hàng
- Thành thạo SQL, Excel', N'- Lương: 20-35 triệu
- Thưởng theo KPI
- Bảo hiểm cao cấp', N'ToanThoiGian', N'Mid', 20000000, 35000000, N'VND', N'191 Bà Triệu, Hai Bà Trưng', N'Hà Nội', '2024-12-31', 2, N'DaDuyet'),

(13, 2, 6, N'Risk Management Specialist', N'Quản lý rủi ro tín dụng và vận hành', N'- 3+ năm kinh nghiệm quản lý rủi ro ngân hàng
- Hiểu biết về Basel II/III
- Thành thạo Excel, SQL', N'- Lương: 25-45 triệu
- Thưởng hiệu suất cao
- Bảo hiểm toàn diện', N'ToanThoiGian', N'Senior', 25000000, 45000000, N'VND', N'191 Bà Triệu, Hai Bà Trưng', N'Hà Nội', '2024-12-31', 1, N'DaDuyet'),

(15, 2, 6, N'Credit Officer', N'Thẩm định và phê duyệt hồ sơ tín dụng', N'- 1+ năm kinh nghiệm tín dụng ngân hàng
- Hiểu biết về phân tích tài chính
- Kỹ năng đánh giá rủi ro', N'- Lương: 12-20 triệu
- Thưởng theo doanh số
- Bảo hiểm đầy đủ', N'ToanThoiGian', N'Junior', 12000000, 20000000, N'VND', N'89 Láng Hạ, Đống Đa', N'Hà Nội', '2024-12-31', 5, N'DaDuyet'),

(15, 2, 6, N'Relationship Manager', N'Quản lý và phát triển khách hàng doanh nghiệp', N'- 2+ năm kinh nghiệm quan hệ khách hàng
- Kỹ năng bán hàng và đàm phán tốt
- Hiểu biết về sản phẩm ngân hàng', N'- Lương: 15-30 triệu + Hoa hồng
- Thưởng theo doanh số cao
- Bảo hiểm đầy đủ', N'ToanThoiGian', N'Mid', 15000000, 30000000, N'VND', N'89 Láng Hạ, Đống Đa', N'Hà Nội', '2024-12-31', 3, N'DaDuyet'),

(11, 2, 6, N'Product Manager (Fintech)', N'Quản lý sản phẩm ví điện tử và dịch vụ tài chính', N'- 3+ năm kinh nghiệm Product Manager
- Hiểu biết sâu về Fintech
- Kỹ năng phân tích dữ liệu', N'- Lương: 30-55 triệu
- Thưởng theo KPI cao
- Bảo hiểm cao cấp', N'ToanThoiGian', N'Senior', 30000000, 55000000, N'VND', N'Lầu M, Phú Mỹ Hưng Tower', N'Hồ Chí Minh', '2024-12-31', 1, N'DaDuyet');
GO

-- Marketing & Sales (5 jobs)
INSERT INTO TinTuyenDung (MaCongTy, MaNguoiDang, MaDanhMuc, TieuDe, MoTa, YeuCau, QuyenLoi, HinhThucLamViec, KinhNghiem, MucLuongToiThieu, MucLuongToiDa, DonViTien, DiaDiem, ThanhPho, HanNopHoSo, SoLuongTuyen, TrangThai)
VALUES
(12, 2, 4, N'Digital Marketing Manager', N'Quản lý và triển khai chiến dịch marketing online', N'- 3+ năm kinh nghiệm Digital Marketing
- Thành thạo Google Ads, Facebook Ads
- Kinh nghiệm SEO/SEM', N'- Lương: 20-35 triệu
- Thưởng theo KPI
- Bảo hiểm đầy đủ', N'ToanThoiGian', N'Mid', 20000000, 35000000, N'VND', N'Tòa nhà Viettel, Quận 10', N'Hồ Chí Minh', '2024-12-31', 2, N'DaDuyet'),

(16, 2, 4, N'Content Marketing Specialist', N'Sáng tạo nội dung marketing cho các kênh truyền thông', N'- 2+ năm kinh nghiệm Content Marketing
- Kỹ năng viết content hấp dẫn
- Hiểu biết về SEO content', N'- Lương: 12-22 triệu
- Thưởng theo hiệu suất
- Bảo hiểm đầy đủ', N'ToanThoiGian', N'Junior', 12000000, 22000000, N'VND', N'Tòa nhà Viettel, Quận 10', N'Hồ Chí Minh', '2024-12-31', 2, N'DaDuyet'),

(10, 2, 3, N'Key Account Manager', N'Quản lý và phát triển đối tác chiến lược', N'- 3+ năm kinh nghiệm B2B Sales
- Kỹ năng đàm phán và thuyết phục
- Có mạng lưới quan hệ rộng', N'- Lương: 18-35 triệu + Hoa hồng
- Thưởng doanh số cao
- Bảo hiểm cao cấp', N'ToanThoiGian', N'Senior', 18000000, 35000000, N'VND', N'Tòa nhà Sài Gòn Centre, Quận 1', N'Hồ Chí Minh', '2024-12-31', 2, N'DaDuyet'),

(11, 2, 4, N'Social Media Manager', N'Quản lý và phát triển các kênh mạng xã hội', N'- 2+ năm kinh nghiệm Social Media
- Thành thạo Facebook, Instagram, TikTok
- Kỹ năng sáng tạo content', N'- Lương: 15-28 triệu
- Thưởng theo engagement
- Bảo hiểm đầy đủ', N'ToanThoiGian', N'Mid', 15000000, 28000000, N'VND', N'52 Út Tịch, Quận Tân Bình', N'Hồ Chí Minh', '2024-12-31', 1, N'DaDuyet'),

(12, 2, 4, N'Game Marketing Executive', N'Triển khai chiến dịch marketing cho game', N'- 1+ năm kinh nghiệm marketing
- Đam mê game và công nghệ
- Kỹ năng viết content', N'- Lương: 10-18 triệu
- Thưởng theo dự án
- Bảo hiểm đầy đủ', N'ToanThoiGian', N'Junior', 10000000, 18000000, N'VND', N'Z06 Đường số 13, Quận 2', N'Hồ Chí Minh', '2024-12-31', 2, N'DaDuyet');
GO

-- Design & Creative (5 jobs)
INSERT INTO TinTuyenDung (MaCongTy, MaNguoiDang, MaDanhMuc, TieuDe, MoTa, YeuCau, QuyenLoi, HinhThucLamViec, KinhNghiem, MucLuongToiThieu, MucLuongToiDa, DonViTien, DiaDiem, ThanhPho, HanNopHoSo, SoLuongTuyen, TrangThai)
VALUES
(15, 2, 6, N'UI/UX Designer', N'Thiết kế giao diện và trải nghiệm người dùng cho game và app', N'- 2+ năm kinh nghiệm UI/UX Design
- Thành thạo Figma, Adobe XD
- Hiểu biết về User Research', N'- Lương: 15-30 triệu
- Thưởng dự án
- Bảo hiểm đầy đủ', N'ToanThoiGian', N'Mid', 15000000, 30000000, N'VND', N'Z06 Đường số 13, Quận 2', N'Hồ Chí Minh', '2024-12-31', 2, N'DaDuyet'),

(15, 2, 6, N'Graphic Designer', N'Thiết kế banner, poster cho các chiến dịch marketing', N'- 1+ năm kinh nghiệm Graphic Design
- Thành thạo Photoshop, Illustrator
- Kỹ năng sáng tạo tốt', N'- Lương: 10-18 triệu
- Thưởng theo dự án
- Bảo hiểm đầy đủ', N'ToanThoiGian', N'Junior', 10000000, 18000000, N'VND', N'Tòa nhà Viettel, Quận 10', N'Hồ Chí Minh', '2024-12-31', 3, N'DaDuyet'),

(14, 2, 6, N'Motion Graphic Designer', N'Thiết kế video quảng cáo và motion graphic', N'- 2+ năm kinh nghiệm Motion Graphic
- Thành thạo After Effects, Premiere
- Kỹ năng storytelling', N'- Lương: 12-25 triệu
- Thưởng dự án
- Bảo hiểm đầy đủ', N'ToanThoiGian', N'Mid', 12000000, 25000000, N'VND', N'52 Út Tịch, Quận Tân Bình', N'Hồ Chí Minh', '2024-12-31', 1, N'DaDuyet'),

(14, 2, 6, N'Product Designer', N'Thiết kế sản phẩm số cho hệ sinh thái VinGroup', N'- 3+ năm kinh nghiệm Product Design
- Thành thạo Figma, Sketch
- Kinh nghiệm Design System', N'- Lương: 20-38 triệu
- Thưởng theo KPI
- Bảo hiểm cao cấp', N'ToanThoiGian', N'Senior', 20000000, 38000000, N'VND', N'Số 7 Bằng Lăng 1, Hoàng Mai', N'Hà Nội', '2024-12-31', 1, N'DaDuyet'),

(13, 2, 6, N'Brand Designer', N'Phát triển và duy trì hệ thống nhận diện thương hiệu', N'- 2+ năm kinh nghiệm Brand Design
- Thành thạo Adobe Creative Suite
- Hiểu biết về Brand Identity', N'- Lương: 15-28 triệu
- Thưởng dự án
- Bảo hiểm cao cấp', N'ToanThoiGian', N'Mid', 15000000, 28000000, N'VND', N'Tòa nhà Sài Gòn Centre, Quận 1', N'Hồ Chí Minh', '2024-12-31', 1, N'DaDuyet');
GO

-- HR & Admin (5 jobs)
INSERT INTO TinTuyenDung (MaCongTy, MaNguoiDang, MaDanhMuc, TieuDe, MoTa, YeuCau, QuyenLoi, HinhThucLamViec, KinhNghiem, MucLuongToiThieu, MucLuongToiDa, DonViTien, DiaDiem, ThanhPho, HanNopHoSo, SoLuongTuyen, TrangThai)
VALUES
(8, 2, 5, N'HR Manager', N'Quản lý toàn bộ hoạt động nhân sự của công ty', N'- 5+ năm kinh nghiệm quản lý nhân sự
- Hiểu biết về luật lao động
- Kỹ năng lãnh đạo và quản lý team', N'- Lương: 25-45 triệu
- Thưởng theo KPI
- Bảo hiểm cao cấp', N'ToanThoiGian', N'Senior', 25000000, 45000000, N'VND', N'Số 7 Bằng Lăng 1, Hoàng Mai', N'Hà Nội', '2024-12-31', 1, N'DaDuyet'),

(13, 2, 5, N'Talent Acquisition Specialist', N'Tuyển dụng nhân sự IT và kỹ thuật', N'- 2+ năm kinh nghiệm tuyển dụng IT
- Hiểu biết về công nghệ
- Kỹ năng sourcing và headhunt', N'- Lương: 12-22 triệu
- Thưởng theo số lượng tuyển
- Bảo hiểm đầy đủ', N'ToanThoiGian', N'Mid', 12000000, 22000000, N'VND', N'Số 1 Giang Văn Minh, Ba Đình', N'Hà Nội', '2024-12-31', 2, N'DaDuyet'),

(9, 2, 5, N'HR Business Partner', N'Đối tác chiến lược với các phòng ban về nhân sự', N'- 3+ năm kinh nghiệm HRBP
- Kỹ năng tư vấn và giải quyết vấn đề
- Hiểu biết về OD và Talent Management', N'- Lương: 18-32 triệu
- Thưởng theo hiệu suất
- Bảo hiểm cao cấp', N'ToanThoiGian', N'Senior', 18000000, 32000000, N'VND', N'Tòa nhà Viettel, Quận 10', N'Hồ Chí Minh', '2024-12-31', 1, N'DaDuyet'),

(13, 2, 5, N'C&B Specialist', N'Quản lý chính sách lương thưởng và phúc lợi', N'- 2+ năm kinh nghiệm C&B
- Thành thạo Excel, HRIS
- Hiểu biết về luật lao động', N'- Lương: 15-25 triệu
- Thưởng theo KPI
- Bảo hiểm đầy đủ', N'ToanThoiGian', N'Mid', 15000000, 25000000, N'VND', N'191 Bà Triệu, Hai Bà Trưng', N'Hà Nội', '2024-12-31', 1, N'DaDuyet'),

(13, 2, 5, N'Training & Development Executive', N'Thiết kế và triển khai chương trình đào tạo', N'- 1+ năm kinh nghiệm L&D
- Kỹ năng thiết kế chương trình đào tạo
- Kỹ năng thuyết trình tốt', N'- Lương: 10-18 triệu
- Thưởng theo dự án
- Bảo hiểm đầy đủ', N'ToanThoiGian', N'Junior', 10000000, 18000000, N'VND', N'Tòa nhà Sài Gòn Centre, Quận 1', N'Hồ Chí Minh', '2024-12-31', 2, N'DaDuyet');
GO
