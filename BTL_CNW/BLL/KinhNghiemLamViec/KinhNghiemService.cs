using BTL_CNW.DAL.KinhNghiemLamViec;
using BTL_CNW.DTO.KinhNghiemLamViec;
using BTL_CNW.Models;

namespace BTL_CNW.BLL.KinhNghiemLamViec
{
    public interface IKinhNghiemService
    {
        (bool success, string message, List<KinhNghiemDto>? data) LayTheoHoSo(int maHoSo);
        (bool success, string message, KinhNghiemDto? data) LayTheoMa(int maKinhNghiem);
        (bool success, string message, int maKinhNghiem) Them(TaoKinhNghiemDto dto);
        (bool success, string message) CapNhat(int maKinhNghiem, TaoKinhNghiemDto dto);
        (bool success, string message) Xoa(int maKinhNghiem);
    }

    public class KinhNghiemService : IKinhNghiemService
    {
        private readonly IKinhNghiemRepository _repository;
        private readonly QuanLyViecLamContext _context;

        public KinhNghiemService(IKinhNghiemRepository repository, QuanLyViecLamContext context)
        {
            _repository = repository;
            _context = context;
        }

        public (bool success, string message, List<KinhNghiemDto>? data) LayTheoHoSo(int maHoSo)
        {
            var hoSo = _context.HoSoUngViens.Find(maHoSo);
            if (hoSo == null)
                return (false, "Không tìm thấy hồ sơ", null);

            var data = _repository.LayTheoHoSo(maHoSo);
            return (true, "Lấy danh sách kinh nghiệm thành công", data);
        }

        public (bool success, string message, KinhNghiemDto? data) LayTheoMa(int maKinhNghiem)
        {
            var data = _repository.LayTheoMa(maKinhNghiem);
            if (data == null)
                return (false, "Không tìm thấy kinh nghiệm", null);

            return (true, "Lấy thông tin kinh nghiệm thành công", data);
        }

        public (bool success, string message, int maKinhNghiem) Them(TaoKinhNghiemDto dto)
        {
            // Validate hồ sơ tồn tại
            var hoSo = _context.HoSoUngViens.Find(dto.MaHoSo);
            if (hoSo == null)
                return (false, "Không tìm thấy hồ sơ", 0);

            // Validate dữ liệu
            if (string.IsNullOrWhiteSpace(dto.TenCongTy))
                return (false, "Tên công ty không được để trống", 0);

            if (string.IsNullOrWhiteSpace(dto.ViTri))
                return (false, "Vị trí không được để trống", 0);

            if (dto.NgayBatDau.HasValue && dto.NgayKetThuc.HasValue && dto.NgayBatDau > dto.NgayKetThuc)
                return (false, "Ngày bắt đầu không được sau ngày kết thúc", 0);

            var maKinhNghiem = _repository.Them(dto);
            return (true, "Thêm kinh nghiệm thành công", maKinhNghiem);
        }

        public (bool success, string message) CapNhat(int maKinhNghiem, TaoKinhNghiemDto dto)
        {
            // Validate kinh nghiệm tồn tại
            var kinhNghiem = _repository.LayTheoMa(maKinhNghiem);
            if (kinhNghiem == null)
                return (false, "Không tìm thấy kinh nghiệm");

            // Validate dữ liệu
            if (string.IsNullOrWhiteSpace(dto.TenCongTy))
                return (false, "Tên công ty không được để trống");

            if (string.IsNullOrWhiteSpace(dto.ViTri))
                return (false, "Vị trí không được để trống");

            if (dto.NgayBatDau.HasValue && dto.NgayKetThuc.HasValue && dto.NgayBatDau > dto.NgayKetThuc)
                return (false, "Ngày bắt đầu không được sau ngày kết thúc");

            var success = _repository.CapNhat(maKinhNghiem, dto);
            return success
                ? (true, "Cập nhật kinh nghiệm thành công")
                : (false, "Cập nhật kinh nghiệm thất bại");
        }

        public (bool success, string message) Xoa(int maKinhNghiem)
        {
            var kinhNghiem = _repository.LayTheoMa(maKinhNghiem);
            if (kinhNghiem == null)
                return (false, "Không tìm thấy kinh nghiệm");

            var success = _repository.Xoa(maKinhNghiem);
            return success
                ? (true, "Xóa kinh nghiệm thành công")
                : (false, "Xóa kinh nghiệm thất bại");
        }
    }
}
