using BTL_CNW.DTO.LichPhongVan;
using BTL_CNW.Models;
using Microsoft.EntityFrameworkCore;

namespace BTL_CNW.DAL.LichPhongVan
{
    public class LichPhongVanRepository : ILichPhongVanRepository
    {
        private readonly QuanLyViecLamContext _context;

        public LichPhongVanRepository(QuanLyViecLamContext context)
        {
            _context = context;
        }

        public bool TaoLich(TaoLichDto dto)
        {
            try
            {
                var lichPhongVan = new Models.LichPhongVan
                {
                    MaDon = dto.MaDon,
                    MaNguoiLich = dto.MaNguoiLich,
                    VongPhongVan = (byte)dto.VongPhongVan,
                    HinhThuc = dto.HinhThuc,
                    ThoiGian = dto.ThoiGian,
                    ThoiLuongPhut = dto.ThoiLuongPhut.HasValue ? (short)dto.ThoiLuongPhut.Value : null,
                    DiaDiem = dto.DiaDiem,
                    GhiChu = dto.GhiChu,
                    TrangThai = "DaLen"
                };

                _context.LichPhongVans.Add(lichPhongVan);
                return _context.SaveChanges() > 0;
            }
            catch
            {
                return false;
            }
        }

        public List<LichPhongVanDto> LayTheoDon(int maDon)
        {
            return _context.LichPhongVans
                .Include(x => x.MaNguoiLichNavigation)
                .Where(x => x.MaDon == maDon)
                .OrderBy(x => x.ThoiGian)
                .Select(x => new LichPhongVanDto
                {
                    MaLich = x.MaLich,
                    MaDon = x.MaDon,
                    MaNguoiLich = x.MaNguoiLich,
                    TenNguoiLich = x.MaNguoiLichNavigation.HoTen,
                    VongPhongVan = x.VongPhongVan,
                    HinhThuc = x.HinhThuc,
                    ThoiGian = x.ThoiGian,
                    ThoiLuongPhut = x.ThoiLuongPhut,
                    DiaDiem = x.DiaDiem,
                    GhiChu = x.GhiChu,
                    TrangThai = x.TrangThai,
                    NgayTao = x.NgayTao
                })
                .ToList();
        }

        public LichPhongVanDto? LayChiTiet(int maLich)
        {
            var lich = _context.LichPhongVans
                .Include(x => x.MaNguoiLichNavigation)
                .FirstOrDefault(x => x.MaLich == maLich);

            if (lich == null) return null;

            return new LichPhongVanDto
            {
                MaLich = lich.MaLich,
                MaDon = lich.MaDon,
                MaNguoiLich = lich.MaNguoiLich,
                TenNguoiLich = lich.MaNguoiLichNavigation.HoTen,
                VongPhongVan = lich.VongPhongVan,
                HinhThuc = lich.HinhThuc,
                ThoiGian = lich.ThoiGian,
                ThoiLuongPhut = lich.ThoiLuongPhut,
                DiaDiem = lich.DiaDiem,
                GhiChu = lich.GhiChu,
                TrangThai = lich.TrangThai,
                NgayTao = lich.NgayTao
            };
        }

        public bool DoiTrangThai(int maLich, string trangThai)
        {
            try
            {
                var lich = _context.LichPhongVans.FirstOrDefault(x => x.MaLich == maLich);
                if (lich == null) return false;

                lich.TrangThai = trangThai;
                return _context.SaveChanges() > 0;
            }
            catch
            {
                return false;
            }
        }
    }
}