using BTL_CNW.DTO.Auth;
using Microsoft.Data.SqlClient;
using System.Data;

namespace BTL_CNW.DAL.Auth
{
    public class AuthRepository : IAuthRepository
    {
        private readonly string _conn;

        public AuthRepository(IConfiguration config)
        {
            _conn = config.GetConnectionString("DefaultConnection")!;
        }

        public bool EmailDaTonTai(string email)
        {
            using var conn = new SqlConnection(_conn);
            using var cmd = conn.CreateCommand();
            cmd.CommandText = "SELECT COUNT(1) FROM NguoiDung WHERE Email = @Email";
            cmd.Parameters.Add("@Email", SqlDbType.NVarChar, 255).Value = email;
            conn.Open();
            return (int)cmd.ExecuteScalar()! > 0;
        }

        public bool DangKy(DangKyDto dto)
        {
            using var conn = new SqlConnection(_conn);
            using var cmd = conn.CreateCommand();
            cmd.CommandText = @"
INSERT INTO NguoiDung (MaVaiTro, HoTen, Email, SoDienThoai, MatKhauMaHoa, DangHoatDong, DaXacThucEmail)
VALUES (@MaVaiTro, @HoTen, @Email, @SoDienThoai, @MatKhau, 1, 0)";
            cmd.Parameters.Add("@MaVaiTro", SqlDbType.Int).Value = dto.MaVaiTro;
            cmd.Parameters.Add("@HoTen", SqlDbType.NVarChar, 150).Value = dto.HoTen;
            cmd.Parameters.Add("@Email", SqlDbType.NVarChar, 255).Value = dto.Email;
            cmd.Parameters.Add("@SoDienThoai", SqlDbType.NVarChar, 20).Value = (object?)dto.SoDienThoai ?? DBNull.Value;
            // NOTE: Thực tế nên hash password. Tạm thời lưu plaintext để demo.
            cmd.Parameters.Add("@MatKhau", SqlDbType.NVarChar, 255).Value = dto.MatKhau;
            conn.Open();
            return cmd.ExecuteNonQuery() > 0;
        }

        public NguoiDungDto? DangNhap(string email, string matKhau)
        {
            using var conn = new SqlConnection(_conn);
            using var cmd = conn.CreateCommand();
            cmd.CommandText = @"
SELECT nd.MaNguoiDung, nd.MaVaiTro, vt.TenVaiTro, nd.HoTen, nd.Email,
       nd.SoDienThoai, nd.AnhDaiDien, nd.DangHoatDong, nd.NgayTao
FROM NguoiDung nd
JOIN VaiTro vt ON vt.MaVaiTro = nd.MaVaiTro
WHERE nd.Email = @Email AND nd.MatKhauMaHoa = @MatKhau AND nd.DangHoatDong = 1";
            cmd.Parameters.Add("@Email", SqlDbType.NVarChar, 255).Value = email;
            cmd.Parameters.Add("@MatKhau", SqlDbType.NVarChar, 255).Value = matKhau;
            conn.Open();
            using var rd = cmd.ExecuteReader();
            if (!rd.Read()) return null;
            return new NguoiDungDto
            {
                MaNguoiDung = rd.GetInt32(0),
                MaVaiTro = rd.GetInt32(1),
                TenVaiTro = rd.GetString(2),
                HoTen = rd.GetString(3),
                Email = rd.GetString(4),
                SoDienThoai = rd.IsDBNull(5) ? null : rd.GetString(5),
                AnhDaiDien = rd.IsDBNull(6) ? null : rd.GetString(6),
                DangHoatDong = rd.GetBoolean(7),
                NgayTao = rd.GetDateTime(8)
            };
        }
    }
}
