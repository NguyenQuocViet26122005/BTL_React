namespace BTL_CNW.DTO.ThuMoiLamViec
{
    public class ThuMoiLamViecDto
    {
        public int MaThuMoi { get; set; }
        public int MaDon { get; set; }
        public int MaNguoiPhatHanh { get; set; }
        public string? TenNguoiPhatHanh { get; set; }
        public string ViTriCongViec { get; set; } = null!;
        public decimal MucLuong { get; set; }
        public string? DonViTien { get; set; }
        public DateOnly? NgayBatDauDuKien { get; set; }
        public DateOnly? NgayHetHan { get; set; }
        public string? FileThuMoi { get; set; }
        public string TrangThai { get; set; } = null!; // "ChoXacNhan", "DaChapNhan", "DaTuChoi", "HetHan"
        public DateTime? NgayPhanHoi { get; set; }
        public string? GhiChu { get; set; }
        public DateTime NgayTao { get; set; }
        public DateTime NgayCapNhat { get; set; }
        
        // Thong tin don ung tuyen
        public string? TenUngVien { get; set; }
        public string? TenCongTy { get; set; }
    }

    public class TaoThuMoiDto
    {
        public int MaDon { get; set; }
        public string ViTriCongViec { get; set; } = null!;
        public decimal MucLuong { get; set; }
        public string? DonViTien { get; set; }
        public DateOnly? NgayBatDauDuKien { get; set; }
        public DateOnly? NgayHetHan { get; set; }
        public string? GhiChu { get; set; }
    }

    public class PhanHoiThuMoiDto
    {
        public string TrangThai { get; set; } = null!; // "DaChapNhan" or "DaTuChoi"
        public string? GhiChu { get; set; }
    }
}
