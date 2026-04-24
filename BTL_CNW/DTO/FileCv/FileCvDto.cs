namespace BTL_CNW.DTO.FileCv
{
    public class FileCvDto
    {
        public int MaFileCv { get; set; }
        public int MaHoSo { get; set; }
        public string TenFile { get; set; } = null!;
        public string DuongDanFile { get; set; } = null!;
        public int? KichThuoc { get; set; }
        public string? LoaiFile { get; set; }
        public bool LaMacDinh { get; set; }
        public DateTime NgayTai { get; set; }
    }
}
