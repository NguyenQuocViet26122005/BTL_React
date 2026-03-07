using System;
using System.Collections.Generic;

namespace BTL_CNW.Models;

public partial class DonUngTuyen
{
    public int MaDon { get; set; }

    public int MaTin { get; set; }

    public int MaUngVien { get; set; }

    public int MaFileCv { get; set; }

    public string? ThuGioiThieu { get; set; }

    public string TrangThai { get; set; } = null!;

    public DateTime NgayNop { get; set; }

    public DateTime NgayCapNhat { get; set; }

    public virtual ICollection<LichPhongVan> LichPhongVans { get; set; } = new List<LichPhongVan>();

    public virtual FileCv MaFileCvNavigation { get; set; } = null!;

    public virtual TinTuyenDung MaTinNavigation { get; set; } = null!;

    public virtual NguoiDung MaUngVienNavigation { get; set; } = null!;

    public virtual ThuMoiLamViec? ThuMoiLamViec { get; set; }
}
