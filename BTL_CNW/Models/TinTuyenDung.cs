using System;
using System.Collections.Generic;

namespace BTL_CNW.Models;

public partial class TinTuyenDung
{
    public int MaTin { get; set; }

    public int MaCongTy { get; set; }

    public int MaNguoiDang { get; set; }

    public int? MaDanhMuc { get; set; }

    public string TieuDe { get; set; } = null!;

    public string MoTa { get; set; } = null!;

    public string? YeuCau { get; set; }

    public string? QuyenLoi { get; set; }

    public string HinhThucLamViec { get; set; } = null!;

    public string? KinhNghiem { get; set; }

    public decimal? MucLuongToiThieu { get; set; }

    public decimal? MucLuongToiDa { get; set; }

    public string? DonViTien { get; set; }

    public string? DiaDiem { get; set; }

    public string? ThanhPho { get; set; }

    public DateOnly? HanNopHoSo { get; set; }

    public int? SoLuongTuyen { get; set; }

    public string TrangThai { get; set; } = null!;

    public string? LyDoTuChoi { get; set; }

    public int LuotXem { get; set; }

    public DateTime NgayTao { get; set; }

    public DateTime NgayCapNhat { get; set; }

    public virtual ICollection<DonUngTuyen> DonUngTuyens { get; set; } = new List<DonUngTuyen>();

    public virtual ICollection<GoiYviecLam> GoiYviecLams { get; set; } = new List<GoiYviecLam>();

    public virtual CongTy MaCongTyNavigation { get; set; } = null!;

    public virtual DanhMucViecLam? MaDanhMucNavigation { get; set; }

    public virtual NguoiDung MaNguoiDangNavigation { get; set; } = null!;

    public virtual ICollection<TinDaLuu> TinDaLuus { get; set; } = new List<TinDaLuu>();

    public virtual ICollection<KyNang> MaKyNangs { get; set; } = new List<KyNang>();
}
