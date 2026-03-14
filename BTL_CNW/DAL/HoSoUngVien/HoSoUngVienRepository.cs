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
                    MucLuongMongMuon = dto.MucLuongMongMuon
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

                return _context.SaveChanges() > 0;
            }
            catch
            {
                return false;
            }
        }
    }
}