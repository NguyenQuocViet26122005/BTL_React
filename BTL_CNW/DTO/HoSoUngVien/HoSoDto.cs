namespace BTL_CNW.DTO.HoSoUngVien
{
    public class HoSoDto
    {
        public int MaHoSo { get; set; }
        public int MaNguoiDung { get; set; }
        public string TenNguoiDung { get; set; } = null!;
        public string? Email { get; set; }
        public string? SoDienThoai { get; set; }
        public string? TieuDe { get; set; }
        public string? TomTat { get; set; }
        public DateOnly? NgaySinh { get; set; }
        public string? GioiTinh { get; set; }
        public string? DiaChi { get; set; }
        public string? ThanhPho { get; set; }
        public string? LinkedIn { get; set; }
        public string? GitHub { get; set; }
        public string? Portfolio { get; set; }
        public string? TinhTrangTimViec { get; set; }
        public decimal? MucLuongMongMuon { get; set; }
        public DateTime NgayTao { get; set; }
        public DateTime NgayCapNhat { get; set; }
    }
}
