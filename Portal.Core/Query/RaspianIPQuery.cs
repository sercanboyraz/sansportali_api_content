using Microsoft.AspNetCore.Mvc;
using MySql.Data.MySqlClient;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;

namespace Portal.Core.Query
{

    public class RaspianIPQuery
    {

        public AppDb Db { get; }

        public RaspianIPQuery(AppDb db)
        {
            Db = db;
        }

        public async Task<int> AddIP(int userId, string ipv4, string ipv6)
        {
            var getDate = DateTime.Now;
            var cmd = Db.Connection.CreateCommand();
            cmd.CommandText = @"INSERT INTO RaspbianIP
                                (
                                `UserId`,
                                `IPV4`,
                                `IPV6`,
                                `Date`)
                                VALUES
                                (
                                @UserId,
                                @IPV4,
                                @IPV6,
                                @Date)";

            cmd.Parameters.Add(new MySqlParameter
            {
                ParameterName = "@UserId",
                DbType = DbType.Int32,
                Value = userId,
            });
            cmd.Parameters.Add(new MySqlParameter
            {
                ParameterName = "@IPV4",
                DbType = DbType.String,
                Value = ipv4,
            });

            cmd.Parameters.Add(new MySqlParameter
            {
                ParameterName = "@IPV6",
                DbType = DbType.String,
                Value = ipv6,
            });

            cmd.Parameters.Add(new MySqlParameter
            {
                ParameterName = "@Date",
                DbType = DbType.DateTime,
                Value = getDate,
            });
            var ttt = await cmd.ExecuteNonQueryAsync();
            return ttt;
        }
    }
}
