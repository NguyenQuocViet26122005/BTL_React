using BTL_CNW.DTO.LichPhongVan;

namespace BTL_CNW.DAL.LichPhongVan
{
    public interface ILichPhongVanRepository
    {
        bool TaoLich(TaoLichDto dto);
        List<LichPhongVanDto> LayTheoDon(int maDon);
        LichPhongVanDto? LayChiTiet(int maLich);
        bool DoiTrangThai(int maLich, string trangThai);
    }
}
