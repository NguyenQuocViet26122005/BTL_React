using System;
using System.Collections.Generic;

namespace BTL_CNW.Models;

public partial class LinhVuc
{
    public int MaLinhVuc { get; set; }

    public string TenLinhVuc { get; set; } = null!;

    public virtual ICollection<CongTy> CongTies { get; set; } = new List<CongTy>();
}
