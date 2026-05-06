using BTL_CNW.BLL.TinTuyenDung;
using BTL_CNW.BLL.CongTy;
using BTL_CNW.DTO.TinTuyenDung;
using BTL_CNW.Attributes;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

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
        {
            var result = _service.LayDanhSach(thanhPho, hinhThuc, kinhNghiem);
            return result.success
                ? Ok(new { success = true, message = result.message, data = result.data })
                : BadRequest(new { success = false, message = result.message });
        }

        /// <summary>Lọc tin tuyển dụng nâng cao - Public</summary>
        [HttpGet("filter")]
        [AllowAnonymous]
        public IActionResult LocTinTuyenDung(
            [FromQuery] string? search,
            [FromQuery] int[]? danhMuc,
            [FromQuery] string? kinhNghiem,
            [FromQuery] string? hinhThucLamViec,
            [FromQuery] int[]? linhVuc,
            [FromQuery] string[]? mucLuong,
            [FromQuery] string? thanhPho)
        {
            var result = _service.LocTinTuyenDung(search, danhMuc, kinhNghiem, hinhThucLamViec, linhVuc, mucLuong, thanhPho);
            return result.success
                ? Ok(new { success = true, message = result.message, data = result.data })
                : BadRequest(new { success = false, message = result.message });
        }

        /// <summary>Tin tuyển dụng theo công ty - Public</summary>
        [HttpGet("cong-ty/{maCongTy:int}")]
        [AllowAnonymous]
        public IActionResult LayTheoCongTy(int maCongTy)
        {
            var result = _service.LayTheoCongTy(maCongTy);
            return result.success
                ? Ok(new { success = true, message = result.message, data = result.data })
                : BadRequest(new { success = false, message = result.message });
        }

        /// <summary>Tin tuyển dụng của nhà tuyển dụng - Chỉ nhà tuyển dụng</summary>
        [HttpGet("cua-toi/{maNguoiDang:int}")]
        [RoleAuthorize(UserRoles.NhaTuyenDung)]
        public IActionResult LayTheoNguoiDang(int maNguoiDang)
        {
            var userIdStr = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (!int.TryParse(userIdStr, out var userId) || userId <= 0)
                return Unauthorized(new { success = false, message = "Token không hợp lệ" });

            if (maNguoiDang != userId)
                return Forbid();

            var result = _service.LayTheoNguoiDang(maNguoiDang);
            return result.success
                ? Ok(new { success = true, message = result.message, data = result.data })
                : BadRequest(new { success = false, message = result.message });
        }

        /// <summary>Chi tiết tin tuyển dụng - Public</summary>
        [HttpGet("{maTin:int}")]
        [AllowAnonymous]
        public IActionResult LayChiTiet(int maTin)
        {
            var result = _service.LayChiTiet(maTin);
            return result.success
                ? Ok(new { success = true, message = result.message, data = result.data })
                : NotFound(new { success = false, message = result.message });
        }

        /// <summary>Đăng tin mới - Chỉ nhà tuyển dụng</summary>
        [HttpPost]
        [RoleAuthorize(UserRoles.NhaTuyenDung)]
        public IActionResult TaoTin(TaoTinDto dto)
        {
            var userIdStr = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (!int.TryParse(userIdStr, out var userId) || userId <= 0)
                return Unauthorized(new { success = false, message = "Token không hợp lệ" });

            if (dto.MaNguoiDang != userId)
                return Forbid();

            var result = _service.TaoTin(dto);
            return result.success
                ? Ok(new { success = true, message = result.message })
                : BadRequest(new { success = false, message = result.message });
        }

        /// <summary>Kiểm tra trạng thái công ty trước khi đăng tin - Chỉ nhà tuyển dụng</summary>
        [HttpGet("kiem-tra-cong-ty/{maNguoiDung:int}")]
        [RoleAuthorize(UserRoles.NhaTuyenDung)]
        public IActionResult KiemTraCongTy(int maNguoiDung)
        {
            try
            {
                var userIdStr = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (!int.TryParse(userIdStr, out var userId) || userId <= 0)
                    return Unauthorized(new { success = false, message = "Token không hợp lệ" });

                if (maNguoiDung != userId)
                    return Forbid();

                // Lấy thông tin công ty
                var congTyService = HttpContext.RequestServices.GetService<ICongTyService>();
                if (congTyService == null)
                    return StatusCode(500, new { success = false, message = "Lỗi hệ thống" });

                var result = congTyService.LayTheoChuSoHuu(maNguoiDung);
                
                if (!result.success || result.data == null || result.data.Count == 0)
                {
                    return Ok(new { 
                        success = false, 
                        message = "Bạn chưa có công ty",
                        canPost = false,
                        needCreateCompany = true
                    });
                }

                // Check if at least one company is approved
                var approvedCompany = result.data.FirstOrDefault(c => c.TrangThai == "Đã duyệt");
                if (approvedCompany == null)
                {
                    return Ok(new { 
                        success = false, 
                        message = "Chưa có công ty nào được duyệt",
                        canPost = false,
                        needApproval = true,
                        companies = result.data
                    });
                }

                return Ok(new { 
                    success = true, 
                    message = "Bạn có thể đăng tin",
                    canPost = true,
                    companies = result.data
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { 
                    success = false, 
                    message = $"Lỗi hệ thống: {ex.Message}" 
                });
            }
        }

        /// <summary>Cập nhật tin tuyển dụng - Chỉ nhà tuyển dụng</summary>
        [HttpPut("{maTin:int}")]
        [RoleAuthorize(UserRoles.NhaTuyenDung)]
        public IActionResult CapNhat(int maTin, CapNhatTinDto dto)
        {
            var result = _service.CapNhat(maTin, dto);
            return result.success
                ? Ok(new { success = true, message = result.message })
                : BadRequest(new { success = false, message = result.message });
        }

        /// <summary>Đổi trạng thái tin - Quản trị viên hoặc nhà tuyển dụng</summary>
        [HttpPut("{maTin:int}/trang-thai")]
        [RoleAuthorize(UserRoles.QuanTriVien, UserRoles.NhaTuyenDung)]
        public IActionResult DoiTrangThai(int maTin, [FromQuery] string trangThai, [FromQuery] string? lyDo)
        {
            var result = _service.DoiTrangThai(maTin, trangThai, lyDo);
            return result.success
                ? Ok(new { success = true, message = result.message })
                : BadRequest(new { success = false, message = result.message });
        }

        /// <summary>Xóa tin tuyển dụng - Quản trị viên hoặc nhà tuyển dụng</summary>
        [HttpDelete("{maTin:int}")]
        [RoleAuthorize(UserRoles.QuanTriVien, UserRoles.NhaTuyenDung)]
        public IActionResult Xoa(int maTin)
        {
            var result = _service.Xoa(maTin);
            return result.success
                ? Ok(new { success = true, message = result.message })
                : BadRequest(new { success = false, message = result.message });
        }

        /// <summary>Lấy tất cả tin tuyển dụng - Chỉ quản trị viên</summary>
        [HttpGet("admin/all")]
        [RoleAuthorize(UserRoles.QuanTriVien)]
        public IActionResult LayTatCaTin()
        {
            var result = _service.LayTatCaTin();
            return result.success
                ? Ok(new { success = true, message = result.message, data = result.data })
                : BadRequest(new { success = false, message = result.message });
        }
    }
}
