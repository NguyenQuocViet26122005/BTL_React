using BTL_CNW.BLL.Profile;
using BTL_CNW.DTO.Profile;
using BTL_CNW.Attributes;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;

namespace BTL_CNW.Controllers
{
    [ApiController]
    [Route("api/profile")]
    [Authorize]
    public class ProfileController : ControllerBase
    {
        private readonly IProfileService _service;

        public ProfileController(IProfileService service)
        {
            _service = service;
        }

        /// <summary>Lấy thông tin profile - Chỉ nhà tuyển dụng</summary>
        [HttpGet("{maNguoiDung:int}")]
        [RoleAuthorize(UserRoles.NhaTuyenDung)]
        public IActionResult LayProfile(int maNguoiDung)
        {
            var result = _service.LayProfile(maNguoiDung);
            return result.success
                ? Ok(new { success = true, message = result.message, data = result.data })
                : NotFound(new { success = false, message = result.message });
        }

        /// <summary>Cập nhật thông tin cá nhân - Chỉ nhà tuyển dụng</summary>
        [HttpPut("{maNguoiDung:int}")]
        [RoleAuthorize(UserRoles.NhaTuyenDung)]
        public IActionResult CapNhatProfile(int maNguoiDung, CapNhatProfileDto dto)
        {
            var result = _service.CapNhatProfile(maNguoiDung, dto);
            return result.success
                ? Ok(new { success = true, message = result.message })
                : BadRequest(new { success = false, message = result.message });
        }

        /// <summary>Đổi mật khẩu - Chỉ nhà tuyển dụng</summary>
        [HttpPost("{maNguoiDung:int}/doi-mat-khau")]
        [RoleAuthorize(UserRoles.NhaTuyenDung)]
        public IActionResult DoiMatKhau(int maNguoiDung, DoiMatKhauDto dto)
        {
            var result = _service.DoiMatKhau(maNguoiDung, dto);
            return result.success
                ? Ok(new { success = true, message = result.message })
                : BadRequest(new { success = false, message = result.message });
        }
    }
}
