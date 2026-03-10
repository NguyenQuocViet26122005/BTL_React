namespace BTL_CNW.DTO.DonUngTuyen
{
    public class DonUngTuyenDto
    {
        public int MaDon { get; set; }
        public int MaTin { get; set; }
        public string TieuDeTin { get; set; } = null!;
        public int MaUngVien { get; set; }
        public string TenUngVien { get; set; } = null!;
        public string? EmailUngVien { get; set; }
        public int MaFileCV { get; set; }
        public string? TenFileCV { get; set; }
        public string? ThuGioiThieu { get; set; }
        public string TrangThai { get; set; } = null!;
        public DateTime NgayNop { get; set; }
        public DateTime NgayCapNhat { get; set; }
    }
}
