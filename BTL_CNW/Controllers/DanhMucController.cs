using BTL_CNW.BLL.DanhMuc;
using Microsoft.AspNetCore.Mvc;

namespace BTL_CNW.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DanhMucController : ControllerBase
    {
        private readonly DanhMucService _danhMucService;

        public DanhMucController(DanhMucService danhMucService)
        {
            _danhMucService = danhMucService;
        }

        // GET: api/danhmuc
        [HttpGet]
        public async Task<IActionResult> GetAllDanhMuc()
        {
            try
            {
                var danhMucs = await _danhMucService.GetAllDanhMucAsync();
                return Ok(danhMucs);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi khi lấy danh mục", error = ex.Message });
            }
        }

        // GET: api/danhmuc/parent/{parentId}
        [HttpGet("parent/{parentId}")]
        public async Task<IActionResult> GetDanhMucByParent(int? parentId)
        {
            try
            {
                var danhMucs = await _danhMucService.GetDanhMucByParentAsync(parentId);
                return Ok(danhMucs);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi khi lấy danh mục con", error = ex.Message });
            }
        }

        // GET: api/danhmuc/linhvuc
        [HttpGet("linhvuc")]
        public async Task<IActionResult> GetAllLinhVuc()
        {
            try
            {
                var linhVucs = await _danhMucService.GetAllLinhVucAsync();
                return Ok(linhVucs);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi khi lấy lĩnh vực", error = ex.Message });
            }
        }
    }
}
