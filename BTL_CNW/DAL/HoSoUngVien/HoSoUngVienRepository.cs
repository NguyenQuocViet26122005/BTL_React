using BTL_CNW.DTO.HoSoUngVien;
using Microsoft.Data.SqlClient;
using System.Data;

namespace BTL_CNW.DAL.HoSoUngVien
{
    public class HoSoUngVienRepository : IHoSoUngVienRepository
    {
        private readonly string _conn;

        public HoSoUngVienRepository(IConfiguration config)
        {
            _conn = config.GetConnectionString("DefaultConnection")!;
        }

        private const string SelectBase = @"
SELECT hs.MaHoSo, hs.MaNguoiDung, nd.HoTen,
       hs.TieuDe, hs.TomTat, hs.NgaySinh, hs.GioiTinh,
       hs.DiaChi, hs.ThanhPho, hs.LinkedIn, hs.GitHub, hs.Portfolio,
       hs.TinhTrangTimViec, hs.MucLuongMongMuon, hs.NgayTao, hs.NgayCapNhat
FROM HoSoUngVien hs
JOIN NguoiDung nd ON nd.MaNguoiDung = hs.MaNguoiDung";

        private static HoSoDto MapRow(SqlDataReader rd) => new()
        {
            MaHoSo = rd.GetInt32(0),
            MaNguoiDung = rd.GetInt32(1),
            TenNguoiDung = rd.GetString(2),
            TieuDe = rd.IsDBNull(3) ? null : rd.GetString(3),
            TomTat = rd.IsDBNull(4) ? null : rd.GetString(4),
            NgaySinh = rd.IsDBNull(5) ? null : DateOnly.FromDateTime(rd.GetDateTime(5)),
            GioiTinh = rd.IsDBNull(6) ? null : rd.GetString(6),
            DiaChi = rd.IsDBNull(7) ? null : rd.GetString(7),
            ThanhPho = rd.IsDBNull(8) ? null : rd.GetString(8),
            LinkedIn = rd.IsDBNull(9) ? null : rd.GetString(9),
            GitHub = rd.IsDBNull(10) ? null : rd.GetString(10),
            Portfolio = rd.IsDBNull(11) ? null : rd.GetString(11),
            TinhTrangTimViec = rd.IsDBNull(12) ? null : rd.GetString(12),
            MucLuongMongMuon = rd.IsDBNull(13) ? null : rd.GetDecimal(13),
            NgayTao = rd.GetDateTime(14),
            NgayCapNhat = rd.GetDateTime(15)
        };

        public bool TaoHoSo(TaoHoSoDto dto)
        {
            using var conn = new SqlConnection(_conn);
            using var cmd = conn.CreateCommand();
            cmd.CommandText = @"
INSERT INTO HoSoUngVien
  (MaNguoiDung, TieuDe, TomTat, NgaySinh, GioiTinh, DiaChi, ThanhPho,
   LinkedIn, GitHub, Portfolio, TinhTrangTimViec, MucLuongMongMuon)
VALUES
  (@MaNguoiDung, @TieuDe, @TomTat, @NgaySinh, @GioiTinh, @DiaChi, @ThanhPho,
   @LinkedIn, @GitHub, @Portfolio, @TinhTrang, @MucLuong)";
            cmd.Parameters.Add("@MaNguoiDung", SqlDbType.Int).Value = dto.MaNguoiDung;
            cmd.Parameters.Add("@TieuDe", SqlDbType.NVarChar, 255).Value = (object?)dto.TieuDe ?? DBNull.Value;
            cmd.Parameters.Add("@TomTat", SqlDbType.NVarChar).Value = (object?)dto.TomTat ?? DBNull.Value;
            cmd.Parameters.Add("@NgaySinh", SqlDbType.Date).Value = (object?)dto.NgaySinh?.ToDateTime(TimeOnly.MinValue) ?? DBNull.Value;
            cmd.Parameters.Add("@GioiTinh", SqlDbType.NVarChar, 10).Value = (object?)dto.GioiTinh ?? DBNull.Value;
            cmd.Parameters.Add("@DiaChi", SqlDbType.NVarChar).Value = (object?)dto.DiaChi ?? DBNull.Value;
            cmd.Parameters.Add("@ThanhPho", SqlDbType.NVarChar, 100).Value = (object?)dto.ThanhPho ?? DBNull.Value;
            cmd.Parameters.Add("@LinkedIn", SqlDbType.NVarChar, 500).Value = (object?)dto.LinkedIn ?? DBNull.Value;
            cmd.Parameters.Add("@GitHub", SqlDbType.NVarChar, 500).Value = (object?)dto.GitHub ?? DBNull.Value;
            cmd.Parameters.Add("@Portfolio", SqlDbType.NVarChar, 500).Value = (object?)dto.Portfolio ?? DBNull.Value;
            cmd.Parameters.Add("@TinhTrang", SqlDbType.NVarChar, 20).Value = (object?)dto.TinhTrangTimViec ?? DBNull.Value;
            cmd.Parameters.Add("@MucLuong", SqlDbType.Decimal).Value = (object?)dto.MucLuongMongMuon ?? DBNull.Value;
            conn.Open();
            return cmd.ExecuteNonQuery() > 0;
        }

