using BTL_CNW.BLL.CongTy;
using BTL_CNW.DTO.CongTy;
using BTL_CNW.Attributes;
using BTL_CNW.Models;
using BTL_CNW.DAL.Auth;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;

namespace BTL_CNW.Controllers
{
    [ApiController]
    [Route("api/cong-ty")]
    [Authorize] // Yêu cầu đăng nhập cho tất cả endpoints
    public class CongTyController : ControllerBase
    {
        private readonly ICongTyService _service;
        public CongTyController(ICongTyService service) => _service = service;

        /// <summary>Tạo công ty mới - Chỉ nhà tuyển dụng</summary>
        [HttpPost]
        [RoleAuthorize(UserRoles.NhaTuyenDung)]
        public IActionResult TaoCongTy(TaoCongTyDto dto)
        {
            var result = _service.TaoCongTy(dto);
            return result.success 
                ? Ok(new { success = true, message = result.message })
                : BadRequest(new { success = false, message = result.message });
        }

        /// <summary>Lấy tất cả công ty - Chỉ quản trị viên</summary>
        [HttpGet]
        [RoleAuthorize(UserRoles.QuanTriVien)]
        public IActionResult LayTatCa()
        {
            var result = _service.LayTatCa();
            return result.success
                ? Ok(new { success = true, message = result.message, data = result.data })
                : BadRequest(new { success = false, message = result.message });
        }

        /// <summary>Lấy công ty theo ID - Tất cả người dùng đã đăng nhập</summary>
        [HttpGet("{maCongTy:int}")]
        public IActionResult LayTheoId(int maCongTy)
        {
            var result = _service.LayTheoId(maCongTy);
            return result.success
                ? Ok(new { success = true, message = result.message, data = result.data })
                : NotFound(new { success = false, message = result.message });
        }

        /// <summary>Lấy công ty của nhà tuyển dụng - Chỉ nhà tuyển dụng</summary>
        [HttpGet("cua-toi/{maNguoiDung:int}")]
        [RoleAuthorize(UserRoles.NhaTuyenDung)]
        public IActionResult LayTheoChuSoHuu(int maNguoiDung)
        {
            var result = _service.LayTheoChuSoHuu(maNguoiDung);
            return result.success
                ? Ok(new { success = true, message = result.message, data = result.data })
                : NotFound(new { success = false, message = result.message });
        }

        /// <summary>Lấy công ty theo email người dùng - Admin hoặc chính người dùng đó</summary>
        [HttpGet("theo-email/{email}")]
        [Authorize]
        public IActionResult LayTheoChuSoHuuEmail(string email)
        {
            try
            {
                // Lấy thông tin người dùng từ email
                var authRepo = HttpContext.RequestServices.GetService<IAuthRepository>();
                if (authRepo == null)
                    return StatusCode(500, new { success = false, message = "Lỗi hệ thống" });

                // Tìm người dùng theo email (cần tạo method mới trong AuthRepository)
                var nguoiDung = HttpContext.RequestServices
                    .GetService<QuanLyViecLamContext>()?
                    .NguoiDungs
                    .FirstOrDefault(x => x.Email == email);

                if (nguoiDung == null)
                    return NotFound(new { success = false, message = "Không tìm thấy người dùng" });

                var result = _service.LayTheoChuSoHuu(nguoiDung.MaNguoiDung);
                
                return Ok(new { 
                    success = result.success, 
                    message = result.message, 
                    data = result.data,
                    nguoiDung = new {
                        maNguoiDung = nguoiDung.MaNguoiDung,
                        hoTen = nguoiDung.HoTen,
                        email = nguoiDung.Email
                    }
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

        /// <summary>Cập nhật thông tin công ty - Chỉ nhà tuyển dụng</summary>
        [HttpPut("{maCongTy:int}")]
        [RoleAuthorize(UserRoles.NhaTuyenDung)]
        public IActionResult CapNhat(int maCongTy, CapNhatCongTyDto dto)
        {
            var result = _service.CapNhat(maCongTy, dto);
            return result.success
                ? Ok(new { success = true, message = result.message })
                : BadRequest(new { success = false, message = result.message });
        }

        /// <summary>Admin duyệt công ty - Chỉ quản trị viên</summary>
        [HttpPut("{maCongTy:int}/duyet")]
        [RoleAuthorize(UserRoles.QuanTriVien)]
        public IActionResult DuyetCongTy(int maCongTy)
        {
            var result = _service.DuyetCongTy(maCongTy);
            return result.success
                ? Ok(new { success = true, message = result.message })
                : BadRequest(new { success = false, message = result.message });
        }

        /// <summary>Xóa công ty - Chỉ quản trị viên</summary>
        [HttpDelete("{maCongTy:int}")]
        [RoleAuthorize(UserRoles.QuanTriVien)]
        public IActionResult Xoa(int maCongTy)
        {
            var result = _service.Xoa(maCongTy);
            return result.success
                ? Ok(new { success = true, message = result.message })
                : BadRequest(new { success = false, message = result.message });
        }
    }
}
