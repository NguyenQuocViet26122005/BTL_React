namespace BTL_CNW.DTO.CongTy
{
    public class CongTyDto
    {
        public int MaCongTy { get; set; }
        public int MaChuSoHuu { get; set; }
        public string TenCongTy { get; set; } = null!;
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
        public bool DaDuocDuyet { get; set; }
        public string TrangThai => DaDuocDuyet ? "Đã duyệt" : "Chờ duyệt";
        public DateTime NgayTao { get; set; }
    }
}
