namespace BTL_CNW.DTO.LichPhongVan
{
    public class LichPhongVanDto
    {
        public int MaLich { get; set; }
        public int MaDon { get; set; }
        public int MaNguoiLich { get; set; }
        public string TenNguoiLich { get; set; } = null!;
        public int VongPhongVan { get; set; }
        public string HinhThuc { get; set; } = null!;
        public DateTime ThoiGian { get; set; }
        public int? ThoiLuongPhut { get; set; }
        public string? DiaDiem { get; set; }
        public string? GhiChu { get; set; }
        public string TrangThai { get; set; } = null!;
        public DateTime NgayTao { get; set; }
    }
}
