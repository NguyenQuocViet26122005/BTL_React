using System;
using System.Collections.Generic;

namespace BTL_CNW.Models;

public partial class KyNang
{
    public int MaKyNang { get; set; }

    public string TenKyNang { get; set; } = null!;

    public virtual ICollection<KyNangUngVien> KyNangUngViens { get; set; } = new List<KyNangUngVien>();

    public virtual ICollection<TinTuyenDung> MaTins { get; set; } = new List<TinTuyenDung>();
}
