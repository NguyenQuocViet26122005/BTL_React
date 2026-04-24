using BTL_CNW.Models;
using Microsoft.EntityFrameworkCore;

namespace BTL_CNW.DAL.FileCv
{
    public class FileCvRepository : IFileCvRepository
    {
        private readonly QuanLyViecLamContext _context;

        public FileCvRepository(QuanLyViecLamContext context)
        {
            _context = context;
        }

        public Models.FileCv? TaoFileCv(int maHoSo, string tenFile, string duongDan, int kichThuoc, string loaiFile, bool laMacDinh)
        {
            try
            {
                if (laMacDinh)
                {
                    var existingFiles = _context.FileCvs.Where(f => f.MaHoSo == maHoSo).ToList();
                    foreach (var file in existingFiles)
                    {
                        file.LaMacDinh = false;
                    }
                }

                var fileCv = new Models.FileCv
                {
                    MaHoSo = maHoSo,
                    TenFile = tenFile,
                    DuongDanFile = duongDan,
                    KichThuoc = kichThuoc,
                    LoaiFile = loaiFile,
                    LaMacDinh = laMacDinh,
                    NgayTai = DateTime.Now
                };

                _context.FileCvs.Add(fileCv);
                _context.SaveChanges();

                return fileCv;
            }
            catch
            {
                return null;
            }
        }

        public List<Models.FileCv> LayDanhSachCvTheoHoSo(int maHoSo)
        {
            return _context.FileCvs
                .Where(f => f.MaHoSo == maHoSo)
                .OrderByDescending(f => f.LaMacDinh)
                .ThenByDescending(f => f.NgayTai)
                .ToList();
        }

        public Models.FileCv? LayChiTietFileCv(int maFileCv)
        {
            return _context.FileCvs.FirstOrDefault(f => f.MaFileCv == maFileCv);
        }

        public bool DatFileCvMacDinh(int maFileCv, int maHoSo)
        {
            try
            {
                var allFiles = _context.FileCvs.Where(f => f.MaHoSo == maHoSo).ToList();
                
                foreach (var file in allFiles)
                {
                    file.LaMacDinh = file.MaFileCv == maFileCv;
                }

                _context.SaveChanges();
                return true;
            }
            catch
            {
                return false;
            }
        }

        public bool XoaFileCv(int maFileCv)
        {
            try
            {
                var file = _context.FileCvs.FirstOrDefault(f => f.MaFileCv == maFileCv);
                if (file == null) return false;

                _context.FileCvs.Remove(file);
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
