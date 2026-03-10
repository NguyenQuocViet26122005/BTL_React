using BTL_CNW.DTO.LichPhongVan;
using Microsoft.Data.SqlClient;
using System.Data;

namespace BTL_CNW.DAL.LichPhongVan
{
    public class LichPhongVanRepository : ILichPhongVanRepository
    {
        private readonly string _conn;

        public LichPhongVanRepository(IConfiguration config)
        {
            _conn = config.GetConnectionString("DefaultConnection")!;
        }

        private const string SelectBase = @"
SELECT lv.MaLich, lv.MaDon, lv.MaNguoiLich, nd.HoTen,
       lv.VongPhongVan, lv.HinhThuc, lv.ThoiGian, lv.ThoiLuongPhut,
       lv.DiaDiem, lv.GhiChu, lv.TrangThai, lv.NgayTao
FROM LichPhongVan lv
JOIN NguoiDung nd ON nd.MaNguoiDung = lv.MaNguoiLich";

        private static LichPhongVanDto MapRow(SqlDataReader rd) => new()
        {
            MaLich = rd.GetInt32(0),
            MaDon = rd.GetInt32(1),
            MaNguoiLich = rd.GetInt32(2),
            TenNguoiLich = rd.GetString(3),
            VongPhongVan = rd.GetByte(4),
            HinhThuc = rd.GetString(5),
            ThoiGian = rd.GetDateTime(6),
            ThoiLuongPhut = rd.IsDBNull(7) ? null : (int)rd.GetInt16(7),
            DiaDiem = rd.IsDBNull(8) ? null : rd.GetString(8),
            GhiChu = rd.IsDBNull(9) ? null : rd.GetString(9),
            TrangThai = rd.GetString(10),
            NgayTao = rd.GetDateTime(11)
        };

        public bool TaoLich(TaoLichDto dto)
        {
            using var conn = new SqlConnection(_conn);
            using var cmd = conn.CreateCommand();
            cmd.CommandText = @"
INSERT INTO LichPhongVan
  (MaDon, MaNguoiLich, VongPhongVan, HinhThuc, ThoiGian, ThoiLuongPhut, DiaDiem, GhiChu, TrangThai)
VALUES
  (@MaDon, @MaNguoiLich, @Vong, @HinhThuc, @ThoiGian, @ThoiLuong, @DiaDiem, @GhiChu, N'DaLen')";
            cmd.Parameters.Add("@MaDon", SqlDbType.Int).Value = dto.MaDon;
            cmd.Parameters.Add("@MaNguoiLich", SqlDbType.Int).Value = dto.MaNguoiLich;
            cmd.Parameters.Add("@Vong", SqlDbType.TinyInt).Value = (byte)dto.VongPhongVan;
            cmd.Parameters.Add("@HinhThuc", SqlDbType.NVarChar, 20).Value = dto.HinhThuc;
            cmd.Parameters.Add("@ThoiGian", SqlDbType.DateTime2).Value = dto.ThoiGian;
            cmd.Parameters.Add("@ThoiLuong", SqlDbType.SmallInt).Value = (object?)dto.ThoiLuongPhut.HasValue ? (short)dto.ThoiLuongPhut.Value : DBNull.Value;
            cmd.Parameters.Add("@DiaDiem", SqlDbType.NVarChar, 500).Value = (object?)dto.DiaDiem ?? DBNull.Value;
            cmd.Parameters.Add("@GhiChu", SqlDbType.NVarChar).Value = (object?)dto.GhiChu ?? DBNull.Value;
            conn.Open();
            return cmd.ExecuteNonQuery() > 0;
        }

        public List<LichPhongVanDto> LayTheoDon(int maDon)
        {
            var list = new List<LichPhongVanDto>();
            using var conn = new SqlConnection(_conn);
            using var cmd = conn.CreateCommand();
            cmd.CommandText = SelectBase + " WHERE lv.MaDon = @MaDon ORDER BY lv.ThoiGian";
            cmd.Parameters.Add("@MaDon", SqlDbType.Int).Value = maDon;
            conn.Open();
            using var rd = cmd.ExecuteReader();
            while (rd.Read()) list.Add(MapRow(rd));
            return list;
        }

        public LichPhongVanDto? LayChiTiet(int maLich)
        {
            using var conn = new SqlConnection(_conn);
            using var cmd = conn.CreateCommand();
            cmd.CommandText = SelectBase + " WHERE lv.MaLich = @MaLich";
            cmd.Parameters.Add("@MaLich", SqlDbType.Int).Value = maLich;
            conn.Open();
            using var rd = cmd.ExecuteReader();
            return rd.Read() ? MapRow(rd) : null;
        }

        public bool DoiTrangThai(int maLich, string trangThai)
        {
            using var conn = new SqlConnection(_conn);
            using var cmd = conn.CreateCommand();
            cmd.CommandText = "UPDATE LichPhongVan SET TrangThai = @TrangThai WHERE MaLich = @MaLich";
            cmd.Parameters.Add("@MaLich", SqlDbType.Int).Value = maLich;
            cmd.Parameters.Add("@TrangThai", SqlDbType.NVarChar, 20).Value = trangThai;
            conn.Open();
            return cmd.ExecuteNonQuery() > 0;
        }
    }
}
