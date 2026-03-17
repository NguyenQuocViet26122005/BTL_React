using BTL_CNW.DTO.TinTuyenDung;
using BTL_CNW.DAL.TinTuyenDung;

namespace BTL_CNW.BLL.TinTuyenDung
{
    public interface ITinTuyenDungService
    {
        (bool success, string message) TaoTin(TaoTinDto dto);
        (bool success, string message, List<TinTuyenDungDto> data) LayDanhSach(string? thanhPho, string? hinhThuc, string? kinhNghiem);
        (bool success, string message, List<TinTuyenDungDto> data) LayTheoCongTy(int maCongTy);
        (bool success, string message, List<TinTuyenDungDto> data) LayTheoNguoiDang(int maNguoiDang);
        (bool success, string message, TinTuyenDungDto? data) LayChiTiet(int maTin);
        (bool success, string message) CapNhat(int maTin, CapNhatTinDto dto);
        (bool success, string message) DoiTrangThai(int maTin, string trangThai, string? lyDo);
        (bool success, string message) Xoa(int maTin);
    }

    public class TinTuyenDungService : ITinTuyenDungService
    {
        private readonly ITinTuyenDungRepository _repo;
        public TinTuyenDungService(ITinTuyenDungRepository repo) => _repo = repo;

        public (bool success, string message) TaoTin(TaoTinDto dto)
        {
            try
            {
                // Validate input
                if (string.IsNullOrWhiteSpace(dto.TieuDe))
                    return (false, "Tiêu đề không được để trống");

                if (string.IsNullOrWhiteSpace(dto.MoTa))
                    return (false, "Mô tả công việc không được để trống");

                if (dto.MucLuong <= 0)
                    return (false, "Mức lương phải lớn hơn 0");

                if (dto.SoLuongTuyen <= 0)
                    return (false, "Số lượng tuyển phải lớn hơn 0");

                var result = _repo.TaoTin(dto);
                return result 
                    ? (true, "Đăng tin tuyển dụng thành công, đang chờ duyệt")
                    : (false, "Không thể đăng tin, vui lòng thử lại");
            }
            catch (Exception ex)
            {
                return (false, $"Lỗi hệ thống: {ex.Message}");
            }
        }

        public (bool success, string message, List<TinTuyenDungDto> data) LayDanhSach(string? thanhPho, string? hinhThuc, string? kinhNghiem)
        {
            try
            {
                var danhSach = _repo.LayDanhSach(thanhPho, hinhThuc, kinhNghiem);
                return (true, "Lấy danh sách tin tuyển dụng thành công", danhSach);
            }
            catch (Exception ex)
            {
                return (false, $"Lỗi hệ thống: {ex.Message}", new List<TinTuyenDungDto>());
            }
        }

        public (bool success, string message, List<TinTuyenDungDto> data) LayTheoCongTy(int maCongTy)
        {
            try
            {
                if (maCongTy <= 0)
                    return (false, "Mã công ty không hợp lệ", new List<TinTuyenDungDto>());

                var danhSach = _repo.LayTheoCongTy(maCongTy);
                return (true, "Lấy danh sách tin theo công ty thành công", danhSach);
            }
            catch (Exception ex)
            {
                return (false, $"Lỗi hệ thống: {ex.Message}", new List<TinTuyenDungDto>());
            }
        }

        public (bool success, string message, List<TinTuyenDungDto> data) LayTheoNguoiDang(int maNguoiDang)
        {
            try
            {
                if (maNguoiDang <= 0)
                    return (false, "Mã người dùng không hợp lệ", new List<TinTuyenDungDto>());

                var danhSach = _repo.LayTheoNguoiDang(maNguoiDang);
                return (true, "Lấy danh sách tin của bạn thành công", danhSach);
            }
            catch (Exception ex)
            {
                return (false, $"Lỗi hệ thống: {ex.Message}", new List<TinTuyenDungDto>());
            }
        }

        public (bool success, string message, TinTuyenDungDto? data) LayChiTiet(int maTin)
        {
            try
            {
                if (maTin <= 0)
                    return (false, "Mã tin không hợp lệ", null);

                var tin = _repo.LayChiTiet(maTin);
                if (tin == null)
                    return (false, "Không tìm thấy tin tuyển dụng", null);

                // Tăng lượt xem
                _repo.TangLuotXem(maTin);
                return (true, "Lấy chi tiết tin thành công", tin);
            }
            catch (Exception ex)
            {
                return (false, $"Lỗi hệ thống: {ex.Message}", null);
            }
        }

        public (bool success, string message) CapNhat(int maTin, CapNhatTinDto dto)
        {
            try
            {
                if (maTin <= 0)
                    return (false, "Mã tin không hợp lệ");

                // Validate input
                if (string.IsNullOrWhiteSpace(dto.TieuDe))
                    return (false, "Tiêu đề không được để trống");

                if (string.IsNullOrWhiteSpace(dto.MoTa))
                    return (false, "Mô tả công việc không được để trống");

                if (dto.MucLuong <= 0)
                    return (false, "Mức lương phải lớn hơn 0");

                if (dto.SoLuongTuyen <= 0)
                    return (false, "Số lượng tuyển phải lớn hơn 0");

                // Check if job post exists
                var existingTin = _repo.LayChiTiet(maTin);
                if (existingTin == null)
                    return (false, "Không tìm thấy tin cần cập nhật");

                var result = _repo.CapNhat(maTin, dto);
                return result 
                    ? (true, "Cập nhật tin tuyển dụng thành công")
                    : (false, "Không thể cập nhật, vui lòng thử lại");
            }
            catch (Exception ex)
            {
                return (false, $"Lỗi hệ thống: {ex.Message}");
            }
        }

        public (bool success, string message) DoiTrangThai(int maTin, string trangThai, string? lyDo)
        {
            try
            {
                if (maTin <= 0)
                    return (false, "Mã tin không hợp lệ");

                if (string.IsNullOrWhiteSpace(trangThai))
                    return (false, "Trạng thái không được để trống");

                var validStates = new[] { "Chờ duyệt", "Đã duyệt", "Từ chối", "Hết hạn", "Đã đóng" };
                if (!validStates.Contains(trangThai))
                    return (false, "Trạng thái không hợp lệ");

                // Check if job post exists
                var existingTin = _repo.LayChiTiet(maTin);
                if (existingTin == null)
                    return (false, "Không tìm thấy tin cần cập nhật");

                if (existingTin.TrangThai == trangThai)
                    return (false, $"Tin đã ở trạng thái '{trangThai}' rồi");

                var result = _repo.DoiTrangThai(maTin, trangThai, lyDo);
                return result 
                    ? (true, $"Đã cập nhật trạng thái thành '{trangThai}'")
                    : (false, "Không thể cập nhật trạng thái, vui lòng thử lại");
            }
            catch (Exception ex)
            {
                return (false, $"Lỗi hệ thống: {ex.Message}");
            }
        }

        public (bool success, string message) Xoa(int maTin)
        {
            try
            {
                if (maTin <= 0)
                    return (false, "Mã tin không hợp lệ");

                // Check if job post exists
                var existingTin = _repo.LayChiTiet(maTin);
                if (existingTin == null)
                    return (false, "Không tìm thấy tin cần xóa");

                var result = _repo.Xoa(maTin);
                return result 
                    ? (true, "Xóa tin tuyển dụng thành công")
                    : (false, "Không thể xóa tin, có thể tin đang có đơn ứng tuyển");
            }
            catch (Exception ex)
            {
                return (false, $"Lỗi hệ thống: {ex.Message}");
            }
        }
    }
}
