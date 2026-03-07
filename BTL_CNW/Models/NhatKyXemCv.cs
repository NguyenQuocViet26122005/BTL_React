using System;
using System.Collections.Generic;

namespace BTL_CNW.Models;

public partial class NhatKyXemCv
{
    public long MaNhatKy { get; set; }

    public int MaFileCv { get; set; }

    public int MaNguoiXem { get; set; }

    public DateTime NgayXem { get; set; }

    public string? DiaChiIp { get; set; }

    public string? MucDich { get; set; }

    public virtual FileCv MaFileCvNavigation { get; set; } = null!;

    public virtual NguoiDung MaNguoiXemNavigation { get; set; } = null!;
}
