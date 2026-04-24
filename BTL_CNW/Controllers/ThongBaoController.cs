using BTL_CNW.BLL.ThongBao;
using BTL_CNW.Attributes;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;

namespace BTL_CNW.Controllers
{
    [ApiController]
    [Route("api/thong-bao")]
    [Authorize]
    public class ThongBaoController : ControllerBase
    {
        private readonly IThongBaoService _service;

        public ThongBaoController(IThongBaoService service)
        {
            _service = service;
        }

        /// <summary>Lấy danh sách thông báo - Tất cả vai trò</summary>
        [HttpGet("cua-toi/{maNguoiDung}")]
        public IActionResult LayTheoNguoiDung(int maNguoiDung, [FromQuery] int pageSize = 20, [FromQuery] int pageNumber = 1)
        {
            var result = _service.LayTheoNguoiDung(maNguoiDung, pageSize, pageNumber);
            return result.success
                ? Ok(new { success = true, message = result.message, data = result.data })
                : BadRequest(new { success = false, message = result.message });
        }

        /// <summary>Đếm thông báo chưa đọc - Tất cả vai trò</summary>
        [HttpGet("chua-doc/{maNguoiDung}")]
        public IActionResult DemChuaDoc(int maNguoiDung)
        {
            var result = _service.DemChuaDoc(maNguoiDung);
            return result.success
                ? Ok(new { success = true, message = result.message, count = result.count })
                : BadRequest(new { success = false, message = result.message });
        }

        /// <summary>Đánh dấu đã đọc - Tất cả vai trò</summary>
        [HttpPut("{maThongBao}/da-doc")]
        public IActionResult DanhDauDaDoc(long maThongBao)
        {
            var result = _service.DanhDauDaDoc(maThongBao);
            return result.success
                ? Ok(new { success = true, message = result.message })
                : BadRequest(new { success = false, message = result.message });
        }

        /// <summary>Đánh dấu tất cả đã đọc - Tất cả vai trò</summary>
        [HttpPut("tat-ca-da-doc/{maNguoiDung}")]
        public IActionResult DanhDauTatCaDaDoc(int maNguoiDung)
        {
            var result = _service.DanhDauTatCaDaDoc(maNguoiDung);
            return result.success
                ? Ok(new { success = true, message = result.message })
                : BadRequest(new { success = false, message = result.message });
        }
    }
}
