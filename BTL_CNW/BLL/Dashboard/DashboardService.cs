using BTL_CNW.DTO.Dashboard;
using BTL_CNW.DAL.Dashboard;

namespace BTL_CNW.BLL.Dashboard
{
    public interface IDashboardService
    {
        (bool success, string message, DashboardStatsDto? data) LayThongKe(int maNguoiDung);
        (bool success, string message, List<LichPhongVanSapToiDto> data) LayLichPhongVanSapToi(int maNguoiDung, int soNgay = 7);
        (bool success, string message, List<BieuDoLuotXemDto> data) LayBieuDoLuotXem(int maNguoiDung, int soNgay = 7);
        (bool success, string message, List<BieuDoDonUngTuyenDto> data) LayBieuDoDonUngTuyen(int maNguoiDung, int soThang = 6);
    }

    public class DashboardService : IDashboardService
    {
        private readonly IDashboardRepository _repo;

        public DashboardService(IDashboardRepository repo)
        {
            _repo = repo;
        }

        public (bool success, string message, DashboardStatsDto? data) LayThongKe(int maNguoiDung)
        {
            try
            {
                if (maNguoiDung <= 0)
                    return (false, "Mã người dùng không hợp lệ", null);

                var stats = _repo.LayThongKe(maNguoiDung);
                return (true, "Lấy thống kê thành công", stats);
            }
            catch (Exception ex)
            {
                return (false, $"Lỗi hệ thống: {ex.Message}", null);
            }
        }

        public (bool success, string message, List<LichPhongVanSapToiDto> data) LayLichPhongVanSapToi(int maNguoiDung, int soNgay = 7)
        {
            try
            {
                if (maNguoiDung <= 0)
                    return (false, "Mã người dùng không hợp lệ", new List<LichPhongVanSapToiDto>());

                if (soNgay <= 0 || soNgay > 30)
                    soNgay = 7;

                var lichPhongVans = _repo.LayLichPhongVanSapToi(maNguoiDung, soNgay);
                return (true, $"Lấy lịch phỏng vấn {soNgay} ngày tới thành công", lichPhongVans);
            }
            catch (Exception ex)
            {
                return (false, $"Lỗi hệ thống: {ex.Message}", new List<LichPhongVanSapToiDto>());
            }
        }

        public (bool success, string message, List<BieuDoLuotXemDto> data) LayBieuDoLuotXem(int maNguoiDung, int soNgay = 7)
        {
            try
            {
                if (maNguoiDung <= 0)
                    return (false, "Mã người dùng không hợp lệ", new List<BieuDoLuotXemDto>());

                if (soNgay <= 0 || soNgay > 90)
                    soNgay = 7;

                var bieuDo = _repo.LayBieuDoLuotXem(maNguoiDung, soNgay);
                return (true, $"Lấy biểu đồ lượt xem {soNgay} ngày thành công", bieuDo);
            }
            catch (Exception ex)
            {
                return (false, $"Lỗi hệ thống: {ex.Message}", new List<BieuDoLuotXemDto>());
            }
        }

        public (bool success, string message, List<BieuDoDonUngTuyenDto> data) LayBieuDoDonUngTuyen(int maNguoiDung, int soThang = 6)
        {
            try
            {
                if (maNguoiDung <= 0)
                    return (false, "Mã người dùng không hợp lệ", new List<BieuDoDonUngTuyenDto>());

                if (soThang <= 0 || soThang > 12)
                    soThang = 6;

                var bieuDo = _repo.LayBieuDoDonUngTuyen(maNguoiDung, soThang);
                return (true, $"Lấy biểu đồ đơn ứng tuyển {soThang} tháng thành công", bieuDo);
            }
            catch (Exception ex)
            {
                return (false, $"Lỗi hệ thống: {ex.Message}", new List<BieuDoDonUngTuyenDto>());
            }
        }
    }
}
