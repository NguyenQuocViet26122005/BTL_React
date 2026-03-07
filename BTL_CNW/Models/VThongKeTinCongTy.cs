using System;
using System.Collections.Generic;

namespace BTL_CNW.Models;

public partial class VThongKeTinCongTy
{
    public int MaCongTy { get; set; }

    public string TenCongTy { get; set; } = null!;

    public int? TongSoTin { get; set; }

    public int? TinDangTuyen { get; set; }

    public int? TinDaDong { get; set; }
}
