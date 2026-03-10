using BTL_CNW.DTO.TinTuyenDung;
using BTL_CNW.DAL.TinTuyenDung;

namespace BTL_CNW.BLL.TinTuyenDung
{
    public interface ITinTuyenDungService
    {
        bool TaoTin(TaoTinDto dto);
        List<TinTuyenDungDto> LayDanhSach(string? thanhPho, string? hinhThuc, string? kinhNghiem);
        List<TinTuyenDungDto> LayTheoCongTy(int maCongTy);
        List<TinTuyenDungDto> LayTheoNguoiDang(int maNguoiDang);
        TinTuyenDungDto? LayChiTiet(int maTin);
        bool CapNhat(int maTin, CapNhatTinDto dto);
        bool DoiTrangThai(int maTin, string trangThai, string? lyDo);
        bool Xoa(int maTin);
    }

    public class TinTuyenDungService : ITinTuyenDungService
    {
        private readonly ITinTuyenDungRepository _repo;
        public TinTuyenDungService(ITinTuyenDungRepository repo) => _repo = repo;

        public bool TaoTin(TaoTinDto dto) => _repo.TaoTin(dto);

        public List<TinTuyenDungDto> LayDanhSach(string? thanhPho, string? hinhThuc, string? kinhNghiem)
            => _repo.LayDanhSach(thanhPho, hinhThuc, kinhNghiem);

        public List<TinTuyenDungDto> LayTheoCongTy(int maCongTy)
            => _repo.LayTheoCongTy(maCongTy);

        public List<TinTuyenDungDto> LayTheoNguoiDang(int maNguoiDang)
            => _repo.LayTheoNguoiDang(maNguoiDang);

        public TinTuyenDungDto? LayChiTiet(int maTin)
        {
            var tin = _repo.LayChiTiet(maTin);
            if (tin != null) _repo.TangLuotXem(maTin);
            return tin;
        }

        public bool CapNhat(int maTin, CapNhatTinDto dto) => _repo.CapNhat(maTin, dto);
        public bool DoiTrangThai(int maTin, string trangThai, string? lyDo) => _repo.DoiTrangThai(maTin, trangThai, lyDo);
        public bool Xoa(int maTin) => _repo.Xoa(maTin);
    }
}
