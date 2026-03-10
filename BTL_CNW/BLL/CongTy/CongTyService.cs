using BTL_CNW.DTO.CongTy;
using BTL_CNW.DAL.CongTy;

namespace BTL_CNW.BLL.CongTy
{
    public interface ICongTyService
    {
        bool TaoCongTy(TaoCongTyDto dto);
        CongTyDto? LayTheoId(int maCongTy);
        CongTyDto? LayTheoChuSoHuu(int maNguoiDung);
        List<CongTyDto> LayTatCa();
        bool CapNhat(int maCongTy, CapNhatCongTyDto dto);
        bool DuyetCongTy(int maCongTy);
        bool Xoa(int maCongTy);
    }

    public class CongTyService : ICongTyService
    {
        private readonly ICongTyRepository _repo;
        public CongTyService(ICongTyRepository repo) => _repo = repo;

        public bool TaoCongTy(TaoCongTyDto dto) => _repo.TaoCongTy(dto);
        public CongTyDto? LayTheoId(int maCongTy) => _repo.LayTheoId(maCongTy);
        public CongTyDto? LayTheoChuSoHuu(int maNguoiDung) => _repo.LayTheoChuSoHuu(maNguoiDung);
        public List<CongTyDto> LayTatCa() => _repo.LayTatCa();
        public bool CapNhat(int maCongTy, CapNhatCongTyDto dto) => _repo.CapNhat(maCongTy, dto);
        public bool DuyetCongTy(int maCongTy) => _repo.DuyetCongTy(maCongTy);
        public bool Xoa(int maCongTy) => _repo.Xoa(maCongTy);
    }
}
