using MySql.Data.MySqlClient;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;

namespace Portal.Core
{
    public class UsersQuery
    {
        public AppDb Db { get; }

        public UsersQuery(AppDb db)
        {
            Db = db;
        }

        public async Task<Users> FindOneAsync(string userName, string password)
        {
            var cmd = Db.Connection.CreateCommand();
            cmd.CommandText = @"SELECT `Id`, `Name`, `Surname`,`Username`, `PhoneNumber`, `LicenseCount` FROM `users` WHERE `Username` = @userName AND `Password` = @password";
            cmd.Parameters.Add(new MySqlParameter
            {
                ParameterName = "@userName",
                DbType = DbType.String,
                Value = userName,
            });
            cmd.Parameters.Add(new MySqlParameter
            {
                ParameterName = "@password",
                DbType = DbType.String,
                Value = password,
            });
            var execute = cmd.ExecuteReaderAsync();
            var result = ReadAllAsync(await execute).Result;
            return result.Count > 0 ? result[0] : null;
        }

        private async Task<List<Users>> ReadAllAsync(System.Data.Common.DbDataReader reader)
        {
            var posts = new List<Users>();
            using (reader)
            {
                while (await reader.ReadAsync())
                {
                    var post = new Users(Db)
                    {
                        Id = reader.GetInt32(0),
                        Name = reader.GetString(1),
                        Surname = reader.GetString(2),
                        Username = reader.GetString(3),
                        PhoneNumber = reader.GetString(4),
                        LicenseCount = reader.GetInt32(5),
                    };
                    posts.Add(post);
                }
            }
            return posts;
        }
    }
}
