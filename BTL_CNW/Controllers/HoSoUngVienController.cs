using BTL_CNW.BLL.HoSoUngVien;
using BTL_CNW.DTO.HoSoUngVien;
using BTL_CNW.Attributes;
using BTL_CNW.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;

namespace BTL_CNW.Controllers
{
    [ApiController]
    [Route("api/ho-so")]
    [Authorize]
    public class HoSoUngVienController : ControllerBase
    {
        private readonly IHoSoUngVienService _service;
        private readonly QuanLyViecLamContext _context;
        private readonly IWebHostEnvironment _env;

        public HoSoUngVienController(IHoSoUngVienService service, QuanLyViecLamContext context, IWebHostEnvironment env)
        {
            _service = service;
            _context = context;
            _env = env;
        }

        /// <summary>Tạo hồ sơ ứng viên - Chỉ ứng viên</summary>
        [HttpPost]
        [RoleAuthorize(UserRoles.UngVien)]
        public IActionResult TaoHoSo(TaoHoSoDto dto)
        {
            var result = _service.TaoHoSo(dto);
            return result.success
                ? Ok(new { success = true, message = result.message })
                : BadRequest(new { success = false, message = result.message });
        }

        /// <summary>Lấy hồ sơ theo người dùng - Chỉ ứng viên</summary>
        [HttpGet("cua-toi/{maNguoiDung:int}")]
        [RoleAuthorize(UserRoles.UngVien)]
        public IActionResult LayTheoNguoiDung(int maNguoiDung)
        {
            var result = _service.LayTheoNguoiDung(maNguoiDung);
            return result.success
                ? Ok(new { success = true, message = result.message, data = result.data })
                : NotFound(new { success = false, message = result.message });
        }

        /// <summary>Lấy hồ sơ theo ID - Nhà tuyển dụng và ứng viên</summary>
        [HttpGet("{maHoSo:int}")]
        [RoleAuthorize(UserRoles.NhaTuyenDung, UserRoles.UngVien)]
        public IActionResult LayTheoId(int maHoSo)
        {
            var result = _service.LayTheoId(maHoSo);
            return result.success
                ? Ok(new { success = true, message = result.message, data = result.data })
                : NotFound(new { success = false, message = result.message });
        }

        /// <summary>Tìm kiếm hồ sơ ứng viên - Nhà tuyển dụng</summary>
        [HttpGet("tim-kiem")]
        [RoleAuthorize(UserRoles.NhaTuyenDung)]
        public IActionResult TimKiem([FromQuery] string? tuKhoa, [FromQuery] string? thanhPho, 
            [FromQuery] string? tinhTrang, [FromQuery] int? mucLuongTu, [FromQuery] int? mucLuongDen)
        {
            var result = _service.TimKiem(tuKhoa, thanhPho, tinhTrang, mucLuongTu, mucLuongDen);
            return Ok(new { success = true, message = result.message, data = result.data });
        }

        /// <summary>Lấy danh sách tất cả hồ sơ - Nhà tuyển dụng</summary>
        [HttpGet("danh-sach")]
        [RoleAuthorize(UserRoles.NhaTuyenDung)]
        public IActionResult LayDanhSach([FromQuery] int? skip = 0, [FromQuery] int? take = 20)
        {
            var result = _service.LayDanhSach(skip ?? 0, take ?? 20);
            return Ok(new { success = true, message = result.message, data = result.data });
        }

        /// <summary>Cập nhật hồ sơ - Chỉ ứng viên</summary>
        [HttpPut("{maHoSo:int}")]
        [RoleAuthorize(UserRoles.UngVien)]
        public IActionResult CapNhat(int maHoSo, TaoHoSoDto dto)
        {
            var result = _service.CapNhat(maHoSo, dto);
            return result.success
                ? Ok(new { success = true, message = result.message })
                : BadRequest(new { success = false, message = result.message });
        }

        // ============================================================
        // CV ENDPOINTS
        // ============================================================

        /// <summary>Upload CV - Chỉ ứng viên</summary>
        [HttpPost("{maHoSo:int}/cv/upload")]
        [RoleAuthorize(UserRoles.UngVien)]
        public async Task<IActionResult> UploadCv(int maHoSo, [FromForm] IFormFile file, [FromForm] bool laMacDinh = false)
        {
            try
            {
                if (file == null || file.Length == 0)
                    return BadRequest(new { success = false, message = "Khong co file duoc chon" });

                var allowedExtensions = new[] { ".pdf", ".doc", ".docx" };
                var extension = Path.GetExtension(file.FileName).ToLower();
                
                if (!allowedExtensions.Contains(extension))
                    return BadRequest(new { success = false, message = "Chi chap nhan file PDF, DOC, DOCX" });

                if (file.Length > 5 * 1024 * 1024)
                    return BadRequest(new { success = false, message = "Kich thuoc file khong duoc vuot qua 5MB" });

                // Lay WebRootPath, neu null thi dung thu muc hien tai
                var webRootPath = _env.WebRootPath ?? Directory.GetCurrentDirectory();
                
                // Tao thu muc neu chua ton tai
                var uploadsFolder = Path.Combine(webRootPath, "wwwroot", "uploads", "cv");
                if (!Directory.Exists(uploadsFolder))
                    Directory.CreateDirectory(uploadsFolder);

                // Tao ten file unique
                var uniqueFileName = $"{Guid.NewGuid()}{extension}";
                var filePath = Path.Combine(uploadsFolder, uniqueFileName);

                // Luu file
                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await file.CopyToAsync(stream);
                }

                // Neu la mac dinh, bo mac dinh cua cac file khac
                if (laMacDinh)
                {
                    var existingFiles = _context.FileCvs.Where(f => f.MaHoSo == maHoSo).ToList();
                    foreach (var f in existingFiles)
                    {
                        f.LaMacDinh = false;
                    }
                }

                // Luu vao database
                var fileCv = new Models.FileCv
                {
                    MaHoSo = maHoSo,
                    TenFile = file.FileName,
                    DuongDanFile = $"/uploads/cv/{uniqueFileName}",
                    KichThuoc = (int)file.Length,
                    LoaiFile = extension,
                    LaMacDinh = laMacDinh,
                    NgayTai = DateTime.Now
                };

                _context.FileCvs.Add(fileCv);
                _context.SaveChanges();

                return Ok(new { 
                    success = true, 
                    message = "Tai file CV thanh cong",
                    data = new {
                        maFileCv = fileCv.MaFileCv,
                        maHoSo = fileCv.MaHoSo,
                        tenFile = fileCv.TenFile,
                        duongDanFile = fileCv.DuongDanFile,
                        kichThuoc = fileCv.KichThuoc,
                        loaiFile = fileCv.LoaiFile,
                        laMacDinh = fileCv.LaMacDinh,
                        ngayTai = fileCv.NgayTai
                    }
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = $"Loi server: {ex.Message}" });
            }
        }

