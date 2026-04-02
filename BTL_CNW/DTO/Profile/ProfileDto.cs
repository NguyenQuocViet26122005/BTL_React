namespace BTL_CNW.DTO.Profile
{
    public class ProfileDto
    {
        // Thông tin người dùng
        public int MaNguoiDung { get; set; }
        public string HoTen { get; set; } = null!;
        public string Email { get; set; } = null!;
        public string? SoDienThoai { get; set; }
        public string? AnhDaiDien { get; set; }
        public bool DangHoatDong { get; set; }
        public DateTime NgayTao { get; set; }

        // Thông tin công ty
        public int? MaCongTy { get; set; }
        public string? TenCongTy { get; set; }
        public string? MaSoThue { get; set; }
        public string? Logo { get; set; }
        public string? Website { get; set; }
        public int? MaLinhVuc { get; set; }
        public string? TenLinhVuc { get; set; }
        public string? QuyMo { get; set; }
        public string? DiaChi { get; set; }
        public string? ThanhPho { get; set; }
        public string? QuocGia { get; set; }
        public string? MoTa { get; set; }
        public bool? DaDuocDuyet { get; set; }
        public string? TrangThaiCongTy { get; set; }
    }

    public class CapNhatProfileDto
    {
        public string HoTen { get; set; } = null!;
        public string? SoDienThoai { get; set; }
        public string? AnhDaiDien { get; set; }
    }

    public class DoiMatKhauDto
    {
        public string MatKhauCu { get; set; } = null!;
        public string MatKhauMoi { get; set; } = null!;
        public string XacNhanMatKhau { get; set; } = null!;
    }
}
