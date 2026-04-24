using BTL_CNW.Models;

namespace BTL_CNW.DAL.ThuMoiLamViec
{
    public interface IThuMoiLamViecRepository
    {
        Models.ThuMoiLamViec? LayTheoMa(int maThuMoi);
        List<Models.ThuMoiLamViec> LayTheoUngVien(int maUngVien);
        List<Models.ThuMoiLamViec> LayTheoCongTy(int maCongTy);
        int Tao(Models.ThuMoiLamViec thuMoi);
        bool CapNhat(Models.ThuMoiLamViec thuMoi);
        bool Xoa(int maThuMoi);
    }
}
