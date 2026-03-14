using BTL_CNW.DTO.Auth;
using BTL_CNW.Models;
using Microsoft.EntityFrameworkCore;

namespace BTL_CNW.DAL.Auth
{
    public class AuthRepository : IAuthRepository
    {
        private readonly QuanLyViecLamContext _context;

        public AuthRepository(QuanLyViecLamContext context)
        {
            _context = context;
        }

        public bool EmailDaTonTai(string email)
        {
            return _context.NguoiDungs.Any(x => x.Email == email);
        }

        public bool DangKy(DangKyDto dto)
        {
            try
            {
                var nguoiDung = new NguoiDung
                {
                    MaVaiTro = dto.MaVaiTro,
                    HoTen = dto.HoTen,
                    Email = dto.Email,
                    SoDienThoai = dto.SoDienThoai,
                    MatKhauMaHoa = dto.MatKhau, // NOTE: Thực tế nên hash password
                    DangHoatDong = true,
                    DaXacThucEmail = false
                };

                _context.NguoiDungs.Add(nguoiDung);
                return _context.SaveChanges() > 0;
            }
            catch
            {
                return false;
            }
        }

        public NguoiDungDto? DangNhap(string email, string matKhau)
        {
            var nguoiDung = _context.NguoiDungs
                .Include(x => x.MaVaiTroNavigation)
                .FirstOrDefault(x => x.Email == email && 
                                   x.MatKhauMaHoa == matKhau && 
                                   x.DangHoatDong == true);

            if (nguoiDung == null) return null;

            return new NguoiDungDto
            {
                MaNguoiDung = nguoiDung.MaNguoiDung,
                MaVaiTro = nguoiDung.MaVaiTro,
                TenVaiTro = nguoiDung.MaVaiTroNavigation.TenVaiTro,
                HoTen = nguoiDung.HoTen,
                Email = nguoiDung.Email,
                SoDienThoai = nguoiDung.SoDienThoai,
                AnhDaiDien = nguoiDung.AnhDaiDien,
                DangHoatDong = nguoiDung.DangHoatDong,
                NgayTao = nguoiDung.NgayTao
            };
        }
    }
}
