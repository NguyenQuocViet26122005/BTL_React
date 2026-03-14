using BTL_CNW.DTO.CongTy;
using BTL_CNW.Models;
using Microsoft.EntityFrameworkCore;

namespace BTL_CNW.DAL.CongTy
{
    public class CongTyRepository : ICongTyRepository
    {
        private readonly QuanLyViecLamContext _context;

        public CongTyRepository(QuanLyViecLamContext context)
        {
            _context = context;
        }

        public bool TaoCongTy(TaoCongTyDto dto)
        {
            try
            {
                var congTy = new Models.CongTy
                {
                    MaChuSoHuu = dto.MaChuSoHuu,
                    TenCongTy = dto.TenCongTy,
                    MaSoThue = dto.MaSoThue,
                    Logo = dto.Logo,
                    Website = dto.Website,
                    MaLinhVuc = dto.MaLinhVuc,
                    QuyMo = dto.QuyMo,
                    DiaChi = dto.DiaChi,
                    ThanhPho = dto.ThanhPho,
                    QuocGia = dto.QuocGia,
                    MoTa = dto.MoTa,
                    DaDuocDuyet = false
                };

                _context.CongTies.Add(congTy);
                return _context.SaveChanges() > 0;
            }
            catch
            {
                return false;
            }
        }

        public List<CongTyDto> LayTatCa()
        {
            return _context.CongTies
                .Include(x => x.MaLinhVucNavigation)
                .OrderByDescending(x => x.NgayTao)
                .Select(x => new CongTyDto
                {
                    MaCongTy = x.MaCongTy,
                    MaChuSoHuu = x.MaChuSoHuu,
                    TenCongTy = x.TenCongTy,
                    MaSoThue = x.MaSoThue,
                    Logo = x.Logo,
                    Website = x.Website,
                    MaLinhVuc = x.MaLinhVuc,
                    TenLinhVuc = x.MaLinhVucNavigation != null ? x.MaLinhVucNavigation.TenLinhVuc : null,
                    QuyMo = x.QuyMo,
                    DiaChi = x.DiaChi,
                    ThanhPho = x.ThanhPho,
                    QuocGia = x.QuocGia,
                    MoTa = x.MoTa,
                    DaDuocDuyet = x.DaDuocDuyet,
                    NgayTao = x.NgayTao
                })
                .ToList();
        }

        public CongTyDto? LayTheoId(int maCongTy)
        {
            var congTy = _context.CongTies
                .Include(x => x.MaLinhVucNavigation)
                .FirstOrDefault(x => x.MaCongTy == maCongTy);

            if (congTy == null) return null;

            return new CongTyDto
            {
                MaCongTy = congTy.MaCongTy,
                MaChuSoHuu = congTy.MaChuSoHuu,
                TenCongTy = congTy.TenCongTy,
                MaSoThue = congTy.MaSoThue,
                Logo = congTy.Logo,
                Website = congTy.Website,
                MaLinhVuc = congTy.MaLinhVuc,
                TenLinhVuc = congTy.MaLinhVucNavigation?.TenLinhVuc,
                QuyMo = congTy.QuyMo,
                DiaChi = congTy.DiaChi,
                ThanhPho = congTy.ThanhPho,
                QuocGia = congTy.QuocGia,
                MoTa = congTy.MoTa,
                DaDuocDuyet = congTy.DaDuocDuyet,
                NgayTao = congTy.NgayTao
            };
        }

        public CongTyDto? LayTheoChuSoHuu(int maNguoiDung)
        {
            var congTy = _context.CongTies
                .Include(x => x.MaLinhVucNavigation)
                .FirstOrDefault(x => x.MaChuSoHuu == maNguoiDung);

            if (congTy == null) return null;

            return new CongTyDto
            {
                MaCongTy = congTy.MaCongTy,
                MaChuSoHuu = congTy.MaChuSoHuu,
                TenCongTy = congTy.TenCongTy,
                MaSoThue = congTy.MaSoThue,
                Logo = congTy.Logo,
                Website = congTy.Website,
                MaLinhVuc = congTy.MaLinhVuc,
                TenLinhVuc = congTy.MaLinhVucNavigation?.TenLinhVuc,
                QuyMo = congTy.QuyMo,
                DiaChi = congTy.DiaChi,
                ThanhPho = congTy.ThanhPho,
                QuocGia = congTy.QuocGia,
                MoTa = congTy.MoTa,
                DaDuocDuyet = congTy.DaDuocDuyet,
                NgayTao = congTy.NgayTao
            };
        }

        public bool CapNhat(int maCongTy, CapNhatCongTyDto dto)
        {
            try
            {
                var congTy = _context.CongTies.FirstOrDefault(x => x.MaCongTy == maCongTy);
                if (congTy == null) return false;

                congTy.TenCongTy = dto.TenCongTy;
                congTy.MaSoThue = dto.MaSoThue;
                congTy.Logo = dto.Logo;
                congTy.Website = dto.Website;
                congTy.MaLinhVuc = dto.MaLinhVuc;
                congTy.QuyMo = dto.QuyMo;
                congTy.DiaChi = dto.DiaChi;
                congTy.ThanhPho = dto.ThanhPho;
                congTy.QuocGia = dto.QuocGia;
                congTy.MoTa = dto.MoTa;

                return _context.SaveChanges() > 0;
            }
            catch
            {
                return false;
            }
        }

        public bool DuyetCongTy(int maCongTy)
        {
            try
            {
                var congTy = _context.CongTies.FirstOrDefault(x => x.MaCongTy == maCongTy);
                if (congTy == null) return false;

                congTy.DaDuocDuyet = true;
                return _context.SaveChanges() > 0;
            }
            catch
            {
                return false;
            }
        }

        public bool Xoa(int maCongTy)
        {
            try
            {
                var congTy = _context.CongTies.FirstOrDefault(x => x.MaCongTy == maCongTy);
                if (congTy == null) return false;

                _context.CongTies.Remove(congTy);
                return _context.SaveChanges() > 0;
            }
            catch
            {
                return false;
            }
        }
    }
}