        /// <summary>Lấy danh sách CV theo hồ sơ - Nhà tuyển dụng và ứng viên</summary>
        [HttpGet("{maHoSo:int}/cv")]
        [RoleAuthorize(UserRoles.NhaTuyenDung, UserRoles.UngVien)]
        public IActionResult LayDanhSachCv(int maHoSo)
        {
            try
            {
                var files = _context.FileCvs
                    .Where(f => f.MaHoSo == maHoSo)
                    .OrderByDescending(f => f.LaMacDinh)
                    .ThenByDescending(f => f.NgayTai)
                    .Select(f => new {
                        maFileCv = f.MaFileCv,
                        maHoSo = f.MaHoSo,
                        tenFile = f.TenFile,
                        duongDanFile = f.DuongDanFile,
                        kichThuoc = f.KichThuoc,
                        loaiFile = f.LoaiFile,
                        laMacDinh = f.LaMacDinh,
                        ngayTai = f.NgayTai
                    })
                    .ToList();

                return Ok(new { success = true, message = "Lay danh sach thanh cong", data = files });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = $"Loi server: {ex.Message}" });
            }
        }

        /// <summary>Lấy chi tiết 1 CV - Nhà tuyển dụng và ứng viên</summary>
        [HttpGet("cv/{maFileCv:int}")]
        [RoleAuthorize(UserRoles.NhaTuyenDung, UserRoles.UngVien)]
        public IActionResult LayChiTietCv(int maFileCv)
        {
            try
            {
                var file = _context.FileCvs
                    .Where(f => f.MaFileCv == maFileCv)
                    .Select(f => new {
                        maFileCv = f.MaFileCv,
                        maHoSo = f.MaHoSo,
                        tenFile = f.TenFile,
                        duongDanFile = f.DuongDanFile,
                        kichThuoc = f.KichThuoc,
                        loaiFile = f.LoaiFile,
                        laMacDinh = f.LaMacDinh,
                        ngayTai = f.NgayTai
                    })
                    .FirstOrDefault();

                if (file == null)
                    return NotFound(new { success = false, message = "Khong tim thay file CV" });

                return Ok(new { success = true, message = "Lay chi tiet thanh cong", data = file });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = $"Loi server: {ex.Message}" });
            }
        }

        /// <summary>Đặt CV mặc định - Chỉ ứng viên</summary>
        [HttpPut("cv/{maFileCv:int}/mac-dinh")]
        [RoleAuthorize(UserRoles.UngVien)]
        public IActionResult DatCvMacDinh(int maFileCv, [FromQuery] int maHoSo)
        {
            try
            {
                var file = _context.FileCvs.FirstOrDefault(f => f.MaFileCv == maFileCv);
                if (file == null)
                    return NotFound(new { success = false, message = "Khong tim thay file CV" });

                // Bo mac dinh cua tat ca file
                var allFiles = _context.FileCvs.Where(f => f.MaHoSo == maHoSo).ToList();
                foreach (var f in allFiles)
                {
                    f.LaMacDinh = f.MaFileCv == maFileCv;
                }

                _context.SaveChanges();

                return Ok(new { success = true, message = "Dat file CV mac dinh thanh cong" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = $"Loi server: {ex.Message}" });
            }
        }

        /// <summary>Xóa CV - Chỉ ứng viên</summary>
        [HttpDelete("cv/{maFileCv:int}")]
        [RoleAuthorize(UserRoles.UngVien)]
        public IActionResult XoaCv(int maFileCv)
        {
            try
            {
                var file = _context.FileCvs.FirstOrDefault(f => f.MaFileCv == maFileCv);
                if (file == null)
                    return NotFound(new { success = false, message = "Khong tim thay file CV" });

                // Xoa file vat ly
                var webRootPath = _env.WebRootPath ?? Directory.GetCurrentDirectory();
                var filePath = Path.Combine(webRootPath, "wwwroot", file.DuongDanFile.TrimStart('/').Replace("/", "\\"));
                if (System.IO.File.Exists(filePath))
                    System.IO.File.Delete(filePath);

                // Xoa record trong database
                _context.FileCvs.Remove(file);
                _context.SaveChanges();

                return Ok(new { success = true, message = "Xoa file CV thanh cong" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = $"Loi server: {ex.Message}" });
            }
        }
    }
}
