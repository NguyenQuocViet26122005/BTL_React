using BTL_CNW.DTO.TinTuyenDung;
using BTL_CNW.DAL.TinTuyenDung;
using BTL_CNW.DAL.CongTy;
using BTL_CNW.Models;

namespace BTL_CNW.BLL.TinTuyenDung
{
    public interface ITinTuyenDungService
    {
        (bool success, string message) TaoTin(TaoTinDto dto);
        (bool success, string message, List<TinTuyenDungDto> data) LayDanhSach(string? thanhPho, string? hinhThuc, string? kinhNghiem);
        (bool success, string message, List<TinTuyenDungDto> data) LayTheoCongTy(int maCongTy);
        (bool success, string message, List<TinTuyenDungDto> data) LayTheoNguoiDang(int maNguoiDang);
        (bool success, string message, TinTuyenDungDto? data) LayChiTiet(int maTin);
        (bool success, string message) CapNhat(int maTin, CapNhatTinDto dto);
        (bool success, string message) DoiTrangThai(int maTin, string trangThai, string? lyDo);
        (bool success, string message) Xoa(int maTin);
        (bool success, string message, List<TinTuyenDungDto> data) LocTinTuyenDung(string? search, int[]? danhMuc, string? kinhNghiem, string? hinhThucLamViec, int[]? linhVuc, string[]? mucLuong, string? thanhPho);
        (bool success, string message, List<TinTuyenDungDto> data) LayTatCaTin();
    }

    public class TinTuyenDungService : ITinTuyenDungService
    {
        private readonly ITinTuyenDungRepository _repo;
        private readonly ICongTyRepository _congTyRepo;
        private readonly QuanLyViecLamContext _context;
        
        public TinTuyenDungService(ITinTuyenDungRepository repo, ICongTyRepository congTyRepo, QuanLyViecLamContext context)
        {
            _repo = repo;
            _congTyRepo = congTyRepo;
            _context = context;
        }

        public (bool success, string message) TaoTin(TaoTinDto dto)
        {
            try
            {
                // Validate người đăng
                if (dto.MaNguoiDang <= 0)
                    return (false, "Mã người đăng không hợp lệ");

                // Kiểm tra công ty của người dùng
                var danhSachCongTy = _congTyRepo.LayTheoChuSoHuu(dto.MaNguoiDang);
                if (danhSachCongTy == null || danhSachCongTy.Count == 0)
                    return (false, "Bạn chưa có công ty. Vui lòng tạo công ty trước khi đăng tin tuyển dụng");

                // Lấy công ty đã duyệt
                var congTyDaDuyet = danhSachCongTy.FirstOrDefault(c => c.TrangThai == "Đã duyệt");
                if (congTyDaDuyet == null)
                    return (false, "Bạn chưa có công ty nào được duyệt. Vui lòng chờ admin duyệt công ty");

                // Tự động gán MaCongTy từ công ty đã duyệt
                dto.MaCongTy = congTyDaDuyet.MaCongTy;

                // Validate input
                if (string.IsNullOrWhiteSpace(dto.TieuDe))
                    return (false, "Tiêu đề không được để trống");

                if (string.IsNullOrWhiteSpace(dto.MoTa))
                    return (false, "Mô tả công việc không được để trống");

                // Validate mức lương
                if (dto.MucLuongToiThieu.HasValue && dto.MucLuongToiThieu.Value <= 0)
                    return (false, "Mức lương tối thiểu phải lớn hơn 0");

                if (dto.MucLuongToiDa.HasValue && dto.MucLuongToiDa.Value <= 0)
                    return (false, "Mức lương tối đa phải lớn hơn 0");

                if (dto.MucLuongToiThieu.HasValue && dto.MucLuongToiDa.HasValue && 
                    dto.MucLuongToiThieu.Value > dto.MucLuongToiDa.Value)
                    return (false, "Mức lương tối thiểu không được lớn hơn mức lương tối đa");

                if (dto.SoLuongTuyen <= 0)
                    return (false, "Số lượng tuyển phải lớn hơn 0");

                var result = _repo.TaoTin(dto);
                return result 
                    ? (true, "Đăng tin tuyển dụng thành công, đang chờ duyệt")
                    : (false, "Không thể đăng tin, vui lòng thử lại");
            }
            catch (Exception ex)
            {
                return (false, $"Lỗi hệ thống: {ex.Message}");
            }
        }

