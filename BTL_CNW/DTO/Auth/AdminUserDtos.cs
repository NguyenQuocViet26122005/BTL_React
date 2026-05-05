namespace BTL_CNW.DTO.Auth
{
    public class AdminUserListItemDto
    {
        public int MaNguoiDung { get; set; }
        public string HoTen { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string? SoDienThoai { get; set; }
        public string TenVaiTro { get; set; } = string.Empty;
        public bool DangHoatDong { get; set; }
        public DateTime NgayTao { get; set; }
    }

    public class AdminUserListDto
    {
        public List<AdminUserListItemDto> Items { get; set; } = new();
        public int Total { get; set; }
        public int Page { get; set; }
        public int PageSize { get; set; }
    }
}
