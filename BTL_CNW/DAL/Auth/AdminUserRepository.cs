using BTL_CNW.DTO.Auth;
using BTL_CNW.Models;
using Microsoft.EntityFrameworkCore;

namespace BTL_CNW.DAL.Auth
{
    public class AdminUserRepository : IAdminUserRepository
    {
        private readonly QuanLyViecLamContext _context;

        public AdminUserRepository(QuanLyViecLamContext context)
        {
            _context = context;
        }

        public AdminUserListDto LayDanhSach(string? search, string? status, int page, int pageSize)
        {
            try
            {
                var query = _context.NguoiDungs
                    .AsNoTracking()
                    .Include(x => x.MaVaiTroNavigation)
                    .AsQueryable();

                if (!string.IsNullOrWhiteSpace(search))
                {
                    query = query.Where(x =>
                        x.HoTen.Contains(search) ||
                        x.Email.Contains(search) ||
                        (x.SoDienThoai != null && x.SoDienThoai.Contains(search)));
                }

                if (status == "active")
                {
                    query = query.Where(x => x.DangHoatDong);
                }
                else if (status == "locked")
                {
                    query = query.Where(x => !x.DangHoatDong);
                }

                var total = query.Count();

                var items = query
                    .OrderByDescending(x => x.NgayTao)
                    .ThenBy(x => x.MaNguoiDung)
                    .Skip((page - 1) * pageSize)
                    .Take(pageSize)
                    .Select(x => new AdminUserListItemDto
                    {
                        MaNguoiDung = x.MaNguoiDung,
                        HoTen = x.HoTen,
                        Email = x.Email,
                        SoDienThoai = x.SoDienThoai,
                        TenVaiTro = x.MaVaiTroNavigation.TenVaiTro,
                        DangHoatDong = x.DangHoatDong,
                        NgayTao = x.NgayTao
                    })
                    .ToList();

                return new AdminUserListDto
                {
                    Items = items,
                    Total = total,
                    Page = page,
                    PageSize = pageSize
                };
            }
            catch (Exception ex)
            {
                throw new Exception($"Lỗi lấy danh sách người dùng: {ex.Message}", ex);
            }
        }

        public bool CapNhatTrangThaiHoatDong(int maNguoiDung, bool dangHoatDong)
        {
            try
            {
                var nguoiDung = _context.NguoiDungs.FirstOrDefault(x => x.MaNguoiDung == maNguoiDung);
                if (nguoiDung == null)
                    return false;

                if (nguoiDung.DangHoatDong == dangHoatDong)
                    return false;

                nguoiDung.DangHoatDong = dangHoatDong;
                nguoiDung.NgayCapNhat = DateTime.Now;
                return _context.SaveChanges() > 0;
            }
            catch (Exception ex)
            {
                throw new Exception($"Lỗi cập nhật trạng thái người dùng: {ex.Message}", ex);
            }
        }

        public bool TonTaiNguoiDung(int maNguoiDung)
        {
            try
            {
                return _context.NguoiDungs.Any(x => x.MaNguoiDung == maNguoiDung);
            }
            catch (Exception ex)
            {
                throw new Exception($"Lỗi kiểm tra người dùng: {ex.Message}", ex);
            }
        }
    }
}
