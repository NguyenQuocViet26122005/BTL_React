using BTL_CNW.BLL.KetQuaPhongVan;
using BTL_CNW.DTO.KetQuaPhongVan;
using BTL_CNW.Attributes;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace BTL_CNW.Controllers
{
    [ApiController]
    [Route("api/ket-qua-phong-van")]
    [Authorize]
    public class KetQuaPhongVanController : ControllerBase
    {
        private readonly IKetQuaPhongVanService _service;

        public KetQuaPhongVanController(IKetQuaPhongVanService service)
        {
            _service = service;
        }

        /// <summary>Lay ket qua theo ma - Tat ca vai tro</summary>
        [HttpGet("{maKetQua}")]
        public IActionResult LayTheoMa(int maKetQua)
        {
            var result = _service.LayTheoMa(maKetQua);
            return result.success
                ? Ok(new { success = true, message = result.message, data = result.data })
                : NotFound(new { success = false, message = result.message });
        }

        /// <summary>Lay ket qua theo lich phong van - Tat ca vai tro</summary>
        [HttpGet("lich/{maLich}")]
        public IActionResult LayTheoLich(int maLich)
        {
            var result = _service.LayTheoLich(maLich);
            return result.success
                ? Ok(new { success = true, message = result.message, data = result.data })
                : NotFound(new { success = false, message = result.message });
        }

        /// <summary>Lay ket qua cua ung vien - Ung vien</summary>
        [HttpGet("ung-vien/{maUngVien}")]
        [RoleAuthorize("UngVien")] // Ung vien
        public IActionResult LayTheoUngVien(int maUngVien)
        {
            var result = _service.LayTheoUngVien(maUngVien);
            return Ok(new { success = true, message = result.message, data = result.data });
        }

        /// <summary>Tao ket qua phong van - Nha tuyen dung</summary>
        [HttpPost]
        [RoleAuthorize("NhaTuyenDung")] // Nha tuyen dung
        public IActionResult Tao([FromBody] TaoKetQuaDto dto)
        {
            var maNguoiDanhGia = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
            var result = _service.Tao(dto, maNguoiDanhGia);
            return result.success
                ? Ok(new { success = true, message = result.message, maKetQua = result.maKetQua })
                : BadRequest(new { success = false, message = result.message });
        }

        /// <summary>Cap nhat ket qua phong van - Nha tuyen dung</summary>
        [HttpPut("{maKetQua}")]
        [RoleAuthorize("NhaTuyenDung")] // Nha tuyen dung
        public IActionResult CapNhat(int maKetQua, [FromBody] TaoKetQuaDto dto)
        {
            var result = _service.CapNhat(maKetQua, dto);
            return result.success
                ? Ok(new { success = true, message = result.message })
                : BadRequest(new { success = false, message = result.message });
        }

        /// <summary>Xoa ket qua phong van - Nha tuyen dung</summary>
        [HttpDelete("{maKetQua}")]
        [RoleAuthorize("NhaTuyenDung")] // Nha tuyen dung
        public IActionResult Xoa(int maKetQua)
        {
            var result = _service.Xoa(maKetQua);
            return result.success
                ? Ok(new { success = true, message = result.message })
                : NotFound(new { success = false, message = result.message });
        }
    }
}
