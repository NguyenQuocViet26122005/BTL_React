using BTL_CNW.DTO.Profile;
using BTL_CNW.Models;
using Microsoft.EntityFrameworkCore;

namespace BTL_CNW.DAL.Profile
{
    public class ProfileRepository : IProfileRepository
    {
        private readonly QuanLyViecLamContext _context;

        public ProfileRepository(QuanLyViecLamContext context)
        {
            _context = context;
        }

        public ProfileDto? LayProfile(int maNguoiDung)
        {
            var nguoiDung = _context.NguoiDungs
                .Include(x => x.CongTies)
                    .ThenInclude(c => c.MaLinhVucNavigation)
                .FirstOrDefault(x => x.MaNguoiDung == maNguoiDung);

            if (nguoiDung == null) return null;

            var congTy = nguoiDung.CongTies.FirstOrDefault();

            return new ProfileDto
            {
                MaNguoiDung = nguoiDung.MaNguoiDung,
                HoTen = nguoiDung.HoTen,
                Email = nguoiDung.Email,
                SoDienThoai = nguoiDung.SoDienThoai,
                AnhDaiDien = nguoiDung.AnhDaiDien,
                DangHoatDong = nguoiDung.DangHoatDong,
                NgayTao = nguoiDung.NgayTao,
                MaCongTy = congTy?.MaCongTy,
                TenCongTy = congTy?.TenCongTy,
                MaSoThue = congTy?.MaSoThue,
                Logo = congTy?.Logo,
                Website = congTy?.Website,
                MaLinhVuc = congTy?.MaLinhVuc,
                TenLinhVuc = congTy?.MaLinhVucNavigation?.TenLinhVuc,
                QuyMo = congTy?.QuyMo,
                DiaChi = congTy?.DiaChi,
                ThanhPho = congTy?.ThanhPho,
                QuocGia = congTy?.QuocGia,
                MoTa = congTy?.MoTa,
                DaDuocDuyet = congTy?.DaDuocDuyet,
                TrangThaiCongTy = congTy?.DaDuocDuyet == true ? "Đã duyệt" : "Chờ duyệt"
            };
        }

        public bool CapNhatProfile(int maNguoiDung, CapNhatProfileDto dto)
        {
            try
            {
                var nguoiDung = _context.NguoiDungs.FirstOrDefault(x => x.MaNguoiDung == maNguoiDung);
                if (nguoiDung == null) return false;

                nguoiDung.HoTen = dto.HoTen;
                nguoiDung.SoDienThoai = dto.SoDienThoai;
                nguoiDung.AnhDaiDien = dto.AnhDaiDien;

                return _context.SaveChanges() > 0;
            }
            catch
            {
                return false;
            }
        }

        public bool DoiMatKhau(int maNguoiDung, string matKhauMoi)
        {
            try
            {
                var nguoiDung = _context.NguoiDungs.FirstOrDefault(x => x.MaNguoiDung == maNguoiDung);
                if (nguoiDung == null) return false;

                nguoiDung.MatKhauMaHoa = matKhauMoi;
                return _context.SaveChanges() > 0;
            }
            catch
            {
                return false;
            }
        }

        public string? LayMatKhauHienTai(int maNguoiDung)
        {
            return _context.NguoiDungs
                .Where(x => x.MaNguoiDung == maNguoiDung)
                .Select(x => x.MatKhauMaHoa)
                .FirstOrDefault();
        }
    }
}
