using System;
using System.Collections.Generic;

namespace BTL_CNW.Models;

public partial class KinhNghiemLamViec
{
    public int MaKinhNghiem { get; set; }

    public int MaHoSo { get; set; }

    public string TenCongTy { get; set; } = null!;

    public string ViTri { get; set; } = null!;

    public string? MoTa { get; set; }

    public DateOnly? NgayBatDau { get; set; }

    public DateOnly? NgayKetThuc { get; set; }

    public bool? DangLamKhong { get; set; }

    public virtual HoSoUngVien MaHoSoNavigation { get; set; } = null!;
}
