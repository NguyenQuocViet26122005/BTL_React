using BTL_CNW.BLL.FileCv;
using BTL_CNW.DTO.FileCv;
using BTL_CNW.Attributes;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;

namespace BTL_CNW.Controllers
{
    [ApiController]
    [Route("api/file-cv")]
    public class FileCvController : ControllerBase
    {
        private readonly IFileCvService _service;
        private readonly IWebHostEnvironment _env;

        public FileCvController(IFileCvService service, IWebHostEnvironment env)
        {
            _service = service;
            _env = env;
        }

        [HttpPost("upload")]
        [RoleAuthorize(3)]
        public async Task<IActionResult> UploadCv([FromForm] UploadCvDto dto)
        {
            try
            {
                if (dto.File == null || dto.File.Length == 0)
                    return BadRequest(new { success = false, message = "Khong co file duoc chon" });

                var allowedExtensions = new[] { ".pdf", ".doc", ".docx" };
                var extension = Path.GetExtension(dto.File.FileName).ToLower();
                
                if (!allowedExtensions.Contains(extension))
                    return BadRequest(new { success = false, message = "Chi chap nhan file PDF, DOC, DOCX" });

                if (dto.File.Length > 5 * 1024 * 1024)
                    return BadRequest(new { success = false, message = "Kich thuoc file khong duoc vuot qua 5MB" });

                var uploadsFolder = Path.Combine(_env.WebRootPath, "uploads", "cv");
                if (!Directory.Exists(uploadsFolder))
                    Directory.CreateDirectory(uploadsFolder);

                var uniqueFileName = $"{Guid.NewGuid()}{extension}";
                var filePath = Path.Combine(uploadsFolder, uniqueFileName);

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await dto.File.CopyToAsync(stream);
                }

                var relativePath = $"/uploads/cv/{uniqueFileName}";
                var result = _service.TaoFileCv(dto.MaHoSo, dto.File.FileName, relativePath, (int)dto.File.Length, extension, dto.LaMacDinh);

                return result.success
                    ? Ok(new { success = true, message = result.message, data = result.data })
                    : BadRequest(new { success = false, message = result.message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = $"Loi server: {ex.Message}" });
            }
        }

        [HttpGet("ho-so/{maHoSo}")]
        [RoleAuthorize(2, 3)]
        public IActionResult LayDanhSachCvTheoHoSo(int maHoSo)
        {
            var result = _service.LayDanhSachCvTheoHoSo(maHoSo);
            return result.success
                ? Ok(new { success = true, message = result.message, data = result.data })
                : BadRequest(new { success = false, message = result.message });
        }

        [HttpGet("{maFileCv}")]
        [RoleAuthorize(2, 3)]
        public IActionResult LayChiTietFileCv(int maFileCv)
        {
            var result = _service.LayChiTietFileCv(maFileCv);
            return result.success
                ? Ok(new { success = true, message = result.message, data = result.data })
                : BadRequest(new { success = false, message = result.message });
        }

        [HttpPut("{maFileCv}/mac-dinh")]
        [RoleAuthorize(3)]
        public IActionResult DatMacDinh(int maFileCv, [FromQuery] int maHoSo)
        {
            var result = _service.DatFileCvMacDinh(maFileCv, maHoSo);
            return result.success
                ? Ok(new { success = true, message = result.message })
                : BadRequest(new { success = false, message = result.message });
        }

        [HttpDelete("{maFileCv}")]
        [RoleAuthorize(3)]
        public IActionResult XoaFileCv(int maFileCv)
        {
            try
            {
                var fileInfo = _service.LayChiTietFileCv(maFileCv);
                if (!fileInfo.success || fileInfo.data == null)
                    return NotFound(new { success = false, message = "Khong tim thay file" });

                var result = _service.XoaFileCv(maFileCv);
                
                if (result.success)
                {
                    var filePath = Path.Combine(_env.WebRootPath, fileInfo.data.DuongDanFile.TrimStart('/'));
                    if (System.IO.File.Exists(filePath))
                        System.IO.File.Delete(filePath);
                }

                return result.success
                    ? Ok(new { success = true, message = result.message })
                    : BadRequest(new { success = false, message = result.message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = $"Loi server: {ex.Message}" });
            }
        }
    }
}
