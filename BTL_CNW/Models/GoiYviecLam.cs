using System;
using System.Collections.Generic;

namespace BTL_CNW.Models;

public partial class GoiYviecLam
{
    public long MaGoiY { get; set; }

    public int MaHoSo { get; set; }

    public int MaTin { get; set; }

    public decimal DiemPhuHop { get; set; }

    public string? LyDo { get; set; }

    public DateTime NgayTao { get; set; }

    public virtual HoSoUngVien MaHoSoNavigation { get; set; } = null!;

    public virtual TinTuyenDung MaTinNavigation { get; set; } = null!;
}
