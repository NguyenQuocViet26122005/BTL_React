using System.Security.Claims;
using BTL_CNW.Attributes;
using BTL_CNW.BLL.Auth;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BTL_CNW.Controllers
{
    [ApiController]
    [Route("api/admin/users")]
    [Authorize]
    [RoleAuthorize(UserRoles.QuanTriVien)]
    public class AdminUsersController : ControllerBase
    {
        private readonly IAdminUserService _service;

        public AdminUsersController(IAdminUserService service)
        {
            _service = service;
        }

        [HttpGet]
        public IActionResult LayDanhSach(
            [FromQuery] string? search,
            [FromQuery] string? status = "all",
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 10)
        {
            var result = _service.LayDanhSach(search, status, page, pageSize);
            return result.success
                ? Ok(new { success = true, message = result.message, data = result.data })
                : BadRequest(new { success = false, message = result.message });
        }

        [HttpPatch("{maNguoiDung:int}/lock")]
        public IActionResult KhoaTaiKhoan(int maNguoiDung)
        {
            if (!TryGetCurrentUserId(out var currentUserId))
                return Unauthorized(new { success = false, message = "Token không hợp lệ" });

            var result = _service.KhoaTaiKhoan(maNguoiDung, currentUserId);
            return result.success
                ? Ok(new { success = true, message = result.message })
                : BadRequest(new { success = false, message = result.message });
        }

        [HttpPatch("{maNguoiDung:int}/unlock")]
        public IActionResult MoKhoaTaiKhoan(int maNguoiDung)
        {
            if (!TryGetCurrentUserId(out var currentUserId))
                return Unauthorized(new { success = false, message = "Token không hợp lệ" });

            var result = _service.MoKhoaTaiKhoan(maNguoiDung, currentUserId);
            return result.success
                ? Ok(new { success = true, message = result.message })
                : BadRequest(new { success = false, message = result.message });
        }

        private bool TryGetCurrentUserId(out int currentUserId)
        {
            var userIdStr = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            return int.TryParse(userIdStr, out currentUserId) && currentUserId > 0;
        }
    }
}
