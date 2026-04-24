using BTL_CNW.DAL.ThongBao;
using BTL_CNW.DTO.ThongBao;

namespace BTL_CNW.BLL.ThongBao
{
    public interface IThongBaoService
    {
        (bool success, string message, List<ThongBaoDto>? data) LayTheoNguoiDung(int maNguoiDung, int pageSize = 20, int pageNumber = 1);
        (bool success, string message, int count) DemChuaDoc(int maNguoiDung);
        (bool success, string message) DanhDauDaDoc(long maThongBao);
        (bool success, string message) DanhDauTatCaDaDoc(int maNguoiDung);
    }

    public class ThongBaoService : IThongBaoService
    {
        private readonly IThongBaoRepository _repo;

        public ThongBaoService(IThongBaoRepository repo)
        {
            _repo = repo;
        }

        public (bool success, string message, List<ThongBaoDto>? data) LayTheoNguoiDung(int maNguoiDung, int pageSize = 20, int pageNumber = 1)
        {
            try
            {
                if (maNguoiDung <= 0)
                    return (false, "Ma nguoi dung khong hop le", null);

                var data = _repo.LayTheoNguoiDung(maNguoiDung, pageSize, pageNumber);
                return (true, "Lay danh sach thong bao thanh cong", data);
            }
            catch (Exception ex)
            {
                return (false, $"Loi he thong: {ex.Message}", null);
            }
        }

        public (bool success, string message, int count) DemChuaDoc(int maNguoiDung)
        {
            try
            {
                if (maNguoiDung <= 0)
                    return (false, "Ma nguoi dung khong hop le", 0);

                var count = _repo.DemChuaDoc(maNguoiDung);
                return (true, "Dem thong bao chua doc thanh cong", count);
            }
            catch (Exception ex)
            {
                return (false, $"Loi he thong: {ex.Message}", 0);
            }
        }

        public (bool success, string message) DanhDauDaDoc(long maThongBao)
        {
            try
            {
                if (maThongBao <= 0)
                    return (false, "Ma thong bao khong hop le");

                var result = _repo.DanhDauDaDoc(maThongBao);
                return result
                    ? (true, "Danh dau da doc thanh cong")
                    : (false, "Khong the danh dau da doc");
            }
            catch (Exception ex)
            {
                return (false, $"Loi he thong: {ex.Message}");
            }
        }

        public (bool success, string message) DanhDauTatCaDaDoc(int maNguoiDung)
        {
            try
            {
                if (maNguoiDung <= 0)
                    return (false, "Ma nguoi dung khong hop le");

                var result = _repo.DanhDauTatCaDaDoc(maNguoiDung);
                return result
                    ? (true, "Danh dau tat ca da doc thanh cong")
                    : (false, "Khong the danh dau tat ca da doc");
            }
            catch (Exception ex)
            {
                return (false, $"Loi he thong: {ex.Message}");
            }
        }
    }
}
