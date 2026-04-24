using BTL_CNW.DTO.TinTuyenDung;

namespace BTL_CNW.DAL.TinTuyenDung
{
    public interface ITinTuyenDungRepository
    {
        bool TaoTin(TaoTinDto dto);
        List<TinTuyenDungDto> LayDanhSach(string? thanhPho, string? hinhThuc, string? kiemNghiem);
        List<TinTuyenDungDto> LayTheoCongTy(int maCongTy);
        List<TinTuyenDungDto> LayTheoNguoiDang(int maNguoiDang);
        TinTuyenDungDto? LayChiTiet(int maTin);
        bool CapNhat(int maTin, CapNhatTinDto dto);
        bool DoiTrangThai(int maTin, string trangThai, string? lyDo);
        bool Xoa(int maTin);
        bool TangLuotXem(int maTin);
        List<TinTuyenDungDto> LayTatCaTin();
    }
}
