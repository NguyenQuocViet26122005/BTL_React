using BTL_CNW.DAL.ThuMoiLamViec;
using BTL_CNW.DTO.ThuMoiLamViec;
using BTL_CNW.Models;
using Microsoft.EntityFrameworkCore;
using System.Linq;

namespace BTL_CNW.BLL.ThuMoiLamViec
{
    public interface IThuMoiLamViecService
    {
        (bool success, string message, ThuMoiLamViecDto? data) LayTheoMa(int maThuMoi);
        (bool success, string message, List<ThuMoiLamViecDto>? data) LayTheoUngVien(int maUngVien);
        (bool success, string message, List<ThuMoiLamViecDto>? data) LayTheoCongTy(int maCongTy);
        (bool success, string message, List<ThuMoiLamViecDto>? data) LayTheoNguoiPhatHanh(int maNguoiPhatHanh);
        (bool success, string message, int maThuMoi) Tao(TaoThuMoiDto dto, int maNguoiPhatHanh);
        (bool success, string message) PhanHoi(int maThuMoi, PhanHoiThuMoiDto dto);
        (bool success, string message) Xoa(int maThuMoi);
    }

    public class ThuMoiLamViecService : IThuMoiLamViecService
    {
        private readonly IThuMoiLamViecRepository _repo;
        private readonly QuanLyViecLamContext _context;

        public ThuMoiLamViecService(IThuMoiLamViecRepository repo, QuanLyViecLamContext context)
        {
            _repo = repo;
            _context = context;
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

        public (bool success, string message, List<ThuMoiLamViecDto>? data) LayTheoNguoiPhatHanh(int maNguoiPhatHanh)
        {
            var thuMois = _context.ThuMoiLamViecs
                .Include(t => t.MaNguoiPhatHanhNavigation)
                .Include(t => t.MaDonNavigation)
                    .ThenInclude(d => d.MaUngVienNavigation)
                .Include(t => t.MaDonNavigation)
                    .ThenInclude(d => d.MaTinNavigation)
                        .ThenInclude(tin => tin.MaCongTyNavigation)
                .Where(t => t.MaNguoiPhatHanh == maNguoiPhatHanh)
                .OrderByDescending(t => t.NgayTao)
                .ToList();
            
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

            if (dto.MaDon <= 0)
                return (false, "Ma don ung tuyen khong hop le", 0);

            // Kiểm tra đơn ứng tuyển có tồn tại không
            var don = _context.DonUngTuyens
                .Include(d => d.LichPhongVans)
                .FirstOrDefault(d => d.MaDon == dto.MaDon);
            
            if (don == null)
                return (false, "Don ung tuyen khong ton tai", 0);

            // Kiểm tra trạng thái đơn ứng tuyển
            if (don.TrangThai != "VaoDanhSach")
                return (false, "Chi co the gui thu moi cho don ung tuyen co trang thai 'Vao danh sach'", 0);

            // Kiểm tra đã có lịch phỏng vấn hoàn thành chưa
            var lichPhongVan = don.LichPhongVans.FirstOrDefault(l => l.TrangThai == "HoanThanh");
            if (lichPhongVan == null)
                return (false, "Ung vien chua hoan thanh phong van", 0);

            // Kiểm tra kết quả phỏng vấn
            var ketQua = _context.KetQuaPhongVans
                .FirstOrDefault(k => k.MaLich == lichPhongVan.MaLich);
            
            if (ketQua == null)
                return (false, "Chua co ket qua phong van", 0);

            if (ketQua.KetQua != "Dat")
                return (false, "Chi co the gui thu moi cho ung vien dat ket qua phong van", 0);

            // Kiểm tra đã gửi thư mời chưa
            var existingOffer = _context.ThuMoiLamViecs.FirstOrDefault(t => t.MaDon == dto.MaDon);
            if (existingOffer != null)
                return (false, "Da gui thu moi cho ung vien nay roi", 0);

            var thuMoi = new Models.ThuMoiLamViec
            {
                MaDon = dto.MaDon,
                MaNguoiPhatHanh = maNguoiPhatHanh,
                ViTriCongViec = dto.ViTriCongViec,
                MucLuong = dto.MucLuong,
                DonViTien = dto.DonViTien ?? "VND",
                NgayBatDauDuKien = dto.NgayBatDauDuKien,
                NgayHetHan = dto.NgayHetHan,
                TrangThai = "ChoPhanHoi",
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

            if (thuMoi.TrangThai != "ChoPhanHoi")
                return (false, "Thu moi da duoc phan hoi");

            var validTrangThai = new[] { "DaDongY", "DaTuChoi" };
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
