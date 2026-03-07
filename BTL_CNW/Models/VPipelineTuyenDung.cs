using System;
using System.Collections.Generic;

namespace BTL_CNW.Models;

public partial class VPipelineTuyenDung
{
    public int MaTin { get; set; }

    public string TieuDe { get; set; } = null!;

    public string TenCongTy { get; set; } = null!;

    public int? TongDonNop { get; set; }

    public int? DaNop { get; set; }

    public int? DangXem { get; set; }

    public int? VaoDanhSach { get; set; }

    public int? TuChoi { get; set; }

    public int? SoLichPhongVan { get; set; }

    public int? SoThuMoi { get; set; }

    public int? SoNhanViec { get; set; }
}
