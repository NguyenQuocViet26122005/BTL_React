using BTL_CNW.BLL.Dashboard;
using BTL_CNW.Attributes;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;

namespace BTL_CNW.Controllers
{
    [ApiController]
    [Route("api/dashboard")]
    [Authorize]
    public class DashboardController : ControllerBase
    {
        private readonly IDashboardService _service;

        public DashboardController(IDashboardService service)
        {
            _service = service;
        }

        /// <summary>Lấy thống kê tổng quan cho dashboard - Chỉ nhà tuyển dụng</summary>
        [HttpGet("thong-ke/{maNguoiDung:int}")]
        [RoleAuthorize(UserRoles.NhaTuyenDung)]
        public IActionResult LayThongKe(int maNguoiDung)
        {
            var result = _service.LayThongKe(maNguoiDung);
            return result.success
                ? Ok(new { success = true, message = result.message, data = result.data })
                : BadRequest(new { success = false, message = result.message });
        }

        /// <summary>Lấy lịch phỏng vấn sắp tới - Chỉ nhà tuyển dụng</summary>
        [HttpGet("lich-phong-van-sap-toi/{maNguoiDung:int}")]
        [RoleAuthorize(UserRoles.NhaTuyenDung)]
        public IActionResult LayLichPhongVanSapToi(int maNguoiDung, [FromQuery] int soNgay = 7)
        {
            var result = _service.LayLichPhongVanSapToi(maNguoiDung, soNgay);
            return result.success
                ? Ok(new { success = true, message = result.message, data = result.data })
                : BadRequest(new { success = false, message = result.message });
        }

        /// <summary>Lấy biểu đồ lượt xem - Chỉ nhà tuyển dụng</summary>
        [HttpGet("bieu-do-luot-xem/{maNguoiDung:int}")]
        [RoleAuthorize(UserRoles.NhaTuyenDung)]
        public IActionResult LayBieuDoLuotXem(int maNguoiDung, [FromQuery] int soNgay = 7)
        {
            var result = _service.LayBieuDoLuotXem(maNguoiDung, soNgay);
            return result.success
                ? Ok(new { success = true, message = result.message, data = result.data })
                : BadRequest(new { success = false, message = result.message });
        }

        /// <summary>Lấy biểu đồ đơn ứng tuyển - Chỉ nhà tuyển dụng</summary>
        [HttpGet("bieu-do-don-ung-tuyen/{maNguoiDung:int}")]
        [RoleAuthorize(UserRoles.NhaTuyenDung)]
        public IActionResult LayBieuDoDonUngTuyen(int maNguoiDung, [FromQuery] int soThang = 6)
        {
            var result = _service.LayBieuDoDonUngTuyen(maNguoiDung, soThang);
            return result.success
                ? Ok(new { success = true, message = result.message, data = result.data })
                : BadRequest(new { success = false, message = result.message });
        }
    }
}
