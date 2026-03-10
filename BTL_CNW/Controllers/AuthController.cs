using BTL_CNW.BLL.Auth;
using BTL_CNW.DTO.Auth;
using Microsoft.AspNetCore.Mvc;

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
        public IActionResult DangNhap(DangNhapDto dto)
        {
            var user = _service.DangNhap(dto);
            return user == null
                ? Unauthorized(new { message = "Email hoặc mật khẩu không đúng." })
                : Ok(user);
        }

        /// <summary>Đăng ký tài khoản mới</summary>
        [HttpPost("dang-ky")]
        public IActionResult DangKy(DangKyDto dto)
        {
            var (ok, msg) = _service.DangKy(dto);
            return ok ? Ok(new { message = msg }) : BadRequest(new { message = msg });
        }
    }
}
