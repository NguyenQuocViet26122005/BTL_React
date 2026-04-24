using BTL_CNW.Models;
using Microsoft.EntityFrameworkCore;

namespace BTL_CNW.DAL.KetQuaPhongVan
{
    public class KetQuaPhongVanRepository : IKetQuaPhongVanRepository
    {
        private readonly QuanLyViecLamContext _context;

        public KetQuaPhongVanRepository(QuanLyViecLamContext context)
        {
            _context = context;
        }

        public Models.KetQuaPhongVan? LayTheoMa(int maKetQua)
        {
            return _context.KetQuaPhongVans
                .Include(k => k.MaNguoiDanhGiaNavigation)
                .Include(k => k.MaLichNavigation)
                    .ThenInclude(l => l.MaDonNavigation)
                        .ThenInclude(d => d.MaTinNavigation)
                .FirstOrDefault(k => k.MaKetQua == maKetQua);
        }

        public Models.KetQuaPhongVan? LayTheoLich(int maLich)
        {
            return _context.KetQuaPhongVans
                .Include(k => k.MaNguoiDanhGiaNavigation)
                .Include(k => k.MaLichNavigation)
                    .ThenInclude(l => l.MaDonNavigation)
                        .ThenInclude(d => d.MaTinNavigation)
                .FirstOrDefault(k => k.MaLich == maLich);
        }

        public List<Models.KetQuaPhongVan> LayTheoUngVien(int maUngVien)
        {
            return _context.KetQuaPhongVans
                .Include(k => k.MaNguoiDanhGiaNavigation)
                .Include(k => k.MaLichNavigation)
                    .ThenInclude(l => l.MaDonNavigation)
                        .ThenInclude(d => d.MaTinNavigation)
                .Where(k => k.MaLichNavigation.MaDonNavigation.MaUngVien == maUngVien)
                .OrderByDescending(k => k.NgayTao)
                .ToList();
        }

        public int Tao(Models.KetQuaPhongVan ketQua)
        {
            _context.KetQuaPhongVans.Add(ketQua);
            _context.SaveChanges();
            return ketQua.MaKetQua;
        }

        public bool CapNhat(Models.KetQuaPhongVan ketQua)
        {
            _context.KetQuaPhongVans.Update(ketQua);
            return _context.SaveChanges() > 0;
        }

        public bool Xoa(int maKetQua)
        {
            var ketQua = _context.KetQuaPhongVans.Find(maKetQua);
            if (ketQua == null) return false;
            
            _context.KetQuaPhongVans.Remove(ketQua);
            return _context.SaveChanges() > 0;
        }
    }
}
