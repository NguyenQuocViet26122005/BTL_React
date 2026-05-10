using BTL_CNW.DTO.KinhNghiemLamViec;
using BTL_CNW.Models;
using Microsoft.EntityFrameworkCore;

namespace BTL_CNW.DAL.KinhNghiemLamViec
{
    public class KinhNghiemRepository : IKinhNghiemRepository
    {
        private readonly QuanLyViecLamContext _context;

        public KinhNghiemRepository(QuanLyViecLamContext context)
        {
            _context = context;
        }

        public List<KinhNghiemDto> LayTheoHoSo(int maHoSo)
        {
            return _context.KinhNghiemLamViecs
                .Where(k => k.MaHoSo == maHoSo)
                .OrderByDescending(k => k.NgayBatDau)
                .Select(k => new KinhNghiemDto
                {
                    MaKinhNghiem = k.MaKinhNghiem,
                    MaHoSo = k.MaHoSo,
                    TenCongTy = k.TenCongTy,
                    ViTri = k.ViTri,
                    MoTa = k.MoTa,
                    NgayBatDau = k.NgayBatDau,
                    NgayKetThuc = k.NgayKetThuc,
                    DangLamKhong = k.DangLamKhong
                })
                .ToList();
        }

        public KinhNghiemDto? LayTheoMa(int maKinhNghiem)
        {
            return _context.KinhNghiemLamViecs
                .Where(k => k.MaKinhNghiem == maKinhNghiem)
                .Select(k => new KinhNghiemDto
                {
                    MaKinhNghiem = k.MaKinhNghiem,
                    MaHoSo = k.MaHoSo,
                    TenCongTy = k.TenCongTy,
                    ViTri = k.ViTri,
                    MoTa = k.MoTa,
                    NgayBatDau = k.NgayBatDau,
                    NgayKetThuc = k.NgayKetThuc,
                    DangLamKhong = k.DangLamKhong
                })
                .FirstOrDefault();
        }

        public int Them(TaoKinhNghiemDto dto)
        {
            var kinhNghiem = new Models.KinhNghiemLamViec
            {
                MaHoSo = dto.MaHoSo,
                TenCongTy = dto.TenCongTy,
                ViTri = dto.ViTri,
                MoTa = dto.MoTa,
                NgayBatDau = dto.NgayBatDau,
                NgayKetThuc = dto.NgayKetThuc,
                DangLamKhong = dto.DangLamKhong
            };

            _context.KinhNghiemLamViecs.Add(kinhNghiem);
            _context.SaveChanges();
            return kinhNghiem.MaKinhNghiem;
        }

        public bool CapNhat(int maKinhNghiem, TaoKinhNghiemDto dto)
        {
            var kinhNghiem = _context.KinhNghiemLamViecs.Find(maKinhNghiem);
            if (kinhNghiem == null) return false;

            kinhNghiem.TenCongTy = dto.TenCongTy;
            kinhNghiem.ViTri = dto.ViTri;
            kinhNghiem.MoTa = dto.MoTa;
            kinhNghiem.NgayBatDau = dto.NgayBatDau;
            kinhNghiem.NgayKetThuc = dto.NgayKetThuc;
            kinhNghiem.DangLamKhong = dto.DangLamKhong;

            _context.SaveChanges();
            return true;
        }

        public bool Xoa(int maKinhNghiem)
        {
            var kinhNghiem = _context.KinhNghiemLamViecs.Find(maKinhNghiem);
            if (kinhNghiem == null) return false;

            _context.KinhNghiemLamViecs.Remove(kinhNghiem);
            _context.SaveChanges();
            return true;
        }
    }
}
