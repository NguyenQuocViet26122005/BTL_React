using BTL_CNW.DTO.DonUngTuyen;

namespace BTL_CNW.DAL.DonUngTuyen
{
    public interface IDonUngTuyenRepository
    {
        bool NopDon(NopDonDto dto);
        List<DonUngTuyenDto> LayTheoUngVien(int maUngVien);
        List<DonUngTuyenDto> LayTheoTin(int maTin);
        DonUngTuyenDto? LayChiTiet(int maDon);
        bool CapNhatTrangThai(int maDon, string trangThai);
        bool DaNop(int maTin, int maUngVien);
    }
}
