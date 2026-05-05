using BTL_CNW.DTO.Auth;

namespace BTL_CNW.DAL.Auth
{
    public interface IAdminUserRepository
    {
        AdminUserListDto LayDanhSach(string? search, string? status, int page, int pageSize);
        bool CapNhatTrangThaiHoatDong(int maNguoiDung, bool dangHoatDong);
        bool TonTaiNguoiDung(int maNguoiDung);
    }
}