        public HoSoDto? LayTheoNguoiDung(int maNguoiDung)
        {
            using var conn = new SqlConnection(_conn);
            using var cmd = conn.CreateCommand();
            cmd.CommandText = SelectBase + " WHERE hs.MaNguoiDung = @MaNguoiDung";
            cmd.Parameters.Add("@MaNguoiDung", SqlDbType.Int).Value = maNguoiDung;
            conn.Open();
            using var rd = cmd.ExecuteReader();
            return rd.Read() ? MapRow(rd) : null;
        }

        public HoSoDto? LayTheoId(int maHoSo)
        {
            using var conn = new SqlConnection(_conn);
            using var cmd = conn.CreateCommand();
            cmd.CommandText = SelectBase + " WHERE hs.MaHoSo = @MaHoSo";
            cmd.Parameters.Add("@MaHoSo", SqlDbType.Int).Value = maHoSo;
            conn.Open();
            using var rd = cmd.ExecuteReader();
            return rd.Read() ? MapRow(rd) : null;
        }

        public bool CapNhat(int maHoSo, TaoHoSoDto dto)
        {
            using var conn = new SqlConnection(_conn);
            using var cmd = conn.CreateCommand();
            cmd.CommandText = @"
UPDATE HoSoUngVien SET
  TieuDe=@TieuDe, TomTat=@TomTat, NgaySinh=@NgaySinh, GioiTinh=@GioiTinh,
  DiaChi=@DiaChi, ThanhPho=@ThanhPho, LinkedIn=@LinkedIn, GitHub=@GitHub,
  Portfolio=@Portfolio, TinhTrangTimViec=@TinhTrang, MucLuongMongMuon=@MucLuong
WHERE MaHoSo=@MaHoSo";
            cmd.Parameters.Add("@MaHoSo", SqlDbType.Int).Value = maHoSo;
            cmd.Parameters.Add("@TieuDe", SqlDbType.NVarChar, 255).Value = (object?)dto.TieuDe ?? DBNull.Value;
            cmd.Parameters.Add("@TomTat", SqlDbType.NVarChar).Value = (object?)dto.TomTat ?? DBNull.Value;
            cmd.Parameters.Add("@NgaySinh", SqlDbType.Date).Value = (object?)dto.NgaySinh?.ToDateTime(TimeOnly.MinValue) ?? DBNull.Value;
            cmd.Parameters.Add("@GioiTinh", SqlDbType.NVarChar, 10).Value = (object?)dto.GioiTinh ?? DBNull.Value;
            cmd.Parameters.Add("@DiaChi", SqlDbType.NVarChar).Value = (object?)dto.DiaChi ?? DBNull.Value;
            cmd.Parameters.Add("@ThanhPho", SqlDbType.NVarChar, 100).Value = (object?)dto.ThanhPho ?? DBNull.Value;
            cmd.Parameters.Add("@LinkedIn", SqlDbType.NVarChar, 500).Value = (object?)dto.LinkedIn ?? DBNull.Value;
            cmd.Parameters.Add("@GitHub", SqlDbType.NVarChar, 500).Value = (object?)dto.GitHub ?? DBNull.Value;
            cmd.Parameters.Add("@Portfolio", SqlDbType.NVarChar, 500).Value = (object?)dto.Portfolio ?? DBNull.Value;
            cmd.Parameters.Add("@TinhTrang", SqlDbType.NVarChar, 20).Value = (object?)dto.TinhTrangTimViec ?? DBNull.Value;
            cmd.Parameters.Add("@MucLuong", SqlDbType.Decimal).Value = (object?)dto.MucLuongMongMuon ?? DBNull.Value;
            conn.Open();
            return cmd.ExecuteNonQuery() > 0;
        }
    }
}
