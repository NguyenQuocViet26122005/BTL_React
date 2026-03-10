using BTL_CNW.DTO.TinTuyenDung;
using Microsoft.Data.SqlClient;
using System.Data;

namespace BTL_CNW.DAL.TinTuyenDung
{
    public class TinTuyenDungRepository : ITinTuyenDungRepository
    {
        private readonly string _conn;

        public TinTuyenDungRepository(IConfiguration config)
        {
            _conn = config.GetConnectionString("DefaultConnection")!;
        }

        private static TinTuyenDungDto MapRow(SqlDataReader rd) => new()
        {
            MaTin = rd.GetInt32(0),
            MaCongTy = rd.GetInt32(1),
            TenCongTy = rd.GetString(2),
            LogoCongTy = rd.IsDBNull(3) ? null : rd.GetString(3),
            MaNguoiDang = rd.GetInt32(4),
            MaDanhMuc = rd.IsDBNull(5) ? null : rd.GetInt32(5),
            TenDanhMuc = rd.IsDBNull(6) ? null : rd.GetString(6),
            TieuDe = rd.GetString(7),
            MoTa = rd.GetString(8),
            YeuCau = rd.IsDBNull(9) ? null : rd.GetString(9),
            QuyenLoi = rd.IsDBNull(10) ? null : rd.GetString(10),
            HinhThucLamViec = rd.GetString(11),
            KinhNghiem = rd.IsDBNull(12) ? null : rd.GetString(12),
            MucLuongToiThieu = rd.IsDBNull(13) ? null : rd.GetDecimal(13),
            MucLuongToiDa = rd.IsDBNull(14) ? null : rd.GetDecimal(14),
            DonViTien = rd.IsDBNull(15) ? null : rd.GetString(15),
            DiaDiem = rd.IsDBNull(16) ? null : rd.GetString(16),
            ThanhPho = rd.IsDBNull(17) ? null : rd.GetString(17),
            HanNopHoSo = rd.IsDBNull(18) ? null : DateOnly.FromDateTime(rd.GetDateTime(18)),
            SoLuongTuyen = rd.IsDBNull(19) ? null : rd.GetInt32(19),
            TrangThai = rd.GetString(20),
            LuotXem = rd.GetInt32(21),
            NgayTao = rd.GetDateTime(22),
            NgayCapNhat = rd.GetDateTime(23)
        };

        private const string SelectBase = @"
SELECT t.MaTin, t.MaCongTy, ct.TenCongTy, ct.Logo,
       t.MaNguoiDang, t.MaDanhMuc, dm.TenDanhMuc,
       t.TieuDe, t.MoTa, t.YeuCau, t.QuyenLoi,
       t.HinhThucLamViec, t.KinhNghiem,
       t.MucLuongToiThieu, t.MucLuongToiDa, t.DonViTien,
       t.DiaDiem, t.ThanhPho, t.HanNopHoSo, t.SoLuongTuyen,
       t.TrangThai, t.LuotXem, t.NgayTao, t.NgayCapNhat
FROM TinTuyenDung t
JOIN CongTy ct ON ct.MaCongTy = t.MaCongTy
LEFT JOIN DanhMucViecLam dm ON dm.MaDanhMuc = t.MaDanhMuc";

