using MySql.Data.MySqlClient;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;

namespace Portal.Core
{
    public class WebContentQuery
    {
        public AppDb Db { get; }

        public WebContentQuery(AppDb db)
        {
            Db = db;
        }

        //public async Task<WebContent> FindOneAsync(int userid)
        //{
        //    using var cmd = Db.Connection.CreateCommand();
        //    cmd.CommandText = @"SELECT * FROM `WebContent` WHERE `UserId` = @userid ";
        //    cmd.Parameters.Add(new MySqlParameter
        //    {
        //        ParameterName = "@userName",
        //        DbType = DbType.Int32,
        //        Value = userid,
        //    });
        //    var execute = cmd.ExecuteReaderAsync();
        //    var result = ReadAllAsync(await execute).Result;
        //    return result.Count > 0 ? result[0] : null;
        //}

        //private async Task<List<WebContent>> ReadAllAsync(System.Data.Common.DbDataReader reader)
        //{
        //    var posts = new List<WebContent>();
        //    using (reader)
        //    {
        //        while (await reader.ReadAsync())
        //        {
        //            var post = new WebContent(Db)
        //            {
        //                Id = reader.GetInt32(0),
        //                LogoUrl = reader.GetString(1),
        //                WebUrl = reader.GetString(2),
        //                Username = reader.GetString(3),
        //                PhoneNumber = reader.GetString(4),
        //                LicenseCount = reader.GetInt32(5),
        //            };
        //            posts.Add(post);
        //        }
        //    }
        //    return posts;
        //}
    }
}
