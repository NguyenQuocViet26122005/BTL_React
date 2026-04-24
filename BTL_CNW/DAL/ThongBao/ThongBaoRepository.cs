using BTL_CNW.DTO.ThongBao;
using BTL_CNW.Models;

namespace BTL_CNW.DAL.ThongBao
{
    public class ThongBaoRepository : IThongBaoRepository
    {
        private readonly QuanLyViecLamContext _context;

        public ThongBaoRepository(QuanLyViecLamContext context)
        {
            _context = context;
        }

        public List<ThongBaoDto> LayTheoNguoiDung(int maNguoiDung, int pageSize, int pageNumber)
        {
            return _context.ThongBaos
                .Where(tb => tb.MaNguoiDung == maNguoiDung)
                .OrderByDescending(tb => tb.NgayTao)
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .Select(tb => new ThongBaoDto
                {
                    MaThongBao = tb.MaThongBao,
                    MaNguoiDung = tb.MaNguoiDung,
                    LoaiThongBao = tb.LoaiThongBao,
                    TieuDe = tb.TieuDe,
                    NoiDung = tb.NoiDung,
                    LoaiLienKet = tb.LoaiLienKet,
                    MaLienKet = tb.MaLienKet,
                    DaDoc = tb.DaDoc,
                    NgayTao = tb.NgayTao
                })
                .ToList();
        }

        public int DemChuaDoc(int maNguoiDung)
        {
            return _context.ThongBaos
                .Count(tb => tb.MaNguoiDung == maNguoiDung && !tb.DaDoc);
        }

        public bool DanhDauDaDoc(long maThongBao)
        {
            try
            {
                var thongBao = _context.ThongBaos.FirstOrDefault(tb => tb.MaThongBao == maThongBao);
                if (thongBao == null) return false;

                thongBao.DaDoc = true;
                _context.SaveChanges();
                return true;
            }
            catch
            {
                return false;
            }
        }

        public bool DanhDauTatCaDaDoc(int maNguoiDung)
        {
            try
            {
                var thongBaos = _context.ThongBaos
                    .Where(tb => tb.MaNguoiDung == maNguoiDung && !tb.DaDoc)
                    .ToList();

                foreach (var tb in thongBaos)
                {
                    tb.DaDoc = true;
                }

                _context.SaveChanges();
                return true;
            }
            catch
            {
                return false;
            }
        }

        public bool TaoThongBao(int maNguoiDung, string loaiThongBao, string tieuDe, string? noiDung, string? loaiLienKet, int? maLienKet)
        {
            try
            {
                var thongBao = new Models.ThongBao
                {
                    MaNguoiDung = maNguoiDung,
                    LoaiThongBao = loaiThongBao,
                    TieuDe = tieuDe,
                    NoiDung = noiDung,
                    LoaiLienKet = loaiLienKet,
                    MaLienKet = maLienKet,
                    DaDoc = false,
                    NgayTao = DateTime.Now
                };

                _context.ThongBaos.Add(thongBao);
                _context.SaveChanges();
                return true;
            }
            catch
            {
                return false;
            }
        }
    }
}
