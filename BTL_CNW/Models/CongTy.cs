using System;
using System.Collections.Generic;

namespace BTL_CNW.Models;

public partial class CongTy
{
    public int MaCongTy { get; set; }

    public int MaChuSoHuu { get; set; }

    public string TenCongTy { get; set; } = null!;

    public string? MaSoThue { get; set; }

    public string? Logo { get; set; }

    public string? Website { get; set; }

    public int? MaLinhVuc { get; set; }

    public string? QuyMo { get; set; }

    public string? DiaChi { get; set; }

    public string? ThanhPho { get; set; }

    public string? QuocGia { get; set; }

    public string? MoTa { get; set; }

    public bool DaDuocDuyet { get; set; }

    public DateTime NgayTao { get; set; }

    public DateTime NgayCapNhat { get; set; }

    public virtual NguoiDung MaChuSoHuuNavigation { get; set; } = null!;

    public virtual LinhVuc? MaLinhVucNavigation { get; set; }

    public virtual ICollection<TinTuyenDung> TinTuyenDungs { get; set; } = new List<TinTuyenDung>();
}
