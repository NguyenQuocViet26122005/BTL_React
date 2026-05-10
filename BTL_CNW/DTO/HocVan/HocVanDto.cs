namespace BTL_CNW.DTO.HocVan
{
    public class HocVanDto
    {
        public int MaHocVan { get; set; }
        public int MaHoSo { get; set; }
        public string TruongHoc { get; set; } = null!;
        public string? BangCap { get; set; }
        public string? ChuyenNganh { get; set; }
        public decimal? DiemTrungBinh { get; set; }
        public DateOnly? NgayBatDau { get; set; }
        public DateOnly? NgayKetThuc { get; set; }
        public bool? DangHocKhong { get; set; }
    }

    public class TaoHocVanDto
    {
        public int MaHoSo { get; set; }
        public string TruongHoc { get; set; } = null!;
        public string? BangCap { get; set; }
        public string? ChuyenNganh { get; set; }
        public decimal? DiemTrungBinh { get; set; }
        public DateOnly? NgayBatDau { get; set; }
        public DateOnly? NgayKetThuc { get; set; }
        public bool? DangHocKhong { get; set; }
    }
}
