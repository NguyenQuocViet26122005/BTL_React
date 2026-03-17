namespace BTL_CNW.DTO.CongTy
{
    public class TaoCongTyDto
    {
        public int MaChuSoHuu { get; set; }
        public string TenCongTy { get; set; } = null!;
        public string Email { get; set; } = null!;
        public string SoDienThoai { get; set; } = null!;
        public string? MaSoThue { get; set; }
        public string? Logo { get; set; }
        public string? Website { get; set; }
        public int? MaLinhVuc { get; set; }
        public string? QuyMo { get; set; }
        public string? DiaChi { get; set; }
        public string? ThanhPho { get; set; }
        public string? QuocGia { get; set; }
        public string? MoTa { get; set; }
    }
}
