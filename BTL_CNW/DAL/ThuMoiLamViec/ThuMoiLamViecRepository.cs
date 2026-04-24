using BTL_CNW.Models;
using Microsoft.EntityFrameworkCore;

namespace BTL_CNW.DAL.ThuMoiLamViec
{
    public class ThuMoiLamViecRepository : IThuMoiLamViecRepository
    {
        private readonly QuanLyViecLamContext _context;

        public ThuMoiLamViecRepository(QuanLyViecLamContext context)
        {
            _context = context;
        }

        public Models.ThuMoiLamViec? LayTheoMa(int maThuMoi)
        {
            return _context.ThuMoiLamViecs
                .Include(t => t.MaNguoiPhatHanhNavigation)
                .Include(t => t.MaDonNavigation)
                    .ThenInclude(d => d.MaUngVienNavigation)
                .Include(t => t.MaDonNavigation)
                    .ThenInclude(d => d.MaTinNavigation)
                        .ThenInclude(tin => tin.MaCongTyNavigation)
                .FirstOrDefault(t => t.MaThuMoi == maThuMoi);
        }

        public List<Models.ThuMoiLamViec> LayTheoUngVien(int maUngVien)
        {
            return _context.ThuMoiLamViecs
                .Include(t => t.MaNguoiPhatHanhNavigation)
                .Include(t => t.MaDonNavigation)
                    .ThenInclude(d => d.MaTinNavigation)
                        .ThenInclude(tin => tin.MaCongTyNavigation)
                .Where(t => t.MaDonNavigation.MaUngVien == maUngVien)
                .OrderByDescending(t => t.NgayTao)
                .ToList();
        }

        public List<Models.ThuMoiLamViec> LayTheoCongTy(int maCongTy)
        {
            return _context.ThuMoiLamViecs
                .Include(t => t.MaNguoiPhatHanhNavigation)
                .Include(t => t.MaDonNavigation)
                    .ThenInclude(d => d.MaUngVienNavigation)
                .Include(t => t.MaDonNavigation)
                    .ThenInclude(d => d.MaTinNavigation)
                .Where(t => t.MaDonNavigation.MaTinNavigation.MaCongTy == maCongTy)
                .OrderByDescending(t => t.NgayTao)
                .ToList();
        }

        public int Tao(Models.ThuMoiLamViec thuMoi)
        {
            _context.ThuMoiLamViecs.Add(thuMoi);
            _context.SaveChanges();
            return thuMoi.MaThuMoi;
        }

        public bool CapNhat(Models.ThuMoiLamViec thuMoi)
        {
            _context.ThuMoiLamViecs.Update(thuMoi);
            return _context.SaveChanges() > 0;
        }

        public bool Xoa(int maThuMoi)
        {
            var thuMoi = _context.ThuMoiLamViecs.Find(maThuMoi);
            if (thuMoi == null) return false;
            
            _context.ThuMoiLamViecs.Remove(thuMoi);
            return _context.SaveChanges() > 0;
        }
    }
}
