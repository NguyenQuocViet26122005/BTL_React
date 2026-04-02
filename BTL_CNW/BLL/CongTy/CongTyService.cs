using BTL_CNW.DTO.CongTy;
using BTL_CNW.DAL.CongTy;

namespace BTL_CNW.BLL.CongTy
{
    public interface ICongTyService
    {
        (bool success, string message) TaoCongTy(TaoCongTyDto dto);
        (bool success, string message, CongTyDto? data) LayTheoId(int maCongTy);
        (bool success, string message, CongTyDto? data) LayTheoChuSoHuu(int maNguoiDung);
        (bool success, string message, List<CongTyDto> data) LayTatCa();
        (bool success, string message) CapNhat(int maCongTy, CapNhatCongTyDto dto);
        (bool success, string message) DuyetCongTy(int maCongTy);
        (bool success, string message) Xoa(int maCongTy);
    }

    public class CongTyService : ICongTyService
    {
        private readonly ICongTyRepository _repo;
        public CongTyService(ICongTyRepository repo) => _repo = repo;

        public (bool success, string message) TaoCongTy(TaoCongTyDto dto)
        {
            try
            {
                // Validate input
                if (string.IsNullOrWhiteSpace(dto.TenCongTy))
                    return (false, "Tên công ty không được để trống");

                if (dto.MaChuSoHuu <= 0)
                    return (false, "Mã chủ sở hữu không hợp lệ");

                // Check if user already has a company
                var existingCompany = _repo.LayTheoChuSoHuu(dto.MaChuSoHuu);
                if (existingCompany != null)
                    return (false, "Bạn đã có công ty rồi, không thể tạo thêm");

                var result = _repo.TaoCongTy(dto);
                return result 
                    ? (true, "Tạo công ty thành công, đang chờ duyệt")
                    : (false, "Không thể tạo công ty, vui lòng thử lại");
            }
            catch (Exception ex)
            {
                return (false, $"Lỗi hệ thống: {ex.Message}");
            }
        }

        public (bool success, string message, CongTyDto? data) LayTheoId(int maCongTy)
        {
            try
            {
                if (maCongTy <= 0)
                    return (false, "Mã công ty không hợp lệ", null);

                var congTy = _repo.LayTheoId(maCongTy);
                return congTy != null 
                    ? (true, "Lấy thông tin công ty thành công", congTy)
                    : (false, "Không tìm thấy công ty", null);
            }
            catch (Exception ex)
            {
                return (false, $"Lỗi hệ thống: {ex.Message}", null);
            }
        }

        public (bool success, string message, CongTyDto? data) LayTheoChuSoHuu(int maNguoiDung)
        {
            try
            {
                if (maNguoiDung <= 0)
                    return (false, "Mã người dùng không hợp lệ", null);

                var congTy = _repo.LayTheoChuSoHuu(maNguoiDung);
                return congTy != null 
                    ? (true, "Lấy thông tin công ty thành công", congTy)
                    : (false, "Bạn chưa có công ty nào", null);
            }
            catch (Exception ex)
            {
                return (false, $"Lỗi hệ thống: {ex.Message}", null);
            }
        }

        public (bool success, string message, List<CongTyDto> data) LayTatCa()
        {
            try
            {
                var danhSach = _repo.LayTatCa();
                return (true, "Lấy danh sách công ty thành công", danhSach);
            }
            catch (Exception ex)
            {
                return (false, $"Lỗi hệ thống: {ex.Message}", new List<CongTyDto>());
            }
        }

        public (bool success, string message) CapNhat(int maCongTy, CapNhatCongTyDto dto)
        {
            try
            {
                if (maCongTy <= 0)
                    return (false, "Mã công ty không hợp lệ");

                // Validate input
                if (string.IsNullOrWhiteSpace(dto.TenCongTy))
                    return (false, "Tên công ty không được để trống");

                // Check if company exists
                var existingCompany = _repo.LayTheoId(maCongTy);
                if (existingCompany == null)
                    return (false, "Không tìm thấy công ty cần cập nhật");

                var result = _repo.CapNhat(maCongTy, dto);
                return result 
                    ? (true, "Cập nhật thông tin công ty thành công")
                    : (false, "Không thể cập nhật, vui lòng thử lại");
            }
            catch (Exception ex)
            {
                return (false, $"Lỗi hệ thống: {ex.Message}");
            }
        }

        public (bool success, string message) DuyetCongTy(int maCongTy)
        {
            try
            {
                if (maCongTy <= 0)
                    return (false, "Mã công ty không hợp lệ");

                // Check if company exists
                var existingCompany = _repo.LayTheoId(maCongTy);
                if (existingCompany == null)
                    return (false, "Không tìm thấy công ty cần duyệt");

                if (existingCompany.TrangThai == "Đã duyệt")
                    return (false, "Công ty này đã được duyệt rồi");

                var result = _repo.DuyetCongTy(maCongTy);
                return result 
                    ? (true, "Duyệt công ty thành công")
                    : (false, "Không thể duyệt công ty, vui lòng thử lại");
            }
            catch (Exception ex)
            {
                return (false, $"Lỗi hệ thống: {ex.Message}");
            }
        }

        public (bool success, string message) Xoa(int maCongTy)
        {
            try
            {
                if (maCongTy <= 0)
                    return (false, "Mã công ty không hợp lệ");

                // Check if company exists
                var existingCompany = _repo.LayTheoId(maCongTy);
                if (existingCompany == null)
                    return (false, "Không tìm thấy công ty cần xóa");

                var result = _repo.Xoa(maCongTy);
                return result 
                    ? (true, "Xóa công ty thành công")
                    : (false, "Không thể xóa công ty, có thể công ty đang có tin tuyển dụng");
            }
            catch (Exception ex)
            {
                return (false, $"Lỗi hệ thống: {ex.Message}");
            }
        }
    }
}
