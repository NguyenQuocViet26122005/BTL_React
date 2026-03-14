using BTL_CNW.DTO.TinTuyenDung;
using BTL_CNW.Models;
using Microsoft.EntityFrameworkCore;

namespace BTL_CNW.DAL.TinTuyenDung
{
    public class TinTuyenDungRepository : ITinTuyenDungRepository
    {
        private readonly QuanLyViecLamContext _context;

        public TinTuyenDungRepository(QuanLyViecLamContext context)
        {
            _context = context;
        }

        public bool TaoTin(TaoTinDto dto)
        {
            try
            {
                var tinTuyenDung = new Models.TinTuyenDung
                {
                    MaCongTy = dto.MaCongTy,
                    MaNguoiDang = dto.MaNguoiDang,
                    MaDanhMuc = dto.MaDanhMuc,
                    TieuDe = dto.TieuDe,
                    MoTa = dto.MoTa,
                    YeuCau = dto.YeuCau,
                    QuyenLoi = dto.QuyenLoi,
                    HinhThucLamViec = dto.HinhThucLamViec,
                    KinhNghiem = dto.KinhNghiem,
                    MucLuongToiThieu = dto.MucLuongToiThieu,
                    MucLuongToiDa = dto.MucLuongToiDa,
                    DonViTien = dto.DonViTien,
                    DiaDiem = dto.DiaDiem,
                    ThanhPho = dto.ThanhPho,
                    HanNopHoSo = dto.HanNopHoSo,
                    SoLuongTuyen = dto.SoLuongTuyen,
                    TrangThai = "ChoXetDuyet"
                };

                _context.TinTuyenDungs.Add(tinTuyenDung);
                var result = _context.SaveChanges() > 0;

                // Thêm kỹ năng nếu có
                if (result && dto.DanhSachKyNang?.Any() == true)
                {
                    var kyNangs = _context.KyNangs.Where(x => dto.DanhSachKyNang.Contains(x.MaKyNang)).ToList();
                    tinTuyenDung.MaKyNangs = kyNangs;
                    _context.SaveChanges();
                }

                return result;
            }
            catch
            {
                return false;
            }
        }

        public List<TinTuyenDungDto> LayDanhSach(string? thanhPho, string? hinhThuc, string? kinhNghiem)
        {
            var query = _context.TinTuyenDungs
                .Include(x => x.MaCongTyNavigation)
                .Include(x => x.MaDanhMucNavigation)
                .Where(x => x.TrangThai == "DaDuyet");

            if (!string.IsNullOrEmpty(thanhPho))
                query = query.Where(x => x.ThanhPho == thanhPho);

            if (!string.IsNullOrEmpty(hinhThuc))
                query = query.Where(x => x.HinhThucLamViec == hinhThuc);

            if (!string.IsNullOrEmpty(kinhNghiem))
                query = query.Where(x => x.KinhNghiem == kinhNghiem);

            return query.OrderByDescending(x => x.NgayTao)
                .Select(x => new TinTuyenDungDto
                {
                    MaTin = x.MaTin,
                    MaCongTy = x.MaCongTy,
                    TenCongTy = x.MaCongTyNavigation.TenCongTy,
                    LogoCongTy = x.MaCongTyNavigation.Logo,
                    MaNguoiDang = x.MaNguoiDang,
                    MaDanhMuc = x.MaDanhMuc,
                    TenDanhMuc = x.MaDanhMucNavigation != null ? x.MaDanhMucNavigation.TenDanhMuc : null,
                    TieuDe = x.TieuDe,
                    MoTa = x.MoTa,
                    YeuCau = x.YeuCau,
                    QuyenLoi = x.QuyenLoi,
                    HinhThucLamViec = x.HinhThucLamViec,
                    KinhNghiem = x.KinhNghiem,
                    MucLuongToiThieu = x.MucLuongToiThieu,
                    MucLuongToiDa = x.MucLuongToiDa,
                    DonViTien = x.DonViTien,
                    DiaDiem = x.DiaDiem,
                    ThanhPho = x.ThanhPho,
                    HanNopHoSo = x.HanNopHoSo,
                    SoLuongTuyen = x.SoLuongTuyen,
                    TrangThai = x.TrangThai,
                    LuotXem = x.LuotXem,
                    NgayTao = x.NgayTao,
                    NgayCapNhat = x.NgayCapNhat
                })
                .ToList();
        }

