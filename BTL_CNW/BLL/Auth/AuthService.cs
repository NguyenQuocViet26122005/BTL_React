using BTL_CNW.DTO.Auth;
using BTL_CNW.DAL.Auth;
using BTL_CNW.Services;

namespace BTL_CNW.BLL.Auth
{
    public interface IAuthService
    {
        (NguoiDungDto? user, string? token, string? error) DangNhap(DangNhapDto dto);
        (bool ok, string msg) DangKy(DangKyDto dto);
    }

    public class AuthService : IAuthService
    {
        private readonly IAuthRepository _repo;
        private readonly IJwtService _jwtService;
        
        public AuthService(IAuthRepository repo, IJwtService jwtService)
        {
            _repo = repo;
            _jwtService = jwtService;
        }

        public (NguoiDungDto? user, string? token, string? error) DangNhap(DangNhapDto dto)
        {
            try
            {
                if (string.IsNullOrEmpty(dto.Email) || string.IsNullOrEmpty(dto.MatKhau))
                {
                    return (null, null, "Email và mật khẩu không được để trống");
                }

                var user = _repo.DangNhap(dto.Email, dto.MatKhau);
                if (user == null)
                {
                    return (null, null, "Email hoặc mật khẩu không đúng");
                }

                if (!user.DangHoatDong)
                {
                    return (null, null, "Tài khoản đã bị khóa");
                }

                var token = _jwtService.GenerateToken(user);
                return (user, token, null);
            }
            catch (Exception ex)
            {
                return (null, null, $"Lỗi hệ thống: {ex.Message}");
            }
        }

        public (bool ok, string msg) DangKy(DangKyDto dto)
        {
            try
            {
                // Validate input
                if (string.IsNullOrEmpty(dto.Email) || string.IsNullOrEmpty(dto.MatKhau))
                {
                    return (false, "Email và mật khẩu không được để trống");
                }

                if (string.IsNullOrEmpty(dto.HoTen))
                {
                    return (false, "Họ tên không được để trống");
                }

                if (!IsValidEmail(dto.Email))
                {
                    return (false, "Email không đúng định dạng");
                }

                if (dto.MatKhau.Length < 6)
                {
                    return (false, "Mật khẩu phải có ít nhất 6 ký tự");
                }

                if (_repo.EmailDaTonTai(dto.Email))
                {
                    return (false, "Email đã được sử dụng");
                }

                if (dto.MaVaiTro != 2 && dto.MaVaiTro != 3)
                {
                    return (false, "Vai trò không hợp lệ. Chỉ chấp nhận 2 (NhaTuyenDung) hoặc 3 (UngVien)");
                }

                var result = _repo.DangKy(dto);
                return result ? (true, "Đăng ký thành công") : (false, "Đăng ký thất bại. Vui lòng thử lại");
            }
            catch (Exception ex)
            {
                return (false, $"Lỗi hệ thống: {ex.Message}");
            }
        }

        private bool IsValidEmail(string email)
        {
            try
            {
                var addr = new System.Net.Mail.MailAddress(email);
                return addr.Address == email;
            }
            catch
            {
                return false;
            }
        }
    }
}
