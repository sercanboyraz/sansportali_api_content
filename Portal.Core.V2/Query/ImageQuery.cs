using MySql.Data.MySqlClient;
using Portal.Core.Model;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;

namespace Portal.Core
{
    public class ImageQuery
    {
        public AppDb Db { get; }

        public ImageQuery(AppDb db)
        {
            Db = db;
        }

        public async Task<Image> FindOneAsync(int userId)
        {
            var cmd = Db.Connection.CreateCommand();
            cmd.CommandText = @"SELECT `Id`, `Data`, `UserId` FROM `Image` WHERE `UserId` = @userId  ORDER BY `Id` DESC";
            cmd.Parameters.Add(new MySqlParameter
            {
                ParameterName = "@userId",
                DbType = DbType.Int32,
                Value = userId,
            });
            var execute = cmd.ExecuteReaderAsync();
            var result = ReadAllAsync(await execute).Result;
            return result.Count > 0 ? result[0] : null;
        }

        private async Task<List<Image>> ReadAllAsync(System.Data.Common.DbDataReader reader)
        {
            var posts = new List<Image>();
            using (reader)
            {
                while (await reader.ReadAsync())
                {
                    var post = new Image(Db)
                    {
                        Id = reader.GetInt32(0),
                        DataUrl = reader.GetString(1),
                        UserId = reader.GetInt32(2)
                    };
                    posts.Add(post);
                }
            }
            return posts;
        }

        public async Task<int> AddImage(int userId, string database64,string ext)
        {
            string dataUrl = "images/"+Guid.NewGuid()+"."+ ext;
            System.IO.File.WriteAllBytes(dataUrl, Convert.FromBase64String(database64));
            var cmd = Db.Connection.CreateCommand();
            cmd.CommandText = @"INSERT INTO Image
                                (
                                `DataUrl`,
                                `UserId`)
                                VALUES
                                (
                                @dataUrl,
                                @userId)";

            cmd.Parameters.Add(new MySqlParameter
            {
                ParameterName = "@userId",
                DbType = DbType.Int32,
                Value = userId,
            });

            cmd.Parameters.Add(new MySqlParameter
            {
                ParameterName = "@dataUrl",
                DbType = DbType.String,
                Value = dataUrl,
            });

            var ttt = await cmd.ExecuteNonQueryAsync();
            return ttt;
        }
    }
}
