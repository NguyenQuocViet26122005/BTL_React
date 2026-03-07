using System;
using System.Collections.Generic;

namespace BTL_CNW.Models;

public partial class DanhMucViecLam
{
    public int MaDanhMuc { get; set; }

    public string TenDanhMuc { get; set; } = null!;

    public int? MaDanhMucCha { get; set; }

    public virtual ICollection<DanhMucViecLam> InverseMaDanhMucChaNavigation { get; set; } = new List<DanhMucViecLam>();

    public virtual DanhMucViecLam? MaDanhMucChaNavigation { get; set; }

    public virtual ICollection<TinTuyenDung> TinTuyenDungs { get; set; } = new List<TinTuyenDung>();
}
