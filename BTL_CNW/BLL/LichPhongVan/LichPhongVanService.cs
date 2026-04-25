using BTL_CNW.DTO.LichPhongVan;
using BTL_CNW.DAL.LichPhongVan;

namespace BTL_CNW.BLL.LichPhongVan
{
    public interface ILichPhongVanService
    {
        (bool success, string message) TaoLich(TaoLichDto dto);
        (bool success, string message, List<LichPhongVanDto> data) LayTheoDon(int maDon);
        (bool success, string message, LichPhongVanDto? data) LayChiTiet(int maLich);
        (bool success, string message) DoiTrangThai(int maLich, string trangThai);
        (bool success, string message) CapNhat(int maLich, TaoLichDto dto);
        (bool success, string message) Xoa(int maLich);
    }

    public class LichPhongVanService : ILichPhongVanService
    {
        private readonly ILichPhongVanRepository _repo;
        public LichPhongVanService(ILichPhongVanRepository repo) => _repo = repo;

        public (bool success, string message) TaoLich(TaoLichDto dto)
        {
            try
            {
                // Validate input
                if (dto.ThoiGian == default)
                    return (false, "Thời gian phỏng vấn không hợp lệ");

                if (dto.ThoiGian <= DateTime.Now)
                    return (false, "Thời gian phỏng vấn phải sau thời điểm hiện tại");

                if (string.IsNullOrWhiteSpace(dto.DiaDiem))
                    return (false, "Địa điểm phỏng vấn không được để trống");

                if (dto.MaDon <= 0)
                    return (false, "Mã đơn ứng tuyển không hợp lệ");

                // Check if interview already exists for this application
                var existingInterviews = _repo.LayTheoDon(dto.MaDon);
                if (existingInterviews.Any(x => x.TrangThai == "DaLen"))
                    return (false, "Đơn ứng tuyển này đã có lịch phỏng vấn rồi");

                var result = _repo.TaoLich(dto);
                return result 
                    ? (true, "Tạo lịch phỏng vấn thành công")
                    : (false, "Không thể tạo lịch phỏng vấn, vui lòng thử lại");
            }
            catch (Exception ex)
            {
                return (false, $"Lỗi hệ thống: {ex.Message}");
            }
        }

        public (bool success, string message, List<LichPhongVanDto> data) LayTheoDon(int maDon)
        {
            try
            {
                if (maDon <= 0)
                    return (false, "Mã đơn không hợp lệ", new List<LichPhongVanDto>());

                var danhSach = _repo.LayTheoDon(maDon);
                return (true, "Lấy danh sách lịch phỏng vấn thành công", danhSach);
            }
            catch (Exception ex)
            {
                return (false, $"Lỗi hệ thống: {ex.Message}", new List<LichPhongVanDto>());
            }
        }

        public (bool success, string message, LichPhongVanDto? data) LayChiTiet(int maLich)
        {
            try
            {
                if (maLich <= 0)
                    return (false, "Mã lịch không hợp lệ", null);

                var lich = _repo.LayChiTiet(maLich);
                return lich != null 
                    ? (true, "Lấy chi tiết lịch phỏng vấn thành công", lich)
                    : (false, "Không tìm thấy lịch phỏng vấn", null);
            }
            catch (Exception ex)
            {
                return (false, $"Lỗi hệ thống: {ex.Message}", null);
            }
        }

        public (bool success, string message) DoiTrangThai(int maLich, string trangThai)
        {
            try
            {
                if (maLich <= 0)
                    return (false, "Mã lịch không hợp lệ");

                if (string.IsNullOrWhiteSpace(trangThai))
                    return (false, "Trạng thái không được để trống");

                var validStates = new[] { "DaLen", "HoanThanh", "HuyBo", "VangMat" };
                if (!validStates.Contains(trangThai))
                    return (false, "Trạng thái không hợp lệ");

                // Check if interview exists
                var existingInterview = _repo.LayChiTiet(maLich);
                if (existingInterview == null)
                    return (false, "Không tìm thấy lịch phỏng vấn cần cập nhật");

                if (existingInterview.TrangThai == trangThai)
                    return (false, $"Lịch phỏng vấn đã ở trạng thái '{trangThai}' rồi");

                // Business logic validation
                if (existingInterview.TrangThai == "HoanThanh" && trangThai != "HoanThanh")
                    return (false, "Không thể thay đổi trạng thái của lịch phỏng vấn đã hoàn thành");

                var result = _repo.DoiTrangThai(maLich, trangThai);
                return result 
                    ? (true, $"Đã cập nhật trạng thái thành '{trangThai}'")
                    : (false, "Không thể cập nhật trạng thái, vui lòng thử lại");
            }
            catch (Exception ex)
            {
                return (false, $"Lỗi hệ thống: {ex.Message}");
            }
        }

        public (bool success, string message) CapNhat(int maLich, TaoLichDto dto)
        {
            try
            {
                if (maLich <= 0)
                    return (false, "Mã lịch không hợp lệ");

                if (dto.ThoiGian == default)
                    return (false, "Thời gian phỏng vấn không hợp lệ");

                if (string.IsNullOrWhiteSpace(dto.DiaDiem))
                    return (false, "Địa điểm phỏng vấn không được để trống");

                var existingInterview = _repo.LayChiTiet(maLich);
                if (existingInterview == null)
                    return (false, "Không tìm thấy lịch phỏng vấn cần cập nhật");

                if (existingInterview.TrangThai == "HoanThanh")
                    return (false, "Không thể cập nhật lịch phỏng vấn đã hoàn thành");

                var result = _repo.CapNhat(maLich, dto);
                return result 
                    ? (true, "Cập nhật lịch phỏng vấn thành công")
                    : (false, "Không thể cập nhật lịch phỏng vấn, vui lòng thử lại");
            }
            catch (Exception ex)
            {
                return (false, $"Lỗi hệ thống: {ex.Message}");
            }
        }

        public (bool success, string message) Xoa(int maLich)
        {
            try
            {
                if (maLich <= 0)
                    return (false, "Mã lịch không hợp lệ");

                var existingInterview = _repo.LayChiTiet(maLich);
                if (existingInterview == null)
                    return (false, "Không tìm thấy lịch phỏng vấn cần xóa");

                if (existingInterview.TrangThai == "HoanThanh")
                    return (false, "Không thể xóa lịch phỏng vấn đã hoàn thành");

                var result = _repo.Xoa(maLich);
                return result 
                    ? (true, "Xóa lịch phỏng vấn thành công")
                    : (false, "Không thể xóa lịch phỏng vấn, vui lòng thử lại");
            }
            catch (Exception ex)
            {
                return (false, $"Lỗi hệ thống: {ex.Message}");
            }
        }
    }
}
