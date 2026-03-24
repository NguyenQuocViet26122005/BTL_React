using BTL_CNW.Models;
using Microsoft.EntityFrameworkCore;

namespace BTL_CNW.DAL.DanhMuc
{
    public class DanhMucRepository : IDanhMucRepository
    {
        private readonly QuanLyViecLamContext _context;

        public DanhMucRepository(QuanLyViecLamContext context)
        {
            _context = context;
        }

        public async Task<List<DanhMucViecLam>> GetAllAsync()
        {
            return await _context.DanhMucViecLams
                .Include(d => d.InverseMaDanhMucChaNavigation)
                .ToListAsync();
        }

        public async Task<DanhMucViecLam?> GetByIdAsync(int id)
        {
            return await _context.DanhMucViecLams
                .Include(d => d.InverseMaDanhMucChaNavigation)
                .FirstOrDefaultAsync(d => d.MaDanhMuc == id);
        }

        public async Task<List<DanhMucViecLam>> GetByParentIdAsync(int? parentId)
        {
            return await _context.DanhMucViecLams
                .Where(d => d.MaDanhMucCha == parentId)
                .ToListAsync();
        }

        public async Task<Dictionary<int, int>> GetJobCountByDanhMucAsync()
        {
            return await _context.TinTuyenDungs
                .Where(t => t.MaDanhMuc != null && t.TrangThai == "Đã duyệt")
                .GroupBy(t => t.MaDanhMuc!.Value)
                .Select(g => new { MaDanhMuc = g.Key, Count = g.Count() })
                .ToDictionaryAsync(x => x.MaDanhMuc, x => x.Count);
        }
    }
}
