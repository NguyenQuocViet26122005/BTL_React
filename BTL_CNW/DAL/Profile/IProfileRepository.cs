using BTL_CNW.DTO.Profile;

namespace BTL_CNW.DAL.Profile
{
    public interface IProfileRepository
    {
        ProfileDto? LayProfile(int maNguoiDung);
        bool CapNhatProfile(int maNguoiDung, CapNhatProfileDto dto);
        bool DoiMatKhau(int maNguoiDung, string matKhauMoi);
        string? LayMatKhauHienTai(int maNguoiDung);
    }
}
