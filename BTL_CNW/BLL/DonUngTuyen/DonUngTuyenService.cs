using BTL_CNW.DTO.DonUngTuyen;
using BTL_CNW.DAL.DonUngTuyen;

namespace BTL_CNW.BLL.DonUngTuyen
{
    public interface IDonUngTuyenService
    {
        (bool ok, string msg) NopDon(NopDonDto dto);
        List<DonUngTuyenDto> LayTheoUngVien(int maUngVien);
        List<DonUngTuyenDto> LayTheoTin(int maTin);
        DonUngTuyenDto? LayChiTiet(int maDon);
        bool CapNhatTrangThai(int maDon, string trangThai);
    }

    public class DonUngTuyenService : IDonUngTuyenService
    {
        private readonly IDonUngTuyenRepository _repo;
        public DonUngTuyenService(IDonUngTuyenRepository repo) => _repo = repo;

        public (bool ok, string msg) NopDon(NopDonDto dto)
        {
            if (_repo.DaNop(dto.MaTin, dto.MaUngVien))
                return (false, "Bạn đã nộp đơn cho tin tuyển dụng này rồi.");
            return _repo.NopDon(dto)
                ? (true, "Nộp đơn thành công!")
                : (false, "Nộp đơn thất bại.");
        }

        public List<DonUngTuyenDto> LayTheoUngVien(int maUngVien) => _repo.LayTheoUngVien(maUngVien);
        public List<DonUngTuyenDto> LayTheoTin(int maTin) => _repo.LayTheoTin(maTin);
        public DonUngTuyenDto? LayChiTiet(int maDon) => _repo.LayChiTiet(maDon);
        public bool CapNhatTrangThai(int maDon, string trangThai) => _repo.CapNhatTrangThai(maDon, trangThai);
    }
}
