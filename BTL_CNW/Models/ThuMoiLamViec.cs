using System;
using System.Collections.Generic;

namespace BTL_CNW.Models;

public partial class ThuMoiLamViec
{
    public int MaThuMoi { get; set; }

    public int MaDon { get; set; }

    public int MaNguoiPhatHanh { get; set; }

    public string ViTriCongViec { get; set; } = null!;

    public decimal MucLuong { get; set; }

    public string? DonViTien { get; set; }

    public DateOnly? NgayBatDauDuKien { get; set; }

    public DateOnly? NgayHetHan { get; set; }

    public string? FileThuMoi { get; set; }

    public string TrangThai { get; set; } = null!;

    public DateTime? NgayPhanHoi { get; set; }

    public string? GhiChu { get; set; }

    public DateTime NgayTao { get; set; }

    public DateTime NgayCapNhat { get; set; }

    public virtual DonUngTuyen MaDonNavigation { get; set; } = null!;

    public virtual NguoiDung MaNguoiPhatHanhNavigation { get; set; } = null!;
}
