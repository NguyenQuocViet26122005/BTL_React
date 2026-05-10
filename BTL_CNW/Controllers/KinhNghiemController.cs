using BTL_CNW.BLL.KinhNghiemLamViec;
using BTL_CNW.DTO.KinhNghiemLamViec;
using BTL_CNW.Attributes;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using BTL_CNW.Models;

namespace BTL_CNW.Controllers
{
    [ApiController]
    [Route("api/kinh-nghiem")]
    [Authorize]
    public class KinhNghiemController : ControllerBase
    {
        private readonly IKinhNghiemService _service;
        private readonly QuanLyViecLamContext _context;

        public KinhNghiemController(IKinhNghiemService service, QuanLyViecLamContext context)
        {
            _service = service;
            _context = context;
        }

        /// <summary>Lay kinh nghiem theo ho so - Ung vien</summary>
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

        /// <summary>Lay kinh nghiem theo ma - Ung vien</summary>
        [HttpGet("{maKinhNghiem}")]
        [RoleAuthorize("UngVien")]
        public IActionResult LayTheoMa(int maKinhNghiem)
        {
            var userIdStr = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (!int.TryParse(userIdStr, out var userId) || userId <= 0)
                return Unauthorized(new { success = false, message = "Token không hợp lệ" });

            var result = _service.LayTheoMa(maKinhNghiem);
            if (!result.success)
                return NotFound(new { success = false, message = result.message });

            // Kiểm tra kinh nghiệm thuộc về user
            var hoSo = _context.HoSoUngViens.Find(result.data!.MaHoSo);
            if (hoSo == null || hoSo.MaNguoiDung != userId)
                return Forbid();

            return Ok(new { success = true, message = result.message, data = result.data });
        }

        /// <summary>Them kinh nghiem - Ung vien</summary>
        [HttpPost]
        [RoleAuthorize("UngVien")]
        public IActionResult Them([FromBody] TaoKinhNghiemDto dto)
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
                ? Ok(new { success = true, message = result.message, maKinhNghiem = result.maKinhNghiem })
                : BadRequest(new { success = false, message = result.message });
        }

        /// <summary>Cap nhat kinh nghiem - Ung vien</summary>
        [HttpPut("{maKinhNghiem}")]
        [RoleAuthorize("UngVien")]
        public IActionResult CapNhat(int maKinhNghiem, [FromBody] TaoKinhNghiemDto dto)
        {
            var userIdStr = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (!int.TryParse(userIdStr, out var userId) || userId <= 0)
                return Unauthorized(new { success = false, message = "Token không hợp lệ" });

            // Kiểm tra kinh nghiệm thuộc về user
            var kinhNghiem = _context.KinhNghiemLamViecs.Find(maKinhNghiem);
            if (kinhNghiem == null)
                return NotFound(new { success = false, message = "Không tìm thấy kinh nghiệm" });

            var hoSo = _context.HoSoUngViens.Find(kinhNghiem.MaHoSo);
            if (hoSo == null || hoSo.MaNguoiDung != userId)
                return Forbid();

            var result = _service.CapNhat(maKinhNghiem, dto);
            return result.success
                ? Ok(new { success = true, message = result.message })
                : BadRequest(new { success = false, message = result.message });
        }

        /// <summary>Xoa kinh nghiem - Ung vien</summary>
        [HttpDelete("{maKinhNghiem}")]
        [RoleAuthorize("UngVien")]
        public IActionResult Xoa(int maKinhNghiem)
        {
            var userIdStr = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (!int.TryParse(userIdStr, out var userId) || userId <= 0)
                return Unauthorized(new { success = false, message = "Token không hợp lệ" });

            // Kiểm tra kinh nghiệm thuộc về user
            var kinhNghiem = _context.KinhNghiemLamViecs.Find(maKinhNghiem);
            if (kinhNghiem == null)
                return NotFound(new { success = false, message = "Không tìm thấy kinh nghiệm" });

            var hoSo = _context.HoSoUngViens.Find(kinhNghiem.MaHoSo);
            if (hoSo == null || hoSo.MaNguoiDung != userId)
                return Forbid();

            var result = _service.Xoa(maKinhNghiem);
            return result.success
                ? Ok(new { success = true, message = result.message })
                : NotFound(new { success = false, message = result.message });
        }
    }
}