        public List<TinTuyenDungDto> LayTheoCongTy(int maCongTy)
        {
            return _context.TinTuyenDungs
                .Include(x => x.MaCongTyNavigation)
                .Include(x => x.MaDanhMucNavigation)
                .Where(x => x.MaCongTy == maCongTy)
                .OrderByDescending(x => x.NgayTao)
                .Select(x => new TinTuyenDungDto
                {
                    MaTin = x.MaTin,
                    MaCongTy = x.MaCongTy,
                    TenCongTy = x.MaCongTyNavigation.TenCongTy,
                    LogoCongTy = x.MaCongTyNavigation.Logo,
                    MaNguoiDang = x.MaNguoiDang,
                    MaDanhMuc = x.MaDanhMuc,
                    TenDanhMuc = x.MaDanhMucNavigation != null ? x.MaDanhMucNavigation.TenDanhMuc : null,
                    TieuDe = x.TieuDe,
                    MoTa = x.MoTa,
                    YeuCau = x.YeuCau,
                    QuyenLoi = x.QuyenLoi,
                    HinhThucLamViec = x.HinhThucLamViec,
                    KinhNghiem = x.KinhNghiem,
                    MucLuongToiThieu = x.MucLuongToiThieu,
                    MucLuongToiDa = x.MucLuongToiDa,
                    DonViTien = x.DonViTien,
                    DiaDiem = x.DiaDiem,
                    ThanhPho = x.ThanhPho,
                    HanNopHoSo = x.HanNopHoSo,
                    SoLuongTuyen = x.SoLuongTuyen,
                    TrangThai = x.TrangThai,
                    LuotXem = x.LuotXem,
                    NgayTao = x.NgayTao,
                    NgayCapNhat = x.NgayCapNhat
                })
                .ToList();
        }

        public List<TinTuyenDungDto> LayTheoNguoiDang(int maNguoiDang)
        {
            return _context.TinTuyenDungs
                .Include(x => x.MaCongTyNavigation)
                .Include(x => x.MaDanhMucNavigation)
                .Where(x => x.MaNguoiDang == maNguoiDang)
                .OrderByDescending(x => x.NgayTao)
                .Select(x => new TinTuyenDungDto
                {
                    MaTin = x.MaTin,
                    MaCongTy = x.MaCongTy,
                    TenCongTy = x.MaCongTyNavigation.TenCongTy,
                    LogoCongTy = x.MaCongTyNavigation.Logo,
                    MaNguoiDang = x.MaNguoiDang,
                    MaDanhMuc = x.MaDanhMuc,
                    TenDanhMuc = x.MaDanhMucNavigation != null ? x.MaDanhMucNavigation.TenDanhMuc : null,
                    TieuDe = x.TieuDe,
                    MoTa = x.MoTa,
                    YeuCau = x.YeuCau,
                    QuyenLoi = x.QuyenLoi,
                    HinhThucLamViec = x.HinhThucLamViec,
                    KinhNghiem = x.KinhNghiem,
                    MucLuongToiThieu = x.MucLuongToiThieu,
                    MucLuongToiDa = x.MucLuongToiDa,
                    DonViTien = x.DonViTien,
                    DiaDiem = x.DiaDiem,
                    ThanhPho = x.ThanhPho,
                    HanNopHoSo = x.HanNopHoSo,
                    SoLuongTuyen = x.SoLuongTuyen,
                    TrangThai = x.TrangThai,
                    LuotXem = x.LuotXem,
                    NgayTao = x.NgayTao,
                    NgayCapNhat = x.NgayCapNhat
                })
                .ToList();
        }

