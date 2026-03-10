namespace BTL_CNW.DTO.Auth
{
    public class NguoiDungDto
    {
        public int MaNguoiDung { get; set; }
        public int MaVaiTro { get; set; }
        public string TenVaiTro { get; set; } = null!;
        public string HoTen { get; set; } = null!;
        public string Email { get; set; } = null!;
        public string? SoDienThoai { get; set; }
        public string? AnhDaiDien { get; set; }
        public bool DangHoatDong { get; set; }
        public DateTime NgayTao { get; set; }
    }
}
