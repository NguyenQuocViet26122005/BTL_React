namespace BTL_CNW.DTO.DanhMuc
{
    public class DanhMucDto
    {
        public int MaDanhMuc { get; set; }
        public string TenDanhMuc { get; set; } = null!;
        public int? MaDanhMucCha { get; set; }
        public int SoLuongTin { get; set; }
        public List<DanhMucDto>? DanhMucCon { get; set; }
    }

    public class LinhVucDto
    {
        public int MaLinhVuc { get; set; }
        public string TenLinhVuc { get; set; } = null!;
    }
}
