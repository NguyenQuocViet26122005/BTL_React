using BTL_CNW.DTO.CongTy;
using Microsoft.Data.SqlClient;
using System.Data;

namespace BTL_CNW.DAL.CongTy
{
    public class CongTyRepository : ICongTyRepository
    {
        private readonly string _conn;

        public CongTyRepository(IConfiguration config)
        {
            _conn = config.GetConnectionString("DefaultConnection")!;
        }

        private static CongTyDto MapRow(SqlDataReader rd) => new()
        {
            MaCongTy = rd.GetInt32(0),
            MaChuSoHuu = rd.GetInt32(1),
            TenCongTy = rd.GetString(2),
            MaSoThue = rd.IsDBNull(3) ? null : rd.GetString(3),
            Logo = rd.IsDBNull(4) ? null : rd.GetString(4),
            Website = rd.IsDBNull(5) ? null : rd.GetString(5),
            MaLinhVuc = rd.IsDBNull(6) ? null : rd.GetInt32(6),
            TenLinhVuc = rd.IsDBNull(7) ? null : rd.GetString(7),
            QuyMo = rd.IsDBNull(8) ? null : rd.GetString(8),
            DiaChi = rd.IsDBNull(9) ? null : rd.GetString(9),
            ThanhPho = rd.IsDBNull(10) ? null : rd.GetString(10),
            QuocGia = rd.IsDBNull(11) ? null : rd.GetString(11),
            MoTa = rd.IsDBNull(12) ? null : rd.GetString(12),
            DaDuocDuyet = rd.GetBoolean(13),
            NgayTao = rd.GetDateTime(14)
        };

        private const string SelectBase = @"
SELECT ct.MaCongTy, ct.MaChuSoHuu, ct.TenCongTy, ct.MaSoThue, ct.Logo,
       ct.Website, ct.MaLinhVuc, lv.TenLinhVuc, ct.QuyMo, ct.DiaChi,
       ct.ThanhPho, ct.QuocGia, ct.MoTa, ct.DaDuocDuyet, ct.NgayTao
FROM CongTy ct
LEFT JOIN LinhVuc lv ON lv.MaLinhVuc = ct.MaLinhVuc";

        public bool TaoCongTy(TaoCongTyDto dto)
        {
            using var conn = new SqlConnection(_conn);
            using var cmd = conn.CreateCommand();
            cmd.CommandText = @"
INSERT INTO CongTy (MaChuSoHuu, TenCongTy, MaSoThue, Logo, Website, MaLinhVuc,
                    QuyMo, DiaChi, ThanhPho, QuocGia, MoTa, DaDuocDuyet)
VALUES (@MaChuSoHuu, @TenCongTy, @MaSoThue, @Logo, @Website, @MaLinhVuc,
        @QuyMo, @DiaChi, @ThanhPho, @QuocGia, @MoTa, 0)";
            cmd.Parameters.Add("@MaChuSoHuu", SqlDbType.Int).Value = dto.MaChuSoHuu;
            cmd.Parameters.Add("@TenCongTy", SqlDbType.NVarChar, 255).Value = dto.TenCongTy;
            cmd.Parameters.Add("@MaSoThue", SqlDbType.NVarChar, 50).Value = (object?)dto.MaSoThue ?? DBNull.Value;
            cmd.Parameters.Add("@Logo", SqlDbType.NVarChar, 500).Value = (object?)dto.Logo ?? DBNull.Value;
            cmd.Parameters.Add("@Website", SqlDbType.NVarChar, 500).Value = (object?)dto.Website ?? DBNull.Value;
            cmd.Parameters.Add("@MaLinhVuc", SqlDbType.Int).Value = (object?)dto.MaLinhVuc ?? DBNull.Value;
            cmd.Parameters.Add("@QuyMo", SqlDbType.NVarChar, 10).Value = (object?)dto.QuyMo ?? DBNull.Value;
            cmd.Parameters.Add("@DiaChi", SqlDbType.NVarChar).Value = (object?)dto.DiaChi ?? DBNull.Value;
            cmd.Parameters.Add("@ThanhPho", SqlDbType.NVarChar, 100).Value = (object?)dto.ThanhPho ?? DBNull.Value;
            cmd.Parameters.Add("@QuocGia", SqlDbType.NVarChar, 100).Value = (object?)dto.QuocGia ?? DBNull.Value;
            cmd.Parameters.Add("@MoTa", SqlDbType.NVarChar).Value = (object?)dto.MoTa ?? DBNull.Value;
            conn.Open();
            return cmd.ExecuteNonQuery() > 0;
        }

