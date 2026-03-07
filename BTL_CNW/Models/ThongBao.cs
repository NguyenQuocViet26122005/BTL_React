using System;
using System.Collections.Generic;

namespace BTL_CNW.Models;

public partial class ThongBao
{
    public long MaThongBao { get; set; }

    public int MaNguoiDung { get; set; }

    public string LoaiThongBao { get; set; } = null!;

    public string TieuDe { get; set; } = null!;

    public string? NoiDung { get; set; }

    public string? LoaiLienKet { get; set; }

    public int? MaLienKet { get; set; }

    public bool DaDoc { get; set; }

    public DateTime NgayTao { get; set; }

    public virtual NguoiDung MaNguoiDungNavigation { get; set; } = null!;
}
