using BTL_CNW.DTO.Auth;
using BTL_CNW.DAL.Auth;

namespace BTL_CNW.BLL.Auth
{
    public interface IAuthService
    {
        NguoiDungDto? DangNhap(DangNhapDto dto);
        (bool ok, string msg) DangKy(DangKyDto dto);
    }

    public class AuthService : IAuthService
    {
        private readonly IAuthRepository _repo;
        public AuthService(IAuthRepository repo) => _repo = repo;

        public NguoiDungDto? DangNhap(DangNhapDto dto)
            => _repo.DangNhap(dto.Email, dto.MatKhau);

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