        public List<CongTyDto> LayTatCa()
        {
            var list = new List<CongTyDto>();
            using var conn = new SqlConnection(_conn);
            using var cmd = conn.CreateCommand();
            cmd.CommandText = SelectBase + " ORDER BY ct.NgayTao DESC";
            conn.Open();
            using var rd = cmd.ExecuteReader();
            while (rd.Read()) list.Add(MapRow(rd));
            return list;
        }

        public CongTyDto? LayTheoId(int maCongTy)
        {
            using var conn = new SqlConnection(_conn);
            using var cmd = conn.CreateCommand();
            cmd.CommandText = SelectBase + " WHERE ct.MaCongTy = @MaCongTy";
            cmd.Parameters.Add("@MaCongTy", SqlDbType.Int).Value = maCongTy;
            conn.Open();
            using var rd = cmd.ExecuteReader();
            return rd.Read() ? MapRow(rd) : null;
        }

        public CongTyDto? LayTheoChuSoHuu(int maNguoiDung)
        {
            using var conn = new SqlConnection(_conn);
            using var cmd = conn.CreateCommand();
            cmd.CommandText = SelectBase + " WHERE ct.MaChuSoHuu = @MaNguoiDung";
            cmd.Parameters.Add("@MaNguoiDung", SqlDbType.Int).Value = maNguoiDung;
            conn.Open();
            using var rd = cmd.ExecuteReader();
            return rd.Read() ? MapRow(rd) : null;
        }

        public bool CapNhat(int maCongTy, CapNhatCongTyDto dto)
        {
            using var conn = new SqlConnection(_conn);
            using var cmd = conn.CreateCommand();
            cmd.CommandText = @"
UPDATE CongTy SET TenCongTy=@TenCongTy, MaSoThue=@MaSoThue, Logo=@Logo,
  Website=@Website, MaLinhVuc=@MaLinhVuc, QuyMo=@QuyMo, DiaChi=@DiaChi,
  ThanhPho=@ThanhPho, QuocGia=@QuocGia, MoTa=@MoTa
WHERE MaCongTy=@MaCongTy";
            cmd.Parameters.Add("@MaCongTy", SqlDbType.Int).Value = maCongTy;
            cmd.Parameters.Add("@TenCongTy", SqlDbType.NVarChar, 255).Value = dto.TenCongTy;
            cmd.Parameters.Add("@MaSoThue", SqlDbType.NVarChar, 50).Value = (object?)dto.MaSoThue ?? DBNull.Value;
            cmd.Parameters.Add("@Logo", SqlDbType.NVarChar, 500).Value = (object?)dto.Logo ?? DBNull.Value;
            cmd.Parameters.Add("@Website", SqlDbType.NVarChar, 500).Value = (object?)dto.Website ?? DBNull.Value;
            cmd.Parameters.Add("@MaLinhVuc", SqlDbType.Int).Value = (object?)dto.MaLinhVuc ?? DBNull.Value;
            cmd.Parameters.Add("@QuyMo", SqlDbType.NVarChar, 10).Value = (object?)dto.QuyMo ?? DBNull.Value;
            cmd.Parameters.Add("@DiaChi", SqlDbType.NVarChar).Value = (object?)dto.DiaChi ?? DBNull.Value;
            cmd.Parameters.Add("@ThanhPho", SqlDbType.NVarChar, 100).Value = (object?)dto.ThanhPho ?? DBNull.Value;
            cmd.Parameters.Add("@QuocGia", SqlDbType.NVarChar, 100).Value = (object?)dto.QuocGia ?? DBNull.Value;
            cmd.Parameters.Add("@MoTa", SqlDbType.NVarChar).Value = (object?)dto.MoTa ?? DBNull.Value;
            conn.Open();
            return cmd.ExecuteNonQuery() > 0;
        }

        public bool DuyetCongTy(int maCongTy)
        {
            using var conn = new SqlConnection(_conn);
            using var cmd = conn.CreateCommand();
            cmd.CommandText = "UPDATE CongTy SET DaDuocDuyet = 1 WHERE MaCongTy = @MaCongTy";
            cmd.Parameters.Add("@MaCongTy", SqlDbType.Int).Value = maCongTy;
            conn.Open();
            return cmd.ExecuteNonQuery() > 0;
        }

        public bool Xoa(int maCongTy)
        {
            using var conn = new SqlConnection(_conn);
            using var cmd = conn.CreateCommand();
            cmd.CommandText = "DELETE FROM CongTy WHERE MaCongTy = @MaCongTy";
            cmd.Parameters.Add("@MaCongTy", SqlDbType.Int).Value = maCongTy;
            conn.Open();
            return cmd.ExecuteNonQuery() > 0;
        }
    }
}
