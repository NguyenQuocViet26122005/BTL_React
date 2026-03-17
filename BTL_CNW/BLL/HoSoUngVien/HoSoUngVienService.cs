using BTL_CNW.DTO.HoSoUngVien;
using BTL_CNW.DAL.HoSoUngVien;

namespace BTL_CNW.BLL.HoSoUngVien
{
    public interface IHoSoUngVienService
    {
        (bool success, string message) TaoHoSo(TaoHoSoDto dto);
        (bool success, string message, HoSoDto? data) LayTheoNguoiDung(int maNguoiDung);
        (bool success, string message, HoSoDto? data) LayTheoId(int maHoSo);
        (bool success, string message) CapNhat(int maHoSo, TaoHoSoDto dto);
    }

    public class HoSoUngVienService : IHoSoUngVienService
    {
        private readonly IHoSoUngVienRepository _repo;
        public HoSoUngVienService(IHoSoUngVienRepository repo) => _repo = repo;

        public (bool success, string message) TaoHoSo(TaoHoSoDto dto)
        {
            try
            {
                // Validate input
                if (string.IsNullOrWhiteSpace(dto.HoTen))
                    return (false, "Họ tên không được để trống");

                if (string.IsNullOrWhiteSpace(dto.Email))
                    return (false, "Email không được để trống");

                if (string.IsNullOrWhiteSpace(dto.SoDienThoai))
                    return (false, "Số điện thoại không được để trống");

                if (dto.NgaySinh == default)
                    return (false, "Ngày sinh không hợp lệ");

                // Check if user already has a profile
                var existingProfile = _repo.LayTheoNguoiDung(dto.MaNguoiDung);
                if (existingProfile != null)
                    return (false, "Bạn đã có hồ sơ rồi, vui lòng cập nhật thay vì tạo mới");

                var result = _repo.TaoHoSo(dto);
                return result 
                    ? (true, "Tạo hồ sơ ứng viên thành công")
                    : (false, "Không thể tạo hồ sơ, vui lòng thử lại");
            }
            catch (Exception ex)
            {
                return (false, $"Lỗi hệ thống: {ex.Message}");
            }
        }

        public (bool success, string message, HoSoDto? data) LayTheoNguoiDung(int maNguoiDung)
        {
            try
            {
                if (maNguoiDung <= 0)
                    return (false, "Mã người dùng không hợp lệ", null);

                var hoSo = _repo.LayTheoNguoiDung(maNguoiDung);
                return hoSo != null 
                    ? (true, "Lấy hồ sơ thành công", hoSo)
                    : (false, "Bạn chưa có hồ sơ, vui lòng tạo hồ sơ trước", null);
            }
            catch (Exception ex)
            {
                return (false, $"Lỗi hệ thống: {ex.Message}", null);
            }
        }

        public (bool success, string message, HoSoDto? data) LayTheoId(int maHoSo)
        {
            try
            {
                if (maHoSo <= 0)
                    return (false, "Mã hồ sơ không hợp lệ", null);

                var hoSo = _repo.LayTheoId(maHoSo);
                return hoSo != null 
                    ? (true, "Lấy hồ sơ thành công", hoSo)
                    : (false, "Không tìm thấy hồ sơ", null);
            }
            catch (Exception ex)
            {
                return (false, $"Lỗi hệ thống: {ex.Message}", null);
            }
        }

        public (bool success, string message) CapNhat(int maHoSo, TaoHoSoDto dto)
        {
            try
            {
                if (maHoSo <= 0)
                    return (false, "Mã hồ sơ không hợp lệ");

                // Validate input
                if (string.IsNullOrWhiteSpace(dto.HoTen))
                    return (false, "Họ tên không được để trống");

                if (string.IsNullOrWhiteSpace(dto.Email))
                    return (false, "Email không được để trống");

                if (string.IsNullOrWhiteSpace(dto.SoDienThoai))
                    return (false, "Số điện thoại không được để trống");

                // Check if profile exists
                var existingProfile = _repo.LayTheoId(maHoSo);
                if (existingProfile == null)
                    return (false, "Không tìm thấy hồ sơ cần cập nhật");

                var result = _repo.CapNhat(maHoSo, dto);
                return result 
                    ? (true, "Cập nhật hồ sơ thành công")
                    : (false, "Không thể cập nhật hồ sơ, vui lòng thử lại");
            }
            catch (Exception ex)
            {
                return (false, $"Lỗi hệ thống: {ex.Message}");
            }
        }
    }
}
