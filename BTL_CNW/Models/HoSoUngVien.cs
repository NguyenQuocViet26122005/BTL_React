using System;
using System.Collections.Generic;

namespace BTL_CNW.Models;

public partial class HoSoUngVien
{
    public int MaHoSo { get; set; }

    public int MaNguoiDung { get; set; }

    public string? TieuDe { get; set; }

    public string? TomTat { get; set; }

    public DateOnly? NgaySinh { get; set; }

    public string? GioiTinh { get; set; }

    public string? DiaChi { get; set; }

    public string? ThanhPho { get; set; }

    public string? LinkedIn { get; set; }

    public string? GitHub { get; set; }

    public string? Portfolio { get; set; }

    public string? TinhTrangTimViec { get; set; }

    public decimal? MucLuongMongMuon { get; set; }

    public DateTime NgayTao { get; set; }

    public DateTime NgayCapNhat { get; set; }

    public virtual ICollection<FileCv> FileCvs { get; set; } = new List<FileCv>();

    public virtual ICollection<GoiYviecLam> GoiYviecLams { get; set; } = new List<GoiYviecLam>();

    public virtual ICollection<HocVan> HocVans { get; set; } = new List<HocVan>();

    public virtual ICollection<KinhNghiemLamViec> KinhNghiemLamViecs { get; set; } = new List<KinhNghiemLamViec>();

    public virtual ICollection<KyNangUngVien> KyNangUngViens { get; set; } = new List<KyNangUngVien>();

    public virtual NguoiDung MaNguoiDungNavigation { get; set; } = null!;
}
