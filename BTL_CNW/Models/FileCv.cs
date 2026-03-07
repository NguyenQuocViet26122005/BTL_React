using System;
using System.Collections.Generic;

namespace BTL_CNW.Models;

public partial class FileCv
{
    public int MaFileCv { get; set; }

    public int MaHoSo { get; set; }

    public string TenFile { get; set; } = null!;

    public string DuongDanFile { get; set; } = null!;

    public int? KichThuoc { get; set; }

    public string? LoaiFile { get; set; }

    public bool LaMacDinh { get; set; }

    public DateTime NgayTai { get; set; }

    public virtual ICollection<DonUngTuyen> DonUngTuyens { get; set; } = new List<DonUngTuyen>();

    public virtual HoSoUngVien MaHoSoNavigation { get; set; } = null!;

    public virtual ICollection<NhatKyXemCv> NhatKyXemCvs { get; set; } = new List<NhatKyXemCv>();
}
