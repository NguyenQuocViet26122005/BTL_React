using BTL_CNW.DTO.DonUngTuyen;
using BTL_CNW.Models;
using Microsoft.EntityFrameworkCore;

namespace BTL_CNW.DAL.DonUngTuyen
{
    public class DonUngTuyenRepository : IDonUngTuyenRepository
    {
        private readonly QuanLyViecLamContext _context;

        public DonUngTuyenRepository(QuanLyViecLamContext context)
        {
            _context = context;
        }

        public bool DaNop(int maTin, int maUngVien)
        {
            return _context.DonUngTuyens.Any(x => x.MaTin == maTin && x.MaUngVien == maUngVien);
        }

        public bool NopDon(NopDonDto dto)
        {
            try
            {
                var donUngTuyen = new Models.DonUngTuyen
                {
                    MaTin = dto.MaTin,
                    MaUngVien = dto.MaUngVien,
                    MaFileCv = dto.MaFileCV,
                    ThuGioiThieu = dto.ThuGioiThieu,
                    TrangThai = "DaNop"
                };

                _context.DonUngTuyens.Add(donUngTuyen);
                return _context.SaveChanges() > 0;
            }
            catch
            {
                return false;
            }
        }

        public List<DonUngTuyenDto> LayTheoUngVien(int maUngVien)
        {
            return _context.DonUngTuyens
                .Include(x => x.MaTinNavigation)
                .Include(x => x.MaUngVienNavigation)
                .Include(x => x.MaFileCvNavigation)
                .Where(x => x.MaUngVien == maUngVien)
                .OrderByDescending(x => x.NgayNop)
                .Select(x => new DonUngTuyenDto
                {
                    MaDon = x.MaDon,
                    MaTin = x.MaTin,
                    TieuDeTin = x.MaTinNavigation.TieuDe,
                    MaUngVien = x.MaUngVien,
                    TenUngVien = x.MaUngVienNavigation.HoTen,
                    EmailUngVien = x.MaUngVienNavigation.Email,
                    MaFileCV = x.MaFileCv,
                    TenFileCV = x.MaFileCvNavigation.TenFile,
                    DuongDanFileCV = x.MaFileCvNavigation.DuongDanFile,
                    ThuGioiThieu = x.ThuGioiThieu,
                    TrangThai = x.TrangThai,
                    NgayNop = x.NgayNop,
                    NgayCapNhat = x.NgayCapNhat
                })
                .ToList();
        }

        public List<DonUngTuyenDto> LayTheoTin(int maTin)
        {
            return _context.DonUngTuyens
                .Include(x => x.MaTinNavigation)
                .Include(x => x.MaUngVienNavigation)
                .Include(x => x.MaFileCvNavigation)
                .Where(x => x.MaTin == maTin)
                .OrderByDescending(x => x.NgayNop)
                .Select(x => new DonUngTuyenDto
                {
                    MaDon = x.MaDon,
                    MaTin = x.MaTin,
                    TieuDeTin = x.MaTinNavigation.TieuDe,
                    MaUngVien = x.MaUngVien,
                    TenUngVien = x.MaUngVienNavigation.HoTen,
                    EmailUngVien = x.MaUngVienNavigation.Email,
                    MaFileCV = x.MaFileCv,
                    TenFileCV = x.MaFileCvNavigation.TenFile,
                    ThuGioiThieu = x.ThuGioiThieu,
                    TrangThai = x.TrangThai,
                    NgayNop = x.NgayNop,
                    NgayCapNhat = x.NgayCapNhat
                })
                .ToList();
        }

        public DonUngTuyenDto? LayChiTiet(int maDon)
        {
            var don = _context.DonUngTuyens
                .Include(x => x.MaTinNavigation)
                .Include(x => x.MaUngVienNavigation)
                .Include(x => x.MaFileCvNavigation)
                .FirstOrDefault(x => x.MaDon == maDon);

            if (don == null) return null;

            return new DonUngTuyenDto
            {
                MaDon = don.MaDon,
                MaTin = don.MaTin,
                TieuDeTin = don.MaTinNavigation.TieuDe,
                MaUngVien = don.MaUngVien,
                TenUngVien = don.MaUngVienNavigation.HoTen,
                EmailUngVien = don.MaUngVienNavigation.Email,
                MaFileCV = don.MaFileCv,
                TenFileCV = don.MaFileCvNavigation.TenFile,
                DuongDanFileCV = don.MaFileCvNavigation.DuongDanFile,
                ThuGioiThieu = don.ThuGioiThieu,
                TrangThai = don.TrangThai,
                NgayNop = don.NgayNop,
                NgayCapNhat = don.NgayCapNhat
            };
        }

        public bool CapNhatTrangThai(int maDon, string trangThai)
        {
            try
            {
                var don = _context.DonUngTuyens.FirstOrDefault(x => x.MaDon == maDon);
                if (don == null) return false;

                don.TrangThai = trangThai;
                return _context.SaveChanges() > 0;
            }
            catch
            {
                return false;
            }
        }
    }
}