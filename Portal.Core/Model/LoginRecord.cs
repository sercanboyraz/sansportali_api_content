using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Portal.Core
{
    public class LoginRecord
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public string IPAddress { get; set; }
        public DateTime LoginDate { get; set; }



        internal AppDb Db { get; set; }

        public LoginRecord()
        {
        }

        internal LoginRecord(AppDb db)
        {
            Db = db;
        }

        public async Task InsertAsync()
        {
            var cmd = Db.Connection.CreateCommand();
            cmd.CommandText = @"INSERT INTO `LoginRecord` (`UserId`, `IPAddress`,`LoginDate`) VALUES (@userId, @iPAddress,@loginDate);";
            BindParams(cmd);
            await cmd.ExecuteNonQueryAsync();
            Id = (int)cmd.LastInsertedId;
        }

        private void BindParams(MySql.Data.MySqlClient.MySqlCommand cmd)
        {
            cmd.Parameters.Add(new MySql.Data.MySqlClient.MySqlParameter
            {
                ParameterName = "@userId",
                DbType = System.Data.DbType.String,
                Value = UserId,
            });
            cmd.Parameters.Add(new MySql.Data.MySqlClient.MySqlParameter
            {
                ParameterName = "@iPAddress",
                DbType = System.Data.DbType.String,
                Value = IPAddress,
            });
            cmd.Parameters.Add(new MySql.Data.MySqlClient.MySqlParameter
            {
                ParameterName = "@loginDate",
                DbType = System.Data.DbType.String,
                Value = LoginDate,
            });
        }

    }
}
