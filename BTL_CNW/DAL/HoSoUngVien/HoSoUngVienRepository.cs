using BTL_CNW.DTO.HoSoUngVien;
using BTL_CNW.Models;
using Microsoft.EntityFrameworkCore;

namespace BTL_CNW.DAL.HoSoUngVien
{
    public class HoSoUngVienRepository : IHoSoUngVienRepository
    {
        private readonly QuanLyViecLamContext _context;

        public HoSoUngVienRepository(QuanLyViecLamContext context)
        {
            _context = context;
        }

        public bool TaoHoSo(TaoHoSoDto dto)
        {
            try
            {
                var hoSo = new Models.HoSoUngVien
                {
                    MaNguoiDung = dto.MaNguoiDung,
                    TieuDe = dto.TieuDe,
                    TomTat = dto.TomTat,
                    NgaySinh = dto.NgaySinh,
                    GioiTinh = dto.GioiTinh,
                    DiaChi = dto.DiaChi,
                    ThanhPho = dto.ThanhPho,
                    LinkedIn = dto.LinkedIn,
                    GitHub = dto.GitHub,
                    Portfolio = dto.Portfolio,
                    TinhTrangTimViec = dto.TinhTrangTimViec,
                    MucLuongMongMuon = dto.MucLuongMongMuon,
                    NgayTao = DateTime.Now,
                    NgayCapNhat = DateTime.Now
                };

                _context.HoSoUngViens.Add(hoSo);
                return _context.SaveChanges() > 0;
            }
            catch
            {
                return false;
            }
        }

        public HoSoDto? LayTheoNguoiDung(int maNguoiDung)
        {
            var hoSo = _context.HoSoUngViens
                .Include(x => x.MaNguoiDungNavigation)
                .FirstOrDefault(x => x.MaNguoiDung == maNguoiDung);

            if (hoSo == null) return null;

            return new HoSoDto
            {
                MaHoSo = hoSo.MaHoSo,
                MaNguoiDung = hoSo.MaNguoiDung,
                TenNguoiDung = hoSo.MaNguoiDungNavigation.HoTen,
                Email = hoSo.MaNguoiDungNavigation.Email,
                SoDienThoai = hoSo.MaNguoiDungNavigation.SoDienThoai,
                TieuDe = hoSo.TieuDe,
                TomTat = hoSo.TomTat,
                NgaySinh = hoSo.NgaySinh,
                GioiTinh = hoSo.GioiTinh,
                DiaChi = hoSo.DiaChi,
                ThanhPho = hoSo.ThanhPho,
                LinkedIn = hoSo.LinkedIn,
                GitHub = hoSo.GitHub,
                Portfolio = hoSo.Portfolio,
                TinhTrangTimViec = hoSo.TinhTrangTimViec,
                MucLuongMongMuon = hoSo.MucLuongMongMuon,
                NgayTao = hoSo.NgayTao,
                NgayCapNhat = hoSo.NgayCapNhat
            };
        }

        public HoSoDto? LayTheoId(int maHoSo)
        {
            var hoSo = _context.HoSoUngViens
                .Include(x => x.MaNguoiDungNavigation)
                .FirstOrDefault(x => x.MaHoSo == maHoSo);

            if (hoSo == null) return null;

            return new HoSoDto
            {
                MaHoSo = hoSo.MaHoSo,
                MaNguoiDung = hoSo.MaNguoiDung,
                TenNguoiDung = hoSo.MaNguoiDungNavigation.HoTen,
                Email = hoSo.MaNguoiDungNavigation.Email,
                SoDienThoai = hoSo.MaNguoiDungNavigation.SoDienThoai,
                TieuDe = hoSo.TieuDe,
                TomTat = hoSo.TomTat,
                NgaySinh = hoSo.NgaySinh,
                GioiTinh = hoSo.GioiTinh,
                DiaChi = hoSo.DiaChi,
                ThanhPho = hoSo.ThanhPho,
                LinkedIn = hoSo.LinkedIn,
                GitHub = hoSo.GitHub,
                Portfolio = hoSo.Portfolio,
                TinhTrangTimViec = hoSo.TinhTrangTimViec,
                MucLuongMongMuon = hoSo.MucLuongMongMuon,
                NgayTao = hoSo.NgayTao,
                NgayCapNhat = hoSo.NgayCapNhat
            };
        }