        public TinTuyenDungDto? LayChiTiet(int maTin)
        {
            var tin = _context.TinTuyenDungs
                .Include(x => x.MaCongTyNavigation)
                .Include(x => x.MaDanhMucNavigation)
                .FirstOrDefault(x => x.MaTin == maTin);

            if (tin == null) return null;

            return new TinTuyenDungDto
            {
                MaTin = tin.MaTin,
                MaCongTy = tin.MaCongTy,
                TenCongTy = tin.MaCongTyNavigation.TenCongTy,
                LogoCongTy = tin.MaCongTyNavigation.Logo,
                MaNguoiDang = tin.MaNguoiDang,
                MaDanhMuc = tin.MaDanhMuc,
                TenDanhMuc = tin.MaDanhMucNavigation?.TenDanhMuc,
                TieuDe = tin.TieuDe,
                MoTa = tin.MoTa,
                YeuCau = tin.YeuCau,
                QuyenLoi = tin.QuyenLoi,
                HinhThucLamViec = tin.HinhThucLamViec,
                KinhNghiem = tin.KinhNghiem,
                MucLuongToiThieu = tin.MucLuongToiThieu,
                MucLuongToiDa = tin.MucLuongToiDa,
                DonViTien = tin.DonViTien,
                DiaDiem = tin.DiaDiem,
                ThanhPho = tin.ThanhPho,
                HanNopHoSo = tin.HanNopHoSo,
                SoLuongTuyen = tin.SoLuongTuyen,
                TrangThai = tin.TrangThai,
                LuotXem = tin.LuotXem,
                NgayTao = tin.NgayTao,
                NgayCapNhat = tin.NgayCapNhat
            };
        }

        public bool CapNhat(int maTin, CapNhatTinDto dto)
        {
            try
            {
                var tin = _context.TinTuyenDungs.FirstOrDefault(x => x.MaTin == maTin);
                if (tin == null) return false;

                tin.MaDanhMuc = dto.MaDanhMuc;
                tin.TieuDe = dto.TieuDe;
                tin.MoTa = dto.MoTa;
                tin.YeuCau = dto.YeuCau;
                tin.QuyenLoi = dto.QuyenLoi;
                tin.HinhThucLamViec = dto.HinhThucLamViec;
                tin.KinhNghiem = dto.KinhNghiem;
                tin.MucLuongToiThieu = dto.MucLuongToiThieu;
                tin.MucLuongToiDa = dto.MucLuongToiDa;
                tin.DonViTien = dto.DonViTien;
                tin.DiaDiem = dto.DiaDiem;
                tin.ThanhPho = dto.ThanhPho;
                tin.HanNopHoSo = dto.HanNopHoSo;
                tin.SoLuongTuyen = dto.SoLuongTuyen;
                tin.TrangThai = "ChoXetDuyet";

                return _context.SaveChanges() > 0;
            }
            catch
            {
                return false;
            }
        }

        public bool DoiTrangThai(int maTin, string trangThai, string? lyDo)
        {
            try
            {
                var tin = _context.TinTuyenDungs.FirstOrDefault(x => x.MaTin == maTin);
                if (tin == null) return false;

                tin.TrangThai = trangThai;
                tin.LyDoTuChoi = lyDo;

                return _context.SaveChanges() > 0;
            }
            catch
            {
                return false;
            }
        }

        public bool Xoa(int maTin)
        {
            try
            {
                var tin = _context.TinTuyenDungs.FirstOrDefault(x => x.MaTin == maTin);
                if (tin == null) return false;

                _context.TinTuyenDungs.Remove(tin);
                return _context.SaveChanges() > 0;
            }
            catch
            {
                return false;
            }
        }

        public bool TangLuotXem(int maTin)
        {
            try
            {
                var tin = _context.TinTuyenDungs.FirstOrDefault(x => x.MaTin == maTin);
                if (tin == null) return false;

                tin.LuotXem++;
                return _context.SaveChanges() > 0;
            }
            catch
            {
                return false;
            }
        }
    }
}