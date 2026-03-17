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
            try
            {
                var (ok, msg) = _service.NopDon(dto);
                
                if (ok)
                {
                    return Ok(new { success = true, message = msg });
                }
                else
                {
                    return BadRequest(new { success = false, message = msg });
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { 
                    success = false, 
                    message = "Lỗi server không xác định", 
                    error = ex.Message 
                });
            }
        }

        /// <summary>Đơn ứng tuyển của ứng viên - Chỉ ứng viên</summary>
        [HttpGet("cua-toi/{maUngVien:int}")]
        [RoleAuthorize(UserRoles.UngVien)]
        public IActionResult LayTheoUngVien(int maUngVien)
        {
            try
            {
                var (data, error) = _service.LayTheoUngVien(maUngVien);
                
                if (error != null)
                {
                    return BadRequest(new { success = false, message = error });
                }

                return Ok(new { 
                    success = true, 
                    message = "Lấy danh sách đơn ứng tuyển thành công", 
                    data = data 
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { 
                    success = false, 
                    message = "Lỗi server không xác định", 
                    error = ex.Message 
                });
            }
        }

        /// <summary>Đơn ứng tuyển theo tin tuyển dụng - Chỉ nhà tuyển dụng</summary>
        [HttpGet("theo-tin/{maTin:int}")]
        [RoleAuthorize(UserRoles.NhaTuyenDung)]
        public IActionResult LayTheoTin(int maTin)
        {
            try
            {
                var (data, error) = _service.LayTheoTin(maTin);
                
                if (error != null)
                {
                    return BadRequest(new { success = false, message = error });
                }

                return Ok(new { 
                    success = true, 
                    message = "Lấy danh sách đơn ứng tuyển thành công", 
                    data = data 
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { 
                    success = false, 
                    message = "Lỗi server không xác định", 
                    error = ex.Message 
                });
            }
        }

        /// <summary>Chi tiết đơn ứng tuyển - Nhà tuyển dụng và ứng viên</summary>
        [HttpGet("{maDon:int}")]
        [RoleAuthorize(UserRoles.NhaTuyenDung, UserRoles.UngVien)]
        public IActionResult LayChiTiet(int maDon)
        {
            try
            {
                var (data, error) = _service.LayChiTiet(maDon);
                
                if (error != null)
                {
                    return BadRequest(new { success = false, message = error });
                }

                return Ok(new { 
                    success = true, 
                    message = "Lấy chi tiết đơn ứng tuyển thành công", 
                    data = data 
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { 
                    success = false, 
                    message = "Lỗi server không xác định", 
                    error = ex.Message 
                });
            }
        }

        /// <summary>Cập nhật trạng thái đơn - Chỉ nhà tuyển dụng</summary>
        [HttpPut("{maDon:int}/trang-thai")]
        [RoleAuthorize(UserRoles.NhaTuyenDung)]
        public IActionResult CapNhatTrangThai(int maDon, CapNhatTrangThaiDto dto)
        {
            try
            {
                var (ok, msg) = _service.CapNhatTrangThai(maDon, dto.TrangThai);
                
                if (ok)
                {
                    return Ok(new { success = true, message = msg });
                }
                else
                {
                    return BadRequest(new { success = false, message = msg });
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { 
                    success = false, 
                    message = "Lỗi server không xác định", 
                    error = ex.Message 
                });
            }
        }
    }
}
