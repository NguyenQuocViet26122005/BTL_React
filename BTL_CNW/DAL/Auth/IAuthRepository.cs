using BTL_CNW.DTO.Auth;

namespace BTL_CNW.DAL.Auth
{
    public interface IAuthRepository
    {
        NguoiDungDto? DangNhap(string email, string matKhau);
        bool DangKy(DangKyDto dto);
        bool EmailDaTonTai(string email);
    }
}
