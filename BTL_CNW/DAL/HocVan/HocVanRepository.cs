using BTL_CNW.DTO.HocVan;
using BTL_CNW.Models;
using Microsoft.EntityFrameworkCore;

namespace BTL_CNW.DAL.HocVan
{
    public class HocVanRepository : IHocVanRepository
    {
        private readonly QuanLyViecLamContext _context;

        public HocVanRepository(QuanLyViecLamContext context)
        {
            _context = context;
        }

        public List<HocVanDto> LayTheoHoSo(int maHoSo)
        {
            return _context.HocVans
                .Where(h => h.MaHoSo == maHoSo)
                .OrderByDescending(h => h.NgayBatDau)
                .Select(h => new HocVanDto
                {
                    MaHocVan = h.MaHocVan,
                    MaHoSo = h.MaHoSo,
                    TruongHoc = h.TruongHoc,
                    BangCap = h.BangCap,
                    ChuyenNganh = h.ChuyenNganh,
                    DiemTrungBinh = h.DiemTrungBinh,
                    NgayBatDau = h.NgayBatDau,
                    NgayKetThuc = h.NgayKetThuc,
                    DangHocKhong = h.DangHocKhong
                })
                .ToList();
        }

        public HocVanDto? LayTheoMa(int maHocVan)
        {
            return _context.HocVans
                .Where(h => h.MaHocVan == maHocVan)
                .Select(h => new HocVanDto
                {
                    MaHocVan = h.MaHocVan,
                    MaHoSo = h.MaHoSo,
                    TruongHoc = h.TruongHoc,
                    BangCap = h.BangCap,
                    ChuyenNganh = h.ChuyenNganh,
                    DiemTrungBinh = h.DiemTrungBinh,
                    NgayBatDau = h.NgayBatDau,
                    NgayKetThuc = h.NgayKetThuc,
                    DangHocKhong = h.DangHocKhong
                })
                .FirstOrDefault();
        }

        public int Them(TaoHocVanDto dto)
        {
            var hocVan = new Models.HocVan
            {
                MaHoSo = dto.MaHoSo,
                TruongHoc = dto.TruongHoc,
                BangCap = dto.BangCap,
                ChuyenNganh = dto.ChuyenNganh,
                DiemTrungBinh = dto.DiemTrungBinh,
                NgayBatDau = dto.NgayBatDau,
                NgayKetThuc = dto.NgayKetThuc,
                DangHocKhong = dto.DangHocKhong
            };

            _context.HocVans.Add(hocVan);
            _context.SaveChanges();
            return hocVan.MaHocVan;
        }

        public bool CapNhat(int maHocVan, TaoHocVanDto dto)
        {
            var hocVan = _context.HocVans.Find(maHocVan);
            if (hocVan == null) return false;

            hocVan.TruongHoc = dto.TruongHoc;
            hocVan.BangCap = dto.BangCap;
            hocVan.ChuyenNganh = dto.ChuyenNganh;
            hocVan.DiemTrungBinh = dto.DiemTrungBinh;
            hocVan.NgayBatDau = dto.NgayBatDau;
            hocVan.NgayKetThuc = dto.NgayKetThuc;
            hocVan.DangHocKhong = dto.DangHocKhong;

            _context.SaveChanges();
            return true;
        }

        public bool Xoa(int maHocVan)
        {
            var hocVan = _context.HocVans.Find(maHocVan);
            if (hocVan == null) return false;

            _context.HocVans.Remove(hocVan);
            _context.SaveChanges();
            return true;
        }
    }
}
