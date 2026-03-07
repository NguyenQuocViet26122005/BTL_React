using System;
using System.Collections.Generic;

namespace BTL_CNW.Models;

public partial class NguoiDung
{
    public int MaNguoiDung { get; set; }

    public int MaVaiTro { get; set; }

    public string HoTen { get; set; } = null!;

    public string Email { get; set; } = null!;

    public string? SoDienThoai { get; set; }

    public string MatKhauMaHoa { get; set; } = null!;

    public string? AnhDaiDien { get; set; }

    public bool DangHoatDong { get; set; }

    public bool DaXacThucEmail { get; set; }

    public DateTime NgayTao { get; set; }

    public DateTime NgayCapNhat { get; set; }

    public virtual ICollection<CongTy> CongTies { get; set; } = new List<CongTy>();

    public virtual ICollection<DonUngTuyen> DonUngTuyens { get; set; } = new List<DonUngTuyen>();

    public virtual HoSoUngVien? HoSoUngVien { get; set; }

    public virtual ICollection<KetQuaPhongVan> KetQuaPhongVans { get; set; } = new List<KetQuaPhongVan>();

    public virtual ICollection<LichPhongVan> LichPhongVans { get; set; } = new List<LichPhongVan>();

    public virtual VaiTro MaVaiTroNavigation { get; set; } = null!;

    public virtual ICollection<NhatKyXemCv> NhatKyXemCvs { get; set; } = new List<NhatKyXemCv>();

    public virtual ICollection<ThongBao> ThongBaos { get; set; } = new List<ThongBao>();

    public virtual ICollection<ThuMoiLamViec> ThuMoiLamViecs { get; set; } = new List<ThuMoiLamViec>();

    public virtual ICollection<TinDaLuu> TinDaLuus { get; set; } = new List<TinDaLuu>();

    public virtual ICollection<TinTuyenDung> TinTuyenDungs { get; set; } = new List<TinTuyenDung>();
}
