using System;
using System.Collections.Generic;

namespace BTL_CNW.Models;

public partial class KyNangUngVien
{
    public int MaHoSo { get; set; }

    public int MaKyNang { get; set; }

    public string? TrinhDo { get; set; }

    public virtual HoSoUngVien MaHoSoNavigation { get; set; } = null!;

    public virtual KyNang MaKyNangNavigation { get; set; } = null!;
}
