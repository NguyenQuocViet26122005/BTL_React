using System;
using System.Collections.Generic;

namespace BTL_CNW.Models;

public partial class LichPhongVan
{
    public int MaLich { get; set; }

    public int MaDon { get; set; }

    public int MaNguoiLich { get; set; }

    public byte VongPhongVan { get; set; }

    public string HinhThuc { get; set; } = null!;

    public DateTime ThoiGian { get; set; }

    public short? ThoiLuongPhut { get; set; }

    public string? DiaDiem { get; set; }

    public string? GhiChu { get; set; }

    public string TrangThai { get; set; } = null!;

    public DateTime NgayTao { get; set; }

    public DateTime NgayCapNhat { get; set; }

    public virtual KetQuaPhongVan? KetQuaPhongVan { get; set; }

    public virtual DonUngTuyen MaDonNavigation { get; set; } = null!;

    public virtual NguoiDung MaNguoiLichNavigation { get; set; } = null!;
}
