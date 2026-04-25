using BTL_CNW.DTO.HoSoUngVien;
using BTL_CNW.DAL.HoSoUngVien;

namespace BTL_CNW.BLL.HoSoUngVien
{
    public interface IHoSoUngVienService
    {
        (bool success, string message) TaoHoSo(TaoHoSoDto dto);
        (bool success, string message, HoSoDto? data) LayTheoNguoiDung(int maNguoiDung);
        (bool success, string message, HoSoDto? data) LayTheoId(int maHoSo);
        (bool success, string message) CapNhat(int maHoSo, TaoHoSoDto dto);
        (bool success, string message, List<HoSoDto> data) TimKiem(string? tuKhoa, string? thanhPho, string? tinhTrang, int? mucLuongTu, int? mucLuongDen);
        (bool success, string message, List<HoSoDto> data) LayDanhSach(int skip, int take);
    }

    public class HoSoUngVienService : IHoSoUngVienService
    {
        private readonly IHoSoUngVienRepository _repo;
        public HoSoUngVienService(IHoSoUngVienRepository repo) => _repo = repo;

        public (bool success, string message) TaoHoSo(TaoHoSoDto dto)
        {
            try
            {
                // Validate input
                if (string.IsNullOrWhiteSpace(dto.HoTen))
                    return (false, "Họ tên không được để trống");

                if (string.IsNullOrWhiteSpace(dto.Email))
                    return (false, "Email không được để trống");

                if (string.IsNullOrWhiteSpace(dto.SoDienThoai))
                    return (false, "Số điện thoại không được để trống");

                // Check if user already has a profile
                var existingProfile = _repo.LayTheoNguoiDung(dto.MaNguoiDung);
                if (existingProfile != null)
                    return (false, "Bạn đã có hồ sơ rồi, vui lòng cập nhật thay vì tạo mới");

                var result = _repo.TaoHoSo(dto);
                return result 
                    ? (true, "Tạo hồ sơ ứng viên thành công")
                    : (false, "Không thể tạo hồ sơ, vui lòng thử lại");
            }
            catch (Exception ex)
            {
                return (false, $"Lỗi hệ thống: {ex.Message}");
            }
        }

        public (bool success, string message, HoSoDto? data) LayTheoNguoiDung(int maNguoiDung)
        {
            try
            {
                if (maNguoiDung <= 0)
                    return (false, "Mã người dùng không hợp lệ", null);

                var hoSo = _repo.LayTheoNguoiDung(maNguoiDung);
                return hoSo != null 
                    ? (true, "Lấy hồ sơ thành công", hoSo)
                    : (false, "Bạn chưa có hồ sơ, vui lòng tạo hồ sơ trước", null);
            }
            catch (Exception ex)
            {
                return (false, $"Lỗi hệ thống: {ex.Message}", null);
            }
        }

        public (bool success, string message, HoSoDto? data) LayTheoId(int maHoSo)
        {
            try
            {
                if (maHoSo <= 0)
                    return (false, "Mã hồ sơ không hợp lệ", null);

                var hoSo = _repo.LayTheoId(maHoSo);
                return hoSo != null 
                    ? (true, "Lấy hồ sơ thành công", hoSo)
                    : (false, "Không tìm thấy hồ sơ", null);
            }
            catch (Exception ex)
            {
                return (false, $"Lỗi hệ thống: {ex.Message}", null);
            }
        }

        public (bool success, string message) CapNhat(int maHoSo, TaoHoSoDto dto)
        {
            try
            {
                if (maHoSo <= 0)
                    return (false, "Mã hồ sơ không hợp lệ");

                // Check if profile exists
                var existingProfile = _repo.LayTheoId(maHoSo);
                if (existingProfile == null)
                    return (false, "Không tìm thấy hồ sơ cần cập nhật");

                var result = _repo.CapNhat(maHoSo, dto);
                return result 
                    ? (true, "Cập nhật hồ sơ thành công")
                    : (false, "Không thể cập nhật hồ sơ, vui lòng thử lại");
            }
            catch (Exception ex)
            {
                return (false, $"Lỗi hệ thống: {ex.Message}");
            }
        }

        public (bool success, string message, List<HoSoDto> data) TimKiem(string? tuKhoa, string? thanhPho, string? tinhTrang, int? mucLuongTu, int? mucLuongDen)
        {
            try
            {
                var danhSach = _repo.TimKiem(tuKhoa, thanhPho, tinhTrang, mucLuongTu, mucLuongDen);
                return (true, $"Tìm thấy {danhSach.Count} hồ sơ", danhSach);
            }
            catch (Exception ex)
            {
                return (false, $"Lỗi hệ thống: {ex.Message}", new List<HoSoDto>());
            }
        }

        public (bool success, string message, List<HoSoDto> data) LayDanhSach(int skip, int take)
        {
            try
            {
                if (skip < 0) skip = 0;
                if (take <= 0 || take > 100) take = 20;

                var danhSach = _repo.LayDanhSach(skip, take);
                return (true, $"Lấy danh sách thành công ({danhSach.Count} hồ sơ)", danhSach);
            }
            catch (Exception ex)
            {
                return (false, $"Lỗi hệ thống: {ex.Message}", new List<HoSoDto>());
            }
        }
    }
}
