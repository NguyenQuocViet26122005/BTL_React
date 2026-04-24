using BTL_CNW.DTO.ThongBao;

namespace BTL_CNW.DAL.ThongBao
{
    public interface IThongBaoRepository
    {
        List<ThongBaoDto> LayTheoNguoiDung(int maNguoiDung, int pageSize, int pageNumber);
        int DemChuaDoc(int maNguoiDung);
        bool DanhDauDaDoc(long maThongBao);
        bool DanhDauTatCaDaDoc(int maNguoiDung);
        bool TaoThongBao(int maNguoiDung, string loaiThongBao, string tieuDe, string? noiDung, string? loaiLienKet, int? maLienKet);
    }
}
