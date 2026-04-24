using BTL_CNW.Models;

namespace BTL_CNW.DAL.FileCv
{
    public interface IFileCvRepository
    {
        Models.FileCv? TaoFileCv(int maHoSo, string tenFile, string duongDan, int kichThuoc, string loaiFile, bool laMacDinh);
        List<Models.FileCv> LayDanhSachCvTheoHoSo(int maHoSo);
        Models.FileCv? LayChiTietFileCv(int maFileCv);
        bool DatFileCvMacDinh(int maFileCv, int maHoSo);
        bool XoaFileCv(int maFileCv);
    }
}
