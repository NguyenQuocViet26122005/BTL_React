using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace BTL_CNW.Models;

public partial class QuanLyViecLamContext : DbContext
{
    public QuanLyViecLamContext()
    {
    }

    public QuanLyViecLamContext(DbContextOptions<QuanLyViecLamContext> options)
        : base(options)
    {
    }

    public virtual DbSet<CongTy> CongTies { get; set; }

    public virtual DbSet<DanhMucViecLam> DanhMucViecLams { get; set; }

    public virtual DbSet<DonUngTuyen> DonUngTuyens { get; set; }

    public virtual DbSet<FileCv> FileCvs { get; set; }

    public virtual DbSet<GoiYviecLam> GoiYviecLams { get; set; }

    public virtual DbSet<HoSoUngVien> HoSoUngViens { get; set; }

    public virtual DbSet<HocVan> HocVans { get; set; }

    public virtual DbSet<KetQuaPhongVan> KetQuaPhongVans { get; set; }

    public virtual DbSet<KinhNghiemLamViec> KinhNghiemLamViecs { get; set; }

    public virtual DbSet<KyNang> KyNangs { get; set; }

    public virtual DbSet<KyNangUngVien> KyNangUngViens { get; set; }

    public virtual DbSet<LichPhongVan> LichPhongVans { get; set; }

    public virtual DbSet<LinhVuc> LinhVucs { get; set; }

    public virtual DbSet<NguoiDung> NguoiDungs { get; set; }

    public virtual DbSet<NhatKyXemCv> NhatKyXemCvs { get; set; }

    public virtual DbSet<ThongBao> ThongBaos { get; set; }

    public virtual DbSet<ThuMoiLamViec> ThuMoiLamViecs { get; set; }

    public virtual DbSet<TinDaLuu> TinDaLuus { get; set; }

    public virtual DbSet<TinTuyenDung> TinTuyenDungs { get; set; }

    public virtual DbSet<VPipelineTuyenDung> VPipelineTuyenDungs { get; set; }

    public virtual DbSet<VThongKeTinCongTy> VThongKeTinCongTies { get; set; }

