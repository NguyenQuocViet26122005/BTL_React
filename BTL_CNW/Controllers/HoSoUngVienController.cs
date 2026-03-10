using BTL_CNW.BLL.HoSoUngVien;
using BTL_CNW.DTO.HoSoUngVien;
using Microsoft.AspNetCore.Mvc;

namespace BTL_CNW.Controllers
{
    [ApiController]
    [Route("api/ho-so")]
    public class HoSoUngVienController : ControllerBase
    {
        private readonly IHoSoUngVienService _service;
        public HoSoUngVienController(IHoSoUngVienService service) => _service = service;

        /// <summary>Tạo hồ sơ ứng viên</summary>
        [HttpPost]
        public IActionResult TaoHoSo(TaoHoSoDto dto)
            => _service.TaoHoSo(dto) ? Ok(new { message = "Tạo hồ sơ thành công!" }) : BadRequest(new { message = "Tạo hồ sơ thất bại." });

        /// <summary>Lấy hồ sơ theo người dùng</summary>
        [HttpGet("cua-toi/{maNguoiDung:int}")]
        public IActionResult LayTheoNguoiDung(int maNguoiDung)
        {
            var hs = _service.LayTheoNguoiDung(maNguoiDung);
            return hs == null ? NotFound(new { message = "Chưa có hồ sơ." }) : Ok(hs);
        }

        /// <summary>Lấy hồ sơ theo ID (NhaTuyenDung xem)</summary>
        [HttpGet("{maHoSo:int}")]
        public IActionResult LayTheoId(int maHoSo)
        {
            var hs = _service.LayTheoId(maHoSo);
            return hs == null ? NotFound(new { message = "Không tìm thấy hồ sơ." }) : Ok(hs);
        }

        /// <summary>Cập nhật hồ sơ</summary>
        [HttpPut("{maHoSo:int}")]
        public IActionResult CapNhat(int maHoSo, TaoHoSoDto dto)
            => _service.CapNhat(maHoSo, dto) ? Ok(new { message = "Cập nhật thành công!" }) : BadRequest(new { message = "Cập nhật thất bại." });
    }
}
