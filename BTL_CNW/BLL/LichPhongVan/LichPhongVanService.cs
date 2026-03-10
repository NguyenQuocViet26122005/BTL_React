using BTL_CNW.DTO.LichPhongVan;
using BTL_CNW.DAL.LichPhongVan;

namespace BTL_CNW.BLL.LichPhongVan
{
    public interface ILichPhongVanService
    {
        bool TaoLich(TaoLichDto dto);
        List<LichPhongVanDto> LayTheoDon(int maDon);
        LichPhongVanDto? LayChiTiet(int maLich);
        bool DoiTrangThai(int maLich, string trangThai);
    }

    public class LichPhongVanService : ILichPhongVanService
    {
        private readonly ILichPhongVanRepository _repo;
        public LichPhongVanService(ILichPhongVanRepository repo) => _repo = repo;

        public bool TaoLich(TaoLichDto dto) => _repo.TaoLich(dto);
        public List<LichPhongVanDto> LayTheoDon(int maDon) => _repo.LayTheoDon(maDon);
        public LichPhongVanDto? LayChiTiet(int maLich) => _repo.LayChiTiet(maLich);
        public bool DoiTrangThai(int maLich, string trangThai) => _repo.DoiTrangThai(maLich, trangThai);
    }
}