        public bool TaoTin(TaoTinDto dto)
        {
            using var conn = new SqlConnection(_conn);
            conn.Open();
            using var tran = conn.BeginTransaction();
            try
            {
                using var cmd = conn.CreateCommand();
                cmd.Transaction = tran;
                cmd.CommandText = @"
INSERT INTO TinTuyenDung
  (MaCongTy, MaNguoiDang, MaDanhMuc, TieuDe, MoTa, YeuCau, QuyenLoi,
   HinhThucLamViec, KinhNghiem, MucLuongToiThieu, MucLuongToiDa, DonViTien,
   DiaDiem, ThanhPho, HanNopHoSo, SoLuongTuyen, TrangThai)
VALUES
  (@MaCongTy, @MaNguoiDang, @MaDanhMuc, @TieuDe, @MoTa, @YeuCau, @QuyenLoi,
   @HinhThuc, @KinhNghiem, @LuongMin, @LuongMax, @DonViTien,
   @DiaDiem, @ThanhPho, @HanNop, @SoLuong, N'ChoXetDuyet');
SELECT SCOPE_IDENTITY();";
                cmd.Parameters.Add("@MaCongTy", SqlDbType.Int).Value = dto.MaCongTy;
                cmd.Parameters.Add("@MaNguoiDang", SqlDbType.Int).Value = dto.MaNguoiDang;
                cmd.Parameters.Add("@MaDanhMuc", SqlDbType.Int).Value = (object?)dto.MaDanhMuc ?? DBNull.Value;
                cmd.Parameters.Add("@TieuDe", SqlDbType.NVarChar, 255).Value = dto.TieuDe;
                cmd.Parameters.Add("@MoTa", SqlDbType.NVarChar).Value = dto.MoTa;
                cmd.Parameters.Add("@YeuCau", SqlDbType.NVarChar).Value = (object?)dto.YeuCau ?? DBNull.Value;
                cmd.Parameters.Add("@QuyenLoi", SqlDbType.NVarChar).Value = (object?)dto.QuyenLoi ?? DBNull.Value;
                cmd.Parameters.Add("@HinhThuc", SqlDbType.NVarChar, 20).Value = dto.HinhThucLamViec;
                cmd.Parameters.Add("@KinhNghiem", SqlDbType.NVarChar, 20).Value = (object?)dto.KinhNghiem ?? DBNull.Value;
                cmd.Parameters.Add("@LuongMin", SqlDbType.Decimal).Value = (object?)dto.MucLuongToiThieu ?? DBNull.Value;
                cmd.Parameters.Add("@LuongMax", SqlDbType.Decimal).Value = (object?)dto.MucLuongToiDa ?? DBNull.Value;
                cmd.Parameters.Add("@DonViTien", SqlDbType.NVarChar, 10).Value = (object?)dto.DonViTien ?? DBNull.Value;
                cmd.Parameters.Add("@DiaDiem", SqlDbType.NVarChar, 255).Value = (object?)dto.DiaDiem ?? DBNull.Value;
                cmd.Parameters.Add("@ThanhPho", SqlDbType.NVarChar, 100).Value = (object?)dto.ThanhPho ?? DBNull.Value;
                cmd.Parameters.Add("@HanNop", SqlDbType.Date).Value = (object?)dto.HanNopHoSo?.ToDateTime(TimeOnly.MinValue) ?? DBNull.Value;
                cmd.Parameters.Add("@SoLuong", SqlDbType.Int).Value = (object?)dto.SoLuongTuyen ?? DBNull.Value;

                var maTin = Convert.ToInt32(cmd.ExecuteScalar());

                // Thêm kỹ năng yêu cầu
                if (dto.DanhSachKyNang?.Any() == true)
                {
                    using var cmdKN = conn.CreateCommand();
                    cmdKN.Transaction = tran;
                    cmdKN.CommandText = "INSERT INTO KyNangTin (MaTin, MaKyNang) VALUES (@MaTin, @MaKyNang)";
                    cmdKN.Parameters.Add("@MaTin", SqlDbType.Int).Value = maTin;
                    cmdKN.Parameters.Add("@MaKyNang", SqlDbType.Int);
                    foreach (var ky in dto.DanhSachKyNang)
                    {
                        cmdKN.Parameters["@MaKyNang"].Value = ky;
                        cmdKN.ExecuteNonQuery();
                    }
                }
                tran.Commit();
                return true;
            }
            catch { tran.Rollback(); return false; }
        }

