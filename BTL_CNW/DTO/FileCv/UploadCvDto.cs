namespace BTL_CNW.DTO.FileCv
{
    public class UploadCvDto
    {
        public int MaHoSo { get; set; }
        public IFormFile File { get; set; } = null!;
        public bool LaMacDinh { get; set; }
    }
}