        public (bool success, string message, List<TinTuyenDungDto> data) LayDanhSach(string? thanhPho, string? hinhThuc, string? kinhNghiem)
        {
            try
            {
                var danhSach = _repo.LayDanhSach(thanhPho, hinhThuc, kinhNghiem);
                return (true, "Lấy danh sách tin tuyển dụng thành công", danhSach);
            }
            catch (Exception ex)
            {
                return (false, $"Lỗi hệ thống: {ex.Message}", new List<TinTuyenDungDto>());
            }
        }

        public (bool success, string message, List<TinTuyenDungDto> data) LayTheoCongTy(int maCongTy)
        {
            try
            {
                if (maCongTy <= 0)
                    return (false, "Mã công ty không hợp lệ", new List<TinTuyenDungDto>());

                var danhSach = _repo.LayTheoCongTy(maCongTy, true);
                return (true, "Lấy danh sách tin theo công ty thành công", danhSach);
            }
            catch (Exception ex)
            {
                return (false, $"Lỗi hệ thống: {ex.Message}", new List<TinTuyenDungDto>());
            }
        }

        public (bool success, string message, List<TinTuyenDungDto> data) LayTheoNguoiDang(int maNguoiDang)
        {
            try
            {
                if (maNguoiDang <= 0)
                    return (false, "Mã người dùng không hợp lệ", new List<TinTuyenDungDto>());

                var danhSach = _repo.LayTheoNguoiDang(maNguoiDang);
                return (true, "Lấy danh sách tin của bạn thành công", danhSach);
            }
            catch (Exception ex)
            {
                return (false, $"Lỗi hệ thống: {ex.Message}", new List<TinTuyenDungDto>());
            }
        }

        public (bool success, string message, TinTuyenDungDto? data) LayChiTiet(int maTin)
        {
            try
            {
                if (maTin <= 0)
                    return (false, "Mã tin không hợp lệ", null);

                var tin = _repo.LayChiTiet(maTin, true);
                if (tin == null)
                    return (false, "Không tìm thấy tin tuyển dụng", null);

                // Tăng lượt xem
                _repo.TangLuotXem(maTin);
                return (true, "Lấy chi tiết tin thành công", tin);
            }
            catch (Exception ex)
            {
                return (false, $"Lỗi hệ thống: {ex.Message}", null);
            }
        }

        public (bool success, string message) CapNhat(int maTin, CapNhatTinDto dto)
        {
            try
            {
                if (maTin <= 0)
                    return (false, "Mã tin không hợp lệ");

                // Validate input
                if (string.IsNullOrWhiteSpace(dto.TieuDe))
                    return (false, "Tiêu đề không được để trống");

                if (string.IsNullOrWhiteSpace(dto.MoTa))
                    return (false, "Mô tả công việc không được để trống");

                // Validate mức lương
                if (dto.MucLuongToiThieu.HasValue && dto.MucLuongToiThieu.Value <= 0)
                    return (false, "Mức lương tối thiểu phải lớn hơn 0");

                if (dto.MucLuongToiDa.HasValue && dto.MucLuongToiDa.Value <= 0)
                    return (false, "Mức lương tối đa phải lớn hơn 0");

                if (dto.MucLuongToiThieu.HasValue && dto.MucLuongToiDa.HasValue && 
                    dto.MucLuongToiThieu.Value > dto.MucLuongToiDa.Value)
                    return (false, "Mức lương tối thiểu không được lớn hơn mức lương tối đa");

                if (dto.SoLuongTuyen <= 0)
                    return (false, "Số lượng tuyển phải lớn hơn 0");

                // Check if job post exists
                var existingTin = _repo.LayChiTiet(maTin);
                if (existingTin == null)
                    return (false, "Không tìm thấy tin cần cập nhật");

                var result = _repo.CapNhat(maTin, dto);
                return result 
                    ? (true, "Cập nhật tin tuyển dụng thành công")
                    : (false, "Không thể cập nhật, vui lòng thử lại");
            }
            catch (Exception ex)
            {
                return (false, $"Lỗi hệ thống: {ex.Message}");
            }
        }

