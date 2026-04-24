namespace BTL_CNW.DTO.KetQuaPhongVan
{
    public class KetQuaPhongVanDto
    {
        public int MaKetQua { get; set; }
        public int MaLich { get; set; }
        public int MaNguoiDanhGia { get; set; }
        public string? TenNguoiDanhGia { get; set; }
        public byte? DiemTongQuat { get; set; }
        public byte? DiemKyThuat { get; set; }
        public byte? DiemKyNangMem { get; set; }
        public string KetQua { get; set; } = null!;
        public string? NhanXet { get; set; }
        public DateTime NgayTao { get; set; }
        
        // Thong tin lich phong van
        public string? ViTriUngTuyen { get; set; }
        public DateTime? ThoiGianPhongVan { get; set; }
    }

    public class TaoKetQuaDto
    {
        public int MaLich { get; set; }
        public byte? DiemTongQuat { get; set; }
        public byte? DiemKyThuat { get; set; }
        public byte? DiemKyNangMem { get; set; }
        public string KetQua { get; set; } = null!; // "Dat", "KhongDat", "CanXemXet"
        public string? NhanXet { get; set; }
    }
}
