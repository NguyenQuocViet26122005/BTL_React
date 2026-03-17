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
            => _service.TaoLich(dto) ? Ok(new { message = "Tạo lịch phỏng vấn thành công!" }) : BadRequest(new { message = "Tạo lịch thất bại." });

        /// <summary>Danh sách lịch phỏng vấn theo đơn - Nhà tuyển dụng và ứng viên</summary>
        [HttpGet("theo-don/{maDon:int}")]
        [RoleAuthorize(UserRoles.NhaTuyenDung, UserRoles.UngVien)]
        public IActionResult LayTheoDon(int maDon)
            => Ok(_service.LayTheoDon(maDon));

        /// <summary>Chi tiết lịch phỏng vấn - Nhà tuyển dụng và ứng viên</summary>
        [HttpGet("{maLich:int}")]
        [RoleAuthorize(UserRoles.NhaTuyenDung, UserRoles.UngVien)]
        public IActionResult LayChiTiet(int maLich)
        {
            var lich = _service.LayChiTiet(maLich);
            return lich == null ? NotFound(new { message = "Không tìm thấy lịch." }) : Ok(lich);
        }

        /// <summary>Cập nhật trạng thái lịch phỏng vấn - Chỉ nhà tuyển dụng</summary>
        [HttpPut("{maLich:int}/trang-thai")]
        [RoleAuthorize(UserRoles.NhaTuyenDung)]
        public IActionResult DoiTrangThai(int maLich, [FromQuery] string trangThai)
            => _service.DoiTrangThai(maLich, trangThai) ? Ok(new { message = "Đã cập nhật trạng thái." }) : BadRequest(new { message = "Thất bại." });
    }
}
