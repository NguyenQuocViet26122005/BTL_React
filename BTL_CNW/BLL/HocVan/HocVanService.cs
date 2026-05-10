using BTL_CNW.DAL.HocVan;
using BTL_CNW.DTO.HocVan;
using BTL_CNW.Models;

namespace BTL_CNW.BLL.HocVan
{
    public interface IHocVanService
    {
        (bool success, string message, List<HocVanDto>? data) LayTheoHoSo(int maHoSo);
        (bool success, string message, HocVanDto? data) LayTheoMa(int maHocVan);
        (bool success, string message, int maHocVan) Them(TaoHocVanDto dto);
        (bool success, string message) CapNhat(int maHocVan, TaoHocVanDto dto);
        (bool success, string message) Xoa(int maHocVan);
    }

    public class HocVanService : IHocVanService
    {
        private readonly IHocVanRepository _repository;
        private readonly QuanLyViecLamContext _context;

        public HocVanService(IHocVanRepository repository, QuanLyViecLamContext context)
        {
            _repository = repository;
            _context = context;
        }

        public (bool success, string message, List<HocVanDto>? data) LayTheoHoSo(int maHoSo)
        {
            var hoSo = _context.HoSoUngViens.Find(maHoSo);
            if (hoSo == null)
                return (false, "Không tìm thấy hồ sơ", null);

            var data = _repository.LayTheoHoSo(maHoSo);
            return (true, "Lấy danh sách học vấn thành công", data);
        }

        public (bool success, string message, HocVanDto? data) LayTheoMa(int maHocVan)
        {
            var data = _repository.LayTheoMa(maHocVan);
            if (data == null)
                return (false, "Không tìm thấy học vấn", null);

            return (true, "Lấy thông tin học vấn thành công", data);
        }

        public (bool success, string message, int maHocVan) Them(TaoHocVanDto dto)
        {
            // Validate hồ sơ tồn tại
            var hoSo = _context.HoSoUngViens.Find(dto.MaHoSo);
            if (hoSo == null)
                return (false, "Không tìm thấy hồ sơ", 0);

            // Validate dữ liệu
            if (string.IsNullOrWhiteSpace(dto.TruongHoc))
                return (false, "Tên trường học không được để trống", 0);

            if (dto.NgayBatDau.HasValue && dto.NgayKetThuc.HasValue && dto.NgayBatDau > dto.NgayKetThuc)
                return (false, "Ngày bắt đầu không được sau ngày kết thúc", 0);

            var maHocVan = _repository.Them(dto);
            return (true, "Thêm học vấn thành công", maHocVan);
        }

        public (bool success, string message) CapNhat(int maHocVan, TaoHocVanDto dto)
        {
            // Validate học vấn tồn tại
            var hocVan = _repository.LayTheoMa(maHocVan);
            if (hocVan == null)
                return (false, "Không tìm thấy học vấn");

            // Validate dữ liệu
            if (string.IsNullOrWhiteSpace(dto.TruongHoc))
                return (false, "Tên trường học không được để trống");

            if (dto.NgayBatDau.HasValue && dto.NgayKetThuc.HasValue && dto.NgayBatDau > dto.NgayKetThuc)
                return (false, "Ngày bắt đầu không được sau ngày kết thúc");

            var success = _repository.CapNhat(maHocVan, dto);
            return success
                ? (true, "Cập nhật học vấn thành công")
                : (false, "Cập nhật học vấn thất bại");
        }

        public (bool success, string message) Xoa(int maHocVan)
        {
            var hocVan = _repository.LayTheoMa(maHocVan);
            if (hocVan == null)
                return (false, "Không tìm thấy học vấn");

            var success = _repository.Xoa(maHocVan);
            return success
                ? (true, "Xóa học vấn thành công")
                : (false, "Xóa học vấn thất bại");
        }
    }
}
