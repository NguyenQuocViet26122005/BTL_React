using BTL_CNW.DAL.FileCv;
using BTL_CNW.DTO.FileCv;

namespace BTL_CNW.BLL.FileCv
{
    public class FileCvService : IFileCvService
    {
        private readonly IFileCvRepository _repo;

        public FileCvService(IFileCvRepository repo)
        {
            _repo = repo;
        }

        public (bool success, string message, FileCvDto? data) TaoFileCv(int maHoSo, string tenFile, string duongDan, int kichThuoc, string loaiFile, bool laMacDinh)
        {
            try
            {
                if (maHoSo <= 0)
                    return (false, "Ma ho so khong hop le", null);

                if (string.IsNullOrWhiteSpace(tenFile))
                    return (false, "Ten file khong duoc de trong", null);

                if (string.IsNullOrWhiteSpace(duongDan))
                    return (false, "Duong dan file khong duoc de trong", null);

                var fileCv = _repo.TaoFileCv(maHoSo, tenFile, duongDan, kichThuoc, loaiFile, laMacDinh);
                
                if (fileCv == null)
                    return (false, "Khong the tao file CV", null);

                var dto = new FileCvDto
                {
                    MaFileCv = fileCv.MaFileCv,
                    MaHoSo = fileCv.MaHoSo,
                    TenFile = fileCv.TenFile,
                    DuongDanFile = fileCv.DuongDanFile,
                    KichThuoc = fileCv.KichThuoc,
                    LoaiFile = fileCv.LoaiFile,
                    LaMacDinh = fileCv.LaMacDinh,
                    NgayTai = fileCv.NgayTai
                };

                return (true, "Tai file CV thanh cong", dto);
            }
            catch (Exception ex)
            {
                return (false, $"Loi he thong: {ex.Message}", null);
            }
        }

        public (bool success, string message, List<FileCvDto>? data) LayDanhSachCvTheoHoSo(int maHoSo)
        {
            try
            {
                if (maHoSo <= 0)
                    return (false, "Ma ho so khong hop le", null);

                var files = _repo.LayDanhSachCvTheoHoSo(maHoSo);
                
                var dtos = files.Select(f => new FileCvDto
                {
                    MaFileCv = f.MaFileCv,
                    MaHoSo = f.MaHoSo,
                    TenFile = f.TenFile,
                    DuongDanFile = f.DuongDanFile,
                    KichThuoc = f.KichThuoc,
                    LoaiFile = f.LoaiFile,
                    LaMacDinh = f.LaMacDinh,
                    NgayTai = f.NgayTai
                }).ToList();

                return (true, "Lay danh sach thanh cong", dtos);
            }
            catch (Exception ex)
            {
                return (false, $"Loi he thong: {ex.Message}", null);
            }
        }

        public (bool success, string message, FileCvDto? data) LayChiTietFileCv(int maFileCv)
        {
            try
            {
                if (maFileCv <= 0)
                    return (false, "Ma file CV khong hop le", null);

                var file = _repo.LayChiTietFileCv(maFileCv);
                
                if (file == null)
                    return (false, "Khong tim thay file CV", null);

                var dto = new FileCvDto
                {
                    MaFileCv = file.MaFileCv,
                    MaHoSo = file.MaHoSo,
                    TenFile = file.TenFile,
                    DuongDanFile = file.DuongDanFile,
                    KichThuoc = file.KichThuoc,
                    LoaiFile = file.LoaiFile,
                    LaMacDinh = file.LaMacDinh,
                    NgayTai = file.NgayTai
                };

                return (true, "Lay chi tiet thanh cong", dto);
            }
            catch (Exception ex)
            {
                return (false, $"Loi he thong: {ex.Message}", null);
            }
        }

        public (bool success, string message) DatFileCvMacDinh(int maFileCv, int maHoSo)
        {
            try
            {
                if (maFileCv <= 0)
                    return (false, "Ma file CV khong hop le");

                if (maHoSo <= 0)
                    return (false, "Ma ho so khong hop le");

                var result = _repo.DatFileCvMacDinh(maFileCv, maHoSo);
                
                return result
                    ? (true, "Dat file CV mac dinh thanh cong")
                    : (false, "Khong the dat file CV mac dinh");
            }
            catch (Exception ex)
            {
                return (false, $"Loi he thong: {ex.Message}");
            }
        }

        public (bool success, string message) XoaFileCv(int maFileCv)
        {
            try
            {
                if (maFileCv <= 0)
                    return (false, "Ma file CV khong hop le");

                var result = _repo.XoaFileCv(maFileCv);
                
                return result
                    ? (true, "Xoa file CV thanh cong")
                    : (false, "Khong the xoa file CV");
            }
            catch (Exception ex)
            {
                return (false, $"Loi he thong: {ex.Message}");
            }
        }
    }
}