        public List<TinTuyenDungDto> LayDanhSach(string? thanhPho, string? hinhThuc, string? kinhNghiem)
        {
            var list = new List<TinTuyenDungDto>();
            using var conn = new SqlConnection(_conn);
            using var cmd = conn.CreateCommand();
            var where = "WHERE t.TrangThai = N'DaDuyet'";
            if (!string.IsNullOrEmpty(thanhPho)) where += " AND t.ThanhPho = @ThanhPho";
            if (!string.IsNullOrEmpty(hinhThuc)) where += " AND t.HinhThucLamViec = @HinhThuc";
            if (!string.IsNullOrEmpty(kinhNghiem)) where += " AND t.KinhNghiem = @KinhNghiem";
            cmd.CommandText = SelectBase + " " + where + " ORDER BY t.NgayTao DESC";
            if (!string.IsNullOrEmpty(thanhPho)) cmd.Parameters.Add("@ThanhPho", SqlDbType.NVarChar, 100).Value = thanhPho;
            if (!string.IsNullOrEmpty(hinhThuc)) cmd.Parameters.Add("@HinhThuc", SqlDbType.NVarChar, 20).Value = hinhThuc;
            if (!string.IsNullOrEmpty(kinhNghiem)) cmd.Parameters.Add("@KinhNghiem", SqlDbType.NVarChar, 20).Value = kinhNghiem;
            conn.Open();
            using var rd = cmd.ExecuteReader();
            while (rd.Read()) list.Add(MapRow(rd));
            return list;
        }

        public List<TinTuyenDungDto> LayTheoCongTy(int maCongTy)
        {
            var list = new List<TinTuyenDungDto>();
            using var conn = new SqlConnection(_conn);
            using var cmd = conn.CreateCommand();
            cmd.CommandText = SelectBase + " WHERE t.MaCongTy = @MaCongTy ORDER BY t.NgayTao DESC";
            cmd.Parameters.Add("@MaCongTy", SqlDbType.Int).Value = maCongTy;
            conn.Open();
            using var rd = cmd.ExecuteReader();
            while (rd.Read()) list.Add(MapRow(rd));
            return list;
        }

        public List<TinTuyenDungDto> LayTheoNguoiDang(int maNguoiDang)
        {
            var list = new List<TinTuyenDungDto>();
            using var conn = new SqlConnection(_conn);
            using var cmd = conn.CreateCommand();
            cmd.CommandText = SelectBase + " WHERE t.MaNguoiDang = @MaNguoiDang ORDER BY t.NgayTao DESC";
            cmd.Parameters.Add("@MaNguoiDang", SqlDbType.Int).Value = maNguoiDang;
            conn.Open();
            using var rd = cmd.ExecuteReader();
            while (rd.Read()) list.Add(MapRow(rd));
            return list;
        }

        public TinTuyenDungDto? LayChiTiet(int maTin)
        {
            using var conn = new SqlConnection(_conn);
            using var cmd = conn.CreateCommand();
            cmd.CommandText = SelectBase + " WHERE t.MaTin = @MaTin";
            cmd.Parameters.Add("@MaTin", SqlDbType.Int).Value = maTin;
            conn.Open();
            using var rd = cmd.ExecuteReader();
            return rd.Read() ? MapRow(rd) : null;
        }

