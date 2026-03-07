using System;
using System.Collections.Generic;

namespace BTL_CNW.Models;

public partial class TinDaLuu
{
    public int MaNguoiDung { get; set; }

    public int MaTin { get; set; }

    public DateTime NgayLuu { get; set; }

    public virtual NguoiDung MaNguoiDungNavigation { get; set; } = null!;

    public virtual TinTuyenDung MaTinNavigation { get; set; } = null!;
}
