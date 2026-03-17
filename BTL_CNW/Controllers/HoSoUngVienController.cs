using BTL_CNW.BLL.HoSoUngVien;
using BTL_CNW.DTO.HoSoUngVien;
using BTL_CNW.Attributes;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;

namespace BTL_CNW.Controllers
{
    [ApiController]
    [Route("api/ho-so")]
    [Authorize] // Yêu cầu đăng nhập cho tất cả endpoints
    public class HoSoUngVienController : ControllerBase
    {
        private readonly IHoSoUngVienService _service;
        public HoSoUngVienController(IHoSoUngVienService service) => _service = service;

        /// <summary>Tạo hồ sơ ứng viên - Chỉ ứng viên</summary>
        [HttpPost]
        [RoleAuthorize(UserRoles.UngVien)]
        public IActionResult TaoHoSo(TaoHoSoDto dto)
        {
            var result = _service.TaoHoSo(dto);
            return result.success
                ? Ok(new { success = true, message = result.message })
                : BadRequest(new { success = false, message = result.message });
        }

        /// <summary>Lấy hồ sơ theo người dùng - Chỉ ứng viên</summary>
        [HttpGet("cua-toi/{maNguoiDung:int}")]
        [RoleAuthorize(UserRoles.UngVien)]
        public IActionResult LayTheoNguoiDung(int maNguoiDung)
        {
            var result = _service.LayTheoNguoiDung(maNguoiDung);
            return result.success
                ? Ok(new { success = true, message = result.message, data = result.data })
                : NotFound(new { success = false, message = result.message });
        }

        /// <summary>Lấy hồ sơ theo ID - Nhà tuyển dụng và ứng viên</summary>
        [HttpGet("{maHoSo:int}")]
        [RoleAuthorize(UserRoles.NhaTuyenDung, UserRoles.UngVien)]
        public IActionResult LayTheoId(int maHoSo)
        {
            var result = _service.LayTheoId(maHoSo);
            return result.success
                ? Ok(new { success = true, message = result.message, data = result.data })
                : NotFound(new { success = false, message = result.message });
        }

        /// <summary>Cập nhật hồ sơ - Chỉ ứng viên</summary>
        [HttpPut("{maHoSo:int}")]
        [RoleAuthorize(UserRoles.UngVien)]
        public IActionResult CapNhat(int maHoSo, TaoHoSoDto dto)
        {
            var result = _service.CapNhat(maHoSo, dto);
            return result.success
                ? Ok(new { success = true, message = result.message })
                : BadRequest(new { success = false, message = result.message });
        }
    }
}
