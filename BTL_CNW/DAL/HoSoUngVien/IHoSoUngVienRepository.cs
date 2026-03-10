using BTL_CNW.DTO.HoSoUngVien;

namespace BTL_CNW.DAL.HoSoUngVien
{
    public interface IHoSoUngVienRepository
    {
        bool TaoHoSo(TaoHoSoDto dto);
        HoSoDto? LayTheoNguoiDung(int maNguoiDung);
        HoSoDto? LayTheoId(int maHoSo);
        bool CapNhat(int maHoSo, TaoHoSoDto dto);
    }
}
