using BTL_CNW.BLL.Auth;
using BTL_CNW.DTO.Auth;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;

namespace BTL_CNW.Controllers
{
    [ApiController]
    [Route("api/auth")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _service;
        public AuthController(IAuthService service) => _service = service;

        /// <summary>Đăng nhập</summary>
        [HttpPost("dang-nhap")]
        [AllowAnonymous]
        public IActionResult DangNhap(DangNhapDto dto)
        {
            var (user, token) = _service.DangNhap(dto);
            return user == null
                ? Unauthorized(new { message = "Email hoặc mật khẩu không đúng." })
                : Ok(new { 
                    message = "Đăng nhập thành công!",
                    user = user,
                    token = token
                });
        }

        /// <summary>Đăng ký tài khoản mới</summary>
        [HttpPost("dang-ky")]
        [AllowAnonymous]
        public IActionResult DangKy(DangKyDto dto)
        {
            var (ok, msg) = _service.DangKy(dto);
            return ok ? Ok(new { message = msg }) : BadRequest(new { message = msg });
        }

        /// <summary>Lấy thông tin người dùng hiện tại</summary>
        [HttpGet("me")]
        [Authorize]
        public IActionResult GetCurrentUser()
        {
            var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            var userName = User.FindFirst(System.Security.Claims.ClaimTypes.Name)?.Value;
            var userEmail = User.FindFirst(System.Security.Claims.ClaimTypes.Email)?.Value;
            var userRole = User.FindFirst(System.Security.Claims.ClaimTypes.Role)?.Value;

            return Ok(new
            {
                maNguoiDung = userId,
                hoTen = userName,
                email = userEmail,
                vaiTro = userRole
            });
        }
    }
}
