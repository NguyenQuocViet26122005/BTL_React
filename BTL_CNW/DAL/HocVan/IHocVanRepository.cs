using BTL_CNW.DTO.HocVan;

namespace BTL_CNW.DAL.HocVan
{
    public interface IHocVanRepository
    {
        List<HocVanDto> LayTheoHoSo(int maHoSo);
        HocVanDto? LayTheoMa(int maHocVan);
        int Them(TaoHocVanDto dto);
        bool CapNhat(int maHocVan, TaoHocVanDto dto);
        bool Xoa(int maHocVan);
    }
}
