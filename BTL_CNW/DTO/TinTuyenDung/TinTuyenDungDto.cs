namespace BTL_CNW.DTO.TinTuyenDung
{
    public class TinTuyenDungDto
    {
        public int MaTin { get; set; }
        public int MaCongTy { get; set; }
        public string TenCongTy { get; set; } = null!;
        public string? LogoCongTy { get; set; }
        public int MaNguoiDang { get; set; }
        public int? MaDanhMuc { get; set; }
        public string? TenDanhMuc { get; set; }
        public string TieuDe { get; set; } = null!;
        public string MoTa { get; set; } = null!;
        public string? YeuCau { get; set; }
        public string? QuyenLoi { get; set; }
        public string HinhThucLamViec { get; set; } = null!;
        public string? KinhNghiem { get; set; }
        public decimal? MucLuongToiThieu { get; set; }
        public decimal? MucLuongToiDa { get; set; }
        public string? DonViTien { get; set; }
        public string? DiaDiem { get; set; }
        public string? ThanhPho { get; set; }
        public DateOnly? HanNopHoSo { get; set; }
        public int? SoLuongTuyen { get; set; }
        public string TrangThai { get; set; } = null!;
        public int LuotXem { get; set; }
        public DateTime NgayTao { get; set; }
        public DateTime NgayCapNhat { get; set; }
    }
}
