namespace BTL_CNW.DTO.TinTuyenDung
{
    public class TaoTinDto
    {
        public int MaCongTy { get; set; }
        public int MaNguoiDang { get; set; }
        public int? MaDanhMuc { get; set; }
        public string TieuDe { get; set; } = null!;
        public string MoTa { get; set; } = null!;
        public string? YeuCau { get; set; }
        public string? QuyenLoi { get; set; }
        public string HinhThucLamViec { get; set; } = "ToanThoiGian";
        public string? KinhNghiem { get; set; }
        public decimal MucLuong { get; set; }
        public decimal? MucLuongToiThieu { get; set; }
        public decimal? MucLuongToiDa { get; set; }
        public string? DonViTien { get; set; }
        public string? DiaDiem { get; set; }
        public string? ThanhPho { get; set; }
        public DateOnly? HanNopHoSo { get; set; }
        public int SoLuongTuyen { get; set; } = 1;
        public List<int>? DanhSachKyNang { get; set; }
    }
}