    public virtual DbSet<VaiTro> VaiTros { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        // Connection string sẽ được cấu hình từ Program.cs thông qua dependency injection
        if (!optionsBuilder.IsConfigured)
        {
            optionsBuilder.UseSqlServer("Server=.;Database=QuanLyViecLam;Trusted_Connection=True;TrustServerCertificate=True;");
        }
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.UseCollation("Vietnamese_CI_AS");

        modelBuilder.Entity<CongTy>(entity =>
        {
            entity.HasKey(e => e.MaCongTy).HasName("PK__CongTy__E452D3DB8CAE7877");

            entity.ToTable("CongTy", tb => tb.HasTrigger("trg_CongTy_CapNhat"));

            entity.HasIndex(e => e.MaSoThue, "UQ__CongTy__1E811CB108A5DF7A").IsUnique();

            entity.Property(e => e.Logo).HasMaxLength(500);
            entity.Property(e => e.MaSoThue).HasMaxLength(50);
            entity.Property(e => e.NgayCapNhat).HasDefaultValueSql("(sysdatetime())");
            entity.Property(e => e.NgayTao).HasDefaultValueSql("(sysdatetime())");
            entity.Property(e => e.QuocGia)
                .HasMaxLength(100)
                .HasDefaultValue("Việt Nam");
            entity.Property(e => e.QuyMo).HasMaxLength(10);
            entity.Property(e => e.TenCongTy).HasMaxLength(255);
            entity.Property(e => e.ThanhPho).HasMaxLength(100);
            entity.Property(e => e.Website).HasMaxLength(500);

            entity.HasOne(d => d.MaChuSoHuuNavigation).WithMany(p => p.CongTies)
                .HasForeignKey(d => d.MaChuSoHuu)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("fk_CongTy_ChuSoHuu");

            entity.HasOne(d => d.MaLinhVucNavigation).WithMany(p => p.CongTies)
                .HasForeignKey(d => d.MaLinhVuc)
                .HasConstraintName("fk_CongTy_LinhVuc");
        });

        modelBuilder.Entity<DanhMucViecLam>(entity =>
        {
            entity.HasKey(e => e.MaDanhMuc).HasName("PK__DanhMucV__B3750887C25815B3");

            entity.ToTable("DanhMucViecLam");

            entity.HasIndex(e => e.TenDanhMuc, "UQ__DanhMucV__650CAE4ECC7405EB").IsUnique();

            entity.Property(e => e.TenDanhMuc).HasMaxLength(100);

            entity.HasOne(d => d.MaDanhMucChaNavigation).WithMany(p => p.InverseMaDanhMucChaNavigation)
                .HasForeignKey(d => d.MaDanhMucCha)
                .HasConstraintName("fk_DanhMuc_Cha");
        });

        modelBuilder.Entity<DonUngTuyen>(entity =>
        {
            entity.HasKey(e => e.MaDon).HasName("PK__DonUngTu__3D89F568D1307CC8");

            entity.ToTable("DonUngTuyen", tb => tb.HasTrigger("trg_DonUngTuyen_CapNhat"));

            entity.HasIndex(e => new { e.MaTin, e.MaUngVien }, "uq_DonUngTuyen").IsUnique();

            entity.Property(e => e.MaFileCv).HasColumnName("MaFileCV");
            entity.Property(e => e.NgayCapNhat).HasDefaultValueSql("(sysdatetime())");
            entity.Property(e => e.NgayNop).HasDefaultValueSql("(sysdatetime())");
            entity.Property(e => e.TrangThai)
                .HasMaxLength(20)
                .HasDefaultValue("DaNop");

            entity.HasOne(d => d.MaFileCvNavigation).WithMany(p => p.DonUngTuyens)
                .HasForeignKey(d => d.MaFileCv)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("fk_Don_FileCV");

            entity.HasOne(d => d.MaTinNavigation).WithMany(p => p.DonUngTuyens)
                .HasForeignKey(d => d.MaTin)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("fk_Don_Tin");

            entity.HasOne(d => d.MaUngVienNavigation).WithMany(p => p.DonUngTuyens)
                .HasForeignKey(d => d.MaUngVien)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("fk_Don_UngVien");
        });

        modelBuilder.Entity<FileCv>(entity =>
        {
            entity.HasKey(e => e.MaFileCv).HasName("PK__FileCV__329A30FB773A14B7");

            entity.ToTable("FileCV");

            entity.Property(e => e.MaFileCv).HasColumnName("MaFileCV");
            entity.Property(e => e.DuongDanFile).HasMaxLength(500);
            entity.Property(e => e.LoaiFile)
                .HasMaxLength(100)
                .HasDefaultValue("application/pdf");
            entity.Property(e => e.NgayTai).HasDefaultValueSql("(sysdatetime())");
            entity.Property(e => e.TenFile).HasMaxLength(255);

            entity.HasOne(d => d.MaHoSoNavigation).WithMany(p => p.FileCvs)
                .HasForeignKey(d => d.MaHoSo)
                .HasConstraintName("fk_FileCV_HoSo");
        });

        modelBuilder.Entity<GoiYviecLam>(entity =>
        {
            entity.HasKey(e => e.MaGoiY).HasName("PK__GoiYViec__7EC2FE5A2C767719");

            entity.ToTable("GoiYViecLam");

            entity.HasIndex(e => new { e.MaHoSo, e.MaTin }, "uq_GoiY").IsUnique();

            entity.Property(e => e.DiemPhuHop).HasColumnType("decimal(5, 4)");
            entity.Property(e => e.LyDo).HasMaxLength(255);
            entity.Property(e => e.NgayTao).HasDefaultValueSql("(sysdatetime())");

            entity.HasOne(d => d.MaHoSoNavigation).WithMany(p => p.GoiYviecLams)
                .HasForeignKey(d => d.MaHoSo)
                .HasConstraintName("fk_GoiY_HoSo");

            entity.HasOne(d => d.MaTinNavigation).WithMany(p => p.GoiYviecLams)
                .HasForeignKey(d => d.MaTin)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("fk_GoiY_Tin");
        });

        modelBuilder.Entity<HoSoUngVien>(entity =>
        {
            entity.HasKey(e => e.MaHoSo).HasName("PK__HoSoUngV__1666423CC6760709");

            entity.ToTable("HoSoUngVien");

            entity.HasIndex(e => e.MaNguoiDung, "UQ__HoSoUngV__C539D7639688F8CC").IsUnique();

            entity.Property(e => e.GioiTinh).HasMaxLength(10);
            entity.Property(e => e.GitHub).HasMaxLength(500);
            entity.Property(e => e.LinkedIn).HasMaxLength(500);
            entity.Property(e => e.MucLuongMongMuon).HasColumnType("decimal(15, 2)");
            entity.Property(e => e.NgayCapNhat).HasDefaultValueSql("(sysdatetime())");
            entity.Property(e => e.NgayTao).HasDefaultValueSql("(sysdatetime())");
            entity.Property(e => e.Portfolio).HasMaxLength(500);
            entity.Property(e => e.ThanhPho).HasMaxLength(100);
            entity.Property(e => e.TieuDe).HasMaxLength(255);
            entity.Property(e => e.TinhTrangTimViec)
                .HasMaxLength(20)
                .HasDefaultValue("SanSang");

            entity.HasOne(d => d.MaNguoiDungNavigation).WithOne(p => p.HoSoUngVien)
                .HasForeignKey<HoSoUngVien>(d => d.MaNguoiDung)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("fk_HoSo_NguoiDung");
        });

        modelBuilder.Entity<HocVan>(entity =>
        {
            entity.HasKey(e => e.MaHocVan).HasName("PK__HocVan__9469FF1448CFA565");

            entity.ToTable("HocVan");

            entity.Property(e => e.BangCap).HasMaxLength(100);
            entity.Property(e => e.ChuyenNganh).HasMaxLength(150);
            entity.Property(e => e.DangHocKhong).HasDefaultValue(false);
            entity.Property(e => e.DiemTrungBinh).HasColumnType("decimal(4, 2)");
            entity.Property(e => e.TruongHoc).HasMaxLength(255);

            entity.HasOne(d => d.MaHoSoNavigation).WithMany(p => p.HocVans)
                .HasForeignKey(d => d.MaHoSo)
                .HasConstraintName("fk_HocVan_HoSo");
        });

        modelBuilder.Entity<KetQuaPhongVan>(entity =>
        {
            entity.HasKey(e => e.MaKetQua).HasName("PK__KetQuaPh__D5B3102A0EE15121");

            entity.ToTable("KetQuaPhongVan");

            entity.HasIndex(e => e.MaLich, "UQ__KetQuaPh__728A9AE870FF0EA9").IsUnique();

            entity.Property(e => e.KetQua).HasMaxLength(20);
            entity.Property(e => e.NgayTao).HasDefaultValueSql("(sysdatetime())");

            entity.HasOne(d => d.MaLichNavigation).WithOne(p => p.KetQuaPhongVan)
                .HasForeignKey<KetQuaPhongVan>(d => d.MaLich)
                .HasConstraintName("fk_KQPV_Lich");

            entity.HasOne(d => d.MaNguoiDanhGiaNavigation).WithMany(p => p.KetQuaPhongVans)
                .HasForeignKey(d => d.MaNguoiDanhGia)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("fk_KQPV_NguoiDanhGia");
        });

        modelBuilder.Entity<KinhNghiemLamViec>(entity =>
        {
            entity.HasKey(e => e.MaKinhNghiem).HasName("PK__KinhNghi__6B734BC0C1550016");

            entity.ToTable("KinhNghiemLamViec");

            entity.Property(e => e.DangLamKhong).HasDefaultValue(false);
            entity.Property(e => e.TenCongTy).HasMaxLength(255);
            entity.Property(e => e.ViTri).HasMaxLength(255);

            entity.HasOne(d => d.MaHoSoNavigation).WithMany(p => p.KinhNghiemLamViecs)
                .HasForeignKey(d => d.MaHoSo)
                .HasConstraintName("fk_KNLV_HoSo");
        });

        modelBuilder.Entity<KyNang>(entity =>
        {
            entity.HasKey(e => e.MaKyNang).HasName("PK__KyNang__796CFDAF8B76750E");

            entity.ToTable("KyNang");

            entity.HasIndex(e => e.TenKyNang, "UQ__KyNang__89D6F06D0DF309E9").IsUnique();

            entity.Property(e => e.TenKyNang).HasMaxLength(100);
        });

        modelBuilder.Entity<KyNangUngVien>(entity =>
        {
            entity.HasKey(e => new { e.MaHoSo, e.MaKyNang }).HasName("pk_KyNangUngVien");

            entity.ToTable("KyNangUngVien");

            entity.Property(e => e.TrinhDo)
                .HasMaxLength(20)
                .HasDefaultValue("TrungBinh");

            entity.HasOne(d => d.MaHoSoNavigation).WithMany(p => p.KyNangUngViens)
                .HasForeignKey(d => d.MaHoSo)
                .HasConstraintName("fk_KNUV_HoSo");

            entity.HasOne(d => d.MaKyNangNavigation).WithMany(p => p.KyNangUngViens)
                .HasForeignKey(d => d.MaKyNang)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("fk_KNUV_KyNang");
        });

        modelBuilder.Entity<LichPhongVan>(entity =>
        {
            entity.HasKey(e => e.MaLich).HasName("PK__LichPhon__728A9AE9FE54A9E6");

            entity.ToTable("LichPhongVan");

            entity.Property(e => e.DiaDiem).HasMaxLength(500);
            entity.Property(e => e.HinhThuc)
                .HasMaxLength(20)
                .HasDefaultValue("Online");
            entity.Property(e => e.NgayCapNhat).HasDefaultValueSql("(sysdatetime())");
            entity.Property(e => e.NgayTao).HasDefaultValueSql("(sysdatetime())");
            entity.Property(e => e.ThoiLuongPhut).HasDefaultValue((short)60);
            entity.Property(e => e.TrangThai)
                .HasMaxLength(20)
                .HasDefaultValue("DaLen");
            entity.Property(e => e.VongPhongVan).HasDefaultValue((byte)1);

            entity.HasOne(d => d.MaDonNavigation).WithMany(p => p.LichPhongVans)
                .HasForeignKey(d => d.MaDon)
                .HasConstraintName("fk_LPV_Don");

            entity.HasOne(d => d.MaNguoiLichNavigation).WithMany(p => p.LichPhongVans)
                .HasForeignKey(d => d.MaNguoiLich)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("fk_LPV_NguoiLich");
        });

        modelBuilder.Entity<LinhVuc>(entity =>
        {
            entity.HasKey(e => e.MaLinhVuc).HasName("PK__LinhVuc__318894A086C3F334");

            entity.ToTable("LinhVuc");

            entity.HasIndex(e => e.TenLinhVuc, "UQ__LinhVuc__06AF00014E126140").IsUnique();

            entity.Property(e => e.TenLinhVuc).HasMaxLength(100);
        });

        modelBuilder.Entity<NguoiDung>(entity =>
        {
            entity.HasKey(e => e.MaNguoiDung).HasName("PK__NguoiDun__C539D762763F0C85");

            entity.ToTable("NguoiDung", tb => tb.HasTrigger("trg_NguoiDung_CapNhat"));

            entity.HasIndex(e => e.Email, "UQ__NguoiDun__A9D10534BCCBF161").IsUnique();

            entity.Property(e => e.AnhDaiDien).HasMaxLength(500);
            entity.Property(e => e.DangHoatDong).HasDefaultValue(true);
            entity.Property(e => e.Email).HasMaxLength(255);
            entity.Property(e => e.HoTen).HasMaxLength(150);
            entity.Property(e => e.MatKhauMaHoa).HasMaxLength(255);
            entity.Property(e => e.NgayCapNhat).HasDefaultValueSql("(sysdatetime())");
            entity.Property(e => e.NgayTao).HasDefaultValueSql("(sysdatetime())");
            entity.Property(e => e.SoDienThoai).HasMaxLength(20);

            entity.HasOne(d => d.MaVaiTroNavigation).WithMany(p => p.NguoiDungs)
                .HasForeignKey(d => d.MaVaiTro)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("fk_NguoiDung_VaiTro");
        });

        modelBuilder.Entity<NhatKyXemCv>(entity =>
        {
            entity.HasKey(e => e.MaNhatKy).HasName("PK__NhatKyXe__E42EF42EE6233FBA");

            entity.ToTable("NhatKyXemCV");

            entity.Property(e => e.DiaChiIp)
                .HasMaxLength(45)
                .HasColumnName("DiaChiIP");
            entity.Property(e => e.MaFileCv).HasColumnName("MaFileCV");
            entity.Property(e => e.MucDich).HasMaxLength(255);
            entity.Property(e => e.NgayXem).HasDefaultValueSql("(sysdatetime())");

            entity.HasOne(d => d.MaFileCvNavigation).WithMany(p => p.NhatKyXemCvs)
                .HasForeignKey(d => d.MaFileCv)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("fk_NKXCV_FileCV");

            entity.HasOne(d => d.MaNguoiXemNavigation).WithMany(p => p.NhatKyXemCvs)
                .HasForeignKey(d => d.MaNguoiXem)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("fk_NKXCV_NguoiXem");
        });

        modelBuilder.Entity<ThongBao>(entity =>
        {
            entity.HasKey(e => e.MaThongBao).HasName("PK__ThongBao__04DEB54ED60359EA");

            entity.ToTable("ThongBao");

            entity.HasIndex(e => new { e.MaNguoiDung, e.DaDoc }, "idx_ThongBao_NguoiDung_DaDoc");

            entity.Property(e => e.LoaiLienKet).HasMaxLength(50);
            entity.Property(e => e.LoaiThongBao).HasMaxLength(100);
            entity.Property(e => e.NgayTao).HasDefaultValueSql("(sysdatetime())");
            entity.Property(e => e.TieuDe).HasMaxLength(255);

            entity.HasOne(d => d.MaNguoiDungNavigation).WithMany(p => p.ThongBaos)
                .HasForeignKey(d => d.MaNguoiDung)
                .HasConstraintName("fk_TB_NguoiDung");
        });

        modelBuilder.Entity<ThuMoiLamViec>(entity =>
        {
            entity.HasKey(e => e.MaThuMoi).HasName("PK__ThuMoiLa__3BE70154BE4220EB");

            entity.ToTable("ThuMoiLamViec");

            entity.HasIndex(e => e.MaDon, "UQ__ThuMoiLa__3D89F569749B8FC7").IsUnique();

            entity.Property(e => e.DonViTien)
                .HasMaxLength(10)
                .HasDefaultValue("VND");
            entity.Property(e => e.FileThuMoi).HasMaxLength(500);
            entity.Property(e => e.MucLuong).HasColumnType("decimal(15, 2)");
            entity.Property(e => e.NgayCapNhat).HasDefaultValueSql("(sysdatetime())");
            entity.Property(e => e.NgayTao).HasDefaultValueSql("(sysdatetime())");
            entity.Property(e => e.TrangThai)
                .HasMaxLength(20)
                .HasDefaultValue("ChoPhanHoi");
            entity.Property(e => e.ViTriCongViec).HasMaxLength(255);

            entity.HasOne(d => d.MaDonNavigation).WithOne(p => p.ThuMoiLamViec)
                .HasForeignKey<ThuMoiLamViec>(d => d.MaDon)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("fk_TM_Don");

            entity.HasOne(d => d.MaNguoiPhatHanhNavigation).WithMany(p => p.ThuMoiLamViecs)
                .HasForeignKey(d => d.MaNguoiPhatHanh)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("fk_TM_NguoiPhatHanh");
        });

        modelBuilder.Entity<TinDaLuu>(entity =>
        {
            entity.HasKey(e => new { e.MaNguoiDung, e.MaTin }).HasName("pk_TinDaLuu");

            entity.ToTable("TinDaLuu");

            entity.Property(e => e.NgayLuu).HasDefaultValueSql("(sysdatetime())");

            entity.HasOne(d => d.MaNguoiDungNavigation).WithMany(p => p.TinDaLuus)
                .HasForeignKey(d => d.MaNguoiDung)
                .HasConstraintName("fk_TDL_NguoiDung");

            entity.HasOne(d => d.MaTinNavigation).WithMany(p => p.TinDaLuus)
                .HasForeignKey(d => d.MaTin)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("fk_TDL_Tin");
        });

        modelBuilder.Entity<TinTuyenDung>(entity =>
        {
            entity.HasKey(e => e.MaTin).HasName("PK__TinTuyen__314903359A13633B");

            entity.ToTable("TinTuyenDung", tb => tb.HasTrigger("trg_TinTuyenDung_CapNhat"));

            entity.HasIndex(e => e.MaTin, "uix_TinTuyenDung_MaTin").IsUnique();

            entity.Property(e => e.DiaDiem).HasMaxLength(255);
            entity.Property(e => e.DonViTien)
                .HasMaxLength(10)
                .HasDefaultValue("VND");
            entity.Property(e => e.HinhThucLamViec)
                .HasMaxLength(20)
                .HasDefaultValue("ToanThoiGian");
            entity.Property(e => e.KinhNghiem)
                .HasMaxLength(20)
                .HasDefaultValue("MoiRa");
            entity.Property(e => e.MucLuongToiDa).HasColumnType("decimal(15, 2)");
            entity.Property(e => e.MucLuongToiThieu).HasColumnType("decimal(15, 2)");
            entity.Property(e => e.NgayCapNhat).HasDefaultValueSql("(sysdatetime())");
            entity.Property(e => e.NgayTao).HasDefaultValueSql("(sysdatetime())");
            entity.Property(e => e.SoLuongTuyen).HasDefaultValue(1);
            entity.Property(e => e.ThanhPho).HasMaxLength(100);
            entity.Property(e => e.TieuDe).HasMaxLength(255);
            entity.Property(e => e.TrangThai)
                .HasMaxLength(20)
                .HasDefaultValue("ChoXetDuyet");

            entity.HasOne(d => d.MaCongTyNavigation).WithMany(p => p.TinTuyenDungs)
                .HasForeignKey(d => d.MaCongTy)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("fk_TinTD_CongTy");

            entity.HasOne(d => d.MaDanhMucNavigation).WithMany(p => p.TinTuyenDungs)
                .HasForeignKey(d => d.MaDanhMuc)
                .HasConstraintName("fk_TinTD_DanhMuc");

            entity.HasOne(d => d.MaNguoiDangNavigation).WithMany(p => p.TinTuyenDungs)
                .HasForeignKey(d => d.MaNguoiDang)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("fk_TinTD_NguoiDang");

            entity.HasMany(d => d.MaKyNangs).WithMany(p => p.MaTins)
                .UsingEntity<Dictionary<string, object>>(
                    "KyNangTin",
                    r => r.HasOne<KyNang>().WithMany()
                        .HasForeignKey("MaKyNang")
                        .OnDelete(DeleteBehavior.ClientSetNull)
                        .HasConstraintName("fk_KNT_Ky"),
                    l => l.HasOne<TinTuyenDung>().WithMany()
                        .HasForeignKey("MaTin")
                        .HasConstraintName("fk_KNT_Tin"),
                    j =>
                    {
                        j.HasKey("MaTin", "MaKyNang").HasName("pk_KyNangTin");
                        j.ToTable("KyNangTin");
                    });
        });

        modelBuilder.Entity<VPipelineTuyenDung>(entity =>
        {
            entity
                .HasNoKey()
                .ToView("v_PipelineTuyenDung");

            entity.Property(e => e.TenCongTy).HasMaxLength(255);
            entity.Property(e => e.TieuDe).HasMaxLength(255);
        });

        modelBuilder.Entity<VThongKeTinCongTy>(entity =>
        {
            entity
                .HasNoKey()
                .ToView("v_ThongKeTinCongTy");

            entity.Property(e => e.TenCongTy).HasMaxLength(255);
        });

        modelBuilder.Entity<VaiTro>(entity =>
        {
            entity.HasKey(e => e.MaVaiTro).HasName("PK__VaiTro__C24C41CF3D278A3F");

            entity.ToTable("VaiTro");

            entity.HasIndex(e => e.TenVaiTro, "UQ__VaiTro__1DA5581409497614").IsUnique();

            entity.Property(e => e.MoTa).HasMaxLength(255);
            entity.Property(e => e.TenVaiTro).HasMaxLength(20);
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
