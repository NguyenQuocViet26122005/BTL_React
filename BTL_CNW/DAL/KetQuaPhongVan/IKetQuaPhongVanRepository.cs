using BTL_CNW.Models;

namespace BTL_CNW.DAL.KetQuaPhongVan
{
    public interface IKetQuaPhongVanRepository
    {
        Models.KetQuaPhongVan? LayTheoMa(int maKetQua);
        Models.KetQuaPhongVan? LayTheoLich(int maLich);
        List<Models.KetQuaPhongVan> LayTheoUngVien(int maUngVien);
        int Tao(Models.KetQuaPhongVan ketQua);
        bool CapNhat(Models.KetQuaPhongVan ketQua);
        bool Xoa(int maKetQua);
    }
}
