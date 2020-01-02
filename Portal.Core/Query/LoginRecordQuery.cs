using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Portal.Core
{
    public class LoginRecordQuery
    {
        public AppDb Db { get; }

        public LoginRecordQuery(AppDb db)
        {
            Db = db;
        }
        public async Task<Users> Insert(string userName, string password)
        {
            var cmd = Db.Connection.CreateCommand();
            cmd.CommandText = @"SELECT `Id`, `Name`, `Surname`,`Username`, `PhoneNumber`, `LicenseCount` FROM `users` WHERE `Username` = @userName AND `Password` = @password";
            cmd.Parameters.Add(new MySql.Data.MySqlClient.MySqlParameter
            {
                ParameterName = "@userName",
                DbType = System.Data.DbType.String,
                Value = userName,
            });
            cmd.Parameters.Add(new MySql.Data.MySqlClient.MySqlParameter
            {
                ParameterName = "@password",
                DbType = System.Data.DbType.String,
                Value = password,
            });
            var result = await ReadAllAsync(await cmd.ExecuteReaderAsync());
            return result.Count > 0 ? result[0] : null;
        }

        //public async Task<List<Users>> LatestPostsAsync()
        //{
        //    using var cmd = Db.Connection.CreateCommand();
        //    cmd.CommandText = @"SELECT `Id`, `Title`, `Content` FROM `BlogPost` ORDER BY `Id` DESC LIMIT 10;";
        //    return await ReadAllAsync(await cmd.ExecuteReaderAsync());
        //}

        //public async Task DeleteAllAsync()
        //{
        //    using var txn = await Db.Connection.BeginTransactionAsync();
        //    using var cmd = Db.Connection.CreateCommand();
        //    cmd.CommandText = @"DELETE FROM `BlogPost`";
        //    await cmd.ExecuteNonQueryAsync();
        //    await txn.CommitAsync();
        //}

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
