using BTL_CNW.DTO.FileCv;

namespace BTL_CNW.BLL.FileCv
{
    public interface IFileCvService
    {
        (bool success, string message, FileCvDto? data) TaoFileCv(int maHoSo, string tenFile, string duongDan, int kichThuoc, string loaiFile, bool laMacDinh);
        (bool success, string message, List<FileCvDto>? data) LayDanhSachCvTheoHoSo(int maHoSo);
        (bool success, string message, FileCvDto? data) LayChiTietFileCv(int maFileCv);
        (bool success, string message) DatFileCvMacDinh(int maFileCv, int maHoSo);
        (bool success, string message) XoaFileCv(int maFileCv);
    }
}