        public bool CapNhat(int maHoSo, TaoHoSoDto dto)
        {
            try
            {
                var hoSo = _context.HoSoUngViens.FirstOrDefault(x => x.MaHoSo == maHoSo);
                if (hoSo == null) return false;

                hoSo.TieuDe = dto.TieuDe;
                hoSo.TomTat = dto.TomTat;
                hoSo.NgaySinh = dto.NgaySinh;
                hoSo.GioiTinh = dto.GioiTinh;
                hoSo.DiaChi = dto.DiaChi;
                hoSo.ThanhPho = dto.ThanhPho;
                hoSo.LinkedIn = dto.LinkedIn;
                hoSo.GitHub = dto.GitHub;
                hoSo.Portfolio = dto.Portfolio;
                hoSo.TinhTrangTimViec = dto.TinhTrangTimViec;
                hoSo.MucLuongMongMuon = dto.MucLuongMongMuon;
                hoSo.NgayCapNhat = DateTime.Now;

                _context.SaveChanges();
                return true;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error updating resume: {ex.Message}");
                return false;
            }
        }

        public List<HoSoDto> TimKiem(string? tuKhoa, string? thanhPho, string? tinhTrang, int? mucLuongTu, int? mucLuongDen)
        {
            var query = _context.HoSoUngViens
                .Include(x => x.MaNguoiDungNavigation)
                .AsQueryable();

            if (!string.IsNullOrWhiteSpace(tuKhoa))
            {
                query = query.Where(x => 
                    x.TieuDe.Contains(tuKhoa) || 
                    x.TomTat.Contains(tuKhoa) ||
                    x.MaNguoiDungNavigation.HoTen.Contains(tuKhoa));
            }

            if (!string.IsNullOrWhiteSpace(thanhPho))
            {
                query = query.Where(x => x.ThanhPho == thanhPho);
            }

            if (!string.IsNullOrWhiteSpace(tinhTrang))
            {
                query = query.Where(x => x.TinhTrangTimViec == tinhTrang);
            }

            if (mucLuongTu.HasValue)
            {
                query = query.Where(x => x.MucLuongMongMuon >= mucLuongTu.Value);
            }

            if (mucLuongDen.HasValue)
            {
                query = query.Where(x => x.MucLuongMongMuon <= mucLuongDen.Value);
            }

            return query
                .OrderByDescending(x => x.NgayCapNhat)
                .Select(x => new HoSoDto
                {
                    MaHoSo = x.MaHoSo,
                    MaNguoiDung = x.MaNguoiDung,
                    TenNguoiDung = x.MaNguoiDungNavigation.HoTen,
                    Email = x.MaNguoiDungNavigation.Email,
                    SoDienThoai = x.MaNguoiDungNavigation.SoDienThoai,
                    TieuDe = x.TieuDe,
                    TomTat = x.TomTat,
                    NgaySinh = x.NgaySinh,
                    GioiTinh = x.GioiTinh,
                    DiaChi = x.DiaChi,
                    ThanhPho = x.ThanhPho,
                    LinkedIn = x.LinkedIn,
                    GitHub = x.GitHub,
                    Portfolio = x.Portfolio,
                    TinhTrangTimViec = x.TinhTrangTimViec,
                    MucLuongMongMuon = x.MucLuongMongMuon,
                    NgayTao = x.NgayTao,
                    NgayCapNhat = x.NgayCapNhat
                })
                .ToList();
        }

        public List<HoSoDto> LayDanhSach(int skip, int take)
        {
            return _context.HoSoUngViens
                .Include(x => x.MaNguoiDungNavigation)
                .OrderByDescending(x => x.NgayCapNhat)
                .Skip(skip)
                .Take(take)
                .Select(x => new HoSoDto
                {
                    MaHoSo = x.MaHoSo,
                    MaNguoiDung = x.MaNguoiDung,
                    TenNguoiDung = x.MaNguoiDungNavigation.HoTen,
                    Email = x.MaNguoiDungNavigation.Email,
                    SoDienThoai = x.MaNguoiDungNavigation.SoDienThoai,
                    TieuDe = x.TieuDe,
                    TomTat = x.TomTat,
                    NgaySinh = x.NgaySinh,
                    GioiTinh = x.GioiTinh,
                    DiaChi = x.DiaChi,
                    ThanhPho = x.ThanhPho,
                    LinkedIn = x.LinkedIn,
                    GitHub = x.GitHub,
                    Portfolio = x.Portfolio,
                    TinhTrangTimViec = x.TinhTrangTimViec,
                    MucLuongMongMuon = x.MucLuongMongMuon,
                    NgayTao = x.NgayTao,
                    NgayCapNhat = x.NgayCapNhat
                })
                .ToList();
        }
    }
}