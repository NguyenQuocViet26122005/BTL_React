using BTL_CNW.DTO.Dashboard;

namespace BTL_CNW.DAL.Dashboard
{
    public interface IDashboardRepository
    {
        DashboardStatsDto LayThongKe(int maNguoiDung);
        List<LichPhongVanSapToiDto> LayLichPhongVanSapToi(int maNguoiDung, int soNgay);
        List<BieuDoLuotXemDto> LayBieuDoLuotXem(int maNguoiDung, int soNgay);
        List<BieuDoDonUngTuyenDto> LayBieuDoDonUngTuyen(int maNguoiDung, int soThang);
    }
}
