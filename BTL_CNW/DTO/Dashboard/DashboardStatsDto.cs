namespace BTL_CNW.DTO.Dashboard
{
    public class DashboardStatsDto
    {
        public int TongTinDang { get; set; }
        public int TinDangTuyen { get; set; }
        public int TinDaDong { get; set; }
        public int TinChoXetDuyet { get; set; }
        public int TongDonUngTuyen { get; set; }
        public int DonMoi { get; set; }
        public int DonDangXem { get; set; }
        public int DonVaoDanhSach { get; set; }
        public int TongLuotXem { get; set; }
        public int LichPhongVanHomNay { get; set; }
        public int LichPhongVanTuanNay { get; set; }
    }

    public class LichPhongVanSapToiDto
    {
        public int MaLich { get; set; }
        public int MaDon { get; set; }
        public string TenUngVien { get; set; } = null!;
        public string EmailUngVien { get; set; } = null!;
        public string ViTriUngTuyen { get; set; } = null!;
        public byte VongPhongVan { get; set; }
        public string HinhThuc { get; set; } = null!;
        public DateTime ThoiGian { get; set; }
        public short? ThoiLuongPhut { get; set; }
        public string? DiaDiem { get; set; }
        public string TrangThai { get; set; } = null!;
    }

    public class BieuDoLuotXemDto
    {
        public string Ngay { get; set; } = null!;
        public int LuotXem { get; set; }
    }

    public class BieuDoDonUngTuyenDto
    {
        public string Thang { get; set; } = null!;
        public int SoDon { get; set; }
    }
}
