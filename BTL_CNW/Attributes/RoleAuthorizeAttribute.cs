using Microsoft.AspNetCore.Authorization;

namespace BTL_CNW.Attributes
{
    /// <summary>
    /// Custom authorization attribute để kiểm tra vai trò người dùng
    /// </summary>
    public class RoleAuthorizeAttribute : AuthorizeAttribute
    {
        public RoleAuthorizeAttribute(params string[] roles)
        {
            Roles = string.Join(",", roles);
        }
    }

    /// <summary>
    /// Các vai trò trong hệ thống
    /// </summary>
    public static class UserRoles
    {
        public const string QuanTriVien = "QuanTriVien";
        public const string NhaTuyenDung = "NhaTuyenDung";
        public const string UngVien = "UngVien";
    }
}