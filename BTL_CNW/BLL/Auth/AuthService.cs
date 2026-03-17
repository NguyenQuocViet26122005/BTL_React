using BTL_CNW.DTO.Auth;
using BTL_CNW.DAL.Auth;
using BTL_CNW.Services;

namespace BTL_CNW.BLL.Auth
{
    public interface IAuthService
    {
        (NguoiDungDto? user, string? token) DangNhap(DangNhapDto dto);
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

        public (NguoiDungDto? user, string? token) DangNhap(DangNhapDto dto)
        {
            var user = _repo.DangNhap(dto.Email, dto.MatKhau);
            if (user == null)
                return (null, null);

            var token = _jwtService.GenerateToken(user);
            return (user, token);
        }

        public (bool ok, string msg) DangKy(DangKyDto dto)
        {
            if (_repo.EmailDaTonTai(dto.Email))
                return (false, "Email đã được sử dụng.");
            if (dto.MaVaiTro != 2 && dto.MaVaiTro != 3)
                return (false, "Vai trò không hợp lệ. Chỉ chấp nhận 2 (NhaTuyenDung) hoặc 3 (UngVien).");
            return _repo.DangKy(dto) ? (true, "Đăng ký thành công!") : (false, "Đăng ký thất bại.");
        }
    }
}
