using BTL_CNW.BLL.CongTy;
using BTL_CNW.DTO.CongTy;
using Microsoft.AspNetCore.Mvc;

namespace BTL_CNW.Controllers
{
    [ApiController]
    [Route("api/cong-ty")]
    public class CongTyController : ControllerBase
    {
        private readonly ICongTyService _service;
        public CongTyController(ICongTyService service) => _service = service;

        /// <summary>Tạo công ty mới</summary>
        [HttpPost]
        public IActionResult TaoCongTy(TaoCongTyDto dto)
            => _service.TaoCongTy(dto) ? Ok(new { message = "Tạo công ty thành công!" }) : BadRequest(new { message = "Tạo công ty thất bại." });

        /// <summary>Lấy tất cả công ty (QuanTriVien)</summary>
        [HttpGet]
        public IActionResult LayTatCa()
            => Ok(_service.LayTatCa());

        /// <summary>Lấy công ty theo ID</summary>
        [HttpGet("{maCongTy:int}")]
        public IActionResult LayTheoId(int maCongTy)
        {
            var ct = _service.LayTheoId(maCongTy);
            return ct == null ? NotFound(new { message = "Không tìm thấy công ty." }) : Ok(ct);
        }

        /// <summary>Lấy công ty của nhà tuyển dụng</summary>
        [HttpGet("cua-toi/{maNguoiDung:int}")]
        public IActionResult LayTheoChuSoHuu(int maNguoiDung)
        {
            var ct = _service.LayTheoChuSoHuu(maNguoiDung);
            return ct == null ? NotFound(new { message = "Chưa có công ty." }) : Ok(ct);
        }

        /// <summary>Cập nhật thông tin công ty</summary>
        [HttpPut("{maCongTy:int}")]
        public IActionResult CapNhat(int maCongTy, CapNhatCongTyDto dto)
            => _service.CapNhat(maCongTy, dto) ? Ok(new { message = "Cập nhật thành công!" }) : BadRequest(new { message = "Cập nhật thất bại." });

        /// <summary>Admin duyệt công ty</summary>
        [HttpPut("{maCongTy:int}/duyet")]
        public IActionResult DuyetCongTy(int maCongTy)
            => _service.DuyetCongTy(maCongTy) ? Ok(new { message = "Đã duyệt công ty." }) : BadRequest(new { message = "Duyệt thất bại." });

        /// <summary>Xóa công ty</summary>
        [HttpDelete("{maCongTy:int}")]
        public IActionResult Xoa(int maCongTy)
            => _service.Xoa(maCongTy) ? Ok(new { message = "Đã xóa công ty." }) : BadRequest(new { message = "Xóa thất bại." });
    }
}
