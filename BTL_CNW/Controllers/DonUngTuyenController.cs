using BTL_CNW.BLL.DonUngTuyen;
using BTL_CNW.DTO.DonUngTuyen;
using Microsoft.AspNetCore.Mvc;

namespace BTL_CNW.Controllers
{
    [ApiController]
    [Route("api/don-ung-tuyen")]
    public class DonUngTuyenController : ControllerBase
    {
        private readonly IDonUngTuyenService _service;
        public DonUngTuyenController(IDonUngTuyenService service) => _service = service;

        /// <summary>Nộp đơn ứng tuyển</summary>
        [HttpPost]
        public IActionResult NopDon(NopDonDto dto)
        {
            var (ok, msg) = _service.NopDon(dto);
            return ok ? Ok(new { message = msg }) : BadRequest(new { message = msg });
        }

        /// <summary>Đơn ứng tuyển của ứng viên</summary>
        [HttpGet("cua-toi/{maUngVien:int}")]
        public IActionResult LayTheoUngVien(int maUngVien)
            => Ok(_service.LayTheoUngVien(maUngVien));

        /// <summary>Đơn ứng tuyển theo tin tuyển dụng (NhaTuyenDung xem)</summary>
        [HttpGet("theo-tin/{maTin:int}")]
        public IActionResult LayTheoTin(int maTin)
            => Ok(_service.LayTheoTin(maTin));

        /// <summary>Chi tiết đơn ứng tuyển</summary>
        [HttpGet("{maDon:int}")]
        public IActionResult LayChiTiet(int maDon)
        {
            var don = _service.LayChiTiet(maDon);
            return don == null ? NotFound(new { message = "Không tìm thấy đơn." }) : Ok(don);
        }

        /// <summary>Cập nhật trạng thái đơn (NhaTuyenDung)</summary>
        [HttpPut("{maDon:int}/trang-thai")]
        public IActionResult CapNhatTrangThai(int maDon, CapNhatTrangThaiDto dto)
            => _service.CapNhatTrangThai(maDon, dto.TrangThai)
                ? Ok(new { message = "Cập nhật trạng thái thành công!" })
                : BadRequest(new { message = "Cập nhật thất bại." });
    }
}
