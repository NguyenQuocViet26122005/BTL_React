using BTL_CNW.DTO.Profile;
using BTL_CNW.DAL.Profile;

namespace BTL_CNW.BLL.Profile
{
    public interface IProfileService
    {
        (bool success, string message, ProfileDto? data) LayProfile(int maNguoiDung);
        (bool success, string message) CapNhatProfile(int maNguoiDung, CapNhatProfileDto dto);
        (bool success, string message) DoiMatKhau(int maNguoiDung, DoiMatKhauDto dto);
    }

    public class ProfileService : IProfileService
    {
        private readonly IProfileRepository _repo;

        public ProfileService(IProfileRepository repo)
        {
            _repo = repo;
        }

        public (bool success, string message, ProfileDto? data) LayProfile(int maNguoiDung)
        {
            try
            {
                if (maNguoiDung <= 0)
                    return (false, "Mã người dùng không hợp lệ", null);

                var profile = _repo.LayProfile(maNguoiDung);
                if (profile == null)
                    return (false, "Không tìm thấy thông tin người dùng", null);

                return (true, "Lấy thông tin profile thành công", profile);
            }
            catch (Exception ex)
            {
                return (false, $"Lỗi hệ thống: {ex.Message}", null);
            }
        }

        public (bool success, string message) CapNhatProfile(int maNguoiDung, CapNhatProfileDto dto)
        {
            try
            {
                if (maNguoiDung <= 0)
                    return (false, "Mã người dùng không hợp lệ");

                if (string.IsNullOrWhiteSpace(dto.HoTen))
                    return (false, "Họ tên không được để trống");

                if (dto.HoTen.Length < 2 || dto.HoTen.Length > 150)
                    return (false, "Họ tên phải từ 2-150 ký tự");

                if (!string.IsNullOrWhiteSpace(dto.SoDienThoai))
                {
                    // Validate số điện thoại (10-11 số)
                    if (!System.Text.RegularExpressions.Regex.IsMatch(dto.SoDienThoai, @"^0\d{9,10}$"))
                        return (false, "Số điện thoại không hợp lệ (phải bắt đầu bằng 0 và có 10-11 số)");
                }

                var result = _repo.CapNhatProfile(maNguoiDung, dto);
                return result
                    ? (true, "Cập nhật thông tin thành công")
                    : (false, "Không thể cập nhật thông tin");
            }
            catch (Exception ex)
            {
                return (false, $"Lỗi hệ thống: {ex.Message}");
            }
        }

        public (bool success, string message) DoiMatKhau(int maNguoiDung, DoiMatKhauDto dto)
        {
            try
            {
                if (maNguoiDung <= 0)
                    return (false, "Mã người dùng không hợp lệ");

                if (string.IsNullOrWhiteSpace(dto.MatKhauCu))
                    return (false, "Mật khẩu cũ không được để trống");

                if (string.IsNullOrWhiteSpace(dto.MatKhauMoi))
                    return (false, "Mật khẩu mới không được để trống");

                if (dto.MatKhauMoi.Length < 6)
                    return (false, "Mật khẩu mới phải có ít nhất 6 ký tự");

                if (dto.MatKhauMoi != dto.XacNhanMatKhau)
                    return (false, "Xác nhận mật khẩu không khớp");

                // Kiểm tra mật khẩu cũ
                var matKhauHienTai = _repo.LayMatKhauHienTai(maNguoiDung);
                if (matKhauHienTai == null)
                    return (false, "Không tìm thấy người dùng");

                // NOTE: Trong thực tế nên dùng BCrypt.Verify
                if (matKhauHienTai != dto.MatKhauCu)
                    return (false, "Mật khẩu cũ không đúng");

                if (dto.MatKhauCu == dto.MatKhauMoi)
                    return (false, "Mật khẩu mới phải khác mật khẩu cũ");

                // NOTE: Trong thực tế nên hash password bằng BCrypt
                var result = _repo.DoiMatKhau(maNguoiDung, dto.MatKhauMoi);
                return result
                    ? (true, "Đổi mật khẩu thành công")
                    : (false, "Không thể đổi mật khẩu");
            }
            catch (Exception ex)
            {
                return (false, $"Lỗi hệ thống: {ex.Message}");
            }
        }
    }
}
