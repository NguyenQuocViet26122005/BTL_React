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
            => _service.TaoHoSo(dto) ? Ok(new { message = "Tạo hồ sơ thành công!" }) : BadRequest(new { message = "Tạo hồ sơ thất bại." });

        /// <summary>Lấy hồ sơ theo người dùng - Chỉ ứng viên</summary>
        [HttpGet("cua-toi/{maNguoiDung:int}")]
        [RoleAuthorize(UserRoles.UngVien)]
        public IActionResult LayTheoNguoiDung(int maNguoiDung)
        {
            var hs = _service.LayTheoNguoiDung(maNguoiDung);
            return hs == null ? NotFound(new { message = "Chưa có hồ sơ." }) : Ok(hs);
        }

        /// <summary>Lấy hồ sơ theo ID - Nhà tuyển dụng và ứng viên</summary>
        [HttpGet("{maHoSo:int}")]
        [RoleAuthorize(UserRoles.NhaTuyenDung, UserRoles.UngVien)]
        public IActionResult LayTheoId(int maHoSo)
        {
            var hs = _service.LayTheoId(maHoSo);
            return hs == null ? NotFound(new { message = "Không tìm thấy hồ sơ." }) : Ok(hs);
        }

        /// <summary>Cập nhật hồ sơ - Chỉ ứng viên</summary>
        [HttpPut("{maHoSo:int}")]
        [RoleAuthorize(UserRoles.UngVien)]
        public IActionResult CapNhat(int maHoSo, TaoHoSoDto dto)
            => _service.CapNhat(maHoSo, dto) ? Ok(new { message = "Cập nhật thành công!" }) : BadRequest(new { message = "Cập nhật thất bại." });
    }
}