        public (bool success, string message) DoiTrangThai(int maTin, string trangThai, string? lyDo)
        {
            try
            {
                if (maTin <= 0)
                    return (false, "Mã tin không hợp lệ");

                if (string.IsNullOrWhiteSpace(trangThai))
                    return (false, "Trạng thái không được để trống");

                var validStates = new[] { "ChoXetDuyet", "DaDuyet", "TuChoi", "HetHan", "DaDong" };
                if (!validStates.Contains(trangThai))
                    return (false, "Trạng thái không hợp lệ");

                // Check if job post exists
                var existingTin = _repo.LayChiTiet(maTin);
                if (existingTin == null)
                    return (false, "Không tìm thấy tin cần cập nhật");

                if (existingTin.TrangThai == trangThai)
                    return (false, $"Tin đã ở trạng thái '{trangThai}' rồi");

                var currentStatus = existingTin.TrangThai;

                // Validate state transitions (Admin only)
                var validTransitions = new Dictionary<string, string[]>
                {
                    { "ChoXetDuyet", new[] { "DaDuyet", "TuChoi" } },
                    { "DaDuyet", new[] { "HetHan", "DaDong" } },
                    { "TuChoi", new string[] { } }, // Không thể chuyển sang trạng thái khác
                    { "HetHan", new[] { "DaDong" } },
                    { "DaDong", new string[] { } } // Không thể chuyển sang trạng thái khác
                };

                if (validTransitions.ContainsKey(currentStatus))
                {
                    if (!validTransitions[currentStatus].Contains(trangThai))
                    {
                        return (false, $"Không thể chuyển từ trạng thái '{currentStatus}' sang '{trangThai}'");
                    }
                }

                // Kiểm tra lý do khi từ chối
                if (trangThai == "TuChoi" && string.IsNullOrWhiteSpace(lyDo))
                {
                    return (false, "Vui lòng nhập lý do từ chối");
                }

                var result = _repo.DoiTrangThai(maTin, trangThai, lyDo);
                return result 
                    ? (true, $"Đã cập nhật trạng thái thành '{trangThai}'")
                    : (false, "Không thể cập nhật trạng thái, vui lòng thử lại");
            }
            catch (Exception ex)
            {
                return (false, $"Lỗi hệ thống: {ex.Message}");
            }
        }

        public (bool success, string message) Xoa(int maTin)
        {
            try
            {
                if (maTin <= 0)
                    return (false, "Mã tin không hợp lệ");

                // Check if job post exists
                var existingTin = _repo.LayChiTiet(maTin);
                if (existingTin == null)
                    return (false, "Không tìm thấy tin cần xóa");

                // Kiểm tra tin có đơn ứng tuyển không
                var hasDonUngTuyen = _context.DonUngTuyens.Any(d => d.MaTin == maTin);
                if (hasDonUngTuyen)
                {
                    return (false, "Không thể xóa tin tuyển dụng đã có đơn ứng tuyển");
                }

                var result = _repo.Xoa(maTin);
                return result 
                    ? (true, "Xóa tin tuyển dụng thành công")
                    : (false, "Không thể xóa tin tuyển dụng");
            }
            catch (Exception ex)
            {
                return (false, $"Lỗi hệ thống: {ex.Message}");
            }
        }

