using BTL_CNW.DTO.Dashboard;
using BTL_CNW.Models;
using Microsoft.EntityFrameworkCore;

namespace BTL_CNW.DAL.Dashboard
{
    public class DashboardRepository : IDashboardRepository
    {
        private readonly QuanLyViecLamContext _context;

        public DashboardRepository(QuanLyViecLamContext context)
        {
            _context = context;
        }

        public DashboardStatsDto LayThongKe(int maNguoiDung)
        {
            // Lấy công ty của người dùng
            var congTy = _context.CongTies.FirstOrDefault(x => x.MaChuSoHuu == maNguoiDung);
            if (congTy == null)
            {
                return new DashboardStatsDto();
            }

            // Lấy tất cả tin tuyển dụng của công ty
            var tinTuyenDungs = _context.TinTuyenDungs
                .Where(x => x.MaCongTy == congTy.MaCongTy)
                .ToList();

            // Lấy tất cả đơn ứng tuyển cho các tin của công ty
            var maTins = tinTuyenDungs.Select(x => x.MaTin).ToList();
            var donUngTuyens = _context.DonUngTuyens
                .Where(x => maTins.Contains(x.MaTin))
                .ToList();

            // Lấy lịch phỏng vấn
            var maDons = donUngTuyens.Select(x => x.MaDon).ToList();
            var homNay = DateTime.Today;
            var tuanNay = homNay.AddDays(7);

            var lichPhongVans = _context.LichPhongVans
                .Where(x => maDons.Contains(x.MaDon))
                .ToList();

            return new DashboardStatsDto
            {
                TongTinDang = tinTuyenDungs.Count,
                TinDangTuyen = tinTuyenDungs.Count(x => x.TrangThai == "DaDuyet"),
                TinDaDong = tinTuyenDungs.Count(x => x.TrangThai == "DaDong"),
                TinChoXetDuyet = tinTuyenDungs.Count(x => x.TrangThai == "ChoXetDuyet"),
                TongDonUngTuyen = donUngTuyens.Count,
                DonMoi = donUngTuyens.Count(x => x.TrangThai == "DaNop"),
                DonDangXem = donUngTuyens.Count(x => x.TrangThai == "DangXem"),
                DonVaoDanhSach = donUngTuyens.Count(x => x.TrangThai == "VaoDanhSach"),
                TongLuotXem = tinTuyenDungs.Sum(x => x.LuotXem),
                LichPhongVanHomNay = lichPhongVans.Count(x => x.ThoiGian.Date == homNay),
                LichPhongVanTuanNay = lichPhongVans.Count(x => x.ThoiGian.Date >= homNay && x.ThoiGian.Date <= tuanNay)
            };
        }

        public List<LichPhongVanSapToiDto> LayLichPhongVanSapToi(int maNguoiDung, int soNgay)
        {
            var congTy = _context.CongTies.FirstOrDefault(x => x.MaChuSoHuu == maNguoiDung);
            if (congTy == null) return new List<LichPhongVanSapToiDto>();

            var homNay = DateTime.Now;
            var ngayKetThuc = homNay.AddDays(soNgay);

            return _context.LichPhongVans
                .Include(x => x.MaDonNavigation)
                    .ThenInclude(d => d.MaUngVienNavigation)
                .Include(x => x.MaDonNavigation)
                    .ThenInclude(d => d.MaTinNavigation)
                .Where(x => x.MaDonNavigation.MaTinNavigation.MaCongTy == congTy.MaCongTy
                    && x.ThoiGian >= homNay
                    && x.ThoiGian <= ngayKetThuc
                    && x.TrangThai == "DaLen")
                .OrderBy(x => x.ThoiGian)
                .Select(x => new LichPhongVanSapToiDto
                {
                    MaLich = x.MaLich,
                    MaDon = x.MaDon,
                    TenUngVien = x.MaDonNavigation.MaUngVienNavigation.HoTen,
                    EmailUngVien = x.MaDonNavigation.MaUngVienNavigation.Email,
                    ViTriUngTuyen = x.MaDonNavigation.MaTinNavigation.TieuDe,
                    VongPhongVan = x.VongPhongVan,
                    HinhThuc = x.HinhThuc,
                    ThoiGian = x.ThoiGian,
                    ThoiLuongPhut = x.ThoiLuongPhut,
                    DiaDiem = x.DiaDiem,
                    TrangThai = x.TrangThai
                })
                .ToList();
        }

        public List<BieuDoLuotXemDto> LayBieuDoLuotXem(int maNguoiDung, int soNgay)
        {
            var congTy = _context.CongTies.FirstOrDefault(x => x.MaChuSoHuu == maNguoiDung);
            if (congTy == null) return new List<BieuDoLuotXemDto>();

            var ngayBatDau = DateTime.Today.AddDays(-soNgay);
            
            // Lấy tất cả tin của công ty
            var tinTuyenDungs = _context.TinTuyenDungs
                .Where(x => x.MaCongTy == congTy.MaCongTy && x.NgayTao >= ngayBatDau)
                .ToList();

            // Group theo ngày và tính tổng lượt xem
            var result = new List<BieuDoLuotXemDto>();
            for (int i = soNgay; i >= 0; i--)
            {
                var ngay = DateTime.Today.AddDays(-i);
                var luotXem = tinTuyenDungs
                    .Where(x => x.NgayTao.Date == ngay.Date)
                    .Sum(x => x.LuotXem);

                result.Add(new BieuDoLuotXemDto
                {
                    Ngay = ngay.ToString("dd/MM"),
                    LuotXem = luotXem
                });
            }

            return result;
        }

        public List<BieuDoDonUngTuyenDto> LayBieuDoDonUngTuyen(int maNguoiDung, int soThang)
        {
            var congTy = _context.CongTies.FirstOrDefault(x => x.MaChuSoHuu == maNguoiDung);
            if (congTy == null) return new List<BieuDoDonUngTuyenDto>();

            var thangBatDau = DateTime.Today.AddMonths(-soThang);
            
            // Lấy tất cả tin của công ty
            var maTins = _context.TinTuyenDungs
                .Where(x => x.MaCongTy == congTy.MaCongTy)
                .Select(x => x.MaTin)
                .ToList();

            // Lấy đơn ứng tuyển
            var donUngTuyens = _context.DonUngTuyens
                .Where(x => maTins.Contains(x.MaTin) && x.NgayNop >= thangBatDau)
                .ToList();

            // Group theo tháng
            var result = new List<BieuDoDonUngTuyenDto>();
            for (int i = soThang; i >= 0; i--)
            {
                var thang = DateTime.Today.AddMonths(-i);
                var soDon = donUngTuyens
                    .Count(x => x.NgayNop.Year == thang.Year && x.NgayNop.Month == thang.Month);

                result.Add(new BieuDoDonUngTuyenDto
                {
                    Thang = thang.ToString("MM/yyyy"),
                    SoDon = soDon
                });
            }

            return result;
        }
    }
}
