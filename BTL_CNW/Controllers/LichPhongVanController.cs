using BTL_CNW.BLL.LichPhongVan;
using BTL_CNW.DTO.LichPhongVan;
using BTL_CNW.Attributes;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;

namespace BTL_CNW.Controllers
{
    [ApiController]
    [Route("api/lich-phong-van")]
    [Authorize] // Yêu cầu đăng nhập cho tất cả endpoints
    public class LichPhongVanController : ControllerBase
    {
        private readonly ILichPhongVanService _service;
        public LichPhongVanController(ILichPhongVanService service) => _service = service;

        /// <summary>Tạo lịch phỏng vấn - Chỉ nhà tuyển dụng</summary>
        [HttpPost]
        [RoleAuthorize(UserRoles.NhaTuyenDung)]
        public IActionResult TaoLich(TaoLichDto dto)
        {
            var result = _service.TaoLich(dto);
            return result.success
                ? Ok(new { success = true, message = result.message })
                : BadRequest(new { success = false, message = result.message });
        }

        /// <summary>Danh sách lịch phỏng vấn theo đơn - Nhà tuyển dụng và ứng viên</summary>
        [HttpGet("theo-don/{maDon:int}")]
        [RoleAuthorize(UserRoles.NhaTuyenDung, UserRoles.UngVien)]
        public IActionResult LayTheoDon(int maDon)
        {
            var result = _service.LayTheoDon(maDon);
            return result.success
                ? Ok(new { success = true, message = result.message, data = result.data })
                : BadRequest(new { success = false, message = result.message });
        }

        /// <summary>Chi tiết lịch phỏng vấn - Nhà tuyển dụng và ứng viên</summary>
        [HttpGet("{maLich:int}")]
        [RoleAuthorize(UserRoles.NhaTuyenDung, UserRoles.UngVien)]
        public IActionResult LayChiTiet(int maLich)
        {
            var result = _service.LayChiTiet(maLich);
            return result.success
                ? Ok(new { success = true, message = result.message, data = result.data })
                : NotFound(new { success = false, message = result.message });
        }

        /// <summary>Cập nhật trạng thái lịch phỏng vấn - Chỉ nhà tuyển dụng</summary>
        [HttpPut("{maLich:int}/trang-thai")]
        [RoleAuthorize(UserRoles.NhaTuyenDung)]
        public IActionResult DoiTrangThai(int maLich, [FromQuery] string trangThai)
        {
            var result = _service.DoiTrangThai(maLich, trangThai);
            return result.success
                ? Ok(new { success = true, message = result.message })
                : BadRequest(new { success = false, message = result.message });
        }

        /// <summary>Cập nhật lịch phỏng vấn - Chỉ nhà tuyển dụng</summary>
        [HttpPut("{maLich:int}")]
        [RoleAuthorize(UserRoles.NhaTuyenDung)]
        public IActionResult CapNhat(int maLich, TaoLichDto dto)
        {
            var result = _service.CapNhat(maLich, dto);
            return result.success
                ? Ok(new { success = true, message = result.message })
                : BadRequest(new { success = false, message = result.message });
        }

        /// <summary>Xóa lịch phỏng vấn - Chỉ nhà tuyển dụng</summary>
        [HttpDelete("{maLich:int}")]
        [RoleAuthorize(UserRoles.NhaTuyenDung)]
        public IActionResult Xoa(int maLich)
        {
            var result = _service.Xoa(maLich);
            return result.success
                ? Ok(new { success = true, message = result.message })
                : NotFound(new { success = false, message = result.message });
        }
    }
}