        public (bool success, string message, List<TinTuyenDungDto> data) LocTinTuyenDung(
            string? search,
            int[]? danhMuc,
            string? kinhNghiem,
            string? hinhThucLamViec,
            int[]? linhVuc,
            string[]? mucLuong,
            string? thanhPho)
        {
            try
            {
                var allJobs = _repo.LayDanhSach(null, null, null);
                
                // Filter by search text
                if (!string.IsNullOrWhiteSpace(search))
                {
                    allJobs = allJobs.Where(j => 
                        j.TieuDe.Contains(search, StringComparison.OrdinalIgnoreCase) ||
                        (j.TenCongTy != null && j.TenCongTy.Contains(search, StringComparison.OrdinalIgnoreCase)) ||
                        (j.ThanhPho != null && j.ThanhPho.Contains(search, StringComparison.OrdinalIgnoreCase))
                    ).ToList();
                }

                // Filter by category
                if (danhMuc != null && danhMuc.Length > 0)
                {
                    allJobs = allJobs.Where(j => j.MaDanhMuc.HasValue && danhMuc.Contains(j.MaDanhMuc.Value)).ToList();
                }

                // Filter by experience
                if (!string.IsNullOrWhiteSpace(kinhNghiem) && kinhNghiem != "all")
                {
                    allJobs = allJobs.Where(j =>
                        string.Equals(NormalizeFilterValue(j.KinhNghiem), NormalizeFilterValue(kinhNghiem), StringComparison.OrdinalIgnoreCase)
                    ).ToList();
                }

                // Filter by work type
                if (!string.IsNullOrWhiteSpace(hinhThucLamViec) && hinhThucLamViec != "all")
                {
                    allJobs = allJobs.Where(j =>
                        string.Equals(NormalizeFilterValue(j.HinhThucLamViec), NormalizeFilterValue(hinhThucLamViec), StringComparison.OrdinalIgnoreCase)
                    ).ToList();
                }

                // Filter by linh vuc (company industry)
                if (linhVuc != null && linhVuc.Length > 0)
                {
                    allJobs = allJobs.Where(j => j.MaLinhVuc.HasValue && linhVuc.Contains(j.MaLinhVuc.Value)).ToList();
                }

                // Filter by city
                if (!string.IsNullOrWhiteSpace(thanhPho))
                {
                    allJobs = allJobs.Where(j => 
                        j.ThanhPho != null && j.ThanhPho.Contains(thanhPho, StringComparison.OrdinalIgnoreCase)
                    ).ToList();
                }

                if (mucLuong != null && mucLuong.Length > 0)
                {
                    var salaryRanges = mucLuong
                        .Select(MapSalaryRange)
                        .Where(r => r.HasValue)
                        .Select(r => r!.Value)
                        .ToList();

                    if (salaryRanges.Count > 0)
                    {
                        allJobs = allJobs.Where(j => salaryRanges.Any(range => SalaryMatchesRange(j, range.Min, range.Max))).ToList();
                    }
                }

                return (true, $"Tìm thấy {allJobs.Count} việc làm", allJobs);
            }
            catch (Exception ex)
            {
                return (false, $"Lỗi hệ thống: {ex.Message}", new List<TinTuyenDungDto>());
            }
        }

        private static string NormalizeFilterValue(string? value)
        {
            if (string.IsNullOrWhiteSpace(value))
                return string.Empty;

            return value
                .Trim()
                .Replace(" ", string.Empty)
                .Replace("-", string.Empty)
                .ToLowerInvariant();
        }

        private static (decimal? Min, decimal? Max)? MapSalaryRange(string? range)
        {
            return range switch
            {
                "under10" => (null, 10000000m),
                "10-15" => (10000000m, 15000000m),
                "15-20" => (15000000m, 20000000m),
                "20-30" => (20000000m, 30000000m),
                "over30" => (30000000m, null),
                _ => null
            };
        }

        private static bool SalaryMatchesRange(TinTuyenDungDto job, decimal? rangeMin, decimal? rangeMax)
        {
            var jobMin = job.MucLuongToiThieu;
            var jobMax = job.MucLuongToiDa;

            if (!jobMin.HasValue && !jobMax.HasValue)
                return false;

            if (!jobMin.HasValue)
                jobMin = jobMax;

            if (!jobMax.HasValue)
                jobMax = jobMin;

            if (!rangeMin.HasValue && rangeMax.HasValue)
                return jobMin.HasValue && jobMin.Value <= rangeMax.Value;

            if (rangeMin.HasValue && !rangeMax.HasValue)
                return jobMax.HasValue && jobMax.Value >= rangeMin.Value;

            if (rangeMin.HasValue && rangeMax.HasValue)
                return jobMin.HasValue && jobMax.HasValue && jobMin.Value <= rangeMax.Value && jobMax.Value >= rangeMin.Value;

            return true;
        }

        public (bool success, string message, List<TinTuyenDungDto> data) LayTatCaTin()
        {
            try
            {
                var danhSach = _repo.LayTatCaTin();
                return (true, "Lay danh sach tat ca tin tuyen dung thanh cong", danhSach);
            }
            catch (Exception ex)
            {
                return (false, $"Loi he thong: {ex.Message}", new List<TinTuyenDungDto>());
            }
        }
    }
}