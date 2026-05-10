using BTL_CNW.DTO.KinhNghiemLamViec;

namespace BTL_CNW.DAL.KinhNghiemLamViec
{
    public interface IKinhNghiemRepository
    {
        List<KinhNghiemDto> LayTheoHoSo(int maHoSo);
        KinhNghiemDto? LayTheoMa(int maKinhNghiem);
        int Them(TaoKinhNghiemDto dto);
        bool CapNhat(int maKinhNghiem, TaoKinhNghiemDto dto);
        bool Xoa(int maKinhNghiem);
    }
}
