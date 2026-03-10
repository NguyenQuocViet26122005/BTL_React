using BTL_CNW.DTO.HoSoUngVien;
using BTL_CNW.DAL.HoSoUngVien;

namespace BTL_CNW.BLL.HoSoUngVien
{
    public interface IHoSoUngVienService
    {
        bool TaoHoSo(TaoHoSoDto dto);
        HoSoDto? LayTheoNguoiDung(int maNguoiDung);
        HoSoDto? LayTheoId(int maHoSo);
        bool CapNhat(int maHoSo, TaoHoSoDto dto);
    }

    public class HoSoUngVienService : IHoSoUngVienService
    {
        private readonly IHoSoUngVienRepository _repo;
        public HoSoUngVienService(IHoSoUngVienRepository repo) => _repo = repo;

        public bool TaoHoSo(TaoHoSoDto dto) => _repo.TaoHoSo(dto);
        public HoSoDto? LayTheoNguoiDung(int maNguoiDung) => _repo.LayTheoNguoiDung(maNguoiDung);
        public HoSoDto? LayTheoId(int maHoSo) => _repo.LayTheoId(maHoSo);
        public bool CapNhat(int maHoSo, TaoHoSoDto dto) => _repo.CapNhat(maHoSo, dto);
    }
}
