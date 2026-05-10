using BTL_CNW.BLL.HocVan;
using BTL_CNW.DTO.HocVan;
using BTL_CNW.Attributes;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using BTL_CNW.Models;

namespace BTL_CNW.Controllers
{
    [ApiController]
    [Route("api/hoc-van")]
    [Authorize]
    public class HocVanController : ControllerBase
    {
        private readonly IHocVanService _service;
        private readonly QuanLyViecLamContext _context;

        public HocVanController(IHocVanService service, QuanLyViecLamContext context)
        {
            _service = service;
            _context = context;
        }

        /// <summary>Lay hoc van theo ho so - Ung vien</summary>
        [HttpGet("ho-so/{maHoSo}")]
        [RoleAuthorize("UngVien")]
        public IActionResult LayTheoHoSo(int maHoSo)
        {
            var userIdStr = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (!int.TryParse(userIdStr, out var userId) || userId <= 0)
                return Unauthorized(new { success = false, message = "Token không hợp lệ" });

            // Kiểm tra hồ sơ thuộc về user
            var hoSo = _context.HoSoUngViens.Find(maHoSo);
            if (hoSo == null)
                return NotFound(new { success = false, message = "Không tìm thấy hồ sơ" });

            if (hoSo.MaNguoiDung != userId)
                return Forbid();

            var result = _service.LayTheoHoSo(maHoSo);
            return result.success
                ? Ok(new { success = true, message = result.message, data = result.data })
                : BadRequest(new { success = false, message = result.message });
        }

        /// <summary>Lay hoc van theo ma - Ung vien</summary>
        [HttpGet("{maHocVan}")]
        [RoleAuthorize("UngVien")]
        public IActionResult LayTheoMa(int maHocVan)
        {
            var userIdStr = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (!int.TryParse(userIdStr, out var userId) || userId <= 0)
                return Unauthorized(new { success = false, message = "Token không hợp lệ" });

            var result = _service.LayTheoMa(maHocVan);
            if (!result.success)
                return NotFound(new { success = false, message = result.message });

            // Kiểm tra học vấn thuộc về user
            var hoSo = _context.HoSoUngViens.Find(result.data!.MaHoSo);
            if (hoSo == null || hoSo.MaNguoiDung != userId)
                return Forbid();

            return Ok(new { success = true, message = result.message, data = result.data });
        }

        /// <summary>Them hoc van - Ung vien</summary>
        [HttpPost]
        [RoleAuthorize("UngVien")]
        public IActionResult Them([FromBody] TaoHocVanDto dto)
        {
            var userIdStr = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (!int.TryParse(userIdStr, out var userId) || userId <= 0)
                return Unauthorized(new { success = false, message = "Token không hợp lệ" });

            // Kiểm tra hồ sơ thuộc về user
            var hoSo = _context.HoSoUngViens.Find(dto.MaHoSo);
            if (hoSo == null)
                return NotFound(new { success = false, message = "Không tìm thấy hồ sơ" });

            if (hoSo.MaNguoiDung != userId)
                return Forbid();

            var result = _service.Them(dto);
            return result.success
                ? Ok(new { success = true, message = result.message, maHocVan = result.maHocVan })
                : BadRequest(new { success = false, message = result.message });
        }

        /// <summary>Cap nhat hoc van - Ung vien</summary>
        [HttpPut("{maHocVan}")]
        [RoleAuthorize("UngVien")]
        public IActionResult CapNhat(int maHocVan, [FromBody] TaoHocVanDto dto)
        {
            var userIdStr = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (!int.TryParse(userIdStr, out var userId) || userId <= 0)
                return Unauthorized(new { success = false, message = "Token không hợp lệ" });

            // Kiểm tra học vấn thuộc về user
            var hocVan = _context.HocVans.Find(maHocVan);
            if (hocVan == null)
                return NotFound(new { success = false, message = "Không tìm thấy học vấn" });

            var hoSo = _context.HoSoUngViens.Find(hocVan.MaHoSo);
            if (hoSo == null || hoSo.MaNguoiDung != userId)
                return Forbid();

            var result = _service.CapNhat(maHocVan, dto);
            return result.success
                ? Ok(new { success = true, message = result.message })
                : BadRequest(new { success = false, message = result.message });
        }

        /// <summary>Xoa hoc van - Ung vien</summary>
        [HttpDelete("{maHocVan}")]
        [RoleAuthorize("UngVien")]
        public IActionResult Xoa(int maHocVan)
        {
            var userIdStr = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (!int.TryParse(userIdStr, out var userId) || userId <= 0)
                return Unauthorized(new { success = false, message = "Token không hợp lệ" });

            // Kiểm tra học vấn thuộc về user
            var hocVan = _context.HocVans.Find(maHocVan);
            if (hocVan == null)
                return NotFound(new { success = false, message = "Không tìm thấy học vấn" });

            var hoSo = _context.HoSoUngViens.Find(hocVan.MaHoSo);
            if (hoSo == null || hoSo.MaNguoiDung != userId)
                return Forbid();

            var result = _service.Xoa(maHocVan);
            return result.success
                ? Ok(new { success = true, message = result.message })
                : NotFound(new { success = false, message = result.message });
        }
    }
}
