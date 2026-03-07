using System;
using System.Collections.Generic;

namespace BTL_CNW.Models;

public partial class KetQuaPhongVan
{
    public int MaKetQua { get; set; }

    public int MaLich { get; set; }

    public int MaNguoiDanhGia { get; set; }

    public byte? DiemTongQuat { get; set; }

    public byte? DiemKyThuat { get; set; }

    public byte? DiemKyNangMem { get; set; }

    public string KetQua { get; set; } = null!;

    public string? NhanXet { get; set; }

    public DateTime NgayTao { get; set; }

    public virtual LichPhongVan MaLichNavigation { get; set; } = null!;

    public virtual NguoiDung MaNguoiDanhGiaNavigation { get; set; } = null!;
}
