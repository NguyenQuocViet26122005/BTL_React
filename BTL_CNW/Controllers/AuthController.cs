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
            try
            {
                var (user, token, error) = _service.DangNhap(dto);
                
                if (error != null)
                {
                    return BadRequest(new { success = false, message = error });
                }

                return Ok(new { 
                    success = true,
                    message = "Đăng nhập thành công",
                    data = new {
                        user = user,
                        token = token
                    }
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { 
                    success = false, 
                    message = "Lỗi server không xác định", 
                    error = ex.Message 
                });
            }
        }

        /// <summary>Đăng ký tài khoản mới</summary>
        [HttpPost("dang-ky")]
        [AllowAnonymous]
        public IActionResult DangKy(DangKyDto dto)
        {
            try
            {
                var (ok, msg) = _service.DangKy(dto);
                
                if (ok)
                {
                    return Ok(new { success = true, message = msg });
                }
                else
                {
                    return BadRequest(new { success = false, message = msg });
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { 
                    success = false, 
                    message = "Lỗi server không xác định", 
                    error = ex.Message 
                });
            }
        }

        /// <summary>Lấy thông tin người dùng hiện tại</summary>
        [HttpGet("me")]
        [Authorize]
        public IActionResult GetCurrentUser()
        {
            try
            {
                var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
                var userName = User.FindFirst(System.Security.Claims.ClaimTypes.Name)?.Value;
                var userEmail = User.FindFirst(System.Security.Claims.ClaimTypes.Email)?.Value;
                var userRole = User.FindFirst(System.Security.Claims.ClaimTypes.Role)?.Value;

                if (string.IsNullOrEmpty(userId))
                {
                    return Unauthorized(new { success = false, message = "Token không hợp lệ" });
                }

                return Ok(new
                {
                    success = true,
                    message = "Lấy thông tin thành công",
                    data = new
                    {
                        maNguoiDung = userId,
                        hoTen = userName,
                        email = userEmail,
                        vaiTro = userRole
                    }
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { 
                    success = false, 
                    message = "Lỗi server không xác định", 
                    error = ex.Message 
                });
            }
        }
    }
}
