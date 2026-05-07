using BTL_CNW.BLL.ThuMoiLamViec;
using BTL_CNW.DTO.ThuMoiLamViec;
using BTL_CNW.Attributes;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace BTL_CNW.Controllers
{
    [ApiController]
    [Route("api/thu-moi")]
    [Authorize]
    public class ThuMoiLamViecController : ControllerBase
    {
        private readonly IThuMoiLamViecService _service;

        public ThuMoiLamViecController(IThuMoiLamViecService service)
        {
            _service = service;
        }

        /// <summary>Lay thu moi theo ma - Tat ca vai tro</summary>
        [HttpGet("{maThuMoi}")]
        public IActionResult LayTheoMa(int maThuMoi)
        {
            var result = _service.LayTheoMa(maThuMoi);
            return result.success
                ? Ok(new { success = true, message = result.message, data = result.data })
                : NotFound(new { success = false, message = result.message });
        }

        /// <summary>Lay thu moi cua ung vien - Ung vien</summary>
        [HttpGet("ung-vien/{maUngVien}")]
        [RoleAuthorize("UngVien")] // Ung vien
        public IActionResult LayTheoUngVien(int maUngVien)
        {
            var userIdStr = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (!int.TryParse(userIdStr, out var userId) || userId <= 0)
                return Unauthorized(new { success = false, message = "Token không hợp lệ" });

            if (maUngVien != userId)
                return Forbid();

            var result = _service.LayTheoUngVien(maUngVien);
            return Ok(new { success = true, message = result.message, data = result.data });
        }

        /// <summary>Lay thu moi cua cong ty - Nha tuyen dung</summary>
        [HttpGet("cong-ty/{maCongTy}")]
        [RoleAuthorize("NhaTuyenDung")] // Nha tuyen dung
        public IActionResult LayTheoCongTy(int maCongTy)
        {
            var result = _service.LayTheoCongTy(maCongTy);
            return Ok(new { success = true, message = result.message, data = result.data });
        }

        /// <summary>Lay thu moi cua nguoi phat hanh - Nha tuyen dung</summary>
        [HttpGet("nguoi-phat-hanh/{maNguoiPhatHanh}")]
        [RoleAuthorize("NhaTuyenDung")] // Nha tuyen dung
        public IActionResult LayTheoNguoiPhatHanh(int maNguoiPhatHanh)
        {
            var userIdStr = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (!int.TryParse(userIdStr, out var userId) || userId <= 0)
                return Unauthorized(new { success = false, message = "Token không hợp lệ" });

            if (maNguoiPhatHanh != userId)
                return Forbid();

            var result = _service.LayTheoNguoiPhatHanh(maNguoiPhatHanh);
            return Ok(new { success = true, message = result.message, data = result.data });
        }

        /// <summary>Gui thu moi lam viec - Nha tuyen dung</summary>
        [HttpPost]
        [RoleAuthorize("NhaTuyenDung")] // Nha tuyen dung
        public IActionResult Tao([FromBody] TaoThuMoiDto dto)
        {
            var maNguoiPhatHanh = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
            var result = _service.Tao(dto, maNguoiPhatHanh);
            return result.success
                ? Ok(new { success = true, message = result.message, maThuMoi = result.maThuMoi })
                : BadRequest(new { success = false, message = result.message });
        }

        /// <summary>Phan hoi thu moi (chap nhan/tu choi) - Ung vien</summary>
        [HttpPut("{maThuMoi}/phan-hoi")]
        [RoleAuthorize("UngVien")] // Ung vien
        public IActionResult PhanHoi(int maThuMoi, [FromBody] PhanHoiThuMoiDto dto)
        {
            var result = _service.PhanHoi(maThuMoi, dto);
            return result.success
                ? Ok(new { success = true, message = result.message })
                : BadRequest(new { success = false, message = result.message });
        }

        /// <summary>Xoa thu moi - Nha tuyen dung</summary>
        [HttpDelete("{maThuMoi}")]
        [RoleAuthorize("NhaTuyenDung")] // Nha tuyen dung
        public IActionResult Xoa(int maThuMoi)
        {
            var result = _service.Xoa(maThuMoi);
            return result.success
                ? Ok(new { success = true, message = result.message })
                : NotFound(new { success = false, message = result.message });
        }
    }
}
