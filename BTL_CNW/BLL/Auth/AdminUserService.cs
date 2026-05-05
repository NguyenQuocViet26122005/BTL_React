using BTL_CNW.DAL.Auth;
using BTL_CNW.DTO.Auth;

namespace BTL_CNW.BLL.Auth
{
    public interface IAdminUserService
    {
        (bool success, string message, AdminUserListDto? data) LayDanhSach(string? search, string? status, int page, int pageSize);
        (bool success, string message) KhoaTaiKhoan(int maNguoiDung, int currentUserId);
        (bool success, string message) MoKhoaTaiKhoan(int maNguoiDung, int currentUserId);
    }

    public class AdminUserService : IAdminUserService
    {
        private readonly IAdminUserRepository _repo;

        public AdminUserService(IAdminUserRepository repo)
        {
            _repo = repo;
        }

        public (bool success, string message, AdminUserListDto? data) LayDanhSach(string? search, string? status, int page, int pageSize)
        {
            try
            {
                if (page <= 0)
                    page = 1;

                if (pageSize <= 0)
                    pageSize = 10;

                if (pageSize > 100)
                    pageSize = 100;

                var normalizedStatus = string.IsNullOrWhiteSpace(status) ? "all" : status.Trim().ToLower();
                if (normalizedStatus != "all" && normalizedStatus != "active" && normalizedStatus != "locked")
                    return (false, "Trạng thái lọc không hợp lệ", null);

                var data = _repo.LayDanhSach(search?.Trim(), normalizedStatus, page, pageSize);
                return (true, "Lấy danh sách người dùng thành công", data);
            }
            catch (Exception ex)
            {
                return (false, $"Lỗi hệ thống: {ex.Message}", null);
            }
        }

        public (bool success, string message) KhoaTaiKhoan(int maNguoiDung, int currentUserId)
        {
            return CapNhatTrangThai(maNguoiDung, currentUserId, false, "Khóa tài khoản thành công", "Tài khoản đã ở trạng thái khóa");
        }

        public (bool success, string message) MoKhoaTaiKhoan(int maNguoiDung, int currentUserId)
        {
            return CapNhatTrangThai(maNguoiDung, currentUserId, true, "Mở khóa tài khoản thành công", "Tài khoản đã ở trạng thái hoạt động");
        }

        private (bool success, string message) CapNhatTrangThai(int maNguoiDung, int currentUserId, bool dangHoatDong, string successMessage, string unchangedMessage)
        {
            try
            {
                if (maNguoiDung <= 0)
                    return (false, "Mã người dùng không hợp lệ");

                if (currentUserId <= 0)
                    return (false, "Người dùng hiện tại không hợp lệ");

                if (maNguoiDung == currentUserId)
                    return (false, "Không thể tự khóa hoặc mở khóa chính mình");

                if (!_repo.TonTaiNguoiDung(maNguoiDung))
                    return (false, "Không tìm thấy người dùng");

                var updated = _repo.CapNhatTrangThaiHoatDong(maNguoiDung, dangHoatDong);
                return updated
                    ? (true, successMessage)
                    : (true, unchangedMessage);
            }
            catch (Exception ex)
            {
                return (false, $"Lỗi hệ thống: {ex.Message}");
            }
        }
    }
}
