namespace BTL_CNW.DTO.LichPhongVan
{
    public class TaoLichDto
    {
        public int MaDon { get; set; }
        public int MaNguoiLich { get; set; }
        public int VongPhongVan { get; set; } = 1;
        public string HinhThuc { get; set; } = "Online";
        public DateTime ThoiGian { get; set; }
        public int? ThoiLuongPhut { get; set; }
        public string? DiaDiem { get; set; }
        public string? GhiChu { get; set; }
    }
}
