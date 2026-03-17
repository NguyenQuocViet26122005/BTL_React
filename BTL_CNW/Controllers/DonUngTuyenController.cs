using BTL_CNW.BLL.DonUngTuyen;
using BTL_CNW.DTO.DonUngTuyen;
using BTL_CNW.Attributes;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;

namespace BTL_CNW.Controllers
{
    [ApiController]
    [Route("api/don-ung-tuyen")]
    [Authorize] // Yêu cầu đăng nhập cho tất cả endpoints
    public class DonUngTuyenController : ControllerBase
    {
        private readonly IDonUngTuyenService _service;
        public DonUngTuyenController(IDonUngTuyenService service) => _service = service;

        /// <summary>Nộp đơn ứng tuyển - Chỉ ứng viên</summary>
        [HttpPost]
        [RoleAuthorize(UserRoles.UngVien)]
        public IActionResult NopDon(NopDonDto dto)
        {
            var (ok, msg) = _service.NopDon(dto);
            return ok ? Ok(new { message = msg }) : BadRequest(new { message = msg });
        }

        /// <summary>Đơn ứng tuyển của ứng viên - Chỉ ứng viên</summary>
        [HttpGet("cua-toi/{maUngVien:int}")]
        [RoleAuthorize(UserRoles.UngVien)]
        public IActionResult LayTheoUngVien(int maUngVien)
            => Ok(_service.LayTheoUngVien(maUngVien));

        /// <summary>Đơn ứng tuyển theo tin tuyển dụng - Chỉ nhà tuyển dụng</summary>
        [HttpGet("theo-tin/{maTin:int}")]
        [RoleAuthorize(UserRoles.NhaTuyenDung)]
        public IActionResult LayTheoTin(int maTin)
            => Ok(_service.LayTheoTin(maTin));

        /// <summary>Chi tiết đơn ứng tuyển - Nhà tuyển dụng và ứng viên</summary>
        [HttpGet("{maDon:int}")]
        [RoleAuthorize(UserRoles.NhaTuyenDung, UserRoles.UngVien)]
        public IActionResult LayChiTiet(int maDon)
        {
            var don = _service.LayChiTiet(maDon);
            return don == null ? NotFound(new { message = "Không tìm thấy đơn." }) : Ok(don);
        }

        /// <summary>Cập nhật trạng thái đơn - Chỉ nhà tuyển dụng</summary>
        [HttpPut("{maDon:int}/trang-thai")]
        [RoleAuthorize(UserRoles.NhaTuyenDung)]
        public IActionResult CapNhatTrangThai(int maDon, CapNhatTrangThaiDto dto)
            => _service.CapNhatTrangThai(maDon, dto.TrangThai)
                ? Ok(new { message = "Cập nhật trạng thái thành công!" })
                : BadRequest(new { message = "Cập nhật thất bại." });
    }
}
