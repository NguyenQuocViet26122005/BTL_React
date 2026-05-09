using BTL_CNW.Attributes;
using BTL_CNW.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace BTL_CNW.Controllers
{
    [ApiController]
    [Route("api/tin-da-luu")]
    [Authorize]
    public class TinDaLuuController : ControllerBase
    {
        private readonly QuanLyViecLamContext _context;

        public TinDaLuuController(QuanLyViecLamContext context)
        {
            _context = context;
        }

        /// <summary>Lưu tin tuyển dụng - Chỉ ứng viên</summary>
        [HttpPost("{maTin:int}")]
        [RoleAuthorize(UserRoles.UngVien)]
        public IActionResult LuuTin(int maTin)
        {
            var userIdStr = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (!int.TryParse(userIdStr, out var userId) || userId <= 0)
                return Unauthorized(new { success = false, message = "Token không hợp lệ" });

            if (maTin <= 0)
                return BadRequest(new { success = false, message = "Mã tin không hợp lệ" });

            var tinExists = _context.TinTuyenDungs.Any(t => t.MaTin == maTin && t.TrangThai == "DaDuyet");
            if (!tinExists)
                return NotFound(new { success = false, message = "Không tìm thấy tin tuyển dụng" });

            var existed = _context.TinDaLuus.Any(x => x.MaNguoiDung == userId && x.MaTin == maTin);
            if (existed)
                return Ok(new { success = true, message = "Tin đã được lưu trước đó" });

            _context.TinDaLuus.Add(new TinDaLuu
            {
                MaNguoiDung = userId,
                MaTin = maTin,
                NgayLuu = DateTime.Now
            });
            _context.SaveChanges();

            return Ok(new { success = true, message = "Lưu tin thành công" });
        }

        /// <summary>Bỏ lưu tin tuyển dụng - Chỉ ứng viên</summary>
        [HttpDelete("{maTin:int}")]
        [RoleAuthorize(UserRoles.UngVien)]
        public IActionResult BoLuuTin(int maTin)
        {
            var userIdStr = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (!int.TryParse(userIdStr, out var userId) || userId <= 0)
                return Unauthorized(new { success = false, message = "Token không hợp lệ" });

            if (maTin <= 0)
                return BadRequest(new { success = false, message = "Mã tin không hợp lệ" });

            var saved = _context.TinDaLuus.FirstOrDefault(x => x.MaNguoiDung == userId && x.MaTin == maTin);
            if (saved == null)
                return NotFound(new { success = false, message = "Tin chưa được lưu" });

            _context.TinDaLuus.Remove(saved);
            _context.SaveChanges();

            return Ok(new { success = true, message = "Bỏ lưu tin thành công" });
        }

        /// <summary>Danh sách tin đã lưu của tôi - Chỉ ứng viên</summary>
        [HttpGet("cua-toi")]
        [RoleAuthorize(UserRoles.UngVien)]
        public IActionResult LayDanhSachCuaToi()
        {
            var userIdStr = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (!int.TryParse(userIdStr, out var userId) || userId <= 0)
                return Unauthorized(new { success = false, message = "Token không hợp lệ" });

            var data = _context.TinDaLuus
                .Where(x => x.MaNguoiDung == userId)
                .OrderByDescending(x => x.NgayLuu)
                .Include(x => x.MaTinNavigation)
                .ThenInclude(t => t.MaCongTyNavigation)
                .Select(x => new
                {
                    maTin = x.MaTin,
                    ngayLuu = x.NgayLuu,
                    tieuDe = x.MaTinNavigation.TieuDe,
                    thanhPho = x.MaTinNavigation.ThanhPho,
                    mucLuongToiThieu = x.MaTinNavigation.MucLuongToiThieu,
                    mucLuongToiDa = x.MaTinNavigation.MucLuongToiDa,
                    donViTien = x.MaTinNavigation.DonViTien,
                    tenCongTy = x.MaTinNavigation.MaCongTyNavigation.TenCongTy,
                    logoCongTy = x.MaTinNavigation.MaCongTyNavigation.Logo
                })
                .ToList();

            return Ok(new { success = true, message = "Lấy danh sách tin đã lưu thành công", data });
        }
    }
}

