using BTL_CNW.BLL.TinTuyenDung;
using BTL_CNW.DTO.TinTuyenDung;
using BTL_CNW.Attributes;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;

namespace BTL_CNW.Controllers
{
    [ApiController]
    [Route("api/tin-tuyen-dung")]
    public class TinTuyenDungController : ControllerBase
    {
        private readonly ITinTuyenDungService _service;
        public TinTuyenDungController(ITinTuyenDungService service) => _service = service;

        /// <summary>Danh sách tin đã được duyệt - Public (không cần đăng nhập)</summary>
        [HttpGet]
        [AllowAnonymous]
        public IActionResult LayDanhSach(
            [FromQuery] string? thanhPho,
            [FromQuery] string? hinhThuc,
            [FromQuery] string? kinhNghiem)
            => Ok(_service.LayDanhSach(thanhPho, hinhThuc, kinhNghiem));

        /// <summary>Tin tuyển dụng theo công ty - Public</summary>
        [HttpGet("cong-ty/{maCongTy:int}")]
        [AllowAnonymous]
        public IActionResult LayTheoCongTy(int maCongTy)
            => Ok(_service.LayTheoCongTy(maCongTy));

        /// <summary>Tin tuyển dụng của nhà tuyển dụng - Chỉ nhà tuyển dụng</summary>
        [HttpGet("cua-toi/{maNguoiDang:int}")]
        [RoleAuthorize(UserRoles.NhaTuyenDung)]
        public IActionResult LayTheoNguoiDang(int maNguoiDang)
            => Ok(_service.LayTheoNguoiDang(maNguoiDang));

        /// <summary>Chi tiết tin tuyển dụng - Public</summary>
        [HttpGet("{maTin:int}")]
        [AllowAnonymous]
        public IActionResult LayChiTiet(int maTin)
        {
            var tin = _service.LayChiTiet(maTin);
            return tin == null ? NotFound(new { message = "Không tìm thấy tin." }) : Ok(tin);
        }

        /// <summary>Đăng tin mới - Chỉ nhà tuyển dụng</summary>
        [HttpPost]
        [RoleAuthorize(UserRoles.NhaTuyenDung)]
        public IActionResult TaoTin(TaoTinDto dto)
            => _service.TaoTin(dto) ? Ok(new { message = "Đăng tin thành công!" }) : BadRequest(new { message = "Đăng tin thất bại." });

        /// <summary>Cập nhật tin tuyển dụng - Chỉ nhà tuyển dụng</summary>
        [HttpPut("{maTin:int}")]
        [RoleAuthorize(UserRoles.NhaTuyenDung)]
        public IActionResult CapNhat(int maTin, CapNhatTinDto dto)
            => _service.CapNhat(maTin, dto) ? Ok(new { message = "Cập nhật thành công!" }) : BadRequest(new { message = "Cập nhật thất bại." });

        /// <summary>Đổi trạng thái tin - Quản trị viên hoặc nhà tuyển dụng</summary>
        [HttpPut("{maTin:int}/trang-thai")]
        [RoleAuthorize(UserRoles.QuanTriVien, UserRoles.NhaTuyenDung)]
        public IActionResult DoiTrangThai(int maTin, [FromQuery] string trangThai, [FromQuery] string? lyDo)
            => _service.DoiTrangThai(maTin, trangThai, lyDo) ? Ok(new { message = "Đã cập nhật trạng thái." }) : BadRequest(new { message = "Thất bại." });

        /// <summary>Xóa tin tuyển dụng - Quản trị viên hoặc nhà tuyển dụng</summary>
        [HttpDelete("{maTin:int}")]
        [RoleAuthorize(UserRoles.QuanTriVien, UserRoles.NhaTuyenDung)]
        public IActionResult Xoa(int maTin)
            => _service.Xoa(maTin) ? Ok(new { message = "Đã xóa tin." }) : BadRequest(new { message = "Xóa thất bại." });
    }
}
