using BTL_CNW.DTO.DonUngTuyen;
using BTL_CNW.DAL.DonUngTuyen;
using BTL_CNW.Models;

namespace BTL_CNW.BLL.DonUngTuyen
{
    public interface IDonUngTuyenService
    {
        (bool ok, string msg) NopDon(NopDonDto dto);
        (List<DonUngTuyenDto> data, string? error) LayTheoUngVien(int maUngVien);
        (List<DonUngTuyenDto> data, string? error) LayTheoTin(int maTin);
        (List<DonUngTuyenDto> data, string? error) LayTheoCongTy(int maCongTy);
        (DonUngTuyenDto? data, string? error) LayChiTiet(int maDon);
        (bool ok, string msg) CapNhatTrangThai(int maDon, string trangThai);
    }

    public class DonUngTuyenService : IDonUngTuyenService
    {
        private readonly IDonUngTuyenRepository _repo;
        private readonly QuanLyViecLamContext _context;
        
        public DonUngTuyenService(IDonUngTuyenRepository repo, QuanLyViecLamContext context)
        {
            _repo = repo;
            _context = context;
        }

        public (bool ok, string msg) NopDon(NopDonDto dto)
        {
            try
            {
                // Validate input
                if (dto.MaTin <= 0)
                {
                    return (false, "Mã tin tuyển dụng không hợp lệ");
                }

                if (dto.MaUngVien <= 0)
                {
                    return (false, "Mã ứng viên không hợp lệ");
                }

                if (dto.MaFileCV <= 0)
                {
                    return (false, "Vui lòng chọn file CV");
                }

                // Kiểm tra tin tuyển dụng có tồn tại không
                var tin = _context.TinTuyenDungs.FirstOrDefault(t => t.MaTin == dto.MaTin);
                if (tin == null)
                {
                    return (false, "Tin tuyển dụng không tồn tại");
                }

                // Kiểm tra tin tuyển dụng đã được duyệt chưa
                if (tin.TrangThai != "DaDuyet")
                {
                    return (false, "Tin tuyển dụng chưa được duyệt. Không thể nộp đơn");
                }

                // Kiểm tra hạn nộp hồ sơ
                if (tin.HanNopHoSo.HasValue && tin.HanNopHoSo.Value < DateOnly.FromDateTime(DateTime.Now))
                {
                    return (false, "Tin tuyển dụng đã hết hạn nộp hồ sơ");
                }

                // Kiểm tra ứng viên có hồ sơ chưa
                var hoSo = _context.HoSoUngViens.FirstOrDefault(h => h.MaNguoiDung == dto.MaUngVien);
                if (hoSo == null)
                {
                    return (false, "Bạn chưa có hồ sơ. Vui lòng tạo hồ sơ trước khi nộp đơn");
                }

                // Kiểm tra file CV có tồn tại không
                var fileCV = _context.FileCvs.FirstOrDefault(f => f.MaFileCv == dto.MaFileCV && f.MaHoSo == hoSo.MaHoSo);
                if (fileCV == null)
                {
                    return (false, "File CV không hợp lệ hoặc không thuộc về bạn");
                }

                // Kiểm tra đã ứng tuyển chưa
                if (_repo.DaNop(dto.MaTin, dto.MaUngVien))
                {
                    return (false, "Bạn đã ứng tuyển vào tin tuyển dụng này rồi");
                }

                var result = _repo.NopDon(dto);
                return result 
                    ? (true, "Nộp đơn ứng tuyển thành công") 
                    : (false, "Nộp đơn thất bại. Vui lòng thử lại");
            }
            catch (Exception ex)
            {
                return (false, $"Lỗi hệ thống: {ex.Message}");
            }
        }

        public (List<DonUngTuyenDto> data, string? error) LayTheoUngVien(int maUngVien)
        {
            try
            {
                if (maUngVien <= 0)
                {
                    return (new List<DonUngTuyenDto>(), "Mã ứng viên không hợp lệ");
                }

                var data = _repo.LayTheoUngVien(maUngVien);
                return (data, null);
            }
            catch (Exception ex)
            {
                return (new List<DonUngTuyenDto>(), $"Lỗi hệ thống: {ex.Message}");
            }
        }

        public (List<DonUngTuyenDto> data, string? error) LayTheoTin(int maTin)
        {
            try
            {
                if (maTin <= 0)
                {
                    return (new List<DonUngTuyenDto>(), "Mã tin tuyển dụng không hợp lệ");
                }

                var data = _repo.LayTheoTin(maTin);
                return (data, null);
            }
            catch (Exception ex)
            {
                return (new List<DonUngTuyenDto>(), $"Lỗi hệ thống: {ex.Message}");
            }
        }

        public (List<DonUngTuyenDto> data, string? error) LayTheoCongTy(int maCongTy)
        {
            try
            {
                if (maCongTy <= 0)
                {
                    return (new List<DonUngTuyenDto>(), "Mã công ty không hợp lệ");
                }

                var data = _repo.LayTheoCongTy(maCongTy);
                return (data, null);
            }
            catch (Exception ex)
            {
                return (new List<DonUngTuyenDto>(), $"Lỗi hệ thống: {ex.Message}");
            }
        }

        public (DonUngTuyenDto? data, string? error) LayChiTiet(int maDon)
        {
            try
            {
                if (maDon <= 0)
                {
                    return (null, "Mã đơn ứng tuyển không hợp lệ");
                }

                var data = _repo.LayChiTiet(maDon);
                if (data == null)
                {
                    return (null, "Không tìm thấy đơn ứng tuyển");
                }

                return (data, null);
            }
            catch (Exception ex)
            {
                return (null, $"Lỗi hệ thống: {ex.Message}");
            }
        }

        public (bool ok, string msg) CapNhatTrangThai(int maDon, string trangThai)
        {
            try
            {
                if (maDon <= 0)
                {
                    return (false, "Mã đơn ứng tuyển không hợp lệ");
                }

                if (string.IsNullOrEmpty(trangThai))
                {
                    return (false, "Trạng thái không được để trống");
                }

                var validStatuses = new[] { "DaNop", "DangXem", "VaoDanhSach", "TuChoi", "RutDon" };
                if (!validStatuses.Contains(trangThai))
                {
                    return (false, "Trạng thái không hợp lệ");
                }

                var result = _repo.CapNhatTrangThai(maDon, trangThai);
                return result 
                    ? (true, "Cập nhật trạng thái thành công") 
                    : (false, "Cập nhật trạng thái thất bại");
            }
            catch (Exception ex)
            {
                return (false, $"Lỗi hệ thống: {ex.Message}");
            }
        }
    }
}
