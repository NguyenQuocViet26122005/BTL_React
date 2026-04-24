using BTL_CNW.DAL.KetQuaPhongVan;
using BTL_CNW.DTO.KetQuaPhongVan;
using BTL_CNW.Models;

namespace BTL_CNW.BLL.KetQuaPhongVan
{
    public interface IKetQuaPhongVanService
    {
        (bool success, string message, KetQuaPhongVanDto? data) LayTheoMa(int maKetQua);
        (bool success, string message, KetQuaPhongVanDto? data) LayTheoLich(int maLich);
        (bool success, string message, List<KetQuaPhongVanDto>? data) LayTheoUngVien(int maUngVien);
        (bool success, string message, int maKetQua) Tao(TaoKetQuaDto dto, int maNguoiDanhGia);
        (bool success, string message) CapNhat(int maKetQua, TaoKetQuaDto dto);
        (bool success, string message) Xoa(int maKetQua);
    }

    public class KetQuaPhongVanService : IKetQuaPhongVanService
    {
        private readonly IKetQuaPhongVanRepository _repo;

        public KetQuaPhongVanService(IKetQuaPhongVanRepository repo)
        {
            _repo = repo;
        }

        public (bool success, string message, KetQuaPhongVanDto? data) LayTheoMa(int maKetQua)
        {
            var ketQua = _repo.LayTheoMa(maKetQua);
            if (ketQua == null)
                return (false, "Khong tim thay ket qua phong van", null);

            return (true, "Lay ket qua thanh cong", MapToDto(ketQua));
        }

        public (bool success, string message, KetQuaPhongVanDto? data) LayTheoLich(int maLich)
        {
            var ketQua = _repo.LayTheoLich(maLich);
            if (ketQua == null)
                return (false, "Chua co ket qua phong van", null);

            return (true, "Lay ket qua thanh cong", MapToDto(ketQua));
        }

        public (bool success, string message, List<KetQuaPhongVanDto>? data) LayTheoUngVien(int maUngVien)
        {
            var ketQuas = _repo.LayTheoUngVien(maUngVien);
            var dtos = ketQuas.Select(MapToDto).ToList();
            return (true, "Lay danh sach ket qua thanh cong", dtos);
        }

        public (bool success, string message, int maKetQua) Tao(TaoKetQuaDto dto, int maNguoiDanhGia)
        {
            // Validate
            if (string.IsNullOrWhiteSpace(dto.KetQua))
                return (false, "Ket qua khong duoc de trong", 0);

            var validKetQua = new[] { "Dat", "KhongDat", "ChoDanh" };
            if (!validKetQua.Contains(dto.KetQua))
                return (false, "Ket qua khong hop le", 0);

            // Check if result already exists
            var existing = _repo.LayTheoLich(dto.MaLich);
            if (existing != null)
                return (false, "Ket qua phong van da ton tai", 0);

            var ketQua = new Models.KetQuaPhongVan
            {
                MaLich = dto.MaLich,
                MaNguoiDanhGia = maNguoiDanhGia,
                DiemTongQuat = dto.DiemTongQuat,
                DiemKyThuat = dto.DiemKyThuat,
                DiemKyNangMem = dto.DiemKyNangMem,
                KetQua = dto.KetQua,
                NhanXet = dto.NhanXet,
                NgayTao = DateTime.Now
            };

            var maKetQua = _repo.Tao(ketQua);
            return (true, "Tao ket qua phong van thanh cong", maKetQua);
        }

        public (bool success, string message) CapNhat(int maKetQua, TaoKetQuaDto dto)
        {
            var ketQua = _repo.LayTheoMa(maKetQua);
            if (ketQua == null)
                return (false, "Khong tim thay ket qua phong van");

            // Validate
            if (string.IsNullOrWhiteSpace(dto.KetQua))
                return (false, "Ket qua khong duoc de trong");

            var validKetQua = new[] { "Dat", "KhongDat", "ChoDanh" };
            if (!validKetQua.Contains(dto.KetQua))
                return (false, "Ket qua khong hop le");

            ketQua.DiemTongQuat = dto.DiemTongQuat;
            ketQua.DiemKyThuat = dto.DiemKyThuat;
            ketQua.DiemKyNangMem = dto.DiemKyNangMem;
            ketQua.KetQua = dto.KetQua;
            ketQua.NhanXet = dto.NhanXet;

            _repo.CapNhat(ketQua);
            return (true, "Cap nhat ket qua thanh cong");
        }

        public (bool success, string message) Xoa(int maKetQua)
        {
            var success = _repo.Xoa(maKetQua);
            return success
                ? (true, "Xoa ket qua thanh cong")
                : (false, "Khong tim thay ket qua");
        }

        private KetQuaPhongVanDto MapToDto(Models.KetQuaPhongVan ketQua)
        {
            return new KetQuaPhongVanDto
            {
                MaKetQua = ketQua.MaKetQua,
                MaLich = ketQua.MaLich,
                MaNguoiDanhGia = ketQua.MaNguoiDanhGia,
                TenNguoiDanhGia = ketQua.MaNguoiDanhGiaNavigation?.HoTen,
                DiemTongQuat = ketQua.DiemTongQuat,
                DiemKyThuat = ketQua.DiemKyThuat,
                DiemKyNangMem = ketQua.DiemKyNangMem,
                KetQua = ketQua.KetQua,
                NhanXet = ketQua.NhanXet,
                NgayTao = ketQua.NgayTao,
                ViTriUngTuyen = ketQua.MaLichNavigation?.MaDonNavigation?.MaTinNavigation?.TieuDe,
                ThoiGianPhongVan = ketQua.MaLichNavigation?.ThoiGian
            };
        }
    }
}
