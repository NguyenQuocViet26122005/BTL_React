using BTL_CNW.DAL.ThuMoiLamViec;
using BTL_CNW.DTO.ThuMoiLamViec;
using BTL_CNW.Models;

namespace BTL_CNW.BLL.ThuMoiLamViec
{
    public interface IThuMoiLamViecService
    {
        (bool success, string message, ThuMoiLamViecDto? data) LayTheoMa(int maThuMoi);
        (bool success, string message, List<ThuMoiLamViecDto>? data) LayTheoUngVien(int maUngVien);
        (bool success, string message, List<ThuMoiLamViecDto>? data) LayTheoCongTy(int maCongTy);
        (bool success, string message, int maThuMoi) Tao(TaoThuMoiDto dto, int maNguoiPhatHanh);
        (bool success, string message) PhanHoi(int maThuMoi, PhanHoiThuMoiDto dto);
        (bool success, string message) Xoa(int maThuMoi);
    }

    public class ThuMoiLamViecService : IThuMoiLamViecService
    {
        private readonly IThuMoiLamViecRepository _repo;

        public ThuMoiLamViecService(IThuMoiLamViecRepository repo)
        {
            _repo = repo;
        }

        public (bool success, string message, ThuMoiLamViecDto? data) LayTheoMa(int maThuMoi)
        {
            var thuMoi = _repo.LayTheoMa(maThuMoi);
            if (thuMoi == null)
                return (false, "Khong tim thay thu moi", null);

            return (true, "Lay thu moi thanh cong", MapToDto(thuMoi));
        }

        public (bool success, string message, List<ThuMoiLamViecDto>? data) LayTheoUngVien(int maUngVien)
        {
            var thuMois = _repo.LayTheoUngVien(maUngVien);
            var dtos = thuMois.Select(MapToDto).ToList();
            return (true, "Lay danh sach thu moi thanh cong", dtos);
        }

        public (bool success, string message, List<ThuMoiLamViecDto>? data) LayTheoCongTy(int maCongTy)
        {
            var thuMois = _repo.LayTheoCongTy(maCongTy);
            var dtos = thuMois.Select(MapToDto).ToList();
            return (true, "Lay danh sach thu moi thanh cong", dtos);
        }

        public (bool success, string message, int maThuMoi) Tao(TaoThuMoiDto dto, int maNguoiPhatHanh)
        {
            // Validate
            if (string.IsNullOrWhiteSpace(dto.ViTriCongViec))
                return (false, "Vi tri cong viec khong duoc de trong", 0);

            if (dto.MucLuong <= 0)
                return (false, "Muc luong phai lon hon 0", 0);

            var thuMoi = new Models.ThuMoiLamViec
            {
                MaDon = dto.MaDon,
                MaNguoiPhatHanh = maNguoiPhatHanh,
                ViTriCongViec = dto.ViTriCongViec,
                MucLuong = dto.MucLuong,
                DonViTien = dto.DonViTien ?? "VND",
                NgayBatDauDuKien = dto.NgayBatDauDuKien,
                NgayHetHan = dto.NgayHetHan,
                TrangThai = "ChoXacNhan",
                GhiChu = dto.GhiChu,
                NgayTao = DateTime.Now,
                NgayCapNhat = DateTime.Now
            };

            var maThuMoi = _repo.Tao(thuMoi);
            return (true, "Gui thu moi thanh cong", maThuMoi);
        }

        public (bool success, string message) PhanHoi(int maThuMoi, PhanHoiThuMoiDto dto)
        {
            var thuMoi = _repo.LayTheoMa(maThuMoi);
            if (thuMoi == null)
                return (false, "Khong tim thay thu moi");

            if (thuMoi.TrangThai != "ChoXacNhan")
                return (false, "Thu moi da duoc phan hoi");

            var validTrangThai = new[] { "DaChapNhan", "DaTuChoi" };
            if (!validTrangThai.Contains(dto.TrangThai))
                return (false, "Trang thai khong hop le");

            thuMoi.TrangThai = dto.TrangThai;
            thuMoi.NgayPhanHoi = DateTime.Now;
            thuMoi.GhiChu = dto.GhiChu;
            thuMoi.NgayCapNhat = DateTime.Now;

            _repo.CapNhat(thuMoi);
            return (true, "Phan hoi thu moi thanh cong");
        }

        public (bool success, string message) Xoa(int maThuMoi)
        {
            var success = _repo.Xoa(maThuMoi);
            return success
                ? (true, "Xoa thu moi thanh cong")
                : (false, "Khong tim thay thu moi");
        }

        private ThuMoiLamViecDto MapToDto(Models.ThuMoiLamViec thuMoi)
        {
            return new ThuMoiLamViecDto
            {
                MaThuMoi = thuMoi.MaThuMoi,
                MaDon = thuMoi.MaDon,
                MaNguoiPhatHanh = thuMoi.MaNguoiPhatHanh,
                TenNguoiPhatHanh = thuMoi.MaNguoiPhatHanhNavigation?.HoTen,
                ViTriCongViec = thuMoi.ViTriCongViec,
                MucLuong = thuMoi.MucLuong,
                DonViTien = thuMoi.DonViTien,
                NgayBatDauDuKien = thuMoi.NgayBatDauDuKien,
                NgayHetHan = thuMoi.NgayHetHan,
                FileThuMoi = thuMoi.FileThuMoi,
                TrangThai = thuMoi.TrangThai,
                NgayPhanHoi = thuMoi.NgayPhanHoi,
                GhiChu = thuMoi.GhiChu,
                NgayTao = thuMoi.NgayTao,
                NgayCapNhat = thuMoi.NgayCapNhat,
                TenUngVien = thuMoi.MaDonNavigation?.MaUngVienNavigation?.HoTen,
                TenCongTy = thuMoi.MaDonNavigation?.MaTinNavigation?.MaCongTyNavigation?.TenCongTy
            };
        }
    }
}
