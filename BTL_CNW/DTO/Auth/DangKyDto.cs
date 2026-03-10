namespace BTL_CNW.DTO.Auth
{
    public class DangKyDto
    {
        public int MaVaiTro { get; set; }          // 2=NhaTuyenDung, 3=UngVien
        public string HoTen { get; set; } = null!;
        public string Email { get; set; } = null!;
        public string? SoDienThoai { get; set; }
        public string MatKhau { get; set; } = null!;
    }
}
