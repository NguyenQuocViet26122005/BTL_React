using BTL_CNW.DTO.DonUngTuyen;
using Microsoft.Data.SqlClient;
using System.Data;

namespace BTL_CNW.DAL.DonUngTuyen
{
    public class DonUngTuyenRepository : IDonUngTuyenRepository
    {
        private readonly string _conn;

        public DonUngTuyenRepository(IConfiguration config)
        {
            _conn = config.GetConnectionString("DefaultConnection")!;
        }

        private const string SelectBase = @"
SELECT d.MaDon, d.MaTin, t.TieuDe,
       d.MaUngVien, nd.HoTen, nd.Email,
       d.MaFileCV, fc.TenFile,
       d.ThuGioiThieu, d.TrangThai, d.NgayNop, d.NgayCapNhat
FROM DonUngTuyen d
JOIN TinTuyenDung t ON t.MaTin = d.MaTin
JOIN NguoiDung nd ON nd.MaNguoiDung = d.MaUngVien
LEFT JOIN FileCV fc ON fc.MaFileCV = d.MaFileCV";

        private static DonUngTuyenDto MapRow(SqlDataReader rd) => new()
        {
            MaDon = rd.GetInt32(0),
            MaTin = rd.GetInt32(1),
            TieuDeTin = rd.GetString(2),
            MaUngVien = rd.GetInt32(3),
            TenUngVien = rd.GetString(4),
            EmailUngVien = rd.IsDBNull(5) ? null : rd.GetString(5),
            MaFileCV = rd.GetInt32(6),
            TenFileCV = rd.IsDBNull(7) ? null : rd.GetString(7),
            ThuGioiThieu = rd.IsDBNull(8) ? null : rd.GetString(8),
            TrangThai = rd.GetString(9),
            NgayNop = rd.GetDateTime(10),
            NgayCapNhat = rd.GetDateTime(11)
        };

        public bool DaNop(int maTin, int maUngVien)
        {
            using var conn = new SqlConnection(_conn);
            using var cmd = conn.CreateCommand();
            cmd.CommandText = "SELECT COUNT(1) FROM DonUngTuyen WHERE MaTin=@MaTin AND MaUngVien=@MaUngVien";
            cmd.Parameters.Add("@MaTin", SqlDbType.Int).Value = maTin;
            cmd.Parameters.Add("@MaUngVien", SqlDbType.Int).Value = maUngVien;
            conn.Open();
            return (int)cmd.ExecuteScalar()! > 0;
        }

        public bool NopDon(NopDonDto dto)
        {
            using var conn = new SqlConnection(_conn);
            using var cmd = conn.CreateCommand();
            cmd.CommandText = @"
INSERT INTO DonUngTuyen (MaTin, MaUngVien, MaFileCV, ThuGioiThieu, TrangThai)
VALUES (@MaTin, @MaUngVien, @MaFileCV, @ThuGioiThieu, N'DaNop')";
            cmd.Parameters.Add("@MaTin", SqlDbType.Int).Value = dto.MaTin;
            cmd.Parameters.Add("@MaUngVien", SqlDbType.Int).Value = dto.MaUngVien;
            cmd.Parameters.Add("@MaFileCV", SqlDbType.Int).Value = dto.MaFileCV;
            cmd.Parameters.Add("@ThuGioiThieu", SqlDbType.NVarChar).Value = (object?)dto.ThuGioiThieu ?? DBNull.Value;
            conn.Open();
            return cmd.ExecuteNonQuery() > 0;
        }

        public List<DonUngTuyenDto> LayTheoUngVien(int maUngVien)
        {
            var list = new List<DonUngTuyenDto>();
            using var conn = new SqlConnection(_conn);
            using var cmd = conn.CreateCommand();
            cmd.CommandText = SelectBase + " WHERE d.MaUngVien = @MaUngVien ORDER BY d.NgayNop DESC";
            cmd.Parameters.Add("@MaUngVien", SqlDbType.Int).Value = maUngVien;
            conn.Open();
            using var rd = cmd.ExecuteReader();
            while (rd.Read()) list.Add(MapRow(rd));
            return list;
        }

        public List<DonUngTuyenDto> LayTheoTin(int maTin)
        {
            var list = new List<DonUngTuyenDto>();
            using var conn = new SqlConnection(_conn);
            using var cmd = conn.CreateCommand();
            cmd.CommandText = SelectBase + " WHERE d.MaTin = @MaTin ORDER BY d.NgayNop DESC";
            cmd.Parameters.Add("@MaTin", SqlDbType.Int).Value = maTin;
            conn.Open();
            using var rd = cmd.ExecuteReader();
            while (rd.Read()) list.Add(MapRow(rd));
            return list;
        }

        public DonUngTuyenDto? LayChiTiet(int maDon)
        {
            using var conn = new SqlConnection(_conn);
            using var cmd = conn.CreateCommand();
            cmd.CommandText = SelectBase + " WHERE d.MaDon = @MaDon";
            cmd.Parameters.Add("@MaDon", SqlDbType.Int).Value = maDon;
            conn.Open();
            using var rd = cmd.ExecuteReader();
            return rd.Read() ? MapRow(rd) : null;
        }

        public bool CapNhatTrangThai(int maDon, string trangThai)
        {
            using var conn = new SqlConnection(_conn);
            using var cmd = conn.CreateCommand();
            cmd.CommandText = "UPDATE DonUngTuyen SET TrangThai = @TrangThai WHERE MaDon = @MaDon";
            cmd.Parameters.Add("@MaDon", SqlDbType.Int).Value = maDon;
            cmd.Parameters.Add("@TrangThai", SqlDbType.NVarChar, 20).Value = trangThai;
            conn.Open();
            return cmd.ExecuteNonQuery() > 0;
        }
    }
}
