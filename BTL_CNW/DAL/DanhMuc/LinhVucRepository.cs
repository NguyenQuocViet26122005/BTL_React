using BTL_CNW.Models;
using Microsoft.EntityFrameworkCore;

namespace BTL_CNW.DAL.DanhMuc
{
    public class LinhVucRepository : ILinhVucRepository
    {
        private readonly QuanLyViecLamContext _context;

        public LinhVucRepository(QuanLyViecLamContext context)
        {
            _context = context;
        }

        public async Task<List<LinhVuc>> GetAllAsync()
        {
            return await _context.LinhVucs.OrderBy(l => l.TenLinhVuc).ToListAsync();
        }

        public async Task<LinhVuc?> GetByIdAsync(int id)
        {
            return await _context.LinhVucs.FindAsync(id);
        }
    }
}