        public bool CapNhat(int maTin, CapNhatTinDto dto)
        {
            using var conn = new SqlConnection(_conn);
            using var cmd = conn.CreateCommand();
            cmd.CommandText = @"
UPDATE TinTuyenDung SET
  MaDanhMuc=@MaDanhMuc, TieuDe=@TieuDe, MoTa=@MoTa, YeuCau=@YeuCau,
  QuyenLoi=@QuyenLoi, HinhThucLamViec=@HinhThuc, KinhNghiem=@KinhNghiem,
  MucLuongToiThieu=@LuongMin, MucLuongToiDa=@LuongMax, DonViTien=@DonViTien,
  DiaDiem=@DiaDiem, ThanhPho=@ThanhPho, HanNopHoSo=@HanNop,
  SoLuongTuyen=@SoLuong, TrangThai=N'ChoXetDuyet'
WHERE MaTin=@MaTin";
            cmd.Parameters.Add("@MaTin", SqlDbType.Int).Value = maTin;
            cmd.Parameters.Add("@MaDanhMuc", SqlDbType.Int).Value = (object?)dto.MaDanhMuc ?? DBNull.Value;
            cmd.Parameters.Add("@TieuDe", SqlDbType.NVarChar, 255).Value = dto.TieuDe;
            cmd.Parameters.Add("@MoTa", SqlDbType.NVarChar).Value = dto.MoTa;
            cmd.Parameters.Add("@YeuCau", SqlDbType.NVarChar).Value = (object?)dto.YeuCau ?? DBNull.Value;
            cmd.Parameters.Add("@QuyenLoi", SqlDbType.NVarChar).Value = (object?)dto.QuyenLoi ?? DBNull.Value;
            cmd.Parameters.Add("@HinhThuc", SqlDbType.NVarChar, 20).Value = dto.HinhThucLamViec;
            cmd.Parameters.Add("@KinhNghiem", SqlDbType.NVarChar, 20).Value = (object?)dto.KinhNghiem ?? DBNull.Value;
            cmd.Parameters.Add("@LuongMin", SqlDbType.Decimal).Value = (object?)dto.MucLuongToiThieu ?? DBNull.Value;
            cmd.Parameters.Add("@LuongMax", SqlDbType.Decimal).Value = (object?)dto.MucLuongToiDa ?? DBNull.Value;
            cmd.Parameters.Add("@DonViTien", SqlDbType.NVarChar, 10).Value = (object?)dto.DonViTien ?? DBNull.Value;
            cmd.Parameters.Add("@DiaDiem", SqlDbType.NVarChar, 255).Value = (object?)dto.DiaDiem ?? DBNull.Value;
            cmd.Parameters.Add("@ThanhPho", SqlDbType.NVarChar, 100).Value = (object?)dto.ThanhPho ?? DBNull.Value;
            cmd.Parameters.Add("@HanNop", SqlDbType.Date).Value = (object?)dto.HanNopHoSo?.ToDateTime(TimeOnly.MinValue) ?? DBNull.Value;
            cmd.Parameters.Add("@SoLuong", SqlDbType.Int).Value = (object?)dto.SoLuongTuyen ?? DBNull.Value;
            conn.Open();
            return cmd.ExecuteNonQuery() > 0;
        }

        public bool DoiTrangThai(int maTin, string trangThai, string? lyDo)
        {
            using var conn = new SqlConnection(_conn);
            using var cmd = conn.CreateCommand();
            cmd.CommandText = "UPDATE TinTuyenDung SET TrangThai=@TrangThai, LyDoTuChoi=@LyDo WHERE MaTin=@MaTin";
            cmd.Parameters.Add("@MaTin", SqlDbType.Int).Value = maTin;
            cmd.Parameters.Add("@TrangThai", SqlDbType.NVarChar, 20).Value = trangThai;
            cmd.Parameters.Add("@LyDo", SqlDbType.NVarChar).Value = (object?)lyDo ?? DBNull.Value;
            conn.Open();
            return cmd.ExecuteNonQuery() > 0;
        }

        public bool Xoa(int maTin)
        {
            using var conn = new SqlConnection(_conn);
            using var cmd = conn.CreateCommand();
            cmd.CommandText = "DELETE FROM TinTuyenDung WHERE MaTin = @MaTin";
            cmd.Parameters.Add("@MaTin", SqlDbType.Int).Value = maTin;
            conn.Open();
            return cmd.ExecuteNonQuery() > 0;
        }

        public bool TangLuotXem(int maTin)
        {
            using var conn = new SqlConnection(_conn);
            using var cmd = conn.CreateCommand();
            cmd.CommandText = "UPDATE TinTuyenDung SET LuotXem = LuotXem + 1 WHERE MaTin = @MaTin";
            cmd.Parameters.Add("@MaTin", SqlDbType.Int).Value = maTin;
            conn.Open();
            return cmd.ExecuteNonQuery() > 0;
        }
    }
}
