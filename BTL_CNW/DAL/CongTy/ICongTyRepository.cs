using BTL_CNW.DTO.CongTy;

namespace BTL_CNW.DAL.CongTy
{
    public interface ICongTyRepository
    {
        bool TaoCongTy(TaoCongTyDto dto);
        CongTyDto? LayTheoId(int maCongTy);
        CongTyDto? LayTheoChuSoHuu(int maNguoiDung);
        List<CongTyDto> LayTatCa();
        bool CapNhat(int maCongTy, CapNhatCongTyDto dto);
        bool DuyetCongTy(int maCongTy);
        bool Xoa(int maCongTy);
    }
}
