namespace BTL_CNW.DTO.ThongBao
{
    public class ThongBaoDto
    {
        public long MaThongBao { get; set; }
        public int MaNguoiDung { get; set; }
        public string LoaiThongBao { get; set; } = null!;
        public string TieuDe { get; set; } = null!;
        public string? NoiDung { get; set; }
        public string? LoaiLienKet { get; set; }
        public int? MaLienKet { get; set; }
        public bool DaDoc { get; set; }
        public DateTime NgayTao { get; set; }
    }
}
